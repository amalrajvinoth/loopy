# Word Forms

One word, change its form. Plurals (one cat, two cats), past tense (Today I run. Yesterday I ran.), comparing (big, bigger, biggest), opposites and a or an. In German: Mehrzahl, Vergangenheit, Steigern, Gegenteile and der, die, das. The child sees a word with a picture and a sentence with a blank, and picks the right form. One line says the rule. In German the game is called "Wortformen".

[Play it](https://amalrajvinoth.github.io/loopy/languages/word-forms/)

## How to play

1. Look at the picture and the sentence. One word is missing: "one hand, two ___" or "Today I throw. Yesterday I ___."
2. Tap the form you think is right. The right one turns green and fills the blank.
3. One line says the rule, like "Most words add s: hands." or "throw is an irregular verb. Its past form is threw." After a wrong answer it says the right form first.
4. Tap **Next** to go on. Every right answer earns a star.

The wrong answers are the mistakes children really make: "runned", "goed", "mouses", "Hauser", "mehr groß". A small chip on the card says what kind of question it is.

On a keyboard, 1 to 4 picks an answer and **Enter** goes on.

## Age levels

| Age | Level | What comes |
| --- | --- | --- |
| 7 and under | Opposites and plurals | The opposite of a word; one and two of a thing |
| 8 | a or an (German: der, die, das) | The article in front of a word, with some plurals in between |
| 9 to 10 | Past tense | "Today I run. Yesterday I ___." In German: "Heute laufe ich. Gestern ___ ich." |
| 11 to 12 | Comparing | big, bigger, biggest; groß, größer, am größten; the middle or the last form is missing |
| 13 and up | All mixed, the tricky ones | Every kind, mostly the irregular words: children, worse, bought, Gänse, am besten |

The level shows next to the score, like "Level 2 of 5". After 10 right in a row, or 18 of the last 20 right, the game goes up a level by itself. It says so, with a **Back a step** button. After 3 wrong in the last 5 it offers an easier one, once a visit. A level picked by hand in Settings is kept for that age. When the age goes up, a level the child reached is kept, never lost.

Levels 1 to 4 ask a tricky word (an irregular plural, a strong verb, an umlaut plural) about one time in four. Level 5 asks them most of the time.

## The words

Close to 400 words per language in `words.js` next to the page. English has 120 nouns with their article and plural, 105 verbs with their past form, 76 adjectives with their comparing forms and 84 pairs of opposites. German has 168 nouns with der, die or das and their plural, 90 verbs, 68 adjectives and 80 pairs of opposites. The German past tense is the simple past (Präteritum: ich lief, ich spielte), the form children meet in stories.

## Last 5

At the top, **Last 5** shows your last 5 answers as dots: green for right, red for wrong. The newest one is on the right.
They stay there next time you play. **Reset score** in Settings clears them.

## Settings

Open them with the gear button.

- **Level.** The five levels above. The game picks one from the age. A changed level is remembered for that age.
- **Read aloud.** A speaker button on the card reads the sentence, with "blank" for the gap, and the forms to pick from. After the answer it reads the whole right sentence. It is on by itself for ages 5 to 7.
- Age, colors, sound effects and language (EN/DE) are shared with the other games.
- **Print worksheet.** See below.

## Print a worksheet

Tap **Settings**, then **Print worksheet**. The print window opens. Print it, or save it as a PDF.

- Page 1 has 20 sentences at the same level as the game. Under each one are the forms, so a child can circle the right one.
- Page 2 has the answers.

## Example help text

- "Most words add s: hands." / "Die Mehrzahl von Hand ist Hände, mit Umlaut."
- "throw is an irregular verb. Its past form is threw." / "laufe ist ein starkes Verb, der Vokal ändert sich: Gestern lief ich."
- "Not quite. The answer is: a. a before a consonant sound: a hat." / "Nicht ganz. Die Antwort ist: der. Es heißt der Stuhl. Den Artikel lernt man mit dem Wort mit."

## For grown-ups

- A wrong answer goes to **Try again** on the home page and comes back until it is answered right twice. The very same word comes back.
- The grown-ups' page groups missed questions by kind: plurals, past tense, comparing, opposites, a or an (der, die, das), each with a tip.
- The word lists are plain JavaScript. To add a word, add a line to `words.js` and run `python3 tools/build.py`.
