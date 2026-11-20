# Play test

`play.mjs` plays every loopy game in Chrome, from start to finish, the way a child would. The GitHub check runs it on every push and pull request.

## Run it

You need Node.js and Chrome (or Chromium). It uses the same two packages as the screen reader and keyboard check, so install those once:

```sh
npm ci --prefix tools/a11y --ignore-scripts
node tools/e2e/play.mjs
```

If it cannot find Chrome, point it there: `CHROME=/path/to/chrome node tools/e2e/play.mjs`.

### In Safari's engine too

The children play on iPhones and iPads. So the GitHub check runs the play test and the accessibility check a second time in WebKit, the engine behind Safari. Locally:

```sh
node tools/a11y/node_modules/playwright-core/cli.js install --with-deps webkit   # once (about 90 MB)
ENGINE=webkit node tools/e2e/play.mjs
```

Every test in this folder reads `ENGINE` through `engine.mjs`. A test that is red in WebKit only means Safari does something differently; fix the page for both engines.

It takes a few minutes, prints a table with one row per game and age, and fails if it finds a problem.

## What it does

It serves the site at `/loopy/`, like GitHub Pages. Then, for every game, as a 5-year-old (English), an 8-year-old (German) and a 16-year-old (English), it answers 30 questions in a row. Today's 10 plays one set of 10. It picks the right answer when the game marks it (the multiple-choice games), otherwise the first answer, then presses Next. Box Multiplication is played in steps: while its card says `data-steps="on"`, the test types the answer the game puts on the box being filled (`data-a`), box by box and then the total. The Try again test does the same to finish or replay a sum. Word Trail is played by tracing: while its card says `data-trail="on"`, the test taps the boxes listed in `data-a` (row-col pairs, boxes carry `data-rc`); the word counts on its last box. The Try again test taps them backwards to miss on purpose.

It checks:

1. **No errors.** No script or console errors, nothing fails to load, nothing loads from another website.
2. **It plays.** Every answer counts on the score, and the next question comes.
3. **Stars.** The star counter goes up by exactly the number of right answers.
4. **No repeats.** A question never comes back within the next 10 questions. When a game has fewer than 11 questions at that level (Make 10 to 10, halves and quarters in Pizza Fractions), the questions go round: every one of them comes before any comes back, and never the same one twice in a row. In Today's 10, all ten questions are different.

`SHARD=1/2` plays every other game, starting with the first, and `SHARD=2/2` the rest. CI runs both halves at once to save time.

## How games avoid repeats

Each game gets its next question from `Loopy.fresh(recent, make)` in `src/loopy.js`. It skips the questions in the game's `recent` list. When there are too few questions to skip them all, the oldest ones may come back first. It also puts the question's key on `<body data-q="…">`, which is how this test sees each question, even the same one twice.

## Try again test

