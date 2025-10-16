
-- Enable pg_net extension for HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net SCHEMA extensions;

-- Remove existing cron jobs
DO $$
BEGIN
  PERFORM cron.unschedule('send-welcome-emails-cron');
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

DO $$
BEGIN
  PERFORM cron.unschedule('send-daily-reminders-cron');
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

DO $$
BEGIN
  PERFORM cron.unschedule('send-premium-conversion-cron');
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

-- Recreate cron jobs with correct syntax
SELECT cron.schedule(
  'send-welcome-emails-cron',
  '*/5 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://tqtaerijrqfkwxennxae.supabase.co/functions/v1/send-welcome-emails',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdGFlcmlqcnFma3d4ZW5ueGFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMjU2NjIsImV4cCI6MjA3NDkwMTY2Mn0.WYkrh4ALTW8TeHKB55vk_jqFu89AHwisaXItcSpeYjY"}'::jsonb,
    body := '{}'::jsonb
  ) as request_id;
  $$
);

SELECT cron.schedule(
  'send-daily-reminders-cron',
  '0 9 * * *',
  $$
  SELECT net.http_post(
    url := 'https://tqtaerijrqfkwxennxae.supabase.co/functions/v1/send-daily-reminders',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdGFlcmlqcnFma3d4ZW5ueGFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMjU2NjIsImV4cCI6MjA3NDkwMTY2Mn0.WYkrh4ALTW8TeHKB55vk_jqFu89AHwisaXItcSpeYjY"}'::jsonb,
    body := '{}'::jsonb
  ) as request_id;
  $$
);

SELECT cron.schedule(
  'send-premium-conversion-cron',
  '0 18 * * *',
  $$
  SELECT net.http_post(
    url := 'https://tqtaerijrqfkwxennxae.supabase.co/functions/v1/send-premium-conversion-emails',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdGFlcmlqcnFma3d4ZW5ueGFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMjU2NjIsImV4cCI6MjA3NDkwMTY2Mn0.WYkrh4ALTW8TeHKB55vk_jqFu89AHwisaXItcSpeYjY"}'::jsonb,
    body := '{}'::jsonb
  ) as request_id;
  $$
);
