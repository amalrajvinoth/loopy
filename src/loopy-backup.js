/* loopy: the stars code (Loopy.backup). Loaded by loopy.js (Loopy.load("backup")) the first time a code is
   made or read, on the home page, so every page starts without it. Old codes still load (see below). */
// Stars code: moves stars, badges, day streak, progress, Last 5, age, game levels and settings, and the
// last game played ("where you left off") to another device, for one child or for all.
// No account and nothing sent anywhere: the code is copied by hand and pasted on the other device,
// or sent as a link with the code after the # (loopy/#load=LOOPY2-...), which never reaches the web server.
// "LOOPY2-Z..." is the data packed small (deflate) and written as letters; "LOOPY2-J..." is the same
// data unpacked, for browsers that can't pack. Old "LOOPY-..." codes (stars and best scores only) still load.
// Inside: { v: 2, p: [child, ...], theme, font, sound, lang }, child = { n, pic, rewards, daily, log, recent, age, read, g }.
// g holds the child's game levels and settings, the last game and the games already seen (each a short text
// under its own key, e.g. { "pm100.op.a8": "\"mix\"", "loopy.last": "math/plus-minus/" }); codes made before it came in have none.
// p holds every child on the device, or just one (see Loopy.kids). Loading a code gives each child's things to
// the child here with the same name, or adds that child. A child with no name, and an old code, go to the child
// playing. On a device with only one child, who has no name and no stars yet, the first child in the code takes their place.
// Loading a code adds to what is here and never takes anything away: the bigger number wins,
// and a setting is only taken when this device has not chosen one yet.
(function () {
  var Loopy = window.Loopy = window.Loopy || {};
  var MAX_CODE = 40000, MAX_JSON = 200000, MAX_P = 10, MAX_G = 300, MAX_GV = 2000;
  // The keys a child's g may hold: game settings ("ss.mode.a7"), the last game, the games already seen, and the levels the grown-ups page last saw.
  // Each game checks its own values again when it reads them (only known choices are used).
  var GKEY = /^(?:(?:bm|bs|cc|clockquiz|eb|fc|gd|mk|pm100|pr|pz|qf|sb|sh|si|so|sq|ss|st|ts|tt|wi|wm)\.[A-Za-z]{1,16}(?:\.a\d{1,2})?|loopy\.(?:last|seen|levels))$/;
  var KEYS = { rewards: "loopy.rewards", daily: "loopy.daily", log: "loopy.log", recent: "loopy.recent",
    age: "loopy.ageOffset", read: "loopy.readAloud", theme: "loopy.theme", font: "loopy.font", sound: "loopy.sound", lang: "loopy.lang" };
  var CHOICES = { read: ["on", "off"], theme: ["black", "sunny", "ocean", "candy", "forest", "contrast"], font: ["easy", "normal"], sound: ["on", "off"], lang: ["en", "de"] };
  // Theme, reading font, sound and language are for the whole device; the rest belongs to child id.
  var DEVICE = { theme: true, font: true, sound: true, lang: true };
  var keyOf = function (k, id) { return DEVICE[k] ? KEYS[k] : Loopy.kids.key(id, KEYS[k]); };
  var get = function (k, id) { try { return localStorage.getItem(keyOf(k, id)); } catch (e) { return null; } };
  var read = function (k, id) { try { return JSON.parse(get(k, id)); } catch (e) { return null; } };
  var put = function (k, v, id) { try { localStorage.setItem(keyOf(k, id), typeof v === "string" ? v : JSON.stringify(v)); } catch (e) {} };
  var cleanAge = function (n) { return typeof n === "number" && isFinite(n) && Math.abs(n) <= 11 ? Math.round(n) : null; };
  var choice = function (k, v) { return CHOICES[k].indexOf(v) !== -1 ? v : null; };
  var can = typeof CompressionStream === "function" && typeof DecompressionStream === "function";

  function b64(bytes) {
    var s = "";
    for (var i = 0; i < bytes.length; i += 8192) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 8192));
    return btoa(s).replace(/=+$/, "");
  }
  function unb64(s) {
    var bin = atob(s), out = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }
  // Runs bytes through a (de)compression stream. Stops with an error past MAX_JSON bytes, so a tiny code can't fill the memory.
  function pipe(bytes, stream) {
    var reader = new Blob([bytes]).stream().pipeThrough(stream).getReader(), parts = [], size = 0;
    return (function next() {
      return reader.read().then(function (r) {
        if (r.done) {
          var out = new Uint8Array(size), at = 0;
          parts.forEach(function (p) { out.set(p, at); at += p.length; });
          return out;
        }
        size += r.value.length;
        if (size > MAX_JSON) { reader.cancel(); throw new Error("too big"); }
        parts.push(r.value);
        return next();
      });
    })();
  }

  // A child's game settings, last game and seen games, from this device or from a code: only known keys and short text.
  function cleanG(raw) {
    var out = {}, n = 0;
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return out;
    Object.keys(raw).forEach(function (k) {
      if (n >= MAX_G || !GKEY.test(k) || typeof raw[k] !== "string" || raw[k].length > MAX_GV) return;
      if (k === "loopy.last" && !Loopy.last.clean(raw[k])) return;
      out[k] = raw[k]; n++;
    });
    return out;
  }
  function gOf(id) {
    var raw = {}, pre = Loopy.kids.key(id, "");
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && k.indexOf(pre) === 0) raw[k.slice(pre.length)] = localStorage.getItem(k);
      }
    } catch (e) {}
    return cleanG(raw);
  }

  function lightLog(log, light) { if (light) log.wrong = []; if (light >= 2) log.days = {}; return log; }
  // only: a child's id for a code with just that child; leave it out for every child.
  // light: for a code short enough for a QR code. 1 (or true) leaves out the list of wrong answers (the biggest
  // part); 2 also leaves out the answers per day and the Last 5 dots, and keeps stars, badges, the day streak,
  // the age, the game levels and settings, and the last game.
  function snapshot(only, light) {
    var p = Loopy.kids.list().filter(function (kid) { return !only || kid.id === only; }).map(function (kid) {
      var id = kid.id;
      return {
        n: kid.name, pic: kid.pic,
        rewards: Loopy.rewards.clean(read("rewards", id)),
        daily: Loopy.daily.clean(read("daily", id)),
        log: lightLog(Loopy.log.clean(read("log", id)), light),
        recent: Loopy.recent.clean(light >= 2 ? null : read("recent", id)),
        age: get("age", id) === null ? null : cleanAge(parseInt(get("age", id), 10) || 0),
        read: choice("read", get("read", id)),
        g: gOf(id)
      };
    });
    return { v: 2, p: p, theme: choice("theme", get("theme")), font: choice("font", get("font")), sound: choice("sound", get("sound")), lang: choice("lang", get("lang")) };
  }

  // Adds a checked child from a code to what this device has. Everything is cleaned again before it is saved.
  function merge(got, id) {
    var R = Loopy.rewards.clean(read("rewards", id)), r = Loopy.rewards.clean(got.rewards);
    R.stars = Math.max(R.stars, r.stars);
    Object.keys(r.best).forEach(function (g) { R.best[g] = Math.max(R.best[g] || 0, r.best[g]); });
    r.played.forEach(function (g) { if (R.played.indexOf(g) === -1) R.played.push(g); });
    R.brave = R.brave || r.brave;
    put("rewards", Loopy.rewards.clean(R), id);

    var D = Loopy.daily.clean(read("daily", id)), d = Loopy.daily.clean(got.daily);
    if (d.last > D.last) { D.last = d.last; D.streak = d.streak; }
    D.best = Math.max(D.best, d.best);
    put("daily", Loopy.daily.clean(D), id);

    // Progress: for each day and game the bigger count wins, so loading the same code twice counts nothing twice.
    var L = Loopy.log.clean(read("log", id)), l = Loopy.log.clean(got.log);
    Object.keys(l.days).forEach(function (day) {
      var row = L.days[day] = L.days[day] || {};
      Object.keys(l.days[day]).forEach(function (g) {
        var a = row[g] || [0, 0], b = l.days[day][g], m = [Math.max(a[0], b[0]), Math.max(a[1], b[1])];
        // The counts per kind (since 24 Oct 2026) merge the same way, kind by kind.
        if (a[2] || b[2]) {
          var by = {}, ka = a[2] || {}, kb = b[2] || {};
          Object.keys(ka).concat(Object.keys(kb)).forEach(function (k) {
            var x = ka[k] || [0, 0], y = kb[k] || [0, 0];
            by[k] = [Math.max(x[0], y[0]), Math.max(x[1], y[1])];
          });
          m.push(by);
        }
        row[g] = m;
      });
    });
    // The same wrong answer from both sides is one row; the bigger "answered right since" count (Try again) wins.
    var seen = {};
    L.wrong = L.wrong.concat(l.wrong).filter(function (w) {
      var k = JSON.stringify([w.d, w.g, w.q, w.a, w.y, w.k, w.r || ""]);
      if (seen[k]) { if (w.f > (seen[k].f || 0)) seen[k].f = w.f; return false; }
      seen[k] = w;
      return true;
    }).sort(function (a, b) { return a.d < b.d ? -1 : a.d > b.d ? 1 : 0; }).slice(-Loopy.log.MAX_WRONG);
    put("log", Loopy.log.clean(L), id);

    var N = Loopy.recent.clean(read("recent", id)), n = Loopy.recent.clean(got.recent);
    Object.keys(n).forEach(function (g) { if (!N[g] || !N[g].length) N[g] = n[g]; });
    put("recent", N, id);

    if (get("age", id) === null && cleanAge(got.age) !== null) put("age", String(cleanAge(got.age)), id);
    if (get("read", id) === null && choice("read", got.read)) put("read", got.read, id);

    // Game levels and settings, the last game and seen games: only taken when this device has none for that key.
    var G = cleanG(got.g);
    Object.keys(G).forEach(function (k) {
      var full = Loopy.kids.key(id, k);
      try { if (localStorage.getItem(full) === null) localStorage.setItem(full, G[k]); } catch (e) {}
    });
  }
  // A child with no name and no stars, alone on the device: a new device, ready to take a child from a code.
  function blank() {
    var here = Loopy.kids.list();
    return here.length === 1 && !here[0].name && !Loopy.rewards.clean(read("rewards", here[0].id)).stars ? here[0] : null;
  }

  function kidsOf(d) {
    if (!d || typeof d !== "object" || d.v !== 2 || !Array.isArray(d.p) || !d.p.length || d.p.length > MAX_P) return null;
    var kids = d.p.filter(function (c) { return c && typeof c === "object"; });
    return kids.length ? kids : null;
  }
  // quiet: from Family sync, so the child playing stays the same.
  function load(d, quiet) {
    var kids = kidsOf(d);
    if (!kids) return false;
    var here = Loopy.kids.list(), now = Loopy.kids.current().id, empty = blank(), last = null;
    kids.forEach(function (c) {
      var name = Loopy.kids.cleanName(c.n), same = function (k) { return name && k.name.toLowerCase() === name.toLowerCase(); };
      var id = !name ? now : (here.filter(same)[0] || {}).id || null;
      if (!id && empty) { id = empty.id; Loopy.kids.edit(id, name, c.pic); empty = null; }
      if (!id) id = Loopy.kids.create(name, c.pic);
      if (id) { merge(c, id); last = id; }
    });
    // A code with one child: that child plays next.
    if (kids.length === 1 && last && !quiet) Loopy.kids.pick(last);
    ["theme", "font", "sound", "lang"].forEach(function (k) { if (get(k) === null && choice(k, d[k])) put(k, d[k]); });
    return true;
  }
  // Codes from before: { s: stars, b: { game: best } }.
  function loadOld(d) {
    if (!d || typeof d !== "object" || typeof d.s !== "number") return false;
    merge({ rewards: { stars: d.s, best: d.b } }, Loopy.kids.current().id);
    return true;
  }

  // A promise of what a code holds, unchecked: { v2: data } or { old: data }. Rejects for a code that is not a loopy code.
  function decode(code) {
    return Promise.resolve().then(function () {
      code = String(code).replace(/\s+/g, "");
      if (code.length > MAX_CODE) throw new Error("too long");
      var m = /^LOOPY2-([ZJ])([A-Za-z0-9+/]+=*)$/i.exec(code);
      if (m) {
        var bytes = unb64(m[2]);
        var json = m[1].toUpperCase() === "J" ? Promise.resolve(bytes) : can ? pipe(bytes, new DecompressionStream("deflate-raw")) : Promise.reject(new Error("can't unpack"));
        return json.then(function (b) {
          if (b.length > MAX_JSON) throw new Error("too big");
          return { v2: JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(b)) };
        });
      }
      m = /^LOOPY-([A-Za-z0-9+/]+=*)$/i.exec(code);
      if (!m || m[1].length > 2000) throw new Error("not a code");
      return { old: JSON.parse(atob(m[1])) };
    });
  }

  Loopy.backup = {
    // A promise of the code for everything saved in this browser; with a child's id, for just that child.
    // light (1 or 2, see snapshot): with less in it, so the code stays short enough for a QR code.
    exportCode: function (only, light) {
      var bytes = new TextEncoder().encode(JSON.stringify(snapshot(only, light)));
      if (!can) return Promise.resolve("LOOPY2-J" + b64(bytes));
      return pipe(bytes, new CompressionStream("deflate-raw")).then(function (z) { return "LOOPY2-Z" + b64(z); });
    },
    // A promise of true when the code was good and its data is saved. Reload the page to show it.
    // opts.quiet (Family sync): keep the child who is playing now.
    importCode: function (code, opts) {
      return decode(code).then(function (got) {
        var ok = got.v2 ? load(got.v2, !!(opts && opts.quiet)) : loadOld(got.old);
        if (ok && Loopy.keep) Loopy.keep.soon();
        return ok;
      }).catch(function () { return false; });
    },
    // A promise of the names in a code, without saving anything (for "Load Mia's stars here?"):
    // a list of names ("" for a child with no name), or null when the code is no good.
    peek: function (code) {
      return decode(code).then(function (got) {
        if (got.old) return got.old && typeof got.old === "object" && typeof got.old.s === "number" ? [""] : null;
        var kids = kidsOf(got.v2);
        return kids ? kids.map(function (c) { return Loopy.kids.cleanName(c.n); }) : null;
      }).catch(function () { return null; });
    },
    // The link that opens the home page and offers to load code.
    link: function (code) { return Loopy.root + "#load=" + code; },
    // { n, path } for an SVG of the QR code of text, or null when it needs more than maxVersion (see qr above).
    qr: qr,
    MAX_CODE: MAX_CODE
  };

  // The QR code for the stars link, drawn here so no picture is fetched from anywhere. Byte mode, the smallest
  // version (size) that holds the text, error level L (M when it fits the same size), the best of the 8 masks.
  // qr(text, maxVersion) gives { n: modules per side, path: an SVG path of the dark modules } or null when
  // the text does not fit in maxVersion (40 is the biggest; past about 25 a phone camera struggles with a screen).
  var ECC = [[7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
    [10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28]];
  var BLOCKS = [[1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25],
    [1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49]];
  // Codewords (bytes) a version holds in all, before error correction.
  function rawWords(v) {
    var n = (16 * v + 128) * v + 64;
    if (v >= 2) { var a = Math.floor(v / 7) + 2; n -= (25 * a - 10) * a - 55; if (v >= 7) n -= 36; }
    return Math.floor(n / 8);
  }
  function dataWords(v, lv) { return rawWords(v) - ECC[lv][v - 1] * BLOCKS[lv][v - 1]; }
  // GF(256) for Reed-Solomon.
  function gfMul(x, y) { var z = 0; for (var i = 7; i >= 0; i--) { z = (z << 1) ^ ((z >>> 7) * 0x11D); z ^= ((y >>> i) & 1) * x; } return z; }
  function rsRemainder(data, deg) {
    var gen = [], rem = [], i, root = 1;
    for (i = 0; i < deg; i++) { gen.push(i === deg - 1 ? 1 : 0); rem.push(0); }
    for (i = 0; i < deg; i++) {
      for (var j = 0; j < deg; j++) { gen[j] = gfMul(gen[j], root); if (j + 1 < deg) gen[j] ^= gen[j + 1]; }
      root = gfMul(root, 2);
    }
    data.forEach(function (b) {
      var f = b ^ rem.shift(); rem.push(0);
      for (var k = 0; k < deg; k++) rem[k] ^= gfMul(gen[k], f);
    });
    return rem;
  }
  function qr(text, maxVersion) {
    var bytes = new TextEncoder().encode(text), v, lv = 0;
    for (v = 1; v <= Math.min(maxVersion || 40, 40); v++) if (dataWords(v, 0) >= bytes.length + (v > 9 ? 3 : 2)) break;
    if (v > 40 || v > (maxVersion || 40)) return null;
    if (dataWords(v, 1) >= bytes.length + (v > 9 ? 3 : 2)) lv = 1;
    var n = v * 4 + 17, cap = dataWords(v, lv), bits = [], i, x, y;
    var push = function (val, len) { for (var b = len - 1; b >= 0; b--) bits.push((val >>> b) & 1); };
    push(4, 4); push(bytes.length, v > 9 ? 16 : 8);
    for (i = 0; i < bytes.length; i++) push(bytes[i], 8);
    push(0, Math.min(4, cap * 8 - bits.length));
    while (bits.length % 8) bits.push(0);
    for (i = 0xEC; bits.length < cap * 8; i ^= 0xEC ^ 0x11) push(i, 8);
    var data = []; for (i = 0; i < bits.length; i += 8) data.push(parseInt(bits.slice(i, i + 8).join(""), 2));
    // Split into blocks, add error correction to each, and interleave.
    var nb = BLOCKS[lv][v - 1], ecc = ECC[lv][v - 1], raw = rawWords(v), short = nb - raw % nb, len = Math.floor(raw / nb), blocks = [], k = 0;
    for (i = 0; i < nb; i++) {
      var part = data.slice(k, k + len - ecc + (i < short ? 0 : 1)); k += part.length;
      var rem = rsRemainder(part, ecc);
      if (i < short) part.push(0);
      blocks.push(part.concat(rem));
    }
    var out = [];
    for (i = 0; i < blocks[0].length; i++) blocks.forEach(function (b, j) { if (i !== len - ecc || j >= short) out.push(b[i]); });
    // The modules: m[y][x] is 1 for dark; f[y][x] marks the fixed patterns, which no mask touches.
    var m = [], f = [];
    for (y = 0; y < n; y++) { m.push([]); f.push([]); for (x = 0; x < n; x++) { m[y].push(0); f[y].push(0); } }
    var set = function (x, y, dark) { if (x >= 0 && y >= 0 && x < n && y < n) { m[y][x] = dark ? 1 : 0; f[y][x] = 1; } };
    var finder = function (cx, cy) { for (var dy = -4; dy <= 4; dy++) for (var dx = -4; dx <= 4; dx++) { var d = Math.max(Math.abs(dx), Math.abs(dy)); set(cx + dx, cy + dy, d !== 2 && d !== 4); } };
    for (i = 0; i < n; i++) { set(6, i, i % 2 === 0); set(i, 6, i % 2 === 0); }
    finder(3, 3); finder(n - 4, 3); finder(3, n - 4);
    var pos = [];
    if (v > 1) {
      var na = Math.floor(v / 7) + 2, step = v === 32 ? 26 : Math.ceil((v * 4 + 4) / (na * 2 - 2)) * 2;
      for (i = 0, k = n - 7; i < na - 1; i++, k -= step) pos.unshift(k);
      pos.unshift(6);
    }
    pos.forEach(function (cy, a) { pos.forEach(function (cx, b) {
      if ((a === 0 && b === 0) || (a === 0 && b === pos.length - 1) || (a === pos.length - 1 && b === 0)) return;
      for (var dy = -2; dy <= 2; dy++) for (var dx = -2; dx <= 2; dx++) set(cx + dx, cy + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
    }); });
    var format = function (mask) {
      var d = ((lv ? 0 : 1) << 3) | mask, r = d;
      for (var j = 0; j < 10; j++) r = (r << 1) ^ ((r >>> 9) * 0x537);
      var b = ((d << 10) | r) ^ 0x5412, bit = function (j) { return (b >>> j) & 1; };
      for (j = 0; j <= 5; j++) set(8, j, bit(j));
      set(8, 7, bit(6)); set(8, 8, bit(7)); set(7, 8, bit(8));
      for (j = 9; j < 15; j++) set(14 - j, 8, bit(j));
      for (j = 0; j < 8; j++) set(n - 1 - j, 8, bit(j));
      for (j = 8; j < 15; j++) set(8, n - 15 + j, bit(j));
      set(8, n - 8, 1);
    };
    format(0);
    if (v >= 7) {
      var r = v; for (i = 0; i < 12; i++) r = (r << 1) ^ ((r >>> 11) * 0x1F25);
      var vb = (v << 12) | r;
      for (i = 0; i < 18; i++) { var a = n - 11 + i % 3, b = Math.floor(i / 3), d = (vb >>> i) & 1; set(a, b, d); set(b, a, d); }
    }
    // Data goes in zigzag columns from the right, skipping the fixed patterns.
    i = 0;
    for (var right = n - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5;
      for (var vert = 0; vert < n; vert++) for (var j = 0; j < 2; j++) {
        x = right - j; y = ((right + 1) & 2) === 0 ? n - 1 - vert : vert;
        if (!f[y][x] && i < out.length * 8) { m[y][x] = (out[i >>> 3] >>> (7 - (i & 7))) & 1; i++; }
      }
    }
    var MASKS = [function (x, y) { return (x + y) % 2 === 0; }, function (x, y) { return y % 2 === 0; }, function (x) { return x % 3 === 0; },
      function (x, y) { return (x + y) % 3 === 0; }, function (x, y) { return (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0; },
      function (x, y) { return x * y % 2 + x * y % 3 === 0; }, function (x, y) { return (x * y % 2 + x * y % 3) % 2 === 0; },
      function (x, y) { return ((x + y) % 2 + x * y % 3) % 2 === 0; }];
    var apply = function (mask) { for (var yy = 0; yy < n; yy++) for (var xx = 0; xx < n; xx++) if (!f[yy][xx] && MASKS[mask](xx, yy)) m[yy][xx] ^= 1; };
    // The penalty of the current picture, as the standard counts it: long runs, 2x2 blocks, finder-like runs, dark share.
    var penalty = function () {
      var p = 0, dark = 0;
      // Runs and finder-like patterns, rows then columns (a plain check of the 1:1:3:1:1 pattern with a 4-light side).
      var scan = function (get) {
        for (var a = 0; a < n; a++) {
          var run = 0, last = -1, b;
          for (b = 0; b < n; b++) {
            var c = get(a, b);
            if (c === last) run++; else { if (run >= 5) p += run - 2; run = 1; last = c; }
          }
          if (run >= 5) p += run - 2;
          for (b = 0; b + 7 <= n; b++) {
            if (get(a, b) && !get(a, b + 1) && get(a, b + 2) && get(a, b + 3) && get(a, b + 4) && !get(a, b + 5) && get(a, b + 6)) {
              var before = b >= 4 && !get(a, b - 1) && !get(a, b - 2) && !get(a, b - 3) && !get(a, b - 4);
              var after = b + 10 < n && !get(a, b + 7) && !get(a, b + 8) && !get(a, b + 9) && !get(a, b + 10);
              if (before || after || b < 4 || b + 11 > n) p += 40;
            }
          }
        }
      };
      scan(function (a, b) { return m[a][b]; });
      scan(function (a, b) { return m[b][a]; });
      for (y = 0; y < n - 1; y++) for (x = 0; x < n - 1; x++) {
        var c = m[y][x];
        if (c === m[y][x + 1] && c === m[y + 1][x] && c === m[y + 1][x + 1]) p += 3;
      }
      for (y = 0; y < n; y++) for (x = 0; x < n; x++) dark += m[y][x];
      p += 10 * (Math.ceil(Math.abs(dark * 20 - n * n * 10) / (n * n)) - 1);
      return p;
    };
    var best = 0, bestP = Infinity;
    for (i = 0; i < 8; i++) {
      apply(i); format(i);
      var p = penalty();
      if (p < bestP) { bestP = p; best = i; }
      apply(i);
    }
    apply(best); format(best);
    var path = "";
    for (y = 0; y < n; y++) for (x = 0; x < n; x++) if (m[y][x]) {
      var w = 1; while (x + w < n && m[y][x + w]) w++;
      path += "M" + x + " " + y + "h" + w + "v1h-" + w + "z";
      x += w - 1;
    }
    return { n: n, path: path, v: v };
  }
})();
