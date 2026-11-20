---
name: ship-pr
description: Finish a loopy change and open its pull request with every check, screenshots and the template. Use at the end of any loopy change, or for "push", "open the PR", "ship it".
---

# Ship a loopy pull request

1. **Merge the latest main** into the branch first (`git fetch origin main && git merge origin/main`). The after_merge hook rebuilds generated files.
2. **Build:** `python3 tools/build.py` (once per checkout: `npm ci --prefix tools/build --ignore-scripts` for the minifier and the type checker).
3. **Checks** (all must pass; the Stop hook runs the fast ones again before you finish):
   ```sh
   python3 tools/build.py --check
   node tools/build/node_modules/typescript/bin/tsc -p tools/build   # src/ against src/loopy.d.ts: a new Loopy member goes in the .d.ts too
   python3 tools/csp.py --check
   python3 tools/check_external.py
   python3 tools/guide_check.py              # every game has a guide page, EN and DE
   python3 tools/review.py
   python3 tools/review.py --budget           # the size budgets as a check (CI runs it on every PR; "Size budget: <why>" in the PR body allows more on purpose)
   python3 plugins/sync.py --check            # plugin copies in .claude/
   python3 plugins/loopy/scripts/drift.py     # plugin in step with the repo
   python3 plugins/test_hooks.py              # only when plugins/ changed
   node tools/a11y/check.mjs      # ENGINE=webkit runs it in Safari's engine, like CI (once: node tools/a11y/node_modules/playwright-core/cli.js install --with-deps webkit)
   node tools/e2e/play.mjs        # GAME=<id> for one game while you work; the full run before the PR. CI runs it in Chromium and WebKit (ENGINE=webkit).
   node tools/e2e/pictures.mjs    # the home page and six games still look the same (CI: ENGINE=pinned, Playwright's own Chromium). Meant to look different? Actions → Refresh pictures with the branch, or UPDATE=1 here and commit tools/e2e/pictures/ It also checks that only Today's 10 counts a day, that money shows its € sign and the Class Test hint fits the card, and that loopy's language wins over an old "Words in" pick
   node tools/e2e/retry.mjs       # Try again in every game (GAME=<id> for one): a mistake comes back until it is fixed
   node tools/e2e/levels.mjs      # levels follow the child: up by itself when ready, kept over the birthday
   node tools/e2e/switch.mjs      # switching the child mid-game: each child keeps their own stars, log and last game
   node tools/e2e/hello.mjs       # the first visit: the welcome sheet once, the family code row until a code is set (when src/loopy-hello.js, src/loopy.js or the home page changed)
   node tools/e2e/offline.mjs     # after an update the offline copy saves the new pages, never an old one (when src/sw.js changed)
   node sync/test.mjs             # the Family sync server answers right (when sync/ changed)
   node tools/sync-usage.test.mjs # the Monday usage report prints counts only (when tools/sync-*.mjs changed)
   node tools/e2e/sync.mjs        # Family sync keeps two devices in step and sends nothing when off (when src/loopy-sync.js, sync/ or the home page changed)
   ```
   CI also runs **Lighthouse** on the pages the change touches (job "Lighthouse budgets", `tools/lighthouse/lighthouserc.json`: performance, accessibility and best practices 95 or more, at most 100 KB sent per page, layout shift under 0.1). Locally: `npm ci --prefix tools/lighthouse --ignore-scripts`, `node tools/lighthouse/serve.mjs 8787 &`, then `tools/lighthouse/node_modules/.bin/lhci collect --config=tools/lighthouse/lighthouserc.json --url=http://127.0.0.1:8787/loopy/<page>/` and `lhci assert --config=...`.
   The **Family sync usage** job (`.github/workflows/sync-usage.yml`, Mondays 05:23 UTC and by hand) is not a check: it counts families and grown-ups (`tools/sync-usage.mjs`, counts only), keeps the numbers in the "Family sync and grown-ups" issue (steps "Find the issue that keeps the counts" and "Keep the counts in the issue, and comment when something is new") and comments there when a family turned sync on, went quiet, or a grown-up joined the list. `tools/sync-families.mjs` is the owner's own per-family table, never run on GitHub (`sync/README.md`).
   The **Forks and stars** job (`.github/workflows/forks.yml`, Mondays and by hand) is not a check either: it lists new forks and counts new stars in its Summary, keeps the counts in the "Forks and stars" issue and comments there when they go up, so the owner gets an email.
   CI runs the a11y check and the play test in two halves at once (`SHARD=1/2`, `SHARD=2/2`), each in Chromium and in WebKit (`ENGINE=webkit`, the engine behind Safari on iPhone and iPad). A WebKit-only red means Safari does something differently: look for layout that depends on `dvh`, `:has()`, dialogs, speech or audio, fix the page for both engines, never skip the run. On a pull request it skips them, and the guide job, when `tools/ci_changes.py` says no file they read changed (docs, `.claude/`, `plugins/`). A new file type or folder the pages read must not match its DOCS list. "All checks" fails if any job failed.
   When `guide-src/` changed (or a game looks different), build and check the guide too (the CI "guide" job does the same):
   ```sh
   npm ci --prefix guide-src && npm run build --prefix guide-src   # also writes the guide pages' security policy
   npm run screens --prefix guide-src                             # only when a game looks different
   node guide-src/scripts/check.mjs                               # links, errors, search, accessibility
   ```
