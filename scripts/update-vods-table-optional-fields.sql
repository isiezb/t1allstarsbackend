-- Make title and date optional (can be null until auto-fetched)
ALTER TABLE public.vods ALTER COLUMN title DROP NOT NULL;
ALTER TABLE public.vods ALTER COLUMN date DROP NOT NULL;

-- Set default values for title and date if not provided
ALTER TABLE public.vods ALTER COLUMN title SET DEFAULT 'Untitled VOD';
ALTER TABLE public.vods ALTER COLUMN date SET DEFAULT 'TBD';
