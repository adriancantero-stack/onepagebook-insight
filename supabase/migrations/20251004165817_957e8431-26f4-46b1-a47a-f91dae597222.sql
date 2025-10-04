-- Enable unaccent extension for accent-insensitive search
CREATE EXTENSION IF NOT EXISTS unaccent SCHEMA public;

-- Create a function to normalize text (remove accents, lowercase)
CREATE OR REPLACE FUNCTION public.normalize_text(text)
RETURNS text
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
  SELECT lower(public.unaccent($1));
$$;

-- Create indexes using the normalize function for better search
CREATE INDEX IF NOT EXISTS idx_books_title_normalized ON public.books (public.normalize_text(title));
CREATE INDEX IF NOT EXISTS idx_books_author_normalized ON public.books (public.normalize_text(author));