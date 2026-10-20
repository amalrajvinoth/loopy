# The loopy guide

The guide explains all of loopy in plain words, for kids and grown-ups, in English and German.
It is built with [Astro](https://astro.build) and its docs theme Starlight, and goes live at
https://amalrajvinoth.github.io/loopy/guide/ next to the games.

## Build and look at it

```sh
cd guide-src
npm ci                      # once
npm run build               # makes dist/, then adds the security policy (tools/csp.py)
node scripts/serve.mjs      # open http://127.0.0.1:4321/loopy/guide/
npm run screens             # redo the pictures of the games (after a game looks different)
```

`npm run check` runs every guide check: each game has a page in both languages, every link works,
nothing loads from another website, no page has a script or console error, and axe-core finds no
accessibility problem in dark or light colors.

The GitHub check builds the guide on every pull request. The Pages workflow builds it again on `main`
and puts it at `/loopy/guide/`, with the games as they are. Nothing in this folder changes the games.

## Where things are

| Path | What it is |
| --- | --- |
| `src/content/docs/` | The English pages. One `.md` or `.mdx` file per page |
| `src/content/docs/de/` | The German pages, with the same file names |
| `src/components/KidsBox.astro` | The "For kids" box on every game page |
| `src/components/Shot.astro` | A picture of the site in the page's language |
| `src/components/GameCards.astro` | Picture cards for the games |
| `src/games.ts` | Every game, in home page order |
| `src/assets/screens/` | Pictures made by `npm run screens` |
| `src/styles/loopy.css` | The loopy look: Black (dark) and Sunny (light) |
| `scripts/finish.mjs` | After the build: turns `style="..."` into classes, for the security policy |

## Add a page for a new game

1. Copy `src/content/docs/games/math/box-multiply.mdx` to `src/content/docs/games/<subject>/<game>.mdx`, and the
   German one under `de/`. The file name is the game's folder name.
2. Add the game to `src/games.ts`, in the same place as on the home page.
3. Run `npm run screens` to make its pictures, then `npm run build`.

`tools/guide_check.py` fails if a game on the home page has no guide page in both languages.

## How to write

- Short sentences. Simple words. One idea per sentence.
- Name buttons the way the screen does, in **bold**: **Check**, **Next**, ⚙ **Settings**.
  In German pages, use the German words from the game itself (`Loopy.addStrings` `de`).
- German pages say "du", like the games.
- The **For kids** box has 3 steps of up to 10 easy words each. A 7-year-old should be able to read it.
- The rest of the page is for grown-ups. Keep each section short. Use a table for levels.
- Links inside the guide start with `/loopy/guide/` (German: `/loopy/guide/de/`).
- Only write what the site really does. Check the game's README and code when unsure.

### A game page has these parts

1. `<KidsBox game="<subject>/<game>" steps={[…]} />`
2. One or two sentences: what it teaches and for which ages.
3. `## How to play`
4. `## When an answer is wrong`
5. `## Age levels` (a table)
6. `## Settings`
7. `## Example help text`
8. `## Something wrong?` (points to the 🚩 flag and Report a problem)
