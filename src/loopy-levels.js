/* loopy: every game's levels in one list, for the grown-ups page. Loaded with Loopy.load("levels")
   only when a page asks for it, so games start without it. The games themselves keep their ladders
   in their own page (Loopy.levels.init); this list mirrors them, so change both together. */
// Each game: keys  the saved settings that decide the level, with {age} standing for the child's age
//            of    how many levels there are
//            at    (values, age) → the 0-based level from the saved values (raw strings or parsed), with the
//                  age's own start level when nothing is saved
//            base  (age) → the level the age picker starts at
//            names {en, de} one short name per level, in the words the game shows next to the score
(function () {
  var Loopy = window.Loopy;
  var num = function (n) { return Loopy.num ? Loopy.num(n) : String(n); };
  // A saved value: games store JSON ("\"mix\"", "100"); accept the bare text too, and anything else is "not set".
  function val(values, key, age) {
    var v = values ? values[key.replace("{age}", age)] : undefined;
    if (typeof v === "string") { try { return JSON.parse(v); } catch (e) { return v; } }
    return v === undefined ? null : v;
  }
  var one = function (v, list) { return list.indexOf(v) === -1 ? null : v; };
  var index = function (v, list, base) { var i = list.indexOf(v); return i === -1 ? base : i; };
  var pair = function (ladder, a, b, base) {
    for (var i = 0; i < ladder.length; i++) if (ladder[i][0] === a && ladder[i][1] === b) return i;
    return base;
  };
  var T = {
    "clock": { keys: ["clockquiz.step.a{age}"], of: 5,
      base: function (a) { return a <= 6 ? 0 : a === 7 ? 1 : a === 8 ? 2 : a === 9 ? 3 : 4; },
      at: function (v, a) { return index(val(v, "clockquiz.step.a{age}", a), [30, 15, 5, 1, 24], this.base(a)); },
      names: { en: ["Hours & halves", "Quarter hours", "Every 5 min", "Every minute", "24-hour time"],
        de: ["Volle & halbe Stunden", "Viertelstunden", "Alle 5 Min.", "Jede Minute", "24-Stunden-Zeit"] } },
    "plus-minus": { keys: ["pm100.max.a{age}", "pm100.rg.a{age}"], of: 7,
      base: function (a) { return a <= 6 ? 0 : a === 7 ? 1 : a === 8 ? 2 : a === 9 ? 3 : a === 10 ? 4 : a === 11 ? 5 : 6; },
      at: function (v, a) {
        var m = one(val(v, "pm100.max.a{age}", a), [20, 100, 1000, 10000, 100000]), rg = val(v, "pm100.rg.a{age}", a);
        if (m === null) return this.base(a);
        return m === 20 ? 0 : m === 100 ? (rg === "no" ? 1 : 2) : m === 1000 ? (rg === "no" ? 3 : 4) : m === 10000 ? 5 : 6;
      },
      names: { en: ["Up to 20", "Up to 100", "Up to 100 with carrying", "Up to " + num(1000), "Up to " + num(1000) + " with carrying", "Up to " + num(10000), "Up to " + num(100000)],
        de: ["Bis 20", "Bis 100", "Bis 100 mit Übertrag", "Bis " + num(1000), "Bis " + num(1000) + " mit Übertrag", "Bis " + num(10000), "Bis " + num(100000)] } },
    "times-share": { keys: ["ts.lv.a{age}"], of: 7,
      base: function (a) { return a <= 6 ? 0 : a <= 10 ? a - 6 : a <= 12 ? 5 : 6; },
      at: function (v, a) { return index(val(v, "ts.lv.a{age}", a), [0, 1, 2, 3, 4, 5, 6], this.base(a)); },
      names: { en: ["Tables of 1, 2, 5 and 10, up to 5 times", "Tables of 2, 5 and 10", "Tables of 2, 3, 4, 5 and 10", "All tables from 2 to 10", "All tables from 2 to 12", "Two-digit numbers times or shared by one digit", "Bigger numbers: three digits by one, or two digits by two"],
        de: ["Reihen 1, 2, 5 und 10, bis 5 mal", "Reihen 2, 5 und 10", "Reihen 2, 3, 4, 5 und 10", "Alle Reihen von 2 bis 10", "Alle Reihen von 2 bis 12", "Zweistellige Zahlen mal oder geteilt durch eine Ziffer", "Größere Zahlen: dreistellig mal einstellig oder zweistellig mal zweistellig"] } },
    "make-10": { keys: ["mk.lv.a{age}"], of: 5,
      base: function (a) { return a <= 6 ? 0 : a === 7 ? 1 : a === 8 ? 2 : a === 9 ? 3 : 4; },
      at: function (v, a) { return index(val(v, "mk.lv.a{age}", a), ["10", "20", "tens", "100", "1000"], this.base(a)); },
      names: { en: ["Make 10", "Make 20", "Tens to 100", "Make 100", "Make " + num(1000)], de: ["Bis 10", "Bis 20", "Zehner bis 100", "Bis 100", "Bis " + num(1000)] } },
    "bigger-smaller": { keys: ["bs.level.a{age}"], of: 6,
      base: function (a) { return a <= 6 ? 0 : a >= 11 ? 5 : a - 6; },
      at: function (v, a) { return index(val(v, "bs.level.a{age}", a), [0, 1, 2, 3, 4, 5], this.base(a)); },
      names: { en: ["Up to 20", "Up to 100", "Up to " + num(1000), "Up to " + num(10000), "Up to " + num(100000), "Decimals and minus"],
        de: ["Bis 20", "Bis 100", "Bis " + num(1000), "Bis " + num(10000), "Bis " + num(100000), "Komma und Minus"] } },
    "pizza-fractions": { keys: ["pz.level.a{age}", "pz.mode.a{age}"], of: 5,
      base: function (a) { return a <= 7 ? 0 : a <= 8 ? 1 : a === 9 ? 2 : a === 10 ? 3 : 4; },
      at: function (v, a) {
        var l = one(val(v, "pz.level.a{age}", a), [0, 1, 2]), m = one(val(v, "pz.mode.a{age}", a), ["name", "cmp", "add", "mix"]);
        if (l === null && m === null) return this.base(a);
        if (l === null) l = a <= 7 ? 0 : a <= 10 ? 1 : 2;
        if (m === null) m = a <= 8 ? "name" : a === 9 ? "cmp" : a === 10 ? "add" : "mix";
        return pair([[0, "name"], [1, "name"], [1, "cmp"], [1, "add"], [2, "mix"]], l, m, m === "name" ? (l ? 1 : 0) : m === "cmp" ? 2 : m === "add" ? 3 : 4);
      },
      names: { en: ["Name it, 4 pieces", "Name it, 8 pieces", "Compare, 8 pieces", "Add, 8 pieces", "All mixed, 12 pieces"],
        de: ["Benennen, 4 Stücke", "Benennen, 8 Stücke", "Vergleichen, 8 Stücke", "Plus, 8 Stücke", "Gemischt, 12 Stücke"] } },
    "coins-change": { keys: ["cc.lv.a{age}"], of: 5,
      base: function (a) { return a <= 6 ? 0 : a === 7 ? 1 : a === 8 ? 2 : a === 9 ? 3 : 4; },
      at: function (v, a) { return index(val(v, "cc.lv.a{age}", a), ["small", "count", "easy", "change", "big"], this.base(a)); },
      names: { en: ["Small coins", "Count it all", "Easy change", "Change", "Pay with 20 or 50"],
        de: ["Kleine Münzen", "Alles zählen", "Leichtes Wechselgeld", "Wechselgeld", "Mit 20 oder 50 zahlen"] } },
    "equation-balance": { keys: ["eb.lv.a{age}"], of: 5,
      base: function (a) { return a <= 10 ? 0 : a === 11 ? 1 : a === 12 ? 2 : a <= 14 ? 3 : 4; },
      at: function (v, a) { return index(val(v, "eb.lv.a{age}", a), ["box", "add", "mul", "two", "both"], this.base(a)); },
      names: { en: ["□ + 4 = 9", "x + 4 = 9", "3x = 12", "3x + 4 = 19", "x on both sides"], de: ["□ + 4 = 9", "x + 4 = 9", "3x = 12", "3x + 4 = 19", "x auf beiden Seiten"] } },
    "times-sprint": { keys: ["tt.lv.a{age}"], of: 5,
      base: function (a) { return a <= 7 ? 0 : a === 8 ? 1 : a === 9 ? 2 : a <= 11 ? 3 : 4; },
      at: function (v, a) { return index(val(v, "tt.lv.a{age}", a), [0, 1, 2, 3, 4], this.base(a)); },
      names: { en: ["Tables of 1, 2 and 10, up to 5 times", "Tables of 2, 5 and 10", "All tables up to 10 × 10", "All tables up to 12 × 12", "All tables up to 12 × 12, with sharing mixed in"],
        de: ["Reihen 1, 2 und 10, bis 5 mal", "Reihen 2, 5 und 10", "Alle Reihen bis 10 × 10", "Alle Reihen bis 12 × 12", "Alle Reihen bis 12 × 12, gemischt mit Teilen"] } },
    "percent-ratio": { keys: ["pr.level.a{age}"], of: 4,
      base: function (a) { return a <= 11 ? 0 : a === 12 ? 1 : a <= 14 ? 2 : 3; },
      at: function (v, a) { return index(val(v, "pr.level.a{age}", a), ["frac", "any", "disc", "ratio"], this.base(a)); },
      names: { en: ["Halves, quarters and tenths", "Any percent", "Discounts and increases", "Ratios and scale"],
        de: ["Hälften, Viertel und Zehntel", "Jeder Prozentsatz", "Rabatt und Aufschlag", "Verhältnis und Maßstab"] } },
    "graphs-data": { keys: ["gd.level.a{age}"], of: 4,
      base: function (a) { return a <= 9 ? 0 : a <= 11 ? 1 : a === 12 ? 2 : 3; },
      at: function (v, a) { return index(val(v, "gd.level.a{age}", a), [1, 2, 3, 4], this.base(a)); },
      names: { en: ["Bar charts and pictograms", "Tables and line charts", "Mean and median", "Two charts compared"],
        de: ["Balkendiagramme und Piktogramme", "Tabellen und Liniendiagramme", "Mittelwert und Median", "Zwei Diagramme vergleichen"] } },
    "box-multiply": { keys: ["bm.level.a{age}"], of: 6,
      base: function (a) { return a <= 7 ? 0 : a >= 12 ? 5 : a - 7; },
      at: function (v, a) { return index(val(v, "bm.level.a{age}", a), [0, 1, 2, 3, 4, 5], this.base(a)); },
      names: { en: ["Two digits × 2 to 5", "Two digits × one digit", "Three digits × one digit", "Two digits × two digits", "Three digits × two digits", "Decimals"],
        de: ["Zweistellig × 2 bis 5", "Zweistellig × einstellig", "Dreistellig × einstellig", "Zweistellig × zweistellig", "Dreistellig × zweistellig", "Kommazahlen"] } },
    "step-by-step": { keys: ["st.lv.a{age}"], of: 6,
      base: function (a) { return a <= 6 ? 0 : a <= 10 ? a - 6 : 5; },
      at: function (v, a) { return index(val(v, "st.lv.a{age}", a), [0, 1, 2, 3, 4, 5], this.base(a)); },
      names: { en: ["Over the ten, to 20", "Up to " + num(100), "Up to " + num(100) + " with carrying", "Up to " + num(1000), "Up to " + num(1000) + " with carrying", "Up to " + num(10000)],
        de: ["Über den Zehner, bis 20", "Bis " + num(100), "Bis " + num(100) + " mit Übertrag", "Bis " + num(1000), "Bis " + num(1000) + " mit Übertrag", "Bis " + num(10000)] } },
    "sound-spell": { keys: ["ss.mode.a{age}", "ss.choices.a{age}"], of: 3,
      base: function (a) { return a <= 6 ? 0 : 2; },
      at: function (v, a) {
        var m = one(val(v, "ss.mode.a{age}", a), ["start", "end", "mix"]), c = one(val(v, "ss.choices.a{age}", a), [3, 4]);
        if (m === null && c === null) return this.base(a);
        if (c === null) c = a <= 6 ? 3 : 4;
        if (m === null) m = a <= 6 ? "start" : "mix";
        return c === 4 ? 2 : m === "start" ? 0 : 1;
      },
      names: { en: ["Starting sounds, 3 choices", "Both sounds, 3 choices", "Both sounds, 4 choices"],
        de: ["Anlaute, 3 Antworten", "Beide Laute, 3 Antworten", "Beide Laute, 4 Antworten"] } },
    "word-match": { keys: ["wm.level.a{age}"], of: 3,
      base: function (a) { return a <= 6 ? 0 : a <= 8 ? 1 : 2; },
      at: function (v, a) { return index(val(v, "wm.level.a{age}", a), [3, 4, 5], this.base(a)); },
      names: { en: ["3 words", "4 words", "4, tricky"], de: ["3 Wörter", "4 Wörter", "4, knifflig"] } },
    "spell-it": { keys: ["si.len.a{age}"], of: 5,
      base: function (a) { return a <= 6 ? 0 : a === 7 ? 1 : a === 8 ? 2 : a === 9 ? 3 : 4; },
      at: function (v, a) { return index(val(v, "si.len.a{age}", a), [3, 4, 5, 6, 7], this.base(a)); },
      names: { en: ["3 letters", "4 letters", "5 letters", "6 letters", "7 to 8 letters"], de: ["3 Buchstaben", "4 Buchstaben", "5 Buchstaben", "6 Buchstaben", "7 bis 8 Buchstaben"] } },
    "sentence-builder": { keys: ["sb.level.a{age}"], of: 4,
      base: function (a) { return a <= 7 ? 0 : a <= 9 ? 1 : a === 10 ? 2 : 3; },
      at: function (v, a) { return index(val(v, "sb.level.a{age}", a), [1, 2, 3, 4], this.base(a)); },
      names: { en: ["3 words", "4 to 5 words", "6 words, with questions", "7 to 8 words, with a comma"], de: ["3 Wörter", "4 bis 5 Wörter", "6 Wörter, mit Fragen", "7 bis 8 Wörter, mit Komma"] } },
    "spelling-quiz": { keys: ["sq.level.a{age}"], of: 5,
      base: function (a) { return a <= 6 ? 0 : a === 7 ? 1 : a === 8 ? 2 : a <= 10 ? 3 : 4; },
      at: function (v, a) { return index(val(v, "sq.level.a{age}", a), [1, 2, 3, 4, 5], this.base(a)); },
      names: { en: ["Grade 1 words", "Grade 2 words", "Grade 3 words", "Grade 4 to 5 words", "Grade 6 words and up"],
        de: ["Wörter Klasse 1", "Wörter Klasse 2", "Wörter Klasse 3", "Wörter Klasse 4 bis 5", "Wörter ab Klasse 6"] } },
    "word-detective": { keys: ["wd.level.a{age}"], of: 5,
      base: function (a) { return a <= 6 ? 0 : a <= 8 ? 1 : a <= 10 ? 2 : a <= 12 ? 3 : 4; },
      at: function (v, a) { return index(val(v, "wd.level.a{age}", a), [1, 2, 3, 4, 5], this.base(a)); },
      names: { en: ["3 letters", "4 letters", "5 letters", "5 letters, tricky", "6 letters"],
        de: ["3 Buchstaben", "4 Buchstaben", "5 Buchstaben", "5 Buchstaben, knifflig", "6 Buchstaben"] } },
    "word-trail": { keys: ["wt.level.a{age}"], of: 5,
      base: function (a) { return a <= 7 ? 0 : a <= 9 ? 1 : a <= 11 ? 2 : a <= 13 ? 3 : 4; },
      at: function (v, a) { return index(val(v, "wt.level.a{age}", a), [1, 2, 3, 4, 5], this.base(a)); },
      names: { en: ["4 × 4, straight", "5 × 5, one bend", "6 × 6, bends", "6 × 6, 5 words", "6 × 6, long words"],
        de: ["4 × 4, gerade", "5 × 5, ein Knick", "6 × 6, mit Knicken", "6 × 6, 5 Wörter", "6 × 6, lange Wörter"] } },
    "shapes-angles": { keys: ["sh.level.a{age}"], of: 5,
      base: function (a) { return a <= 8 ? 0 : a === 9 ? 1 : a === 10 ? 2 : a <= 12 ? 3 : 4; },
      at: function (v, a) { return index(val(v, "sh.level.a{age}", a), [1, 2, 3, 4, 5], this.base(a)); },
      names: { en: ["Shapes, corners and sides", "Lines and symmetry", "Perimeter and area", "Angles", "Triangles and formulas"],
        de: ["Formen, Ecken und Seiten", "Linien und Symmetrie", "Umfang und Fläche", "Winkel", "Dreiecke und Formeln"] } },
    "quick-facts": { keys: ["qf.level.a{age}"], of: 3,
      base: function (a) { return a <= 8 ? 0 : a <= 10 ? 1 : 2; },
      at: function (v, a) { return index(val(v, "qf.level.a{age}", a), [1, 2, 3], this.base(a)); },
      names: { en: ["Starter", "Explorer", "Expert"], de: ["Einsteiger", "Entdecker", "Profi"] } },
    "sort-it": { keys: ["so.level.a{age}"], of: 4,
      base: function (a) { return a <= 7 ? 0 : a === 8 ? 1 : a <= 10 ? 2 : 3; },
      at: function (v, a) { return index(val(v, "so.level.a{age}", a), [1, 2, 3, 4], this.base(a)); },
      names: { en: ["Animals and living things", "Materials and matter", "Food, space and senses", "All mixed, with tricky ones"],
        de: ["Tiere und Lebewesen", "Materialien und Stoffe", "Essen, Weltall und Sinne", "Alles gemischt, mit kniffligen"] } },
    "where-is-it": { keys: ["wi.map.a{age}", "wi.find.a{age}"], of: 5,
      base: function (a) { return a <= 8 ? 0 : a <= 10 ? 1 : a === 11 ? 2 : a === 12 ? 3 : 4; },
      at: function (v, a) {
        var m = one(val(v, "wi.map.a{age}", a), ["cont", "eu", "world"]), f = one(val(v, "wi.find.a{age}", a), ["land", "cap"]);
        if (m === null && f === null) return this.base(a);
        if (m === null) m = a <= 8 ? "cont" : a <= 11 ? "eu" : "world";
        if (f === null) f = a === 11 || a >= 13 ? "cap" : "land";
        return m === "cont" ? 0 : (m === "eu" ? 1 : 3) + (f === "cap" ? 1 : 0);
      },
      names: { en: ["Continents and oceans", "Countries of Europe", "Capitals of Europe", "Countries of the world", "Capitals of the world"],
        de: ["Kontinente und Ozeane", "Länder Europas", "Hauptstädte Europas", "Länder der Welt", "Hauptstädte der Welt"] } },
    "flags-capitals": { keys: ["fc.region.a{age}", "fc.mode.a{age}"], of: 4,
      base: function (a) { return (a <= 10 ? 0 : 2) + (a >= 13 ? 1 : 0); },
      at: function (v, a) {
        var r = one(val(v, "fc.region.a{age}", a), ["eu", "world"]), m = one(val(v, "fc.mode.a{age}", a), ["flag", "cap"]);
        if (r === null && m === null) return this.base(a);
        if (r === null) r = a <= 10 ? "eu" : "world";
        if (m === null) m = a >= 13 ? "cap" : "flag";
        return (r === "world" ? 2 : 0) + (m === "cap" ? 1 : 0);
      },
      names: { en: ["Flags of Europe", "Europe with capitals", "Flags of the world", "World with capitals"],
        de: ["Flaggen Europas", "Europa mit Hauptstädten", "Flaggen der Welt", "Welt mit Hauptstädten"] } }
  };
  Loopy.levelsTable = T;
  // The level a child is on in one game, for the age given (or the age picker's), read from Loopy.store:
  // { at, of, base, name } or null for a game without levels (Today's 10).
  Loopy.levelOf = function (game, age) {
    var g = T[game]; if (!g) return null;
    if (age === undefined) age = Loopy.getAge();
    var values = {};
    g.keys.forEach(function (k) { k = k.replace("{age}", age); values[k] = Loopy.store.get(k); });
    var at = Math.max(0, Math.min(g.of - 1, g.at(values, age) | 0)), names = g.names[Loopy.lang] || g.names.en;
    // The age went up since the child reached a higher level: the game will carry it over when opened (Loopy.levels).
    var rec = Loopy.levels ? Loopy.levels.seen()[game] : null;
    if (rec && rec.length === 4 && rec[3] < age && rec[0] > at) at = Math.min(g.of - 1, rec[0]);
    return { at: at, of: g.of, base: g.base(age), name: names[at] };
  };
})();
