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

    // Use RPC to call custom search function with fuzzy matching
    const { data: books, error } = await supabase.rpc("search_books", {
      search_query: normalizedQuery,
      search_lang: lang,
      result_limit: limit,
    });

    if (error) {
      console.error("Database error:", error);
      
      // Fallback to simple search if RPC fails
      const { data: fallbackBooks, error: fallbackError } = await supabase
        .from("books")
        .select("id, title, author, lang, cover_url, popularity")
        .eq("is_active", true)
        .eq("lang", lang)
        .or(`title.ilike.%${query}%,author.ilike.%${query}%`)
        .order("popularity", { ascending: false })
        .limit(limit);

      if (fallbackError) throw fallbackError;
      
      console.log("Using fallback search, found books:", fallbackBooks?.length || 0);
      
      return new Response(
        JSON.stringify({ books: fallbackBooks || [] }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Found books:", books?.length || 0);

    return new Response(
      JSON.stringify({ books: books || [] }),
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
