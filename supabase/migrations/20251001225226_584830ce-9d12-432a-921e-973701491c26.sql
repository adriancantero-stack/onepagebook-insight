-- Update adrian.cantero1@gmail.com subscription to Premium with correct plan_id
UPDATE public.user_subscriptions
SET 
  plan_id = 'cc0df403-ae4b-4e66-a3bd-7578e77ec90a',
  current_period_start = now(),
  current_period_end = now() + interval '1 month',
  status = 'active'
WHERE user_id = 'ccb41bd3-00d0-4cbf-bc9a-d2066370f81e';