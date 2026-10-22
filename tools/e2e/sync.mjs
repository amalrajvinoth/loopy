// Family sync test: two devices stay in step through the sync server, and a device where sync is off
// sends nothing anywhere. See tools/e2e/README.md.
//
//   npm ci --prefix tools/a11y --ignore-scripts   (once: the same two packages as the accessibility check)
//   node tools/e2e/sync.mjs                       (exit code 1 if anything fails)
//
// The site is served at /loopy/ as if Loopy.syncHost were "sync.test" (loopy.js and each page's policy
// are changed on the way out). Requests to https://sync.test go to the real server code (sync/worker.js)
// with a stand-in database (sync/fake-d1.mjs), inside this test. Nothing leaves the computer.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import worker from "../../sync/worker.js";
import { fakeD1 } from "../../sync/fake-d1.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");
const require = createRequire(path.join(process.env.A11Y_DEPS || path.join(ROOT, "tools/a11y"), "package.json"));
const { chromium } = require("playwright-core");
const HOST = "sync.test";

const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png",
  ".woff2": "font/woff2", ".webmanifest": "application/manifest+json", ".json": "application/json", ".txt": "text/plain" };
const server = http.createServer((req, res) => {
  const url = decodeURIComponent(new URL(req.url, "http://x").pathname);
  let file = path.join(ROOT, url.replace(/^\/loopy\//, "/"));
  if (!url.startsWith("/loopy/") || !file.startsWith(ROOT)) { res.writeHead(404); return res.end(); }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  if (!fs.existsSync(file)) { res.writeHead(404); return res.end(); }
  const type = TYPES[path.extname(file)] || "application/octet-stream";
  let body = fs.readFileSync(file);
  if (file === path.join(ROOT, "loopy.js")) body = String(body).replace('Loopy.syncHost=""', `Loopy.syncHost="${HOST}"`);
  if (type === "text/html") body = String(body).replace("connect-src 'self';", `connect-src 'self' https://${HOST};`);
  res.writeHead(200, { "Content-Type": type });
  res.end(body);
});
await new Promise(r => server.listen(0, "127.0.0.1", r));
const ORIGIN = `http://127.0.0.1:${server.address().port}`, BASE = ORIGIN + "/loopy/";
if (!String(fs.readFileSync(path.join(ROOT, "loopy.js"))).includes('Loopy.syncHost=""')) throw new Error("loopy.js has no Loopy.syncHost to set.");

// The server's clock runs in this test, so it can jump past the 10 seconds it wants between saves.
let skew = 0;
const realNow = Date.now;
Date.now = () => realNow() + skew;
const env = { DB: fakeD1(), ORIGINS: ORIGIN };

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

const rows = [], problems = [];
const check = (what, ok, got) => { rows.push([what, ok ? "pass" : "FAIL", got]); if (!ok) problems.push(what); };
const wait = ms => new Promise(r => setTimeout(r, ms));
async function until(f, ms = 15000) {
  for (const end = realNow() + ms; realNow() < end; await wait(150)) { try { if (await f()) return true; } catch (e) { /* the page is reloading */ } }
  return false;
}

// A device: its own browser profile. It counts what it loads: loopy-sync.js, and anything not from the site.
async function device(name) {
  const ctx = await browser.newContext({ serviceWorkers: "block" });
  const seen = { sync: 0, server: 0, other: [] };
  ctx.on("request", r => {
    const u = r.url();
    if (u.endsWith("/loopy-sync.js")) seen.sync++;
    if (u.startsWith(`https://${HOST}/`)) seen.server++;
    else if (!u.startsWith(ORIGIN) && !u.startsWith("data:") && !u.startsWith("blob:")) seen.other.push(u);
  });
  await ctx.route(`https://${HOST}/**`, async route => {
    const q = route.request(), headers = await q.allHeaders();
    const r = await worker.fetch(new Request(q.url(), { method: q.method(), headers, body: q.method() === "POST" ? q.postData() : undefined }), env);
    const out = {};
    r.headers.forEach((v, k) => { out[k] = v; });
    await route.fulfill({ status: r.status, headers: out, body: Buffer.from(await r.arrayBuffer()) });
  });
  const page = await ctx.newPage();
  page.on("pageerror", e => problems.push(`${name}: page error ${e.message}`));
  return { ctx, page, seen };
}
const stars = page => page.evaluate(() => Loopy.rewards.get().stars);
const earn = (page, n) => page.evaluate(n => { for (let i = 0; i < n; i++) Loopy.rewards.correct("plus-minus", i + 1, null); }, n);
const openSettings = async page => { if (await page.locator("#settings-panel").isHidden()) await page.click("#settings-toggle"); };
const syncText = page => page.locator(".set-sync").innerText();

// 1. Sync off: nothing is loaded for it and nothing is sent, on the home page and in a game.
const off = await device("off");
await off.page.goto(BASE);
await off.page.goto(BASE + "math/plus-minus/");
await earn(off.page, 2);
await wait(4000);
check("Sync off: loopy-sync.js is never loaded", off.seen.sync === 0, off.seen.sync + " loads");
check("Sync off: nothing is sent to the sync server", off.seen.server === 0, off.seen.server + " requests");
await off.page.goto(BASE);
await openSettings(off.page);
check("Settings has a Family sync part", await until(async () => /Family sync/i.test(await syncText(off.page))), "");
check("Opening Settings sends nothing either", off.seen.server === 0, off.seen.server + " requests");

// 2. A bad code and a code no family has: a clear message, sync stays off.
await off.page.getByRole("button", { name: "Join with a code" }).click();
await off.page.getByLabel("Family code from your other device").fill("HELLO");
await off.page.getByRole("button", { name: "Join", exact: true }).click();
check("A bad code says it is not a family code", await until(async () => /not a family code/.test(await syncText(off.page))), "");
await off.page.getByLabel("Family code from your other device").fill("2345-6789-ABCD-EFGH");
await off.page.getByRole("button", { name: "Join", exact: true }).click();
check("A code no family has says so", await until(async () => /No family has this code/.test(await syncText(off.page))), "");
check("Sync stays off after a wrong code", await off.page.evaluate(() => localStorage.getItem("loopy.sync")) === null, "");
await off.ctx.close();

// 3. Device A: 5 stars, then Turn on. The home page shows before loopy-sync.js loads.
const A = await device("A");
await A.page.goto(BASE + "math/plus-minus/");
await earn(A.page, 5);
await A.page.goto(BASE);
await openSettings(A.page);
await A.page.getByRole("button", { name: "Turn on" }).click();
const on = await until(async () => /^[0-9A-Z]{4}(-[0-9A-Z]{4}){3}$/.test((await A.page.locator(".sync-code").innerText()).trim()));
const code = on ? (await A.page.locator(".sync-code").innerText()).trim() : "";
check("Turn on shows a family code", on, code);
check("Turn on shows its QR code", await A.page.locator(".set-sync svg.sync-qr").count() === 1, "");
const row = [...env.DB.rows.values()][0];
check("The server has one locked copy, and can't read it", env.DB.rows.size === 1 && !/rewards|stars|plus-minus/.test(row.b), env.DB.rows.size + " rows");
await A.page.goto(BASE);
await until(() => A.page.evaluate(() => !!(window.Loopy && Loopy.sync)));
const order = await A.page.evaluate(() => {
  const nav = performance.getEntriesByType("navigation")[0], s = performance.getEntriesByType("resource").find(e => e.name.endsWith("/loopy-sync.js"));
  return s ? Math.round(s.startTime - nav.loadEventStart) : null;
});
check("With sync on, loopy-sync.js loads only after the page is shown", order !== null && order >= 0, order + " ms after load");

// 4. Device B joins with the link from the QR code: A's stars come over.
skew += 11000;
const B = await device("B");
await B.page.goto(BASE + "#family=" + code.replace(/-/g, ""));
await B.page.getByRole("dialog").getByRole("button", { name: "Join" }).click();
check("Joining by link brings the family's stars", await until(async () => await stars(B.page) === 5), String(await stars(B.page).catch(() => "?")));
check("The link is taken out of the address", !(await B.page.evaluate(() => location.hash)), "");

// 5. B earns 3 more in a game; leaving the game sends them. A sees them on its home page.
skew += 11000;
await B.page.goto(BASE + "math/plus-minus/");
await until(() => B.page.evaluate(() => !!(window.Loopy && Loopy.sync)));
const before = [...env.DB.rows.values()][0].e;
await earn(B.page, 3);
await B.page.evaluate(() => {
  Object.defineProperty(document, "visibilityState", { value: "hidden", configurable: true });
  document.dispatchEvent(new Event("visibilitychange"));
});
check("Leaving a game sends its new stars", await until(() => [...env.DB.rows.values()][0].e !== before), "");
skew += 11000;
const A2 = await A.ctx.newPage();
await A2.goto(BASE);
check("The other device gets them on its home page", await until(async () => await stars(A2) === 8), String(await stars(A2).catch(() => "?")));

// 6. A turns off and deletes the family copy. Every device keeps its stars.
await openSettings(A2);
const forget = A2.getByRole("button", { name: "Turn off everywhere" });
await forget.click();
await forget.click();
check("Turn off everywhere removes the copy on the server", await until(() => env.DB.rows.size === 0), env.DB.rows.size + " rows");
check("Turn off forgets the code on this device", await A2.evaluate(() => localStorage.getItem("loopy.sync")) === null, "");
check("Turn off keeps the stars", await stars(A2) === 8, String(await stars(A2)));
const B2 = await B.ctx.newPage();
await B2.goto(BASE);
await openSettings(B2);
check("The other device says the copy was deleted", await until(async () => /deleted on another device/.test(await syncText(B2))), "");
check("and keeps its stars", await stars(B2) === 8, String(await stars(B2)));

const others = [...A.seen.other, ...B.seen.other];
check("Nothing goes anywhere but the site and the sync server", others.length === 0, others.slice(0, 3).join(" "));
await A.ctx.close();
await B.ctx.close();

console.log("| Check | Result | Got |\n| --- | --- | --- |");
for (const r of rows) console.log(`| ${r.join(" | ")} |`);
await browser.close();
server.close();
if (problems.length) { console.log(`\n${problems.length} problem(s):\n${problems.join("\n")}`); process.exit(1); }
console.log("\nNo problems found.");
