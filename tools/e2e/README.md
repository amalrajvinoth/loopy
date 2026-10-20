# Play test

`play.mjs` plays every loopy game in Chrome, from start to finish, the way a child would. The GitHub check runs it on every push and pull request.

## Run it

You need Node.js and Chrome (or Chromium). It uses the same two packages as the screen reader and keyboard check, so install those once:

```sh
npm ci --prefix tools/a11y --ignore-scripts
node tools/e2e/play.mjs
```

If it cannot find Chrome, point it there: `CHROME=/path/to/chrome node tools/e2e/play.mjs`.

It takes a few minutes, prints a table with one row per game and age, and fails if it finds a problem.

## What it does

It serves the site at `/loopy/`, like GitHub Pages. Then, for every game, as a 5-year-old (English), an 8-year-old (German) and a 16-year-old (English), it answers 30 questions in a row. Today's 10 plays one set of 10. It picks the right answer when the game marks it (the multiple-choice games), otherwise the first answer, then presses Next. Box Multiplication is played in steps: while its card says `data-steps="on"`, the test types the answer the game puts on the box being filled (`data-a`), box by box and then the total. The Try again test does the same to finish or replay a sum.

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
