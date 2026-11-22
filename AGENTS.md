<!-- Written by plugins/sync.py from plugins/loopy/RULES.md and plugins/work-style/RULES.md. Do not edit: add a rule there (the add-rule skill), then run python3 plugins/sync.py. -->
# loopy for coding agents

loopy is a free learning games website for kids in grades 1 to 10, in English and German. It is plain HTML, CSS and JavaScript: one shared script and style sheet, no framework, no outside requests. `DESIGN.md` says how it looks. The README's "For developers" part says how a game is built. The rules below are the project's standing rules. The owner's words in the task win where they differ. Pull requests go against `main`, from a branch.

## Rules

Add a rule with the add-rule skill, in one or two lines; the how-to goes in the skill, recipe or check that uses it. `plugins/sync.py` writes them into `AGENTS.md`, which `CLAUDE.md` loads; never edit those two by hand.

### Site
- loopy is free learning games for kids in grades 1 to 10. No ads, no sign-up, no tracking. Name is lowercase "loopy" on screen.
- Every page loads one shared `loopy.js` and `loopy.css`, and no other shared script. Seven small parts load only when needed, through `Loopy.load()`: `loopy-report.js`, `loopy-backup.js`, `loopy-sheet.js` with `print.css`, `loopy-levels.js`, `loopy-install.js`, `loopy-sync.js` and `loopy-hello.js`. Edit `src/`, never the built root copies, then run `python3 tools/build.py`. A new `Loopy` member also goes in `src/loopy.d.ts`.
- A game is a folder `<subject>/<game>/index.html` plus one line in the home page GAMES list. Its word list or other content lives next to the page in `words.js` or `data.js` (Word Match and Word Trail share `languages/words.js`), loaded right after `loopy.js`. A new game id goes in the `Loopy.GAMES` list in `src/loopy.js` and the progress page list. Do not change other games or the layout unless asked.
- English (default) and German for every word: `Loopy.addStrings({en,de})`, `data-t`, `Loopy.t()`, `Loopy.num()`.
- German all the way: with loopy in German nothing on screen stays English. In a word game the words follow loopy's language; a "Words in" pick is remembered only with the loopy language it was made under (`<game>.words` + `<game>.wordsUi`). A German keyboard has the qwertz rows with ü, ö, ä and ß, and a letter pad mixes umlauts into its extras; they fit at 360px.
- Difficulty follows the age picker. Right and wrong go through `Loopy.rewards.correct()` / `.wrong()`. Questions come from `Loopy.fresh()` (no repeat within 10).
- One phone or tablet screen, no scrolling, portrait and landscape: 360×640, 390×844, 430×932, 844×390, 820×1180, 1180×820, 1280×800, 1920×1080. Settings behind ⚙. Spacing and sizes come from the size-class variables in `src/loopy.css` (`--col`, `--big`, `--key-h` and the rest; DESIGN.md "Screens"), not from numbers copied into a page. The phone's bars are `--safe-top` and `--safe-bottom`, never raw `env(safe-area-inset-*)` in a page. Follow DESIGN.md and keep it in sync.
- Black is the default theme. Others: Sunny, Ocean, Candy, Forest, High contrast. A page writes no colour out: it takes `var(--ink)`, `var(--good)` and the rest from `loopy.css`. Only a picture, such as a bank note, keeps its own colours.
- Everything that prints shows the real loopy logo (`Loopy.logo()`, not just the word) in a fitting place: top right on worksheets and the weekly card, top left on a printed page. A new print needs it too.

### Games
- Nothing dead, nothing covered: Next shows only after an answer (its place stays empty where there is no Skip), the first-time hint covers no key or word and names the game's real first tap, and every game says "Correct!" and "Not quite." through the shared strings.
- The main content fills the card and nothing is cut off: a sum, grid, text or picture grows with the card in container units up to `--big`, and is checked at the eight sizes fresh, after a wrong answer with the longest explanation and with Settings open; the tablet held upright overflows first.
- A helper line names only what is on the card, every note and coin shows its currency sign, and a picture borrowed from another game keeps that game's look.
- When a question assumes something that is not true right now, the screen says "Pretend it is …", a badge shows it and Read aloud says it first.
- A day in the day streak is a finished Today's 10, nothing else; right answers in other games earn stars only.
- With a grown-up's word list: no picture that does not fit the words, the meaning comes only from the list, Try again replays only words still in play.
- On phones the home page top is one 44px row; the child chip in every page opens "Who is playing?" with two or more children. Once a switch starts nothing is saved until the reload, so a late timer never writes under the wrong child.
- Every game logs a short rebuild note with each wrong answer and asks for its questions through `Loopy.retry.fresh`, so a mistake comes back (Try again).

