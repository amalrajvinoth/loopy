// A small stand-in for Cloudflare D1, with just the queries sync/worker.js makes, for the tests
// (sync/test.mjs and tools/e2e/sync.mjs). Rows live in a Map.
export function fakeD1() {
  const rows = new Map();
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
    throw new Error("fake D1 does not know: " + sql);
  };
  return {
    rows,
    prepare(sql) {
      let args = [];
      const q = {
        bind(...a) { args = a; return q; },
        async first() { return run(sql, args).first ?? null; },
        async run() { const r = run(sql, args); return { meta: { changes: r.changes ?? 0 } }; }
      };
      return q;
    }
  };
}
