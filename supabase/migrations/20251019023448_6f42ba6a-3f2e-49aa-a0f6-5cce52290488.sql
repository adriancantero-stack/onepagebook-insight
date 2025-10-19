-- Insert cron schedule record for tracking
INSERT INTO public.cron_schedules (job_name, cron_expression, description, next_run_at)
VALUES (
  'send-daily-reminders',
  '*/15 * * * *',
  'Envia lembretes de leitura diária para usuários a cada 15 minutos',
  NOW() + INTERVAL '15 minutes'
)
ON CONFLICT DO NOTHING;

-- Schedule the cron job to run every 15 minutes
-- This will check every 15 minutes if there are users whose notification_time matches
SELECT cron.schedule(
  'send-daily-reminders',
  '*/15 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://tqtaerijrqfkwxennxae.supabase.co/functions/v1/send-daily-reminders',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdGFlcmlqcnFma3d4ZW5ueGFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMjU2NjIsImV4cCI6MjA3NDkwMTY2Mn0.WYkrh4ALTW8TeHKB55vk_jqFu89AHwisaXItcSpeYjY"}'::jsonb,
    body := '{"trigger": "cron"}'::jsonb
  );
  $$
);