import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Convert ArrayBuffer to base64 safely without stack overflow
const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunkSize = 8192; // Process in smaller chunks to avoid stack overflow
  
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }
  
  return btoa(binary);
};

// Split text into chunks at natural boundaries
const splitTextIntoChunks = (text: string, maxChars: number = 3500): string[] => {
  if (text.length <= maxChars) {
    return [text];
  }

  const chunks: string[] = [];
  const paragraphs = text.split('\n\n');
  let currentChunk = '';

  for (const paragraph of paragraphs) {
    // If adding this paragraph would exceed the limit
    if (currentChunk.length + paragraph.length + 2 > maxChars) {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = '';
      }

      // If a single paragraph is too long, split by sentences
      if (paragraph.length > maxChars) {
        const sentences = paragraph.match(/[^.!?]+[.!?]+/g) || [paragraph];
        for (const sentence of sentences) {
          if (currentChunk.length + sentence.length > maxChars) {
            if (currentChunk) {
              chunks.push(currentChunk.trim());
              currentChunk = '';
            }
            // If even a single sentence is too long, force split
            if (sentence.length > maxChars) {
              for (let i = 0; i < sentence.length; i += maxChars) {
                chunks.push(sentence.slice(i, i + maxChars));
              }
            } else {
              currentChunk = sentence;
            }
          } else {
            currentChunk += sentence;
          }
        }
      } else {
        currentChunk = paragraph;
      }
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { text, language, summaryId } = await req.json()

    // Initialize Supabase client with service role key (bypasses RLS)
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    if (!text || !summaryId) {
      throw new Error('Text and summaryId are required')
    }

    console.log('Processing audio request for summary:', summaryId, 'language:', language)

    // Check if audio already exists in cache for this specific summary
    const { data: existingAudio, error: audioError } = await supabase
      .from('book_audio')
      .select('audio_url')
      .eq('book_summary_id', summaryId)
      .eq('language', language)
      .maybeSingle()

    if (existingAudio && !audioError) {
      console.log('✅ Audio found in user cache, returning URL')
      
      // Get signed URL for the audio file
      const { data: signedUrl } = await supabase.storage
        .from('book-audio')
        .createSignedUrl(existingAudio.audio_url, 3600) // 1 hour expiry
      
      if (signedUrl) {
        return new Response(
          JSON.stringify({ 
            audioUrl: signedUrl.signedUrl,
            cached: true
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }
    }

    // If not in user cache, check global cache
    // First, get the canonical book info from the current summary
    console.log('🔍 Checking global audio cache...')
    const { data: currentSummary } = await supabase
      .from('book_summaries')
      .select('canonical_title, canonical_author')
      .eq('id', summaryId)
      .single()

    if (currentSummary?.canonical_title) {
      // Look for any other summary of the same book (same canonical title + author)
      const { data: otherSummaries } = await supabase
        .from('book_summaries')
        .select('id')
        .eq('canonical_title', currentSummary.canonical_title)
        .eq('canonical_author', currentSummary.canonical_author)
        .neq('id', summaryId)
        .limit(1)

      if (otherSummaries && otherSummaries.length > 0) {
        // Check if any of these summaries have audio in the same language
        const { data: globalAudio } = await supabase
          .from('book_audio')
          .select('audio_url, book_summary_id')
          .eq('language', language)
          .in('book_summary_id', otherSummaries.map(s => s.id))
          .limit(1)
          .maybeSingle()

        if (globalAudio) {
          console.log('✅ Audio found in global cache! Returning existing audio.')
          
          // Get signed URL for the existing audio file
          const { data: signedUrl } = await supabase.storage
            .from('book-audio')
            .createSignedUrl(globalAudio.audio_url, 3600)
          
          if (signedUrl) {
            return new Response(
              JSON.stringify({ 
                audioUrl: signedUrl.signedUrl,
                cached: true,
                globalCache: true
              }),
              {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              }
            )
          }
        }
      }
    }

    console.log('Audio not in cache, generating new audio for text length:', text.length)

    // Map language to the best ElevenLabs voice ID for each region
    const voiceMap: { [key: string]: string } = {
      'pt': 'XrExE9yKIg1WjnnlVkGX', // Matilda - warm, young female, works great for Brazilian Portuguese audiobooks
      'en': '21m00Tcm4TlvDq8ikWAM', // Rachel - calm, natural American English female, most popular voice
      'es': 'oWAxZDx7w5VEj9dCyTzz', // Grace - young American Southern female, optimized for Mexican/Latin American Spanish
    }

    const voiceId = voiceMap[language] || 'XrExE9yKIg1WjnnlVkGX'

    // Get ElevenLabs API key
    const ELEVEN_LABS_API_KEY = Deno.env.get('ELEVEN_LABS_API_KEY')
    if (!ELEVEN_LABS_API_KEY) {
      throw new Error('ELEVEN_LABS_API_KEY is not configured')
    }

    // Split text into chunks if necessary (ElevenLabs has a 5000 char limit)
    const textChunks = splitTextIntoChunks(text, 4500);
    console.log(`Processing ${textChunks.length} chunk(s)`)

    const audioChunks: string[] = [];

    // Generate speech for each chunk using ElevenLabs
    for (let i = 0; i < textChunks.length; i++) {
      const chunk = textChunks[i];
      console.log(`Calling ElevenLabs TTS API for chunk ${i + 1}/${textChunks.length} with voice ID:`, voiceId)
      
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'xi-api-key': ELEVEN_LABS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: chunk,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          }
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`ElevenLabs API error for chunk ${i + 1}:`, response.status, errorText)
        
        // Parse error message to provide better feedback
        let errorMessage = errorText;
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.detail?.status === 'quota_exceeded') {
            errorMessage = 'QUOTA_EXCEEDED';
          } else if (errorJson.detail?.message) {
            errorMessage = errorJson.detail.message;
          }
        } catch (e) {
          // Keep original error text if not JSON
        }
        
        throw new Error(errorMessage)
      }

      console.log(`Chunk ${i + 1} generated successfully`)

      // Convert audio buffer to base64 safely
      const arrayBuffer = await response.arrayBuffer()
      const base64Audio = arrayBufferToBase64(arrayBuffer);
      audioChunks.push(base64Audio);
    }

    // Combine all audio chunks into a single file
    console.log('Combining audio chunks...')
    const combinedAudioData = audioChunks.map(chunk => {
      const binary = atob(chunk)
      const bytes = new Uint8Array(binary.length)
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i)
      }
      return bytes
    })

    // Calculate total size and combine
    const totalSize = combinedAudioData.reduce((acc, chunk) => acc + chunk.length, 0)
    const combinedAudio = new Uint8Array(totalSize)
    let offset = 0
    for (const chunk of combinedAudioData) {
      combinedAudio.set(chunk, offset)
      offset += chunk.length
    }

    // Upload to storage
    const fileName = `${summaryId}/${language}.mp3`
    console.log('Uploading to storage:', fileName)
    
    const { error: uploadError } = await supabase.storage
      .from('book-audio')
      .upload(fileName, combinedAudio, {
        contentType: 'audio/mpeg',
        upsert: true
      })

    if (uploadError) {
      console.error('Error uploading to storage:', uploadError)
      throw uploadError
    }

    // Save metadata to database
    console.log('Saving metadata to database...')
    const { error: dbError } = await supabase
      .from('book_audio')
      .upsert({
        book_summary_id: summaryId,
        language: language,
        audio_url: fileName,
        file_size: totalSize,
        duration_seconds: null // We don't calculate duration
      }, {
        onConflict: 'book_summary_id,language'
      })

    if (dbError) {
      console.error('Error saving to database:', dbError)
      throw dbError
    }

    // Get signed URL for the uploaded file
    const { data: signedUrl } = await supabase.storage
      .from('book-audio')
      .createSignedUrl(fileName, 3600) // 1 hour expiry

    if (!signedUrl) {
      throw new Error('Failed to generate signed URL')
    }

    console.log('Audio generated and cached successfully')

    return new Response(
      JSON.stringify({ 
        audioUrl: signedUrl.signedUrl,
        cached: false
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Error in text-to-speech function:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
