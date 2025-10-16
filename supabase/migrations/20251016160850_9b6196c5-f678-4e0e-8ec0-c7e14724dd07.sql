-- Create table to track welcome emails
CREATE TABLE IF NOT EXISTS welcome_emails_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  language TEXT DEFAULT 'pt',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  sent_at TIMESTAMPTZ,
  error_message TEXT
);

-- Enable RLS
ALTER TABLE welcome_emails_queue ENABLE ROW LEVEL SECURITY;

-- Policy for system to insert
CREATE POLICY "System can insert welcome emails"
  ON welcome_emails_queue
  FOR INSERT
  WITH CHECK (true);

-- Policy for system to update
CREATE POLICY "System can update welcome emails"
  ON welcome_emails_queue
  FOR UPDATE
  USING (true);

-- Policy for system to read
CREATE POLICY "System can read welcome emails"
  ON welcome_emails_queue
  FOR SELECT
  USING (true);

-- Updated trigger function to queue welcome emails
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  free_plan_id UUID;
  user_language TEXT;
BEGIN
  -- Insert into profiles with signup tracking data
  INSERT INTO public.profiles (
    id, 
    full_name,
    signup_language,
    signup_path,
    signup_country
  )
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'signup_language',
    NEW.raw_user_meta_data->>'signup_path',
    NEW.raw_user_meta_data->>'signup_country'
  );
  
  -- Get free plan ID
  SELECT id INTO free_plan_id FROM public.subscription_plans WHERE type = 'free' LIMIT 1;
  
  -- Create free subscription
  INSERT INTO public.user_subscriptions (user_id, plan_id)
  VALUES (NEW.id, free_plan_id);
  
  -- Get user language
  user_language := COALESCE(NEW.raw_user_meta_data->>'signup_language', 'pt');
  
  -- Queue welcome email
  INSERT INTO public.welcome_emails_queue (user_id, email, full_name, language)
  VALUES (
    NEW.id, 
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    user_language
  );
  
  RAISE LOG 'New user created and welcome email queued: % (%)', NEW.id, NEW.email;
  
  RETURN NEW;
END;
$$;

-- Create cron schedule for processing welcome emails (every 5 minutes)
INSERT INTO cron_schedules (job_name, cron_expression, description)
VALUES (
  'send-welcome-emails',
  '*/5 * * * *',
  'Process and send welcome emails to new users every 5 minutes'
)
ON CONFLICT (job_name) DO UPDATE
  SET cron_expression = EXCLUDED.cron_expression,
      description = EXCLUDED.description;