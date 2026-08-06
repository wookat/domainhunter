/**
 * 行业指南页脚链接所需的最小数据（slug + 双语短标签）。
 * 与 guides.ts 分离：guides.ts 全文内容只进懒加载的 guide/tld chunk，不进首屏主 bundle。
 */
export const GUIDE_LABELS: { slug: string; zh: string; en: string }[] = [
  { slug: "saas", zh: "SaaS 工具", en: "SaaS tools" },
  { slug: "ecommerce", zh: "电商品牌", en: "E-commerce" },
  { slug: "ai", zh: "AI 产品", en: "AI products" },
  { slug: "fintech", zh: "金融科技", en: "Fintech" },
  { slug: "pets", zh: "宠物品牌", en: "Pet brands" },
  { slug: "blog", zh: "个人博客", en: "Blogs" },
  { slug: "game", zh: "游戏", en: "Games" },
  { slug: "edu", zh: "教育产品", en: "Education" },
];
