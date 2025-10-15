import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Stripe checkout URLs by language/currency
const STRIPE_CHECKOUT_URLS: Record<string, string> = {
  pt: "https://buy.stripe.com/fZu28r50YbE76fuaKv3oA00?prefilled_promo_code=WELCOME40", // BRL
  en: "https://buy.stripe.com/7sY7sL2SQcIb6fu2dZ3oA02?prefilled_promo_code=WELCOME40", // USD
  es: "https://buy.stripe.com/7sY7sL2SQcIb6fu2dZ3oA02?prefilled_promo_code=WELCOME40", // USD
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
        body { 
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; 
          line-height: 1.6; 
          color: #2B1342; 
          background: linear-gradient(135deg, #F8F6FF 0%, #F0ECFF 100%);
          margin: 0; 
          padding: 0; 
        }
        .container { 
          max-width: 600px; 
          margin: 20px auto; 
          padding: 0; 
          background-color: #ffffff; 
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(124, 92, 255, 0.1);
        }
        .test-banner { 
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); 
          padding: 12px; 
          text-align: center; 
        }
        .test-banner-text { 
          color: #000; 
          font-size: 14px; 
          font-weight: bold; 
          margin: 0; 
        }
        .header { 
          text-align: center; 
          padding: 30px 20px 20px;
          background: linear-gradient(135deg, #F8F6FF 0%, #E6DEFF 100%);
        }
        .header h1 { 
          color: #7C5CFF; 
          font-size: 32px; 
          font-weight: bold; 
          margin: 0; 
        }
        .content { 
          padding: 30px 30px; 
        }
        .text { 
          color: #2B1342; 
          font-size: 16px; 
          line-height: 26px; 
          margin: 16px 0; 
        }
        .discount-box { 
          background: linear-gradient(135deg, #7C5CFF 0%, #6643FF 100%);
          border-radius: 16px;
          padding: 30px;
          text-align: center;
          margin: 30px 0;
          box-shadow: 0 8px 25px rgba(124, 92, 255, 0.3);
        }
        .discount-title { 
          color: #ffffff; 
          font-size: 56px; 
          font-weight: bold; 
          margin: 0;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }
        .discount-subtitle { 
          color: #ffffff; 
          font-size: 22px; 
          margin: 10px 0;
          font-weight: 500;
        }
        .discount-validity { 
          color: #F0ECFF; 
          font-size: 14px; 
          margin: 20px 0 0 0;
          font-weight: 600;
        }
        .benefits { 
          margin: 25px 0; 
          background: #F8F6FF;
          padding: 20px;
          border-radius: 12px;
          border-left: 4px solid #7C5CFF;
        }
        .benefit-item { 
          color: #2B1342; 
          font-size: 16px; 
          line-height: 32px; 
          margin: 8px 0; 
        }
        .urgency { 
          color: #dc2626; 
          font-size: 16px; 
          font-weight: bold; 
          line-height: 24px; 
          margin: 25px 0;
          padding: 15px;
          background: #fef2f2;
          border-radius: 8px;
          border-left: 4px solid #dc2626;
        }
        .button-container { 
          text-align: center; 
          margin: 30px 0; 
        }
        .cta-button { 
          display: inline-block;
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          border-radius: 12px;
          color: #ffffff;
          font-size: 18px;
          font-weight: bold;
          text-decoration: none;
          padding: 16px 45px;
          box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3);
          transition: all 0.3s ease;
        }
        .small-text { 
          color: #666; 
          font-size: 13px; 
          text-align: center; 
          margin: 15px 0; 
        }
        .code-info { 
          background: linear-gradient(135deg, #F8F6FF 0%, #E6DEFF 100%);
          padding: 20px;
          border-radius: 12px;
          font-size: 13px;
          color: #2B1342;
          margin: 25px 0;
          border: 2px solid #D1C1FF;
        }
        .footer { 
          color: #666;
          font-size: 14px;
          text-align: center;
          margin-top: 40px;
          padding: 30px 20px;
          background: #F8F6FF;
          border-top: 2px solid #E6DEFF;
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
            <a href="${checkoutUrl}" class="cta-button">
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
