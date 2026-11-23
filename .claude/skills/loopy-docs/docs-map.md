# Which docs a change touches

Guide pages live in `guide-src/src/content/docs/`. Every English page has a German twin with the same name under `docs/de/`. Always change both.

| What changed | Docs to update |
| --- | --- |
| A game (`<subject>/<game>/`) | `<subject>/<game>/README.md`. Guide `games/<subject>/<game>.mdx` (EN + DE). The row in README.md "The games" if the name, ages or idea changed. |
| A game's levels | The game's README "Age levels". Its guide page "Age levels". Guide `grown-ups/levels-ladder.md`. |
| A game looks different | `npm run screens --prefix guide-src` for new guide pictures. Before and after pictures in the PR. |
| Today's 10 (`mix/daily-mix/`) | `mix/daily-mix/README.md`. Guide `games/todays-10.mdx`. |
| A new game | Everything in the `new-game` skill, step 7. Also a FAQ answer if a parent would ask about it. |
| Home page (`index.html`) | Guide `start/first-minutes.mdx`, `settings/home-settings.mdx`. |
| Parts every game shares (header, ⚙, Last 5, 🚩) | Guide `playing/game-screen.mdx`, `settings/game-settings.mdx`. |
| Stars, streaks, badges | Guide `playing/stars-and-badges.mdx`. |
| Levels (`src/loopy-levels.js`) | Guide `playing/levels.md`, `grown-ups/levels-ladder.md`. |
| Try again | Guide `playing/try-again.md`. |
| Children, ages, "Who is playing?" | Guide `setup/kids-and-ages.md`. |
| Themes, language, "Easier to read" | Guide `setup/language-and-look.mdx`. DESIGN.md if the look changed. |
| Add to home screen (`src/loopy-install.js`) | Guide `setup/home-screen.md`. |
| The first visit and the family code row (`src/loopy-hello.js`) | Guide `start/first-visit.md`, `settings/home-settings.mdx` and `stars/family-sync.md` (EN + DE), FAQ q21, Help. |
| Offline copy (`src/sw.js`) | Guide `setup/offline.md`, only if people notice it. |
| Stars code, QR, backup file (`src/loopy-backup.js`) | Guide `stars/move-stars.mdx`, `stars/backup-file.md`, `stars/where-stars-live.md`. |
| Grown-ups page (`progress/`), weekly card | Guide `grown-ups/grown-ups-page.mdx`. |
| Worksheets, practice sheet (`src/loopy-sheet.js`, print) | Each game's "Print a worksheet" in its README. Guide `grown-ups/practice-sheet.md`. |
| Report a problem (`src/loopy-report.js`) | Guide `help/report-a-problem.mdx`. |
| Safety, privacy, what is saved | SECURITY.md. Guide `start/is-it-safe.md`, `help/security.md`. |
| Something a parent would ask about | FAQ, see below. |
| Shared code or tools | README.md "For developers". The comment at the top of the block in `src/loopy.js`. |
| Anything people will notice | A row at the top of RELEASES.md and the guide `help/whats-new.md` (EN + DE). See below. |

Not sure which guide page? Search for the words on the screen:

```sh
grep -rln "Try again" guide-src/src/content/docs --include="*.md*"
```
