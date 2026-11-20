/* loopy: the first visit (Loopy.hello). The home page loads it only on a browser that has nothing from
   loopy yet, and on any device where Family sync is off, to show the family code row under My stars. */
// The welcome sheet: three small steps on the very first visit. 1 "Hi! Who is playing?" (name, picture,
// age of the child the device already has, so nothing is added twice). 2 "For grown-ups: keep the stars
// on every device": Make a family code (the code and its QR code appear right there), I already have a
// code (the Join box), or Later. 3 "All set!" and Let's play. Skip on every step; Esc or a tap outside
// closes it too. It is shown once per browser: "loopy.hello" = { w: 1, n: "day Not now was tapped" },
// device-wide like loopy.lang. It never shows on a device that has anything saved, and never when a
// link with #family= or #load= opened the page.
// The family code row: under My stars, on every visit while no family code is set, with Turn on, Join
// with a code and Not now (hides it for today). Nothing is sent until a grown-up taps Turn on or Join.
(function () {
  var Loopy = window.Loopy, KEY = "loopy.hello", el = Loopy.el, t = Loopy.t;

  Loopy.addStrings({
    en: { hiTitle: "Hi! Who is playing?", hiStep: "Step {a} of {b}", hiSkip: "Skip", hiNext: "Next", hiLater: "Later",
      hiGrown: "For grown-ups", hiKeep: "Keep the stars on every device",
      hiKeepText: "A family code keeps the stars the same on the phone, the tablet and the computer. Everything is locked on this device first. No account, no email.",
      hiMake: "Make a family code", hiHave: "I already have a code", hiJoin: "Join with a code",
      hiReady: "All set, {name}!", hiReadyNo: "All set!",
      hiReadyText: "Your stars, badges and levels are safe on this device. Grown-ups find the family code under ⚙ Settings.",
      hiPlay: "Let's play!", hiNotNow: "Not now", hiOn: "Turn on",
      hiRowText: "With a family code the stars are on the tablet and on Mum's or Dad's phone too. Nothing is sent until you turn it on.",
      hiRowDone: "Done. The code is also under ⚙ Settings, Family sync." },
    de: { hiTitle: "Hallo! Wer spielt?", hiStep: "Schritt {a} von {b}", hiSkip: "Überspringen", hiNext: "Weiter", hiLater: "Später",
      hiGrown: "Für Erwachsene", hiKeep: "Sterne auf allen Geräten behalten",
      hiKeepText: "Ein Familien-Code hält die Sterne auf Handy, Tablet und Computer gleich. Alles wird zuerst auf diesem Gerät verschlossen. Kein Konto, keine E-Mail.",
      hiMake: "Familien-Code erstellen", hiHave: "Ich habe schon einen Code", hiJoin: "Mit Code beitreten",
      hiReady: "Alles bereit, {name}!", hiReadyNo: "Alles bereit!",
      hiReadyText: "Deine Sterne, Abzeichen und Stufen sind auf diesem Gerät sicher. Erwachsene finden den Familien-Code unter ⚙ Einstellungen.",
      hiPlay: "Los geht's!", hiNotNow: "Nicht jetzt", hiOn: "Einschalten",
      hiRowText: "Mit einem Familien-Code sind die Sterne auch auf dem Tablet und dem Handy von Mama oder Papa. Nichts wird gesendet, bis du ihn einschaltest.",
      hiRowDone: "Fertig. Der Code steht auch unter ⚙ Einstellungen, Familien-Sync." }
  });

  // ---- the flag ----
  function read() {
    var s;
    try { s = JSON.parse(localStorage.getItem(KEY)); } catch (e) { return {}; }
    if (!s || typeof s !== "object") return {};
    return { w: s.w === 1 ? 1 : 0, n: /^\d{4}-\d{2}-\d{2}$/.test(s.n) ? s.n : "" };
  }
  function write(f) { try { localStorage.setItem(KEY, JSON.stringify(f)); } catch (e) {} }
  function mark(k, v) { var f = read(); f[k] = v; write(f); }

  function btn(text, cls) { var b = el("button", cls || "kid-btn", text); b.type = "button"; return b; }
  // The shield: the picture of "safe on every device".
  function shield() {
    var ns = "http://www.w3.org/2000/svg", s = document.createElementNS(ns, "svg"), p1 = document.createElementNS(ns, "path"), p2 = document.createElementNS(ns, "path");
    s.setAttribute("viewBox", "0 0 24 24"); s.setAttribute("class", "hello-shield"); s.setAttribute("aria-hidden", "true");
    p1.setAttribute("d", "M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6z");
    p2.setAttribute("d", "M8.5 12l2.5 2.5 4.5-5");
    s.append(p1, p2);
    return s;
  }
  // "Step 2 of 3" above the title, and the three dots under the buttons.
  // The same small uppercase pill as the cards ("Every day") and the family code row ("For grown-ups").
  function stepTag(a, b, grown) { return el("span", "tag", (grown ? t("hiGrown") + " · " : "") + t("hiStep", { a: a, b: b })); }
  function dots(a, b) {
    var d = el("div", "hello-dots");
    d.setAttribute("aria-hidden", "true");
    for (var i = 1; i <= b; i++) d.appendChild(el("i", i === a ? "on" : ""));
    return d;
  }
  // The family code part, filled by loopy-sync.js: busy, then the code with its QR code, or the Join box.
  function syncPart(box, mode, after) {
    return Loopy.load("sync").then(function () { return Loopy.sync.panel(box, mode); }).then(function (r) {
      if (after) after(r);
      return r;
    }, function () { if (after) after("off"); return "off"; });
  }

  // ---- the welcome sheet ----
  function welcome() {
    var kid = Loopy.kids.current(), PICS = Loopy.kids.PICS, steps = Loopy.syncHost ? 3 : 2, changed = false;
    var dlg = el("dialog", "kid-dialog hello"), form = el("form");
    form.method = "dialog";
    dlg.setAttribute("aria-labelledby", "hello-title");
    dlg.appendChild(form);
    // Shown once: the flag goes first, so a reload or a close in the middle never brings it back.
    mark("w", 1);

    function show(fill) {
      form.replaceChildren();
      fill();
      var h = form.querySelector("h2");
      if (h) h.id = "hello-title";
    }
    function close() { dlg.close(); }

    // 1. Who is playing: name, picture and age of the child this device already has.
    function one() {
      var pic = kid.pic, age = Loopy.getAge();
      form.appendChild(stepTag(1, steps));
      form.appendChild(el("h2", "", t("hiTitle")));
      var label = el("label", "kid-field"), input = el("input");
      label.appendChild(el("span", "", t("kidName")));
      input.type = "text"; input.maxLength = 24; input.autocomplete = "off"; input.placeholder = t("kidNameHint"); input.value = kid.name;
      label.appendChild(input);
      form.appendChild(label);
      var pics = el("div", "kid-pics");
      pics.setAttribute("role", "group"); pics.setAttribute("aria-label", t("kidPic"));
      form.appendChild(el("span", "kid-label", t("kidPic")));
      PICS.forEach(function (p) {
        var b = btn(p, "");
        b.setAttribute("aria-pressed", String(p === pic));
        b.addEventListener("click", function () {
          pic = p;
          pics.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
        });
        pics.appendChild(b);
      });
      form.appendChild(pics);
      // The same − Age 8 + stepper as Settings.
      var row = el("div", "age-picker"), down = btn("−", ""), up = btn("+", ""), out = el("span");
      row.setAttribute("role", "group"); row.setAttribute("aria-label", t("ageGroup"));
      down.setAttribute("aria-label", t("younger")); up.setAttribute("aria-label", t("older"));
      out.setAttribute("aria-live", "polite");
      var sync = function () { out.textContent = t("ageLabel", { n: age }); down.disabled = age <= 5; up.disabled = age >= 16; };
      down.addEventListener("click", function () { age = Math.max(5, age - 1); sync(); });
      up.addEventListener("click", function () { age = Math.min(16, age + 1); sync(); });
      row.append(down, out, up);
      sync();
      form.appendChild(el("span", "kid-label", t("ageGroup")));
      form.appendChild(row);
      var foot = el("div", "kid-foot"), skip = btn(t("hiSkip"), "kid-btn quiet"), next = el("button", "kid-btn", t("hiNext"));
      next.type = "submit";
      skip.addEventListener("click", function () { steps === 3 ? show(two) : show(three); });
      foot.append(skip, next);
      form.appendChild(foot);
      form.appendChild(dots(1, steps));
      form.onsubmit = function (e) {
        e.preventDefault();
        var name = Loopy.kids.cleanName(input.value);
        if (name !== kid.name || pic !== kid.pic) { Loopy.kids.edit(kid.id, name, pic); kid = Loopy.kids.current(); changed = true; }
        Loopy.setAge(age);
        steps === 3 ? show(two) : show(three);
      };
      input.focus();
    }

    // 2. For grown-ups: the family code.
    function two() {
      form.onsubmit = function (e) { e.preventDefault(); };
      form.appendChild(stepTag(2, 3, true));
      form.appendChild(el("h2", "", t("hiKeep")));
      var head = el("div", "hello-head");
      head.append(shield(), el("p", "kid-note", t("hiKeepText")));
      form.appendChild(head);
      var box = el("div", "hello-sync"), col = el("div", "hello-col"), make = btn(t("hiMake")), have = btn(t("hiHave"), "kid-btn quiet");
      var foot = el("div", "kid-foot hello-foot"), later = btn(t("hiLater"), "kid-btn quiet"), next = btn(t("hiNext"));
      next.hidden = true;
      col.append(make, have);
      foot.append(later, next);
      form.append(col, box, foot, dots(2, 3));
      var done = function (r) {
        // "changed": the family's stars came here, and loopy-sync.js reloads the page.
        if (r === "on" || r === "ok") { col.hidden = true; later.hidden = true; next.hidden = false; next.focus(); }
        else if (r === "off") { make.disabled = have.disabled = false; }
      };
      make.addEventListener("click", function () { make.disabled = have.disabled = true; syncPart(box, "create", done); });
      have.addEventListener("click", function () { make.disabled = have.disabled = true; col.hidden = true; syncPart(box, "join", done); });
      later.addEventListener("click", function () { show(three); });
      next.addEventListener("click", function () { show(three); });
    }

    // 3. All set.
    function three() {
      form.onsubmit = function (e) { e.preventDefault(); close(); };
      form.appendChild(stepTag(steps, steps));
      form.appendChild(el("h2", "", kid.name ? t("hiReady", { name: kid.name }) : t("hiReadyNo")));
      var big = el("p", "hello-big", kid.pic);
      big.setAttribute("aria-hidden", "true");
      form.appendChild(big);
      form.appendChild(el("p", "kid-note", t("hiReadyText")));
      var foot = el("div", "kid-foot"), go = el("button", "kid-btn hello-wide", t("hiPlay"));
      go.type = "submit";
      foot.appendChild(go);
      form.append(foot, dots(steps, steps));
      go.focus();
    }

    dlg.addEventListener("click", function (e) { if (e.target === dlg) close(); });
    dlg.addEventListener("close", function () {
      dlg.remove();
      // A new name or picture shows in the top row after one load, like the change box does.
      if (changed) location.reload();
    });
    document.body.appendChild(dlg);
    show(one);
    dlg.showModal();
  }

  // ---- the family code row under My stars ----
  function row() {
    var box = document.getElementById("family-row");
    if (!box) return;
    var head = el("div", "hello-head"), text = el("div", "hello-text"), foot = el("div", "kid-foot hello-row-foot"), part = el("div", "hello-sync");
    var no = btn(t("hiNotNow"), "kid-btn quiet"), join = btn(t("hiJoin"), "kid-btn quiet"), on = btn(t("hiOn"));
    text.append(el("span", "tag", t("hiGrown")), el("h3", "", t("hiKeep")), el("p", "", t("hiRowText")));
    head.append(shield(), text);
    foot.append(no, join, on);
    box.replaceChildren(head, part, foot);
    box.hidden = false;
    var done = function (r) {
      if (r === "on" || r === "ok") { foot.hidden = true; text.querySelector("p").textContent = t("hiRowDone"); }
      else if (r === "off") { on.disabled = join.disabled = false; }
    };
    no.addEventListener("click", function () { mark("n", Loopy.dayKey()); box.hidden = true; });
    on.addEventListener("click", function () { on.disabled = join.disabled = true; syncPart(part, "create", done); });
    join.addEventListener("click", function () { on.disabled = join.disabled = true; join.hidden = true; syncPart(part, "join", done); });
  }

  Loopy.hello = {
    read: read,
    // The home page calls it once: { welcome: true } opens the sheet, { row: true } draws the row.
    start: function (o) {
      if (o && o.row) row();
      if (o && o.welcome && typeof HTMLDialogElement === "function") welcome();
    }
  };
})();
