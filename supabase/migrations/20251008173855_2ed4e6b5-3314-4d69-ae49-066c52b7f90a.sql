-- Create book categories table
CREATE TABLE IF NOT EXISTS public.book_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  name_pt TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_es TEXT NOT NULL,
  description_pt TEXT,
  description_en TEXT,
  description_es TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.book_categories ENABLE ROW LEVEL SECURITY;

-- Anyone can view active categories
CREATE POLICY "Anyone can view active categories"
ON public.book_categories
FOR SELECT
USING (is_active = true);

-- Admins can manage categories
CREATE POLICY "Admins can manage categories"
ON public.book_categories
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert official categories based on bookCatalog.ts
INSERT INTO public.book_categories (key, name_pt, name_en, name_es, display_order) VALUES
  ('habits', 'Hábitos & Produtividade', 'Habits & Productivity', 'Hábitos & Productividad', 1),
  ('sleep', 'Saúde & Sono', 'Health & Sleep', 'Salud & Sueño', 2),
  ('psych', 'Psicologia & Mentalidade', 'Psychology & Mindset', 'Psicología & Mentalidad', 3),
  ('business', 'Negócios', 'Business', 'Negocios', 4),
  ('finance', 'Finanças', 'Finance', 'Finanzas', 5),
  ('leadership', 'Liderança', 'Leadership', 'Liderazgo', 6),
  ('marketing', 'Marketing', 'Marketing', 'Marketing', 7),
  ('career', 'Carreira', 'Career', 'Carrera', 8),
  ('communication', 'Comunicação', 'Communication', 'Comunicación', 9),
  ('creativity', 'Criatividade', 'Creativity', 'Creatividad', 10),
  ('biography', 'Biografia', 'Biography', 'Biografía', 11),
  ('strategy', 'Estratégia', 'Strategy', 'Estrategia', 12),
  ('technology', 'Tecnologia', 'Technology', 'Tecnología', 13),
  ('education', 'Educação', 'Education', 'Educación', 14),
  ('startup', 'Startups', 'Startups', 'Startups', 15),
  ('personal-dev', 'Desenvolvimento Pessoal', 'Personal Development', 'Desarrollo Personal', 16)
ON CONFLICT (key) DO NOTHING;