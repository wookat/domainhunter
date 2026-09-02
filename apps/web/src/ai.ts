import { isBrandCollision } from "./brand-blocklist";
import { COMMON_CHAR_PINYIN_DATA } from "./pinyin-table";
import { TLD_LIST } from "./content/tld-list";

export interface AiScores {
  length: number;
  readability: number;
  relevance: number;
  brandability: number;
}

export type AiTheme = "pinyin" | "word" | "coined" | "blend";

const THEMES = new Set<string>(["pinyin", "word", "coined", "blend"]);
export const AI_THEMES: ReadonlySet<string> = THEMES;

export interface AiCandidate {
  label: string;
  meaning: string;
  theme?: AiTheme;
  scores: AiScores;
}

// meaning 质量红线（R179）：首轮 system prompt 与反思轮 refine hint 共享同一份文案，避免措辞漂移
const MEANING_REDLINES_ZH = `- meaning 必须是定稿文案：一次成稿、语气笃定、语法通顺；禁止问号式犹豫、禁止「其实/等等」式自我修正、禁止括号内猜测拆词；对寓意拆解没把握，就换一个你能笃定解释的候选
  好例子：「木舟」muzhou，双字全拼，寓意稳载远行，声调平缓，读一遍就能拼出来
  坏例子：murory，可能是 mu(木?)+rory？也许取自某个人名（不太确定）
- 词源/拆字必须真实：只引用真实存在的汉字、英文单词或词根，禁止臆造不存在的词充当词源；禁止引用 label 中不存在的字母或音节（label 里没有 z 就不能说 z 取自某词）
- meaning 只使用中文与英文书写，禁止混入韩文、日文假名、西里尔字母、IPA 音标等其他文字
- 禁止在 meaning 里用括号（()（）[]【】）内嵌拆字/注音/补充解释；拆字与寓意必须融进一句通顺的定稿文案直接说清
  好例子：「慕远」muyuan，mu 取「慕」的向往、yuan 取「远」的辽阔，寓意心怀远方，全拼顺口好记
  坏例子：「慕远」mu(慕:向往)加yuan【远】，寓意远行（大概）
- meaning 是给用户看的品牌寓意文案，禁止出现命名路线分类元词（blend/coined/portmanteau/造词/混搭/拼音路线 等中英元词）与「这是一个…名字」「这个名字属于…」类元话术；直接讲寓意与读法本身
- 声称的词源拆解必须与 label 拼写逐字吻合：说「X 与 Y 结合」时，X、Y 的拼写片段必须真实出现在 label 中（plangrow 只能说 plan 与 grow 结合，不能说 play 与 grow；label 不含 beix 对应拼音就不能声称拼音变体）`;

const MEANING_REDLINES_EN = `- meaning must be final copy: one polished, confident, grammatical sentence; no question-mark hedging (like "lo(quacious?)"), no "Actually…" self-correction, no parenthetical guessed splits; if unsure about the etymology, swap in a candidate you can explain with confidence
- Etymology must be real: only cite words, roots, or fragments that actually exist — never invent a fake source word (no "winards", no "brósene"); never cite a letter or fragment that is not present in the label (if the label has no z, do not claim "z from zeus")
- Write meaning in plain English only: no IPA phonetic symbols, no non-Latin scripts
- Never embed parenthetical annotations — (), （）, [], 【】 — inside meaning for letter-splitting, phonetic glosses, or side notes; fold the gloss into one polished sentence instead (write Latin "lumen" meaning light, not "lumen (light)")
- meaning is user-facing brand copy: never include naming-route category words (blend, coined, portmanteau) or meta phrasing like "this is a blend" / "this name is a coined word"; describe the meaning and sound directly
- Any claimed word split must match the label's spelling letter for letter: if you say "X + Y", the fragments of X and Y must actually appear in the label (plangrow can only be plan + grow, never play + grow)`;

const SYSTEM_PROMPT = `你是资深域名命名专家。用户会用自然语言描述想要的域名寓意/主题/口味，你负责发散出尽可能优质的域名主体（不含 TLD）。

要求：
- 多路发散：中文拼音（全拼/双拼/缩写）、贴切的英文单词、英文合成词/造词、拼音+英文混合
- 优先短（3-10 字符）、好记、好读、有品牌感；避免连字符和数字（除非寓意需要）
- 只输出小写字母组成的合法域名主体
- 常见单词、两三个字母的组合几乎都已被注册，要敢于造词、混搭、用冷僻但好读的组合
- 按推荐度排序
- 给每个候选标注命名思路 theme，取值只能是：pinyin（中文拼音/缩写）、word（现成英文单词）、coined（英文合成词/造词）、blend（拼音+英文混合）
- theme 标注反例（不要犯）：word 仅限现代英文词典里日常在用的常用词——拉丁语/古语词（如 nundina，源自拉丁 nundinae）不是 word，应标 coined；label 内嵌 TLD 名的造型（如 canaryio 内嵌 io，组成 canaryio.com 观感怪异）与同词根叠拼（如 ledgeledger）都是低质造型，直接不要输出
- 同时给每个候选打四维分（0-100 整数）：length（长度，越短越好记分越高）、readability（读感，好读好拼）、relevance（寓意贴合需求程度）、brandability（品牌感，独特性与可商标性）
${MEANING_REDLINES_ZH}

严格输出 JSON 数组，不要输出其他任何文字：
[{"label":"域名主体","meaning":"一句话说明寓意与读法","theme":"coined","scores":{"length":90,"readability":85,"relevance":88,"brandability":80}}]`;

/** 用户点踩的候选（label + 命名思路），refine 轮据此规避同风格 */
export interface DislikedItem {
  label: string;
  theme?: AiTheme;
}

/** refine 轮反馈：跨轮去重 + 被注册名的模式总结素材 */
export interface RefineFeedback {
  /** 已核验过的全部主体（无论结果），refine 轮严禁重复输出 */
  tried: string[];
  /** 其中已被注册的主体 */
  taken: string[];
  /** 被注册主体的命名思路分布（仅统计已知 theme 的） */
  takenThemes: Partial<Record<AiTheme, number>>;
  /** 用户点踩的候选（可选，旧 payload 无此字段） */
  disliked?: DislikedItem[];
}

const ZH_PINYIN_HINT = `

拼音候选强化（用户是中文创业者，拼音系候选质量优先）：
- 路线配额硬要求：每轮候选中 theme 为 pinyin 或 blend 的合计必须 ≥40%（如 24 个候选中至少 10 个），其余才是 word/coined；不足配额视为不合格输出
- 三种拼音路线都要覆盖，每种至少 2 个：① 简短双字拼（哔哩哔哩 bilibili、知乎 zhihu、豆瓣 douban 式，追求双拼声调节奏与叠音美感）；② 全拼（小红书 xiaohongshu 式，寓意完整直白）；③ 声母缩写或拼音+英文混搭（zlz、tao+bao+hub 式，短而有记忆点）
- 每个 theme 为 pinyin 或 blend 的候选，meaning 必须包含用「」括起的中文原词，并说明为什么这个拼音好读好记（如声调顺口、叠音、无歧义拼读），例如：「知舟」zhizhou，双字全拼，齿音开头声调上扬，读一遍就能拼出来
- 「」内的汉字必须优先用常用字（现代汉语常用 3500 字范围内的直觉），普通人看到拼音要能反推出汉字：木/舟/云/星/禾/悦/途 好，岑/蕨/飏/麓/隰/珩 这类生僻字不要；组词语义要自然（「木舟」「星河」好，「续夸」式牵强搭配不要）
- 拼音自筛淘汰标准（不达标的直接不要输出）：x/q/zh/c/s 等易歧义声母连串（老外读不出，如 xiqizhi）；超过 4 个音节；含 iu/ui、in/ing、an/ang 等易混易错拼写；整体拼读有多种可能切分产生歧义的组合`;

// ---------------- 偏拼音需求检测与变体拓宽（R247，R239 审计 P3-4） ----------------
// 生产观测：偏拼音需求（描述强调拼音/中文名）诱发模型集中输出双字全拼，而双字全拼
// .com/.cn 存量高度枯竭（zh2/zh3 均 5 轮仅猎得 1 个可注册）。检测到此类需求时在
// system prompt 追加拓宽指令，把变体空间从双字全拼扩到三字全拼/双拼缩合/混搭等。

const PINYIN_FOCUS_RE = /拼音|全拼|双拼|中文名|汉字名|声母|注音/;

/** 需求描述是否强调拼音/中文名（仅 zh 生效，由调用方保证） */
export function detectPinyinFocus(description: string): boolean {
  return PINYIN_FOCUS_RE.test(description);
}

export const ZH_PINYIN_BROADEN_HINT = `

偏拼音需求变体拓宽（检测到用户强调拼音/中文名）：双字全拼在 .com/.cn 下存量已高度枯竭，常见双字组合几乎全被注册。不要把候选集中在双字全拼上，请把变体空间拓宽到以下路线，双字全拼候选每轮不超过 1/3，其余名额分给：
- 三字全拼：三个常用字的自然组词（如「木星河」muxinghe 式），寓意完整且存量远比双字充裕
- 双拼缩合/声母缩合变体：在全拼基础上做紧凑缩合（如「知舟」→ zhizhou 之外再给 zhzhou、zzhou 式短变体），短而有记忆点
- 拼音+英文混搭：拼音词根接 hub/kit/lab/go 等轻量英文词（如 yunkit、taolab 式），theme 标 blend
- 叠音与轻改拼：叠音（momo 式）或在合法音节内做轻微改拼换取独特性，仍要好读可反推`;

// ---------------- 多轮低产出检测（R247，R239 审计 P3-4） ----------------
// 连续多轮可注册增量极低且用户只选了少量 TLD 时，提示用户勾选更多后缀或放宽命名
// 路线（只提示一次，不自动改用户的 TLD 选择）。

/** 触发提示需要的连续低产出轮数 */
export const LOW_YIELD_CONSECUTIVE_ROUNDS = 2;
/** 单轮可注册增量 ≤ 此值视为低产出 */
export const LOW_YIELD_MAX_GAIN = 1;
/** 已选 TLD 数 ≤ 此值才提示（选得多说明用户已自行拓宽，无需提示） */
export const LOW_YIELD_MAX_TLDS = 2;

/** roundGains：各轮可注册增量（按轮次顺序）；连续两轮增量 ≤1 且 TLD 少时返回 true */
export function isLowYield(roundGains: number[], tldCount: number): boolean {
  if (tldCount > LOW_YIELD_MAX_TLDS) return false;
  if (roundGains.length < LOW_YIELD_CONSECUTIVE_ROUNDS) return false;
  return roundGains.slice(-LOW_YIELD_CONSECUTIVE_ROUNDS).every((g) => g <= LOW_YIELD_MAX_GAIN);
}

