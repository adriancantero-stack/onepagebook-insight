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
    
    const response = await fetch(url);
    if (!response.ok) return null;
    
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
    const { books } = await req.json();
    
    if (!books || !Array.isArray(books)) {
      return new Response(
        JSON.stringify({ error: 'Invalid books array' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const PLACEHOLDER_LOGO = '/logo-gray.png';

    const results = {
      success: 0,
      failed: 0,
      skipped: 0,
      errors: [] as string[]
    };

    for (const book of books) {
      try {
        const googleCover = await fetchGoogleBookCover(book.title, book.author);
        const newCoverUrl = googleCover || PLACEHOLDER_LOGO;

        if (book.cover_url !== newCoverUrl) {
          const { error: updateError } = await supabase
            .from('books')
            .update({ cover_url: newCoverUrl })
            .eq('id', book.id);

          if (updateError) {
            results.failed++;
            results.errors.push(`${book.title}: ${updateError.message}`);
          } else {
            results.success++;
          }
        } else {
          results.skipped++;
        }

        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        results.failed++;
        const errorMsg = error instanceof Error ? error.message : String(error);
        results.errors.push(`${book.title}: ${errorMsg}`);
      }
    }

    return new Response(
      JSON.stringify(results),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-book-covers function:', error);
    const errorMsg = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ error: errorMsg }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
