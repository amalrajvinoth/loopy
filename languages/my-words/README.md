# My Words

A spelling test to play: loopy reads a word out loud, and the child types it. A grown-up types in the week's spelling words from school, or imports a CSV file. Each word can have an example sentence and a meaning. The words can be English or German.

## How to play

1. Listen to the word. Tap **Hear the word** to hear it, as often as you like. The first time, a hint says so: "👆 Tap 🔊 to hear the word, then spell it!" With a sentence on the list, loopy reads that too, and the card shows it with a gap: "My ___ is kind." With a meaning on the list, it shows in small text under that: "the bee".
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
word,sentence,meaning
friend,My friend is kind.,Freund
because,I ran because I was late.
said
```

- One word per line. A sentence can follow the word on the same line, after a comma, a semicolon or a tab. It is read aloud with the word and shown with a gap. Up to 50 letters per sentence.
- A meaning can follow the sentence, in a third column. That is the German meaning of an English word, or the English meaning of a German one. It shows in small text under the sentence. Up to 30 letters, letters only. loopy never looks a word up anywhere: the meaning comes from your file.
- Without a heading, the last part of a line is the meaning when it is up to 3 words. It is also the meaning when the sentence before it ends with a full stop. A longer tail after a sentence with no full stop stays part of the sentence.
- A meaning can also stand in brackets after the word: `Biene (the bee), Die Biene fliegt zur Blume.` That is how the box in Settings shows it.
- Words with commas between them on one line, like `friend, because, said` or `Biene (the bee), Wiese (the meadow)`, work too (the Spelling Quiz way).
- A first line like `word,sentence`, `Wort;Satz;Bedeutung` or `word,meaning` is a heading and skipped. It also says which column holds what. With `word,meaning`, the second column is the meaning, not a sentence. Quotes around a part are fine. A file saved from Excel or Numbers works. Old files with only a word and a sentence work as before.
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

The keyboard is QWERTY for English and QWERTZ with ä, ö, ü and ß for German. A letter the word needs that is not on it, like é or an apostrophe, joins the last row. A word with a space gets a space key.

## Reading aloud

The word is read with the device's own voice, in the language of the words. Nothing is downloaded. **Read aloud** in Settings is on at the start, so each new word is read by itself. Turn it off and the child taps **Hear the word** instead. After a miss the word is always read again. After Check, loopy lets the right or wrong tone finish before it reads, so the voice is not mixed with the tone.

If the device has no voice for that language, the button hides and the card says so: a grown-up reads the word out, and the child types it.

## Last 5

At the top, **Last 5** shows your last 5 answers as dots: green for right, red for wrong. The newest one is on the right.
They stay there next time you play. **Reset score** in Settings clears them.

## Settings

Open them with the gear button.

- **Words in.** English or German. The words follow loopy's language. Pick the other one to practise it; the pick holds until loopy's language changes.
- **Your word list.** See above.
- **Level.** Letter tiles with the first letter, letter tiles, a keyboard, or a keyboard with no boxes. Remembered for each age.
- **Read aloud.** The speaker pill next to the sound button. On at the start.
- **Meaning under the word.** On or Off. On at the start. Shows the meaning from your list, when a word has one.
- Age, colors, sound effects and the display language (EN/DE) are shared with the other games.
- **Print worksheet.** See below.
- The keyboard works too: type the letters, Backspace erases, Enter checks.

## Print a worksheet

Tap **Settings**, then **Print worksheet**. The print window opens. Print it, or save it as a PDF.

- Page 1 has 20 numbered lines to write on, like a spelling test. Under a line, the word's sentence shows with a gap, and its meaning when **Meaning under the word** is on.
- Page 2 has the words, for the grown-up to read out, and as the answers.
- With a list, every word of the list comes once before any comes again.

## Example help text

- "Listen, then type the word." / "Hör zu und tippe das Wort."
- "Not quite. It is spelled friend." (with "ie" underlined) / "Nicht ganz. Richtig geschrieben: Freund."
- "Correct! You spelled “because”." / "Richtig! Du hast „Straße“ geschrieben."

## For grown-ups

- The grown-ups page shows each missed word with what the child typed, under "Typing words from your list" or "Typing spelling words". Try again brings missed words back, but only while the word is still in play. A word missed before a list was loaded, or from a list that was cleared, stays out.
- The list is saved as `mw.listEn` or `mw.listDe` for the child, as word, sentence and meaning. A list with many long sentences is shortened so it fits in the stars code. The last sentences go first, then the last meanings. The game says so when it saves. Lists saved before 16 November 2026 have no meanings and read the same.
- My Words is not part of Today's 10, because each child can have their own words.
