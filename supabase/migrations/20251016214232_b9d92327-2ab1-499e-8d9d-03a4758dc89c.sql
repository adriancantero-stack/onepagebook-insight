-- Create A/B test tracking tables
CREATE TABLE IF NOT EXISTS public.ab_test_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL UNIQUE,
  variant TEXT NOT NULL CHECK (variant IN ('A', 'B')),
  language TEXT NOT NULL CHECK (language IN ('pt', 'en', 'es')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  user_agent TEXT,
  referrer TEXT
);

CREATE TABLE IF NOT EXISTS public.ab_test_conversions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL REFERENCES public.ab_test_sessions(session_id),
  variant TEXT NOT NULL CHECK (variant IN ('A', 'B')),
  language TEXT NOT NULL,
  conversion_type TEXT NOT NULL CHECK (conversion_type IN ('cta_click', 'signup', 'premium_click')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ab_test_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  is_active BOOLEAN DEFAULT true,
  split_percentage INTEGER DEFAULT 50 CHECK (split_percentage >= 0 AND split_percentage <= 100),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE,
  winner_variant TEXT CHECK (winner_variant IN ('A', 'B'))
);

-- Insert default config
INSERT INTO public.ab_test_config (is_active, split_percentage)
VALUES (true, 50)
ON CONFLICT DO NOTHING;

-- Enable RLS
ALTER TABLE public.ab_test_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ab_test_conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ab_test_config ENABLE ROW LEVEL SECURITY;

-- Policies for sessions (public insert, admin read)
CREATE POLICY "Anyone can create sessions"
  ON public.ab_test_sessions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can read sessions"
  ON public.ab_test_sessions
  FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- Policies for conversions (public insert, admin read)
CREATE POLICY "Anyone can create conversions"
  ON public.ab_test_conversions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can read conversions"
  ON public.ab_test_conversions
  FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- Policies for config (admin only)
CREATE POLICY "Admins can read config"
  ON public.ab_test_config
  FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update config"
  ON public.ab_test_config
  FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- Create indexes for performance
CREATE INDEX idx_ab_sessions_variant ON public.ab_test_sessions(variant);
CREATE INDEX idx_ab_sessions_language ON public.ab_test_sessions(language);
CREATE INDEX idx_ab_sessions_created ON public.ab_test_sessions(created_at);
CREATE INDEX idx_ab_conversions_session ON public.ab_test_conversions(session_id);
CREATE INDEX idx_ab_conversions_variant ON public.ab_test_conversions(variant);