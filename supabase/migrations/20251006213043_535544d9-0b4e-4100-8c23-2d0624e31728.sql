-- Create storage bucket for book covers
INSERT INTO storage.buckets (id, name, public)
VALUES ('book-covers', 'book-covers', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for book-covers bucket
DROP POLICY IF EXISTS "Anyone can view book covers" ON storage.objects;
CREATE POLICY "Anyone can view book covers"
ON storage.objects FOR SELECT
USING (bucket_id = 'book-covers');

DROP POLICY IF EXISTS "Service role can upload book covers" ON storage.objects;
CREATE POLICY "Service role can upload book covers"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'book-covers');