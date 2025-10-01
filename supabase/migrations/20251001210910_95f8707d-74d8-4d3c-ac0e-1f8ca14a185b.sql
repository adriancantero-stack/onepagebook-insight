-- Add language column to book_summaries table
ALTER TABLE public.book_summaries 
ADD COLUMN language text DEFAULT 'pt' NOT NULL;

-- Add preferred_language column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN preferred_language text DEFAULT 'pt' NOT NULL;

-- Create index for language filtering
CREATE INDEX idx_book_summaries_language ON public.book_summaries(language);
CREATE INDEX idx_profiles_preferred_language ON public.profiles(preferred_language);