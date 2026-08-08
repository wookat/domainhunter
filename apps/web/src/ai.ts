export interface AiScores {
  length: number;
  readability: number;
  relevance: number;
  brandability: number;
}

export type AiTheme = "pinyin" | "word" | "coined" | "blend";

const THEMES = new Set<string>(["pinyin", "word", "coined", "blend"]);

export interface AiCandidate {
  label: string;
  meaning: string;
  theme?: AiTheme;
  scores: AiScores;
}

const SYSTEM_PROMPT = `你是资深域名命名专家。用户会用自然语言描述想要的域名寓意/主题/口味，你负责发散出尽可能优质的域名主体（不含 TLD）。

要求：
- 多路发散：中文拼音（全拼/双拼/缩写）、贴切的英文单词、英文合成词/造词、拼音+英文混合
- 优先短（3-10 字符）、好记、好读、有品牌感；避免连字符和数字（除非寓意需要）
- 只输出小写字母组成的合法域名主体
- 常见单词、两三个字母的组合几乎都已被注册，要敢于造词、混搭、用冷僻但好读的组合
- 按推荐度排序
- 给每个候选标注命名思路 theme，取值只能是：pinyin（中文拼音/缩写）、word（现成英文单词）、coined（英文合成词/造词）、blend（拼音+英文混合）
- 同时给每个候选打四维分（0-100 整数）：length（长度，越短越好记分越高）、readability（读感，好读好拼）、relevance（寓意贴合需求程度）、brandability（品牌感，独特性与可商标性）
- meaning 必须是定稿文案：一次成稿、语气笃定；禁止问号式犹豫、禁止「其实/等等」式自我修正、禁止括号内猜测拆词；对寓意拆解没把握，就换一个你能笃定解释的候选
  好例子：「木舟」muzhou，双字全拼，寓意稳载远行，声调平缓，读一遍就能拼出来
  坏例子：murory，可能是 mu(木?)+rory？也许取自某个人名（不太确定）
- 禁止在 meaning 里用括号（()（）[]【】）内嵌拆字/注音/补充解释；拆字与寓意必须融进一句通顺的定稿文案直接说清
  好例子：「慕远」muyuan，mu 取「慕」的向往、yuan 取「远」的辽阔，寓意心怀远方，全拼顺口好记
  坏例子：「慕远」mu(慕:向往)加yuan【远】，寓意远行（大概）

严格输出 JSON 数组，不要输出其他任何文字：
[{"label":"域名主体","meaning":"一句话说明寓意与读法","theme":"coined","scores":{"length":90,"readability":85,"relevance":88,"brandability":80}}]`;

/** refine 轮反馈：跨轮去重 + 被注册名的模式总结素材 */
export interface RefineFeedback {
  /** 已核验过的全部主体（无论结果），refine 轮严禁重复输出 */
  tried: string[];
  /** 其中已被注册的主体 */
  taken: string[];
  /** 被注册主体的命名思路分布（仅统计已知 theme 的） */
  takenThemes: Partial<Record<AiTheme, number>>;
}

const ZH_PINYIN_HINT = `

拼音候选强化（用户是中文创业者，拼音系候选质量优先）：
- 路线配额硬要求：每轮候选中 theme 为 pinyin 或 blend 的合计必须 ≥40%（如 24 个候选中至少 10 个），其余才是 word/coined；不足配额视为不合格输出
- 三种拼音路线都要覆盖，每种至少 2 个：① 简短双字拼（哔哩哔哩 bilibili、知乎 zhihu、豆瓣 douban 式，追求双拼声调节奏与叠音美感）；② 全拼（小红书 xiaohongshu 式，寓意完整直白）；③ 声母缩写或拼音+英文混搭（zlz、tao+bao+hub 式，短而有记忆点）
- 每个 theme 为 pinyin 或 blend 的候选，meaning 必须包含用「」括起的中文原词，并说明为什么这个拼音好读好记（如声调顺口、叠音、无歧义拼读），例如：「知舟」zhizhou，双字全拼，齿音开头声调上扬，读一遍就能拼出来
- 「」内的汉字必须优先用常用字（现代汉语常用 3500 字范围内的直觉），普通人看到拼音要能反推出汉字：木/舟/云/星/禾/悦/途 好，岑/蕨/飏/麓/隰/珩 这类生僻字不要；组词语义要自然（「木舟」「星河」好，「续夸」式牵强搭配不要）
- 拼音自筛淘汰标准（不达标的直接不要输出）：x/q/zh/c/s 等易歧义声母连串（老外读不出，如 xiqizhi）；超过 4 个音节；含 iu/ui、in/ing、an/ang 等易混易错拼写；整体拼读有多种可能切分产生歧义的组合`;

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
  "岑蕨飏麓隰珩岫崧翀昶垚犇淼焱燊滢潆澍泠浥沚洄湮芃荇菡蘅芩荻莜菀蓁玥珉璟瑭霈翊珞彧赟旻嵘峤郴滁黔黟".split(""),
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
- meaning 必须是定稿文案：一次成稿、语气笃定；禁止问号式犹豫（如 "lo(quacious?)"）、禁止 "Actually…" 式自我修正、禁止括号内猜测拆词；如果对词源拆解没把握，就换一个你能笃定解释的候选
- Never embed parenthetical annotations — (), （）, [], 【】 — inside meaning for letter-splitting, phonetic glosses, or side notes; fold the gloss into one polished sentence instead (write Latin "lumen" meaning light, not "lumen (light)")
- theme 标注硬规则（逐条判断，不看走的是哪条命名路线）：
  ① label 本身就是词典里存在的完整英文单词（含隐喻词，如 castloom 不是、amazon 是）→ 必须标 word
  ② label 能拆成两个可辨认的英文单词/词段拼接（如 castloom = cast + loom、verbloom = verb + bloom）→ 必须标 blend
  ③ 其余纯造词（词根改造、错拼变体，如 lumora、tumblr）→ 标 coined
  注意：blend 在中文语境另指拼音+英文混合，英文语境下按上面②执行
