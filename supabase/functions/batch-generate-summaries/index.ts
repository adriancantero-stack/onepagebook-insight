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

    let totalProcessed = 0;
    let totalErrors = 0;
    let batchNumber = 0;
    let hasMoreBooks = true;

    console.log("Iniciando geração de resumos em lotes...");

    // Loop para processar todos os livros de 10 em 10
    while (hasMoreBooks) {
      batchNumber++;
      console.log(`\n=== Processando lote ${batchNumber} ===`);

      // Buscar próximo lote de livros sem resumo
      const { data: books, error: fetchError } = await supabase
        .from('books')
        .select('id, title, author, lang')
        .is('summary', null)
        .eq('is_active', true)
        .limit(10);

      if (fetchError) {
        console.error("Error fetching books:", fetchError);
        throw fetchError;
      }

      if (!books || books.length === 0) {
        console.log("Não há mais livros sem resumo para processar.");
        hasMoreBooks = false;
        break;
      }

      console.log(`Encontrados ${books.length} livros neste lote`);

      let batchProcessed = 0;
      let batchErrors = 0;

      for (const book of books) {
        try {
          console.log(`Generating summary for: ${book.title} by ${book.author}`);

          const prompt = generatePrompt(book);
          
          let summary;
          try {
            summary = await generateSummaryWithAI(prompt, LOVABLE_API_KEY);
          } catch (aiError) {
            console.error(`AI error for book ${book.id}:`, aiError);
            batchErrors++;
            continue;
          }

          if (!summary || summary.trim().length === 0) {
            console.error(`Empty summary generated for book ${book.id}`);
            batchErrors++;
            continue;
          }

          // Atualizar livro com resumo gerado
          const { error: updateError } = await supabase
            .from('books')
            .update({
              summary: summary,
              summary_generated_at: new Date().toISOString()
            })
            .eq('id', book.id);

          if (updateError) {
            console.error(`Error updating book ${book.id}:`, updateError);
            batchErrors++;
          } else {
            batchProcessed++;
            console.log(`✓ Summary saved for: ${book.title}`);
          }

          // Delay entre requisições para evitar rate limiting
          await new Promise(resolve => setTimeout(resolve, 500));

        } catch (error) {
          console.error(`Error processing book ${book.id}:`, error);
          batchErrors++;
        }
      }

      totalProcessed += batchProcessed;
      totalErrors += batchErrors;

      console.log(`Lote ${batchNumber} concluído: ${batchProcessed} sucessos, ${batchErrors} erros`);
      console.log(`Total acumulado: ${totalProcessed} resumos gerados`);

      // Se processou menos de 10 livros, significa que não há mais livros
      if (books.length < 10) {
        hasMoreBooks = false;
      }

      // Pequeno delay entre lotes
      if (hasMoreBooks) {
        console.log("Aguardando 2 segundos antes do próximo lote...");
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    console.log(`\n=== Geração de resumos concluída ===`);
    console.log(`Total de lotes processados: ${batchNumber}`);
    console.log(`Total de resumos gerados: ${totalProcessed}`);
    console.log(`Total de erros: ${totalErrors}`);

    return new Response(
      JSON.stringify({
        success: true,
        batches: batchNumber,
        processed: totalProcessed,
        errors: totalErrors,
        message: `Processados ${totalProcessed} resumos em ${batchNumber} lote(s)`
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
    
    if (response.status === 429) {
      throw new Error('Rate limit exceeded - too many requests');
    }
    if (response.status === 402) {
      throw new Error('Payment required - AI credits exhausted');
    }
    
    throw new Error(`AI generation failed: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}
