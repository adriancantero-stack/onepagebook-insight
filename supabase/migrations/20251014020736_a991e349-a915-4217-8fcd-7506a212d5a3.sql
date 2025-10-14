-- Add RLS policy to allow authenticated users to view all profiles for ranking
CREATE POLICY "Authenticated users can view all profiles for ranking"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);