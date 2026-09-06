import type { FaqItem } from "@/content/faq";
import { splitFaqAnswer } from "@/content/faq";

/**
 * 内容页 FAQ 答案：纯文本 + 可选的页内锚点链接（item.link），
 * 与 content/ssr-html.ts faqAnswerHtml 的 DOM/类名逐字一致；JSON-LD 只用纯文本 item.a。
 */
export function FaqAnswer({ item }: { item: FaqItem }) {
  const parts = splitFaqAnswer(item);
  if (!parts || !item.link) return <>{item.a}</>;
  return (
    <>
      {parts[0]}
      <a href={`#${item.link.hash}`} className="text-brand underline underline-offset-4 hover:opacity-80">
        {parts[1]}
      </a>
      {parts[2]}
    </>
  );
}
