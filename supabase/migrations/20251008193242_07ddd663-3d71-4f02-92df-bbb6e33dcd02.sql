-- Add cover_url column to book_summaries table
ALTER TABLE book_summaries 
ADD COLUMN IF NOT EXISTS cover_url TEXT;