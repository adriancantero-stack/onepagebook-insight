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
    const { summaryId, type } = await req.json();
    
    if (!summaryId || !type) {
      return new Response(
        JSON.stringify({ error: 'summaryId and type are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // Get user from auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if summary exists and belongs to user
    const { data: summary, error: summaryError } = await supabase
      .from('book_summaries')
      .select('*')
      .eq('id', summaryId)
      .eq('user_id', user.id)
      .single();

    if (summaryError || !summary) {
      return new Response(
        JSON.stringify({ error: 'Summary not found or access denied' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const language = summary.language || 'pt';

    if (type === 'flashcards') {
      // Check if flashcards already exist
      const { data: existing, error: existingError } = await supabase
        .from('book_flashcards')
        .select('*')
        .eq('book_summary_id', summaryId)
        .order('card_order');

      if (!existingError && existing && existing.length > 0) {
        return new Response(
          JSON.stringify({ flashcards: existing, cached: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Generate flashcards using Lovable AI
      const systemPrompt = language === 'pt' 
        ? 'Você é um especialista em criar flashcards educacionais para fixação de conteúdo.'
        : language === 'es'
        ? 'Eres un experto en crear flashcards educativas para la fijación de contenido.'
        : 'You are an expert in creating educational flashcards for content retention.';

      const userPrompt = language === 'pt'
        ? `Crie 8 flashcards (perguntas e respostas) para fixar o conteúdo deste livro:

Título: ${summary.book_title}
Autor: ${summary.book_author}

Ideias principais:
${summary.key_ideas?.join('\n') || summary.main_ideas?.join('\n') || ''}

Ações práticas:
${summary.actions?.join('\n') || ''}

Resumo:
${summary.summary_text || summary.one_liner || ''}

Retorne APENAS um JSON array no formato:
[
  {"question": "Pergunta clara e objetiva?", "answer": "Resposta concisa e direta"},
  ...
]

As perguntas devem testar a compreensão dos conceitos chave e práticas do livro.`
        : language === 'es'
        ? `Crea 8 flashcards (preguntas y respuestas) para fijar el contenido de este libro:

Título: ${summary.book_title}
Autor: ${summary.book_author}

Ideas principales:
${summary.key_ideas?.join('\n') || summary.main_ideas?.join('\n') || ''}

Acciones prácticas:
${summary.actions?.join('\n') || ''}

Resumen:
${summary.summary_text || summary.one_liner || ''}

Devuelve SOLO un JSON array en el formato:
[
  {"question": "Pregunta clara y objetiva?", "answer": "Respuesta concisa y directa"},
  ...
]

Las preguntas deben probar la comprensión de los conceptos clave y prácticas del libro.`
        : `Create 8 flashcards (questions and answers) to retain the content of this book:

Title: ${summary.book_title}
Author: ${summary.book_author}

Main ideas:
${summary.key_ideas?.join('\n') || summary.main_ideas?.join('\n') || ''}

Practical actions:
${summary.actions?.join('\n') || ''}

Summary:
${summary.summary_text || summary.one_liner || ''}

Return ONLY a JSON array in the format:
[
  {"question": "Clear and objective question?", "answer": "Concise and direct answer"},
  ...
]

Questions should test understanding of the book's key concepts and practices.`;

      const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
        }),
      });

      if (!aiResponse.ok) {
        console.error('AI response error:', await aiResponse.text());
        return new Response(
          JSON.stringify({ error: 'Failed to generate flashcards' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const aiData = await aiResponse.json();
      const content = aiData.choices[0].message.content;

      // Parse JSON from response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        console.error('No JSON found in AI response:', content);
        return new Response(
          JSON.stringify({ error: 'Invalid AI response format' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const flashcardsData = JSON.parse(jsonMatch[0]);

      // Save flashcards to database
      const flashcardsToInsert = flashcardsData.map((card: any, index: number) => ({
        book_summary_id: summaryId,
        question: card.question,
        answer: card.answer,
        card_order: index,
      }));

      const { data: savedFlashcards, error: saveError } = await supabase
        .from('book_flashcards')
        .insert(flashcardsToInsert)
        .select();

      if (saveError) {
        console.error('Error saving flashcards:', saveError);
        return new Response(
          JSON.stringify({ error: 'Failed to save flashcards' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ flashcards: savedFlashcards, cached: false }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (type === 'examples') {
      // Check if examples already exist
      if (summary.practical_examples) {
        return new Response(
          JSON.stringify({ examples: summary.practical_examples, cached: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Generate practical examples using Lovable AI
      const systemPrompt = language === 'pt'
        ? 'Você é um especialista em criar exemplos práticos e aplicáveis de conceitos de livros.'
        : language === 'es'
        ? 'Eres un experto en crear ejemplos prácticos y aplicables de conceptos de libros.'
        : 'You are an expert in creating practical and applicable examples from book concepts.';

      const userPrompt = language === 'pt'
        ? `Crie 5 exemplos práticos de aplicação dos conceitos deste livro:

Título: ${summary.book_title}
Autor: ${summary.book_author}

Ideias principais:
${summary.key_ideas?.join('\n') || summary.main_ideas?.join('\n') || ''}

Ações práticas:
${summary.actions?.join('\n') || ''}

Resumo:
${summary.summary_text || summary.one_liner || ''}

Retorne APENAS um JSON array no formato:
[
  {
    "title": "Título do cenário",
    "context": "Descrição do contexto/situação (2-3 linhas)",
    "application": "Como aplicar o conceito do livro nesta situação (3-4 linhas)",
    "expected_result": "Resultado esperado (1-2 linhas)"
  },
  ...
]

Os exemplos devem ser realistas, variados e cobrir diferentes aspectos do livro.`
        : language === 'es'
        ? `Crea 5 ejemplos prácticos de aplicación de los conceptos de este libro:

Título: ${summary.book_title}
Autor: ${summary.book_author}

Ideas principales:
${summary.key_ideas?.join('\n') || summary.main_ideas?.join('\n') || ''}

Acciones prácticas:
${summary.actions?.join('\n') || ''}

Resumen:
${summary.summary_text || summary.one_liner || ''}

Devuelve SOLO un JSON array en el formato:
[
  {
    "title": "Título del escenario",
    "context": "Descripción del contexto/situación (2-3 líneas)",
    "application": "Cómo aplicar el concepto del libro en esta situación (3-4 líneas)",
    "expected_result": "Resultado esperado (1-2 líneas)"
  },
  ...
]

Los ejemplos deben ser realistas, variados y cubrir diferentes aspectos del libro.`
        : `Create 5 practical examples of applying the concepts from this book:

Title: ${summary.book_title}
Author: ${summary.book_author}

Main ideas:
${summary.key_ideas?.join('\n') || summary.main_ideas?.join('\n') || ''}

Practical actions:
${summary.actions?.join('\n') || ''}

Summary:
${summary.summary_text || summary.one_liner || ''}

Return ONLY a JSON array in the format:
[
  {
    "title": "Scenario title",
    "context": "Context/situation description (2-3 lines)",
    "application": "How to apply the book concept in this situation (3-4 lines)",
    "expected_result": "Expected outcome (1-2 lines)"
  },
  ...
]

Examples should be realistic, varied, and cover different aspects of the book.`;

      const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
        }),
      });

      if (!aiResponse.ok) {
        console.error('AI response error:', await aiResponse.text());
        return new Response(
          JSON.stringify({ error: 'Failed to generate examples' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const aiData = await aiResponse.json();
      const content = aiData.choices[0].message.content;

      // Parse JSON from response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        console.error('No JSON found in AI response:', content);
        return new Response(
          JSON.stringify({ error: 'Invalid AI response format' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const examples = JSON.parse(jsonMatch[0]);

      // Save examples to database
      const { error: updateError } = await supabase
        .from('book_summaries')
        .update({ practical_examples: examples })
        .eq('id', summaryId);

      if (updateError) {
        console.error('Error saving examples:', updateError);
        return new Response(
          JSON.stringify({ error: 'Failed to save examples' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ examples, cached: false }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid type. Use "flashcards" or "examples"' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-learning-content:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
