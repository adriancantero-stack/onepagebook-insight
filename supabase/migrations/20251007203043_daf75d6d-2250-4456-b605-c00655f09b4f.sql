-- Add summary column to books table
ALTER TABLE public.books 
ADD COLUMN IF NOT EXISTS summary TEXT,
ADD COLUMN IF NOT EXISTS summary_generated_at TIMESTAMP WITH TIME ZONE;

-- Create index for efficient querying of books without summaries
CREATE INDEX IF NOT EXISTS idx_books_summary_null ON public.books(id) WHERE summary IS NULL AND is_active = true;

-- Enable pg_cron extension for scheduled jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Grant necessary permissions to pg_cron
GRANT USAGE ON SCHEMA cron TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA cron TO postgres;