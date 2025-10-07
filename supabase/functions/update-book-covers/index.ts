import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GoogleBookResponse {
  items?: Array<{
    volumeInfo: {
      imageLinks?: {
        thumbnail?: string;
        smallThumbnail?: string;
      };
    };
  }>;
}

async function fetchGoogleBookCover(title: string, author: string): Promise<string | null> {
  try {
    const query = encodeURIComponent(`${title} ${author}`);
    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1`;
    
    console.log(`Searching Google Books for: ${title} by ${author}`);
    
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Google Books API error: ${response.statusText}`);
      return null;
    }
    
    const data: GoogleBookResponse = await response.json();
    
    if (data.items && data.items.length > 0) {
      const imageLinks = data.items[0].volumeInfo.imageLinks;
      if (imageLinks?.thumbnail) {
        return imageLinks.thumbnail.replace('http:', 'https:');
      }
      if (imageLinks?.smallThumbnail) {
        return imageLinks.smallThumbnail.replace('http:', 'https:');
      }
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching cover for "${title}":`, error);
    return null;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Logo URL do site (usar a logo atual do projeto)
    const PLACEHOLDER_LOGO = '/logo-gray.png';

    console.log('Starting book cover update process...');

    // Buscar todos os livros ativos
    const { data: books, error: fetchError } = await supabase
      .from('books')
      .select('id, title, author, cover_url')
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    if (fetchError) {
      throw new Error(`Error fetching books: ${fetchError.message}`);
    }

    if (!books || books.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No books found to update',
          results: { success: 0, failed: 0, skipped: 0, errors: [] },
          total: 0,
          processed: 0
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${books.length} books to process`);

    // Create a ReadableStream to send progress updates
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        
        const results = {
          success: 0,
          failed: 0,
          skipped: 0,
          errors: [] as string[]
        };

        // Send initial progress
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({
          type: 'progress',
          total: books.length,
          processed: 0,
          results
        })}\n\n`));

        let processed = 0;

        for (const book of books) {
          try {
            console.log(`\nProcessing: ${book.title} by ${book.author}`);
            
            // Tentar buscar capa real do Google Books
            const googleCover = await fetchGoogleBookCover(book.title, book.author);
            
            let newCoverUrl: string;
            
            if (googleCover) {
              // Encontrou capa real no Google Books
              newCoverUrl = googleCover;
              console.log(`✓ Found Google Books cover for "${book.title}"`);
            } else {
              // Não encontrou, usar logo do site
              newCoverUrl = PLACEHOLDER_LOGO;
              console.log(`○ No cover found for "${book.title}", using site logo`);
            }

            // Atualizar o livro apenas se a capa for diferente
            if (book.cover_url !== newCoverUrl) {
              const { error: updateError } = await supabase
                .from('books')
                .update({ cover_url: newCoverUrl })
                .eq('id', book.id);

              if (updateError) {
                console.error(`Error updating "${book.title}":`, updateError.message);
                results.failed++;
                results.errors.push(`${book.title}: ${updateError.message}`);
              } else {
                results.success++;
                console.log(`✓ Updated cover for "${book.title}"`);
              }
            } else {
              results.skipped++;
              console.log(`- Skipped "${book.title}" (cover unchanged)`);
            }

            processed++;

            // Send progress update
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({
              type: 'progress',
              total: books.length,
              processed,
              results,
              current_book: book.title
            })}\n\n`));

            // Delay para respeitar rate limits do Google Books API
            await new Promise(resolve => setTimeout(resolve, 1000));

          } catch (error) {
            console.error(`Error processing "${book.title}":`, error);
            results.failed++;
            const errorMsg = error instanceof Error ? error.message : String(error);
            results.errors.push(`${book.title}: ${errorMsg}`);
            processed++;

            // Send progress update even on error
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({
              type: 'progress',
              total: books.length,
              processed,
              results
            })}\n\n`));
          }
        }

        console.log('\n=== Update Complete ===');
        console.log(`Success: ${results.success}`);
        console.log(`Failed: ${results.failed}`);
        console.log(`Skipped: ${results.skipped}`);

        // Send final result
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({
          type: 'complete',
          success: true,
          results,
          total: books.length,
          processed
        })}\n\n`));

        controller.close();
      }
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Error in update-book-covers function:', error);
    const errorMsg = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMsg,
        results: { success: 0, failed: 0, skipped: 0, errors: [errorMsg] },
        total: 0,
        processed: 0
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
