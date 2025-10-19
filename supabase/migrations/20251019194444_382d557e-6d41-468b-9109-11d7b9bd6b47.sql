-- Create table to track daily reminder emails sent
CREATE TABLE IF NOT EXISTS public.daily_reminder_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  sent_date DATE NOT NULL DEFAULT CURRENT_DATE,
  success BOOLEAN NOT NULL DEFAULT true,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index for quick lookups
CREATE INDEX idx_daily_reminder_log_user_date ON public.daily_reminder_log(user_id, sent_date);
CREATE INDEX idx_daily_reminder_log_sent_date ON public.daily_reminder_log(sent_date);

-- Enable RLS
ALTER TABLE public.daily_reminder_log ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own reminder logs
CREATE POLICY "Users can view own reminder logs"
  ON public.daily_reminder_log
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: System can insert reminder logs
CREATE POLICY "System can insert reminder logs"
  ON public.daily_reminder_log
  FOR INSERT
  WITH CHECK (true);

-- Policy: Admins can view all logs
CREATE POLICY "Admins can view all reminder logs"
  ON public.daily_reminder_log
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));