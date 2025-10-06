-- Enable pg_cron extension for scheduled jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create a weekly cron job to import books from Google Books
-- Runs every Monday at 3 AM UTC
SELECT cron.schedule(
  'weekly-books-import',
  '0 3 * * 1',
  $$
  SELECT
    net.http_post(
        url:='https://tqtaerijrqfkwxennxae.supabase.co/functions/v1/import-google-books',
        headers:=jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdGFlcmlqcnFma3d4ZW5ueGFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMjU2NjIsImV4cCI6MjA3NDkwMTY2Mn0.WYkrh4ALTW8TeHKB55vk_jqFu89AHwisaXItcSpeYjY'
        ),
        body:=jsonb_build_object(
          'languages', ARRAY['pt', 'en', 'es'],
          'targetPerLanguage', 30
        )
    ) as request_id;
  $$
);

-- Create a table to track import history
CREATE TABLE IF NOT EXISTS public.book_import_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  books_imported INTEGER DEFAULT 0,
  status TEXT DEFAULT 'running',
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.book_import_history ENABLE ROW LEVEL SECURITY;

-- Allow admins to view import history
CREATE POLICY "Admins can view import history"
  ON public.book_import_history
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- Create index for faster queries
CREATE INDEX idx_book_import_history_started_at ON public.book_import_history(started_at DESC);