# Sentence Builder

A word order game. The words of a sentence are mixed up. The child taps them in the right order to build the sentence. It is the next step after Spell It: from single words to whole sentences. The sentences can be English or German.

## How to play

1. Look at the picture and the mixed-up words. With **Read aloud** on, the sentence is read out loud too.
2. Tap the words in the right order. There is one box for each word. A tapped word greys out. **Erase** takes the last word back.
3. Tap **Check** when every box has a word.
4. Right: the boxes turn green, the sentence is read out, and you earn a star.
5. Wrong: the first wrong word turns red. The right sentence appears underneath, word by word, with the first wrong spot marked. One short line says why, for example "A sentence starts with a capital letter." or "The verb comes right after who does it."
6. Tap **Next** to go on.

From level 2 the full stop, question mark or exclamation mark is its own tile. It goes last.

## Age levels

| Age | Sentences |
| --- | --- |
| 7 and under | 3 words, like "The dog sleeps." or "Der Hund schläft." |
| 8 and 9 | 4 to 5 words, like "The cat drinks milk." The full stop is its own tile |
| 10 | 6 words, with questions, like "Where is my red ball?" |
| 11 and up | 7 to 8 words, with a comma, like "When it rains, we play inside." |

The level shows next to the score, like "Level 2 of 4". After 10 right in a row the game offers the next level. After 3 wrong in the last 5 it offers an easier one, once a visit. A level picked by hand in Settings is kept for that age.

## Sentences

120 English and 120 German sentences, 30 per level, each with a picture: animals, school, home, food, weather and play.

English and German sentences are written separately, not translated word for word, so German keeps its own word order: the verb in second place, nouns with a capital letter, "Wenn es regnet, spielen wir drinnen."

## Last 5

At the top, **Last 5** shows your last 5 answers as dots: green for right, red for wrong. The newest one is on the right.
They stay there next time you play. **Reset score** in Settings clears them.

## Settings

Open them with the gear button.

- **Sentences in.** English or German. The game starts with the site language. Switch it to practise sentences in the other language.
- **Sentences.** 3 words, 4 to 5 words, 6 words with questions, or 7 to 8 words with a comma. Remembered for each age.
- **Read aloud.** Reads the sentence to build, in the language of the sentences, and reads it again after the answer. On by itself for ages 5 to 7.
- Age, colors, sound effects and the display language (EN/DE) are shared with the other games.
- **Print worksheet.** See below.
- The keyboard works too: 1 to 9 tap the first, second, ... word, Backspace erases, Enter checks and goes on.

## Print a worksheet

Tap **Settings**, then **Print worksheet**. The print window opens. Print it, or save it as a PDF.

- Page 1 has 20 sentences with the words mixed up, each with a line to write the sentence on.
- The language and level are the same as in the game.
- Page 2 has the answers, for example "🐶 The dog sleeps."

## Example help text

- "Tap the words in the right order." / "Tippe die Wörter in der richtigen Reihenfolge an."
- "Not quite. The verb comes right after who does it." / "Nicht ganz. Das Verb steht an zweiter Stelle."
- "Not quite. The full stop goes at the end." / "Nicht ganz. Der Punkt kommt ans Ende."
- "Correct! You built “The dog sleeps.”" / "Richtig! Du hast „Der Hund schläft.“ gebaut."

## About the voice

Reading out loud uses the voice built into the browser or device, in the language of the sentences. Nothing is downloaded and nothing is sent anywhere. If the device has no voice, the speaker button is hidden.

## For grown-ups

- The pictures are emoji, so nothing is loaded from other websites. They look a little different on each device.
- To add sentences, edit the `SENTENCES` list at the top of `index.html`: the picture, then the sentence, one list per level. A `*` in front of a word marks the verb, so the game can say "The verb comes right after who does it." when it lands in the wrong place.
- The progress page groups missed sentences by level, like "Practise questions: the question word comes first, the question mark last."
- Sentence Builder is not part of Today's 10, because Today's 10 uses answers to pick from.
