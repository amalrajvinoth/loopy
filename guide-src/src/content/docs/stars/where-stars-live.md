---
title: Where stars are saved
description: Where loopy keeps stars and progress, how it keeps them safe, and what can clear them.
sidebar:
  order: 1
---
Your stars live on this phone or computer. They stay here when you close loopy.

loopy has no accounts. Everything is saved in this browser, on this device. Nothing is sent anywhere, unless a grown-up turns on [Family sync](/loopy/guide/stars/family-sync/).

## Two stores in the browser

loopy saves everything twice:

- **localStorage**, a small store. Every page reads it when it opens.
- **IndexedDB**, a bigger store. It holds a copy of the same things.

If the small store is cleared but the big one still has the copy, loopy brings it back and loads the page once more. If a browser blocks the big store (some private windows do), loopy works from the small one alone.

Once a child has stars, loopy asks the browser to keep them for good. Then the browser does not clear them when the device runs low on space. loopy asks only once per device.

## What is saved, and for whom

Each child has their own stars, badges, streaks, age, game levels and settings, the answers per topic and the wrong answers for the grown-ups page, and their last game. See [Kids and ages](/loopy/guide/setup/kids-and-ages/).

The color theme, **Easier to read**, sound and language are the same for everyone on the device.

## What can clear them

- **Clearing browser data.** If you clear the history, cookies or site data for loopy, the stars go.
- **Private windows.** A private or incognito window forgets everything when it closes.
- **Removing a child** in ⚙ Settings deletes that child's stars on this device.
- **Another browser** has its own stores. Stars in Safari are not in Chrome.
- **The home screen app** on an iPhone, iPad or Mac keeps its own stars, apart from Safari. See [Add to the home screen](/loopy/guide/setup/home-screen/).

On the grown-ups page, **Clear answers** deletes only the list of answers. Stars and badges stay. Answers older than 30 days go away by themselves.

## Keep a copy

To be safe, keep a copy somewhere else:

1. Make a backup file with **Save backup**. See [Backup file](/loopy/guide/stars/backup-file/).
2. Or move the stars to a second device. See [Move my stars](/loopy/guide/stars/move-stars/).
3. Or turn on [Family sync](/loopy/guide/stars/family-sync/), so every family device has them.
