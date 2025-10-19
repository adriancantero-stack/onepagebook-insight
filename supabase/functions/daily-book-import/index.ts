import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';
import { mapGoogleCategory } from '../_shared/categoryMapper.ts';

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
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    categories?: string[];
    publishedDate?: string;
    pageCount?: number;
    industryIdentifiers?: Array<{
      type: string;
      identifier: string;
    }>;
    language: string;
  };
}

// Categorias amplas para importação diversificada
const SEARCH_QUERIES = [
  'technology', 'science', 'business', 'psychology', 'health',
  'programming', 'mathematics', 'physics', 'biology', 'engineering',
  'finance', 'economics', 'marketing', 'management', 'leadership',
  'history', 'philosophy', 'education', 'art', 'design',
  'self-help', 'productivity', 'innovation', 'artificial intelligence',
  'data science', 'medicine', 'nutrition', 'fitness', 'sustainability'
];

// Categorias a filtrar (pornografia e similares)
const BLOCKED_CATEGORIES = ['erotica', 'adult', 'pornography', 'xxx'];

async function fetchGoogleBooks(query: string, lang: string, maxResults: number = 40): Promise<GoogleBookItem[]> {
  const langCode = lang === 'pt' ? 'pt' : lang === 'es' ? 'es' : 'en';
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&langRestrict=${langCode}&maxResults=${maxResults}&orderBy=relevance&printType=books`;
  
  console.log(`Fetching from Google Books: ${url}`);
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Google Books API error: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.items || [];
}

async function fetchOpenLibrary(query: string, maxResults: number = 20): Promise<any[]> {
  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=${maxResults}`;
  
  console.log(`Fetching from Open Library: ${url}`);
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Open Library API error: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.docs || [];
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, '')
    .trim();
}

function extractISBN(identifiers?: Array<{ type: string; identifier: string }>): string | null {
  if (!identifiers) return null;
  const isbn13 = identifiers.find(id => id.type === 'ISBN_13');
  if (isbn13) return isbn13.identifier;
  const isbn10 = identifiers.find(id => id.type === 'ISBN_10');
  return isbn10?.identifier || null;
}

function extractYear(dateString?: string): number | null {
  if (!dateString) return null;
  const year = parseInt(dateString.substring(0, 4));
  return isNaN(year) ? null : year;
}

function isBlockedCategory(categories?: string[]): boolean {
  if (!categories) return false;
  const normalizedCategories = categories.map(c => c.toLowerCase());
  return BLOCKED_CATEGORIES.some(blocked => 
    normalizedCategories.some(cat => cat.includes(blocked))
  );
}

