# Family sync server

Family sync keeps a family's stars the same on all their devices, by themselves. This folder is the small server it uses: a Cloudflare Worker with a D1 database, on Cloudflare's free plan. It is not part of the site, and Pages does not publish it.

The plan and the options it was picked from: [docs/plans/remote-sync/](../docs/plans/remote-sync/README.md). Roadmap issue: #131.

## How it works

- **Off by default.** A device sends nothing until a grown-up taps **Turn on** or **Join with a code** in ⚙ Settings on the home page. With sync off, `loopy-sync.js` is never loaded, so the site is exactly as fast as before.
- **One family code.** Turn on makes a 16-letter family code, such as `7K2M-QX9D-4HPT-W3RA`. Another device joins by typing it or by scanning its QR code.
- **Locked before it leaves.** The device makes three things from the code (PBKDF2-SHA256, 200,000 rounds): the family's id, a write key, and the key that locks the data (AES-GCM). It sends only the locked copy. The server never sees the code and cannot read the copy.
- **The pages never wait.** Stars are saved in the browser first, as always. The home page reads the family copy after it has loaded, adds what is new (the same merge as a stars code: the bigger number wins, nothing is taken away) and sends this device's copy back. It reloads once if the copy brought something new. A game page sends its new stars 20 seconds after a change, at most every 2 minutes, and when the game is left.
- **A device left open catches up.** After 5 minutes with no tap, click or key, any page reads the family copy and reloads once if something new came. While nobody touches it, it checks again every 15 minutes, for up to an hour. It never does this while loopy is hidden, or while a box or Settings is open. That is at most 4 reads an idle hour, and a read with nothing new is a few bytes.
- **Old copies go.** A family copy not saved for 400 days is deleted every night.
- **Counts, no names.** The same nightly job writes one row into a `stats` table: the day, how many families there are, how many saved in the last 7 and 30 days, and the size of all copies together. `GET /stats` answers the last 90 rows. No ids, no names, no emails.

## Stay in touch

A grown-up can leave their email in ⚙ Settings on the home page (above Family sync), to hear about new games. Nothing is sent until they tap **Save**. The email, the language (`en` or `de`) and the time go to this same Worker (`POST /g`) and into a **second database**, `loopy-grownups`, made in the EU (`--location weur`), apart from the family copies. The device makes a random remove key and keeps it in the browser (`loopy.touch`); the server keeps only a hash of it, so only that device can delete the row (**Remove**, `POST /g?del=1`). The key never changes once an email is saved, so posting someone else's email cannot take their row over, and the server answers the same whether an email is on the list or not. The owner can delete rows by hand in the D1 Console. An email is deleted 2 years after it was saved. The site's privacy note (`privacy/`) says all this to parents.

To read the list: Cloudflare dashboard, **Storage & Databases**, **D1**, **loopy-grownups**, **Console**:

```sql
SELECT m AS email, l AS lang, datetime(t / 1000, 'unixepoch') AS saved FROM grownups ORDER BY t DESC;
SELECT COUNT(*) AS grownups FROM grownups;
```

And the counts, in **loopy-sync**:

```sql
SELECT * FROM stats ORDER BY day DESC;
```

## What the server answers

| Request | Answer |
| --- | --- |
| `GET /f/<id>?e=<hash>` | `200 {e, b}` the locked copy and its hash, `204` when it has not changed since `<hash>`, `404` when there is none |
| `POST /f/<id>?e=<hash>` with `{k, b}` | `200 {e}` saved. `412 {e}` another device saved first: read again, merge, try again. `403` wrong write key. `429` less than 10 seconds since the last save. `413` too big. `400` not a locked copy |
| `POST /f/<id>?del=1` with `{k}` | Deletes the family copy |
| `GET /stats` | The last 90 nightly rows of counts: `[{day, families, active7, active30, bytes}]` |
| `POST /g` with `{m, l, k}` | Saves a grown-up's email `m` with language `l` and remove key `k`. `200 {}`. `400` not an email. `429` the same device saved it less than 10 seconds ago. `503` no emails database. An email already on the list keeps its first key: a save with another key changes nothing and still answers `200`, so nobody can take a row over or find out who is on the list |
| `POST /g?del=1` with `{m, k}` | Deletes that email. `200` deleted. `404` no row with this email and this key: unknown, or saved first from another device (the same answer for both, on purpose) |

Requests are plain `GET` and `POST` with `text/plain`, so the browser sends them without an extra check first (no CORS preflight). Only the pages in `ORIGINS` (`wrangler.toml`) may read the answers. A copy is at most 70 KB. The server keeps a hash of the write key, never the key.

## Files

| File | What it is |
| --- | --- |
| `worker.js` | The server |
| `schema.sql` | The tables `families` and `stats` in `loopy-sync` |
| `grownups.sql` | The table `grownups` in `loopy-grownups` (EU) |
| `wrangler.toml` | Cloudflare settings. `DATABASE_ID` and `GROWNUPS_ID` are filled in by the deploy job |
| `test.mjs`, `fake-d1.mjs` | Tests with a stand-in database: `node sync/test.mjs` (CI runs it on every change) |

The browser side is `src/loopy-sync.js` and the Family sync part of ⚙ Settings in `index.html`. `tools/e2e/sync.mjs` tests both with this server and two browser profiles.

## Free plan limits

Cloudflare's free plan allows 100,000 requests a day, and D1 allows 100,000 saves and 5 million reads a day with 5 GB of space. A family that plays every day uses a few dozen requests. So the free plan covers thousands of families.

## Set it up (the repo owner, once)

1. Make a free account at dash.cloudflare.com.
2. Open **Workers & Pages** once and pick a workers.dev name, for example `amal`. The server's address will be `loopy-sync.amal.workers.dev`.
3. Make an API token with only what the deploy needs: profile icon, **My Profile**, **API Tokens**, **Create Token**, **Create Custom Token**. Add three **Account** permissions: **Workers Scripts: Edit**, **D1: Edit** and **Account Settings: Read**. Under Account Resources include only your account. Add no zone permissions and no IP filter (GitHub's runners change address). **Continue to summary**, **Create Token**, and copy it.
4. Copy the **Account ID** from the right side of the Workers & Pages overview.
5. In GitHub: **Settings**, **Secrets and variables**, **Actions**, **New repository secret**. Add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.
6. Run the **Family sync server** workflow (Actions tab, **Run workflow**), or push a change to `sync/`. It makes the `loopy-sync` database the first time (and `loopy-grownups` in the EU), sets up their tables and deploys the server.
7. Turn it on in the site: set `Loopy.syncHost = "loopy-sync.<name>.workers.dev";` in `src/loopy.js`, then run `python3 tools/build.py` and `python3 tools/csp.py`. The page policy now allows that one address. Until this step, the site shows nothing about Family sync and sends nothing. Done for loopy on 22 Oct 2026: the server is `loopy-sync.loopy-1e2.workers.dev`.

## Try it on your computer

```sh
cd sync
npx --yes wrangler@4.149.0 d1 execute loopy-sync --local --file schema.sql
npx --yes wrangler@4.149.0 d1 execute loopy-grownups --local --file grownups.sql
npx --yes wrangler@4.149.0 dev --local
```
