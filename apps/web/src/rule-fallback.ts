// R471：AI 上游不可用时的纯规则降级候选生成（0 次 LLM 调用）。
// 生产事故（R469 P0-A）：网关 API key 额度耗尽 → 每次搜索 0 候选、主路径整站不可用。
// 本模块只做确定性关键词抽取 + 变体组合，meaning 如实标注「规则生成」，theme 固定 "rule"，
// 每个候选仍经 admitRuleCandidate 过与 LLM 候选相同的防线，再由 worker 走既有 RDAP 核验流水。
import { admitRuleCandidate, checkPinyinLabel, pinyinReadingsOf, type AiCandidate, type AiErrorKind, type GuardStats, type PinyinCheck } from "./ai";
import { VARIANT_PREFIXES, VARIANT_SUFFIXES } from "./lib/variants";
import { ZH_BRAND_CHARS, ZH_INDUSTRY, ZH_MEANING_SYNONYMS, ZH_PREFERRED_READING, ZH_TABOO_SYLLABLES } from "./rule-fallback-lexicon";

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
/** R489：语义组合（寓意双字短拼音 / 三音节 / 拼音+英文）在 24 条里的上限 */
export const RULE_FALLBACK_MAX_SEMANTIC = 12;
/** R489：中文输入已有语义组合时，泛前后缀（get/my/try/use/app/hq/labs/hub）变体的上限 */
export const RULE_FALLBACK_MAX_AFFIX = 8;

export type RuleRootKind = "pinyin" | "ascii";

export interface RuleRoot {
  /** 域名主体片段（小写 ASCII） */
  text: string;
  kind: RuleRootKind;
  /** 拼音根对应的汉字词或单字（ascii 根为空） */
  hanzi?: string;
  /** 近义寓意字的来源词（活泼 → 悦），meaning 如实标注 */
  synonymOf?: string;
}

/** 行业词表给出的短英文（tea/pet/cloud…），与描述里已有的 ascii 词区分 */
export interface RuleEnPart {
  text: string;
  kind: "en";
  /** 来源行业词 */
  hanzi: string;
}

/** 中文描述的语义抽取结果：根词之外，供组合用的行业核心字 / 寓意字 / 短英文 */
export interface ZhSemantics {
  roots: RuleRoot[];
  /** 行业核心字（茶/宠/账/云…），hanzi 为单字，来源词记在 word */
  cores: (RuleRoot & { word: string })[];
  /** 寓意字（清/雅/悦/智…），来源词记在 word */
  brands: (RuleRoot & { word: string })[];
  ens: RuleEnPart[];
}

