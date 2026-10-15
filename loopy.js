/* Loopy shared script: languages, color themes, age picker, sounds, stars and badges.
   Each part is its own block below. Load it in <head>. */

// Languages: English (default) and German. Pages add their own words with Loopy.addStrings,
// mark fixed text with data-t="key", and use Loopy.t("key", { name: value }) in scripts.
(function () {
  var KEY = "loopy.lang", LANGS = ["en", "de"];
  var lang = "en";
  try { var saved = localStorage.getItem(KEY); if (LANGS.indexOf(saved) !== -1) lang = saved; } catch (e) {}
  document.documentElement.lang = lang;
  var dict = { en: {}, de: {} };

  var Loopy = window.Loopy = window.Loopy || {};
  Loopy.lang = lang;
  Loopy.addStrings = function (d) { LANGS.forEach(function (l) { if (d[l]) for (var k in d[l]) dict[l][k] = d[l][k]; }); };
  Loopy.t = function (key, vars) {
    var s = dict[lang][key];
    if (s === undefined) s = dict.en[key];
    if (s === undefined) return key;
    if (vars) s = s.replace(/\{(\w+)\}/g, function (m, k) { return vars[k] !== undefined ? vars[k] : m; });
    return s;
  };
  Loopy.num = function (n) { return n.toLocaleString(lang === "de" ? "de-DE" : "en-US"); };
  Loopy.setLang = function (l) {
    if (LANGS.indexOf(l) === -1 || l === lang) return;
    try { localStorage.setItem(KEY, l); } catch (e) {}
    location.reload();
  };

  Loopy.addStrings({
    en: {
      theme: "Color theme", black: "Black", sunny: "Sunny", ocean: "Ocean", candy: "Candy", forest: "Forest",
      ageGroup: "Age", ageLabel: "Age {n}", younger: "Younger", older: "Older",
      soundOn: "Sound on", soundOff: "Sound off", settings: "Settings", language: "Language",
      starsEarned: "Stars earned",
      b10: "First Steps", b25: "Rising Star", b50: "Super Learner", b100: "Brain Builder", b250: "Champion", b500: "Legend", b1000: "loopy Master",
      newBadge: "New badge: {name}!", badgeText: "You have earned {n} stars. Keep going!",
      levelUp: "{n} in a row! Ready to level up?", makeHarder: "Make it harder", keepGoing: "Keep going", yay: "Yay!",
      inARow: "{n} in a row!", bestYet: "That's your best streak yet!", amazing: "Amazing work!",
      newBest: "New best streak: {n}!", keepItGoing: "Keep it going!",
      correct: "Correct!", correctRow: "Correct! {n} in a row!", notQuite: "Not quite.",
      score: "Score", streak: "Streak", home: "← loopy", resetScore: "Reset score",
      tapHint: "Tap the numbers to write your answer.", kbdHint: "Keyboard works too: numbers, Backspace, Enter.",
      erase: "Erase", eraseAria: "Erase last digit", check: "Check", next: "Next", yourAnswer: "Your answer", both: "Both"
    },
    de: {
      theme: "Farbthema", black: "Schwarz", sunny: "Sonnig", ocean: "Ozean", candy: "Bonbon", forest: "Wald",
      ageGroup: "Alter", ageLabel: "Alter {n}", younger: "Jünger", older: "Älter",
      soundOn: "Ton an", soundOff: "Ton aus", settings: "Einstellungen", language: "Sprache",
      starsEarned: "Gesammelte Sterne",
      b10: "Erste Schritte", b25: "Aufsteiger", b50: "Super-Lerner", b100: "Denk-Profi", b250: "Champion", b500: "Legende", b1000: "loopy-Meister",
      newBadge: "Neues Abzeichen: {name}!", badgeText: "Du hast {n} Sterne gesammelt. Weiter so!",
      levelUp: "{n} richtig hintereinander! Bereit für mehr?", makeHarder: "Schwieriger machen", keepGoing: "Weiter so", yay: "Juhu!",
      inARow: "{n} richtig hintereinander!", bestYet: "Das ist deine beste Serie!", amazing: "Super gemacht!",
      newBest: "Neue beste Serie: {n}!", keepItGoing: "Mach weiter so!",
      correct: "Richtig!", correctRow: "Richtig! {n} hintereinander!", notQuite: "Nicht ganz.",
      score: "Punkte", streak: "Serie", home: "← loopy", resetScore: "Punkte zurücksetzen",
      tapHint: "Tippe auf die Zahlen, um deine Antwort zu schreiben.", kbdHint: "Die Tastatur geht auch: Zahlen, Rücktaste, Enter.",
      erase: "Löschen", eraseAria: "Letzte Ziffer löschen", check: "Prüfen", next: "Weiter", yourAnswer: "Deine Antwort", both: "Beides"
    }
  });

  function apply() {
    document.querySelectorAll("[data-t]").forEach(function (el) { el.textContent = Loopy.t(el.getAttribute("data-t")); });
    document.querySelectorAll("[data-t-aria]").forEach(function (el) { el.setAttribute("aria-label", Loopy.t(el.getAttribute("data-t-aria"))); });
    document.querySelectorAll("[data-t-placeholder]").forEach(function (el) { el.setAttribute("placeholder", Loopy.t(el.getAttribute("data-t-placeholder"))); });
    var box = document.getElementById("lang-picker");
    if (box) {
      box.className = "lang-picker";
      box.setAttribute("role", "group");
      box.setAttribute("aria-label", Loopy.t("language"));
      box.innerHTML = "";
      [["en", "EN", "English"], ["de", "DE", "Deutsch"]].forEach(function (o) {
        var b = document.createElement("button");
        b.type = "button"; b.id = "lang-" + o[0]; b.textContent = o[1]; b.title = o[2];
        b.setAttribute("aria-label", o[2]);
        b.setAttribute("aria-pressed", String(o[0] === lang));
        b.addEventListener("click", function () { Loopy.setLang(o[0]); });
        box.appendChild(b);
      });
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", apply);
  else apply();
})();

// Loopy themes: black is the default, the choice is remembered on this device.
(function () {
  var THEMES = [
    { id: "black",  name: "black",  bg: "#0a0a0c", dot: "#5b9dff" },
    { id: "sunny",  name: "sunny",  bg: "#fff8ec", dot: "#d4561f" },
    { id: "ocean",  name: "ocean",  bg: "#06263a", dot: "#4cc9f0" },
    { id: "candy",  name: "candy",  bg: "#fff0f6", dot: "#c2257a" },
    { id: "forest", name: "forest", bg: "#0f1f17", dot: "#8ce99a" }
  ];
  var KEY = "loopy.theme";
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  if (!THEMES.some(function (t) { return t.id === saved; })) saved = "black";
  document.documentElement.setAttribute("data-theme", saved);

  function build() {
    var box = document.getElementById("theme-picker");
    if (!box) return;
    box.className = "themes";
    box.setAttribute("role", "group");
    box.setAttribute("aria-label", Loopy.t("theme"));
    THEMES.forEach(function (t) {
      var b = document.createElement("button");
      b.type = "button";
      b.id = "theme-" + t.id;
      b.title = Loopy.t(t.name);
      b.setAttribute("aria-label", Loopy.t(t.name));
      b.style.setProperty("--sw-bg", t.bg);
      b.style.setProperty("--sw-dot", t.dot);
      b.addEventListener("click", function () {
        document.documentElement.setAttribute("data-theme", t.id);
        try { localStorage.setItem(KEY, t.id); } catch (e) {}
        sync();
      });
      box.appendChild(b);
    });
    sync();
  }
  function sync() {
    var cur = document.documentElement.getAttribute("data-theme");
    THEMES.forEach(function (t) {
      var b = document.getElementById("theme-" + t.id);
      if (b) b.setAttribute("aria-pressed", String(t.id === cur));
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
  else build();
})();

// Loopy age picker: games use the age to pick their difficulty.
// The default age comes from a birth month of August 2018 and goes up by itself each year.
(function () {
  var BIRTH_YEAR = 2018, BIRTH_MONTH = 8;
  var MIN = 5, MAX = 16, KEY = "loopy.ageOffset";
  var clamp = function (n) { return Math.max(MIN, Math.min(MAX, n)); };

  function defaultAge() {
    var d = new Date();
    var a = d.getFullYear() - BIRTH_YEAR;
    if (d.getMonth() + 1 < BIRTH_MONTH) a--;
    return clamp(a);
  }
  // A changed age is saved as years above or below the default, so it still goes up each birthday.
  var offset = 0;
  try { offset = parseInt(localStorage.getItem(KEY), 10) || 0; } catch (e) {}
  var age = clamp(defaultAge() + offset);

  var Loopy = window.Loopy = window.Loopy || {};
  Loopy.getAge = function () { return age; };
  Loopy.setAge = function (n) {
    n = clamp(n);
    if (n === age) return;
    age = n;
    try { localStorage.setItem(KEY, String(age - defaultAge())); } catch (e) {}
    sync();
    window.dispatchEvent(new CustomEvent("loopy:age", { detail: age }));
  };

  function build() {
    var box = document.getElementById("age-picker");
    if (!box) return;
    box.className = "age-picker";
    box.setAttribute("role", "group");
    box.setAttribute("aria-label", Loopy.t("ageGroup"));
    box.innerHTML = '<button type="button" id="age-down" aria-label="' + Loopy.t("younger") + '">&minus;</button>' +
      '<span id="age-label" aria-live="polite"></span>' +
      '<button type="button" id="age-up" aria-label="' + Loopy.t("older") + '">+</button>';
    document.getElementById("age-down").addEventListener("click", function () { Loopy.setAge(age - 1); });
    document.getElementById("age-up").addEventListener("click", function () { Loopy.setAge(age + 1); });
    sync();
  }
  function sync() {
    var l = document.getElementById("age-label");
    if (!l) return;
    l.textContent = Loopy.t("ageLabel", { n: age });
    document.getElementById("age-down").disabled = age <= MIN;
    document.getElementById("age-up").disabled = age >= MAX;
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
  else build();
})();

// Loopy sounds: short tones made in the browser (no files). The mute choice is remembered.
(function () {
  var KEY = "loopy.sound", on = true, ac = null;
  try { on = localStorage.getItem(KEY) !== "off"; } catch (e) {}
  var TUNES = {
    right: [[660, 0, .12], [880, .09, .16]],
    wrong: [[330, 0, .16], [262, .13, .22]],
    cheer: [[523, 0, .12], [659, .1, .12], [784, .2, .2]],
    badge: [[523, 0, .12], [659, .1, .12], [784, .2, .12], [1047, .3, .35]]
  };
  function play(kind) {
    if (!on || !TUNES[kind]) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      if (ac.state === "suspended") ac.resume();
      var t0 = ac.currentTime + 0.01;
      TUNES[kind].forEach(function (n) {
        var o = ac.createOscillator(), g = ac.createGain();
        o.type = kind === "wrong" ? "sine" : "triangle";
        o.frequency.value = n[0];
        g.gain.setValueAtTime(0.0001, t0 + n[1]);
        g.gain.exponentialRampToValueAtTime(kind === "wrong" ? 0.12 : 0.18, t0 + n[1] + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + n[1] + n[2]);
        o.connect(g).connect(ac.destination);
        o.start(t0 + n[1]); o.stop(t0 + n[1] + n[2] + 0.05);
      });
    } catch (e) {}
  }
  var ON_ICON = '<path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>';
  var OFF_ICON = '<path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M17 9l5 6M22 9l-5 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>';
  function sync() {
    var b = document.getElementById("sound-toggle");
    if (!b) return;
    b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">' + (on ? ON_ICON : OFF_ICON) + "</svg>";
    b.setAttribute("aria-pressed", String(on));
    b.setAttribute("aria-label", Loopy.t(on ? "soundOn" : "soundOff"));
    b.title = Loopy.t(on ? "soundOn" : "soundOff");
  }
  function build() {
    var b = document.getElementById("sound-toggle");
    if (!b) return;
    b.type = "button";
    b.className = "sound-toggle";
    b.addEventListener("click", function () {
      on = !on;
      try { localStorage.setItem(KEY, on ? "on" : "off"); } catch (e) {}
      sync();
      play("right");
    });
    sync();
  }
  var Loopy = window.Loopy = window.Loopy || {};
  Loopy.sound = { play: play, isOn: function () { return on; } };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
  else build();
})();

// Loopy rewards: a star for every right answer, badges for star totals, confetti for streaks.
// Progress is kept in this browser's localStorage (no account, nothing sent anywhere).
(function () {
  var KEY = "loopy.rewards";
  var BADGES = [
    { stars: 10,   key: "b10",   color: "--c3" },
    { stars: 25,   key: "b25",   color: "--c1" },
    { stars: 50,   key: "b50", color: "--c2" },
    { stars: 100,  key: "b100", color: "--c4" },
    { stars: 250,  key: "b250",      color: "--c5" },
    { stars: 500,  key: "b500",        color: "--c1" },
    { stars: 1000, key: "b1000",  color: "--c2" }
  ];
  var STREAKS = [5, 10, 15, 20, 30, 50];
  var STAR_PATH = "M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z";

  var data = { stars: 0, best: {} };
  var cheeredBest = {}; // one "new best" cheer per run
  try { var raw = JSON.parse(localStorage.getItem(KEY)); if (raw && typeof raw.stars === "number") data = raw; } catch (e) {}
  data.best = data.best || {};
  function save() { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {} }

  var reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Confetti drawn on a full-screen canvas that removes itself when done.
  function confetti(amount) {
    if (reduced) return;
    var c = document.createElement("canvas");
    c.className = "loopy-confetti";
    document.body.appendChild(c);
    var ctx = c.getContext("2d"), dpr = window.devicePixelRatio || 1;
    var W = c.width = innerWidth * dpr, H = c.height = innerHeight * dpr;
    var css = getComputedStyle(document.documentElement);
    var colors = ["--c1", "--c2", "--c3", "--c4", "--c5"].map(function (v) { return css.getPropertyValue(v).trim() || "#ffd23f"; });
    var bits = [];
    for (var i = 0; i < amount; i++) {
      var fromLeft = i % 2 === 0;
      bits.push({
        x: fromLeft ? 0 : W, y: H * 0.75,
        vx: (fromLeft ? 1 : -1) * (6 + Math.random() * 10) * dpr, vy: -(12 + Math.random() * 14) * dpr,
        w: (6 + Math.random() * 6) * dpr, h: (8 + Math.random() * 8) * dpr,
        r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4, color: colors[i % colors.length], star: i % 6 === 0
      });
    }
    var start = performance.now();
    (function frame(t) {
      ctx.clearRect(0, 0, W, H);
      var alive = false;
      bits.forEach(function (b) {
        b.vy += 0.45 * dpr; b.vx *= 0.99; b.x += b.vx; b.y += b.vy; b.r += b.vr;
        if (b.y < H + 40) alive = true;
        ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.r); ctx.fillStyle = b.color;
        if (b.star) { var s = b.h / 12; ctx.scale(s, s); ctx.translate(-12, -12); ctx.fill(new Path2D(STAR_PATH)); }
        else ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h);
        ctx.restore();
      });
      if (alive && t - start < 4500) requestAnimationFrame(frame); else c.remove();
    })(start);
  }

  // A big friendly message in the middle of the screen.
  // actions: buttons for a big card, e.g. [{ label: "Make it harder", fn: ... }]. A big card always has one.
  function celebrate(title, text, big, actions) {
    var old = document.querySelector(".loopy-cheer");
    if (old) old.remove();
    var el = document.createElement("div");
    el.className = "loopy-cheer" + (big ? " big" : "");
    el.setAttribute("role", "status");
    el.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + STAR_PATH + '"/></svg><strong></strong><span></span>' +
      (big ? '<div class="cheer-actions"></div>' : "");
    el.querySelector("strong").textContent = title;
    el.querySelector("span").textContent = text;
    document.body.appendChild(el);
    var close = function () { el.classList.add("out"); setTimeout(function () { el.remove(); }, 250); };
    if (big) {
      var row = el.querySelector(".cheer-actions");
      (actions || [{ label: Loopy.t("yay") }]).forEach(function (a, i) {
        var b = document.createElement("button");
        b.type = "button";
        b.textContent = a.label;
        if (i > 0) b.className = "quiet";
        b.addEventListener("click", function () { close(); if (a.fn) a.fn(); });
        row.appendChild(b);
      });
      row.firstChild.focus({ preventScroll: true });
    }
    else setTimeout(close, 2200);
    confetti(big ? 160 : 70);
  }

  BADGES.forEach(function (b) { Object.defineProperty(b, "name", { get: function () { return Loopy.t(b.key); } }); });
  function badgeFor(stars) { var got = null; BADGES.forEach(function (b) { if (stars >= b.stars) got = b; }); return got; }
  function nextBadge(stars) { for (var i = 0; i < BADGES.length; i++) if (stars < BADGES[i].stars) return BADGES[i]; return null; }

  function updateChips() {
    document.querySelectorAll("[data-loopy-stars]").forEach(function (n) { n.textContent = data.stars; });
  }

  var Loopy = window.Loopy = window.Loopy || {};
  Loopy.rewards = {
    BADGES: BADGES, STAR_PATH: STAR_PATH,
    get: function () { return data; },
    // Moving progress to another device: a short code to copy, and loading one back.
    exportCode: function () { return "LOOPY-" + btoa(JSON.stringify({ s: data.stars, b: data.best })); },
    importCode: function (code) {
      try {
        var d = JSON.parse(atob(String(code).trim().replace(/^LOOPY-/i, "")));
        if (typeof d.s !== "number" || d.s < 0) return false;
        data.stars = Math.max(data.stars, Math.floor(d.s));
        for (var k in (d.b || {})) if (typeof d.b[k] === "number") data.best[k] = Math.max(data.best[k] || 0, d.b[k]);
        save(); updateChips();
        return true;
      } catch (e) { return false; }
    },
    badgeFor: badgeFor, nextBadge: nextBadge, confetti: confetti, celebrate: celebrate,
    // Call after a wrong answer.
    wrong: function () { Loopy.sound.play("wrong"); },
    // Call after each right answer with the current streak.
    // harder: optional { label, apply } offered after 10 in a row, e.g. { label: "Try quarter hours", apply: fn }.
    correct: function (game, streak, harder) {
      var before = badgeFor(data.stars);
      data.stars++;
      if (streak <= 1) cheeredBest[game] = false;
      var newBest = streak > (data.best[game] || 0);
      if (newBest) data.best[game] = streak;
      save(); updateChips();
      var after = badgeFor(data.stars);
      if (after && after !== before) {
        Loopy.sound.play("badge");
        celebrate(Loopy.t("newBadge", { name: after.name }), Loopy.t("badgeText", { n: data.stars }), true);
      } else if (streak % 10 === 0 && harder) {
        Loopy.sound.play("badge");
        celebrate(Loopy.t("levelUp", { n: streak }), harder.label + ".", true,
          [{ label: Loopy.t("makeHarder"), fn: harder.apply }, { label: Loopy.t("keepGoing") }]);
      } else if (STREAKS.indexOf(streak) !== -1) {
        Loopy.sound.play("cheer");
        celebrate(Loopy.t("inARow", { n: streak }), Loopy.t(newBest ? "bestYet" : "amazing"), false);
      } else if (newBest && streak > 5 && !cheeredBest[game]) {
        cheeredBest[game] = true;
        Loopy.sound.play("cheer");
        celebrate(Loopy.t("newBest", { n: streak }), Loopy.t("keepItGoing"), false);
      } else {
        Loopy.sound.play("right");
      }
    }
  };

  // Star counter chip: <span id="star-chip"></span> becomes a star with the total.
  function build() {
    var chip = document.getElementById("star-chip");
    if (chip) {
      chip.className = "star-chip";
      chip.setAttribute("aria-label", Loopy.t("starsEarned"));
      chip.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + STAR_PATH + '"/></svg><b data-loopy-stars></b>';
    }
    updateChips();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
  else build();
})();

// Settings button: shows or hides the panel with age, theme, sound and game levels.
(function () {
  var GEAR = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>';
  function build() {
    var btn = document.getElementById("settings-toggle"), panel = document.getElementById("settings-panel");
    if (!btn || !panel) return;
    btn.className = "settings-toggle";
    btn.innerHTML = GEAR + "<span>" + Loopy.t("settings") + "</span>";
    var sync = function () { btn.setAttribute("aria-expanded", String(!panel.hidden)); };
    btn.addEventListener("click", function () { panel.hidden = !panel.hidden; sync(); });
    sync();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
  else build();
})();
