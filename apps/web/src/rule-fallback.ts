// R471：AI 上游不可用时的纯规则降级候选生成（0 次 LLM 调用）。
// 生产事故（R469 P0-A）：网关 API key 额度耗尽 → 每次搜索 0 候选、主路径整站不可用。
// 本模块只做确定性关键词抽取 + 变体组合，meaning 如实标注「规则生成」，theme 固定 "rule"，
// 每个候选仍经 admitRuleCandidate 过与 LLM 候选相同的防线，再由 worker 走既有 RDAP 核验流水。
import { admitRuleCandidate, checkPinyinLabel, pinyinReadingsOf, type AiCandidate, type AiErrorKind, type GuardStats } from "./ai";
import { VARIANT_PREFIXES, VARIANT_SUFFIXES } from "./lib/variants";

// LLM 额度耗尽熔断——quota 类错误后 5 分钟内所有 /api/ai-search 直接走规则降级，不再打上游
// （事故形态：网关 key 额度耗尽时每个用户各撞一次上游；rate-limit 是瞬时的，不熔断）。
// 常量放这里而非 worker.ts：workerd 只允许 worker 入口导出 handler。
export const LLM_BREAKER_KEY = "dh:llm-breaker:v1";
export const LLM_BREAKER_TTL_S = 300;
/** 降级原因：首轮 LLM 错误类别，或熔断期内直接降级（quota-breaker，未打上游） */
export type FallbackReason = AiErrorKind | "quota-breaker";

/** 每次降级最多产出的 label 数（每个 label × tlds 个域名）；对齐 suggest_variants 默认 24 / 上限 48 与 AI 正常轮 24 */
export const RULE_FALLBACK_MAX_LABELS = 24;
/** 参与组合的根词上限（拼音词 + 英文词合计），控制组合爆炸 */
export const RULE_FALLBACK_MAX_ROOTS = 4;

export type RuleRootKind = "pinyin" | "ascii";

export interface RuleRoot {
  /** 域名主体片段（小写 ASCII） */
  text: string;
  kind: RuleRootKind;
  /** 拼音根对应的汉字词（ascii 根为空） */
  hanzi?: string;
}

// 英文停用词/功能词 + 描述里常见的「产品类型」泛词（不适合做域名词根）
const EN_STOPWORDS = new Set([
  "a", "an", "the", "and", "or", "of", "for", "to", "in", "on", "at", "by", "with", "from", "as", "is", "are", "be", "was", "were",
  "it", "its", "this", "that", "these", "those", "my", "our", "your", "their", "we", "you", "they", "i", "me", "us", "them",
  "want", "need", "like", "make", "build", "create", "help", "helps", "get", "use", "using", "based", "about", "into", "than",
  "app", "site", "website", "tool", "tools", "platform", "service", "services", "product", "company", "startup", "brand", "name",
  "names", "domain", "domains", "online", "web", "digital", "new", "small", "medium", "large", "business", "businesses",
  "users", "user", "people", "customer", "customers", "team", "project", "idea", "simple", "easy", "fast", "best", "good",
  "can", "will", "should", "would", "could", "do", "does", "not", "no", "yes", "all", "any", "some", "more", "most", "very",
  "com", "cn", "net", "org", "io", "ai",
]);

// 中文虚词/泛词：整词命中或两字全为虚字的滑窗词不作为根词
const ZH_STOP_CHARS = new Set("的了和与及或是在有为个把让给对到从等以以及通过基于关于我们你们他们这那些一个一款一些用于提供帮助可以需要想要面向做想要请用做".split(""));
const ZH_STOP_WORDS = new Set([
  "平台", "工具", "服务", "系统", "应用", "网站", "产品", "公司", "品牌", "域名", "名字", "项目", "团队", "用户", "客户", "商家", "企业",
  "面向", "提供", "帮助", "可以", "需要", "想要", "希望", "一个", "一款", "一些", "我们", "你们", "他们", "这个", "那个", "用于", "基于",
  "主打", "专注", "致力", "打造", "支持", "实现", "解决", "主要", "数字", "移动", "上线", "注册", "后缀", "风格", "偏好", "长度", "命名",
  "通过", "关于", "以及", "或者", "还是", "但是", "因为", "所以", "如果", "就是", "不是", "没有", "非常", "比较", "简单", "方便",
  "在线", "互联", "网络", "数据", "智能", "科技", "技术", "中小", "小型", "大型", "个人", "全球", "国内", "国际", "行业", "领域",
]);

