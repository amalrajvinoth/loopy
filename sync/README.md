# Family sync server

Family sync keeps a family's stars the same on all their devices, by themselves. This folder is the small server it uses: a Cloudflare Worker with a D1 database, on Cloudflare's free plan. It is not part of the site, and Pages does not publish it.

The plan and the options it was picked from: [docs/plans/remote-sync/](../docs/plans/remote-sync/README.md). Roadmap issue: #131.

## How it works

- **Off by default.** A device sends nothing until a grown-up taps **Turn on** or **Join with a code** in ⚙ Settings on the home page. With sync off, `loopy-sync.js` is never loaded, so the site is exactly as fast as before.
- **One family code.** Turn on makes a 16-letter family code, such as `7K2M-QX9D-4HPT-W3RA`. Another device joins by typing it or by scanning its QR code.
- **Locked before it leaves.** The device makes three things from the code (PBKDF2-SHA256, 200,000 rounds): the family's id, a write key, and the key that locks the data (AES-GCM). It sends only the locked copy. The server never sees the code and cannot read the copy.
- **The pages never wait.** Stars are saved in the browser first, as always. The home page reads the family copy after it has loaded, adds what is new (the same merge as a stars code: the bigger number wins, nothing is taken away) and sends this device's copy back. It reloads once if the copy brought something new. A game page sends its new stars 20 seconds after a change, at most every 2 minutes, and when the game is left.
- **Old copies go.** A family copy not saved for 400 days is deleted every night.

## What the server answers

| Request | Answer |
| --- | --- |
| `GET /f/<id>?e=<hash>` | `200 {e, b}` the locked copy and its hash, `204` when it has not changed since `<hash>`, `404` when there is none |
| `POST /f/<id>?e=<hash>` with `{k, b}` | `200 {e}` saved. `412 {e}` another device saved first: read again, merge, try again. `403` wrong write key. `429` less than 10 seconds since the last save. `413` too big. `400` not a locked copy |
| `POST /f/<id>?del=1` with `{k}` | Deletes the family copy |

Requests are plain `GET` and `POST` with `text/plain`, so the browser sends them without an extra check first (no CORS preflight). Only the pages in `ORIGINS` (`wrangler.toml`) may read the answers. A copy is at most 70 KB. The server keeps a hash of the write key, never the key.

## Files

| File | What it is |
| --- | --- |
| `worker.js` | The server |
| `schema.sql` | The one table, `families` |
| `wrangler.toml` | Cloudflare settings. `DATABASE_ID` is filled in by the deploy job |
| `test.mjs`, `fake-d1.mjs` | Tests with a stand-in database: `node sync/test.mjs` (CI runs it on every change) |

The browser side is `src/loopy-sync.js` and the Family sync part of ⚙ Settings in `index.html`. `tools/e2e/sync.mjs` tests both with this server and two browser profiles.

## Free plan limits

Cloudflare's free plan allows 100,000 requests a day, and D1 allows 100,000 saves and 5 million reads a day with 5 GB of space. A family that plays every day uses a few dozen requests. So the free plan covers thousands of families.

## Set it up (the repo owner, once)

1. Make a free account at dash.cloudflare.com.
2. Open **Workers & Pages** once and pick a workers.dev name, for example `amal`. The server's address will be `loopy-sync.amal.workers.dev`.
3. Make an API token: profile icon, **My Profile**, **API Tokens**, **Create Token**, then **Use template** next to **Edit Cloudflare Workers**. Add one more permission: **Account**, **D1**, **Edit**. Under Account Resources pick your account, under Zone Resources pick **All zones**. **Continue to summary**, **Create Token**, and copy it.
4. Copy the **Account ID** from the right side of the Workers & Pages overview.
5. In GitHub: **Settings**, **Secrets and variables**, **Actions**, **New repository secret**. Add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.
6. Run the **Family sync server** workflow (Actions tab, **Run workflow**), or push a change to `sync/`. It makes the `loopy-sync` database the first time, sets up its table and deploys the server.
7. Turn it on in the site: set `Loopy.syncHost = "loopy-sync.<name>.workers.dev";` in `src/loopy.js`, then run `python3 tools/build.py` and `python3 tools/csp.py`. The page policy now allows that one address. Until this step, the site shows nothing about Family sync and sends nothing.

## Try it on your computer

```sh
cd sync
npx --yes wrangler@4.149.0 d1 execute loopy-sync --local --file schema.sql
npx --yes wrangler@4.149.0 dev --local
```
