import { normalizeLabel } from "@domainhunter/core";

export type VariantNameResult = { ok: true; name: string } | { ok: false; error: string };

/**
 * MCP suggest_variants 的 name 参数校验：必须是不含后缀的裸名字。
 * 含 "." 的输入（如 zalize.com）以前会被 normalizeLabel 静默去点成 zalizecom 再拼变体，
 * 这里改为明确报错（zh/en），提示改用 check_domains 或去掉后缀。
 */
export function parseVariantName(raw: unknown): VariantNameResult {
  const input = String(raw ?? "").trim();
  if (input.includes(".")) {
    const bare = input.replace(/^\.+/, "").split(".")[0] || "acme";
    return {
      ok: false,
      error:
        `invalid name: "${input}" contains a dot — pass a bare label without TLD (e.g. "${bare}", not "${input}"); to check a full domain use check_domains. ` +
        `名字里不能带「.」：请传不含后缀的名字（如 "${bare}"，而不是 "${input}"）；要核验完整域名请用 check_domains。`,
    };
  }
  const name = normalizeLabel(input);
  if (!name || name.length < 2) return { ok: false, error: "invalid name: pass a bare label of 2+ chars like acme (no TLD) / 请传 2 个字符以上、不含后缀的名字，如 acme" };
  return { ok: true, name };
}
