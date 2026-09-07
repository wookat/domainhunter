import http from "node:http";
// 第 1 个请求返回 429（模拟供应商限流），之后按 IndexNow 实测规律：>100 URL → 429，否则 200
let total = 0;
http.createServer((req, res) => {
  let b = "";
  req.on("data", (c) => (b += c));
  req.on("end", () => {
    total++;
    const n = JSON.parse(b).urlList.length;
    const s = n > 100 || total === 1 ? 429 : 200;
    console.log(JSON.stringify({ n, s, total }));
    res.writeHead(s);
    res.end();
  });
}).listen(8799, () => console.log("mock429 up"));
