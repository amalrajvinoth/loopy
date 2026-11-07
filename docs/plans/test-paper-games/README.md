# Plan: games from the grade 3 maths test

Written 6 November 2026. Nothing is built yet. Pick numbers, or say "use recommended" for the ⭐ set.

The three photos show "Klassenarbeit Nr. 4: Rückblick 2. Klasse" (grade 3, a look back at grade 2). The pictures in this folder are mock-ups drawn on today's site at phone size (390 × 844), Black theme. `options.png` shows all six side by side. The script that made them is in `src/mock.mjs`.

| Picture | Shows |
| --- | --- |
| `options.png` | All six options on one sheet |
| `1-tens-ones.png`, `1b-giants-dwarfs.png`, `1c-tens-ones-draw-de.png` | Tens and Ones: read the lines and dots, giants and dwarfs, draw the number (German) |
| `2-step-to-the-ten.png` | Step by Step with the new way "To the ten" |
| `3-which-way.png` | Which Way?: pick a way for 23 + 29, then the reason |
| `4-times-grid.png`, `4b-times-split.png` | Times Table Grid: the missing factor, and split a hard times sum into easy ones |
| `5-is-it-enough.png`, `5b-count-big-money.png` | Is It Enough?: a shop question, and counting notes and coins up to 100 |
| `6-class-test.png` | Class Test: 12 tasks in the order of the paper, with points |

## What the test paper shows

| Task on the paper | Skill | Points | What happened |
| --- | --- | --- | --- |
| 1 Lines and dots, Z/E table | Place value: a line is a ten, a dot is a one | 2 of 4 | Reading the pictures went wrong, drawing 55 and 42 was right |
| 2 Verliebt in den Zehner (57 + 6) | Add to the next ten first, then the rest | 0 of 2 | Left blank |
| 3 Stellenweise addieren (25 + 43) | Tens with tens, ones with ones | 2 of 2 | All right |
| 4 Riesen und Zwerge (68 − 5, 68 − 50) | Which digit changes: the ones or the tens | 0 of 2 | Left blank |
| 5 Aufgaben mit 10 helfen (35 − 9) | Take 10, give 1 back | 0 of 2 | Left blank |
| 6 Schrittweise subtrahieren (98 − 57) | Take the tens, then the ones | 0 of 2 | Left blank |
| 7 23 + 29: name your way and say why | Explain a calculation path in words | 0 of 3 | Left blank |
| 8 Wie viel? (notes and coins) | Count money up to 100 | 1 of 3 | 33 € wrong, 76 and 53 half right |
| 12 Reicht das Geld? | Add prices, compare with the money, explain | 0.5 of 3 | The sum was there, the reasoning was not |
| 13 Times table grid (Malkreuz) | Products, and the missing factor from a product | 0 of 6 | Factors guessed |
| 14 Löse erst die leichten Aufgaben | 3 · 4 from 1 · 4 + 2 · 4 | 8 of 8 | All right |
| Clock (top of page 1) | Reading the time | 6 of 7 | Nearly all right |

The whole of page 3 (tasks 5 to 7) is blank. Two of those three skills are already in Step by Step, so it looks like a mix of not knowing the school's names for the ways and running out of time, not only missing skills. Playing Step by Step with **Taking away** on, and the **Nearly round** way, covers tasks 5 and 6 today.

## What loopy covers today

| Skill | Game today | Covered? |
| --- | --- | --- |
| Reading the clock | What Time Is It? | Yes |
| Place by place adding (task 3) | Step by Step, way "Place by place" | Yes |
| Step subtraction 98 − 57 (task 6) | Step by Step, "Tens first", Taking away, level 3 | Yes |
| Help with 10: 35 − 9 = 35 − 10 + 1 (task 5) | Step by Step, way "Nearly round" | Yes, but the way has to be picked in Settings and the second number is not always near a ten |
| Add to the next ten: 57 + 6 (task 2) | Step by Step level 1 does it only up to 20 (8 + 7) | **No** for two-digit numbers |
| Giants and dwarfs: 68 − 5 vs 68 − 50 (task 4) | nothing | **No** |
| Lines and dots, Z/E table (task 1) | nothing (Make 10 has a ten-frame, which is a different picture) | **No** |
| Explain the way in words (task 7) | nothing | **No** |
| Count notes and coins up to 100 (task 8) | Coins and Change "Count it all" stops at 5 € notes and small totals | **Partly**: the 20 € and 50 € notes and totals like 76 € are missing |
| Is the money enough? (task 12) | nothing | **No** |
| Times table grid with missing factors (task 13) | Times Tables Sprint has the facts; Box Multiplication is a different grid (area method) | **No** |
| Easy tasks first: 7 · 4 = 5 · 4 + 2 · 4 (task 14) | nothing, but the child got full marks | No, low priority |

