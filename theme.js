// Loopy themes: black is the default, the choice is remembered on this device.
(function () {
  var THEMES = [
    { id: "black",  name: "Black",  bg: "#0a0a0c", dot: "#5b9dff" },
    { id: "sunny",  name: "Sunny",  bg: "#fff8ec", dot: "#d4561f" },
    { id: "ocean",  name: "Ocean",  bg: "#06263a", dot: "#4cc9f0" },
    { id: "candy",  name: "Candy",  bg: "#fff0f6", dot: "#c2257a" },
    { id: "forest", name: "Forest", bg: "#0f1f17", dot: "#8ce99a" }
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
    box.setAttribute("aria-label", "Color theme");
    THEMES.forEach(function (t) {
      var b = document.createElement("button");
      b.type = "button";
      b.id = "theme-" + t.id;
      b.title = t.name;
      b.setAttribute("aria-label", t.name + " theme");
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
