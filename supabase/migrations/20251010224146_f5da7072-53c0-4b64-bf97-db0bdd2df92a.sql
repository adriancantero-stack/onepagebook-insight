-- Preencher signup_language retroativamente para usuários antigos
-- Usa o preferred_language como base para inferir o idioma de cadastro
UPDATE public.profiles
SET signup_language = preferred_language
WHERE signup_language IS NULL;