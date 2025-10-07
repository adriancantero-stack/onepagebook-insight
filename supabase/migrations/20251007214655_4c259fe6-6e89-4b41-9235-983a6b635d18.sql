-- Create extensions schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS extensions;

-- Move pg_trgm extension to extensions schema
DROP EXTENSION IF EXISTS pg_trgm CASCADE;
CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA extensions;

-- Move unaccent extension to extensions schema  
DROP EXTENSION IF EXISTS unaccent CASCADE;
CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA extensions;

-- Recreate unaccent function with correct schema reference
CREATE OR REPLACE FUNCTION public.unaccent(text)
RETURNS text
LANGUAGE sql
IMMUTABLE
PARALLEL SAFE
STRICT
SET search_path TO 'public', 'extensions'
AS $$
  SELECT extensions.unaccent('extensions.unaccent', $1);
$$;

-- Recreate normalize_text function
CREATE OR REPLACE FUNCTION public.normalize_text(text)
RETURNS text
LANGUAGE sql
IMMUTABLE
SET search_path TO 'public'
AS $function$
  SELECT lower(public.unaccent($1));
$function$;

-- Recreate search_books function with proper schema references
CREATE OR REPLACE FUNCTION public.search_books(search_query text, search_lang text, result_limit integer DEFAULT 8)
RETURNS TABLE(id uuid, title text, author text, lang text, cover_url text, popularity integer)
LANGUAGE plpgsql
STABLE
SET search_path TO 'public', 'extensions'
AS $function$
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
      public.unaccent(LOWER(b.title)) LIKE '%' || public.unaccent(LOWER(search_query)) || '%'
      OR public.unaccent(LOWER(b.author)) LIKE '%' || public.unaccent(LOWER(search_query)) || '%'
      OR extensions.similarity(public.unaccent(LOWER(b.title)), public.unaccent(LOWER(search_query))) > 0.1
      OR extensions.similarity(public.unaccent(LOWER(b.author)), public.unaccent(LOWER(search_query))) > 0.1
    )
  ORDER BY 
    -- Prioritize exact prefix matches
    CASE 
      WHEN public.unaccent(LOWER(b.title)) LIKE public.unaccent(LOWER(search_query)) || '%' THEN 1
      WHEN public.unaccent(LOWER(b.author)) LIKE public.unaccent(LOWER(search_query)) || '%' THEN 2
      ELSE 3
    END,
    -- Then by similarity score
    GREATEST(
      extensions.similarity(public.unaccent(LOWER(b.title)), public.unaccent(LOWER(search_query))),
      extensions.similarity(public.unaccent(LOWER(b.author)), public.unaccent(LOWER(search_query)))
    ) DESC,
    -- Finally by popularity
    b.popularity DESC
  LIMIT result_limit;
END;
$function$;