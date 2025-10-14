-- Create people_picks table
CREATE TABLE public.people_picks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  display_name_pt TEXT,
  display_name_en TEXT,
  display_name_es TEXT,
  role TEXT,
  role_pt TEXT,
  role_en TEXT,
  role_es TEXT,
  avatar_url TEXT,
  is_featured BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create people_book_picks table
CREATE TABLE public.people_book_picks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id TEXT NOT NULL REFERENCES public.people_picks(person_id) ON DELETE CASCADE,
  book_id UUID REFERENCES public.books(id) ON DELETE CASCADE,
  source_url TEXT NOT NULL,
  reason_pt TEXT,
  reason_en TEXT,
  reason_es TEXT,
  confidence TEXT CHECK (confidence IN ('high', 'medium', 'low')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.people_picks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.people_book_picks ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Public read, admin write
CREATE POLICY "Anyone can view people picks"
  ON public.people_picks FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage people picks"
  ON public.people_picks FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view book picks"
  ON public.people_book_picks FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage book picks"
  ON public.people_book_picks FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create indexes for performance
CREATE INDEX idx_people_picks_featured ON public.people_picks(is_featured, sort_order);
CREATE INDEX idx_people_book_picks_person ON public.people_book_picks(person_id);
CREATE INDEX idx_people_book_picks_book ON public.people_book_picks(book_id);

-- Seed initial data (7 people)
INSERT INTO public.people_picks (person_id, display_name, display_name_pt, display_name_en, display_name_es, role, role_pt, role_en, role_es, is_featured, sort_order) VALUES
  ('bill-gates', 'Bill Gates', 'Bill Gates', 'Bill Gates', 'Bill Gates', 'Gates Foundation', 'Gates Foundation', 'Gates Foundation', 'Gates Foundation', true, 10),
  ('elon-musk', 'Elon Musk', 'Elon Musk', 'Elon Musk', 'Elon Musk', 'Tesla/SpaceX', 'Tesla/SpaceX', 'Tesla/SpaceX', 'Tesla/SpaceX', true, 20),
  ('mark-zuckerberg', 'Mark Zuckerberg', 'Mark Zuckerberg', 'Mark Zuckerberg', 'Mark Zuckerberg', 'Meta', 'Meta', 'Meta', 'Meta', true, 30),
  ('sundar-pichai', 'Sundar Pichai', 'Sundar Pichai', 'Sundar Pichai', 'Sundar Pichai', 'Google', 'Google', 'Google', 'Google', true, 40),
  ('safra-catz', 'Safra Catz', 'Safra Catz', 'Safra Catz', 'Safra Catz', 'Oracle', 'Oracle', 'Oracle', 'Oracle', true, 50),
  ('jensen-huang', 'Jensen Huang', 'Jensen Huang', 'Jensen Huang', 'Jensen Huang', 'NVIDIA', 'NVIDIA', 'NVIDIA', 'NVIDIA', true, 60),
  ('michael-saylor', 'Michael Saylor', 'Michael Saylor', 'Michael Saylor', 'Michael Saylor', 'MicroStrategy', 'MicroStrategy', 'MicroStrategy', 'MicroStrategy', true, 70);

-- Note: book_id will need to be matched from the books table after migration
-- Seed book picks with placeholder book_ids (TODO: update with actual book IDs from catalog)
-- These are examples - you'll need to match actual book IDs from your books table
-- INSERT INTO public.people_book_picks (person_id, book_id, source_url, confidence) VALUES
-- ('bill-gates', '[UUID from books table]', '#', 'high');