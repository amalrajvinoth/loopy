# My Words

A spelling test to play: loopy reads a word out loud, and the child types it. A grown-up types in the week's spelling words from school, or imports a CSV file, with an example sentence for each word if they like. The words can be English or German.

## How to play

1. Listen to the word. Tap **Hear the word** to hear it again. With a sentence on the list, loopy reads that too, and the card shows it with a gap: "My ___ is kind."
2. Type the word with the letter tiles or the keyboard. At levels 1 to 3 there is one box for each letter.
3. **⌫** takes back the last letter.
4. Tap **Check**. Right: the boxes turn green and you earn a star.
5. Wrong: the wrong letters turn red. The right spelling appears under your try, one letter at a time. The line shows it with the tricky part underlined, like "fr<u>ie</u>nd". loopy reads the word once more.
6. Tap **Next** to go on.

## Your word list (for grown-ups)

Open **Settings** and find **Your word list**.

1. Type the words, one per line, or tap **Import a CSV file** and pick a `.csv` or `.txt` file from your device.
2. Tap **Save list**. The card now says "Your list · 12 words".
3. **Clear list** goes back to loopy's own words.

The file or the box can look like this:

```
word,sentence
friend,My friend is kind.
because,I ran because I was late.
said
```

- One word per line. A sentence can follow the word on the same line, after a comma, a semicolon or a tab. It is read aloud with the word and shown with a gap. Up to 50 letters per sentence.
- Words with commas between them on one line, like `friend, because, said`, work too (the Spelling Quiz way).
- A first line like `word,sentence` or `Wort;Satz` is a heading and skipped. Quotes around a part are fine. A file saved from Excel or Numbers works.
- Up to 50 words. Each word is 2 to 20 letters. A word can have a ' or a - in it, or one space. "don't", "ice-cream" and "ice cream" work.
- Anything that is not a word (numbers, @ and so on) is left out, and the game says what it left out.
- Each child has their own list. There is one list for English and one for German: switch **Words in** to fill the other one.
- Every word comes once before any word comes back (up to 10).
- The list stays in this browser. It moves to another device with the stars code. The file is read on your device and never uploaded.

Without a list, loopy plays its own spelling words for the age. They are the same words as in Spelling Quiz (grade 1 words at age 6 and under, up to grade 6 words and up at 11), read from `languages/spelling-quiz/words.js`.

## Age levels

The level sets how much help the child gets. It does not change the words.

| Age | Level | Help |
| --- | --- | --- |
| 6 and under | 1 | Letter tiles: the word's letters plus a few extra, 8 or 10 keys. The first letter shows faintly in its box |
| 7 | 2 | Letter tiles, no first letter |
| 8 and 9 | 3 | A whole keyboard, one box per letter |
| 10 and up | 4 | A whole keyboard, no boxes: the number of letters is a secret |

The level shows next to the score, like "Level 3 of 4". After 10 right in a row, or 18 of the last 20 right, the game goes up a level by itself. It says so, with a **Back a step** button. After 3 wrong in the last 5 it offers an easier one, once a visit. A level picked by hand in Settings is kept for that age. When the age goes up, a level the child reached is kept, never lost.

The keyboard is QWERTY for English and QWERTZ with ä, ö and ü for German. A letter the word needs that is not on it, like ß, é or an apostrophe, joins the last row. A word with a space gets a space key.

## Reading aloud

The word is read with the device's own voice, in the language of the words. Nothing is downloaded. **Read aloud** in Settings is on at the start, so each new word is read by itself. Turn it off and the child taps **Hear the word** instead. After a miss the word is always read again.

If the device has no voice for that language, the button hides and the card says so: a grown-up reads the word out, and the child types it.

## Last 5

At the top, **Last 5** shows your last 5 answers as dots: green for right, red for wrong. The newest one is on the right.
They stay there next time you play. **Reset score** in Settings clears them.

## Settings

Open them with the gear button.

- **Words in.** English or German. The game starts with the site language.
- **Your word list.** See above.
- **Level.** Letter tiles with the first letter, letter tiles, a keyboard, or a keyboard with no boxes. Remembered for each age.
- **Read aloud.** The speaker pill next to the sound button. On at the start.
- Age, colors, sound effects and the display language (EN/DE) are shared with the other games.
- **Print worksheet.** See below.
- The keyboard works too: type the letters, Backspace erases, Enter checks.

## Print a worksheet

Tap **Settings**, then **Print worksheet**. The print window opens. Print it, or save it as a PDF.

- Page 1 has 20 numbered lines to write on, like a spelling test. Under a line, the word's sentence shows with a gap.
- Page 2 has the words, for the grown-up to read out, and as the answers.
- With a list, every word of the list comes once before any comes again.

## Example help text

- "Listen, then type the word." / "Hör zu und tippe das Wort."
- "Not quite. It is spelled friend." (with "ie" underlined) / "Nicht ganz. Richtig geschrieben: Freund."
- "Correct! You spelled “because”." / "Richtig! Du hast „Straße“ geschrieben."

## For grown-ups

- The grown-ups page shows each missed word with what the child typed, under "Typing words from your list" or "Typing spelling words". Try again brings missed words back.
- The list is saved as `mw.listEn` or `mw.listDe` for the child, as pairs of word and sentence. A list with many long sentences is shortened so it fits in the stars code. The game says so when it saves.
- My Words is not part of Today's 10, because each child can have their own words.
