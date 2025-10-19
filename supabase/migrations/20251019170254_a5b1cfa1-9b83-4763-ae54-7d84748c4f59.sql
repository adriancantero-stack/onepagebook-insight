-- Remove the existing cron job for send-daily-reminders
SELECT cron.unschedule('send-daily-reminders');

-- Create a new cron job to run at 09:00 UTC daily (6 AM Brazil time)
SELECT cron.schedule(
  'send-daily-reminders',
  '0 9 * * *',
  $$
  SELECT
    net.http_post(
        url:='https://tqtaerijrqfkwxennxae.supabase.co/functions/v1/send-daily-reminders',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdGFlcmlqcnFma3d4ZW5ueGFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMjU2NjIsImV4cCI6MjA3NDkwMTY2Mn0.WYkrh4ALTW8TeHKB55vk_jqFu89AHwisaXItcSpeYjY"}'::jsonb,
        body:='{}'::jsonb
    ) as request_id;
  $$
);

-- Update cron_schedules table
DELETE FROM cron_schedules WHERE job_name = 'send-daily-reminders';

INSERT INTO cron_schedules (job_name, cron_expression, description, next_run_at)
VALUES (
  'send-daily-reminders',
  '0 9 * * *',
  'Envio de lembretes diários às 09:00 UTC (6h AM Brasil) para todos os usuários',
  date_trunc('day', now() + interval '1 day') + interval '9 hours'
);