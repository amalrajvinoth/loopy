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
   Every file is checked against its hash before it is saved, the copied ones too. Right after an update
   the site's servers can still hand out the old file for a few minutes; that file is then asked for
   again past them (with ?v=<hash>), so an old page is never saved as the new one. A saved copy that
   is already wrong (from before this check) is downloaded again.
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
// that kept no list). Then every file is downloaded. More than one old copy is rare (an update that was
// cut off before the old copy was dropped); then the one that shares the most files with this version
// is used, whatever order the browser lists them in.
function oldCopy() {
  return caches.keys().then(function (names) {
    return Promise.all(names.filter(function (n) { return n.indexOf("loopy-") === 0 && n !== CACHE; }).map(function (n) {
      return caches.open(n).then(function (cache) {
        return cache.match(LIST).then(function (r) { return r ? r.json() : null; }).then(function (list) {
          if (!list || typeof list !== "object") return null;
          var same = Object.keys(SAVED).filter(function (url) { return list[url] === SAVED[url]; }).length;
          return { cache: cache, list: list, same: same };
        });
      }).catch(function () { return null; });
    }));
  }).then(function (copies) {
    return copies.reduce(function (best, c) { return c && (!best || c.same > best.same) ? c : best; }, null);
  }).catch(function () { return null; });
}

// Does this response hold the file with this short hash (the first 10 hex digits of its SHA-256)?
function matches(res, want) {
  if (!res || !self.crypto || !crypto.subtle) return Promise.resolve(!!res);
  return res.clone().arrayBuffer().then(function (buf) { return crypto.subtle.digest("SHA-256", buf); }).then(function (d) {
    return Array.prototype.map.call(new Uint8Array(d), function (b) { return (b < 16 ? "0" : "") + b.toString(16); }).join("").slice(0, 10) === want;
  }, function () { return true; });
}
// Download one file. "reload" skips the browser's own short-term copy. If what comes back is not this
// version yet, ask once more with ?v=<hash>, which the site's servers have not seen before.
function download(url) {
  var get = function (u) {
    return fetch(new Request(u, { cache: "reload" })).then(function (r) {
      if (!r.ok) throw new Error("could not save " + url);
      return r;
    });
  };
  return get(url).then(function (r) {
    return matches(r, SAVED[url]).then(function (ok) {
      if (ok) return r;
      var u = new URL(url);
      u.searchParams.set("v", SAVED[url]);
      return get(u.href);
    });
  });
}

self.addEventListener("install", function (e) {
  e.waitUntil(Promise.all([caches.open(CACHE), oldCopy()]).then(function (got) {
    var cache = got[0], old = got[1];
    return Promise.all(Object.keys(SAVED).map(function (url) {
      // A file with the same hash as before is copied from the old saved copy, not downloaded again,
      // when the saved file really is that one.
      var same = old && old.list[url] === SAVED[url] ? old.cache.match(url) : Promise.resolve(null);
      return same.then(function (res) {
        return matches(res, SAVED[url]).then(function (ok) { return res && ok ? res : download(url); });
      }).then(function (res) { return cache.put(url, res); });
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
