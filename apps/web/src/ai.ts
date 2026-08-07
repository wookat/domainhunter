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
    out.push({
      label,
      meaning: String(c.meaning ?? ""),
      theme: THEMES.has(theme) ? (theme as AiTheme) : undefined,
      scores: {
        length: clamp(s.length),
        readability: clamp(s.readability),
        relevance: clamp(s.relevance),
        brandability: clamp(s.brandability),
      },
    });
  }
  return out;
}
