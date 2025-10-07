-- Schedule weekly Google Books import (Sundays at 3 AM UTC)
SELECT cron.schedule(
  'weekly-google-books-import',
  '0 3 * * 0',
  $$
  SELECT
    net.http_post(
      url := 'https://tqtaerijrqfkwxennxae.supabase.co/functions/v1/import-google-books',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdGFlcmlqcnFma3d4ZW5ueGFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMjU2NjIsImV4cCI6MjA3NDkwMTY2Mn0.WYkrh4ALTW8TeHKB55vk_jqFu89AHwisaXItcSpeYjY'
      ),
      body := jsonb_build_object(
        'lang', 'all',
        'target', 100
      )
    );
  $$
);

-- Schedule daily summary generation (Every day at 2 AM UTC)
SELECT cron.schedule(
  'daily-summary-generation',
  '0 2 * * *',
  $$
  SELECT
    net.http_post(
      url := 'https://tqtaerijrqfkwxennxae.supabase.co/functions/v1/batch-generate-summaries',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdGFlcmlqcnFma3d4ZW5ueGFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMjU2NjIsImV4cCI6MjA3NDkwMTY2Mn0.WYkrh4ALTW8TeHKB55vk_jqFu89AHwisaXItcSpeYjY'
      ),
      body := '{}'::jsonb
    );
  $$
);

-- Create table to track cron execution for UI display
CREATE TABLE IF NOT EXISTS public.cron_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_name TEXT NOT NULL UNIQUE,
  cron_expression TEXT NOT NULL,
  last_run_at TIMESTAMP WITH TIME ZONE,
  next_run_at TIMESTAMP WITH TIME ZONE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert schedule information
INSERT INTO public.cron_schedules (job_name, cron_expression, description, next_run_at)
VALUES 
  ('weekly-google-books-import', '0 3 * * 0', 'Importação semanal de livros do Google Books (Domingos às 3h UTC)', 
   date_trunc('week', NOW() + INTERVAL '1 week') + INTERVAL '3 hours'),
  ('daily-summary-generation', '0 2 * * *', 'Geração diária de resumos de livros (Todos os dias às 2h UTC)',
   date_trunc('day', NOW() + INTERVAL '1 day') + INTERVAL '2 hours')
ON CONFLICT (job_name) 
DO UPDATE SET 
  cron_expression = EXCLUDED.cron_expression,
  description = EXCLUDED.description;

-- Enable RLS
ALTER TABLE public.cron_schedules ENABLE ROW LEVEL SECURITY;

-- Policy to allow admins to view cron schedules
CREATE POLICY "Admins can view cron schedules"
  ON public.cron_schedules
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Function to calculate next run time based on cron expression
CREATE OR REPLACE FUNCTION public.calculate_next_cron_run(
  cron_expr TEXT,
  from_time TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
RETURNS TIMESTAMP WITH TIME ZONE
LANGUAGE plpgsql
AS $$
DECLARE
  next_run TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Daily at 2 AM (0 2 * * *)
  IF cron_expr = '0 2 * * *' THEN
    next_run := date_trunc('day', from_time + INTERVAL '1 day') + INTERVAL '2 hours';
    IF next_run <= from_time THEN
      next_run := date_trunc('day', from_time + INTERVAL '2 days') + INTERVAL '2 hours';
    END IF;
  -- Weekly on Sunday at 3 AM (0 3 * * 0)
  ELSIF cron_expr = '0 3 * * 0' THEN
    next_run := date_trunc('week', from_time + INTERVAL '1 week') + INTERVAL '3 hours';
    IF next_run <= from_time THEN
      next_run := date_trunc('week', from_time + INTERVAL '2 weeks') + INTERVAL '3 hours';
    END IF;
  ELSE
    next_run := from_time + INTERVAL '1 hour';
  END IF;
  
  RETURN next_run;
END;
$$;