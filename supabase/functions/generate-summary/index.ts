import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Cache utilities
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function createCacheKey(title: string, author: string, lang: string): string {
  const normTitle = normalizeText(title);
  const normAuthor = normalizeText(author || "");
  return `${normTitle}|${normAuthor}|${lang}`;
}

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

  // Try Open Library to get complete information
  try {
    const olUrl = `https://openlibrary.org/search.json?title=${encodeURIComponent(userTitle)}${userAuthor ? `&author=${encodeURIComponent(userAuthor)}` : ''}&limit=3`;
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
        
        // Always prefer Open Library author as it's usually complete (full name)
        if (candidateAuthor) {
          canonicalAuthor = capitalizeName(candidateAuthor);
          console.log("Using complete author from Open Library:", canonicalAuthor);
        } else if (normalizedAuthor) {
          canonicalAuthor = normalizedAuthor;
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

// Generate closing message by theme and locale - MULTIPLE VARIATIONS
function generateClosing(theme: string, locale: string, canonicalTitle: string): string {
  const closings: Record<string, Record<string, string[]>> = {
    pt: {
      default: [
        "Você não precisa mudar tudo de uma vez. Escolha um ajuste pequeno — hoje — e dê o primeiro passo. Amanhã, repita: consistência vence força de vontade.",
        "Comece agora com algo simples. Pequenas ações diárias se transformam em grandes conquistas ao longo do tempo.",
        "O segredo não está em fazer tudo perfeito, mas em começar e manter a constância. Escolha uma ação pequena para hoje.",
        "Transformação real vem de hábitos consistentes, não de mudanças radicais. Que tal começar com algo pequeno hoje mesmo?"
      ],
      sleep: [
        "Hoje, durma 30 minutos mais cedo e reduza telas 90 minutos antes. Seu relógio biológico agradece; a energia de amanhã começa agora.",
        "Experimente criar uma rotina de sono regular. Seu corpo e mente agradecem quando respeitamos nossos ritmos naturais.",
        "Que tal desligar as telas 1 hora antes de dormir hoje? Seu descanso de qualidade começa com pequenos ajustes.",
        "Comece hoje: defina um horário fixo para dormir. Consistência no sono é o combustível da sua energia diária."
      ],
      productivity: [
        "Reserve 25 minutos de foco profundo ainda hoje. Um bloco pequeno, repetido diariamente, gera resultados surpreendentes em semanas.",
        "Experimente a técnica Pomodoro: 25 minutos de foco total, sem distrações. Você vai se surpreender com os resultados.",
        "Identifique sua tarefa mais importante hoje e dedique a ela sua primeira hora de trabalho, sem interrupções.",
        "Crie blocos de tempo protegidos no seu dia. Foco profundo, mesmo que por períodos curtos, multiplica sua produtividade."
      ],
      health: [
        "Agende uma caminhada de 10 minutos nas próximas 24 horas. Saúde real nasce de microvitórias consistentes.",
        "Movimento é vida. Que tal dar uma volta de 10 minutos depois do almoço? Seu corpo agradece cada passo.",
        "Comece hoje: escolha uma atividade física que você goste e reserve 15 minutos para ela. Constância é mais importante que intensidade.",
        "Saúde se constrói todos os dias. Uma caminhada curta, feita com regularidade, vale mais que promessas de academia."
      ],
      mindset: [
        "Antes de dormir, escreva uma linha: 'Qual foi meu pequeno avanço hoje?'. A mente segue aquilo que decidimos notar.",
        "Pratique gratidão diária: escreva 3 coisas boas que aconteceram hoje. Sua mente se reprograma para enxergar oportunidades.",
        "Comece um diário de reflexão. Alguns minutos de escrita por dia transformam sua autoconsciência e clareza mental.",
        "Pergunte-se diariamente: 'O que aprendi hoje?'. Cultivar esta curiosidade transforma desafios em oportunidades de crescimento."
      ],
      finance: [
        "Amanhã, marque um horário fixo para revisar os gastos dos últimos 7 dias. Clareza semanal evita surpresas mensais.",
        "Comece hoje: anote todos os gastos por uma semana. Consciência é o primeiro passo para controle financeiro.",
        "Defina um dia fixo do mês para revisar suas finanças. Regularidade nesta prática traz paz de espírito e segurança.",
        "Experimente a regra 50/30/20: 50% necessidades, 30% desejos, 20% poupança. Simplicidade funciona melhor que complexidade."
      ]
    },
    en: {
      default: [
        "You don't have to change everything at once. Pick one time to start—today—and make the first small shift. Tomorrow, repeat. Consistency beats willpower.",
        "Start now with something simple. Small daily actions transform into big achievements over time.",
        "The secret isn't doing everything perfectly, but starting and staying consistent. Choose one small action for today.",
        "Real transformation comes from consistent habits, not radical changes. How about starting with something small today?"
      ],
      sleep: [
        "Tonight, go to bed 30 minutes earlier and dim screens 90 minutes before. Your circadian clock will thank you; tomorrow's energy starts now.",
        "Try creating a regular sleep routine. Your body and mind appreciate when we respect our natural rhythms.",
        "How about turning off screens 1 hour before bed tonight? Quality rest begins with small adjustments.",
        "Start today: set a fixed bedtime. Sleep consistency is the fuel for your daily energy."
      ],
      productivity: [
        "Block 25 minutes for deep work today. A small daily block, repeated, compounds into surprising results within weeks.",
        "Try the Pomodoro technique: 25 minutes of total focus, no distractions. You'll be surprised by the results.",
        "Identify your most important task today and dedicate your first work hour to it, without interruptions.",
        "Create protected time blocks in your day. Deep focus, even for short periods, multiplies your productivity."
      ],
      health: [
        "Schedule your first 10-minute walk within the next 24 hours. Real health is built on consistent micro-wins.",
        "Movement is life. How about a 10-minute walk after lunch? Your body thanks you for every step.",
        "Start today: choose a physical activity you enjoy and reserve 15 minutes for it. Consistency beats intensity.",
        "Health is built every day. A short walk, done regularly, is worth more than gym promises."
      ],
      mindset: [
        "Before bed, write one line: 'What small win did I have today?'. The mind follows what we choose to notice.",
        "Practice daily gratitude: write down 3 good things that happened today. Your mind reprograms to see opportunities.",
        "Start a reflection journal. A few minutes of writing daily transforms your self-awareness and mental clarity.",
        "Ask yourself daily: 'What did I learn today?'. Cultivating this curiosity transforms challenges into growth opportunities."
      ],
      finance: [
        "Set a fixed time tomorrow to review the last 7 days of expenses. Weekly clarity prevents monthly surprises.",
        "Start today: track all expenses for one week. Awareness is the first step to financial control.",
        "Define a fixed day of the month to review your finances. Regularity in this practice brings peace of mind and security.",
        "Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings. Simplicity works better than complexity."
      ]
    },
    es: {
      default: [
        "No tienes que cambiarlo todo de golpe. Elige una hora para empezar—hoy—y da el primer paso. Mañana, repite. La constancia supera la fuerza de voluntad.",
        "Comienza ahora con algo simple. Pequeñas acciones diarias se transforman en grandes logros con el tiempo.",
        "El secreto no está en hacer todo perfecto, sino en comenzar y mantener la constancia. Elige una acción pequeña para hoy.",
        "La transformación real viene de hábitos consistentes, no de cambios radicales. ¿Qué tal comenzar con algo pequeño hoy?"
      ],
      sleep: [
        "Esta noche, acuéstate 30 minutos antes y baja pantallas 90 minutos antes. Tu reloj biológico lo agradecerá; la energía de mañana empieza ahora.",
        "Intenta crear una rutina de sueño regular. Tu cuerpo y mente agradecen cuando respetamos nuestros ritmos naturales.",
        "¿Qué tal apagar las pantallas 1 hora antes de dormir hoy? El descanso de calidad comienza con pequeños ajustes.",
        "Empieza hoy: define una hora fija para dormir. La consistencia en el sueño es el combustible de tu energía diaria."
      ],
      productivity: [
        "Reserva 25 minutos de trabajo profundo hoy. Un bloque pequeño diario, repetido, se acumula en resultados sorprendentes en semanas.",
        "Prueba la técnica Pomodoro: 25 minutos de enfoque total, sin distracciones. Te sorprenderán los resultados.",
        "Identifica tu tarea más importante hoy y dedícale tu primera hora de trabajo, sin interrupciones.",
        "Crea bloques de tiempo protegidos en tu día. El enfoque profundo, incluso por períodos cortos, multiplica tu productividad."
      ],
      health: [
        "Programa tu primera caminata de 10 minutos en las próximas 24 horas. La salud real nace de micro-victorias constantes.",
        "El movimiento es vida. ¿Qué tal dar un paseo de 10 minutos después del almuerzo? Tu cuerpo agradece cada paso.",
        "Comienza hoy: elige una actividad física que disfrutes y reserva 15 minutos para ella. La constancia supera la intensidad.",
        "La salud se construye todos los días. Una caminata corta, hecha regularmente, vale más que promesas de gimnasio."
      ],
      mindset: [
        "Antes de dormir, escribe una línea: '¿Cuál fue mi pequeño avance de hoy?'. La mente sigue lo que decidimos notar.",
        "Practica gratitud diaria: escribe 3 cosas buenas que sucedieron hoy. Tu mente se reprograma para ver oportunidades.",
        "Comienza un diario de reflexión. Unos minutos de escritura diaria transforman tu autoconciencia y claridad mental.",
        "Pregúntate diariamente: '¿Qué aprendí hoy?'. Cultivar esta curiosidad transforma desafíos en oportunidades de crecimiento."
      ],
      finance: [
        "Fija una hora mañana para revisar tus gastos de los últimos 7 días. La claridad semanal evita sorpresas mensuales.",
        "Comienza hoy: anota todos los gastos durante una semana. La conciencia es el primer paso hacia el control financiero.",
        "Define un día fijo del mes para revisar tus finanzas. La regularidad en esta práctica trae paz mental y seguridad.",
        "Prueba la regla 50/30/20: 50% necesidades, 30% deseos, 20% ahorros. La simplicidad funciona mejor que la complejidad."
      ]
    }
  };

  const localeClosings = closings[locale] || closings.en;
  const themeClosings = localeClosings[theme] || localeClosings.default;
  
  // Pick a random closing message from the array
  return themeClosings[Math.floor(Math.random() * themeClosings.length)];
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
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.replace("Bearer ", "") : "";
    const { data: { user }, error: authError } = token
      ? await supabase.auth.getUser(token)
      : { data: { user: null }, error: new Error("missing_token") } as any;

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Não autenticado. Faça login novamente." }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { bookTitle, bookAuthor, language = "pt" } = await req.json();
    
    // Check cache FIRST - with fallback for empty author
    const cacheKey = createCacheKey(bookTitle, bookAuthor || "", language);
    console.log("🔍 [Cache] Checking cache with key:", cacheKey);
    
    let cachedSummary = null;
    
    // Primary lookup: user_id + norm_key + language
    const { data: primaryHit } = await supabase
      .from("book_summaries")
      .select("*")
      .eq("user_id", user.id)
      .eq("norm_key", cacheKey)
      .eq("language", language)
      .maybeSingle();
    
    if (primaryHit) {
      cachedSummary = primaryHit;
      console.log("✅ [Cache] Primary hit! Returning existing summary:", cachedSummary.id);
    } else if (!bookAuthor || bookAuthor.trim() === "") {
      // Fallback: If author is empty, try to find by title + language only
      console.log("🔄 [Cache] Author empty, trying fallback lookup by title + language...");
      const normTitle = normalizeText(bookTitle);
      
      const { data: fallbackHit } = await supabase
        .from("book_summaries")
        .select("*")
        .eq("user_id", user.id)
        .eq("language", language)
        .like("norm_key", `${normTitle}|%`)
        .maybeSingle();
      
      if (fallbackHit) {
        cachedSummary = fallbackHit;
        console.log("✅ [Cache] Fallback hit! Returning existing summary:", cachedSummary.id);
      }
    }
    
    if (cachedSummary) {
      return new Response(
        JSON.stringify({ summaryId: cachedSummary.id }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Global cache lookup across all users (service role bypasses RLS)
    const { data: globalHit } = await supabase
      .from("book_summaries")
      .select("*")
      .eq("norm_key", cacheKey)
      .eq("language", language)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (globalHit) {
      console.log("✅ [Cache] Global hit! Cloning summary for user:", user.id, "from:", globalHit.id);
      const { data: cloned, error: cloneError } = await supabase
        .from("book_summaries")
        .insert({
          user_id: user.id,
          user_title: bookTitle,
          user_author: bookAuthor || null,
          book_title: globalHit.book_title,
          book_author: globalHit.book_author,
          canonical_title: globalHit.canonical_title,
          canonical_author: globalHit.canonical_author,
          year: globalHit.year,
          source: globalHit.source || "clone",
          one_liner: globalHit.one_liner,
          key_ideas: globalHit.key_ideas || [],
          actions: globalHit.actions || [],
          routine: globalHit.routine || null,
          plan_7_days: globalHit.plan_7_days || null,
          metrics: globalHit.metrics || null,
          pitfalls: globalHit.pitfalls || null,
          closing: globalHit.closing || null,
          theme: globalHit.theme,
          language: language,
          norm_key: cacheKey,
          summary_text: globalHit.summary_text || globalHit.one_liner || "",
          main_ideas: globalHit.main_ideas || globalHit.key_ideas || [],
          practical_applications: globalHit.practical_applications || (Array.isArray(globalHit.actions) ? globalHit.actions.join('\n') : null),
        })
        .select()
        .single();

      if (cloneError) {
        console.error("🚨 [Cache] Failed to clone summary:", cloneError);
      } else {
        console.log("✅ [Cache] Cloned summary:", cloned.id);
        return new Response(
          JSON.stringify({ summaryId: cloned.id }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    console.log("❌ [Cache] No cache hit. Generating new summary...");

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

    // Generate summary using Lovable AI (Gemini)
    console.log("Calling Lovable AI with model: google/gemini-2.5-flash");
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
      console.error("Lovable AI error:", aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        throw new Error("Limite de requisições excedido. Por favor, tente novamente em alguns instantes.");
      }
      if (aiResponse.status === 402) {
        throw new Error("Créditos insuficientes. Adicione créditos em Settings → Workspace → Usage.");
      }
      if (aiResponse.status === 401) {
        throw new Error("Erro de autenticação com Lovable AI. Contate o suporte.");
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

    // Determine final author - prioritize AI response for complete names
    let finalAuthor = metadata.canonicalAuthor;
    let finalCanonicalAuthor = metadata.canonicalAuthor;
    
    // AI often provides more complete author names (e.g., "Paulo Coelho" instead of just "Coelho")
    if (summaryData.author && summaryData.author.trim()) {
      const aiAuthor = capitalizeName(summaryData.author.trim());
      
      // Use AI author if:
      // 1. We don't have a metadata author, OR
      // 2. AI author is longer (likely more complete), OR
      // 3. AI author contains the metadata author (e.g., "Paulo Coelho" contains "Coelho")
      if (!finalAuthor || 
          aiAuthor.length > finalAuthor.length || 
          aiAuthor.toLowerCase().includes(finalAuthor.toLowerCase())) {
        finalAuthor = aiAuthor;
        finalCanonicalAuthor = aiAuthor;
        console.log("Using AI-provided complete author name:", aiAuthor);
      }
    }
    
    if (finalAuthor) {
      finalAuthor = capitalizeName(finalAuthor);
    }
    if (finalCanonicalAuthor) {
      finalCanonicalAuthor = capitalizeName(finalCanonicalAuthor);
    }
    
    // Determine final title - prioritize AI response for proper accents and formatting
    let finalTitle = metadata.canonicalTitle;
    let finalCanonicalTitle = metadata.canonicalTitle;
    
    if (summaryData.title && summaryData.title.trim()) {
      const aiTitle = capitalizeTitle(summaryData.title.trim());
      finalTitle = aiTitle;
      finalCanonicalTitle = aiTitle;
      console.log("Using AI-provided title with proper formatting:", aiTitle);
    }

    // Note: Removed 40 summary limit - all summaries are now stored permanently

    // Save to database with cache key
    const { data: summary, error: dbError } = await supabase
      .from("book_summaries")
      .insert({
        user_id: user.id,
        user_title: bookTitle,
        user_author: bookAuthor || null,
        book_title: finalTitle,
        book_author: finalAuthor,
        canonical_title: finalCanonicalTitle,
        canonical_author: finalCanonicalAuthor,
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
        norm_key: cacheKey,  // Add cache key
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

    // Add book to catalog if it doesn't exist
    const { data: existingBook } = await supabase
      .from("books")
      .select("id")
      .eq("title", finalCanonicalTitle)
      .eq("author", finalCanonicalAuthor)
      .eq("lang", language)
      .maybeSingle();

    if (!existingBook) {
      console.log("📚 Adding new book to catalog:", finalCanonicalTitle, "by", finalCanonicalAuthor);
      
      // Use AI to categorize the book
      const categorizationPrompt = `Categorize this book into relevant tags (choose 1-3 from this list): productivity, habits, health, mindset, finance, sleep, business, self-help, psychology, leadership, communication, creativity, success, motivation, time-management, focus, wellness, nutrition, exercise, relationships, parenting, education, career, investing, wealth, philosophy, spirituality, science, history, biography.

Book: "${finalCanonicalTitle}" by ${finalCanonicalAuthor}

Return ONLY a JSON array of 1-3 tags: ["tag1", "tag2"]`;

      try {
        const categorizationResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${lovableApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-lite",
            messages: [
              {
                role: "user",
                content: categorizationPrompt,
              },
            ],
            response_format: { type: "json_object" },
            max_completion_tokens: 100,
          }),
        });

        let tags: string[] = [];
        
        if (categorizationResponse.ok) {
          const categorizationData = await categorizationResponse.json();
          const content = categorizationData?.choices?.[0]?.message?.content;
          
          if (content) {
            try {
              const parsed = JSON.parse(content);
              if (Array.isArray(parsed)) {
                tags = parsed;
              } else if (parsed.tags && Array.isArray(parsed.tags)) {
                tags = parsed.tags;
              }
            } catch (e) {
              console.log("Failed to parse categorization, using theme as tag");
              tags = [summaryData.theme || theme];
            }
          }
        }
        
        // Fallback to theme if no tags
        if (tags.length === 0) {
          tags = [summaryData.theme || theme];
        }

        console.log("📋 Book tags:", tags);

        // Insert into books catalog
        const { error: bookInsertError } = await supabase
          .from("books")
          .insert({
            title: finalCanonicalTitle,
            author: finalCanonicalAuthor,
            lang: language,
            tags: tags,
            is_active: true,
            popularity: 1,
          });

        if (bookInsertError) {
          console.error("Failed to add book to catalog:", bookInsertError);
        } else {
          console.log("✅ Book added to catalog successfully");
        }
      } catch (error) {
        console.error("Error categorizing/adding book:", error);
      }
    } else {
      // Book exists, increment popularity
      const { error: updateError } = await supabase
        .from("books")
        .update({ popularity: supabase.rpc('increment', { x: 1 }) })
        .eq("id", existingBook.id);
        
      if (!updateError) {
        console.log("📈 Incremented book popularity");
      }
    }

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