---
version: 1
name: loopy
description: A bright, chunky, kid-first learning games site. Dark "Black" theme by default with five candy-bright accent colors. Big rounded cards, pill buttons and huge tap targets. Fredoka for playful headings, Lexend for easy reading. A bunny wordmark whose two o's are googly eyes. Every game fits one screen, in English and German.

colors:
  # Black theme (the default). Every theme defines the same names.
  bg: "#0a0a0c"
  card: "#16161b"
  ink: "#f5f5f7"
  muted: "#a1a1ab"
  line: "#2a2a33"
  chip: "#23232b"
  key: "#1c1c22"
  c1: "#5b9dff"   # blue: main accent, hour hand, primary buttons
  c2: "#ff8a4c"   # orange: minute hand, focus rings, the blinking cursor
  c3: "#3fd68a"   # green
  c4: "#e070ff"   # purple
  c5: "#ffd23f"   # yellow: stars, rewards, Today's 10
  good: "#3fd68a"
  good-bg: "#10291c"
  bad: "#ff6b6b"
  bad-bg: "#2e1414"
  on-accent: "#0a0a0c"
  logo-ear: "#3ddc84"
  logo-ink: "#1d2a3f"

themes:
  black:  { bg: "#0a0a0c", card: "#16161b", ink: "#f5f5f7", c1: "#5b9dff", scheme: dark }
  sunny:  { bg: "#fff8ec", card: "#ffffff", ink: "#1d2a3f", c1: "#2457c5", scheme: light }
  ocean:  { bg: "#06263a", card: "#0d3550", ink: "#eaf6ff", c1: "#4cc9f0", scheme: dark }
  candy:  { bg: "#fff0f6", card: "#ffffff", ink: "#3a1d3f", c1: "#c2257a", scheme: light }
  forest: { bg: "#0f1f17", card: "#183024", ink: "#effaf2", c1: "#8ce99a", scheme: dark }

typography:
  display:
    fontFamily: "Fredoka, Lexend, sans-serif"
    fontWeight: 600-700
    use: home page headings, game card titles, cheer pop-ups, Help page, How it's going page, results screens
  body:
    fontFamily: "Lexend, Segoe UI, Helvetica Neue, Arial, sans-serif"
    fontWeight: 400-700
    fontSize: 16px
    use: everything else, including game titles (Lexend 700)
  game-title:     { fontFamily: Lexend, fontSize: 1.6rem, fontWeight: 700 }
  subject-title:  { fontFamily: Fredoka, fontSize: 1.6rem, fontWeight: 700 }
  card-title:     { fontFamily: Fredoka, fontSize: 1.6rem, fontWeight: 700 }
  cheer-title:    { fontFamily: Fredoka, fontSize: 1.8rem }
  problem-number: { fontFamily: Lexend, fontSize: "clamp(2.4rem, min(15vw, 8.5dvh), 5rem)", fontWeight: 600, numbers: tabular }
  pad-key:        { fontFamily: Lexend, fontSize: 2rem, fontWeight: 700, numbers: tabular }
  label-caps:     { fontFamily: Lexend, fontSize: 0.8rem, fontWeight: 600, letterSpacing: 0.06em, case: uppercase }
  wordmark:       { fontFamily: Nunito, note: "outlined into logo.svg, not loaded as a font" }

rounded:
  sm: 10px
  md: 12px
  lg: 14px
  key: 18px
  panel: 20px
  card: 24px
  cheer: 28px
  pill: 999px
  circle: 50%

spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 20px
  xxl: 28px
  gutter: 16px

