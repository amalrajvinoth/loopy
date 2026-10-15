/* Loopy shared script: languages, color themes, age picker, sounds, stars and badges.
   Each part is its own block below. Load it in <head>. */

// Hide the page until the shared parts below are built, so nothing jumps when they fill in.
// The last block shows it again, even if a part fails.
document.documentElement.classList.add("loopy-building");

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
      backHome: "Back to all games", last5: "Last 5", last5Aria: "Last 5 answers: {n} right", last5None: "Last 5 answers: none yet",
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
      backHome: "Zurück zu allen Spielen", last5: "Letzte 5", last5Aria: "Letzte 5 Antworten: {n} richtig", last5None: "Letzte 5 Antworten: noch keine",
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
    box.textContent = "";
    [["age-down", "younger", "\u2212"], ["age-label"], ["age-up", "older", "+"]].forEach(function (d) {
      var el = document.createElement(d.length > 1 ? "button" : "span");
      el.id = d[0];
      if (d.length > 1) { el.type = "button"; el.setAttribute("aria-label", Loopy.t(d[1])); el.textContent = d[2]; }
      else el.setAttribute("aria-live", "polite");
      box.appendChild(el);
    });
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

// Read aloud: a speaker button on the question reads it out with the device's own voice,
// in English or German to match the page. Nothing is downloaded. If the browser has no voice,
// neither the button nor the setting shows.
// "Read aloud" in Settings shows the button and reads each new question by itself (only while
// the sound is on). It starts on for ages 5 to 7 and off from age 8. A changed choice is remembered.
// A game calls Loopy.speech.question({ host: card, text: function () { return "What is 4 plus 3?"; } })
// once, then Loopy.speech.read() each time a new question shows. The button sits in the host's top
// right corner; with inline: true it sits after the host's text instead (for a one-line prompt).
(function () {
  var Loopy = window.Loopy;
  var KEY = "loopy.readAloud", OLDEST_ON = 7;
  var can = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  var choice = null, opts = null, btn = null, toggle = null, tapped = false, talking = null;
  try { var v = localStorage.getItem(KEY); if (v === "on" || v === "off") choice = v; } catch (e) {}
  var SPEAKER = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

  Loopy.addStrings({
    en: { readAloud: "Read aloud", readOn: "On", readOff: "Off", readQuestion: "Read the question aloud", whatIs: "What is {q}?", orWord: "or" },
    de: { readAloud: "Vorlesen", readOn: "An", readOff: "Aus", readQuestion: "Frage vorlesen", whatIs: "Wie viel ist {q}?", orWord: "oder" }
  });

  function isOn() { return choice ? choice === "on" : Loopy.getAge() <= OLDEST_ON; }
  function voices() { try { return speechSynthesis.getVoices() || []; } catch (e) { return []; } }
  function hasVoice() { return can && voices().length > 0; }
  // An English or German voice for the page's language. Some phones write "de_DE" instead of "de-DE".
  function voiceFor(lang) {
    var list = voices().map(function (v) { return { v: v, l: String(v.lang).toLowerCase().replace("_", "-") }; });
    var mine = list.filter(function (x) { return x.l === lang || x.l.indexOf(lang + "-") === 0; });
    var pick = mine.filter(function (x) { return x.v.default; })[0] || mine.filter(function (x) { return x.v.localService; })[0] || mine[0];
    return pick ? pick.v : null;
  }
  function say(text) {
    if (!hasVoice() || !text) return;
    try {
      speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = Loopy.lang === "de" ? "de-DE" : "en-US";
      var v = voiceFor(Loopy.lang);
      if (v) u.voice = v;
      u.rate = 0.9;
      talking = u;
      if (btn) btn.classList.add("speaking");
      u.onend = u.onerror = function () { if (talking === u && btn) btn.classList.remove("speaking"); };
      speechSynthesis.speak(u);
    } catch (e) {}
  }
  function sync() {
    var show = hasVoice();
    if (btn) btn.hidden = !show || !isOn();
    if (toggle) {
      toggle.hidden = !show;
      toggle.setAttribute("aria-pressed", String(isOn()));
      toggle.lastChild.textContent = Loopy.t(isOn() ? "readOn" : "readOff");
    }
  }
  function build() {
    if (!opts || !can) return;
    // Browsers only let a page speak after a tap or key press.
    ["pointerdown", "keydown"].forEach(function (k) { document.addEventListener(k, function () { tapped = true; }, true); });
    btn = document.createElement("button");
    btn.type = "button";
    btn.className = "read-btn" + (opts.inline ? " inline" : "");
    btn.setAttribute("aria-label", Loopy.t("readQuestion"));
    btn.title = Loopy.t("readQuestion");
    btn.innerHTML = SPEAKER;
    btn.addEventListener("click", function () { say(opts.text()); });
    if (!opts.inline) opts.host.classList.add("read-host");
    opts.host.appendChild(btn);

    var sound = document.getElementById("sound-toggle");
    if (sound) {
      toggle = document.createElement("button");
      toggle.type = "button";
      toggle.id = "read-toggle";
      toggle.className = "read-toggle";
      toggle.setAttribute("aria-label", Loopy.t("readAloud"));
      toggle.innerHTML = SPEAKER;
      var label = document.createElement("span");
      label.textContent = Loopy.t("readAloud");
      toggle.appendChild(label);
      var state = document.createElement("b");
      state.setAttribute("aria-hidden", "true");
      toggle.appendChild(state);
      toggle.addEventListener("click", function () {
        choice = isOn() ? "off" : "on";
        try { localStorage.setItem(KEY, choice); } catch (e) {}
        sync();
        if (isOn()) say(opts.text()); else speechSynthesis.cancel();
      });
      sound.parentNode.insertBefore(toggle, sound.nextSibling);
    }
    // Some browsers load their voices a moment after the page.
    try { speechSynthesis.addEventListener("voiceschanged", sync); } catch (e) {}
    window.addEventListener("loopy:age", sync);
    window.addEventListener("pagehide", function () { try { speechSynthesis.cancel(); } catch (e) {} });
    sync();
  }

  Loopy.speech = {
    question: function (o) {
      opts = o;
      if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
      else build();
    },
    // Reads the new question by itself when Read aloud and the sound are on.
    read: function () {
      if (!opts || !btn) return;
      if (!isOn() || !Loopy.sound.isOn() || !tapped) { try { speechSynthesis.cancel(); } catch (e) {} return; }
      say(opts.text());
    }
  };
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
  var MAX_STARS = 1000000, GAMES = ["plus-minus", "times-share", "clock", "sound-spell", "daily-mix", "make-10", "bigger-smaller", "pizza-fractions", "coins-change", "word-match", "spell-it", "quick-facts", "where-is-it"];
  var num = function (n) { return typeof n === "number" && isFinite(n) && n >= 0 ? Math.min(Math.floor(n), MAX_STARS) : 0; };
  // Only known games and sane numbers are kept, whatever the stored text says.
  function clean(raw) {
    var out = { stars: 0, best: {} };
    if (!raw || typeof raw !== "object") return out;
    out.stars = num(raw.stars);
    var b = raw.best && typeof raw.best === "object" ? raw.best : {};
    GAMES.forEach(function (g) { if (b[g] !== undefined) out.best[g] = num(b[g]); });
    return out;
  }
  try { data = clean(JSON.parse(localStorage.getItem(KEY))); } catch (e) {}
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
        code = String(code).trim().replace(/^LOOPY-/i, "");
        if (code.length > 2000 || !/^[A-Za-z0-9+/=]+$/.test(code)) return false;
        var d = JSON.parse(atob(code));
        if (!d || typeof d.s !== "number") return false;
        var got = clean({ stars: d.s, best: d.b });
        data.stars = Math.max(data.stars, got.stars);
        GAMES.forEach(function (g) { if (got.best[g]) data.best[g] = Math.max(data.best[g] || 0, got.best[g]); });
        save(); updateChips();
        return true;
      } catch (e) { return false; }
    },
    badgeFor: badgeFor, nextBadge: nextBadge, confetti: confetti, celebrate: celebrate,
    // Call after a wrong answer, with the game's name.
    // detail: optional { q: "52 − 17", a: "35", y: "45", k: "sub-rg" } for the grown-ups' progress page (see Loopy.log).
    wrong: function (game, detail) {
      if (Loopy.recent) Loopy.recent.add(game, false);
      if (Loopy.log) Loopy.log.add(game, false, detail);
      Loopy.sound.play("wrong");
    },
    // Call after each right answer with the current streak.
    // harder: optional { label, apply } offered after 10 in a row, e.g. { label: "Try quarter hours", apply: fn }.
    correct: function (game, streak, harder) {
      if (Loopy.recent) Loopy.recent.add(game, true);
      if (Loopy.log) Loopy.log.add(game, true);
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

// Loopy day streak: finishing Today's 10 on days in a row. Badges at 3, 7 and 30 days.
// Kept in this browser's localStorage as { last: "2026-10-15", streak: 3, best: 5 }.
(function () {
  var KEY = "loopy.daily", MAX = 100000;
  var DAY_BADGES = [{ days: 3, key: "d3", color: "--c2" }, { days: 7, key: "d7", color: "--c4" }, { days: 30, key: "d30", color: "--c3" }];
  var Loopy = window.Loopy = window.Loopy || {};
  Loopy.addStrings({
    en: { d3: "On a Roll", d7: "Week Hero", d30: "Month Master", dayStreakBadge: "{n} days in a row! You play every day." },
    de: { d3: "Gut dabei", d7: "Wochen-Held", d30: "Monats-Meister", dayStreakBadge: "{n} Tage hintereinander! Du spielst jeden Tag." }
  });
  DAY_BADGES.forEach(function (b) { Object.defineProperty(b, "name", { get: function () { return Loopy.t(b.key); } }); });

  var pad = function (n) { return (n < 10 ? "0" : "") + n; };
  function dayKey(offset) {
    var d = new Date();
    d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + (offset || 0));
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }
  var whole = function (n) { return typeof n === "number" && isFinite(n) && n >= 0 ? Math.min(Math.floor(n), MAX) : 0; };
  // Only a real date and sane numbers are kept, whatever the stored text says.
  function clean(raw) {
    var out = { last: "", streak: 0, best: 0 };
    if (!raw || typeof raw !== "object") return out;
    if (typeof raw.last === "string" && /^\d{4}-\d{2}-\d{2}$/.test(raw.last)) out.last = raw.last;
    out.streak = out.last ? whole(raw.streak) : 0;
    out.best = Math.max(whole(raw.best), out.streak);
    return out;
  }
  var data = clean(null);
  try { data = clean(JSON.parse(localStorage.getItem(KEY))); } catch (e) {}

  // A day as "2026-10-15" in local time. offset: days from today, e.g. -1 for yesterday.
  Loopy.dayKey = dayKey;
  Loopy.daily = {
    BADGES: DAY_BADGES,
    // streak: days in a row that are still alive (finished today or yesterday). doneToday: today's 10 is finished.
    get: function () {
      var alive = data.last === dayKey(0) || data.last === dayKey(-1);
      return { streak: alive ? data.streak : 0, best: data.best, doneToday: data.last === dayKey(0) };
    },
    // Call when Today's 10 is finished. Returns the streak and a new day badge, if one was just earned.
    finish: function () {
      var today = dayKey(0), before = data.best;
      if (data.last !== today) {
        data.streak = data.last === dayKey(-1) ? data.streak + 1 : 1;
        data.last = today;
        data.best = Math.max(data.best, data.streak);
        try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {}
      }
      var badge = null;
      DAY_BADGES.forEach(function (b) { if (before < b.days && data.best >= b.days) badge = b; });
      return { streak: data.streak, badge: badge };
    }
  };
})();

