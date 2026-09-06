// R537: Lighthouse snapshot-mode audit of the 404 shell (navigation mode refuses 404 documents).
// usage: node lh_snapshot_404.mjs <url> <out.json> [mobile]
import path from "node:path";
import fs from "node:fs";
const LH = path.join(process.env.NPM_GLOBAL_ROOT, "lighthouse");
const { snapshot, desktopConfig } = await import(path.join(LH, "core/index.js"));
const puppeteer = await import(path.join(LH, "node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js"));
const [url, out, form] = process.argv.slice(2);
const browser = await puppeteer.default.launch({
  executablePath: "/opt/.devin/chrome/chrome/linux-137.0.7118.2/chrome-linux64/chrome",
  headless: true, args: ["--no-sandbox", "--disable-gpu"],
});
const page = await browser.newPage();
const resp = await page.goto(url, { waitUntil: "networkidle0" });
const status = resp.status();
await new Promise((r) => setTimeout(r, 1500));
const config = form === "mobile" ? undefined : desktopConfig;
const result = await snapshot(page, { config, flags: { onlyCategories: ["accessibility", "best-practices", "seo"] } });
const lhr = result.lhr;
const cats = Object.fromEntries(Object.entries(lhr.categories).map(([k, v]) => [k, v.score]));
const failed = Object.values(lhr.audits).filter((a) => a.score !== null && a.score < 1 && a.scoreDisplayMode !== "informative").map((a) => a.id);
fs.writeFileSync(out, JSON.stringify({ url, httpStatus: status, form: form || "desktop", categories: cats, failedAudits: failed, lhr }, null, 1));
console.log(JSON.stringify({ url, httpStatus: status, form: form || "desktop", categories: cats, failedAudits: failed }));
await browser.close();
