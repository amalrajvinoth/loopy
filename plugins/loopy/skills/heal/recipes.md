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
