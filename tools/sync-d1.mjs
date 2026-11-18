// Shared by tools/sync-usage.mjs and tools/sync-families.mjs: run one SQL query on a D1 database through
// wrangler and give back the rows. Needs wrangler logged in (npx wrangler login), or CLOUDFLARE_API_TOKEN +
// CLOUDFLARE_ACCOUNT_ID. In tests, SYNC_D1_FAKE names a node script that gets <database> <sql> and prints
// wrangler's JSON, so no network is needed.

import { execFileSync } from "node:child_process";

const W = process.env.WRANGLER || "wrangler@4.149.0";

export function query(db, sql, cwd) {
  const fake = process.env.SYNC_D1_FAKE;
  const out = fake
    ? execFileSync(process.execPath, [fake, db, sql], { encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] })
    : execFileSync("npx", ["--yes", W, "d1", "execute", db, "--remote", "--json", "--command", sql],
        { encoding: "utf8", stdio: ["ignore", "pipe", "inherit"], cwd });
  const j = JSON.parse(out.slice(out.indexOf("[")));
  return (j[0] && j[0].results) || [];
}

export const DAY = 86400000;
export const kb = n => (Number(n || 0) / 1024).toFixed(0) + " KB";
export const utcDay = ms => new Date(ms).toISOString().slice(0, 10);
export const niceDay = day => new Date(day + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
