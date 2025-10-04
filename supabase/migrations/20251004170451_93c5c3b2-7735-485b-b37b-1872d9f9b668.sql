-- Fix the return type issue - use double precision instead of float
DROP FUNCTION IF EXISTS public.search_books(text, text, int);

CREATE OR REPLACE FUNCTION public.search_books(
  search_query text,
  search_lang text,
  result_limit int DEFAULT 8
)
RETURNS TABLE (
  id uuid,
  title text,
  author text,
  lang text,
  cover_url text,
  popularity int
)
LANGUAGE plpgsql
STABLE
SET search_path = public
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
      -- Very permissive matching - lower threshold to 0.1 for more results
      normalize_text(b.title) LIKE '%' || normalize_text(search_query) || '%'
      OR normalize_text(b.author) LIKE '%' || normalize_text(search_query) || '%'
      OR similarity(normalize_text(b.title), normalize_text(search_query)) > 0.1
      OR similarity(normalize_text(b.author), normalize_text(search_query)) > 0.1
    )
  ORDER BY 
    -- Prioritize exact prefix matches
    CASE 
      WHEN normalize_text(b.title) LIKE normalize_text(search_query) || '%' THEN 1
      WHEN normalize_text(b.author) LIKE normalize_text(search_query) || '%' THEN 2
      ELSE 3
    END,
    -- Then by similarity score
    GREATEST(
      similarity(normalize_text(b.title), normalize_text(search_query)),
      similarity(normalize_text(b.author), normalize_text(search_query))
    ) DESC,
    -- Finally by popularity
    b.popularity DESC
  LIMIT result_limit;
END;
$$;