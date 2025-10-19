-- Create the daily book import cron job at 3 AM UTC (midnight in Brazil/Brasília)
SELECT cron.schedule(
  'daily-book-import',
  '0 3 * * *',
  $$
  SELECT
    net.http_post(
        url:='https://tqtaerijrqfkwxennxae.supabase.co/functions/v1/daily-book-import',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdGFlcmlqcnFma3d4ZW5ueGFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMjU2NjIsImV4cCI6MjA3NDkwMTY2Mn0.WYkrh4ALTW8TeHKB55vk_jqFu89AHwisaXItcSpeYjY"}'::jsonb,
        body:='{}'::jsonb
    ) as request_id;
  $$
);

-- Update the cron_schedules table
DELETE FROM cron_schedules WHERE job_name = 'daily-book-import';

INSERT INTO cron_schedules (job_name, cron_expression, description, next_run_at)
VALUES (
  'daily-book-import',
  '0 3 * * *',
  'Importação diária de 100 livros do Google Books e Open Library (3h AM UTC = meia-noite Brasil)',
  now() + INTERVAL '1 day' - INTERVAL '8 hours'
);