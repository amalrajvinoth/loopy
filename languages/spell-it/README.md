# Spell It

A spelling game. The browser reads a word out loud and shows its picture. The child spells it on a letter pad. It is the next step after Sound Spell: from single sounds to whole words. The words can be English or German.

## How to play

1. Listen to the word. Tap **Hear the word** to hear it again. The picture helps too.
2. Tap the letters to spell it. There is one box for each letter. **Erase** takes back the last letter.
3. Tap **Check** when every box has a letter.
4. Right: the boxes turn green and you earn a star.
5. Wrong: the wrong letters turn red. The right spelling then appears under your try, one letter at a time, and the word is read out loud again.
6. Tap **Next** to go on.

The pad has every letter the word needs, once, plus a few extra letters. For a double letter, like the "l" in "ball", tap the same key twice.

## Age levels

| Age | Words |
| --- | --- |
| 6 and under | 3 letters, like "cat" or "Hut", 8 keys on the pad |
| 7 | 4 letters, like "fish" or "Hund", 8 keys |
| 8 | 5 letters, like "horse" or "Katze", 10 keys |
| 9 | 6 letters, like "rabbit" or "Banane", 10 keys |
| 10 and up | 7 to 8 letters, like "giraffe" or "Elefant", 10 keys |

The level shows next to the score, like "Level 2 of 5". After 10 right in a row, or 18 of the last 20 right, the game goes up a level by itself. It says so, with a **Back a step** button. After 3 wrong in the last 5 it offers an easier one, once a visit. A level picked by hand in Settings is kept for that age. When the age goes up, a level the child reached is kept, never lost. The levels: 3, 4, 5, 6 and 7 to 8 letters.

## Words

122 English and 106 German words, all with pictures: animals, food, things at home, numbers and more.

German words are nouns, so they start with a capital letter. The child does not need to type the capital: the first box shows it by itself. German words can have ä, ö, ü and ß; those keys only show up when the word needs them.

## Last 5

At the top, **Last 5** shows your last 5 answers as dots: green for right, red for wrong. The newest one is on the right.
They stay there next time you play. **Reset score** in Settings clears them.

## Settings

Open them with the gear button.

- **Words in.** English or German. The game starts with the site language. Switch it to practise spelling in the other language.
- **Word length.** 3 letters, 4 letters, 5 letters, or 6 to 8. Remembered for each age.
- **Read each new word out loud.** On by default. Turn it off to spell from the picture only. The speaker button still works, and a wrong answer is always read out.
- Age, colors, sound effects and the display language (EN/DE) are shared with the other games.
- **Print worksheet.** See below.
- The keyboard works too: type the letters, Backspace erases, Enter checks and goes on.

## Print a worksheet

Tap **Settings**, then **Print worksheet**. The print window opens. Print it, or save it as a PDF.

- Page 1 has 20 pictures. Under each one is a line to write the word, and under that its letters mixed up, as a help.
- The word language and word length are the same as in the game.
- Page 2 has the answers, for example "🐱 cat".

## Example help text

- "Listen, then spell the word." / "Hör zu und schreibe das Wort."
- "Not quite. It is spelled c‑a‑t." / "Nicht ganz. Man schreibt es so: K‑a‑t‑z‑e."
- "Correct! You spelled “fish”." / "Richtig! Du hast „Fisch“ geschrieben."

## About the voice

Reading out loud uses the voice built into the browser or device, in the language of the words. Nothing is downloaded and nothing is sent anywhere. If the device has no voice for that language, the speaker button is hidden and the game asks the child to spell the word from the picture.

## For grown-ups

- The pictures are emoji, so nothing is loaded from other websites. They look a little different on each device.
- To add words, edit the `WORDS` list in `words.js`, next to the game page, then run `python3 tools/build.py`: picture, then the word. The game sorts words by length by itself. Keep words to 8 letters or fewer.
- The progress page groups missed words by length, like "Practise spelling 4-letter words: say each sound slowly."
- Spell It is not part of Today's 10, because Today's 10 uses answers to pick from.
