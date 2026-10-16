/* loopy: Report a problem, the box. Loaded by loopy.js (Loopy.load("report")) the first time the flag is
   tapped, so every page starts without it. The flag button itself and its Settings row are in loopy.js. */
// Report a problem: the box behind the flag button. It opens a box with three choices
// (the question is wrong, the answer seems wrong, something looks wrong), an optional note and a
// picture of the screen. "Open GitHub" opens loopy's issue form in a new tab with the details filled
// in; nothing is sent by itself. The picture is made in the browser when the flag is tapped (the page
// is copied into an SVG and drawn on a canvas), so it can be saved and added to the issue by hand.
// Some browsers cannot make it; then the box says to take a screenshot with the device instead.
(function () {
  var REPO = "https://github.com/amalrajvinoth/loopy/issues/new";
  var NOTE = 200, SHOWN = 400;
  // The issue is read in English, so the kinds have a fixed English name next to the shown one.
  var KINDS = [["question", "The question is wrong"], ["answer", "The answer seems wrong"], ["looks", "Something looks wrong"]];
  Loopy.addStrings({
    en: {
      reportPick: "What is wrong?", rpQuestion: "The question is wrong",
      rpAnswer: "The answer seems wrong", rpLooks: "Something looks wrong", rpNote: "Anything else? (optional)",
      rpNoteHint: "For example: 7 + 5 should be 12", rpPicture: "Picture of the screen", rpMaking: "Making a picture…",
      rpSave: "Save picture", rpNoPic: "No picture on this device. Take a screenshot with your device's buttons instead.",
      rpWarn: "This opens GitHub in a new tab. GitHub is public and for ages 13 and up, so a grown-up should send it. Do not write a child's name or other personal details.",
      rpOpen: "Open GitHub", rpCopy: "Copy text", rpCopied: "Copied", rpCancel: "Close", rpPickFirst: "Pick one first."
    },
    de: {
      reportPick: "Was ist falsch?", rpQuestion: "Die Aufgabe ist falsch",
      rpAnswer: "Die Lösung scheint falsch", rpLooks: "Etwas sieht falsch aus", rpNote: "Noch etwas? (freiwillig)",
      rpNoteHint: "Zum Beispiel: 7 + 5 ist 12", rpPicture: "Bild vom Bildschirm", rpMaking: "Bild wird gemacht…",
      rpSave: "Bild speichern", rpNoPic: "Auf diesem Gerät gibt es kein Bild. Mach stattdessen ein Bildschirmfoto mit den Tasten deines Geräts.",
      rpWarn: "Das öffnet GitHub in einem neuen Tab. GitHub ist öffentlich und ab 13 Jahren, darum sollte ein Erwachsener es senden. Schreib keinen Namen eines Kindes und nichts Persönliches.",
      rpOpen: "GitHub öffnen", rpCopy: "Text kopieren", rpCopied: "Kopiert", rpCancel: "Schließen", rpPickFirst: "Wähl zuerst etwas aus."
    }
  });
  var LABELS = { question: "rpQuestion", answer: "rpAnswer", looks: "rpLooks" };

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  }
  var flat = function (s, max) { s = String(s || "").replace(/\s+/g, " ").trim(); return s.length > max ? s.slice(0, max - 1) + "…" : s; };

  // loopy's version: the VERSION in sw.js, which changes whenever any file of the site changes.
  var version = null;
  function getVersion() {
    if (version || !window.fetch) return Promise.resolve(version);
    return fetch(Loopy.root + "sw.js").then(function (r) { return r.text(); }).then(function (t) {
      var m = /VERSION="([0-9a-f]{6,32})"/.exec(t);
      version = m ? m[1] : null;
      return version;
    }).catch(function () { return null; });
  }

  // What the issue says: the choice, the game, what is on screen, the last answer and the settings.
  // Fixed words are in English for whoever reads the issue. The child's name is never in it.
  function details(state, kind, note) {
    var last = Loopy.rewards && Loopy.rewards.last ? Loopy.rewards.last() : null, d = last && last.d;
    var lines = [
      "**Problem:** " + kind[1],
      "**Game:** " + state.game + " (`" + location.pathname + "`)",
      "**On screen:** " + (state.screen || "-")
    ];
    if (last) lines.push("**Last answer:** " + (last.ok ? "right" : d ? "wrong. Question: " + flat(d.q, 60) + ". Game says: " + flat(d.a, 60) + ". Answered: " + flat(d.y, 60) : "wrong"));
    lines.push("**Age:** " + (Loopy.getAge ? Loopy.getAge() : "-") + " · **Language:** " + Loopy.lang +
      " · **Theme:** " + (document.documentElement.getAttribute("data-theme") || "-") +
      " · **Easier to read:** " + (document.documentElement.getAttribute("data-font") === "easy" ? "on" : "off"));
    lines.push("**Screen:** " + state.w + " × " + state.h + (state.w > state.h ? " landscape" : " portrait") + " · **Browser:** " + flat(navigator.userAgent, 200));
    lines.push("**loopy version:** " + (version || "-"));
    if (note) lines.push("", "**Note:** " + note);
    return lines.join("\n");
  }
  function issueUrl(state, kind, note) {
    var q = { template: "game-report.yml", title: "Game problem: " + state.game + ": " + kind[1], details: details(state, kind, note) };
    return REPO + "?" + Object.keys(q).map(function (k) { return k + "=" + encodeURIComponent(q[k]); }).join("&");
  }

  // The picture. The page is copied as it is when the flag is tapped, with the site's styles and
  // fonts inside, into an SVG <foreignObject>, then drawn on a canvas and saved as a PNG.
  // Every file it reads comes from loopy itself. Resolves to a PNG data: URL, or null if the browser can't.
  function copyPage() {
    var root = document.documentElement, body = document.body.cloneNode(true);
    body.querySelectorAll("script, noscript, dialog, .loopy-confetti").forEach(function (n) { n.remove(); });
    // Typed text lives in the input, not in the copy.
    var from = document.body.querySelectorAll("input"), to = body.querySelectorAll("input");
    for (var i = 0; i < from.length && i < to.length; i++) to[i].setAttribute("value", from[i].value);
    return { body: body, w: innerWidth, h: innerHeight, x: scrollX, y: scrollY,
      attrs: ["data-theme", "data-font", "lang"].map(function (a) { return [a, root.getAttribute(a)]; }), cls: root.className };
  }
  function fontData(url) {
    return fetch(url).then(function (r) { if (!r.ok) throw r; return r.blob(); }).then(function (b) {
      return new Promise(function (ok, no) { var f = new FileReader(); f.onload = function () { ok(f.result); }; f.onerror = no; f.readAsDataURL(b); });
    });
  }
  function styles() {
    var easy = document.documentElement.getAttribute("data-font") === "easy", css = [], fonts = [];
    Array.prototype.forEach.call(document.styleSheets, function (sheet) {
      var rules; try { rules = sheet.cssRules; } catch (e) { return; }
      Array.prototype.forEach.call(rules, function (r) {
        var t = r.cssText;
        if (r.type !== 5) return css.push(t); // 5: @font-face
        // Only the fonts this page shows: the -latin files, and Atkinson only when "Easier to read" is on.
        var m = /url\("?([^")]+-latin\.woff2)"?\)/.exec(t);
        if (!m || (!easy && /Atkinson/.test(t))) return;
        var url = new URL(m[1], sheet.href || location.href).href;
        fonts.push(fontData(url).then(function (data) { return t.replace(m[0], 'url("' + data + '")'); }, function () { return ""; }));
      });
    });
    // Inside the picture the page is a <div>, so :root, html and body rules point at stand-ins.
    var text = css.join("\n").replace(/:root/g, ".lp-root").replace(/(^|[\s,>+~(}])html(?=[\s,.:\[{>+~)])/g, "$1.lp-root")
      .replace(/(^|[\s,>+~(}])body(?=[\s,.:\[{>+~)])/g, "$1.lp-body");
    return Promise.all(fonts).then(function (f) { return f.join("\n") + "\n" + text; });
  }
  function picture(copy) {
    if (!window.XMLSerializer || !window.fetch) return Promise.resolve(null);
    return styles().then(function (css) {
      var wrap = el("div", "lp-root " + copy.cls);
      copy.attrs.forEach(function (a) { if (a[1] !== null) wrap.setAttribute(a[0], a[1]); });
      var body = el("div", "lp-body " + (document.body.className || ""));
      while (copy.body.firstChild) body.appendChild(copy.body.firstChild);
      // The picture shows the part of the page that was on screen.
      var shift = ".lp-root{width:" + copy.w + "px;height:" + copy.h + "px;overflow:hidden}" +
        (copy.x || copy.y ? ".lp-root>.lp-body{transform:translate(" + -copy.x + "px," + -copy.y + "px)}" : "");
      wrap.appendChild(el("style", "", css + "\n" + shift));
      wrap.appendChild(body);
      var html = new XMLSerializer().serializeToString(wrap);
      var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + copy.w + '" height="' + copy.h + '"><foreignObject width="100%" height="100%">' + html + "</foreignObject></svg>";
      return new Promise(function (ok) {
        var img = new Image(), scale = Math.min(2, window.devicePixelRatio || 1);
        img.onload = function () {
          try {
            var c = document.createElement("canvas");
            c.width = Math.round(copy.w * scale); c.height = Math.round(copy.h * scale);
            var g = c.getContext("2d");
            g.scale(scale, scale);
            g.drawImage(img, 0, 0);
            ok(c.toDataURL("image/png"));
          } catch (e) { ok(null); } // Some browsers do not allow reading back a drawn SVG.
        };
        img.onerror = function () { ok(null); };
        img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
      });
    }).catch(function () { return null; });
  }

  function open(btn) {
    var card = document.getElementById("card") || document.querySelector("main");
    var h1 = document.querySelector("h1");
    var state = { game: flat(h1 ? h1.textContent : document.title, 60), screen: flat(card ? card.innerText : "", SHOWN), w: innerWidth, h: innerHeight };
    var shot = picture(copyPage()), kind = null;
    getVersion();

    var dlg = el("dialog", "kid-dialog report-dialog");
    dlg.setAttribute("aria-labelledby", "report-title");
    var form = el("form");
    form.method = "dialog";
    var head = el("h2", "", Loopy.t("report"));
    head.id = "report-title";
    form.appendChild(head);

    // Two parts, side by side on short landscape screens: the choices and note, then the picture and buttons.
    var partA = el("div", "report-part"), partB = el("div", "report-part");
    form.appendChild(partA); form.appendChild(partB);
    partA.appendChild(el("span", "kid-label", Loopy.t("reportPick")));
    var kinds = el("div", "report-kinds");
    kinds.setAttribute("role", "group");
    kinds.setAttribute("aria-label", Loopy.t("reportPick"));
    var pickFirst = el("p", "report-pick", "");
    pickFirst.setAttribute("aria-live", "polite");
    KINDS.forEach(function (k) {
      var b = el("button", "", Loopy.t(LABELS[k[0]]));
      b.type = "button";
      b.setAttribute("aria-pressed", "false");
      b.addEventListener("click", function () {
        kind = k;
        pickFirst.textContent = "";
        kinds.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
        sync();
      });
      kinds.appendChild(b);
    });
    partA.appendChild(kinds);
    partA.appendChild(pickFirst);

    var label = el("label", "kid-field");
    label.appendChild(el("span", "", Loopy.t("rpNote")));
    var input = el("input");
    input.type = "text"; input.maxLength = NOTE; input.autocomplete = "off";
    input.placeholder = Loopy.t("rpNoteHint");
    input.addEventListener("input", sync);
    label.appendChild(input);
    partA.appendChild(label);

    // The picture, as a small preview with a "Save picture" link.
    var pic = el("div", "report-pic");
    pic.setAttribute("aria-label", Loopy.t("rpPicture"));
    pic.setAttribute("role", "group");
    var status = el("p", "", Loopy.t("rpMaking"));
    status.setAttribute("aria-live", "polite");
    pic.appendChild(status);
    partB.appendChild(pic);
    shot.then(function (url) {
      if (!dlg.isConnected) return;
      if (!url) { status.textContent = Loopy.t("rpNoPic"); return; }
      var img = el("img");
      img.src = url; img.alt = Loopy.t("rpPicture");
      var save = el("a", "kid-btn quiet", Loopy.t("rpSave"));
      save.href = url;
      save.download = "loopy-" + location.pathname.split("/").filter(Boolean).pop() + ".png";
      pic.replaceChild(img, status);
      pic.appendChild(save);
    });

    partB.appendChild(el("p", "report-warn", Loopy.t("rpWarn")));

    var foot = el("div", "kid-foot");
    var close = el("button", "kid-btn quiet", Loopy.t("rpCancel"));
    close.type = "button";
    close.addEventListener("click", function () { dlg.close(); });
    var copyBtn = el("button", "kid-btn quiet", Loopy.t("rpCopy"));
    copyBtn.type = "button";
    copyBtn.addEventListener("click", function () {
      if (!kind) return need();
      var text = details(state, kind, flat(input.value, NOTE));
      var done = function () { copyBtn.textContent = Loopy.t("rpCopied"); setTimeout(function () { copyBtn.textContent = Loopy.t("rpCopy"); }, 2000); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, function () {});
    });
    var go = el("a", "kid-btn", Loopy.t("rpOpen"));
    go.target = "_blank"; go.rel = "noopener noreferrer";
    go.addEventListener("click", function (e) { if (!kind) { e.preventDefault(); need(); } });
    foot.appendChild(close);
    if (navigator.clipboard) foot.appendChild(copyBtn);
    foot.appendChild(go);
    partB.appendChild(foot);

    function need() { pickFirst.textContent = Loopy.t("rpPickFirst"); var f = kinds.querySelector("button"); if (f) f.focus(); }
    function sync() { go.href = kind ? issueUrl(state, kind, flat(input.value, NOTE)) : "#"; }
    sync();
    // The version arrives after the box opens; refresh the link when it does.
    getVersion().then(sync);

    dlg.appendChild(form);
    dlg.addEventListener("close", function () {
      dlg.remove();
      btn.focus({ preventScroll: true });
    });
    document.body.appendChild(dlg);
    dlg.showModal();
    var first = kinds.querySelector("button");
    if (first) first.focus();
  }

  Loopy.report = { open: open };
})();
