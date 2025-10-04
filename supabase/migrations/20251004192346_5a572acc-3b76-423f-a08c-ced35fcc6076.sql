-- Create storage policies for book-audio bucket
CREATE POLICY "Users can view own book audio files"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'book-audio' 
  AND EXISTS (
    SELECT 1 FROM book_audio ba
    JOIN book_summaries bs ON bs.id = ba.book_summary_id
    WHERE ba.audio_url = storage.objects.name
    AND bs.user_id = auth.uid()
  )
);

CREATE POLICY "Users can upload own book audio files"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'book-audio'
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Users can delete own book audio files"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'book-audio'
  AND EXISTS (
    SELECT 1 FROM book_audio ba
    JOIN book_summaries bs ON bs.id = ba.book_summary_id
    WHERE ba.audio_url = storage.objects.name
    AND bs.user_id = auth.uid()
  )
);