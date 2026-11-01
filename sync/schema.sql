-- loopy Family sync: one locked copy per family. See sync/README.md.
-- id: random family id (32 hex), from the family code on the device. The code itself is never sent.
-- k:  hash of the family's write key, so only devices with the code can change or delete the copy.
-- e:  hash of the locked copy (b), so a device can ask "has it changed?" and save only over what it read.
-- b:  the locked copy (AES-GCM, made on the device). This server cannot read it.
-- t:  time of the last save, in milliseconds.
CREATE TABLE IF NOT EXISTS families (
  id TEXT PRIMARY KEY,
  k TEXT NOT NULL,
  e TEXT NOT NULL,
  b TEXT NOT NULL,
  t INTEGER NOT NULL
);

-- One row a night of counts, written by the scheduled job. Counts only: no ids, no names, no emails.
-- day: the UTC date. families: rows in families. active7 / active30: saved in the last 7 / 30 days.
-- bytes: the size of all locked copies together. GET /stats answers the last 90 rows.
CREATE TABLE IF NOT EXISTS stats (
  day TEXT PRIMARY KEY,
  families INTEGER NOT NULL,
  active7 INTEGER NOT NULL,
  active30 INTEGER NOT NULL,
  bytes INTEGER NOT NULL
);
