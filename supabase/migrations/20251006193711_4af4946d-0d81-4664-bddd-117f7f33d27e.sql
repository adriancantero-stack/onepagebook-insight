-- Add new fields to books table for Google Books integration
ALTER TABLE public.books
ADD COLUMN IF NOT EXISTS google_books_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS isbn TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS published_year INTEGER,
ADD COLUMN IF NOT EXISTS page_count INTEGER;

-- Create index for deduplication
CREATE INDEX IF NOT EXISTS idx_books_normalized_search 
ON public.books (lang, normalize_text(title), normalize_text(author));

-- Add comment for documentation
COMMENT ON COLUMN public.books.google_books_id IS 'Google Books unique identifier';
COMMENT ON COLUMN public.books.isbn IS 'ISBN when available from Google Books';
COMMENT ON COLUMN public.books.description IS 'Book description/synopsis';
COMMENT ON COLUMN public.books.category IS 'Primary book category';
COMMENT ON COLUMN public.books.published_year IS 'Year of publication';
COMMENT ON COLUMN public.books.page_count IS 'Number of pages';