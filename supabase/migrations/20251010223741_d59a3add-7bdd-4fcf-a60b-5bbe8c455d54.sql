-- Add signup tracking fields to profiles table
ALTER TABLE public.profiles
ADD COLUMN signup_language text,
ADD COLUMN signup_path text,
ADD COLUMN signup_country text;

-- Update the handle_new_user function to capture signup metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  free_plan_id UUID;
BEGIN
  -- Insert into profiles with signup tracking data
  INSERT INTO public.profiles (
    id, 
    full_name,
    signup_language,
    signup_path,
    signup_country
  )
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'signup_language',
    NEW.raw_user_meta_data->>'signup_path',
    NEW.raw_user_meta_data->>'signup_country'
  );
  
  -- Get free plan ID
  SELECT id INTO free_plan_id FROM public.subscription_plans WHERE type = 'free' LIMIT 1;
  
  -- Create free subscription
  INSERT INTO public.user_subscriptions (user_id, plan_id)
  VALUES (NEW.id, free_plan_id);
  
  RETURN NEW;
END;
$$;