import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Complete book catalog embedded - ALL categories
const BOOK_DATA: Record<string, Array<{title: string, author: string, locale: string}>> = {
  "habits": [
    { title: "Hábitos Atômicos", author: "James Clear", locale: "pt" },
    { title: "Trabalho Focado", author: "Cal Newport", locale: "pt" },
    { title: "O Poder do Hábito", author: "Charles Duhigg", locale: "pt" },
    { title: "Essencialismo", author: "Greg McKeown", locale: "pt" },
    { title: "A Única Coisa", author: "Gary Keller; Jay Papasan", locale: "pt" },
    { title: "Indistraível", author: "Nir Eyal", locale: "pt" },
    { title: "Tenha Tempo", author: "Jake Knapp; John Zeratsky", locale: "pt" },
    { title: "Hábitos Minúsculos", author: "BJ Fogg", locale: "pt" },
    { title: "Quatro Mil Semanas", author: "Oliver Burkeman", locale: "pt" },
    { title: "A Arte de Fazer Acontecer", author: "David Allen", locale: "pt" },
    { title: "Hiperfoco", author: "Chris Bailey", locale: "pt" },
    { title: "O Projeto Produtividade", author: "Chris Bailey", locale: "pt" },
    { title: "Engula o Sapo!", author: "Brian Tracy", locale: "pt" },
    { title: "A Ligeira Vantagem", author: "Jeff Olson", locale: "pt" },
    { title: "Empilhamento de Hábitos", author: "S.J. Scott", locale: "pt" },
    { title: "O Hábito do Agora", author: "Neil Fiore", locale: "pt" },
    { title: "Hábitos de Alta Performance", author: "Brendon Burchard", locale: "pt" },
    { title: "O Ano de 12 Semanas", author: "Brian P. Moran; Michael Lennington", locale: "pt" },
    { title: "Performance Máxima", author: "Brad Stulberg; Steve Magness", locale: "pt" },
    { title: "Faça Tempo para a Criatividade", author: "Jordan K. Moore", locale: "pt" },
    { title: "Atomic Habits", author: "James Clear", locale: "en" },
    { title: "Deep Work", author: "Cal Newport", locale: "en" },
    { title: "The Power of Habit", author: "Charles Duhigg", locale: "en" },
    { title: "Essentialism", author: "Greg McKeown", locale: "en" },
    { title: "The One Thing", author: "Gary Keller; Jay Papasan", locale: "en" },
    { title: "Indistractable", author: "Nir Eyal", locale: "en" },
    { title: "Make Time", author: "Jake Knapp; John Zeratsky", locale: "en" },
    { title: "Tiny Habits", author: "BJ Fogg", locale: "en" },
    { title: "Four Thousand Weeks", author: "Oliver Burkeman", locale: "en" },
    { title: "Getting Things Done", author: "David Allen", locale: "en" },
    { title: "Hyperfocus", author: "Chris Bailey", locale: "en" },
    { title: "The Productivity Project", author: "Chris Bailey", locale: "en" },
    { title: "Eat That Frog!", author: "Brian Tracy", locale: "en" },
    { title: "The Slight Edge", author: "Jeff Olson", locale: "en" },
    { title: "Habit Stacking", author: "S.J. Scott", locale: "en" },
    { title: "The Now Habit", author: "Neil Fiore", locale: "en" },
    { title: "High Performance Habits", author: "Brendon Burchard", locale: "en" },
    { title: "The 12 Week Year", author: "Brian P. Moran; Michael Lennington", locale: "en" },
    { title: "Peak Performance", author: "Brad Stulberg; Steve Magness", locale: "en" },
    { title: "Make Time for Creativity", author: "Jordan K. Moore", locale: "en" },
    { title: "Hábitos Atómicos", author: "James Clear", locale: "es" },
    { title: "Enfócate", author: "Cal Newport", locale: "es" },
    { title: "El Poder de los Hábitos", author: "Charles Duhigg", locale: "es" },
    { title: "Esencialismo", author: "Greg McKeown", locale: "es" },
    { title: "Lo Único", author: "Gary Keller; Jay Papasan", locale: "es" },
    { title: "Indistraible", author: "Nir Eyal", locale: "es" },
    { title: "Haz Tiempo", author: "Jake Knapp; John Zeratsky", locale: "es" },
    { title: "Hábitos Diminutos", author: "BJ Fogg", locale: "es" },
    { title: "Cuatro Mil Semanas", author: "Oliver Burkeman", locale: "es" },
    { title: "Organízate con Eficacia", author: "David Allen", locale: "es" },
    { title: "Hiperenfoque", author: "Chris Bailey", locale: "es" },
    { title: "El Proyecto Productividad", author: "Chris Bailey", locale: "es" },
    { title: "¡Trágate Ese Sapo!", author: "Brian Tracy", locale: "es" },
    { title: "La Ligera Ventaja", author: "Jeff Olson", locale: "es" },
    { title: "Apilamiento de Hábitos", author: "S.J. Scott", locale: "es" },
    { title: "El Hábito del Ahora", author: "Neil Fiore", locale: "es" },
    { title: "Hábitos de Alto Rendimiento", author: "Brendon Burchard", locale: "es" },
    { title: "El Año de 12 Semanas", author: "Brian P. Moran; Michael Lennington", locale: "es" },
    { title: "Rendimiento Máximo", author: "Brad Stulberg; Steve Magness", locale: "es" },
    { title: "Haz Tiempo para la Creatividad", author: "Jordan K. Moore", locale: "es" },
  ],
  "sleep": [
    { title: "Por Que Nós Dormimos", author: "Matthew Walker", locale: "pt" },
    { title: "O Código Circadiano", author: "Satchin Panda", locale: "pt" },
    { title: "Mude Sua Rotina, Mude Sua Vida", author: "Suhas Kshirsagar", locale: "pt" },
    { title: "Durma Melhor", author: "Shawn Stevenson", locale: "pt" },
    { title: "Viva Mais e Melhor", author: "Peter Attia", locale: "pt" },
    { title: "Respire", author: "James Nestor", locale: "pt" },
    { title: "Spark", author: "John J. Ratey", locale: "pt" },
    { title: "A Alegria do Movimento", author: "Kelly McGonigal", locale: "pt" },
    { title: "Como Não Morrer", author: "Michael Greger", locale: "pt" },
    { title: "Por Que Ficamos Doentes", author: "Benjamin Bikman", locale: "pt" },
    { title: "A Solução do Sono", author: "W. Chris Winter", locale: "pt" },
    { title: "A Revolução do Sono", author: "Arianna Huffington", locale: "pt" },
    { title: "O Cérebro Noturno", author: "Guy Leschziner", locale: "pt" },
    { title: "Olá Sono", author: "Aric A. Prather", locale: "pt" },
    { title: "O Livro do Sono", author: "Guy Meadows", locale: "pt" },
    { title: "Construído para se Mover", author: "Kelly Starrett; Juliet Starrett", locale: "pt" },
    { title: "Longevidade", author: "David A. Sinclair; Matthew D. LaPlante", locale: "pt" },
    { title: "Coma para Vencer Doenças", author: "William W. Li", locale: "pt" },
    { title: "O Código da Obesidade", author: "Jason Fung", locale: "pt" },
    { title: "Quando", author: "Daniel H. Pink", locale: "pt" },
    { title: "Why We Sleep", author: "Matthew Walker", locale: "en" },
    { title: "The Circadian Code", author: "Satchin Panda", locale: "en" },
    { title: "Change Your Schedule, Change Your Life", author: "Suhas Kshirsagar", locale: "en" },
    { title: "Sleep Smarter", author: "Shawn Stevenson", locale: "en" },
    { title: "Outlive", author: "Peter Attia", locale: "en" },
    { title: "Breath", author: "James Nestor", locale: "en" },
    { title: "Spark", author: "John J. Ratey", locale: "en" },
    { title: "The Joy of Movement", author: "Kelly McGonigal", locale: "en" },
    { title: "How Not to Die", author: "Michael Greger", locale: "en" },
    { title: "Why We Get Sick", author: "Benjamin Bikman", locale: "en" },
    { title: "The Sleep Solution", author: "W. Chris Winter", locale: "en" },
    { title: "The Sleep Revolution", author: "Arianna Huffington", locale: "en" },
    { title: "The Nocturnal Brain", author: "Guy Leschziner", locale: "en" },
    { title: "Hello Sleep", author: "Aric A. Prather", locale: "en" },
    { title: "The Sleep Book", author: "Guy Meadows", locale: "en" },
    { title: "Built to Move", author: "Kelly Starrett; Juliet Starrett", locale: "en" },
    { title: "Lifespan", author: "David A. Sinclair; Matthew D. LaPlante", locale: "en" },
    { title: "Eat to Beat Disease", author: "William W. Li", locale: "en" },
    { title: "The Obesity Code", author: "Jason Fung", locale: "en" },
    { title: "When", author: "Daniel H. Pink", locale: "en" },
    { title: "Por Qué Dormimos", author: "Matthew Walker", locale: "es" },
    { title: "El Código Circadiano", author: "Satchin Panda", locale: "es" },
    { title: "Cambia tu Horario, Cambia tu Vida", author: "Suhas Kshirsagar", locale: "es" },
    { title: "Duerme Mejor", author: "Shawn Stevenson", locale: "es" },
    { title: "Vive Más Tiempo", author: "Peter Attia", locale: "es" },
    { title: "Respira", author: "James Nestor", locale: "es" },
    { title: "Spark", author: "John J. Ratey", locale: "es" },
    { title: "La Alegría del Movimiento", author: "Kelly McGonigal", locale: "es" },
    { title: "Comer para No Morir", author: "Michael Greger", locale: "es" },
    { title: "Por Qué Enfermamos", author: "Benjamin Bikman", locale: "es" },
    { title: "La Solución del Sueño", author: "W. Chris Winter", locale: "es" },
    { title: "La Revolución del Sueño", author: "Arianna Huffington", locale: "es" },
    { title: "El Cerebro Nocturno", author: "Guy Leschziner", locale: "es" },
    { title: "Hola Sueño", author: "Aric A. Prather", locale: "es" },
    { title: "El Libro del Sueño", author: "Guy Meadows", locale: "es" },
    { title: "Construido para Moverse", author: "Kelly Starrett; Juliet Starrett", locale: "es" },
    { title: "Longevidad", author: "David A. Sinclair; Matthew D. LaPlante", locale: "es" },
    { title: "Come para Vencer Enfermedades", author: "William W. Li", locale: "es" },
    { title: "El Código de la Obesidad", author: "Jason Fung", locale: "es" },
    { title: "Cuándo", author: "Daniel H. Pink", locale: "es" },
  ],
  "psych": [
    { title: "Mindset", author: "Carol S. Dweck", locale: "pt" },
    { title: "Rápido e Devagar", author: "Daniel Kahneman", locale: "pt" },
    { title: "Garra", author: "Angela Duckworth", locale: "pt" },
    { title: "O Jeito Harvard de Ser Feliz", author: "Shawn Achor", locale: "pt" },
    { title: "Em Busca de Sentido", author: "Viktor E. Frankl", locale: "pt" },
    { title: "Flow", author: "Mihaly Csikszentmihalyi", locale: "pt" },
    { title: "O Obstáculo é o Caminho", author: "Ryan Holiday", locale: "pt" },
    { title: "Drive", author: "Daniel H. Pink", locale: "pt" },
    { title: "Tropeçando na Felicidade", author: "Daniel Gilbert", locale: "pt" },
    { title: "A Hipótese da Felicidade", author: "Jonathan Haidt", locale: "pt" },
    { title: "Pensando em Apostas", author: "Annie Duke", locale: "pt" },
    { title: "O Paradoxo da Escolha", author: "Barry Schwartz", locale: "pt" },
    { title: "O Lado Bom do Estresse", author: "Kelly McGonigal", locale: "pt" },
    { title: "A Lacuna da Confiança", author: "Russ Harris", locale: "pt" },
    { title: "Mente sobre Humor", author: "Dennis Greenberger; Christine A. Padesky", locale: "pt" },
    { title: "Otimismo Aprendido", author: "Martin E.P. Seligman", locale: "pt" },
    { title: "Agilidade Emocional", author: "Susan David", locale: "pt" },
    { title: "A Mente Moralista", author: "Jonathan Haidt", locale: "pt" },
    { title: "Quieto", author: "Susan Cain", locale: "pt" },
    { title: "O Paradoxo do Chimpanzé", author: "Steve Peters", locale: "pt" },
    { title: "Mindset", author: "Carol S. Dweck", locale: "en" },
    { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", locale: "en" },
    { title: "Grit", author: "Angela Duckworth", locale: "en" },
    { title: "The Happiness Advantage", author: "Shawn Achor", locale: "en" },
    { title: "Man's Search for Meaning", author: "Viktor E. Frankl", locale: "en" },
    { title: "Flow", author: "Mihaly Csikszentmihalyi", locale: "en" },
    { title: "The Obstacle Is the Way", author: "Ryan Holiday", locale: "en" },
    { title: "Drive", author: "Daniel H. Pink", locale: "en" },
    { title: "Stumbling on Happiness", author: "Daniel Gilbert", locale: "en" },
    { title: "The Happiness Hypothesis", author: "Jonathan Haidt", locale: "en" },
    { title: "Thinking in Bets", author: "Annie Duke", locale: "en" },
    { title: "The Paradox of Choice", author: "Barry Schwartz", locale: "en" },
    { title: "The Upside of Stress", author: "Kelly McGonigal", locale: "en" },
    { title: "The Confidence Gap", author: "Russ Harris", locale: "en" },
    { title: "Mind Over Mood", author: "Dennis Greenberger; Christine A. Padesky", locale: "en" },
    { title: "Learned Optimism", author: "Martin E.P. Seligman", locale: "en" },
    { title: "Emotional Agility", author: "Susan David", locale: "en" },
    { title: "The Righteous Mind", author: "Jonathan Haidt", locale: "en" },
    { title: "Quiet", author: "Susan Cain", locale: "en" },
    { title: "The Chimp Paradox", author: "Steve Peters", locale: "en" },
    { title: "Mentalidad", author: "Carol S. Dweck", locale: "es" },
    { title: "Pensar Rápido, Pensar Despacio", author: "Daniel Kahneman", locale: "es" },
    { title: "Grit", author: "Angela Duckworth", locale: "es" },
    { title: "La Ventaja de la Felicidad", author: "Shawn Achor", locale: "es" },
    { title: "El Hombre en Busca de Sentido", author: "Viktor E. Frankl", locale: "es" },
    { title: "Flow", author: "Mihaly Csikszentmihalyi", locale: "es" },
    { title: "El Obstáculo es el Camino", author: "Ryan Holiday", locale: "es" },
    { title: "Drive", author: "Daniel H. Pink", locale: "es" },
    { title: "Tropezando con la Felicidad", author: "Daniel Gilbert", locale: "es" },
    { title: "La Hipótesis de la Felicidad", author: "Jonathan Haidt", locale: "es" },
    { title: "Pensando en Apuestas", author: "Annie Duke", locale: "es" },
    { title: "La Paradoja de la Elección", author: "Barry Schwartz", locale: "es" },
    { title: "El Lado Bueno del Estrés", author: "Kelly McGonigal", locale: "es" },
    { title: "La Brecha de Confianza", author: "Russ Harris", locale: "es" },
    { title: "Mente sobre Humor", author: "Dennis Greenberger; Christine A. Padesky", locale: "es" },
    { title: "Optimismo Aprendido", author: "Martin E.P. Seligman", locale: "es" },
    { title: "Agilidad Emocional", author: "Susan David", locale: "es" },
    { title: "La Mente Moralista", author: "Jonathan Haidt", locale: "es" },
    { title: "Quieto", author: "Susan Cain", locale: "es" },
    { title: "La Paradoja del Chimpancé", author: "Steve Peters", locale: "es" },
  ],
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    let inserted = 0;
    let skipped = 0;
    let errors = 0;
    const log: string[] = [];

    log.push("Iniciando importação do catálogo hardcoded...");

    // Process all categories
    for (const [categoryId, books] of Object.entries(BOOK_DATA)) {
      log.push(`\nProcessando categoria: ${categoryId} (${books.length} livros)`);

      for (const book of books) {
        try {
          // Check if book already exists
          const { data: existing } = await supabase
            .from('books')
            .select('id')
            .eq('title', book.title)
            .eq('author', book.author)
            .eq('lang', book.locale)
            .maybeSingle();

          if (existing) {
            skipped++;
            continue;
          }

          // Insert new book
          const { error: insertError } = await supabase
            .from('books')
            .insert({
              title: book.title,
              author: book.author,
              lang: book.locale,
              category: categoryId,
              is_active: true,
              popularity: 0,
            });

          if (insertError) {
            console.error(`Error inserting ${book.title}:`, insertError);
            errors++;
          } else {
            inserted++;
          }

        } catch (error) {
          console.error(`Error processing book:`, error);
          errors++;
        }
      }

      log.push(`✓ Categoria ${categoryId} concluída`);
    }

    log.push(`\n=== Importação concluída ===`);
    log.push(`Total inseridos: ${inserted}`);
    log.push(`Total pulados (já existiam): ${skipped}`);
    log.push(`Total erros: ${errors}`);

    return new Response(
      JSON.stringify({
        success: true,
        stats: { inserted, skipped, errors },
        log
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Import error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
