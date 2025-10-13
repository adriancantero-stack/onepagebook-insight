-- Update check_achievements function to include summaries_generated
CREATE OR REPLACE FUNCTION public.check_achievements(p_user_id uuid)
RETURNS TABLE(achievement_id uuid, achievement_name text, xp_reward integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_profile RECORD;
  v_achievement RECORD;
  v_subscription_active BOOLEAN;
BEGIN
  SELECT * INTO v_profile FROM profiles WHERE id = p_user_id;
  
  SELECT EXISTS (
    SELECT 1 FROM user_subscriptions us
    JOIN subscription_plans sp ON us.plan_id = sp.id
    WHERE us.user_id = p_user_id
    AND us.status = 'active'
    AND sp.type = 'premium'
  ) INTO v_subscription_active;
  
  FOR v_achievement IN SELECT * FROM achievements LOOP
    IF NOT EXISTS (
      SELECT 1 FROM user_achievements 
      WHERE user_id = p_user_id AND user_achievements.achievement_id = v_achievement.id
    ) THEN
      IF (v_achievement.requirement_type = 'books_read' AND v_profile.total_books_read >= v_achievement.requirement_value)
         OR (v_achievement.requirement_type = 'streak_days' AND v_profile.streak_days >= v_achievement.requirement_value)
         OR (v_achievement.requirement_type = 'summaries_generated' AND v_profile.total_summaries_generated >= v_achievement.requirement_value)
         OR (v_achievement.requirement_type = 'premium' AND v_subscription_active = true) THEN
        
        INSERT INTO user_achievements (user_id, achievement_id) 
        VALUES (p_user_id, v_achievement.id);
        
        PERFORM add_xp(p_user_id, 'achievement_unlocked', v_achievement.xp_reward);
        
        RETURN QUERY SELECT v_achievement.id, v_achievement.name, v_achievement.xp_reward;
      END IF;
    END IF;
  END LOOP;
END;
$$;