Rules for every option, same as always: English and German, one screen with no scrolling on phones and tablets both ways, levels by age through `Loopy.levels`, stars and streaks through `Loopy.rewards`, read aloud, a worksheet with the loopy logo, Try again support, a README and guide page in both languages, no outside requests, nothing a child has saved is ever touched. A new game is its own folder and one line in the shared lists. Option 2 is the one that changes an existing game, and it says so.

Work size means one pull request from one thread: **small** is under half a day, **medium** about a day.

## The options

### 1. Tens and Ones (German: Zehner und Einer)

Pictures 1, 1b and 1c. Math, ages 6 to 9. The school's own picture: a line is a ten, a dot is a one. Three kinds of task. **Read the picture:** lines and dots are drawn in the page, fill the T and O boxes and the number. **Draw the number:** the number is given, tap "— ten" and "• one" to draw it, then fill the table. **Giants and dwarfs** (task 4): 68 − 5 and 68 − 50 one after the other, with the question "which digit changes?", then 37 + 4 and 37 + 40. The feedback shows the picture with the dwarf taking away dots and the giant taking away lines.
Levels: read up to 20; read up to 100; draw it; giants and dwarfs; hundreds, tens and ones (a square is a hundred) at age 9.
Answers: number pad for the boxes, two big buttons for drawing.
Data: none, generated. Size: small to medium. Page about 70 KB.
Why: this is the base of everything else on the paper. Tasks 1 and 4 cost 4 points.

### 2. Step by Step: two new ways (German: Verliebt in den Zehner, Aufgaben mit 10 helfen)

Picture 2. This one changes an existing game. Step by Step gets the way **To the ten** for two-digit sums: 57 + 6 is 57 + 3 = 60, then 60 + 3 = 63. The number line shows the two jumps, like today. For taking away, 63 − 6 is 63 − 3 = 60, then 60 − 3 = 57. The way **Nearly round** gets a twin for subtraction named **Help with 10**, which always picks a second number of 8, 9, 11 or 12, so 35 − 9 = 35 − 10 + 1 comes every time. The hint line and the guide name the ways the way German school books do, in both languages.
Levels: no new levels. The two ways join the "Way" setting at levels 2 and 3 and are picked for ages 7 and 8 when the sum fits.
Data: none. Size: small. loopy.js does not grow; the Step by Step page grows by about 3 KB.
Why: tasks 2 and 5 cost 4 points, and the game that teaches this already exists. Only the way is missing.

### 3. Which Way? (German: Welcher Weg?)

Picture 3. Math, ages 7 to 10. A sum like 23 + 29 and three cards: Tens first, Nearly round, Place by place, each with its steps written out. Step one: pick the way you like (every pick is right). Step two: pick the reason that fits the way, from three sentences: "Because 29 is nearly 30, so I only take 1 away." Step three, at higher levels: fill in the steps of the way you picked. Read aloud says the whole explanation, so the child hears how to say it.
Levels: pick a way; pick the reason; pick the best way for a sum that has a clearly best way (47 + 29 is made for Nearly round); fill the steps too.
Answers: three cards, then three sentences, then the number pad.
Data: about 40 reason sentences per language. Size: medium. Page about 70 KB.
Why: task 7 was 3 points and loopy has nothing that asks a child to explain. It is also the one task that needs words, which an 8-year-old in a German school finds hardest.

### 4. Times Table Grid (German: Mal-Tabelle)

