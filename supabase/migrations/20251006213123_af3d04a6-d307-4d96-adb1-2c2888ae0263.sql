-- Add UPDATE policy for book-covers bucket
DROP POLICY IF EXISTS "Service role can update book covers" ON storage.objects;
CREATE POLICY "Service role can update book covers"
ON storage.objects FOR UPDATE
USING (bucket_id = 'book-covers')
WITH CHECK (bucket_id = 'book-covers');