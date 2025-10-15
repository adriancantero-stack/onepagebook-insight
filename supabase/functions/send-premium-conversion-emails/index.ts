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
  pt: "https://buy.stripe.com/fZu28r50YbE76fuaKv", // BRL
  en: "https://buy.stripe.com/7sY7sL2SQcIb6fu2dZ", // USD
  es: "https://buy.stripe.com/7sY7sL2SQcIb6fu2dZ", // USD
};
const PROMO_CODE = "WELCOME40";

// Email templates in Portuguese
const getEmailTemplate = (dayType: string, userName: string, userLanguage: string = "pt"): EmailTemplate => {
  const checkoutUrl = STRIPE_CHECKOUT_URLS[userLanguage] || STRIPE_CHECKOUT_URLS.pt;
  const templates: Record<string, EmailTemplate> = {
    day_3: {
      subject: "✨ Descubra todo o potencial do OnePageBook Premium",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; padding: 20px 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 10px; }
            .benefits { margin: 20px 0; }
            .benefit-item { padding: 10px 0; }
            .cta-button { 
              display: inline-block; 
              padding: 15px 30px; 
              background: #10b981; 
              color: white; 
              text-decoration: none; 
              border-radius: 8px; 
              margin: 20px 0;
              font-weight: bold;
            }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
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
                <a href="${checkoutUrl}" class="cta-button">Quero ser Premium</a>
              </center>
            </div>
            <div class="footer">
              <p>Abraços,<br>Equipe OnePageBook</p>
              <p>Para parar de receber esses emails, <a href="#">clique aqui</a></p>
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
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; padding: 20px 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 10px; }
            .highlight { background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .benefits { margin: 20px 0; }
            .benefit-item { padding: 10px 0; }
            .cta-button { 
              display: inline-block; 
              padding: 15px 30px; 
              background: #10b981; 
              color: white; 
              text-decoration: none; 
              border-radius: 8px; 
              margin: 20px 0;
              font-weight: bold;
            }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
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
                <a href="${checkoutUrl}" class="cta-button">Sim, quero Premium!</a>
              </center>
            </div>
            <div class="footer">
              <p>Leia mais, aprenda mais!<br>Equipe OnePageBook</p>
              <p>Para parar de receber esses emails, <a href="#">clique aqui</a></p>
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
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; padding: 20px 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 10px; }
            .discount-box { 
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              color: white;
              padding: 25px; 
              border-radius: 12px; 
              margin: 25px 0;
              text-align: center;
            }
            .discount-box h2 { margin: 0; font-size: 32px; }
            .discount-box p { margin: 10px 0 0 0; font-size: 18px; }
            .benefits { margin: 20px 0; }
            .benefit-item { padding: 10px 0; }
            .cta-button { 
              display: inline-block; 
              padding: 15px 40px; 
              background: #dc2626; 
              color: white; 
              text-decoration: none; 
              border-radius: 8px; 
              margin: 20px 0;
              font-weight: bold;
              font-size: 18px;
            }
            .urgency { color: #dc2626; font-weight: bold; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
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
                <p style="font-size: 14px; margin-top: 15px;">⏰ Válido por apenas 7 dias</p>
              </div>
              
              <div class="benefits">
                <div class="benefit-item">🚀 Usuários Premium leem 3x mais livros</div>
                <div class="benefit-item">📚 Acesso ilimitado ao catálogo completo</div>
                <div class="benefit-item">🎯 Conquistas e gamificação exclusivas</div>
              </div>
              
              <p class="urgency">Esta é sua última chance de receber este lembrete. O conhecimento não espera!</p>
              
              <center>
                <a href="${checkoutUrl}?prefilled_promo_code=${PROMO_CODE}" class="cta-button">Quero Premium AGORA</a>
              </center>
              
              <p style="text-align: center; font-size: 12px; color: #666; margin-top: 15px;">
                Desconto aplicado automaticamente no checkout
              </p>
            </div>
            <div class="footer">
              <p>Sucesso na sua jornada!<br>Equipe OnePageBook</p>
              <p>Para parar de receber esses emails, <a href="#">clique aqui</a></p>
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

    // Calculate target dates
    const threeDaysAgo = new Date(now);
    threeDaysAgo.setDate(now.getDate() - 3);
    threeDaysAgo.setHours(0, 0, 0, 0);

    const fiveDaysAgo = new Date(now);
    fiveDaysAgo.setDate(now.getDate() - 5);
    fiveDaysAgo.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

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
        const userCreatedAt = new Date(user.created_at);
        let emailType: string | null = null;

        // Check which email to send based on account age
        if (
          userCreatedAt.getTime() >= sevenDaysAgo.getTime() &&
          userCreatedAt.getTime() < sevenDaysAgo.getTime() + 86400000
        ) {
          emailType = "day_7";
        } else if (
          userCreatedAt.getTime() >= fiveDaysAgo.getTime() &&
          userCreatedAt.getTime() < fiveDaysAgo.getTime() + 86400000
        ) {
          emailType = "day_5";
        } else if (
          userCreatedAt.getTime() >= threeDaysAgo.getTime() &&
          userCreatedAt.getTime() < threeDaysAgo.getTime() + 86400000
        ) {
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
          from: "OnePageBook <onboarding@resend.dev>",
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
