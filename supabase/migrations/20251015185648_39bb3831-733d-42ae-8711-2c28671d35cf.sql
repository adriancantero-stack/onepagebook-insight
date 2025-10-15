-- Create table to track first-time audio plays per user
CREATE TABLE IF NOT EXISTS public.user_audio_plays (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  book_summary_id UUID NOT NULL,
  played_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, book_summary_id)
);

-- Enable RLS
ALTER TABLE public.user_audio_plays ENABLE ROW LEVEL SECURITY;

-- Users can view their own audio plays
CREATE POLICY "Users can view own audio plays"
ON public.user_audio_plays
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own audio plays
CREATE POLICY "Users can insert own audio plays"
ON public.user_audio_plays
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create index for performance
CREATE INDEX idx_user_audio_plays_user_summary ON public.user_audio_plays(user_id, book_summary_id);