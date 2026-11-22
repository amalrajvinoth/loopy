# Checking the screen

Read when a page, `src/loopy.css` or `src/loopy.js` changed, or anything that prints.

The rules are not repeated here. They are DESIGN.md "7. Do and don't" and AGENTS.md "Site" and "Games": go through every line of both against the pictures. This page is how to look, and the checks that need a method.

## Take the pictures

`node plugins/loopy/scripts/screens.mjs <page> --out <scratch>/after` takes each changed page at the eight sizes of DESIGN.md "Screens", in English and German, and fails if a page scrolls. Add `--theme sunny` for one light theme next to Black, and `--root <worktree of origin/main>` for the same screens on main, so you can say what looks different. Take each page three ways: fresh, after a wrong answer with the longest explanation, and with Settings open.

## What the pictures show

- **Cut off.** The tablet held upright is where a big element overflows first. A sum, grid or picture that grows with the screen is capped by the card's height in container units, up to `--big`, never by a fixed number. A page that measures text to pick its size runs the fit again when the web font lands (`document.fonts.ready`), or a small phone can still scroll.
- **Empty card.** On a tablet, a laptop or a monitor, a card that is mostly empty around small content is a finding.
- **Dead or covered.** Next before an answer (`#next:disabled` keeps its place empty, so the answers do not jump). A hint bubble over a key, number, word or button, or one that does not name the game's real first tap. A feedback word that is not the shared "Correct!" or "Not quite." through `Loopy.t()`.
- **Shared parts** look as in the other games: Back, star counter, Last 5, the child chip (`<div id="kid-picker">`), ⚙ Settings with age, theme, sound and language, Reset score. On the home page, three or more children must not push the first game tiles off a 360 × 640 screen.
- **Colours and type.** Green and red only for right and wrong, yellow only for rewards and Today's 10, print black on white. No new fonts; Atkinson Hyperlegible Next shows only when "Easier to read" is on.
- **Touch.** Tap targets at least 44px, a `:focus-visible` ring, `prefers-reduced-motion` turns movement off, no hover-only effect.
- **Pretend.** Any new level that fixes a day, a date, a season or a price says so, like the 24-hour level of What Time Is It?. A bug report that a right 24-hour answer "seems wrong" is this, not a child's slip.

## German

- **Nothing stays English.** Switch loopy to German and play 12 rounds with wrong answers: prompts, keys, hints, the explanation, Settings, the Try again card. Compare the `en` and `de` key sets of every `Loopy.addStrings` on the page (they must match), and look for HTML text without `data-t`. A quick way: render the page in both languages at 390 × 844 and list the words both renders share; those are the suspects.
- **Words in.** In a word game with a "Words in" pick (Word Detective, Spell It, Spelling Quiz, My Words, Sound Spell, Word Match, Word Trail, Sentence Builder): pick English words, switch loopy to German and reload. The words, clues and keyboard must be German. A new pick uses the same pattern, `<game>.words` + `<game>.wordsUi`. `tools/e2e/play.mjs` checks the eight games (`wordsFollowLanguage`, `wordDetectiveWords`).
- **Keyboard.** The rows are `qwertzuiopü`, `asdfghjklöä`, `yxcvbnmß`, and a letter pad mixes ä, ö and ü into its extras (`EXTRA.de`). At 360 × 640 the longest row fits with the extra key, "Löschen" and "Prüfen" are not cut off, and ß shows as ß, not "SS" (keys in uppercase need `text-transform: none` on that key). `tools/review.py` flags rows without ü, ö, ä, ß and `EXTRA.de` without umlauts.

## The home screen app

Added to the home screen, loopy has no browser bars, and on Android it is drawn under the gesture bar. A page uses `var(--safe-top)` and `var(--safe-bottom)`, which keep a floor in the home screen app (`tools/review.py` flags raw `env()`).

To test in headless Chromium: open a CDP session and send `Emulation.setSafeAreaInsetsOverride` with `insets: { top, topMax, bottom, bottomMax, left, leftMax, right, rightMax }` (try a reported bottom of 0, 24 and 48px at 412 × 915, 47/34px at 390 × 844 for an iPhone, 24/20px at 820 × 1180 for an iPad). Chromium cannot emulate `display-mode: standalone`, so make the context with `bypassCSP: true` and inject the standalone rule from `loopy.css` with `addStyleTag`. Then the lowest element on the page (keys, answers, the hint bubble, a scrolling page's last line) must end above `innerHeight` minus the bar.

## Print

When the change touches a game or the worksheet code, print-preview the worksheet (`page.emulateMedia({ media: "print" })` and `page.pdf()` for A4 and Letter). It must be exactly 2 pages. Anything that prints must show the real loopy logo (`Loopy.logo()`); a missing logo is a Must fix.
