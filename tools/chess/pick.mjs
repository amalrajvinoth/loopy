// Picks the Chess Puzzles game's real puzzles from the Lichess puzzle database (public domain, CC0:
// https://database.lichess.org/#puzzles). It runs once, on a computer that can reach lichess.org:
//
//   node tools/chess/pick.mjs            # downloads about 280 MB, reads it as it streams, keeps nothing else
//   node tools/chess/pick.mjs file.csv   # or reads a CSV (or .csv.zst) you already have
//
// It writes tools/chess/download/picked.tsv (git ignores that folder). tools/chess/build.mjs then turns it
// into the game's data files. Every topic's rule is in TOPICS below; the game's own topics, made by the page,
// are not here. Node 22.15 or newer reads .zst by itself; an older Node needs the zstd command (brew install zstd).
import fs from "node:fs";
import zlib from "node:zlib";
import { spawnSync } from "node:child_process";

const URL = "https://database.lichess.org/lichess_db_puzzle.csv.zst";
const OUT = new globalThis.URL("download/", import.meta.url);
const PER_TOPIC = 14;

// [topic, lowest rating, highest rating, rule(themes set, mover piece letter, plies)]
const mate = (t) => t.has("mateIn1") || t.has("mateIn2") || t.has("mateIn3") || t.has("mateIn4") || t.has("mate");
const TOPICS = [
  ["mate1", 400, 1300, (t, p) => t.has("mateIn1") && "qrbn".includes(p)],
  ["pawnmate", 400, 1500, (t, p) => t.has("mateIn1") && p === "p"],
  ["matepin", 500, 1500, (t) => (t.has("mateIn1") || t.has("mateIn2")) && (t.has("pin") || t.has("discoveredAttack") || t.has("doubleCheck"))],
  ["mate2", 500, 1500, (t) => t.has("mateIn2")],
  ["castle", 600, 1700, (t) => t.has("castling")],
  ["enpassant", 600, 1800, (t) => t.has("enPassant")],
  ["promote", 500, 1600, (t) => t.has("promotion") || t.has("underPromotion")],
  ["fork", 600, 1500, (t, p) => t.has("fork") && p === "n" && !mate(t)],
  ["pin", 600, 1600, (t) => t.has("pin") && !mate(t)],
  ["skewer", 600, 1600, (t) => t.has("skewer") && !mate(t)],
  ["double", 600, 1600, (t, p) => t.has("fork") && p !== "n" && !mate(t)],
  ["discover", 600, 1600, (t) => t.has("discoveredAttack") && !mate(t)],
  ["defender", 700, 1700, (t) => t.has("capturingDefender") && !mate(t)],
  ["trapped", 700, 1700, (t) => t.has("trappedPiece") && !mate(t)],
  ["hanging", 500, 1300, (t) => t.has("hangingPiece") && !mate(t)],
  ["defend", 800, 1800, (t) => t.has("defensiveMove")],
  ["draw", 900, 1900, (t) => t.has("equality")],
  ["between", 900, 1900, (t) => t.has("intermezzo")],
  ["sacrifice", 900, 1900, (t) => t.has("sacrifice")],
  ["decoy", 900, 1900, (t) => t.has("attraction")],
  ["deflect", 900, 1900, (t) => t.has("deflection")],
  ["lines", 1000, 2000, (t) => t.has("clearance")],
  ["attack", 900, 1900, (t) => t.has("kingsideAttack") || t.has("attackingF2F7")],
  ["mate3", 1000, 1900, (t) => t.has("mateIn3")],
  ["traps", 600, 1700, (t, p, n, open) => t.has("opening") && open !== ""],
];

// The piece that makes the child's first move: the CSV's FEN is before the other side's move, so play that first.
function mover(fen, moves) {
  const rows = fen.split(" ")[0].split("/"), b = {};
  rows.forEach((row, r) => { let c = 0; for (const ch of row) { if (/\d/.test(ch)) c += +ch; else b["abcdefgh"[c++] + (8 - r)] = ch; } });
  const [m0, m1] = moves.split(" ");
  b[m0.slice(2, 4)] = b[m0.slice(0, 2)]; delete b[m0.slice(0, 2)];
  return (b[m1.slice(0, 2)] || "?").toLowerCase();
}

