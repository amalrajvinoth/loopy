// After `astro build`: make the guide pass loopy's strict security policy.
//
// The policy blocks style="..." attributes, so each one becomes a small class in
// _assets/attrs.css. Then tools/csp.py writes the policy with a hash for each inline script.
// Runs as part of `npm run build`.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const DIST = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "dist");
const BASE = "/loopy/guide/";
const rules = new Map();
const pages = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p); else if (e.name.endsWith(".html")) pages.push(p);
  }
})(DIST);

const TAG = /<([a-zA-Z][\w-]*)([^<>]*?)\sstyle="([^"]*)"([^<>]*)>/g;
for (const page of pages) {
  let html = fs.readFileSync(page, "utf8");
  html = html.replace(TAG, (all, tag, before, style, after) => {
    // Search's keyboard hint starts hidden and its script shows it with el.style. Leave it to the classes it has.
    if (tag === "kbd" && /^display:\s*none;?$/.test(style.trim())) return `<${tag}${before}${after}>`;
    const name = "s-" + crypto.createHash("sha256").update(style).digest("hex").slice(0, 8);
    rules.set(name, style);
    let attrs = before + after;
    if (/\sclass="/.test(attrs)) attrs = attrs.replace(/\sclass="([^"]*)"/, (m, c) => ` class="${c} ${name}"`);
    else attrs = ` class="${name}"` + attrs;
    return `<${tag}${attrs}>`;
  });
  html = html.replace("</head>", `<link rel="stylesheet" href="${BASE}_assets/attrs.css"></head>`);
  if (/\sstyle="/.test(html)) throw new Error(`${path.relative(DIST, page)} still has a style attribute`);
  fs.writeFileSync(page, html);
}
const css = [...rules].sort().map(([n, s]) => `.${n}{${s}}`).join("\n") + "\n";
fs.writeFileSync(path.join(DIST, "_assets", "attrs.css"), "/* style=\"...\" attributes from the build, as classes (see scripts/finish.mjs). */\n" + css);
console.log(`finish: ${pages.length} pages, ${rules.size} style attributes moved to _assets/attrs.css`);
