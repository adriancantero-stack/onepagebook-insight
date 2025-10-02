-- Populate norm_key for existing summaries without it
-- This function normalizes text by removing accents and special characters
CREATE OR REPLACE FUNCTION normalize_cache_text(text_input TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN LOWER(
    REGEXP_REPLACE(
      TRANSLATE(
        text_input,
        'ÀÁÂÃÄÅàáâãäåÈÉÊËèéêëÌÍÎÏìíîïÒÓÔÕÖòóôõöÙÚÛÜùúûüÝýÿÑñÇç',
        'AAAAAAaaaaaaEEEEeeeeIIIIiiiiOOOOOoooooUUUUuuuuYyyNnCc'
      ),
      '[^\w\s]', '', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Update existing summaries to populate norm_key
UPDATE book_summaries
SET norm_key = 
  normalize_cache_text(COALESCE(user_title, book_title, '')) || '|' || 
  normalize_cache_text(COALESCE(user_author, book_author, '')) || '|' || 
  COALESCE(language, 'pt')
WHERE norm_key IS NULL;

-- Create index for faster cache lookups
CREATE INDEX IF NOT EXISTS idx_book_summaries_cache_lookup 
ON book_summaries(user_id, norm_key, language) 
WHERE norm_key IS NOT NULL;