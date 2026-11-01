# Word Trail

A word search for kids. The child finds the words hidden in a grid of letters by connecting letters that touch. Each found word lights up in its own colour. A word list with pictures sits under the grid. The words can be English or German.

## How to play

1. Look at the word list under the grid. The word with the blue ring is the one to find now. Any word on the list counts, though.
2. Tap the letters one after the other, or drag a finger over them. The letters so far show under the grid. Letters that touch make a word, sideways, up and down or diagonally. From level 2 the trail can bend.
3. The word counts as soon as its last letter is tapped. The trail keeps its colour and the word in the list is crossed out. You earn a star.
4. Not a word on the list? Tap **Check** (or lift your finger) and the word you were looking for shows in red where it was hidden. No star, and the word comes back later in Try again. Tap **Next word** to go on.
5. Stuck? Tap **🔎 Clue**. The first clue opens the picture and first letter in the list, at the levels that hide them. The next clue makes the word's first box pulse. The last clue shows the whole trail. The word then counts as a miss.
6. When every word in the grid is found, the card says **All 4 words found!** and shows the stars. Tap **Next grid**.

**Clear** takes the last letter off the trail. Tapping a letter that does not touch the last one starts a new trail. That is not a mistake.

## Age levels

| Level | Age | Grid | Words | Trails | The list shows |
| --- | --- | --- | --- | --- | --- |
| 1 | 7 and under | 4 × 4 | 3 words of 3 to 4 letters | straight, across or down | picture and word |
| 2 | 8 to 9 | 5 × 5 | 4 words of 3 to 5 letters | straight, also diagonal, or with one bend | picture and word |
| 3 | 10 to 11 | 6 × 6 | 4 words of 4 to 6 letters | any bend | picture and first letter |
| 4 | 12 to 13 | 6 × 6 | 5 words of 4 to 7 letters | any bend, backwards too | picture only |
| 5 | 14 and up | 6 × 6 | 5 words of 5 to 8 letters | any bend, backwards too | only dashes, and the topic above the grid |

The level shows next to the score, like "Level 2 of 5". After 10 right in a row, or 18 of the last 20 right, the game goes up a level by itself. It says so, with a **Back a step** button. After 3 wrong in the last 5 it offers an easier one, once a visit. A level picked by hand in Settings is kept for that age. When the age goes up, a level the child reached is kept, never lost.

Each word found is one right answer. A wrong trail of 3 or more letters is one wrong answer. The score, Last 5, the streak and the grown-ups page count words, not grids.

## Words

About 480 words in 15 topics. The topics are animals, food, at home, at school, body, nature, clothes and colours. Then sport, space, jobs, in town, feelings, science and doing words. Each word has a picture. The German words are their own list, not a translation of the English one, so "Igel" sits where "hedgehog" sits.

A word goes into a grid when it is 3 to 8 plain letters. In German, ä, ö and ü keep their own box. Words with ß, a space or a hyphen stay out of the grid. The empty boxes get letters that are common in that language, so German grids look German.

Each grid takes its words from one topic. **Topic** in Settings picks one, or **Mix** lets the game choose. A topic that has too few words for a level gets a mixed grid.

## Last 5

At the top, **Last 5** shows your last 5 words as dots: green for found, red for missed. The newest one is on the right.
They stay there next time you play. **Reset score** in Settings clears them.

## Settings

Open them with the gear button.

- **Words in.** English or German. The game starts with the site language. Switch it to learn words in the other language.
- **Topic.** Mix, or one of the 15 topics. Remembered for each child.
- **Level.** 4 × 4 straight, 5 × 5 one bend, 6 × 6 bends, 6 × 6 with 5 words, or 6 × 6 long words. Remembered for each age.
- **Read aloud.** A speaker button on the card reads the words to find. At levels 4 and 5, where the list hides the words, it reads the topic and how many letters the next word has. It is on by itself for ages 7 and under.
- Age, colors, sound effects and the display language (EN/DE) are shared with the other games.
- **Print worksheet.** See below.
- The keyboard works too. Arrows move between the boxes. Space or Enter picks a letter. Enter checks. Backspace takes the last letter off. Escape clears the trail.

## Print a worksheet

Tap **Settings**, then **Print worksheet**. The print window opens. Print it, or save it as a PDF.

- Page 1 has 20 small grids with one word hidden in each. Under each grid is the picture, and the word at levels 1 and 2, or its first letter and dashes at the higher levels. The child draws a line through the word.
- The grid size, word language and topic are the same as in the game.
- Page 2 has the answers, for example "🐱 cat (row 2, box 3)": the box where the word starts.
- The loopy logo is at the top of every page.

## Example help text

- "Find this one: cat." / "Dieses Wort suchen: Katze."
- "“cat”! ⭐" / "„Katze“! ⭐"
- "Not on the list. “cat” was here." / "Steht nicht auf der Liste. „Katze“ war hier."
- "All 4 words found! +4 stars" / "Alle 4 Wörter gefunden! +4 Sterne"

## For grown-ups

- The pictures are emoji, so nothing is loaded from other websites. They look a little different on each device.
- The words come from the shared word bank `languages/words.js`, which Word Match uses too. To add a word, add `[picture, English word, German word]` to a topic, then run `python3 tools/build.py`. The game checks the length and letters itself, and leaves out words marked Word Match only (a fifth value of `0`).
- The progress page groups missed words by length, like "Hidden words with 5 to 6 letters", with a tip for playing together.
- Word Trail is not part of Today's 10, because a grid takes a few minutes.
