-- Create RLS policies for book-audio storage bucket

-- Policy to allow service role to upload files
CREATE POLICY "Allow service role to upload audio files"
ON storage.objects
FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'book-audio');

-- Policy to allow service role to update files
CREATE POLICY "Allow service role to update audio files"
ON storage.objects
FOR UPDATE
TO service_role
USING (bucket_id = 'book-audio');

-- Policy to allow authenticated users to read audio files
CREATE POLICY "Allow authenticated users to read audio files"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'book-audio');

-- Policy to allow service role to read files (for signed URLs)
CREATE POLICY "Allow service role to read audio files"
ON storage.objects
FOR SELECT
TO service_role
USING (bucket_id = 'book-audio');