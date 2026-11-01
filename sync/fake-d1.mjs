// A small stand-in for Cloudflare D1, with just the queries sync/worker.js makes, for the tests
// (sync/test.mjs and tools/e2e/sync.mjs). Rows live in Maps: rows (families), stats and grownups.
// One fake stands in for both databases (DB and GROWNUPS).
export function fakeD1() {
  const rows = new Map(), stats = new Map(), grownups = new Map();
  const run = (sql, a) => {
    if (/^SELECT e, b FROM families WHERE id = \?$/.test(sql)) { const r = rows.get(a[0]); return { first: r ? { e: r.e, b: r.b } : null }; }
    if (/^SELECT e, k, t FROM families WHERE id = \?$/.test(sql)) { const r = rows.get(a[0]); return { first: r ? { e: r.e, k: r.k, t: r.t } : null }; }
    if (/^SELECT e FROM families WHERE id = \?$/.test(sql)) { const r = rows.get(a[0]); return { first: r ? { e: r.e } : null }; }
    if (/^DELETE FROM families WHERE id = \? AND k = \?$/.test(sql)) { const r = rows.get(a[0]); const hit = r && r.k === a[1]; if (hit) rows.delete(a[0]); return { changes: hit ? 1 : 0 }; }
    if (/^UPDATE families SET e = \?, b = \?, t = \? WHERE id = \? AND e = \?$/.test(sql)) {
      const r = rows.get(a[3]); if (!r || r.e !== a[4]) return { changes: 0 };
      Object.assign(r, { e: a[0], b: a[1], t: a[2] }); return { changes: 1 };
    }
    if (/^INSERT INTO families \(id, k, e, b, t\) VALUES \(\?, \?, \?, \?, \?\) ON CONFLICT\(id\) DO NOTHING$/.test(sql)) {
      if (rows.has(a[0])) return { changes: 0 };
      rows.set(a[0], { k: a[1], e: a[2], b: a[3], t: a[4] }); return { changes: 1 };
    }
    if (/^DELETE FROM families WHERE t < \?$/.test(sql)) { let n = 0; for (const [id, r] of rows) if (r.t < a[0]) { rows.delete(id); n++; } return { changes: n }; }
    if (/^SELECT COUNT\(\*\) AS f, .* FROM families$/.test(sql)) {
      let f = 0, a7 = 0, a30 = 0, bytes = 0;
      for (const r of rows.values()) { f++; if (r.t > a[0]) a7++; if (r.t > a[1]) a30++; bytes += r.b.length; }
      return { first: { f, a7, a30, bytes } };
    }
    if (/^INSERT INTO stats .* ON CONFLICT\(day\) DO UPDATE/.test(sql)) { stats.set(a[0], { day: a[0], families: a[1], active7: a[2], active30: a[3], bytes: a[4] }); return { changes: 1 }; }
    if (/^SELECT day, families, active7, active30, bytes FROM stats ORDER BY day DESC LIMIT \?$/.test(sql)) {
      return { all: [...stats.values()].sort((x, y) => (x.day < y.day ? 1 : -1)).slice(0, a[0]) };
    }
    if (/^SELECT k, t FROM grownups WHERE m = \?$/.test(sql)) { const r = grownups.get(a[0]); return { first: r ? { k: r.k, t: r.t } : null }; }
    if (/^DELETE FROM grownups WHERE m = \? AND k = \?$/.test(sql)) { const r = grownups.get(a[0]); const hit = r && r.k === a[1]; if (hit) grownups.delete(a[0]); return { changes: hit ? 1 : 0 }; }
    if (/^UPDATE grownups SET k = \?, l = \?, t = \? WHERE m = \?$/.test(sql)) { const r = grownups.get(a[3]); if (!r) return { changes: 0 }; Object.assign(r, { k: a[0], l: a[1], t: a[2] }); return { changes: 1 }; }
    if (/^SELECT COUNT\(\*\) AS n FROM grownups$/.test(sql)) return { first: { n: grownups.size } };
    if (/^INSERT INTO grownups \(m, k, l, t\) VALUES \(\?, \?, \?, \?\) ON CONFLICT\(m\) DO NOTHING$/.test(sql)) {
      if (grownups.has(a[0])) return { changes: 0 };
      grownups.set(a[0], { k: a[1], l: a[2], t: a[3] }); return { changes: 1 };
    }
    if (/^DELETE FROM grownups WHERE t < \?$/.test(sql)) { let n = 0; for (const [m, r] of grownups) if (r.t < a[0]) { grownups.delete(m); n++; } return { changes: n }; }
    throw new Error("fake D1 does not know: " + sql);
  };
  return {
    rows, stats, grownups,
    prepare(sql) {
      let args = [];
      const q = {
        bind(...a) { args = a; return q; },
        async first() { return run(sql, args).first ?? null; },
        async all() { return { results: run(sql, args).all ?? [] }; },
        async run() { const r = run(sql, args); return { meta: { changes: r.changes ?? 0 } }; }
      };
      return q;
    }
  };
}
