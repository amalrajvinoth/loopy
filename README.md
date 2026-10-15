# Loopy

Learn. Play. Repeat.

Free, interactive learning games for kids at amalrajvinoth.github.io/loopy, published with GitHub Pages. Each game is one HTML page with no build step, grouped by subject. All pages share `theme.css` and `theme.js` for the color themes (Black is the default; Sunny, Ocean, Candy and Forest are the others).

| Subject | Game | What it practices |
| --- | --- | --- |
| Math | [Plus and Minus](math/plus-minus-100/) | Addition and subtraction, with or without regrouping. Numbers go up to 20 (age 6), 100 (ages 7 to 8), 1,000 (ages 9 to 10) and 10,000 (age 11 and up) |
| Math | [What Time Is It?](math/what-time-is-it/) | Reading an analog clock: half hours (age 6), quarter hours (7), 5 minutes (8), every minute (9 and up) |

## Adding a game

1. Create `<subject>/<short-name>/index.html` (for example `reading/sight-words/index.html`). Use lowercase folder names.
2. In `<head>`, after your own styles, add `<link rel="stylesheet" href="../../theme.css">` and `<script src="../../theme.js"></script>`. Use the color names from `theme.css` (`--bg`, `--card`, `--ink`, `--muted`, `--c1` to `--c5`, `--good`, `--bad`). At the top of the page, add a link home `<a href="../../">← Loopy</a>` and `<div id="theme-picker"></div>`.
3. Add one line to the `GAMES` list in the root `index.html`, with the `ages` it suits. A new subject gets its own section automatically.
4. Load `../../age.js` in `<head>` and add `<div id="age-picker"></div>`. Read the age with `Loopy.getAge()` and listen for the `loopy:age` event to change difficulty when it changes.
5. Add a row to the table above.

## Age

The age picker defaults to the age of a child born in August 2018 and goes up by itself each year. A child can change it with the − and + buttons, and the choice is remembered on that device. The default lives at the top of `age.js`.

## Style used so far

Fredoka for headings, Lexend for text, large tap targets, five color themes with Black as the default, score and streak, and a one-line reason after every answer.
