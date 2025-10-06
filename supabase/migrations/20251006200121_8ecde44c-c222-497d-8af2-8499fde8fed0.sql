-- Update the weekly cron job to import 100 books per language (300 total)
SELECT cron.unschedule('weekly-books-import');

SELECT cron.schedule(
  'weekly-books-import',
  '0 3 * * 1',
  $$
  SELECT
    net.http_post(
        url:='https://tqtaerijrqfkwxennxae.supabase.co/functions/v1/import-google-books',
        headers:=jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxdGFlcmlqcnFma3d4ZW5ueGFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMjU2NjIsImV4cCI6MjA3NDkwMTY2Mn0.WYkrh4ALTW8TeHKB55vk_jqFu89AHwisaXItcSpeYjY'
        ),
        body:=jsonb_build_object(
          'languages', ARRAY['pt', 'en', 'es'],
          'targetPerLanguage', 100
        )
    ) as request_id;
  $$
);