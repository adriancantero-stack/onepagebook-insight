-- Update adrian.cantero1@gmail.com subscription to Premium
UPDATE public.user_subscriptions
SET 
  plan_id = 'a6edc7c8-e4f3-476b-90dd-c09f66084b5c',
  current_period_start = now(),
  current_period_end = now() + interval '1 month',
  status = 'active'
WHERE user_id = '63f8f1e0-ffe9-47f6-8ae9-93fb11a29a8c';