-- Step 1: Add normalized columns first (without constraint)
ALTER TABLE books 
ADD COLUMN IF NOT EXISTS title_normalized TEXT GENERATED ALWAYS AS (LOWER(TRIM(title))) STORED,
ADD COLUMN IF NOT EXISTS author_normalized TEXT GENERATED ALWAYS AS (LOWER(TRIM(author))) STORED;

-- Step 2: Create index for performance
CREATE INDEX IF NOT EXISTS idx_books_normalized ON books(title_normalized, author_normalized, lang);

-- Step 3: Create deduplication function
CREATE OR REPLACE FUNCTION merge_duplicate_books()
RETURNS TABLE(
  kept_book_id UUID,
  deleted_count INTEGER,
  title TEXT,
  author TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  book_group RECORD;
  primary_book_id UUID;
  duplicate_ids UUID[];
  deleted_count_var INTEGER;
BEGIN
  FOR book_group IN 
    SELECT 
      title_normalized,
      author_normalized,
      lang,
      ARRAY_AGG(id ORDER BY created_at ASC) as book_ids,
      MIN(title) as original_title,
      MIN(author) as original_author
    FROM books
    WHERE is_active = true
    GROUP BY title_normalized, author_normalized, lang
    HAVING COUNT(*) > 1
  LOOP
    primary_book_id := book_group.book_ids[1];
    duplicate_ids := book_group.book_ids[2:array_length(book_group.book_ids, 1)];
    
    -- Update people_book_picks
    UPDATE people_book_picks
    SET book_id = primary_book_id
    WHERE book_id = ANY(duplicate_ids);
    
    -- Merge popularity
    UPDATE books
    SET popularity = (
      SELECT SUM(popularity)
      FROM books
      WHERE id = ANY(book_group.book_ids)
    ),
    updated_at = now()
    WHERE id = primary_book_id;
    
    -- Soft delete duplicates
    UPDATE books
    SET is_active = false,
        updated_at = now()
    WHERE id = ANY(duplicate_ids);
    
    deleted_count_var := array_length(duplicate_ids, 1);
    
    RETURN QUERY
    SELECT 
      primary_book_id,
      deleted_count_var,
      book_group.original_title,
      book_group.original_author;
  END LOOP;
END;
$$;