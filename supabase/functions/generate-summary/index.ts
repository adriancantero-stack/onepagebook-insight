import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Function to capitalize book title (first letter of each word) - preserves accents
function capitalizeTitle(title: string): string {
  return title
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map(word => {
      if (word.length === 0) return word;
      // Preserve accents - only uppercase first char, keep rest as is
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
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

// Resolve metadata ONLY from Open Library (as per requirements)
async function resolveMetadata(userTitle: string, userAuthor: string | null, locale: string) {
  const normalizedTitle = capitalizeTitle(userTitle);
  const normalizedAuthor = userAuthor ? capitalizeName(userAuthor) : null;
  
  let canonicalTitle = normalizedTitle;
  let canonicalAuthor = normalizedAuthor;
  let year: number | null = null;
  let source: string | null = null;

  // Fallback authors by locale
  const fallbackAuthors: Record<string, string> = {
    pt: "Autor desconhecido",
    en: "Unknown author",
    es: "Autor desconocido"
  };

  // Try Open Library ONLY
  try {
    const olUrl = `https://openlibrary.org/search.json?title=${encodeURIComponent(userTitle)}&limit=1`;
    console.log("Fetching from Open Library:", olUrl);
    const olResponse = await fetch(olUrl);
    if (olResponse.ok) {
      const olData = await olResponse.json();
      if (olData.docs && olData.docs.length > 0) {
        const doc = olData.docs[0];
        const candidateTitle = doc.title;
        const candidateAuthor = doc.author_name?.[0] || null;
        
        // Accept title if all relevant words from userTitle are in candidateTitle
        const userWords = userTitle.toLowerCase().split(/\s+/).filter((w: string) => w.length > 2);
        const candidateLower = candidateTitle.toLowerCase();
        const allWordsFound = userWords.every((word: string) => candidateLower.includes(word));
        
        if (allWordsFound) {
          canonicalTitle = candidateTitle;
        }
        
        // Prioritize user-provided author, then Open Library author, then fallback
        if (normalizedAuthor) {
          canonicalAuthor = normalizedAuthor;
        } else if (candidateAuthor) {
          canonicalAuthor = capitalizeName(candidateAuthor);
        } else {
          canonicalAuthor = fallbackAuthors[locale] || fallbackAuthors.en;
        }
        
        year = doc.first_publish_year || null;
        source = "openlibrary";
        
        console.log("Open Library result:", { canonicalTitle, canonicalAuthor, year });
      } else {
        console.log("No results from Open Library");
        canonicalAuthor = normalizedAuthor || fallbackAuthors[locale] || fallbackAuthors.en;
        source = "manual";
      }
    }
  } catch (error) {
    console.log("Open Library lookup failed:", error);
    canonicalAuthor = normalizedAuthor || fallbackAuthors[locale] || fallbackAuthors.en;
    source = "manual";
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

  // Helper to capitalize first letter of sentences
  const capitalizeSentences = (text: string): string => {
    if (!text) return text;
    // Capitalize first letter and after . ! ?
    return text.replace(/(^\w|[.!?]\s+\w)/g, (match) => match.toUpperCase());
  };

  // Helper to check similarity (70% threshold)
  const areSimilar = (a: string, b: string): boolean => {
    const normA = normalize(a);
    const normB = normalize(b);
    
    // Exact match
    if (normA === normB) return true;
    
    // Check if one contains the other (for longer texts)
    if (normA.length > 40 && normB.length > 40) {
      const shorter = normA.length < normB.length ? normA : normB;
      const longer = normA.length >= normB.length ? normA : normB;
      return longer.includes(shorter);
    }
    
    // Calculate similarity ratio for shorter texts
    const maxLength = Math.max(normA.length, normB.length);
    if (maxLength === 0) return true;
    
    // Count matching characters
    let matches = 0;
    const minLength = Math.min(normA.length, normB.length);
    for (let i = 0; i < minLength; i++) {
      if (normA[i] === normB[i]) matches++;
    }
    
    return (matches / maxLength) > 0.7;
  };

  // Capitalize oneLiner
  if (data.oneLiner && typeof data.oneLiner === 'string') {
    data.oneLiner = capitalizeSentences(data.oneLiner);
  }

  // Remove duplicate bullets in keyIdeas (limit 4-6) and capitalize
  if (data.keyIdeas && Array.isArray(data.keyIdeas)) {
    const unique: string[] = [];
    
    for (const idea of data.keyIdeas) {
      const isDuplicate = unique.some(existing => areSimilar(existing, idea));
      if (!isDuplicate) {
        unique.push(capitalizeSentences(idea));
      }
    }
    data.keyIdeas = unique.slice(0, 6); // Limit to 6 max
  }

  // Remove duplicate bullets in practicalSteps (limit 3-5) and capitalize
  if (data.practicalSteps && Array.isArray(data.practicalSteps)) {
    const unique: string[] = [];
    
    for (const step of data.practicalSteps) {
      const isDuplicate = unique.some(existing => areSimilar(existing, step));
      if (!isDuplicate) {
        unique.push(capitalizeSentences(step));
      }
    }
    data.practicalSteps = unique.slice(0, 5); // Limit to 5 max
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
    
    // Resolve metadata (ONLY Open Library)
    const metadata = await resolveMetadata(bookTitle, bookAuthor, language);
    console.log("Resolved metadata:", metadata);
    
    // Infer theme
    const theme = inferTheme(metadata.canonicalTitle);
    console.log("Inferred theme:", theme);

    // Language-specific labels (i18n)
    const labels: Record<string, { summary: string; key: string; apply: string; closing: string }> = {
      pt: {
        summary: "Resumo (ideia central)",
        key: "Ideias-chave",
        apply: "Aplicações práticas",
        closing: "Fechamento"
      },
      en: {
        summary: "Summary (central idea)",
        key: "Key ideas",
        apply: "Practical applications",
        closing: "Closing"
      },
      es: {
        summary: "Resumen (idea central)",
        key: "Ideas clave",
        apply: "Aplicaciones prácticas",
        closing: "Cierre"
      }
    };

    const currentLabels = labels[language] || labels.pt;

    // Language-specific prompts - USING CHATGPT (OpenAI) ONLY
    const prompts: Record<string, { system: string; user: string }> = {
      pt: {
        system: `Você é um especialista em resumir livros de forma clara, prática e acionável.

OBJETIVO:
Gerar um resumo padronizado SEMPRE neste formato:
1) "${currentLabels.summary}" — 1-2 parágrafos simples e naturais
2) "${currentLabels.key}" — 4-6 bullets, sem repetição
3) "${currentLabels.apply}" — 3-5 passos práticos e acionáveis

⚠️ REGRAS DE LINGUAGEM (CRÍTICO):
- Linguagem SIMPLES, NATURAL, COLOQUIAL (nível 6º–8º ano)
- Frases CURTAS (máx. 20 palavras por frase)
- SEMPRE começar frases com letra MAIÚSCULA
- ZERO jargão técnico, termos acadêmicos ou palavras difíceis
- Use analogias do dia a dia para conceitos complexos
- Exemplos práticos que qualquer pessoa entenda
- Tom conversacional, como se falasse com um amigo

⚠️ CORREÇÃO ORTOGRÁFICA (OBRIGATÓRIO):
- Revisar TODA ortografia e gramática em português BR
- Aplicar TODOS os acentos corretamente (á, é, í, ó, ú, â, ê, ô, ã, õ, ç)
- Verificar concordância verbal e nominal
- Tom HUMANO, NATURAL e ACESSÍVEL (evitar tom robótico ou formal demais)

⚠️ DEDUPLICAÇÃO (OBRIGATÓRIO):
- Normalizar texto: lowercase, sem acentos/pontuação duplicada
- Eliminar bullets/parágrafos duplicados ou muito similares (>70% iguais)
- Cada bullet deve ser ÚNICO, sem paráfrases
- Máximo 16 palavras por bullet em "Ideias-chave"
- Limitar a 4–6 bullets em "Ideias-chave"

ESTRUTURA JSON OBRIGATÓRIA:
{
  "title": "Título CORRIGIDO do livro com TODOS os acentos corretos em português (á, é, í, ó, ú, â, ê, ô, ã, õ, ç)",
  "author": "Nome COMPLETO do autor (ex: 'Augusto Cury', não apenas 'Cury')",
  "theme": "sleep|productivity|health|mindset|finance|default",
  "oneLiner": "2-3 parágrafos detalhados explicando o contexto, problema que resolve e principais insights do livro",
  "keyIdeas": ["4-6 ideias principais, cada uma em 1 frase curta e única (máx. 16 palavras)"],
  "practicalSteps": ["3-5 passos práticos, específicos e mensuráveis que o leitor pode aplicar hoje"]
}

IMPORTANTE:
- NÃO invente fatos; apenas organize/clarifique
- Cada seção deve ter conteúdo ÚNICO e complementar
- REVISE toda ortografia, acentuação e gramática antes de retornar
- Use tom humano e natural, como uma conversa entre amigos
- ⚠️ CRÍTICO: Sempre retorne o campo "title" com o título CORRIGIDO com TODOS os acentos em português
- Detecte o tema corretamente baseado nas palavras-chave do livro
- Se o livro for sobre sono/circadiano: theme="sleep"
- Se for sobre produtividade/foco/hábitos: theme="productivity"
- Se for sobre saúde/exercício/alimentação: theme="health"
- Se for sobre mentalidade/emoções: theme="mindset"
- Se for sobre finanças/dinheiro: theme="finance"
- Caso contrário: theme="default"`,
        user: `Crie um resumo prático do livro "${metadata.canonicalTitle}"${metadata.canonicalAuthor ? ` de ${metadata.canonicalAuthor}` : ""}${metadata.year ? ` (${metadata.year})` : ""}.

⚠️ IMPORTANTE: Corrija o título com todos os acentos corretos em português no campo "title" do JSON.

Responda APENAS com o JSON, sem texto adicional.`
      },
      en: {
        system: `You are an expert at summarizing books in a clear, practical, and actionable way.

OBJECTIVE:
Generate a standardized summary ALWAYS in this format:
1) "${currentLabels.summary}" — 1-2 simple, natural paragraphs
2) "${currentLabels.key}" — 4-6 bullets, no repetition
3) "${currentLabels.apply}" — 3-5 practical, actionable steps

⚠️ LANGUAGE RULES (CRITICAL):
- SIMPLE, NATURAL, CONVERSATIONAL language (6th–8th grade level)
- SHORT sentences (max. 20 words per sentence)
- ALWAYS start sentences with CAPITAL letter
- ZERO technical jargon, academic terms, or difficult words
- Use everyday analogies for complex concepts
- Practical examples that anyone can understand
- Conversational tone, as if talking to a friend

⚠️ SPELLING & GRAMMAR (MANDATORY):
- Review ALL spelling and grammar in English
- Apply proper punctuation and capitalization
- Check subject-verb agreement
- HUMAN, NATURAL, and ACCESSIBLE tone (avoid robotic or overly formal language)

⚠️ DEDUPLICATION (MANDATORY):
- Normalize text: lowercase, no accents/duplicate punctuation
- Eliminate duplicate or very similar bullets/paragraphs (>70% identical)
- Each bullet must be UNIQUE, no paraphrasing
- Maximum 16 words per bullet in "Key ideas"
- Limit to 4–6 bullets in "Key ideas"

MANDATORY JSON STRUCTURE:
{
  "title": "CORRECTED book title with proper spelling and accents",
  "author": "COMPLETE author name (e.g., 'Augusto Cury', not just 'Cury')",
  "theme": "sleep|productivity|health|mindset|finance|default",
  "oneLiner": "2-3 detailed paragraphs explaining context, problem it solves, and main insights of the book",
  "keyIdeas": ["4-6 main ideas, each in 1 short, unique sentence (max. 16 words)"],
  "practicalSteps": ["3-5 practical, specific, measurable steps the reader can apply today"]
}

IMPORTANT:
- Do NOT invent facts; only organize/clarify
- Each section must have UNIQUE and complementary content
- REVIEW all spelling, punctuation, and grammar before returning
- Use human and natural tone, like a conversation between friends
- ⚠️ CRITICAL: Always return the "title" field with the CORRECTED title with proper spelling
- Detect the theme correctly based on book keywords
- If about sleep/circadian: theme="sleep"
- If about productivity/focus/habits: theme="productivity"
- If about health/exercise/nutrition: theme="health"
- If about mindset/emotions: theme="mindset"
- If about finance/money: theme="finance"
- Otherwise: theme="default"`,
        user: `Create a practical summary of the book "${metadata.canonicalTitle}"${metadata.canonicalAuthor ? ` by ${metadata.canonicalAuthor}` : ""}${metadata.year ? ` (${metadata.year})` : ""}.

⚠️ IMPORTANT: Correct the title with proper spelling in the "title" field of the JSON.

Respond ONLY with the JSON, no additional text.`
      },
      es: {
        system: `Eres un experto en resumir libros de forma clara, práctica y accionable.

OBJETIVO:
Generar un resumen estandarizado SIEMPRE en este formato:
1) "${currentLabels.summary}" — 1-2 párrafos simples y naturales
2) "${currentLabels.key}" — 4-6 bullets, sin repetición
3) "${currentLabels.apply}" — 3-5 pasos prácticos y accionables

⚠️ REGLAS DE LENGUAJE (CRÍTICO):
- Lenguaje SIMPLE, NATURAL, COLOQUIAL (nivel 6º–8º grado)
- Frases CORTAS (máx. 20 palabras por frase)
- SIEMPRE comenzar frases con letra MAYÚSCULA
- CERO jerga técnica, términos académicos o palabras difíciles
- Usa analogías cotidianas para conceptos complejos
- Ejemplos prácticos que cualquiera pueda entender
- Tono conversacional, como si hablaras con un amigo

⚠️ CORRECCIÓN ORTOGRÁFICA (OBLIGATORIO):
- Revisar TODA ortografía y gramática en español
- Aplicar TODOS los acentos correctamente (á, é, í, ó, ú, ñ)
- Verificar concordancia verbal y nominal
- Tono HUMANO, NATURAL y ACCESIBLE (evitar tono robótico o demasiado formal)

⚠️ DEDUPLICACIÓN (OBLIGATORIO):
- Normalizar texto: minúsculas, sin acentos/puntuación duplicada
- Eliminar bullets/párrafos duplicados o muy similares (>70% iguales)
- Cada bullet debe ser ÚNICO, sin paráfrasis
- Máximo 16 palabras por bullet en "Ideas clave"
- Limitar a 4–6 bullets en "Ideas clave"

ESTRUCTURA JSON OBLIGATORIA:
{
  "title": "Título CORREGIDO del libro con TODOS los acentos correctos en español (á, é, í, ó, ú, ñ)",
  "author": "Nombre COMPLETO del autor (ej: 'Augusto Cury', no solo 'Cury')",
  "theme": "sleep|productivity|health|mindset|finance|default",
  "oneLiner": "2-3 párrafos detallados explicando contexto, problema que resuelve y principales insights del libro",
  "keyIdeas": ["4-6 ideas principales, cada una en 1 frase corta y única (máx. 16 palabras)"],
  "practicalSteps": ["3-5 pasos prácticos, específicos y medibles que el lector puede aplicar hoy"]
}

IMPORTANTE:
- NO inventes hechos; solo organiza/clarifica
- Cada sección debe tener contenido ÚNICO y complementario
- REVISA toda ortografía, acentuación y gramática antes de retornar
- Usa tono humano y natural, como una conversación entre amigos
- ⚠️ CRÍTICO: Siempre retorna el campo "title" con el título CORREGIDO con TODOS los acentos en español
- Detecta el tema correctamente basándote en las palabras clave del libro
- Si es sobre sueño/circadiano: theme="sleep"
- Si es sobre productividad/foco/hábitos: theme="productivity"
- Si es sobre salud/ejercicio/alimentación: theme="health"
- Si es sobre mentalidad/emociones: theme="mindset"
- Si es sobre finanzas/dinero: theme="finance"
- De lo contrario: theme="default"`,
        user: `Crea un resumen práctico del libro "${metadata.canonicalTitle}"${metadata.canonicalAuthor ? ` de ${metadata.canonicalAuthor}` : ""}${metadata.year ? ` (${metadata.year})` : ""}.

⚠️ IMPORTANTE: Corrige el título con todos los acentos correctos en español en el campo "title" del JSON.

Responde SOLO con el JSON, sin texto adicional.`
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

    // Use AI-identified author if more complete, otherwise use metadata
    let finalAuthor = metadata.canonicalAuthor;
    
    // If ChatGPT identified a more complete author name, use it
    if (summaryData.author) {
      const aiAuthor = capitalizeName(summaryData.author);
      // Use AI author if it's longer/more complete than metadata author
      if (!finalAuthor || aiAuthor.length > finalAuthor.length) {
        finalAuthor = aiAuthor;
      }
    }
    
    if (finalAuthor) {
      finalAuthor = capitalizeName(finalAuthor);
    }
    
    // Use AI-corrected title with proper accents if available
    let finalTitle = metadata.canonicalTitle;
    if (summaryData.title && summaryData.title.trim()) {
      finalTitle = summaryData.title.trim();
    }

    // Save to database
    const { data: summary, error: dbError } = await supabase
      .from("book_summaries")
      .insert({
        user_id: user.id,
        user_title: bookTitle,
        user_author: bookAuthor || null,
        book_title: finalTitle,
        book_author: finalAuthor,
        canonical_title: finalTitle,
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