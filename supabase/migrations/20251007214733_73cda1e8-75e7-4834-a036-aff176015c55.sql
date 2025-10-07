-- Move pg_net extension to extensions schema
DROP EXTENSION IF EXISTS pg_net CASCADE;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Recreate cron jobs with correct schema reference for net.http_post
SELECT cron.unschedule('weekly-google-books-import');
SELECT cron.unschedule('daily-summary-generation');

-- Schedule weekly Google Books import (Sundays at 3 AM UTC) with correct schema
SELECT cron.schedule(
  'weekly-google-books-import',
  '0 3 * * 0',
  $$
  SELECT
    extensions.http_post(
      url := 'https://tqtaerijrqfkwxennxae.supabase.co/functions/v1/import-google-books',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdGFlcmlqcnFma3d4ZW5ueGFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMjU2NjIsImV4cCI6MjA3NDkwMTY2Mn0.WYkrh4ALTW8TeHKB55vk_jqFu89AHwisaXItcSpeYjY'
      ),
      body := jsonb_build_object(
        'lang', 'all',
        'target', 100
      )
    );
  $$
);

-- Schedule daily summary generation (Every day at 2 AM UTC) with correct schema
SELECT cron.schedule(
  'daily-summary-generation',
  '0 2 * * *',
  $$
  SELECT
    extensions.http_post(
      url := 'https://tqtaerijrqfkwxennxae.supabase.co/functions/v1/batch-generate-summaries',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdGFlcmlqcnFma3d4ZW5ueGFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMjU2NjIsImV4cCI6MjA3NDkwMTY2Mn0.WYkrh4ALTW8TeHKB55vk_jqFu89AHwisaXItcSpeYjY'
      ),
      body := '{}'::jsonb
    );
  $$
);