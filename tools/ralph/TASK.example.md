# Task: a "Read this to me" button on the Help page

The Help page (`help/index.html`) gets a small 🔊 button next to its heading that reads the FAQ answers aloud with `Loopy.speech`, the same way the games do. German when the site is in German.

## Done when

- The button shows on the Help page in both languages, on a phone with no scrolling.
- Tapping it reads the open answer aloud; tapping again stops.
- It uses `Loopy.speech`, `Loopy.addStrings`, `data-t` and `Loopy.t()`; no `style=` or `on...=` attributes.
- Every check in LOOP_INSTRUCTIONS passes, and the Help page's guide pages (EN + DE), FAQ.md and the main README say so.
