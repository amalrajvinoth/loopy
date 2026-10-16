/* Loopy offline helper (a service worker). After one visit, loopy opens with no internet.

   On the first visit it saves every page, script, style, font and icon on the device, and
   from then on loopy opens from that saved copy, online or not. That is fast, and every
   file always comes from the same version of the site.

   tools/build.py writes the served ../sw.js from this file and puts two lines in front:
     VERSION  a hash of every saved file.
     FILES    the files to save, relative to the site root, each with its own short hash.
              Pages are saved as "math/plus-minus/".
   A new version of the site gives a new hash, so sw.js changes. The browser checks sw.js each
   time loopy opens (at least once a day) and installs the new helper. That helper copies the files
   whose hash did not change from the old saved copy and downloads only the changed ones, then
   drops the old copy. The next page that opens shows the new version.
   Edit this file, then run: python3 tools/build.py */

var CACHE = "loopy-" + VERSION;
// Each saved copy also keeps its own file list with hashes, under this key, for the next version to compare with.
var LIST = new URL("loopy-files", self.location).href;
var SAVED = {};
Object.keys(FILES).forEach(function (f) { SAVED[new URL(f, self.location).href] = FILES[f]; });

// "math/plus-minus", "math/plus-minus/index.html" and "math/plus-minus/?x" are all the page
// saved as "math/plus-minus/".
function key(url) {
  var u = new URL(url);
  u.search = "";
  u.hash = "";
  u.pathname = u.pathname.replace(/\/index\.html$/, "/").replace(/\/([^\/.]+)$/, "/$1/");
  return u.href;
}

// The old saved copy and its file list, or null when there is none (a first visit, or an older helper
// that kept no list). Then every file is downloaded.
function oldCopy() {
  return caches.keys().then(function (names) {
    var old = names.filter(function (n) { return n.indexOf("loopy-") === 0 && n !== CACHE; });
    if (!old.length) return null;
    return caches.open(old[old.length - 1]).then(function (cache) {
      return cache.match(LIST).then(function (r) { return r ? r.json() : null; }).then(function (list) {
        return list && typeof list === "object" ? { cache: cache, list: list } : null;
      });
    });
  }).catch(function () { return null; });
}

self.addEventListener("install", function (e) {
  e.waitUntil(Promise.all([caches.open(CACHE), oldCopy()]).then(function (got) {
    var cache = got[0], old = got[1];
    return Promise.all(Object.keys(SAVED).map(function (url) {
      // A file with the same hash as before is copied from the old saved copy, not downloaded again.
      var same = old && old.list[url] === SAVED[url] ? old.cache.match(url) : Promise.resolve(null);
      return same.then(function (res) {
        if (res) return cache.put(url, res);
        // "reload" skips the browser's own short-term copy, so the saved files are the new ones.
        return fetch(new Request(url, { cache: "reload" })).then(function (r) {
          if (!r.ok) throw new Error("could not save " + url);
          return cache.put(url, r);
        });
      });
    })).then(function () {
      return cache.put(LIST, new Response(JSON.stringify(SAVED), { headers: { "Content-Type": "application/json" } }));
    });
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
