import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface BookValidationResult {
  id: string
  title: string
  author: string
  status: 'valid' | 'invalid' | 'uncertain'
  foundTitle?: string
  foundAuthor?: string
  googleBooksId?: string
  isbn?: string
  reason?: string
}

async function searchGoogleBooks(title: string, author: string, lang: string): Promise<any> {
  const query = `${title} ${author}`.trim()
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&langRestrict=${lang}&maxResults=5`
  
  console.log('Searching Google Books:', { title, author, lang, url })
  
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Google Books API error: ${response.status}`)
  }
  
  const data = await response.json()
  return data.items || []
}

async function searchOpenLibrary(title: string, author: string): Promise<any> {
  const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}&limit=5`
  
  console.log('Searching Open Library:', { title, author, url })
  
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Open Library API error: ${response.status}`)
  }
  
  const data = await response.json()
  return data.docs || []
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, '')
    .trim()
}

function calculateSimilarity(str1: string, str2: string): number {
  const norm1 = normalizeText(str1)
  const norm2 = normalizeText(str2)
  
  if (norm1 === norm2) return 1.0
  if (norm1.includes(norm2) || norm2.includes(norm1)) return 0.8
  
  const words1 = norm1.split(/\s+/)
  const words2 = norm2.split(/\s+/)
  const commonWords = words1.filter(w => words2.includes(w))
  
  if (commonWords.length === 0) return 0
  return commonWords.length / Math.max(words1.length, words2.length)
}

function validateBookFromGoogleBooks(bookTitle: string, bookAuthor: string, googleResults: any[]): { status: BookValidationResult['status'], foundInfo?: any } {
  for (const item of googleResults) {
    const volumeInfo = item.volumeInfo
    const title = volumeInfo.title || ''
    const authors = volumeInfo.authors || []
    
    const titleSimilarity = calculateSimilarity(bookTitle, title)
    const authorSimilarity = authors.length > 0 
      ? Math.max(...authors.map((a: string) => calculateSimilarity(bookAuthor, a)))
      : 0
    
    console.log('Comparing (Google Books):', { 
      bookTitle, 
      foundTitle: title, 
      titleSimilarity,
      bookAuthor,
      foundAuthors: authors,
      authorSimilarity 
    })
    
    if (titleSimilarity >= 0.7 && authorSimilarity >= 0.6) {
      return {
        status: 'valid',
        foundInfo: {
          foundTitle: volumeInfo.title,
          foundAuthor: volumeInfo.authors?.join(', '),
          googleBooksId: item.id,
          isbn: volumeInfo.industryIdentifiers?.find((id: any) => 
            id.type === 'ISBN_13' || id.type === 'ISBN_10'
          )?.identifier
        }
      }
    }
  }
  
  return { status: googleResults.length > 0 ? 'uncertain' : 'invalid' }
}

function validateBookFromOpenLibrary(bookTitle: string, bookAuthor: string, openLibResults: any[]): { status: BookValidationResult['status'], foundInfo?: any } {
  for (const doc of openLibResults) {
    const title = doc.title || ''
    const authors = doc.author_name || []
    
    const titleSimilarity = calculateSimilarity(bookTitle, title)
    const authorSimilarity = authors.length > 0 
      ? Math.max(...authors.map((a: string) => calculateSimilarity(bookAuthor, a)))
      : 0
    
    console.log('Comparing (Open Library):', { 
      bookTitle, 
      foundTitle: title, 
      titleSimilarity,
      bookAuthor,
      foundAuthors: authors,
      authorSimilarity 
    })
    
    if (titleSimilarity >= 0.7 && authorSimilarity >= 0.6) {
      return {
        status: 'valid',
        foundInfo: {
          foundTitle: doc.title,
          foundAuthor: doc.author_name?.join(', '),
          isbn: doc.isbn?.[0]
        }
      }
    }
  }
  
  return { status: openLibResults.length > 0 ? 'uncertain' : 'invalid' }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { limit = 50, offset = 0, lang } = await req.json()

    console.log('Validating books:', { limit, offset, lang })

    // Get books without identifiers
    let query = supabase
      .from('books')
      .select('id, title, author, lang, isbn, google_books_id, asin, cover_url')
      .is('isbn', null)
      .is('google_books_id', null)
      .is('asin', null)
      .eq('is_active', true)
      .range(offset, offset + limit - 1)

    if (lang) {
      query = query.eq('lang', lang)
    }

    const { data: books, error: fetchError } = await query

    if (fetchError) {
      throw fetchError
    }

    console.log(`Found ${books?.length || 0} books to validate`)

    const results: BookValidationResult[] = []
    
    for (const book of books || []) {
      try {
        // Add delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 200))
        
        // Try Google Books first
        const googleResults = await searchGoogleBooks(book.title, book.author, book.lang)
        let validationResult = validateBookFromGoogleBooks(book.title, book.author, googleResults)
        
        let source = 'Google Books'
        
        // If not found in Google Books, try Open Library
        if (validationResult.status === 'invalid') {
          console.log('Not found in Google Books, trying Open Library...')
          const openLibResults = await searchOpenLibrary(book.title, book.author)
          const openLibValidation = validateBookFromOpenLibrary(book.title, book.author, openLibResults)
          
          if (openLibValidation.status !== 'invalid') {
            validationResult = openLibValidation
            source = 'Open Library'
          }
        }
        
        results.push({
          id: book.id,
          title: book.title,
          author: book.author,
          status: validationResult.status,
          ...validationResult.foundInfo,
          reason: validationResult.status === 'invalid' 
            ? 'Não encontrado no Google Books nem Open Library'
            : validationResult.status === 'uncertain'
            ? `Encontrado no ${source} mas com diferenças significativas`
            : `Validado com sucesso via ${source}`
        })
        
        console.log('Validation result:', results[results.length - 1])
        
      } catch (error) {
        console.error(`Error validating book ${book.title}:`, error)
        const errorMsg = error instanceof Error ? error.message : 'Unknown error'
        results.push({
          id: book.id,
          title: book.title,
          author: book.author,
          status: 'uncertain',
          reason: 'Erro ao verificar: ' + errorMsg
        })
      }
    }

    const summary = {
      total: results.length,
      valid: results.filter(r => r.status === 'valid').length,
      invalid: results.filter(r => r.status === 'invalid').length,
      uncertain: results.filter(r => r.status === 'uncertain').length
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        results,
        summary,
        message: `Validados ${summary.total} livros: ${summary.valid} válidos, ${summary.invalid} inválidos, ${summary.uncertain} incertos`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: errorMsg }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})