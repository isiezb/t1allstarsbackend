-- Create VODs table
CREATE TABLE IF NOT EXISTS public.vods (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  link TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Full Stream', 'Highlight', 'POV Stream')),
  date TEXT NOT NULL,
  duration TEXT,
  description TEXT,
  thumbnail TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE public.vods ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON public.vods
  FOR SELECT
  USING (true);

-- Create policy to allow authenticated users to insert
CREATE POLICY "Allow authenticated insert" ON public.vods
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policy to allow authenticated users to update
CREATE POLICY "Allow authenticated update" ON public.vods
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policy to allow authenticated users to delete
CREATE POLICY "Allow authenticated delete" ON public.vods
  FOR DELETE
  TO authenticated
  USING (true);

-- Create index on date for faster sorting
CREATE INDEX IF NOT EXISTS idx_vods_date ON public.vods(date DESC);
