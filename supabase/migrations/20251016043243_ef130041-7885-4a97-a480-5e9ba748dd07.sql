-- Remove cron job antigo de importação semanal
DELETE FROM cron_schedules WHERE job_name = 'weekly-google-books-import';

-- Criar novo cron job para importação diária às 1h AM UTC
INSERT INTO cron_schedules (job_name, cron_expression, description, next_run_at)
VALUES (
  'daily-book-import',
  '0 1 * * *',
  'Importação diária de 100 livros do Google Books e Open Library (1h AM UTC)',
  calculate_next_cron_run('0 1 * * *', now())
);

-- Criar job no pg_cron para executar o edge function
SELECT cron.schedule(
  'daily-book-import-job',
  '0 1 * * *', -- Todos os dias às 1h AM UTC
  $$
  SELECT
    net.http_post(
        url:='https://tqtaerijrqfkwxennxae.supabase.co/functions/v1/daily-book-import',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdGFlcmlqcnFma3d4ZW5ueGFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMjU2NjIsImV4cCI6MjA3NDkwMTY2Mn0.WYkrh4ALTW8TeHKB55vk_jqFu89AHwisaXItcSpeYjY"}'::jsonb,
        body:='{}'::jsonb
    ) as request_id;
  $$
);
