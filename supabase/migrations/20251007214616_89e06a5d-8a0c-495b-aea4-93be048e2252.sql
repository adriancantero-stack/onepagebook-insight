-- Fix function search path for calculate_next_cron_run
DROP FUNCTION IF EXISTS public.calculate_next_cron_run(TEXT, TIMESTAMP WITH TIME ZONE);

CREATE OR REPLACE FUNCTION public.calculate_next_cron_run(
  cron_expr TEXT,
  from_time TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
RETURNS TIMESTAMP WITH TIME ZONE
LANGUAGE plpgsql
STABLE
SET search_path TO 'public'
AS $$
DECLARE
  next_run TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Daily at 2 AM (0 2 * * *)
  IF cron_expr = '0 2 * * *' THEN
    next_run := date_trunc('day', from_time + INTERVAL '1 day') + INTERVAL '2 hours';
    IF next_run <= from_time THEN
      next_run := date_trunc('day', from_time + INTERVAL '2 days') + INTERVAL '2 hours';
    END IF;
  -- Weekly on Sunday at 3 AM (0 3 * * 0)
  ELSIF cron_expr = '0 3 * * 0' THEN
    next_run := date_trunc('week', from_time + INTERVAL '1 week') + INTERVAL '3 hours';
    IF next_run <= from_time THEN
      next_run := date_trunc('week', from_time + INTERVAL '2 weeks') + INTERVAL '3 hours';
    END IF;
  ELSE
    next_run := from_time + INTERVAL '1 hour';
  END IF;
  
  RETURN next_run;
END;
$$;