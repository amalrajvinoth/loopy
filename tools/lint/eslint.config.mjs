// Script lint: the <script> block of every page, read by tools/lint/scripts.mjs (eslint-plugin-html pulls the
// scripts out of the HTML). It fails on real mistakes: a name that is not defined, a variable declared twice,
// code after a return, a switch that falls through, == where === was meant, a function nobody calls. It also
// flags a JavaScript feature that not every browser has had for 30 months (Baseline widely available, the
// same line the style lint draws for CSS), through eslint-plugin-baseline-js.
//
// A page's data file (words.js or data.js, loaded right after loopy.js) defines globals the page reads, such as
// WORDS or FLAGS. The config reads those names from the data files the page loads, so each page knows only its own.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import globals from "globals";
import html from "eslint-plugin-html";
import baselineJs from "eslint-plugin-baseline-js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

/** The top-level names a plain script declares: const WORDS = ..., var X, function f() {}. */
function declared(file) {
  const text = fs.readFileSync(file, "utf8");
  const names = {};
  for (const m of text.matchAll(/^(?:const|let|var|function)\s+(.+)$/gm)) {
    // `const MAP_K = 8, MAP_Y0 = 1435.283;` declares two names: the first word, and each name after a comma with its =.
    const first = m[1].match(/^([A-Za-z_$][\w$]*)/); if (first) names[first[1]] = "readonly";
    for (const n of m[1].matchAll(/,\s*([A-Za-z_$][\w$]*)\s*=(?!=)/g)) names[n[1]] = "readonly";
  }
  return names;
}

/** One config block per page: its own data files' globals. */
function pageBlocks() {
  const pages = [];
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.isDirectory()) {
        if (!["node_modules", ".git", "docs", "tools", "plugins", "guide-src", "sync", "src", ".claude"].includes(e.name)) walk(path.join(dir, e.name));
      } else if (e.name === "index.html") pages.push(path.join(dir, e.name));
    }
  };
  walk(ROOT);
  const blocks = [];
  for (const page of pages) {
    const text = fs.readFileSync(page, "utf8");
    let names = {};
    for (const m of text.matchAll(/<script\s[^>]*src="([^"]+\.js)"/g)) {
      const src = m[1];
      if (src.startsWith("http") || /(^|\/)loopy[^/]*\.js$/.test(src)) continue;   // the shared script and its parts are typed in src/loopy.d.ts
      const file = path.resolve(path.dirname(page), src);
      if (fs.existsSync(file)) names = { ...names, ...declared(file) };
    }
    if (Object.keys(names).length) blocks.push({ files: [path.relative(ROOT, page)], languageOptions: { globals: names } });
  }
  return blocks;
}

export default [
  {
    files: ["**/*.html"],
    plugins: { html, "baseline-js": baselineJs },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "script",
      globals: { ...globals.browser, Loopy: "readonly" },
    },
    settings: { "html/html-extensions": [".html"] },
    rules: {
      ...js.configs.recommended.rules,
      // A catch (e) that does not read e is fine, and so is a callback with arguments it does not need.
      "no-unused-vars": ["error", { args: "none", caughtErrors: "none" }],
      // == turns a "7" into 7 by surprise; say what you mean. `x == null` stays: it is the one short way to ask
      // "absent" (null or undefined), which What Time Is It? uses for a time with no morning or afternoon.
      eqeqeq: ["error", "always", { null: "ignore" }],
      // try { localStorage... } catch {} is how a page shrugs off a browser that blocks storage or speech.
      "no-empty": ["error", { allowEmptyCatch: true }],
      // Only JavaScript every browser has had for 30 months, like the style lint's Baseline rule.
      "baseline-js/use-baseline": ["error", { available: "widely" }],
    },
  },
  ...pageBlocks(),
];
