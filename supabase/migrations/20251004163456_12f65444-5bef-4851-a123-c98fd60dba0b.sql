-- Add policy for admins to view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Add policy for admins to view all user subscriptions
CREATE POLICY "Admins can view all subscriptions"
ON public.user_subscriptions
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Add policy for admins to view all book summaries
CREATE POLICY "Admins can view all summaries"
ON public.book_summaries
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));