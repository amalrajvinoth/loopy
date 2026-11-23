-- Adds the f column (the linked family id, issue #169) to a grownups table made before it existed.
-- The deploy job (.github/workflows/sync.yml) runs this once, only when the column is missing: SQLite has
-- no ADD COLUMN IF NOT EXISTS, and running it twice would fail with "duplicate column name".
-- Rows saved before get NULL: no email is linked until its grown-up ticks the box and saves again.
ALTER TABLE grownups ADD COLUMN f TEXT;
