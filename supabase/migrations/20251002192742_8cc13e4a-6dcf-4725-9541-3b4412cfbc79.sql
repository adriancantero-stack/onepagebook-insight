-- Fix security warnings by setting search_path on functions
ALTER FUNCTION public.normalize_cache_text(TEXT) SET search_path = public;
ALTER FUNCTION public.update_updated_at() SET search_path = public;