// ---------------- 拼音合法性校验（R124） ----------------
// 合法无调拼音音节表（约 410 个），整理自《现代汉语词典》附录普通话音节表 /《汉语拼音方案》。
// 说明：ü 按域名习惯写作 v（lv/nv）或 ue（lue/nue），两种写法都收录；含少量口语音节（如 lo、dia、rua、den、kei、zhei、shei）。
const PINYIN_SYLLABLES = new Set<string>([
  // 零声母
  "a", "ai", "an", "ang", "ao", "e", "ei", "en", "eng", "er", "o", "ou",
  // b
  "ba", "bai", "ban", "bang", "bao", "bei", "ben", "beng", "bi", "bian", "biao", "bie", "bin", "bing", "bo", "bu",
  // p
  "pa", "pai", "pan", "pang", "pao", "pei", "pen", "peng", "pi", "pian", "piao", "pie", "pin", "ping", "po", "pou", "pu",
  // m
  "ma", "mai", "man", "mang", "mao", "me", "mei", "men", "meng", "mi", "mian", "miao", "mie", "min", "ming", "miu", "mo", "mou", "mu",
  // f
  "fa", "fan", "fang", "fei", "fen", "feng", "fo", "fou", "fu",
  // d
  "da", "dai", "dan", "dang", "dao", "de", "dei", "den", "deng", "di", "dia", "dian", "diao", "die", "ding", "diu", "dong", "dou", "du", "duan", "dui", "dun", "duo",
  // t
  "ta", "tai", "tan", "tang", "tao", "te", "teng", "ti", "tian", "tiao", "tie", "ting", "tong", "tou", "tu", "tuan", "tui", "tun", "tuo",
  // n
  "na", "nai", "nan", "nang", "nao", "ne", "nei", "nen", "neng", "ni", "nian", "niang", "niao", "nie", "nin", "ning", "niu", "nong", "nou", "nu", "nuan", "nuo", "nv", "nue", "nve",
  // l
  "la", "lai", "lan", "lang", "lao", "le", "lei", "leng", "li", "lia", "lian", "liang", "liao", "lie", "lin", "ling", "liu", "lo", "long", "lou", "lu", "luan", "lun", "luo", "lv", "lue", "lve",
  // g
  "ga", "gai", "gan", "gang", "gao", "ge", "gei", "gen", "geng", "gong", "gou", "gu", "gua", "guai", "guan", "guang", "gui", "gun", "guo",
  // k
  "ka", "kai", "kan", "kang", "kao", "ke", "kei", "ken", "keng", "kong", "kou", "ku", "kua", "kuai", "kuan", "kuang", "kui", "kun", "kuo",
  // h
  "ha", "hai", "han", "hang", "hao", "he", "hei", "hen", "heng", "hong", "hou", "hu", "hua", "huai", "huan", "huang", "hui", "hun", "huo",
  // j
  "ji", "jia", "jian", "jiang", "jiao", "jie", "jin", "jing", "jiong", "jiu", "ju", "juan", "jue", "jun",
  // q
  "qi", "qia", "qian", "qiang", "qiao", "qie", "qin", "qing", "qiong", "qiu", "qu", "quan", "que", "qun",
  // x
  "xi", "xia", "xian", "xiang", "xiao", "xie", "xin", "xing", "xiong", "xiu", "xu", "xuan", "xue", "xun",
  // zh
  "zha", "zhai", "zhan", "zhang", "zhao", "zhe", "zhei", "zhen", "zheng", "zhi", "zhong", "zhou", "zhu", "zhua", "zhuai", "zhuan", "zhuang", "zhui", "zhun", "zhuo",
  // ch
  "cha", "chai", "chan", "chang", "chao", "che", "chen", "cheng", "chi", "chong", "chou", "chu", "chua", "chuai", "chuan", "chuang", "chui", "chun", "chuo",
  // sh
  "sha", "shai", "shan", "shang", "shao", "she", "shei", "shen", "sheng", "shi", "shou", "shu", "shua", "shuai", "shuan", "shuang", "shui", "shun", "shuo",
  // r
  "ran", "rang", "rao", "re", "ren", "reng", "ri", "rong", "rou", "ru", "rua", "ruan", "rui", "run", "ruo",
  // z
  "za", "zai", "zan", "zang", "zao", "ze", "zei", "zen", "zeng", "zi", "zong", "zou", "zu", "zuan", "zui", "zun", "zuo",
  // c
  "ca", "cai", "can", "cang", "cao", "ce", "cen", "ceng", "ci", "cong", "cou", "cu", "cuan", "cui", "cun", "cuo",
  // s
  "sa", "sai", "san", "sang", "sao", "se", "sen", "seng", "si", "song", "sou", "su", "suan", "sui", "sun", "suo",
  // y
  "ya", "yan", "yang", "yao", "ye", "yi", "yin", "ying", "yo", "yong", "you", "yu", "yuan", "yue", "yun",
  // w
  "wa", "wai", "wan", "wang", "wei", "wen", "weng", "wo", "wu",
]);

const MAX_SEGMENTATIONS = 8; // 切分方案数量上限，避免长串组合爆炸

// 用回溯枚举 label 的所有合法音节切分方案（最多 MAX_SEGMENTATIONS 种）
export function segmentPinyin(label: string): string[][] {
  const results: string[][] = [];
  const path: string[] = [];
  const walk = (pos: number): void => {
    if (results.length >= MAX_SEGMENTATIONS) return;
    if (pos === label.length) {
      results.push([...path]);
      return;
    }
    // 音节最长 5 个字母（如 zhuang），优先尝试长音节（贪心），失败则回溯
    for (let len = Math.min(5, label.length - pos); len >= 1; len--) {
      const piece = label.slice(pos, pos + len);
      if (PINYIN_SYLLABLES.has(piece)) {
        path.push(piece);
        walk(pos + len);
        path.pop();
      }
    }
  };
  walk(0);
  return results;
}

// ---------------- 拼音语感风险评分（R142） ----------------
// 在合法切分之上追加确定性「语感风险」规则：只针对高风险组合降分/淘汰，
// 规则刻意保守（宁放过不误杀），知名品牌名（zhihu/xiaohongshu/bilibili/douban/
// taobao/baidu/weibo/meituan/pinduoduo/xiaomi 等）必须全部零扣分通过。
//
// 齿龈-卷舌系声母集合：zh/ch/sh（卷舌）、z/c/s（平舌）、j/q/x（舌面）。
// 这三组声母发音部位接近，连续出现时口腔调音来回切换极小、音色雷同，
// 对母语者拗口、对非母语者几乎不可读（如 xian-zhao-xian 的 x/zh/x 连串）。
const SIBILANT_INITIALS = new Set<string>(["zh", "ch", "sh", "z", "c", "s", "j", "q", "x"]);

// 取音节声母：zh/ch/sh 双字母优先，其余取首字母；零声母（a/e/o 开头）与 y/w 返回 ""
function syllableInitial(syl: string): string {
  const two = syl.slice(0, 2);
  if (two === "zh" || two === "ch" || two === "sh") return two;
  const first = syl[0];
  return /[aeiou]/.test(first) ? "" : first;
}

// 语感风险评分（确定性规则，输入为一种切分方案的音节序列）：
// 规则 1：连续 ≥3 个音节的声母都属于齿龈-卷舌系（zh/ch/sh/z/c/s/j/q/x）→ +20
//   依据：同发音部位声母连串缺乏调音对比，读感含混拗口（xian-zhao-xian 型）
// 规则 2：恰好 3 音节且首尾音节完全相同（ABA 型，如 xian-zhao-xian）→ +15
//   依据：首尾同字回环在品牌名中无叠音美感（叠音美感是 AAB/ABB 相邻重复，
//   如 bilibili/pinduoduo），ABA 型读起来像绕口令；限定 3 音节避免误伤 4 音节叠词
// 规则 3：≥3 音节且每个音节都 ≥4 字母（zhuang-chuang-shuang 型全长音节堆叠）→ +15
//   依据：全词无短音节调剂，视觉与拼读负担都重（对照：xiao-hong-shu 有 shu 收尾）
// 累计 ≥30 → 上层直接丢弃；<30 → 仅从 readability 扣除风险分
export function pinyinQualityRisk(syllables: string[]): number {
  let risk = 0;
  // 规则 1：齿龈-卷舌系声母连串
  let run = 0;
  let maxRun = 0;
  for (const syl of syllables) {
    if (SIBILANT_INITIALS.has(syllableInitial(syl))) {
      run++;
      if (run > maxRun) maxRun = run;
    } else {
      run = 0;
    }
  }
  if (maxRun >= 3) risk += 20;
  // 规则 2：3 音节 ABA 型首尾重复
  if (syllables.length === 3 && syllables[0] === syllables[2]) risk += 15;
  // 规则 3：≥3 音节全长音节堆叠
  if (syllables.length >= 3 && syllables.every((s) => s.length >= 4)) risk += 15;
  return risk;
}

// 风险分淘汰阈值：单条规则命中只降分，两条以上叠加才丢弃（保守，宁放过不误杀）
export const PINYIN_RISK_DROP_THRESHOLD = 30;

export type PinyinCheck = { ok: false } | { ok: true; ambiguous: boolean; risk: number };

// 校验 theme === "pinyin" 的候选：
// - 纯辅音缩写（≤3 字符且不含元音，如 zlz）放行——AI 偶尔把声母缩写标成 pinyin，不应误杀
// - 无法完整切分为合法音节 → 丢弃
// - 最短切分方案音节数 > 4 → 丢弃
// - 存在 ≥2 种「音节数相同且都是最少音节数」的切分方案（如 mingan → min-gan / ming-an）→ 拼读有歧义，
//   仅降 readability，不丢弃；带零声母元音音节的冗余长切分（如 xiao → xi-a-o）不算歧义
// - R142：对最短切分方案做语感风险评分，风险分 ≥ 阈值 → 丢弃，< 阈值 → 从 readability 扣除
export function checkPinyinLabel(label: string): PinyinCheck {
  if (label.length <= 3 && !/[aeiouv]/.test(label)) return { ok: true, ambiguous: false, risk: 0 };
  if (/[^a-z]/.test(label)) return { ok: false };
  const segs = segmentPinyin(label);
  if (segs.length === 0) return { ok: false };
  const minSyllables = Math.min(...segs.map((s) => s.length));
  if (minSyllables > 4) return { ok: false };
  const minimal = segs.filter((s) => s.length === minSyllables);
  // 语感风险按各最短切分方案取最小值：只要存在一种低风险读法就按低风险计（保守，避免误杀）
  const risk = Math.min(...minimal.map((s) => pinyinQualityRisk(s)));
  if (risk >= PINYIN_RISK_DROP_THRESHOLD) return { ok: false };
  return { ok: true, ambiguous: minimal.length >= 2, risk };
}

// ---------------- 生僻字启发式（R182） ----------------
// 拼音系候选的 meaning 「」内汉字应是普通人能由拼音反推的常用字。
// 维护一份小型生僻字黑名单（命名场景中 LLM 高频产出、但远在常用 3500 字之外的
// 雅字/地名用字/古字），命中只降 readability 不丢弃（启发式不可靠，宁放过不误杀）。
const RARE_CJK_BLACKLIST = new Set<string>(
  "岑蕨飏麓隰珩岫崧翀昶垚犇淼焱燊滢潆澍泠浥沚洄湮芃荇菡蘅芩荻莜菀蓁玥珉璟瑭霈翊珞彧赟旻嵘峤郴滁黔黟莨撅瑟谧".split(""),
);

export const RARE_CHAR_PENALTY_PER_CHAR = 10;

// 统计 meaning 中「」内出现的黑名单生僻字个数（每个命中字计一次，重复字不重复计）
export function countRareQuotedChars(meaning: string): number {
  const hits = new Set<string>();
  const re = /「([^「」]{1,12})」/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(meaning)) !== null) {
    for (const ch of m[1]) if (RARE_CJK_BLACKLIST.has(ch)) hits.add(ch);
  }
  return hits.size;
}

// ---------------- 防线统计元数据（R238） ----------------
// R222–R225 上线的多道候选防线只有「结果无坏例」的间接证据，无法直证防线拦截了坏例。
// GuardStats 按请求聚合各防线的丢弃计数与补发/重试触发情况，随流事件返回给前端与回归脚本。
// 只计数、不含被丢弃候选的任何内容（label/meaning 一概不带），不含用户数据。

