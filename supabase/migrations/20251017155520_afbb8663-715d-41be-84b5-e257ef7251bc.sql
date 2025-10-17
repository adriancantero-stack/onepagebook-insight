-- Create a new cron job that runs 3 times a day to catch all users
SELECT cron.schedule(
  'premium-conversion-emails-3x-daily',
  '0 0,8,16 * * *', -- Run at 00:00, 08:00, and 16:00 UTC daily
  $$
  SELECT net.http_post(
    url:='https://tqtaerijrqfkwxennxae.supabase.co/functions/v1/send-premium-conversion-emails',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdGFlcmlqcnFma3d4ZW5ueGFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMjU2NjIsImV4cCI6MjA3NDkwMTY2Mn0.WYkrh4ALTW8TeHKB55vk_jqFu89AHwisaXItcSpeYjY"}'::jsonb,
    body:=concat('{"triggered_at": "', now(), '"}')::jsonb
  ) as request_id;
  $$
);

-- Update or insert the cron_schedules table entry
INSERT INTO cron_schedules (
  job_name,
  cron_expression,
  description,
  next_run_at
) VALUES (
  'premium-conversion-emails-3x-daily',
  '0 0,8,16 * * *',
  'Send premium conversion emails 3 times daily (00:00, 08:00, 16:00 UTC) to catch all users',
  CASE 
    WHEN EXTRACT(HOUR FROM now()) < 8 THEN date_trunc('day', now()) + interval '8 hours'
    WHEN EXTRACT(HOUR FROM now()) < 16 THEN date_trunc('day', now()) + interval '16 hours'
    ELSE date_trunc('day', now()) + interval '1 day'
  END
)
ON CONFLICT (job_name) 
DO UPDATE SET
  cron_expression = EXCLUDED.cron_expression,
  description = EXCLUDED.description,
  next_run_at = EXCLUDED.next_run_at;