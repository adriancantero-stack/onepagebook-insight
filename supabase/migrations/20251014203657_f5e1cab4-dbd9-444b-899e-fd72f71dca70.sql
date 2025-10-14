-- Drop and recreate merge_duplicate_books function
DROP FUNCTION IF EXISTS merge_duplicate_books();

CREATE FUNCTION merge_duplicate_books()
RETURNS TABLE(
  kept_book_id UUID,
  deleted_count INTEGER,
  book_title TEXT,
  book_author TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  book_group RECORD;
  primary_book_id UUID;
  duplicate_ids UUID[];
  deleted_count_var INTEGER;
BEGIN
  FOR book_group IN 
    SELECT 
      b.title_normalized,
      b.author_normalized,
      b.lang,
      ARRAY_AGG(b.id ORDER BY b.created_at ASC) as book_ids,
      MIN(b.title) as original_title,
      MIN(b.author) as original_author
    FROM books b
    WHERE b.is_active = true
    GROUP BY b.title_normalized, b.author_normalized, b.lang
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
      SELECT SUM(b2.popularity)
      FROM books b2
      WHERE b2.id = ANY(book_group.book_ids)
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