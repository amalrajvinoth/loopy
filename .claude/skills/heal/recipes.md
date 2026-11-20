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
- Looks like: `Missing minifiers. Run: npm ci --prefix tools/build --ignore-scripts` (or `Node.js is not installed`).
- Fix: `npm ci --prefix tools/build --ignore-scripts` (session start does it). The minifier is esbuild, pinned in `tools/build/package-lock.json`; Dependabot updates it. A minifier error names a real mistake in `src/` (an unclosed brace, a bad selector): fix the source.

## Type check fails
- Looks like: CI step "The shared script and its parts type-check against src/loopy.d.ts" is red; `src/loopy.js(123,4): error TS2339: Property 'x' does not exist on type 'Loopy'`.
- Fix: a new `Loopy` member or a changed signature goes in `src/loopy.d.ts` too. A DOM slip (`.value` on an `Element`) gets a JSDoc cast, `/** @type {HTMLInputElement} */ (el)`, never a behaviour change to make the checker happy. Run `node tools/build/node_modules/typescript/bin/tsc -p tools/build` until it is quiet.

## A browser test is red in WebKit only
- Looks like: "play test (part 1 of 2, webkit)" or "accessibility (part 2 of 2, webkit)" red while the chromium job of the same part is green.
- Fix: Safari does something differently. Read the failing page and age in the job's table, run `ENGINE=webkit node tools/e2e/play.mjs` with `GAME=<id>` (once: `node tools/a11y/node_modules/playwright-core/cli.js install --with-deps webkit`), and fix the page for both engines (`dvh` units, `:has()`, `<dialog>` focus, speech and audio timing are the usual suspects). Never drop the WebKit run. If WebKit itself could not install (the step before the test is red), re-run the job once; a second time, pin the Playwright download to the version in `tools/a11y/package-lock.json`.

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

## Switch test fails
- Looks like: `node tools/e2e/switch.mjs` fails, or CI "Switching the child mid-game: each child keeps their own stars, log and last game".
- Cause: a change to `Loopy.store`, `Loopy.kids.use` (the `switching` guard that drops saves until the reload), the "Who is playing?" sheet (`.kid-switch`, `.kid-list .kid-row`), the child chip in the game bar, `Loopy.last` or `Loopy.log`; or Plus and Minus changed its ids (`top-num`, `bot-num`, `op-sign`, `#pad [data-d]`, `k-go`).
- Fix: run the test; fix what it names in `src/loopy.js`, never save during a switch. Then `python3 tools/build.py` and `GAME=plus-minus node tools/e2e/play.mjs`. (17 Nov 2026)

