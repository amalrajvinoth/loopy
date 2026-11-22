# Checking saved data

Read when the change touches anything that is saved: `Loopy.store`, `localStorage`, a key or its format, stars codes, levels, the child list, or `Loopy.kids`.

Children keep their stars, streaks, levels and settings in their own browser. Nobody can get them back if a change loses them. So every change must keep what is saved today working, on every device that already has it.

What is saved today:

- **Per child** (through `Loopy.store`, kept as `loopy.kid.<id>.` + key): `loopy.rewards`, `loopy.daily`, `loopy.log`, `loopy.recent`, `loopy.ageOffset`, `loopy.readAloud`, `loopy.seen`, and each game's settings (`pm100.`, `ts.`, `clockquiz.`, `ss.`, `mk.`, `bs.`, `pz.`, `cc.`, `wm.`, `si.`, `wi.`, `qf.`, `eb.`, `fc.`).
- **For the whole device**: `loopy.kids` (the children), `loopy.lang`, `loopy.theme`, `loopy.font`, `loopy.sound`.
- **Moved on a first visit**: keys from before there were children (the OLD list in `src/loopy.js`) move to child 1.
- **Stars code** (`Loopy.backup`): any code made before must still load.

Check:

- **No key is dropped or renamed without a move.** If a key or its format changes, read the old one, turn it into the new one, save it and then remove the old one. Do it once, on load, and keep the step in the code for good: some devices only come back months later.
- **Formats only grow.** A new field gets a default when it is missing. An old value that does not fit the new rules is cleaned (like `clean()` does), not thrown away with everything else.
- **Nothing is reset by surprise.** Only Reset score, removing a child, or the person's own choice may remove saved data. A new feature that changes levels or settings starts from what the child already chose.
- **A day is Today's 10.** Only Today's 10 calls `Loopy.daily.finish()`, and `Loopy.rewards.correct` does not touch `Loopy.daily`. A day counted the old way stays counted.
- **Nothing is saved after a switch.** When a sibling takes over mid-game, `Loopy.kids.use` sets a guard and `Loopy.store` drops every save until the reload. A timer still running in the game (a round clock, a level ask) must never write the old child's numbers under the new child's key. A change to `Loopy.store`, `Loopy.kids`, the child chip or the sheet runs `node tools/e2e/switch.mjs`.
- **Per child or per device.** Anything that belongs to one child uses `Loopy.store`. Only display settings are for the whole device.
- **Validate on read.** Every value read from storage, a stars code or a link is checked before use. Broken or old data falls back to a default, never to an error.
- **Stars code both ways.** An old code still loads on the new version. A new code still loads, or fails kindly, on a device that has the old version. If a new key holds progress, add it to `Loopy.backup`.
- **Test it.** Before the change, play on main and make some stars, a streak, a level and a setting for two children. Switch to the change and reload: everything must still be there. Also load a stars code made on main.

If storage moves (for example to IndexedDB), keep reading localStorage until the move is done, move once, keep the old copy until the new one is saved, and still work when the new storage is blocked (private windows).
