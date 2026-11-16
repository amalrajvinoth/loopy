# Plan: less empty space, bigger main content on every screen size

Date: 16 November 2026. Measured on `main` at `000db75` (after PR #259). No code was changed.

**Goal:** name the screen size classes loopy designs for (S, M, XL phones, tablet, wide, desktop), and in each one cut the empty space so the game itself (the sum, the flag, the word, the keys and the answer buttons) is as big as the screen allows. Still one screen, no scrolling, settings behind ⚙.

## What I found today

Measured on the home page, Plus and Minus, Flags and Capitals and Word Match at seven sizes (English, Black theme). Pictures: `0-today-plus-minus.png`, `0-today-flags.png`. The numbers come from the browser (`src/measure.mjs`, `before/facts.json`).

| Screen | Size | Game column | Empty at the sides | Sum (Plus and Minus) | Pad key | Answer button (Flags) | What is wrong |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S phone | 360 × 640 | 328 px | 16 + 16 | 54 px | 51 px tall | 58 px tall, 17 px text | Fine. Tight already |
| M phone | 390 × 844 | 358 px | 16 + 16 | 58 px | 68 px | 76 px, 19 px text | The sum is sized by width (15vw), not height. The card is 367 px tall with the sum using 130 px |
| XL phone | 430 × 932 | 398 px | 16 + 16 | 64 px | 75 px | 84 px, 21 px text | Same. Pad keys stop at 8% of the height |
| Tablet portrait | 820 × 1180 | 640 px | 90 + 90 | 112 px | 118 px | 118 px, 27 px text | The column is capped at 640 px; 180 px of the width is empty |
| Tablet landscape | 1180 × 820 | 1100 px | 40 + 40 | 83 px | 130 px | 115 px, 26 px text | Keys capped at 130 px. The sum is 83 px in a 684 px tall card |
| Wide (laptop) | 1280 × 800 | 1100 px | 90 + 90 | 90 px | 130 px | 112 px, 26 px text | Same caps as the tablet |
| Desktop | 1920 × 1080 | 1100 px | 410 + 410 | 112 px | 130 px | 130 px, 27 px text | 820 px of the width is empty. The card is 944 px tall and the sum uses 250 px of it. Keys and answers stop at 130 px |
| Home page, desktop | 1920 × 1080 | 760 px | 580 + 580 | | | | Tiles stay phone size on a big screen |

In short:

- **Phones** are close to right. The sum could be a step bigger (it is limited by width, not height), and the gaps (12 px between rows, 12 + 16 px page padding, 14 px card padding) could lose 2 to 4 px each.
- **Tablet portrait** wastes the sides: 640 of 820 px.
- **Everything 1100 px and wider** hits caps written for a tablet: the column stops at 1100 px, the sum at 7rem (112 px), keys and answer buttons at 130 px. On a 1920 px screen the game sits in the middle of the screen with 820 px empty around it and a card that is three quarters empty.
- **The home page** stops at 760 px.

Where the layout lives: each of the 37 game pages carries its own copy of the same "Phones and tablets" style block (`.wrap` 520 / 640 / 1100 px, the `clamp()` rules for the sum and the keys). `src/loopy.css` holds no layout at all. So any change to spacing touches every game page, whichever option is picked. The difference between the options is whether the numbers move into one shared place or stay copied.

## The size classes

One set of names for DESIGN.md, the screenshot script and the CSS. Width decides the class. On phones the height matters more for a one-screen game, so the phone classes also carry a height note.

| Class | Width | Height note | Test size | Layout |
| --- | --- | --- | --- | --- |
| S | up to 379 px | short, under 700 px | 360 × 640 | one column, 520 px cap |
| M | 380 to 414 px | 700 to 900 px | 390 × 844 | one column, 520 px cap |
| XL | 415 to 599 px | over 900 px | 430 × 932 | one column, 520 px cap |
| tab | 600 to 1199 px | portrait: one column; landscape (640 px and wider): two columns | 820 × 1180 and 1180 × 820 | 760 px portrait, 1160 px landscape |
| wide | 1200 to 1599 px | laptops | 1280 × 800 | two columns, 1400 px cap |
| desktop | 1600 px and up | monitors | 1920 × 1080 | two columns, 1600 px cap |

Today DESIGN.md tests five sizes. The plan adds XL, wide and desktop to the "Screens" table and to `plugins/loopy/scripts/screens.mjs`, so every later PR gets pictures at all seven.

## Options

### 1. ⭐ Size classes as shared tokens in loopy.css

What changes: `src/loopy.css` gets one block per size class that sets a handful of variables: page padding, row gap, card padding, column width, key height, the big-number size, the answer-button height and text size, the picture height. Each game's copied "Phones and tablets" block is replaced by the same short block that reads those variables. The home page gets a wider grid on wide and desktop.

| Token | S | M | XL | tab portrait | tab landscape | wide | desktop |
| --- | --- | --- | --- | --- | --- | --- | --- |
| page padding (top, bottom) | 6, 8 | 8, 12 | 8, 12 | 8, 12 | 8, 12 | 8, 12 | 8, 12 |
| row gap | 8 | 10 | 10 | 14 | 16 | 20 | 24 |
| card padding | 10 | 12 | 12 | 14 | 14 | 16 | 16 |
| column width | 520 | 520 | 520 | 760 | 1160 | 1400 | 1600 |
| big number (max) | 11dvh | 11dvh, 5.5rem | 11dvh, 5.5rem | 13dvh, 9rem | 17dvh, 9rem | 18dvh, 11rem | 20dvh, 13rem |
| pad key height (max) | 9.5dvh | 9.5dvh, 100 px | 100 px | 11.5dvh, 150 px | 170 px | 190 px | 210 px |
| answer button (max) | 10dvh | 110 px | 110 px | 150 px | 170 px | 190 px | 210 px |
| answer text (max) | 2rem | 2rem | 2rem | 2.4rem | 2.4rem | 2rem fixed | 2.3rem fixed |
| flag or picture height | 31dvh | 31dvh | 31dvh | 36dvh | 42dvh | 46dvh | 50dvh |
| home page width | 100% | 100% | 100% | 760 | 760 | 960 | 1100 |

What you will notice: on a phone the sum is about a quarter bigger (58 to 74 px on 390 × 844) and the keys a bit taller (68 to 80 px). On a tablet the game fills the width. On a laptop or monitor the sum is 150 px, keys are 210 px and the flag is 500 px wide. See `1-phones-*.png`, `1-tablet-*.png`, `1-wide-desktop-*.png`, `1-home-big-screens.png`. Nothing scrolls at any of the seven sizes (checked in the browser, Settings closed).

Files: `src/loopy.css`, all 37 game pages (the same block swapped in each), `index.html`, `DESIGN.md`, `screens.mjs`, the guide pictures later.

Cost and risk: the biggest change, but a mechanical one. Two PRs: the first adds the tokens and converts Plus and Minus, Flags and Capitals, Word Match and the home page; the second converts the other 34 games. Games with their own pictures or grids (Word Detective, Times Table Grid, Tens and Ones, Graphs and Data, Where Is It?) keep their own sizes inside the bigger card, so each one needs a look at the seven sizes and may want its own cap raised in the same PR. New games get the right spacing for free, and the next spacing change is one file.

### 2. Raise the caps in each game, nothing shared

What changes: the same new numbers as Option 1, written into each game's own style block by hand (the 1100 px cap, the 7rem cap, the 130 px cap and so on). No change to `src/loopy.css`.

What you will notice: the same pictures as Option 1 on the three games measured.

Files: 37 game pages, `index.html`, `DESIGN.md`.

Cost and risk: faster to start (one PR, no new system) and each game can be tuned alone. But every game keeps its own copy of the numbers, so they drift again, and the next change is 37 files again.

### 3. Scale the whole page by size class

What changes: about ten lines in `src/loopy.css`: the base font size goes from 16 px to 18 px on tablets, 20 px on wide and 23 px on desktop, and the column caps move to rem so they grow too. Everything in rem grows at once: title, pills, Settings, buttons, the sum, the home tiles.

What you will notice: on a tablet and a desktop the whole game is bigger, chrome included. The main content grows less than in Option 1, because the keys and answer buttons have pixel caps that do not scale (see `3-scale-vs-tokens-desktop.png` and `3-scale-vs-tokens-tablet.png`: the sum is 134 px against 154 px, the keys 170 px against 210 px). The title and the pills get big, which goes against "chrome minimal". Phones do not change.

Files: `src/loopy.css`, `DESIGN.md`. The pixel caps in the games would still need Option 2 to go away.

Cost and risk: cheapest and quickest. Risk: Settings panels, the home page, the How it's going page and the guide all grow too, German labels wrap sooner, and the print styles need a check.

### 4. Container queries: each card sizes its own content

What changes: the problem card and the pad become containers (`container-type: size`). The sum, the picture and the keys are sized in container units (`cqh`, `cqw`) instead of screen units, so they fill whatever box the layout gives them, in one column or two. The column caps of Option 1 are still needed, so this builds on Option 1.

What you will notice: the same as Option 1 on the three games measured, and better fit in games with grids or pictures, because the content follows the card rather than the screen.

Files: `src/loopy.css` plus every game, game by game, with real thought for each.

Cost and risk: the deepest rewrite and the slowest. The hint bubble, the zoom-after-answer rules and the feedback area all assume screen units today. Best as a later step for the picture and grid games, after Option 1 is in.

### 5. Phones only now, big screens later

What changes: the S, M and XL columns of Option 1 only: a bigger sum and taller keys on phones, 2 to 4 px off the gaps. Tablets, wide and desktop stay as they are.

What you will notice: the phone pictures in `1-phones-*.png`. Nothing on bigger screens.

Files: the 37 game pages (the phone rules), `DESIGN.md`.

Cost and risk: the smallest visible change and the lowest risk, but it leaves the biggest empty space (tablet and desktop) untouched and still touches every game.

## Recommendation

**Option 1**, in two PRs, with Option 4 as a later round for the picture and grid games.

Why: the empty space is worst on tablets and desktops, so Option 5 does not solve the ask. Option 3 is cheap but makes the chrome big and leaves the pixel caps in place. Options 1 and 2 touch the same 37 files; Option 1 is the one where the next change is one file and new games are right by default.

What the build will check before the PR is ready: nothing scrolls at the seven sizes in portrait and landscape, English and German; Settings open still scrolls normally; the hint bubble still finds a free spot; the first-answer "zoom" still keeps the reason on screen at 360 × 640 in German; Today's 10 and the worksheets are unchanged; the play test and the screen reader check pass; improve-ui on the touched pages.

## Files in this folder

The plan as written on 16 November 2026, with the key pictures. The full set of screenshots, the measuring script and the mock-up style sheets are in the project folder `spacing-plan/`. Built as Option 1: issue #260.