/** 各防线丢弃计数（仅计数，不含被丢弃候选内容） */
export interface GuardDropCounts {
  /** label 非法字符/超长（清洗不通过） */
  invalidLabel: number;
  /** 知名品牌撞名（R180） */
  brandCollision: number;
  /** meaning 为空或括号剥离后过短（R149） */
  emptyMeaning: number;
  /** meaning 混入目标语言白名单外文字（R179） */
  charsetViolation: number;
  /** 臆造词源：引用 label 中不存在的字母/词源片段（R179/R183） */
  phantomEtymology: number;
  /** meaning 泄漏命名路线分类元词/元话术（R183） */
  metaLanguage: number;
  /** meaning 含问号（犹豫/不成句信号，R196） */
  questionMark: number;
  /** EN meaning 词语沙拉（无词源锤点且无谓语骨架，R196） */
  meaningIncoherent: number;
  /** 拼音候选无法切分为合法音节/音节过多/语感风险超阈（R124/R142） */
  pinyinInvalid: number;
  /** 声称「全拼」但「」内引用词拼音与 label 拼写不符，含表外字保守拒绝（R196/R222） */
  pinyinMismatch: number;
  /** 与点踩集共享词根前缀或同后缀模式（R225） */
  dislikedMorphology: number;
  /** en 场景的中文拼音路线候选（英文用户读不出拼音，R465） */
  enPinyinRoute: number;
}

/** 单次 AI 生成请求的防线统计：各防线丢弃数 + word 配额补发/重试是否触发 */
export interface GuardStats {
  dropped: GuardDropCounts;
  /** EN word 路线配额补发是否触发（R224） */
  wordSupplement: boolean;
  /** 补发轮实际发起次数（R243，0–2；主轮丢弃计数不含补发轮） */
  supplementAttempts: number;
  /** 补发轮各防线丢弃计数（R243，与主轮 dropped 分开，修复 R239 P3-1 盲区） */
  supplementDropped: GuardDropCounts;
  /** LLM 调用瞬时失败后的退避重试次数 */
  retries: number;
  /** charsetViolation 首个违规字符的 Unicode 码点样本（如 "U+D55C"，R245；只留码点不留候选文本） */
  charsetSample?: string;
  /** zh 拼音系路线配额补发是否触发（R463；旧数据无此字段） */
  pinyinSupplement?: boolean;
}

function newGuardDropCounts(): GuardDropCounts {
  return {
    invalidLabel: 0,
    brandCollision: 0,
    emptyMeaning: 0,
    charsetViolation: 0,
    phantomEtymology: 0,
    metaLanguage: 0,
    questionMark: 0,
    meaningIncoherent: 0,
    pinyinInvalid: 0,
    pinyinMismatch: 0,
    dislikedMorphology: 0,
    enPinyinRoute: 0,
  };
}

export function newGuardStats(): GuardStats {
  return {
    dropped: newGuardDropCounts(),
    wordSupplement: false,
    supplementAttempts: 0,
    supplementDropped: newGuardDropCounts(),
    retries: 0,
  };
}

/** 各防线丢弃数合计（前端「本轮过滤 N 个低质候选」展示用） */
export function guardDroppedTotal(guard: GuardStats): number {
  return Object.values(guard.dropped).reduce((a, b) => a + b, 0);
}

// ---------------- 上游 LLM 错误分类（R264） ----------------
// 生产事故：DeepSeek 账户欠费（上游 402）时前端只有通用错误文案，用户无法区分
// 「服务方账务问题，重试没用」与「暂时限流/网络抖动，可重试」。
// 按错误来源分类，随 error 流事件透出给前端（只透出类别与既有 detail 短码，
// 不含 key、不含上游响应体）：
// - quota：401/402/403（认证/账务/配额，重试无效）
// - rate-limit：429（上游限流，稍后可重试）
// - upstream：5xx 与其他 HTTP 错误、坏 JSON 输出（上游故障，可重试）
// - network：fetch 网络失败 / 超时（可重试）
export type AiErrorKind = "quota" | "rate-limit" | "upstream" | "network" | "unknown";

const LLM_HTTP_RE = /llm-http-(\d{3})/;

export function classifyAiError(e: unknown): AiErrorKind {
  const msg = e instanceof Error ? e.message : String(e);
  const m = LLM_HTTP_RE.exec(msg);
  if (m) {
    const status = Number(m[1]);
    if (status === 401 || status === 402 || status === 403) return "quota";
    if (status === 429) return "rate-limit";
    return "upstream";
  }
  if (msg.includes("llm-bad-json") || msg.includes("llm-bad-output")) return "upstream";
  if (e instanceof Error && (e.name === "TimeoutError" || e.name === "AbortError" || e.name === "TypeError")) return "network";
  return "unknown";
}

export interface AiUnderstanding {
  core: string;
  style: string;
  scene: string;
}

const UNDERSTANDING_PROMPT = `你是域名命名专家。把用户的需求描述提炼成三个要素，供确认「我理解你要的是什么」：
- core：核心寓意（一短句，≤20 字）
- style：命名风格（几个词，≤12 字）
- scene：使用场景/目标用户（一短句，≤16 字）

严格输出 JSON，不要输出其他任何文字：
{"core":"…","style":"…","scene":"…"}`;

const EN_UNDERSTANDING_HINT = "\n\n重要：core/style/scene 的值全部用英文书写（用户界面是英文）。";
// 英文界面追加的 hint：语言要求 + 英文命名路线强化（indie hacker 用户，避免平庸词典词组合）
const EN_NAMING_HINT = `

重要：每个 meaning 说明全部用英文书写（用户界面是英文）。

英文命名路线强化（用户是英文 indie hacker，coined/blend 系候选质量优先）：
- 四种英文命名路线都要覆盖：① portmanteau 词混造（Pinterest=pin+interest、Instagram=instant+telegram 式，两个词各取有辨识度的片段拼接）；② 拉丁/希腊词根改造（Spotify、Sonos 式，取 son/lum/vox/nov 等词根加轻量后缀，短而有质感）；③ 真实短词的错拼/变体（Lyft、Tumblr 式，去元音或换字母，但整体仍要一眼能读出来）；④ 隐喻词（Amazon、Apple 式，用一个现成的具象词，与需求语义有一层聪明的关联，meaning 里必须点破这层关联）
- meaning 质量要求：说清词源拆解（由哪两个词/哪个词根构成、为什么贴合需求）+ 读音顺口的理由（如两音节重音在前、开音节收尾），不要用 catchy/modern/memorable 这类空洞形容词充数，例如：Lumora = Latin "lumen" meaning light + soft -ora ending, evokes clarity for a journaling app; two open syllables, reads instantly
- 英文自筛淘汰标准（不达标的直接不要输出）：≥4 音节；含难读辅音簇（如 xq、zv、tsk）；与知名品牌只差一个字母（有法律风险，如 gooogle、spotifi）；直白到像域名占位词的组合（如 bestXXXhub、XXXonline、getXXXapp）
- 路线配额要求（每轮自查）：word 与 blend（两个可辨认词段拼接）合计必须 ≥30%（如 24 个候选中至少 7 个），word / blend / coined 三类各至少 2 个；整轮几乎全是 coined 造词视为不合格输出，输出前统计各 theme 数量并补足缺口
${MEANING_REDLINES_EN}
- theme 标注硬规则（逐条判断，不看走的是哪条命名路线）：
  ① label 本身就是词典里存在的完整英文单词（含隐喻词，如 castloom 不是、amazon 是）→ 必须标 word
  ② label 能拆成两个可辨认的英文单词/词段拼接（如 castloom = cast + loom、verbloom = verb + bloom）→ 必须标 blend
  ③ 其余纯造词（词根改造、错拼变体，如 lumora、tumblr）→ 标 coined
  注意：blend 在中文语境另指拼音+英文混合，英文语境下按上面②执行
- theme 标注 few-shot 示例（严格模仿这种判断方式）：
[{"label":"anvil","meaning":"A real English word: the blacksmith's anvil, metaphor for a solid build tool where ideas get forged; one heavy stressed syllable, reads instantly","theme":"word","scores":{"length":92,"readability":95,"relevance":85,"brandability":82}},
{"label":"verbloom","meaning":"verb + bloom: words that blossom, fits a writing app; two recognizable words joined, stress on the first syllable","theme":"blend","scores":{"length":85,"readability":88,"relevance":90,"brandability":86}},
{"label":"lumora","meaning":"Latin \"lumen\" meaning light + soft -ora ending, evokes clarity for a journaling app; two open syllables, reads instantly","theme":"coined","scores":{"length":88,"readability":90,"relevance":84,"brandability":89}}]
- theme 标注 few-shot 反例（这些都是错误示范，不要犯）：
  ✗ nundina 标 word —— nundinae 是拉丁词，不在现代英文词典中；word 仅限现代英文常用词（anvil/amazon 式），拉丁/希腊/古语词一律标 coined
  ✗ canaryio 标 word —— label 内嵌 TLD 名 io，组成 canaryio.com 观感怪异，这类内嵌 TLD 名的候选直接不要输出
  ✗ ledgeledger —— 同词根叠拼（ledger+ledger）低质，不要输出任何同词根叠拼的候选
- 英文场景禁止中文拼音路线：不要输出任何基于汉语拼音的候选（如 chengji、zhixing 式），英文用户读不出拼音也无从理解寓意；theme 一律不得标 pinyin`;

// LLM 上游基地址：默认 DeepSeek 官方；本地 wrangler dev 可用 LLM_API_BASE 指向假上游
// 验证错误路径（R264），生产不设此变量时行为与既往完全一致
export const DEFAULT_LLM_API_BASE = "https://api.deepseek.com";
// LLM 模型名：默认 DeepSeek 官方 deepseek-chat；经 OpenAI 兼容网关时用 LLM_MODEL 指定网关侧模型名
export const DEFAULT_LLM_MODEL = "deepseek-chat";
// R461：部分网关侧模型（如 deepseek-v4-flash）默认开启思考链，单次调用可达 50s+ 导致超时；
// 设 LLM_THINKING=disabled 时请求体携带 thinking:{type:"disabled"} 关闭思考链（实测 50s→2s）
export function thinkingBodyExtra(thinking?: string): { thinking?: { type: "disabled" } } {
  return thinking === "disabled" ? { thinking: { type: "disabled" } } : {};
}

export async function generateUnderstanding(description: string, apiKey: string, lang: "zh" | "en" = "zh", baseUrl: string = DEFAULT_LLM_API_BASE, model: string = DEFAULT_LLM_MODEL, thinking?: string): Promise<AiUnderstanding | null> {
  try {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: lang === "en" ? UNDERSTANDING_PROMPT + EN_UNDERSTANDING_HINT : UNDERSTANDING_PROMPT },
          { role: "user", content: `需求描述：${description}` },
        ],
        temperature: 0.3,
        max_tokens: 200,
        ...thinkingBodyExtra(thinking),
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { choices: { message: { content: string } }[] };
    const match = (data.choices[0]?.message?.content ?? "").match(/\{[\s\S]*\}/);
    if (!match) return null;
    const obj = JSON.parse(match[0]) as Partial<AiUnderstanding>;
    const core = String(obj.core ?? "").trim();
    if (!core) return null;
    return { core, style: String(obj.style ?? "").trim(), scene: String(obj.scene ?? "").trim() };
  } catch {
    return null;
  }
}

// ---------------- EN word 路线配额硬保障（R224，修复 R218 P2-3） ----------------
// EN_NAMING_HINT 的 prompt 级软配额对 LLM 不可靠（R218 en2 整轮 word=0，R195/R196 也有波动）。
// 后端兜底：一轮解析完成后统计 theme 分布，word 为 0 且候选数达阈值时，追加一次带硬指令的
// 补充请求（仅限 1 次，失败不阻塞主结果）。仅在配额失守时触发，正常路径 0 额外成本。

