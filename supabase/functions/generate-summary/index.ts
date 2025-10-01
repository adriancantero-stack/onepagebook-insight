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
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      throw new Error("Não autenticado");
    }

    const { bookTitle, bookAuthor } = await req.json();

    console.log("Generating summary for:", bookTitle, bookAuthor);

    // Generate summary using Lovable AI
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `Você é um especialista em resumir livros de forma simples e acessível. 

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
          },
          {
            role: "user",
            content: `Crie um resumo prático do livro "${bookTitle}"${bookAuthor ? ` de ${bookAuthor}` : ""}.`,
          },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI API error:", aiResponse.status, errorText);
      throw new Error("Erro ao gerar resumo");
    }

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