import { useState } from "react";
import { Check, Copy, Plug, Terminal, Wrench } from "lucide-react";

import { TLD_LIST } from "@/content/tld-list";
import { useI18n } from "@/lib/i18n";
import { usePageTitle } from "@/lib/use-page-title";

interface McpCopy {
  kicker: string;
  title: string;
  intro: string;
  endpointTitle: string;
  endpointDesc: string;
  toolsTitle: string;
  tools: { name: string; desc: string }[];
  connectTitle: string;
  connectDesc: string;
  curlTitle: string;
  notesTitle: string;
  notes: string[];
  copy: string;
  copied: string;
}

const ENDPOINT = "https://hunt.zalize.com/mcp";

const CLIENT_CONFIG = `{
  "mcpServers": {
    "domainhunter": {
      "type": "http",
      "url": "${ENDPOINT}"
    }
  }
}`;

const CURL_EXAMPLE = `curl -X POST ${ENDPOINT} \\
  -H 'content-type: application/json' \\
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"check_domains","arguments":{"domains":["acme.com","acme.io"]}}}'`;

const CURL_VARIANTS_EXAMPLE = `curl -X POST ${ENDPOINT} \\
  -H 'content-type: application/json' \\
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"suggest_variants","arguments":{"name":"acme","tlds":["com","io"],"limit":24}}}'`;

const COPY: Record<"zh" | "en", McpCopy> = {
  zh: {
    kicker: "MCP Server",
    title: "把域名核验接进你的 AI 助手",
    intro:
      "DomainHunter 提供免费、无需鉴权的 MCP（Model Context Protocol）server。把它加进 Claude、Cursor 等支持 MCP 的 AI 工具后，AI 就能在对话里直接批量核验域名是否可注册、查询各后缀的实时注册/续费价。",
    endpointTitle: "端点",
    endpointDesc: "无状态 Streamable HTTP（JSON-RPC 2.0，仅 POST），无需 API key。",
    toolsTitle: "提供的工具",
    tools: [
      { name: "check_domains", desc: "批量核验最多 50 个完整域名（如 acme.com）的实时可注册状态：available / taken / unknown。走 RDAP + DNS + WHOIS 三级核验，与网站同一套逻辑。" },
      { name: "tld_prices", desc: `查询 ${TLD_LIST.length} 个主流后缀的首年注册价与续费价（美元，Porkbun 实时价），用于识别「首年便宜续费贵」的坑。` },
      { name: "suggest_variants", desc: "心仪名字被注册时，用与网站一致的前后缀规则（get/my/try/use + 名字、名字 + app/hq/labs/hub）生成变体并批量实时核验，可注册的排前面并附首年价（美元）。零 AI 调用。" },
    ],
    connectTitle: "接入方法",
    connectDesc: "在 Claude Code / Cursor 等客户端的 MCP 配置（如 .mcp.json）中加入：",
    curlTitle: "curl 直接调用",
    notesTitle: "说明",
    notes: [
      "完全免费、无需注册或 API key；核验请求与网站共用限频（每 IP 每小时）。",
      "只做核验与查价，不会自动注册域名或产生任何费用。",
      "想从寓意出发让 AI 多轮猎名，请直接使用网站首页的 AI 猎名。",
    ],
    copy: "复制",
    copied: "已复制",
  },
  en: {
    kicker: "MCP Server",
    title: "Plug domain checking into your AI assistant",
    intro:
      "DomainHunter ships a free, no-auth MCP (Model Context Protocol) server. Add it to Claude, Cursor or any MCP-capable AI tool and your assistant can bulk-check domain availability and look up live TLD prices right inside the conversation.",
    endpointTitle: "Endpoint",
    endpointDesc: "Stateless Streamable HTTP (JSON-RPC 2.0, POST only). No API key required.",
    toolsTitle: "Tools",
    tools: [
      { name: "check_domains", desc: "Live availability for up to 50 exact domains (e.g. acme.com): available / taken / unknown. Same RDAP + DNS + WHOIS pipeline the site uses." },
      { name: "tld_prices", desc: `First-year registration vs renewal prices (USD, live from Porkbun) for the ${TLD_LIST.length} popular TLDs we track — handy for spotting renewal traps.` },
      { name: "suggest_variants", desc: "When a name is taken, generates prefix/suffix variants (get/my/try/use + name, name + app/hq/labs/hub — same rules as the site) and bulk-checks them live. Available domains come first with first-year prices (USD). Zero AI calls." },
    ],
    connectTitle: "Connect",
    connectDesc: "Add this to your client's MCP config (e.g. .mcp.json in Claude Code / Cursor):",
    curlTitle: "Call it with curl",
    notesTitle: "Notes",
    notes: [
      "Completely free, no signup or API key; checks share the site's per-IP hourly rate limit.",
      "Checking and pricing only — it never registers domains or incurs charges.",
      "For meaning-driven multi-round AI name hunting, use the homepage hunt directly.",
    ],
    copy: "Copy",
    copied: "Copied",
  },
};

