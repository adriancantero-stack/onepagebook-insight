-- Allow users to update their own summaries (needed for practical_examples)
CREATE POLICY "Users can update own summaries"
ON public.book_summaries
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);