// Função para buscar ASIN da Amazon via ISBN
async function fetchAsinFromIsbn(isbn: string | null): Promise<string | null> {
  if (!isbn) return null;
  
  try {
    // Usando API da Amazon Product Advertising (simulação - em produção precisaria de credenciais)
    // Por ora, apenas retornamos null, mas a estrutura está pronta para integração
    return null;
  } catch (error) {
    console.error('Error fetching ASIN:', error);
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 Starting daily book import (target: 100 books)');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const TARGET_BOOKS = 100;
    const languages = ['en', 'pt', 'es']; // Prioriza inglês para conteúdo técnico
    
    let totalInserted = 0;
    let totalSkipped = 0;
    let totalErrors = 0;
    const importLog: string[] = [];

    const booksToImport: any[] = [];
    const seenKeys = new Set<string>();

    // Randomizar queries para variedade
    const shuffledQueries = SEARCH_QUERIES.sort(() => Math.random() - 0.5);

    for (const query of shuffledQueries) {
      if (booksToImport.length >= TARGET_BOOKS) {
        break;
      }

      console.log(`\n📚 Searching for: ${query}`);
      
      for (const lang of languages) {
        if (booksToImport.length >= TARGET_BOOKS) {
          break;
        }

        try {
          // Google Books
          const googleItems = await fetchGoogleBooks(query, lang, 20);
          
          for (const item of googleItems) {
            if (booksToImport.length >= TARGET_BOOKS) break;

            if (!item.volumeInfo.title || !item.volumeInfo.authors?.[0]) {
              continue;
            }

            // Filtrar categorias bloqueadas
            if (isBlockedCategory(item.volumeInfo.categories)) {
              console.log(`⛔ Blocked category: ${item.volumeInfo.title}`);
              continue;
            }

            const title = item.volumeInfo.title;
            const author = item.volumeInfo.authors[0];
            const normalizedKey = `${normalizeText(title)}_${normalizeText(author)}_${lang}`;

            if (seenKeys.has(normalizedKey)) {
              continue;
            }

            // Check if already exists in database
            const { data: existing } = await supabase
              .from('books')
              .select('id')
              .eq('lang', lang)
              .eq('title_normalized', normalizeText(title))
              .eq('author_normalized', normalizeText(author))
              .maybeSingle();

            if (existing) {
              totalSkipped++;
              continue;
            }

            seenKeys.add(normalizedKey);

            const isbn = extractISBN(item.volumeInfo.industryIdentifiers);
            const coverUrl = item.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') 
              || item.volumeInfo.imageLinks?.smallThumbnail?.replace('http:', 'https:')
              || null;

            const googleCategory = item.volumeInfo.categories?.[0] || query;
            const mappedCategory = mapGoogleCategory(googleCategory, 'business');

            booksToImport.push({
              title,
              author,
              lang: lang,
              google_books_id: item.id,
              isbn: isbn,
              asin: await fetchAsinFromIsbn(isbn), // Tentará buscar ASIN
              description: item.volumeInfo.description?.substring(0, 1000) || null,
              category: mappedCategory,
              published_year: extractYear(item.volumeInfo.publishedDate),
              page_count: item.volumeInfo.pageCount || null,
              cover_url: coverUrl,
              is_active: true,
              popularity: 0,
              tags: item.volumeInfo.categories || [query]
            });

            console.log(`✓ Added: ${title} (${lang})`);
          }

          // Open Library como complemento
          if (booksToImport.length < TARGET_BOOKS) {
            try {
              const openLibDocs = await fetchOpenLibrary(query, 10);
              
              for (const doc of openLibDocs) {
                if (booksToImport.length >= TARGET_BOOKS) break;
                if (!doc.title || !doc.author_name?.[0]) continue;
                
                const title = doc.title;
                const author = doc.author_name[0];
                const normalizedKey = `${normalizeText(title)}_${normalizeText(author)}_${lang}`;
                
                if (seenKeys.has(normalizedKey)) continue;
                
                const { data: existing } = await supabase
                  .from('books')
                  .select('id')
                  .eq('lang', lang)
                  .eq('title_normalized', normalizeText(title))
                  .eq('author_normalized', normalizeText(author))
                  .maybeSingle();

                if (existing) {
                  totalSkipped++;
                  continue;
                }
                
                seenKeys.add(normalizedKey);
                
                const isbn = doc.isbn?.[0] || null;
                
                booksToImport.push({
                  title,
                  author,
                  lang: lang,
                  isbn: isbn,
                  asin: await fetchAsinFromIsbn(isbn),
                  description: doc.first_sentence?.join(' ').substring(0, 1000) || null,
                  category: mapGoogleCategory(query, 'business'),
                  published_year: doc.first_publish_year || null,
                  page_count: doc.number_of_pages_median || null,
                  cover_url: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg` : null,
                  is_active: true,
                  popularity: 0,
                  tags: [query]
                });

                console.log(`✓ Added from OL: ${title} (${lang})`);
              }
            } catch (olError) {
              console.error(`Error with Open Library for ${query}:`, olError);
            }
          }

          // Rate limiting
          await new Promise(resolve => setTimeout(resolve, 500));
          
        } catch (error) {
          console.error(`Error fetching ${query} (${lang}):`, error);
          totalErrors++;
        }
      }
    }

    // Record import start
    const { data: historyRecord } = await supabase
      .from('book_import_history')
      .insert({
        status: 'running',
        books_imported: 0
      })
      .select()
      .single();

    const historyId = historyRecord?.id;

    // Insert books
    if (booksToImport.length > 0) {
      console.log(`\n💾 Inserting ${booksToImport.length} books...`);
      let insertedCount = 0;

      for (const book of booksToImport) {
        const { error } = await supabase
          .from('books')
          .insert([book]);

        if (error) {
          if (error.code !== '23505') { // Skip duplicate errors
            console.error(`Error inserting "${book.title}":`, error.message);
            totalErrors++;
          } else {
            totalSkipped++;
          }
        } else {
          insertedCount++;
        }
      }

      totalInserted = insertedCount;
      importLog.push(`✅ Successfully imported ${insertedCount} books`);
      importLog.push(`⏭️  Skipped ${totalSkipped} duplicates`);
      if (totalErrors > 0) {
        importLog.push(`⚠️  ${totalErrors} errors occurred`);
      }
      
      console.log(`\n✅ Import completed: ${insertedCount} inserted, ${totalSkipped} skipped, ${totalErrors} errors`);
    } else {
      importLog.push('ℹ️ No new books to import');
    }

    // Update import history
    if (historyId) {
      await supabase
        .from('book_import_history')
        .update({
          status: 'completed',
          books_imported: totalInserted,
          completed_at: new Date().toISOString()
        })
        .eq('id', historyId);
    }

    const result = {
      success: true,
      stats: {
        target: TARGET_BOOKS,
        inserted: totalInserted,
        skipped: totalSkipped,
        errors: totalErrors
      },
      log: importLog
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('❌ Error in daily-book-import function:', error);
    const errorMsg = error instanceof Error ? error.message : String(error);
    
    // Try to record error in history
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      await supabase
        .from('book_import_history')
        .insert({
          status: 'failed',
          books_imported: 0,
          error_message: errorMsg,
          completed_at: new Date().toISOString()
        });
    } catch (historyError) {
      console.error('Failed to record error in history:', historyError);
    }
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMsg,
        stats: { target: 100, inserted: 0, skipped: 0, errors: 1 }
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
