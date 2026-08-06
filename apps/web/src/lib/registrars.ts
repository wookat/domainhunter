export interface Registrar {
  name: string;
  /** 有实时价的注册商标识（当前仅 porkbun） */
  key?: string;
  url: (d: string) => string;
}

export const REGISTRARS: Registrar[] = [
  { name: "Porkbun", key: "porkbun", url: (d: string) => `https://porkbun.com/checkout/search?q=${encodeURIComponent(d)}` },
  { name: "阿里云", url: (d: string) => `https://wanwang.aliyun.com/domain/searchresult/#/?keyword=${encodeURIComponent(d)}` },
  { name: "腾讯云", url: (d: string) => `https://buy.cloud.tencent.com/domain?domain=${encodeURIComponent(d)}` },
  { name: "Namecheap", url: (d: string) => `https://www.namecheap.com/domains/registration/results/?domain=${encodeURIComponent(d)}` },
  { name: "Cloudflare", url: (d: string) => `https://domains.cloudflare.com/?domain=${encodeURIComponent(d)}` },
];
