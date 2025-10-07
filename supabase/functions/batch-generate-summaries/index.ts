import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing environment variables");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Buscar livros sem resumo (limite de 50 por execução)
    const { data: books, error: fetchError } = await supabase
      .from('books')
      .select('id, title, author, lang')
      .is('summary', null)
      .eq('is_active', true)
      .limit(50);

    if (fetchError) {
      console.error("Error fetching books:", fetchError);
      throw fetchError;
    }

    if (!books || books.length === 0) {
      console.log("No books pending summary generation");
      return new Response(
        JSON.stringify({ message: 'Nenhum livro pendente para gerar resumo', processed: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${books.length} books without summaries`);

    let processed = 0;
    let errors = 0;

    for (const book of books) {
      try {
        console.log(`Generating summary for: ${book.title} by ${book.author}`);

        const prompt = generatePrompt(book);
        const summary = await generateSummaryWithAI(prompt, LOVABLE_API_KEY);

        if (!summary || summary.trim().length === 0) {
          console.error(`Empty summary generated for book ${book.id}`);
          errors++;
          continue;
        }

        // Salvar resumo no banco
        const { error: updateError } = await supabase
          .from('books')
          .update({
            summary: summary,
            summary_generated_at: new Date().toISOString(),
          })
          .eq('id', book.id);

        if (updateError) {
          console.error(`Error updating book ${book.id}:`, updateError);
          errors++;
        } else {
          processed++;
          console.log(`✓ Summary saved for: ${book.title}`);
        }

        // Pequeno delay para não sobrecarregar a API
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error(`Error processing book ${book.id}:`, error);
        errors++;
      }
    }

    console.log(`Batch completed: ${processed} processed, ${errors} errors`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed, 
        errors,
        total: books.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Batch generation error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function generatePrompt(book: any): string {
  const prompts: Record<string, string> = {
    pt: `Crie um resumo conciso e prático do livro "${book.title}" de ${book.author}. 

O resumo deve ter entre 500-700 palavras e incluir:
- Uma breve introdução sobre o livro e seu propósito
- Os principais conceitos e ideias centrais
- Lições e aprendizados chave
- Aplicações práticas para o dia a dia

Mantenha um tom inspirador e acessível. Foque no que o leitor pode aprender e aplicar.`,
    
    en: `Create a concise and practical summary of the book "${book.title}" by ${book.author}.

The summary should be 500-700 words and include:
- A brief introduction about the book and its purpose
- Main concepts and central ideas
- Key lessons and learnings
- Practical applications for daily life

Keep an inspiring and accessible tone. Focus on what readers can learn and apply.`,
    
    es: `Crea un resumen conciso y práctico del libro "${book.title}" de ${book.author}.

El resumen debe tener entre 500-700 palabras e incluir:
- Una breve introducción sobre el libro y su propósito
- Los principales conceptos e ideas centrales
- Lecciones y aprendizajes clave
- Aplicaciones prácticas para el día a día

Mantén un tono inspirador y accesible. Enfócate en lo que el lector puede aprender y aplicar.`
  };

  return prompts[book.lang] || prompts['pt'];
}

async function generateSummaryWithAI(prompt: string, apiKey: string): Promise<string> {
  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages: [
        { 
          role: 'system', 
          content: 'You are an expert book summarizer. Create clear, engaging, and actionable book summaries that help readers understand and apply key concepts.' 
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('AI API Error:', response.status, errorText);
    throw new Error(`AI generation failed: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}
