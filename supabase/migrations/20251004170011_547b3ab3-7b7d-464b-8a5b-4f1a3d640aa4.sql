-- Create a function for intelligent book search with fuzzy matching and accent insensitivity
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
  popularity int,
  similarity_score float
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
    b.popularity,
    -- Calculate similarity score (0-1) using pg_trgm
    GREATEST(
      similarity(normalize_text(b.title), normalize_text(search_query)),
      similarity(normalize_text(b.author), normalize_text(search_query))
    ) as similarity_score
  FROM public.books b
  WHERE 
    b.is_active = true
    AND b.lang = search_lang
    AND (
      -- Exact match (normalized)
      normalize_text(b.title) LIKE '%' || normalize_text(search_query) || '%'
      OR normalize_text(b.author) LIKE '%' || normalize_text(search_query) || '%'
      -- OR fuzzy match using trigram similarity (threshold 0.3)
      OR similarity(normalize_text(b.title), normalize_text(search_query)) > 0.3
      OR similarity(normalize_text(b.author), normalize_text(search_query)) > 0.3
    )
  ORDER BY 
    -- Prioritize exact prefix matches
    CASE 
      WHEN normalize_text(b.title) LIKE normalize_text(search_query) || '%' THEN 1
      WHEN normalize_text(b.author) LIKE normalize_text(search_query) || '%' THEN 2
      ELSE 3
    END,
    -- Then by similarity score
    similarity_score DESC,
    -- Finally by popularity
    b.popularity DESC
  LIMIT result_limit;
END;
$$;