### Safety
- No outside requests. No `style=` attributes, no `on*=` handlers (a hook blocks them).
- Saved data is never lost or reset: a changed key or format needs a migration, and old stars codes still import. Per-child data goes through `Loopy.store`. Validate everything read from storage.
- GitHub Pages gets only the site: `src/`, `tools/`, `docs/`, `plugins/`, the workflows and the Markdown files are left out, so a page never loads a file from there.

### Every change
- Run `python3 tools/check.py` before a pull request: the checks this change needs, with why a red one matters (`--list` shows all, `--fast` leaves out the browser tests and the guide build). The GitHub check picks its jobs by the files changed too, runs the accessibility check and the play test also in WebKit (Safari's engine), and adds Lighthouse.
- Never skip, disable or loosen a check to get green. A finding that is right on purpose gets a comment with its reason on that line (`eslint-disable-next-line`, `stylelint-disable`, `# zizmor: ignore[rule]`). A CSS or JavaScript feature that not every browser has had for 30 months gets a fallback, not an ignore entry. A red size budget means make it smaller. A red picture test gets the "refresh pictures" label only when the change is meant to look different.
- Look for speed and size wins (loopy.js size, work on load, what is saved, page size, fonts, sw.js cache, Lighthouse) and say in the PR what was found, or that nothing was.
- Every pull request that changes what a page looks like first runs the repo's own improve-ui skill on that page (`/improve-ui <page>`, not a global skill of the same name). Fix the findings in the same PR or say in the PR why not.
- The other design skills on the owner's Mac (impeccable, Taste Skill, UI/UX Pro Max) are a second opinion at most: DESIGN.md decides the look, and none of their scripts runs in the loopy folder, where every file goes live. See `references/other-design-skills.md` in the improve-ui skill.
- Review with the loopy-review skill before a pull request is ready. CodeRabbit (`.coderabbit.yaml`) comments on every pull request: fix what is right, answer what is not. Its comments are a second opinion, never the owner's approval.
- When a bug is about layout, speed or the console, use the browser tools in `.mcp.json` where they are available before guessing from the source.
- Docs keep up: every change people can see or use also updates the docs that describe it, in the same PR, with the loopy-docs skill: the guide (EN + DE), FAQ.md, the Help page, the game's own README, the main README and RELEASES.md (a parent-friendly row at the top after a major merge). Plain English: short sentences, simple words, child and parent friendly.
- Skills stay short (`plugins/sync.py --check`: a `SKILL.md` up to 6 KB, its description 200 characters, `AGENTS.md` 10 KB). When a skill learns something, replace or shorten what is there. Detail needed only sometimes goes in a page next to the skill, and a fact lives in one place.

### Roadmap
- GitHub issues, order in issue #21. "Start next", "Take next task", "Pickup next task", "take next 3 tasks", "Build #N" mean: build the next open issue(s) in that order, open a PR against main, close the issue on merge.
- Claude cannot change GitHub repo settings or open github.io. Give the owner exact steps, or ask them to check the live site.

## How the owner works

### Talking
- Plain, short-sentence English. Lead with the answer. No jargon the owner did not use.
- Asks are short ("push", "Start next", "Resolve conflict", "apply all suggestion", "Mark as done"). Treat each as the full task it stands for, not as a question.
- Several numbered asks in one message are separate tasks. Do them all.
- When there is a choice, give numbered options, one short line each, with the recommended one marked ⭐. Show pictures when it is about the screen. Then wait for a number, "go", "use recommended" or "approve and implement".

### Doing
- "Done" means the owner's goal, not the current step: a pull request with green checks, not just a commit.
- Pick a sensible default when a detail is missing, say which, and keep going.
- A bug report is a request for the fix: reproduce, find the cause, fix, open a pull request.

### Git and GitHub
- No Claude attribution anywhere in the repo: no "Co-Authored-By: Claude" or "Claude-Session" lines in commits, no "Generated with Claude Code" line or session link in pull requests or comments. If a tool adds one, remove it. (A hook blocks it.)
- Use the repo's pull request template. A clean, short, human list of changes. Before and after screenshots when the screen changes.
- Never rewrite history on someone else's branch. Merge the main branch in to fix conflicts.
- When the owner states a new rule ("from now on", "always", "never", "update memory and instructions"), record it with the add-rule skill so it holds next time too.
