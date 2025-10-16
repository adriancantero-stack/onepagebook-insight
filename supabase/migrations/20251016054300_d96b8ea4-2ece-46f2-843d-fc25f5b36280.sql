-- Criar tabela para flashcards
CREATE TABLE IF NOT EXISTS public.book_flashcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_summary_id UUID NOT NULL REFERENCES public.book_summaries(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  card_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Adicionar campo para exemplos práticos (JSON array)
ALTER TABLE public.book_summaries 
ADD COLUMN IF NOT EXISTS practical_examples JSONB;

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_flashcards_summary 
ON public.book_flashcards(book_summary_id);

-- RLS Policies para flashcards
ALTER TABLE public.book_flashcards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view flashcards for own summaries"
ON public.book_flashcards FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.book_summaries
    WHERE book_summaries.id = book_flashcards.book_summary_id
    AND book_summaries.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create flashcards for own summaries"
ON public.book_flashcards FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.book_summaries
    WHERE book_summaries.id = book_flashcards.book_summary_id
    AND book_summaries.user_id = auth.uid()
  )
);

-- Admins podem ver todos os flashcards
CREATE POLICY "Admins can view all flashcards"
ON public.book_flashcards FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));