// Writes the Chess Puzzles game's content:
//   puzzles-2.js to puzzles-6.js  real puzzles per topic for each level, easiest first, each "fen|moves" (the
//          first move is the other side's); the page loads only the level being played;
//   data.js  cms and cards, with p left empty for the level files to fill:
//   cms    "check, mate or stalemate?" positions, each "fen|answer" (0 check, 1 mate, 2 stalemate), made here;
//   cards  opening rules and board manners (tools/chess/cards.mjs).
// The puzzles come from tools/chess/download/picked.tsv (made by tools/chess/pick.mjs from the Lichess puzzle
// database, public domain). Without that file the puzzles already in data.js stay. Every puzzle is played through
// with the game's own rules (the ENGINE part of the page): a move that is not legal, or a "mate" that is no mate,
// drops the puzzle. Run: node tools/chess/build.mjs, then python3 tools/build.py.
// With --check (tools/check.py "chess") it writes nothing: it fails when a puzzle no longer plays through with the
// page's rules, or when the files differ from what it would write.
import fs from "node:fs";
import { CARDS } from "./cards.mjs";

const ROOT = new URL("../../", import.meta.url);
const PAGE = new URL("brain/chess-puzzles/index.html", ROOT), OUT = new URL("brain/chess-puzzles/data.js", ROOT);
const TSV = new URL("download/picked.tsv", import.meta.url), CHECK = process.argv.includes("--check");
const files = new Map(), write = (url, text) => files.set(url.href, [url, text]);
const html = fs.readFileSync(PAGE, "utf8");
const code = html.slice(html.indexOf("// ENGINE START"), html.indexOf("// ENGINE END"));
const C = new Function(code + "\nreturn CHESS;")();

const DIR = new URL("brain/chess-puzzles/", ROOT);
const LEVELS = new Function("return " + /const LEVELS = (\[[\s\S]*?\]);/.exec(html)[1])();
const levelOf = (topic) => LEVELS.findIndex((l) => l.includes(topic));

// The puzzles: from the picked list, or the ones the level files have now.
let puzzles = {};
if (fs.existsSync(TSV) && !CHECK) {
  for (const line of fs.readFileSync(TSV, "utf8").trim().split("\n").slice(1)) {
    const [topic, , fen, moves] = line.split("\t");
    const short = fen.split(" ").slice(0, 4).join(" ");
    (puzzles[topic] = puzzles[topic] || []).push(short + "|" + moves);
  }
} else {
  const CP = { p: {} };
  for (let lv = 2; lv <= LEVELS.length; lv++) {
    const f = new URL("puzzles-" + lv + ".js", DIR);
    if (fs.existsSync(f)) new Function("CP", fs.readFileSync(f, "utf8"))(CP);
  }
  puzzles = CP.p;
}

// Play each one through. Mate topics must end in mate.
const MATE = /^(mate1|pawnmate|mate2|mate3)$/;
let dropped = 0;
for (const [topic, list] of Object.entries(puzzles)) {
  puzzles[topic] = list.filter((raw) => {
    const [fen, moves] = raw.split("|");
    let s = C.parse(fen);
    for (const u of moves.split(" ")) { const m = C.find(s, u); if (!m) { dropped++; return false; } s = C.play(s, m); }
    if (MATE.test(topic) && C.status(s) !== "mate") { dropped++; return false; }
    return true;
  });
}

