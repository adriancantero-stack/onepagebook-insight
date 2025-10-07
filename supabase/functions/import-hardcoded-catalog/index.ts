import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Complete book catalog embedded
const BOOK_DATA: Record<string, Array<{title: string, author: string, locale: string}>> = {
  "habits": [
    // Portuguese
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
    // English
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
    // Spanish
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
  // Add note: This is a simplified version with just one category for testing
  // The full import would need all 12 categories with ~60 books each
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
