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
    const url = new URL(req.url);
    const query = url.searchParams.get("query") || "";
    const lang = url.searchParams.get("lang") || "pt";
    const limit = parseInt(url.searchParams.get("limit") || "8");

    if (query.length < 2) {
      return new Response(
        JSON.stringify({ books: [] }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Search with prefix match prioritized, then fuzzy match
    const { data: books, error } = await supabase
      .from("books")
      .select("id, title, author, lang, cover_url, popularity")
      .eq("is_active", true)
      .eq("lang", lang)
      .or(`title.ilike.${query}%,title.ilike.%${query}%,author.ilike.${query}%,author.ilike.%${query}%`)
      .order("popularity", { ascending: false })
      .limit(limit);

    if (error) throw error;

    // Sort results: prefix match first, then fuzzy match
    const sortedBooks = (books || []).sort((a, b) => {
      const queryLower = query.toLowerCase();
      const aTitleLower = a.title.toLowerCase();
      const bTitleLower = b.title.toLowerCase();

      // Prioritize exact prefix matches
      const aStartsWith = aTitleLower.startsWith(queryLower);
      const bStartsWith = bTitleLower.startsWith(queryLower);

      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;

      // Then by popularity
      return b.popularity - a.popularity;
    });

    return new Response(
      JSON.stringify({ books: sortedBooks }),
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
