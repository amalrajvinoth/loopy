# loopy plugin scripts

| Script | What it does |
| --- | --- |
| `drift.py` | Says whether the plugin still matches the repo (CI steps, tools, built files, PR template, screen sizes, GAMES lists). `--update` records the repo as it is now. Runs in CI, at session start and before Claude finishes. |
| `resolve_built.py` | After a merge: takes either side of conflicts that are only in built files or a page's security policy line, rebuilds with `tools/build.py`, and stages them. Runs on its own after `git merge` or `git pull`. |
| `screens.mjs` | Screenshots at the 5 DESIGN.md sizes in English and German, and fails if a page scrolls. `--root` serves another checkout (for "before" pictures). |
