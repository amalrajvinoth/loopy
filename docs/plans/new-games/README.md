# Plan: new games for loopy

Written 5 November 2026. Nothing is built yet. Pick numbers, or say "use recommended" for the ⭐ set.

The pictures in this folder are mock-ups drawn on today's site at phone size (390 × 844), Black theme. `options.png` shows all eight side by side. The script that made them is in `src/mock.mjs`.

| Picture | Shows |
| --- | --- |
| `options.png` | All eight options on one sheet |
| `1-measure-it.png` | Measure It, a pencil on a ruler |
| `2-number-lab.png`, `2b-number-lab-order.png` | Number Lab, primes and then order of operations with the number pad |
| `3-calendar-dates.png` | Calendar and Dates, a month grid |
| `4-number-patterns.png` | Number Patterns, what comes next |
| `5-life-cycles.png` | Life Cycles, stages in order |
| `6-compass-map.png` | Compass and Map, a town map with a compass |
| `7-word-forms.png`, `7b-word-forms-de.png` | Word Forms, past tense in English and der, die, das in German |
| `8-read-answer.png` | Read and Answer, a short story and a question |

## Where loopy is today

26 games (Today's 10 not counted). Everything on roadmap #21 is built and merged.

| Subject | Games today | Oldest age covered |
| --- | --- | --- |
| Math | 14 | 16 |
| Languages | 8 | 14 |
| Science | 2 (Quick Facts, Sort It) | 12 |
| Geography | 2 (Where Is It?, Flags and Capitals) | 16 |

Games that fit each age, counted from the home page tiles:

| Age | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Today | 6 | 17 | 23 | 24 | 23 | 25 | 23 | 21 | 11 | 11 | 6 | 6 |
| With the ⭐ set | 6 | 19 | 26 | 27 | 27 | 29 | 27 | 25 | 13 | 12 | 7 | 6 |
| With all eight | 6 | 21 | 30 | 31 | 31 | 33 | 31 | 28 | 16 | 14 | 7 | 6 |

The thin spots: science and geography have two games each, and ages 13 and up have about half as many games as ages 7 to 12.

Rules for every option, same as always: English and German, one screen with no scrolling on phones and tablets both ways, levels by age through `Loopy.levels`, stars and streaks through `Loopy.rewards`, read aloud, a worksheet with the loopy logo, Try again support, a README and guide page in both languages, no outside requests, nothing a child has saved is ever touched. Each game is its own folder and one line in the shared lists. Existing games and the layout stay as they are.

Work size means one pull request from one thread: **small** is under half a day, **medium** about a day, **large** more than a day. Most of the time in the medium ones goes into the word and picture data, in two languages.

## The options

### 1. Measure It (German: Messen)

Picture 1. Math and science, ages 7 to 13. A ruler, a kitchen scale, a measuring jug or a thermometer is drawn in the page (SVG, no pictures to download). Read it: "How long is the pencil?", "How much water is in the jug?", "How warm is it?". Then unit changes: 150 cm = ? m, 2 kg 300 g = ? g, 90 minutes = ? hours. Which is longer, heavier, warmer.
Levels: whole centimetres and litres; halves and quarters; mixed units; converting cm, m, g, kg, ml, l; minutes and hours with negatives on the thermometer.
Answers: four choices on the reading levels, number pad on the converting levels.
Data: none, every problem is generated. Size: medium (the four drawings take the time). Page about 80 KB.
Offered twice before and not picked. Still the best fit for grades 2 to 5 maths after the games that exist.

### 2. Number Lab (German: Zahlenlabor)

Pictures 2 and 2b. Math, ages 9 to 15. Four topics, each one its own chip in Settings and mixed in "All": primes and factors ("Which one is a prime?", "Is 72 divisible by 6?", "The factors of 18 are …"), powers and roots (3², 2⁵, √81), order of operations (4 + 3 × 5, (8 − 2) × 3, "times first, then plus"), negative numbers (−3 + 7, 5 − 9, (−2) × 4, a thermometer picture at the first level).
Levels: one topic at level 1 up to all four mixed with brackets, powers and negatives together at level 5.
Answers: four choices for yes/no and "which one" questions, number pad with a minus key for the rest.
Data: none, generated. Size: medium. Page about 75 KB.
Why: this is the one option that fills the gap for ages 13 to 15, and these four topics are what grades 5 to 8 meet every week.

### 3. Calendar and Dates (German: Kalender und Daten)

Picture 3. Math and everyday life, ages 6 to 11. A month grid is drawn in the page with today marked. Days of the week in order, "What day comes after Thursday?", "What day is it in 9 days?", "How many days until the 20th?", months and seasons, "How many days has April?", reading a date like 12.3. in German and 3/12 in English (a good thing to learn in two languages).
Levels: days of the week; the month grid; counting days and weeks; months, seasons and dates.
Answers: four choices, number pad for counts.
Data: none, generated from the real calendar. Size: small to medium. Page about 70 KB.
Why: a natural partner for What Time Is It?, and nothing on loopy covers dates yet.

### 4. Number Patterns (German: Zahlenmuster)

Picture 4. Math, ages 6 to 14. "What comes next?": 3, 6, 9, 12, ?. Count on in steps of 2, 5, 10, backwards, doubling, square numbers, growing steps (1, 2, 4, 7, 11), and at the top levels a missing number in the middle and two mixed rules.
Levels: steps of 1, 2 and 10; any step, also backwards; doubling and squares; growing steps; two rules mixed.
Answers: number pad. A hint shows the jump between two boxes after a miss.
Data: none, generated. Size: small. Page about 65 KB.
Why: patterns are in every grade 1 to 4 maths book and a cheap game to build. Bigger or Smaller and Step by Step do not cover it.

### 5. Life Cycles (German: Kreisläufe)

Picture 5. Science, ages 6 to 12. Put the stages in order by tapping the tiles: egg, caterpillar, chrysalis, butterfly. Frog, chicken, plant from seed, water cycle, day and night, the seasons, a food chain (grass, rabbit, fox), how bread is made, from cow to milk. Each chain has a one-line "why" that is read aloud when it is right.
Levels: 3 stages with pictures; 4 stages; 5 stages with words only; two chains mixed up together.
Answers: tiles into slots, like Sentence Builder. A wrong tile shakes and goes back.
Data: about 60 chains with emoji, in both languages, in a `data.js` next to the page. Size: medium. Page about 80 KB.
Why: science gets its third game, and it teaches order and cause, which Sort It (groups) and Quick Facts (facts) do not.

### 6. Compass and Map (German: Kompass und Karte)

Picture 6. Geography, ages 7 to 12. A small town map drawn in the page (4 × 4 grid, emoji buildings, a compass rose). "The school is ___ of the house." "Which square is the tree in?" (B2). "Go two squares east from the hospital. Where are you?" "The map says 1 cm = 100 m. How far is it from the house to the shop?"
Levels: north, south, east, west; grid squares like B3; two steps in a row and north-east; a simple scale.
Answers: four choices, or tap a square on the map.
Data: none, the map is generated from a list of 12 places with emoji. Size: medium. Page about 75 KB.
Why: geography gets its third game, and it is the first one that works for age 7 without knowing any country names. Offered twice before and not picked.

### 7. Word Forms (German: Wortformen)

Pictures 7 and 7b. Languages, ages 6 to 13. One word, change its form. English: plurals (one cat, two ___), past tense (Today I run. Yesterday I ___), comparatives (big, bigger, ___), opposites, a or an. German: der, die, das (the big one, with three big buttons), plurals (der Apfel, die ___), past tense (Heute laufe ich. Gestern ___ ich.), comparatives, opposites. The mistakes are real ones kids make ("runned", "goed", "Hauser").
Levels: opposites and plurals; a/an and der/die/das; past tense; comparatives; all mixed with the hard irregular ones.
Answers: four choices, or three for der, die, das. Read aloud says the full right sentence.
Data: about 300 words per language with the forms and one emoji, in a `words.js` next to the page. Size: medium. Page about 85 KB.
Why: every language game today is about spelling or meaning. None is about grammar forms, and der, die, das is the thing German primary school children practise most.

### 8. Read and Answer (German: Lesen und verstehen)

Picture 8. Languages, ages 7 to 14. A short text of 2 to 4 sentences and one question with three choices. "Where does the kite land?" "Why is Lina sad?" "Which title fits best?" At the top level the question needs a conclusion, not a word from the text. A Read it to me button reads the text aloud.
Levels: 2 sentences, the answer is in the text; 3 sentences; 4 sentences, why and how questions; a conclusion or a title.
Data: about 60 texts per language, each with 2 questions. Writing them well is most of the work. Size: medium to large. Page about 90 KB, close to the 100 KB budget.
Why: reading for meaning is the one language skill loopy does not have. Offered twice before and not picked.

## Offered before and still on the shelf

Say the name if you want one back.

- A second detective-style word game with clue cards and a suspect line-up (the two options not picked when Word Detective was planned).
- Odd one out: four pictures, one does not belong. Close to Sort It, so not listed above.
- Head start on Today's 10, certificate to print, grown-ups' lock, home subject chips (improvements, not games, from the last plan).

## Recommendation ⭐

Options 7, 5, 6 and 2, as four pull requests in that order:

1. **Word Forms** (7). Grammar is the biggest gap in the language games, and der, die, das is what an 8-year-old in a German school needs most.
2. **Life Cycles** (5). A third science game that teaches something new.
3. **Compass and Map** (6). A third geography game, and the first one for age 7.
4. **Number Lab** (2). Fills the gap for ages 13 to 15.

Measure It (1) and Calendar and Dates (3) are the first picks for the round after. Number Patterns (4) is the quickest to add any time. Read and Answer (8) is worth it, but needs a day of careful writing in two languages, so it is best as a round of its own.

Games go one after the other, because each one touches the same lists (home page, Loopy.GAMES, stars code, progress page, offline list, Help, FAQ, guide) and parallel game pull requests conflict. Each PR brings the README, guide page EN + DE, FAQ, Help, RELEASES.md row, the play test, the loopy-review and improve-ui checks, and before and after screenshots.

On "Go" or "use recommended" I open one issue per game on roadmap #21 and start with Word Forms.

## Things to know

- Nothing is reset or lost. Each game only adds its own per-child keys through Loopy.store and its id to the stars code list, the way every game since Word Detective did.
- Everything stays free, in the browser. No new server, no new outside request. Drawings are SVG in the page.
- Each new game adds about 20 to 30 KB to the offline copy. loopy.js grows by nothing except the game id.
- None of the eight goes into Today's 10 at first, same as the last five games. That can change later if you want.
