import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Read from body for POST requests (from supabase.functions.invoke)
    const { query = "", lang = "pt", limit = 8 } = await req.json();

    if (query.length < 2) {
      return new Response(
        JSON.stringify({ books: [] }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log("Searching for:", query, "in language:", lang);

    // Normalize the query (remove accents, lowercase)
    const normalizedQuery = query.toLowerCase();

    // Search in catalog (books table)
    const { data: catalogBooks, error: catalogError } = await supabase.rpc("search_books", {
      search_query: normalizedQuery,
      search_lang: lang,
      result_limit: limit,
    });

    if (catalogError) {
      console.error("Catalog search error:", catalogError);
    }

    // Search in history (book_summaries table)
    // Using textSearch with websearch_to_tsquery for better compatibility
    const { data: historyBooks, error: historyError } = await supabase
      .from("book_summaries")
      .select("id, book_title, book_author, language")
      .eq("language", lang)
      .or(`book_title.ilike.*${normalizedQuery}*,book_author.ilike.*${normalizedQuery}*`)
      .limit(limit);

    if (historyError) {
      console.error("History search error:", historyError);
    }

    // Combine results from catalog and history
    const catalogResults = (catalogBooks || []).map((book: any) => ({
      ...book,
      source: 'catalog'
    }));

    const historyResults = (historyBooks || []).map((summary: any) => ({
      id: summary.id,
      title: summary.book_title,
      author: summary.book_author,
      lang: summary.language,
      popularity: 0,
      source: 'history'
    }));

    // Deduplicate by title+author combination (prefer catalog results)
    const seen = new Set<string>();
    const combinedBooks = [...catalogResults, ...historyResults].filter(book => {
      const key = `${book.title.toLowerCase()}-${book.author?.toLowerCase() || ''}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, limit);

    console.log("Found books - Catalog:", catalogResults.length, "History:", historyResults.length, "Combined:", combinedBooks.length);

    return new Response(
      JSON.stringify({ books: combinedBooks }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("catalog-search error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
