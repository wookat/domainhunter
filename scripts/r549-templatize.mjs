/**
 * R549 一次性 codemod：把 compares.ts 正文（verdict / pickA / pickB）里手写的绝对价格数字
 * 改成与价格表同源的占位符（见 content/compare-prices.ts renderPriceText）：
 *   zh 「.io 首年 259 元、续费 419 元」 → 「.io 首年 {{price:io:first:cny}}、续费 {{price:io:renew:cny}}」
 *   en 「.io at ¥259 first year / ¥419 renewal」 → 「.io at {{price:io:first:cny}} first year / {{price:io:renew:cny}} renewal」
 *   en 「renewals around $25–30」 → 「renewals around {{price:life:renew:usd}}」
 *
 * 自动替换「能唯一归属到对比两侧某一 TLD 的首年/续费」的数字（归属靠句法：主语/邻近 TLD/vs 两侧/所有格；
 * 数值仅作校验与漂移统计，主语与数值指向相反侧时 fail-closed 进 --manual 清单）；差额/倍数/N 年总价/区间/两侧共用
 * 等派生表述改为 diff/ratio/jump/sum/pair/costN/costdiffN 占位（渲染见 compare-prices.ts）；仍无法自动归属的句子
 * 由 r549-overrides.mjs 逐条精确替换（每条必须恰好命中一次，否则脚本报错）。产物已人工逐条复核（docs/audits/r549）。
 *
 * 用法：node scripts/r549-templatize.mjs --prices /tmp/r549/api_prices_before.json --manual /tmp/r549/manual.md [--write]
 *       重放：--src <改前 compares.ts> --out <输出路径> --write（不动工作区）
 */
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { OVERRIDES } from "./r549-overrides.mjs";

const root = resolve(new URL("..", import.meta.url).pathname);
const require = createRequire(join(root, "apps/web/package.json"));
const { build } = require(require.resolve("esbuild", { paths: [require.resolve("vite", { paths: [join(root, "apps/web")] })] }));
const srcDir = join(root, "apps/web/src");

const args = process.argv.slice(2);
const optValue = (name, dflt) => {
  const i = args.findIndex((x) => x === `--${name}` || x.startsWith(`--${name}=`));
  if (i === -1) return dflt;
  const eq = args[i].indexOf("=");
  if (eq !== -1) return args[i].slice(eq + 1);
  const next = args[i + 1];
  return next && !next.startsWith("--") ? next : true;
};
const pricesFile = optValue("prices", null);
const manualFile = optValue("manual", null);
const write = Boolean(optValue("write", false));
const srcOverride = optValue("src", null);
const outOverride = optValue("out", null);
const file = srcOverride ? resolve(srcOverride) : join(srcDir, "content/compares.ts");
const outFile = outOverride ? resolve(outOverride) : file;

const tmp = mkdtempSync(join(tmpdir(), "r549t-"));
const entry = join(tmp, "entry.ts");
writeFileSync(entry, `export { tldPrice } from "${srcDir}/types";\nexport { toCny, toUsd } from "${srcDir}/lib/currency";\n`);
const bundle = join(tmp, "bundle.mjs");
await build({ entryPoints: [entry], bundle: true, format: "esm", platform: "node", outfile: bundle, logLevel: "silent" });
const { tldPrice, toCny, toUsd } = await import(pathToFileURL(bundle).href);
rmSync(tmp, { recursive: true, force: true });
const live = pricesFile ? (JSON.parse(readFileSync(pricesFile, "utf8")).prices ?? {}) : {};

/** 事实/政策类金额（不随零售价漂移）：只看数字前后 40 字，不整句判定 */
const FACT = {
  zh: { near: 10, far: 12, nearRe: /两年起注|一千元出头|首笔|保证金|押金|罚款/, farRe: /批发价|批发|拍卖|成交|售出|卖出|卖了|转手|估值|融资|注册局[^。；]{0,6}收/ },
  en: { near: 25, far: 45, nearRe: /two-year minimum|first bill|deposit|fine of|registry fee|costs registrars|\$\s?[\d,.]+\s*(?:million|billion|m\b|bn\b|k\b)/i, farRe: /wholesale|auction|sold|sale price|resold|changed hands|acquired for|valuation|raised/i },
};
const isFactNumber = (lang, sentence, idx, len) => {
  const f = FACT[lang];
  const tail = (n) => sentence.slice(idx, idx + len + n);
  return f.nearRe.test(sentence.slice(Math.max(0, idx - f.near), idx) + " " + tail(lang === "zh" ? 4 : 12)) || f.farRe.test(sentence.slice(Math.max(0, idx - f.far), idx) + " " + tail(12));
};
/** 派生数字（差额/倍数/十年/合计）：不自动归属 */
const DERIVED = {
  zh: /(差|多付|少付|多|少|贵|便宜|低|高|高出|差出|相差|合计|总账|总价|十年|两年|三年|五年|一共|加起来|区间|～|~|出头|省|节省|多花|少花|多出|省下|差约|价差|差价)\s*[约近]?\s*$/,
  en: /(more|less|below|above|higher|lower|gap|difference|differs?|differing|cheaper|dearer|extra|save|saving|total|decade|ten years|together|combined|(?:more|less) than)\s*(?:is|runs|of|comes to)?\s*(?:about|roughly|around|by|only|just)?\s*$/i,
};
/** 数字后面紧跟的派生词：「¥50 more every year」「¥20 a year apart」「$50/yr combined」 */
const DERIVED_AFTER = {
  zh: /^\s*(?:\/年)?\s*(?:的差|差距|之差|左右的差|以上|以内|出头|级的差)/,
  en: /^(?:\/yr|\/year| a year| per year|,)?\s*(?:(?:renewal )?gap|more(?! than)|less(?! than)|apart|cheaper|dearer|higher|lower|below|above|extra|combined|together|in total|total|over (?:a decade|ten years|five years|three years)|(?:a year|per year|\/yr) (?:more|less|apart|below|above|higher|lower|cheaper))\b/i,
};
const KIND_BEFORE = {
  zh: { renew: /续费|续期|平续|平进平出|年费|均约|都约|常年|跳到|回升到|回到|升到|涨到/, first: /首年|注册|首次|第一年|引流价|促销|入场|起步/ },
  en: { renew: /renew|year two|from year|thereafter|after that|flat|stable|both ways|in-and-out|holding cost|to hold|per year|a year|\/yr|jumps? to|climbs? to|rises? to|then \$?$/i, first: /first year|first-year|register|registration|intro|up front|year one|year-one|promo|sign-?up|launch|entry/i },
};
/** 紧贴数字前的项别词（强归属）：「注册约 $11」「续费 $26」「renews at about $30」「about $12 to register」由 KIND_AFTER 负责 */
const KIND_ADJ = {
  zh: /(首年|注册|续费|续期|年费)(?:价|约|常见|常有|大约|通常|都约|均约|同为|稳定在|高达|要|则|只要|仅)?\s*(?:约|在)?\s*$/,
  en: /(?:renews?|renewals?|registers?|registration|first year|year one|year-one|intro(?:duction)?|promo)\s*(?:price|prices|of|at|for|is|are|run|runs|around|about|roughly|closer to|nearer|near|in the|sits? (?:at|around))?\s*(?:about|around|roughly|~|≈)?\s*$/i,
};
const KIND_AFTER = {
  zh: { renew: /^\s*级?(的)?(?:续费|年费)|^\s*\/年\s*(?:（约\s?¥[\d,]+）)?\s*(?:的)?续费/, first: /^\s*(的)?(?:首年|引流价|入门价|注册价|入场)/ },
  en: { renew: /^(?:\s*(?:a year|per year|\/yr|\/year|\/y))?\s*(?:to renew|renewals?|renewal price|flat|both ways|,? renewal|\(≈¥[\d,]+\)\s*(?:to renew|renewals?|flat))|^\/yr|^\/year|^ a year\b|^ per year\b|^ (?:annual )?fee\b/i, first: /^\s*(?:for year one|the first year|first year|first-year|for the first year|to register|up front|intro|to sign|year-one|year one|entry|registration|in\b)/i },
};

