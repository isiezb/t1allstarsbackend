-- Create application_url table
CREATE TABLE IF NOT EXISTS public.application_url (
  id TEXT PRIMARY KEY DEFAULT 'singleton',
  url TEXT NOT NULL DEFAULT 'https://forms.google.com/',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT single_row CHECK (id = 'singleton')
);

-- Insert default row
INSERT INTO public.application_url (id, url)
VALUES ('singleton', 'https://forms.google.com/')
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE public.application_url ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON public.application_url
  FOR SELECT
  USING (true);

-- Create policy to allow authenticated users to update
CREATE POLICY "Allow authenticated update" ON public.application_url
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
