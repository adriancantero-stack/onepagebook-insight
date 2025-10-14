-- Step 1: Create unique constraint to prevent future duplicates
CREATE UNIQUE INDEX IF NOT EXISTS idx_books_unique_normalized 
ON books(title_normalized, author_normalized, lang) 
WHERE is_active = true;

-- Step 2: Create function to safely insert or get book (upsert)
CREATE OR REPLACE FUNCTION upsert_book(
  p_title TEXT,
  p_author TEXT,
  p_lang TEXT,
  p_tags TEXT[] DEFAULT '{}',
  p_cover_url TEXT DEFAULT NULL,
  p_description TEXT DEFAULT NULL,
  p_category TEXT DEFAULT NULL,
  p_asin TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_book_id UUID;
  v_title_normalized TEXT;
  v_author_normalized TEXT;
BEGIN
  v_title_normalized := LOWER(TRIM(p_title));
  v_author_normalized := LOWER(TRIM(p_author));
  
  -- Try to find existing book
  SELECT id INTO v_book_id
  FROM books
  WHERE title_normalized = v_title_normalized
    AND author_normalized = v_author_normalized
    AND lang = p_lang
    AND is_active = true
  LIMIT 1;
  
  IF v_book_id IS NOT NULL THEN
    -- Update existing book (merge data)
    UPDATE books
    SET 
      popularity = popularity + 1,
      tags = CASE 
        WHEN p_tags IS NOT NULL AND array_length(p_tags, 1) > 0 
        THEN array(SELECT DISTINCT unnest(tags || p_tags))
        ELSE tags
      END,
      cover_url = COALESCE(p_cover_url, cover_url),
      description = COALESCE(p_description, description),
      category = COALESCE(p_category, category),
      asin = COALESCE(p_asin, asin),
      updated_at = now()
    WHERE id = v_book_id;
    
    RETURN v_book_id;
  ELSE
    -- Insert new book
    INSERT INTO books (
      title, 
      author, 
      lang, 
      tags, 
      cover_url, 
      description, 
      category, 
      asin,
      popularity
    )
    VALUES (
      p_title,
      p_author,
      p_lang,
      COALESCE(p_tags, '{}'),
      p_cover_url,
      p_description,
      p_category,
      p_asin,
      1
    )
    RETURNING id INTO v_book_id;
    
    RETURN v_book_id;
  END IF;
END;
$$;