4. **Docs** with the loopy-docs skill: the guide (EN + DE), FAQ.md, the Help page, the game README, the main README and RELEASES.md, in plain English, in this same PR. Fix the `docs` rows from `tools/review.py`, or say why not. When a game looks different, the guide's pictures of it are docs too: run `npm run screens --prefix guide-src` (step 3) and commit the new `guide-src/src/assets/screens/` files, so the guide does not show an old layout.
5. **UI audit** when anything on a page looks different: run the `improve-ui` skill on that page (`/improve-ui <page>`). It checks the page against `DESIGN.md` and reports up to three proven design problems. Fix them in this PR, or put in the PR why not. (Owner's rule, 1 Nov 2026.) Use the repo's own improve-ui copy (it ends with the In loopy section), not a global skill of the same name. Where impeccable is installed, as on the owner's Mac, `/impeccable critique <page>` is a good second opinion, under the same loopy rules.
6. **Review** with the loopy-review skill (or the `reviewer` agent). Fix every "must". Note speed and size findings for the PR.
7. **Screenshots** when anything on screen changed (and the saved pictures of the picture test, see step 3): `node plugins/loopy/scripts/screens.mjs --out <scratch>/after` on the branch, and with `--root <worktree of origin/main> --out <scratch>/before` for main. It fails if a page scrolls; fix that first. Then look at the pictures: nothing cut off (the tablet held upright and a phone on its side go first), no mostly empty card on a tablet or a monitor, no greyed-out Next before an answer, no hint bubble over a key or a word. Take the same pictures after a wrong answer with the longest explanation and with Settings open. Copy the phone-size pair you show into `docs/screenshots/`, commit, and link them by raw.githubusercontent.com URL pinned to the commit.
8. **Commit** in plain words. No Claude attribution lines (a hook blocks them).
9. **Pull request** against `main` with `.github/pull_request_template.md`: What changed (a parent could read it), Changes (one line each, what someone will notice), Before and after (or delete it), Checked, a line on the docs that changed (or "Docs: nothing people see changed"), a line on speed and size ("nothing found" is fine), "Closes #N". Keep the project's "Requested by" lines at the top when the project asks for them. After creating it, open it again and remove any "Generated with/by Claude Code" line a tool added. Assign the owner and ask them for a review.
10. Watch it: fix red checks and conflicts yourself (the `heal` and `resolve-conflict` skills). At a terminal, a bare `/loop` does this on its own (`.claude/loop.md`). A branch named `ralph/<name>` came from `tools/ralph/ralph.sh`; its `.ralph/PROGRESS.md` says what each iteration did.
11. Reply with the link and anything only a person can check (a real phone, iPhone Safari, print).
