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

/** refine 轮反馈：跨轮去重 + 被注册名的模式总结素材 */
export interface RefineFeedback {
  /** 已核验过的全部主体（无论结果），refine 轮严禁重复输出 */
  tried: string[];
  /** 其中已被注册的主体 */
  taken: string[];
  /** 被注册主体的命名思路分布（仅统计已知 theme 的） */
  takenThemes: Partial<Record<AiTheme, number>>;
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
        { role: "system", content: opts.lang === "en" ? SYSTEM_PROMPT + EN_MEANING_HINT : SYSTEM_PROMPT },
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
