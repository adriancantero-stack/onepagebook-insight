-- Add norm_key to book_summaries for efficient caching
ALTER TABLE public.book_summaries 
ADD COLUMN IF NOT EXISTS norm_key TEXT;

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_book_summaries_norm_key 
ON public.book_summaries(norm_key);

-- Create book_audio table for audio caching
CREATE TABLE IF NOT EXISTS public.book_audio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_summary_id UUID NOT NULL REFERENCES public.book_summaries(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  file_size BIGINT,
  duration_seconds INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(book_summary_id, language)
);

-- Enable RLS on book_audio
ALTER TABLE public.book_audio ENABLE ROW LEVEL SECURITY;

-- Users can view audio for summaries they own
CREATE POLICY "Users can view own book audio"
ON public.book_audio
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.book_summaries
    WHERE book_summaries.id = book_audio.book_summary_id
    AND book_summaries.user_id = auth.uid()
  )
);

-- Users can create audio for their own summaries
CREATE POLICY "Users can create own book audio"
ON public.book_audio
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.book_summaries
    WHERE book_summaries.id = book_audio.book_summary_id
    AND book_summaries.user_id = auth.uid()
  )
);

-- Create storage bucket for audio files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'book-audio',
  'book-audio',
  false,
  52428800, -- 50MB limit
  ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for book-audio bucket
CREATE POLICY "Users can view their own audio files"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'book-audio' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can upload their own audio files"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'book-audio' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own audio files"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'book-audio' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);