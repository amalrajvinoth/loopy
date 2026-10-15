# Loopy

Learn. Play. Repeat.

Free, interactive learning games for kids at amalrajvinoth.github.io/loopy, published with GitHub Pages. Each game is one HTML page with no build step, grouped by subject. All pages share `theme.css` and `theme.js` for the color themes (Black is the default; Sunny, Ocean, Candy and Forest are the others).

| Subject | Game | What it practices |
| --- | --- | --- |
| Math | [Plus and Minus to 100](math/plus-minus-100/) | Addition and subtraction within 100, with or without regrouping |
| Math | [What Time Is It?](math/what-time-is-it/) | Reading an analog clock to the hour, quarter hour or 5 minutes |

## Adding a game

1. Create `<subject>/<short-name>/index.html` (for example `reading/sight-words/index.html`). Use lowercase folder names.
2. In `<head>`, after your own styles, add `<link rel="stylesheet" href="../../theme.css">` and `<script src="../../theme.js"></script>`. Use the color names from `theme.css` (`--bg`, `--card`, `--ink`, `--muted`, `--c1` to `--c5`, `--good`, `--bad`). At the top of the page, add a link home `<a href="../../">← Loopy</a>` and `<div id="theme-picker"></div>`.
3. Add one line to the `GAMES` list in the root `index.html`. A new subject gets its own section automatically.
4. Add a row to the table above.

## Style used so far

Fredoka for headings, Lexend for text, large tap targets, five color themes with Black as the default, score and streak, and a one-line reason after every answer.
