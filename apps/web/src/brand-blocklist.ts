// 知名品牌撞名过滤（R180）：候选 label 与全球知名品牌/产品名完全同名，
// 或编辑距离 ≤1 且长度 ≥5（避免误杀短词）时直接丢弃，规避商标法律风险。
// 词表覆盖：全球科技、消费品牌、中国互联网。全部小写，按字母序分组便于维护。

export const BRAND_BLOCKLIST: readonly string[] = [
  // A
  "adidas", "adobe", "airbnb", "airtable", "alibaba", "alipay", "amazon", "android",
  "anthropic", "apple", "asana", "asus", "atlassian", "audi", "azure",
  // B
  "baidu", "bilibili", "binance", "bing", "bitly", "blender", "bloomberg", "bmw",
  "boeing", "bosch", "bulgari", "burberry", "bytedance",
  // C
  "canva", "carrefour", "chanel", "chatgpt", "chrome", "cisco", "citibank", "claude",
  "cloudflare", "cocacola", "coinbase", "colgate", "coursera", "cursor",
  // D
  "damai", "datadog", "deepseek", "dell", "deloitte", "didi", "discord", "disney",
  "docker", "douban", "douyin", "dropbox", "duolingo", "dyson",
  // E
  "ebay", "electron", "eleme", "evernote", "excel",
  // F
  "facebook", "fedex", "ferrari", "figma", "firebase", "firefox", "fitbit", "flickr",
  "flutter", "ford", "fortnite", "foxconn",
  // G
  "gemini", "gillette", "github", "gitlab", "gmail", "godaddy", "goldman", "google",
  "gopro", "grafana", "grammarly", "gucci",
  // H
  "haier", "heroku", "hilton", "honda", "hubspot", "huawei", "hulu", "huya",
  // I
  "ibm", "ikea", "instagram", "intel", "intercom", "iphone", "iqiyi",
  // J
  "javascript", "jenkins", "jira", "jingdong",
  // K
  "kafka", "kickstarter", "kindle", "klarna", "kuaishou", "kubernetes",
  // L
  "lamborghini", "lazada", "lego", "lenovo", "linear", "linkedin", "linux", "loom",
  "lululemon", "lyft",
  // M
  "mailchimp", "marriott", "mastercard", "mcdonalds", "medium", "meituan", "mercedes",
  "meta", "microsoft", "midjourney", "mistral", "miro", "mongodb", "mozilla", "mysql",
  // N
  "nasdaq", "netflix", "netease", "nike", "nintendo", "nissan", "nokia", "notion",
  "nvidia",
  // O
  "obsidian", "office", "openai", "opera", "oppo", "oracle", "outlook",
  // P
  "panasonic", "patreon", "paypal", "pepsi", "philips", "pinduoduo", "pinterest",
  "playstation", "porsche", "postman", "prada", "privado", "privyr", "python",
  // Q
  "qualcomm", "quora", "qzone",
  // R
  "reddit", "redis", "replit", "roblox", "rolex",
  // S
  "salesforce", "samsung", "sephora", "sharp", "shazam", "shein", "shopee", "shopify",
  "siemens", "skype", "slack", "snapchat", "sony", "soundcloud", "sparknotes",
  "spotify", "spacex", "starbucks", "steam", "stripe", "substack", "supabase", "swift",
  // T
  "taobao", "telegram", "temu", "tencent", "tesla", "tiktok", "tinder", "tmall",
  "toutiao", "toyota", "trello", "tripadvisor", "tumblr", "twilio", "twitch", "twitter",
  // U
  "uber", "ubuntu", "udemy", "unilever", "unity", "unsplash", "upwork",
  // V
  "vercel", "verizon", "viber", "visa", "vivo", "vmware", "volvo", "vscode",
  // W
  "walmart", "wechat", "weibo", "whatsapp", "wikipedia", "windows", "wordpress",
  "wework",
  // X
  "xbox", "xiaohongshu", "xiaomi", "xianyu",
  // Y
  "yahoo", "yandex", "youku", "youtube", "yuewen",
  // Z
  "zalando", "zapier", "zara", "zhihu", "zillow", "zoom",
];

const BRAND_SET = new Set<string>(BRAND_BLOCKLIST);

// 有界编辑距离判定（Levenshtein ≤1）：长度差 >1 直接否；同长看单点替换，
// 长度差 1 看单点插入/删除，避免整表跑 DP。
export function withinEditDistance1(a: string, b: string): boolean {
  if (a === b) return true;
  const la = a.length;
  const lb = b.length;
  if (Math.abs(la - lb) > 1) return false;
  if (la === lb) {
    let diff = 0;
    for (let i = 0; i < la; i++) {
      if (a[i] !== b[i]) {
        diff++;
        if (diff > 1) return false;
      }
    }
    return diff <= 1;
  }
  // 长度差 1：短串是否为长串删除一个字符所得
  const [short, long] = la < lb ? [a, b] : [b, a];
  let i = 0;
  let j = 0;
  let skipped = false;
  while (i < short.length && j < long.length) {
    if (short[i] === long[j]) {
      i++;
      j++;
    } else {
      if (skipped) return false;
      skipped = true;
      j++;
    }
  }
  return true;
}

/**
 * 品牌撞名判定：
 * - label 与词表完全同名 → 命中（任何长度）
 * - label 长度 ≥5 且与某词表词编辑距离 ≤1 → 命中（短词不做模糊匹配，避免误杀）
 */
export function isBrandCollision(label: string): boolean {
  if (BRAND_SET.has(label)) return true;
  if (label.length < 5) return false;
  for (const brand of BRAND_BLOCKLIST) {
    if (withinEditDistance1(label, brand)) return true;
  }
  return false;
}
