import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GoogleBookItem {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    publishedDate?: string;
    description?: string;
    categories?: string[];
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    industryIdentifiers?: Array<{
      type: string;
      identifier: string;
    }>;
    pageCount?: number;
  };
}

const NEW_CATEGORIES = [
  { key: 'fiction', queries: { pt: 'ficção', en: 'fiction', es: 'ficción' } },
  { key: 'romance', queries: { pt: 'romance', en: 'romantic fiction', es: 'novela romantica' } },
  { key: 'thriller', queries: { pt: 'suspense', en: 'thriller', es: 'suspenso' } },
  { key: 'fantasy', queries: { pt: 'fantasia', en: 'fantasy fiction', es: 'fantasía' } },
  { key: 'wellness', queries: { pt: 'bem-estar', en: 'wellness', es: 'bienestar' } },
  { key: 'history', queries: { pt: 'história', en: 'history', es: 'historia' } },
  { key: 'science', queries: { pt: 'ciência', en: 'science', es: 'ciencia' } },
];

const LANGUAGES = ['pt', 'en', 'es'];

async function fetchGoogleBooks(query: string, lang: string, maxResults = 20): Promise<GoogleBookItem[]> {
  const apiKey = Deno.env.get('GOOGLE_BOOKS_API_KEY') || '';
  const langCode = lang === 'pt' ? 'pt-BR' : lang === 'es' ? 'es' : 'en';
  
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&langRestrict=${langCode}&maxResults=${maxResults}&orderBy=relevance&key=${apiKey}`;
  
  console.log(`Fetching from Google Books: ${query} (${lang})`);
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Error fetching from Google Books:', error);
    return [];
  }
}

function extractISBN(identifiers?: Array<{ type: string; identifier: string }>): string | null {
  if (!identifiers) return null;
  const isbn13 = identifiers.find(id => id.type === 'ISBN_13');
  if (isbn13) return isbn13.identifier;
  const isbn10 = identifiers.find(id => id.type === 'ISBN_10');
  return isbn10 ? isbn10.identifier : null;
}

function extractYear(dateString?: string): number | null {
  if (!dateString) return null;
  const yearMatch = dateString.match(/^\d{4}/);
  return yearMatch ? parseInt(yearMatch[0]) : null;
}

function normalizeText(text: string | undefined): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, '')
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

    const stats = {
      total: 0,
      inserted: 0,
      skipped: 0,
      errors: 0,
    };

    const log: string[] = [];

    // Get existing books to avoid duplicates
    const { data: existingBooks } = await supabase
      .from('books')
      .select('title, author, lang');

    const existingSet = new Set(
      (existingBooks || []).map(b => 
        `${normalizeText(b.title)}-${normalizeText(b.author)}-${b.lang}`
      )
    );

    // Process each new category
    for (const category of NEW_CATEGORIES) {
      log.push(`\n=== Processing category: ${category.key} ===`);
      
      for (const lang of LANGUAGES) {
        const query = category.queries[lang as keyof typeof category.queries];
        log.push(`Fetching ${lang} books for "${query}"...`);
        
        const books = await fetchGoogleBooks(query, lang, 20);
        log.push(`Found ${books.length} books from Google Books`);
        
        for (const item of books) {
          stats.total++;
          
          const title = item.volumeInfo.title;
          const author = item.volumeInfo.authors?.[0] || 'Unknown';
          const normalizedKey = `${normalizeText(title)}-${normalizeText(author)}-${lang}`;
          
          // Skip if already exists
          if (existingSet.has(normalizedKey)) {
            stats.skipped++;
            continue;
          }
          
          // Prepare book data
          const bookData = {
            title,
            author,
            lang,
            category: category.key,
            description: item.volumeInfo.description?.substring(0, 1000) || null,
            cover_url: item.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') || null,
            published_year: extractYear(item.volumeInfo.publishedDate),
            isbn: extractISBN(item.volumeInfo.industryIdentifiers),
            google_books_id: item.id,
            page_count: item.volumeInfo.pageCount || null,
            is_active: true,
            popularity: 0,
          };
          
          // Insert into database
          const { error } = await supabase
            .from('books')
            .insert(bookData);
          
          if (error) {
            console.error('Error inserting book:', error);
            stats.errors++;
            log.push(`❌ Error inserting "${title}": ${error.message}`);
          } else {
            stats.inserted++;
            existingSet.add(normalizedKey);
            log.push(`✅ Inserted: "${title}" by ${author}`);
          }
        }
        
        // Small delay to respect API rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    log.push(`\n=== Import Complete ===`);
    log.push(`Total processed: ${stats.total}`);
    log.push(`Successfully inserted: ${stats.inserted}`);
    log.push(`Skipped (duplicates): ${stats.skipped}`);
    log.push(`Errors: ${stats.errors}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        stats,
        log: log.join('\n')
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in populate-new-categories:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
