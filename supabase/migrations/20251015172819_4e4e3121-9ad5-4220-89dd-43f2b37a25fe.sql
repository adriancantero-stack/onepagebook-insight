-- Schedule daily reminders to run every day at 9 AM UTC
-- This will call the send-daily-reminders edge function
SELECT cron.schedule(
  'send-daily-reading-reminders',
  '0 9 * * *', -- Every day at 9:00 AM UTC
  $$
  SELECT
    net.http_post(
        url:='https://tqtaerijrqfkwxennxae.supabase.co/functions/v1/send-daily-reminders',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdGFlcmlqcnFma3d4ZW5ueGFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMjU2NjIsImV4cCI6MjA3NDkwMTY2Mn0.WYkrh4ALTW8TeHKB55vk_jqFu89AHwisaXItcSpeYjY"}'::jsonb,
        body:=jsonb_build_object('time', now())
    ) as request_id;
  $$
);

-- Update the cron_schedules table to reflect the configuration
UPDATE cron_schedules 
SET 
  last_run_at = NULL,
  next_run_at = (CURRENT_DATE + interval '1 day' + interval '9 hours')
WHERE job_name = 'daily-reading-reminders';