/** 触发补发的最小候选数：整轮产出太少时（如流截断）word=0 属于正常波动，不补发 */
export const EN_WORD_QUOTA_MIN_CANDIDATES = 8;
/** 补发请求的候选数：word 路线软配额要求「各至少 2 个」，按 4 个请求留过滤余量 */
export const EN_WORD_SUPPLEMENT_COUNT = 4;
/** 补发总次数上限（R243）：首次补发全灭时再重试一次，第二次 prompt 加硬 */
export const EN_WORD_SUPPLEMENT_MAX_ATTEMPTS = 2;

// ---------------- word theme 内嵌 TLD 降级兜底（R250，R239 P3-3） ----------------
// 生产坏例：canaryio 标 word——label 内嵌 TLD 名 io，不是词典词。prompt 级反例之外，
// 解析后兜底：label 以内嵌易发的已收录科技系 TLD 名结尾且 theme=word 时降级为 coined（不删除）。
// 只挑 TLD_LIST 中品牌域名常内嵌的科技系后缀；farm/city/art/one 等本身是英文常用词结尾的
// TLD 不入列（smart/chart/ozone 等真实词尾撞概率高，误降级会吃掉 word 配额）。
const EMBED_PRONE_TLDS = ["io", "ai", "app", "dev", "xyz", "tech", "cloud", "site", "shop", "store", "online"];
export const WORD_TLD_EMBED_SUFFIXES: readonly string[] = EMBED_PRONE_TLDS.filter((t) => (TLD_LIST as readonly string[]).includes(t));
// 真实英文词恰好以这些字母结尾的白名单（studio 等 word 合法候选放行）
const WORD_TLD_SUFFIX_ALLOW = new Set([
  "audio", "studio", "radio", "ratio", "patio", "folio", "portfolio", "trio", "curio", "scenario",
  "bonsai",
  "website", "campsite", "parasite", "opposite",
  "workshop",
  "restore", "bookstore", "drugstore", "superstore",
]);

/** theme=word 但 label 内嵌已收录 TLD 名结尾（canaryio 型）→ true（应降级为 coined） */
export function wordThemeEmbedsTld(label: string): boolean {
  if (WORD_TLD_SUFFIX_ALLOW.has(label)) return false;
  return WORD_TLD_EMBED_SUFFIXES.some((t) => label.length > t.length && label.endsWith(t));
}

/** 统计候选的 theme 分布 */
export function countThemes(candidates: AiCandidate[]): Record<AiTheme, number> {
  const counts: Record<AiTheme, number> = { pinyin: 0, word: 0, coined: 0, blend: 0 };
  for (const c of candidates) if (c.theme) counts[c.theme]++;
  return counts;
}

/** word 路线配额是否失守：word 为 0 且候选数 ≥ 阈值时返回 true（需要补发） */
export function needsWordSupplement(candidates: AiCandidate[]): boolean {
  return candidates.length >= EN_WORD_QUOTA_MIN_CANDIDATES && countThemes(candidates).word === 0;
}

// ---------------- en 任务语言判定（R465 补丁，R465 线上回归发现） ----------------
// lang 取自 UI 语言，中文 UI 下输入纯英文需求时拼音过滤会失效。
// 描述无任何 CJK 字符且含常见英文功能词时，视为英文任务（纯拼音输入如 "chaye dianshang" 不命中，保留 zh 行为）。
const EN_FUNCTION_WORD_RE = /\b(a|an|the|for|to|of|and|with|app|site|tool|my|our|that|is|in|on)\b/i;
export function descriptionLooksEnglish(description: string): boolean {
  return !/[\u3400-\u9fff\uf900-\ufaff]/.test(description) && EN_FUNCTION_WORD_RE.test(description);
}

// ---------------- zh 拼音/中文语感路线配额硬保障（R463，R462 对标 P0-2） ----------------
// 生产坏例：zh 茶叶电商任务 12 个可注册全是 tea+英文词模板，pinyin/blend 为 0——
// prompt 级软配额（R182）对 LLM 不可靠，镜像 R224 word 补发机制做后端兜底。
export const ZH_PINYIN_QUOTA_MIN_CANDIDATES = 8;
export const ZH_PINYIN_SUPPLEMENT_COUNT = 6;

/** zh 拼音系路线配额是否失守：pinyin+blend 合计为 0 且候选数 ≥ 阈值 */
export function needsPinyinSupplement(candidates: AiCandidate[]): boolean {
  const t = countThemes(candidates);
  return candidates.length >= ZH_PINYIN_QUOTA_MIN_CANDIDATES && t.pinyin + t.blend === 0;
}

/** 拼音补发轮硬指令：每条必须是拼音或拼音+英文混搭路线 */
export function buildPinyinSupplementDirective(count: number, exclude: string[]): string {
  return [
    `路线配额补发（硬指令）：上一批候选的 theme 分布中 pinyin（中文拼音）与 blend（拼音+英文混合）路线合计为 0，不满足中文场景配额。`,
    `现在请再给出 ${count} 个候选，每一条 label 都必须走拼音系路线：中文寓意词的全拼/双字拼/声母缩写（theme 标 "pinyin"），或拼音词根+轻量英文词混搭（theme 标 "blend"）。`,
    `meaning 必须包含用「」括起的中文原词并说明读音记忆点；禁止纯英文单词或英文造词。`,
    `严禁重复输出以下已出现过的名字：${exclude.join(", ")}`,
  ].join("\n");
}

/** 合并拼音补发结果：只收 theme 为 pinyin/blend 且 label 未出现过的候选 */
export function mergePinyinSupplement(main: AiCandidate[], extra: AiCandidate[]): AiCandidate[] {
  const seen = new Set(main.map((c) => c.label));
  const picked = extra.filter((c) => (c.theme === "pinyin" || c.theme === "blend") && !seen.has(c.label));
  return picked.length > 0 ? [...main, ...picked] : main;
}

/** 补发轮硬指令：每条 label 必须是词典真实存在的完整英文单词，theme 全部标 word；
 * attempt=2（R243 二次重试）时对 meaning 句式加硬指令，避免短句式 meaning 被质量防线拦截 */
export function buildWordSupplementDirective(count: number, exclude: string[], attempt = 1): string {
  const lines = [
    `路线配额补发（硬指令）：上一批候选的 theme 分布中 word（现成英文单词）路线为 0，不满足配额。`,
    `现在请再给出 ${count} 个候选，每一条都必须满足：label 是词典里真实存在的完整英文单词（隐喻词路线，如 amazon/anvil 式，与需求语义有一层聪明的关联），theme 必须全部标注为 "word"。`,
    `禁止造词、禁止错拼变体、禁止两词拼接。`,
    `严禁重复输出以下已出现过的名字：${exclude.join(", ")}`,
  ];
  if (attempt >= 2) {
    lines.push(
      `二次补发加硬要求：上一批补发候选全部被质量校验拦截。每条 meaning 必须是一个主谓完整的英文句子（含 means/evokes/suggests/metaphor for 等谓语），先复述这个单词本身（如 "anvil" is a real English word meaning …），再点破它与需求的隐喻关联，禁止只写碎片短语。`,
    );
  }
  return lines.join("\n");
}

/** 合并补发结果：只收 theme 为 word 且 label 未出现过的候选，追加到主结果之后 */
export function mergeWordSupplement(main: AiCandidate[], extra: AiCandidate[]): AiCandidate[] {
  const seen = new Set(main.map((c) => c.label));
  const picked = extra.filter((c) => c.theme === "word" && !seen.has(c.label));
  return picked.length > 0 ? [...main, ...picked] : main;
}

export async function generateAiCandidates(
  description: string,
  apiKey: string,
  opts: { count?: number; feedback?: RefineFeedback; round?: number; lang?: "zh" | "en"; guard?: GuardStats; baseUrl?: string; model?: string; thinking?: string; descLooksEnglish?: boolean } = {},
): Promise<AiCandidate[]> {
  let out: AiCandidate[];
  try {
    out = await generateOnce(description, apiKey, opts);
  } catch {
    // 瞬时错误/超时自动重试一次：带 jitter 退避，避免整次搜索直接报错
    if (opts.guard) opts.guard.retries++;
    await new Promise((r) => setTimeout(r, 400 + Math.random() * 600));
    out = await generateOnce(description, apiKey, opts);
  }
  // R224：EN word 路线配额失守时补发（R243：过滤后 word 仍为 0 时再重试一次，总上限 2 次；
  // 第二次 prompt 加硬明确要求完整句式 meaning；两次仍 0 不阻塞主结果，失败静默）
  if ((opts.lang ?? "zh") === "en" && needsWordSupplement(out)) {
    if (opts.guard) opts.guard.wordSupplement = true;
    for (let attempt = 1; attempt <= EN_WORD_SUPPLEMENT_MAX_ATTEMPTS; attempt++) {
      if (opts.guard) opts.guard.supplementAttempts = attempt;
      try {
        const extra = await generateOnce(description, apiKey, {
          ...opts,
          count: EN_WORD_SUPPLEMENT_COUNT,
          wordSupplementExclude: out.map((c) => c.label),
          wordSupplementAttempt: attempt,
        });
        out = mergeWordSupplement(out, extra);
      } catch {
        // 补发失败不影响主结果
      }
      if (countThemes(out).word > 0) break;
    }
  }
  // R463：zh 拼音/blend 路线配额失守时补发一次（镜像 R224；失败静默不阻塞主结果）
  if ((opts.lang ?? "zh") === "zh" && !(opts.descLooksEnglish ?? descriptionLooksEnglish(description)) && needsPinyinSupplement(out)) {
    if (opts.guard) opts.guard.pinyinSupplement = true;
    try {
      const extra = await generateOnce(description, apiKey, {
        ...opts,
        count: ZH_PINYIN_SUPPLEMENT_COUNT,
        pinyinSupplementExclude: out.map((c) => c.label),
      });
      out = mergePinyinSupplement(out, extra);
    } catch {
      // 补发失败不影响主结果
    }
  }
  return out;
}

const THEME_NAMES: Record<string, string> = { pinyin: "拼音/缩写", word: "现成英文单词", coined: "英文造词", blend: "拼音+英文混合" };

// ---------------- 点踩形态规避（R225） ----------------
// 生产坏例（R218 审计 P2-4）：点踩 moji/moxiang（墨 mo 词根）后仍产出 moyu/moxu；
// 点踩 traxen/forgex（-x 后缀 coined）后仍产出 gleanix。R180 的规避只在「完全同名」层面生效。
// 两层修复：① buildRefineHint 从点踩名提取形态特征（词首词根、尾部后缀模式）写进 prompt 显式禁止；
// ② 解析后硬过滤兜底——新候选与点踩集共享词根前缀或同后缀模式即丢弃。

// 尾部后缀模式：域名造词常见改造后缀，长模式优先匹配；单独的尾字母 x 也算模式（traxen/forgex/gleanix 型）
const DISLIKE_SUFFIX_PATTERNS = ["ify", "ily", "ora", "io", "ly", "x"] as const;

/** 点踩 label 的尾部后缀模式（无匹配返回 null） */
export function dislikeSuffixOf(label: string): string | null {
  for (const p of DISLIKE_SUFFIX_PATTERNS) {
    if (label.length > p.length && label.endsWith(p)) return p;
  }
  return null;
}

/** label 词首的合法拼音音节（2–4 字符，长音节优先；无则返回 null）——moji → mo、moxiang → mo */
export function leadingPinyinSyllable(label: string): string | null {
  for (let len = Math.min(4, label.length - 1); len >= 2; len--) {
    const head = label.slice(0, len);
    if (PINYIN_SYLLABLES.has(head)) return head;
  }
  return null;
}

/** 点踩 label 的词根片段：词首合法拼音音节优先（mo），否则取首 3 字符（gleanix → gle） */
export function dislikeRootOf(label: string): string {
  return leadingPinyinSyllable(label) ?? label.slice(0, 3);
}

