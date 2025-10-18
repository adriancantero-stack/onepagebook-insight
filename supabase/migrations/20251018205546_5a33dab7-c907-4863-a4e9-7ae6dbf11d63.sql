-- Fix: Update handle_new_user to set preferred_language from signup_language
-- Also backfill existing users who don't have preferred_language set correctly

-- Update existing users where preferred_language is 'pt' but signup_language is different
UPDATE public.profiles
SET preferred_language = signup_language
WHERE signup_language IS NOT NULL 
  AND signup_language != 'pt' 
  AND preferred_language = 'pt';

-- Update the handle_new_user function to set preferred_language
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  free_plan_id UUID;
  user_language TEXT;
BEGIN
  -- Get user language from signup metadata
  user_language := COALESCE(NEW.raw_user_meta_data->>'signup_language', 'pt');
  
  -- Insert into profiles with signup tracking data AND preferred_language
  INSERT INTO public.profiles (
    id, 
    full_name,
    signup_language,
    signup_path,
    signup_country,
    preferred_language
  )
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'signup_language',
    NEW.raw_user_meta_data->>'signup_path',
    NEW.raw_user_meta_data->>'signup_country',
    user_language
  );
  
  -- Get free plan ID
  SELECT id INTO free_plan_id FROM public.subscription_plans WHERE type = 'free' LIMIT 1;
  
  -- Create free subscription
  INSERT INTO public.user_subscriptions (user_id, plan_id)
  VALUES (NEW.id, free_plan_id);
  
  -- Queue welcome email
  INSERT INTO public.welcome_emails_queue (user_id, email, full_name, language)
  VALUES (
    NEW.id, 
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    user_language
  );
  
  RAISE LOG 'New user created and welcome email queued: % (%)', NEW.id, NEW.email;
  
  RETURN NEW;
END;
$function$;