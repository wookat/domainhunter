export interface AiCandidate {
  label: string;
  meaning: string;
}

const SYSTEM_PROMPT = `你是资深域名命名专家。用户会用自然语言描述想要的域名寓意/主题/口味，你负责发散出尽可能优质的域名主体（不含 TLD）。

要求：
- 多路发散：中文拼音（全拼/双拼/缩写）、贴切的英文单词、英文合成词/造词、拼音+英文混合
- 优先短（3-10 字符）、好记、好读、有品牌感；避免连字符和数字（除非寓意需要）
- 只输出小写字母组成的合法域名主体
- 常见单词、两三个字母的组合几乎都已被注册，要敢于造词、混搭、用冷僻但好读的组合
- 按推荐度排序

严格输出 JSON 数组，不要输出其他任何文字：
[{"label":"域名主体","meaning":"一句话说明寓意与读法"}]`;

export async function generateAiCandidates(
  description: string,
  apiKey: string,
  opts: { count?: number; excludeTaken?: string[]; round?: number } = {},
): Promise<AiCandidate[]> {
  const count = opts.count ?? 24;
  let user = `需求描述：${description}\n请给出 ${count} 个候选。`;
  if (opts.excludeTaken?.length) {
    user += `\n\n这是第 ${opts.round ?? 2} 轮。以下名字已被注册或已尝试过，禁止再输出它们，并反思其共性（太常见/太直白），这一轮要更有创造性（造词、混搭、冷僻组合），但仍要好读好记、贴合需求：\n${opts.excludeTaken.slice(-120).join(", ")}`;
  }
  const res = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: user },
      ],
      temperature: 1.2,
      max_tokens: 2500,
    }),
  });
  if (!res.ok) throw new Error(`llm-http-${res.status}`);
  const data = (await res.json()) as { choices: { message: { content: string } }[] };
  const text = data.choices[0]?.message?.content ?? "";
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) throw new Error("llm-bad-output");
  const arr = JSON.parse(match[0]) as AiCandidate[];
  const seen = new Set<string>();
  const out: AiCandidate[] = [];
  for (const c of arr) {
    const label = String(c.label ?? "").toLowerCase().replace(/[^a-z0-9-]/g, "");
    if (!label || label.length > 63 || seen.has(label)) continue;
    seen.add(label);
    out.push({ label, meaning: String(c.meaning ?? "") });
  }
  return out;
}
