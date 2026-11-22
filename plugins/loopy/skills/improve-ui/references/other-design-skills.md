# Other design skills on the owner's Mac

Read this only when someone wants to use one of them on loopy. In loopy the UI checks are the repo's own improve-ui skill and, as a second opinion, `/impeccable critique <page>`. DESIGN.md decides the look. loopy's rules hold for all of them: no `style=`, no outside requests, self-hosted fonts, edits in `src/`.

| Skill | What it is | In loopy |
| --- | --- | --- |
| impeccable and the rest of ui-skills | Global design review skills | `/impeccable critique <page>` is a good second opinion. |
| Taste Skill (`design-taste-frontend`, [tasteskill.dev](https://www.tasteskill.dev/guide), MIT) | Builds company landing pages: one section per screen at 1440×900, real photographs, hover motion, Google Fonts, no emoji, and a finish gate as a Stop hook. All of that contradicts DESIGN.md. | Not a loopy UI check. Never run its deal, start or gate scripts in the loopy folder: they write `.taste-skill/` and `assets/`. It fits only a future marketing page outside the games, such as a loopykids.de front page. |
| UI/UX Pro Max (`ui-ux-pro-max`, [uupm.cc](https://uupm.cc), MIT) | A local search over design data (styles, palettes, font pairings, 130 UX guidelines), in Python with no network. | Only its UX guidelines, as a second opinion: `search.py "<concern>" --domain ux` for tap targets, contrast, focus and reduced motion. Its design systems, palettes, fonts and styles are not for loopy, and its "no emoji" rule does not apply to loopy's pictures. Never run it with `--persist` in the loopy folder: it writes `design-system/`. |

Why the folders matter: every file in the repo goes live on the site. Both folders are in `.gitignore` as a second guard.

The sister skills of UI/UX Pro Max (design, brand, slides, banner-design, ui-styling, design-system) need image APIs or Tailwind and are not installed for loopy.
