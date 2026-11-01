# Heal recipes

One per failure. Add new ones at the end (the heal skill step 3). Keep each to four lines.

## Built files out of date
- Looks like: `loopy.js, loopy.css and sw.js do not match` or `build.py --check` fails, or CI "match their sources in src/".
- Cause: `src/` or a page changed and the build was not run (or a merge mixed two builds).
- Fix: `python3 tools/build.py`, commit the result. The Stop hook does this by itself.

## Page security policy out of date
- Looks like: `csp.py --check` names a page, or CI "security policy matches its code".
- Cause: a page's inline `<script>` or `<style>` changed.
- Fix: `python3 tools/build.py` (it runs `tools/csp.py`). Never hand-edit the meta line.

## Missing minifiers
- Looks like: `Missing minifiers. Run: python3 -m pip install ...`
- Fix: `python3 -m pip install --require-hashes --no-binary :all: -r tools/requirements.txt` (session start does it).

## Something loads from outside
- Looks like: `check_external.py` lists a URL.
- Cause: a font, picture, script or style pointing at another website.
- Fix: put the file in the repo (fonts go in `src/fonts/` and `python3 tools/build.py --fonts`) or remove it. Plain links to github.com/amalrajvinoth/loopy are fine.

## Merge conflict in built files
- Looks like: conflicts in `loopy.js`, `loopy.css`, `sw.js` or a page's `Content-Security-Policy` line.
- Fix: `python3 plugins/loopy/scripts/resolve_built.py` (the after_merge hook runs it), then resolve the rest by hand.

## Play test: question came back too soon
- Looks like: `play.mjs` says a key repeats within 10.
- Cause: the game makes questions without `Loopy.fresh`, or its key is not unique per question.
- Fix: make questions through `Loopy.fresh(recent, make)` with a key that names the whole question.

## Play test or accessibility check cannot start
- Looks like: `Cannot find module 'playwright-core'` or `No Chrome or Chromium found`.
- Fix: `npm ci --prefix tools/a11y --ignore-scripts`; in the cloud Chromium is in `/opt/pw-browsers`, else `CHROME=/path/to/chrome`.

## Offline copy keeps an old page
- Looks like: `tools/e2e/offline.mjs` fails, or CI "After an update, phones save the new pages, never an old one"; or a phone still shows an old page (no logo, blank Print) after a fix shipped.
- Cause: `src/sw.js` saved a file without checking it against its hash in `FILES`, so an old copy from the server stayed saved.
- Fix: keep the hash check in `src/sw.js` (`matches` and `download`), run `python3 tools/build.py`, then `node tools/e2e/offline.mjs`. Never tell people to clear site data: it loses stars. (21 Oct 2026)

## Family sync fails
- Looks like: `node sync/test.mjs` or `node tools/e2e/sync.mjs` fails, or CI "The Family sync server answers right" or "Family sync keeps two devices in step, and sends nothing when it is off". Or the "Family sync server" deploy job fails.
- Cause: a change to `sync/worker.js` or `src/loopy-sync.js` broke the request format (simple GET and text/plain POST, no custom headers), the merge, or loading only when on. A deploy failure is usually a missing or expired Cloudflare secret.
- Fix: run both tests and fix what they name. Never make loopy.js load `loopy-sync.js` on a device where sync is off. For a deploy failure, ask the owner to check `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` (sync/README.md). (22 Oct 2026)

## review.py "must"
- Looks like: a `must` row in the `tools/review.py` table.
- Fix: do what the row says (a missing GAMES entry, README, saved key nothing reads). For a saved key, add a migration from the old key, never just delete it.

## Plugin behind the repo
- Looks like: `drift.py` says "The loopy plugin is behind the repo".
- Fix: the evolve skill. In short: update the skill or hook it names, then `python3 plugins/loopy/scripts/drift.py --update`.

## Plugin copies out of date
- Looks like: `plugins/sync.py --check` fails, or CI "plugin copies".
- Fix: `python3 plugins/sync.py`, commit `.claude/`. Edit `plugins/`, never `.claude/skills` copies.

