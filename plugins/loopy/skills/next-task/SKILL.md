---
name: next-task
description: Build the next open loopy roadmap task(s). Use for "Start next", "Take next task", "Pickup next task", "Start next task", "take next 3 tasks and execute", or "do the next N".
---

# Next roadmap task

1. Read roadmap issue #21 in `amalrajvinoth/loopy`. Its order is the build order; an issue marked priority or "Next" goes first. Skip issues that are closed, already have an open pull request, or are being built in another thread (check the project's threads when you can).
2. Take the next one, or the next N when the owner says a number. Say in one line which issues you took.
3. For N above 1: build each on its own branch and pull request, in parallel when you can (one helper per issue). If two of them touch the same shared files (`src/loopy.js`, `src/loopy.css`, the home page), build them one after the other instead, so they do not conflict.
4. Build each with the `build-issue` skill.
5. Reply once per pull request when it is ready, not per step.
