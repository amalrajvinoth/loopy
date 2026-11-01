-- loopy "Stay in touch": one row per grown-up who left an email in ⚙ Settings. See sync/README.md.
-- This is a second database (loopy-grownups, kept in the EU), apart from the family copies.
-- m: the email, lower case.
-- k: hash of the remove key of the device that saved the email first, so only that device (or the owner)
--    can delete the row. It never changes: a later save of the same email with another key changes nothing.
-- l: the language the grown-up uses loopy in, en or de.
-- t: the time it was saved, in milliseconds. A row is deleted 2 years after that.
CREATE TABLE IF NOT EXISTS grownups (
  m TEXT PRIMARY KEY,
  k TEXT NOT NULL,
  l TEXT NOT NULL,
  t INTEGER NOT NULL
);
