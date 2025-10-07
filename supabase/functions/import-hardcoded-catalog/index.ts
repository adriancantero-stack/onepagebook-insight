import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Fetch the bookCatalog.ts file content from the repository
    const catalogUrl = 'https://raw.githubusercontent.com/lovable-dev/tqtaerijrqfkwxennxae/main/src/data/bookCatalog.ts';
    
    let catalogContent: string;
    try {
      const response = await fetch(catalogUrl);
      catalogContent = await response.text();
    } catch (error) {
      // Fallback: try a different approach or return error
      console.error("Could not fetch catalog file:", error);
      return new Response(
        JSON.stringify({ error: "Could not fetch catalog file from repository" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract the bookCatalog array using regex
    const match = catalogContent.match(/export const bookCatalog: Category\[\] = (\[[\s\S]*?\n\]);/);
    
    if (!match) {
      return new Response(
        JSON.stringify({ error: "Could not parse catalog structure" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use a safer eval alternative - parse the structure manually
    // Extract books from the text content
    const books: Array<{title: string, author: string, locale: string, category: string}> = [];
    
    // Match all book entries in the catalog
    const bookMatches = catalogContent.matchAll(/{\s*title:\s*"([^"]+)",\s*author:\s*"([^"]+)",\s*locale:\s*"(pt|en|es)"[^}]*}/g);
    
    let currentCategory = "";
    const categoryMatches = catalogContent.matchAll(/{\s*id:\s*"([^"]+)",/g);
    const categories: string[] = [];
    
    for (const catMatch of categoryMatches) {
      categories.push(catMatch[1]);
    }

    // Now parse books and assign categories
    let catIndex = 0;
    let bookCount = 0;
    const booksPerCategory = Math.ceil(catalogContent.split('books: [').length / categories.length);

    for (const match of bookMatches) {
      const [, title, author, locale] = match;
      
      // Determine which category based on position
      if (bookCount > 0 && bookCount % 60 === 0 && catIndex < categories.length - 1) {
        catIndex++;
      }
      
      books.push({
        title: title.trim(),
        author: author.trim(),
        locale: locale.trim(),
        category: categories[catIndex] || 'habits'
      });
      
      bookCount++;
    }

    console.log(`Extracted ${books.length} books from catalog`);

    let inserted = 0;
    let skipped = 0;
    let errors = 0;
    const log: string[] = [];

    log.push(`Encontrados ${books.length} livros para importar`);
    log.push("Iniciando importação em lotes...");

    // Process in batches of 50
    const batchSize = 50;
    for (let i = 0; i < books.length; i += batchSize) {
      const batch = books.slice(i, i + batchSize);
      log.push(`\nProcessando lote ${Math.floor(i/batchSize) + 1}: livros ${i + 1} a ${Math.min(i + batchSize, books.length)}`);

      for (const book of batch) {
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
              category: book.category,
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

      log.push(`✓ Lote concluído: ${inserted} inseridos, ${skipped} pulados, ${errors} erros`);
      
      // Small delay between batches
      if (i + batchSize < books.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    log.push(`\n=== Importação concluída ===`);
    log.push(`Total inseridos: ${inserted}`);
    log.push(`Total pulados (já existiam): ${skipped}`);
    log.push(`Total erros: ${errors}`);

    return new Response(
      JSON.stringify({
        success: true,
        stats: { inserted, skipped, errors, total: books.length },
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