const ASCII_WORD_RE = /[a-z][a-z0-9]*/gi;
const CJK_RUN_RE = /[\u4e00-\u9fff]+/g;

/** 英文/ASCII 根词：去停用词与泛词，3–12 字符，保留出现顺序 */
export function extractAsciiRoots(description: string, max = RULE_FALLBACK_MAX_ROOTS): RuleRoot[] {
  const out: RuleRoot[] = [];
  const seen = new Set<string>();
  ASCII_WORD_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = ASCII_WORD_RE.exec(description)) !== null && out.length < max) {
    const w = m[0].toLowerCase();
    if (w.length < 3 || w.length > 12 || EN_STOPWORDS.has(w) || seen.has(w)) continue;
    seen.add(w);
    out.push({ text: w, kind: "ascii" });
  }
  return out;
}

/** 单字唯一读音（多音字/表外字返回 null，按任务要求放弃） */
function singleReading(ch: string): string | null {
  const readings = pinyinReadingsOf(ch);
  if (!readings || readings.length !== 1) return null;
  const p = readings[0];
  return /^[a-z]+$/.test(p) ? p : null;
}

/** 中文根词：每段连续汉字按 2 字滑窗取词，逐字查唯一读音拼成全拼；虚词/泛词/多音/表外字放弃 */
export function extractPinyinRoots(description: string, max = RULE_FALLBACK_MAX_ROOTS): RuleRoot[] {
  const out: RuleRoot[] = [];
  const seen = new Set<string>();
  CJK_RUN_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = CJK_RUN_RE.exec(description)) !== null && out.length < max) {
    // 先整词剪掉泛词，避免「中小商家」滑窗出「小商」这类跨词碎片
    let run = m[0];
    for (const w of ZH_STOP_WORDS) run = run.split(w).join(" ");
    for (let i = 0; i + 2 <= run.length && out.length < max; i++) {
      const word = run.slice(i, i + 2);
      if (!/^[\u4e00-\u9fff]{2}$/.test(word) || ZH_STOP_CHARS.has(word[0]) || ZH_STOP_CHARS.has(word[1])) continue;
      const a = singleReading(word[0]);
      const b = singleReading(word[1]);
      if (!a || !b) continue;
      const text = a + b;
      if (seen.has(text) || !checkPinyinLabel(text).ok) continue;
      seen.add(text);
      out.push({ text, kind: "pinyin", hanzi: word });
      i++; // 命中即跳过下一字，避免「茶叶」「叶电」重叠成词
    }
  }
  return out;
}

/** 根词合集：拼音词优先（中文描述的主语义），再补描述中已有的 ASCII 词，合计不超过上限 */
export function extractRuleRoots(description: string, max = RULE_FALLBACK_MAX_ROOTS): RuleRoot[] {
  const pinyin = extractPinyinRoots(description, max);
  const ascii = extractAsciiRoots(description, max);
  const out: RuleRoot[] = [];
  const seen = new Set<string>();
  // 交错取用：拼音 / ASCII 各留席位，避免一侧独占
  for (let i = 0; out.length < max && (i < pinyin.length || i < ascii.length); i++) {
    for (const r of [pinyin[i], ascii[i]]) {
      if (r && !seen.has(r.text) && out.length < max) {
        seen.add(r.text);
        out.push(r);
      }
    }
  }
  return out;
}

interface RuleDraft {
  label: string;
  parts: (RuleRoot | { text: string; kind: "prefix" | "suffix" })[];
}

/** 两词拼接优先级的长度阈值：≤ 此长度的拼接排在前后缀之前，更长的排在最后 */
const SHORT_JOIN_MAX = 12;

