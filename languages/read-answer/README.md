# Read and Answer

Read a short text, then answer one question about it. Two to four sentences, three answers to pick from. First the answer is right there in the text. Later the questions ask why and how, and for a title or an ending that fits. In German the game is called "Lesen und Antworten" and plays with German texts.

[Play it](https://amalrajvinoth.github.io/loopy/languages/read-answer/)

## How to play

1. Read the text in the bubble. A small chip says what kind of question comes: "It says so in the text", "Why and how" or "Think about it".
2. Read the question under the text and tap the answer you think is right. The right one turns green.
3. Tap **Next** to go on. Every right answer earns a star. Don't know? **Skip** brings a new text.

On a keyboard, 1 to 3 picks an answer and **Enter** goes on.

## When an answer is wrong

The child has one try. The wrong answer turns red and the right one green. The line under the question says the right answer. On the first two levels it adds "Read the text once more and find the sentence that says so."

A missed question goes to **Try again** on the home page and comes back with the very same text and question.

## Age levels

| Age | Level | What comes |
| --- | --- | --- |
| 8 and under | Two sentences | The answer is in the text, word for word: "What colour is the cat?" |
| 9 to 10 | Three sentences | A little more to read, the answer is still in the text |
| 11 to 12 | Why and how | Four sentences. "Why did the fox stop coming?" The answer needs two sentences put together |
| 13 and up | A title or an ending | What the whole text is about: "Which title fits best?", "What does the story show?" |

The level shows next to the score, like "Level 2 of 4". After 10 right in a row, or 18 of the last 20 right, the game goes up a level by itself. It says so, with a **Back a step** button. After 3 wrong in the last 5 it offers an easier one, once a visit. A level picked by hand in Settings is kept for that age.

## The texts

60 texts per language in `data.js` next to the page, 15 per level, each with two questions. English and German have their own texts, not translations, so the names, places and jokes fit each language. Every question has one right answer and two wrong ones that could sound right if you did not read the text.

## Last 5

At the top, **Last 5** shows your last 5 answers as dots: green for right, red for wrong. The newest one is on the right.
They stay there next time you play. **Reset score** in Settings clears them.

## Settings

Open them with the gear button.

- **Level.** The four levels above. The game picks one from the age. A changed level is remembered for that age.
- **Read aloud.** A speaker button on the card reads the text, the question and the three answers. After the answer it reads the question and the right answer. It is on by itself for ages 5 to 7.
- Age, colors, sound effects and language (EN/DE) are shared with the other games.
- **Print worksheet.** See below.

## Print a worksheet

Tap **Settings**, then **Print worksheet**. The print window opens. Print it, or save it as a PDF.

- The sheet has up to 12 texts at the same level as the game, each with one question and three answers to circle. Each box grows with its text, so long texts run over two pages.
- The last page has the answers.

## On a small phone

The text bubble is the biggest thing on the card. On the smallest phones a four-sentence text can be a line longer than the bubble. Then the bubble scrolls, and a soft shadow at its bottom edge says there is more. After the answer the text folds to three lines, so the right answer always shows.

## Example help text

- "Correct!" / "Richtig!"
- "Not quite. The answer is: On the red chair. Read the text once more and find the sentence that says so." / "Nicht ganz. Die Antwort ist: Auf dem roten Stuhl. Lies den Text noch einmal und such den Satz, in dem es steht."
- "Not quite. The answer is: The balloons and the wind." / "Nicht ganz. Die Antwort ist: Die Ballons und der Wind."

## For grown-ups

- The grown-ups' page groups missed questions by kind: it says so in the text, why and how, a title or an ending, each with a tip.
- The texts are plain JavaScript. To add one, add a line to `data.js` with the level, a picture, the text and two questions, and run `python3 tools/build.py`.
