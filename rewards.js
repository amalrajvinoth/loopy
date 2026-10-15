// Loopy rewards: a star for every right answer, badges for star totals, confetti for streaks.
// Progress is kept in this browser's localStorage (no account, nothing sent anywhere).
(function () {
  var KEY = "loopy.rewards";
  var BADGES = [
    { stars: 10,   name: "First Steps",   color: "--c3" },
    { stars: 25,   name: "Rising Star",   color: "--c1" },
    { stars: 50,   name: "Super Learner", color: "--c2" },
    { stars: 100,  name: "Brain Builder", color: "--c4" },
    { stars: 250,  name: "Champion",      color: "--c5" },
    { stars: 500,  name: "Legend",        color: "--c1" },
    { stars: 1000, name: "Loopy Master",  color: "--c2" }
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
  function celebrate(title, text, big) {
    var old = document.querySelector(".loopy-cheer");
    if (old) old.remove();
    var el = document.createElement("div");
    el.className = "loopy-cheer" + (big ? " big" : "");
    el.setAttribute("role", "status");
    el.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + STAR_PATH + '"/></svg><strong></strong><span></span>' +
      (big ? '<button type="button">Yay!</button>' : "");
    el.querySelector("strong").textContent = title;
    el.querySelector("span").textContent = text;
    document.body.appendChild(el);
    var close = function () { el.classList.add("out"); setTimeout(function () { el.remove(); }, 250); };
    if (big) { var b = el.querySelector("button"); b.addEventListener("click", close); b.focus({ preventScroll: true }); }
    else setTimeout(close, 2200);
    confetti(big ? 160 : 70);
  }

  function badgeFor(stars) { var got = null; BADGES.forEach(function (b) { if (stars >= b.stars) got = b; }); return got; }
  function nextBadge(stars) { for (var i = 0; i < BADGES.length; i++) if (stars < BADGES[i].stars) return BADGES[i]; return null; }

  function updateChips() {
    document.querySelectorAll("[data-loopy-stars]").forEach(function (n) { n.textContent = data.stars; });
  }

  var Loopy = window.Loopy = window.Loopy || {};
  Loopy.rewards = {
    BADGES: BADGES, STAR_PATH: STAR_PATH,
    get: function () { return data; },
    badgeFor: badgeFor, nextBadge: nextBadge, confetti: confetti, celebrate: celebrate,
    // Call after each right answer with the current streak.
    correct: function (game, streak) {
      var before = badgeFor(data.stars);
      data.stars++;
      if (streak <= 1) cheeredBest[game] = false;
      var newBest = streak > (data.best[game] || 0);
      if (newBest) data.best[game] = streak;
      save(); updateChips();
      var after = badgeFor(data.stars);
      if (after && after !== before) {
        celebrate("New badge: " + after.name + "!", "You have earned " + data.stars + " stars. Keep going!", true);
      } else if (STREAKS.indexOf(streak) !== -1) {
        celebrate(streak + " in a row!", newBest ? "That's your best streak yet!" : "Amazing work!", false);
      } else if (newBest && streak > 5 && !cheeredBest[game]) {
        cheeredBest[game] = true;
        celebrate("New best streak: " + streak + "!", "Keep it going!", false);
      }
    }
  };

  // Star counter chip: <span id="star-chip"></span> becomes a star with the total.
  function build() {
    var chip = document.getElementById("star-chip");
    if (chip) {
      chip.className = "star-chip";
      chip.setAttribute("aria-label", "Stars earned");
      chip.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + STAR_PATH + '"/></svg><b data-loopy-stars></b>';
    }
    updateChips();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
  else build();
})();
