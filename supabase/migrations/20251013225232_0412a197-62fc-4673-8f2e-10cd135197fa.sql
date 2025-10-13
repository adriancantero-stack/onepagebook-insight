-- Add column to track total summaries generated
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS total_summaries_generated integer DEFAULT 0 NOT NULL;

-- Create function to increment summaries generated and award XP
CREATE OR REPLACE FUNCTION public.increment_summaries_generated(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Increment summaries counter
  UPDATE profiles
  SET total_summaries_generated = total_summaries_generated + 1,
      updated_at = now()
  WHERE id = p_user_id;
  
  -- Award XP for generating a summary (20 XP)
  PERFORM add_xp(p_user_id, 'summary_generated', 20);
  
  -- Check for achievements
  PERFORM check_achievements(p_user_id);
END;
$$;