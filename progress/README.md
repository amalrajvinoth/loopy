# How it's going

A page for grown-ups. It shows how the week went, what to practise next, and how a child is doing in each game.

Open it from the link **For grown-ups: how it's going** at the bottom of the home page.

## What it shows

- **This week in one line.** How many answers this week (Monday to today) and how many percent were right, with "▲ up from 72% last week" or "▼ down from 85% last week", and how many days were played. Under it: stars, day streak and badge, and four small bars with the percent right for the last four weeks.
- **Practise next.** The three kinds of question missed most this week, for example "7 times table", "Clock: minutes in fives" or "Taking away with regrouping". Each one says how often and in which games, how many were right this week ("7 of 10 right this week"), gives one line of what to practise, and has a **Practise →** button. A kind with 10 answers or more this week and 85% right is not a weak spot, even with a few misses. The button opens the game set to just that kind for this visit: Times Tables Sprint with only the 7s, What Time Is It? at five-minute steps, Plus and Minus on taking away with regrouping. The child's saved level does not change. When this week has fewer than three, last week fills in. A game with 20 answers or more and 90% right over two weeks gets a **Ready for more** row that names the next level ("Try the next level: Every minute") and a **Level up →** button, which opens the game with its Settings showing. A game already on its top level is not offered.
- **Game by game.** For each game played this week or last week: the level the child is on, in the game's own words ("Level 3 of 5 · Every 5 min"), with "▲ went up this week" or "▼ a bit easier this week" when it moved since the page last looked; how many answers were right (✓) and wrong (✗), with a bar, "▲ Better than last week" or "▼ Harder than last week" when both weeks have 5 answers or more and the percent moved by 5 or more, and one tip. Today's 10 has its own card. Games not played in two weeks fold into one line.
- **Answers to practise.** Every wrong answer from the last 30 days, grouped by kind, the kind missed most this week first. Each group says how this week went, "7 of 10 right" with a green bar (or "9 this week" for days before the counts started), and "10 in 30 days"; it opens on tap, newest first, with the right answer, the answer given, the game and the day. The first group starts open. 5 show at a time; tap **Show 5 more** for the rest.

- **Share this week** and **Print.** Print next to Share this week opens the card and prints it in the same tap. Share this week, a button in the week card, opens a one-screen card: the child's picture and name, the week's dates, four numbers (answers, percent right, days played, stars and streak), two lines "Going well" and three lines "To practise". **Share picture** draws the card as a picture in the browser and opens the phone's share sheet. On a browser that cannot share pictures the button says **Save picture** and saves the PNG. **Print** prints the card, black on white. In loopy opened from the home screen icon on iPhone or iPad, which has no print menu, Print opens the share menu with a black-on-white picture of the card; pick **Print** there. The card has the loopy logo top right, on screen, in the picture and on paper. The card stays the thing to print until you tap the page again, because Safari on iPhone and iPad says printing is over before it has drawn the page. Nothing leaves the device unless you share it.
- **Print a practice sheet.** Under Practise next. It prints one worksheet with 20 problems from the three weak spots, 7 + 7 + 6 (or 10 + 10, or 20), with answers on the last page, in the same style as a game's worksheet. The boxes are in 3 columns, wider than on a game's own sheet, so no kind of problem is cut off; when the kinds need the room (clocks, box grids, drawings), the problems run on to a second page. The problems come from the games themselves: each game is opened in a hidden frame with its practise hint, and its own worksheet maker gives the problems. A times table comes from Times Tables Sprint, the game that can pick one table. Phones may ignore a print that comes seconds after the tap, so when making the sheet takes longer than 4 seconds the button turns into **Print the sheet** for a second tap.

## Kinds of question it knows

| Game | Kinds |
| --- | --- |
| Plus and Minus | Adding, adding with carrying, taking away, taking away with regrouping |
| Times and Share, Times Tables Sprint | A times table (for example the 7 times table), sharing by a number, times or sharing with bigger numbers |
| Make 10 | Pairs that make 10, pairs that make 20, pairs that make 100 |
| What Time Is It? | O'clock, half past, quarter past and quarter to, minutes in fives, single minutes |
| Bigger or Smaller | Comparing numbers, putting numbers in order, rounding, comparing decimals, minus numbers |
| Pizza Fractions | Naming, comparing and adding fractions |
| Coins and Change | Adding small coins, counting notes and coins, giving change, change with any price |
| Equation Balance | Missing numbers, x + a = b, 3x = 12, 3x + 4 = 19, x on both sides |
| Sound Spell | The sound at the start of a word, the sound at the end of a word |
| Word Match | Words for animals, food, things at home, school |
| Spell It | 3, 4, 5 and longer words |
| Quick Facts | Space, animals, the body |
| Where Is It? | Continents and oceans, countries of Europe, capitals of Europe, countries of the world, capitals of the world |
| Flags and Capitals | Flags, capitals |
| Today's 10 | Any of the sums and clock kinds above; the Practise button opens the game that owns the kind |

## How the Practise button works

The button opens the game as `…/math/times-sprint/#practise=mul-7`. `loopy.js` reads the hint once (`Loopy.log.hint`) and takes it off the address, so a reload starts the game as normal. Each game checks the hint when it loads its settings and sets the matching switch in memory only. `#practise=harder` opens the game with the Settings panel open.

## How the weekly picture and the practice sheet work

- The picture uses `Loopy.report.snap(node, w, h)` in `loopy-report.js`, the same code that draws the Report a problem picture: the card is copied with the page's styles and fonts into an SVG, drawn on a canvas and turned into a PNG. `loopy-report.js` loads when Share this week is tapped.
- The sheet uses `Loopy.worksheet({ quiet: true, layout: "mixed", ... })`: `quiet` means no Print worksheet button in Settings, and the `mixed` layout is a 3-column grid whose rows grow with their content (`print.css`), so nothing is cut off. Each collected cell carries `data-layout` with its game's layout (`vert`, `line`, `clock`, `word`), which `loopy-sheet.js` puts on the box as a class, so the layout's styles apply. The game's own print rules (the look of a drawing, a table, a flag) are read from the hidden frame and added to `print.css` with `insertRule`, which the security policy allows where a copied `<style>` tag would be blocked. `make()` returns the problems collected from the games.

## Your data

- The answers are saved only in this browser on this device. Nothing is sent anywhere.
- Answers older than 30 days are deleted by themselves.
- They are in the stars code, so moving stars to another device moves them too.
- **Clear answers** deletes them. Tap it twice, so one stray tap does nothing. Stars and badges stay.

## Settings

The color theme, the reading font and the language (EN or DE) are behind the ⚙ Settings button at the top of the page, like in the games.

## Example

> **This week, Monday to today**
> 133 answers · 80% right
> ▲ up from 72% last week · Played 4 of 5 days
>
> **Practise next**
> 7 times table. Missed 9 times this week in Times and Share and Times Tables Sprint. Practise the 7 times table. [Practise →]

The level line comes from `loopy-levels.js`, the shared list of every game's levels, which this page loads first (`Loopy.load("levels")`). To say that a level moved, the page keeps one small per-child key, `loopy.levels`: for each game the level it last saw, the level before, and the day it changed. The stars code carries it. Nothing in a game's own settings changes.