const splitSentences = (text, lang) =>
  text.split(lang === "zh" ? /(?<=[。！？；])/ : /(?<=\.)\s+(?=[A-Z"“(]|\.[a-z])/);

const rel = (x, ref) => Math.abs(x - ref) / ref;
const TOL = 0.35;

/** 归属：返回 {tld, kind} 或 null（含理由） */
function attribute({ lang, sentence, before, beforeSent, after, value, hi, currency, a, b, prevTld, subjTld, prevSolo, pickSide }) {
  if (DERIVED[lang].test(before) || DERIVED_AFTER[lang].test(after)) return { fail: "derived" };
  const winB = lang === "zh" ? before.slice(-10) : before.slice(-40);
  let kind = null;
  // 0) 「$36/yr (≈¥260)」括号里的人民币换算：沿用前一个占位的 TLD/项
  const conv = /\{\{price:([a-z.]+):(first|renew):usd\}\}[^()（）¥$\d]{0,30}[(（]\s*(?:≈|约\s?)?$/.exec(before);
  if (conv && currency === "cny") return { tld: conv[1], kind: conv[2], conv: true };
  // 0b) 「($26 vs $8/yr renewal)」「($25 vs $30, both flat)」：A 在前 B 在后，都是续费/常年价（非强归属，仍要数值校验）
  let vsTld = null;
  // 已闭合括号「(fourteen times .ge)」与比较对象「than .hk」「比 .com」「倍于 .dev」不算主语提名
  const cleanBefore = beforeSent.replace(/\([^()]*\)|（[^（）]*）/g, " ");
  const mentions = [...cleanBefore.matchAll(/(?:(than|times|versus|vs\.?|below|above|over|of|比|倍于|于|对|高于|低于)\s+)?\.([a-z][a-z0-9.-]*[a-z0-9])(?![a-z])/g)]
    .filter((m) => !m[1])
    .map((m) => m[2])
    .filter((t) => t === a || t === b);
  // 「.com.ng 约 $10/年」「for .co.ke」：子级域价格不在快照里 → 人工
  const subTld = new RegExp(`\\.(?:[a-z]{2,4}\\.[a-z]{2,3})(?![a-z])`);
  if (subTld.test(beforeSent.slice(-24)) || /^[^.;。；]{0,20}?(?:for|on|at)\s+\.[a-z]{2,4}\.[a-z]{2,3}(?![a-z])/.test(after)) {
    const near = (beforeSent.slice(-24) + " " + after.slice(0, 30)).match(/\.([a-z]{2,4}\.[a-z]{2,3})(?![a-z])/g) ?? [];
    if (near.some((x) => x.slice(1) !== a && x.slice(1) !== b)) return { fail: "subtld" };
  }
  const vsHead = /^(?:\/yr|\/年)?\s*(?:vs\.?|对|versus)\s*(?:\$|¥)\d+(?:\.\d+)?(?:\/yr|\/年)?(?:\s*renewal|\s*renew|,? both flat|\s*flat|\)|）|，|,|、| in the)/i.test(after);
  const vsTail = /\{\{price:([a-z.]+):(first|renew):(?:usd|cny)\}\}(?:\/yr|\/year|\/年| a year)?\s*(?:vs\.?|对|versus)\s*$/.exec(before);
  if (vsHead || vsTail) {
    // 「.org 便宜一档（$14 vs $23）」：前一个数字属于句中最近点名的 TLD（无则 a），后一个属于另一侧
    if (vsTail) { vsTld = vsTail[1] === a ? b : a; kind = vsTail[2]; }
    else { vsTld = mentions.length ? mentions[mentions.length - 1] : a; kind = /year one|first year|首年/i.test(after) ? "first" : "renew"; }
  }
  // 1) 数字紧后面的词最强：「¥419 renewal」「$25–30 renewals」「259 元的续费」
  let kindStrong = false;
  if (!kind && KIND_AFTER[lang].renew.test(after)) { kind = "renew"; kindStrong = true; }
  else if (!kind && KIND_AFTER[lang].first.test(after)) { kind = "first"; kindStrong = true; }
  // 1b) 「.travel about $16 and $119/yr」：and 后面还有一个价 → 这个是首年
  if (!kind && /^\s*(?:and|,|、)\s*(?:¥|\$)\d/.test(after)) kind = "first";
  if (!kind && /\{\{price:[a-z.]+:first:(?:cny|usd)\}\}\s*(?:and|,|、)\s*(?:then\s*)?$/.test(before)) kind = "renew";
  // 2) 「¥69 / ¥85」形态：斜杠前是首年、斜杠后是续费
  if (!kind) {
    if (/\{\{price:[a-z.]+:first:(?:cny|usd)\}\}\s*\/\s*(?:¥|\$)?$/.test(before)) kind = "renew";
    else if (/^\s*\/\s*(?:¥|\$)?\d/.test(after)) kind = "first";
  }
  // 2b) 「注册都约 $21、续费都约 $21」：「都约/均约」前面紧贴的项别词优先
  if (!kind && /(首年|注册)(?:价)?(?:都|均)?约?\s*$/.test(before)) kind = "first";
  if (!kind && /(续费|年费)(?:价)?(?:都|均)?约?\s*$/.test(before)) kind = "renew";
  // 3) 数字前窗口里最近的关键词
  if (!kind) {
    const last = (re) => {
      let idx = -1;
      for (const m of winB.matchAll(new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g"))) idx = m.index;
      return idx;
    };
    const r = last(KIND_BEFORE[lang].renew);
    const f = last(KIND_BEFORE[lang].first);
    if (r >= 0 || f >= 0) kind = r > f ? "renew" : "first";
  }
  // 3b) zh「约 $18/年」：没有别的线索时 /年 视为常年价（续费）
  if (!kind && lang === "zh" && /^\s*\/年/.test(after)) kind = "renew";
  if (!kind) return { fail: `kind?` };
  // 句内未点名 TLD → 段落当前主语（最近一个以「.tld」开头的句子）> 上一句最后提到的 TLD
  let tld = vsTld ?? (mentions.length ? mentions[mentions.length - 1] : subjTld ?? prevTld);
  // 「versus .com at ¥69」「高于 .com 的 69 元」「.shoes 约 $52」：紧贴数字之前点名的 TLD 就是数字的归属（比较词只是引出它）
  const nearRe = lang === "zh"
    ? /\.([a-z][a-z0-9.-]*[a-z0-9])(?![a-z])\s*[（(]?\s*(?:的|约|注册约|续费约|首年约|首年|续费|注册|是|为|在|则|：|:)?\s*(?:约|≈|大约)?\s*$/
    : /\.([a-z][a-z0-9.-]*[a-z0-9])(?![a-z])(?:'s|’s)?\s*(?:[(（]|：|:)?\s*(?:at|about|around|roughly|runs|is|costs|registers|renews|sits|lists|hovers|for|to renew|to register|first year|renewal|renews around|renews at|registers at|lists at|at about|at roughly|is about|is around|runs about|runs around|costs about|sits at|sits around)?(?:\s+(?:about|around|roughly|at|~|≈))?\s*(?:[(（]≈?)?\s*$/i;
  let nearTld = null;
  const nm = nearRe.exec(beforeSent);
  if (nm && (nm[1] === a || nm[1] === b) && nm[0].length <= (lang === "zh" ? 18 : 30)) { nearTld = nm[1]; tld = nearTld; }
  // 「¥69 / ¥85」：斜杠后的续费与斜杠前的首年属于同一个 TLD
  const slashPrev = /\{\{price:([a-z.]+):first:(?:cny|usd)\}\}\s*\/\s*(?:¥|\$)?$/.exec(before);
  if (slashPrev && (slashPrev[1] === a || slashPrev[1] === b)) { tld = slashPrev[1]; vsTld = slashPrev[1]; }
  // 「about $83/yr on .law」「$50 for .expert」：数字后紧跟的 TLD 优先
  const afterTld = /^(?:\/yr|\/year| a year| per year)?(?:\s*\(≈?¥[\d,]+\))?\s*(?:on|for)\s+\.([a-z][a-z0-9.-]*[a-z0-9])(?![a-z])/i.exec(after)
    ?? /^(?:\/yr|\/year| a year| per year)(?:\s*\(≈?¥[\d,]+\))?\s+(?:the\s+)?\.([a-z][a-z0-9.-]*[a-z0-9])(?![a-z])/i.exec(after);
  if (afterTld && (afterTld[1] === a || afterTld[1] === b)) tld = afterTld[1];
  // 句中数字之前出现「两者都/both」且无明确 TLD → 两侧共用一个数字，人工改写
  // 「注册约 $11」「首年约 $6」「续费约 $28」「renews at about $30」：关键词紧贴数字 = 强项别
  if (!kindStrong && KIND_ADJ[lang].test(beforeSent)) kindStrong = true;
  const check = (t) => {
    const s = tldPrice(t);
    const lp = live[t];
    const refs = [];
    if (currency === "cny") {
      if (s) refs.push(kind === "first" ? s.first : s.renew);
      if (lp) refs.push(toCny(kind === "first" ? lp.registration : lp.renewal));
    } else {
      if (s) refs.push(toUsd(kind === "first" ? s.first : s.renew));
      if (lp) refs.push(kind === "first" ? lp.registration : lp.renewal);
    }
    if (!refs.length) return false;
    if (hi != null) return refs.some((r) => r >= value * (1 - TOL) && r <= hi * (1 + TOL));
    return refs.some((r) => rel(value, r) <= TOL);
  };
  // 「.com's ¥69 / ¥85」「.bet's $21/yr」：所有格 = 数字属于该 TLD（即使前面有 below/than 等比较词）
  const poss = /\.([a-z][a-z0-9.-]*[a-z0-9])(?:'|’)s\s*(?:\(|（)?\s*(?:about |roughly |≈|~)?$/.exec(beforeSent);
  if (poss && (poss[1] === a || poss[1] === b)) { vsTld = poss[1]; tld = poss[1]; }
  if (vsTld && !nearTld) {
    const oth = vsTld === a ? b : a;
    if (!check(vsTld) && check(oth)) { vsTld = oth; tld = oth; }
  }
  // 「两者注册都约 $6」「Both renew in the $52–54/yr band」：一个数字代表两侧 → {{pair}}（相等只显示一个值，不等显示两侧）
  // 「注册与续费都约 $21」「registration and renewal both run about $30」说的是同一 TLD 的两个项别，不是两侧 TLD
  const fieldsBoth = /(?:registration and renewal both|both registration and renewal|for both registration and renewal|注册与续费都|注册和续费都|注册续费都)/i.test(beforeSent + " " + after.slice(0, 40));
  if (fieldsBoth && !kind) kind = "renew";
  if (!fieldsBoth && !vsTld && !afterTld && !mentions.length && /两者都|两个都|两者|两侧|双方|两边|都约|都是|都在|\bboth\b|\beither\b|\beach\b/i.test(beforeSent)) {
    if (pickSide) tld = pickSide;
    else return { pair: true, kind };
  }
  // pick 条目未点名 TLD：pickA 说的是 a、pickB 说的是 b
  if (!tld && pickSide) return { tld: pickSide, kind, drift: !check(pickSide) };
  if (!tld) return { fail: "tld?" };

  // 句内显式点名的 TLD（数字前的 .x 或紧随的 on/for .x）= 结构强归属：即使数值已漂移出容差也替换（漂移正是要修的问题）
  const strong = Boolean(vsTld) || Boolean(afterTld) || Boolean(nearTld) || mentions.length > 0;
  if (strong) return { tld, kind, drift: !check(tld), rule: nearTld && tld === nearTld ? "near" : vsTld ? "vs" : afterTld ? "after" : "mention" };
  // 只靠上一句的 TLD 兜底 → 必须数值唯一吻合
  const other = tld === a ? b : a;
  const okT = check(tld);
  const okO = check(other);
  // 上一句点名的 TLD 在这类叙述里就是本句主语（「.voyage names …. Operated by X at about $28 first year」）：数值吻合即采用
  if (okT) return { tld, kind };
  // 上一句点名的是比较对象而非主语（「…比 .deals 便宜。首年约 $9…」）：数值唯一吻合另一侧且项别强 → 另一侧
  // 但若本句主语（句首 .x）就是 tld，数字属于主语，数值只是漂移：不换边
  if (okO && kindStrong && subjTld && tld === subjTld) return { fail: `ambiguous: subject .${tld} but value fits .${other}` };
  if (okO && kindStrong) return { tld: other, kind };
  if (okO) return { fail: `value fits .${other} not .${tld}` };
  // 主语明确 + 数字后紧跟首年/续费关键词：数值不吻合只是手写快照漂移（正是要修的），仍替换
  if (kindStrong && !conv && ((subjTld && tld === subjTld) || tld === prevTld)) return { tld, kind, drift: true, rule: tld === subjTld ? "subj" : "prev" };
  return { fail: `value ${value}${hi != null ? `–${hi}` : ""} ≠ .${tld} ${kind} (static ${JSON.stringify(tldPrice(tld))}, live ${JSON.stringify(live[tld] ?? null)})` };
}

// zh 正文同样大量出现「约 $28（约 ¥202）」形态，与 en 同一套数字模式
const NUM_RE = /(\d+(?:,\d{3})*)(?:\s?[–\-—~～]\s?(\d+(?:,\d{3})*))?\s*元(?!出头)|¥\s?(\d+(?:,\d{3})*)(?:\s?[–\-—~～]\s?(\d+(?:,\d{3})*))?|(?<![A-Za-z])\$\s?(\d+(?:,\d{3})*(?:\.\d+)?)(?:\s?(?:–|-|—|~|～|to)\s?\$?(\d+(?:,\d{3})*(?:\.\d+)?))?/g;
const NUM = { zh: NUM_RE, en: NUM_RE };

let autoDerived = 0;
const T = "[a-z][a-z0-9.-]*[a-z0-9]";
const sideOf = (x, a, b) => (x === a ? b : x === b ? a : null);
/**
 * 派生差额/十年差额改为 {{diff:…}} / {{costdiff10:…}}（绝对值；方向词保留）：
 *  zh 「续费比 .design 低 270 元/年」「每年比 .ai 少约 200 元」「长持每年省 $41」「十年下来差 400 元」
 *  en 「renews ¥80 a year below .online」「about ¥40 a year cheaper」「saving $37 a year」「¥400 over a decade」
 * this = pick 所属侧 / 句中「比 .X」的对侧 / 段落主语；差额是对称的，只要两侧都确定即可。
 */
function derivedRewrite(sentence, { lang, a, b, field, subjTld, prevTld }) {
  const cmpRe = lang === "zh" ? new RegExp(`比\\s*\\.(${T})(?![a-z])`) : new RegExp(`(?:than|below|above|versus|vs\\.?)\\s+\\.(${T})(?![a-z])`);
  const vsM = cmpRe.exec(sentence);
  const named = [...sentence.matchAll(new RegExp(`\\.(${T})(?![a-z])`, "g"))].map((m) => m[1]).filter((t) => t === a || t === b);
  const pickSide = /^pickA/.test(field) ? a : /^pickB/.test(field) ? b : null;
  const other = vsM && sideOf(vsM[1], a, b) ? vsM[1] : null;
  const self = pickSide ?? (other ? sideOf(other, a, b) : null);
  // 差额对称：只要句子/pick 能确定这是 a 与 b 的差即可
  const ok = Boolean(pickSide) || Boolean(other) || (named.length && new Set(named).size === 2) || Boolean(subjTld) || Boolean(prevTld);
  if (!ok) return sentence;
  const x = self ?? a;
  const y = self ? sideOf(self, a, b) : b;
  const diff = (kind, cur) => `{{diff:${x}:${y}:${kind}:${cur}}}`;
  const cost10 = (cur) => `{{costdiff10:${x}:${y}:${cur}}}`;
  const sum = (kind, cur) => `{{sum:${a}:${b}:${kind}:${cur}}}`;
  let out = sentence;
  const N = "(\\d+(?:,\\d{3})*)";
  const rules = lang === "zh"
    ? [
        // 十年/五年合计差额
        [new RegExp(`(十年(?:持有|下来|算下来|持有下来)?(?:差|相差|差出|多付|省|多花|差距)约?\\s*)${N}\\s*元`, "g"), (m, p) => `${p}${cost10("cny")}`],
        [new RegExp(`(十年(?:持有|下来|算下来)?(?:差|相差|差出|多付|省|多花|差距)约?\\s*)\\$${N}`, "g"), (m, p) => `${p}${cost10("usd")}`],
        // 首年差额（先于续费规则，避免「续费 … 首年只差 2 元」被误配）
        [new RegExp(`((?:第一年|首年)[^。；\\d续]{0,10}?(?:只差|差|便宜|贵|多|少)(?:约|了)?\\s*)${N}\\s*元`, "g"), (m, p) => `${p}${diff("first", "cny")}`],
        [new RegExp(`((?:第一年|首年)[^。；\\d续]{0,10}?(?:只差|差|便宜|贵|多|少)(?:约|了)?\\s*)\\$${N}`, "g"), (m, p) => `${p}${diff("first", "usd")}`],
        // 加总：「两个续费加起来约 $59/年」「加起来 $31/年」
        [new RegExp(`((?:加起来|合计|一共|总共)(?:也不到|不到|约|才|仅)?\\s*)\\$${N}(?:\\/年)?`, "g"), (m, p) => `${p.replace(/(也不到|不到|才|仅)\\s*$/, "约 ")}${sum("renew", "usd")}/年`],
        [new RegExp(`((?:加起来|合计|一共|总共)(?:也不到|不到|约|才|仅)?\\s*)${N}\\s*元`, "g"), (m, p) => `${p.replace(/(也不到|不到|才|仅)\\s*$/, "约 ")}${sum("renew", "cny")}`],
        // 续费/每年差额
        [new RegExp(`((?:续费|年费|每年|长持|长期持有|从第二年起|第二年起)[^。；，\\d]{0,12}?(?:低|少|便宜|高|多|贵|省|多付|少付|差|相差|高出|多花|节省)(?:约|近|了|出)?\\s*)${N}\\s*元`, "g"), (m, p) => `${p}${diff("renew", "cny")}`],
        [new RegExp(`((?:续费|年费|每年|长持|长期持有|从第二年起|第二年起|一年)[^。；，\\d]{0,12}?(?:低|少|便宜|高|多|贵|省|多付|少付|差|相差|高出|多花|节省)(?:约|近|了|出)?\\s*)\\$${N}(?:\\/年)?`, "g"), (m, p) => `${p}${diff("renew", "usd")}/年`],
        [new RegExp(`((?:低|少|便宜|高|多|贵|省|多付|少付|差|相差|高出|多花|节省)(?:约|近|了|出)?\\s*)${N}\\s*元\\s*\\/\\s*年`, "g"), (m, p) => `${p}${diff("renew", "cny")}/年`],
        [new RegExp(`((?:低|少|便宜|高|多|贵|省|多付|少付|差|相差|高出|多花|节省)(?:约|近|了|出)?\\s*)\\$${N}\\s*\\/\\s*年`, "g"), (m, p) => `${p}${diff("renew", "usd")}/年`],
      ]
    : [
        [new RegExp(`(?:¥|\\$)${N}( (?:more |extra |less |cheaper |apart )?(?:over|across) (?:a decade|ten years))`, "ig"), (m, n, p) => `${cost10(m.startsWith("$") ? "usd" : "cny")}${p}`],
        [new RegExp(`((?:close to|nearly|almost|about|roughly|around|over|under) )(?:¥|\\$)${N}( (?:more |extra |less )?(?:over|across) (?:a decade|ten years))`, "ig"), (m, p, n, q) => `${p}${cost10(m.includes("$") ? "usd" : "cny")}${q}`],
        // first-year difference
        [new RegExp(`((?:only |just |about )?)(?:¥|\\$)${N}( (?:apart|cheaper|more|less|higher|lower) (?:up front|in year one|the first year|in the first year))`, "ig"), (m, p, n, q) => `${p}${diff("first", m.includes("$") ? "usd" : "cny")}${q}`],
        [new RegExp(`((?:year one|the first year) favou?rs \\.(?:${T}) by )(?:¥|\\$)${N}`, "ig"), (m, p) => `${p}${diff("first", m.includes("$") ? "usd" : "cny")}`],
        [new RegExp(`((?:saves?|saving|save you|differ by|differ only|differ just|differ|differing by|cheaper by|dearer by|higher by|lower by|more by|less by|gap of|difference of|premium of) (?:just |only |about |roughly |around )?)(?:¥|\\$)${N}( (?:in year one|up front|the first year|in the first year))`, "ig"), (m, p, n, q) => `${p}${diff("first", m.includes("$") ? "usd" : "cny")}${q}`],
        // sums: 「registering both costs under ¥100 in year one」「together still under $45/yr」「register both — $70/yr」「the two renewals total about $59/yr」
        [new RegExp(`((?:registering both|register both|both together|together|the two renewals total|two renewals total)[^.;]{0,20}?(?:—\\s*)?(?:costs? |still |come to |run |runs )?)(?:under|about|little more than|roughly|around|just under|just over)?\\s*(?:¥|\\$)${N}( in year one| up front)`, "ig"), (m, p, n, q) => `${p}about ${sum("first", m.includes("$") ? "usd" : "cny")}${q}`],
        [new RegExp(`((?:registering both|register both|both together|together|the two renewals total|two renewals total)[^.;]{0,20}?(?:—\\s*)?(?:costs? |still |come to |run |runs )?)(?:under|about|little more than|roughly|around|just under|just over)?\\s*(?:¥|\\$)${N}((?:\\/yr|\\/year| a year| per year)?)`, "ig"), (m, p, n, q) => `${p}about ${sum("renew", m.includes("$") ? "usd" : "cny")}${q}`],
        // 「renewals differ by only about $6/yr」
        [new RegExp(`((?:renewals?|renewal prices?) differ by (?:only |just |about |roughly |around )*)(?:¥|\\$)${N}((?:\\/yr|\\/year| a year| per year)?)`, "ig"), (m, p, n, q) => `${p}${diff("renew", m.includes("$") ? "usd" : "cny")}${q}`],
        // 「the renewal gap is about $24/yr」「the $4/yr renewal gap」
        [new RegExp(`((?:renewal gap|gap) (?:is|runs|comes to) (?:about |roughly |around |only |just )?)(?:¥|\\$)${N}((?:\\/yr|\\/year| a year| per year)?)`, "ig"), (m, p, n, q) => `${p}${diff("renew", m.includes("$") ? "usd" : "cny")}${q}`],
        [new RegExp(`(the )(?:¥|\\$)${N}((?:\\/yr|\\/year| a year| per year)? renewal gap)`, "ig"), (m, p, n, q) => `${p}${diff("renew", m.includes("$") ? "usd" : "cny")}${q}`],
        // renewal / yearly difference
        [new RegExp(`(renews? (?:at |for )?(?:about |roughly |around |just |only )?)(?:¥|\\$)${N}( (?:a year|per year|\\/yr|\\/year) (?:below|above|more|less|cheaper|higher|lower|apart|extra))`, "ig"), (m, p, n, q) => `${p}${diff("renew", m.includes("$") ? "usd" : "cny")}${q}`],
        [new RegExp(`((?:about |roughly |around |just |only |by )?)(?:¥|\\$)${N}((?:\\/yr|\\/year| a year| per year) (?:below|above|more|less|cheaper|higher|lower|apart|extra|dearer)(?: (?:on a long hold|at renewal|to renew|on renewal|to hold))?)`, "ig"), (m, p, n, q) => `${p}${diff("renew", m.includes("$") ? "usd" : "cny")}${q}`],
        [new RegExp(`((?:saves?|saving|save you|differ by|differ only|differ just|differ|differing by|cheaper by|dearer by|higher by|lower by|more by|less by|gap of|difference of|premium of) (?:just |only |about |roughly |around )?)(?:¥|\\$)${N}((?:\\/yr|\\/year| a year| per year| annually| each year| every year)?)(?! (?:in year one|up front|the first year|in the first year))`, "ig"), (m, p, n, q) => `${p}${diff("renew", m.includes("$") ? "usd" : "cny")}${q}`],
        [new RegExp(`((?:about |roughly |around |just |only )?)(?:¥|\\$)${N}( (?:more|less|cheaper|higher|lower|apart|extra|dearer) (?:every year|a year|per year|each year|to renew|at renewal|on renewal))`, "ig"), (m, p, n, q) => `${p}${diff("renew", m.includes("$") ? "usd" : "cny")}${q}`],
      ];
  for (const [re, fn] of rules) {
    const before = out;
    out = out.replace(re, (...args) => fn(...args.slice(0, -2)));
    if (out !== before) autoDerived += 1;
  }
  return out;
}


/** 比值/倍数表述 → {{ratio}}/{{jump}}，「一半」类 → 定性措辞（方向稳定：只在两侧差距 ≥2× 的页面出现） */
const CN_NUM = "(?:[两二三四五六七八九十]+|\\d+(?:\\.\\d+)?)";
const EN_NUM = "(?:twice|double|triple|(?:two|three|four|five|six|seven|eight|nine|ten|fifteen|twenty) times|\\d+(?:\\.\\d+)? ?times|\\d+(?:\\.\\d+)?x)";
let autoRatio = 0;
const ratioManual = [];
function ratioRewrite(sentence, { lang, a, b, field, subjTld, prevTld, slug }) {
  const pickSide = /^pickA/.test(field) ? a : /^pickB/.test(field) ? b : null;
  const named = [...new Set([...sentence.matchAll(new RegExp(`\\.(${T})(?![a-z])`, "g"))].map((m) => m[1]).filter((t) => t === a || t === b))];
  // 主语优先级：pick 侧 > 句首「.x」 > 匹配位置之前最近的 {{price:x}} 占位 > 句内唯一点名 > 段落主语 > 上一句 TLD
  const headTld = (() => { const m = new RegExp(`^\\s*\\.(${T})(?![a-z])`).exec(sentence); return m && (m[1] === a || m[1] === b) ? m[1] : null; })();
  let cursorBefore = "";
  const lastPh = () => { let t = null; for (const m of cursorBefore.matchAll(/\{\{price:([a-z.]+):/g)) if (m[1] === a || m[1] === b) t = m[1]; return t; };
  // 「.ai renews at about …」「.buzz 首年与续费相差…」：匹配位置前 30 字内紧邻的「.x + 谓语」是本句主语
  const nearSubj = () => {
    const m = (lang === "zh" ? /\.([a-z][a-z0-9.-]*[a-z0-9])(?![a-z])\s*(?:的)?(?:续费|首年|价格|长期成本|注册)[^。；]{0,12}$/ : /\.([a-z][a-z0-9.-]*[a-z0-9])(?![a-z])(?:'s|’s)?\s+(?:renews|renewal|renewals|costs|is|runs|sits|holds|charges|comes|promo-to-renewal|first-year|renewal is|renews at)\b[^.;]{0,28}$/i).exec(cursorBefore);
    return m && (m[1] === a || m[1] === b) ? m[1] : null;
  };
  // 匹配位置之前句内最后点名的 .x（不含 coffee.shop 之类示例域名，不含「约为 .x 的」比较对象——比较对象已被正则吃掉）
  const lastMention = () => {
    let t = null;
    for (const m of cursorBefore.matchAll(/(^|[^a-z0-9])\.([a-z][a-z0-9.-]*[a-z0-9])(?![a-z])/g)) if (m[2] === a || m[2] === b) t = m[2];
    return t;
  };
  const subject = () => pickSide ?? nearSubj() ?? headTld ?? lastMention() ?? lastPh() ?? subjTld ?? (named.length === 1 ? named[0] : null) ?? prevTld;
  const refRenew = (t) => { const s = tldPrice(t); const lp = live[t]; return lp ? lp.renewal : s ? toUsd(s.renew) : 0; };
  const refFirst = (t) => { const s = tldPrice(t); const lp = live[t]; return lp ? lp.registration : s ? toUsd(s.first) : 0; };
  const hiLo = (f) => { const ra = f === "first" ? refFirst(a) : refRenew(a); const rb = f === "first" ? refFirst(b) : refRenew(b); return ra >= rb ? [a, b] : [b, a]; };
  const NONPRICE = lang === "zh" ? /(注册量|体量|人口|市场|游客|科研|规模|数量|存量)[^。；，]{0,8}$/ : /(registrations|market|residents|population|size|larger|hits|users|speakers)\s*[^.;,]{0,12}$/i;
  const NONPRICE_AFTER = lang === "zh" ? /^[^。；，]{0,6}(注册量|体量|人口|市场|游客|规模|数量|存量)/ : /^[^.;,]{0,14}(registration base|registrations|market|residents|population|users|speakers)/i;
  let out = sentence;
  let touched = 0;
  const rep = (re, fn) => {
    out = out.replace(re, (...args) => {
      const m = args[0];
      const idx = args[args.length - 2];
      const str = args[args.length - 1];
      if (NONPRICE.test(str.slice(Math.max(0, idx - 24), idx))) return m;
      if (NONPRICE_AFTER.test(str.slice(idx + m.length, idx + m.length + 30))) return m;
      cursorBefore = str.slice(0, idx);
      const r = fn(...args.slice(0, -2), str.slice(Math.max(0, idx - 24), idx));
      if (r == null) return m;
      touched += 1;
      return r;
    });
  };
  const needX = (fn) => (...args) => { const x = subject(); if (!x) { ratioManual.push({ slug, lang, field, raw: args[0], sentence }); return null; } return fn(x, ...args); };
  // 前文 24 字内最后出现的项别词决定 first/renew（「首年更便宜但续费约为 .review 的 N 倍」→ renew）
  const fieldOf = (pre) => {
    const F = lang === "zh" ? /首年|注册|第一年/g : /first|register|registration|year one|up front/gi;
    const R = lang === "zh" ? /续费|长期|持有/g : /renew|hold|long-term/gi;
    pre = pre.replace(/首年(?:的|价的)?\s*\{\{jump:[^}]*\}\}/g, "").replace(/\{\{jump:[^}]*\}\}\s*(?:the )?(?:intro|first-year|year-one|first year) price/gi, "");
    const last = (re) => { let i = -1; for (const m of pre.matchAll(re)) i = m.index; return i; };
    const f = last(F), r = last(R);
    return f >= 0 && f > r ? "first" : "renew";
  };
  if (lang === "zh") {
    // jump（同一 TLD 续费 ÷ 首年）
    rep(new RegExp(`续费(?:却|则|也|又|还|会)?(?:是|约为|约是|回到|回升到|跳到|翻到|接近|近|约)?(?:约|近)?首年(?:的|价的)?\\s*${CN_NUM}\\s*倍(?:多|以上|左右|级)?`, "g"), needX((x) => `续费约为首年的 {{jump:${x}}}`));
    rep(new RegExp(`续费(?:约)?\\s*${CN_NUM}\\s*倍于首年`, "g"), needX((x) => `续费约为首年的 {{jump:${x}}}`));
    rep(new RegExp(`首年(?:促销)?(?:与|和)续费(?:差|相差|差距)(?:近|约|了)?\\s*${CN_NUM}\\s*倍(?:以上|多)?`, "g"), needX((x) => `首年与续费相差约 {{jump:${x}}}`));
    rep(new RegExp(`首年便宜(?:、|，)?续费贵\\s*${CN_NUM}\\s*倍`, "g"), needX((x) => `首年便宜、续费约为首年的 {{jump:${x}}}`));
    rep(new RegExp(`续费(?:近|约)?\\s*${CN_NUM}\\s*倍跳档`, "g"), needX((x) => `续费约 {{jump:${x}}} 跳档`));
    rep(new RegExp(`续费按\\s*${CN_NUM}\\s*倍价核算`, "g"), needX((x) => `续费按首年约 {{jump:${x}}} 的价核算`));
    rep(new RegExp(`是\\s*${CN_NUM}\\s*倍跳涨`, "g"), needX((x) => `约为首年 {{jump:${x}}} 的跳涨`));
    rep(new RegExp(`续费(?:回升|翻|跳|涨)(?:约|近)?\\s*${CN_NUM}\\s*倍`, "g"), needX((x) => `续费回升约 {{jump:${x}}}`));
    rep(new RegExp(`约首年\\s*${CN_NUM}\\s*倍`, "g"), needX((x) => `约首年 {{jump:${x}}}`));
    rep(new RegExp(`首年低续费翻\\s*${CN_NUM}\\s*倍`, "g"), needX((x) => `首年低、续费约为首年的 {{jump:${x}}}`));
    // ratio（点名对方 TLD）
    rep(new RegExp(`(续费|长期持有成本|长期成本|持有成本|成本|价格|年费)?(?:却|则|也|还|几乎|接近|近)?(?:是|约为|约是|为|接近|近|几乎是|约)\\s*\\.(${T})\\s*(?:的|续费的|价格的)?\\s*${CN_NUM}\\s*倍(?:多|以上|左右)?`, "g"), (m, lead, y, pre) => {
      if (y !== a && y !== b) return null;
      const x = sideOf(y, a, b);
      return `${lead ?? ""}约为 .${y} 的 {{ratio:${x}:${y}:${fieldOf(pre + (lead ?? ""))}}}`;
    });
    // 对称差距
    rep(new RegExp(`(两者|两边|两侧)?(续费|价格|价|长持成本|账本|长期成本)?(?:差距|相差|价差|差)(?:是|近|约|了|达)?\\s*${CN_NUM}\\s*倍(?:级|以上|多)?`, "g"), (m, who, lead, pre) => {
      const f = fieldOf(pre);
      const [hi, lo] = hiLo(f);
      return `${who ?? ""}${lead ?? ""}相差约 {{ratio:${hi}:${lo}:${f}}}`;
    });
    rep(new RegExp(`${CN_NUM}\\s*倍价差`, "g"), () => { const [hi, lo] = hiLo("renew"); return `约 {{ratio:${hi}:${lo}:renew}} 的价差`; });
    // 便宜 N 倍（主语更便宜）
    rep(new RegExp(`便宜(?:近|约)?\\s*${CN_NUM}\\s*倍`, "g"), needX((x) => `便宜得多（相差约 {{ratio:${sideOf(x, a, b)}:${x}:renew}}）`));
    // 一半类 → 定性
    rep(new RegExp(`比\\s*\\.(${T})\\s*贵一半`, "g"), (m, y) => (y === a || y === b ? `明显高于 .${y}` : null));
    rep(new RegExp(`(?:不到|只有|约为|仅约|约|仅)\\s*\\.(${T})\\s*(?:的)?一半(?:左右|不到|上下|以上)?`, "g"), (m, y) => (y === a || y === b ? `明显低于 .${y}` : null));
    rep(/便宜(?:近|约)?一半(?:以上|不到|左右)?/g, () => "便宜得多");
    rep(/省一半以上/g, () => "省得多");
    rep(/低一半续费/g, () => "低得多的续费");
    rep(/价格只有一半/g, () => "价格明显更低");
    // 分之几 / 几成 → 定性（比值随实时价漂移，表内已有两侧数字）
    const FRAC = "(?:[二三四五六七八九十]分之[一二三]强?|[两三四五六七八九]成(?:左右|多)?|四分之一)";
    rep(new RegExp(`(不到|约为|只有|仅|也只有|也只有|成本只有|价格也只有)\\s*\\.(${T})\\s*(?:的)?(?:续费的)?\\s*${FRAC}`, "g"), (m, lead, y) => (y === a || y === b ? `${/不到|只有|仅/.test(lead) ? lead.replace(/不到|只有|仅|约为/, "远低于") : "远低于"} .${y}` : null));
    rep(new RegExp(`(高出|高|低)\\s*\\.(${T})\\s*约?\\s*${FRAC}`, "g"), (m, verb, y) => (y === a || y === b ? `${verb === "低" ? "低于" : "高于"} .${y} 不少` : null));
    rep(new RegExp(`比\\s*\\.(${T})\\s*(便宜|低|高出|高|贵)约?\\s*${FRAC}`, "g"), (m, y, verb) => (y === a || y === b ? `比 .${y} ${verb}不少` : null));
    rep(new RegExp(`(续费|首年|两头都比 \\.[a-z]+ 便宜、续费|成本)(也)?(便宜|低|高|贵)约?\\s*${FRAC}`, "g"), (m, lead, ye, verb) => `${lead}${ye ?? ""}${verb}不少`);
    rep(/续费翻倍/g, () => "续费明显上跳");
  } else {
    const FOLLOW = "(?:the rate|the price|the cost|the renewal rate)(?: up front| in year one)?";
    // 「renewals differ more than threefold ($X vs $Y/yr)」「a sixfold price gap ($X vs $Y)」：括号已给两侧价 → 定性
    const FOLD = "(?:two|three|four|five|six|seven|eight|nine|ten)fold";
    rep(new RegExp(`(promo-to-renewal gap|first-year-to-renewal gap|intro-to-renewal gap) (runs|is) (?:nearly |about |roughly |over |almost )?${EN_NUM}`, "gi"), needX((x, m, noun, verb) => `${noun} ${verb} about {{jump:${x}}}`));
    rep(new RegExp(`differ (?:more than|nearly|almost|about|roughly|over|by) ${FOLD} \\(`, "gi"), () => "differ sharply (");
    rep(new RegExp(`a ${FOLD} price gap \\(`, "gi"), () => "a wide price gap (");
    rep(new RegExp(`\\.(${T})'s first-year and renewal prices differ (?:more than|nearly|almost|about|roughly) ${FOLD}`, "gi"), (m, y) => (y === a || y === b ? `.${y}'s renewal is about {{jump:${y}}} its first-year price` : null));
    // jump
    rep(new RegExp(`(?:about |roughly |almost |nearly |over |more than |up to )*${EN_NUM}(?:-plus)? (that|year one|the first year|the first-year price|the intro(?: price)?|the teaser|its promo price|the promo|the promo price)`, "gi"), needX((x, m, follow) => `about {{jump:${x}}} ${follow}`));
    rep(new RegExp(`(a |the )?~?${EN_NUM}(?:-plus)? (renewal )?(jump|gap)(?! (?:is|runs|between))`, "gi"), needX((x, m, art, ren, noun) => `${art ?? ""}roughly {{jump:${x}}} ${ren ?? ""}${noun}`));
    // symmetric gap between the two TLDs
    rep(new RegExp(`(renewal gap|renewal difference|gap) (is|runs) (?:nearly |over |about |roughly |more than )?${EN_NUM}`, "gi"), (m, lead, verb) => { const [hi, lo] = hiLo("renew"); return `${lead} ${verb} about {{ratio:${hi}:${lo}:renew}}`; });
    rep(new RegExp(`renewals differ (?:by )?(?:nearly |over |about |more than |roughly )?${EN_NUM}`, "gi"), () => { const [hi, lo] = hiLo("renew"); return `renewals differ by about {{ratio:${hi}:${lo}:renew}}`; });
    // ratio naming the other TLD
    rep(new RegExp(`(?:at |about |roughly |almost |nearly |over |more than |just under |around )*${EN_NUM} (?:the (?:rate|price|cost) of |the renewal of )?\\.(${T})('s)?( (?:renewal|price|cost|holding cost|long-term cost|rate|renewal price|long-term))?`, "gi"), (m, y, poss, suffix, pre) => {
      if (y !== a && y !== b) return null;
      const x = sideOf(y, a, b);
      const f = /renewal/i.test(suffix ?? "") ? "renew" : /up front|year one|first year|to register/i.test(m) ? "first" : fieldOf(pre);
      return `about {{ratio:${x}:${y}:${f}}} .${y}${poss ?? ""}${suffix ?? ""}`;
    });
    rep(new RegExp(`(?:at |about |roughly |almost |nearly |over |more than |around )*${EN_NUM} ${FOLLOW}`, "gi"), needX((x, m, pre) => `about {{ratio:${x}:${sideOf(x, a, b)}:${/up front|year one|first year|to register/i.test(m) ? "first" : fieldOf(pre)}}} ${/the [a-z ]+$/i.exec(m)[0]}`));
    // N times cheaper (subject is the cheaper one)
    rep(new RegExp(`(?:nearly |about |roughly )?${EN_NUM} cheaper`, "gi"), needX((x) => `about {{ratio:${sideOf(x, a, b)}:${x}:renew}} cheaper`));
    // half family → qualitative
    rep(new RegExp(`half again \\.(${T})(?:'s)?`, "gi"), (m, y) => (y === a || y === b ? `well above .${y}${m.endsWith("'s") ? "'s" : ""}` : null));
    rep(new RegExp(`(?:under|less than|nearly|roughly|about|at|only|just) half (?:of |the price of |the cost of |the holding cost of |the renewal of )?\\.(${T})(?:'s)?`, "gi"), (m, y) => (y === a || y === b ? `well below .${y}${m.endsWith("'s") ? "'s" : ""}` : null));
    rep(new RegExp(`(?:roughly |about |at little more than |only |little more than )?a third of \\.(${T})(?:'s)?`, "gi"), (m, y) => (y === a || y === b ? `well below .${y}${m.endsWith("'s") ? "'s" : ""}` : null));
    rep(/(renews|costs|holds|lands|runs|is|renewal|renewing|renew|cost|hold) ((?:at |for |in at |still |it )?)(?:under|less than|nearly|roughly|about) half(?! the length| a billion| the world| of Africa| will)(?: the price| the cost| as much| the renewal| the holding cost)?/gi, (m, v, mid) => `${v} ${mid}far less`);
  }
  if (touched) autoRatio += touched;
  return out;
}

const manual = [];
let auto = 0;
let autoUsd = 0;
let drift = 0;
const driftLog = [];
const factLog = [];

/** zh 中文数词整百金额（「两百元档」「一两百元」「三四百元核算」）→ 阿拉伯数字，走同一套归属/占位流程 */
const CN_DIGIT = { 一: 1, 两: 2, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9 };
const normalizeCnAmounts = (s) =>
  s.replace(/([一两二三四五六七八九])([两二三四五六七八九])?百多?元/g, (m, d1, d2) => (d2 ? `${CN_DIGIT[d1] * 100}～${CN_DIGIT[d2] * 100} 元` : `${CN_DIGIT[d1] * 100} 元`));

/** 处理一段正文（字符串字面量内容，已 unescape），返回替换后的文本 */
const overrideHits = new Map();
function applyOverrides(text, slug, lang) {
  for (const [s, l, from, to] of OVERRIDES) {
    if (s !== slug || l !== lang) continue;
    const idx = text.indexOf(from);
    if (idx < 0) continue;
    if (text.indexOf(from, idx + 1) >= 0) throw new Error(`override 命中多次：${slug} ${lang} ${from}`);
    text = text.slice(0, idx) + to + text.slice(idx + from.length);
    overrideHits.set(`${s}|${l}|${from}`, (overrideHits.get(`${s}|${l}|${from}`) ?? 0) + 1);
  }
  return text;
}
function transform(text, { lang, a, b, slug, field }) {
  text = applyOverrides(text, slug, lang);
  let out = "";
  let cursor = 0;
  let prevTld = null;
  let prevSolo = false;
  let subjTld = null;
  for (const rawSentence of splitSentences(text, lang)) {
    const lead = /^\s*\.([a-z][a-z0-9.-]*[a-z0-9])(?![a-z])/.exec(rawSentence) ?? /(?:→|->)\s*\.([a-z][a-z0-9.-]*[a-z0-9])(?![a-z])\s*[:：]/.exec(rawSentence);
    if (lead && (lead[1] === a || lead[1] === b)) subjTld = lead[1];
    const start = text.indexOf(rawSentence, cursor);
    out += text.slice(cursor, start);
    cursor = start + rawSentence.length;
    const pickSide = /^pickA/.test(field) ? a : /^pickB/.test(field) ? b : null;
    const sentence = ratioRewrite(derivedRewrite(lang === "zh" ? normalizeCnAmounts(rawSentence) : rawSentence, { lang, a, b, field, subjTld, prevTld }), { lang, a, b, field, subjTld, prevTld, slug });
    let res = sentence;
    let offset = 0;
    for (const m of [...sentence.matchAll(NUM[lang])]) {
      const raw = m[0];
      const isUsd = raw.trim().startsWith("$");
      if (isFactNumber(lang, sentence, m.index, raw.length)) { factLog.push({ slug, lang, field, raw, sentence }); continue; }
      const value = Number((m[1] ?? m[3] ?? m[5]).replace(/,/g, ""));
      const hiRaw = m[2] ?? m[4] ?? m[6];
      const hi = hiRaw ? Number(hiRaw.replace(/,/g, "")) : null;
      const pos = m.index + offset;
      const before = out + res.slice(0, pos);
      const after = res.slice(pos + raw.length);
      const r = attribute({ lang, sentence, before, beforeSent: res.slice(0, pos), after, value, hi, currency: isUsd ? "usd" : "cny", a, b, prevTld, subjTld, prevSolo, pickSide });
      if (!r.tld && !r.pair) {
        manual.push({ slug, lang, field, raw, reason: r.fail, sentence });
        continue;
      }
      const ph = r.pair ? `{{pair:${a}:${b}:${r.kind}:${isUsd ? "usd" : "cny"}}}` : `{{price:${r.tld}:${r.kind}:${isUsd ? "usd" : "cny"}}}`;
      // en 「around $25–30」→ around {{…}}；zh 「259 元」→ 占位含单位；「(≈¥260)」去掉手写 ≈（静态回落时由渲染层加）
      let head = res.slice(0, pos);
      if (r.conv) {
        const st = /(≈|~|约\s?)$/.exec(head);
        if (st) { head = head.slice(0, -st[0].length); offset -= st[0].length; }
      } else {
        const st = /(≈|~)$/.exec(head);
        if (st) { head = head.slice(0, -st[0].length); offset -= st[0].length; }
      }
      // 「under $20」「不到 900 元」：上下界措辞对占位无意义 → 「about / 约」
      const bound = lang === "zh" ? /(不到|不足|至多|最多|超过|高达)\s*$/ : /\b(under|below|over|at least|up to|just under|just over|little more than|no more than)\s+$/i;
      const bm = bound.exec(head);
      if (bm) {
        const rep = lang === "zh" ? "约 " : "about ";
        head = head.slice(0, bm.index) + rep;
        offset += rep.length - bm[0].length;
      }
      res = head + ph + res.slice(pos + raw.length);
      offset += ph.length - raw.length;
      auto += 1;
      if (isUsd) autoUsd += 1;
      if (r.drift) { drift += 1; driftLog.push({ slug, lang, field, raw, ph, sentence, rule: r.rule }); }
    }
    const ms = [...sentence.matchAll(/\.([a-z][a-z0-9.-]*[a-z0-9])(?![a-z])/g)].map((x) => x[1]).filter((t) => t === a || t === b);
    if (ms.length) { prevTld = ms[ms.length - 1]; prevSolo = new Set(ms).size === 1; }
    out += res;
  }
  return rewordReference(out + text.slice(cursor), lang);
}

/**
 * 「站内参考价 / the site's reference table」原指 TLD_PRICES 静态表；占位改为与本页价格表同源（实时价优先）后，
 * 措辞改成指向本页价格表；无实时价时占位渲染自带 ≈（与表格「参考价」标注同义）。
 */
function rewordReference(text, lang) {
  if (lang === "zh") {
    return text
      .replace(/按站内参考价，/g, "按本页价格表，")
      .replace(/站内参考价也反映/g, "本页价格表也反映")
      .replace(/站内参考价里/g, "本页价格表里")
      .replace(/站内参考价都在/g, "在本页价格表里都在")
      .replace(/站内参考价(低于|高于|略高于|略低于|处于)/g, "在本页价格表里$1")
      .replace(/站内参考价\s*(?=首年|\.[a-z])/g, "按本页价格表，");
  }
  return text
    .replace(/([Tt])he site's reference table (lists|shows)/g, "$1he price table below $2")
    .replace(/([Tt])he reference table lists/g, "$1he price table below lists")
    .replace(/in the site's reference table/g, "in the price table below")
    .replace(/([Tt])he site's reference table/g, "$1he price table below");
}

// —— 逐行处理源码：跟踪 slug/a/b/lang，只改 verdict 与 pick 字符串字面量 ——
const src = readFileSync(file, "utf8");
const lines = src.split("\n");
let slug = null, a = null, b = null, lang = null, pendingField = null;
const unescape = (s) => s.replace(/\\"/g, '"').replace(/\\\\/g, "\\");
const escape = (s) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
const outLines = lines.map((line) => {
  let m;
  if ((m = /^  "([a-z0-9.-]+)": \{$/.exec(line))) { slug = m[1]; a = b = null; lang = null; return line; }
  if ((m = /^    a: "([^"]+)",$/.exec(line))) { a = m[1]; return line; }
  if ((m = /^    b: "([^"]+)",$/.exec(line))) { b = m[1]; return line; }
  if ((m = /^    (zh|en): \{$/.exec(line))) { lang = m[1]; return line; }
  if (!slug || !lang) return line;
  if ((m = /^      verdict:\s*$/.exec(line))) { pendingField = "verdict"; return line; }
  if ((m = /^      verdict:\s*"(.*)",$/.exec(line))) {
    return `      verdict: "${escape(transform(unescape(m[1]), { lang, a, b, slug, field: "verdict" }))}",`;
  }
  if (pendingField && (m = /^        "(.*)",$/.exec(line))) {
    const f = pendingField; pendingField = null;
    return `        "${escape(transform(unescape(m[1]), { lang, a, b, slug, field: f }))}",`;
  }
  if ((m = /^      (pickA|pickB): \[(.*)\],$/.exec(line))) {
    const field = m[1];
    const items = [];
    const re = /"((?:[^"\\]|\\.)*)"/g;
    let x;
    let i = 0;
    while ((x = re.exec(m[2]))) {
      items.push(`"${escape(transform(unescape(x[1]), { lang, a, b, slug, field: `${field}[${i}]` }))}"`);
      i += 1;
    }
    return `      ${field}: [${items.join(", ")}],`;
  }
  return line;
});

const result = outLines.join("\n");
{
  const bad = OVERRIDES.filter(([s, l, from]) => (overrideHits.get(`${s}|${l}|${from}`) ?? 0) !== 1);
  if (bad.length) throw new Error(`override 未命中：\n${bad.map(([s, l, from]) => `  ${s} ${l} ${from}`).join("\n")}`);
}
if (write) writeFileSync(outFile, result);
if (manualFile) {
  const byReason = new Map();
  for (const x of manual) byReason.set(x.reason.split(" ")[0], (byReason.get(x.reason.split(" ")[0]) ?? 0) + 1);
  const md = [
    `# R549 codemod 人工清单（${manual.length} 个数字）`,
    "",
    ...[...byReason.entries()].map(([k, v]) => `- ${k}: ${v}`),
    "",
    ...manual.map((x) => `- **${x.slug}** ${x.lang} ${x.field} \`${x.raw}\`（${x.reason}）：${x.sentence}`),
    "",
  ].join("\n");
  writeFileSync(resolve(root, manualFile), md);
  writeFileSync(resolve(root, manualFile.replace(/\.md$/, "-ratio.md")), [
    `# 比值表述无法确定主语，需人工（${ratioManual.length}）`,
    "",
    ...ratioManual.map((x) => `- **${x.slug}** ${x.lang} ${x.field} \`${x.raw}\`：${x.sentence}`),
    "",
  ].join("\n"));
  writeFileSync(resolve(root, manualFile.replace(/\.md$/, "-fact.md")), [
    `# 事实/政策金额，保留不动（${factLog.length}）`,
    "",
    ...factLog.map((x) => `- **${x.slug}** ${x.lang} ${x.field} \`${x.raw}\`：${x.sentence}`),
    "",
  ].join("\n"));
  writeFileSync(resolve(root, manualFile.replace(/\.md$/, "-drift.md")), [
    `# 值不吻合但结构归属确定（${driftLog.length}）`,
    "",
    ...driftLog.map((x) => `- **${x.slug}** ${x.lang} ${x.field} \`${x.raw}\` → \`${x.ph}\`（${x.rule}）：${x.sentence}`),
    "",
  ].join("\n"));
}
console.log(`auto ${auto}（usd ${autoUsd}，其中数值已漂移出 ${TOL * 100}% 容差 ${drift}）+ derived ${autoDerived} + ratio ${autoRatio}；manual ${manual.length} + ratioManual ${ratioManual.length}；${write ? "written" : "dry-run"}`);
