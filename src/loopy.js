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
      b10: "First Steps", b25: "Rising Star", b50: "Super Learner", b100: "Brain Builder", b150: "Star Collector", b200: "Bright Spark", b250: "Champion",
      b300: "Quick Thinker", b400: "Puzzle Pro", b500: "Legend", b750: "Hero", b1000: "loopy Master", b1500: "Grand Master", b2000: "Wizard", b3000: "Superstar", b5000: "Shooting Star",
      s10: "Hot Streak", s20: "On Fire", s50: "Unstoppable", e5: "Explorer", e10: "Adventurer", eAll: "World Traveller", brave: "Brave",
      streakText: "{n} in a row", gamesText: "{n} games played", braveText: "10 in a row above your age's level", bestStreak: "Best streak: {n}",
      newBadge: "New badge: {name}!", badgeText: "You have earned {n} stars. Keep going!",
      levelUp: "{n} in a row! Ready to level up?", levelUpRound: "A clean round! Ready to level up?", makeHarder: "Make it harder", keepGoing: "Keep going", yay: "Yay!",
      inARow: "{n} in a row!", bestYet: "That's your best streak yet!", amazing: "Amazing work!",
      newBest: "New best streak: {n}!", keepItGoing: "Keep it going!",
      correct: "Correct!", correctRow: "Correct! {n} in a row!", notQuite: "Not quite.",
      score: "Score", streak: "Streak", home: "← loopy", resetScore: "Reset score",
      backHome: "Back to all games", last5: "Last 5", last5Aria: "Last 5 answers: {n} right", last5None: "Last 5 answers: none yet",
      tapHint: "Tap the numbers to write your answer.", kbdHint: "Keyboard works too: numbers, Backspace, Enter.",
      erase: "Erase", eraseAria: "Erase last digit", check: "Check", next: "Next", yourAnswer: "Your answer", both: "Both",
      skip: "Skip", setGame: "This game", setShared: "Age, look and sound",
      hintChoices: "Tap the right answer!", hintPad: "Tap the numbers, then Check!",
      hintLetters: "Tap the letters to spell the word!", hintWords: "Tap the words in order!", hintMap: "Tap the right place on the map!"
    },
    de: {
      theme: "Farbthema", black: "Schwarz", sunny: "Sonnig", ocean: "Ozean", candy: "Bonbon", forest: "Wald", contrast: "Hoher Kontrast",
      easyRead: "Leichter lesen", easyOn: "An", easyOff: "Aus",
      ageGroup: "Alter", ageLabel: "Alter {n}", younger: "Jünger", older: "Älter",
      soundOn: "Ton an", soundOff: "Ton aus", settings: "Einstellungen", language: "Sprache",
      starsEarned: "Gesammelte Sterne",
      b10: "Erste Schritte", b25: "Aufsteiger", b50: "Super-Lerner", b100: "Denk-Profi", b150: "Sternesammler", b200: "Helles Köpfchen", b250: "Champion",
      b300: "Schnelldenker", b400: "Rätsel-Profi", b500: "Legende", b750: "Held", b1000: "loopy-Meister", b1500: "Großmeister", b2000: "Zauberer", b3000: "Superstar", b5000: "Sternschnuppe",
      s10: "Heiße Serie", s20: "Feuer und Flamme", s50: "Nicht zu stoppen", e5: "Entdecker", e10: "Abenteurer", eAll: "Weltenbummler", brave: "Mutig",
      streakText: "{n} hintereinander", gamesText: "{n} Spiele gespielt", braveText: "10 hintereinander über der Stufe deines Alters", bestStreak: "Beste Serie: {n}",
      newBadge: "Neues Abzeichen: {name}!", badgeText: "Du hast {n} Sterne gesammelt. Weiter so!",
      levelUp: "{n} richtig hintereinander! Bereit für mehr?", levelUpRound: "Alles richtig! Bereit für mehr?", makeHarder: "Schwieriger machen", keepGoing: "Weiter so", yay: "Juhu!",
      inARow: "{n} richtig hintereinander!", bestYet: "Das ist deine beste Serie!", amazing: "Super gemacht!",
      newBest: "Neue beste Serie: {n}!", keepItGoing: "Mach weiter so!",
      correct: "Richtig!", correctRow: "Richtig! {n} hintereinander!", notQuite: "Nicht ganz.",
      score: "Punkte", streak: "Serie", home: "← loopy", resetScore: "Punkte zurücksetzen",
      backHome: "Zurück zu allen Spielen", last5: "Letzte 5", last5Aria: "Letzte 5 Antworten: {n} richtig", last5None: "Letzte 5 Antworten: noch keine",
      tapHint: "Tippe auf die Zahlen, um deine Antwort zu schreiben.", kbdHint: "Die Tastatur geht auch: Zahlen, Rücktaste, Enter.",
      erase: "Löschen", eraseAria: "Letzte Ziffer löschen", check: "Prüfen", next: "Weiter", yourAnswer: "Deine Antwort", both: "Beides",
      skip: "Überspringen", setGame: "Dieses Spiel", setShared: "Alter, Aussehen und Ton",
      hintChoices: "Tippe auf die richtige Antwort!", hintPad: "Tippe die Zahlen, dann Prüfen!",
      hintLetters: "Tippe die Buchstaben für das Wort!", hintWords: "Tippe die Wörter der Reihe nach an!", hintMap: "Tippe die richtige Stelle auf der Karte an!"
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
// A new device starts with one child with no name. Devices that already have children (Dio and Dia
// from before) keep them. Grown-ups add, rename and remove kids in Settings (<div id="kid-settings">).
// Each child's own things are kept under "loopy.kid.<id>." + key. Use Loopy.store.get / set / remove
// instead of localStorage for anything that belongs to one child (scores, levels, settings in a game).
// <div id="kid-picker"></div> becomes the "Who is playing?" row, shown only with two or more children;
// add data-switch-only to hide add and edit.
(function () {
  var KEY = "loopy.kids", MAX = 6, LEN = 12, BIG_ID = 1000000;
  // A new device starts with one child with no name. Add more in Settings.
  var START = [{ id: 1, name: "", pic: "🐰" }];
  var PICS = ["🐰", "🦊", "🐼", "🐯", "🐸", "🦄", "🐙", "🦖", "🐝", "🐧", "🦁", "🐨"];
  // Keys saved before there were children. On the first visit they move to child 1, so no stars are lost.
  var OLD = /^(?:loopy\.(?:rewards|daily|log|recent|ageOffset|readAloud)$|(?:bs|cc|clockquiz|mk|pm100|pz|qf|si|ss|ts|wi|wm)\.)/;
  var Loopy = window.Loopy = window.Loopy || {};

  Loopy.addStrings({
    en: {
      kidsGroup: "Who is playing?", kidN: "Player {n}", kidAdd: "Add a child", kidEditAria: "Change name or picture",
      kidNew: "New child", kidEdit: "Change {name}", kidName: "Name", kidNameHint: "Name or nickname", kidPic: "Picture",
      kidSave: "Save", kidCancel: "Cancel", kidRemove: "Remove",
      kidSure: "Tap again to remove {name} and all their stars", kidStars: "{name}'s stars",
      kidsHead: "Kids", kidsOne: "Add a child to give each one their own stars, levels and place in the games.",
      kidsMany: "Each child has their own stars, levels and place in the games.", kidChange: "Change {name}"
    },
    de: {
      kidsGroup: "Wer spielt?", kidN: "Kind {n}", kidAdd: "Kind hinzufügen", kidEditAria: "Name oder Bild ändern",
      kidNew: "Neues Kind", kidEdit: "{name} ändern", kidName: "Name", kidNameHint: "Name oder Spitzname", kidPic: "Bild",
      kidSave: "Speichern", kidCancel: "Abbrechen", kidRemove: "Entfernen",
      kidSure: "Nochmal tippen: {name} mit allen Sternen entfernen", kidStars: "Sterne von {name}",
      kidsHead: "Kinder", kidsOne: "Füge ein Kind hinzu, damit jedes eigene Sterne, Stufen und seinen Platz in den Spielen hat.",
      kidsMany: "Jedes Kind hat eigene Sterne, Stufen und seinen Platz in den Spielen.", kidChange: "{name} ändern"
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
  function save() { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {} if (Loopy.keep) Loopy.keep.soon(); }

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

  // Every save also asks Loopy.keep to copy to IndexedDB.
  var kept = function () { if (Loopy.keep) Loopy.keep.soon(); };
  Loopy.store = {
    get: function (k) { try { return localStorage.getItem(pre(data.on) + k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(pre(data.on) + k, String(v)); } catch (e) {} kept(); },
    remove: function (k) { try { localStorage.removeItem(pre(data.on) + k); } catch (e) {} kept(); }
  };

  function find(id) { return data.list.filter(function (k) { return k.id === id; })[0]; }
  function copy(k) { return { id: k.id, name: k.name, pic: k.pic }; }
  // Switching child reloads the page, so every part reads the new child's things from the start.
  function use(id) { if (!find(id)) return; data.on = id; save(); location.reload(); }

  Loopy.kids = {
    PICS: PICS, MAX: MAX, cleanName: cleanName,
    // True when this browser had no list of children when the page opened (a new device, or one whose
    // storage was cleared). Loopy.keep then looks for a copy in IndexedDB.
    fresh: stored === null,
    list: function () { return data.list.map(copy); },
    current: function () { return copy(find(data.on)); },
    // What to call a child: their name, or "Player 2" when they have none.
    label: function (k) { return k.name || Loopy.t("kidN", { n: data.list.map(function (x) { return x.id; }).indexOf(k.id) + 1 }); },
    use: use,
    // Makes id the child playing without reloading (Loopy.backup does this after loading one child).
    pick: function (id) { if (find(id)) { data.on = id; save(); } },
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
    // One child: no names anywhere. Kids are added in Settings.
    if (data.list.length < 2) { box.hidden = true; return; }
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

  // The "Kids" part of Settings: one row per child with ✎, then "Add a child".
  function settings() {
    var box = document.getElementById("kid-settings");
    if (!box || typeof HTMLDialogElement !== "function") return;
    box.className = "set-kids";
    box.textContent = "";
    var head = el("p", "set-head", Loopy.t("kidsHead"));
    box.appendChild(head);
    var rows = el("div", "kid-rows");
    data.list.forEach(function (k) {
      var b = el("button", "kid-row");
      b.type = "button";
      b.setAttribute("aria-label", Loopy.t("kidChange", { name: Loopy.kids.label(k) }));
      b.appendChild(el("span", "kid-pic", k.pic)).setAttribute("aria-hidden", "true");
      b.appendChild(el("span", "kid-row-name", Loopy.kids.label(k))).setAttribute("aria-hidden", "true");
      b.appendChild(el("span", "kid-row-edit", "✎")).setAttribute("aria-hidden", "true");
      b.addEventListener("click", function () { open(find(k.id)); });
      rows.appendChild(b);
    });
    if (data.list.length < MAX) {
      var add = el("button", "kid-row add");
      add.type = "button";
      add.appendChild(el("span", "kid-pic", "+")).setAttribute("aria-hidden", "true");
      add.appendChild(el("span", "kid-row-name", Loopy.t("kidAdd")));
      add.addEventListener("click", function () { open(null); });
      rows.appendChild(add);
    }
    box.appendChild(rows);
    box.appendChild(el("p", "kid-note", Loopy.t(data.list.length < 2 ? "kidsOne" : "kidsMany")));
  }
  // The child playing, next to ⚙ Settings on every page: their picture and name. A child with no
  // name (one child on a new device) shows only the picture. Tapping it changes the name or picture.
  // On the home page with two or more children the "Who is playing?" row shows this already.
  function chip() {
    var gear = document.getElementById("settings-toggle");
    if (!gear || (!gear.closest(".bar-right") && data.list.length > 1)) return;
    var k = find(data.on), can = typeof HTMLDialogElement === "function";
    var b = el(can ? "button" : "span", "kid-chip");
    b.appendChild(el("span", "kid-pic", k.pic)).setAttribute("aria-hidden", "true");
    if (k.name) b.appendChild(el("span", "kid-chip-name", k.name));
    else b.classList.add("pic-only");
    if (can) {
      b.type = "button";
      b.setAttribute("aria-label", k.name ? Loopy.t("kidChange", { name: k.name }) : Loopy.t("kidEditAria"));
      b.setAttribute("aria-haspopup", "dialog");
      b.addEventListener("click", function () { open(find(data.on)); });
    } else if (!k.name) b.hidden = true;
    if (!gear.closest(".bar-right")) {
      // Home: the chip and ⚙ Settings side by side under the tagline.
      var row = el("div", "kid-set-row");
      gear.parentNode.insertBefore(row, gear);
      row.appendChild(b);
      row.appendChild(gear);
    } else gear.parentNode.insertBefore(b, gear);
  }
  function start() { build(); settings(); chip(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();

// Safe keeping: everything loopy saves ("loopy." keys in localStorage) is also copied to IndexedDB, a
// bigger browser store, and loopy asks the browser to keep it (persistent storage) once a child has
// stars, so it is not cleared by surprise when the device is low on space.
// localStorage stays the quick copy every page reads when it opens. If it was cleared but IndexedDB
// still has the copy, the copy comes back and the page reloads once. If IndexedDB is blocked (some
// private windows), loopy works from localStorage alone, as before.
// IndexedDB "loopy", store "kv": one row per localStorage key, the value as text.
(function () {
  var Loopy = window.Loopy, DB = "loopy", STORE = "kv", PRE = "loopy.", ASKED = "loopy.persistAsked";
  var db = null, ready = false, timer = null;
  var keep = Loopy.keep = { db: false, persisted: false, soon: soon };
  var own = function (k) { return typeof k === "string" && k.indexOf(PRE) === 0; };

  function local() {
    var out = {};
    try {
      for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (own(k)) out[k] = localStorage.getItem(k); }
    } catch (e) {}
    return out;
  }
  // Writes the whole quick copy to IndexedDB in one go, so the two always match.
  function copy() {
    timer = null;
    if (!db || !ready) return;
    try {
      var all = local(), tx = db.transaction(STORE, "readwrite"), st = tx.objectStore(STORE);
      st.clear();
      Object.keys(all).forEach(function (k) { st.put(all[k], k); });
    } catch (e) {}
  }
  // Called after something is saved. Many saves in a row make one copy.
  function soon() { if (db && ready && !timer) timer = setTimeout(copy, 400); }

  function ask() {
    var S = navigator.storage;
    if (!S || typeof S.persist !== "function") return;
    S.persisted().then(function (yes) {
      keep.persisted = yes;
      // Only once there is something worth keeping, and only once per device.
      var stars = Loopy.rewards ? Loopy.rewards.get().stars : 0;
      if (yes || (!stars && Loopy.kids.list().length < 2)) return;
      try { if (localStorage.getItem(ASKED)) return; localStorage.setItem(ASKED, "1"); } catch (e) { return; }
      return S.persist().then(function (got) { keep.persisted = got; });
    }).catch(function () {});
  }

  // Values from IndexedDB are only put back as loopy text keys; every part checks them again when it reads them.
  function restore(rows) {
    var n = 0;
    try {
      if (sessionStorage.getItem("loopy.restored")) return false;
      sessionStorage.setItem("loopy.restored", "1");
      Object.keys(rows).forEach(function (k) {
        if (own(k) && typeof rows[k] === "string" && rows[k].length <= 500000) { localStorage.setItem(k, rows[k]); n++; }
      });
    } catch (e) { return false; }
    return n > 0;
  }

  function start() {
    var req;
    try { req = indexedDB.open(DB, 1); } catch (e) { return; }
    req.onupgradeneeded = function () { req.result.createObjectStore(STORE); };
    req.onerror = function () {};
    req.onsuccess = function () {
      db = req.result;
      keep.db = true;
      var rows = {}, cur;
      try { cur = db.transaction(STORE, "readonly").objectStore(STORE).openCursor(); } catch (e) { return; }
      cur.onsuccess = function () {
        var c = cur.result;
        if (c) { rows[c.key] = c.value; c.continue(); return; }
        // localStorage lost its list of children but IndexedDB still has it: bring everything back.
        if (Loopy.kids.fresh && typeof rows["loopy.kids"] === "string" && restore(rows)) { location.reload(); return; }
        ready = true;
        copy();
        ask();
      };
    };
  }
  try { if (!window.indexedDB) return; } catch (e) { return; }
  // When the page is left, so the last saves are copied too.
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "hidden") copy(); });
  window.addEventListener("pagehide", copy);
  // After the page has loaded, so it does not slow the first paint.
  if (document.readyState === "complete") setTimeout(start, 0);
  else window.addEventListener("load", function () { setTimeout(start, 0); });
})();

// Carry on: each child's last game. A game page (one with a Last 5 row) saves its folder, e.g.
// "math/plus-minus/", per child in "loopy.last". The home page offers "Carry on" for it.
// Loopy.root is the site's address (where loopy.js is), used for links that open the home page.
(function () {
  var Loopy = window.Loopy, KEY = "loopy.last", PATH = /^[a-z0-9-]{1,30}\/[a-z0-9-]{1,40}\/$/;
  var me = document.currentScript;
  Loopy.root = me && me.src ? new URL(".", me.src).href : new URL(".", location.href).href;
  // Parts used now and then (Report a problem, the stars code, the worksheet) live in small files next to
  // loopy.js and load the first time they are needed, so every page starts with less code.
  // Loopy.load("report") is a promise that loopy-report.js is in (it loads the file once).
  var parts = {};
  Loopy.load = function (name) {
    if (!parts[name]) parts[name] = new Promise(function (ok, no) {
      var s = document.createElement("script");
      s.src = Loopy.root + "loopy-" + name + ".js";
      s.onload = function () { ok(); };
      s.onerror = function () { delete parts[name]; s.remove(); no(new Error("loopy-" + name + ".js did not load")); };
      document.head.appendChild(s);
    });
    return parts[name];
  };
  Loopy.last = {
    // The folder of the child's last game, or "" when there is none (or the saved text is not a folder).
    get: function () { var v = Loopy.store.get(KEY); return typeof v === "string" && PATH.test(v) ? v : ""; },
    clean: function (v) { return typeof v === "string" && PATH.test(v) ? v : ""; }
  };
  function mark() {
    // A game opened in a hidden frame (the grown-ups' practice sheet) is not where the child left off.
    if (!document.getElementById("last5") || window.top !== window) return;
    var here = new URL(".", location.href).href;
    if (here.indexOf(Loopy.root) !== 0) return;
    var rel = decodeURIComponent(here.slice(Loopy.root.length));
    if (PATH.test(rel) && Loopy.store.get(KEY) !== rel) Loopy.store.set(KEY, rel);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mark);
  else mark();
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
// lang() (optional) gives "en" or "de" when the text is not in the page's language (a "Words in" setting).
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
      var lang = opts && opts.lang ? opts.lang() : Loopy.lang;
      u.lang = lang === "de" ? "de-DE" : "en-US";
      var v = voiceFor(lang);
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
// More badges: for the best streak (10, 20, 50 in a row, in any game), for how many different games
// were played (5, 10, all), and "Brave" for 10 in a row on a level above the age's start level.
// Progress is kept in this browser's localStorage (no account, nothing sent anywhere) as
// { stars, best: { game: best streak }, played: [game, ...], brave: true }.
(function () {
  var KEY = "loopy.rewards";
  // Star badges: [stars, color number]. The name is the string "b" + stars.
  var BADGES = [[10, 3], [25, 1], [50, 2], [100, 4], [150, 5], [200, 3], [250, 5], [300, 1], [400, 2], [500, 1], [750, 4], [1000, 2], [1500, 3], [2000, 5], [3000, 1], [5000, 4]]
    .map(function (b) { return { stars: b[0], key: "b" + b[0], color: "--c" + b[1] }; });
  // More badges: [kind, how many, name key, color]. kind "streak" needs the best streak in any game,
  // "games" the number of different games played, "brave" the brave flag.
  var EXTRA = [["streak", 10, "s10", 4], ["streak", 20, "s20", 2], ["streak", 50, "s50", 1], ["games", 5, "e5", 3], ["games", 10, "e10", 5], ["games", 15, "eAll", 2], ["brave", 1, "brave", 1]]
    .map(function (b) { return { kind: b[0], n: b[1], key: b[2], color: "--c" + b[3] }; });
  var STREAKS = [5, 10, 15, 20, 30, 50];
  var STAR_PATH = "M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z";

  var data = { stars: 0, best: {}, played: [], brave: false };
  var cheeredBest = {}; // one "new best" cheer per run
  var owed = []; // badges earned on the same answer as another card, cheered on the next right answer
  var last = null; // the last answer on this page, for "Report a problem"
  var MAX_STARS = 1000000, GAMES = ["plus-minus", "times-share", "clock", "sound-spell", "daily-mix", "make-10", "bigger-smaller", "pizza-fractions", "coins-change", "word-match", "spell-it", "quick-facts", "where-is-it", "equation-balance", "flags-capitals", "times-sprint", "percent-ratio", "sentence-builder", "graphs-data"];
  var num = function (n) { return typeof n === "number" && isFinite(n) && n >= 0 ? Math.min(Math.floor(n), MAX_STARS) : 0; };
  // Only known games and sane numbers are kept, whatever the stored text says.
  function clean(raw) {
    var out = { stars: 0, best: {}, played: [], brave: false };
    if (!raw || typeof raw !== "object") return out;
    out.stars = num(raw.stars);
    var b = raw.best && typeof raw.best === "object" ? raw.best : {};
    GAMES.forEach(function (g) { if (b[g] !== undefined) out.best[g] = num(b[g]); });
    var p = Array.isArray(raw.played) ? raw.played : [];
    GAMES.forEach(function (g) { if (g !== "daily-mix" && p.indexOf(g) !== -1) out.played.push(g); });
    out.brave = raw.brave === true;
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
  // calm: no confetti, for a card that is not a cheer (the "a bit easier" offer).
  function celebrate(title, text, big, actions, calm) {
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
    if (!calm) confetti(big ? 160 : 70);
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
  EXTRA.forEach(function (b) {
    Object.defineProperty(b, "name", { get: function () { return Loopy.t(b.key); } });
    Object.defineProperty(b, "text", { get: function () { return Loopy.t(b.kind + "Text", { n: b.n }); } }); // what earns it
  });
  function badgeFor(stars) { var got = null; BADGES.forEach(function (b) { if (stars >= b.stars) got = b; }); return got; }
  function nextBadge(stars) { for (var i = 0; i < BADGES.length; i++) if (stars < BADGES[i].stars) return BADGES[i]; return null; }
  function bestStreak() { var m = 0; Object.keys(data.best).forEach(function (g) { m = Math.max(m, data.best[g]); }); return m; }
  // The games this child has played. A device from before this list had one fills it from the answer log once.
  function played() {
    if (!data.played.length && Loopy.log) {
      var days = Loopy.log.get().days, seen = {};
      Object.keys(days).forEach(function (d) { Object.keys(days[d]).forEach(function (g) { if (days[d][g][0] > 0) seen[g] = true; }); });
      data.played = GAMES.filter(function (g) { return g !== "daily-mix" && seen[g]; });
      if (data.played.length) save();
    }
    return data.played;
  }
  function hasExtra(b) {
    return b.kind === "streak" ? bestStreak() >= b.n : b.kind === "games" ? played().length >= b.n : data.brave;
  }
  function showBest(game) {
    var el = document.getElementById("set-best");
    if (el) el.textContent = Loopy.t("bestStreak", { n: data.best[game] || 0 });
  }

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
    // The last answer on this page: { ok: true } or { ok: false, d: { q, a, y, k } }, or null before the first one.
    last: function () { return last; },
    badgeFor: badgeFor, nextBadge: nextBadge, confetti: confetti, celebrate: celebrate,
    // The streak, games and brave badges, each with got: true when earned.
    extra: function () { return EXTRA.map(function (b) { return { key: b.key, name: b.name, text: b.text, color: b.color, got: hasExtra(b) }; }); },
    bestStreak: bestStreak, played: played,
    // Call after a wrong answer, with the game's name.
    // detail: optional { q: "52 − 17", a: "35", y: "45", k: "sub-rg" } for the grown-ups' progress page (see Loopy.log).
    wrong: function (game, detail) {
      last = { ok: false, d: detail && typeof detail === "object" ? detail : null };
      if (Loopy.recent) Loopy.recent.add(game, false);
      if (Loopy.log) Loopy.log.add(game, false, detail);
      Loopy.sound.play("wrong");
      announce(false);
      if (Loopy.hint) Loopy.hint.done();
      if (Loopy.levels) Loopy.levels.stuck(game);
    },
    // Call after each right answer with the current streak.
    // harder: optional { label, apply } offered after 10 in a row. Left out, the game's ladder
    // (Loopy.levels) gives the next level; null means no offer, e.g. during a timed round.
    correct: function (game, streak, harder) {
      if (harder === undefined && Loopy.levels) harder = Loopy.levels.harder();
      last = { ok: true, d: null };
      if (Loopy.recent) Loopy.recent.add(game, true);
      if (Loopy.log) Loopy.log.add(game, true);
      var before = badgeFor(data.stars), had = EXTRA.map(hasExtra);
      data.stars++;
      if (streak <= 1) cheeredBest[game] = false;
      var newBest = streak > (data.best[game] || 0);
      if (newBest) { data.best[game] = streak; showBest(game); }
      if (game !== "daily-mix" && played().indexOf(game) === -1) data.played.push(game);
      if (streak === 10 && Loopy.levels) { var lv = Loopy.levels.get(); if (lv && lv.at > lv.base) data.brave = true; }
      save(); updateChips(); fly();
      announce(true);
      if (Loopy.hint) Loopy.hint.done();
      var after = badgeFor(data.stars);
      if (after && after !== before) owed.push([after.name, Loopy.t("badgeText", { n: data.stars })]);
      EXTRA.forEach(function (b, i) { if (!had[i] && hasExtra(b)) owed.push([b.name, b.text]); });
      var day = Loopy.daily ? Loopy.daily.answer() : null; // 10 right today in any game count as a day
      if (day) owed.push([day.name, Loopy.t("dayStreakBadge", { n: day.days })]);
      if (owed.length) {
        var b = owed.shift();
        Loopy.sound.play("badge");
        celebrate(Loopy.t("newBadge", { name: b[0] }), b[1], true);
      } else if (streak % 10 === 0 && harder) {
        Loopy.sound.play("badge");
        celebrate(Loopy.t("levelUp", { n: streak }), harder.label, true,
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
      // With more than one child, the chip shows whose stars they are. In the top bar the child's
      // picture is already on the name chip next to Settings, so only the name for screen readers.
      if (Loopy.kids.list().length > 1) {
        var k = Loopy.kids.current(), pic = document.createElement("span");
        pic.className = "kid-pic";
        pic.setAttribute("aria-hidden", "true");
        pic.textContent = k.pic;
        if (!chip.closest(".game-bar")) chip.insertBefore(pic, chip.firstChild);
        chip.setAttribute("aria-label", Loopy.t("kidStars", { name: Loopy.kids.label(k) }));
      }
    }
    updateChips();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
  else build();
})();

// Levels: each game declares its ladder once, with Loopy.levels.init({ game, names, get, set, base }):
//   names   the levels in order, as string keys for Loopy.t, e.g. ["lvHalf", "lvQuarter", "lvFive", "lvOne"];
//           a level whose name has a number in it is a function that returns the text
//   get()   the level the child is on now, 0-based, read from the game's settings
//   set(i)  go to level i: change the settings, save them for this age, redraw
//   base()  the level the age picker starts at, 0-based (the grown-ups' page and badges use it)
// The score row's <div id="level"></div> becomes a "Level 2 of 4" pill. After 10 right in a row the
// game offers the next level (rewards.correct), after 3 wrong in the last 5 an easier one, once a visit
// (rewards.wrong). A game calls Loopy.levels.render() after a level is picked by hand in Settings.
(function () {
  var Loopy = window.Loopy, L = null, asked = false;
  Loopy.addStrings({
    en: { levelOf: "Level {n} of {m}", levelShort: "Level {n}/{m}", levelAria: "Level {n} of {m}: {name}", nextLevel: "Next: {name}",
      tricky: "Tricky ones today?", trickyText: "Want it a bit easier for now?", easier: "A bit easier" },
    de: { levelOf: "Stufe {n} von {m}", levelShort: "Stufe {n}/{m}", levelAria: "Stufe {n} von {m}: {name}", nextLevel: "Als Nächstes: {name}",
      tricky: "Heute knifflig?", trickyText: "Soll es erst mal etwas leichter sein?", easier: "Etwas leichter" }
  });
  var clamp = function (i) { return Math.max(0, Math.min(L.names.length - 1, i | 0)); };
  // On narrow phones the pill says "Level 3/5", so Last 5, the level and the streak fit one line.
  var narrow = window.matchMedia ? matchMedia("(max-width: 419px)") : { matches: false };
  if (narrow.addEventListener) narrow.addEventListener("change", function () { render(); });
  function at() { return clamp(L.get()); }
  function name(i) { var n = L.names[i]; return typeof n === "function" ? n() : Loopy.t(n); }
  function go(i) { L.set(clamp(i)); render(); }
  function render() {
    var box = document.getElementById("level");
    if (!L || !box) return;
    var i = at(), n = L.names.length;
    box.className = "pill pill-level";
    box.textContent = Loopy.t(narrow.matches ? "levelShort" : "levelOf", { n: i + 1, m: n });
    box.setAttribute("aria-label", Loopy.t("levelAria", { n: i + 1, m: n, name: name(i) }));
  }
  function harder() {
    if (!L) return null;
    var i = at();
    if (i >= L.names.length - 1) return null;
    return { label: Loopy.t("nextLevel", { name: name(i + 1) }), apply: function () { go(i + 1); } };
  }
  function easier() {
    var i = at();
    Loopy.rewards.celebrate(Loopy.t("tricky"), Loopy.t("trickyText"), true,
      [{ label: Loopy.t("easier"), fn: function () { go(i - 1); } }, { label: Loopy.t("keepGoing") }], true);
  }
  Loopy.levels = {
    init: function (opts) { L = opts; render(); },
    render: render,
    harder: harder,
    // { at, of, base, name } for the level the child is on, or null when the page has no ladder.
    get: function () { return L ? { at: at(), of: L.names.length, base: L.base ? clamp(L.base()) : 0, name: name(at()) } : null; },
    // rewards.wrong calls this: offers an easier level once a visit, after 3 wrong in the last 5.
    stuck: function (game) {
      if (!L || asked || at() < 1 || !Loopy.recent) return;
      var r = Loopy.recent.get(game);
      if (r.length < 5 || r.filter(function (v) { return v === 0; }).length < 3) return;
      asked = true;
      setTimeout(easier, 700);
    },
    // A timed game asks at the end of a round: "harder" after a clean round, "easier" after a poor one.
    offer: function (kind) {
      if (!L) return;
      var h = harder();
      if (kind === "harder" && h) Loopy.rewards.celebrate(Loopy.t("levelUpRound"), h.label, true, [{ label: Loopy.t("makeHarder"), fn: h.apply }, { label: Loopy.t("keepGoing") }]);
      else if (kind === "easier" && at() > 0 && !asked) { asked = true; easier(); }
    }
  };
})();

// Loopy day streak: finishing Today's 10, or 10 right answers in any game, on days in a row. Badges at 3, 7 and 30 days.
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
    BADGES: DAY_BADGES, GOAL: 10, clean: clean, // clean is used by Loopy.backup
    // Right answers today in every game together, from the answer log.
    today: function () { return Loopy.log ? Loopy.log.rightToday() : 0; },
    // Loopy.rewards.correct calls this: 10 right today count as a day. Returns a new day badge, if one was just earned.
    answer: function () {
      if (data.last === dayKey(0) || this.today() < this.GOAL) return null;
      return this.finish().badge;
    },
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
  var GAMES = ["plus-minus", "times-share", "clock", "sound-spell", "daily-mix", "make-10", "bigger-smaller", "pizza-fractions", "coins-change", "word-match", "spell-it", "quick-facts", "where-is-it", "equation-balance", "flags-capitals", "times-sprint", "percent-ratio", "sentence-builder", "graphs-data"];
  // What kind of problem it was, so the page can say what to practise. See Loopy.log.kind.
  var KIND = /^(?:(?:add|sub)(?:-rg)?|(?:mul|div)-(?:big|\d{1,2})|cl-(?:0|30|15|5|1|24)|ss-(?:start|end)|mk-(?:10|20|100|1000)|bs-(?:cmp|ord|rnd|dec|neg)|pz-(?:name|cmp|add)|cc-(?:small|count|ch10|ch)|wm-(?:animals|food|home|school)|si-[3-7]|qf-(?:space|animals|body)|wi-(?:cont|eu|euc|wd|wdc)|eb-(?:box|add|mul|two|both)|fc-(?:flag|cap)|pr-(?:frac|any|disc|ratio)|sb-(?:3|5|6|8)|gd-(?:read|total|diff|mean|median|cmp))$/;
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
    // Right answers today in every game together, for the day streak.
    rightToday: function () { var row = data.days[Loopy.dayKey(0)] || {}, n = 0; Object.keys(row).forEach(function (g) { n += row[g][0]; }); return n; },
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
    timeKind: function (m) { return "cl-" + (m === 0 ? 0 : m === 30 ? 30 : m % 15 === 0 ? 15 : m % 5 === 0 ? 5 : 1); },
    // The grown-ups' page opens a game as .../#practise=mul-7 (a kind, or "harder") so the game starts on
    // just that for this visit. Read once; the hint comes off the address so a reload starts normally.
    practise: function () {
      var m = /^#practise=([a-z0-9-]{1,10})$/.exec(location.hash), k = m ? m[1] : "";
      if (!k) return "";
      try { history.replaceState(null, "", location.pathname + location.search); } catch (e) {}
      return k === "harder" || KIND.test(k) ? k : "";
    }
  };
  Loopy.log.hint = Loopy.log.practise();
})();

// Last 5 answers in a game: <div id="last5" data-game="plus-minus"></div> becomes five dots,
// green for right and red for wrong, newest on the right. rewards.correct / wrong fill it in.
// Kept in this browser's localStorage as { "plus-minus": [1, 1, 0, 1, 1], ... }.
(function () {
  var KEY = "loopy.recent", N = 5, GAMES = ["plus-minus", "times-share", "clock", "sound-spell", "daily-mix", "make-10", "bigger-smaller", "pizza-fractions", "coins-change", "word-match", "spell-it", "quick-facts", "where-is-it", "equation-balance", "flags-capitals", "times-sprint", "percent-ratio", "sentence-builder", "graphs-data"];
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

// A new question that was not asked lately: Loopy.fresh(recent, make, keep).
// make() returns a question with a .key; recent is the game's own list of keys, newest last (kept here,
// at most keep long, 10 if not given). When there are too few questions to skip them all, the oldest
// may come back first, so the questions go round and the last one never comes straight back.
// The key also goes on <body data-q>, so the browser test (tools/e2e) can check for repeats.
window.Loopy.fresh = function (recent, make, keep) {
  var q, n, i, avoid;
  for (n = recent.length; n >= 0; n--) {
    avoid = recent.slice(recent.length - n);
    for (i = 0; i < 200; i++) { q = make(); if (avoid.indexOf(q.key) === -1) break; }
    if (avoid.indexOf(q.key) === -1) break;
  }
  recent.push(q.key);
  while (recent.length > (keep || 10)) recent.shift();
  document.body.setAttribute("data-q", q.key);
  return q;
};

// Back button:<a class="home-link" href="../../">&larr; loopy</a> becomes a big button
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
    var own = [].some.call(panel.children, function (c) { return c !== shared && c !== foot && c.id !== "kid-settings"; });
    box.appendChild(head("setShared"));
    panel.insertBefore(box, foot);
    box.appendChild(shared);
    if (own) panel.insertBefore(head("setGame"), panel.firstChild);
    // The best streak in this game, under "This game". Loopy.rewards keeps it fresh while playing.
    var last5 = document.getElementById("last5"), game = last5 && last5.getAttribute("data-game");
    if (own && game && Loopy.rewards) {
      var best = document.createElement("p");
      best.className = "set-best"; best.id = "set-best";
      best.textContent = Loopy.t("bestStreak", { n: Loopy.rewards.get().best[game] || 0 });
      panel.insertBefore(best, panel.children[1]);
    }
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
    // "Level up" on the grown-ups' page opens the game with its levels showing.
    if (Loopy.log && Loopy.log.hint === "harder") panel.hidden = false;
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

// Report a problem: a small flag button in a game's top bar, and the same in Settings. It opens a box with three choices
// (the question is wrong, the answer seems wrong, something looks wrong), an optional note and a
// picture of the screen. "Open GitHub" opens loopy's issue form in a new tab with the details filled
// in; nothing is sent by itself. The picture is made in the browser when the flag is tapped (the page
// is copied into an SVG and drawn on a canvas), so it can be saved and added to the issue by hand.
// Some browsers cannot make it; then the box says to take a screenshot with the device instead.
(function () {
  var FLAG = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 21V4"/><path d="M5 4h11l-2 4 2 4H5"/></svg>';
  Loopy.addStrings({
    en: { report: "Report a problem", rpWhat: "A wrong question or answer, or something that looks wrong." },
    de: { report: "Problem melden", rpWhat: "Eine falsche Aufgabe oder Lösung, oder etwas sieht falsch aus." }
  });
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  }
  // The box, the picture and the GitHub link are in loopy-report.js, loaded the first time the flag is tapped.
  function open(btn) { Loopy.load("report").then(function () { Loopy.report.open(btn); }, function () {}); }

  // The flag sits before ⚙ Settings when the top bar has room. If not, the Settings button shows
  // only its gear; if that is still too wide, the flag hides, then the back button shows only its arrow,
  // then a long name of the child playing is cut short with "…", and last the name hides (the picture stays).
  // "Report a problem" in Settings is always there.
  function fit(head) {
    var steps = ["rp-tight", "rp-hide", "rp-nologo", "rp-short", "rp-noname"];
    steps.forEach(function (c) { head.classList.remove(c); });
    steps.forEach(function (c) { if (head.scrollWidth > head.clientWidth) head.classList.add(c); });
  }
  function build() {
    var head = document.querySelector(".game-bar"), bar = head && head.querySelector(".bar-right");
    var gear = document.getElementById("settings-toggle"), panel = document.getElementById("settings-panel");
    if (!bar || !window.HTMLDialogElement) return;
    var btn = el("button", "report-toggle");
    btn.type = "button";
    btn.innerHTML = FLAG;
    btn.setAttribute("data-t-aria", "report");
    btn.setAttribute("aria-label", Loopy.t("report"));
    btn.title = Loopy.t("report");
    btn.setAttribute("aria-haspopup", "dialog");
    btn.addEventListener("click", function () { open(btn); });
    bar.insertBefore(btn, gear && gear.parentNode === bar ? gear : null);
    if (panel) {
      var row = el("div", "print-row report-row");
      var more = el("button", "print-btn report-open");
      more.type = "button";
      more.innerHTML = FLAG;
      more.appendChild(el("span", "", Loopy.t("report")));
      more.setAttribute("aria-haspopup", "dialog");
      // Close Settings first, so the picture shows the game.
      more.addEventListener("click", function () { if (!panel.hidden && gear) gear.click(); open(gear || more); });
      row.appendChild(more);
      row.appendChild(el("p", "", Loopy.t("rpWhat")));
      panel.insertBefore(row, panel.querySelector(".set-shared") || panel.querySelector(".panel-foot"));
    }
    var refit = function () { fit(head); };
    refit();
    window.addEventListener("resize", refit);
    // The star counter grows with more stars; the fonts change the widths once they load.
    if (window.ResizeObserver) { var chip = document.getElementById("star-chip"); if (chip) new ResizeObserver(refit).observe(chip); }
    if (document.fonts) document.fonts.addEventListener("loadingdone", refit);
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
  var PAD = "#pad button:not(:disabled), #letters button:not(:disabled), #words button:not(:disabled)";
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
  var AREAS = [["#letters", "hintLetters"], ["#words", "hintWords"], ["#pad", "hintPad"], ["#map", "hintMap"], ["#choices", "hintChoices"], ["#answers", "hintChoices"]];
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
// The sheet is hidden on screen; when printing, only the sheet shows (print.css, linked for print only).
// Filling the sheet is in loopy-sheet.js, loaded when the button is tapped or a moment after the game opened.
// A game calls Loopy.worksheet({ ... }) once:
//   title()   the heading, usually the game's name
//   level()   one line about the level, e.g. "Age 8 · Problems: Both"
//   how()     one line telling the child what to do
//   layout    "vert", "line", "clock" or "word": how the 20 problems are laid out
//   make(n)   n problems, from the game's own problem maker
//   cell(p)   a node that shows problem p with room to write
//   answer(p) the answer for the key, as text, e.g. "47 + 25 = 72"
//   quiet     true: no Print worksheet button in Settings (the grown-ups' page prints its own sheet)
(function () {
  var PRINTER = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M6 14h12v7H6z"/></svg>';
  Loopy.addStrings({
    en: { printSheet: "Print worksheet", printNote: "20 problems at this level. Answers on page 2." },
    de: { printSheet: "Arbeitsblatt drucken", printNote: "20 Aufgaben auf dieser Stufe. Lösungen auf Seite 2." }
  });
  var state = { opts: null, sheet: null, filled: false }, linked = false;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  }
  // The print styles are their own small file, fetched for print only, so they never hold up the page.
  function link() {
    if (linked) return;
    linked = true;
    var l = document.createElement("link");
    l.rel = "stylesheet"; l.media = "print"; l.href = Loopy.root + "print.css";
    document.head.appendChild(l);
  }
  function print() {
    Loopy.load("sheet").then(function () { Loopy.sheet.fill(); window.print(); }, function () {});
  }

  Loopy.worksheet = function (o) {
    state.opts = o;
    var build = function () {
      link();
      document.documentElement.classList.add("loopy-print");
      state.sheet = el("section", "loopy-sheet");
      state.sheet.setAttribute("aria-hidden", "true");
      document.body.appendChild(state.sheet);
      // A moment after the game is up, the filling part loads in the background (from the saved copy once
      // the site has been visited), so printing from the browser's own menu also gives a worksheet.
      setTimeout(function () { Loopy.load("sheet").catch(function () {}); }, 3000);
      var panel = document.getElementById("settings-panel");
      if (!panel || o.quiet) return;
      var row = el("div", "print-row");
      var btn = el("button", "print-btn");
      btn.type = "button";
      btn.id = "print-sheet";
      btn.innerHTML = PRINTER;
      btn.appendChild(el("span", "", Loopy.t("printSheet")));
      btn.addEventListener("click", print);
      row.appendChild(btn);
      row.appendChild(el("p", "", Loopy.t("printNote")));
      // Above "Report a problem", the shared settings and the panel foot.
      panel.insertBefore(row, panel.querySelector(".report-row") || panel.querySelector(".set-shared") || panel.querySelector(".panel-foot"));
    };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
    else build();
  };
  Loopy.worksheet.state = state;
  // Printing from the browser's own menu also prints a fresh worksheet (once loopy-sheet.js is in).
  window.addEventListener("beforeprint", function () { if (state.opts && state.sheet && !state.filled && Loopy.sheet) Loopy.sheet.fill(); });
  window.addEventListener("afterprint", function () { state.filled = false; });
})();

// Stars code: moves stars, badges, day streak, progress, game levels and settings to another device.
// The real Loopy.backup is in loopy-backup.js, loaded the first time a code is made or read (home page).
// Until then these stand-ins load it and then do the same call. link and MAX_CODE need no loading.
(function () {
  var MAX_CODE = 40000;
  function later(name, orElse) {
    return function () {
      var args = arguments;
      return Loopy.load("backup").then(function () { return Loopy.backup[name].apply(null, args); }, function () {
        if (orElse === undefined) throw new Error("loopy-backup.js did not load");
        return orElse;
      });
    };
  }
  Loopy.backup = {
    exportCode: later("exportCode"), importCode: later("importCode", false), peek: later("peek", null),
    link: function (code) { return Loopy.root + "#load=" + code; },
    MAX_CODE: MAX_CODE
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