/**
 * 候选与点踩集的形态冲突判定：
 * - "root"：与任一点踩 label 共享 ≥3 字符词首前缀，或词首拼音音节与点踩词首音节相同（mo ↔ moyu）
 * - "suffix"：尾部后缀模式与任一点踩 label 相同（-x ↔ gleanix）
 * - null：无冲突
 */
export function dislikedMorphologyConflict(label: string, disliked: DislikedItem[]): "root" | "suffix" | null {
  for (const d of disliked) {
    let common = 0;
    while (common < label.length && common < d.label.length && label[common] === d.label[common]) common++;
    if (common >= 3) return "root";
    const root = leadingPinyinSyllable(d.label);
    if (root && label.startsWith(root) && leadingPinyinSyllable(label) === root) return "root";
  }
  for (const d of disliked) {
    const suf = dislikeSuffixOf(d.label);
    if (suf && label.length > suf.length && label.endsWith(suf)) return "suffix";
  }
  return null;
}

// 硬过滤兜底的候选量权衡：过滤后不足此数时，按原顺序回填「仅后缀冲突」的候选
// （后缀模式误杀成本高于词根——-ly/-io 是常见合法结尾；词根级冲突不回填）
export const DISLIKE_FILTER_MIN_KEEP = 6;

/** refine 轮硬过滤：丢弃与点踩集形态冲突的候选，不足 MIN_KEEP 时回填仅后缀冲突项 */
export function filterDislikedMorphology(candidates: AiCandidate[], disliked: DislikedItem[]): AiCandidate[] {
  const kept: AiCandidate[] = [];
  const suffixOnly: AiCandidate[] = [];
  for (const c of candidates) {
    const kind = dislikedMorphologyConflict(c.label, disliked);
    if (kind === null) kept.push(c);
    else if (kind === "suffix") suffixOnly.push(c);
  }
  while (kept.length < DISLIKE_FILTER_MIN_KEEP && suffixOnly.length > 0) kept.push(suffixOnly.shift()!);
  return kept;
}

/** 把上一轮的失败模式总结成具体反思提示，而非简单罗列名单 */
function buildRefineHint(fb: RefineFeedback, round: number, lang: "zh" | "en"): string {
  const parts: string[] = [];
  // R250（R239 P3-2）：点踩形态禁令前置到 hint 最开头 + 强命令式——R239 实测 refine 轮 33% 产出
  // 仍撞点踩形态、全靠硬过滤兜底吃掉，禁令排在 hint 尾部权重不足；硬过滤保持不动，仅降低 token 浪费
  if (fb.disliked && fb.disliked.length > 0) {
    const roots = new Set<string>();
    const suffixes = new Set<string>();
    for (const d of fb.disliked) {
      roots.add(dislikeRootOf(d.label));
      const s = dislikeSuffixOf(d.label);
      if (s) suffixes.add(s);
    }
    if (lang === "en") {
      const enRoots = [...roots].join(", ");
      const enSufs = [...suffixes].map((s) => `-${s}`).join(", ");
      let line = `TOP-PRIORITY HARD BAN — read this before anything else and re-check every single candidate against it right before you output: NEVER start any candidate with the root fragment(s) ${enRoots} (disliking "moji" bans "moyu"/"moxu" — same root, same vibe)`;
      if (suffixes.size > 0) line += `; NEVER end any candidate with the suffix pattern(s) ${enSufs} (disliking "forgex" bans "gleanix" — same -x coinage suffix)`;
      line += `. Any violating candidate WILL be discarded by the system unseen — every violation is a wasted slot, so produce ZERO of them.`;
      parts.push(line);
    } else {
      const rootList = [...roots].join("、");
      const sufList = [...suffixes].map((s) => `-${s}`).join("、");
      let line = `【最高优先级硬禁令——先读这条，输出前逐条对照自查】任何候选的词首都严禁出现词根片段 ${rootList}（点踩了 moji 就绝不能再出 moyu、moxu 这类同词根名）`;
      if (suffixes.size > 0) line += `；严禁以 ${sufList} 结尾（点踩了 forgex 就绝不能再出 gleanix 这类同后缀造词）`;
      line += `。违规候选会被系统直接丢弃、你看不到任何效果——每出一条违规就是白白浪费一个名额，必须做到零违规。`;
      parts.push(line);
    }
    const items = fb.disliked
      .map((d) => (d.theme ? `${d.label}（${THEME_NAMES[d.theme] ?? d.theme}）` : d.label))
      .join("、");
    parts.push(
      `以上禁令来自用户明确点踩的候选及其风格：${items}。请逐个分析它们的词根与构词模式（共同的词根片段、前后缀改造套路、命名思路），本轮换用完全不同的词根与构词方向（例如点踩了 loggist 这类 log+后缀造词，就不要再出任何含 log 词根或同套路后缀改造的候选）。`,
    );
  }
  parts.push(`这是第 ${round} 轮。`);
  if (fb.taken.length > 0) {
    const themeSummary = Object.entries(fb.takenThemes)
      .filter(([, n]) => n > 0)
      .sort((a, b) => b[1] - a[1])
      .map(([t, n]) => `${THEME_NAMES[t] ?? t} ${n} 个`)
      .join("、");
    const shortCount = fb.taken.filter((l) => l.length <= 6).length;
    const facts: string[] = [];
    if (themeSummary) facts.push(`命名思路分布：${themeSummary}`);
    if (shortCount > 0) facts.push(`≤6 字符的短名占 ${shortCount} 个`);
    parts.push(`此前已有 ${fb.taken.length} 个候选查出被注册${facts.length ? `（${facts.join("；")}）` : ""}。`);
    parts.push(
      "请先反思这些被注册名的共性模式（哪些词根太常见、哪种构词太直白、哪个长度段竞争太激烈），这一轮明确避开这些模式：更大胆地造词、混搭、用冷僻但好读的组合，或适当加长 1-2 个字符换取独特性，但仍要好读好记、贴合需求。",
    );
  }
  if (fb.tried.length > 0) {
    parts.push(`以下名字全部已经核验过（无论结果如何），严禁重复输出其中任何一个：\n${fb.tried.slice(-120).join(", ")}`);
  }
  // R179：反思轮重申 meaning 质量红线——生产审计发现轮≥2 时 meaning 大面积劣化（臆造词源、
  // 引用 label 中不存在的字母、语法不通、混入异文字），与首轮共享同一份红线文案
  parts.push(`无论第几轮，meaning 质量红线不放松，重申如下：\n${lang === "en" ? MEANING_REDLINES_EN : MEANING_REDLINES_ZH}`);
  // R196：反思轮 meaning 连贯性红线——生产审计发现轮≥2 时 meaning 大面积不成句（词语碎片堆砌），
  // 在红线之外单独强调「必须成句」并给出自查标准
  parts.push(
    lang === "en"
      ? `Coherence red line for this round: every meaning must read as ONE grammatical English sentence a native speaker would naturally write — subject, verb, and a clear point. Before outputting, read each meaning aloud in your head; if it reads like disconnected word fragments strung together (e.g. "yonkle as a knoll taken to third power hand, your ridge from low months"), discard that candidate and write a different one you can explain in a plain, coherent sentence.`
      : `本轮 meaning 连贯性红线：每条 meaning 必须是母语者会自然写出的一句通顺中文——主谓完整、意思明确。输出前逐条默读一遍，读起来像词语碎片拼凑、不成句的（如「带给幼想出格的好奇色彩」），直接弃用该候选，换一个你能用一句通顺话讲清楚的。`,
  );
  return parts.join("\n");
}

// 模型偶尔用 “”/『』/„” 等引号包中文原词，归一为「」保证前端高亮命中
// 中文归一先跑，之后残留的英文弯引号（‘’“”）兜底归一为直引号，两条逻辑共存互不干扰
export const normalizeQuotes = (m: string): string =>
  m
    .replace(/[“『„]([^“”『』„「」]{1,12}?)[”』]/g, (full, w: string) => (/[\u4e00-\u9fff]/.test(w) ? `「${w}」` : full))
    .replace(/[‘’]/g, "'")
    .replace(/[“”„]/g, '"');

// R132：normalizeQuotes 之后的残留符号清理——清除孤立不成对的 CJK 引号
// （「」『』，以及归一漏网的 “”‘’„ 弯引号），配对完好的「」/『』保留（前端要高亮）
export const stripUnpairedCjkQuotes = (m: string): string => {
  const pairs: [string, string][] = [
    ["「", "」"],
    ["『", "』"],
  ];
  const drop = new Set<number>();
  for (const [open, close] of pairs) {
    const stack: number[] = [];
    for (let i = 0; i < m.length; i++) {
      if (m[i] === open) stack.push(i);
      else if (m[i] === close) {
        if (stack.length > 0) stack.pop();
        else drop.add(i); // 无开引号对应的孤立闭引号
      }
    }
    for (const i of stack) drop.add(i); // 无闭引号对应的孤立开引号
  }
  let out = "";
  for (let i = 0; i < m.length; i++) {
    if (drop.has(i)) continue;
    // 归一后理论上不该再出现的弯引号残留，一并清除
    if (/[“”‘’„]/.test(m[i])) continue;
    out += m[i];
  }
  return out;
};

// R149：括号注释剥离——中文 meaning 偶发「mu(慕:向往)加yuan踏石…」式括号内嵌拆字/注音，
// 整条丢弃误杀成本高，改为剥离括号及其内容后保留。处理范围：()（）[]【】 四类括号，
// 括号类型不要求成对同型（模型偶发「（…)」混用），按最近开括号配对；嵌套按最外层整段剥离；
// 孤立闭括号只删该字符；孤立开括号视为截断的注释开头，从该处剥到串尾。
// 成对「」『』不在处理范围，前端高亮不受影响。
export const PAREN_RE = /[()（）[\]【】]/;
export const stripParentheticalAnnotations = (m: string): string => {
  const opens = new Set(["(", "（", "[", "【"]);
  const closes = new Set([")", "）", "]", "】"]);
  const drop = new Set<number>();
  const stack: number[] = [];
  for (let i = 0; i < m.length; i++) {
    const ch = m[i];
    if (opens.has(ch)) {
      stack.push(i);
    } else if (closes.has(ch)) {
      if (stack.length > 0) {
        const start = stack.pop()!;
        // 栈清空说明回到最外层，整段（含嵌套）标记剥离
        if (stack.length === 0) for (let j = start; j <= i; j++) drop.add(j);
      } else {
        drop.add(i); // 孤立闭括号
      }
    }
  }
  if (stack.length > 0) for (let j = stack[0]; j < m.length; j++) drop.add(j); // 孤立开括号剥到串尾
  let out = "";
  for (let i = 0; i < m.length; i++) if (!drop.has(i)) out += m[i];
  return out.replace(/\s{2,}/g, " ").trim();
};

/** meaning 完整清洗管线：引号归一 → 残留符号清理 → 括号注释剥离 → 去首尾空白 */
export const cleanMeaning = (m: string): string => stripParentheticalAnnotations(stripUnpairedCjkQuotes(normalizeQuotes(m))).trim();

