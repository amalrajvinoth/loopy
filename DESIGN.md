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
  contrast: { bg: "#000000", card: "#000000", ink: "#ffffff", muted: "#e6e6e6", line: "#ffffff", c1: "#8cc8ff", hour: "#3d84ff", minute: "#e65c00", scheme: dark }

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
  skip-button:    { background: transparent, text: "{colors.muted}", border: "2px solid {colors.line}", rounded: "{rounded.pill}", minWidth: 9rem }
  hint-bubble:    { background: "{colors.c1}", text: "{colors.on-accent}", font: Fredoka 700 1.25rem, rounded: 20px }
  plus-one:       { background: "{colors.card}", border: "3px solid {colors.c5}", rounded: "{rounded.pill}" }
  focus-ring:     { outline: "3px solid {colors.c2}", offset: 2-3px, everywhere: ":focus-visible in loopy.css", map: "3px c2 stroke" }
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

There are five color themes and one high contrast theme. Black is the default. The child picks one in Settings. It is saved in the browser.

| Theme | Page (`--bg`) | Card (`--card`) | Text (`--ink`) | Main accent (`--c1`) | Mode |
| --- | --- | --- | --- | --- | --- |
| Black (default) | #0a0a0c | #16161b | #f5f5f7 | #5b9dff | dark |
| Sunny | #fff8ec | #ffffff | #1d2a3f | #2457c5 | light |
| Ocean | #06263a | #0d3550 | #eaf6ff | #4cc9f0 | dark |
| Candy | #fff0f6 | #ffffff | #3a1d3f | #c2257a | light |
| Forest | #0f1f17 | #183024 | #effaf2 | #8ce99a | dark |
| High contrast | #000000 | #000000 | #ffffff | #8cc8ff | dark |

**High contrast** is for kids with low vision. Every text and button passes WCAG AA (checked with axe on every page). On top of its colors:

- `--line` is white, `--muted` is #e6e6e6, and the other accents are bright: `c2` #ffb066, `c3` and `good` #5cf2a0, `c4` #ffa6f0, `c5` #ffe500, `bad` #ff9b9b. Text on an accent is black.
- Buttons, pills, the level picker, the language and age pickers and the star counter get a 2px white edge (an inside outline, so nothing moves).
- The clock face stays white, so the hands use mid colors that stand out on white and black: `--hour` #3d84ff and `--minute` #e65c00.
- Theme swatches have a grey edge; the chosen one gets a white edge and a white ring.

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
- **Atkinson Hyperlegible Next** (400 to 700): the "Easier to read" font. When it is on, it replaces Fredoka and Lexend for every text on the page, with 0.02em extra letter spacing. Letters that look alike (b d p q, I l 1, O 0) have different shapes. A page only loads it when the setting is on; the offline helper saves it with the other fonts. It is a little narrower than Lexend, so nothing grows.
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

- Each game is a tile: card background, 3px border and a solid `0 6px 0` shadow in the tile's tone color, radius 24px.
- On the tile, centered: a big picture (one emoji, 2.8rem), the Fredoka title in the tone color, and a small uppercase tag with the ages. The picture lets a child who cannot read yet find the game.
- Two tiles per row on phones, three from 600px wide. From 700px wide the tile also shows one muted line about the game.
- Pressed: the tile moves down 4px and the shadow shrinks to 2px. It looks like a button being pushed.
- Tones cycle `c1`, `c2`, `c3`, `c4`, `c5`.
- Order on the home page: the logo, "Who is playing?" (or, with one child, the child chip next to Settings), the ⚙ Settings button (age, colors, sound, language), **Today's 10**, the games by subject, then **My stars**, then the links for grown-ups.
- **Today's 10** is one wide card in yellow (`c5`) with a "go" pill. It is not in the GAMES list.

### Buttons

- **Pill buttons** (radius 999px): the "go" pill, the settings toggle, the language picker, the cheer buttons. At least 44px tall.
- **Number pad keys:** key color, 2px line border, radius 18px. They shrink a little (`scale(0.96)`) when pressed. The "check" key is filled with `c1`. The erase key is muted.
- **Answer buttons** (the clock and multiple-choice games): card color, 3px line border, radius 18px, big bold text. Word answers are at least 1.1rem and grow to about 2rem; letters, times and fractions are bigger. Four answers sit in a 2 × 2 grid; three answers sit in one column, so none looks bigger than the others. Right turns green, wrong turns red, the rest fade to 45%.
- **Skip and Next** (the button under the answers, `Loopy.nextButton()`): before an answer it is a small quiet pill, "Skip", in the middle (muted text, 2px line border, no fill). After an answer it is the full-width `c1` button "Next". Every game uses these two words.
- **Round icon buttons:** the sound toggle (40px), the age picker plus and minus (38px), and the Read aloud speaker (44px).
- **Quiet buttons:** transparent with a 2px line border. Used for Reset and "Not now".
- **Disabled:** 35% to 40% opacity.

