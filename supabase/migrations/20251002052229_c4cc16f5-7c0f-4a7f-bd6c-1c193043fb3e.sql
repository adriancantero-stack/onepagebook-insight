-- Update all existing summaries that don't have a closing message
-- Add default closing message based on language

-- Update Portuguese summaries
UPDATE book_summaries
SET closing = 'Você não precisa mudar tudo de uma vez. Escolha um ajuste pequeno — hoje — e dê o primeiro passo. Amanhã, repita: consistência vence força de vontade.'
WHERE closing IS NULL AND language = 'pt';

-- Update English summaries
UPDATE book_summaries
SET closing = 'You don''t have to change everything at once. Pick one time to start—today—and make the first small shift. Tomorrow, repeat. Consistency beats willpower.'
WHERE closing IS NULL AND language = 'en';

-- Update Spanish summaries
UPDATE book_summaries
SET closing = 'No tienes que cambiarlo todo de golpe. Elige una hora para empezar—hoy—y da el primer paso. Mañana, repite. La constancia supera la fuerza de voluntad.'
WHERE closing IS NULL AND language = 'es';