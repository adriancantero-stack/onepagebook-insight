-- Add achievements for summaries generated (using INSERT without ON CONFLICT)
INSERT INTO public.achievements (name, description, icon, requirement_type, requirement_value, xp_reward)
SELECT * FROM (VALUES 
  ('Primeiro Resumo', 'Gere seu primeiro resumo', '📝', 'summaries_generated', 1, 10),
  ('Explorador', 'Gere 5 resumos diferentes', '🔍', 'summaries_generated', 5, 25),
  ('Estudioso', 'Gere 10 resumos', '📚', 'summaries_generated', 10, 50),
  ('Conhecedor', 'Gere 25 resumos', '🎓', 'summaries_generated', 25, 100),
  ('Mestre do Conhecimento', 'Gere 50 resumos', '👑', 'summaries_generated', 50, 200)
) AS new_achievements(name, description, icon, requirement_type, requirement_value, xp_reward)
WHERE NOT EXISTS (
  SELECT 1 FROM public.achievements 
  WHERE achievements.name = new_achievements.name
);