function CodeBlock({ code, copyLabel, copiedLabel }: { code: string; copyLabel: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="relative mt-3">
      <pre className="overflow-x-auto rounded-xl border border-line bg-bg1 p-4 text-[12.5px] leading-relaxed text-txt1">
        <code>{code}</code>
      </pre>
      <button
        onClick={() => {
          void navigator.clipboard.writeText(code).then(() => {
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1500);
          });
        }}
        className="absolute right-2 top-2 inline-flex h-8 items-center gap-1 rounded-md border border-line bg-bg0 px-2 text-xs text-txt1 hover:text-txt0"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-brand" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? copiedLabel : copyLabel}
      </button>
    </div>
  );
}

export function McpPage() {
  const { lang } = useI18n();
  const c = COPY[lang];
  usePageTitle(c.title);
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16 pt-10 md:px-6">
      <p className="flex items-center gap-1.5 font-mono text-sm text-brand">
        <Plug className="h-4 w-4" />
        {c.kicker}
      </p>
      <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-[-0.02em] md:text-4xl">{c.title}</h1>
      <p className="mt-4 leading-relaxed text-txt1">{c.intro}</p>

      <h2 className="mt-10 text-xl font-bold">{c.endpointTitle}</h2>
      <p className="mt-2 text-sm text-txt1">{c.endpointDesc}</p>
      <p className="mt-3 rounded-xl border border-line bg-bg1 px-4 py-3 font-mono text-sm text-txt0">POST {ENDPOINT}</p>

      <h2 className="mt-10 flex items-center gap-2 text-xl font-bold">
        <Wrench className="h-4 w-4 text-brand" />
        {c.toolsTitle}
      </h2>
      <div className="mt-3 space-y-3">
        {c.tools.map((tool) => (
          <div key={tool.name} className="rounded-xl border border-line bg-bg1 p-4">
            <p className="font-mono text-sm font-semibold text-brand">{tool.name}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-txt1">{tool.desc}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-xl font-bold">{c.connectTitle}</h2>
      <p className="mt-2 text-sm text-txt1">{c.connectDesc}</p>
      <CodeBlock code={CLIENT_CONFIG} copyLabel={c.copy} copiedLabel={c.copied} />

      <h2 className="mt-10 flex items-center gap-2 text-xl font-bold">
        <Terminal className="h-4 w-4 text-brand" />
        {c.curlTitle}
      </h2>
      <CodeBlock code={CURL_EXAMPLE} copyLabel={c.copy} copiedLabel={c.copied} />
      <CodeBlock code={CURL_VARIANTS_EXAMPLE} copyLabel={c.copy} copiedLabel={c.copied} />

      <h2 className="mt-10 text-xl font-bold">{c.notesTitle}</h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-txt1">
        {c.notes.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>
    </main>
  );
}
