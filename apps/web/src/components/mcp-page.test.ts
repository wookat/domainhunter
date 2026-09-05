import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { McpPage } from "./mcp-page";

describe("McpPage 代码块可键盘聚焦（axe scrollable-region-focusable）", () => {
  it("每个可横向滚动的 <pre> 都有 tabindex=0 与可见 focus ring，且不影响 <code> 内容", () => {
    const html = renderToStaticMarkup(createElement(McpPage));
    const pres = html.match(/<pre\b[^>]*>/g) ?? [];
    expect(pres.length).toBeGreaterThanOrEqual(3);
    for (const tag of pres) {
      expect(tag, tag).toContain('tabindex="0"');
      expect(tag, tag).toContain("overflow-x-auto");
      expect(tag, tag).toMatch(/focus-visible:ring-2/);
    }
    expect(html).toContain("<code>");
    expect(html).toContain("hunt.zalize.com/mcp");
  });
});