const MAX_CORES = 3;
const MAX_BRANDS = 5;
const MAX_ENS = 3;

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
const ZH_STOP_CHARS = new Set("的了和与及或是在有为个把让给对到从等以以及通过基于关于我们你们他们这那些一个一款一些用于提供帮助可以需要想要面向做想要请用做感".split(""));
// 元词（寓意/风格/气质…）描述的是「想要什么」，不是品牌语义；R489 前「寓意」在 7/10 中文输入里被当成根词
const ZH_STOP_WORDS = new Set([
  "寓意", "意为", "象征", "代表", "感觉", "气质", "调性", "氛围", "名称", "起名", "取名", "想法", "要求", "工作室", "工作",
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

/**
 * 单字读音：只有一个读音的字直接取；多音字只在 ZH_PREFERRED_READING / ZH_BRAND_CHARS 给出首选读音、
 * 且该读音确在 R222 表内时放行（fail-closed），其余多音字与表外字放弃（长行 → 0 根词不变）
 */
export function charReading(ch: string): string | null {
  const readings = pinyinReadingsOf(ch);
  if (!readings || readings.length === 0) return null;
  const p = readings.length === 1 ? readings[0] : (ZH_PREFERRED_READING[ch] ?? ZH_BRAND_CHARS[ch]);
  if (!p || !readings.includes(p)) return null;
  return /^[a-z]+$/.test(p) ? p : null;
}

/** 词的全拼：逐字 charReading，任一字放弃则整词放弃；词表 py 覆盖同样逐字校验在表内 */
function wordReading(word: string, override?: string): string | null {
  if (override) {
    const chars = [...word];
    let rest = override;
    for (const ch of chars) {
      const readings = pinyinReadingsOf(ch);
      const hit = readings?.find((r) => rest.startsWith(r));
      if (!hit) return null;
      rest = rest.slice(hit.length);
    }
    return rest === "" ? override : null;
  }
  let text = "";
  for (const ch of word) {
    const p = charReading(ch);
    if (!p) return null;
    text += p;
  }
  return text;
}

const LEXICON_WORD_LENS = [4, 3, 2];

/** 位置 i 起的最长词表匹配（行业词 / 近义寓意词），无则返回 null */
function lexiconMatchAt(run: string, i: number): string | null {
  for (const len of LEXICON_WORD_LENS) {
    const w = run.slice(i, i + len);
    if (w.length === len && (w in ZH_INDUSTRY || w in ZH_MEANING_SYNONYMS)) return w;
  }
  return null;
}

/** 标出整词命中泛词/元词的字位（「中小商家」不得滑窗出「小商」，「寓意」不得成根词） */
function stopWordMask(run: string): boolean[] {
  const mask = new Array<boolean>(run.length).fill(false);
  for (const w of ZH_STOP_WORDS) {
    let at = run.indexOf(w);
    while (at >= 0) {
      for (let k = at; k < at + w.length; k++) mask[k] = true;
      at = run.indexOf(w, at + w.length);
    }
  }
  return mask;
}

/**
 * 中文语义抽取：每段连续汉字先做词表最长匹配（跨境电商 → 跨境 + 电商，不再切出「境电」），
 * 未命中处退回 2 字滑窗；根词全拼逐字取自 R222 表并过 checkPinyinLabel；
 * 同时收集行业核心字 / 寓意字 / 短英文供 enumerateSemanticDrafts 组合。
 */
export function analyzeZh(description: string, max = RULE_FALLBACK_MAX_ROOTS): ZhSemantics {
  const sem: ZhSemantics = { roots: [], cores: [], brands: [], ens: [] };
  const seenRoot = new Set<string>();
  const seenChar = new Set<string>();
  const seenEn = new Set<string>();
  const addRoot = (text: string, hanzi: string) => {
    if (sem.roots.length >= max || seenRoot.has(text) || !checkPinyinLabel(text).ok) return;
    seenRoot.add(text);
    sem.roots.push({ text, kind: "pinyin", hanzi });
  };
  const addChar = (list: ZhSemantics["cores"], cap: number, ch: string, word: string, synonymOf?: string) => {
    const p = charReading(ch);
    if (!p || list.length >= cap || seenChar.has(ch) || ZH_TABOO_SYLLABLES.has(p)) return;
    seenChar.add(ch);
    list.push({ text: p, kind: "pinyin", hanzi: ch, word, ...(synonymOf ? { synonymOf } : {}) });
  };
  const addWordSemantics = (word: string) => {
    const ind = ZH_INDUSTRY[word];
    if (ind) {
      if (ind.core && word.includes(ind.core)) addChar(sem.cores, MAX_CORES, ind.core, word);
      for (const e of ind.en) {
        if (sem.ens.length >= MAX_ENS || seenEn.has(e)) continue;
        seenEn.add(e);
        sem.ens.push({ text: e, kind: "en", hanzi: word });
      }
      return;
    }
    const syn = ZH_MEANING_SYNONYMS[word];
    if (syn) {
      for (const ch of syn) addChar(sem.brands, MAX_BRANDS, ch, word, word.includes(ch) ? undefined : word);
      return;
    }
    for (const ch of word) if (ch in ZH_BRAND_CHARS) addChar(sem.brands, MAX_BRANDS, ch, word);
  };

  CJK_RUN_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = CJK_RUN_RE.exec(description)) !== null) {
    const run = m[0];
    const stop = stopWordMask(run);
    for (let i = 0; i < run.length; ) {
      const lex = lexiconMatchAt(run, i);
      if (lex) {
        addWordSemantics(lex);
        if (!ZH_STOP_WORDS.has(lex) && !stop[i]) {
          const py = wordReading(lex, ZH_INDUSTRY[lex]?.py);
          if (py) addRoot(py, lex);
        }
        i += lex.length;
        continue;
      }
      const word = run.slice(i, i + 2);
      // 下一字起是词表词（慢|生活）或窗内含停用字 → 当前字单独处理：是寓意字则只作寓意字，不成根词
      const single = word.length < 2 || stop[i] || stop[i + 1] || ZH_STOP_CHARS.has(word[0]) || ZH_STOP_CHARS.has(word[1]) || lexiconMatchAt(run, i + 1) !== null;
      const py = single ? null : wordReading(word);
      if (!py) {
        if (!stop[i] && !ZH_STOP_CHARS.has(word[0]) && word[0] in ZH_BRAND_CHARS) addChar(sem.brands, MAX_BRANDS, word[0], word[0]);
        i++;
        continue;
      }
      addRoot(py, word);
      addWordSemantics(word);
      i += 2; // 命中即跳过下一字，避免「茶叶」「叶电」重叠成词
    }
  }
  // 行业核心字同时也是寓意字时（云端 → 云）只保留核心字身份，避免 yun+yun 自组合
  sem.brands = sem.brands.filter((b) => !sem.cores.some((c) => c.hanzi === b.hanzi));
  return sem;
}

