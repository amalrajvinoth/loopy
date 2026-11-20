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
import * as espree from "espree";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

/** The names a plain script declares at its top level: const WORDS = ..., var X, function f() {}, class C {}.
 *  Parsed with espree (ESLint's own parser), so a function's parameters or a name inside a body never count. */
function declared(file) {
  const names = {};
  let ast;
  try { ast = espree.parse(fs.readFileSync(file, "utf8"), { ecmaVersion: 2022, sourceType: "script" }); }
  catch (e) { console.warn(`${path.relative(ROOT, file)}: could not parse (${e.message}); its globals are unknown to the lint`); return names; }
  const bind = (id) => {
    if (!id) return;
    if (id.type === "Identifier") names[id.name] = "readonly";
    else if (id.type === "ObjectPattern") for (const pr of id.properties) bind(pr.type === "RestElement" ? pr.argument : pr.value);
    else if (id.type === "ArrayPattern") for (const el of id.elements) bind(el);
    else if (id.type === "AssignmentPattern") bind(id.left);
    else if (id.type === "RestElement") bind(id.argument);
  };
  for (const node of ast.body) {
    if (node.type === "VariableDeclaration") for (const d of node.declarations) bind(d.id);
    else if (node.type === "FunctionDeclaration" || node.type === "ClassDeclaration") bind(node.id);
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
      // Only JavaScript every browser has had for 30 months, like the style lint's Baseline rule: the syntax, the
      // built-ins (Array.prototype.at, Object.hasOwn) and the web APIs (structuredClone, navigator.share).
      // ignoreFeatures is only for a feature every use of which sits behind a check with a fallback, each with its reason:
      //   share: navigator.share and canShare (the phone's share sheet) are used only after `if (navigator.share)` or
      //          `navigator.canShare(...)`; without them the Send button stays hidden and the weekly card says Save.
      "baseline-js/use-baseline": ["error", {
        available: "widely", includeJsBuiltins: { preset: "auto" }, includeWebApis: { preset: "auto" }, ignoreFeatures: ["share"],
      }],
    },
  },
  ...pageBlocks(),
];