// The Lichess file is packed in many pieces (zstd frames), each after a small "skip me" frame, the way pzstd
// writes it. Node's unpacker stops at the end of the first piece, so the pieces are cut apart here and each one
// is unpacked by itself. A piece's end is found from its block headers (the zstd format, RFC 8878).
function frameEnd(buf, o) {
  const fhd = buf[o + 4], single = (fhd >> 5) & 1;
  let p = o + 5 + (single ? 0 : 1) + [0, 1, 2, 4][fhd & 3] + [single, 2, 4, 8][fhd >> 6];
  for (;;) {
    const h = buf[p] | (buf[p + 1] << 8) | (buf[p + 2] << 16), type = (h >> 1) & 3, size = h >>> 3;
    p += 3 + (type === 1 ? 1 : size);
    if (h & 1) break;
    if (p > buf.length) throw new Error("the file is cut off");
  }
  return p + ((fhd >> 2) & 1 ? 4 : 0);
}
function* unpack(buf) {
  for (let o = 0; o + 8 <= buf.length;) {
    const magic = buf.readUInt32LE(o);
    if ((magic & 0xfffffff0) === 0x184d2a50) { o += 8 + buf.readUInt32LE(o + 4); continue; }
    if (magic !== 0xfd2fb528) throw new Error("not a zstd file at byte " + o);
    const end = frameEnd(buf, o);
    yield zlib.zstdDecompressSync(buf.subarray(o, end), { params: { [zlib.constants.ZSTD_d_windowLogMax]: 31 } });
    o = end;
  }
}

async function* lines() {
  const file = process.argv[2];
  let buf;
  if (file) buf = fs.readFileSync(file);
  else {
    const res = await fetch(URL, { headers: { "User-Agent": "loopy-chess-picker" } });
    console.error("download:", res.status, res.headers.get("content-length"), "bytes");
    if (!res.ok) throw new Error("download failed: " + res.status);
    buf = Buffer.from(await res.arrayBuffer());
  }
  packed = buf.length;
  let parts;
  if (file && !file.endsWith(".zst")) parts = [buf];
  else if (zlib.zstdDecompressSync) parts = unpack(buf);
  else {
    // An older Node: the zstd command unpacks it (brew install zstd).
    const z = spawnSync("zstd", ["-dc", "--long=31"], { input: buf, maxBuffer: 4e9 });
    if (z.error || z.status) throw new Error("zstd failed (brew install zstd): " + (z.error ? z.error.message : z.stderr));
    parts = [z.stdout];
  }
  // A piece can end in the middle of a line (or of a letter): the rest waits for the next piece.
  let rest = Buffer.alloc(0);
  for (const part of parts) {
    unpacked += part.length;
    const all = Buffer.concat([rest, part]), cut = all.lastIndexOf(10);
    if (cut < 0) { rest = all; continue; }
    yield* all.subarray(0, cut).toString("utf8").split("\n");
    rest = all.subarray(cut + 1);
  }
  if (rest.length) yield rest.toString("utf8");
}

let packed = 0, unpacked = 0;
const pools = Object.fromEntries(TOPICS.map(([k]) => [k, new Map()]));
const used = new Set();
let n = 0;
for await (const line of lines()) {
  if (n++ === 0 && line.startsWith("PuzzleId")) continue;
  const [id, fen, moves, rating, dev, pop, plays, themes, , open = ""] = line.split(",");
  const r = +rating;
  if (+pop < 80 || +plays < 300 || +dev > 100) continue;
  const t = new Set(themes.split(" ")), plies = moves.split(" ").length;
  if (plies > 8) continue;
  const p = mover(fen, moves);
  for (const [k, lo, hi, rule] of TOPICS) {
    if (r < lo || r > hi || !rule(t, p, plies, open)) continue;
    const bin = Math.floor(r / 50), pool = pools[k];
    const list = pool.get(bin) || []; if (list.length >= 6) continue;
    // Italian Game traps first: the curriculum's first opening.
    list.push({ id, fen, moves, r, themes, italian: open.includes("Italian_Game") });
    pool.set(bin, list);
  }
  if (n % 500000 === 0) console.error(n.toLocaleString(), "puzzles read");
}

console.error(`read ${packed} bytes, unpacked ${unpacked} bytes, ${n} lines`);
if (n < 100000) { console.error(`only ${n} lines came in; the download stopped early, so nothing is written`); process.exit(1); }
fs.mkdirSync(OUT, { recursive: true });
const out = ["topic\tid\tfen\tmoves\trating\tthemes"];
for (const [k] of TOPICS) {
  let all = [...pools[k].values()].flat().filter((q) => !used.has(q.id));
  if (k === "traps") { const it = all.filter((q) => q.italian); all = it.length >= 6 ? [...it.slice(0, 8), ...all.filter((q) => !q.italian)] : all; }
  all.sort((a, b) => a.r - b.r);
  const pick = [];
  for (let i = 0; i < PER_TOPIC && all.length; i++) pick.push(all[Math.round(i * (all.length - 1) / Math.max(1, PER_TOPIC - 1))]);
  const uniq = [...new Map(pick.map((q) => [q.id, q])).values()];
  for (const q of uniq) { used.add(q.id); out.push([k, q.id, q.fen, q.moves, q.r, q.themes].join("\t")); }
  console.error(k, uniq.length);
}
fs.writeFileSync(new globalThis.URL("picked.tsv", OUT), out.join("\n") + "\n");
console.error("wrote tools/chess/download/picked.tsv,", out.length - 1, "puzzles from", n.toLocaleString(), "lines");
