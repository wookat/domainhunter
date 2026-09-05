// R501 研究原型（0 AI 调用，不改生产路径）：zh coined/blend/pinyin 寓意「短句沙拉」的来源可核性分析
// 用法：node scripts/proto-r501.mjs [--items]   （--items 逐条打印 260 条特征表）
//
// 做四件事，全部只读 scripts/fixtures/zh-meaning-labels.json（标注只在 scripts/build-zh-meaning-labels.mjs 维护）：
//  §1 逐条特征表：从自由文本 meaning 解析「声称的音节来源」（「」内汉字 / 独立 ASCII 片段 / 外语派生词 / 整词来源），
//     判断每个来源能否核到 label 子串、来源拼合能否覆盖 label、是否有品牌联想句、联想句与 description 领域字重叠、
//     是否为「无来源纯联想」；给出 salad / borderline / coherent 三类分布。
//  §2 方案 A（来源可核性硬规则）若干变体 + 现有 guard 链 + R496 基线，对 salad(11)/coherent(241) 算 TP/FP/FN、精确率/召回率/误杀率，
//     borderline(8) 单列命中数不进分母。
//  §3 方案 C 校验器 verifyStructured({label, sources:[{frag,from}], gist})：对 19 条 salad/borderline 手写「诚实的结构化输出」
//     （即模型如实交代来源时应输出的结构）跑校验，区分「结构层能拦」与「只能靠语义二审（方案 B）」的两类沙拉。
//  §4 方案 B（LLM 二审）离线估算：构造 prompt、按 DeepSeek 官方换算比估 token 与成本、用 docs/audits/r494 的 _ms 时间戳算时延基线。
// 拼音表 / R496 / R497 / R246 函数从 apps/web/src/ai.ts 临时打包导入（与 scripts/verify-r496.mjs 同法），不改其源码。
import { readFileSync, readdirSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const webRequire = createRequire(path.join(root, "apps/web/package.json"));
const viteRequire = createRequire(webRequire.resolve("vite/package.json"));
const { build } = viteRequire("esbuild");
const tmp = path.join(root, "scripts/.ai-r501-compiled.mjs");
await build({ entryPoints: [path.join(root, "apps/web/src/ai.ts")], bundle: true, format: "esm", outfile: tmp, logLevel: "silent" });
const ai = await import(tmp);
rmSync(tmp);
const { pinyinReadingsOf, zhMeaningIncoherent, zhCitesPhantomAscii, citesPhantomWord, pinyinQuoteMismatch, containsMetaLanguage } = ai;

const PRINT_ITEMS = process.argv.includes("--items");
const { items } = JSON.parse(readFileSync(path.join(root, "scripts/fixtures/zh-meaning-labels.json"), "utf8"));

// ---------------------------------------------------------------------------
// §0 词表（与 ai.ts 的 ZH_ASCII_SHORT_ALLOWED / ZH_ASCII_ALLOWED_WORDS 同思路，独立维护以免耦合生产常量）
// ---------------------------------------------------------------------------
const CJK_RE = /[\u3400-\u4dbf\u4e00-\u9fff]/g;
const CJK_ONE_RE = /[\u3400-\u4dbf\u4e00-\u9fff]/;
const CLAUSE_SPLIT_RE = /[，。；！？：、,;!?:\n]/;
const QUOTED_RE = /[「『"]([\u3400-\u4dbf\u4e00-\u9fff]{1,6})[」』"]/g;
// 未加引号的汉字来源声明：「宝字音」「毛的拼音」「云字首」（排除数量词「二字首字母」）
const UNQUOTED_SRC_RE = /(?<![一二两三双])([\u3400-\u4dbf\u4e00-\u9fff]{1,3})\s*(?:字音|的拼音|的声母|字首(?!字母))/g;
// 独立 ASCII 片段（不紧邻变音字母，避免 xīng 被拆）；单字母只在被点名为后缀/字首时算（chewy「y 是形容词后缀」）
const ASCII_TOKEN_RE = /(?<![a-z\u00c0-\u024f])[a-z]{2,}(?![a-z\u00c0-\u024f])/gi;
const SINGLE_LETTER_SRC_RE = /(?<![a-z\u00c0-\u024f])([a-z])(?![a-z\u00c0-\u024f])\s*(?:是|为|作)?[^，。；]{0,6}?(?:后缀|尾音|收尾|词尾|字首|首字母)/gi;
const LANG_LEAD_RE = /(?:源自|取自|来自|拉丁语?|希腊语?|英语|英文|法语|法文|西班牙语|德语|意大利语|日语|梵语|葡萄牙语|夏威夷语|毛利语)\s*["「『']?\s*$/;
const FUNCTION_WORDS = new Set([
  "ai", "ar", "vr", "xr", "ui", "ux", "pc", "tv", "hr", "it", "io", "ip", "id", "os", "pr", "qa", "ad", "db", "ml", "nb", "ok", "vs",
  "of", "or", "in", "to", "is", "an", "at", "by", "on", "up", "us", "we", "no", "do", "be", "me", "my", "so", "if", "as", "he", "hi", "am", "re", "de", "la", "le", "el", "du", "da", "di", "co",
]);
const TOPICAL_WORDS = new Set([
  "com", "net", "org", "app", "dev", "top", "xyz", "site", "online", "store", "shop", "club", "vip", "fun", "art", "live", "life", "link", "one", "run", "work", "world", "zone", "group", "team", "ltd", "wiki", "info", "biz", "pro", "tech", "cloud",
  "web", "data", "saas", "api", "seo", "logo", "brand", "startup", "studio", "lab", "labs", "hub", "home", "smart", "max", "mini", "plus", "digital", "mobile", "global", "media", "design", "style", "code", "box", "base", "core", "flow", "pay", "game", "play", "book", "note", "blog", "mail", "chat", "news", "mall", "star", "sun", "sky", "sea", "eco", "bio", "tea", "cafe", "farm", "city", "land", "space", "pet", "pets", "cat", "dog",
]);
// 品牌联想句标记 / 纯读音评语标记
const ASSOC_MARK_RE = /寓意|象征|暗示|意味|传达|点出|呼应|直指|意指|代表|适合|联想|意象|之意|寓|气质|画面|感/;
const PHONETIC_RE = /读|音节|音韵|念|上口|好记|易记|顺口|节奏|识别|简洁|拼写|字母|声调|发音|口吻|干脆|利落|短促|叠韵|押韵|响亮|洪亮|清脆|轻快|好念|记忆|音感|音色|语感|韵/;
// description 领域字重叠用的停用字（与 scripts/research/zh-meaning-features.mjs 同源，略扩）
const STOP = new Set("的了是与和及或在有为把被让给要能一个这那不也就都很好读记名字寓意中文创业者能一眼看懂希望短品牌感面向主打".split(""));

// ---------------------------------------------------------------------------
// §1 特征抽取
// ---------------------------------------------------------------------------
function readingVariants(p) {
  return p.includes("v") ? [p, p.replace("v", "ue"), p.replace("v", "u")] : [p];
}
/** 单字可贡献给 label 的形态：全拼各读音（含 ü 变体）；lax 再加首字母/首声母（zh/ch/sh） */
function charPieces(ch, lax) {
  const readings = pinyinReadingsOf(ch);
  if (!readings) return { known: false, pieces: [] };
  const out = new Set();
  for (const r of readings) {
    for (const v of readingVariants(r)) out.add(v);
    if (lax) {
      out.add(r[0]);
      if (r.length >= 2 && r[1] === "h" && "zcs".includes(r[0])) out.add(r.slice(0, 2));
    }
  }
  return { known: true, pieces: [...out] };
}
/** 引用词逐字全拼的全部拼接读法 */
function quotedWordFullPinyin(word) {
  let combos = [""];
  for (const ch of word) {
    const { known, pieces } = charPieces(ch, false);
    if (!known) return [];
    const next = [];
    for (const c of combos) for (const p of pieces) if (next.length < 400) next.push(c + p);
    combos = next;
  }
  return combos;
}
/** 引用词（1–6 字）逐字拼接的任一读法是否为 label 子串（strict：只全拼；lax：可取首字母） */
function quotedWordVerifiable(word, label, lax) {
  let combos = [""];
  for (const ch of word) {
    const { known, pieces } = charPieces(ch, lax);
    if (!known) return { known: false, ok: false };
    const next = [];
    for (const c of combos) for (const p of pieces) if (next.length < 400) next.push(c + p);
    combos = next;
  }
  return { known: true, ok: combos.some((c) => c.length > 0 && label.includes(c)) };
}
/** 用给定片段集合能否从 0 走到 label 末尾（同 R497 singleQuotesCoverLabel 的可达性判法） */
// 相邻片段允许共享 1 个字母（woof+fan→woofan / fisc+core→fiscore），允许 1 个单字母连接音（chew+a+boo）
function reachCovers(label, pieces) {
  const reach = [new Array(label.length + 1).fill(false), new Array(label.length + 1).fill(false)]; // [未用连接音, 已用]
  reach[0][0] = true;
  let maxReach = 0;
  for (let i = 0; i < label.length; i++) {
    for (const used of [0, 1]) {
      if (!reach[used][i]) continue;
      maxReach = Math.max(maxReach, i);
      for (const p of pieces) {
        if (!p) continue;
        if (label.startsWith(p, i)) reach[used][i + p.length] = true;
        if (i > 0 && p.length >= 2 && label.startsWith(p, i - 1)) reach[used][i - 1 + p.length] = true;
      }
      if (used === 0 && i > 0) reach[1][i + 1] = true;
    }
  }
  const covers = reach[0][label.length] || reach[1][label.length];
  if (covers) maxReach = label.length;
  return { covers, reachRatio: +(maxReach / label.length).toFixed(2) };
}
/** 片段出现位置的并集占 label 的比例（允许跳跃，衡量「来源解释了多少字母」） */
function unionCoverage(label, pieces) {
  const hit = new Array(label.length).fill(false);
  for (const p of pieces) {
    if (!p) continue;
    let from = 0;
    for (;;) {
      const i = label.indexOf(p, from);
      if (i < 0) break;
      for (let k = i; k < i + p.length; k++) hit[k] = true;
      from = i + 1;
    }
  }
  return +(hit.filter(Boolean).length / label.length).toFixed(2);
}
/** 外语派生：token 非 label 子串，但 token 的首/尾 ≥3 字母段是 label 子串（perfect→fect / utopia→topia / curious→curio） */
function derivedFrag(token, label) {
  let best = "";
  for (let n = token.length - 1; n >= 3; n--) {
    const pre = token.slice(0, n);
    const suf = token.slice(token.length - n);
    if (label.includes(pre) && pre.length > best.length) best = pre;
    if (label.includes(suf) && suf.length > best.length) best = suf;
    if (best) break;
  }
  return best;
}

export function analyze(it) {
  const label = it.label.toLowerCase();
  const m = it.meaning;
  const sources = []; // {kind, claim, frag, verifiable}
  // 「中文名」label 形态（「财务枢纽」caiwuhub / 「零食伙伴」treatpal）：引号内是品牌中文名/译名而非音节来源，不计入待核来源
  const quotedAll = [...m.matchAll(QUOTED_RE)];
  const zhNames = [];
  const glosses = [];
  const quoted = [];
  for (const x of quotedAll) {
    const after = m.slice(x.index + x[0].length).replace(/^[\s，,]*/, "").toLowerCase();
    const before = m.slice(Math.max(0, x.index - 6), x.index);
    if (after.startsWith(label)) zhNames.push(x[1]);
    // 释义引号（bon 是法语的「好」/ toki 取日语里「此刻」的读音）：翻译而非音节来源，不计
    else if (/(?:的|里|意为|意思是|即|指|代表|英文|法语|日语|拉丁语?)\s*$/.test(before)) glosses.push(x[1]);
    else quoted.push(x[1]);
  }
  // 贪婪捕获会带上前面的虚词（「取知的声母」→「取知」），取「最长可核的后缀」，都不可核则取末字
  const unquoted = [...m.matchAll(UNQUOTED_SRC_RE)]
    .map((x) => {
      const cap = x[1].replace(/^[是为取即与和加的用了]+/, "");
      for (let k = cap.length; k >= 1; k--) if (quotedWordVerifiable(cap.slice(-k), label, true).ok) return cap.slice(-k);
      return cap.slice(-1);
    })
    .filter((w) => w && !quoted.includes(w) && !zhNames.includes(w));
  // 未加引号但整词全拼恰等于 label 的中文词（yunji「云集之意」）：隐式整名来源
  let implicitName = "";
  if (quoted.length === 0 && zhNames.length === 0) {
    const runs = m.match(/[\u3400-\u4dbf\u4e00-\u9fff]{2,4}/g) ?? [];
    outer: for (const run of runs) {
      for (let i = 0; i < run.length; i++) {
        for (let n = 2; n <= 4 && i + n <= run.length; n++) {
          const w = run.slice(i, i + n);
          if (quotedWordFullPinyin(w).includes(label)) { implicitName = w; break outer; }
        }
      }
    }
  }
  let unknownChar = 0;
  const piecesStrict = new Set();
  const piecesLax = new Set();
  for (const w of [...quoted, ...unquoted, ...(implicitName ? [implicitName] : [])]) {
    const strict = quotedWordVerifiable(w, label, false);
    const lax = quotedWordVerifiable(w, label, true);
    if (!strict.known) unknownChar++;
    sources.push({ kind: "cjk", claim: w, verifiable: lax.ok, strictVerifiable: strict.ok });
    for (const ch of w) {
      for (const p of charPieces(ch, false).pieces) piecesStrict.add(p);
      for (const p of charPieces(ch, true).pieces) piecesLax.add(p);
    }
  }
  // 「中文名」label：整词全拼含 label（pinyin 路线）或前 k 字全拼是 label 前缀（blend 路线「财务枢纽」caiwuhub）→ 可核来源；
  // 否则视为纯译名（「零食伙伴」treatpal），不计来源也不计不可核
  for (const w of zhNames) {
    let ok = false;
    for (let k = w.length; k >= 1 && !ok; k--) {
      const combos = quotedWordFullPinyin(w.slice(0, k));
      ok = combos.some((c) => (k === w.length ? c.includes(label) || label.startsWith(c) : label.startsWith(c)));
    }
    if (!ok) ok = quotedWordVerifiable(w, label, true).ok; // 声母缩写（「掌上派」zsp）
    if (ok) {
      sources.push({ kind: "zhname", claim: w, verifiable: true, strictVerifiable: true });
      for (const ch of w) {
        for (const p of charPieces(ch, false).pieces) piecesStrict.add(p);
        for (const p of charPieces(ch, true).pieces) piecesLax.add(p);
      }
    }
  }
  SINGLE_LETTER_SRC_RE.lastIndex = 0;
  let sl;
  while ((sl = SINGLE_LETTER_SRC_RE.exec(m)) !== null) {
    const w = sl[1].toLowerCase();
    if (label.includes(w)) { sources.push({ kind: "ascii", claim: w, frag: w, verifiable: true, strictVerifiable: true }); piecesStrict.add(w); piecesLax.add(w); }
  }
  let selfMention = 0;
  let wholeWordSource = false;
  let phantomAscii = 0;
  let topical = 0;
  ASCII_TOKEN_RE.lastIndex = 0;
  let mm;
  while ((mm = ASCII_TOKEN_RE.exec(m)) !== null) {
    const w = mm[0].toLowerCase();
    const before = m.slice(Math.max(0, mm.index - 8), mm.index);
    if (w === label) {
      selfMention++;
      if (LANG_LEAD_RE.test(before) || it.theme === "word") {
        wholeWordSource = true;
        sources.push({ kind: "word", claim: w, frag: w, verifiable: true, strictVerifiable: true });
        piecesStrict.add(w);
        piecesLax.add(w);
      }
      continue;
    }
    if (label.includes(w)) {
      sources.push({ kind: "ascii", claim: w, frag: w, verifiable: true, strictVerifiable: true });
      piecesStrict.add(w);
      piecesLax.add(w);
      continue;
    }
    if (FUNCTION_WORDS.has(w)) continue;
    const d = derivedFrag(w, label);
    if (d) {
      sources.push({ kind: "derived", claim: w, frag: d, verifiable: true, strictVerifiable: true });
      piecesStrict.add(d);
      piecesLax.add(d);
      continue;
    }
    if (TOPICAL_WORDS.has(w)) { topical++; continue; }
    phantomAscii++;
    sources.push({ kind: "ascii", claim: w, verifiable: false, strictVerifiable: false });
  }
  const claimed = sources.filter((s) => s.kind !== "word" || wholeWordSource);
  const verifiableSources = claimed.filter((s) => s.verifiable).length;
  const unverifiableSources = claimed.length - verifiableSources;
  const strict = reachCovers(label, piecesStrict);
  const lax = reachCovers(label, piecesLax);
  const coverUnion = unionCoverage(label, piecesLax);

  // 品牌联想句：无 ASCII、无引号、且不是纯读音评语的分句；或带联想标记词
  const clauses = m.split(CLAUSE_SPLIT_RE).map((c) => c.trim()).filter((c) => (c.match(CJK_RE) ?? []).length > 0);
  const assocClauses = clauses.filter((c) => {
    if (/[a-z]/i.test(c) || /[「『」』]/.test(c)) return ASSOC_MARK_RE.test(c) && !PHONETIC_RE.test(c);
    return !PHONETIC_RE.test(c) || ASSOC_MARK_RE.test(c);
  });
  const hasAssoc = assocClauses.length > 0;
  const descChars = new Set((it.description.match(CJK_RE) ?? []).filter((c) => !STOP.has(c)));
  const assocText = assocClauses.join("");
  const assocOverlap = it.description ? new Set([...assocText].filter((c) => descChars.has(c))).size : null;
  const overlapAll = it.description ? new Set([...m].filter((c) => descChars.has(c))).size : null;
  const singleQuotes = quoted.filter((w) => w.length === 1).length;
  const multiQuotes = quoted.length - singleQuotes;
  const han = (m.match(CJK_RE) ?? []).length;

  return {
    han,
    nClauses: clauses.length,
    nSources: claimed.length,
    verifiableSources,
    unverifiableSources,
    unknownChar,
    phantomAscii,
    selfMention,
    wholeWordSource,
    coversStrict: strict.covers,
    coversLax: lax.covers,
    reachRatio: lax.reachRatio,
    coverUnion,
    hasAssoc,
    assocClauses: assocClauses.length,
    assocOverlap,
    overlapAll,
    pureAssoc: claimed.length === 0,
    singleQuoteOnly: quoted.length > 0 && multiQuotes === 0,
    singleQuotes,
    multiQuotes,
    zhNames,
    implicitName,
    sources: claimed,
  };
}

// 现有生产 guard 链（admitCandidate 顺序）在该条上的命中——说明「今天的生产」会不会已经拦住它
function guardChainHit(it) {
  const theme = it.theme;
  if (theme === "rule") return null;
  if (containsMetaLanguage(it.meaning)) return "metaLanguage";
  if (citesPhantomWord(it.label, it.meaning)) return "phantomEtymology(citesPhantomWord)";
  if (zhCitesPhantomAscii(it.label, it.meaning)) return "phantomEtymology(zhCitesPhantomAscii)";
  if (it.meaning.includes("?") || it.meaning.includes("？")) return "questionMark";
  if (zhMeaningIncoherent(it.label, it.meaning, { theme })) return "zhMeaningIncoherent";
  if (theme === "pinyin" && pinyinQuoteMismatch(it.label, it.meaning)) return "pinyinMismatch";
  return null;
}

// ---------------------------------------------------------------------------
// §2 规则集合与评估
// ---------------------------------------------------------------------------
const COINED_LIKE = new Set(["coined", "blend"]);
const RULES = {
  "R496 zhMeaningIncoherent（基线）": (it) => zhMeaningIncoherent(it.label, it.meaning, { theme: it.theme }),
  "现有 guard 链全体（R183/R246/R496/R196）": (it) => guardChainHit(it) !== null,
  "A0 无来源纯联想（pureAssoc）": (it, f) => it.theme !== "rule" && f.pureAssoc,
  "A1 来源拼合不覆盖 label（!coversLax，含无来源）": (it, f) => it.theme !== "rule" && !f.coversLax,
  "A1s 严格：只认全拼（!coversStrict）": (it, f) => it.theme !== "rule" && !f.coversStrict,
  "A2 存在不可核来源（unverifiable>0）": (it, f) => it.theme !== "rule" && f.unverifiableSources > 0,
  "A3 = A0 ∪ A1 ∪ A2（来源可核性硬规则全量）": (it, f) => it.theme !== "rule" && (f.pureAssoc || !f.coversLax || f.unverifiableSources > 0),
  "A3 仅 refine 轮": (it, f) => it.theme !== "rule" && it.refine === true && (f.pureAssoc || !f.coversLax || f.unverifiableSources > 0),
  "A3 仅 coined/blend": (it, f) => COINED_LIKE.has(it.theme) && (f.pureAssoc || !f.coversLax || f.unverifiableSources > 0),
  "A3 仅 coined/blend 且 refine": (it, f) => COINED_LIKE.has(it.theme) && it.refine === true && (f.pureAssoc || !f.coversLax || f.unverifiableSources > 0),
  "S1 引号全为单字（pinyin/blend 拆字型）": (it, f) => (it.theme === "pinyin" || it.theme === "blend") && f.singleQuoteOnly,
  "A4 无品牌联想句（!hasAssoc）": (it, f) => it.theme !== "rule" && !f.hasAssoc,
  "A5 联想句与 description 领域字零重叠（仅有 description 的条）": (it, f) => it.theme !== "rule" && it.description !== "" && f.assocOverlap === 0,
  "R496 ∪ A3": (it, f) => it.theme !== "rule" && (zhMeaningIncoherent(it.label, it.meaning, { theme: it.theme }) || f.pureAssoc || !f.coversLax || f.unverifiableSources > 0),
  "R496 ∪ A3(coined/blend) ∪ S1": (it, f) =>
    it.theme !== "rule" &&
    (zhMeaningIncoherent(it.label, it.meaning, { theme: it.theme }) ||
      (COINED_LIKE.has(it.theme) && (f.pureAssoc || !f.coversLax || f.unverifiableSources > 0)) ||
      ((it.theme === "pinyin" || it.theme === "blend") && f.singleQuoteOnly)),
};

// 全量指标 + 「净增」指标：只算今天生产 guard 链放行的条目（guardChainHit===null），
// 即该规则叠加到现有防线后新增的拦截/误杀，避免把 waofun/tibeirock 这类生产早已丢弃的条重复计成误杀
function evaluate(rule, rows, filter = () => true) {
  let tp = 0, fn = 0, fp = 0, tn = 0, blHit = 0, blTotal = 0;
  let tpNet = 0, fpNet = 0, tnNet = 0, fnNet = 0;
  const fpList = [], fnList = [], fpNetList = [];
  for (const r of rows) {
    if (!filter(r.it)) continue;
    const hit = !!rule(r.it, r.f);
    const passesToday = guardChainHit(r.it) === null;
    if (r.it.tag === "salad") {
      hit ? tp++ : fn++;
      if (!hit) fnList.push(r.it.label);
      if (passesToday) hit ? tpNet++ : fnNet++;
    } else if (r.it.tag === "coherent") {
      hit ? fp++ : tn++;
      if (hit) fpList.push(r.it.label);
      if (passesToday) { hit ? fpNet++ : tnNet++; if (hit) fpNetList.push(r.it.label); }
    } else { blTotal++; if (hit) blHit++; }
  }
  const precision = tp + fp ? tp / (tp + fp) : NaN;
  const recall = tp + fn ? tp / (tp + fn) : NaN;
  const falseKill = fp + tn ? fp / (fp + tn) : NaN;
  const falseKillNet = fpNet + tnNet ? fpNet / (fpNet + tnNet) : NaN;
  return { tp, fp, fn, tn, precision, recall, falseKill, blHit, blTotal, fpList, fnList, tpNet, fnNet, fpNet, tnNet, falseKillNet, fpNetList };
}
const pct = (x, d = 0) => (Number.isNaN(x) ? "n/a" : `${(x * 100).toFixed(d)}%`);

// ---------------------------------------------------------------------------
// §3 方案 C 校验器：模型输出 {label, sources:[{frag, from}], gist}，规则只核对结构
// ---------------------------------------------------------------------------
// from 为自由标签时的白名单（fail-closed：表外的拟声/后缀不认，模型必须换候选或改写来源）
const ONOMATOPOEIA = new Set(["woof", "meow", "miao", "miaow", "mew", "miu", "purr", "wang", "wow", "yip", "arf", "ruff", "bark", "ha", "hei", "la", "ga", "gu", "gulu", "pa", "da", "bo", "mo", "chi", "zha", "ding", "dong", "pop", "boom", "zoom", "buzz", "hum", "yo", "yeah", "oh"]);
const AFFIXES = new Set(["ly", "ty", "ity", "y", "ie", "ee", "er", "o", "a", "ify", "able", "ible", "ish", "let", "ling", "ino", "ini", "ella", "etta", "ora", "ia", "io", "ix", "ex", "ly", "ful", "ness", "ify", "ize", "ise", "ery", "ary", "ory", "ist", "ism", "oo", "zy", "sy", "ky", "i", "e", "u", "co", "go", "fy", "nova", "ify"]);
const FROM_ONO_RE = /^(拟声|象声|拟声词|叫声)$/;
const FROM_AFFIX_RE = /^(后缀|前缀|词尾|尾音|造词后缀|音节|连接音|衔接音)$/;
/**
 * 返回 { ok, reasons[] }。fail-closed：任一 reason 即拒。
 *  - sources 非空；每个 frag 都是 label 子串；frag 按序拼接 === label（允许相邻 frag 重叠 ≤1 字母）
 *  - from 为汉字词：frag 必须是该词逐字全拼（或首字母/首声母）的一种拼接 —— 与 R497 同法
 *  - from 为 ASCII 词（可带语种前缀「法语 croustillant」）：frag 必须是其首段/尾段（≥2 字母）或整词
 *  - from 为「拟声」/「后缀」类自由标签：frag 必须在小白名单内（表外不认，fail-closed）
 *  - gist：1 个分句、4–20 个汉字、不含独立 ASCII、最多 1 个比喻词（与 ZH_COINED_MEANING_FORMAT 一致）、不含叙事标记
 */
export function verifyStructured(label, out) {
  const reasons = [];
  label = label.toLowerCase();
  const sources = Array.isArray(out?.sources) ? out.sources : [];
  if (sources.length === 0) reasons.push("no_sources");
  let cursor = 0;
  for (const s of sources) {
    const frag = String(s?.frag ?? "").toLowerCase();
    const from = String(s?.from ?? "").trim();
    if (!frag || !label.includes(frag)) { reasons.push(`frag_not_in_label:${frag}`); continue; }
    const at = label.indexOf(frag, Math.max(0, cursor - 1));
    if (at < 0 || at > cursor) reasons.push(`frag_out_of_order:${frag}`);
    else cursor = at + frag.length;
    if (!from) { reasons.push(`from_missing:${frag}`); continue; }
    if (FROM_ONO_RE.test(from)) {
      if (!ONOMATOPOEIA.has(frag)) reasons.push(`onomatopoeia_not_whitelisted:${frag}`);
      continue;
    }
    if (FROM_AFFIX_RE.test(from)) {
      if (!AFFIXES.has(frag)) reasons.push(`affix_not_whitelisted:${frag}`);
      continue;
    }
    if (CJK_ONE_RE.test(from) && from.replace(CJK_RE, "").trim() === "") {
      let combos = [""];
      let known = true;
      for (const ch of from) {
        const cp = charPieces(ch, true);
        if (!cp.known) { known = false; break; }
        const next = [];
        for (const c of combos) for (const p of cp.pieces) if (next.length < 400) next.push(c + p);
        combos = next;
      }
      if (!known) reasons.push(`from_char_unknown:${from}`);
      else if (!combos.includes(frag)) reasons.push(`frag_not_pinyin_of_from:${frag}<-${from}`);
      continue;
    }
    const fw = from.toLowerCase().replace(/[^a-z]/g, "");
    if (!fw) { reasons.push(`from_unparsable:${from}`); continue; }
    if (!(fw === frag || (frag.length >= 2 && (fw.startsWith(frag) || fw.endsWith(frag))))) reasons.push(`frag_not_edge_of_from:${frag}<-${fw}`);
  }
  if (sources.length && cursor !== label.length) reasons.push(`frags_do_not_cover_label:${cursor}/${label.length}`);
  const gist = String(out?.gist ?? "").trim();
  const gistHan = (gist.match(CJK_RE) ?? []).length;
  if (gistHan < 4 || gistHan > 20) reasons.push(`gist_len:${gistHan}`);
  if (gist.split(CLAUSE_SPLIT_RE).filter((c) => c.trim()).length > 1) reasons.push("gist_multi_clause");
  if (/[a-z]{2,}/i.test(gist)) reasons.push("gist_has_ascii");
  if ((gist.match(/像|仿佛|恰似|如同|宛如|好比|犹如|(?<!一)般/g) ?? []).length > 1) reasons.push("gist_metaphor_chain");
  if (/正在|被|讲述|演绎|传奇/.test(gist)) reasons.push("gist_narrative");
  return { ok: reasons.length === 0, reasons };
}

// 19 条 salad/borderline 的「诚实结构化输出」：按 meaning 原文如实转写来源，来源不存在就留空——用来看 C 校验器能拦哪些
const HONEST_C = {
  miaoround: { sources: [{ frag: "miao", from: "喵" }, { frag: "round", from: "round" }], gist: "圆满团圆的猫咪陪伴" },
  moggity: { sources: [{ frag: "moggy", from: "moggy" }, { frag: "ty", from: "后缀" }], gist: "小猫咪洋洋得意的口吻" }, // moggy 非 label 子串（label 为 moggi-ty）→ 结构拦
  miafbab: { sources: [{ frag: "miaf", from: "拟声" }, { frag: "bab", from: "baby" }], gist: "猫叫声钻入怀里的依顺" }, // miaf 不在拟声白名单 → 拦
  gurgulu: { sources: [{ frag: "gur", from: "拟声" }, { frag: "gulu", from: "拟声" }], gist: "小狗追零食的热闹劲" }, // gur 不在拟声白名单 → 拦（gulu 在）
  voralini: { sources: [{ frag: "vora", from: "voracious" }, { frag: "lini", from: "后缀" }], gist: "贪吃小兽的吃客传奇" }, // lini 不在后缀白名单 + gist 叙事词「传奇」 → 拦
  hapany: { sources: [{ frag: "ha", from: "拟声" }, { frag: "pany", from: "company" }], gist: "愿意并肩的伙伴" }, // 结构全通 → 只能靠 B
  maoga: { sources: [{ frag: "mao", from: "毛" }, { frag: "ga", from: "拟声" }], gist: "快乐玩耍毛发飞扬" }, // 结构全通 → 只能靠 B
  tuoguo: { sources: [{ frag: "tuo", from: "脱" }, { frag: "guo", from: "果" }], gist: "可爱又淘气之感" }, // 结构全通 → 只能靠 B
  zora: { sources: [], gist: "异国情调的温馨慵懒" }, // 无来源 → 拦
  duanyou: { sources: [{ frag: "duanyou", from: "韫岩" }], gist: "藏玉于岩" }, // 韫岩 ≠ duanyou → 拦（生产已由 pinyinQuoteMismatch 拦）
  youse: { sources: [], gist: "好奇出格的色彩" }, // 无来源 → 拦
  tuanwan: { sources: [{ frag: "tuan", from: "团" }, { frag: "wan", from: "玩" }], gist: "团聚玩乐的宠物零食" },
  pilloway: { sources: [{ frag: "pillow", from: "pillow" }, { frag: "way", from: "way" }], gist: "软乎乎的依偎与同行" },
  xiwo: { sources: [{ frag: "xi", from: "喜" }, { frag: "wo", from: "窝" }], gist: "欢喜归宿" },
  ongo: { sources: [{ frag: "ong", from: "翁" }, { frag: "go", from: "go" }], gist: "陪伴宠物一路同行" }, // 翁=weng ≠ ong → 拦
  pingo: { sources: [{ frag: "pin", from: "快乐的相连" }, { frag: "go", from: "go" }], gist: "宠物和主人一起出行" }, // pin 来源不可核 → 拦
  lino: { sources: [], gist: "健康光泽的宠物毛发" }, // 无来源 → 拦
  mouxiong: { sources: [{ frag: "mou", from: "某" }, { frag: "xiong", from: "熊" }], gist: "叫唤乖宠的拟声" }, // 结构通 → B
  xuanwa: { sources: [{ frag: "xuan", from: "选" }, { frag: "wa", from: "哇" }], gist: "挑到好物时的赞叹" }, // 结构通 → B
};

// ---------------------------------------------------------------------------
// 主流程
// ---------------------------------------------------------------------------
const rows = items.map((it) => ({ it, f: analyze(it) }));
const groups = { salad: rows.filter((r) => r.it.tag === "salad"), borderline: rows.filter((r) => r.it.tag === "borderline"), coherent: rows.filter((r) => r.it.tag === "coherent") };

console.log(`== R501 §1 特征分布（标注集 ${items.length} 条：salad ${groups.salad.length} / borderline ${groups.borderline.length} / coherent ${groups.coherent.length}） ==`);
const share = (arr, pred) => `${arr.filter(pred).length}/${arr.length} (${pct(arr.filter(pred).length / arr.length)})`;
const FEATURES = [
  ["F1 有可核来源 ≥1（verifiableSources≥1）", (r) => r.f.verifiableSources >= 1],
  ["F1' 存在不可核来源（unverifiableSources>0）", (r) => r.f.unverifiableSources > 0],
  ["F2 来源拼合覆盖 label（coversLax）", (r) => r.f.coversLax],
  ["F2s 严格全拼覆盖（coversStrict）", (r) => r.f.coversStrict],
  ["F2u 来源解释字母占比 ≥ 0.8（coverUnion）", (r) => r.f.coverUnion >= 0.8],
  ["F3 有品牌联想句（hasAssoc）", (r) => r.f.hasAssoc],
  ["F4 联想句与 description 领域字重叠 ≥1（仅有 description）", (r) => r.it.description !== "" && r.f.assocOverlap >= 1],
  ["F4' 有 description 但重叠 = 0", (r) => r.it.description !== "" && r.f.assocOverlap === 0],
  ["F5 无来源纯联想（pureAssoc）", (r) => r.f.pureAssoc],
  ["F6 引号全为单字（singleQuoteOnly）", (r) => r.f.singleQuoteOnly],
  ["F7 refine 轮", (r) => r.it.refine === true],
  ["F8 theme ∈ coined/blend", (r) => COINED_LIKE.has(r.it.theme)],
  ["F9 现有 guard 链会拦", (r) => guardChainHit(r.it) !== null],
];
console.log(`${"特征".padEnd(46)} salad          borderline     coherent`);
for (const [name, pred] of FEATURES) {
  console.log(`${name.padEnd(46)} ${share(groups.salad, pred).padEnd(14)} ${share(groups.borderline, pred).padEnd(14)} ${share(groups.coherent, pred)}`);
}
const med = (arr, key) => { const s = arr.map((r) => r.f[key]).filter((x) => x !== null).sort((a, b) => a - b); return s.length ? s[Math.floor((s.length - 1) / 2)] : "n/a"; };
console.log(`\n中位数：汉字数 salad ${med(groups.salad, "han")} / borderline ${med(groups.borderline, "han")} / coherent ${med(groups.coherent, "han")}；coverUnion salad ${med(groups.salad, "coverUnion")} / borderline ${med(groups.borderline, "coverUnion")} / coherent ${med(groups.coherent, "coverUnion")}；assocOverlap salad ${med(groups.salad, "assocOverlap")} / borderline ${med(groups.borderline, "assocOverlap")} / coherent ${med(groups.coherent, "assocOverlap")}`);

console.log("\n== §1b salad / borderline 逐条 ==");
for (const r of [...groups.salad, ...groups.borderline]) {
  const f = r.f;
  const src = f.sources.map((s) => `${s.claim}${s.frag && s.frag !== s.claim ? `→${s.frag}` : ""}${s.verifiable ? "" : "✗"}`).join(" ");
  console.log(`${r.it.tag.padEnd(10)} ${r.it.label.padEnd(10)} ${r.it.theme.padEnd(6)} 来源[${src || "—"}] cover=${f.coversLax ? "Y" : "N"}(${f.coverUnion}) assoc=${f.hasAssoc ? "Y" : "N"} ovl=${f.assocOverlap ?? "-"} pure=${f.pureAssoc ? "Y" : "N"} guard=${guardChainHit(r.it) ?? "-"}`);
}
if (PRINT_ITEMS) {
  console.log("\n== §1c 全量逐条（--items） ==");
  console.log("tag\tlabel\ttheme\trefine\tnSrc\tverif\tunverif\tcoversLax\tcoversStrict\tcoverUnion\thasAssoc\tassocOverlap\tpureAssoc\tsingleQuoteOnly\tguard\tmeaning");
  for (const r of rows) {
    const f = r.f;
    console.log([r.it.tag, r.it.label, r.it.theme, r.it.refine, f.nSources, f.verifiableSources, f.unverifiableSources, f.coversLax, f.coversStrict, f.coverUnion, f.hasAssoc, f.assocOverlap ?? "-", f.pureAssoc, f.singleQuoteOnly, guardChainHit(r.it) ?? "-", r.it.meaning].join("\t"));
  }
}

console.log("\n== §2 规则评估（分母：salad 11 / coherent 241；borderline 8 单列） ==");
const fmtRow = (name, e) => `${name.padEnd(44)} ${String(e.tp).padStart(2)} ${String(e.fp).padStart(2)} ${String(e.fn).padStart(2)}  ${pct(e.precision).padStart(6)} ${pct(e.recall).padStart(6)} ${pct(e.falseKill, 1).padStart(6)}  ${e.blHit}/${e.blTotal}   ${String(e.tpNet).padStart(2)}/${e.tpNet + e.fnNet} ${String(e.fpNet).padStart(2)}/${e.fpNet + e.tnNet} ${pct(e.falseKillNet, 1).padStart(6)}`;
console.log(`${"规则".padEnd(44)} TP FP FN  精确率 召回率 误杀率  BL    | 净增: 新拦FN 新误杀 净误杀率`);
const summary = {};
for (const [name, rule] of Object.entries(RULES)) {
  const e = evaluate(rule, rows);
  summary[name] = e;
  console.log(fmtRow(name, e));
}
console.log("\n-- 同规则，只看 refine 轮子集（salad 全部来自 refine；coherent refine 条数见下）--");
const refineRows = rows.filter((r) => r.it.refine === true);
console.log(`refine 子集：salad ${refineRows.filter((r) => r.it.tag === "salad").length} / borderline ${refineRows.filter((r) => r.it.tag === "borderline").length} / coherent ${refineRows.filter((r) => r.it.tag === "coherent").length}`);
for (const name of ["A3 = A0 ∪ A1 ∪ A2（来源可核性硬规则全量）", "A3 仅 coined/blend", "R496 ∪ A3", "R496 ∪ A3(coined/blend) ∪ S1"]) {
  const e = evaluate(RULES[name], rows, (it) => it.refine === true);
  console.log(fmtRow(name, e));
}
console.log("\n-- 误杀清单（coherent 被拦）与漏网清单 --");
for (const name of ["A0 无来源纯联想（pureAssoc）", "A1 来源拼合不覆盖 label（!coversLax，含无来源）", "A2 存在不可核来源（unverifiable>0）", "A3 仅 coined/blend", "S1 引号全为单字（pinyin/blend 拆字型）", "A4 无品牌联想句（!hasAssoc）", "A5 联想句与 description 领域字零重叠（仅有 description 的条）"]) {
  const e = summary[name];
  console.log(`${name}\n  误杀(${e.fp})：${e.fpList.join(", ") || "—"}\n  其中今日 guard 放行的净增误杀(${e.fpNet})：${e.fpNetList.join(", ") || "—"}\n  漏网(${e.fn})：${e.fnList.join(", ") || "—"}`);
}

console.log("\n== §3 方案 C 校验器 verifyStructured：19 条 salad/borderline 的诚实结构化输出 ==");
let cTp = 0, cFn = 0, cBl = 0;
for (const r of [...groups.salad, ...groups.borderline]) {
  const out = HONEST_C[r.it.label];
  const v = verifyStructured(r.it.label, out);
  if (r.it.tag === "salad") v.ok ? cFn++ : cTp++;
  else if (!v.ok) cBl++;
  console.log(`${r.it.tag.padEnd(10)} ${r.it.label.padEnd(10)} ${v.ok ? "通过→需 B 语义二审" : "拒绝"} ${v.reasons.join(" ")}`);
}
console.log(`C 结构层：salad 拦 ${cTp}/11（漏 ${cFn} 条需 B）；borderline 拦 ${cBl}/8`);
// 校验器不能误伤「好例」：用 prompt 里两条好例 + 4 条 coherent 手写结构验证 ok
const GOOD_C = [
  ["woofable", { sources: [{ frag: "woof", from: "拟声" }, { frag: "able", from: "able" }], gist: "每只狗都值得好好对待" }],
  ["mochacat", { sources: [{ frag: "mocha", from: "mocha" }, { frag: "cat", from: "cat" }], gist: "像摩卡一样温柔的猫咪伙伴" }],
  ["aipet", { sources: [{ frag: "ai", from: "爱" }, { frag: "pet", from: "pet" }], gist: "用爱陪伴每个毛孩子" }],
  ["yunmu", { sources: [{ frag: "yun", from: "云" }, { frag: "mu", from: "慕" }], gist: "云端向往的东方雅致" }],
  ["purrfect", { sources: [{ frag: "purr", from: "purr" }, { frag: "fect", from: "perfect" }], gist: "猫咪满足的完美时刻" }],
  ["crousti", { sources: [{ frag: "crousti", from: "法语 croustillant" }], gist: "酥脆零食的法式质感" }],
];
let goodOk = 0;
for (const [label, out] of GOOD_C) {
  const v = verifyStructured(label, out);
  if (v.ok) goodOk++;
  else console.log(`  好例被拒 ${label}: ${v.reasons.join(" ")}`);
}
console.log(`C 校验器好例通过 ${goodOk}/${GOOD_C.length}`);

// ---------------------------------------------------------------------------
// §4 方案 B（同请求内 LLM 二审）离线估算：不调用模型，只构造 prompt 并按 DeepSeek 官方换算比估 token，
//    时延基线从 docs/audits/r494/*.ndjson 的 _ms 时间戳算（R466 主轮流式的实测数据，6 次）
// ---------------------------------------------------------------------------
export const B_SYSTEM = `你是中文创业者视角的域名寓意审核员。下面是若干候选域名及其寓意说明，请逐条判断：一个中文创业者看到 label 与寓意，能否在 3 秒内看懂「这个名字为什么这样拼、和需求有什么关系」。
只输出 JSON 数组，每项 {"label":"…","ok":0或1,"why":"≤8字"}：
- ok=0 的情形：音节来源与 label 对不上；来源拼出的中文词本身无意义或与需求无关（如「脱果」）；联想句与需求领域无关；句子主谓断裂读不通。
- ok=1 的情形：来源清楚、拼得出 label、联想一句话就能对上需求。
不解释，不补写寓意，不改 label。`;
export function buildBUserPrompt(description, cands) {
  return `需求：${description}\n候选：\n${cands.map((c) => `- ${c.label}｜${c.meaning}`).join("\n")}`;
}
// DeepSeek 官方换算比（https://api-docs.deepseek.com/quick_start/token_usage）：1 汉字≈0.6 token，1 英文字符≈0.3 token
export function estimateTokens(text) {
  const han = (text.match(/[\u3400-\u4dbf\u4e00-\u9fff\u3000-\u303f\uff00-\uffef]/g) ?? []).length;
  const other = text.length - han;
  return Math.round(han * 0.6 + other * 0.3);
}
console.log("\n== §4 方案 B 离线估算（不调用模型） ==");
const refineBatch = items.filter((it) => it.source === "docs/audits/r496-r499/ai-search-02-zh-refine.ndjson" && it.round === 2);
const desc = refineBatch[0]?.description ?? "";
const bIn = B_SYSTEM + "\n" + buildBUserPrompt(desc, refineBatch);
const bOut = JSON.stringify(refineBatch.map((c) => ({ label: c.label, ok: 1, why: "来源清楚贴合需求" })));
const inTok = estimateTokens(bIn), outTok = estimateTokens(bOut);
console.log(`真实 refine 轮批次（${refineBatch[0]?.source} round 2）：${refineBatch.length} 条候选（生产放行后的条数，模型原始输出更多）`);
console.log(`  B 输入 ≈ ${inTok} token（system ${estimateTokens(B_SYSTEM)} + user ${estimateTokens(buildBUserPrompt(desc, refineBatch))}），输出 ≈ ${outTok} token（每条 ≈ ${(outTok / refineBatch.length).toFixed(0)}）`);
// 价格：DeepSeek 公开价（2026-09-04 抓取 https://api-docs.deepseek.com/quick_start/pricing，deepseek-chat：输入 $0.56/M 未命中缓存、$0.07/M 命中，输出 $1.68/M）
const P_IN = 0.56, P_IN_HIT = 0.07, P_OUT = 1.68;
const cost = (i, o, hit = 0) => ((i * (hit ? P_IN_HIT : P_IN)) + o * P_OUT) / 1e6;
console.log(`  单次 B 成本 ≈ $${cost(inTok, outTok).toFixed(5)}（system 缓存命中时 ≈ $${(cost(estimateTokens(B_SYSTEM), 0, 1) + cost(inTok - estimateTokens(B_SYSTEM), outTok)).toFixed(5)}）；每 1000 次 refine 轮 ≈ $${(cost(inTok, outTok) * 1000).toFixed(2)}`);
for (const n of [6, 12, 24]) {
  const c = refineBatch.slice(0, n);
  const i = estimateTokens(B_SYSTEM + "\n" + buildBUserPrompt(desc, c));
  const o = estimateTokens(JSON.stringify(c.map((x) => ({ label: x.label, ok: 1, why: "来源清楚贴合需求" }))));
  console.log(`  批 ${String(n).padStart(2)} 条：输入 ${i} / 输出 ${o} token，$${cost(i, o).toFixed(5)}`);
}
console.log("\n-- 时延基线（docs/audits/r494/ai-search-0*.ndjson，_ms 为相对请求开始的毫秒；R466 主轮流式实测）--");
const auditDir = path.join(root, "docs/audits/r494");
const ttft = [], rates = [];
for (const f of readdirSync(auditDir).filter((n) => /^ai-search-\d+\.ndjson$/.test(n)).sort()) {
  const lines = readFileSync(path.join(auditDir, f), "utf8").split("\n").filter(Boolean);
  const meta = JSON.parse(lines[0]);
  const evs = lines.slice(1).map((l) => JSON.parse(l));
  const roundStart = {};
  for (const e of evs) if (e.type === "round") roundStart[e.round] = e._ms;
  const byRound = {};
  for (const e of evs) if (e.type === "proposed") (byRound[e.round] ??= []).push(e);
  const parts = [];
  for (const r of Object.keys(byRound)) {
    const ps = byRound[r];
    const first = ps[0]._ms - roundStart[r];
    const chars = ps.reduce((a, p) => a + JSON.stringify(p.items).length, 0);
    const span = (ps[ps.length - 1]._ms - ps[0]._ms) / 1000;
    const rate = span > 0 ? chars / span : NaN;
    ttft.push(first);
    if (ps.length >= 6) rates.push(rate);
    parts.push(`r${r}: 轮起→首候选 ${first}ms，${ps.length} 条/${chars} 字符 JSON，≈${rate.toFixed(0)} 字符/s`);
  }
  console.log(`  ${f} headers ${meta._headersMs}ms 总 ${meta._endedMs}ms | ${parts.join(" | ")}`);
}
const medNum = (a) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor((s.length - 1) / 2)]; };
const ttftMed = medNum(ttft), rateMed = medNum(rates);
console.log(`  轮起→首候选 中位 ${ttftMed}ms（min ${Math.min(...ttft)} / max ${Math.max(...ttft)}，n=${ttft.length}）；放行候选 JSON 吞吐中位 ≈${rateMed.toFixed(0)} 字符/s（n=${rates.length}，是模型真实出字速度的下界，因被 guard 丢弃的条不计）`);
const outChars = bOut.length;
console.log(`  B 单批（${refineBatch.length} 条）串行增量估算：TTFT ≈ ${ttftMed}ms + 输出 ${outChars} 字符 / ${rateMed.toFixed(0)} 字符/s ≈ ${(outChars / rateMed * 1000).toFixed(0)}ms → ≈ +${((ttftMed + outChars / rateMed * 1000) / 1000).toFixed(1)}s（P50 估算，未实测）`);

// 供文档引用的机器可读摘要
if (process.argv.includes("--json")) {
  console.log(JSON.stringify({ summary: Object.fromEntries(Object.entries(summary).map(([k, e]) => [k, { tp: e.tp, fp: e.fp, fn: e.fn, blHit: e.blHit }])) }, null, 2));
}
