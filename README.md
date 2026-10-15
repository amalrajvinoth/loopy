<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="logo-white.svg">
    <img src="logo.svg" alt="loopy" width="320">
  </picture>
</p>

# Loopy

**Learn. Play. Repeat.**

Loopy is a set of free learning games for kids from grade 1 to grade 10.
Play it here: **https://amalrajvinoth.github.io/loopy**

It works on phones, tablets and computers. There is no sign-up and no ads.

## The games

| Game | What kids practice | Read more |
| --- | --- | --- |
| [Plus and Minus](math/plus-minus/) | Adding and taking away | [README](math/plus-minus/README.md) |
| [Times and Share](math/times-share/) | Times tables and sharing (division) | [README](math/times-share/README.md) |
| [Make 10](math/make-10/) | Number pairs that make 10, 20 and 100, with ten-frames to count | [README](math/make-10/README.md) |
| [What Time Is It?](math/what-time-is-it/) | Reading a clock with hands | [README](math/what-time-is-it/README.md) |
| [Bigger or Smaller](math/bigger-or-smaller/) | Comparing, ordering and rounding numbers, with a number line | [README](math/bigger-or-smaller/README.md) |
| [Pizza Fractions](math/pizza-fractions/) | Naming, comparing and adding fractions, with pizzas and bars | [README](math/pizza-fractions/README.md) |
| [Coins and Change](math/coins-change/) | Counting coins and notes, and giving change, in euros, pounds or dollars | [README](math/coins-change/README.md) |
| [Sound Spell](languages/sound-spell/) | Starting and ending sounds of English and German words | [README](languages/sound-spell/README.md) |
| [Word Match](languages/word-match/) | 100 words for animals, food, home and school, in English or German | [README](languages/word-match/README.md) |
| [Spell It](languages/spell-it/) | Hear a word and spell it on a letter pad, from 3 letters up to 8, in English or German | [README](languages/spell-it/README.md) |
| [Today's 10](mix/daily-mix/) | A daily mix of 10 problems from the games for your age, with a day streak | [README](mix/daily-mix/README.md) |

## For grown-ups

| Page | What it shows | Read more |
| --- | --- | --- |
| [How it's going](progress/) | Right and wrong answers per game this week and last week, each wrong answer with the right one, and one line of what to practise | [README](progress/README.md) |

Open it from the link at the bottom of the home page.

## How it works

- **Age.** Pick the child's age. Each game gets easier or harder to match it. The age goes up by itself on each birthday.
- **Language.** English is the default. Tap **DE** for German, or **EN** to go back.
- **Colors.** Black is the default. You can also pick Sunny, Ocean, Candy or Forest.
- **Stars.** Every right answer gives a star. More stars unlock badges. A streak of right answers sets off confetti.
- **Sound.** Short happy sounds play. Tap the speaker to turn them off.
- **Read aloud.** In Plus and Minus, Times and Share, What Time Is It?, Make 10, Bigger or Smaller, Pizza Fractions and Coins and Change, a speaker button reads the question out loud in the device's own voice, in English or German. Nothing is downloaded. It is on by itself for ages 5 to 7. Turn it on or off in **Settings**.
- **Help.** After each answer, the game shows a short reason, so kids learn from mistakes.
- **Last 5.** Each game shows the last 5 answers as green and red dots.
- **Back.** The big button with the loopy bunny at the top of a game goes back to all games.
- **Worksheets.** In every game except Today's 10, tap **Settings**, then **Print worksheet**. You get 20 problems at the child's level on one page, and the answers on a second page. It works on A4 and US Letter paper, and you can save it as a PDF from the print window.

In a game, tap **Settings** to change age, language, colors, sound or level.

## Help, feedback and safety

- **Questions:** see the [FAQ](FAQ.md), also on the site's [Help page](https://amalrajvinoth.github.io/loopy/help/).
- **Feedback:** report problems, share ideas or ask questions. See [Helping with Loopy](CONTRIBUTING.md).
- **Security:** please report problems privately. See [SECURITY.md](SECURITY.md).
- **Be kind:** see the [code of conduct](CODE_OF_CONDUCT.md).

## Your data stays on your device

Stars, settings and the answers on the grown-ups' page are saved in your browser. Nothing is sent anywhere. There are no ads, no tracking and no outside services. Even the fonts are stored on the site.
To move stars to another device, open the home page, tap **Move my stars to another device**, and copy the code across.

## Add Loopy to your home screen

On a phone or tablet, open the site and choose **Add to Home Screen**. Loopy then opens full screen like an app.

## For developers

The site is plain HTML, CSS and JavaScript. One small build step makes the shared files smaller, so pages load fast on slow mobile data.

### Files

| File | What it is |
| --- | --- |
| `index.html` | The home page and the list of games |
| `src/loopy.js` | Shared code: languages, colors, age, sound, read aloud, stars and badges, Last 5 dots, the back button, printable worksheets. Edit this one |
| `src/loopy.css` | Shared styles and fonts. Edit this one |
| `loopy.js`, `loopy.css` | Small copies made by the build. Pages load these. Do not edit them |
| `DESIGN.md` | How loopy looks: colors, fonts, buttons, layout and rules. Read it before you change a page |
| `logo.svg`, `logo-white.svg`, `icon.svg` | The logo (for light and dark backgrounds) and the app icon |
| `help/index.html` | The Help page: FAQ and feedback links |
| `progress/index.html` | How it's going: the grown-ups' page. Games log answers with `Loopy.rewards.wrong(game, { q, a, y, k })` |
| `fonts/` | The Fredoka and Lexend fonts, stored here so no request goes to Google. The `-latin` files are made by the build from `src/fonts/` |
| `.github/` | Forms for problems, ideas and questions, the automatic checks, and Dependabot |
| `tools/` | Small scripts: `build.py` makes the small files, `csp.py` updates each page's security policy, `check_external.py` makes sure nothing loads from other websites, `review.py` checks that all games follow the same rules |
| `RELEASES.md` | What's new: one line per big change, for parents |
| `.claude/skills/loopy-review/` | The review checklist for every change: design, architecture, docs, games alike, and release notes after a merge |
| `math/<game>/index.html` | One game per folder (also `languages/` and `mix/`) |
| `math/<game>/README.md` | What that game does |

### Try it on your computer

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000.

### Add a new game

Read [DESIGN.md](DESIGN.md) first. It lists the colors, fonts, buttons and layout rules every game follows.

1. Make a folder, for example `reading/sight-words/`, with an `index.html`. Copying an existing game is the easiest start.
2. Copy the two security `<meta>` tags from an existing game, then load the shared files in `<head>`:
   ```html
   <link rel="preload" href="../../fonts/lexend-latin.woff2" as="font" type="font/woff2" crossorigin>
   <link rel="stylesheet" href="../../loopy.css">
   <script src="../../loopy.js"></script>
   ```
3. Add the shared controls: the `.home-link` back button, `#star-chip`, `<div id="last5" data-game="game-id">` in the score row, `#settings-toggle`, and inside `#settings-panel` add `#age-picker`, `#theme-picker`, `#sound-toggle` and `#lang-picker`.
4. In your script:
   - `Loopy.getAge()` gives the age. The `loopy:age` event fires when it changes.
   - Call `Loopy.rewards.correct("game-id", streak)` after a right answer, and `Loopy.rewards.wrong("game-id", detail)` after a wrong one. These also fill in the Last 5 dots and the grown-ups' page.
   - `detail` tells the grown-ups' page what was missed: `{ q: "52 − 17", a: "35", y: "45", k: "sub-rg" }` is the problem, the right answer, the answer given, and the kind of problem. `Loopy.log.kind(op, a, b)` gives the kind for a sum. A new kind needs a `tip-` line in `progress/index.html` and in the check in `src/loopy.js`.
   - To add a **Print worksheet** button, call `Loopy.worksheet({ title, level, how, layout, make, cell, answer })` once. `make(20)` uses the game's own problem maker. See the comment above `Loopy.worksheet` in `src/loopy.js`.
   - In the **Reset score** button, call `Loopy.recent.clear("game-id")`. Add the game id to the `GAMES` lists in `src/loopy.js`, and to the list in `progress/index.html`.
5. Add words in both languages with `Loopy.addStrings({ en: {...}, de: {...} })`. Put `data-t="key"` on fixed text, and use `Loopy.t("key")` in code. Use `Loopy.num(n)` to show numbers.
6. Add one line to the `GAMES` list in the home page `index.html`, with the ages the game fits.
7. Add a `README.md` in the game folder, and a row to the table above.
8. Run `python3 tools/csp.py` so the page's security policy knows about its code. Do this again after any edit to a page.

### Changing the site

The `main` branch is what goes live. Make changes on a new branch and open a pull request. See [CONTRIBUTING.md](CONTRIBUTING.md).

Before a pull request is ready, review it with `.claude/skills/loopy-review/SKILL.md` and run `python3 tools/review.py`. After a big change is merged, add a line to [RELEASES.md](RELEASES.md).

After editing any page, run `python3 tools/csp.py`. The GitHub check fails otherwise.

### Build the small files

Pages load `loopy.js` and `loopy.css`. These are small copies of `src/loopy.js` and `src/loopy.css`, made by a script. Never edit them by hand.

After editing anything in `src/`, run:

```sh
python3 -m pip install --require-hashes --no-binary :all: -r tools/requirements.txt   # once
python3 tools/build.py
```

The build also runs `tools/csp.py`. Commit the small files with your change. The GitHub check runs `python3 tools/build.py --check` and fails if they do not match `src/`.

The fonts keep only the letters loopy uses (English and German). To rebuild them, for example after adding a letter to the list in `tools/build.py`, install `fonttools` and `brotli` and run `python3 tools/build.py --fonts`.

Page sizes, sent over the network with fonts:

| Page | Before | After | Lighthouse (phone, slow 4G) |
| --- | --- | --- | --- |
| Home | 87 KB | 51 KB | 93 → 100 |
| Help | 85 KB | 50 KB | 98 → 100 |
| What Time Is It? | 59 KB | 33 KB | 92 → 100 |
| Plus and Minus | 59 KB | 33 KB | 92 → 100 |
| Times and Share | 60 KB | 34 KB | 92 → 100 |
| Sound Spell | 61 KB | 35 KB | 92 → 100 |

Measured with Lighthouse 12 on a local server that compresses files like GitHub Pages does. First content shows in 0.9 seconds on every page (was 1.4 to 1.5).

Do not add outside scripts, fonts, trackers or analytics. The security rules on each page block them, and they would break the promise that nothing leaves the device.