### Problem card

The question sits on a card with a 1px line border and radius 24px. After an answer the border turns green or red. In Plus and Minus the sum is written like a worksheet: the sign on the left, the digits on the right, a line, then the answer with a blinking orange cursor.

Counting pictures sit under the problem on the card. Times and Share shows rows of dots in the five accents. Make 10 shows ten-frames: boxes of 2 rows of 5 on a chip background, radius about 30% of a box. Filled boxes are `c1`, empty boxes are the card color with a line border, and after an answer the missing part fills in `c4`. Make 20 shows two frames side by side; Make 100 shows ten frames, two across. The boxes size themselves to the room left on the card.

Equation Balance shows a see-saw above the equation: a `muted` stand and an `ink` beam. On the beam, x is a `c1` block, a number is a `c2` weight, a minus number is a `c4` balloon on a string, and the missing number is a dashed `c1` box. Before an answer the beam rocks gently (off with reduced motion); after it, the beam goes level or tips to the heavier side.

**Read aloud speaker:** when Read aloud is on, a round 44px chip button with a speaker icon sits 8px from the card's top right corner. While it speaks the icon turns `accent`. In What Time Is It? it sits after the one-line prompt instead, so it never covers the words. `Loopy.speech.question()` adds it. It is hidden when the device has no voice.

### Feedback line

Inside the problem card, under the problem: a short bold word: "Correct!" in green or "Not quite." in red, then one plain sentence that explains why. Every game puts it in the card (What Time Is It? too), and the card's border turns green or red with it. After an answer the problem and its picture shrink (`zoom`) so the whole sentence fits without scrolling. Plus and Minus explains the first carry or trade in full and later ones in a short form, and if the reason is still too long it steps the text down (`fit1` to `fit3` on the card) until it fits, even at 360 × 640 in German.

### Number line

Bigger or Smaller explains each answer with a number line drawn in SVG. It stays hidden (but keeps its room) until the answer is in, so it never gives the answer away. The line and ticks are `muted`. Each number is a dot in `c1`, `c2` or `c4` with its value above it in the same color. For rounding, a dashed `ink` tick marks halfway, the number is a `c2` dot, and a `c1` arrow runs along the line to where it rounds. Labels near an end lean inwards so they are never cut off.

### Fraction pictures

Pizza Fractions draws pizzas and bars in SVG. A pizza is a `c2` crust ring with equal slices from the top, going round clockwise. Slices with toppings are `c1` with small `c2` pepperoni dots; the others are `chip`. Cut lines are `muted`. A bar is equal pieces side by side, colored in from the left, with a `muted` outline (radius 6) and cut lines. When comparing, the second fraction is `c4`; when adding, the second part is `c4`, cut into the same size pieces as the first. Fractions are written stacked (top number, a line in the text color, bottom number) in the problem and on the answer buttons, and as "3/4" in sentences. Like the number line, a picture that is not shown first keeps its room until the answer is in. On the printed sheet the pictures are black lines with grey parts.
### Coins and notes

Coins and Change draws money in SVG. Coins and notes keep fixed metal and paper colors in every theme, so they look like real money: copper, gold and silver coins, with two metals for the €1, €2, £1 and £2. Euro and pound notes have their own soft colors; dollar bills are a pale grey-green (never the `good` green). The coins keep their real sizes compared to each other, within limits, so the small ones stay readable. The value sits in the middle in dark ink, with the unit (c, ct, p, ¢) under it. A price tag is a `c2` tag with `on-accent` text. All pictures size themselves to the room left on the card. The answer is written in boxes, "€_.__" or "_,__ €", which fill from left to right.

### Letter boxes and letter pad

