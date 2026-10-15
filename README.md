# Loopy

Learn. Play. Repeat.

Free, interactive learning games for kids in grades 1 to 10, at **amalrajvinoth.github.io/loopy**. Each game is one HTML page with no build step, grouped by subject. Every page shares two files: `loopy.css` and `loopy.js`.

| Subject | Game | What it practices |
| --- | --- | --- |
| Math | [Plus and Minus](math/plus-minus/) | Addition and subtraction, with or without regrouping. Numbers go up to 20 (age 6), 100 (ages 7 to 8), 1,000 (ages 9 to 10) and 10,000 (age 11 and up) |
| Math | [What Time Is It?](math/what-time-is-it/) | Reading an analog clock: half hours (age 6), quarter hours (7), 5 minutes (8), every minute (9 and up) |

## Adding a game

1. Create `<subject>/<short-name>/index.html`, for example `reading/sight-words/index.html`. Use lowercase folder names.
2. In `<head>`, after your own styles, add:
   ```html
   <link rel="stylesheet" href="../../loopy.css">
   <script src="../../loopy.js"></script>
   ```
3. At the top of the page, add the home link and the shared controls:
   ```html
   <a href="../../">← Loopy</a>
   <div class="controls"><div id="age-picker"></div><div id="theme-picker"></div><button id="sound-toggle"></button></div>
   <span id="star-chip"></span>
   ```
4. In your script:
   - `Loopy.getAge()` gives the age. Listen for the `loopy:age` event to change difficulty when it changes.
   - After each right answer, call `Loopy.rewards.correct("<game-id>", streak, harder)`. `harder` is optional: `{ label: "Try quarter hours", apply: fn }`, offered after every 10 in a row.
   - After each wrong answer, call `Loopy.rewards.wrong()`.
   - Use the theme colors: `--bg`, `--card`, `--ink`, `--muted`, `--line`, `--chip`, `--c1` to `--c5`, `--good`, `--bad`.
5. Add one line to the `GAMES` list in the root `index.html`, with the `ages` it suits. A new subject gets its own section automatically.
6. Add a row to the table above.

## What `loopy.js` does

- **Themes:** Black (default), Sunny, Ocean, Candy and Forest.
- **Age:** defaults to the age of a child born in August 2018 and goes up each year. A change is saved as years above or below that default, so it keeps growing. The default is at the top of the age block.
- **Sound:** short tones made in the browser for right, wrong, streak and badge moments, with a mute button.
- **Stars and badges:** every right answer earns a star. Badges unlock at 10, 25, 50, 100, 250, 500 and 1000 stars, and streaks of 5, 10, 15, 20, 30 and 50 set off confetti.
- **Saving:** progress is kept in the browser's `localStorage`, so nothing is sent anywhere. To move stars to another device, use "Move my stars to another device" on the home page and copy the code across.

## Phones and tablets

Each game fits one screen in portrait and landscape: the number pad or answers stay at the bottom and the top part shrinks to fit. Age, theme, sound and levels sit behind the Settings button. Loopy can be added to a phone or tablet home screen, where it opens full screen with its own star icon (`manifest.webmanifest`, `icon-*.png`, `apple-touch-icon.png`). New games should follow the same pattern: wrap the game in `<main class="play">` and put level controls inside `#settings-panel`.

## Style

Fredoka for headings, Lexend for text, large tap targets, score and streak, and a one-line reason after every answer.
