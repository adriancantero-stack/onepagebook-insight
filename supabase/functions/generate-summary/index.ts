import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Function to capitalize book title (first letter of each word)
function capitalizeTitle(title: string): string {
  return title
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// Function to capitalize author name (first letter of each word)
function capitalizeName(name: string): string {
  return name
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// Resolve metadata from Open Library and Google Books
async function resolveMetadata(userTitle: string, userAuthor: string | null) {
  const normalizedTitle = capitalizeTitle(userTitle);
  const normalizedAuthor = userAuthor ? capitalizeName(userAuthor) : null;
  
  let canonicalTitle = normalizedTitle;
  let canonicalAuthor = normalizedAuthor;
  let year: number | null = null;
  let source: string | null = null;

  // Try Open Library first
  try {
    const olUrl = `https://openlibrary.org/search.json?title=${encodeURIComponent(userTitle)}&limit=1`;
    const olResponse = await fetch(olUrl);
    if (olResponse.ok) {
      const olData = await olResponse.json();
      if (olData.docs && olData.docs.length > 0) {
        const doc = olData.docs[0];
        const candidateTitle = doc.title;
        const candidateAuthor = doc.author_name?.[0] || null;
        
        // Accept title if all relevant words from userTitle are in candidateTitle
        const userWords = userTitle.toLowerCase().split(/\s+/).filter(w => w.length > 2);
        const candidateLower = candidateTitle.toLowerCase();
        const allWordsFound = userWords.every((word: string) => candidateLower.includes(word));
        
        if (allWordsFound) {
          canonicalTitle = candidateTitle;
        }
        
        if (!normalizedAuthor && candidateAuthor) {
          canonicalAuthor = capitalizeName(candidateAuthor);
        }
        
        year = doc.first_publish_year || null;
        source = "openlibrary";
      }
    }
  } catch (error) {
    console.log("Open Library lookup failed:", error);
  }

  // Try Google Books if author not found
  if (!canonicalAuthor) {
    try {
      const gbUrl = `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(userTitle)}&maxResults=1`;
      const gbResponse = await fetch(gbUrl);
      if (gbResponse.ok) {
        const gbData = await gbResponse.json();
        if (gbData.items && gbData.items.length > 0) {
          const vi = gbData.items[0].volumeInfo;
          
          if (!source && vi.title) {
            const userWords = userTitle.toLowerCase().split(/\s+/).filter(w => w.length > 2);
            const candidateLower = vi.title.toLowerCase();
            const allWordsFound = userWords.every((word: string) => candidateLower.includes(word));
            if (allWordsFound) {
              canonicalTitle = vi.title;
            }
          }
          
          if (!canonicalAuthor && vi.authors && vi.authors[0]) {
            canonicalAuthor = capitalizeName(vi.authors[0]);
          }
          
          if (!year && vi.publishedDate) {
            year = parseInt(vi.publishedDate.slice(0, 4)) || null;
          }
          
          source = source || "googlebooks";
        }
      }
    } catch (error) {
      console.log("Google Books lookup failed:", error);
    }
  }

  return { canonicalTitle, canonicalAuthor, year, source };
}

// Infer theme from title/author
function inferTheme(title: string): string {
  const t = title.toLowerCase();
  
  // Sleep/circadian patterns
  if (/(sono|sleep|dormir|relógio biológico|circadian|horário|rotina de sono|insônia)/i.test(t)) {
    return "sleep";
  }
  
  // Productivity patterns
  if (/(produtividade|productivity|foco|focus|hábito|habit|estudo|study|trabalho|work|eficiência|efficiency|tempo|time)/i.test(t)) {
    return "productivity";
  }
  
  // Health patterns
  if (/(saúde|health|exercício|exercise|alimentação|nutrition|energia|energy|corpo|body|fitness)/i.test(t)) {
    return "health";
  }
  
  // Mindset patterns
  if (/(mente|mind|mindset|mental|emocional|emotional|psicologia|psychology|hábitos mentais|pensamento|thinking)/i.test(t)) {
    return "mindset";
  }
  
  // Finance patterns
  if (/(finanças|finance|dinheiro|money|gastos|expenses|investimento|investment|rico|rich|wealth)/i.test(t)) {
    return "finance";
  }
  
  return "default";
}

// Generate closing message by theme and locale
function generateClosing(theme: string, locale: string, canonicalTitle: string): string {
  const closings: Record<string, Record<string, string>> = {
    pt: {
      default: "Você não precisa mudar tudo de uma vez. Escolha um ajuste pequeno — hoje — e dê o primeiro passo. Amanhã, repita: consistência vence força de vontade.",
      sleep: "Hoje, durma 30 minutos mais cedo e reduza telas 90 minutos antes. Seu relógio biológico agradece; a energia de amanhã começa agora.",
      productivity: "Reserve 25 minutos de foco profundo ainda hoje. Um bloco pequeno, repetido diariamente, gera resultados surpreendentes em semanas.",
      health: "Agende uma caminhada de 10 minutos nas próximas 24 horas. Saúde real nasce de microvitórias consistentes.",
      mindset: "Antes de dormir, escreva uma linha: 'Qual foi meu pequeno avanço hoje?'. A mente segue aquilo que decidimos notar.",
      finance: "Amanhã, marque um horário fixo para revisar os gastos dos últimos 7 dias. Clareza semanal evita surpresas mensais."
    },
    en: {
      default: "You don't have to change everything at once. Pick one time to start—today—and make the first small shift. Tomorrow, repeat. Consistency beats willpower.",
      sleep: "Tonight, go to bed 30 minutes earlier and dim screens 90 minutes before. Your circadian clock will thank you; tomorrow's energy starts now.",
      productivity: "Block 25 minutes for deep work today. A small daily block, repeated, compounds into surprising results within weeks.",
      health: "Schedule your first 10-minute walk within the next 24 hours. Real health is built on consistent micro-wins.",
      mindset: "Before bed, write one line: 'What small win did I have today?'. The mind follows what we choose to notice.",
      finance: "Set a fixed time tomorrow to review the last 7 days of expenses. Weekly clarity prevents monthly surprises."
    },
    es: {
      default: "No tienes que cambiarlo todo de golpe. Elige una hora para empezar—hoy—y da el primer paso. Mañana, repite. La constancia supera la fuerza de voluntad.",
      sleep: "Esta noche, acuéstate 30 minutos antes y baja pantallas 90 minutos antes. Tu reloj biológico lo agradecerá; la energía de mañana empieza ahora.",
      productivity: "Reserva 25 minutos de trabajo profundo hoy. Un bloque pequeño diario, repetido, se acumula en resultados sorprendentes en semanas.",
      health: "Programa tu primera caminata de 10 minutos en las próximas 24 horas. La salud real nace de micro-victorias constantes.",
      mindset: "Antes de dormir, escribe una línea: '¿Cuál fue mi pequeño avance de hoy?'. La mente sigue lo que decidimos notar.",
      finance: "Fija una hora mañana para revisar tus gastos de los últimos 7 días. La claridad semanal evita sorpresas mensuales."
    }
  };

  const localeClosings = closings[locale] || closings.en;
  return localeClosings[theme] || localeClosings.default;
}

// Post-process summary to remove duplicates and format properly
function postProcessSummary(data: any): any {
  const normalize = (text: string) => 
    text.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();

  // Helper to check similarity
  const areSimilar = (a: string, b: string): boolean => {
    const normA = normalize(a);
    const normB = normalize(b);
    if (normA === normB) return true;
    if (normA.length > 40 && normB.length > 40) {
      // Check if 70% of chars match
      const shorter = normA.length < normB.length ? normA : normB;
      const longer = normA.length >= normB.length ? normA : normB;
      return longer.includes(shorter);
    }
    return false;
  };

  // Remove duplicate bullets in keyIdeas
  if (data.keyIdeas && Array.isArray(data.keyIdeas)) {
    const unique: string[] = [];
    
    for (const idea of data.keyIdeas) {
      const isDuplicate = unique.some(existing => areSimilar(existing, idea));
      if (!isDuplicate) {
        unique.push(idea);
      }
    }
    data.keyIdeas = unique.slice(0, 5); // Limit to 5
  }

  // Remove duplicate bullets in practicalSteps (previously actions)
  if (data.practicalSteps && Array.isArray(data.practicalSteps)) {
    const unique: string[] = [];
    
    for (const step of data.practicalSteps) {
      const isDuplicate = unique.some(existing => areSimilar(existing, step));
      if (!isDuplicate) {
        unique.push(step);
      }
    }
    data.practicalSteps = unique.slice(0, 7); // Limit to 7
  }

  // Backwards compatibility: map old field names to new
  if (data.actions && !data.practicalSteps) {
    data.practicalSteps = data.actions;
  }

  return data;
}

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
    
    // Resolve metadata
    const metadata = await resolveMetadata(bookTitle, bookAuthor);
    console.log("Resolved metadata:", metadata);
    
    // Infer theme
    const theme = inferTheme(metadata.canonicalTitle);
    console.log("Inferred theme:", theme);

    // Language-specific prompts
    const prompts: Record<string, { system: string; user: string }> = {
      pt: {
        system: `Você é um especialista em resumir livros de forma didática, prática e acionável.

OBJETIVO:
Criar um resumo estruturado seguindo EXATAMENTE este formato:
1) Título do livro
2) "por {Autor}"
3) "Principais Ideias" (parágrafo introdutório + lista de até 5 pontos)
4) "Aplicações Práticas" (passos práticos e acionáveis)
5) "Fechamento" (1-2 frases motivacionais com micro-ação em 24h)

REGRAS DE LINGUAGEM:
- Use linguagem coloquial e simples, como se estivesse conversando com um amigo
- EVITE jargões técnicos, termos acadêmicos e palavras difíceis
- Explique conceitos complexos usando analogias do dia a dia
- Use exemplos práticos que qualquer pessoa possa entender
- Não repita informações entre seções

ESTRUTURA JSON OBRIGATÓRIA:
{
  "author": "Nome completo do autor (capitalize nomes próprios)",
  "theme": "detectar tema principal: sleep|productivity|health|mindset|finance|default",
  "oneLiner": "Uma frase de impacto que capture a essência (20-30 palavras)",
  "keyIdeasIntro": "Parágrafo introdutório explicando o contexto das ideias principais",
  "keyIdeas": ["Máximo 5 ideias principais, cada uma em 1-2 frases claras e únicas"],
  "practicalSteps": ["5-7 passos práticos e específicos que o leitor pode aplicar hoje"],
  "closingAction": "Micro-ação específica que pode ser feita nas próximas 24h"
}

IMPORTANTE: 
- Cada bullet deve ser único, sem repetições ou paráfrases
- O fechamento deve incluir UMA ação concreta para hoje
- Detecte o tema corretamente para gerar fechamento apropriado`,
        user: `Crie um resumo prático do livro "${metadata.canonicalTitle}"${metadata.canonicalAuthor ? ` de ${metadata.canonicalAuthor}` : ""}${metadata.year ? ` (${metadata.year})` : ""}.`
      },
      en: {
        system: `You are an expert at summarizing books in a simple, practical, and actionable way.

LANGUAGE RULES:
- Use simple, conversational English, as if talking to a friend
- AVOID technical jargon, academic terms, and difficult words
- Explain complex concepts using everyday analogies
- Use practical examples that anyone can understand

MANDATORY STRUCTURE (JSON):
{
  "author": "Author name (if not provided, identify based on the book)",
  "oneLiner": "One impactful sentence capturing the book's essence (20-30 words)",
  "keyIdeas": ["5 key ideas, each in 1-2 clear sentences"],
  "actions": ["5-7 specific, practical actions the reader can apply today"],
  "routine": "Concrete example of daily routine applying the ideas (optional, 2-3 paragraphs)",
  "plan7Days": "Step-by-step 7-day plan to implement the ideas (optional)",
  "metrics": "How to measure progress and results (optional, 1 paragraph)",
  "pitfalls": "Common pitfalls and method limitations (optional, 1 paragraph)"
}

IMPORTANT: Don't repeat sections. Each section must have unique, complementary content.`,
        user: `Create a practical summary of the book "${metadata.canonicalTitle}"${metadata.canonicalAuthor ? ` by ${metadata.canonicalAuthor}` : ""}${metadata.year ? ` (${metadata.year})` : ""}.`
      },
      es: {
        system: `Eres un experto en resumir libros de forma simple, práctica y accionable.

REGLAS DE LENGUAJE:
- Usa lenguaje coloquial y simple, como si hablaras con un amigo
- EVITA jerga técnica, términos académicos y palabras difíciles
- Explica conceptos complejos usando analogías cotidianas
- Usa ejemplos prácticos que cualquiera pueda entender

ESTRUCTURA OBLIGATORIA (JSON):
{
  "author": "Nombre del autor (si no se proporciona, identificar basándote en el libro)",
  "oneLiner": "Una frase de impacto que capture la esencia del libro (20-30 palabras)",
  "keyIdeas": ["5 ideas clave, cada una en 1-2 frases claras"],
  "actions": ["5-7 acciones prácticas y específicas que el lector puede aplicar hoy"],
  "routine": "Ejemplo concreto de rutina diaria aplicando las ideas (opcional, 2-3 párrafos)",
  "plan7Days": "Plan paso a paso de 7 días para implementar las ideas (opcional)",
  "metrics": "Cómo medir progreso y resultados (opcional, 1 párrafo)",
  "pitfalls": "Trampas comunes y limitaciones del método (opcional, 1 párrafo)"
}

IMPORTANTE: No repitas secciones. Cada sección debe tener contenido único y complementario.`,
        user: `Crea un resumen práctico del libro "${metadata.canonicalTitle}"${metadata.canonicalAuthor ? ` de ${metadata.canonicalAuthor}` : ""}${metadata.year ? ` (${metadata.year})` : ""}.`
      }
    };

    const prompt = prompts[language] || prompts.pt;

    // Generate summary using OpenAI
    console.log("Calling OpenAI with model: gpt-5-mini-2025-08-07");
    const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-5-mini-2025-08-07",
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
        response_format: { type: "json_object" },
        max_completion_tokens: 6000,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("OpenAI error:", aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        throw new Error("Limite de requisições excedido. Por favor, tente novamente em alguns instantes.");
      }
      if (aiResponse.status === 401) {
        throw new Error("Erro de autenticação com OpenAI. Verifique sua API key.");
      }
      throw new Error("Erro ao gerar resumo com IA");
    }

    console.log("AI response received successfully");

    const aiData = await aiResponse.json();
    try {
      console.log("AI raw (preview):", JSON.stringify(aiData).slice(0, 600));
    } catch {}

    // Extract content robustly
    let content: string | undefined = aiData?.choices?.[0]?.message?.content;

    // Some models may return content as an array of parts
    if ((!content || typeof content !== "string") && Array.isArray(aiData?.choices?.[0]?.message?.content)) {
      const parts = aiData.choices[0].message.content as any[];
      const textPart = parts.find((p: any) => typeof p?.text === "string")?.text;
      if (textPart) content = textPart;
    }

    // Some models may use tool_calls with function arguments as JSON
    if (!content && aiData?.choices?.[0]?.message?.tool_calls?.length) {
      const args = aiData.choices[0].message.tool_calls[0]?.function?.arguments;
      if (typeof args === "string") content = args;
    }

    if (!content || typeof content !== "string" || !content.trim()) {
      throw new Error("A resposta do modelo veio vazia. Tente novamente em instantes.");
    }

    console.log("AI response (text):", content);

    // Remove markdown code fences if present and try to isolate JSON
    let cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    let summaryData: any;
    try {
      summaryData = JSON.parse(cleaned);
    } catch {
      const match = cleaned.match(/{[\s\S]*}/);
      if (!match) {
        console.error("Failed to parse JSON. Content preview:", cleaned.slice(0, 300));
        throw new Error("Falha ao interpretar a resposta da IA. Tente novamente.");
      }
      try {
        summaryData = JSON.parse(match[0]);
      } catch (e) {
        console.error("JSON parse error:", e, "Raw:", match[0].slice(0, 300));
        throw new Error("Falha ao interpretar a resposta da IA. Tente novamente.");
      }
    }
    
    // Post-process to remove duplicates
    summaryData = postProcessSummary(summaryData);
    
    // Generate closing
    const closing = generateClosing(theme, language, metadata.canonicalTitle);

    // Use AI-identified author if not provided by user, and capitalize it
    let finalAuthor = metadata.canonicalAuthor || summaryData.author || null;
    if (finalAuthor) {
      finalAuthor = capitalizeName(finalAuthor);
    }

    // Save to database
    const { data: summary, error: dbError } = await supabase
      .from("book_summaries")
      .insert({
        user_id: user.id,
        user_title: bookTitle,
        user_author: bookAuthor || null,
        book_title: metadata.canonicalTitle,
        book_author: finalAuthor,
        canonical_title: metadata.canonicalTitle,
        canonical_author: finalAuthor,
        year: metadata.year,
        source: metadata.source,
        one_liner: summaryData.oneLiner || null,
        key_ideas: summaryData.keyIdeas || [],
        actions: summaryData.practicalSteps || summaryData.actions || [],
        routine: summaryData.keyIdeasIntro || null,
        plan_7_days: null,
        metrics: null,
        pitfalls: null,
        closing: closing,
        theme: summaryData.theme || theme,
        language: language,
        // Legacy fields for backwards compatibility
        summary_text: summaryData.oneLiner || "",
        main_ideas: summaryData.keyIdeas || [],
        practical_applications: (summaryData.practicalSteps || summaryData.actions || []).join('\n'),
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