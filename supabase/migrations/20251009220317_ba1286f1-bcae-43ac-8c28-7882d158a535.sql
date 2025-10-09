-- Adicionar políticas RLS para cache global de áudios

-- Permitir que qualquer usuário autenticado leia áudios existentes (para cache global)
CREATE POLICY "Authenticated users can read all audio for caching"
ON public.book_audio
FOR SELECT
TO authenticated
USING (true);

-- Comentário: Agora os áudios funcionam como cache global compartilhado
-- Usuários podem ler qualquer áudio para reutilização, mas só podem criar seus próprios
COMMENT ON POLICY "Authenticated users can read all audio for caching" ON public.book_audio 
IS 'Permite cache global de áudios - usuários podem ler áudios de outros para reutilização';