// Answer log for the grown-ups' progress page: right and wrong answers per game per day, and each
// wrong answer with the right one, for the last 30 days. It is not in the stars code and never sent anywhere.
// Kept in this browser's localStorage as
// { days: { "2026-10-15": { "plus-minus": [right, wrong] } }, wrong: [{ d: day, g: game, q, a: right answer, y: their answer, k: kind }] }.
(function () {
  var KEY = "loopy.log", DAYS = 30, MAX_WRONG = 300, MAX_N = 100000, LEN = 40;
  var GAMES = ["plus-minus", "times-share", "clock", "sound-spell", "daily-mix", "make-10", "bigger-smaller", "pizza-fractions", "coins-change", "word-match", "spell-it", "quick-facts", "where-is-it"];
  // What kind of problem it was, so the page can say what to practise. See Loopy.log.kind.
  var KIND = /^(?:(?:add|sub)(?:-rg)?|(?:mul|div)-(?:big|\d{1,2})|cl-(?:0|30|15|5|1)|ss-(?:start|end)|mk-(?:10|20|100)|bs-(?:cmp|ord|rnd|dec|neg)|pz-(?:name|cmp|add)|cc-(?:small|count|ch10|ch)|wm-(?:animals|food|home|school)|si-[3-6]|qf-(?:space|animals|body)|wi-(?:cont|eu|euc|wd|wdc))$/;
  var DAY = /^\d{4}-\d{2}-\d{2}$/;
  var Loopy = window.Loopy = window.Loopy || {};
  var whole = function (n) { return typeof n === "number" && isFinite(n) && n >= 0 ? Math.min(Math.floor(n), MAX_N) : 0; };
  var text = function (s) { return typeof s === "string" ? s.slice(0, LEN) : ""; };
  // Only known games, real dates in the last 30 days, sane numbers and short texts are kept, whatever the stored text says.
  function clean(raw) {
    var out = { days: {}, wrong: [] };
    if (!raw || typeof raw !== "object") return out;
    var oldest = Loopy.dayKey(1 - DAYS);
    var days = raw.days && typeof raw.days === "object" ? raw.days : {};
    Object.keys(days).forEach(function (d) {
      var row = days[d], keep = {}, any = false;
      if (!DAY.test(d) || d < oldest || !row || typeof row !== "object") return;
      GAMES.forEach(function (g) {
        var v = row[g];
        if (Array.isArray(v) && v.length === 2) { keep[g] = [whole(v[0]), whole(v[1])]; any = true; }
      });
      if (any) out.days[d] = keep;
    });
    if (Array.isArray(raw.wrong)) raw.wrong.slice(-MAX_WRONG).forEach(function (w) {
      if (!w || typeof w !== "object" || typeof w.d !== "string" || !DAY.test(w.d) || w.d < oldest) return;
      if (GAMES.indexOf(w.g) === -1 || !text(w.q) || !text(w.a) || !KIND.test(w.k)) return;
      out.wrong.push({ d: w.d, g: w.g, q: text(w.q), a: text(w.a), y: text(w.y), k: w.k });
    });
    return out;
  }
  var data = clean(null);
  try { data = clean(JSON.parse(localStorage.getItem(KEY))); } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {} }

  Loopy.log = {
    get: function () { return clean(data); },
    // rewards.correct / wrong call this. detail: { q, a, y, k } for a wrong answer, see rewards.wrong.
    add: function (game, ok, detail) {
      if (GAMES.indexOf(game) === -1) return;
      var today = Loopy.dayKey(0), row = data.days[today] = data.days[today] || {};
      var c = row[game] = row[game] || [0, 0];
      c[ok ? 0 : 1] = whole(c[ok ? 0 : 1] + 1);
      if (!ok && detail && typeof detail === "object") {
        data.wrong.push({ d: today, g: game, q: detail.q, a: detail.a, y: detail.y, k: detail.k });
      }
      data = clean(data);
      save();
    },
    clear: function () { data = clean(null); try { localStorage.removeItem(KEY); } catch (e) {} },
    // The kind of a sum: "add" or "sub" with "-rg" when it needs carrying or regrouping,
    // "mul-7" or "div-7" for a times table fact, "mul-big" or "div-big" for bigger numbers.
    kind: function (op, a, b) {
      if (op === "add" || op === "sub") {
        var rg = false;
        for (var p = 10; p <= 1e6; p *= 10) if (op === "add" ? a % p + b % p >= p : a % p < b % p) rg = true;
        return op + (rg ? "-rg" : "");
      }
      if (op === "mul") return a <= 12 && b <= 12 ? "mul-" + (a === 1 || a === 10 ? b : b === 1 || b === 10 ? a : Math.max(a, b)) : "mul-big";
      return b <= 12 && a / b <= 12 ? "div-" + b : "div-big";
    },
    // The kind of a clock time: o'clock, half past, quarter past or to, five-minute steps, single minutes.
    timeKind: function (m) { return "cl-" + (m === 0 ? 0 : m === 30 ? 30 : m % 15 === 0 ? 15 : m % 5 === 0 ? 5 : 1); }
  };
})();

