-- Backfill summaries count and award retroactive XP
DO $$
DECLARE
  user_record RECORD;
  summary_count INTEGER;
  xp_to_add INTEGER;
BEGIN
  FOR user_record IN SELECT id FROM profiles LOOP
    -- Count existing summaries for this user
    SELECT COUNT(*) INTO summary_count
    FROM book_summaries
    WHERE user_id = user_record.id;
    
    -- Calculate XP to add (20 XP per summary)
    xp_to_add := summary_count * 20;
    
    -- Update profile with summary count and XP
    IF summary_count > 0 THEN
      UPDATE profiles
      SET 
        total_summaries_generated = summary_count,
        xp = xp + xp_to_add,
        updated_at = now()
      WHERE id = user_record.id;
      
      -- Log the retroactive XP
      INSERT INTO xp_log (user_id, event_type, xp_earned)
      VALUES (user_record.id, 'retroactive_summaries', xp_to_add);
      
      -- Recalculate level based on new XP
      DECLARE
        new_xp INTEGER;
        new_level TEXT;
      BEGIN
        SELECT xp INTO new_xp FROM profiles WHERE id = user_record.id;
        
        IF new_xp >= 5000 THEN
          new_level := 'Enlightened';
        ELSIF new_xp >= 1500 THEN
          new_level := 'Master';
        ELSIF new_xp >= 500 THEN
          new_level := 'Thinker';
        ELSIF new_xp >= 100 THEN
          new_level := 'Learner';
        ELSE
          new_level := 'Beginner';
        END IF;
        
        UPDATE profiles SET level = new_level WHERE id = user_record.id;
      END;
      
      -- Check for achievements
      PERFORM check_achievements(user_record.id);
    END IF;
  END LOOP;
END $$;