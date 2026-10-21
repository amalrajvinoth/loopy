// Offline copy test: after an update, every phone saves the new pages, never an old one.
// See tools/e2e/README.md.
//
//   npm ci --prefix tools/a11y --ignore-scripts   (once: the same two packages as the accessibility check)
//   node tools/e2e/offline.mjs                    (exit code 1 if anything fails)
//
// Right after an update, the site's servers can still hand out an old file for a few minutes.
// The offline helper (sw.js) checks every file against its hash before it saves it. This test serves
// the site at /loopy/ with a server that lags like that, and checks three things:
//   1. A lagging server: the helper asks again with ?v=<hash> and saves the new grown-ups page.
//   2. A wrong page already saved (an older helper saved it): the next update downloads it again.
//   3. A server that never gives the right file does not stop the update.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");
const require = createRequire(path.join(process.env.A11Y_DEPS || path.join(ROOT, "tools/a11y"), "package.json"));
const { chromium } = require("playwright-core");

const SW = fs.readFileSync(path.join(ROOT, "sw.js"), "utf8");
const OLD = "<!doctype html><title>old</title><p>An old grown-ups page.</p>";
const PAGE = "progress/";
// version: a letter added to VERSION, so each step is a new helper. lag: "plain" (old file unless ?v=),
// "always" (old file every time) or "never".
let mode = { version: "a", lag: "never" };

const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png",
  ".woff2": "font/woff2", ".webmanifest": "application/manifest+json", ".json": "application/json", ".txt": "text/plain" };
const server = http.createServer((req, res) => {
  const u = new URL(req.url, "http://x"), url = decodeURIComponent(u.pathname);
  if (url === "/loopy/sw.js") {
    res.writeHead(200, { "Content-Type": "text/javascript", "Cache-Control": "no-cache" });
    return res.end(SW.replace(/VERSION="([0-9a-f]+)"/, (m, v) => `VERSION="${v}${mode.version}"`));
  }
  if (url === "/loopy/" + PAGE && (mode.lag === "always" || (mode.lag === "plain" && !u.searchParams.has("v")))) {
    res.writeHead(200, { "Content-Type": "text/html" });
    return res.end(OLD);
  }
  let file = path.join(ROOT, url.replace(/^\/loopy\//, "/"));
  if (!url.startsWith("/loopy/") || !file.startsWith(ROOT)) { res.writeHead(404); return res.end(); }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  if (!fs.existsSync(file)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});
await new Promise(r => server.listen(0, "127.0.0.1", r));
const BASE = `http://127.0.0.1:${server.address().port}/loopy/`;

async function launch() {
  const tries = [];
  if (process.env.CHROME) tries.push({ executablePath: process.env.CHROME });
  for (const p of ["/opt/pw-browsers/chromium-1194/chrome-linux/chrome", "/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser"])
    if (fs.existsSync(p)) tries.push({ executablePath: p });
  tries.push({ channel: "chrome" });
  for (const t of tries) { try { return await chromium.launch(t); } catch (e) { /* try the next one */ } }
  throw new Error("No Chrome or Chromium found. Set CHROME=/path/to/chrome.");
}
const browser = await launch();

// Wait until the helper for this version has saved everything (its file list is saved last) and the old copy is gone.
async function settled(page, version) {
  for (let i = 0; i < 150; i++) {
    const ok = await page.evaluate(async v => {
      const k = (await caches.keys()).filter(n => n.startsWith("loopy-"));
      if (k.length !== 1 || !k[0].endsWith(v)) return false;
      return !!(await (await caches.open(k[0])).match(new URL("loopy-files", location.href).href));
    }, version);
    if (ok) return true;
    await new Promise(r => setTimeout(r, 200));
  }
  return false;
}
// What the offline copy holds for the grown-ups page: "new", "old" or "missing".
function saved(page) {
  return page.evaluate(async p => {
    const k = (await caches.keys()).filter(n => n.startsWith("loopy-"));
    const r = k.length ? await (await caches.open(k[k.length - 1])).match(new URL(p, location.href).href) : null;
    return r ? ((await r.text()).includes("An old grown-ups page") ? "old" : "new") : "missing";
  }, PAGE);
}
async function update(page, version, lag) {
  mode = { version, lag };
  await page.evaluate(() => navigator.serviceWorker.getRegistration().then(r => r.update()));
  return settled(page, version);
}

const rows = [], problems = [];
const check = (what, ok, got) => { rows.push([what, ok ? "pass" : "FAIL", got]); if (!ok) problems.push(what); };
const ctx = await browser.newContext(), page = await ctx.newPage();
mode = { version: "a", lag: "plain" };
await page.goto(BASE);
let done = await settled(page, "a");
let got = await saved(page);
check("A lagging server: the new page is saved", done && got === "new", got);

// An older helper saved the wrong page under the new hash. The next update must fix it.
await page.evaluate(async ([p, old]) => {
  const k = (await caches.keys()).filter(n => n.startsWith("loopy-"));
  await (await caches.open(k[0])).put(new URL(p, location.href).href, new Response(old, { headers: { "Content-Type": "text/html" } }));
}, [PAGE, OLD]);
done = await update(page, "b", "never");
got = await saved(page);
check("A wrong saved page is downloaded again", done && got === "new", got);

done = await update(page, "c", "always");
check("A server that never gives the right file does not stop the update", done, done ? "updated" : "stuck");
await ctx.close();

console.log("| Check | Result | Saved page |\n| --- | --- | --- |");
for (const r of rows) console.log(`| ${r.join(" | ")} |`);
await browser.close();
server.close();
if (problems.length) { console.log(`\n${problems.length} problem(s).`); process.exit(1); }
console.log("\nNo problems found.");