// Last 5 answers in a game: <div id="last5" data-game="plus-minus"></div> becomes five dots,
// green for right and red for wrong, newest on the right. rewards.correct / wrong fill it in.
// Kept in this browser's localStorage as { "plus-minus": [1, 1, 0, 1, 1], ... }.
(function () {
  var KEY = "loopy.recent", N = 5, GAMES = ["plus-minus", "times-share", "clock", "sound-spell", "daily-mix", "make-10", "bigger-smaller", "pizza-fractions", "coins-change", "word-match", "spell-it", "quick-facts", "where-is-it"];
  var TICK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 12.5l4 4 8-9"/></svg>';
  var CROSS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17"/></svg>';
  var Loopy = window.Loopy = window.Loopy || {};
  // Only known games and lists of up to five 0s and 1s are kept, whatever the stored text says.
  function clean(raw) {
    var out = {};
    if (!raw || typeof raw !== "object") return out;
    GAMES.forEach(function (g) {
      if (Array.isArray(raw[g])) out[g] = raw[g].filter(function (v) { return v === 0 || v === 1; }).slice(-N);
    });
    return out;
  }
  var data = {};
  try { data = clean(JSON.parse(localStorage.getItem(KEY))); } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {} }

  function render() {
    var box = document.getElementById("last5");
    if (!box) return;
    var list = data[box.getAttribute("data-game")] || [], html = "<span>" + Loopy.t("last5") + "</span>", right = 0;
    for (var i = 0; i < N; i++) {
      var v = list[i - (N - list.length)];
      if (v === 1) right++;
      html += v === undefined ? "<i></i>" : '<i class="' + (v ? "good" : "bad") + (i === N - 1 ? " new" : "") + '">' + (v ? TICK : CROSS) + "</i>";
    }
    box.innerHTML = html;
    box.setAttribute("aria-label", list.length ? Loopy.t("last5Aria", { n: right }) : Loopy.t("last5None"));
  }

  Loopy.recent = {
    get: function (game) { return (data[game] || []).slice(); },
    add: function (game, ok) {
      if (GAMES.indexOf(game) === -1) return;
      data[game] = (data[game] || []).concat(ok ? 1 : 0).slice(-N);
      save(); render();
    },
    // Call from the game's "Reset score" button.
    clear: function (game) { delete data[game]; save(); render(); }
  };

  function build() {
    var box = document.getElementById("last5");
    if (box) { box.className = "pill last5"; box.setAttribute("role", "img"); }
    render();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
  else build();
})();

