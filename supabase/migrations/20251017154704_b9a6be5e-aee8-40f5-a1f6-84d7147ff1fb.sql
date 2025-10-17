-- Create a new cron job that runs every hour to catch all timezones
SELECT cron.schedule(
  'hourly-reading-reminders',
  '0 * * * *', -- Run at the start of every hour
  $$
  SELECT net.http_post(
    url:='https://tqtaerijrqfkwxennxae.supabase.co/functions/v1/send-daily-reminders',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdGFlcmlqcnFma3d4ZW5ueGFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMjU2NjIsImV4cCI6MjA3NDkwMTY2Mn0.WYkrh4ALTW8TeHKB55vk_jqFu89AHwisaXItcSpeYjY"}'::jsonb,
    body:=concat('{"triggered_at": "', now(), '"}')::jsonb
  ) as request_id;
  $$
);

-- Update the cron_schedules table to reflect the new schedule
INSERT INTO cron_schedules (
  job_name,
  cron_expression,
  description,
  next_run_at
) VALUES (
  'hourly-reading-reminders',
  '0 * * * *',
  'Send reading reminders every hour to catch all user timezones',
  now() + interval '1 hour'
)
ON CONFLICT (job_name) 
DO UPDATE SET
  cron_expression = EXCLUDED.cron_expression,
  description = EXCLUDED.description,
  next_run_at = EXCLUDED.next_run_at;