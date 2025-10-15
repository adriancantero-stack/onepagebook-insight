import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
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

    // Get current time in HH:mm format
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    console.log(`Checking for users to notify at ${currentTime}`);

    // Get users who want notifications at this time
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, full_name, notification_time, notification_enabled, preferred_language, streak_days, last_read_date")
      .eq("notification_enabled", true)
      .eq("notification_email", true)
      .eq("notification_time", currentTime);

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
      throw profilesError;
    }

    console.log(`Found ${profiles?.length || 0} users to notify`);

    // Get user emails from auth
    const emailPromises = profiles?.map(async (profile) => {
      const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(profile.id);
      
      if (userError || !user?.email) {
        console.error(`Error getting email for user ${profile.id}:`, userError);
        return null;
      }

      // Check if user read today
      const today = new Date().toISOString().split('T')[0];
      const hasReadToday = profile.last_read_date === today;

      if (hasReadToday) {
        console.log(`User ${user.email} already read today, skipping`);
        return null;
      }

      return {
        email: user.email,
        name: profile.full_name || "Leitor",
        language: profile.preferred_language || "pt",
        streak: profile.streak_days || 0
      };
    }) || [];

    const users = (await Promise.all(emailPromises)).filter(Boolean);
    console.log(`Sending ${users.length} emails`);

    // Send emails
    const emailResults = await Promise.all(
      users.map(async (user) => {
        if (!user) return null;

        const messages = {
          pt: {
            subject: "📚 Hora da sua leitura diária!",
            html: `
              <h1>Olá, ${user.name}! 👋</h1>
              <p>Não se esqueça de manter sua sequência de leitura!</p>
              <p><strong>Sequência atual: ${user.streak} dias 🔥</strong></p>
              <p>Acesse agora e continue aprendendo!</p>
              <a href="${Deno.env.get("SUPABASE_URL")}" style="display: inline-block; padding: 12px 24px; background: #8B5CF6; color: white; text-decoration: none; border-radius: 6px; margin-top: 16px;">
                Acessar OnePageBook
              </a>
            `
          },
          en: {
            subject: "📚 Time for your daily reading!",
            html: `
              <h1>Hello, ${user.name}! 👋</h1>
              <p>Don't forget to maintain your reading streak!</p>
              <p><strong>Current streak: ${user.streak} days 🔥</strong></p>
              <p>Access now and keep learning!</p>
              <a href="${Deno.env.get("SUPABASE_URL")}" style="display: inline-block; padding: 12px 24px; background: #8B5CF6; color: white; text-decoration: none; border-radius: 6px; margin-top: 16px;">
                Access OnePageBook
              </a>
            `
          },
          es: {
            subject: "📚 ¡Hora de tu lectura diaria!",
            html: `
              <h1>¡Hola, ${user.name}! 👋</h1>
              <p>¡No olvides mantener tu racha de lectura!</p>
              <p><strong>Racha actual: ${user.streak} días 🔥</strong></p>
              <p>¡Accede ahora y sigue aprendiendo!</p>
              <a href="${Deno.env.get("SUPABASE_URL")}" style="display: inline-block; padding: 12px 24px; background: #8B5CF6; color: white; text-decoration: none; border-radius: 6px; margin-top: 16px;">
                Acceder a OnePageBook
              </a>
            `
          }
        };

        const message = messages[user.language as keyof typeof messages] || messages.pt;

        try {
          const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${RESEND_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: "OnePageBook <onboarding@resend.dev>",
              to: [user.email],
              subject: message.subject,
              html: message.html,
            }),
          });

          const result = await response.json();
          
          if (!response.ok) {
            throw new Error(`Resend API error: ${JSON.stringify(result)}`);
          }

          console.log(`Email sent to ${user.email}:`, result);
          return result;
        } catch (error) {
          console.error(`Error sending email to ${user.email}:`, error);
          return null;
        }
      })
    );

    const successCount = emailResults.filter(Boolean).length;
    console.log(`Successfully sent ${successCount} emails`);

    // Update cron schedule
    await supabase
      .from("cron_schedules")
      .update({
        last_run_at: new Date().toISOString(),
        next_run_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      })
      .eq("job_name", "daily-reading-reminders");

    return new Response(
      JSON.stringify({
        success: true,
        sent: successCount,
        total: users.length
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in send-daily-reminders:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
