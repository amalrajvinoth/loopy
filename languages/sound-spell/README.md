# Sound Spell

A listening and spelling game. The child sees a picture and the word with one sound missing, and picks the sound that is missing. It works with English words and German words.

## How to play

1. Look at the picture. The word is written under it with a gap, like `_all` or `bal_`.
2. Tap **Hear the word** to have the browser read it out loud.
3. Tap the sound that fills the gap. The right one turns green and a short line explains why, like "Ball starts with B."
4. Tap **Next** to go on. Every right answer earns a star.

## Age levels

| Age | What changes |
| --- | --- |
| 5 to 6 | Starting sounds only, 3 choices, single letters |
| 7 to 8 | Starting and ending sounds mixed, 4 choices, two-letter sounds too (sh, ch, th; Sch, St, Ei, Au, Eu) |

The level shows next to the score, like "Level 2 of 3". After 10 right in a row, or 18 of the last 20 right, the game goes up a level by itself. It says so, with a **Back a step** button. After 3 wrong in the last 5 it offers an easier one, once a visit. A level picked by hand in Settings is kept for that age. When the age goes up, a level the child reached is kept, never lost. The levels: starting sounds with 3 choices, both sounds with 3 choices, both sounds with 4 choices.

## Last 5

At the top, **Last 5** shows your last 5 answers as dots: green for right, red for wrong. The newest one is on the right.
They stay there next time you play. **Reset score** in Settings clears them.

## Settings

Open them with the gear button.

- **Sounds.** Starting, Ending or Both.
- **Words in.** English or German. The game starts with the site language, and you can switch at any time.
- **Read each word out loud.** On by default. Turn it off for quiet play. The speaker button still works.
- Age, colors, sound effects and the display language (EN/DE) are shared with the other games.
- **Print worksheet.** See below.

## Print a worksheet

Tap **Settings**, then **Print worksheet**. The print window opens. Print it, or save it as a PDF.

- Page 1 has 20 pictures. Each word has a gap for the missing sound. The choices from the game are printed under it, so a child can write the sound or circle it.
- The sounds (Starting, Ending or Both), the word language and the number of choices are the same as in the game.
- Page 2 has the answers, for example "🐱 cat (c)".

## Example help text

- "Which sound does it start with?" / "Mit welchem Laut beginnt das Wort?"
- "Fish ends with sh." / "Fisch endet mit sch."

## About the voice

Reading out loud uses the voice built into the browser or device. Nothing is downloaded and nothing is sent anywhere. If the device has no voice for that language, the speaker button is hidden and the game still works with the picture and the written word.

## For grown-ups

- Wrong choices are real sounds from the same word list and never spell another word in the list.
- Letters that sound the same in that place (like c and k at the start of English words, or d and t at the end of German words) are never offered against each other.
- To add words, edit the `WORDS` list in `words.js`, next to the game page, then run `python3 tools/build.py`: picture, word, starting sound, ending sound, level. Leave the ending sound empty if the word should only be used for starting sounds.
