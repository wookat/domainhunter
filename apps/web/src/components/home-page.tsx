import { useState } from "react";
import { BadgeCheck, Gauge, Plus, Repeat, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const EXAMPLES = ["冥想 App，安静治愈", "跨境电商选品工具", "程序员副业社区"];
const PRESET_TLDS = ["com", "cn", "io", "ai", "app", "dev"];
const MAX_LEN = 200;

export const STYLE_OPTIONS = [
  { value: "none", label: "不限风格" },
  { value: "极客风", label: "极客风" },
  { value: "商务专业", label: "商务专业" },
  { value: "文艺诗意", label: "文艺诗意" },
  { value: "中文拼音", label: "中文拼音" },
];

export const LENGTH_OPTIONS = [
  { value: "none", label: "不限长度" },
  { value: "短小精悍（≤8 字符）", label: "短小精悍（≤8 字符）" },
  { value: "中等（9–12 字符）", label: "中等（9–12 字符）" },
  { value: "长一点也可以（>12 字符）", label: "长一点也可以" },
];

export interface HomeValues {
  description: string;
  tlds: string[];
  style: string;
  lengthPref: string;
}

export function HomePage({
  initial,
  onSubmit,
}: {
  initial: HomeValues;
  onSubmit: (v: HomeValues) => void;
}) {
  const [description, setDescription] = useState(initial.description);
  const [tlds, setTlds] = useState<string[]>(initial.tlds);
  const [style, setStyle] = useState(initial.style || "none");
  const [lengthPref, setLengthPref] = useState(initial.lengthPref || "none");
  const [customTld, setCustomTld] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  const customTlds = tlds.filter((t) => !PRESET_TLDS.includes(t));
  const toggleTld = (t: string) =>
    setTlds((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const addCustomTld = () => {
    const t = customTld.trim().toLowerCase().replace(/^\./, "");
    if (t && /^[a-z0-9-]{2,}$/.test(t) && !tlds.includes(t)) setTlds((prev) => [...prev, t]);
    setCustomTld("");
    setShowCustom(false);
  };

  const canRun = description.trim().length > 0 && tlds.length > 0;

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-3xl px-4 pb-16 pt-12 md:px-6 md:pt-20">
        <div className="mb-10 text-center">
          <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            <Sparkles className="h-3.5 w-3.5" /> AI Agent · 实时核验可注册
          </div>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight md:text-4xl">
            说出寓意，<span className="text-emerald-600">猎到</span>真正可注册的好域名
          </h1>
          <p className="mt-3 text-base text-zinc-500 md:text-lg">AI 分轮构思名字与寓意，逐个实时核验，不够就反思重试</p>
        </div>

        <Card className="p-4 md:p-6">
          <div className="rounded-lg border border-zinc-200 transition-shadow focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
            <Textarea
              rows={3}
              className="resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="用一句话描述你想要的域名，例如：帮体制内的人找新工作的平台，希望名字读起来专业可信、好记"
              value={description}
              maxLength={MAX_LEN}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="flex items-center justify-between px-3 pb-2.5">
              <span className="text-xs text-zinc-400">越具体越好 · 支持中文</span>
              <span className="text-xs text-zinc-400">
                {description.length} / {MAX_LEN}
              </span>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="self-center text-xs text-zinc-400">试试：</span>
            {EXAMPLES.map((ex, i) => (
              <button
                key={ex}
                onClick={() => setDescription(ex)}
                className={cn(
                  "rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs text-zinc-600 transition-colors hover:border-emerald-300 hover:text-emerald-700",
                  i === 2 && "hidden sm:inline-flex",
                )}
              >
                {ex}
              </button>
            ))}
          </div>

          <div className="mt-5">
            <label className="text-sm font-medium text-zinc-900">想要的后缀（TLD）</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {[...PRESET_TLDS, ...customTlds].map((t) => {
                const active = tlds.includes(t);
                return (
                  <button
                    key={t}
                    onClick={() => toggleTld(t)}
                    aria-pressed={active}
                    className={cn(
                      "inline-flex h-9 items-center rounded-full border px-4 text-sm font-medium transition-colors",
                      active
                        ? "border-emerald-600 bg-emerald-600 text-white"
                        : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300",
                    )}
                  >
                    .{t}
                  </button>
                );
              })}
              {showCustom ? (
                <Input
                  autoFocus
                  className="h-9 w-28 rounded-full"
                  placeholder="如 net"
                  value={customTld}
                  onChange={(e) => setCustomTld(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCustomTld()}
                  onBlur={addCustomTld}
                />
              ) : (
                <button
                  onClick={() => setShowCustom(true)}
                  className="inline-flex h-9 items-center gap-1 rounded-full border border-dashed border-zinc-300 bg-white px-3 text-sm text-zinc-500 hover:border-zinc-400"
                >
                  <Plus className="h-3.5 w-3.5" />
                  自定义
                </button>
              )}
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-zinc-900">命名风格</label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STYLE_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-900">名字长度偏好</label>
              <Select value={lengthPref} onValueChange={setLengthPref}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LENGTH_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            size="lg"
            className="mt-6 w-full"
            disabled={!canRun}
            onClick={() =>
              onSubmit({
                description: description.trim(),
                tlds,
                style: style === "none" ? "" : style,
                lengthPref: lengthPref === "none" ? "" : lengthPref,
              })
            }
          >
            <Sparkles className="h-5 w-5" /> AI 帮我找域名
          </Button>
          <p className="mt-3 text-center text-xs text-zinc-400">通常 60 秒内给出 10+ 个可注册结果 · 免费</p>
        </Card>

        <div className="mt-10 grid grid-cols-1 gap-4 text-center sm:grid-cols-3">
          {[
            { icon: BadgeCheck, title: "实时核验", desc: "RDAP + DNS + WHOIS 级联，可注册才展示" },
            { icon: Repeat, title: "不够就重试", desc: "Agent 反思上一轮，自动再构思下一批" },
            { icon: Gauge, title: "四维评分", desc: "长度 / 读感 / 寓意贴合 / 品牌感排序" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-xl border border-zinc-200 p-4">
              <Icon className="mx-auto h-5 w-5 text-emerald-600" />
              <p className="mt-2 text-sm font-medium">{title}</p>
              <p className="mt-1 text-xs text-zinc-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
