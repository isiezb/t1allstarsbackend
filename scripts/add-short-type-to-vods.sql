-- Add 'Short' to VOD type constraint
-- This migration updates the type check constraint to allow YouTube Shorts

-- Drop the existing constraint
ALTER TABLE public.vods DROP CONSTRAINT IF EXISTS vods_type_check;

-- Add the updated constraint with 'Short' included
ALTER TABLE public.vods ADD CONSTRAINT vods_type_check
  CHECK (type IN ('Full Stream', 'Highlight', 'POV Stream', 'Short'));
