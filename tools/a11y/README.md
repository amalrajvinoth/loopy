# Screen reader and keyboard check

`check.mjs` opens every loopy page in Chrome and checks that it works with a keyboard and a screen reader. The GitHub check runs it on every push and pull request.

## Run it

You need Node.js and Chrome (or Chromium).

```sh
npm ci --prefix tools/a11y --ignore-scripts   # once: installs axe-core and playwright-core into tools/a11y/node_modules
node tools/a11y/check.mjs
```

If it cannot find Chrome, point it there: `CHROME=/path/to/chrome node tools/a11y/check.mjs`.

`SHARD=1/2` checks every other page, starting with the first, and `SHARD=2/2` the rest. CI runs both halves at once to save time. Without `SHARD` it checks every page.

The two packages are only for this check. No page loads them, and `node_modules` is not committed.

## What it checks

1. **axe-core** on every page: WCAG 2.1 A and AA, plus best practices. In every theme (High contrast too), in English and German, with Settings closed and open.
2. **Tab order.** Tab goes through every control. Each one has a name for screen readers and a visible focus ring with at least 3:1 contrast against the page.
3. **Escape** closes Settings and puts focus back on the ⚙ button.
4. **Play with the keyboard only.** In every game: Tab to the answers, answer, press Next. The answer must be read out ("Correct!" or "Not quite." and the reason), and focus must land on the new problem's first answer.

It prints a table and every problem it finds, and fails if there is one.

## Add a new game

Nothing to add: the check finds every `<subject>/<game>/index.html` by itself. Give the game's answer area one of these ids so the keyboard test can find it: `choices`, `answers`, `pad`, `letters` or `map`. Keep `id="feedback"` on the feedback line and `id="next"` on the Next button.

## What a computer cannot check

Listen to a game with a real screen reader before a big change: VoiceOver on iPhone or iPad (Settings → Accessibility → VoiceOver) and NVDA on Windows (free from nvaccess.org). Check that the question, each answer and the result make sense when you only hear them.
