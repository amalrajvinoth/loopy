# Word Detective

A word detective game, like Wordle for kids. The child guesses a mystery word in six tries. Green and yellow tiles show which letters fit. Funny clues help when a word is hard. Every five words close a case file. The words can be English or German.

## How to play

1. Tap the letters to type a word with the right number of letters. Tap **Check**.
2. Look at the tiles. **Green** means the letter is in the right place. **Yellow** means the letter is in the word, but somewhere else. **Grey** means the letter is not in the word. The keyboard keys turn the same colours.
3. Try again with what you learned. You have six tries. Any letters count as a try, so you can try sounds.
4. Stuck? Tap **🔎 Clue**. The first clue shows a picture and what the word means. The second is a silly sentence with the word missing. The third is the first letter. At the two easiest levels the first clue is open from the start.
5. Found it? **Case closed!** The card shows the word, what it means and the silly sentence with the word in it. Tap **Hear the word** to hear it. You earn a star.
6. Not found in six tries? The card shows the word anyway. No star, and the word comes back later in Try again.
7. Tap **Next case** to go on. After five cases the case file closes: you see the five words with ✅ or ❌, the stars you earned and your rank. **New case file** starts the next five.

Ranks: **Super Sleuth** for all 5 solved in 3 tries or fewer, **Detective** for all 5 solved, **Rookie** for the rest. Ranks are for fun and are not saved.

## Age levels

| Level | Age | Words |
| --- | --- | --- |
| 1 | 6 and under | 3 letters, like "cat" or "Hut". The first clue is open from the start |
| 2 | 7 to 8 | 4 letters, like "frog" or "Hund". The first clue is open from the start |
| 3 | 9 to 10 | 5 letters, like "pizza" or "Katze". No clue until you ask |
| 4 | 11 to 12 | 5 harder letters, like "timid" or "Sturm" |
| 5 | 13 and up | 6 letters, like "giggle" or "Kobold" |

The level shows next to the score, like "Level 2 of 5". After 10 right in a row, or 18 of the last 20 right, the game goes up a level by itself. It says so, with a **Back a step** button. After 3 wrong in the last 5 it offers an easier one, once a visit. A level picked by hand in Settings is kept for that age. When the age goes up, a level the child reached is kept, never lost.

## Words

240 English and 240 German words, 48 at each level. Each word has a picture, a short meaning and a silly sentence. The German list is its own list with its own jokes, not a translation.

German words keep their capital letter in the clues and on the result card. In the grid all letters are capitals, so the child does not need to think about it. The German keyboard has ä, ö and ü.

## Last 5

At the top, **Last 5** shows your last 5 cases as dots: green for solved, red for not solved. The newest one is on the right.
They stay there next time you play. **Reset score** in Settings clears them.

## Settings

Open them with the gear button.

- **Words in.** English or German. The game starts with the site language. Switch it to learn words in the other language. The keyboard follows: QWERTY for English, QWERTZ with ä, ö and ü for German.
- **Level.** 3 letters, 4 letters, 5 letters, 5 tricky, or 6 letters. Remembered for each age.
- **Read aloud.** A speaker button on the card reads the open clues out loud, and the word with its sentence once the case is closed. It is on by itself for ages 7 and under.
- Age, colors, sound effects and the display language (EN/DE) are shared with the other games.
- **Print worksheet.** See below.
- The keyboard works too: type the letters, Backspace erases, Enter checks and goes on.

## Print a worksheet

Tap **Settings**, then **Print worksheet**. The print window opens. Print it, or save it as a PDF.

- Page 1 has 20 clues. Under each clue is a box for every letter of the word, so the child writes the word in.
- The word language and level are the same as in the game.
- Page 2 has the answers, for example "🍕 pizza".

## Example help text

- "Guess the 5-letter word in 6 tries." / "Rate das Wort mit 5 Buchstaben in 6 Versuchen."
- "Case closed. pizza. A round, flat food with cheese on top. Solved in 2 tries." / "Fall gelöst. Pizza. Rund und flach, mit Käse obendrauf. Gelöst in 2 Versuchen."
- "Not this time. The word was “giggle”." / "Diesmal nicht. Das Wort war „Kobold“."

## For grown-ups

- The pictures are emoji, so nothing is loaded from other websites. They look a little different on each device.
- To add words, edit the `WORDS` list in `words.js`, next to the game page. Each line: picture, word, meaning, then a silly sentence that contains the word. Run `python3 tools/build.py` after a change. Keep each level to one word length.
- The progress page groups missed words by length, like "Mystery words with 5 letters", with a tip for playing word detective together.
- Word Detective is not part of Today's 10, because one word takes several tries.
