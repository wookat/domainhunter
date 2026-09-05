/** /why 首屏文案（kicker / H1 / 首段），why-page.tsx 与 worker SSR 骨架共用，保证 SSR H1 与水合后一致 */
export const WHY_COPY = {
  zh: {
    kicker: "为什么选 DomainHunter",
    title: "中文创业者的域名猎手：用中文说寓意，猎到真正可注册的 .cn / .com",
    intro:
      "英文通用场景里，Instant Domain Search、Namelix 这类工具已经很好用——我们不在那里争。DomainHunter 专注一件事：中文创业者、独立开发者与出海团队用中文描述寓意，AI 沿拼音、英文、拼音英文混搭多路构思，每个候选实时核验 .cn / .com.cn / .com 等后缀的注册状态，附到期日与价格，只给你能立刻注册的。",
  },
  en: {
    kicker: "Why DomainHunter",
    title: "A domain hunter for Chinese founders: name it in Chinese, register it in .cn / .com",
    intro:
      "For generic English naming, tools like Instant Domain Search and Namelix are already excellent — we don't compete there. DomainHunter does one thing: Chinese founders, indie developers and teams going global describe the meaning in Chinese (or English), AI brainstorms pinyin, English and pinyin-English blends, and every candidate is verified live across .cn / .com.cn / .com and more, with expiry dates and prices — only names you can register right now.",
  },
} as const;
