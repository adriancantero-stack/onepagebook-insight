-- Add nickname column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN nickname text UNIQUE;

-- Add check constraint to ensure nickname has minimum length
ALTER TABLE public.profiles 
ADD CONSTRAINT nickname_min_length CHECK (nickname IS NULL OR length(nickname) >= 3);

-- Add check constraint to ensure nickname has maximum length
ALTER TABLE public.profiles 
ADD CONSTRAINT nickname_max_length CHECK (nickname IS NULL OR length(nickname) <= 20);