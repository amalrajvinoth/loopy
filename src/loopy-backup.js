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
  var GKEY = /^(?:(?:bs|cc|clockquiz|eb|fc|gd|mk|pm100|pr|pz|qf|sb|si|ss|ts|tt|wi|wm)\.[A-Za-z]{1,16}(?:\.a\d{1,2})?|loopy\.(?:last|seen|levels))$/;
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

  // only: a child's id for a code with just that child; leave it out for every child.
  function snapshot(only) {
    var p = Loopy.kids.list().filter(function (kid) { return !only || kid.id === only; }).map(function (kid) {
      var id = kid.id;
      return {
        n: kid.name, pic: kid.pic,
        rewards: Loopy.rewards.clean(read("rewards", id)),
        daily: Loopy.daily.clean(read("daily", id)),
        log: Loopy.log.clean(read("log", id)),
        recent: Loopy.recent.clean(read("recent", id)),
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
        var a = row[g] || [0, 0], b = l.days[day][g];
        row[g] = [Math.max(a[0], b[0]), Math.max(a[1], b[1])];
      });
    });
    var seen = {};
    L.wrong = L.wrong.concat(l.wrong).filter(function (w) {
      var k = JSON.stringify(w);
      return seen[k] ? false : (seen[k] = true);
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
  function load(d) {
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
    if (kids.length === 1 && last) Loopy.kids.pick(last);
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
    exportCode: function (only) {
      var bytes = new TextEncoder().encode(JSON.stringify(snapshot(only)));
      if (!can) return Promise.resolve("LOOPY2-J" + b64(bytes));
      return pipe(bytes, new CompressionStream("deflate-raw")).then(function (z) { return "LOOPY2-Z" + b64(z); });
    },
    // A promise of true when the code was good and its data is saved. Reload the page to show it.
    importCode: function (code) {
      return decode(code).then(function (got) {
        var ok = got.v2 ? load(got.v2) : loadOld(got.old);
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
    MAX_CODE: MAX_CODE
  };
})();