components:
  game-card:      { background: "{colors.card}", border: "3px solid {tone}", shadow: "0 6px 0 {tone}", rounded: "{rounded.card}", padding: 20px }
  go-pill:        { background: "{tone}", text: "{colors.card}", font: Fredoka 700, rounded: "{rounded.pill}", padding: 6px 16px }
  pad-key:        { background: "{colors.key}", border: "2px solid {colors.line}", rounded: "{rounded.key}", minHeight: "clamp(50px, 8dvh, 92px)" }
  pad-go:         { background: "{colors.c1}", text: "{colors.on-accent}", rounded: "{rounded.key}" }
  answer-button:  { background: "{colors.card}", border: "3px solid {colors.line}", rounded: "{rounded.key}", font: Lexend 700 2.1rem }
  problem-card:   { background: "{colors.card}", border: "1px solid {colors.line}", rounded: "{rounded.card}" }
  chip-pill:      { background: "{colors.chip}", rounded: "{rounded.pill}" }
  settings-toggle: { background: "{colors.chip}", rounded: "{rounded.pill}", minHeight: 44px, open: "{colors.c1}" }
  settings-panel: { background: "{colors.card}", border: "2px solid {colors.line}", rounded: "{rounded.panel}", padding: 14px }
  cheer:          { background: "{colors.card}", border: "4px solid {colors.c5}", shadow: "0 8px 0 {colors.c5}", rounded: "{rounded.cheer}" }
  back-button:    { background: "{colors.chip}", border: "2px solid {colors.line}", rounded: "{rounded.pill}", minHeight: 48px, arrow: "36px circle in {colors.c1}", logo: 30px tall }
  last5-pill:     { dots: 5, dotSize: 22px, right: "{colors.good}", wrong: "{colors.bad}", empty: "2px dashed {colors.muted} at 45%", newest: "2px {colors.ink} ring" }
  focus-ring:     { outline: "3px solid {colors.c2}", offset: 2-3px }
---

# loopy design