// ---------------- meaning 字符白名单（R179） ----------------
// 生产审计发现反思轮 meaning 偶发混入韩文（코더）、IPA 音标（gɪt）等异文字，整条丢弃。
// zh：ASCII 可打印（meaning 常含英文单词）+ 汉字（含扩展A）+ CJK 标点（「」『』、。等）
//   + 全角标点 + 通用标点（—…·）+ 拼音声调字符（R245）——偏拼音需求下 meaning 常含带声调注音：
//   一声/三声在 Latin Extended-A（āēīōū）与 \u01cd-\u01dc（ǎǐǒǔ 及 ǖǘǚǜ），
//   二声/四声元音（áàéèíìóòúù）与 ü/Ü/ê 在 Latin-1 补充区；
//   不含谚文/假名/西里尔等区段
const ZH_MEANING_ALLOWED_RE = /^[\x20-\x7E\u00b7\u00dc\u00e0\u00e1\u00e8\u00e9\u00ea\u00ec\u00ed\u00f2\u00f3\u00f9\u00fa\u00fc\u0100-\u017f\u01cd-\u01dc\u2000-\u206f\u3000-\u303f\u3400-\u4dbf\u4e00-\u9fff\uff01-\uff5e\uffe0-\uffe5]*$/;
// en：ASCII 可打印 + Latin-1 变音字母（é/ü 类）+ Latin Extended-A（ā/ō 类）+ 通用标点（—…）；
//   刻意不含 IPA Extensions（\u0250-\u02af，如 ɪ/ə）与任何非拉丁文字
const EN_MEANING_ALLOWED_RE = /^[\x20-\x7E\u00c0-\u00ff\u0100-\u017f\u2000-\u206f]*$/;

/** meaning 字符集校验：出现目标语言白名单之外的文字（韩文/西里尔/IPA 等）返回 false */
export function meaningCharsetOk(meaning: string, lang: "zh" | "en"): boolean {
  return (lang === "en" ? EN_MEANING_ALLOWED_RE : ZH_MEANING_ALLOWED_RE).test(meaning);
}

/** 首个白名单外字符的 Unicode 码点（如 "U+D55C"）；全部合法时返回 undefined。
 *  只暴露码点不暴露候选文本，供 charsetViolation 观测采样（R245，只留码点避免内容泄漏）。 */
export function firstCharsetViolation(meaning: string, lang: "zh" | "en"): string | undefined {
  const re = lang === "en" ? EN_MEANING_ALLOWED_RE : ZH_MEANING_ALLOWED_RE;
  for (const ch of meaning) {
    if (!re.test(ch)) return `U+${(ch.codePointAt(0) as number).toString(16).toUpperCase().padStart(4, "0")}`;
  }
  return undefined;
}

// ---------------- 臆造字母引用检测（R179） ----------------
// 生产坏例：versurence 的 meaning 声称 "z from zeus" 但 label 里没有 z。
// 保守启发式：只匹配「单字母 + from/in/stands for」的英文词源引用句式，引用的字母
// 不在 label 中即判为臆造词源；排除 a/i（是英文单词，易误伤正常句子）
const LETTER_CITE_RE = /(?:^|[^a-z])([b-hj-z])\s+(?:from|in|stands\s+for)\s/gi;
export function citesPhantomLetter(label: string, meaning: string): boolean {
  LETTER_CITE_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = LETTER_CITE_RE.exec(meaning)) !== null) {
    if (!label.includes(m[1].toLowerCase())) return true;
  }
  return false;
}

// ---------------- meaning 元语言泄漏检测（R183） ----------------
// 生产坏例：maybeix 的 meaning 自称「这是 blend」。meaning 是给用户看的品牌寓意文案，
// 不应出现 blend/coined/造词/混搭 等命名路线分类元词或「这是一个…名字」类元话术。
// 规则保守：只匹配明确的分类元词与元话术句式，命中整条丢弃。
const META_LANGUAGE_RES: RegExp[] = [
  /\b(?:blend|coined|portmanteau)\b/i, // 英文路线分类元词
  /造词|混搭|拼音路线|命名路线|组合词/, // 中文路线分类元词
  /这是.{0,6}(?:blend|组合|造词|混搭|拼音)/i, // 「这是（一个）blend/组合…」元话术
  /这个名字(?:属于|是)/, // 「这个名字属于…」元话术
];
export function containsMetaLanguage(meaning: string): boolean {
  return META_LANGUAGE_RES.some((re) => re.test(meaning));
}

// ---------------- 臆造词源片段检测（R183，扩展 R179 的单字母版） ----------------
// 生产坏例：plangrow 的 meaning 声称 "play 与 grow 结合"（实为 plan+grow）。
// 匹配「X 与/和/加/+ Y 结合/组合/混合/拼接/合成」（中文句式）与 meaning 开头的 "X + Y"
// （英文 few-shot 惯用的 "verb + bloom: …" 引导式）两类词源引用，X/Y 为 ≥3 字母的 ASCII 词。
// 淘汰规则刻意保守（宁放过不误杀）：
// - 一级：引用词既不整词出现于 label，其首 3 字母与末 3 字母也都不出现 → 丢弃（凭空引用）
// - 二级：两词中恰有一个整词出现于 label 时，从 label 中去掉该词得到剩余片段（≥3 字母），
//   另一词若也不整词出现，则要求它与剩余片段互为前缀（verb↔ver 合法）；
//   否则拼写对不上（plan↔play）→ 丢弃
const ZH_ETYMOLOGY_PAIR_RE = /([a-z]{3,})\s*(?:与|和|加|\+)\s*([a-z]{3,})\s*的?\s*(?:结合|组合|混合|拼接|合成)/gi;
const EN_LEADING_PAIR_RE = /^\s*([a-z]{3,})\s*\+\s*([a-z]{3,})\b/i;

function fragmentAbsent(label: string, word: string): boolean {
  return !label.includes(word) && !label.includes(word.slice(0, 3)) && !label.includes(word.slice(-3));
}

function pairMismatch(label: string, x: string, y: string): boolean {
  if (fragmentAbsent(label, x) || fragmentAbsent(label, y)) return true;
  const xIn = label.includes(x);
  const yIn = label.includes(y);
  if (xIn === yIn) return false; // 两词都整词命中（合法）或都只有片段命中（不做二级判断，保守放行）
  const exact = xIn ? x : y;
  const other = (xIn ? y : x).toLowerCase();
  const rest = label.replace(exact, "");
  if (rest.length < 3 || /[^a-z]/.test(rest)) return false; // 剩余片段太短/含非字母，无法可靠判断，放行
  return !other.startsWith(rest) && !rest.startsWith(other);
}

// R196（P2-1）：中文单片段词源句式「X 取自/源自/来自 Y」——
// X 必须是 label 的子串；Y 若是 ASCII 词（如 "rio 取自 curious"），X 还必须是 Y 的子串。
// Y 为中文时不做 Y 侧判断（无法可靠校验，保守放行）；Y 前的语言/修饰词（latin/greek/
// ancient/word 等）跳过后再取来源词（"lum 源自 latin lumen" 校验的是 lumen 而非 latin）。
const ZH_SOURCE_CITE_RE = /([a-z]{2,})\s*(?:取自|源自|来自)\s*["「『']?(?:([a-z]{3,})(?:\s+([a-z]{3,}))?)?/gi;
// 语言/修饰词不作为来源词参与子串判断（"lum 源自 latin lumen" 校验 lumen；"lum 源自 latin" 不判）
const SOURCE_LANG_WORDS = new Set(["latin", "greek", "english", "french", "italian", "spanish", "german", "japanese", "sanskrit", "norse", "hebrew", "old", "ancient", "the", "word", "root"]);

export function citesPhantomWord(label: string, meaning: string): boolean {
  ZH_ETYMOLOGY_PAIR_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = ZH_ETYMOLOGY_PAIR_RE.exec(meaning)) !== null) {
    if (pairMismatch(label, m[1].toLowerCase(), m[2].toLowerCase())) return true;
  }
  const lead = EN_LEADING_PAIR_RE.exec(meaning);
  if (lead && pairMismatch(label, lead[1].toLowerCase(), lead[2].toLowerCase())) return true;
  ZH_SOURCE_CITE_RE.lastIndex = 0;
  while ((m = ZH_SOURCE_CITE_RE.exec(meaning)) !== null) {
    const x = m[1].toLowerCase();
    if (!label.includes(x)) return true; // 引用片段不在 label 中（臆造）
    const first = m[2]?.toLowerCase();
    const y = first && SOURCE_LANG_WORDS.has(first) ? m[3]?.toLowerCase() : first;
    if (y && !SOURCE_LANG_WORDS.has(y) && !y.includes(x)) return true; // "rio 取自 curious" 型：来源词里没有该片段
  }
  return false;
}

// ---------------- ZH meaning 幻影 ASCII 引用检测（R246，R239 P2-4） ----------------
// 生产坏例（ref2 refine 轮）：meaning 引用 label 中不存在的 ASCII 串但不带「取自/源自」句式——
// tibeirock「tedeck 落音笃定」、kinwalk「kino 指尖溜过石板」、duanyou「wrin 前缀强调直结声」，
// ZH_SOURCE_CITE_RE 的句式门未覆盖，全部上线。
// 规则：zh meaning 中嵌在中文语境里的独立 ASCII 词（≥3 字母，紧邻 CJK 文字/标点）若既不是
// label 的子串（label 反向包含也放行），也不是常见英文白名单词（tech/cloud/app 等通用词、
// TLD 名、语言名），判为臆造引用 → 整条丢弃。纯英文句子里的词（两侧都非 CJK）不判，
// 避免误杀合法的英文释义句。
// 已被词源句式引用的来源词（"rio 取自 curious" 的 curious、"X 与 Y 结合" 的 X/Y）先剥离——
// 它们由 citesPhantomWord 按各自句式校验，不在本防线重复判定（避免误杀合法来源词）。
const ZH_ASCII_ALLOWED_WORDS = new Set([
  // 语言/词源修饰词（与 SOURCE_LANG_WORDS 同源）
  "latin", "greek", "english", "french", "italian", "spanish", "german", "japanese", "sanskrit", "norse", "hebrew", "old", "ancient", "the", "word", "root",
  // 常见 TLD 名（meaning 里解释后缀观感时会出现）
  "com", "net", "org", "app", "dev", "top", "xyz", "site", "online", "store", "shop", "club", "vip", "fun", "art", "live", "life", "link", "one", "run", "work", "world", "zone", "group", "team", "ltd", "wiki", "info", "biz", "pro", "tech", "cloud",
  // 通用科技/品牌描述词（zh meaning 常借英文词点题）
  "web", "data", "saas", "api", "seo", "logo", "brand", "startup", "studio", "lab", "labs", "hub", "home", "smart", "max", "mini", "plus", "digital", "mobile", "global", "media", "design", "style", "code", "box", "base", "core", "flow", "pay", "game", "play", "book", "note", "blog", "mail", "chat", "news", "mall", "star", "sun", "sky", "sea", "eco", "bio", "tea", "cafe", "farm", "city", "land", "space",
]);
const ZH_ASCII_WORD_RE = /[a-z]{3,}/gi;
// 先剥离已有句式门校验过的来源词：「X 取自/源自/来自 Y1 (Y2)」的 Y 侧、「X 与/和/加/+ Y 结合…」整段
const ZH_CITE_SOURCE_STRIP_RE = /(?:取自|源自|来自)\s*(?:拉丁语?|希腊语?|英语|英文|法语|法文|西班牙语|德语|意大利语|日语|梵语)?\s*["「『']?\s*[a-z]{3,}(?:\s+[a-z]{3,})?/gi;
// 中文语言名引导的外语词（"法语 croustillant 的酥脆"）同样是被点名的来源词，剥离后不判
const ZH_LANG_LEAD_STRIP_RE = /(?:拉丁语?|希腊语?|英语|英文|法语|法文|西班牙语|德语|意大利语|日语|梵语)\s*["「『']?\s*[a-z]{3,}/gi;
const ZH_PAIR_STRIP_RE = /[a-z]{3,}\s*(?:与|和|加|\+)\s*[a-z]{3,}\s*的?\s*(?:结合|组合|混合|拼接|合成)/gi;

const CJK_CONTEXT_RE = /[\u3000-\u303f\u3400-\u4dbf\u4e00-\u9fff\uff01-\uffe5]/;

function nearestNonSpace(s: string, i: number, step: -1 | 1): string {
  for (let j = i; j >= 0 && j < s.length; j += step) {
    if (s[j] !== " ") return s[j];
  }
  return "";
}

export function zhCitesPhantomAscii(label: string, meaning: string): boolean {
  const stripped = meaning.replace(ZH_CITE_SOURCE_STRIP_RE, " ").replace(ZH_LANG_LEAD_STRIP_RE, " ").replace(ZH_PAIR_STRIP_RE, " ");
  ZH_ASCII_WORD_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = ZH_ASCII_WORD_RE.exec(stripped)) !== null) {
    const w = m[0].toLowerCase();
    if (label.includes(w) || w.includes(label)) continue;
    if (ZH_ASCII_ALLOWED_WORDS.has(w)) continue;
    // 只判嵌在中文语境里的词（任一侧紧邻 CJK）；纯英文句子中的词不判
    const before = nearestNonSpace(stripped, m.index - 1, -1);
    const after = nearestNonSpace(stripped, m.index + m[0].length, 1);
    if (CJK_CONTEXT_RE.test(before) || CJK_CONTEXT_RE.test(after)) return true;
  }
  return false;
}