Spell It shows one box per letter under the picture: a bold letter on a `line` underline, with the next box to fill underlined in `accent`. After a check, right letters turn green and wrong ones red and crossed out. When the answer is wrong, a second row of green boxes spells the word under the child's try, one letter at a time (all at once with reduced motion). German words show a capital first letter. The letter pad uses the number pad keys: 8 keys in 4 columns for short words, 10 in 5 columns for longer ones, then an erase key and a wide "check" key that turns into "Next".

### Maps

Where Is It? draws its maps in SVG, from simple Natural Earth outlines stored in the page (Mercator projection). The map sits on a card with radius 24px and fills the room left on screen; it grows to the screen's shape instead of cutting the view. Colors are solid mixes of the theme, made in the script so shapes never show through each other: the sea is 16% `c1` on the card color, land is 20% `ink` on the sea, and countries that can be asked are 40% `ink`. Country borders are 1px `card` lines at every zoom. For continents there are no country borders and each continent takes an accent at 60%: Europe and South America `c1`, Asia `c4`, Africa, North America and Oceania `c2`, Antarctica `muted`. After an answer the right place is `good` and a wrong tap is `bad` (oceans at 35%), with the names in bold Lexend 15px, `ink` with a `card` outline, kept inside the map. A capital is a small `ink` dot with its name above. Tab moves between the places that can be asked, with a 3px `c2` outline.

### Flags

Flags and Capitals draws each flag in SVG from a few boxes, stripes, circles, stars and lines stored in the page, on a 30 × 20 grid (Switzerland is square). Like coins, flags keep their real colors in every theme, High contrast too, so they look like the real thing. Emoji flags are not used, because they do not show on Windows. Emblems and coats of arms are left out or drawn as simple shapes. A thin `muted` edge goes round every flag, so white parts show on a white card. The flag fills the room left on the card and gets smaller after an answer, so the question and the fact line fit. The answers are the same four buttons as Quick Facts. On the worksheet the flags print in color.

### Top bar

Each game has a top bar with the back button on the left, and the star counter, the flag (Report a problem), the child playing and the ⚙ Settings button on the right. The score row sits next to the title when it fits, else under it, on one line: the Last 5 pill, then the streak as "🔥 3". The score (right out of tried) is kept for screen readers only; grown-ups see the numbers on the How it's going page.

### Report a problem

- **Flag button:** a round 44px chip with a flag icon in `muted`, between the star counter and ⚙ Settings. Its name is "Report a problem" ("Problem melden"). If the top bar is too narrow, Settings first shows only its gear and the right-hand buttons sit 4px apart; if that is still too wide (small phones with many stars), the flag hides. After that the back button shows only its arrow, then a long child's name is cut short with "…", and last only the child's picture stays. `loopy.js` adds it to every page with a `.game-bar`.
- **In Settings:** always a "Report a problem" pill, styled like Print worksheet (flag icon, `c1` outline), with a muted line saying what it is for. It closes Settings first, so the picture shows the game.
- **Box:** the same dialog card as the children's box (3px `c1` border, radius 24px). A Fredoka title, "What is wrong?", then three big chip buttons stacked: The question is wrong, The answer seems wrong, Something looks wrong (the picked one gets a `c1` border). An optional one-line note. A 96px preview of the screen picture with a Save picture button, or a muted line saying to take a screenshot when the browser can't make one. A muted warning with a line on its left: GitHub is public and for ages 13 and up. Buttons: Close and Copy text (outline), Open GitHub (`c1`).
- On short landscape screens (under 560px tall) the box is wider and splits in two columns: the choices and note on the left, the picture, warning and buttons on the right. The preview is 64px.

### Settings