// Check, mate or stalemate: two kings and one or two white pieces, Black to move. A seeded random, so the
// file only changes when this code does.
let seed = 7;
const rnd = (n) => { seed = (seed + 0x6d2b79f5) | 0; let x = Math.imul(seed ^ (seed >>> 15), 1 | seed); x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x; return ((x ^ (x >>> 14)) >>> 0) % n; };
const want = { check: [], mate: [], stale: [] };
for (let k = 0; k < 3000000 && Object.values(want).some((l) => l.length < 12); k++) {
  const b = Array(64).fill(""), put = (p) => { let i; do i = rnd(64); while (b[i]); b[i] = p; return i; };
  // The black king mostly on the edge, where mates and stalemates happen.
  const edge = [0, 1, 2, 3, 4, 5, 6, 7, 56, 57, 58, 59, 60, 61, 62, 63, 8, 16, 24, 32, 40, 48, 15, 23, 31, 39, 47, 55];
  const bk = rnd(4) ? (b[edge[rnd(edge.length)]] = "k", b.indexOf("k")) : put("k"), wk = put("K");
  if (Math.abs((bk & 7) - (wk & 7)) <= 1 && Math.abs((bk >> 3) - (wk >> 3)) <= 1) continue;
  const extra = ["Q", "R", "Q", "R", "B", "N", "P"];
  put(extra[rnd(extra.length)]);
  if (rnd(3) === 0) put(extra[rnd(extra.length)]);
  if (b.some((p, i) => p === "P" && (i < 8 || i > 55))) continue;
  const s = { b, w: true, c: "", ep: -1 };
  if (C.inCheck(s)) continue; // White to have moved: the white king is not in check
  s.w = false;
  const st = C.status(s);
  if (!st || want[st].length >= 12) continue;
  let fen = "";
  for (let r = 7; r >= 0; r--) { let e = 0; for (let f = 0; f < 8; f++) { const p = b[r * 8 + f]; if (p) { fen += (e || "") + p; e = 0; } else e++; } fen += (e || "") + (r ? "/" : ""); }
  want[st].push(fen + " b - -|" + { check: 0, mate: 1, stale: 2 }[st]);
}
const cms = [];
for (let i = 0; i < 12; i++) for (const st of ["check", "mate", "stale"]) if (want[st][i]) cms.push(want[st][i]);

const head = `/* loopy: the content of Chess Puzzles. Made by tools/chess/build.mjs; edit tools/chess/cards.mjs or the picker, not this file.
   p: real puzzles per topic, filled by puzzles-2.js to puzzles-6.js when a level is played.
   cms: "check, mate or stalemate?" positions, Black to move, then 0 check, 1 checkmate, 2 stalemate.
   cards: opening rules and board manners, per language [question, right answer, two wrong answers, why]. */
`;
const body = "const CP = " + JSON.stringify({ p: {}, cms, cards: CARDS }) + ";\n";
write(OUT, head + body.replace(/\],"/g, '],\n"'));
// One file per level, written even when empty so the page never asks for a missing file. Topics with no
// puzzles are left out (the game skips them).
for (let lv = 1; lv < LEVELS.length; lv++) {
  const part = Object.fromEntries(Object.entries(puzzles).filter(([t, l]) => levelOf(t) === lv && l.length));
  const f = new URL("puzzles-" + (lv + 1) + ".js", DIR);
  write(f, `/* loopy: Chess Puzzles, level ${lv + 1}. Made by tools/chess/build.mjs, do not edit. Real puzzles from the Lichess
   puzzle database (public domain, CC0, database.lichess.org), easiest first. Each is "fen|moves": the position, then the
   moves in long form; the first move is the other side's. */
Object.assign(CP.p, ${JSON.stringify(part).replace(/\],"/g, '],\n"')});
`);
}
const n = Object.values(puzzles).reduce((a, l) => a + l.length, 0);

console.log(`chess: ${n} puzzles in ${Object.keys(puzzles).length} topics (${dropped} dropped), ${cms.length} check/mate/stalemate positions`);
if (CHECK) {
  const stale = [...files.values()].filter(([url, text]) => !fs.existsSync(url) || fs.readFileSync(url, "utf8") !== text).map(([url]) => url.pathname.split("/").pop());
  if (dropped || stale.length) {
    console.error(`${dropped} puzzle(s) no longer play through; out of date: ${stale.join(", ") || "none"}. Run node tools/chess/build.mjs`);
    process.exit(1);
  }
} else for (const [url, text] of files.values()) fs.writeFileSync(url, text);