Pictures 4 and 4b. Math, ages 7 to 11. The grid from task 13: a dot in the corner, factors on the top and the side, products inside. Some cells are missing: fill the product, or find the missing factor from a product (21 in the 7 row, so the side number is 3). That is division without saying so. A second kind of task, **Split it** (task 14): 7 · 4 = 5 · 4 + 2 · 4, fill the two easy ones, then the sum.
Levels: 2 × 2 grid, products only, tables of 2, 5 and 10; 2 × 2 with one missing factor; 3 × 3 with missing factors, all tables to 10; split it; 3 × 3 with tables to 12 and two missing factors.
Answers: number pad. The cell being asked is marked, a line under the grid says the question in words.
Data: none, generated. Size: small to medium. Page about 65 KB.
Why: task 13 was the biggest loss on the paper, 6 points. Times Tables Sprint drills the facts; this teaches the grid and the missing factor.

### 5. Is It Enough? (German: Reicht das Geld?)

Pictures 5 and 5b. Math and everyday life, ages 7 to 10. A small shop with emoji items and price tags, and a purse of notes and coins. Two kinds of task. **Count big money** (task 8): 50 €, 20 €, 10 €, 5 € notes and 2 €, 1 € coins, drawn like in Coins and Change, totals up to 100 €, no cents. **Enough?** (task 12): "Samu wants the helmet and the pads. Is the money enough?" Yes or No, then "How much is left?" or "How much is missing?" The feedback shows the sum in words: "20 + 25 = 45. Samu has 50. 50 − 45 = 5 left."
Levels: count notes only; count notes and coins; enough for one thing; enough for two things with the leftover; three things, and the question "What can he still buy?".
Answers: Yes and No buttons, then the number pad.
Data: about 40 shop items with emoji and prices in both languages. Size: medium. Page about 75 KB.
Why: tasks 8 and 12 cost 4.5 points. Coins and Change stops at small money and never asks a word problem. The counting part could also go into Coins and Change as a new level "Big money" if you prefer one money game; say so and option 5 shrinks to "Enough?" only.

### 6. Class Test (German: Klassenarbeit)

Picture 6. A mix like Today's 10, but with the tasks of this paper in the paper's order: 12 tasks drawn from options 1 to 5 plus Step by Step, Coins and Change and What Time Is It, with points like the real test (20 in all). The strip at the top shows right, wrong and where you are. At the end: "15 of 20", and the tasks that went wrong are offered in Try again. A **Print the test** button makes the paper version with the loopy logo, so the child can do it with a pencil the way it is at school.
Levels: none. It takes each game's level for the child's age.
Data: none. Size: small, but it needs options 1, 4 and 5 built first to have all the tasks.
Why: it turns the paper into something to practise end to end, with a score the child can compare with the real one.

## Recommendation ⭐

Options 4, 1, 2 and 5, as four pull requests in that order:

1. **Times Table Grid** (4). The biggest loss on the paper, and nothing on loopy does it.
2. **Tens and Ones** (1). The base for tasks 1, 2, 4 and 5, and the youngest game of the set.
3. **Step by Step: two new ways** (2). Half a day, and it closes tasks 2 and 5 inside the game that is already there.
4. **Is It Enough?** (5). Money with word problems, 4.5 points on the paper.

Which Way? (3) and Class Test (6) are the round after. Which Way? is worth it, but it needs careful sentences in two languages. Class Test only makes sense once the other games exist.

Games go one after the other, because each one touches the same lists (home page, Loopy.GAMES, stars code, progress page, offline list, Help, FAQ, guide) and parallel game pull requests conflict. Each PR brings the README, guide page EN + DE, FAQ, Help, RELEASES.md row, the play test, the loopy-review and improve-ui checks, the worksheet rendered to PDF, and before and after screenshots.

On "Go" or "use recommended" I open one issue per option on roadmap #21 and start with Times Table Grid.

## Things to know

- Nothing is reset or lost. Each game only adds its own per-child keys through Loopy.store and its id to the stars code list, the way every game since Word Detective did. Option 2 adds two values to Step by Step's existing "Way" setting; a saved way stays valid.
- Everything stays free, in the browser. No new server, no new outside request. Drawings are SVG in the page.
- Each new game adds about 20 to 30 KB to the offline copy. loopy.js grows by nothing except the game id.
- None of the new games goes into Today's 10 at first, same as the last nine games. Class Test (6) is its own mix.
- The paper's German names (Verliebt in den Zehner, Riesen und Zwerge, Aufgaben mit 10 helfen, Malkreuz) go into the German text and the guide, so the child meets the same words at school and on loopy.
