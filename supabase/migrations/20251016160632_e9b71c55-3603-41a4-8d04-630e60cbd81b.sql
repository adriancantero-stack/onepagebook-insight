-- Enable pg_net extension for HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create improved function to handle new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  free_plan_id UUID;
  request_id BIGINT;
  service_role_key TEXT;
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
  
  -- Get service role key from vault (must be configured separately)
  -- For now, we'll use a placeholder - admin needs to configure this
  service_role_key := current_setting('app.supabase_service_role_key', true);
  
  -- Trigger welcome email using pg_net (async, don't block user creation)
  IF service_role_key IS NOT NULL THEN
    SELECT extensions.pg_net.http_post(
      url := 'https://tqtaerijrqfkwxennxae.supabase.co/functions/v1/send-welcome-email',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || service_role_key
      ),
      body := jsonb_build_object('userId', NEW.id::text)
    ) INTO request_id;
    
    RAISE LOG 'Welcome email request sent for user % with request_id %', NEW.id, request_id;
  ELSE
    RAISE WARNING 'Service role key not configured, skipping welcome email for user %', NEW.id;
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail user creation if email fails
    RAISE WARNING 'Failed to send welcome email for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Create trigger for new user signups
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();