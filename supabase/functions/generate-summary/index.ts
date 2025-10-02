import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      throw new Error("Não autenticado");
    }

    const { bookTitle, bookAuthor, language = "pt" } = await req.json();

    console.log("Generating summary for:", bookTitle, bookAuthor, "in", language);

    // Language-specific prompts
    const prompts: Record<string, { system: string; user: string }> = {
      pt: {
        system: `Você é um especialista em resumir livros de forma simples e acessível. 

REGRAS DE LINGUAGEM:
- Use linguagem coloquial e simples, como se estivesse conversando com um amigo
- EVITE jargões técnicos, termos acadêmicos e palavras difíceis
- Explique conceitos complexos usando analogias do dia a dia
- Use exemplos práticos que qualquer pessoa possa entender
- Escreva de forma direta e objetiva
- Prefira frases curtas e claras

Sempre responda no formato JSON:
{
  "summary": "Resumo geral do livro em 2-3 parágrafos (400-600 palavras). Use linguagem simples e conversacional.",
  "mainIdeas": ["Ideia 1 explicada de forma simples", "Ideia 2 explicada de forma simples", "Ideia 3", "Ideia 4", "Ideia 5"],
  "practicalApplications": "Como aplicar as ideias no dia a dia (2-3 parágrafos). Use exemplos concretos e situações cotidianas que qualquer pessoa vive."
}`,
        user: `Crie um resumo prático do livro "${bookTitle}"${bookAuthor ? ` de ${bookAuthor}` : ""}.`
      },
      en: {
        system: `You are an expert at summarizing books in a simple and accessible way.

LANGUAGE RULES:
- Use simple, conversational English, as if talking to a friend
- AVOID technical jargon, academic terms, and difficult words
- Explain complex concepts using everyday analogies
- Use practical examples that anyone can understand
- Write directly and objectively
- Prefer short, clear sentences

Always respond in JSON format:
{
  "summary": "General book summary in 2-3 paragraphs (400-600 words). Use simple, conversational language.",
  "mainIdeas": ["Idea 1 explained simply", "Idea 2 explained simply", "Idea 3", "Idea 4", "Idea 5"],
  "practicalApplications": "How to apply the ideas in daily life (2-3 paragraphs). Use concrete examples and everyday situations that anyone experiences."
}`,
        user: `Create a practical summary of the book "${bookTitle}"${bookAuthor ? ` by ${bookAuthor}` : ""}.`
      },
      es: {
        system: `Eres un experto en resumir libros de forma simple y accesible.

REGLAS DE LENGUAJE:
- Usa lenguaje coloquial y simple, como si hablaras con un amigo
- EVITA jerga técnica, términos académicos y palabras difíciles
- Explica conceptos complejos usando analogías cotidianas
- Usa ejemplos prácticos que cualquiera pueda entender
- Escribe de forma directa y objetiva
- Prefiere frases cortas y claras

Siempre responde en formato JSON:
{
  "summary": "Resumen general del libro en 2-3 párrafos (400-600 palabras). Usa lenguaje simple y conversacional.",
  "mainIdeas": ["Idea 1 explicada de forma simple", "Idea 2 explicada de forma simple", "Idea 3", "Idea 4", "Idea 5"],
  "practicalApplications": "Cómo aplicar las ideas en el día a día (2-3 párrafos). Usa ejemplos concretos y situaciones cotidianas que cualquier persona vive."
}`,
        user: `Crea un resumen práctico del libro "${bookTitle}"${bookAuthor ? ` de ${bookAuthor}` : ""}.`
      }
    };

    const prompt = prompts[language] || prompts.pt;

    // Generate summary using OpenAI
    console.log("Calling OpenAI API with model: gpt-4o-mini");
    const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: prompt.system,
          },
          {
            role: "user",
            content: prompt.user,
          },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("OpenAI API error:", aiResponse.status, errorText);
      
      // Handle specific error codes
      if (aiResponse.status === 401) {
        throw new Error("API key inválida. Verifique sua chave do OpenAI.");
      }
      if (aiResponse.status === 429) {
        throw new Error("Limite de requisições excedido. Por favor, tente novamente em alguns instantes.");
      }
      throw new Error("Erro ao gerar resumo com IA");
    }

    console.log("OpenAI response received successfully");

    const aiData = await aiResponse.json();
    let content = aiData.choices[0].message.content;
    
    console.log("AI response:", content);

    // Remove markdown code fences if present
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    // Parse the JSON response
    const summaryData = JSON.parse(content);

    // Save to database
    const { data: summary, error: dbError } = await supabase
      .from("book_summaries")
      .insert({
        user_id: user.id,
        book_title: bookTitle,
        book_author: bookAuthor || null,
        summary_text: summaryData.summary,
        main_ideas: summaryData.mainIdeas,
        practical_applications: summaryData.practicalApplications,
        language: language,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      throw dbError;
    }

    console.log("Summary saved:", summary.id);

    return new Response(
      JSON.stringify({ summaryId: summary.id }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in generate-summary:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});