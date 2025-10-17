-- Improved merge_duplicate_books to detect title variations (with/without subtitle)
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
  -- Method 1: Exact normalized match (existing logic)
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
    
    UPDATE people_book_picks
    SET book_id = primary_book_id
    WHERE book_id = ANY(duplicate_ids);
    
    UPDATE books
    SET popularity = (
      SELECT SUM(b2.popularity)
      FROM books b2
      WHERE b2.id = ANY(book_group.book_ids)
    ),
    updated_at = now()
    WHERE id = primary_book_id;
    
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

  -- Method 2: Detect title variations (short title vs full title with subtitle)
  -- Find books where one title starts with another (at least 15 chars match)
  FOR book_group IN
    SELECT DISTINCT ON (b1.id)
      b1.id as primary_id,
      b1.title as primary_title,
      b1.author as primary_author,
      ARRAY_AGG(b2.id) as duplicate_book_ids
    FROM books b1
    INNER JOIN books b2 ON (
      b1.author_normalized = b2.author_normalized 
      AND b1.lang = b2.lang
      AND b1.id != b2.id
      AND b1.is_active = true 
      AND b2.is_active = true
      AND LENGTH(b1.title_normalized) >= 15
      AND (
        -- b2 title starts with b1 (b1 is shorter)
        (b2.title_normalized LIKE b1.title_normalized || '%' AND LENGTH(b2.title_normalized) > LENGTH(b1.title_normalized))
        OR
        -- b1 title starts with b2 (b2 is shorter)  
        (b1.title_normalized LIKE b2.title_normalized || '%' AND LENGTH(b1.title_normalized) > LENGTH(b2.title_normalized))
      )
    )
    WHERE b1.created_at <= b2.created_at  -- Keep the older one
    GROUP BY b1.id, b1.title, b1.author, b1.created_at
    HAVING COUNT(b2.id) > 0
    ORDER BY b1.id, b1.created_at ASC
  LOOP
    primary_book_id := book_group.primary_id;
    duplicate_ids := book_group.duplicate_book_ids;
    
    UPDATE people_book_picks
    SET book_id = primary_book_id
    WHERE book_id = ANY(duplicate_ids);
    
    UPDATE books
    SET popularity = (
      SELECT SUM(b2.popularity)
      FROM books b2
      WHERE b2.id = primary_book_id OR b2.id = ANY(duplicate_ids)
    ),
    updated_at = now()
    WHERE id = primary_book_id;
    
    UPDATE books
    SET is_active = false,
        updated_at = now()
    WHERE id = ANY(duplicate_ids) AND is_active = true;
    
    GET DIAGNOSTICS deleted_count_var = ROW_COUNT;
    
    IF deleted_count_var > 0 THEN
      RETURN QUERY
      SELECT 
        primary_book_id,
        deleted_count_var,
        book_group.primary_title,
        book_group.primary_author;
    END IF;
  END LOOP;
END;
$$;