/** 变体枚举顺序：根词本身 → 短两词拼接（含拼音+英文混搭）→ 后缀 → 前缀 → 长两词拼接；去重、长度 ≤ 20 */
export function enumerateRuleDrafts(roots: RuleRoot[], max = RULE_FALLBACK_MAX_LABELS): RuleDraft[] {
  const drafts: RuleDraft[] = [];
  const seen = new Set<string>();
  const push = (d: RuleDraft) => {
    if (drafts.length >= max || d.label.length > 20 || seen.has(d.label)) return;
    seen.add(d.label);
    drafts.push(d);
  };
  const joins: RuleDraft[] = [];
  for (const a of roots) for (const b of roots) if (a !== b) joins.push({ label: a.text + b.text, parts: [a, b] });
  for (const r of roots) push({ label: r.text, parts: [r] });
  for (const j of joins) if (j.label.length <= SHORT_JOIN_MAX) push(j);
  for (const s of VARIANT_SUFFIXES) for (const r of roots) push({ label: r.text + s, parts: [r, { text: s, kind: "suffix" }] });
  for (const p of VARIANT_PREFIXES) for (const r of roots) push({ label: p + r.text, parts: [{ text: p, kind: "prefix" }, r] });
  for (const j of joins) push(j);
  return drafts;
}

function describePart(p: RuleDraft["parts"][number], lang: "zh" | "en"): string {
  // en meaning 不能含汉字（EN_MEANING_ALLOWED_RE）也不用括号（cleanMeaning 会剪掉括号注释）
  if (lang === "en") {
    if (p.kind === "pinyin") return `pinyin "${p.text}"`;
    if (p.kind === "ascii") return `"${p.text}"`;
    return `common ${p.kind} "${p.text}"`;
  }
  if (p.kind === "pinyin") return `「${(p as RuleRoot).hanzi}」拼音 ${p.text}`;
  if (p.kind === "ascii") return `英文 ${p.text}`;
  return `${p.kind === "prefix" ? "前缀" : "后缀"} ${p.text}`;
}

// meaning 模板已对照既有防线校验：zh 中出现的 ASCII 词全部是 label 子串（zhCitesPhantomAscii 放行），
// 不含「取自/源自/与…结合」句式（citesPhantomWord 不触发）与路线元词（containsMetaLanguage 不触发）；
// en 用引号包裹片段 + "from" 谓语满足 enMeaningIncoherent 的词源/谓语锤点
export function ruleMeaning(d: RuleDraft, lang: "zh" | "en"): string {
  const parts = d.parts.map((p) => describePart(p, lang));
  if (lang === "en") {
    return d.parts.length === 1
      ? `Rule-based: taken directly from ${parts[0]} in your description; not an AI-written meaning.`
      : `Rule-based: formed from ${parts.join(" + ")}; not an AI-written meaning.`;
  }
  return d.parts.length === 1 ? `规则生成：直接取描述中的${parts[0]}，非 AI 寓意` : `规则生成：由 ${parts.join(" + ")} 组成，非 AI 寓意`;
}

/** 确定性启发式评分（只反映长度/构成，不评估寓意） */
export function ruleScores(d: RuleDraft): AiCandidate["scores"] {
  const len = d.label.length;
  const length = Math.max(40, 100 - Math.max(0, len - 6) * 6);
  const hasPinyin = d.parts.some((p) => p.kind === "pinyin");
  const readability = Math.max(40, (hasPinyin ? 65 : 72) - (d.parts.length - 1) * 8);
  const relevance = d.parts.length === 1 ? 70 : d.parts.every((p) => p.kind === "pinyin" || p.kind === "ascii") ? 62 : 55;
  return { length, readability, relevance, brandability: 50 };
}

/**
 * 规则降级候选：抽词 → 枚举变体 → 逐个过既有防线（admitRuleCandidate，theme=rule）。
 * exclude：跨轮已尝试的 label（worker 的 tried 集合），不重复产出
 */
export function generateRuleCandidates(
  description: string,
  lang: "zh" | "en",
  guard: GuardStats,
  exclude: ReadonlySet<string> = new Set(),
  max = RULE_FALLBACK_MAX_LABELS,
): AiCandidate[] {
  const roots = extractRuleRoots(description);
  const seen = new Set<string>(exclude);
  const out: AiCandidate[] = [];
  for (const d of enumerateRuleDrafts(roots, max * 3)) {
    if (out.length >= max) break;
    const cand = admitRuleCandidate({ label: d.label, meaning: ruleMeaning(d, lang), scores: ruleScores(d) }, lang, guard, seen);
    if (cand) out.push(cand);
  }
  return out;
}
