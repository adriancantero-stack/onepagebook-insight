import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { mapGoogleCategory } from '../_shared/categoryMapper.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MigrationStats {
  totalBooks: number;
  migrated: number;
  skipped: number;
  errors: number;
  categoryBreakdown: Record<string, number>;
  errorDetails: Array<{ bookId: string; error: string }>;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        },
      }
    );

    const { dryRun = false } = await req.json().catch(() => ({ dryRun: false }));

    console.log(`Starting category migration (dryRun: ${dryRun})...`);

    // Fetch all books
    const { data: books, error: fetchError } = await supabaseClient
      .from('books')
      .select('id, title, author, category, lang');

    if (fetchError) {
      throw new Error(`Error fetching books: ${fetchError.message}`);
    }

    const stats: MigrationStats = {
      totalBooks: books?.length || 0,
      migrated: 0,
      skipped: 0,
      errors: 0,
      categoryBreakdown: {},
      errorDetails: [],
    };

    if (!books || books.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No books to migrate',
          stats 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${books.length} books to process`);

    // Process books in batches of 100
    const BATCH_SIZE = 100;
    const updates: Array<{ id: string; category: string }> = [];

    for (const book of books) {
      try {
        const currentCategory = book.category || '';
        const newCategory = mapGoogleCategory(currentCategory, 'business');

        if (currentCategory === newCategory) {
          stats.skipped++;
          continue;
        }

        updates.push({ id: book.id, category: newCategory });
        stats.categoryBreakdown[newCategory] = (stats.categoryBreakdown[newCategory] || 0) + 1;

        console.log(`${book.title} - "${currentCategory}" → "${newCategory}"`);
      } catch (error) {
        stats.errors++;
        const errorMsg = error instanceof Error ? error.message : String(error);
        stats.errorDetails.push({
          bookId: book.id,
          error: errorMsg,
        });
        console.error(`Error processing book ${book.id}:`, error);
      }
    }

    // Apply updates in batches if not a dry run
    if (!dryRun && updates.length > 0) {
      for (let i = 0; i < updates.length; i += BATCH_SIZE) {
        const batch = updates.slice(i, i + BATCH_SIZE);
        
        for (const update of batch) {
          const { error: updateError } = await supabaseClient
            .from('books')
            .update({ category: update.category })
            .eq('id', update.id);

          if (updateError) {
            stats.errors++;
            stats.errorDetails.push({
              bookId: update.id,
              error: updateError.message,
            });
            console.error(`Error updating book ${update.id}:`, updateError);
          } else {
            stats.migrated++;
          }
        }

        console.log(`Processed batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(updates.length / BATCH_SIZE)}`);
      }
    } else if (dryRun) {
      stats.migrated = updates.length;
    }

    const message = dryRun
      ? `Dry run completed: ${updates.length} books would be migrated`
      : `Migration completed: ${stats.migrated} books migrated successfully`;

    console.log(message);
    console.log('Category breakdown:', stats.categoryBreakdown);
    console.log(`Skipped: ${stats.skipped}, Errors: ${stats.errors}`);

    return new Response(
      JSON.stringify({
        success: true,
        message,
        stats,
        dryRun,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in migrate-book-categories function:', error);
    const errorMsg = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ error: errorMsg }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
