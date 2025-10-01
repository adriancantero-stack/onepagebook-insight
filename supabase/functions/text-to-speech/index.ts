import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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
    const { text, language } = await req.json()

    if (!text) {
      throw new Error('Text is required')
    }

    console.log('Generating speech for text length:', text.length, 'language:', language)

    // Map language to appropriate voice
    const voiceMap: { [key: string]: string } = {
      'pt': 'alloy',
      'en': 'nova',
      'es': 'shimmer',
    }

    const voice = voiceMap[language] || 'alloy'

    // Initialize OpenAI
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured')
    }

    // Split text into chunks if necessary
    const textChunks = splitTextIntoChunks(text);
    console.log(`Processing ${textChunks.length} chunk(s)`)

    const audioChunks: string[] = [];

    // Generate speech for each chunk
    for (let i = 0; i < textChunks.length; i++) {
      const chunk = textChunks[i];
      console.log(`Calling OpenAI TTS API for chunk ${i + 1}/${textChunks.length} with voice:`, voice)
      
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'tts-1',
          input: chunk,
          voice: voice,
          response_format: 'mp3',
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`OpenAI API error for chunk ${i + 1}:`, response.status, errorText)
        throw new Error(`Failed to generate speech for chunk ${i + 1}: ${errorText}`)
      }

      console.log(`Chunk ${i + 1} generated successfully`)

      // Convert audio buffer to base64
      const arrayBuffer = await response.arrayBuffer()
      const base64Audio = btoa(
        String.fromCharCode(...new Uint8Array(arrayBuffer))
      )
      audioChunks.push(base64Audio);
    }

    return new Response(
      JSON.stringify({ 
        audioChunks,
        mimeType: 'audio/mpeg'
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
