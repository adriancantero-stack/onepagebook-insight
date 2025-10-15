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
    const { email, language = 'pt' } = await req.json();

    console.log(`Sending test email to ${email} in language: ${language}`);

    // Mock user data for testing
    const user = {
      email: email,
      name: "Leitor de Teste",
      language: language,
      streak: 7,
      xp: 450,
      level: "Learner",
      totalBooks: 12,
      lastBook: "Atomic Habits - James Clear"
    };

    const messages = {
      pt: {
        subject: "📚 Hora da sua leitura diária!",
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
                    <!-- Header -->
                    <tr>
                      <td style="padding: 40px 40px 20px; background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%); border-radius: 12px 12px 0 0;">
                        <h1 style="margin: 0; color: white; font-size: 28px; font-weight: bold;">Olá, ${user.name}! 👋</h1>
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px;">
                        <p style="margin: 0 0 24px; color: #374151; font-size: 16px; line-height: 1.6;">
                          Está na hora de continuar sua jornada de aprendizado! Não deixe sua sequência cair.
                        </p>
                        
                        <!-- Stats Grid -->
                        <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 24px 0;">
                          <tr>
                            <td style="padding: 20px; background-color: #FEF3C7; border-radius: 8px; width: 50%;">
                              <div style="text-align: center;">
                                <div style="font-size: 32px; font-weight: bold; color: #92400E; margin-bottom: 4px;">🔥 ${user.streak}</div>
                                <div style="font-size: 14px; color: #78350F;">dias de sequência</div>
                              </div>
                            </td>
                            <td style="width: 16px;"></td>
                            <td style="padding: 20px; background-color: #DBEAFE; border-radius: 8px; width: 50%;">
                              <div style="text-align: center;">
                                <div style="font-size: 32px; font-weight: bold; color: #1E40AF; margin-bottom: 4px;">⭐ ${user.xp}</div>
                                <div style="font-size: 14px; color: #1E3A8A;">pontos XP</div>
                              </div>
                            </td>
                          </tr>
                          <tr><td colspan="3" style="height: 16px;"></td></tr>
                          <tr>
                            <td style="padding: 20px; background-color: #D1FAE5; border-radius: 8px;">
                              <div style="text-align: center;">
                                <div style="font-size: 32px; font-weight: bold; color: #065F46; margin-bottom: 4px;">📚 ${user.totalBooks}</div>
                                <div style="font-size: 14px; color: #064E3B;">livros lidos</div>
                              </div>
                            </td>
                            <td style="width: 16px;"></td>
                            <td style="padding: 20px; background-color: #E9D5FF; border-radius: 8px;">
                              <div style="text-align: center;">
                                <div style="font-size: 24px; font-weight: bold; color: #6B21A8; margin-bottom: 4px;">🎯 ${user.level}</div>
                                <div style="font-size: 14px; color: #5B21B6;">seu nível</div>
                              </div>
                            </td>
                          </tr>
                        </table>
                        
                        ${user.lastBook ? `
                        <div style="margin: 24px 0; padding: 16px; background-color: #F9FAFB; border-left: 4px solid #8B5CF6; border-radius: 4px;">
                          <div style="font-size: 12px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Último livro lido</div>
                          <div style="font-size: 16px; color: #111827; font-weight: 500;">${user.lastBook}</div>
                        </div>
                        ` : ''}
                        
                        <table role="presentation" style="width: 100%; margin: 32px 0;">
                          <tr>
                            <td align="center">
                              <a href="https://onepagebook.com" style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(139, 92, 246, 0.3);">
                                📖 Continuar Lendo
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="padding: 24px 40px; background-color: #F9FAFB; border-radius: 0 0 12px 12px; text-align: center;">
                        <p style="margin: 0; color: #6B7280; font-size: 14px;">
                          Mantenha sua mente afiada, um livro por vez! 🧠✨
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
                        <h1 style="margin: 0; color: white; font-size: 28px; font-weight: bold;">Hello, ${user.name}! 👋</h1>
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
                                <div style="font-size: 32px; font-weight: bold; color: #92400E; margin-bottom: 4px;">🔥 ${user.streak}</div>
                                <div style="font-size: 14px; color: #78350F;">day streak</div>
                              </div>
                            </td>
                            <td style="width: 16px;"></td>
                            <td style="padding: 20px; background-color: #DBEAFE; border-radius: 8px; width: 50%;">
                              <div style="text-align: center;">
                                <div style="font-size: 32px; font-weight: bold; color: #1E40AF; margin-bottom: 4px;">⭐ ${user.xp}</div>
                                <div style="font-size: 14px; color: #1E3A8A;">XP points</div>
                              </div>
                            </td>
                          </tr>
                          <tr><td colspan="3" style="height: 16px;"></td></tr>
                          <tr>
                            <td style="padding: 20px; background-color: #D1FAE5; border-radius: 8px;">
                              <div style="text-align: center;">
                                <div style="font-size: 32px; font-weight: bold; color: #065F46; margin-bottom: 4px;">📚 ${user.totalBooks}</div>
                                <div style="font-size: 14px; color: #064E3B;">books read</div>
                              </div>
                            </td>
                            <td style="width: 16px;"></td>
                            <td style="padding: 20px; background-color: #E9D5FF; border-radius: 8px;">
                              <div style="text-align: center;">
                                <div style="font-size: 24px; font-weight: bold; color: #6B21A8; margin-bottom: 4px;">🎯 ${user.level}</div>
                                <div style="font-size: 14px; color: #5B21B6;">your level</div>
                              </div>
                            </td>
                          </tr>
                        </table>
                        ${user.lastBook ? `
                        <div style="margin: 24px 0; padding: 16px; background-color: #F9FAFB; border-left: 4px solid #8B5CF6; border-radius: 4px;">
                          <div style="font-size: 12px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Last book read</div>
                          <div style="font-size: 16px; color: #111827; font-weight: 500;">${user.lastBook}</div>
                        </div>
                        ` : ''}
                        <table role="presentation" style="width: 100%; margin: 32px 0;">
                          <tr>
                            <td align="center">
                              <a href="https://onepagebook.com" style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(139, 92, 246, 0.3);">
                                📖 Continue Reading
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 24px 40px; background-color: #F9FAFB; border-radius: 0 0 12px 12px; text-align: center;">
                        <p style="margin: 0; color: #6B7280; font-size: 14px;">
                          Keep your mind sharp, one book at a time! 🧠✨
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
                        <h1 style="margin: 0; color: white; font-size: 28px; font-weight: bold;">¡Hola, ${user.name}! 👋</h1>
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
                                <div style="font-size: 32px; font-weight: bold; color: #92400E; margin-bottom: 4px;">🔥 ${user.streak}</div>
                                <div style="font-size: 14px; color: #78350F;">días de racha</div>
                              </div>
                            </td>
                            <td style="width: 16px;"></td>
                            <td style="padding: 20px; background-color: #DBEAFE; border-radius: 8px; width: 50%;">
                              <div style="text-align: center;">
                                <div style="font-size: 32px; font-weight: bold; color: #1E40AF; margin-bottom: 4px;">⭐ ${user.xp}</div>
                                <div style="font-size: 14px; color: #1E3A8A;">puntos XP</div>
                              </div>
                            </td>
                          </tr>
                          <tr><td colspan="3" style="height: 16px;"></td></tr>
                          <tr>
                            <td style="padding: 20px; background-color: #D1FAE5; border-radius: 8px;">
                              <div style="text-align: center;">
                                <div style="font-size: 32px; font-weight: bold; color: #065F46; margin-bottom: 4px;">📚 ${user.totalBooks}</div>
                                <div style="font-size: 14px; color: #064E3B;">libros leídos</div>
                              </div>
                            </td>
                            <td style="width: 16px;"></td>
                            <td style="padding: 20px; background-color: #E9D5FF; border-radius: 8px;">
                              <div style="text-align: center;">
                                <div style="font-size: 24px; font-weight: bold; color: #6B21A8; margin-bottom: 4px;">🎯 ${user.level}</div>
                                <div style="font-size: 14px; color: #5B21B6;">tu nivel</div>
                              </div>
                            </td>
                          </tr>
                        </table>
                        ${user.lastBook ? `
                        <div style="margin: 24px 0; padding: 16px; background-color: #F9FAFB; border-left: 4px solid #8B5CF6; border-radius: 4px;">
                          <div style="font-size: 12px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Último libro leído</div>
                          <div style="font-size: 16px; color: #111827; font-weight: 500;">${user.lastBook}</div>
                        </div>
                        ` : ''}
                        <table role="presentation" style="width: 100%; margin: 32px 0;">
                          <tr>
                            <td align="center">
                              <a href="https://onepagebook.com" style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(139, 92, 246, 0.3);">
                                📖 Continuar Leyendo
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 24px 40px; background-color: #F9FAFB; border-radius: 0 0 12px 12px; text-align: center;">
                        <p style="margin: 0; color: #6B7280; font-size: 14px;">
                          ¡Mantén tu mente afilada, un libro a la vez! 🧠✨
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

    const message = messages[user.language as keyof typeof messages] || messages.pt;

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

    console.log(`Test email sent to ${user.email}:`, result);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Email de teste enviado para ${user.email}`,
        result
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in test-notification-email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
