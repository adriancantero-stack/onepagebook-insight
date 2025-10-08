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

const CATEGORIES_BY_LANG = {
  pt: [
    'negócios',
    'autoajuda',
    'psicologia',
    'saúde',
    'desenvolvimento pessoal',
    'finanças',
    'produtividade',
    'liderança'
  ],
  en: [
    'business',
    'self-help',
    'psychology',
    'health',
    'personal development',
    'finance',
    'productivity',
    'leadership'
  ],
  es: [
    'negocios',
    'autoayuda',
    'psicología',
    'salud',
    'desarrollo personal',
    'finanzas',
    'productividad',
    'liderazgo'
  ]
};

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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { lang = 'all', target = 100, categories = [] } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const languages = lang === 'all' ? ['pt', 'en', 'es'] : [lang];
    
    let totalInserted = 0;
    let totalSkipped = 0;
    let totalErrors = 0;
    const importLog: string[] = [];

    for (const currentLang of languages) {
      console.log(`\n=== Importing books for language: ${currentLang} ===`);
      importLog.push(`Starting import for ${currentLang.toUpperCase()}`);
      
      const categoriesToUse = categories.length > 0 
        ? categories 
        : CATEGORIES_BY_LANG[currentLang as keyof typeof CATEGORIES_BY_LANG];
      
      const booksToImport: any[] = [];
      const seenKeys = new Set<string>();

      for (const category of categoriesToUse) {
        console.log(`Fetching category: ${category}`);
        
        try {
          // Try Google Books first
          const items = await fetchGoogleBooks(category, currentLang, 20);
          
          for (const item of items) {
            if (!item.volumeInfo.title || !item.volumeInfo.authors?.[0]) {
              continue;
            }

            const title = item.volumeInfo.title;
            const author = item.volumeInfo.authors[0];
            const normalizedKey = `${normalizeText(title)}_${normalizeText(author)}_${currentLang}`;

            if (seenKeys.has(normalizedKey)) {
              continue;
            }

            // Check if already exists in database
            const { data: existing } = await supabase
              .from('books')
              .select('id')
              .eq('lang', currentLang)
              .ilike('title', title)
              .ilike('author', author)
              .maybeSingle();

            if (existing) {
              console.log(`Skipping duplicate: ${title} by ${author}`);
              totalSkipped++;
              continue;
            }

            seenKeys.add(normalizedKey);

            const coverUrl = item.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:') 
              || item.volumeInfo.imageLinks?.smallThumbnail?.replace('http:', 'https:')
              || null;

            // Map Google Books category to OnePageBook predefined category
            const googleCategory = item.volumeInfo.categories?.[0] || category;
            const mappedCategory = mapGoogleCategory(googleCategory, 'business');

            booksToImport.push({
              title,
              author,
              lang: currentLang,
              google_books_id: item.id,
              isbn: extractISBN(item.volumeInfo.industryIdentifiers),
              description: item.volumeInfo.description?.substring(0, 1000) || null,
              category: mappedCategory,
              published_year: extractYear(item.volumeInfo.publishedDate),
              page_count: item.volumeInfo.pageCount || null,
              cover_url: coverUrl,
              is_active: true,
              popularity: 0,
              tags: item.volumeInfo.categories || [category]
            });

            if (booksToImport.length >= target) {
              break;
            }
          }

          // If we didn't get enough books from Google Books, try Open Library
          if (booksToImport.length < target) {
            console.log(`Complementing with Open Library for category: ${category}`);
            try {
              const openLibDocs = await fetchOpenLibrary(category, 10);
              
              for (const doc of openLibDocs) {
                if (!doc.title || !doc.author_name?.[0]) continue;
                
                const title = doc.title;
                const author = doc.author_name[0];
                const normalizedKey = `${normalizeText(title)}_${normalizeText(author)}_${currentLang}`;
                
                if (seenKeys.has(normalizedKey)) continue;
                
                // Check if already exists in database
                const { data: existing } = await supabase
                  .from('books')
                  .select('id')
                  .eq('lang', currentLang)
                  .ilike('title', title)
                  .ilike('author', author)
                  .maybeSingle();

                if (existing) {
                  totalSkipped++;
                  continue;
                }
                
                seenKeys.add(normalizedKey);
                
                booksToImport.push({
                  title,
                  author,
                  lang: currentLang,
                  isbn: doc.isbn?.[0] || null,
                  description: doc.first_sentence?.join(' ').substring(0, 1000) || null,
                  category: mapGoogleCategory(category, 'business'),
                  published_year: doc.first_publish_year || null,
                  page_count: doc.number_of_pages_median || null,
                  cover_url: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg` : null,
                  is_active: true,
                  popularity: 0,
                  tags: [category]
                });
                
                if (booksToImport.length >= target) break;
              }
            } catch (olError) {
              console.error(`Error fetching Open Library for ${category}:`, olError);
            }
          }

          // Small delay to respect rate limits
          await new Promise(resolve => setTimeout(resolve, 500));
          
        } catch (error) {
          console.error(`Error fetching category ${category}:`, error);
          totalErrors++;
          const errorMsg = error instanceof Error ? error.message : String(error);
          importLog.push(`Error in category ${category}: ${errorMsg}`);
        }

        if (booksToImport.length >= target) {
          break;
        }
      }

      // Insert books one by one to handle duplicates gracefully
      if (booksToImport.length > 0) {
        console.log(`Inserting ${booksToImport.length} books for ${currentLang}`);
        let insertedCount = 0;
        let errorCount = 0;

        for (const book of booksToImport) {
          const { error } = await supabase
            .from('books')
            .insert([book]);

          if (error) {
            // Skip duplicates silently (code 23505), log other errors
            if (error.code !== '23505') {
              console.error(`Error inserting "${book.title}":`, error.message);
              errorCount++;
            }
          } else {
            insertedCount++;
          }
        }

        totalInserted += insertedCount;
        totalErrors += errorCount;
        importLog.push(`✓ Imported ${insertedCount} books for ${currentLang.toUpperCase()}`);
        console.log(`Inserted ${insertedCount}/${booksToImport.length} for ${currentLang}`);
      } else {
        importLog.push(`No new books found for ${currentLang.toUpperCase()}`);
      }
    }

    const result = {
      success: true,
      stats: {
        inserted: totalInserted,
        skipped: totalSkipped,
        errors: totalErrors
      },
      log: importLog
    };

    console.log('Import completed:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in import-google-books function:', error);
    const errorMsg = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMsg,
        stats: { inserted: 0, skipped: 0, errors: 1 }
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
