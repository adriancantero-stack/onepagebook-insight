-- Add new columns to book_summaries table
ALTER TABLE public.book_summaries
  ADD COLUMN IF NOT EXISTS user_title TEXT,
  ADD COLUMN IF NOT EXISTS user_author TEXT,
  ADD COLUMN IF NOT EXISTS canonical_title TEXT,
  ADD COLUMN IF NOT EXISTS canonical_author TEXT,
  ADD COLUMN IF NOT EXISTS year INTEGER,
  ADD COLUMN IF NOT EXISTS source TEXT,
  ADD COLUMN IF NOT EXISTS one_liner TEXT,
  ADD COLUMN IF NOT EXISTS key_ideas TEXT[],
  ADD COLUMN IF NOT EXISTS actions TEXT[],
  ADD COLUMN IF NOT EXISTS routine TEXT,
  ADD COLUMN IF NOT EXISTS plan_7_days TEXT,
  ADD COLUMN IF NOT EXISTS metrics TEXT,
  ADD COLUMN IF NOT EXISTS pitfalls TEXT,
  ADD COLUMN IF NOT EXISTS closing TEXT,
  ADD COLUMN IF NOT EXISTS theme TEXT;

-- Update existing columns names for consistency (create new ones if needed)
-- We'll keep the old columns for backwards compatibility but use new ones going forward