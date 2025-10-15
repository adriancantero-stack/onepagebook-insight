import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Stripe checkout URLs by language/currency
const STRIPE_CHECKOUT_URLS: Record<string, string> = {
  pt: "https://buy.stripe.com/fZu28r50YbE76fuaKv", // BRL
  en: "https://buy.stripe.com/7sY7sL2SQcIb6fu2dZ", // USD
  es: "https://buy.stripe.com/7sY7sL2SQcIb6fu2dZ", // USD
};
const PROMO_CODE = "WELCOME40";

const getTestEmailHTML = (userName: string, checkoutUrl: string, promoCode: string): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f5f5f5; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; padding: 20px; background-color: #ffffff; }
        .test-banner { background-color: #fbbf24; padding: 10px; text-align: center; margin-bottom: 20px; }
        .test-banner-text { color: #000; font-size: 14px; font-weight: bold; margin: 0; }
        .header { text-align: center; padding: 20px 0; }
        .header h1 { color: #333; font-size: 32px; font-weight: bold; margin: 20px 0; }
        .content { padding: 0 20px; }
        .text { color: #333; font-size: 16px; line-height: 24px; margin: 16px 0; }
        .discount-box { 
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border-radius: 12px;
          padding: 25px;
          text-align: center;
          margin: 25px 0;
        }
        .discount-title { color: #ffffff; font-size: 48px; font-weight: bold; margin: 0; }
        .discount-subtitle { color: #ffffff; font-size: 20px; margin: 10px 0; }
        .discount-validity { color: #ffffff; font-size: 14px; margin: 15px 0 0 0; }
        .benefits { margin: 20px 0; }
        .benefit-item { color: #333; font-size: 16px; line-height: 32px; margin: 0; }
        .urgency { color: #dc2626; font-size: 16px; font-weight: bold; line-height: 24px; margin: 20px 0; }
        .button-container { text-align: center; margin: 30px 0; }
        .cta-button { 
          display: inline-block;
          background-color: #dc2626;
          border-radius: 8px;
          color: #ffffff;
          font-size: 18px;
          font-weight: bold;
          text-decoration: none;
          padding: 15px 40px;
        }
        .small-text { color: #666; font-size: 12px; text-align: center; margin: 15px 0; }
        .code-info { 
          background-color: #f9fafb;
          padding: 15px;
          border-radius: 8px;
          font-size: 12px;
          color: #666;
          margin: 20px 0;
          border: 1px solid #e5e7eb;
        }
        .footer { 
          color: #666;
          font-size: 14px;
          text-align: center;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #eee;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="test-banner">
          <p class="test-banner-text">🧪 EMAIL DE TESTE</p>
        </div>
        
        <div class="header">
          <h1>⏰ OnePageBook</h1>
        </div>
        
        <div class="content">
          <p class="text">Olá ${userName}!</p>
          
          <p class="text">
            Uma semana se passou e você continua conosco - isso é incrível! 🎉
          </p>
          
          <p class="text">
            Mas percebemos que você ainda está limitado a 10 resumos por mês. Não deixe seus objetivos de leitura esperarem!
          </p>
          
          <div class="discount-box">
            <h2 class="discount-title">40% OFF</h2>
            <p class="discount-subtitle">no primeiro mês Premium!</p>
            <p class="discount-validity">⏰ Válido por apenas 7 dias</p>
          </div>
          
          <div class="benefits">
            <p class="benefit-item">🚀 Usuários Premium leem 3x mais livros</p>
            <p class="benefit-item">📚 Acesso ilimitado ao catálogo completo</p>
            <p class="benefit-item">🎯 Conquistas e gamificação exclusivas</p>
          </div>
          
          <p class="urgency">
            Esta é sua última chance de receber este lembrete. O conhecimento não espera!
          </p>
          
          <div class="button-container">
            <a href="${checkoutUrl}?prefilled_promo_code=${promoCode}" class="cta-button">
              Quero Premium AGORA
            </a>
          </div>
          
          <p class="small-text">
            Desconto aplicado automaticamente no checkout
          </p>
          
          <div class="code-info">
            <strong>Cupom:</strong> ${promoCode}<br />
            <strong>Link:</strong> ${checkoutUrl}
          </div>
          
          <p class="footer">
            Sucesso na sua jornada!<br />
            <strong>Equipe OnePageBook</strong>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, language = "pt", userName = "Leitor" } = await req.json();

    if (!email) {
      throw new Error("Email is required");
    }

    console.log(`🧪 Sending test email to ${email} in ${language}`);

    const checkoutUrl = STRIPE_CHECKOUT_URLS[language] || STRIPE_CHECKOUT_URLS.pt;
    const html = getTestEmailHTML(userName, checkoutUrl, PROMO_CODE);

    // Send email via Resend
    const { error: emailError, data } = await resend.emails.send({
      from: "OnePageBook <onboarding@resend.dev>",
      to: [email],
      subject: "🧪 TESTE - Última chance: 40% OFF no OnePageBook Premium",
      html,
    });

    if (emailError) {
      console.error("Error sending test email:", emailError);
      throw emailError;
    }

    console.log(`✅ Test email sent successfully to ${email}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Test email sent successfully",
        emailId: data?.id,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("❌ Error in test email function:", error);
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
