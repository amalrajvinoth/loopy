# Graphs and Data

A game about reading charts and tables. The child sees a bar chart, a pictogram, a line chart or a small table, and answers a question about it: how many, which is the most, how many more, the total, the mean or the median. After each answer, one line shows the sum. In German the game is called "Diagramme und Daten".

The charts are drawn in the page from made-up numbers, so every question is new and nothing is downloaded. The topics are things children know: apples sold, pets in the class, goals scored, rainy days, books read and minutes of play.

## How to play

1. Look at the chart or table and read the question.
2. Tap the answer you think is right. The right one turns green.
3. One line shows how to get there, like "8 − 3 = 5." or "Mean: (9 + 13 + 10 + 20) ÷ 4 = 52 ÷ 4 = 13." After a wrong answer it says the right answer first.
4. Tap **Next** to go on. Every right answer earns a star.

The wrong answers are close to the right one on purpose: another bar's value, the total instead of the mean, or one more or one less. So the child has to read the chart, not guess.

## Age levels

| Age | Level | What changes |
| --- | --- | --- |
| 8 to 9 | Bar charts and pictograms | Read one value, find the most or the least, how many more. Numbers up to 9 (minutes in steps of 5). In a pictogram one picture stands for 1, 2 or 5. |
| 10 to 11 | Tables and line charts | Totals and differences from a table with 3 to 5 rows, and how much a line went up or down between two points. Numbers up to 20. |
| 12 | Mean and median | 3 to 5 numbers in a bar chart or a table. The mean is always a whole number. The median has 3 or 5 numbers, so the middle one is easy to find. |
| 13 and up | Two charts compared | Two bar charts side by side, or two rows in a table: which total or mean is bigger, how much bigger, or the mean of one of them. |

The level shows next to the score, like "Level 2 of 4". After 10 right in a row, or 18 of the last 20 right, the game goes up a level by itself. It says so, with a **Back a step** button. After 3 wrong in the last 5 it offers an easier one, once a visit. A level picked by hand in Settings is kept for that age. When the age goes up, a level the child reached is kept, never lost.

## The charts

- **Bar chart:** 3 to 5 bars with the number written above each one.
- **Pictogram:** rows of a picture, with a key like "🍎 = 2".
- **Line chart:** 4 to 6 points joined by a line, with the number at each point.
- **Table:** 2 columns and 3 to 5 rows, or 2 rows (A and B) at the top level.

Every chart has a text version for screen readers, like "Apples sold: Monday 8, Tuesday 5, Wednesday 3." Read aloud says the same.

## Last 5

At the top, **Last 5** shows your last 5 answers as dots: green for right, red for wrong. The newest one is on the right.
They stay there next time you play. **Reset score** in Settings clears them.

## Settings

Open them with the gear button.

- **Level.** Bar charts and pictograms, Tables and line charts, Mean and median, or Two charts compared. The game picks one from the age. A changed level is remembered for that age.
- **Read aloud.** A speaker button on the card reads the data, the question and the answers out loud. It is on by itself for ages 5 to 7.
- Age, colors, sound effects and language (EN/DE) are shared with the other games.
- **Print worksheet.** See below.

## Print a worksheet

Tap **Settings**, then **Print worksheet**. The print window opens. Print it, or save it as a PDF.

- Page 1 has 20 questions at the same level as the game. Each box has its own small chart or table in black and white, the question, and a line to write the answer on.
- Page 2 has the answers, for example "13" or "Thursday".

## Example help text

- "How many more on Monday than on Wednesday?" / "Wie viel mehr am Montag als am Mittwoch?"
- "Correct! 8 − 3 = 5." / "Richtig! 8 − 3 = 5."
- "Not quite. The answer is: 13. Mean: (9 + 13 + 10 + 20) ÷ 4 = 52 ÷ 4 = 13." / "Nicht ganz. Die Antwort ist: 13. Mittelwert: (9 + 13 + 10 + 20) ÷ 4 = 52 ÷ 4 = 13."
- "In order: 2, 5, 8. The middle one is 5." / "Der Reihe nach: 2, 5, 8. Die Mitte ist 5."

## For grown-ups

- The numbers are made up fresh for every question. Each level sets the range, and the mean questions only use numbers that divide evenly.
- The progress page groups missed questions by kind: reading a chart, totals, differences, the mean, the median, and comparing two charts. Its practice sheet can print 20 problems of one kind.
- To add a topic, edit the `TOPICS` list in `index.html` and add its words (`gdT…`, `gdU…`, `gdQ…`) in English and German.
