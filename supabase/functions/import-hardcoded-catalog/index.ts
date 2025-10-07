import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Import the book catalog structure
const bookCatalog = [
  {
    id: "habits",
    nameKey: "cats.habits",
    books: [
      { title: "Hábitos Atômicos", author: "James Clear", locale: "pt" },
      { title: "Trabalho Focado", author: "Cal Newport", locale: "pt" },
      { title: "O Poder do Hábito", author: "Charles Duhigg", locale: "pt" },
      { title: "Atomic Habits", author: "James Clear", locale: "en" },
      { title: "Deep Work", author: "Cal Newport", locale: "en" },
      { title: "The Power of Habit", author: "Charles Duhigg", locale: "en" },
      { title: "Hábitos Atómicos", author: "James Clear", locale: "es" },
      { title: "Enfócate", author: "Cal Newport", locale: "es" },
      { title: "El Poder de los Hábitos", author: "Charles Duhigg", locale: "es" },
      // Add more books from the catalog...
    ]
  },
  // Add more categories...
];

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

    for (const category of bookCatalog) {
      log.push(`\nProcessando categoria: ${category.id}`);

      for (const book of category.books) {
        try {
          // Check if book already exists (by title, author, and language)
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
              category: category.id,
              is_active: true,
              popularity: 0,
            });

          if (insertError) {
            console.error(`Error inserting ${book.title}:`, insertError);
            errors++;
          } else {
            inserted++;
            if (inserted % 50 === 0) {
              log.push(`${inserted} livros importados...`);
            }
          }

        } catch (error) {
          console.error(`Error processing book:`, error);
          errors++;
        }
      }
    }

    log.push(`\n✓ Importação concluída!`);
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
