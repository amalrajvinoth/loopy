// Serve loopy the way GitHub Pages does: the games at /loopy/ and the built guide at /loopy/guide/.
//   node scripts/serve.mjs [port]      then open http://localhost:4321/loopy/guide/
// Also used by scripts/screens.mjs and scripts/check.mjs (import { start } from "./serve.mjs").
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");
const GUIDE = path.resolve(HERE, "../dist");
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png",
  ".jpg": "image/jpeg", ".webp": "image/webp", ".woff2": "font/woff2", ".webmanifest": "application/manifest+json", ".json": "application/json",
  ".txt": "text/plain", ".wasm": "application/wasm", ".pf_meta": "application/octet-stream", ".xml": "application/xml" };

export function start(port = 0) {
  const server = http.createServer((req, res) => {
    const url = decodeURIComponent(new URL(req.url, "http://x").pathname);
    let base = ROOT, rest = url.replace(/^\/loopy\//, "/");
    if (url.startsWith("/loopy/guide/")) { base = GUIDE; rest = url.slice("/loopy/guide".length); }
    let file = path.join(base, rest);
    if (!url.startsWith("/loopy/") || !file.startsWith(base)) { res.writeHead(404); return res.end(); }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!fs.existsSync(file)) { res.writeHead(404); return res.end("Not found"); }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((r) => server.listen(port, "127.0.0.1", () => r({ server, origin: `http://127.0.0.1:${server.address().port}` })));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { origin } = await start(+(process.argv[2] || 4321));
  console.log(`loopy at ${origin}/loopy/  ·  guide at ${origin}/loopy/guide/`);
}
