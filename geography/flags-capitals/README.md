# Flags and Capitals

A flag game. A flag shows, and the child picks its country from 4 buttons. Older children then pick the country's capital too. Europe first, then the whole world. In German it is called "Flaggen und Hauptstädte".

## How to play

1. Look at the flag. Read the question: "Which country has this flag?"
2. Tap a country. The right one turns green. A wrong one turns red.
3. One short line says a fact, like "Berlin is the capital of Germany."
4. In **Flags and capitals**, tap **Next** to get the capital question for the same flag: "What is the capital of Germany?"
5. Tap **Next** to go on. Every right answer earns a star.

**Skip** moves on without answering.

## Age levels

| Age | What the game starts with |
| --- | --- |
| 7 to 8 | 12 well-known flags of Europe: Germany and its neighbours, Italy, Spain, the United Kingdom, Sweden |
| 9 to 10 | The 34 flags of Europe that most people know |
| 11 to 12 | The 92 flags of the world that most people know |
| 13 and up | Every country in the world (194 flags), with the capital question after each flag |

Each age starts with these. The list grows from there, see below. A 9-year-old who keeps playing gets the rest of Europe too. An 11-year-old gets the rest of the world.

In World mode a small tag under the question says the part of the world, like "In Africa". The wrong answers come from the same part of the world when they can, so the choice is a real one.

The level shows next to the score, like "Level 2 of 4". After 10 right in a row, or 18 of the last 20 right, the game goes up a level by itself. It says so, with a **Back a step** button. After 3 wrong in the last 5 it offers an easier one, once a visit. A level picked by hand in Settings is kept for that age. When the age goes up, a level the child reached is kept, never lost. The levels: flags of Europe, Europe with capitals, flags of the world, world with capitals.

## Which flag comes next

The flags are in order, from the best known to the least known. In `data.js` every part of the world lists its well-known flags first, then the rest. Each group goes from easy to hard. In World mode the first flag of every continent comes before the second ones. So the continents mix.

The game walks that list from the top:

- A flag the child has never seen comes first, the best known of them. Then the flag that was shown longest ago. Every flag in play comes once before any comes back.
- It is one of the next three in line, picked at random, so the order is not the same every time.
- The game remembers which flags it showed, for each child, and keeps that for the next visit. The same dozen flags do not come back every time the game is opened.
- When the child has been round every flag in play, and most of the last 20 answers were right, the next 4 flags of the list join in. So the list grows with the child. An 8-year-old starts with 12 flags of Europe. Lap by lap come Portugal, Greece, Turkey and Russia, then Norway, Czechia, Ireland and Finland, and so on, up to every country in Europe. A child who is still finding it hard goes round once more first.
- A flag that was answered wrong still comes back in **Try again**, as in every game.

What was shown is saved in the browser for each child (the key `fc-walk`), not in a stars code. On a new device the walk starts at the top again. **Reset score** does not clear it.

## Last 5

At the top, **Last 5** shows your last 5 answers as dots: green for right, red for wrong. The newest one is on the right.
They stay there next time you play. **Reset score** in Settings clears them.

## Settings

Open them with the gear button.

- **Region.** Europe, Americas, Asia, Africa or World. Australia and New Zealand come up in World.
- **Ask.** Flags only, or Flags and capitals.
- The region and what to ask are remembered for each age, so a younger brother or sister keeps their own level.
- **Read aloud.** A speaker button reads the question and the 4 answers out loud.
- Age, colors, sound effects and the language (EN/DE) are shared with the other games.
- **Print worksheet.** See below.

## Print a worksheet

Tap **Settings**, then **Print worksheet**. The print window opens. Print it, or save it as a PDF.

- Page 1 has 20 flags in color, each with 4 countries to circle.
- In **Flags and capitals** each flag also has a line to write the capital.
- Page 2 has the answers, for example "France" or "France: Paris".

## Example help text

- "Which country has this flag?" / "Welches Land hat diese Flagge?"
- "This is the flag of Switzerland." / "Das ist die Flagge der Schweiz."
- "What is the capital of Italy?" / "Was ist die Hauptstadt von Italien?"
- "Rome is the capital of Italy." / "Rom ist die Hauptstadt von Italien."

## Flags

- 194 flags: every member of the United Nations and Vatican City. 46 in Europe, 35 in the Americas, 45 in Asia, 54 in Africa and 14 in Oceania. Oceania is Australia, New Zealand and the Pacific islands. They come up in World.
- Each country has its English and German name, and its capital in both languages (Rome and Rom, Warsaw and Warschau).
- Three levels: 1 is the 26 flags young children know (Germany, France, the USA, Japan, Brazil), 2 the flags most people know (92 in all), 3 the rest.
- South Africa has three capitals, and Monaco, San Marino, Singapore and Vatican City are cities that are their own country, so they have no capital question. Nor do Sri Lanka, Israel and Nauru.
- Flags that look the same or nearly the same are never offered as each other's wrong answer. These are Monaco and Indonesia, Chad and Romania, the Netherlands and Luxembourg, Australia and New Zealand, Ireland and Ivory Coast, Guinea, Mali and Senegal, Honduras, El Salvador and Nicaragua, Slovakia and Slovenia, Norway and Iceland, Qatar and Bahrain, Andorra and Moldova.

## For grown-ups

- The flags are drawn in the page itself from simple shapes. Nothing is loaded from other websites, so the game works offline. Emoji flags are not used, because they do not show on Windows.
- All flags are drawn 3 by 2 (Switzerland is square). Real flags have different shapes, like 2 by 1 for the United Kingdom.
- Coats of arms and emblems are simplified or left out, like on Spain, Portugal and Mexico. A coat of arms is a small shape in its colours, a lion or an eagle a plain outline.
- The flags, names and capitals are in the `FLAGS` list in `data.js`, next to the game page (run `python3 tools/build.py` after a change). Each one has a region and a level: 1 for well-known, 2 for the ones most people know, 3 for the rest. Inside a region and level the list goes from the best known to the least known. That is the order the game walks.
- The progress page groups missed answers into flags and capitals, like "Practise capitals: say the country and its capital together."
