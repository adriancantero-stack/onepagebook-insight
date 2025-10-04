
-- Drop and recreate the search_books function with better text normalization
DROP FUNCTION IF EXISTS public.search_books(text, text, integer);

CREATE OR REPLACE FUNCTION public.search_books(
  search_query text,
  search_lang text,
  result_limit integer DEFAULT 8
)
RETURNS TABLE(
  id uuid,
  title text,
  author text,
  lang text,
  cover_url text,
  popularity integer
)
LANGUAGE plpgsql
STABLE
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id,
    b.title,
    b.author,
    b.lang,
    b.cover_url,
    b.popularity
  FROM public.books b
  WHERE 
    b.is_active = true
    AND b.lang = search_lang
    AND (
      -- Use unaccent for better matching with accented characters
      unaccent(LOWER(b.title)) LIKE '%' || unaccent(LOWER(search_query)) || '%'
      OR unaccent(LOWER(b.author)) LIKE '%' || unaccent(LOWER(search_query)) || '%'
      OR similarity(unaccent(LOWER(b.title)), unaccent(LOWER(search_query))) > 0.1
      OR similarity(unaccent(LOWER(b.author)), unaccent(LOWER(search_query))) > 0.1
    )
  ORDER BY 
    -- Prioritize exact prefix matches
    CASE 
      WHEN unaccent(LOWER(b.title)) LIKE unaccent(LOWER(search_query)) || '%' THEN 1
      WHEN unaccent(LOWER(b.author)) LIKE unaccent(LOWER(search_query)) || '%' THEN 2
      ELSE 3
    END,
    -- Then by similarity score
    GREATEST(
      similarity(unaccent(LOWER(b.title)), unaccent(LOWER(search_query))),
      similarity(unaccent(LOWER(b.author)), unaccent(LOWER(search_query)))
    ) DESC,
    -- Finally by popularity
    b.popularity DESC
  LIMIT result_limit;
END;
$$;
