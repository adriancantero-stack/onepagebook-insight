import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GoogleBookItem {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    publishedDate?: string;
    pageCount?: number;
    categories?: string[];
    imageLinks?: {
      thumbnail?: string;
      small?: string;
      medium?: string;
      large?: string;
    };
    industryIdentifiers?: Array<{
      type: string;
      identifier: string;
    }>;
  };
}

const QUERIES = {
  pt: [
    'desenvolvimento pessoal',
    'autoajuda',
    'crescimento pessoal',
    'produtividade pessoal'
  ],
  en: [
    'personal development',
    'self-help',
    'personal growth',
    'self-improvement'
  ],
  es: [
    'desarrollo personal',
    'autoayuda',
    'crecimiento personal',
    'superación personal'
  ]
};

async function fetchGoogleBooks(query: string, lang: string, maxResults = 20): Promise<GoogleBookItem[]> {
  try {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&langRestrict=${lang}&maxResults=${maxResults}&orderBy=relevance`;
    console.log(`Fetching: ${url}`);
    const response = await fetch(url);
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error(`Error fetching books for ${query}:`, error);
    return [];
  }
}

function extractISBN(identifiers?: Array<{ type: string; identifier: string }>): string | null {
  if (!identifiers) return null;
  const isbn13 = identifiers.find(id => id.type === 'ISBN_13');
  const isbn10 = identifiers.find(id => id.type === 'ISBN_10');
  return isbn13?.identifier || isbn10?.identifier || null;
}

function extractYear(dateString?: string): number | null {
  if (!dateString) return null;
  const year = parseInt(dateString.substring(0, 4));
  return isNaN(year) ? null : year;
}

function normalizeText(text: string | undefined): string {
  if (!text) return '';
  return text.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Starting to populate personal development books...');

    // Fetch existing books to avoid duplicates
    const { data: existingBooks } = await supabase
      .from('books')
      .select('title, author, lang');

    const existingSet = new Set(
      (existingBooks || []).map(b => 
        `${normalizeText(b.title)}_${normalizeText(b.author)}_${b.lang}`
      )
    );

    console.log(`Found ${existingSet.size} existing books in database`);

    let totalInserted = 0;
    let totalSkipped = 0;
    let totalErrors = 0;
    const log: string[] = [];

    for (const [lang, queries] of Object.entries(QUERIES)) {
      for (const query of queries) {
        console.log(`\nProcessing: ${query} (${lang})`);
        const books = await fetchGoogleBooks(query, lang, 20);
        
        for (const item of books) {
          const title = item.volumeInfo.title;
          const author = item.volumeInfo.authors?.[0] || 'Unknown';
          
          const normalizedKey = `${normalizeText(title)}_${normalizeText(author)}_${lang}`;
          
          if (existingSet.has(normalizedKey)) {
            totalSkipped++;
            continue;
          }

          const bookData = {
            title,
            author,
            lang,
            category: 'personal_development',
            description: item.volumeInfo.description,
            published_year: extractYear(item.volumeInfo.publishedDate),
            page_count: item.volumeInfo.pageCount,
            isbn: extractISBN(item.volumeInfo.industryIdentifiers),
            google_books_id: item.id,
            cover_url: item.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:'),
            is_active: true,
            popularity: 0
          };

          const { error } = await supabase
            .from('books')
            .insert(bookData);

          if (error) {
            console.error(`Error inserting ${title}:`, error);
            totalErrors++;
          } else {
            console.log(`✓ Inserted: ${title} by ${author}`);
            totalInserted++;
            existingSet.add(normalizedKey);
          }
        }
      }
    }

    const summary = {
      success: true,
      totalInserted,
      totalSkipped,
      totalErrors,
      message: `Successfully populated ${totalInserted} personal development books`
    };

    console.log('\n=== SUMMARY ===');
    console.log(summary);

    return new Response(JSON.stringify(summary), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
