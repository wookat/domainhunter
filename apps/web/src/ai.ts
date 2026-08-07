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

严格输出 JSON 数组，不要输出其他任何文字：
[{"label":"域名主体","meaning":"一句话说明寓意与读法","theme":"coined","scores":{"length":90,"readability":85,"relevance":88,"brandability":80}}]`;

const ZH_PINYIN_HINT = `

拼音候选强化（用户是中文创业者，拼音系候选质量优先）：
- 三种拼音路线都要覆盖：① 简短双字拼（哔哩哔哩 bilibili、知乎 zhihu、豆瓣 douban 式，追求双拼声调节奏与叠音美感）；② 全拼（小红书 xiaohongshu 式，寓意完整直白）；③ 声母缩写或拼音+英文混搭（zlz、tao+bao+hub 式，短而有记忆点）
- 每个 theme 为 pinyin 或 blend 的候选，meaning 必须包含用「」括起的中文原词，并说明为什么这个拼音好读好记（如声调顺口、叠音、无歧义拼读），例如：「知舟」zhizhou，双字全拼，齿音开头声调上扬，读一遍就能拼出来
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

export type PinyinCheck = { ok: false } | { ok: true; ambiguous: boolean };

// 校验 theme === "pinyin" 的候选：
// - 纯辅音缩写（≤3 字符且不含元音，如 zlz）放行——AI 偶尔把声母缩写标成 pinyin，不应误杀
// - 无法完整切分为合法音节 → 丢弃
// - 最短切分方案音节数 > 4 → 丢弃
// - 存在 ≥2 种「音节数相同且都是最少音节数」的切分方案（如 mingan → min-gan / ming-an）→ 拼读有歧义，
//   仅降 readability，不丢弃；带零声母元音音节的冗余长切分（如 xiao → xi-a-o）不算歧义
export function checkPinyinLabel(label: string): PinyinCheck {
  if (label.length <= 3 && !/[aeiouv]/.test(label)) return { ok: true, ambiguous: false };
  if (/[^a-z]/.test(label)) return { ok: false };
  const segs = segmentPinyin(label);
  if (segs.length === 0) return { ok: false };
  const minSyllables = Math.min(...segs.map((s) => s.length));
  if (minSyllables > 4) return { ok: false };
  const minimal = segs.filter((s) => s.length === minSyllables);
  return { ok: true, ambiguous: minimal.length >= 2 };
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
const EN_MEANING_HINT = "\n\n重要：每个 meaning 说明全部用英文书写（用户界面是英文）。";

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
  opts: { count?: number; excludeTaken?: string[]; round?: number; lang?: "zh" | "en" } = {},
): Promise<AiCandidate[]> {
  try {
    return await generateOnce(description, apiKey, opts);
  } catch {
    return await generateOnce(description, apiKey, opts);
  }
}

async function generateOnce(
  description: string,
  apiKey: string,
  opts: { count?: number; excludeTaken?: string[]; round?: number; lang?: "zh" | "en" } = {},
): Promise<AiCandidate[]> {
  const count = opts.count ?? 24;
  let user = `需求描述：${description}\n请给出 ${count} 个候选。`;
  if (opts.excludeTaken?.length) {
    user += `\n\n这是第 ${opts.round ?? 2} 轮。以下名字已被注册或已尝试过，禁止再输出它们，并反思其共性（太常见/太直白），这一轮要更有创造性（造词、混搭、冷僻组合），但仍要好读好记、贴合需求：\n${opts.excludeTaken.slice(-60).join(", ")}`;
  }
  const res = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: opts.lang === "en" ? SYSTEM_PROMPT + EN_MEANING_HINT : SYSTEM_PROMPT + ZH_PINYIN_HINT },
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
    const label = String(c.label ?? "").toLowerCase().replace(/[^a-z0-9-]/g, "");
    if (!label || label.length > 63 || seen.has(label)) continue;
    seen.add(label);
    const s = c.scores ?? ({} as Partial<AiScores>);
    const theme = String(c.theme ?? "").toLowerCase();
    // R124：拼音候选做确定性音节校验，不合法的直接丢弃（不进入核验，节省额度）；
    // blend/word/coined 不强制校验（blend 含英文，无法整体切分）
    let readabilityPenalty = 0;
    if (theme === "pinyin") {
      const check = checkPinyinLabel(label);
      if (!check.ok) continue;
      if (check.ambiguous) readabilityPenalty = 15;
    }
    out.push({
      label,
      meaning: String(c.meaning ?? ""),
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