## Guide page missing for a game
- Looks like: `guide_check.py` says "no guide page games/<subject>/<game>.mdx" or "missing in guide-src/src/games.ts", or CI "Every game has a page in the guide".
- Fix: copy `guide-src/src/content/docs/games/math/box-multiply.mdx` (and its `de/` twin) for the game, add it to `guide-src/src/games.ts`, run `npm run screens --prefix guide-src`. See guide-src/README.md. (20 Oct 2026)

## Guide build or check fails
- Looks like: CI "guide" job: "No picture src/assets/screens/...", "still has a style attribute", a broken link, or an MDX error at a line.
- Fix: run `npm run screens --prefix guide-src` for a missing picture; in `.mdx` text never write a bare `<`, `{` or `}`; links start with `/loopy/guide/` (German `/loopy/guide/de/`). Then `npm run build --prefix guide-src && node guide-src/scripts/check.mjs`. (20 Oct 2026)

## All checks fails, or a long check did not run
- Looks like: CI "All checks" lists a job as failure or cancelled; or a page change passed without the accessibility, play or guide jobs running.
- Cause: a job above it failed (fix that job), a newer push stopped this run (cancelled: look at the newer run), or `tools/ci_changes.py` treats a file the pages read as docs.
- Fix: open the failed job named in the list. For a wrong skip, narrow the DOCS or GUIDE pattern in `tools/ci_changes.py` and test it with `python3 tools/ci_changes.py origin/main HEAD`. (20 Oct 2026)

## Levels test fails
- Looks like: `node tools/e2e/levels.mjs` fails, or CI "Levels follow the child: up by itself when ready, kept over the birthday".
- Cause: a change to `Loopy.levels` (`up`, `ripe`, the `loopy.levels` record or the birthday carry), `Loopy.recent` (keeps 20), or a game's level-up card; a badge card comes first at the first 10 in a row, so the level up waits for the next right answer.
- Fix: run the test with `CHROME=` set to the browser; fix what it names in `src/loopy.js` or `src/loopy-levels.js`, never loosen the counts. Then `python3 tools/build.py` and `node tools/e2e/play.mjs` (it taps "Yay!" on the card). (23 Oct 2026)

## Live site check fails after a deploy
- Looks like: CI "Pages" run, job "Live site check": "the live site still serves an older version, or a page does not answer".
- Cause: Pages took longer than ten minutes (rare), the deploy job failed before it, or the guide folder is missing from the site.
- Fix: open the Pages run; if the deploy job is green, run the workflow again (Actions → Pages → Run workflow) and the check passes once the new version is out. If it is red on the second run, compare `sw.js` on the live site with `sw.js` on `main`. (25 Oct 2026)

## A Dependabot pull request did not merge by itself
- Looks like: a green Dependabot pull request stays open; or the "Dependabot merge" run says "nothing to merge".
- Cause: the merge job only runs for a "Checks" run that passed on a pull request from a `dependabot/` branch against `main`; a push to the branch after the run (a rebase) changes the commit, so the run no longer matches.
- Fix: nothing to do when a newer "Checks" run is still going; it merges after that one. For a red one, fix the pull request like any other (it is not merged on purpose). After a merge by the token, the Pages deploy and the checks on `main` are started by the workflow itself. (25 Oct 2026)

## Lighthouse run is red
- Looks like: the monthly "Lighthouse" run: "N score(s) under 90", with the page and the category in the step log.
- Cause: a page got heavier or slower (new pictures, more script before the first paint), or an accessibility rule the a11y check does not cover.
- Fix: download the reports kept with the run and open the page's HTML report; it lists what cost the points. Size: `python3 tools/review.py` (100 KB per page). Fix in `src/`, rebuild, and run the workflow again (Actions → Lighthouse → Run workflow) after the merge. (25 Oct 2026)

## Family sync usage job is red
- Looks like: the hand-run "Family sync usage" job fails in "Count families and grown-ups": `test -n "$id"` fails, wrangler says "Authentication error", or `tools/sync-usage.mjs` throws on JSON.
- Cause: a missing or expired Cloudflare secret, the `loopy-sync` database renamed, or wrangler's `--json` output changed shape.
- Fix: ask the owner to check `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` (sync/README.md). For a shape change, run `npx wrangler d1 execute loopy-sync --remote --json --command "SELECT 1"` and fit `query()` in `tools/sync-usage.mjs` to it. It must keep printing counts only: the log is public. (1 Nov 2026)