/** 中文根词（R471 公开接口不变）：词表最长匹配 + 2 字滑窗，逐字读音取自 R222 表 */
export function extractPinyinRoots(description: string, max = RULE_FALLBACK_MAX_ROOTS): RuleRoot[] {
  return analyzeZh(description, max).roots;
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

type RulePart = RuleRoot | RuleEnPart | { text: string; kind: "prefix" | "suffix" };

interface RuleDraft {
  label: string;
  parts: RulePart[];
  /** 纯拼音组合的切分校验结果（歧义/语感风险计入 readability） */
  py?: PinyinCheck & { ok: true };
}

/** 两词拼接优先级的长度阈值：≤ 此长度的拼接排在前后缀之前，更长的排在最后 */
const SHORT_JOIN_MAX = 12;

/** 可读性排序分：短、双音节优先；切分歧义与 R142 语感风险扣分 */
function draftRank(d: RuleDraft): number {
  const syllables = d.parts.filter((p) => p.kind === "pinyin").reduce((n, p) => n + ((p as RuleRoot).hanzi?.length ?? 1), 0);
  let s = 100 - Math.max(0, d.label.length - 6) * 6;
  if (syllables === 2 && d.parts.every((p) => p.kind === "pinyin")) s += 10;
  if (syllables >= 3) s -= 10;
  if (d.py?.ambiguous) s -= 15;
  s -= d.py?.risk ?? 0;
  return s;
}

/**
 * R489 语义组合：行业核心字 × 寓意字 双字短拼音（chaya / yacha）、核心字 × 核心字、寓意字 × 寓意字（不同来源词）、
 * 寓意字/核心字 + 双字词根 三音节（qingchaye）、拼音字 + 行业短英文 / 描述 ascii 词 混合（qingtea / yunmockup）。
 * 纯拼音组合过 checkPinyinLabel，音节不含禁忌音；按 draftRank 排序后截到 max。
 */
export function enumerateSemanticDrafts(sem: ZhSemantics, asciiRoots: RuleRoot[], max = RULE_FALLBACK_MAX_SEMANTIC): RuleDraft[] {
  const out: RuleDraft[] = [];
  const seen = new Set<string>();
  const add = (parts: RulePart[]) => {
    const label = parts.map((p) => p.text).join("");
    if (label.length > 20 || seen.has(label)) return;
    if (parts.every((p) => p.kind === "pinyin")) {
      const check = checkPinyinLabel(label);
      if (!check.ok) return;
      seen.add(label);
      out.push({ label, parts, py: check });
      return;
    }
    seen.add(label);
    out.push({ label, parts });
  };
  const chars = [...sem.cores, ...sem.brands];
  for (const c of sem.cores) {
    for (const b of sem.brands) {
      add([c, b]);
      add([b, c]);
    }
  }
  for (let i = 0; i < sem.cores.length; i++) {
    for (let j = i + 1; j < sem.cores.length; j++) {
      add([sem.cores[i], sem.cores[j]]);
      add([sem.cores[j], sem.cores[i]]);
    }
  }
  const pairs = out.length;
  for (let i = 0; i < sem.brands.length; i++) {
    for (let j = i + 1; j < sem.brands.length; j++) {
      if (sem.brands[i].word === sem.brands[j].word) continue;
      add([sem.brands[i], sem.brands[j]]);
      add([sem.brands[j], sem.brands[i]]);
    }
  }
  // 寓意字 × 寓意字不含行业语义，且易撞无关同音词（xinwen/yingwen），排在行业字组合与混合之后
  const brandOnly = new Set(out.slice(pairs).map((d) => d.label));
  for (const ch of chars) for (const r of sem.roots) if (r.hanzi !== ch.word && !r.hanzi?.includes(ch.hanzi ?? "")) add([ch, r]);
  for (const e of sem.ens) {
    for (const ch of chars) {
      add([ch, e]);
      add([e, ch]);
    }
  }
  for (const a of asciiRoots) {
    for (const ch of chars) {
      add([ch, a]);
      add([a, ch]);
    }
  }
  return out
    .map((d, i) => ({ d, i, rank: draftRank(d) - (brandOnly.has(d.label) ? 6 : 0) }))
    .sort((x, y) => y.rank - x.rank || x.i - y.i)
    .slice(0, max)
    .map((x) => x.d);
}

/**
 * 变体枚举顺序：根词本身 → 语义组合（R489）→ 短两词拼接（含拼音+英文）→ 后缀/前缀交替（有语义组合时限额）→ 长两词拼接；
 * 去重、长度 ≤ 20。roots 之外的语义组合由 semantic 传入（en 输入 / 无词表命中时为空，行为与 R471 一致）
 */
export function enumerateRuleDrafts(roots: RuleRoot[], max = RULE_FALLBACK_MAX_LABELS, semantic: RuleDraft[] = []): RuleDraft[] {
  const drafts: RuleDraft[] = [];
  const seen = new Set<string>();
  const push = (d: RuleDraft) => {
    if (drafts.length >= max || d.label.length > 20 || seen.has(d.label)) return false;
    seen.add(d.label);
    drafts.push(d);
    return true;
  };
  const joins: RuleDraft[] = [];
  for (const a of roots) for (const b of roots) if (a !== b) joins.push({ label: a.text + b.text, parts: [a, b] });
  for (const r of roots) push({ label: r.text, parts: [r] });
  for (const d of semantic) push(d);
  // 有语义组合时，两个双字词全拼直接拼接（≥ 4 音节）可读性最差，退到最后补位；拼音+ascii 拼接仍在前
  const tailJoin = (j: RuleDraft) => semantic.length > 0 && j.parts.every((p) => p.kind === "pinyin");
  for (const j of joins) if (j.label.length <= SHORT_JOIN_MAX && !tailJoin(j)) push(j);
  const affixes: RuleDraft[] = [];
  if (semantic.length > 0) {
    // 后缀/前缀按位交替（app → get → hq → my …），限额内仍各有代表
    for (let k = 0; k < Math.max(VARIANT_SUFFIXES.length, VARIANT_PREFIXES.length); k++) {
      const s = VARIANT_SUFFIXES[k];
      const p = VARIANT_PREFIXES[k];
      if (s) for (const r of roots) affixes.push({ label: r.text + s, parts: [r, { text: s, kind: "suffix" }] });
      if (p) for (const r of roots) affixes.push({ label: p + r.text, parts: [{ text: p, kind: "prefix" }, r] });
    }
  } else {
    for (const s of VARIANT_SUFFIXES) for (const r of roots) affixes.push({ label: r.text + s, parts: [r, { text: s, kind: "suffix" }] });
    for (const p of VARIANT_PREFIXES) for (const r of roots) affixes.push({ label: p + r.text, parts: [{ text: p, kind: "prefix" }, r] });
  }
  let affixCount = 0;
  for (const a of affixes) {
    if (semantic.length > 0 && affixCount >= RULE_FALLBACK_MAX_AFFIX) break;
    if (push(a)) affixCount++;
  }
  for (const j of joins) push(j);
  return drafts;
}

function describePart(p: RulePart, lang: "zh" | "en"): string {
  // en meaning 不能含汉字（EN_MEANING_ALLOWED_RE）也不用括号（cleanMeaning 会剪掉括号注释）
  if (lang === "en") {
    if (p.kind === "pinyin") return `pinyin "${p.text}"`;
    if (p.kind === "ascii" || p.kind === "en") return `"${p.text}"`;
    return `common ${p.kind} "${p.text}"`;
  }
  if (p.kind === "pinyin") {
    const r = p as RuleRoot;
    return r.synonymOf ? `寓意「${r.synonymOf}」的近义字「${r.hanzi}」拼音 ${r.text}` : `「${r.hanzi}」拼音 ${r.text}`;
  }
  if (p.kind === "ascii" || p.kind === "en") return `英文 ${p.text}`;
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

/** 确定性启发式评分（只反映长度/构成/拼读，不评估寓意）；寓意双字组合 > 拼音+英文 > 根词 > 拼接 > 泛前后缀 */
export function ruleScores(d: RuleDraft): AiCandidate["scores"] {
  const len = d.label.length;
  const length = Math.max(40, 100 - Math.max(0, len - 6) * 6);
  const hasPinyin = d.parts.some((p) => p.kind === "pinyin");
  const penalty = (d.py?.ambiguous ? 15 : 0) + (d.py?.risk ?? 0);
  const readability = Math.max(40, (hasPinyin ? 65 : 72) - (d.parts.length - 1) * 8 - penalty);
  const hasAffix = d.parts.some((p) => p.kind === "prefix" || p.kind === "suffix");
  const chars = d.parts.filter((p) => p.kind === "pinyin" && (p as RuleRoot).hanzi?.length === 1).length;
  const hasEn = d.parts.some((p) => p.kind === "en");
  const relevance = d.parts.length === 1 ? 70 : hasAffix ? 55 : chars > 0 ? 65 : 62;
  const brandability = d.parts.length === 1 ? 60 : hasAffix ? 45 : chars > 0 && !hasEn && d.parts.every((p) => p.kind === "pinyin") ? 70 : chars > 0 ? 62 : 55;
  return { length, readability, relevance, brandability };
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
  const sem = analyzeZh(description);
  let roots = extractRuleRoots(description);
  // 单字 / 极短中文输入（云、星）抽不出整词根词时，退化为行业核心字 / 寓意字作根词，避免降级 0 候选
  if (roots.length === 0) roots = [...sem.cores, ...sem.brands].slice(0, RULE_FALLBACK_MAX_ROOTS).map(({ text, kind, hanzi }) => ({ text, kind, hanzi }));
  const semantic = enumerateSemanticDrafts(sem, roots.filter((r) => r.kind === "ascii"));
  const seen = new Set<string>(exclude);
  const out: AiCandidate[] = [];
  for (const d of enumerateRuleDrafts(roots, max * 3, semantic)) {
    if (out.length >= max) break;
    const cand = admitRuleCandidate({ label: d.label, meaning: ruleMeaning(d, lang), scores: ruleScores(d) }, lang, guard, seen);
    if (cand) out.push(cand);
  }
  return out;
}