// ---------------- LLM 候选数组解析 + 截断修复（R197） ----------------
// 生产坏例（R195 审计 P1-2）：候选数组 JSON 被截断/格式坏 → SyntaxError → 整轮 0 结果。
// 解析失败先做截断修复：按括号深度扫描，截到最后一个完整的顶层对象再补 "]"；
// 修复后仍失败才抛 llm-bad-json，走 generateAiCandidates 既有的一次退避重试；
// 重试仍失败时 worker 向流内 emit error 事件，前端据此展示「重试本轮」CTA。

/** 数组文本中每个顶层对象闭合 "}" 的下标（跳过字符串内的括号/引号） */
export function topLevelObjectEnds(raw: string): number[] {
  let depth = 0;
  let inString = false;
  let escaped = false;
  const ends: number[] = [];
  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') inString = true;
    else if (ch === "{" || ch === "[") depth++;
    else if (ch === "}" || ch === "]") {
      depth--;
      // 深度回到 1 说明刚闭合一个数组顶层对象
      if (ch === "}" && depth === 1) ends.push(i);
    }
  }
  return ends;
}

/** 从 LLM 回复文本中解析候选数组；坏 JSON 先截断修复，仍失败抛错交由上层重试 */
export function parseCandidateArray(text: string): Partial<AiCandidate>[] {
  const match = text.match(/\[[\s\S]*\]/);
  // 截断输出可能缺失收尾 "]"，正则不命中时从首个 "[" 起取到串尾进修复
  const bracket = text.indexOf("[");
  const raw = match ? match[0] : bracket >= 0 ? text.slice(bracket) : null;
  if (raw === null) throw new Error("llm-bad-output");
  try {
    const v = JSON.parse(raw) as unknown;
    if (Array.isArray(v)) return v as Partial<AiCandidate>[];
  } catch {
    // 从最后一个顶层对象闭合处往前逐个尝试截断 + 补 "]"：
    // 输出被截断时最后一个闭合处即可修复；对象间缺逗号等坏格式时
    // 往前回退能抢救出坏点之前的完整对象
    const ends = topLevelObjectEnds(raw);
    for (let k = ends.length - 1; k >= 0; k--) {
      try {
        const v = JSON.parse(raw.slice(0, ends[k] + 1) + "]") as unknown;
        if (Array.isArray(v) && v.length > 0) return v as Partial<AiCandidate>[];
      } catch {
        // 该截断点仍坏，继续往前尝试
      }
    }
  }
  throw new Error("llm-bad-json");
}

// ---------------- EN meaning 连贯性启发式（R196，P1-1） ----------------
// 生产坏例：反思轮（round≥2）EN meaning 大面积词语碎片堆砌（"alapa vein memory,
// floor n look, for times shaded privately" 型）。两条保守条件同时不满足才丢弃（宁放过不误杀）：
// 条件 A（词源锤点）：meaning 需包含 label 本身、label 的 ≥4 字母连续片段，
//   或含一个与 label 共享 ≥3 字母前缀的单词（lumora ↔ "lumen"）——正常的词源拆解总会提及词源片段
// 条件 B（谓语锤点）：meaning 需含至少一个词源/释义常见谓语词（means/evokes/suggests/
//   from/plus/word/root/short for/named after/combines 等）——词语沙拉恰恰缺乏这类谓语骨架
const EN_PREDICATE_RE = /\b(?:mean(?:s|ing)?|evokes?|suggest(?:s|ing)?|from|plus|words?|roots?|short\s+for|named\s+after|combin(?:es|ed|ing)|echoes|joined|blend(?:s|ed)?|derived|refers?|reads?|sounds?|nod\s+to)\b/i;

// R223（R218 P2-2）：label 片段若本身是高频英文停用词/功能词（with/that/from 等），
// 在任何词语沙拉里都会自然出现，不能算词源锤点——besowith 型穿透正是靠子串 "with"。
// 只收 ≥3 字母的条目（片段匹配下限为 3/4 字母，更短的词不会参与判定）
const EN_FRAGMENT_STOPWORDS = new Set([
  "and", "are", "but", "for", "had", "has", "have", "been", "her", "him", "his", "how",
  "into", "its", "just", "like", "may", "more", "most", "not", "now", "off", "one", "only",
  "our", "out", "over", "own", "per", "some", "such", "than", "that", "the", "them", "then",
  "they", "this", "too", "under", "upon", "very", "was", "well", "were", "what", "when",
  "where", "which", "who", "why", "will", "with", "within", "would", "you", "your", "there",
  "their", "about", "these", "those", "here", "from", "does", "did", "can", "could", "should",
]);

// R243（R239 P1-1）：word 隐喻词补发轮的 meaning 天然短句式（"A real English word: …, metaphor for …"），
// 常不含 EN_PREDICATE_RE 的词源谓语骨架而被误杀。补发轮不放弃红线（词源锤点条件 A 不变），
// 仅对谓语锤点条件 B 追加隐喻/释义信号词（metaphor/symbolizes/represents 等）作为等效谓语。
const EN_WORD_METAPHOR_PREDICATE_RE =
  /\b(?:metaphor|symbol(?:s|ize[sd]?|izing)?|represent(?:s|ing)?|stands?\s+for|captures?|convey(?:s|ing)?|calls?\s+to\s+mind|real\s+(?:english\s+)?word|dictionary\s+word|literally|imagery?|invokes?|conjures?)\b/i;

