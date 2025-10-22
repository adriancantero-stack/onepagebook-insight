import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BATCH_SIZE = 50; // Process 50 users at a time
const DELAY_BETWEEN_EMAILS = 100; // 100ms delay to respect rate limits

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log(`🚀 Starting daily reminders send...`);

    // Get all users who want email notifications
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, full_name, notification_time, notification_enabled, preferred_language, streak_days, last_read_date, xp, level, total_books_read")
      .eq("notification_enabled", true)
      .eq("notification_email", true);

    if (profilesError) {
      console.error("❌ Error fetching profiles:", profilesError);
      throw profilesError;
    }

    if (!profiles || profiles.length === 0) {
      console.log('✅ No users with notifications enabled');
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No users with notifications enabled',
          emailsSent: 0 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`📊 Found ${profiles.length} users with notifications enabled`);

    // Get today's date for idempotency check
    const today = new Date().toISOString().split('T')[0];

    // Background task to process all emails
    const processAllEmails = async () => {
      let totalSent = 0;
      let totalSkipped = 0;
      let totalErrors = 0;
      
      console.log(`📦 Starting batch processing of ${profiles.length} users...`);
      
      // Process in batches
      for (let i = 0; i < profiles.length; i += BATCH_SIZE) {
        const batch = profiles.slice(i, i + BATCH_SIZE);
        const batchNum = Math.floor(i / BATCH_SIZE) + 1;
        const totalBatches = Math.ceil(profiles.length / BATCH_SIZE);
        
        console.log(`\n📦 Processing batch ${batchNum}/${totalBatches} (${batch.length} users)`);
        
        for (const profile of batch) {
          try {
            // Check if already sent today (idempotency)
            const { data: alreadySent } = await supabase
              .from('daily_reminder_log')
              .select('id')
              .eq('user_id', profile.id)
              .eq('sent_date', today)
              .maybeSingle();

            if (alreadySent) {
              totalSkipped++;
              console.log(`⏭️  Reminder already sent to user ${profile.id} today, skipping (${totalSkipped} skipped)`);
              continue;
            }

            // Get user email from auth
            const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(profile.id);
            
            if (userError || !user?.email) {
              console.error(`❌ Error getting email for user ${profile.id}:`, userError);
              totalErrors++;
              await supabase.from('daily_reminder_log').insert({
                user_id: profile.id,
                email: 'unknown',
                sent_date: today,
                success: false,
                error_message: 'Failed to fetch user email'
              });
              continue;
            }

            // Check if user read today
            const hasReadToday = profile.last_read_date === today;

            if (hasReadToday) {
              totalSkipped++;
              console.log(`✅ User ${user.email} already read today, skipping (${totalSkipped} skipped)`);
              await supabase.from('daily_reminder_log').insert({
                user_id: profile.id,
                email: user.email,
                sent_date: today,
                success: true,
                error_message: 'Already read today'
              });
              continue;
            }

            // Get last book read
            const { data: lastBook } = await supabase
              .from("book_summaries")
              .select("book_title, book_author")
              .eq("user_id", profile.id)
              .order("created_at", { ascending: false })
              .limit(1)
              .maybeSingle();

            const userName = profile.full_name || "Leitor";
            const language = profile.preferred_language || "pt";
            const lastBookText = lastBook ? `${lastBook.book_title} - ${lastBook.book_author}` : null;

            // Translate level names
            const levelTranslations = {
              pt: { 'Beginner': 'Iniciante', 'Learner': 'Aprendiz', 'Thinker': 'Pensador', 'Master': 'Mestre', 'Enlightened': 'Iluminado' },
              en: { 'Beginner': 'Beginner', 'Learner': 'Learner', 'Thinker': 'Thinker', 'Master': 'Master', 'Enlightened': 'Enlightened' },
              es: { 'Beginner': 'Principiante', 'Learner': 'Aprendiz', 'Thinker': 'Pensador', 'Master': 'Maestro', 'Enlightened': 'Iluminado' }
            };

            const translatedLevel = levelTranslations[language as keyof typeof levelTranslations]?.[profile.level as keyof typeof levelTranslations.pt] || profile.level;

            const unsubscribeUrl = `https://onepagebook.ai/settings?unsubscribe=true`;
            
            const messages = {
              pt: {
                subject: "📚 Hora da sua leitura diária!",
                text: `Olá, ${userName}!\n\nEstá na hora de continuar sua jornada de aprendizado! Não deixe sua sequência cair.\n\n🔥 ${profile.streak_days || 0} dias de sequência\n⭐ ${profile.xp || 0} pontos XP\n📚 ${profile.total_books_read || 0} livros lidos\n🎯 ${translatedLevel}\n${lastBookText ? `\nÚltimo livro lido: ${lastBookText}` : ''}\n\nContinue lendo: https://onepagebook.ai/home\n\nMantenha sua mente afiada, um livro por vez!\n\nPara gerenciar suas notificações, acesse: ${unsubscribeUrl}`,
                html: `
                  <!DOCTYPE html>
                  <html>
                  <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  </head>
                  <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td align="center" style="padding: 40px 0;">
                          <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                            <tr>
                              <td style="padding: 40px 40px 20px; background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%); border-radius: 12px 12px 0 0;">
                                <h1 style="margin: 0; color: white; font-size: 28px; font-weight: bold;">Olá, ${userName}! 👋</h1>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 40px;">
                                <p style="margin: 0 0 24px; color: #374151; font-size: 16px; line-height: 1.6;">
                                  Está na hora de continuar sua jornada de aprendizado! Não deixe sua sequência cair.
                                </p>
                                <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 24px 0;">
                                  <tr>
                                    <td style="padding: 20px; background-color: #FEF3C7; border-radius: 8px; width: 50%;">
                                      <div style="text-align: center;">
                                        <div style="font-size: 32px; font-weight: bold; color: #92400E; margin-bottom: 4px;">🔥 ${profile.streak_days || 0}</div>
                                        <div style="font-size: 14px; color: #78350F;">dias de sequência</div>
                                      </div>
                                    </td>
                                    <td style="width: 16px;"></td>
                                    <td style="padding: 20px; background-color: #DBEAFE; border-radius: 8px; width: 50%;">
                                      <div style="text-align: center;">
                                        <div style="font-size: 32px; font-weight: bold; color: #1E40AF; margin-bottom: 4px;">⭐ ${profile.xp || 0}</div>
                                        <div style="font-size: 14px; color: #1E3A8A;">pontos XP</div>
                                      </div>
                                    </td>
                                  </tr>
                                  <tr><td colspan="3" style="height: 16px;"></td></tr>
                                  <tr>
                                    <td style="padding: 20px; background-color: #D1FAE5; border-radius: 8px;">
                                      <div style="text-align: center;">
                                        <div style="font-size: 32px; font-weight: bold; color: #065F46; margin-bottom: 4px;">📚 ${profile.total_books_read || 0}</div>
                                        <div style="font-size: 14px; color: #064E3B;">livros lidos</div>
                                      </div>
                                    </td>
                                    <td style="width: 16px;"></td>
                                    <td style="padding: 20px; background-color: #E9D5FF; border-radius: 8px;">
                                      <div style="text-align: center;">
                                        <div style="font-size: 24px; font-weight: bold; color: #6B21A8; margin-bottom: 4px;">🎯 ${translatedLevel}</div>
                                        <div style="font-size: 14px; color: #5B21B6;">seu nível</div>
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                                ${lastBookText ? `
                                <div style="margin: 24px 0; padding: 16px; background-color: #F9FAFB; border-left: 4px solid #8B5CF6; border-radius: 4px;">
                                  <div style="font-size: 12px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Último livro lido</div>
                                  <div style="font-size: 16px; color: #111827; font-weight: 500;">${lastBookText}</div>
                                </div>
                                ` : ''}
                                <table role="presentation" style="width: 100%; margin: 32px 0;">
                                  <tr>
                                    <td align="center">
                                      <a href="https://onepagebook.ai/home" style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(139, 92, 246, 0.3);">
                                        📖 Continuar Lendo
                                      </a>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 24px 40px; background-color: #F9FAFB; border-radius: 0 0 12px 12px; text-align: center;">
                                <p style="margin: 0 0 12px; color: #6B7280; font-size: 14px;">
                                  Mantenha sua mente afiada, um livro por vez! 🧠✨
                                </p>
                                <p style="margin: 0; color: #9CA3AF; font-size: 12px;">
                                  <a href="${unsubscribeUrl}" style="color: #9CA3AF; text-decoration: underline;">Gerenciar notificações</a>
                                </p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </body>
                  </html>
                `
              },
              en: {
                subject: "📚 Time for your daily reading!",
                text: `Hello, ${userName}!\n\nIt's time to continue your learning journey! Don't let your streak fall.\n\n🔥 ${profile.streak_days || 0} day streak\n⭐ ${profile.xp || 0} XP points\n📚 ${profile.total_books_read || 0} books read\n🎯 ${translatedLevel}\n${lastBookText ? `\nLast book read: ${lastBookText}` : ''}\n\nContinue reading: https://onepagebook.ai/home\n\nKeep your mind sharp, one book at a time!\n\nTo manage your notifications, visit: ${unsubscribeUrl}`,
                html: `
                  <!DOCTYPE html>
                  <html>
                  <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  </head>
                  <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td align="center" style="padding: 40px 0;">
                          <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                            <tr>
                              <td style="padding: 40px 40px 20px; background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%); border-radius: 12px 12px 0 0;">
                                <h1 style="margin: 0; color: white; font-size: 28px; font-weight: bold;">Hello, ${userName}! 👋</h1>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 40px;">
                                <p style="margin: 0 0 24px; color: #374151; font-size: 16px; line-height: 1.6;">
                                  It's time to continue your learning journey! Don't let your streak fall.
                                </p>
                                <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 24px 0;">
                                  <tr>
                                    <td style="padding: 20px; background-color: #FEF3C7; border-radius: 8px; width: 50%;">
                                      <div style="text-align: center;">
                                        <div style="font-size: 32px; font-weight: bold; color: #92400E; margin-bottom: 4px;">🔥 ${profile.streak_days || 0}</div>
                                        <div style="font-size: 14px; color: #78350F;">day streak</div>
                                      </div>
                                    </td>
                                    <td style="width: 16px;"></td>
                                    <td style="padding: 20px; background-color: #DBEAFE; border-radius: 8px; width: 50%;">
                                      <div style="text-align: center;">
                                        <div style="font-size: 32px; font-weight: bold; color: #1E40AF; margin-bottom: 4px;">⭐ ${profile.xp || 0}</div>
                                        <div style="font-size: 14px; color: #1E3A8A;">XP points</div>
                                      </div>
                                    </td>
                                  </tr>
                                  <tr><td colspan="3" style="height: 16px;"></td></tr>
                                  <tr>
                                    <td style="padding: 20px; background-color: #D1FAE5; border-radius: 8px;">
                                      <div style="text-align: center;">
                                        <div style="font-size: 32px; font-weight: bold; color: #065F46; margin-bottom: 4px;">📚 ${profile.total_books_read || 0}</div>
                                        <div style="font-size: 14px; color: #064E3B;">books read</div>
                                      </div>
                                    </td>
                                    <td style="width: 16px;"></td>
                                    <td style="padding: 20px; background-color: #E9D5FF; border-radius: 8px;">
                                      <div style="text-align: center;">
                                        <div style="font-size: 24px; font-weight: bold; color: #6B21A8; margin-bottom: 4px;">🎯 ${translatedLevel}</div>
                                        <div style="font-size: 14px; color: #5B21B6;">your level</div>
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                                ${lastBookText ? `
                                <div style="margin: 24px 0; padding: 16px; background-color: #F9FAFB; border-left: 4px solid #8B5CF6; border-radius: 4px;">
                                  <div style="font-size: 12px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Last book read</div>
                                  <div style="font-size: 16px; color: #111827; font-weight: 500;">${lastBookText}</div>
                                </div>
                                ` : ''}
                                <table role="presentation" style="width: 100%; margin: 32px 0;">
                                  <tr>
                                    <td align="center">
                                      <a href="https://onepagebook.ai/home" style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(139, 92, 246, 0.3);">
                                        📖 Continue Reading
                                      </a>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 24px 40px; background-color: #F9FAFB; border-radius: 0 0 12px 12px; text-align: center;">
                                <p style="margin: 0 0 12px; color: #6B7280; font-size: 14px;">
                                  Keep your mind sharp, one book at a time! 🧠✨
                                </p>
                                <p style="margin: 0; color: #9CA3AF; font-size: 12px;">
                                  <a href="${unsubscribeUrl}" style="color: #9CA3AF; text-decoration: underline;">Manage notifications</a>
                                </p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </body>
                  </html>
                `
              },
              es: {
                subject: "📚 ¡Hora de tu lectura diaria!",
                text: `¡Hola, ${userName}!\n\n¡Es hora de continuar tu viaje de aprendizaje! No dejes que tu racha caiga.\n\n🔥 ${profile.streak_days || 0} días de racha\n⭐ ${profile.xp || 0} puntos XP\n📚 ${profile.total_books_read || 0} libros leídos\n🎯 ${translatedLevel}\n${lastBookText ? `\nÚltimo libro leído: ${lastBookText}` : ''}\n\nContinúa leyendo: https://onepagebook.ai/home\n\n¡Mantén tu mente afilada, un libro a la vez!\n\nPara gestionar tus notificaciones, visita: ${unsubscribeUrl}`,
                html: `
                  <!DOCTYPE html>
                  <html>
                  <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  </head>
                  <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td align="center" style="padding: 40px 0;">
                          <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                            <tr>
                              <td style="padding: 40px 40px 20px; background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%); border-radius: 12px 12px 0 0;">
                                <h1 style="margin: 0; color: white; font-size: 28px; font-weight: bold;">¡Hola, ${userName}! 👋</h1>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 40px;">
                                <p style="margin: 0 0 24px; color: #374151; font-size: 16px; line-height: 1.6;">
                                  ¡Es hora de continuar tu viaje de aprendizaje! No dejes que tu racha caiga.
                                </p>
                                <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 24px 0;">
                                  <tr>
                                    <td style="padding: 20px; background-color: #FEF3C7; border-radius: 8px; width: 50%;">
                                      <div style="text-align: center;">
                                        <div style="font-size: 32px; font-weight: bold; color: #92400E; margin-bottom: 4px;">🔥 ${profile.streak_days || 0}</div>
                                        <div style="font-size: 14px; color: #78350F;">días de racha</div>
                                      </div>
                                    </td>
                                    <td style="width: 16px;"></td>
                                    <td style="padding: 20px; background-color: #DBEAFE; border-radius: 8px; width: 50%;">
                                      <div style="text-align: center;">
                                        <div style="font-size: 32px; font-weight: bold; color: #1E40AF; margin-bottom: 4px;">⭐ ${profile.xp || 0}</div>
                                        <div style="font-size: 14px; color: #1E3A8A;">puntos XP</div>
                                      </div>
                                    </td>
                                  </tr>
                                  <tr><td colspan="3" style="height: 16px;"></td></tr>
                                  <tr>
                                    <td style="padding: 20px; background-color: #D1FAE5; border-radius: 8px;">
                                      <div style="text-align: center;">
                                        <div style="font-size: 32px; font-weight: bold; color: #065F46; margin-bottom: 4px;">📚 ${profile.total_books_read || 0}</div>
                                        <div style="font-size: 14px; color: #064E3B;">libros leídos</div>
                                      </div>
                                    </td>
                                    <td style="width: 16px;"></td>
                                    <td style="padding: 20px; background-color: #E9D5FF; border-radius: 8px;">
                                      <div style="text-align: center;">
                                        <div style="font-size: 24px; font-weight: bold; color: #6B21A8; margin-bottom: 4px;">🎯 ${translatedLevel}</div>
                                        <div style="font-size: 14px; color: #5B21B6;">tu nivel</div>
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                                ${lastBookText ? `
                                <div style="margin: 24px 0; padding: 16px; background-color: #F9FAFB; border-left: 4px solid #8B5CF6; border-radius: 4px;">
                                  <div style="font-size: 12px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Último libro leído</div>
                                  <div style="font-size: 16px; color: #111827; font-weight: 500;">${lastBookText}</div>
                                </div>
                                ` : ''}
                                <table role="presentation" style="width: 100%; margin: 32px 0;">
                                  <tr>
                                    <td align="center">
                                      <a href="https://onepagebook.ai/home" style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(139, 92, 246, 0.3);">
                                        📖 Continuar Leyendo
                                      </a>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 24px 40px; background-color: #F9FAFB; border-radius: 0 0 12px 12px; text-align: center;">
                                <p style="margin: 0 0 12px; color: #6B7280; font-size: 14px;">
                                  ¡Mantén tu mente afilada, un libro a la vez! 🧠✨
                                </p>
                                <p style="margin: 0; color: #9CA3AF; font-size: 12px;">
                                  <a href="${unsubscribeUrl}" style="color: #9CA3AF; text-decoration: underline;">Gestionar notificaciones</a>
                                </p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </body>
                  </html>
                `
              }
            };

            const message = messages[language as keyof typeof messages] || messages.pt;

            // Send email via Resend API
            const response = await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${RESEND_API_KEY}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                from: "OnePageBook <reminders@send.onepagebook.ai>",
                reply_to: "support@onepagebook.ai",
                to: [user.email],
                subject: message.subject,
                html: message.html,
                text: message.text,
                headers: {
                  'List-Unsubscribe': `<${unsubscribeUrl}>`,
                  'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
                  'X-Entity-Ref-ID': `user-${profile.id}`,
                  'Precedence': 'bulk'
                },
                tags: [
                  { name: 'category', value: 'daily-reminder' },
                  { name: 'language', value: language }
                ]
              }),
            });

            const result = await response.json();
            
            if (!response.ok) {
              throw new Error(`Resend API error: ${JSON.stringify(result)}`);
            }

            totalSent++;
            console.log(`✅ Email sent to ${user.email} (${totalSent}/${profiles.length})`);
            
            // Log success
            await supabase.from('daily_reminder_log').insert({
              user_id: profile.id,
              email: user.email,
              sent_date: today,
              success: true
            });

            // Delay to respect rate limits
            await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_EMAILS));

          } catch (error: any) {
            totalErrors++;
            console.error(`❌ Error processing user ${profile.id}:`, error.message);
            
            // Log error
            try {
              await supabase.from('daily_reminder_log').insert({
                user_id: profile.id,
                email: 'error',
                sent_date: today,
                success: false,
                error_message: error.message
              });
            } catch (logError) {
              console.error('❌ Error logging to database:', logError);
            }
          }
        }
        
        console.log(`✅ Batch ${batchNum}/${totalBatches} completed. Sent: ${totalSent}, Skipped: ${totalSkipped}, Errors: ${totalErrors}`);
      }

      console.log(`\n🎉 ALL EMAILS PROCESSED!`);
      console.log(`📊 Final Stats: Sent: ${totalSent} | Skipped: ${totalSkipped} | Errors: ${totalErrors} | Total: ${profiles.length}`);

      // Update cron schedule
      const nextRun = new Date();
      nextRun.setDate(nextRun.getDate() + 1);
      nextRun.setHours(9, 0, 0, 0); // 09:00 UTC

      await supabase
        .from('cron_schedules')
        .update({
          last_run_at: new Date().toISOString(),
          next_run_at: nextRun.toISOString()
        })
        .eq('job_name', 'send-daily-reminders');

      console.log(`✅ Cron schedule updated. Next run: ${nextRun.toISOString()}`);
    };

    // Start background task that will continue even after response is sent
    // @ts-ignore - EdgeRuntime is available in Deno Deploy
    if (typeof EdgeRuntime !== 'undefined') {
      // @ts-ignore
      EdgeRuntime.waitUntil(processAllEmails());
      console.log(`✅ Background task started using EdgeRuntime.waitUntil()`);
    } else {
      // Fallback for local testing - start but don't await
      processAllEmails();
      console.log(`✅ Background task started (local mode)`);
    }

    // Return immediate response
    return new Response(
      JSON.stringify({
        success: true,
        message: `Started processing ${profiles.length} reminder emails in background`,
        totalUsers: profiles.length,
        batchSize: BATCH_SIZE,
        estimatedBatches: Math.ceil(profiles.length / BATCH_SIZE),
        note: 'Processing continues in background. Check edge function logs for detailed progress.'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error("❌ Fatal error in send-daily-reminders:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
