-- Configurar cron job para executar batch-generate-summaries diariamente às 3h da manhã
SELECT cron.schedule(
  'batch-generate-book-summaries',
  '0 3 * * *', -- Às 3h da manhã todos os dias
  $$
  SELECT
    net.http_post(
      url:='https://tqtaerijrqfkwxennxae.supabase.co/functions/v1/batch-generate-summaries',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdGFlcmlqcnFma3d4ZW5ueGFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMjU2NjIsImV4cCI6MjA3NDkwMTY2Mn0.WYkrh4ALTW8TeHKB55vk_jqFu89AHwisaXItcSpeYjY"}'::jsonb,
      body:='{}'::jsonb
    ) as request_id;
  $$
);