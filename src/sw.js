/* Loopy offline helper (a service worker). After one visit, loopy opens with no internet.

   On the first visit it saves every page, script, style, font and icon on the device, and
   from then on loopy opens from that saved copy, online or not. That is fast, and every
   file always comes from the same version of the site.

   tools/build.py writes the served ../sw.js from this file and puts two lines in front:
     VERSION  a hash of every saved file.
     FILES    the files to save, relative to the site root. Pages are saved as "math/plus-minus/".
   A new version of the site gives a new hash, so sw.js changes. The browser checks sw.js each
   time loopy opens (at least once a day), installs the new helper, saves all files again and
   drops the old copy. The next page that opens shows the new version.
   Edit this file, then run: python3 tools/build.py */

var CACHE = "loopy-" + VERSION;
var SAVED = {};
FILES.forEach(function (f) { SAVED[new URL(f, self.location).href] = true; });

// "math/plus-minus", "math/plus-minus/index.html" and "math/plus-minus/?x" are all the page
// saved as "math/plus-minus/".
function key(url) {
  var u = new URL(url);
  u.search = "";
  u.hash = "";
  u.pathname = u.pathname.replace(/\/index\.html$/, "/").replace(/\/([^\/.]+)$/, "/$1/");
  return u.href;
}

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (cache) {
    // "reload" skips the browser's own short-term copy, so the saved files are the new ones.
    return cache.addAll(FILES.map(function (f) { return new Request(f, { cache: "reload" }); }));
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (names) {
    return Promise.all(names.filter(function (n) {
      return n.indexOf("loopy-") === 0 && n !== CACHE;
    }).map(function (n) { return caches.delete(n); }));
  }).then(function () { return self.clients.claim(); }));
});

// Saved files come from the saved copy. Anything else goes to the site as usual.
self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var k = key(req.url);
  if (!SAVED[k]) return;
  // "math/plus-minus" without the last "/" goes to "math/plus-minus/", like the site does,
  // so the page's links (../../loopy.js) still point to the right place.
  if (req.mode === "navigate" && /\/[^\/.]+$/.test(new URL(req.url).pathname)) {
    e.respondWith(Response.redirect(k, 301));
    return;
  }
  e.respondWith(caches.open(CACHE).then(function (cache) { return cache.match(k); }).then(function (res) {
    return res || fetch(req);
  }));
});
