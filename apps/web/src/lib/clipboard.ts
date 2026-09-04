/**
 * 写剪贴板：优先 async Clipboard API；不可用或被拒（微信/部分 WebView 报 NotAllowedError）时
 * 回退 textarea + execCommand("copy")。返回是否成功，调用方据此决定「已复制」反馈。
 */
export async function copyText(text: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // fall through
    }
  }
  return execCopy(text);
}

function execCopy(text: string): boolean {
  if (typeof document === "undefined" || typeof document.execCommand !== "function") return false;
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.setAttribute("aria-hidden", "true");
  ta.style.cssText = "position:fixed;top:0;left:-9999px;opacity:0;";
  document.body.appendChild(ta);
  const active = document.activeElement;
  try {
    ta.select();
    ta.setSelectionRange(0, text.length);
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    document.body.removeChild(ta);
    if (active instanceof HTMLElement) active.focus();
  }
}
