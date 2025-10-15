-- Create table to track premium conversion emails sent
CREATE TABLE IF NOT EXISTS public.premium_conversion_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_type TEXT NOT NULL CHECK (email_type IN ('day_3', 'day_5', 'day_7')),
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, email_type)
);

-- Enable RLS
ALTER TABLE public.premium_conversion_emails ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own conversion emails
CREATE POLICY "Users can view own conversion emails"
ON public.premium_conversion_emails
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: System can insert conversion emails (for edge function)
CREATE POLICY "System can insert conversion emails"
ON public.premium_conversion_emails
FOR INSERT
WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_premium_conversion_emails_user_type 
ON public.premium_conversion_emails(user_id, email_type);

CREATE INDEX idx_premium_conversion_emails_sent_at 
ON public.premium_conversion_emails(sent_at DESC);

-- Update cron schedule for premium conversion emails (runs at 18:00 daily)
INSERT INTO public.cron_schedules (
  job_name,
  cron_expression,
  description,
  next_run_at
) VALUES (
  'send-premium-conversion-emails',
  '0 18 * * *',
  'Send premium conversion emails to free users at 6 PM daily',
  calculate_next_cron_run('0 18 * * *', now())
)
ON CONFLICT (job_name) 
DO UPDATE SET
  cron_expression = '0 18 * * *',
  description = 'Send premium conversion emails to free users at 6 PM daily',
  next_run_at = calculate_next_cron_run('0 18 * * *', now());