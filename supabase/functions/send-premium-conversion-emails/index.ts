import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailTemplate {
  subject: string;
  html: string;
}

// Stripe checkout URLs by language/currency
const STRIPE_CHECKOUT_URLS: Record<string, string> = {
  pt: "https://buy.stripe.com/fZu28r50YbE76fuaKv3oA00?prefilled_promo_code=WELCOME40", // BRL
  en: "https://buy.stripe.com/7sY7sL2SQcIb6fu2dZ3oA02?prefilled_promo_code=WELCOME40", // USD
  es: "https://buy.stripe.com/7sY7sL2SQcIb6fu2dZ3oA02?prefilled_promo_code=WELCOME40", // USD
};
const PROMO_CODE = "WELCOME40";

// Email templates in Portuguese
const getEmailTemplate = (dayType: string, userName: string, userLanguage: string = "pt"): EmailTemplate => {
  const checkoutUrl = STRIPE_CHECKOUT_URLS[userLanguage] || STRIPE_CHECKOUT_URLS.pt;
  // Special checkout URL for Portuguese day 3 and day 5 emails
  const specialCheckoutUrlPt = "https://buy.stripe.com/fZu28r50YbE76fuaKv3oA00";
  const templates: Record<string, EmailTemplate> = {
    day_3: {
      subject: "✨ Descubra todo o potencial do OnePageBook Premium",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { 
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; 
              line-height: 1.6; 
              color: #2B1342;
              background: linear-gradient(135deg, #F8F6FF 0%, #F0ECFF 100%);
              margin: 0;
              padding: 20px;
            }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(124, 92, 255, 0.1); }
            .header { text-align: center; padding: 30px 20px; background: linear-gradient(135deg, #F8F6FF 0%, #E6DEFF 100%); }
            .header h1 { color: #7C5CFF; font-size: 32px; font-weight: bold; margin: 0; }
            .content { background: #ffffff; padding: 30px; }
            .content p { color: #2B1342; margin: 16px 0; }
            .benefits { margin: 25px 0; background: #F8F6FF; padding: 20px; border-radius: 12px; border-left: 4px solid #7C5CFF; }
            .benefits h3 { color: #7C5CFF; margin-top: 0; }
            .benefit-item { padding: 10px 0; color: #2B1342; }
            .cta-button { 
              display: inline-block; 
              padding: 16px 40px; 
              background: linear-gradient(135deg, #7C5CFF 0%, #6643FF 100%); 
              color: white; 
              text-decoration: none; 
              border-radius: 12px; 
              margin: 20px 0;
              font-weight: bold;
              font-size: 16px;
              box-shadow: 0 4px 15px rgba(124, 92, 255, 0.3);
            }
            .footer { text-align: center; padding: 30px 20px; background: #F8F6FF; color: #666; font-size: 13px; border-top: 2px solid #E6DEFF; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✨ OnePageBook</h1>
            </div>
            <div class="content">
              <p>Olá ${userName}!</p>
              
              <p>Notamos que você está aproveitando o OnePageBook há 3 dias. Que tal levar sua experiência ao próximo nível?</p>
              
              <div class="benefits">
                <h3>Com o OnePageBook Premium você tem:</h3>
                <div class="benefit-item">🎯 Resumos ilimitados todo mês</div>
                <div class="benefit-item">🎧 Áudio gerado para todos os resumos</div>
                <div class="benefit-item">📊 Estatísticas avançadas e conquistas exclusivas</div>
                <div class="benefit-item">⚡ Acesso prioritário a novos recursos</div>
              </div>
              
              <p><strong>Transforme sua jornada de leitura agora!</strong></p>
              
              <center>
                <a href="${userLanguage === 'pt' ? specialCheckoutUrlPt : checkoutUrl}" class="cta-button">Quero ser Premium</a>
              </center>
            </div>
            <div class="footer">
              <p>Abraços,<br>Equipe OnePageBook</p>
            </div>
          </div>
        </body>
        </html>
      `,
    },
    day_5: {
      subject: "🎁 Oferta especial Premium só para você!",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { 
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; 
              line-height: 1.6; 
              color: #2B1342;
              background: linear-gradient(135deg, #F8F6FF 0%, #F0ECFF 100%);
              margin: 0;
              padding: 20px;
            }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(124, 92, 255, 0.1); }
            .header { text-align: center; padding: 30px 20px; background: linear-gradient(135deg, #F8F6FF 0%, #E6DEFF 100%); }
            .header h1 { color: #7C5CFF; font-size: 32px; font-weight: bold; margin: 0; }
            .content { background: #ffffff; padding: 30px; }
            .content p { color: #2B1342; margin: 16px 0; }
            .benefits { margin: 25px 0; background: #F8F6FF; padding: 20px; border-radius: 12px; border-left: 4px solid #7C5CFF; }
            .benefits h3 { color: #7C5CFF; margin-top: 0; }
            .benefit-item { padding: 10px 0; color: #2B1342; }
            .cta-button { 
              display: inline-block; 
              padding: 16px 45px; 
              background: linear-gradient(135deg, #7C5CFF 0%, #6643FF 100%); 
              color: white; 
              text-decoration: none; 
              border-radius: 12px; 
              margin: 20px 0;
              font-weight: bold;
              font-size: 16px;
              box-shadow: 0 4px 15px rgba(124, 92, 255, 0.3);
            }
            .footer { text-align: center; padding: 30px 20px; background: #F8F6FF; color: #666; font-size: 13px; border-top: 2px solid #E6DEFF; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎁 OnePageBook</h1>
            </div>
            <div class="content">
              <p>Olá ${userName}!</p>
              
              <p>Você já explorou bastante o OnePageBook nos últimos 5 dias. Temos uma oportunidade especial para você!</p>
              
              <div class="benefits">
                <h3>💎 Por que nossos usuários Premium amam:</h3>
                <div class="benefit-item">- Resumos ilimitados (vs 10 por mês no gratuito)</div>
                <div class="benefit-item">- Áudio profissional para todos os livros</div>
                <div class="benefit-item">- Zero limites, máximo aprendizado</div>
              </div>
              
              <p><strong>Milhares de leitores já estão acelerando seu conhecimento. Você vem com a gente?</strong></p>
              
              <center>
                <a href="${userLanguage === 'pt' ? specialCheckoutUrlPt : checkoutUrl}" class="cta-button">Sim, quero Premium!</a>
              </center>
            </div>
            <div class="footer">
              <p>Leia mais, aprenda mais!<br>Equipe OnePageBook</p>
            </div>
          </div>
        </body>
        </html>
      `,
    },
    day_7: {
      subject: "⏰ Última chance: Desbloqueie todo o OnePageBook + 40% OFF",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { 
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; 
              line-height: 1.6; 
              color: #2B1342;
              background: linear-gradient(135deg, #F8F6FF 0%, #F0ECFF 100%);
              margin: 0;
              padding: 20px;
            }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(124, 92, 255, 0.1); }
            .header { text-align: center; padding: 30px 20px; background: linear-gradient(135deg, #F8F6FF 0%, #E6DEFF 100%); }
            .header h1 { color: #7C5CFF; font-size: 32px; font-weight: bold; margin: 0; }
            .content { background: #ffffff; padding: 30px; }
            .content p { color: #2B1342; margin: 16px 0; }
            .discount-box { 
              background: linear-gradient(135deg, #7C5CFF 0%, #6643FF 100%);
              color: white;
              padding: 30px; 
              border-radius: 16px; 
              margin: 30px 0;
              text-align: center;
              box-shadow: 0 8px 25px rgba(124, 92, 255, 0.3);
            }
            .discount-box h2 { margin: 0; font-size: 56px; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); }
            .discount-box p { margin: 10px 0 0 0; font-size: 22px; font-weight: 500; }
            .discount-validity { font-size: 14px; margin-top: 20px; color: #F0ECFF; font-weight: 600; }
            .benefits { margin: 25px 0; background: #F8F6FF; padding: 20px; border-radius: 12px; border-left: 4px solid #7C5CFF; }
            .benefit-item { padding: 10px 0; color: #2B1342; }
            .cta-button { 
              display: inline-block; 
              padding: 16px 45px; 
              background: linear-gradient(135deg, #7C5CFF 0%, #6643FF 100%); 
              color: #ffffff !important; 
              text-decoration: none; 
              border-radius: 12px; 
              margin: 20px 0;
              font-weight: bold;
              font-size: 18px;
              box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3);
            }
            .urgency { 
              color: #dc2626; 
              font-weight: bold; 
              padding: 15px;
              background: #fef2f2;
              border-radius: 8px;
              border-left: 4px solid #dc2626;
              margin: 25px 0;
            }
            .footer { text-align: center; padding: 30px 20px; background: #F8F6FF; color: #666; font-size: 13px; border-top: 2px solid #E6DEFF; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⏰ OnePageBook</h1>
            </div>
            <div class="content">
              <p>Olá ${userName}!</p>
              
              <p>Uma semana se passou e você continua conosco - isso é incrível! 🎉</p>
              
              <p>Mas percebemos que você ainda está limitado a 10 resumos por mês. Não deixe seus objetivos de leitura esperarem!</p>
              
              <div class="discount-box">
                <h2>40% OFF</h2>
                <p>no primeiro mês Premium!</p>
                <p class="discount-validity">⏰ Válido por apenas 7 dias</p>
              </div>
              
              <div class="benefits">
                <div class="benefit-item">🚀 Usuários Premium leem 3x mais livros</div>
                <div class="benefit-item">📚 Acesso ilimitado ao catálogo completo</div>
                <div class="benefit-item">🎯 Conquistas e gamificação exclusivas</div>
              </div>
              
              <p class="urgency">Esta é sua última chance de receber este lembrete. O conhecimento não espera!</p>
              
              <center>
                <a href="${checkoutUrl}" class="cta-button" style="display: inline-block; padding: 16px 45px; background: linear-gradient(135deg, #7C5CFF 0%, #6643FF 100%); color: #ffffff !important; text-decoration: none; border-radius: 12px; margin: 20px 0; font-weight: bold; font-size: 18px; box-shadow: 0 4px 15px rgba(124, 92, 255, 0.3);">Quero Premium AGORA</a>
              </center>
              
              <p style="text-align: center; font-size: 13px; color: #666; margin-top: 15px;">
                Desconto aplicado automaticamente no checkout
              </p>
            </div>
            <div class="footer">
              <p>Sucesso na sua jornada!<br>Equipe OnePageBook</p>
            </div>
          </div>
        </body>
        </html>
      `,
    },
  };

  return templates[dayType];
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("🚀 Starting premium conversion email job...");
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const now = new Date();
    const emailsSent = {
      day_3: 0,
      day_5: 0,
      day_7: 0,
      errors: 0,
    };

    // Calculate account age in days
    const getAccountAgeInDays = (createdAt: string): number => {
      const created = new Date(createdAt);
      const diffMs = now.getTime() - created.getTime();
      return Math.floor(diffMs / (1000 * 60 * 60 * 24));
    };

    // Get all free users who haven't received emails yet
    const { data: freeUsers, error: usersError } = await supabase
      .from("profiles")
      .select(`
        id,
        full_name,
        created_at,
        preferred_language,
        user_subscriptions!inner(
          status,
          subscription_plans!inner(type)
        )
      `)
      .eq("user_subscriptions.status", "active")
      .eq("user_subscriptions.subscription_plans.type", "free");

    if (usersError) {
      console.error("Error fetching users:", usersError);
      throw usersError;
    }

    console.log(`Found ${freeUsers?.length || 0} free users`);

    for (const user of freeUsers || []) {
      try {
        const accountAge = getAccountAgeInDays(user.created_at);
        let emailType: string | null = null;

        // Check which email to send based on account age
        // Use >= to catch users even if cron timing doesn't align perfectly
        if (accountAge >= 7) {
          emailType = "day_7";
        } else if (accountAge >= 5) {
          emailType = "day_5";
        } else if (accountAge >= 3) {
          emailType = "day_3";
        }

        if (!emailType) continue;

        // Check if email was already sent
        const { data: existingEmail } = await supabase
          .from("premium_conversion_emails")
          .select("id")
          .eq("user_id", user.id)
          .eq("email_type", emailType)
          .single();

        if (existingEmail) {
          console.log(`Email ${emailType} already sent to user ${user.id}`);
          continue;
        }

        // Get user email from auth.users
        const { data: authUser } = await supabase.auth.admin.getUserById(user.id);
        if (!authUser?.user?.email) {
          console.log(`No email found for user ${user.id}`);
          continue;
        }

        const userName = user.full_name || "Leitor";
        const userLanguage = user.preferred_language || "pt";
        const template = getEmailTemplate(emailType, userName, userLanguage);

        // Send email via Resend
        const { error: emailError } = await resend.emails.send({
          from: "OnePageBook <offers@send.onepagebook.ai>",
          to: [authUser.user.email],
          subject: template.subject,
          html: template.html,
        });

        if (emailError) {
          console.error(`Error sending email to ${authUser.user.email}:`, emailError);
          emailsSent.errors++;
          continue;
        }

        // Record email sent
        await supabase.from("premium_conversion_emails").insert({
          user_id: user.id,
          email_type: emailType,
        });

        emailsSent[emailType as keyof typeof emailsSent]++;
        console.log(`✅ Sent ${emailType} email to ${authUser.user.email}`);
      } catch (error) {
        console.error(`Error processing user ${user.id}:`, error);
        emailsSent.errors++;
      }
    }

    console.log("📊 Email job completed:", emailsSent);

    return new Response(
      JSON.stringify({
        success: true,
        emailsSent,
        timestamp: now.toISOString(),
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("❌ Error in premium conversion emails:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