`retry.mjs` checks Try again in every game (Today's 10 only logs, so it is covered through the games that replay its mistakes):

```sh
node tools/e2e/retry.mjs            # GAME=plus-minus for one game
```

For each game, as an 8-year-old in English, it answers a question wrong on purpose and checks that the answer log's new row carries a rebuild note. Then it opens the game again from the Try again card (`#retry`) and checks that the missed question comes first. Then it answers it right, opens again (it must still come first), answers it right again, and opens a third time: now it must be gone from `Loopy.retry.list()` and not come first. In the games where the right answer cannot be typed from the log (money, letters), it stops after the "comes first" check and says `not typed`.

## Add a new game

Nothing to add here: the test finds every `<subject>/<game>/index.html` by itself. In the game, make the next question with `Loopy.retry.fresh` (which calls `Loopy.fresh`), give each question a `key` that is the same for the same question, log a rebuild note with each wrong answer and rebuild from it (see the README's "Build a game"), and keep the usual ids: `score`, `next` (or `k-go` for a pad), and `choices`, `answers`, `pad`, `letters` or `map` for the answers.

## Picture test

`pictures.mjs` takes a picture of the home page and six games (Plus and Minus, Make 10, What Time Is It?, Word Detective, Flags and Capitals, Quick Facts) at the eight DESIGN.md sizes in English (360×640 to 1920×1080) and in German at three of them (a phone upright, a phone on its side, a tablet upright, where longer words break a row first), 77 pictures, and compares each with the saved picture in `pictures/`. From a fork the Refresh pictures workflow cannot push, so save the pictures on your machine: `UPDATE=1 ENGINE=pinned node tools/e2e/pictures.mjs` (once: `node tools/a11y/node_modules/playwright-core/cli.js install chromium-headless-shell`) and commit `pictures/`. A CSS change that moves a button or cuts off a row goes red before merge.

```sh
node tools/e2e/pictures.mjs                 # compare; the new pictures and a -diff.png for each change go to pictures-out/
UPDATE=1 node tools/e2e/pictures.mjs        # save the pictures as they are now
PAGE=math/make-10/ node tools/e2e/pictures.mjs
```

The pictures come out the same every run: the games get the same random numbers, the clock is fixed, animations are off, the welcome sheet is already seen, and the fonts are loaded first. A picture fails when more than 0.3% of its pixels changed; anti-aliasing never gets there, a moved button does.

CI runs it in Playwright's own pinned Chromium build (`ENGINE=pinned`), so an update of the runner's Chrome cannot change a picture. When a change is meant to look different, refresh the saved pictures on the runner: put the label "refresh pictures" on the pull request, or Actions → "Refresh pictures" → Run workflow with the branch. It commits `tools/e2e/pictures/`, starts the checks again and takes the label off. A refresh is also expected after Dependabot updates `playwright-core`. Pictures taken with another Chromium (`UPDATE=1` on a laptop) differ from the pinned build's by a few percent, so the saved pictures always come from the runner.

## Offline copy test

`offline.mjs` checks that after an update every phone saves the new pages, never an old one:

```sh
node tools/e2e/offline.mjs
```

Right after an update, the site's servers can still hand out an old file for a few minutes. The offline helper (`sw.js`) checks every file against its hash before it saves it, and asks again with `?v=<hash>` when it gets an old one. The test serves the site with a server that lags like that and checks three things: the new grown-ups page is saved, a wrong page saved by an older helper is downloaded again, and a server that never gives the right file does not stop the update. CI runs it with the Try again test.

## Family sync test

`hello.mjs` checks the first visit: the welcome sheet on a browser with nothing from loopy, and the family code row under My stars:

```sh
node tools/e2e/hello.mjs
```

A new browser gets the sheet "Hi! Who is playing?". The test names the child Mia, picks 🦄 and age 7, taps Later on the grown-ups step and Let's play!. Then it checks that the one child was renamed (not doubled), the age is 7 and the top row says Mia. A second visit shows no sheet but the family code row; Not now hides it for the day, and a set family code removes it. A browser that already has stars never gets the sheet and keeps its stars. A `#family=` or `#load=` link shows neither. A German browser starts in German until a language is saved. CI runs it with the switch test.

`sync.mjs` checks Family sync with two browser profiles, one for each device (and, at the end, the family code row's Turn on and Join with a code on two more):

```sh
node tools/e2e/sync.mjs
```

It serves the site as if `Loopy.syncHost` were `sync.test`. Requests to that address go to the real server code (`sync/worker.js`) with a stand-in database (`sync/fake-d1.mjs`), inside the test, so nothing leaves the computer. It checks that:

1. With sync off, `loopy-sync.js` is never loaded and nothing is sent, on the home page and in a game. Opening ⚙ Settings on the home page loads it to show the Family sync part, and still sends nothing.
2. A bad code, or a code no family has, gives a clear message and leaves sync off.
3. **Turn on** shows a family code and its QR code, and the server's copy is locked (no stars or game names in it).
4. With sync on, `loopy-sync.js` loads only after the page has loaded.
5. Joining with the link from the QR code brings the family's stars, and the link leaves the address bar.
6. New stars in a game are sent when the game is left, and the other device gets them on its home page.
7. After 5 minutes without a tap, a game page left open gets the other device's new stars and reloads once. A tap starts the 5 minutes again, and nothing is read while loopy is hidden. The page runs on a fake clock (Playwright `clock`), so this takes seconds.
8. **Turn off everywhere** removes the copy on the server and the code on this device. Both devices keep their stars, and the other device says the copy was deleted.

CI runs it with the Try again test.

## Switch test

`switch.mjs` checks that switching the child in the middle of a game keeps every child's own stars, answer log and "last game":

```sh
node tools/e2e/switch.mjs
```

Two children, Dio and Max, English. Dio gets 3 right in Plus and Minus. The test opens "Who is playing?" from the child chip in the top bar and picks Max. After the reload, Max plays with 0 stars and a fresh score. Dio still has 3 stars, and both children's Carry on cards point to Plus and Minus. Max gets 2 right: Max has 2, Dio still 3, and each child's answer log counts only their own answers. Last, a save started right after a switch must land under neither child, which is the guard in `Loopy.store`. CI runs it with the Try again test.

## Levels test

`levels.mjs` checks that levels follow the child, in Make 10 and Times Tables Sprint:

```sh
node tools/e2e/levels.mjs
```

It checks: one more right answer moves the game up a level when 18 of the last 20 are right, the card says so, and **Back a step** goes back. 10 right in a row move it up, after any badge cards. A level reached at age 8 is still there at age 9, and the grown-ups' levels list agrees. An old record without an age carries nothing. A younger age picked by hand starts at its own level. The Last 5 pill shows five dots while 20 answers are kept. The Sprint goes up after a clean round. Today's 10 asks at the level the child reached in each game, and says so above the problem. CI runs it with the Try again test.
