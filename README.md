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
| [What Time Is It?](math/what-time-is-it/) | Reading a clock with hands | [README](math/what-time-is-it/README.md) |

## How it works

- **Age.** Pick the child's age. Each game gets easier or harder to match it. The age goes up by itself on each birthday.
- **Language.** English is the default. Tap **DE** for German, or **EN** to go back.
- **Colors.** Black is the default. You can also pick Sunny, Ocean, Candy or Forest.
- **Stars.** Every right answer gives a star. More stars unlock badges. A streak of right answers sets off confetti.
- **Sound.** Short happy sounds play. Tap the speaker to turn them off.
- **Help.** After each answer, the game shows a short reason, so kids learn from mistakes.

In a game, tap **Settings** to change age, language, colors, sound or level.

## Help, feedback and safety

- **Questions:** see the [FAQ](FAQ.md), also on the site's [Help page](https://amalrajvinoth.github.io/loopy/help/).
- **Feedback:** report problems, share ideas or ask questions. See [Helping with Loopy](CONTRIBUTING.md).
- **Security:** please report problems privately. See [SECURITY.md](SECURITY.md).
- **Be kind:** see the [code of conduct](CODE_OF_CONDUCT.md).

## Your data stays on your device

Stars and settings are saved in your browser. Nothing is sent anywhere. There are no ads, no tracking and no outside services. Even the fonts are stored on the site.
To move stars to another device, open the home page, tap **Move my stars to another device**, and copy the code across.

## Add Loopy to your home screen

On a phone or tablet, open the site and choose **Add to Home Screen**. Loopy then opens full screen like an app.

## For developers

The site is plain HTML, CSS and JavaScript. There is no build step.

### Files

| File | What it is |
| --- | --- |
| `index.html` | The home page and the list of games |
| `loopy.js` | Shared code: languages, colors, age, sound, stars and badges |
| `loopy.css` | Shared styles |
| `logo.svg`, `logo-white.svg`, `icon.svg` | The logo (for light and dark backgrounds) and the app icon |
| `help/index.html` | The Help page: FAQ and feedback links |
| `fonts/` | The Fredoka and Lexend fonts, stored here so no request goes to Google |
| `.github/` | Forms for problems, ideas and questions, the automatic checks, and Dependabot |
| `tools/` | Small scripts: `csp.py` updates each page's security policy, `check_external.py` makes sure nothing loads from other websites |
| `math/<game>/index.html` | One game per folder |
| `math/<game>/README.md` | What that game does |

### Try it on your computer

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000.

### Add a new game

1. Make a folder, for example `reading/sight-words/`, with an `index.html`. Copying an existing game is the easiest start.
2. Copy the two security `<meta>` tags from an existing game, then load the shared files in `<head>`:
   ```html
   <link rel="stylesheet" href="../../fonts/fonts.css">
   <link rel="stylesheet" href="../../loopy.css">
   <script src="../../loopy.js"></script>
   ```
3. Add the shared controls: `#star-chip`, `#settings-toggle`, and inside `#settings-panel` add `#age-picker`, `#theme-picker`, `#sound-toggle` and `#lang-picker`.
4. In your script:
   - `Loopy.getAge()` gives the age. The `loopy:age` event fires when it changes.
   - Call `Loopy.rewards.correct("game-id", streak)` after a right answer, and `Loopy.rewards.wrong()` after a wrong one.
5. Add words in both languages with `Loopy.addStrings({ en: {...}, de: {...} })`. Put `data-t="key"` on fixed text, and use `Loopy.t("key")` in code. Use `Loopy.num(n)` to show numbers.
6. Add one line to the `GAMES` list in the home page `index.html`, with the ages the game fits.
7. Add a `README.md` in the game folder, and a row to the table above.
8. Run `python3 tools/csp.py` so the page's security policy knows about its code. Do this again after any edit to a page.

### Changing the site

The `main` branch is what goes live. Make changes on a new branch and open a pull request. See [CONTRIBUTING.md](CONTRIBUTING.md).

After editing any page, run `python3 tools/csp.py`. The GitHub check fails otherwise.

Do not add outside scripts, fonts, trackers or analytics. The security rules on each page block them, and they would break the promise that nothing leaves the device.
