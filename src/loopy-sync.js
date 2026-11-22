/* loopy: Family sync (Loopy.sync). loopy.js loads it only on a device where a grown-up turned it on, after
   the page has shown and the browser is idle. The home page's Settings also load it on a tap. */
// Every device keeps everything in this browser, as before, and pages never wait for the network.
// A locked copy of the stars code (all children) is kept on the family sync server (Loopy.syncHost, see
// sync/README.md). It is locked here with AES-GCM and a key made from the family code, so the server can't
// read it. The family code never leaves the device: the server only gets an id and a write key made from it.
// Home page: read the copy when it changed, add it here (the stars code merge: it only adds, never takes
// away), and save the result back. Every page: save after something changed (20 seconds after a change,
// at most every 2 minutes), and when the page is left. New stars from another device show on the
// home page, which reloads once. A page nobody has touched for 5 minutes (no tap, click or key) also reads
// the copy, and again every 15 minutes up to an hour; it reloads once if something new came, so a tablet
// left open catches up. Never while loopy is hidden, and never while a box or Settings is open.
// Kept in this browser's localStorage "loopy.sync", for the whole device and never in a stars code, as
// { c: family code, i: id, w: write key, k: lock key, e: hash of the copy last read or saved,
//   h: hash of the stars code last sent or got, t: time of the last sync, x: 1 when changes wait to be saved }.
(function () {
  var Loopy = window.Loopy, KEY = "loopy.sync", ABC = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  var WAIT = 20000, GAP = 120000, TIME = 15000, IDLE = 300000, AGAIN = 900000, IDLE_MAX = 3600000;
  // ending: the pending "Turn off everywhere" delete; no round starts while it runs (a late save would make the copy again).
  /** @type {Promise<boolean> | null} */
  var ending = null;
  var st = read(), busy = null, timer = null, idleTimer = null, touched = Date.now(), pushed = st ? st.t : 0, pulled = 0, dirty = false, status = st ? "idle" : "off", tell = [];

  // ---- saved state ----
  function read() {
    var s;
    try { s = JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; }
    if (!s || typeof s !== "object" || !/^[0-9A-HJKMNP-TV-Z]{4}(-[0-9A-HJKMNP-TV-Z]{4}){3}$/.test(s.c) || !/^[0-9a-f]{32}$/.test(s.i)
      || !/^[A-Za-z0-9_-]{43}$/.test(s.w) || !/^[A-Za-z0-9+/]{43}=$/.test(s.k)) return null;
    return { c: s.c, i: s.i, w: s.w, k: s.k, e: /^[0-9a-f]{32}$/.test(s.e) ? s.e : "", h: /^[0-9a-f]{32}$/.test(s.h) ? s.h : "",
      t: typeof s.t === "number" && isFinite(s.t) ? s.t : 0, x: s.x === 1 ? 1 : 0 };
  }
  function write() { try { if (st) localStorage.setItem(KEY, JSON.stringify(st)); else localStorage.removeItem(KEY); } catch (e) {} }
  function say(s) { status = s; tell.forEach(function (f) { try { f(s); } catch (e) {} }); }

  // ---- the family code and the keys made from it ----
  // 16 letters and digits (80 bits), shown as 4 groups: "7K2M-QX9D-4HPT-W3RA". O counts as 0, I and L as 1.
  function clean(code) {
    var s = String(code || "").toUpperCase().replace(/[O]/g, "0").replace(/[IL]/g, "1").replace(/[^0-9A-Z]/g, "");
    if (s.length !== 16) return "";
    for (var i = 0; i < 16; i++) if (ABC.indexOf(s[i]) < 0) return "";
    return s.match(/.{4}/g).join("-");
  }
  function newCode() {
    var r = crypto.getRandomValues(new Uint8Array(16)), s = "";
    for (var i = 0; i < 16; i++) s += ABC[r[i] & 31];
    return clean(s);
  }
  var enc = function (s) { return new TextEncoder().encode(s); };
  function b64(bytes) { var s = ""; for (var i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]); return btoa(s); }
  function unb64(s) { var b = atob(s), out = new Uint8Array(b.length); for (var i = 0; i < b.length; i++) out[i] = b.charCodeAt(i); return out; }
  function hex(bytes) { var s = ""; for (var i = 0; i < bytes.length; i++) s += (bytes[i] < 16 ? "0" : "") + bytes[i].toString(16); return s; }
  function hash(text) { return crypto.subtle.digest("SHA-256", enc(text)).then(function (d) { return hex(new Uint8Array(d)).slice(0, 32); }); }
  // One slow step (PBKDF2) when a family is made or joined, then saved, so a page never repeats it.
  function derive(code) {
    return crypto.subtle.importKey("raw", enc(code), "PBKDF2", false, ["deriveBits"]).then(function (base) {
      return crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: enc("loopy-family-sync-1"), iterations: 200000 }, base, 640);
    }).then(function (bits) {
      // Three separate parts: 16 bytes for the id, 32 for the write key, 32 for the lock key. The server gets the
      // first two and learns nothing about the third.
      var b = new Uint8Array(bits);
      return { c: code, i: hex(b.subarray(0, 16)), w: b64(b.subarray(16, 48)).slice(0, 43).replace(/\+/g, "-").replace(/\//g, "_"), k: b64(b.subarray(48, 80)) };
    });
  }
  function aes(s) { return crypto.subtle.importKey("raw", unb64(s.k), "AES-GCM", false, ["encrypt", "decrypt"]); }
  function lock(s, text) {
    var iv = crypto.getRandomValues(new Uint8Array(12));
    return aes(s).then(function (key) { return crypto.subtle.encrypt({ name: "AES-GCM", iv: iv, additionalData: enc(s.i) }, key, enc(text)); })
      .then(function (d) { return JSON.stringify({ v: 1, iv: b64(iv), d: b64(new Uint8Array(d)) }); });
  }
  function unlock(s, body) {
    var j = JSON.parse(body);
    if (!j || j.v !== 1) throw new Error("not a copy");
    return aes(s).then(function (key) { return crypto.subtle.decrypt({ name: "AES-GCM", iv: unb64(j.iv), additionalData: enc(s.i) }, key, unb64(j.d)); })
      .then(function (d) { return new TextDecoder("utf-8", { fatal: true }).decode(d); });
  }

  // ---- the server: GET and text/plain POST only, so the browser sends no extra request first ----
  // send(path, body): a promise of { n: status (0 when the server can't be reached), j: the answer }.
  /** @returns {Promise<{n: number, j?: any}>} */
  function send(path, body) {
    var ctl = typeof AbortController === "function" ? new AbortController() : null, stop = setTimeout(function () { if (ctl) ctl.abort(); }, TIME);
    var opt = /** @type {RequestInit} */ ({ cache: "no-store", credentials: "omit", referrerPolicy: "no-referrer", signal: ctl ? ctl.signal : undefined });
    if (body) { opt.method = "POST"; opt.headers = { "Content-Type": "text/plain" }; opt.body = JSON.stringify(body); opt.keepalive = opt.body.length < 60000; }
    // A dropped connection, a timeout or an answer that is not JSON all count as "could not reach" (n: 0).
    // The timer runs until the body is read too, so a stalled answer cannot hold a request open for good.
    return fetch("https://" + Loopy.syncHost + path, opt).then(function (r) {
      if (r.status !== 200 && r.status !== 412) return { n: r.status };
      return r.json().then(function (j) { return { n: r.status, j: j || {} }; });
    }).then(function (out) { clearTimeout(stop); return out; }, function () { clearTimeout(stop); return { n: 0 }; });
  }
  function call(s, query, body) { return send("/f/" + s.i + query, body); }
  var get = function (s) { return call(s, "?e=" + s.e); };
  var post = function (s, b) { return call(s, "?e=" + s.e, { k: s.w, b: b }); };

  // ---- one round: maybe read and merge, then save if this device has something new ----
  // A promise of { changed: true } when the copy brought something new to this device.
  function round(pull) {
    if (busy) return busy;
    var s = st, changed = false;
    if (!s || ending) return Promise.resolve({});
    say("busy");
    busy = (pull ? get(s).then(function (r) {
      if (r.n === 0) throw new Error("offline");
      if (r.n === 404 && s.e) throw new Error("gone");
      if (r.n === 204 || r.n === 404) return;      // nothing new (204), or no copy yet (404): maybe save below
      if (r.n !== 200) { if (r.n === 429) later(); throw new Error("error"); }   // too many, or a server error: no sync time
      pulled = Date.now();
      return unlock(s, r.j.b).then(function (code) {
        return Loopy.backup.exportCode().then(function (before) {
          return Loopy.backup.importCode(code, { quiet: true }).then(function () { return Loopy.backup.exportCode(); }).then(function (after) {
            changed = after !== before;
            s.e = r.j.e;
            return hash(code).then(function (h) { if (!changed) s.h = h; });
          });
        });
      });
    }) : Promise.resolve()).then(function () {
      return Loopy.backup.exportCode().then(function (code) {
        return hash(code).then(function (h) {
          dirty = false;
          if (h === s.h && s.e) { s.x = 0; return; }
          return lock(s, code).then(function (b) { return post(s, b); }).then(function (r) {
            if (r.n === 200) { s.e = r.j.e; s.h = h; s.x = 0; pushed = Date.now(); return; }
            s.x = 1;
            if (r.n === 429) { later(); return; }
            if (r.n === 412 && !pull) return;          // someone saved first: the home page will merge it
            if (r.n === 412) { s.e = r.j.e || ""; throw new Error("again"); }
            if (r.n === 0) throw new Error("offline");
            if (r.n === 403) throw new Error("gone");
          });
        });
      });
    }).then(function () {
      s.t = Date.now();
      if (st === s) write();
      say("idle");
      return { changed: changed };
    }, function (err) {
      if (st === s) write();
      var why = err && err.message;
      say(why === "offline" ? "offline" : why === "gone" ? "gone" : "error");
      return { changed: changed, again: why === "again" };
    }).then(function (res) {
      busy = null;
      // Another device saved in between: read once more and try again.
      if (/** @type {any} */ (res).again && pull !== 2) return round(2).then(function (r2) { return { changed: res.changed || r2.changed }; });
      return res;
    });
    return busy;
  }

  // ---- when to sync ----
  function later() {
    if (!st) return;
    clearTimeout(timer);
    var wait = Math.max(WAIT, GAP - (Date.now() - pushed));
    timer = setTimeout(function () { timer = null; round(false); }, wait);
  }
  function changedHere() {
    if (!st || dirty) return;
    dirty = true;
    if (!st.x) { st.x = 1; write(); }
    later();
  }
  // Every save in loopy goes through Loopy.keep.soon (the IndexedDB copy), so that is where a change is seen.
  if (Loopy.keep && typeof Loopy.keep.soon === "function") {
    var soon = Loopy.keep.soon;
    Loopy.keep.soon = function () { var r = soon.apply(this, arguments); changedHere(); return r; };
  }
  document.addEventListener("visibilitychange", function () {
    if (!st) return;
    if (document.visibilityState === "hidden") { clearTimeout(idleTimer); if (dirty || st.x) { clearTimeout(timer); round(false); } }
    else { touch(); if (Loopy.syncPage === "home" && Date.now() - pulled > 60000) home(); }
  });

  // A box (a dialog) or Settings is open: someone is using the page, so it must not reload.
  function busyHere() {
    return !!document.querySelector("dialog[open]") || (document.getElementById("settings-panel") || {}).hidden === false;
  }
  // Read the copy; a change from another device reloads the page once, unless a box is open.
  function home() {
    return round(true).then(function (r) {
      var again = false;
      try { again = Date.now() - Number(sessionStorage.getItem("loopy.syncReload") || 0) < 30000; } catch (e) {}
      if (r.changed && !busyHere() && !again) {
        try { sessionStorage.setItem("loopy.syncReload", String(Date.now())); } catch (e) {}
        location.reload();
      }
      return r;
    });
  }

  // ---- after 5 minutes without a tap, click or key ----
  // The page's data in memory is replaced by the reload, so new stars are only read when the page may reload.
  function idle() {
    idleTimer = null;
    if (!st || document.visibilityState === "hidden") return;
    if (busyHere()) round(false); else home();
    var away = Date.now() - touched;
    if (away + AGAIN <= IDLE_MAX) idleTimer = setTimeout(idle, AGAIN);
  }
  function touch() {
    touched = Date.now();
    clearTimeout(idleTimer);
    idleTimer = st && document.visibilityState !== "hidden" ? setTimeout(idle, IDLE) : null;
  }
  ["pointerdown", "keydown"].forEach(function (k) { document.addEventListener(k, touch, { capture: true, passive: true }); });

  function start() {
    if (!st) return;
    touch();
    if (Loopy.syncPage === "home") home();
    else if (st.x) later();
  }


  // ---- the Family sync part of ⚙ Settings on the home page (index.html makes the box) ----
  // Off: Turn on (a new family code) or Join with a code. On: the code, its QR code (scan it on the other
  // device to join), Sync now and Turn off. A link loopy/#family=CODE asks before joining.
  Loopy.addStrings({
    en: { syHead: "Family sync", syOff: "Keep the stars the same on all your family's devices, by themselves. Everything is locked on this device before it is sent, and the server can't read it. No account.",
      syOn: "Turn on", syJoin: "Join with a code", syJoinGo: "Join", syCodeLabel: "Family code from your other device",
      syIs: "On. Your family code:", syScan: "On your other device, scan this or type the code under Family sync, Join with a code.",
      syNow: "Sync now", syStop: "Turn off", syForget: "Turn off everywhere",
      syForgetSure: "Tap again to turn off sync on every device and delete the family copy. Stars on each device stay.",
      syForgetLater: "The family copy could not be deleted just now. Sync stays on. Try again in a moment.",
      syWhen: "Last sync at {time}.", syBusy: "Syncing…", syOffline: "Waiting for the internet. Stars are safe on this device.",
      syGone: "The family copy was deleted on another device. Turn off, then turn on or join again.", syError: "Something went wrong. Stars are safe on this device.",
      syBad: "That is not a family code. It has 16 letters and numbers.", syNone: "No family has this code. Check it on the other device.",
      syNoNet: "loopy can't reach the sync server. Try again with internet.",
      syAskTitle: "Join this family?", syAskText: "Stars from the family's other devices are added here, and stars here are added there. Nothing is taken away.",
      syAskNo: "Not now", syAskYes: "Join",
      syShare: "Share the link", syShareText: "Open this link on your other device and the stars are there too:",
      syShared: "Link copied! Send it to the other device.", syShareNo: "Copying did not work. Scan the QR code instead." },
    de: { syHead: "Familien-Sync", syOff: "Halte die Sterne auf allen Geräten deiner Familie gleich, ganz von selbst. Alles wird auf diesem Gerät verschlossen, bevor es gesendet wird, und der Server kann es nicht lesen. Kein Konto.",
      syOn: "Einschalten", syJoin: "Mit Code beitreten", syJoinGo: "Beitreten", syCodeLabel: "Familien-Code von deinem anderen Gerät",
      syIs: "An. Euer Familien-Code:", syScan: "Scanne das auf deinem anderen Gerät oder tippe den Code dort unter Familien-Sync, Mit Code beitreten ein.",
      syNow: "Jetzt abgleichen", syStop: "Ausschalten", syForget: "Überall ausschalten",
      syForgetSure: "Tippe noch einmal, um den Sync auf allen Geräten auszuschalten und die Familien-Kopie zu löschen. Die Sterne auf jedem Gerät bleiben.",
      syForgetLater: "Die Familien-Kopie konnte gerade nicht gelöscht werden. Der Sync bleibt an. Versuche es gleich noch einmal.",
      syWhen: "Zuletzt abgeglichen um {time}.", syBusy: "Wird abgeglichen …", syOffline: "Wartet auf Internet. Die Sterne sind auf diesem Gerät sicher.",
      syGone: "Die Familien-Kopie wurde auf einem anderen Gerät gelöscht. Schalte aus und dann wieder ein oder tritt neu bei.", syError: "Etwas ist schiefgegangen. Die Sterne sind auf diesem Gerät sicher.",
      syBad: "Das ist kein Familien-Code. Er hat 16 Buchstaben und Zahlen.", syNone: "Keine Familie hat diesen Code. Prüfe ihn auf dem anderen Gerät.",
      syNoNet: "loopy erreicht den Sync-Server nicht. Versuche es mit Internet noch einmal.",
      syAskTitle: "Dieser Familie beitreten?", syAskText: "Sterne von den anderen Geräten der Familie kommen hierher, und Sterne von hier kommen dorthin. Nichts geht verloren.",
      syAskNo: "Nicht jetzt", syAskYes: "Beitreten",
      syShare: "Link teilen", syShareText: "Öffne diesen Link auf deinem anderen Gerät, dann sind die Sterne auch dort:",
      syShared: "Link kopiert! Schicke ihn an das andere Gerät.", syShareNo: "Kopieren ging nicht. Scanne stattdessen den QR-Code." }
  });

  // The family link (loopy/#family=CODE): the QR code and Share carry it. Opening it asks "Join this family?".
  function familyLink(code) { return Loopy.root + "#family=" + code.replace(/-/g, ""); }
  // A promise of the QR code of the family link as an <svg class="sync-qr">, or null.
  function qrSvg(code) {
    return Loopy.load("backup").then(function () {
      var q = Loopy.backup.qr(familyLink(code), 10);
      if (!q) return null;
      var ns = "http://www.w3.org/2000/svg", svg = document.createElementNS(ns, "svg"), back = document.createElementNS(ns, "rect"), path = document.createElementNS(ns, "path"), span = q.n + 8;
      svg.setAttribute("viewBox", "-4 -4 " + span + " " + span);
      svg.setAttribute("class", "sync-qr");
      svg.setAttribute("role", "img");
      svg.setAttribute("aria-label", Loopy.t("syScan"));
      [["x", -4], ["y", -4], ["width", span], ["height", span], ["fill", "#fff"]].forEach(function (a) { back.setAttribute(a[0], a[1]); });
      path.setAttribute("d", q.path); path.setAttribute("fill", "#000"); path.setAttribute("shape-rendering", "crispEdges");
      svg.append(back, path);
      return svg;
    }, function () { return null; });
  }
  // Share the family link: the phone's own share sheet where there is one, else the clipboard. Nothing
  // leaves the device but what the grown-up sends. A promise of "shared", "copied" or "no".
  function share() {
    if (!st) return Promise.resolve("no");
    var text = Loopy.t("syShareText"), url = familyLink(st.c);
    if (navigator.share) {
      return navigator.share({ text: text, url: url }).then(function () { return "shared"; }, function (e) {
        // Cancelled, or the share sheet could not open: then the clipboard, unless it was a cancel.
        return e && e.name === "AbortError" ? "shared" : copy();
      });
    }
    return copy();
    function copy() {
      if (!navigator.clipboard || !navigator.clipboard.writeText) return Promise.resolve("no");
      return navigator.clipboard.writeText(text + " " + url).then(function () { return "copied"; }, function () { return "no"; });
    }
  }
  // A Share pill: after a tap, msg says what happened (nothing for the share sheet, which speaks for itself).
  function sharePill(msg) {
    var b = Loopy.el("button", "kid-btn quiet", Loopy.t("syShare"));
    b.type = "button";
    b.addEventListener("click", function () {
      b.disabled = true;
      share().then(function (r) {
        b.disabled = false;
        if (r === "copied") msg.textContent = Loopy.t("syShared");
        else if (r === "no") msg.textContent = Loopy.t("syShareNo");
      });
    });
    return b;
  }

  function settings(box) {
    var t = Loopy.t, el = Loopy.el, body = el("div"), msg = el("p");
    function btn(text, cls) { var b = el("button", cls || "kid-btn", text); b.type = "button"; return b; }
    msg.setAttribute("aria-live", "polite");
    box.replaceChildren(el("p", "set-head", t("syHead")), body, msg);
    box.hidden = false;
    // Waits for the page to load, so a tap or a link never slows the first picture.
    /** @type {Promise<Event | void>} */
    var loaded = new Promise(function (r) { if (document.readyState === "complete") r(); else window.addEventListener("load", r, { once: true }); });
    function shown(s) {
      if (s === "busy") msg.textContent = t("syBusy");
      else if (s === "offline") msg.textContent = t("syOffline");
      else if (s === "gone") msg.textContent = t("syGone");
      else if (s === "error") msg.textContent = t("syError");
      else if (s === "idle") msg.textContent = st && st.t ? t("syWhen", { time: new Date(st.t).toLocaleTimeString(Loopy.lang, { hour: "2-digit", minute: "2-digit" }) }) : "";
    }
    tell.push(shown);

    function draw() {
      var row = el("div", "kid-foot");
      body.replaceChildren();
      if (!st) {
        msg.textContent = "";
        var go = btn(t("syOn")), join = btn(t("syJoin"), "kid-btn quiet");
        var stuck = function () { msg.textContent = t("syNoNet"); go.disabled = join.disabled = false; };
        row.append(join, go);
        body.append(el("p", "", t("syOff")), row);
        go.addEventListener("click", function () {
          go.disabled = join.disabled = true;
          msg.textContent = t("syBusy");
          loaded.then(Loopy.sync.create).then(function (ok) { if (ok) draw(); else stuck(); }, stuck);
        });
        join.addEventListener("click", function () {
          var line = el("div", "sync-join"), input = el("input"), ok = btn(t("syJoinGo"));
          input.autocomplete = "off"; input.spellcheck = false; input.setAttribute("autocapitalize", "characters");
          input.placeholder = "XXXX-XXXX-XXXX-XXXX";
          input.setAttribute("aria-label", t("syCodeLabel"));
          line.append(input, ok);
          row.replaceWith(line);
          input.focus();
          ok.addEventListener("click", function () { joinWith(input.value, ok); });
          input.addEventListener("keydown", function (e) { if (e.key === "Enter") joinWith(input.value, ok); });
        });
        return;
      }
      var code = el("p", "sync-code", st.c), now = btn(t("syNow")), stop = btn(t("syStop"), "kid-btn quiet"), forget = btn(t("syForget"), "kid-btn danger"), sure = false;
      var end = el("div", "kid-foot");
      // Share sends the family link to the other device (the share sheet, or the clipboard).
      row.append(stop, sharePill(msg), now);
      end.append(forget);
      body.append(el("p", "", t("syIs")), code, row, end);
      shown(status === "off" ? "idle" : status);
      qrSvg(st.c).then(function (svg) { if (svg && code.isConnected) code.after(svg, el("p", "", t("syScan"))); });
      now.addEventListener("click", function () { loaded.then(Loopy.sync.now); });
      stop.addEventListener("click", function () { Loopy.sync.off(false).then(draw); });
      forget.addEventListener("click", function () {
        if (!sure) { sure = true; forget.classList.add("sure"); msg.textContent = t("syForgetSure"); return; }
        forget.disabled = true;
        Loopy.sync.off(true).then(function (done) {
          forget.disabled = false;
          if (done) draw(); else msg.textContent = t("syForgetLater");
        });
      });
    }

    // A promise of what join said; the home page reloads when the family's stars came here.
    function joinWith(text, button) {
      if (button) button.disabled = true;
      msg.textContent = t("syBusy");
      return loaded.then(function () { return Loopy.sync.join(text); }).then(function (r) {
        if (button) button.disabled = false;
        if (r === "bad") msg.textContent = t("syBad");
        else if (r === "none") msg.textContent = t("syNone");
        else if (r === "offline") msg.textContent = t("syNoNet");
        else if (r === "changed") location.reload();
        else draw();
        return r;
      });
    }

    // A link from the QR code (loopy/#family=7K2MQX9D4HPTW3RA): ask first, then join.
    function fromLink() {
      var m = /^#family=([0-9A-Za-z-]{16,19})$/.exec(location.hash);
      if (!m) return;
      history.replaceState(null, "", location.pathname + location.search);
      if (st || typeof HTMLDialogElement !== "function") return;
      var dlg = el("dialog", "kid-dialog"), form = el("form"), h = el("h2", "", t("syAskTitle")), foot = el("div", "kid-foot");
      var no = btn(t("syAskNo"), "kid-btn quiet"), yes = el("button", "kid-btn", t("syAskYes"));
      yes.type = "submit";
      h.id = "sync-ask";
      dlg.setAttribute("aria-labelledby", "sync-ask");
      no.addEventListener("click", function () { dlg.close(); });
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        yes.disabled = true;
        joinWith(m[1]).then(function (r) {
          if (r === "changed") return;
          dlg.close();
          var panel = document.getElementById("settings-panel"), gear = document.getElementById("settings-toggle");
          if (panel && panel.hidden && gear) gear.click();
          box.scrollIntoView({ block: "nearest" });
        });
      });
      foot.append(no, yes);
      form.append(h, el("p", "kid-note", t("syAskText")), foot);
      dlg.appendChild(form);
      dlg.addEventListener("close", function () { dlg.remove(); });
      document.body.appendChild(dlg);
      dlg.showModal();
    }

    draw();
    fromLink();
    window.addEventListener("hashchange", fromLink);
  }

  // ---- the small family code part (the welcome sheet and the row under My stars, see loopy-hello.js) ----
  // panel(box, "create") turns sync on with a new code and shows the code, its QR code and Share. panel(box,
  // "join") shows the Join box; a right code shows the same. A promise of "on" (new family), "ok" (joined),
  // "changed" (joined and the family's stars came here: the page reloads) or "off" (the server could not
  // be reached, or sync was on already: the box says why, the caller shows its buttons again).
  function panel(box, mode) {
    var t = Loopy.t, el = Loopy.el, msg = el("p", "sync-msg");
    msg.setAttribute("aria-live", "polite");
    box.replaceChildren(msg);
    function on(r) {
      var code = el("p", "sync-code", st.c), row = el("div", "kid-foot");
      msg.textContent = "";
      row.appendChild(sharePill(msg));
      box.replaceChildren(el("p", "sync-line", t("syIs")), code, row, msg);
      return qrSvg(st.c).then(function (svg) { if (svg && code.isConnected) code.after(svg, el("p", "sync-line", t("syScan"))); return r; });
    }
    if (st) return on("on");
    if (mode === "join") return new Promise(function (resolve) {
      var line = el("div", "sync-join"), input = el("input"), ok = el("button", "kid-btn", t("syJoinGo"));
      ok.type = "button";
      input.autocomplete = "off"; input.spellcheck = false; input.setAttribute("autocapitalize", "characters");
      input.placeholder = "XXXX-XXXX-XXXX-XXXX";
      input.setAttribute("aria-label", t("syCodeLabel"));
      line.append(input, ok);
      box.prepend(line);
      input.focus();
      function go() {
        ok.disabled = true;
        msg.textContent = t("syBusy");
        Loopy.sync.join(input.value).then(function (r) {
          ok.disabled = false;
          if (r === "bad") { msg.textContent = t("syBad"); input.focus(); }
          else if (r === "none") { msg.textContent = t("syNone"); input.focus(); }
          else if (r === "offline") msg.textContent = t("syNoNet");
          else if (r === "changed") { msg.textContent = t("syBusy"); location.reload(); resolve("changed"); }
          else on("ok").then(resolve);
        });
      }
      ok.addEventListener("click", go);
      input.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); go(); } });
    });
    msg.textContent = t("syBusy");
    return Loopy.sync.create().then(function (made) {
      if (made) return on("on");
      msg.textContent = t("syNoNet");
      return "off";
    }, function () { msg.textContent = t("syNoNet"); return "off"; });
  }

  // ---- "Stay in touch": a grown-up's email, a part of ⚙ Settings on the home page above Family sync ----
  // Nothing is sent until a grown-up taps Save. The email, the language and the time go to the same server
  // (POST /g), which keeps them apart from the family copies. This browser keeps "loopy.touch" as
  // { m: email, k: remove key, t: time saved }: Remove sends the key, and the server deletes the row.
  // Never in a stars code, never per child, never shown in a game.
  var TOUCH = "loopy.touch";
  Loopy.addStrings({
    en: { stHead: "Grown-ups: stay in touch",
      stText: "Leave your email if you would like to hear about new games, a few times a year. Only grown-ups, please. It is never shown to your child and never shared. It is kept on loopy's own server in the EU. You can remove it here at any time.",
      stLabel: "Your email", stAgree: "I am a grown-up and I agree to the ", stNote: "privacy note", stSave: "Save", stRemove: "Remove",
      stSaved: "Saved: {mail}. Thank you!", stDone: "Saved. Thank you!", stGone: "Removed.", stBad: "That does not look like an email.",
      stTick: "Please tick the box first.", stWait: "Please wait a moment, then try again.", stElse: "Removed from this device. If you saved it on another device too, remove it there as well." },
    de: { stHead: "Für Erwachsene: in Kontakt bleiben",
      stText: "Hinterlasse deine E-Mail, wenn du von neuen Spielen hören möchtest, ein paar Mal im Jahr. Nur für Erwachsene. Sie wird deinem Kind nie gezeigt und nie weitergegeben. Sie liegt auf loopys eigenem Server in der EU. Du kannst sie hier jederzeit löschen.",
      stLabel: "Deine E-Mail", stAgree: "Ich bin erwachsen und stimme dem ", stNote: "Datenschutzhinweis", stSave: "Speichern", stRemove: "Löschen",
      stSaved: "Gespeichert: {mail}. Danke!", stDone: "Gespeichert. Danke!", stGone: "Gelöscht.", stBad: "Das sieht nicht wie eine E-Mail aus.",
      stTick: "Bitte zuerst das Kästchen ankreuzen.", stWait: "Bitte warte kurz und versuche es noch einmal.", stElse: "Auf diesem Gerät gelöscht. Hast du sie auch auf einem anderen Gerät gespeichert, lösche sie dort ebenfalls." }
  });
  function readTouch() {
    var s;
    try { s = JSON.parse(localStorage.getItem(TOUCH)); } catch (e) { return null; }
    if (!s || typeof s !== "object" || typeof s.m !== "string" || s.m.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.m) || !/^[A-Za-z0-9_-]{43}$/.test(s.k)) return null;
    return { m: s.m, k: s.k, t: typeof s.t === "number" && isFinite(s.t) ? s.t : 0 };
  }
  // A save whose answer was lost may have reached the server with its key, and a later 429 or error does not
  // say otherwise. So each email keeps its key, for as long as the page is open, until a save of it succeeds
  // (the server keeps the first key it saw), and Remove works afterwards.
  /** @type {Record<string, string>} */
  var tried = {};
  function writeTouch(s) { try { if (s) localStorage.setItem(TOUCH, JSON.stringify(s)); else localStorage.removeItem(TOUCH); } catch (e) {} }
  function newKey() {
    var r = crypto.getRandomValues(new Uint8Array(32));
    return b64(r).slice(0, 43).replace(/\+/g, "-").replace(/\//g, "_");
  }
  function touchPart(box) {
    var t = Loopy.t, saved = readTouch(), body = document.createElement("div"), msg = document.createElement("p");
    function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; return n; }
    function btn(text, cls) { var b = el("button", cls || "kid-btn", text); b.type = "button"; return b; }
    msg.setAttribute("aria-live", "polite");
    box.replaceChildren(el("p", "set-head", t("stHead")), el("p", "", t("stText")), body, msg);
    box.hidden = false;
    function draw() {
      var row = el("div", "kid-foot");
      body.replaceChildren();
      if (saved) {
        var remove = btn(t("stRemove"), "kid-btn quiet");
        remove.addEventListener("click", function () {
          remove.disabled = true;
          send("/g?del=1", { m: saved.m, k: saved.k }).then(function (r) {
            remove.disabled = false;
            if (r.n === 0) { msg.textContent = t("syNoNet"); return; }
            // 429 (too many requests from this address) or a server error: nothing was deleted, so the email
            // and its remove key stay here for the next try.
            if (r.n !== 200 && r.n !== 404) { msg.textContent = t("stWait"); return; }
            // 404: no row with this email and this device's key. Either it is gone already, or the same
            // email was saved first on another device, which is the one that can delete it.
            var elsewhere = r.n !== 200;
            saved = null; writeTouch(null); draw();
            msg.textContent = elsewhere ? t("stElse") : t("stGone");
          });
        });
        row.appendChild(remove);
        body.append(el("p", "touch-saved", t("stSaved", { mail: saved.m })), row);
        return;
      }
      var line = el("div", "sync-join"), input = el("input"), lab = el("label", "touch-agree"), tick = el("input"), save = btn(t("stSave")), link = el("a", "", t("stNote"));
      input.type = "email"; input.className = "touch-mail"; input.autocomplete = "email"; input.spellcheck = false;
      input.setAttribute("autocapitalize", "off"); input.placeholder = "name@example.com"; input.setAttribute("aria-label", t("stLabel"));
      tick.type = "checkbox"; link.href = "privacy/"; link.target = "_blank"; link.rel = "noopener";
      var words = el("span");
      words.append(t("stAgree"), link, ".");
      lab.append(tick, words);
      line.appendChild(input);
      row.appendChild(save);
      body.append(line, lab, row);
      function go() {
        var m = input.value.trim().toLowerCase();
        if (m.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(m)) { msg.textContent = t("stBad"); input.focus(); return; }
        if (!tick.checked) { msg.textContent = t("stTick"); tick.focus(); return; }
        var k = tried[m] || newKey();
        save.disabled = true; msg.textContent = t("syBusy");
        send("/g", { m: m, l: Loopy.lang === "de" ? "de" : "en", k: k }).then(function (r) {
          save.disabled = false;
          if (r.n === 200) delete tried[m]; else tried[m] = k;
          if (r.n === 200) { saved = { m: m, k: k, t: Date.now() }; writeTouch(saved); draw(); msg.textContent = t("stDone"); }
          else if (r.n === 0) msg.textContent = t("syNoNet");
          else if (r.n === 429) msg.textContent = t("stWait");
          else if (r.n === 400) msg.textContent = t("stBad");
          else msg.textContent = t("syError");
        });
      }
      save.addEventListener("click", go);
      input.addEventListener("keydown", function (e) { if (e.key === "Enter") go(); });
    }
    draw();
  }

  Loopy.sync = {
    // { on, code, time, status }: status is "off", "idle", "busy", "offline", "gone" (the copy was deleted
    // on another device) or "error".
    state: function () { return { on: !!st, code: st ? st.c : "", time: st ? st.t : 0, status: status }; },
    listen: function (f) { tell.push(f); },
    clean: clean,
    // Turn on with a new family code. A promise of true, or false when the server can't be reached.
    create: function () {
      return derive(newCode()).then(function (/** @type {any} */ s) {
        s.e = ""; s.h = ""; s.t = 0; s.x = 1;
        st = s;
        return round(false).then(function () {
          if (st && st.e) { touch(); return true; }
          st = null; write(); say("off");
          return false;
        });
      });
    },
    // Join with a family code from another device. A promise of "ok", "changed" (it brought stars here),
    // "none" (no family with this code), "bad" (not a code) or "offline".
    join: function (code) {
      var c = clean(code);
      if (!c) return Promise.resolve("bad");
      return derive(c).then(function (/** @type {any} */ s) {
        s.e = ""; s.h = ""; s.t = 0; s.x = 0;
        return get(s).then(function (r) {
          // Only a 404 means "no family with this code"; 429 (too many requests) or a server error is "try later".
          if (r.n === 0 || (r.n !== 200 && r.n !== 404)) return "offline";
          if (r.n !== 200) return "none";
          st = s;
          return round(true).then(function (res) {
            if (!st.e) { st = null; write(); say("off"); return "offline"; }
            touch();
            return res.changed ? "changed" : "ok";
          });
        });
      });
    },
    // Turn off on this device. forget: also delete the family's copy on the server (for every device).
    // With forget, the code and keys stay until the server says the copy is gone (200, or 404: already gone),
    // so a 429 or a dropped connection leaves sync on and Turn off everywhere can be tapped again. A round that
    // is running finishes first and no new one starts meanwhile: a save after the delete would make the copy again.
    off: function (forget) {
      var s = st;
      function clear() { st = null; write(); clearTimeout(timer); clearTimeout(idleTimer); say("off"); }
      if (!forget || !s) { clear(); return Promise.resolve(true); }
      if (ending) return ending;
      clearTimeout(timer); timer = null;
      ending = Promise.resolve(busy).then(function () { return call(s, "?del=1", { k: s.w }); }).then(function (r) {
        ending = null;
        if (r.n !== 200 && r.n !== 404) { if (st === s) later(); return false; }
        if (st === s) clear();          // Turn off was tapped meanwhile, or a new family made: leave that alone
        return true;
      });
      return ending;
    },
    // Sync now (the home page's "Sync now"): a promise of { changed }.
    now: function () { return Loopy.syncPage === "home" ? home() : round(true); },
    // Fills the Family sync part of ⚙ Settings on the home page (box: an empty element).
    settings: settings,
    // The small family code part for the welcome sheet and the row under My stars (see above).
    panel: panel,
    // Share the family link with the phone's share sheet or the clipboard.
    share: share,
    // Fills the "Stay in touch" part of ⚙ Settings on the home page (box: an empty element).
    touch: touchPart
  };

  start();
})();
