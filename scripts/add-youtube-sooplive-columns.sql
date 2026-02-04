-- Add youtube and sooplive columns to players table
ALTER TABLE players ADD COLUMN IF NOT EXISTS youtube TEXT;
ALTER TABLE players ADD COLUMN IF NOT EXISTS sooplive TEXT;
