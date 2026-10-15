// Loopy age picker: games use the age to pick their difficulty.
// The default age comes from a birth month of August 2018 and goes up by itself each year.
(function () {
  var BIRTH_YEAR = 2018, BIRTH_MONTH = 8;
  var MIN = 5, MAX = 16, KEY = "loopy.age";
  var clamp = function (n) { return Math.max(MIN, Math.min(MAX, n)); };

  function defaultAge() {
    var d = new Date();
    var a = d.getFullYear() - BIRTH_YEAR;
    if (d.getMonth() + 1 < BIRTH_MONTH) a--;
    return clamp(a);
  }
  var age = null;
  try { age = parseInt(localStorage.getItem(KEY), 10); } catch (e) {}
  if (!(age >= MIN && age <= MAX)) age = defaultAge();

  var Loopy = window.Loopy = window.Loopy || {};
  Loopy.getAge = function () { return age; };
  Loopy.setAge = function (n) {
    n = clamp(n);
    if (n === age) return;
    age = n;
    try { localStorage.setItem(KEY, String(age)); } catch (e) {}
    sync();
    window.dispatchEvent(new CustomEvent("loopy:age", { detail: age }));
  };

  function build() {
    var box = document.getElementById("age-picker");
    if (!box) return;
    box.className = "age-picker";
    box.setAttribute("role", "group");
    box.setAttribute("aria-label", "Age");
    box.innerHTML = '<button type="button" id="age-down" aria-label="Younger">&minus;</button>' +
      '<span id="age-label" aria-live="polite"></span>' +
      '<button type="button" id="age-up" aria-label="Older">+</button>';
    document.getElementById("age-down").addEventListener("click", function () { Loopy.setAge(age - 1); });
    document.getElementById("age-up").addEventListener("click", function () { Loopy.setAge(age + 1); });
    sync();
  }
  function sync() {
    var l = document.getElementById("age-label");
    if (!l) return;
    l.textContent = "Age " + age;
    document.getElementById("age-down").disabled = age <= MIN;
    document.getElementById("age-up").disabled = age >= MAX;
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
  else build();
})();
