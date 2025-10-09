import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
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

    // Get admin user ID to use for system-generated summaries
    const { data: adminUser, error: adminError } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role', 'admin')
      .limit(1)
      .single();

    if (adminError || !adminUser) {
      throw new Error("No admin user found. Please ensure at least one admin exists.");
    }

    const systemUserId = adminUser.user_id;

    let totalProcessed = 0;
    let totalErrors = 0;
    let batchNumber = 0;
    let hasMoreBooks = true;

    console.log("Iniciando geração de resumos em lotes...");

    // Loop para processar todos os livros de 10 em 10
    while (hasMoreBooks) {
      batchNumber++;
      console.log(`\n=== Processando lote ${batchNumber} ===`);

      // Buscar próximo lote de livros ativos com paginação por offset
      const offset = (batchNumber - 1) * 10;
      const { data: books, error: fetchError } = await supabase
        .from('books')
        .select('id, title, author, lang')
        .eq('is_active', true)
        .order('created_at', { ascending: true })
        .range(offset, offset + 9);

      if (fetchError) {
        console.error("Error fetching books:", fetchError);
        throw fetchError;
      }

      if (!books || books.length === 0) {
        console.log("Não há mais livros para processar.");
        hasMoreBooks = false;
        break;
      }

      console.log(`Encontrados ${books.length} livros neste lote`);

      let batchProcessed = 0;
      let batchErrors = 0;

      for (const book of books) {
        try {
          // Verificar se já existe resumo para este livro em qualquer idioma
          const { data: existingSummaries, error: checkError } = await supabase
            .from('book_summaries')
            .select('id, language')
            .eq('canonical_title', book.title)
            .eq('canonical_author', book.author);

          if (checkError) {
            console.error(`Error checking existing summaries for ${book.id}:`, checkError);
            continue;
          }

          // Se já existe resumo para este idioma, pular
          const hasLangSummary = existingSummaries?.some(s => s.language === book.lang);
          if (hasLangSummary) {
            console.log(`✓ Summary already exists for: ${book.title} (${book.lang})`);
            batchProcessed++;
            continue;
          }

          console.log(`Generating summary for: ${book.title} by ${book.author} (${book.lang})`);

          const prompt = generatePrompt(book);
          
          let summaryData;
          try {
            summaryData = await generateSummaryWithAI(prompt, LOVABLE_API_KEY, book.lang);
          } catch (aiError) {
            console.error(`AI error for book ${book.id}:`, aiError);
            batchErrors++;
            continue;
          }

          if (!summaryData || !summaryData.oneLiner) {
            console.error(`Invalid summary generated for book ${book.id}`);
            batchErrors++;
            continue;
          }

          // Inserir resumo na tabela book_summaries usando o admin user
          const { error: insertError } = await supabase
            .from('book_summaries')
            .insert({
              user_id: systemUserId,
              user_title: book.title,
              user_author: book.author,
              book_title: book.title,
              book_author: book.author,
              canonical_title: book.title,
              canonical_author: book.author,
              language: book.lang,
              summary_text: summaryData.oneLiner, // Campo obrigatório
              one_liner: summaryData.oneLiner,
              main_ideas: summaryData.keyIdeas,
              practical_applications: summaryData.practicalSteps?.join('\n') || '',
              key_ideas: summaryData.keyIdeas,
              actions: summaryData.practicalSteps,
              closing: summaryData.closing,
              theme: summaryData.theme || 'default',
              norm_key: `${book.title.toLowerCase()}|${book.author.toLowerCase()}|${book.lang}`,
              source: 'catalog'
            });

          if (insertError) {
            console.error(`Error inserting summary for ${book.id}:`, insertError);
            batchErrors++;
          } else {
            batchProcessed++;
            console.log(`✓ Summary saved for: ${book.title}`);
          }

          // Delay entre requisições para evitar rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000));

        } catch (error) {
          console.error(`Error processing book ${book.id}:`, error);
          batchErrors++;
        }
      }

      totalProcessed += batchProcessed;
      totalErrors += batchErrors;

      console.log(`Lote ${batchNumber} concluído: ${batchProcessed} sucessos, ${batchErrors} erros`);
      console.log(`Total acumulado: ${totalProcessed} resumos gerados`);

      // Se retornou menos de 10 livros, chegamos ao fim da paginação
      if (!books || books.length < 10) {
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
    pt: `Você é um especialista em resumir livros de forma clara e acionável.

Analise o livro "${book.title}" de ${book.author} e gere um resumo estruturado em JSON com os seguintes campos:

{
  "oneLiner": "Uma frase de 2-3 linhas que captura a essência central do livro",
  "keyIdeas": ["4-6 ideias principais do livro, cada uma em uma frase curta e clara"],
  "practicalSteps": ["3-5 ações práticas que o leitor pode aplicar imediatamente"],
  "closing": "Uma frase motivacional final que encoraja o leitor a agir",
  "theme": "uma palavra: productivity, health, mindset, finance ou default"
}

Seja conciso, prático e inspirador. Foque no que o leitor pode aprender e aplicar.`,
    
    en: `You are an expert at summarizing books clearly and actionably.

Analyze the book "${book.title}" by ${book.author} and generate a structured JSON summary with these fields:

{
  "oneLiner": "A 2-3 sentence phrase capturing the book's core essence",
  "keyIdeas": ["4-6 main ideas from the book, each in a short, clear sentence"],
  "practicalSteps": ["3-5 practical actions readers can apply immediately"],
  "closing": "A final motivational sentence that encourages the reader to act",
  "theme": "one word: productivity, health, mindset, finance or default"
}

Be concise, practical and inspiring. Focus on what readers can learn and apply.`,
    
    es: `Eres un experto en resumir libros de forma clara y accionable.

Analiza el libro "${book.title}" de ${book.author} y genera un resumen estructurado en JSON con estos campos:

{
  "oneLiner": "Una frase de 2-3 líneas que captura la esencia central del libro",
  "keyIdeas": ["4-6 ideas principales del libro, cada una en una frase corta y clara"],
  "practicalSteps": ["3-5 acciones prácticas que el lector puede aplicar inmediatamente"],
  "closing": "Una frase motivacional final que anime al lector a actuar",
  "theme": "una palabra: productivity, health, mindset, finance o default"
}

Sé conciso, práctico e inspirador. Enfócate en lo que el lector puede aprender y aplicar.`
  };

  return prompts[book.lang] || prompts['pt'];
}

async function generateSummaryWithAI(prompt: string, apiKey: string, lang: string): Promise<any> {
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
          content: 'You are an expert book summarizer. Always respond with valid JSON only, no additional text.' 
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" }
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
  const content = data.choices[0].message.content.trim();
  
  try {
    return JSON.parse(content);
  } catch (e) {
    console.error('Failed to parse AI response as JSON:', content);
    throw new Error('Invalid JSON response from AI');
  }
}
