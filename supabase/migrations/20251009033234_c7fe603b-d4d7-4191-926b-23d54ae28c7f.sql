-- Remove email column from profiles table since Supabase auth.users already stores emails securely
-- This prevents potential email harvesting attacks

ALTER TABLE public.profiles 
DROP COLUMN IF EXISTS email;

-- Update the handle_new_user function to not insert email into profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  free_plan_id UUID;
BEGIN
  -- Insert into profiles (removed email field)
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  
  -- Get free plan ID
  SELECT id INTO free_plan_id FROM public.subscription_plans WHERE type = 'free' LIMIT 1;
  
  -- Create free subscription
  INSERT INTO public.user_subscriptions (user_id, plan_id)
  VALUES (NEW.id, free_plan_id);
  
  RETURN NEW;
END;
$$;