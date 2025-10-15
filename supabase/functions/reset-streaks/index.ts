import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log("Starting streak reset job");

    // Get yesterday's date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    console.log(`Looking for users who didn't read yesterday (${yesterdayStr})`);

    // Find users whose last_read_date is before yesterday and have streak > 0
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, full_name, streak_days, last_read_date")
      .gt("streak_days", 0)
      .or(`last_read_date.is.null,last_read_date.lt.${yesterdayStr}`);

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
      throw profilesError;
    }

    console.log(`Found ${profiles?.length || 0} users with broken streaks`);

    if (!profiles || profiles.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "No streaks to reset"
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Reset streaks for these users
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ streak_days: 0 })
      .gt("streak_days", 0)
      .or(`last_read_date.is.null,last_read_date.lt.${yesterdayStr}`);

    if (updateError) {
      console.error("Error resetting streaks:", updateError);
      throw updateError;
    }

    console.log(`Reset ${profiles.length} streaks`);

    // Update cron schedule
    await supabase
      .from("cron_schedules")
      .update({
        last_run_at: new Date().toISOString(),
        next_run_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      })
      .eq("job_name", "reset-streaks");

    return new Response(
      JSON.stringify({
        success: true,
        reset: profiles.length
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in reset-streaks:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