## First visit test fails
- Looks like: `node tools/e2e/hello.mjs` fails, or CI "The first visit: the welcome sheet once, the family code row until a code is set".
- Cause: a change to `src/loopy-hello.js` (the sheet's steps, `dialog.hello`, `#family-row`), the home page's `hello()` hook (it waits for `Loopy.keep.done` and the `loopy:kept` event, and reads `CAME_BY_LINK` before the hash is taken off), `Loopy.kids.edit`, `Loopy.setAge`, the language rule in `src/loopy.js` (German from `navigator.language` only when nothing is saved), or a test that now starts with an empty browser and meets the sheet (set `loopy.hello` to `{"w":1}` in its init script, as `sync.mjs` does).
- Fix: run the test; fix what it names, then `python3 tools/build.py`, `node tools/e2e/hello.mjs` and `node tools/e2e/sync.mjs` (its last part uses the row). (19 Nov 2026)

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
- Looks like: the Monday (or hand-run) "Family sync usage" job fails in "Count families and grown-ups": `test -n "$id"` fails, wrangler says "Authentication error", or `tools/sync-usage.mjs` throws on JSON. Or it fails in "Find the issue that keeps the counts" / "Keep the counts in the issue, and comment when something is new": `gh` says 403 or "could not resolve to an Issue".
- Cause: a missing or expired Cloudflare secret, the `loopy-sync` database renamed, or wrangler's `--json` output changed shape. For the issue steps: the workflow lost `issues: write`, or the open issue titled "Family sync and grown-ups" lost its `usage` label (the job finds it by label and title; a closed one is fine, the job makes a new one).
- Fix: ask the owner to check `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` (sync/README.md). For a shape change, run `npx wrangler d1 execute loopy-sync --remote --json --command "SELECT 1"` and fit `query()` in `tools/sync-d1.mjs` to it, then `node tools/sync-usage.test.mjs`. It must keep printing counts only: the issue and the log are public. (1 Nov 2026, Monday issue 18 Nov 2026)

## Forks and stars job is red
- Looks like: the Monday "Forks and stars" run fails in "New forks and stars since the last run": `gh api` or `gh issue` says "Resource not accessible by integration" (HTTP 403).
- Cause: the Actions token may list forks, read the totals and write issues, but not list who starred (403) nor read traffic (both tried 2 November 2026; plain requests without a token get 401 on the runner). So stars are counted against the count kept in the "Forks and stars" issue's text, and a 403 means a new endpoint was added, or `issues: write` or `actions: read` was taken out of the job's `permissions`. Clone counts are optional and never fail the job.
- Fix: keep to the endpoints the job uses; put the permissions back in `forks.yml`. Run it again: Actions → Forks and stars → Run workflow. (2 Nov 2026)

## Play test: a day counted that should not, or Today's 10 did not count
- Looks like: `play.mjs` says `N right answers counted as a day, which only Today's 10 does` or `finishing Today's 10 did not count the day`.
- Cause: something calls `Loopy.daily.finish()` outside Today's 10, or `Loopy.rewards.correct` touches `Loopy.daily` again (that path was removed in PR #269); or Today's 10 no longer calls `finish()` at its tenth answer.
- Fix: only `mix/daily-mix/index.html` calls `Loopy.daily.finish()`; a right answer in any other game earns stars, never a day. Keep the saved `loopy.daily` format. (17 Nov 2026)

## Play test: money without its € sign, or the hint speaks of pieces that are not there
- Looks like: `play.mjs` says `money without its € sign: 50, 20` or `the hint "Notes first, then the coins" speaks of notes and coins, but the screen shows only notes`.
- Cause: a note or coin drawn with its bare value, or a helper line that does not look at what is on the card (Class Test, PR #274).
- Fix: every piece shows "€50" (English) or "50 €" (German), on screen and on the printed test; the line under the question picks "Notes first, then the coins", "Only notes, no coins" or "Only coins" from the pieces. (17 Nov 2026)

## Play test: an old "Words in" pick wins over loopy's language
- Looks like: `play.mjs` says `words saved as en before the fix still win over loopy's language de` or `a "Words in" pick of en made under loopy's language de did not hold`.
- Cause: a word game reads `<game>.words` without checking `<game>.wordsUi` against `Loopy.lang`, or saves a new pick without `wordsUi` (PRs #292 and #296).
- Fix: a pick counts only while `wordsUi` equals the current loopy language; save both keys together; keep the old `words` key readable. The German keyboard and words then follow by themselves. (18 Nov 2026)

## Try again test: the missed question does not come first
- Looks like: `retry.mjs` says `opened with #retry, the first question is "…", not the missed "…"`, or CI "A mistake comes back in every game until it is fixed", often only now and then.
- Cause: the game's `rebuild(note)` returns null for a note its own `makeProblem` can produce, so `Loopy.retry.fresh` skips the mistake (Which Way? rejected b = 10 in `okSum`, PR #302); or the note's format changed and old notes no longer parse.
- Fix: seed the note from the log (`Loopy.rewards.wrong(game, { …, r: note })`), reopen with `#retry` and read `window.__questions[0]`; make `rebuild` accept every sum `makeProblem` makes, never loosen the test. Keep old note formats readable. (19 Nov 2026)

## Picture test is red
- Looks like: job "picture test" red; `home-390x844-de.png: 1.42% of the pixels changed (allowed 0.3%)`, with the artifact `pictures-that-changed` (the new picture and a `-diff.png`).
- Cause: a shared CSS or script change moved something on the home page or one of the six games. Look at the diff picture first.
- Fix: a slip (a cut-off row, a moved button) is fixed in the source. A change that is meant to look like this gets new saved pictures: put the label "refresh pictures" on the pull request (the Refresh pictures workflow takes them with the pinned Chromium, commits `tools/e2e/pictures/`, starts the checks again and takes the label off), or Actions → "Refresh pictures" → Run workflow with the branch. `UPDATE=1 node tools/e2e/pictures.mjs` locally gives pictures from the local Chromium, which differ from the pinned build by 0.5 to 7%, so the label is the way. Never raise `MAX_SHARE`. After Dependabot bumps playwright-core, a refresh is expected. The artifact `pictures-that-changed` cannot be downloaded from the cloud session (the proxy blocks the store). (20 Nov 2026)

## Size budget is red
- Looks like: step "Every page stays in its size budget" red; `must | math/x/index.html | page is 103 KB sent ... (budget 100 KB)` or `must | loopy.js | grew by 2.4 KB sent`.
- Fix: make it smaller: move data a page alone uses into its `data.js`, share repeated code, drop an unused string. When the growth is the point of the change (a new shared part every page needs), add a line `Size budget: <why>` to the pull request body; the check then lets it through once and the finding stays a "should". (20 Nov 2026)

## Lighthouse budgets are red
- Looks like: job "Lighthouse budgets" red; `categories:performance failure for minScore assertion` or `resource-summary:total:size failure for maxNumericValue assertion` on one URL, with the artifact `lighthouse-pull-request` (the reports).
- Fix: open the report for that URL. A size failure is the same as the size budget above. A performance failure on a local server is almost always work on load (a long script before first paint, a big picture, a font not preloaded) or a layout shift (`cumulative-layout-shift`): fix the page, never lower `minScore`. Re-run once before anything else when every URL is a few points under: the runner can be slow. (20 Nov 2026)

## WebKit run is red, every page "Can't find variable: Loopy"
- Looks like: only the `webkit` jobs are red; the log says `loads from another website: https://127.0.0.1:PORT/loopy/loopy.js`, `Error performing TLS handshake` and `Can't find variable: Loopy` on every page, while the Chromium jobs are green.
- Cause: WebKit honours the page's `upgrade-insecure-requests` even on http://127.0.0.1 and asks the plain-http test server for https. `body()` in `tools/e2e/engine.mjs` drops the directive for WebKit; a test with its own file reading that does not go through `body()` brings the failure back.
- Fix: serve files with `res.end(body(file))` from `engine.mjs`, never `fs.createReadStream(file).pipe(res)`. (20 Nov 2026)

## WebKit accessibility run is red, Chromium's is green
- Looks like: only the `webkit` accessibility jobs are red, with the same axe rule on one control in every game, such as `label-content-name-mismatch on #read-toggle (Elements must have their visible text as part of their accessible name)`.
- Cause: WebKit's accessibility tree differs a little from Chromium's (visible text, pseudo-element content, names from `aria-label`), so axe sees another name or text. The Read aloud pill had an `aria-label` that did not hold its On/Off tag.
- Fix: give the control one name that is also what it shows (drop the `aria-label` when the visible text already names it; state goes in `aria-pressed`, decoration is `aria-hidden`). Never turn the rule off. (20 Nov 2026)
