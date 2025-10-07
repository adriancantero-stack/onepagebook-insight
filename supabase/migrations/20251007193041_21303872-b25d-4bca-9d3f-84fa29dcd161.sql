-- Add ASIN column to books table for Amazon affiliate links
ALTER TABLE public.books 
ADD COLUMN IF NOT EXISTS asin text;

COMMENT ON COLUMN public.books.asin IS 'Amazon Standard Identification Number for affiliate links';