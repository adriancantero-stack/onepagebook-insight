-- Enable pg_trgm extension for fuzzy search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create Books table for catalog
CREATE TABLE IF NOT EXISTS public.books (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  lang TEXT NOT NULL CHECK (lang IN ('pt', 'en', 'es')),
  tags TEXT[] DEFAULT '{}',
  cover_url TEXT,
  is_active BOOLEAN DEFAULT true,
  popularity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for search performance
CREATE INDEX IF NOT EXISTS idx_books_title_trgm ON public.books USING gin (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_books_author_trgm ON public.books USING gin (author gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_books_lang ON public.books (lang);
CREATE INDEX IF NOT EXISTS idx_books_is_active ON public.books (is_active);
CREATE INDEX IF NOT EXISTS idx_books_popularity ON public.books (popularity DESC);

-- Enable RLS
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read active books
CREATE POLICY "Anyone can view active books"
ON public.books
FOR SELECT
USING (is_active = true);

-- Only admins can manage books
CREATE POLICY "Admins can manage books"
ON public.books
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Insert some sample books
INSERT INTO public.books (title, author, lang, tags, popularity) VALUES
('Atomic Habits', 'James Clear', 'en', ARRAY['productivity', 'habits'], 100),
('The Power of Habit', 'Charles Duhigg', 'en', ARRAY['productivity', 'habits'], 90),
('Deep Work', 'Cal Newport', 'en', ARRAY['productivity', 'focus'], 85),
('Hábitos Atômicos', 'James Clear', 'pt', ARRAY['produtividade', 'hábitos'], 100),
('O Poder do Hábito', 'Charles Duhigg', 'pt', ARRAY['produtividade', 'hábitos'], 90),
('Trabalho Focado', 'Cal Newport', 'pt', ARRAY['produtividade', 'foco'], 85),
('Hábitos Atómicos', 'James Clear', 'es', ARRAY['productividad', 'hábitos'], 100),
('El Poder de los Hábitos', 'Charles Duhigg', 'es', ARRAY['productividad', 'hábitos'], 90),
('Enfoque Profundo', 'Cal Newport', 'es', ARRAY['productividad', 'enfoque'], 85)
ON CONFLICT DO NOTHING;