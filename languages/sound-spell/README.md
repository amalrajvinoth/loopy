# Sound Spell

A listening and spelling game. The child sees a picture and the word with one sound missing, and picks the sound that is missing. It works with English words and German words.

## How to play

1. Look at the picture. The word is written under it with a gap, like `_all` or `bal_`.
2. Tap **Hear the word** to have the browser read it out loud.
3. Tap the sound that fills the gap. The right one turns green and a short line explains why, like "Ball starts with B."
4. Tap **Next word** to go on. Every right answer earns a star.

## Age levels

| Age | What changes |
| --- | --- |
| 5 to 6 | Starting sounds only, 3 choices, single letters |
| 7 to 8 | Starting and ending sounds mixed, 4 choices, two-letter sounds too (sh, ch, th; Sch, St, Ei, Au, Eu) |

After 10 right in a row the game offers to make it harder: first both sound kinds, then four choices.

## Last 5

At the top, **Last 5** shows your last 5 answers as dots: green for right, red for wrong. The newest one is on the right.
They stay there next time you play. **Reset score** in Settings clears them.

## Settings

Open them with the gear button.

- **Sounds.** Starting, Ending or Both.
- **Words in.** English or German. The game starts with the site language, and you can switch at any time.
- **Read each word out loud.** On by default. Turn it off for quiet play. The speaker button still works.
- Age, colors, sound effects and the display language (EN/DE) are shared with the other games.

## Example help text

- "Which sound does it start with?" / "Mit welchem Laut beginnt das Wort?"
- "Fish ends with sh." / "Fisch endet mit sch."

## About the voice

Reading out loud uses the voice built into the browser or device. Nothing is downloaded and nothing is sent anywhere. If the device has no voice for that language, the speaker button is hidden and the game still works with the picture and the written word.

## For grown-ups

- Wrong choices are real sounds from the same word list and never spell another word in the list.
- Letters that sound the same in that place (like c and k at the start of English words, or d and t at the end of German words) are never offered against each other.
- To add words, edit the `WORDS` list at the top of `index.html`: picture, word, starting sound, ending sound, level. Leave the ending sound empty if the word should only be used for starting sounds.