This file says how loopy looks and feels.
Read it before you change a page or add a game.
It follows the [DESIGN.md format](https://github.com/voltagent/awesome-design-md).
The tokens at the top are for tools and AI agents. The text below is for people.

The real values live in `src/loopy.css` (shared) and in each page's own `<style>`.
If this file and the code disagree, the code wins. Then fix this file.

## 1. Look and feel

loopy is for kids in grades 1 to 10. It should feel like a toy, not a school form.

- **Bright on dark.** The default theme is Black. Five bright accent colors sit on a near-black page.
- **Chunky.** Big rounded cards, pill buttons, thick borders and fat tap targets.
- **Calm.** One task on screen at a time. No ads, no pop-ups except rewards, no clutter.
- **Friendly.** Fredoka headings feel round and playful. Lexend body text is easy for young readers.
- **Fast.** No outside requests. Fonts are on the site. Pages stay small.
- **One screen.** Each game fits a phone or tablet screen. No scrolling.

Key traits:

- The bunny wordmark: "loopy" in Nunito, with googly eyes for the two o's, green ears and buck teeth.
- Cards with a solid colored "drop" shadow (`0 6px 0`), so they look like buttons you can press.
- Yellow (`c5`) is the reward color: stars, badges, confetti, cheers.
- Green means right. Red means try again. Nothing else uses them.

## 2. Colors

Every page uses theme variables. Never hard-code a color in a game. Use a variable.

### Themes

There are five themes. Black is the default. The child picks one in Settings. It is saved in the browser.

| Theme | Page (`--bg`) | Card (`--card`) | Text (`--ink`) | Main accent (`--c1`) | Mode |
| --- | --- | --- | --- | --- | --- |
| Black (default) | #0a0a0c | #16161b | #f5f5f7 | #5b9dff | dark |
| Sunny | #fff8ec | #ffffff | #1d2a3f | #2457c5 | light |
| Ocean | #06263a | #0d3550 | #eaf6ff | #4cc9f0 | dark |
| Candy | #fff0f6 | #ffffff | #3a1d3f | #c2257a | light |
| Forest | #0f1f17 | #183024 | #effaf2 | #8ce99a | dark |

### Roles

Each theme sets the same names. Use the name, not the hex.

- `--bg`: the page.
- `--card`: cards, panels and the cheer pop-up.
- `--ink`: main text.
- `--muted`: hints, labels, small print.
- `--line`: borders and dividers.
- `--chip`: pills, the age picker, the star counter, tags.
- `--key`: number pad keys.
- `--c1` to `--c5`: five accents. `c1` blue is the main accent. `c2` orange marks focus and the cursor. `c5` yellow is rewards. Game cards take turns through `c1` to `c5`.
- `--good` and `--good-bg`: right answers.
- `--bad` and `--bad-bg`: wrong answers.
- `--on-accent`: text on a `c1` or `c5` button.
- Older names still work: `--accent` (= `c1`), `--mark` (= `c2`), `--hour` (= `c1`), `--minute` (= `c2`), `--accent-ink` (= `on-accent`).

### Logo colors

The logo has fixed colors and does not follow the theme. The one exception is the small logo in the game back button: its outlines and letters use the theme's text color, so it shows on every theme.
Ink #1d2a3f (white in `logo-white.svg`), ears #3ddc84, eyes white. The app icon is the bunny face on a #0a0a0c tile.

## 3. Typography

All fonts are stored on the site and cut down to English and German letters (`python3 tools/build.py --fonts`). Never load a font from Google or anywhere else.

- **Fredoka** (600 and 700): playful headings. Home page subject headings, game card titles, the "go" pills, cheer pop-ups, the star shelf, the Help page, the grown-ups' "How it's going" page and results screens.
- **Lexend** (400 to 700): everything else. Body text, game titles, numbers, buttons. Pages preload `fonts/lexend-latin.woff2`.
- **Nunito**: only in the wordmark, and only as shapes inside `logo.svg`. It is not loaded as a font.

| Use | Font | Size | Weight |
| --- | --- | --- | --- |
| Home tagline | Fredoka | 1.35rem | 600 |
| Subject heading, game card title | Fredoka | 1.6rem | 700 |
| Cheer pop-up title | Fredoka | 1.8rem | 700 |
| Game title (h1) | Lexend | 1.6rem (1.35rem on small phones) | 700 |
| Problem numbers | Lexend | clamp, up to about 5rem | 600 |
| Number pad keys | Lexend | 2rem | 700 |
| Answer buttons | Lexend | 2.1rem | 700 |
| Feedback ("Right!") | Lexend | 1.3rem bold, then 1.05rem | 700 / 400 |
| Body | Lexend | 16px | 400 |
| Small labels | Lexend | 0.8rem, uppercase, 0.06em spacing | 600 |

Rules:

- Numbers use `font-variant-numeric: tabular-nums`, so they line up and do not jump.
- Numbers follow the language: 1,000 in English and 1.000 in German. Use `Loopy.num()`.
- Use `text-wrap: balance` on headings.
- The name is always lowercase "loopy" on screen.

## 4. Components

### Wordmark

The "loopy" bunny logo sits at the top of the home page. Its letters hop one after the other (`hop`, 2.4s). Use `logo.svg` on light backgrounds and `logo-white.svg` on dark ones. Do not redraw it or change its colors.

### Game cards (home page)

- Card background, 3px border and a solid `0 6px 0` shadow in the card's tone color.
- Radius 24px, padding 20px, at least 170px tall.
- A small uppercase tag at the top (the age range), a Fredoka title in the tone color, a short muted line, and a "go" pill at the bottom.
- Pressed: the card moves down 4px and the shadow shrinks to 2px. It looks like a button being pushed.
- Tones cycle `c1`, `c2`, `c3`, `c4`, `c5`.
- **Today's 10** is one wide card in yellow (`c5`) above the star shelf. It is not in the GAMES list.

### Buttons

- **Pill buttons** (radius 999px): the "go" pill, the settings toggle, the language picker, the cheer buttons. At least 44px tall.
- **Number pad keys:** key color, 2px line border, radius 18px. They shrink a little (`scale(0.96)`) when pressed. The "check" key is filled with `c1`. The erase key is muted.
- **Answer buttons** (the clock and multiple-choice games): card color, 3px line border, radius 18px, big bold text. Right turns green, wrong turns red, the rest fade to 45%.
- **Round icon buttons:** the sound toggle (40px), the age picker plus and minus (38px), and the Read aloud speaker (44px).
- **Quiet buttons:** transparent with a 2px line border. Used for Reset and "Not now".
- **Disabled:** 35% to 40% opacity.

### Problem card

The question sits on a card with a 1px line border and radius 24px. After an answer the border turns green or red. In Plus and Minus the sum is written like a worksheet: the sign on the left, the digits on the right, a line, then the answer with a blinking orange cursor.

Counting pictures sit under the problem on the card. Times and Share shows rows of dots in the five accents. Make 10 shows ten-frames: boxes of 2 rows of 5 on a chip background, radius about 30% of a box. Filled boxes are `c1`, empty boxes are the card color with a line border, and after an answer the missing part fills in `c4`. Make 20 shows two frames side by side; Make 100 shows ten frames, two across. The boxes size themselves to the room left on the card.

**Read aloud speaker:** when Read aloud is on, a round 44px chip button with a speaker icon sits 8px from the card's top right corner. While it speaks the icon turns `accent`. In What Time Is It? it sits after the one-line prompt instead, so it never covers the words. `Loopy.speech.question()` adds it. It is hidden when the device has no voice.

### Feedback line

Under the problem: a short bold word: "Correct!" in green or "Not quite." in red, then one plain sentence that explains why. It always has room saved, so the layout does not jump.

### Number line

Bigger or Smaller explains each answer with a number line drawn in SVG. It stays hidden (but keeps its room) until the answer is in, so it never gives the answer away. The line and ticks are `muted`. Each number is a dot in `c1`, `c2` or `c4` with its value above it in the same color. For rounding, a dashed `ink` tick marks halfway, the number is a `c2` dot, and a `c1` arrow runs along the line to where it rounds. Labels near an end lean inwards so they are never cut off.

### Fraction pictures

Pizza Fractions draws pizzas and bars in SVG. A pizza is a `c2` crust ring with equal slices from the top, going round clockwise. Slices with toppings are `c1` with small `c2` pepperoni dots; the others are `chip`. Cut lines are `muted`. A bar is equal pieces side by side, colored in from the left, with a `muted` outline (radius 6) and cut lines. When comparing, the second fraction is `c4`; when adding, the second part is `c4`, cut into the same size pieces as the first. Fractions are written stacked (top number, a line in the text color, bottom number) in the problem and on the answer buttons, and as "3/4" in sentences. Like the number line, a picture that is not shown first keeps its room until the answer is in. On the printed sheet the pictures are black lines with grey parts.
### Coins and notes

Coins and Change draws money in SVG. Coins and notes keep fixed metal and paper colors in every theme, so they look like real money: copper, gold and silver coins, with two metals for the €1, €2, £1 and £2. Euro and pound notes have their own soft colors; dollar bills are a pale grey-green (never the `good` green). The coins keep their real sizes compared to each other, within limits, so the small ones stay readable. The value sits in the middle in dark ink, with the unit (c, ct, p, ¢) under it. A price tag is a `c2` tag with `on-accent` text. All pictures size themselves to the room left on the card. The answer is written in boxes, "€_.__" or "_,__ €", which fill from left to right.

### Top bar

Each game has a top bar with the back button on the left, and the star counter and the ⚙ Settings button on the right. The score row under the title holds the score, the streak and the Last 5 pill.

### Settings

Age, language, color theme, sound and levels go behind the ⚙ button. The toggle is a chip pill. It turns `c1` when open. The panel is a card with a 2px border and radius 20px. On very small phones (under 380px) the toggle shows only the gear.

- **Age picker:** a chip pill with round minus and plus buttons and the age in the middle.
- **Language picker:** EN and DE in a chip pill. The chosen one gets the card color.
- **Theme picker:** five round 36px swatches. The chosen one gets an ink border.
- **Level picker:** a segmented row of buttons in a chip box. The chosen one is raised on the card color.
- **Read aloud:** a chip pill next to the sound toggle, at least 44px tall: a speaker icon, "Read aloud", and a small On or Off tag on the card color. Off greys the icon and tag. `Loopy.speech.question()` adds it.
- **Print worksheet button:** a pill with a printer icon, a 2px `c1` border and `c1` text on no fill, at least 44px tall. A muted line next to it says what prints. It sits above the panel foot. `Loopy.worksheet()` adds it.

### Worksheet (print)

What **Print worksheet** prints. Only the sheet prints; the game is hidden. It is always black on white, whatever the theme, and uses no background colors, because browsers do not print them by default. Lines are borders.

- **Paper:** 12mm margins. Sized to fit both A4 and US Letter. Page 1 has the problems, page 2 the answers.
- **Header:** the game's name in Fredoka 20pt, "loopy" on the right in grey, a 0.6mm rule, one grey line with the age and settings, then Name, Date and Score lines, then one bold line saying what to do.
- **Problems:** 20 boxes with a light grey 0.3mm border and 3mm radius, numbered small in the top left corner. Lexend, large: 24pt for sums in columns, 20pt for lines, 18pt for words.
- **Layouts:** `vert` (Plus and Minus, 4 × 5, written in columns), `line` (Times and Share and Make 10, 2 × 10, "7 × 8 = ____" or "7 + ____ = 10"), `clock` (What Time Is It? and Coins and Change, 4 × 5, a 32mm picture and a line to write on: a clock and "____ : ____", or coins, notes and a price tag in black lines), `word` (Sound Spell and Word Match, 4 × 5, a picture with a word with a gap and choices to circle, or a picture with words to circle, one to a line). Pizza Fractions uses `clock` boxes for a pizza or bar with a line for the fraction (Name it and Mix), and `line` for Compare and Add. Quick Facts uses `line` boxes for a picture and a question, with the answers to circle on the line below.
- **Clocks:** black face line, ticks and numbers. The hour hand is short and thick, the minute hand long and thin.
- **Answers:** two columns of ten, 16pt, with a light line under each.

### Rewards

- **Star counter:** a chip pill with a yellow star and the number.
- **Cheer pop-up:** a card with a 4px yellow border, a yellow `0 8px 0` shadow and radius 28px. It pops in with a little bounce. A big Fredoka title, a muted line, a spinning star.
- **Confetti:** drawn on a canvas in the five theme accents. Streaks of 5, 10, 15, 20, 30 and 50 right answers set it off.
- **Badges:** at 10, 25, 50, 100, 250, 500 and 1,000 stars. Day badges at 3, 7 and 30 days of Today's 10. Not yet earned: a dashed circle. Earned: a filled circle in the badge's color.
- **Star shelf ("My stars"):** a card on the home page with a progress bar to the next badge and a grid of badges.
- **"Ready to level up?"** card after 10 right answers in a row.
- **Chimes:** short tones made in the browser. No sound files. "Right" goes up, "wrong" goes gently down, cheers and badges play a little tune. The speaker button mutes them.

### Back button

Every game has the same big back button in the top-left corner. It takes you to the home page.

- A chip pill with a 2px line border, at least 48px tall.
- On the left, a 36px round `c1` circle with a back arrow in `on-accent`.
- Next to it, the bunny logo, 30px tall, drawn in the theme's text color. It does not hop.
- The border turns `c1` on hover. It gets the usual focus ring.
- Screen readers hear "Back to all games" ("Zurück zu allen Spielen").
- In the page, write `<a class="home-link" href="../../">&larr; loopy</a>`. `loopy.js` turns it into the button, so the plain link still works if the script fails. Do not build your own.

### Last 5 pill

The score row shows the last 5 answers in this game as dots.

- A pill with the label "Last 5" ("Letzte 5") and five 22px dots, 5px apart.
- Right: a green (`good`) dot with a tick. Wrong: a red (`bad`) dot with a cross. The icon is in `on-accent`.
- Not played yet: a dashed `muted` circle at 45%.
- The newest answer is on the right, with a 2px `ink` ring around it.
- Screen readers hear how many of the last 5 were right.
- In the page, add `<div id="last5" data-game="game-id"></div>`. `Loopy.rewards.correct()` and `.wrong()` fill it in. "Reset score" clears it with `Loopy.recent.clear()`.
- It is saved in the browser (`loopy.recent`), one list per game. Today's 10 does not use it: it has its own 10 dots.

## 5. Layout

- One centered column. Games are 520px wide on phones, 640px on tablet portrait, and up to 1100px in landscape. The home page is 760px.
- A 16px gutter on each side, more if the phone has a notch (`env(safe-area-inset-*)`).
- Spacing steps: 4, 8, 12, 16, 20, 28px. Gaps inside a game are 8 to 12px. Home page sections are 28px apart.
- **One screen, no scrolling.** A game fills `100dvh`. Sizes use `clamp()` with `dvh`, so the pad and the problem grow or shrink with the screen.
- **Portrait:** top bar, then the problem, then the feedback, then the number pad or answers at the bottom where thumbs reach.
- **Landscape (640px wide or more):** two columns. The problem on the left, the pad or answers on the right.
- The home page may scroll. Games may not.
- Text in games cannot be selected by accident (`user-select: none` on the play area).

## 6. Depth

loopy is mostly flat. Depth comes from solid offset shadows, not blur.

| Level | Where | How |
| --- | --- | --- |
| Flat | Page, chips, pad keys | No shadow. Border only |
| Pressable | Game cards | Solid `0 6px 0` shadow in the tone color |
| Raised | Chosen level button | Soft `0 1px 3px` shadow |
| Pop-up | Cheer | Solid `0 8px 0` yellow, plus a soft `0 20px 60px` shadow |
| Top | Confetti | Full-screen canvas above everything, cannot be tapped |

## 7. Do and don't

### Do

- Use the theme variables for every color. Check your page in all five themes.
- Load only `loopy.js` and `loopy.css` as shared files. Edit `src/`, then run `python3 tools/build.py`.
- Ship every word in English and German. Use `Loopy.addStrings`, `data-t` and `Loopy.t()`.
- Make tap targets at least 44px. Make main game buttons much bigger.
- Show a 3px focus ring in `c2` (or `ink`) with `:focus-visible`.
- Respect `prefers-reduced-motion`. Turn off hops, bounces and confetti.
- Explain every answer in one plain sentence.
- Give green and red a second signal too, like a word or a line-through.
- Put settings behind the ⚙ button.
- Use the shared back button and Last 5 pill. Do not make your own.

### Don't

- Don't write "Loopy" with a capital L on screen.
- Don't add `style=` attributes or `on*=` handlers. They break the security policy. Run `python3 tools/csp.py` after you change a page.
- Don't load anything from another website. No CDN, no Google Fonts, no images from elsewhere.
- Don't make a game page scroll.
- Don't use green or red for anything except right and wrong.
- Don't use yellow for anything except rewards and Today's 10.
- Don't add new fonts, sound files or a new shared script.
- Don't add hover-only effects. Most players use touch.
- Don't change the look of other games when you add a new one.

## 8. Screens

Test every page at these sizes:

| Screen | Size | What changes |
| --- | --- | --- |
| Small phone | 360 × 640 | Smaller title and keys (under 420px). The settings button shows only the gear (under 380px) |
| Phone | 390 × 844 | One column. Pad at the bottom |
| Phone landscape | 844 × 390 | Two columns |
| Tablet portrait | 820 × 1180 | One column up to 640px. Bigger keys and numbers |
| Tablet landscape | 1180 × 820 | Two columns up to 1100px |
| Print | A4 and US Letter | Only the worksheet prints, on two pages |

- Short phones (under 760px tall) use smaller feedback text, so the pad stays on screen.
- Buttons use `touch-action: manipulation`, so a double tap does not zoom.
- "Add to Home Screen" opens loopy full screen. The status bar is black.

## 9. Prompt guide

Quick colors (Black theme): page #0a0a0c, card #16161b, text #f5f5f7, muted #a1a1ab, line #2a2a33, blue #5b9dff, orange #ff8a4c, green #3fd68a, purple #e070ff, yellow #ffd23f, right #3fd68a, wrong #ff6b6b.

Example prompts:

- "Add a new loopy game in `math/<game>/`. Use the theme variables, Lexend for text and the shared top bar with Settings behind ⚙. Fit one screen in portrait and landscape. English and German."
- "Make a multiple-choice answer grid like What Time Is It?: two columns, card color, 3px line border, radius 18px, big bold Lexend. Green when right, red when wrong, others fade."
- "Add a home page card for this game: 3px border and a `0 6px 0` shadow in its tone color, radius 24px, Fredoka title, uppercase age tag, and a go pill."

## Known gaps

- Each game page still has its own copy of some base styles (pad, problem card, top bar). Only themes, rewards, settings, the back button and the Last 5 pill are shared today.
- Some pages set light fallback colors in their own `:root`. The theme from `loopy.css` replaces them.
