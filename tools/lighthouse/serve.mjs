// A small web server for the Lighthouse check: the repo at http://127.0.0.1:<port>/loopy/, with gzip, the way
// GitHub Pages serves it. Lighthouse's own static server does not compress, so the "bytes sent" budget would
// count raw sizes. Used by the checks workflow; press Ctrl-C to stop it.
//
//   node tools/lighthouse/serve.mjs [port]     default port 8787
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const PORT = parseInt(process.argv[2] || "8787", 10);
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2", ".webmanifest": "application/manifest+json", ".json": "application/json" };
const TEXT = new Set([".html", ".js", ".css", ".svg", ".webmanifest", ".json"]);

http.createServer((req, res) => {
  const url = decodeURIComponent(new URL(req.url, "http://x").pathname);
  let file = path.join(ROOT, url.replace(/^\/loopy\//, "/"));
  if (!url.startsWith("/loopy/") || !file.startsWith(ROOT)) { res.writeHead(404); return res.end(); }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  if (!fs.existsSync(file)) { res.writeHead(404); return res.end(); }
  const ext = path.extname(file), data = fs.readFileSync(file);
  const headers = { "Content-Type": TYPES[ext] || "application/octet-stream", "Cache-Control": "max-age=600" };
  if (TEXT.has(ext) && /\bgzip\b/.test(req.headers["accept-encoding"] || "")) {
    headers["Content-Encoding"] = "gzip";
    res.writeHead(200, headers);
    return res.end(zlib.gzipSync(data, { level: 9 }));
  }
  res.writeHead(200, headers);
  res.end(data);
}).listen(PORT, "127.0.0.1", () => console.log(`Serving ${ROOT} at http://127.0.0.1:${PORT}/loopy/`));
