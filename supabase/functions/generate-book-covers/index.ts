import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get all books without cover_url
    const { data: books, error: fetchError } = await supabase
      .from('books')
      .select('id, title, author, lang')
      .or('cover_url.is.null,cover_url.eq.')
      .limit(100)

    if (fetchError) {
      throw fetchError
    }

    console.log(`Found ${books?.length || 0} books without covers`)

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[]
    }

    for (const book of books || []) {
      try {
        console.log(`Generating cover for: ${book.title} by ${book.author}`)

        // Generate book cover using Lovable AI
        const imagePrompt = `A professional book cover design for "${book.title}" by ${book.author}. Modern, minimalist design with elegant typography. Clean and sophisticated aesthetic. High quality, professional publishing standard. 3:4 aspect ratio.`

        const imageResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${lovableApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-image-preview",
            messages: [
              {
                role: "user",
                content: imagePrompt
              }
            ],
            modalities: ["image", "text"]
          })
        })

        const imageData = await imageResponse.json()
        const imageUrl = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url

        if (!imageUrl) {
          throw new Error('No image URL returned from AI')
        }

        // Convert base64 to blob
        const base64Data = imageUrl.split(',')[1]
        const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0))
        
        // Upload to Supabase Storage
        const fileName = `${book.id}.png`
        const { error: uploadError } = await supabase.storage
          .from('book-covers')
          .upload(fileName, binaryData, {
            contentType: 'image/png',
            upsert: true
          })

        if (uploadError) {
          throw uploadError
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('book-covers')
          .getPublicUrl(fileName)

        // Update book with cover URL
        const { error: updateError } = await supabase
          .from('books')
          .update({ cover_url: publicUrl })
          .eq('id', book.id)

        if (updateError) {
          throw updateError
        }

        console.log(`✓ Cover generated for: ${book.title}`)
        results.success++
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000))

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        console.error(`✗ Failed to generate cover for ${book.title}:`, error)
        results.failed++
        results.errors.push(`${book.title}: ${errorMessage}`)
      }
    }

    return new Response(
      JSON.stringify({
        message: 'Book cover generation completed',
        results,
        total: books?.length || 0
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorDetails = error instanceof Error ? error.toString() : String(error)
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: errorDetails
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})