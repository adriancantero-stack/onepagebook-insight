-- Add ASIN column to book_summaries table for Amazon affiliate links
ALTER TABLE public.book_summaries 
ADD COLUMN asin TEXT;