-- Fix security warnings: Set search_path for functions
-- This prevents potential security issues with function search path

-- Fix add_xp function
DROP FUNCTION IF EXISTS add_xp(UUID, TEXT, INTEGER);
CREATE OR REPLACE FUNCTION add_xp(p_user_id UUID, p_event_type TEXT, p_xp INTEGER)
RETURNS TABLE(new_xp INTEGER, new_level TEXT, leveled_up BOOLEAN) AS $$
DECLARE
  v_old_xp INTEGER;
  v_new_xp INTEGER;
  v_old_level TEXT;
  v_new_level TEXT;
  v_leveled_up BOOLEAN := false;
BEGIN
  SELECT xp, level INTO v_old_xp, v_old_level
  FROM profiles 
  WHERE id = p_user_id;
  
  UPDATE profiles 
  SET xp = xp + p_xp,
      updated_at = now()
  WHERE id = p_user_id
  RETURNING xp INTO v_new_xp;
  
  INSERT INTO xp_log (user_id, event_type, xp_earned)
  VALUES (p_user_id, p_event_type, p_xp);
  
  IF v_new_xp >= 5000 THEN
    v_new_level := 'Enlightened';
  ELSIF v_new_xp >= 1500 THEN
    v_new_level := 'Master';
  ELSIF v_new_xp >= 500 THEN
    v_new_level := 'Thinker';
  ELSIF v_new_xp >= 100 THEN
    v_new_level := 'Learner';
  ELSE
    v_new_level := 'Beginner';
  END IF;
  
  IF v_new_level != v_old_level THEN
    v_leveled_up := true;
    
    UPDATE profiles 
    SET level = v_new_level 
    WHERE id = p_user_id;
    
    IF v_new_level != 'Beginner' THEN
      INSERT INTO xp_log (user_id, event_type, xp_earned)
      VALUES (p_user_id, 'level_up', 100);
      
      UPDATE profiles 
      SET xp = xp + 100
      WHERE id = p_user_id
      RETURNING xp INTO v_new_xp;
    END IF;
  END IF;
  
  RETURN QUERY SELECT v_new_xp, v_new_level, v_leveled_up;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Fix check_achievements function
DROP FUNCTION IF EXISTS check_achievements(UUID);
CREATE OR REPLACE FUNCTION check_achievements(p_user_id UUID)
RETURNS TABLE(achievement_id UUID, achievement_name TEXT, xp_reward INTEGER) AS $$
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
         OR (v_achievement.requirement_type = 'premium' AND v_subscription_active = true) THEN
        
        INSERT INTO user_achievements (user_id, achievement_id) 
        VALUES (p_user_id, v_achievement.id);
        
        PERFORM add_xp(p_user_id, 'achievement_unlocked', v_achievement.xp_reward);
        
        RETURN QUERY SELECT v_achievement.id, v_achievement.name, v_achievement.xp_reward;
      END IF;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Fix increment_book_read function
DROP FUNCTION IF EXISTS increment_book_read(UUID);
CREATE OR REPLACE FUNCTION increment_book_read(p_user_id UUID)
RETURNS void AS $$
DECLARE
  v_last_read DATE;
  v_today DATE := CURRENT_DATE;
BEGIN
  SELECT last_read_date INTO v_last_read
  FROM profiles
  WHERE id = p_user_id;
  
  UPDATE profiles
  SET total_books_read = total_books_read + 1,
      last_read_date = v_today,
      updated_at = now()
  WHERE id = p_user_id;
  
  IF v_last_read IS NULL THEN
    UPDATE profiles SET streak_days = 1 WHERE id = p_user_id;
  ELSIF v_last_read = v_today - 1 THEN
    UPDATE profiles SET streak_days = streak_days + 1 WHERE id = p_user_id;
  ELSIF v_last_read < v_today - 1 THEN
    UPDATE profiles SET streak_days = 1 WHERE id = p_user_id;
  END IF;
  
  PERFORM check_achievements(p_user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;