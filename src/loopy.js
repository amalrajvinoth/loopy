/* Loopy shared script: languages, color themes, easier-to-read font, age picker, sounds, stars and badges.
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
      theme: "Color theme", black: "Black", sunny: "Sunny", ocean: "Ocean", candy: "Candy", forest: "Forest", contrast: "High contrast",
      easyRead: "Easier to read", easyOn: "On", easyOff: "Off",
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
      erase: "Erase", eraseAria: "Erase last digit", check: "Check", next: "Next", yourAnswer: "Your answer", both: "Both",
      skip: "Skip", setGame: "This game", setShared: "Age, look and sound",
      hintChoices: "Tap the right answer!", hintPad: "Tap the numbers, then Check!",
      hintLetters: "Tap the letters to spell the word!", hintMap: "Tap the right place on the map!"
    },
    de: {
      theme: "Farbthema", black: "Schwarz", sunny: "Sonnig", ocean: "Ozean", candy: "Bonbon", forest: "Wald", contrast: "Hoher Kontrast",
      easyRead: "Leichter lesen", easyOn: "An", easyOff: "Aus",
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
      erase: "Löschen", eraseAria: "Letzte Ziffer löschen", check: "Prüfen", next: "Weiter", yourAnswer: "Deine Antwort", both: "Beides",
      skip: "Überspringen", setGame: "Dieses Spiel", setShared: "Alter, Aussehen und Ton",
      hintChoices: "Tippe auf die richtige Antwort!", hintPad: "Tippe die Zahlen, dann Prüfen!",
      hintLetters: "Tippe die Buchstaben für das Wort!", hintMap: "Tippe die richtige Stelle auf der Karte an!"
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

// Children: each child who plays on this device has their own age, stars, badges, streaks,
// progress and game settings. Theme, sound and language stay the same for everyone on the device.
// The list is kept in this browser's localStorage "loopy.kids" as
// { on: 1, next: 3, list: [{ id: 1, name: "Dio", pic: "🐰" }, { id: 2, name: "Dia", pic: "🦄" }] }.
// Each child's own things are kept under "loopy.kid.<id>." + key. Use Loopy.store.get / set / remove
// instead of localStorage for anything that belongs to one child (scores, levels, settings in a game).
// <div id="kid-picker"></div> becomes the "Who is playing?" row; add data-switch-only to hide add and edit.
(function () {
  var KEY = "loopy.kids", MAX = 6, LEN = 12, BIG_ID = 1000000;
  // A new device starts with two children, Dio and Dia. Rename or remove them with ✎.
  var START = [{ id: 1, name: "Dio", pic: "🐰" }, { id: 2, name: "Dia", pic: "🦄" }];
  var PICS = ["🐰", "🦊", "🐼", "🐯", "🐸", "🦄", "🐙", "🦖", "🐝", "🐧", "🦁", "🐨"];
  // Keys saved before there were children. On the first visit they move to child 1, so no stars are lost.
  var OLD = /^(?:loopy\.(?:rewards|daily|log|recent|ageOffset|readAloud)$|(?:bs|cc|clockquiz|mk|pm100|pz|qf|si|ss|ts|wi|wm)\.)/;
  var Loopy = window.Loopy = window.Loopy || {};

  Loopy.addStrings({
    en: {
      kidsGroup: "Who is playing?", kidN: "Player {n}", kidAdd: "Add a child", kidEditAria: "Change name or picture",
      kidNew: "New child", kidEdit: "Change {name}", kidName: "Name", kidNameHint: "Name or nickname", kidPic: "Picture",
      kidSave: "Save", kidCancel: "Cancel", kidRemove: "Remove",
      kidSure: "Tap again to remove {name} and all their stars", kidStars: "{name}'s stars"
    },
    de: {
      kidsGroup: "Wer spielt?", kidN: "Kind {n}", kidAdd: "Kind hinzufügen", kidEditAria: "Name oder Bild ändern",
      kidNew: "Neues Kind", kidEdit: "{name} ändern", kidName: "Name", kidNameHint: "Name oder Spitzname", kidPic: "Bild",
      kidSave: "Speichern", kidCancel: "Abbrechen", kidRemove: "Entfernen",
      kidSure: "Nochmal tippen: {name} mit allen Sternen entfernen", kidStars: "Sterne von {name}"
    }
  });

  // A name is plain text: no control characters, at most 12 letters (an emoji counts as one).
  function cleanName(s) {
    if (typeof s !== "string") return "";
    return Array.from(s.replace(/[\u0000-\u001f\u007f-\u009f<>]/g, "").trim()).slice(0, LEN).join("").trim();
  }
  var whole = function (n) { return typeof n === "number" && isFinite(n) && n === Math.floor(n) && n >= 1 && n <= BIG_ID; };
  // Only real ids, known pictures and short names are kept, whatever the stored text says.
  function clean(raw) {
    var out = { on: 1, next: 2, list: [] };
    if (!raw || typeof raw !== "object") raw = {};
    if (Array.isArray(raw.list)) raw.list.forEach(function (k) {
      if (out.list.length >= MAX || !k || typeof k !== "object" || !whole(k.id)) return;
      if (out.list.some(function (x) { return x.id === k.id; })) return;
      out.list.push({ id: k.id, name: cleanName(k.name), pic: PICS.indexOf(k.pic) !== -1 ? k.pic : PICS[0] });
    });
    if (!out.list.length) out.list = START.map(function (k) { return { id: k.id, name: k.name, pic: k.pic }; });
    var top = Math.max.apply(null, out.list.map(function (k) { return k.id; }));
    out.next = Math.min(Math.max(whole(raw.next) ? raw.next : 0, top + 1), BIG_ID);
    out.on = out.list.some(function (k) { return k.id === raw.on; }) ? raw.on : out.list[0].id;
    return out;
  }
  function pre(id) { return "loopy.kid." + id + "."; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {} }

  var data = clean(null), stored = null;
  try { stored = localStorage.getItem(KEY); data = clean(JSON.parse(stored)); } catch (e) {}
  if (stored === null) {
    // First visit since children came in: move what was saved before to child 1 (Dio).
    try {
      var keys = [];
      for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (OLD.test(k)) keys.push(k); }
      keys.forEach(function (k) {
        if (localStorage.getItem(pre(1) + k) === null) localStorage.setItem(pre(1) + k, localStorage.getItem(k));
        localStorage.removeItem(k);
      });
      save();
    } catch (e) {}
  }

  Loopy.store = {
    get: function (k) { try { return localStorage.getItem(pre(data.on) + k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(pre(data.on) + k, String(v)); } catch (e) {} },
    remove: function (k) { try { localStorage.removeItem(pre(data.on) + k); } catch (e) {} }
  };

  function find(id) { return data.list.filter(function (k) { return k.id === id; })[0]; }
  function copy(k) { return { id: k.id, name: k.name, pic: k.pic }; }
  // Switching child reloads the page, so every part reads the new child's things from the start.
  function use(id) { if (!find(id)) return; data.on = id; save(); location.reload(); }

  Loopy.kids = {
    PICS: PICS, MAX: MAX, cleanName: cleanName,
    list: function () { return data.list.map(copy); },
    current: function () { return copy(find(data.on)); },
    // What to call a child: their name, or "Player 2" when they have none.
    label: function (k) { return k.name || Loopy.t("kidN", { n: data.list.map(function (x) { return x.id; }).indexOf(k.id) + 1 }); },
    use: use,
    // The localStorage key that holds key for child id (used by Loopy.backup).
    key: function (id, k) { return pre(id) + k; },
    // Adds a child without switching to them, and returns their id, or null when there are 6 already.
    create: function (name, pic) {
      if (data.list.length >= MAX) return null;
      var id = data.next++;
      data.list.push({ id: id, name: cleanName(name), pic: PICS.indexOf(pic) !== -1 ? pic : PICS[0] });
      save();
      return id;
    },
    // age: the new child's age; saved as years from the default age, like the age picker does.
    add: function (name, pic, age) {
      if (data.list.length >= MAX) return;
      var id = data.next++;
      data.list.push({ id: id, name: cleanName(name), pic: PICS.indexOf(pic) !== -1 ? pic : PICS[0] });
      if (typeof age === "number" && Loopy.defaultAge) {
        try { localStorage.setItem(pre(id) + "loopy.ageOffset", String(Math.round(age) - Loopy.defaultAge())); } catch (e) {}
      }
      use(id);
    },
    edit: function (id, name, pic) {
      var k = find(id);
      if (!k) return;
      k.name = cleanName(name);
      if (PICS.indexOf(pic) !== -1) k.pic = pic;
      save();
    },
    // Removes the child and everything saved for them. The last child can't be removed.
    remove: function (id) {
      if (data.list.length < 2 || !find(id)) return;
      try {
        var gone = [];
        for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (k && k.indexOf(pre(id)) === 0) gone.push(k); }
        gone.forEach(function (k) { localStorage.removeItem(k); });
      } catch (e) {}
      data.list = data.list.filter(function (k) { return k.id !== id; });
      if (data.on === id) data.on = data.list[0].id;
      save();
      location.reload();
    }
  };

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  }
  function round(cls, label, text) {
    var b = el("button", "kid-round " + cls, text);
    b.type = "button";
    b.setAttribute("aria-label", label);
    b.title = label;
    return b;
  }

  // The add and change box: a name, a picture, and the age for a new child.
  function open(kid) {
    var dlg = el("dialog", "kid-dialog"), pic = kid ? kid.pic : PICS[data.list.length % PICS.length];
    var age = Loopy.defaultAge ? Loopy.defaultAge() : 8, armed = null;
    dlg.setAttribute("aria-labelledby", "kid-dialog-title");
    var form = el("form");
    form.method = "dialog";
    var h = el("h2", "", kid ? Loopy.t("kidEdit", { name: Loopy.kids.label(kid) }) : Loopy.t("kidNew"));
    h.id = "kid-dialog-title";
    form.appendChild(h);

    var label = el("label", "kid-field");
    label.appendChild(el("span", "", Loopy.t("kidName")));
    var input = el("input");
    input.type = "text"; input.maxLength = 24; input.autocomplete = "off";
    input.placeholder = Loopy.t("kidNameHint");
    input.value = kid ? kid.name : "";
    label.appendChild(input);
    form.appendChild(label);

    var pics = el("div", "kid-pics");
    pics.setAttribute("role", "group");
    pics.setAttribute("aria-label", Loopy.t("kidPic"));
    form.appendChild(el("span", "kid-label", Loopy.t("kidPic")));
    PICS.forEach(function (p) {
      var b = el("button", "", p);
      b.type = "button";
      b.setAttribute("aria-pressed", String(p === pic));
      b.addEventListener("click", function () {
        pic = p;
        pics.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      });
      pics.appendChild(b);
    });
    form.appendChild(pics);

    if (!kid) {
      // The same − Age 8 + stepper as the age picker.
      var row = el("div", "age-picker");
      row.setAttribute("role", "group");
      row.setAttribute("aria-label", Loopy.t("ageGroup"));
      var down = round("", Loopy.t("younger"), "−"), up = round("", Loopy.t("older"), "+"), show = el("span");
      down.className = up.className = "";
      show.setAttribute("aria-live", "polite");
      var sync = function () { show.textContent = Loopy.t("ageLabel", { n: age }); down.disabled = age <= 5; up.disabled = age >= 16; };
      down.addEventListener("click", function () { age = Math.max(5, age - 1); sync(); });
      up.addEventListener("click", function () { age = Math.min(16, age + 1); sync(); });
      row.appendChild(down); row.appendChild(show); row.appendChild(up);
      sync();
      form.appendChild(el("span", "kid-label", Loopy.t("ageGroup")));
      form.appendChild(row);
    }

    var foot = el("div", "kid-foot");
    var ok = el("button", "kid-btn", Loopy.t("kidSave"));
    ok.type = "submit";
    var no = el("button", "kid-btn quiet", Loopy.t("kidCancel"));
    no.type = "button";
    no.addEventListener("click", function () { dlg.close(); });
    if (kid && data.list.length > 1) {
      var rm = el("button", "kid-btn danger", Loopy.t("kidRemove"));
      rm.type = "button";
      // Two taps, so a child's stars are not lost by mistake.
      rm.addEventListener("click", function () {
        if (armed) { clearTimeout(armed); Loopy.kids.remove(kid.id); return; }
        rm.textContent = Loopy.t("kidSure", { name: Loopy.kids.label(kid) });
        rm.classList.add("sure");
        armed = setTimeout(function () { armed = null; rm.textContent = Loopy.t("kidRemove"); rm.classList.remove("sure"); }, 4000);
      });
      foot.appendChild(rm);
    }
    foot.appendChild(no);
    foot.appendChild(ok);
    form.appendChild(foot);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (kid) { Loopy.kids.edit(kid.id, input.value, pic); dlg.close(); location.reload(); }
      else Loopy.kids.add(input.value, pic, age);
    });
    dlg.appendChild(form);
    dlg.addEventListener("close", function () { dlg.remove(); });
    document.body.appendChild(dlg);
    dlg.showModal();
    if (!kid) input.focus();
  }

  function build() {
    var box = document.getElementById("kid-picker");
    if (!box) return;
    var only = box.hasAttribute("data-switch-only");
    if (only && data.list.length < 2) { box.hidden = true; return; }
    box.className = "kid-picker";
    box.setAttribute("role", "group");
    box.setAttribute("aria-label", Loopy.t("kidsGroup"));
    box.textContent = "";
    box.appendChild(el("span", "kid-ask", Loopy.t("kidsGroup")));
    data.list.forEach(function (k) {
      var b = el("button", "kid");
      b.type = "button";
      b.setAttribute("aria-pressed", String(k.id === data.on));
      b.appendChild(el("span", "kid-pic", k.pic)).setAttribute("aria-hidden", "true");
      b.appendChild(el("span", "", Loopy.kids.label(k)));
      b.addEventListener("click", function () { if (k.id !== data.on) use(k.id); });
      box.appendChild(b);
    });
    if (only || typeof HTMLDialogElement !== "function") return;
    var edit = round("edit", Loopy.t("kidEditAria"), "✎");
    edit.addEventListener("click", function () { open(find(data.on)); });
    box.appendChild(edit);
    if (data.list.length < MAX) {
      var add = round("add", Loopy.t("kidAdd"), "+");
      add.addEventListener("click", function () { open(null); });
      box.appendChild(add);
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
  else build();
})();

// Loopy themes: black is the default, the choice is remembered on this device.
(function () {
  var THEMES = [
    { id: "black",  name: "black",  bg: "#0a0a0c", dot: "#5b9dff" },
    { id: "sunny",  name: "sunny",  bg: "#fff8ec", dot: "#d4561f" },
    { id: "ocean",  name: "ocean",  bg: "#06263a", dot: "#4cc9f0" },
    { id: "candy",  name: "candy",  bg: "#fff0f6", dot: "#c2257a" },
    { id: "forest", name: "forest", bg: "#0f1f17", dot: "#8ce99a" },
    { id: "contrast", name: "contrast", bg: "#000000", dot: "#ffffff" }
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

// "Easier to read": one font with clear letter shapes (Atkinson Hyperlegible Next) for all text.
// An on/off pill after the color themes in Settings; the choice is remembered on this device.
// A page only loads the font file when it is on (see the end of loopy.css).
(function () {
  var KEY = "loopy.font";
  var on = false;
  try { on = localStorage.getItem(KEY) === "easy"; } catch (e) {}
  var root = document.documentElement;
  if (on) root.setAttribute("data-font", "easy");
  var ICON = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 19 8 5l5 14M4.8 14h6.4"/><circle cx="17.5" cy="15.5" r="3.5"/><path d="M21 12v7"/></svg>';
  function sync(b, state) {
    b.setAttribute("aria-pressed", String(on));
    state.textContent = Loopy.t(on ? "easyOn" : "easyOff");
  }
  function build() {
    var themes = document.getElementById("theme-picker");
    if (!themes || document.getElementById("font-toggle")) return;
    var b = document.createElement("button");
    b.type = "button";
    b.id = "font-toggle";
    b.className = "read-toggle";
    b.setAttribute("aria-label", Loopy.t("easyRead"));
    b.innerHTML = ICON;
    var label = document.createElement("span");
    label.textContent = Loopy.t("easyRead");
    b.appendChild(label);
    var state = document.createElement("b");
    state.setAttribute("aria-hidden", "true");
    b.appendChild(state);
    b.addEventListener("click", function () {
      on = !on;
      if (on) root.setAttribute("data-font", "easy"); else root.removeAttribute("data-font");
      try { localStorage.setItem(KEY, on ? "easy" : "normal"); } catch (e) {}
      sync(b, state);
    });
    themes.parentNode.insertBefore(b, themes.nextSibling);
    sync(b, state);
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
  offset = parseInt(window.Loopy.store.get(KEY), 10) || 0;
  var age = clamp(defaultAge() + offset);

  var Loopy = window.Loopy = window.Loopy || {};
  Loopy.defaultAge = defaultAge;
  Loopy.getAge = function () { return age; };
  Loopy.setAge = function (n) {
    n = clamp(n);
    if (n === age) return;
    age = n;
    Loopy.store.set(KEY, String(age - defaultAge()));
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
  var v = Loopy.store.get(KEY); if (v === "on" || v === "off") choice = v;
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
        Loopy.store.set(KEY, choice);
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
  try { data = clean(JSON.parse(window.Loopy.store.get(KEY))); } catch (e) {}
  function save() { window.Loopy.store.set(KEY, JSON.stringify(data)); }

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
      // The card takes focus; when it closes, focus goes back to where the child was.
      var back = document.activeElement;
      close = function () {
        el.classList.add("out"); setTimeout(function () { el.remove(); }, 250);
        if (back && back !== document.body && document.contains(back) && !back.disabled) back.focus({ preventScroll: true });
      };
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

  // Screen readers: after each answer, read the game's feedback line (or "Right!" / "Not quite.").
  // A hidden live region does this, so games do not need aria-live on their feedback, and the
  // tap hints that fill the line between problems are not read out every time.
  var said = null;
  function announce(right) {
    if (!said) {
      said = document.createElement("div");
      said.className = "loopy-sr";
      said.setAttribute("aria-live", "polite");
      document.body.appendChild(said);
    }
    setTimeout(function () {
      var fb = document.getElementById("feedback");
      if (fb && fb.getAttribute("aria-live")) return; // the page reads its own feedback
      var text = fb ? fb.textContent.trim() : "";
      said.textContent = text || Loopy.t(right ? "correct" : "notQuite");
    }, 80);
  }

  BADGES.forEach(function (b) { Object.defineProperty(b, "name", { get: function () { return Loopy.t(b.key); } }); });
  function badgeFor(stars) { var got = null; BADGES.forEach(function (b) { if (stars >= b.stars) got = b; }); return got; }
  function nextBadge(stars) { for (var i = 0; i < BADGES.length; i++) if (stars < BADGES[i].stars) return BADGES[i]; return null; }

  function updateChips() {
    document.querySelectorAll("[data-loopy-stars]").forEach(function (n) { n.textContent = data.stars; });
  }

  // "+1" star: flies from where the child tapped (or the feedback line) to the star counter,
  // so they see where their stars come from. With reduced motion the counter only bumps.
  var lastTap = null;
  document.addEventListener("pointerdown", function (e) { lastTap = { x: e.clientX, y: e.clientY, t: Date.now() }; }, true);
  function bump(chip) { chip.classList.remove("bump"); void chip.offsetWidth; chip.classList.add("bump"); }
  function fly() {
    var chip = document.getElementById("star-chip");
    if (!chip || !chip.getClientRects().length) return;
    if (reduced) { bump(chip); return; }
    var from = lastTap && Date.now() - lastTap.t < 1500 ? lastTap : null;
    if (!from) {
      var box = document.getElementById("feedback") || document.activeElement;
      var r = box && box.getClientRects().length ? box.getBoundingClientRect() : null;
      from = r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : { x: innerWidth / 2, y: innerHeight / 2 };
    }
    var to = chip.getBoundingClientRect();
    var el = document.createElement("div");
    el.className = "loopy-plus";
    el.setAttribute("aria-hidden", "true");
    el.innerHTML = '+1 <svg viewBox="0 0 24 24"><path d="' + STAR_PATH + '"/></svg>';
    el.style.left = from.x + "px";
    el.style.top = from.y + "px";
    document.body.appendChild(el);
    void el.offsetWidth;
    el.style.left = (to.left + to.width / 2) + "px";
    el.style.top = (to.top + to.height / 2) + "px";
    el.style.scale = "0.6";
    el.style.opacity = "0";
    setTimeout(function () { el.remove(); bump(chip); }, 750);
  }

  var Loopy = window.Loopy = window.Loopy || {};
  Loopy.rewards = {
    BADGES: BADGES, STAR_PATH: STAR_PATH,
    get: function () { return data; },
    clean: clean, // used by Loopy.backup
    badgeFor: badgeFor, nextBadge: nextBadge, confetti: confetti, celebrate: celebrate,
    // Call after a wrong answer, with the game's name.
    // detail: optional { q: "52 − 17", a: "35", y: "45", k: "sub-rg" } for the grown-ups' progress page (see Loopy.log).
    wrong: function (game, detail) {
      if (Loopy.recent) Loopy.recent.add(game, false);
      if (Loopy.log) Loopy.log.add(game, false, detail);
      Loopy.sound.play("wrong");
      announce(false);
      if (Loopy.hint) Loopy.hint.done();
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
      save(); updateChips(); fly();
      announce(true);
      if (Loopy.hint) Loopy.hint.done();
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
      // With more than one child, the chip shows whose stars they are.
      if (Loopy.kids.list().length > 1) {
        var k = Loopy.kids.current(), pic = document.createElement("span");
        pic.className = "kid-pic";
        pic.setAttribute("aria-hidden", "true");
        pic.textContent = k.pic;
        chip.insertBefore(pic, chip.firstChild);
        chip.setAttribute("aria-label", Loopy.t("kidStars", { name: Loopy.kids.label(k) }));
      }
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
  try { data = clean(JSON.parse(Loopy.store.get(KEY))); } catch (e) {}

  // A day as "2026-10-15" in local time. offset: days from today, e.g. -1 for yesterday.
  Loopy.dayKey = dayKey;
  Loopy.daily = {
    BADGES: DAY_BADGES, clean: clean, // clean is used by Loopy.backup
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
        Loopy.store.set(KEY, JSON.stringify(data));
      }
      var badge = null;
      DAY_BADGES.forEach(function (b) { if (before < b.days && data.best >= b.days) badge = b; });
      return { streak: data.streak, badge: badge };
    }
  };
})();

// Answer log for the grown-ups' progress page: right and wrong answers per game per day, and each
// wrong answer with the right one, for the last 30 days. It goes in the stars code (Loopy.backup) and is never sent anywhere.
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
  try { data = clean(JSON.parse(Loopy.store.get(KEY))); } catch (e) {}
  function save() { Loopy.store.set(KEY, JSON.stringify(data)); }

  Loopy.log = {
    MAX_WRONG: MAX_WRONG, clean: clean, // used by Loopy.backup
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
    clear: function () { data = clean(null); Loopy.store.remove(KEY); },
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
  try { data = clean(JSON.parse(Loopy.store.get(KEY))); } catch (e) {}
  function save() { Loopy.store.set(KEY, JSON.stringify(data)); }

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
    clean: clean, // used by Loopy.backup
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
// The panel is the same in every game: "This game" (the game's own levels, then Print worksheet)
// comes first, then "Age, look and sound" (the shared row), then Reset score at the bottom.
(function () {
  function head(key) {
    var h = document.createElement("p");
    h.className = "set-head";
    h.setAttribute("data-t", key);
    h.textContent = Loopy.t(key);
    return h;
  }
  function group(panel) {
    var shared = panel.querySelector(".controls"), foot = panel.querySelector(".panel-foot");
    if (!shared || shared.parentNode !== panel) return;
    var box = document.createElement("div");
    box.className = "set-shared";
    // Only a game with its own settings gets the "This game" heading (Today's 10 has none).
    var own = [].some.call(panel.children, function (c) { return c !== shared && c !== foot; });
    box.appendChild(head("setShared"));
    panel.insertBefore(box, foot);
    box.appendChild(shared);
    if (own) panel.insertBefore(head("setGame"), panel.firstChild);
  }
  var GEAR = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>';
  function build() {
    var btn = document.getElementById("settings-toggle"), panel = document.getElementById("settings-panel");
    if (!btn || !panel) return;
    btn.className = "settings-toggle";
    btn.innerHTML = GEAR + "<span>" + Loopy.t("settings") + "</span>";
    // On small phones only the gear shows, so the button also needs its name for screen readers.
    btn.setAttribute("data-t-aria", "settings");
    btn.setAttribute("aria-label", Loopy.t("settings"));
    group(panel);
    var sync = function () { btn.setAttribute("aria-expanded", String(!panel.hidden)); };
    btn.addEventListener("click", function () { panel.hidden = !panel.hidden; sync(); });
    sync();
    // A named region, so screen readers can jump to it. Escape closes it and puts focus back on the button.
    panel.setAttribute("role", "region");
    panel.setAttribute("data-t-aria", "settings");
    panel.setAttribute("aria-label", Loopy.t("settings"));
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape" || panel.hidden || document.querySelector(".loopy-cheer.big")) return;
      var inside = panel.contains(document.activeElement) || document.activeElement === document.body;
      panel.hidden = true; sync();
      if (inside) btn.focus({ preventScroll: true });
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
  else build();
})();

// Skip and Next: the button under the answers. Before an answer it is a small, quiet "Skip", so a
// child does not tap it by mistake; after an answer it is the big "Next". The same two words in every game.
// A game calls Loopy.nextButton(btn, answered) when a new problem shows (false) and after each answer (true).
Loopy.nextButton = function (btn, answered) {
  if (!btn) return;
  btn.textContent = Loopy.t(answered ? "next" : "skip");
  btn.classList.toggle("skip", !answered);
};

// Keyboard: after Next is pressed with the keyboard, focus moves to the first answer of the new
// problem. Otherwise focus stays on the button (now "Skip"), and a second Enter skips the problem.
// In the number and letter pads, Check turns into Next and is off until something is typed, so focus
// moves to the first key instead of getting lost.
(function () {
  var FIRST = '#choices button:not(:disabled), #answers button:not(:disabled), #map [tabindex="0"]';
  var PAD = "#pad button:not(:disabled), #letters button:not(:disabled)";
  function after(from) {
    if (!from || (from.id !== "next" && from.id !== "k-go")) return;
    setTimeout(function () {
      var lost = document.activeElement === document.body || document.activeElement === from;
      var to = null;
      if (from.id === "next" && lost) to = document.querySelector(FIRST);
      if (from.id === "k-go" && (from.disabled || document.activeElement === document.body)) to = document.querySelector(PAD);
      if (to && to.getClientRects().length) to.focus({ preventScroll: true });
    }, 0);
  }
  document.addEventListener("click", function (e) { if (e.detail === 0) after(e.target.closest ? e.target.closest("#next, #k-go") : null); });
  document.addEventListener("keydown", function (e) { if (e.key === "Enter") after(document.activeElement); }, true);
  // On small screens a long explanation can scroll inside the feedback line. Then it must take
  // keyboard focus, so it can be scrolled without a mouse.
  function scrollable() {
    var fb = document.getElementById("feedback");
    if (!fb) return;
    if (fb.scrollHeight > fb.clientHeight || fb.scrollWidth > fb.clientWidth) fb.setAttribute("tabindex", "0");
    else fb.removeAttribute("tabindex");
  }
  function build() {
    var fb = document.getElementById("feedback");
    if (!fb || !window.MutationObserver) return;
    new MutationObserver(scrollable).observe(fb, { childList: true, subtree: true, characterData: true });
    window.addEventListener("resize", scrollable);
    // The line's size also changes when the layout settles or a font finishes loading.
    if (window.ResizeObserver) new ResizeObserver(scrollable).observe(fb);
    if (document.fonts) document.fonts.addEventListener("loadingdone", scrollable);
    scrollable();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
  else build();
})();

// First-time hint: the first time a child opens a game, a bubble above the answers says what to tap.
// It hides at the first tap or key press, and stops coming back once the child has answered there
// (Loopy.rewards calls Loopy.hint.done). Kept per child in "loopy.seen" as a list of game folders.
(function () {
  var KEY = "loopy.seen", NAME = /^[a-z0-9-]{1,40}$/;
  var AREAS = [["#letters", "hintLetters"], ["#pad", "hintPad"], ["#map", "hintMap"], ["#choices", "hintChoices"], ["#answers", "hintChoices"]];
  var Loopy = window.Loopy;
  var seen = [];
  // Only short folder names are kept, whatever the stored text says.
  try {
    var raw = JSON.parse(Loopy.store.get(KEY));
    if (Array.isArray(raw)) seen = raw.filter(function (g) { return typeof g === "string" && NAME.test(g); }).slice(-40);
  } catch (e) {}
  // The game is the page's folder, e.g. "plus-minus" for math/plus-minus/.
  var game = location.pathname.replace(/index\.html$/, "").split("/").filter(Boolean).pop() || "";
  var bubble = null, target = null;

  function hide() {
    if (bubble) bubble.remove();
    bubble = null;
    window.removeEventListener("resize", place);
  }
  function place() {
    if (!bubble) return;
    var r = target.getBoundingClientRect();
    if (!r.width) { hide(); return; }
    bubble.style.left = (r.left + r.width / 2) + "px";
    // Above the answers; on the map it sits inside the map's bottom edge, so it does not hide the question.
    bubble.style.top = (target.id === "map" ? r.bottom - 12 : Math.max(r.top - 14, 70)) + "px";
  }
  function show() {
    if (!NAME.test(game) || seen.indexOf(game) !== -1) return;
    var pick = AREAS.filter(function (a) { var n = document.querySelector(a[0]); return n && n.getClientRects().length; })[0];
    if (!pick) return;
    target = document.querySelector(pick[0]);
    bubble = document.createElement("div");
    bubble.className = "loopy-hint";
    bubble.setAttribute("aria-hidden", "true"); // the game's own prompt says the same for screen readers
    bubble.textContent = "👆 " + Loopy.t(pick[1]);
    document.body.appendChild(bubble);
    place();
    window.addEventListener("resize", place);
    ["pointerdown", "keydown"].forEach(function (k) { document.addEventListener(k, hide, { capture: true, once: true }); });
  }
  Loopy.hint = {
    done: function () {
      hide();
      if (!NAME.test(game) || seen.indexOf(game) !== -1) return;
      seen = seen.concat(game).slice(-40);
      Loopy.store.set(KEY, JSON.stringify(seen));
    }
  };
  // Wait until the page shows (loopy.js hides it while the shared parts build).
  function start() { setTimeout(show, 350); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
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
      panel.insertBefore(row, panel.querySelector(".set-shared") || panel.querySelector(".panel-foot"));
    };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
    else build();
  };
  // Printing from the browser's own menu also prints a fresh worksheet.
  window.addEventListener("beforeprint", function () { if (opts && sheet && !filled) fill(); });
  window.addEventListener("afterprint", function () { filled = false; });
})();

// Stars code: moves stars, badges, day streak, progress, Last 5, age and settings to another device.
// No account and nothing sent anywhere: the code is copied by hand and pasted on the other device.
// "LOOPY2-Z..." is the data packed small (deflate) and written as letters; "LOOPY2-J..." is the same
// data unpacked, for browsers that can't pack. Old "LOOPY-..." codes (stars and best scores only) still load.
// Inside: { v: 2, p: [child, ...], theme, font, sound, lang }, child = { n, pic, rewards, daily, log, recent, age, read }.
// p holds every child on the device (see Loopy.kids). Loading a code gives each child's things to the child
// here with the same name, or adds that child. A child with no name, and an old code, go to the child playing.
// Loading a code adds to what is here and never takes anything away: the bigger number wins,
// and a setting is only taken when this device has not chosen one yet.
(function () {
  var Loopy = window.Loopy = window.Loopy || {};
  var MAX_CODE = 40000, MAX_JSON = 200000, MAX_P = 10;
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

  function snapshot() {
    var p = Loopy.kids.list().map(function (kid) {
      var id = kid.id;
      return {
        n: kid.name, pic: kid.pic,
        rewards: Loopy.rewards.clean(read("rewards", id)),
        daily: Loopy.daily.clean(read("daily", id)),
        log: Loopy.log.clean(read("log", id)),
        recent: Loopy.recent.clean(read("recent", id)),
        age: get("age", id) === null ? null : cleanAge(parseInt(get("age", id), 10) || 0),
        read: choice("read", get("read", id))
      };
    });
    return { v: 2, p: p, theme: choice("theme", get("theme")), font: choice("font", get("font")), sound: choice("sound", get("sound")), lang: choice("lang", get("lang")) };
  }

  // Adds a checked child from a code to what this device has. Everything is cleaned again before it is saved.
  function merge(got, id) {
    var R = Loopy.rewards.clean(read("rewards", id)), r = Loopy.rewards.clean(got.rewards);
    R.stars = Math.max(R.stars, r.stars);
    Object.keys(r.best).forEach(function (g) { R.best[g] = Math.max(R.best[g] || 0, r.best[g]); });
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
  }

  function load(d) {
    if (!d || typeof d !== "object" || d.v !== 2 || !Array.isArray(d.p) || !d.p.length || d.p.length > MAX_P) return false;
    var kids = d.p.filter(function (c) { return c && typeof c === "object"; });
    if (!kids.length) return false;
    var here = Loopy.kids.list(), now = Loopy.kids.current().id;
    kids.forEach(function (c) {
      var name = Loopy.kids.cleanName(c.n), same = function (k) { return k.name.toLowerCase() === name.toLowerCase(); };
      var id = !name ? now : (here.filter(same)[0] || {}).id || Loopy.kids.create(name, c.pic);
      if (id) merge(c, id);
    });
    ["theme", "font", "sound", "lang"].forEach(function (k) { if (get(k) === null && choice(k, d[k])) put(k, d[k]); });
    return true;
  }
  // Codes from before: { s: stars, b: { game: best } }.
  function loadOld(d) {
    if (!d || typeof d !== "object" || typeof d.s !== "number") return false;
    merge({ rewards: { stars: d.s, best: d.b } }, Loopy.kids.current().id);
    return true;
  }

  Loopy.backup = {
    // A promise of the code for everything saved in this browser.
    exportCode: function () {
      var bytes = new TextEncoder().encode(JSON.stringify(snapshot()));
      if (!can) return Promise.resolve("LOOPY2-J" + b64(bytes));
      return pipe(bytes, new CompressionStream("deflate-raw")).then(function (z) { return "LOOPY2-Z" + b64(z); });
    },
    // A promise of true when the code was good and its data is saved. Reload the page to show it.
    importCode: function (code) {
      return Promise.resolve().then(function () {
        code = String(code).replace(/\s+/g, "");
        if (code.length > MAX_CODE) return false;
        var m = /^LOOPY2-([ZJ])([A-Za-z0-9+/]+=*)$/i.exec(code);
        if (m) {
          var bytes = unb64(m[2]);
          var json = m[1].toUpperCase() === "J" ? Promise.resolve(bytes) : can ? pipe(bytes, new DecompressionStream("deflate-raw")) : Promise.reject(new Error("can't unpack"));
          return json.then(function (b) {
            if (b.length > MAX_JSON) return false;
            return load(JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(b)));
          });
        }
        m = /^LOOPY-([A-Za-z0-9+/]+=*)$/i.exec(code);
        return !!m && m[1].length <= 2000 && loadOld(JSON.parse(atob(m[1])));
      }).catch(function () { return false; });
    }
  };
})();

// Works offline: sw.js, next to this file, saves every page on the device after the first visit
// (see src/sw.js). Browsers only allow it on https and on localhost.
(function () {
  var me = document.currentScript;
  if (!me || !me.src || !window.isSecureContext || !("serviceWorker" in navigator)) return;
  var url = new URL("sw.js", me.src).href;
  window.addEventListener("load", function () { navigator.serviceWorker.register(url).catch(function () {}); });
})();

// Show the page. This listener is added last, so it runs after every part above is built.
(function () {
  var show = function () { document.documentElement.classList.remove("loopy-building"); };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", show);
  else show();
})();
