-- ============================================
-- ONEPAGEBOOK.AI V2.0 - FASE 1: GAMIFICAÇÃO
-- ============================================

-- 1. Expandir tabela profiles com campos de gamificação
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS level TEXT DEFAULT 'Beginner';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_books_read INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS streak_days INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_read_date DATE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS photo_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'UTC';

-- 2. Criar tabela xp_log para rastrear ganhos de XP
CREATE TABLE IF NOT EXISTS xp_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  xp_earned INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Criar tabela achievements (conquistas disponíveis)
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  xp_reward INTEGER DEFAULT 0,
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Criar tabela user_achievements (conquistas desbloqueadas por usuário)
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- 5. Habilitar RLS nas novas tabelas
ALTER TABLE xp_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- 6. Políticas RLS para xp_log
CREATE POLICY "Users can view own XP log"
  ON xp_log FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own XP log"
  ON xp_log FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 7. Políticas RLS para achievements
CREATE POLICY "Everyone can view achievements"
  ON achievements FOR SELECT
  USING (true);

-- 8. Políticas RLS para user_achievements
CREATE POLICY "Users can view own achievements"
  ON user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON user_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 9. Inserir conquistas básicas
INSERT INTO achievements (name, description, icon, xp_reward, requirement_type, requirement_value) VALUES
('Primeira Leitura', 'Complete seu primeiro resumo', '🏅', 10, 'books_read', 1),
('Leitor Dedicado', 'Leia 5 resumos', '📚', 50, 'books_read', 5),
('Bibliófilo', 'Leia 10 resumos', '📖', 100, 'books_read', 10),
('Explorador Premium', 'Torne-se um membro Premium', '💎', 100, 'premium', 1),
('Sequência de 7 Dias', 'Leia por 7 dias consecutivos', '🔥', 50, 'streak_days', 7),
('Sequência de 30 Dias', 'Leia por 30 dias consecutivos', '⚡', 200, 'streak_days', 30)
ON CONFLICT DO NOTHING;

-- 10. Função para adicionar XP e verificar level-up
CREATE OR REPLACE FUNCTION add_xp(p_user_id UUID, p_event_type TEXT, p_xp INTEGER)
RETURNS TABLE(new_xp INTEGER, new_level TEXT, leveled_up BOOLEAN) AS $$
DECLARE
  v_old_xp INTEGER;
  v_new_xp INTEGER;
  v_old_level TEXT;
  v_new_level TEXT;
  v_leveled_up BOOLEAN := false;
BEGIN
  -- Buscar XP e nível atuais
  SELECT xp, level INTO v_old_xp, v_old_level
  FROM profiles 
  WHERE id = p_user_id;
  
  -- Adicionar XP
  UPDATE profiles 
  SET xp = xp + p_xp,
      updated_at = now()
  WHERE id = p_user_id
  RETURNING xp INTO v_new_xp;
  
  -- Registrar no log
  INSERT INTO xp_log (user_id, event_type, xp_earned)
  VALUES (p_user_id, p_event_type, p_xp);
  
  -- Calcular novo nível
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
  
  -- Verificar se subiu de nível
  IF v_new_level != v_old_level THEN
    v_leveled_up := true;
    
    -- Atualizar nível
    UPDATE profiles 
    SET level = v_new_level 
    WHERE id = p_user_id;
    
    -- Dar XP bonus por level-up
    IF v_new_level != 'Beginner' THEN
      INSERT INTO xp_log (user_id, event_type, xp_earned)
      VALUES (p_user_id, 'level_up', 100);
      
      UPDATE profiles 
      SET xp = xp + 100
      WHERE id = p_user_id
      RETURNING xp INTO v_new_xp;
    END IF;
  END IF;
  
  -- Retornar resultados
  RETURN QUERY SELECT v_new_xp, v_new_level, v_leveled_up;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. Função para verificar e desbloquear conquistas
CREATE OR REPLACE FUNCTION check_achievements(p_user_id UUID)
RETURNS TABLE(achievement_id UUID, achievement_name TEXT, xp_reward INTEGER) AS $$
DECLARE
  v_profile RECORD;
  v_achievement RECORD;
  v_subscription_active BOOLEAN;
BEGIN
  -- Buscar dados do usuário
  SELECT * INTO v_profile FROM profiles WHERE id = p_user_id;
  
  -- Verificar se tem assinatura ativa
  SELECT EXISTS (
    SELECT 1 FROM user_subscriptions us
    JOIN subscription_plans sp ON us.plan_id = sp.id
    WHERE us.user_id = p_user_id
    AND us.status = 'active'
    AND sp.type = 'premium'
  ) INTO v_subscription_active;
  
  -- Verificar cada conquista
  FOR v_achievement IN SELECT * FROM achievements LOOP
    -- Verificar se já tem
    IF NOT EXISTS (
      SELECT 1 FROM user_achievements 
      WHERE user_id = p_user_id AND achievement_id = v_achievement.id
    ) THEN
      -- Verificar requisito
      IF (v_achievement.requirement_type = 'books_read' AND v_profile.total_books_read >= v_achievement.requirement_value)
         OR (v_achievement.requirement_type = 'streak_days' AND v_profile.streak_days >= v_achievement.requirement_value)
         OR (v_achievement.requirement_type = 'premium' AND v_subscription_active = true) THEN
        
        -- Desbloquear
        INSERT INTO user_achievements (user_id, achievement_id) 
        VALUES (p_user_id, v_achievement.id);
        
        -- Dar XP de recompensa
        PERFORM add_xp(p_user_id, 'achievement_unlocked', v_achievement.xp_reward);
        
        -- Retornar conquista desbloqueada
        RETURN QUERY SELECT v_achievement.id, v_achievement.name, v_achievement.xp_reward;
      END IF;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. Função para incrementar livros lidos e atualizar streak
CREATE OR REPLACE FUNCTION increment_book_read(p_user_id UUID)
RETURNS void AS $$
DECLARE
  v_last_read DATE;
  v_today DATE := CURRENT_DATE;
BEGIN
  -- Buscar última leitura
  SELECT last_read_date INTO v_last_read
  FROM profiles
  WHERE id = p_user_id;
  
  -- Incrementar total de livros
  UPDATE profiles
  SET total_books_read = total_books_read + 1,
      last_read_date = v_today,
      updated_at = now()
  WHERE id = p_user_id;
  
  -- Atualizar streak
  IF v_last_read IS NULL THEN
    -- Primeira leitura
    UPDATE profiles SET streak_days = 1 WHERE id = p_user_id;
  ELSIF v_last_read = v_today - 1 THEN
    -- Continuou o streak
    UPDATE profiles SET streak_days = streak_days + 1 WHERE id = p_user_id;
  ELSIF v_last_read < v_today - 1 THEN
    -- Perdeu o streak
    UPDATE profiles SET streak_days = 1 WHERE id = p_user_id;
  END IF;
  
  -- Verificar conquistas
  PERFORM check_achievements(p_user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;