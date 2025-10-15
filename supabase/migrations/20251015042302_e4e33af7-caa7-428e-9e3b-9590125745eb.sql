-- Add notification preferences to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS notification_email BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS notification_time TEXT DEFAULT '09:00',
ADD COLUMN IF NOT EXISTS notification_enabled BOOLEAN DEFAULT true;

-- Update cron_schedules for daily reminders
INSERT INTO cron_schedules (job_name, cron_expression, description, next_run_at)
VALUES 
  ('daily-reading-reminders', '0 9 * * *', 'Send daily reading reminders to users', calculate_next_cron_run('0 9 * * *')),
  ('reset-streaks', '0 0 * * *', 'Reset streaks for inactive users', calculate_next_cron_run('0 0 * * *'))
ON CONFLICT (job_name) DO UPDATE
SET 
  cron_expression = EXCLUDED.cron_expression,
  description = EXCLUDED.description,
  next_run_at = EXCLUDED.next_run_at;