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
| [Equation Balance](math/equation-balance/) | First steps in algebra: find x so a see-saw is level, from □ + 4 = 9 to x on both sides | [README](math/equation-balance/README.md) |
| [Times Tables Sprint](math/times-sprint/) | Times tables against a 60-second clock: beat your best score | [README](math/times-sprint/README.md) |
| [Sound Spell](languages/sound-spell/) | Starting and ending sounds of English and German words | [README](languages/sound-spell/README.md) |
| [Word Match](languages/word-match/) | 100 words for animals, food, home and school, in English or German | [README](languages/word-match/README.md) |
| [Spell It](languages/spell-it/) | Hear a word and spell it on a letter pad, from 3 letters up to 8, in English or German | [README](languages/spell-it/README.md) |
| [Quick Facts](science/quick-facts/) | Short science quizzes about space, animals and the body, with one line of why after each answer | [README](science/quick-facts/README.md) |
| [Where Is It?](geography/where-is-it/) | Continents, oceans, countries and capitals on a map, Europe first, then the world | [README](geography/where-is-it/README.md) |
| [Today's 10](mix/daily-mix/) | A daily mix of 10 problems from the games for your age, with a day streak | [README](mix/daily-mix/README.md) |

## For grown-ups

| Page | What it shows | Read more |
| --- | --- | --- |
| [How it's going](progress/) | Right and wrong answers per game this week and last week, each wrong answer with the right one, and one line of what to practise | [README](progress/README.md) |

Open it from the link at the bottom of the home page.

## How it works

- **Children.** A new device starts with one child and shows no names. To add a child, open **Settings** on the home page and tap **Add a child** under Kids, with a name, a picture and an age. Each child has their own age, stars, badges, streaks, progress, game levels and settings. With two or more, "Who is playing?" shows on the home page: tap a name to switch. Devices that already had Dio and Dia keep them. Theme, sound and language are shared.
- **Carry on.** The home page offers "Carry on" with the child's last game, at the level and settings they left it.
- **Age.** Pick the child's age. Each game gets easier or harder to match it. The age goes up by itself on each birthday.
- **Language.** English is the default. Tap **DE** for German, or **EN** to go back.
- **Colors.** Black is the default. You can also pick Sunny, Ocean, Candy, Forest or High contrast. High contrast is black and white with bright colors and white edges on every button.
- **Easier to read.** In **Settings**, turn on **Easier to read** to switch every text to Atkinson Hyperlegible, a font made so letters like b and d, or I, l and 1, are easy to tell apart. Pages only load the font when it is on, and it is saved for offline use like the other fonts.
- **Stars.** Every right answer gives a star. More stars unlock badges. A streak of right answers sets off confetti.
- **Sound.** Short happy sounds play. Tap the speaker to turn them off.
- **Read aloud.** In Plus and Minus, Times and Share, What Time Is It?, Make 10, Bigger or Smaller, Pizza Fractions, Coins and Change, Equation Balance, Times Tables Sprint, Quick Facts and Where Is It?, a speaker button reads the question out loud in the device's own voice, in English or German. Nothing is downloaded. It is on by itself for ages 5 to 7. Turn it on or off in **Settings**.
- **Help.** After each answer, the game shows a short reason, so kids learn from mistakes.
- **Last 5.** Each game shows the last 5 answers as green and red dots.
- **Back.** The big button with the loopy bunny at the top of a game goes back to all games.
- **Report a problem.** In a game, tap the small flag at the top (or **Report a problem** in **Settings**) when a question or answer is wrong, or something looks wrong. loopy makes a picture of the screen to save, and **Open GitHub** opens a form with the details filled in. Nothing is sent until a grown-up sends it on GitHub.
- **Worksheets.** In every game except Today's 10, tap **Settings**, then **Print worksheet**. You get 20 problems at the child's level on one page, and the answers on a second page. It works on A4 and US Letter paper, and you can save it as a PDF from the print window.

In a game, tap **Settings** to change age, language, colors, the reading font, sound or level.

## Help, feedback and safety

- **Questions:** see the [FAQ](FAQ.md), also on the site's [Help page](https://amalrajvinoth.github.io/loopy/help/).
- **Feedback:** report problems, share ideas or ask questions. See [Helping with Loopy](CONTRIBUTING.md).
- **Security:** please report problems privately. See [SECURITY.md](SECURITY.md).
- **Be kind:** see the [code of conduct](CODE_OF_CONDUCT.md).

## Your data stays on your device

Stars, settings, children's names and the answers on the grown-ups' page are saved in your browser. Nothing is sent anywhere. There are no ads, no tracking and no outside services. Even the fonts are stored on the site.
Everything is saved twice in the browser: in IndexedDB (a bigger store) and in localStorage (quick to read when a page opens). If one is cleared, loopy brings it back from the other. Once a child has stars, loopy asks the browser to keep them (persistent storage). If IndexedDB is blocked, for example in a private window, loopy works from localStorage alone.
To move stars to another device, open the home page, tap **Move my stars to another device**, and copy the code or the link across. With two or more children, pick everyone or one child. The code also carries the day streak, progress, Last 5, the age, the game levels and settings, and the last game. The link holds the code after the `#`, so it never reaches the web server; opening it asks first. Loading a code only adds, it never takes anything away. Old codes still load.

## Screen readers and keyboards

Every game works without touching the screen. Tab moves between buttons, Enter picks an answer, and number keys type into the number pad. Escape closes Settings. After an answer, screen readers such as VoiceOver and NVDA read out "Correct!" or "Not quite." and why, and the new score. An automatic check (`tools/a11y/`) tests every page in every theme on each change.

## Add Loopy to your home screen

On a phone or tablet, open the site and choose **Add to Home Screen**. Loopy then opens full screen like an app.

## Works offline

After one visit with internet, loopy opens with no internet too: on a plane, in the car, anywhere. Every game, Today's 10, Help and the grown-ups' page work. The browser keeps a copy of the site on the device. When you are online, loopy checks for a new version each time it opens, and the next page you open shows it.

## For developers

The site is plain HTML, CSS and JavaScript. One small build step makes the shared files smaller, so pages load fast on slow mobile data.

### Files

| File | What it is |
| --- | --- |
| `index.html` | The home page and the list of games |
| `src/loopy.js` | Shared code: languages, colors, age, sound, read aloud, stars and badges, Last 5 dots, the stars code, the back button, printable worksheets. Edit this one |
| `src/loopy.css` | Shared styles and fonts. Edit this one |
| `loopy.js`, `loopy.css` | Small copies made by the build. Pages load these. Do not edit them |
| `DESIGN.md` | How loopy looks: colors, fonts, buttons, layout and rules. Read it before you change a page |
| `logo.svg`, `logo-white.svg`, `icon.svg` | The logo (for light and dark backgrounds) and the app icon |
| `help/index.html` | The Help page: FAQ and feedback links |
| `progress/index.html` | How it's going: the grown-ups' page. Games log answers with `Loopy.rewards.wrong(game, { q, a, y, k })` |
| `fonts/` | The Fredoka, Lexend and Atkinson Hyperlegible Next fonts, stored here so no request goes to Google. The `-latin` files are made by the build from `src/fonts/`. Licence: `fonts/OFL.txt` |
| `.github/` | Forms for problems, ideas and questions, the automatic checks, and Dependabot |
| `sw.js` | The offline helper (a service worker). Made by the build from `src/sw.js` |
| `tools/` | Small scripts: `build.py` makes the small files and the offline list, `csp.py` updates each page's security policy, `check_external.py` makes sure nothing loads from other websites, `review.py` checks that all games follow the same rules, that saved data is kept and that pages stay small, `a11y/` checks every page with a keyboard and a screen reader checker ([how](tools/a11y/README.md)), `e2e/` plays every game and checks that no question repeats ([how](tools/e2e/README.md)) |
| `RELEASES.md` | What's new: one line per big change, for parents |
| `.claude/skills/loopy-review/` | The review checklist for every change: design, architecture, saved data, speed and size, docs, games alike, and release notes after a merge |
| `plugins/` | Claude Code plugins made from how the owner works: commands for the usual asks, hooks that keep the rules, self-healing checks, and a drift check that keeps them up to date ([how](plugins/README.md)). `python3 plugins/sync.py` copies them into `.claude/`, so every session in this repo has them |
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
3. Add the shared controls: the `.home-link` back button, `#star-chip`, the score row (`.pill-score`, `.pill-streak` and `<div id="last5" data-game="game-id">`), `#settings-toggle`, and inside `#settings-panel` add `#age-picker`, `#theme-picker`, `#sound-toggle` and `#lang-picker`.
4. In your script:
   - `Loopy.getAge()` gives the age. The `loopy:age` event fires when it changes.
   - Make each new question with `Loopy.fresh(recent, make)`. `make()` returns a question with a `key`, and `recent` is the game's own list. No question comes back within 10, and the play test (`tools/e2e/`) checks it.
   - Call `Loopy.rewards.correct("game-id", streak)` after a right answer, and `Loopy.rewards.wrong("game-id", detail)` after a wrong one. These also fill in the Last 5 dots and the grown-ups' page.
   - `detail` tells the grown-ups' page what was missed: `{ q: "52 − 17", a: "35", y: "45", k: "sub-rg" }` is the problem, the right answer, the answer given, and the kind of problem. `Loopy.log.kind(op, a, b)` gives the kind for a sum. A new kind needs a `tip-` line in `progress/index.html` and in the check in `src/loopy.js`.
   - To add a **Print worksheet** button, call `Loopy.worksheet({ title, level, how, layout, make, cell, answer })` once. `make(20)` uses the game's own problem maker. See the comment above `Loopy.worksheet` in `src/loopy.js`.
   - Give the button under the answers `id="next"` and call `Loopy.nextButton(button, answered)` when a problem shows (`false`, a small "Skip") and after each answer (`true`, a big "Next").
   - Put the answers in `#choices`, `#answers`, `#pad`, `#letters` or `#map`. The first time a child opens the game, a hint bubble points at them.
   - Save the game's own settings with `Loopy.store.get(key)` and `Loopy.store.set(key, text)`, never `localStorage` directly. They keep each child's settings apart. Name keys `<prefix>.<setting>` or `<prefix>.<setting>.a<age>`, and add a new game's prefix to `GKEY` in the stars code block of `src/loopy.js`, so its settings move to another device too.
   - In the **Reset score** button, call `Loopy.recent.clear("game-id")`. Add the game id to the `GAMES` lists in `src/loopy.js`, and to the list in `progress/index.html`.
5. Add words in both languages with `Loopy.addStrings({ en: {...}, de: {...} })`. Put `data-t="key"` on fixed text, and use `Loopy.t("key")` in code. Use `Loopy.num(n)` to show numbers.
6. Add one line to the `GAMES` list in the home page `index.html`, with the ages the game fits and a picture (one emoji) for its tile.
7. Add a `README.md` in the game folder, and a row to the table above.
8. Run `python3 tools/build.py`. It updates the page's security policy and adds the page to the offline list. Do this again after any edit to a page.

### Changing the site

The `main` branch is what goes live. Make changes on a new branch and open a pull request. See [CONTRIBUTING.md](CONTRIBUTING.md).

Before a pull request is ready, review it with `.claude/skills/loopy-review/SKILL.md` and run `python3 tools/review.py`. It compares your branch with main. It fails if a saved key is no longer read, so a child would lose stars, levels or settings. If you rename a key or change what it holds, move the old data to the new key on load. It also shows how much each changed file grew. If you changed a page, also run the screen reader and keyboard check and the play test:

```sh
npm ci --prefix tools/a11y --ignore-scripts   # once
node tools/a11y/check.mjs                     # keyboard and screen reader
node tools/e2e/play.mjs                       # plays every game, no repeated questions
```

More in [tools/a11y/README.md](tools/a11y/README.md) and [tools/e2e/README.md](tools/e2e/README.md). After a big change is merged, add a line to [RELEASES.md](RELEASES.md).

After editing any page, run `python3 tools/build.py` (or at least `python3 tools/csp.py`). The GitHub check fails otherwise.

### Build the small files

Pages load `loopy.js` and `loopy.css`. These are small copies of `src/loopy.js` and `src/loopy.css`, made by a script. Never edit them by hand.

After editing anything in `src/`, run:

```sh
python3 -m pip install --require-hashes --no-binary :all: -r tools/requirements.txt   # once
python3 tools/build.py
```

The build also runs `tools/csp.py`, then writes `sw.js`, the offline helper. `sw.js` holds the list of files to keep offline and a hash of all of them. Any change to a page, script, style, font or icon changes the hash, so visitors get the new version and their offline copy is replaced. Commit the small files and `sw.js` with your change. The GitHub check runs `python3 tools/build.py --check` and fails if they do not match `src/`.

The "Easier to read" font (Atkinson Hyperlegible Next, 13 KB) is only loaded by a page when that setting is on, so the sizes below do not change. The offline helper saves it with the other fonts, so it also works offline. The fonts keep only the letters loopy uses (English and German). To rebuild them, for example after adding a letter to the list in `tools/build.py`, install `fonttools` and `brotli` and run `python3 tools/build.py --fonts`.

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