Age, language, color theme, sound and levels go behind the ⚙ button, on the home page too. The panel is the same in every game: **This game** first (the game's own levels and switches, then Print worksheet), then **Age, look and sound** (the shared row, after a dashed line), then the keyboard line and Reset score at the bottom. The two headings are small uppercase `c1` labels; `loopy.js` adds them. Today's 10 and the home page have no game settings, so they show only the second part. The toggle is a chip pill. It turns `c1` when open. The panel is a card with a 2px border and radius 20px. On very small phones (under 380px, or under 420px in German, where "Einstellungen" is long) the toggle shows only the gear.

- **Age picker:** a chip pill with round minus and plus buttons and the age in the middle.
- **Language picker:** EN and DE in a chip pill. The chosen one gets the card color.
- **Theme picker:** six round 36px swatches (the last is High contrast, black with a white dot). The chosen one gets an ink border.
- **Easier to read:** a chip pill right after the theme picker, styled like Read aloud: an "Aa" icon, "Easier to read", and an On or Off tag. loopy.js adds it to every page that has a theme picker.
- **Level picker:** a segmented row of buttons in a chip box. The chosen one is raised on the card color.
- **Read aloud:** a chip pill next to the sound toggle, at least 44px tall: a speaker icon, "Read aloud", and a small On or Off tag on the card color. Off greys the icon and tag. `Loopy.speech.question()` adds it.
- **Print worksheet button:** a pill with a printer icon, a 2px `c1` border and `c1` text on no fill, at least 44px tall. A muted line next to it says what prints. It sits above the panel foot. `Loopy.worksheet()` adds it.

### First-time hint

The first time a child opens a game, a `c1` bubble with `on-accent` Fredoka text sits just above the answers with a small arrow pointing down: "👆 Tap the right answer!", "Tap the numbers, then Check!", "Tap the letters to spell the word!" or, on the map, inside the map's bottom edge. It bobs gently (not with reduced motion), cannot be tapped, and hides at the first tap or key press. Once the child has answered in that game it never comes back. It is saved per child (`loopy.seen`).

### Focus and screen readers

- **Focus ring:** every control shows a 3px `c2` outline, 2px to 3px away from it, when it is reached with the keyboard (`:focus-visible`). `loopy.css` sets it for everything, so a new button gets it too. A page may use `ink` instead where `c2` is the button's own color. Map areas get a 3px `c2` stroke instead of an outline. The ring needs 3:1 contrast with the page in every theme, High contrast included.
- **Never** remove the ring without putting another one in its place.
- **Names:** every button has words or an `aria-label` (translated with `data-t-aria`). Icons are `aria-hidden`.
- **Announcements:** after each answer a hidden live region reads the feedback line ("Correct!" and why). The score row is a polite live region too. Do not add `aria-live` to the feedback line as well, or it is read twice.
- **Keyboard:** Tab reaches everything in order. Enter or Space answers. After Next, focus moves to the first answer. Escape closes Settings.
- **Landmarks:** the title and score row is a section named by the title, Settings is a named region, the play area is `<main>`.

### Worksheet (print)

What **Print worksheet** prints. Only the sheet prints; the game is hidden. It is always black on white, whatever the theme (except the flags in Flags and Capitals, which print in color), and uses no background colors, because browsers do not print them by default. Lines are borders.

- **Paper:** 12mm margins. Sized to fit both A4 and US Letter. Page 1 has the problems, page 2 the answers.
- **Header:** the game's name in Fredoka 20pt, the loopy bunny logo on the right (8mm tall, the same drawing as the back button, black lines with its green ears), a 0.6mm rule, one grey line with the age and settings, then Name, Date and Score lines, then one bold line saying what to do.
- **Problems:** 20 boxes with a light grey 0.3mm border and 3mm radius, numbered small in the top left corner. Lexend, large: 24pt for sums in columns, 20pt for lines, 18pt for words.
- **Layouts:** `vert` (Plus and Minus, 4 × 5, written in columns), `line` (Times and Share, Times Tables Sprint and Make 10, 2 × 10, "7 × 8 = ____" or "7 + ____ = 10"), `clock` (What Time Is It? and Coins and Change, 4 × 5, a 32mm picture and a line to write on: a clock and "____ : ____", or coins, notes and a price tag in black lines), `word` (Sound Spell, Word Match and Spell It, 4 × 5, a picture with a word with a gap and choices to circle, a picture with words to circle, one to a line, or a picture with a line to write the word and its letters mixed up underneath). Where Is It? uses `clock` boxes for a small map with one place in grey and a line for its name, and `line` for capitals ("France: ____"). Pizza Fractions uses `clock` boxes for a pizza or bar with a line for the fraction (Name it and Mix), and `line` for Compare and Add. Quick Facts uses `line` boxes for a picture and a question, with the answers to circle on the line below.
- **Clocks:** black face line, ticks and numbers. The hour hand is short and thick, the minute hand long and thin.
- **Answers:** the same header with the logo, without Name, Date and Score. Then two columns of ten, 16pt, with a light line under each.

### Rewards

- **Star counter:** a chip pill with a yellow star and the number.
- **"+1" star:** after each right answer a small card-colored pill with a yellow border, "+1" and a star, flies from where the child tapped to the star counter (0.7s), then the counter bumps. With reduced motion only the counter bumps.
- **Cheer pop-up:** a card with a 4px yellow border, a yellow `0 8px 0` shadow and radius 28px. It pops in with a little bounce. A big Fredoka title, a muted line, a spinning star.
- **Confetti:** drawn on a canvas in the five theme accents. Streaks of 5, 10, 15, 20, 30 and 50 right answers set it off.
- **Badges:** at 10, 25, 50, 100, 250, 500 and 1,000 stars. Day badges at 3, 7 and 30 days of Today's 10. Not yet earned: a dashed circle. Earned: a filled circle in the badge's color.
- **Star shelf ("My stars"):** a card on the home page with a progress bar to the next badge and a grid of badges.
- **"Ready to level up?"** card after 10 right answers in a row.
- **Chimes:** short tones made in the browser. No sound files. "Right" goes up, "wrong" goes gently down, cheers and badges play a little tune. The speaker button mutes them.

### Who is playing? (children)

Each child on the device has their own picture, name, age, stars, streaks, progress and game settings. Theme, sound and language are the same for everyone on the device.

- **Picker:** on the home page, between the tagline and Settings, only with two or more children. A muted line "Who is playing?" ("Wer spielt?"), then one chip pill per child: a picture (one of 12 animal emoji) and the name, at least 44px tall. The child playing gets the card color and a 3px `c1` border. Then a round 44px ✎ chip (change the child playing) and a round + chip (add a child, hidden at 6 children).
- A new device starts with one child with no name (🐰), and no names show anywhere. Devices that already have children (Dio 🐰 and Dia 🦄 from before) keep them. Stars saved before children came in go to child 1.
- **Child chip:** the child playing, right before ⚙ Settings in every game's top bar and Today's 10, even with one child. A 44px chip pill like Settings: the picture, then the name in bold (cut with "…" after about 7 letters). A child with no name (one child on a new device) shows only the picture, as a round 44px chip. Tapping it opens the change box for that child (name and picture). On the home page it sits next to Settings under the tagline, only with one child (with two or more, the "Who is playing?" row shows it). With two or more children the star counter in the top bar no longer repeats the picture; its name for screen readers still says whose stars they are.
- **Kids in Settings:** on the home page, Settings starts with a "Kids" ("Kinder") part with the same `c1` uppercase heading as the other parts. One 44px chip pill per child (picture, name, a muted ✎) opens the change box; then a dashed outline "+ Add a child" pill (hidden at 6). A muted line under them says what each child gets. A dashed line separates it from "Age, look and sound".
- A child with no name is called "Player 1" ("Kind 1"), by place in the list.
- **Add or change box:** a dialog card with a 3px `c1` border, a `0 6px 0` `c1` shadow and radius 24px, over a dark backdrop. A Fredoka title, a Name field, a 6 × 2 grid of pictures (the picked one gets a `c1` border), and for a new child the age picker. Buttons at the bottom: Cancel (outline) and Save (`c1`). With two or more children, a red outline Remove button on the left. It needs a second tap ("Tap again to remove Mia and all their stars"), and turns solid red for that second tap. Red is used here only because the stars are lost, like Clear answers on "How it's going".
- **Star counter:** with two or more children, the child's picture sits before the star, on the home page and in every game, so a sibling sees whose stars they are earning.
- **Carry on:** on the home page, above Today's 10, a one-row card in the tile style with a `c3` (green) border: the game's picture, a "Carry on" tag, the game's name in Fredoka and a "Go →" pill. It only shows when the child has played a game. It links to the child's last game (`loopy.last`, per child).
- **Move to another device:** in My stars. With two or more children, a "Whose stars?" row of chip pills (Everyone, then each child) picks what the code holds; the picked one gets a `c1` border. Then the code with Copy, a full-width Copy link button, and the paste row. Opening a link shows the change box style: "Load Mia's stars here?", one muted line, Not now (outline) and Load (`c1`).
- **How it's going:** the heading names the child ("How it's going for Mia") and a picker without ✎ and + switches between children.
- Switching child reloads the page. In the page, add `<div id="kid-picker"></div>` (or with `data-switch-only`). `loopy.js` builds it.

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
- It is saved in the browser (`loopy.recent`, per child), one list per game. Today's 10 does not use it: it has its own 10 dots.

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
- Show a 3px focus ring in `c2` (or `ink`) with `:focus-visible`. Run `node tools/a11y/check.mjs` to check it in every theme.
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
