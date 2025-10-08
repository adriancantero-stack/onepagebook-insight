-- Add new book categories
INSERT INTO public.book_categories (key, name_pt, name_en, name_es, display_order, is_active, description_pt, description_en, description_es)
VALUES 
  -- Fiction categories
  ('fiction', 'Ficção', 'Fiction', 'Ficción', 17, true, 'Romance, fantasia e ficção em geral', 'Romance, fantasy and general fiction', 'Romance, fantasía y ficción en general'),
  ('romance', 'Romance', 'Romance', 'Romance', 18, true, 'Romance e amor', 'Romance and love stories', 'Romance y amor'),
  ('thriller', 'Suspense & Mistério', 'Thriller & Mystery', 'Suspenso & Misterio', 19, true, 'Suspense, thriller e mistério', 'Thriller, suspense and mystery', 'Suspenso, thriller y misterio'),
  ('fantasy', 'Fantasia & Ficção Científica', 'Fantasy & Sci-Fi', 'Fantasía & Ciencia Ficción', 20, true, 'Fantasia, ficção científica e realismo mágico', 'Fantasy, science fiction and magical realism', 'Fantasía, ciencia ficción y realismo mágico'),
  
  -- Health and wellness
  ('wellness', 'Bem-estar & Fitness', 'Wellness & Fitness', 'Bienestar & Fitness', 21, true, 'Saúde, bem-estar e fitness', 'Health, wellness and fitness', 'Salud, bienestar y fitness'),
  
  -- Culture and history
  ('history', 'História & Cultura', 'History & Culture', 'Historia & Cultura', 22, true, 'História, cultura e ensaios históricos', 'History, culture and historical essays', 'Historia, cultura y ensayos históricos'),
  
  -- Innovation and science
  ('science', 'Ciência & Inovação', 'Science & Innovation', 'Ciencia & Innovación', 23, true, 'Ciência, pesquisa e inovação', 'Science, research and innovation', 'Ciencia, investigación e innovación')
ON CONFLICT (key) DO NOTHING;