- theme 标注 few-shot 示例（严格模仿这种判断方式）：
[{"label":"anvil","meaning":"A real English word: the blacksmith's anvil, metaphor for a solid build tool where ideas get forged; one heavy stressed syllable, reads instantly","theme":"word","scores":{"length":92,"readability":95,"relevance":85,"brandability":82}},
{"label":"verbloom","meaning":"verb + bloom: words that blossom, fits a writing app; two recognizable words joined, stress on the first syllable","theme":"blend","scores":{"length":85,"readability":88,"relevance":90,"brandability":86}},
{"label":"lumora","meaning":"Latin \"lumen\" meaning light + soft -ora ending, evokes clarity for a journaling app; two open syllables, reads instantly","theme":"coined","scores":{"length":88,"readability":90,"relevance":84,"brandability":89}}]`;

export async function generateUnderstanding(description: string, apiKey: string, lang: "zh" | "en" = "zh"): Promise<AiUnderstanding | null> {
  try {
    const res = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: lang === "en" ? UNDERSTANDING_PROMPT + EN_UNDERSTANDING_HINT : UNDERSTANDING_PROMPT },
          { role: "user", content: `需求描述：${description}` },
        ],
        temperature: 0.3,
        max_tokens: 200,
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

export async function generateAiCandidates(
  description: string,
  apiKey: string,
  opts: { count?: number; feedback?: RefineFeedback; round?: number; lang?: "zh" | "en" } = {},
): Promise<AiCandidate[]> {
  try {
    return await generateOnce(description, apiKey, opts);
  } catch {
    // 瞬时错误/超时自动重试一次：带 jitter 退避，避免整次搜索直接报错
    await new Promise((r) => setTimeout(r, 400 + Math.random() * 600));
    return await generateOnce(description, apiKey, opts);
  }
}

const THEME_NAMES: Record<string, string> = { pinyin: "拼音/缩写", word: "现成英文单词", coined: "英文造词", blend: "拼音+英文混合" };

/** 把上一轮的失败模式总结成具体反思提示，而非简单罗列名单 */
function buildRefineHint(fb: RefineFeedback, round: number): string {
  const parts: string[] = [`这是第 ${round} 轮。`];
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

async function generateOnce(
  description: string,
  apiKey: string,
  opts: { count?: number; feedback?: RefineFeedback; round?: number; lang?: "zh" | "en" } = {},
): Promise<AiCandidate[]> {
  const count = opts.count ?? 24;
  let user = `需求描述：${description}\n请给出 ${count} 个候选。`;
  if (opts.feedback && (opts.feedback.tried.length > 0 || opts.feedback.taken.length > 0)) {
    user += `\n\n${buildRefineHint(opts.feedback, opts.round ?? 2)}`;
  }
  const res = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
    signal: AbortSignal.timeout(60_000), // 单次 LLM 调用超时上限，超时走上层重试
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: opts.lang === "en" ? SYSTEM_PROMPT + EN_NAMING_HINT : SYSTEM_PROMPT + ZH_PINYIN_HINT },
        { role: "user", content: user },
      ],
      temperature: 1.2,
      max_tokens: 4000,
    }),
  });
  if (!res.ok) throw new Error(`llm-http-${res.status}`);
  const data = (await res.json()) as { choices: { message: { content: string } }[] };
  const text = data.choices[0]?.message?.content ?? "";
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) throw new Error("llm-bad-output");
  const arr = JSON.parse(match[0]) as Partial<AiCandidate>[];
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
    if (!/^[a-z0-9-]{1,63}$/.test(label) || seen.has(label)) continue;
    seen.add(label);
    // meaning 为空/全空白的候选直接丢弃（流截断或模型漏字段），不进核验队列；
    // tried 由上层根据返回值累积，被丢弃项天然不计入
    const rawMeaning = String(c.meaning ?? "");
    const meaning = cleanMeaning(rawMeaning);
    if (!meaning) continue;
    // R149：括号注释剥离后过短（<6 字符）说明有效寓意几乎全在括号里，整条丢弃
    if (meaning.length < 6 && PAREN_RE.test(rawMeaning)) continue;
    const s = c.scores ?? ({} as Partial<AiScores>);
    const theme = String(c.theme ?? "").toLowerCase();
    // R124：拼音候选做确定性音节校验，不合法的直接丢弃（不进入核验，节省额度）；
    // blend/word/coined 不强制校验（blend 含英文，无法整体切分）
    let readabilityPenalty = 0;
    if (theme === "pinyin") {
      const check = checkPinyinLabel(label);
      if (!check.ok) continue;
      // 歧义切分扣 15 + 语感风险分（R142），叠加后从 readability 扣除
      readabilityPenalty = (check.ambiguous ? 15 : 0) + check.risk;
    }
    // R182：拼音系候选「」内命中生僻字黑名单，按字数从 readability 扣分（不丢弃）
    if (theme === "pinyin" || theme === "blend") {
      readabilityPenalty += countRareQuotedChars(meaning) * RARE_CHAR_PENALTY_PER_CHAR;
    }
    out.push({
      label,
      meaning,
      theme: THEMES.has(theme) ? (theme as AiTheme) : undefined,
      scores: {
        length: clamp(s.length),
        readability: Math.max(clamp(s.readability) - readabilityPenalty, 0),
        relevance: clamp(s.relevance),
        brandability: clamp(s.brandability),
      },
    });
  }
  return out;
}