// Back button: <a class="home-link" href="../../">&larr; loopy</a> becomes a big button
// with a back arrow and the loopy bunny logo.
(function () {
  var ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';
  var LOGO = '<svg class="back-logo" viewBox="-30 -1180 2773 1460" aria-hidden="true"><g><path fill="currentColor" transform="translate(0 0) scale(1 -1)" d="M239 -11Q143 -11 97.5 40.5Q52 92 52 196V624Q52 668 75.0 691.0Q98 714 140 714Q183 714 206.5 691.0Q230 668 230 624V202Q230 165 244.5 148.0Q259 131 282 131Q289 131 296.5 132.5Q304 134 313 135Q330 135 338.5 122.0Q347 109 347 69Q347 34 333.0 16.5Q319 -1 290 -6Q282 -7 267.0 -9.0Q252 -11 239 -11Z"/></g><g><ellipse cx="695" cy="-766" rx="110" ry="300" fill="#fff" stroke="currentColor" stroke-width="35" transform="rotate(-12 695 -512)"/><ellipse cx="695" cy="-766" rx="52" ry="220" fill="#3ddc84" transform="rotate(-12 695 -512)"/><ellipse cx="1204" cy="-766" rx="110" ry="300" fill="#fff" stroke="currentColor" stroke-width="35" transform="rotate(12 1204 -512)"/><ellipse cx="1204" cy="-766" rx="52" ry="220" fill="#3ddc84" transform="rotate(12 1204 -512)"/><clipPath id="lbk0"><path d="M460,-97 A240,240 0 1 1 837,-97 Q648,-193 460,-97Z"/></clipPath><path d="M460,-97 A240,240 0 1 1 837,-97 Q648,-193 460,-97Z" fill="#fff"/><g clip-path="url(#lbk0)"><circle cx="648" cy="-275" r="106" fill="#1d2a3f"/><circle cx="685" cy="-313" r="34" fill="#fff"/></g><path d="M460,-97 A240,240 0 1 1 837,-97 Q648,-193 460,-97Z" fill="none" stroke="currentColor" stroke-width="46" stroke-linejoin="round"/><clipPath id="lbk1"><path d="M1062,-97 A240,240 0 1 1 1439,-97 Q1250,-193 1062,-97Z"/></clipPath><path d="M1062,-97 A240,240 0 1 1 1439,-97 Q1250,-193 1062,-97Z" fill="#fff"/><g clip-path="url(#lbk1)"><circle cx="1250" cy="-275" r="106" fill="#1d2a3f"/><circle cx="1287" cy="-313" r="34" fill="#fff"/></g><path d="M1062,-97 A240,240 0 1 1 1439,-97 Q1250,-193 1062,-97Z" fill="none" stroke="currentColor" stroke-width="46" stroke-linejoin="round"/><path d="M811,-45 Q880,41 950,-11 Q1019,41 1088,-45" fill="none" stroke="currentColor" stroke-width="32" stroke-linecap="round" stroke-linejoin="round"/><rect x="876" y="-6" width="72" height="116" rx="21" fill="#fff" stroke="currentColor" stroke-width="21"/><rect x="952" y="-6" width="72" height="116" rx="21" fill="#fff" stroke="currentColor" stroke-width="21"/></g><g><path fill="currentColor" transform="translate(1552 0) scale(1 -1)" d="M140 -189Q98 -189 75.0 -166.0Q52 -143 52 -99V412Q52 455 74.5 478.0Q97 501 139 501Q182 501 204.5 478.0Q227 455 227 412V354L216 403Q230 448 274.5 475.5Q319 503 376 503Q440 503 488.5 472.0Q537 441 564.0 384.0Q591 327 591 246Q591 167 564.0 109.0Q537 51 488.5 20.0Q440 -11 376 -11Q321 -11 277.0 15.0Q233 41 218 83H230V-99Q230 -143 206.5 -166.0Q183 -189 140 -189ZM320 120Q347 120 367.5 133.5Q388 147 400.0 174.5Q412 202 412 246Q412 313 386.0 342.5Q360 372 320 372Q293 372 272.0 359.0Q251 346 239.0 318.5Q227 291 227 246Q227 180 253.0 150.0Q279 120 320 120Z"/></g><g><path fill="currentColor" transform="translate(2172 0) scale(1 -1)" d="M195 -189Q164 -189 145.0 -173.0Q126 -157 121.5 -131.0Q117 -105 130 -76L197 69V-3L26 388Q13 418 17.5 444.0Q22 470 44.0 485.5Q66 501 104 501Q136 501 155.5 486.5Q175 472 191 430L291 170H257L363 431Q379 472 399.5 486.5Q420 501 455 501Q485 501 503.0 485.5Q521 470 525.0 444.0Q529 418 516 388L289 -122Q271 -162 249.5 -175.5Q228 -189 195 -189Z"/></g></svg>';
  function build() {
    document.querySelectorAll("a.home-link").forEach(function (a) {
      a.classList.add("loopy-back");
      a.setAttribute("aria-label", Loopy.t("backHome"));
      a.innerHTML = '<span class="back-arrow">' + ARROW + "</span>" + LOGO;
    });
  }
  // The same logo for other places, e.g. the printed worksheet. cls is its class; ids is a
  // prefix for the clip paths inside, so two copies on one page do not share ids.
  Loopy.logo = function (cls, ids) {
    return LOGO.replace('class="back-logo"', 'class="' + cls + '"').replace(/lbk/g, ids);
  };
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

// Printable worksheet: a "Print worksheet" button in the game's Settings. It fills a sheet with
// 20 problems made with the game's current age and settings, then opens the browser's print
// dialog (which can also save a PDF). Page 1 has the problems with room to write, page 2 the answers.
// The sheet is hidden on screen; when printing, only the sheet shows (see loopy.css).
// A game calls Loopy.worksheet({ ... }) once:
//   title()   the heading, usually the game's name
//   level()   one line about the level, e.g. "Age 8 · Problems: Both"
//   how()     one line telling the child what to do
//   layout    "vert", "line", "clock" or "word": how the 20 problems are laid out
//   make(n)   n problems, from the game's own problem maker
//   cell(p)   a node that shows problem p with room to write
//   answer(p) the answer for the key, as text, e.g. "47 + 25 = 72"
(function () {
  var N = 20, LAYOUTS = ["vert", "line", "clock", "word"];
  var PRINTER = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M6 14h12v7H6z"/></svg>';
  Loopy.addStrings({
    en: { printSheet: "Print worksheet", printNote: "20 problems at this level. Answers on page 2.",
      sheetName: "Name", sheetDate: "Date", sheetAnswers: "Answers" },
    de: { printSheet: "Arbeitsblatt drucken", printNote: "20 Aufgaben auf dieser Stufe. Lösungen auf Seite 2.",
      sheetName: "Name", sheetDate: "Datum", sheetAnswers: "Lösungen" }
  });
  var opts = null, sheet = null, filled = false;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  }
  function field(label, cls) {
    var f = el("span", "sheet-field " + cls);
    f.appendChild(el("b", "", label));
    f.appendChild(el("i"));
    return f;
  }
  function head(key) {
    var h = el("header", "sheet-head");
    var top = el("div", "sheet-top");
    top.appendChild(el("h1", "sheet-title", key ? Loopy.t("sheetAnswers") + ": " + opts.title() : opts.title()));
    var brand = el("span", "sheet-brand");
    brand.innerHTML = Loopy.logo("sheet-logo", key ? "lwk" : "lws");
    top.appendChild(brand);
    h.appendChild(top);
    h.appendChild(el("p", "sheet-level", opts.level()));
    if (!key) {
      var fields = el("div", "sheet-fields");
      fields.appendChild(field(Loopy.t("sheetName"), "wide"));
      fields.appendChild(field(Loopy.t("sheetDate"), ""));
      var score = field(Loopy.t("score"), "score");
      score.appendChild(el("b", "", "/ " + N));
      fields.appendChild(score);
      h.appendChild(fields);
      h.appendChild(el("p", "sheet-how", opts.how()));
    }
    return h;
  }
  function fill() {
    var items = opts.make(N).slice(0, N);
    var layout = LAYOUTS.indexOf(opts.layout) === -1 ? "line" : opts.layout;
    var work = el("div", "sheet-page");
    work.appendChild(head(false));
    var grid = el("ol", "sheet-grid sheet-" + layout);
    items.forEach(function (p, i) {
      var li = el("li");
      li.appendChild(el("span", "sheet-n", String(i + 1)));
      li.appendChild(opts.cell(p));
      grid.appendChild(li);
    });
    work.appendChild(grid);
    var key = el("div", "sheet-page sheet-answers");
    key.appendChild(head(true));
    var list = el("ol", "sheet-key");
    items.forEach(function (p, i) {
      var li = el("li");
      li.appendChild(el("span", "sheet-n", String(i + 1)));
      li.appendChild(el("span", "", opts.answer(p)));
      list.appendChild(li);
    });
    key.appendChild(list);
    sheet.textContent = "";
    sheet.appendChild(work);
    sheet.appendChild(key);
    filled = true;
  }

  Loopy.worksheet = function (o) {
    opts = o;
    var build = function () {
      document.documentElement.classList.add("loopy-print");
      sheet = el("section", "loopy-sheet");
      sheet.setAttribute("aria-hidden", "true");
      document.body.appendChild(sheet);
      var panel = document.getElementById("settings-panel");
      if (!panel) return;
      var row = el("div", "print-row");
      var btn = el("button", "print-btn");
      btn.type = "button";
      btn.id = "print-sheet";
      btn.innerHTML = PRINTER;
      btn.appendChild(el("span", "", Loopy.t("printSheet")));
      btn.addEventListener("click", function () { fill(); window.print(); });
      row.appendChild(btn);
      row.appendChild(el("p", "", Loopy.t("printNote")));
      panel.insertBefore(row, panel.querySelector(".panel-foot"));
    };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
    else build();
  };
  // Printing from the browser's own menu also prints a fresh worksheet.
  window.addEventListener("beforeprint", function () { if (opts && sheet && !filled) fill(); });
  window.addEventListener("afterprint", function () { filled = false; });
})();

// Show the page. This listener is added last, so it runs after every part above is built.
(function () {
  var show = function () { document.documentElement.classList.remove("loopy-building"); };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", show);
  else show();
})();
