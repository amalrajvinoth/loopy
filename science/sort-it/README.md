# Sort It

A sorting game with pictures. The child sees a thing, like a dolphin, and picks the group it belongs to: mammal, bird, fish or reptile. After each answer, one line says why. In German the game is called "Sortieren".

## How to play

1. Look at the picture and its name. The question says what to sort by, like "Which kind of animal is it?" or "What is it made of?".
2. Tap the group you think is right. The right one turns green.
3. One line says why, like "A dolphin breathes air and feeds its babies milk, so it is a mammal." After a wrong answer it says the right group first.
4. Tap **Next** to go on. Every right answer earns a star.

Ages 6 to 8 pick from 3 groups. From age 9 there are 4.

## Age levels

| Age | Level | What to sort |
| --- | --- | --- |
| 6 to 7 | Animals and living things | Mammal, bird, fish, reptile, amphibian or insect. Alive, was alive once, or never alive |
| 8 | Materials and matter | Adds solid, liquid or gas, and wood, metal, glass, plastic or fabric |
| 9 to 10 | Food, space and senses | Adds fruit, vegetable, grain, dairy or protein; planet, star, moon or dwarf planet; see, hear, smell, taste or touch |
| 11 and up | All mixed, with tricky ones | Everything, plus the tricky ones: a whale, a bat, a penguin, a tomato, a mushroom, Pluto, a candle flame, honey, fog |

The level shows next to the score, like "Level 2 of 4". After 10 right in a row the game offers the next level. After 3 wrong in the last 5 it offers an easier one, once a visit. A level picked by hand in Settings is kept for that age.

## Things to sort

225 things, each with a picture, a name in English and German, and one line of why:

- **Animals:** 47 animals in six classes.
- **Living things:** 27 things that are alive, were alive once (a log, a feather, a shell) or were never alive (a rock, a robot, fire).
- **Matter:** 25 things that are solid, liquid or gas.
- **Materials:** 36 things made of wood, metal, glass, plastic or fabric.
- **Food:** 38 foods in the five food groups.
- **Space:** 21 planets, stars, moons and dwarf planets.
- **Senses:** 31 things you see, hear, smell, taste or touch.

## No repeats

- A thing does not come back until the other things at that topic and level have had their turn. This holds on the next visit too: the game keeps a short list of the last 60 things in this browser, for each child.
- The same picture or name (Water is a liquid and was never alive) does not come twice in 10 questions.
- When a topic has more than one kind of question, the same kind does not come 3 times in a row. So "Which kind of animal is it?" does not come again and again.
- A missed thing still comes back on purpose, as Try again, until it is answered right twice.

## Last 5

At the top, **Last 5** shows your last 5 answers as dots: green for right, red for wrong. The newest one is on the right.
They stay there next time you play. **Reset score** in Settings clears them.

## Settings

Open them with the gear button.

- **Topic.** All, Animals, Matter, Food, Space or Senses. A topic with nothing at the current level (Food at level 1, say) shows all its things except the tricky ones.
- **Level.** Animals and living things, Materials and matter, Food, space and senses, or All mixed. The game picks one from the age. A changed level is remembered for that age.
- **Read aloud.** A speaker button on the card reads the name, the question and the groups out loud. It is on by itself for ages 5 to 7.
- Age, colors, sound effects and language (EN/DE) are shared with the other games.
- **Print worksheet.** See below.

## Print a worksheet

Tap **Settings**, then **Print worksheet**. The print window opens. Print it, or save it as a PDF.

- Page 1 has 20 things at the same topic and level as the game. Under each one are the groups, so a child can circle the right one.
- Page 2 has the answers, for example "🐬 A dolphin: Mammal".

## Example help text

- "A dolphin. Which kind of animal is it?" / "Der Delfin. Welche Tierart ist das?"
- "Correct! A dolphin breathes air and feeds its babies milk, so it is a mammal." / "Richtig! Ein Delfin atmet Luft und säugt seine Jungen, also ist er ein Säugetier."
- "Not quite. The answer is: Fruit. A tomato grows from a flower and has seeds inside, so it is a fruit, even if we eat it like a vegetable." / "Nicht ganz. Die Antwort ist: Obst. Eine Tomate wächst aus einer Blüte und hat Kerne, also ist sie Obst, auch wenn wir sie wie Gemüse essen."

## For grown-ups

- The pictures are emoji, so nothing is loaded from other websites. They look a little different on each device.
- To add a thing, add a line at the end of the `THINGS` list in `index.html`: picture, level, set, group, then the English and German name and one line of why in each language. Add new things at the end only: a thing's place in the list is its key, and saved Try again mistakes use it. The groups of each set are in `GROUPS`.
- The progress page groups missed answers by set, like "Animal groups" or "Solid, liquid or gas", with a tip for each.
