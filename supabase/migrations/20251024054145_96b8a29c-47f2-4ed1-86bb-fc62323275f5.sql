-- Create analytics events table
CREATE TABLE IF NOT EXISTS public.user_analytics_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT,
  event_type TEXT NOT NULL,
  event_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for fast queries
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON public.user_analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON public.user_analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON public.user_analytics_events(user_id);

-- Enable RLS
ALTER TABLE public.user_analytics_events ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert events (anonymous tracking)
CREATE POLICY "Anyone can insert analytics events"
ON public.user_analytics_events
FOR INSERT
WITH CHECK (true);

-- Admins can view all events
CREATE POLICY "Admins can view all analytics events"
ON public.user_analytics_events
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Users can view own events
CREATE POLICY "Users can view own analytics events"
ON public.user_analytics_events
FOR SELECT
USING (auth.uid() = user_id);