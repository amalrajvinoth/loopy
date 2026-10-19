/* loopy: Add to home screen, the steps box. Loaded by the home page (Loopy.load("install")) the first time
   its button in Settings is tapped, when the browser has no install box of its own. The button is in index.html. */
// Loopy.install.open(kind, computer, btn) shows three steps for this device: kind is "iphone", "ipad",
// "android", "samsung", "androidFx", "mac", "pc" or "firefox". Apple devices keep a home screen app's
// stars apart from Safari's, so there, with stars to bring, the box also shows this device's stars code
// (everyone on it) and how to load it in the new loopy. Nothing is saved.
(function () {
  Loopy.addStrings({
    en: {
      appTitle: "Add loopy to the home screen", appTitlePc: "Install loopy on this computer", appClose: "Got it",
      appStars: "On this device the new loopy starts with its own stars. To bring them along, copy this code now:",
      appStarsLast: "Then open loopy from the home screen. Under My stars, tap Move my stars to another device, paste the code and tap Load.",
      appCopy: "Copy", appCopied: "Copied!", appByHand: "Select the code and copy it.", appCode: "Your stars code",
      iosShare: "Tap Share at the bottom of Safari. If you only see ···, tap it first.",
      ipadShare: "Tap Share at the top right of Safari, next to the address.",
      iosAdd: "Scroll down and tap Add to Home Screen.", iosOk: "Tap Add. loopy is now on your home screen.",
      anMenu: "Tap the menu ⋮ at the top right.", anAdd: "Tap Add to Home screen or Install app.", anOk: "Tap Install or Add.",
      saMenu: "Tap the menu ≡ at the bottom right.", saAdd: "Tap Add page to, then Home screen.", saOk: "Tap Add.",
      fxMenu: "Tap the menu ⋮.", fxAdd: "Tap Add to Home screen. It may be under More.", fxOk: "Tap Add.",
      macFile: "Click Share in the Safari toolbar, or File in the menu bar.", macAdd: "Click Add to Dock.", macOk: "Click Add. loopy now opens from the Dock.",
      pcIcon: "Click the install icon at the right end of the address bar.",
      pcMenu: "No icon? Open the browser menu ⋮ or ··· and look for Install or Apps.", pcOk: "Click Install. loopy opens in its own window.",
      fdNo: "Firefox on a computer cannot add loopy as an app.", fdMark: "Press Ctrl+D (⌘+D on a Mac) to keep loopy as a bookmark.",
      fdOther: "Or open loopy in Chrome, Edge or Safari to add it as an app."
    },
    de: {
      appTitle: "loopy zum Home-Bildschirm hinzufügen", appTitlePc: "loopy auf diesem Computer installieren", appClose: "Verstanden",
      appStars: "Auf diesem Gerät startet das neue loopy mit eigenen Sternen. Um sie mitzunehmen, kopiere jetzt diesen Code:",
      appStarsLast: "Öffne dann loopy vom Home-Bildschirm. Tippe unter Meine Sterne auf Sterne auf ein anderes Gerät bringen, füge den Code ein und tippe auf Laden.",
      appCopy: "Kopieren", appCopied: "Kopiert!", appByHand: "Markiere den Code und kopiere ihn.", appCode: "Dein Sterne-Code",
      iosShare: "Tippe unten in Safari auf Teilen. Siehst du nur ···, tippe zuerst darauf.",
      ipadShare: "Tippe oben rechts in Safari auf Teilen, neben der Adresse.",
      iosAdd: "Scrolle nach unten und tippe auf Zum Home-Bildschirm.", iosOk: "Tippe auf Hinzufügen. Jetzt ist loopy auf deinem Home-Bildschirm.",
      anMenu: "Tippe oben rechts auf das Menü ⋮.", anAdd: "Tippe auf Zum Startbildschirm hinzufügen oder App installieren.", anOk: "Tippe auf Installieren oder Hinzufügen.",
      saMenu: "Tippe unten rechts auf das Menü ≡.", saAdd: "Tippe auf Seite hinzufügen zu, dann auf Startbildschirm.", saOk: "Tippe auf Hinzufügen.",
      fxMenu: "Tippe auf das Menü ⋮.", fxAdd: "Tippe auf Zum Startbildschirm hinzufügen. Es kann unter Mehr stehen.", fxOk: "Tippe auf Hinzufügen.",
      macFile: "Klicke in Safari oben auf Teilen oder in der Menüleiste auf Ablage.", macAdd: "Klicke auf Zum Dock hinzufügen.", macOk: "Klicke auf Hinzufügen. Jetzt öffnest du loopy im Dock.",
      pcIcon: "Klicke rechts in der Adressleiste auf das Installieren-Symbol.",
      pcMenu: "Kein Symbol? Öffne das Browser-Menü ⋮ oder ··· und suche Installieren oder Apps.", pcOk: "Klicke auf Installieren. loopy öffnet sich in einem eigenen Fenster.",
      fdNo: "Firefox kann loopy auf dem Computer nicht als App hinzufügen.", fdMark: "Drücke Strg+D (⌘+D auf dem Mac), um loopy als Lesezeichen zu speichern.",
      fdOther: "Oder öffne loopy in Chrome, Edge oder Safari, um es als App hinzuzufügen."
    }
  });
  function svg(d) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + d + "</svg>";
  }
  // Small drawings for the steps: the Share box on Apple devices, the add square, the browser menus,
  // a screen with a down arrow for installing on a computer, a tick, an "i" and a bookmark star.
  var ICON = {
    share: svg('<path d="M12 3v12"/><path d="M8 7l4-4 4 4"/><path d="M8 11H6v10h12V11h-2"/>'),
    add: svg('<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M12 8v8M8 12h8"/>'),
    menu: svg('<circle cx="12" cy="5" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="12" cy="19" r="1.2"/>'),
    lines: svg('<path d="M4 6h16M4 12h16M4 18h16"/>'),
    install: svg('<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8"/><path d="M12 7v6M9 10l3 3 3-3"/>'),
    ok: svg('<path d="M5 12l5 5 9-10"/>'),
    info: svg('<circle cx="12" cy="12" r="9"/><path d="M12 11v6"/><path d="M12 7.5v.5"/>'),
    star: svg('<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>')
  };
  var STEPS = {
    iphone: [["share", "iosShare"], ["add", "iosAdd"], ["ok", "iosOk"]],
    ipad: [["share", "ipadShare"], ["add", "iosAdd"], ["ok", "iosOk"]],
    android: [["menu", "anMenu"], ["add", "anAdd"], ["ok", "anOk"]],
    samsung: [["lines", "saMenu"], ["add", "saAdd"], ["ok", "saOk"]],
    androidFx: [["menu", "fxMenu"], ["add", "fxAdd"], ["ok", "fxOk"]],
    mac: [["share", "macFile"], ["add", "macAdd"], ["ok", "macOk"]],
    pc: [["install", "pcIcon"], ["menu", "pcMenu"], ["ok", "pcOk"]],
    firefox: [["info", "fdNo"], ["star", "fdMark"], ["ok", "fdOther"]]
  };
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  }
  function open(kind, computer, btn) {
    if (typeof HTMLDialogElement !== "function" || !STEPS[kind]) return;
    var t = Loopy.t;
    var dlg = el("dialog", "kid-dialog app-dialog"), form = el("form"), h = el("h2", "", t(computer ? "appTitlePc" : "appTitle"));
    dlg.setAttribute("aria-labelledby", "app-title");
    h.id = "app-title";
    var list = el("ol", "app-steps");
    STEPS[kind].forEach(function (s) {
      var li = el("li");
      li.innerHTML = ICON[s[0]];
      li.appendChild(el("span", "", t(s[1])));
      list.appendChild(li);
    });
    form.appendChild(h);
    form.appendChild(list);
    var apple = kind === "iphone" || kind === "ipad" || kind === "mac";
    if (apple && Loopy.backup && (Loopy.rewards.get().stars > 0 || Loopy.kids.list().length > 1)) {
      var code = el("input"), copy = el("button", "kid-btn quiet", t("appCopy")), msg = el("p", "kid-note"), line = el("div", "app-code");
      code.readOnly = true;
      code.setAttribute("aria-label", t("appCode"));
      copy.type = "button";
      copy.autofocus = true;
      copy.addEventListener("click", function () {
        if (!code.value) return;
        code.select();
        var done = function () { msg.textContent = t("appCopied"); }, by = function () { msg.textContent = t("appByHand"); };
        if (navigator.clipboard) navigator.clipboard.writeText(code.value).then(done, by); else by();
      });
      Loopy.backup.exportCode().then(function (c) { code.value = c; }, function () {});
      line.appendChild(code);
      line.appendChild(copy);
      msg.setAttribute("aria-live", "polite");
      [el("p", "kid-note", t("appStars")), line, msg, el("p", "kid-note", t("appStarsLast"))].forEach(function (n) { form.appendChild(n); });
    }
    var foot = el("div", "kid-foot"), close = el("button", "kid-btn", t("appClose"));
    close.type = "button";
    if (!form.querySelector("[autofocus]")) close.autofocus = true;
    close.addEventListener("click", function () { dlg.close(); });
    form.addEventListener("submit", function (e) { e.preventDefault(); });
    foot.appendChild(close);
    form.appendChild(foot);
    dlg.appendChild(form);
    dlg.addEventListener("close", function () { dlg.remove(); if (btn) btn.focus({ preventScroll: true }); });
    document.body.appendChild(dlg);
    dlg.showModal();
  }
  Loopy.install = { open: open };
})();