export function enMeaningIncoherent(label: string, meaning: string, opts: { wordMetaphor?: boolean } = {}): boolean {
  const lower = meaning.toLowerCase();
  let fragmentOk = lower.includes(label);
  if (!fragmentOk && label.length >= 4) {
    for (let len = Math.min(label.length, 8); len >= 4 && !fragmentOk; len--) {
      for (let i = 0; i + len <= label.length; i++) {
        const frag = label.slice(i, i + len);
        if (EN_FRAGMENT_STOPWORDS.has(frag)) continue;
        if (lower.includes(frag)) {
          fragmentOk = true;
          break;
        }
      }
    }
  }
  if (!fragmentOk && label.length >= 3) {
    // 与 label 共享字母前缀的实词（词首匹配，避免 "small" 命中 "all"；
    // 命中的整词若是停用词，如 label "theora" 前缀 "the" 命中冠词 the，同样不算锤点）。
    // R246（R239 P2-3）：公共前缀仅 3 字母的命中被 anchors（ancryst）、opairein（oparior，
    // 幻觉词自证）、linen（lintow）击穿——收紧为公共前缀 ≥4 才算锤点；公共前缀恰为 3 时，
    // 仅当命中词处于明确词源引用语境（引号包裹，或紧跟 latin/greek 等语言名之后，
    // 如 lumora ↔ Latin "lumen"）才保留为锤点
    for (const m of lower.matchAll(new RegExp(`\\b${label.slice(0, 3)}[a-z]*`, "g"))) {
      const w = m[0];
      if (EN_FRAGMENT_STOPWORDS.has(w)) continue;
      let common = 0;
      while (common < w.length && common < label.length && w[common] === label[common]) common++;
      if (common >= 4) {
        fragmentOk = true;
        break;
      }
      if (common >= 3) {
        const before = lower.slice(Math.max(0, (m.index ?? 0) - 16), m.index ?? 0);
        if (/["'\u201c\u201d\u300c\u300e]\s*$/.test(before) || /\b(?:latin|greek|french|italian|spanish|german|norse|sanskrit|hebrew|japanese|english)\s+["'\u201c\u300c]?$/.test(before)) {
          fragmentOk = true;
          break;
        }
      }
    }
  }
  const predicateOk =
    EN_PREDICATE_RE.test(meaning) || (opts.wordMetaphor === true && EN_WORD_METAPHOR_PREDICATE_RE.test(meaning));
  return !fragmentOk || !predicateOk;
}

// ---------------- 拼音引用词与 label 一致性校验（R196，P2-2） ----------------
// 生产坏例：tangfang 声称「探方」双全拼（实为 tanfang）、sanvei 声称「山味」全拼（实为 shanwei）。
// 基于内嵌常用字拼音表（R222 扩至 GB2312 全集 6765 字，含多音字）校验：theme 为 pinyin 且
// meaning 声称「全拼」时，「」内引用词的逐字拼音拼接必须能等于 label（多音字任一读音、ü 允许 v/u/ue 写法）。
// R222（R218 审计 P2-1）：表外字策略从「放行」改为保守拒绝——生产坏例 yuncu「云萃」因 萃 在旧 3500
// 字表外被放行、实际拼写错配上线。扩表后表外字仅剩 GB2312 外的生僻字，本就违反「常用字」prompt 红线，
// 含表外字的引用词按「无法匹配」处理；存在任一引用词匹配 label 仍放行。
let PINYIN_TABLE: Map<string, string[]> | null = null;
function pinyinTable(): Map<string, string[]> {
  if (!PINYIN_TABLE) {
    PINYIN_TABLE = new Map();
    for (const entry of COMMON_CHAR_PINYIN_DATA.split(";")) {
      const [ch, ps] = entry.split(":");
      if (ch && ps) PINYIN_TABLE.set(ch, ps.split(","));
    }
  }
  return PINYIN_TABLE;
}

// 单字读音展开 ü 的两种域名写法（表内已写作 v：lv → lv/lue；jun/qu 类表内已是 u 写法）
function readingVariants(p: string): string[] {
  return p.includes("v") ? [p, p.replace("v", "ue"), p.replace("v", "u")] : [p];
}

const FULL_PINYIN_CLAIM_RE = /全拼/;
const QUOTED_CJK_RE = /「([\u3400-\u4dbf\u4e00-\u9fff]{2,4})」/g;

// 单字在 label 中允许的贡献形态：全拼各读音（含 ü 写法变体）；宽松模式下再加
// 首字母与首声母（zh/ch/sh 双字母声母），覆盖「取字首」类合法造型（云慕 → y+m）
function charContributions(readings: string[], allowInitials: boolean): string[] {
  const out: string[] = [];
  for (const r of readings) {
    for (const v of readingVariants(r)) out.push(v);
    if (allowInitials) {
      out.push(r[0]);
      if (r.length >= 2 && (r[1] === "h") && (r[0] === "z" || r[0] === "c" || r[0] === "s")) {
        out.push(r.slice(0, 2));
      }
    }
  }
  return [...new Set(out)];
}

// 枚举引用词的所有逐字拼接读法，判断是否有一种等于 label（组合数设上限防爆炸）。
// allowInitials：宽松模式（未声称「全拼」）下每字还可只取首字母/首声母参与拼接
function quotedWordMatchesLabel(word: string, label: string, allowInitials = false): boolean {
  const table = pinyinTable();
  let joins: string[] = [""];
  for (const ch of word) {
    const readings = table.get(ch);
    if (!readings) return false; // 表外字（GB2312 外生僻字）→ 保守拒绝，视为不匹配
    const next: string[] = [];
    for (const j of joins) {
      for (const v of charContributions(readings, allowInitials)) {
        // 前缀剪枝：拼接中途就必须是 label 前缀，否则丢弃该分支
        const cand = j + v;
        if (label.startsWith(cand)) next.push(cand);
      }
    }
    if (next.length === 0) return false;
    joins = next.slice(0, 64);
  }
  return joins.includes(label);
}

// theme 为 pinyin 且 meaning 含「」中文引用词：引用词与 label 做拼音一致性校验 → 全部不符则 true（丢弃）。
// R244（R239 审计 P2-1）：「全拼」声明从必要条件改为加严条件——声称全拼时 label 必须等于
// 逐字全拼拼接（严格）；未声称时放宽为「全拼或首字母/首声母的逐字组合」能完整拼出 label
// 即放行（弱声称），仍对不上（shuqi「漱石」/pinen「品芩」/duanyou「韫岩」型）才拒绝
export function pinyinQuoteMismatch(label: string, meaning: string): boolean {
  const strict = FULL_PINYIN_CLAIM_RE.test(meaning);
  QUOTED_CJK_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  let judged = 0;
  while ((m = QUOTED_CJK_RE.exec(meaning)) !== null) {
    if (quotedWordMatchesLabel(m[1], label, !strict)) return false;
    judged++;
  }
  return judged > 0;
}

async function generateOnce(
  description: string,
  apiKey: string,
  opts: {
    count?: number;
    feedback?: RefineFeedback;
    round?: number;
    lang?: "zh" | "en";
    wordSupplementExclude?: string[];
    wordSupplementAttempt?: number;
    pinyinSupplementExclude?: string[];
    guard?: GuardStats;
    baseUrl?: string;
    model?: string;
    thinking?: string;
    descLooksEnglish?: boolean;
  } = {},
): Promise<AiCandidate[]> {
  const count = opts.count ?? 24;
  let user = `需求描述：${description}\n请给出 ${count} 个候选。`;
  if (opts.feedback && (opts.feedback.tried.length > 0 || opts.feedback.taken.length > 0)) {
    user += `\n\n${buildRefineHint(opts.feedback, opts.round ?? 2, opts.lang ?? "zh")}`;
  }
  // R224：word 路线配额补发轮，追加硬指令（每条必须是真实英文单词且 theme 标 word）
  const isWordSupplement = opts.wordSupplementExclude !== undefined;
  if (isWordSupplement) {
    user += `\n\n${buildWordSupplementDirective(count, opts.wordSupplementExclude ?? [], opts.wordSupplementAttempt ?? 1)}`;
  }
  // R463：zh 拼音系路线配额补发轮，追加硬指令
  if (opts.pinyinSupplementExclude !== undefined) {
    user += `\n\n${buildPinyinSupplementDirective(count, opts.pinyinSupplementExclude)}`;
  }
  const res = await fetch(`${opts.baseUrl ?? DEFAULT_LLM_API_BASE}/chat/completions`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
    signal: AbortSignal.timeout(60_000), // 单次 LLM 调用超时上限，超时走上层重试
    body: JSON.stringify({
      model: opts.model ?? DEFAULT_LLM_MODEL,
      messages: [
        {
          role: "system",
          content:
            opts.lang === "en"
              ? SYSTEM_PROMPT + EN_NAMING_HINT
              : // R247：偏拼音需求追加变体拓宽指令，降低双字全拼存量枯竭命中率
                SYSTEM_PROMPT + ZH_PINYIN_HINT + (detectPinyinFocus(description) ? ZH_PINYIN_BROADEN_HINT : ""),
        },
        { role: "user", content: user },
      ],
      // R196（P1-1）：反思轮（round≥2）降温——高温叠加长上下文是词语沙拉的主要来源，首轮保持 1.2 不变
      temperature: (opts.round ?? 1) > 1 ? 0.9 : 1.2,
      max_tokens: 4000,
      ...thinkingBodyExtra(opts.thinking),
    }),
  });
  if (!res.ok) throw new Error(`llm-http-${res.status}`);
  const data = (await res.json()) as { choices: { message: { content: string } }[] };
  const text = data.choices[0]?.message?.content ?? "";
  const arr = parseCandidateArray(text);
  // R238：防线统计——各 continue 丢弃路径按防线归类计数（只计数，不记录被丢弃候选内容）；
  // R243：补发轮丢弃计入 supplementDropped，与主轮分开可观测
  const guardStats = opts.guard ?? newGuardStats();
  const isSupplement = isWordSupplement || opts.pinyinSupplementExclude !== undefined;
  const dropped = isSupplement ? guardStats.supplementDropped : guardStats.dropped;
  const seen = new Set<string>();
  const out: AiCandidate[] = [];
  const clamp = (v: unknown) => {
    const n = Math.round(Number(v));
    return Number.isFinite(n) ? Math.min(Math.max(n, 0), 100) : 60;
  };
  for (const c of arr) {
    // label 清洗：去首尾空白后必须整体是合法域名主体字符（小写字母/数字/连字符），
    // 含内部空格或其他非法字符的直接丢弃，不做静默改写
    const label = String(c.label ?? "").trim().toLowerCase();
    if (!/^[a-z0-9-]{1,63}$/.test(label)) {
      dropped.invalidLabel++;
      continue;
    }
    if (seen.has(label)) continue; // 同轮重复不算防线拦截，不计数
    // R180：知名品牌撞名过滤（完全同名，或长度 ≥5 且编辑距离 ≤1），规避商标法律风险
    if (isBrandCollision(label)) {
      dropped.brandCollision++;
      continue;
    }
    seen.add(label);
    // meaning 为空/全空白的候选直接丢弃（流截断或模型漏字段），不进核验队列；
    // tried 由上层根据返回值累积，被丢弃项天然不计入
    const rawMeaning = String(c.meaning ?? "");
    const meaning = cleanMeaning(rawMeaning);
    if (!meaning) {
      dropped.emptyMeaning++;
      continue;
    }
    // R149：括号注释剥离后过短（<6 字符）说明有效寓意几乎全在括号里，整条丢弃
    if (meaning.length < 6 && PAREN_RE.test(rawMeaning)) {
      dropped.emptyMeaning++;
      continue;
    }
    // R179：meaning 混入目标语言白名单外的文字（韩文/西里尔/IPA 等）→ 整条丢弃
    if (!meaningCharsetOk(meaning, opts.lang ?? "zh")) {
      dropped.charsetViolation++;
      if (guardStats.charsetSample === undefined) {
        guardStats.charsetSample = firstCharsetViolation(meaning, opts.lang ?? "zh");
      }
      continue;
    }
    // R179：meaning 引用 label 中不存在的字母（"z from zeus" 式臆造词源）→ 整条丢弃
    if (citesPhantomLetter(label, meaning)) {
      dropped.phantomEtymology++;
      continue;
    }
    // R183：meaning 出现命名路线分类元词/元话术（「这是 blend」式）→ 整条丢弃
    if (containsMetaLanguage(meaning)) {
      dropped.metaLanguage++;
      continue;
    }
    // R183：meaning 声称的词源片段与 label 拼写不符（"play 与 grow 结合" for plangrow）→ 整条丢弃
    if (citesPhantomWord(label, meaning)) {
      dropped.phantomEtymology++;
      continue;
    }
    // R246（R239 P2-4）：zh meaning 引用 label 中不存在且非白名单的独立 ASCII 词（「tedeck 落音笃定」式幻影引用）→ 整条丢弃
    if ((opts.lang ?? "zh") === "zh" && zhCitesPhantomAscii(label, meaning)) {
      dropped.phantomEtymology++;
      continue;
    }
    // R196（P1-1）：meaning 含问号（犹豫/不成句的确定性信号，现只有 prompt 级约束）→ 整条丢弃
    if (meaning.includes("?") || meaning.includes("\uff1f")) {
      dropped.questionMark++;
      continue;
    }
    // R196（P1-1）：EN meaning 连贯性启发式——无 label 词源锤点且无谓语骨架的词语沙拉 → 整条丢弃
    if ((opts.lang ?? "zh") === "en" && enMeaningIncoherent(label, meaning, { wordMetaphor: isWordSupplement })) {
      dropped.meaningIncoherent++;
      continue;
    }
    const s = c.scores ?? ({} as Partial<AiScores>);
    const theme = String(c.theme ?? "").toLowerCase();
    // R124：拼音候选做确定性音节校验，不合法的直接丢弃（不进入核验，节省额度）；
    // blend/word/coined 不强制校验（blend 含英文，无法整体切分）
    let readabilityPenalty = 0;
    // R465（R464 复评）：en 场景丢弃拼音路线候选（英文用户读不出拼音，Top Picks 曾被拼音霸榜），先于拼音合法性校验以免计入其他防线；
    // lang 取自 UI 语言，中文 UI 下输入纯英文描述同样适用（R465 线上回归发现的路径盲区）；
    // 优先用调用方基于原始描述的判定（worker 会向 description 拼接中文风格/长度偏好后缀，直接判拼接后文本会误判为 zh）
    if (((opts.lang ?? "zh") === "en" || (opts.descLooksEnglish ?? descriptionLooksEnglish(description))) && theme === "pinyin") {
      dropped.enPinyinRoute++;
      continue;
    }
    if (theme === "pinyin") {
      const check = checkPinyinLabel(label);
      if (!check.ok) {
        dropped.pinyinInvalid++;
        continue;
      }
      // 歧义切分扣 15 + 语感风险分（R142），叠加后从 readability 扣除
      readabilityPenalty = (check.ambiguous ? 15 : 0) + check.risk;
      // R196（P2-2）：声称「全拼」但「」内引用词的逐字拼音与 label 拼写不符（「探方」≠tangfang）→ 整条丢弃
      if (pinyinQuoteMismatch(label, meaning)) {
        dropped.pinyinMismatch++;
        continue;
      }
    }
    // R182：拼音系候选「」内命中生僻字黑名单，按字数从 readability 扣分（不丢弃）
    if (theme === "pinyin" || theme === "blend") {
      readabilityPenalty += countRareQuotedChars(meaning) * RARE_CHAR_PENALTY_PER_CHAR;
    }
    // R179：theme 缺失/非法时强制归入 coined，保证 theme 永不为空；
    // R224：补发轮硬指令要求全部为 word 路线，漏标时兜底归入 word（漏标即被丢弃会让补发白跑）
    let resolvedTheme: AiTheme = THEMES.has(theme) ? (theme as AiTheme) : isWordSupplement ? "word" : "coined";
    // R250（R239 P3-3）：label 内嵌已收录 TLD 名结尾却标 word（canaryio 型）→ 降级为 coined（不删除）
    if (resolvedTheme === "word" && wordThemeEmbedsTld(label)) resolvedTheme = "coined";
    out.push({
      label,
      meaning,
      theme: resolvedTheme,
      scores: {
        length: clamp(s.length),
        readability: Math.max(clamp(s.readability) - readabilityPenalty, 0),
        relevance: clamp(s.relevance),
        brandability: clamp(s.brandability),
      },
    });
  }
  // R225：点踩形态硬过滤兜底——prompt 级禁止（buildRefineHint）之外，对解析后的新候选
  // 跑与点踩集的形态相似度检查，共享词根前缀或同后缀模式即丢弃；过滤后不足再回填仅后缀冲突项
  const disliked = opts.feedback?.disliked;
  if (disliked && disliked.length > 0) {
    const kept = filterDislikedMorphology(out, disliked);
    dropped.dislikedMorphology += out.length - kept.length;
    return kept;
  }
  return out;
}
