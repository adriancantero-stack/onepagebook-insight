-- Configure cron jobs for welcome and premium conversion emails

-- Schedule welcome emails to run every 5 minutes
SELECT cron.schedule(
  'send-welcome-emails',
  '*/5 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://tqtaerijrqfkwxennxae.supabase.co/functions/v1/send-welcome-emails',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdGFlcmlqcnFma3d4ZW5ueGFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMjU2NjIsImV4cCI6MjA3NDkwMTY2Mn0.WYkrh4ALTW8TeHKB55vk_jqFu89AHwisaXItcSpeYjY"}'::jsonb,
    body := '{"trigger": "cron"}'::jsonb
  );
  $$
);

-- Update cron_schedules record for welcome emails
UPDATE public.cron_schedules 
SET next_run_at = NOW() + INTERVAL '5 minutes'
WHERE job_name = 'send-welcome-emails';

-- Schedule premium conversion emails to run 3 times daily (00:00, 08:00, 16:00 UTC)
SELECT cron.schedule(
  'send-premium-conversion-emails',
  '0 0,8,16 * * *',
  $$
  SELECT net.http_post(
    url := 'https://tqtaerijrqfkwxennxae.supabase.co/functions/v1/send-premium-conversion-emails',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdGFlcmlqcnFma3d4ZW5ueGFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMjU2NjIsImV4cCI6MjA3NDkwMTY2Mn0.WYkrh4ALTW8TeHKB55vk_jqFu89AHwisaXItcSpeYjY"}'::jsonb,
    body := '{"trigger": "cron"}'::jsonb
  );
  $$
);

-- Update cron_schedules record for premium conversion emails
UPDATE public.cron_schedules 
SET next_run_at = CASE 
  WHEN EXTRACT(HOUR FROM NOW()) < 8 THEN DATE_TRUNC('day', NOW()) + INTERVAL '8 hours'
  WHEN EXTRACT(HOUR FROM NOW()) < 16 THEN DATE_TRUNC('day', NOW()) + INTERVAL '16 hours'
  ELSE DATE_TRUNC('day', NOW()) + INTERVAL '1 day'
END
WHERE job_name = 'premium-conversion-emails-3x-daily';