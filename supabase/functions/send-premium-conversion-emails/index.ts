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
  // Special checkout URL for English and Spanish day 3 and day 5 emails
  const specialCheckoutUrlEnEs = "https://buy.stripe.com/7sY7sL2SQcIb6fu2dZ3oA02";
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
                <a href="${userLanguage === 'pt' ? specialCheckoutUrlPt : specialCheckoutUrlEnEs}" class="cta-button">Quero ser Premium</a>
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
                <a href="${userLanguage === 'pt' ? specialCheckoutUrlPt : specialCheckoutUrlEnEs}" class="cta-button">Sim, quero Premium!</a>
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
    day_10: {
      subject: "🚨 ÚLTIMA CHANCE: 40% OFF expira hoje!",
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
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 30px rgba(220, 38, 38, 0.2); border: 3px solid #dc2626; }
            .header { text-align: center; padding: 30px 20px; background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); }
            .header h1 { color: #ffffff; font-size: 36px; font-weight: bold; margin: 0; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3); }
            .header p { color: #ffffff; font-size: 18px; margin: 10px 0 0 0; font-weight: 600; }
            .content { background: #ffffff; padding: 30px; }
            .content p { color: #2B1342; margin: 16px 0; font-size: 16px; }
            .urgency-banner {
              background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
              color: white;
              padding: 25px;
              border-radius: 12px;
              text-align: center;
              margin: 30px 0;
              box-shadow: 0 8px 25px rgba(220, 38, 38, 0.4);
              animation: pulse 2s infinite;
            }
            @keyframes pulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.02); }
            }
            .urgency-banner h2 { margin: 0; font-size: 48px; font-weight: bold; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3); }
            .urgency-banner p { margin: 10px 0 0 0; font-size: 20px; font-weight: 600; }
            .timer { font-size: 16px; margin-top: 15px; color: #fef2f2; font-weight: 600; }
            .benefits { margin: 25px 0; background: #fef2f2; padding: 25px; border-radius: 12px; border-left: 4px solid #dc2626; }
            .benefits h3 { color: #dc2626; margin-top: 0; font-size: 20px; }
            .benefit-item { padding: 12px 0; color: #2B1342; font-size: 16px; font-weight: 500; }
            .cta-button { 
              display: inline-block; 
              padding: 20px 50px; 
              background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); 
              color: #ffffff !important; 
              text-decoration: none; 
              border-radius: 12px; 
              margin: 25px 0;
              font-weight: bold;
              font-size: 20px;
              box-shadow: 0 6px 20px rgba(220, 38, 38, 0.4);
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .final-warning { 
              background: #fef2f2;
              border: 2px solid #dc2626;
              border-radius: 12px;
              padding: 20px;
              margin: 25px 0;
              text-align: center;
            }
            .final-warning p {
              color: #dc2626;
              font-weight: bold;
              font-size: 18px;
              margin: 0;
            }
            .footer { text-align: center; padding: 30px 20px; background: #F8F6FF; color: #666; font-size: 13px; border-top: 2px solid #E6DEFF; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚨 ÚLTIMA CHANCE</h1>
              <p>40% OFF expira HOJE</p>
            </div>
            <div class="content">
              <p>Olá ${userName}!</p>
              
              <p style="font-size: 18px; font-weight: 600;">Esta é sua ÚLTIMA oportunidade! O desconto de 40% no primeiro mês Premium expira em algumas horas.</p>
              
              <div class="urgency-banner">
                <h2>40% OFF</h2>
                <p>NO PRIMEIRO MÊS</p>
                <p class="timer">⏰ EXPIRA HOJE ÀS 23:59</p>
              </div>
              
              <div class="benefits">
                <h3>🔥 O que você está perdendo AGORA:</h3>
                <div class="benefit-item">✅ Resumos ILIMITADOS (vs apenas 10 por mês)</div>
                <div class="benefit-item">✅ Áudio profissional para TODOS os livros</div>
                <div class="benefit-item">✅ Conquistas e gamificação exclusivas</div>
                <div class="benefit-item">✅ Acesso prioritário a novos recursos</div>
              </div>
              
              <p style="font-size: 17px; font-weight: 600; text-align: center;">Milhares de usuários já transformaram sua rotina de leitura. Não fique de fora!</p>
              
              <center>
                <a href="${userLanguage === 'pt' ? 'https://buy.stripe.com/fZu28r50YbE76fuaKv3oA00?prefilled_promo_code=WELCOME40' : 'https://buy.stripe.com/7sY7sL2SQcIb6fu2dZ3oA02?prefilled_promo_code=WELCOME40'}" class="cta-button" style="display: inline-block; padding: 20px 50px; background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: #ffffff !important; text-decoration: none; border-radius: 12px; margin: 25px 0; font-weight: bold; font-size: 20px; box-shadow: 0 6px 20px rgba(220, 38, 38, 0.4); text-transform: uppercase; letter-spacing: 0.5px;">GARANTIR MEU DESCONTO</a>
              </center>
              
              <div class="final-warning">
                <p>⚠️ Este é o último lembrete que você receberá.</p>
                <p>Após hoje, o desconto expira permanentemente.</p>
              </div>
              
              <p style="text-align: center; font-size: 13px; color: #666; margin-top: 20px;">
                Código WELCOME40 aplicado automaticamente
              </p>
            </div>
            <div class="footer">
              <p>Não perca esta oportunidade!<br>Equipe OnePageBook</p>
            </div>
          </div>
        </body>
        </html>
      `,
    },
  };

  // Add English and Spanish translations
  if (userLanguage === 'en') {
    return {
      day_3: {
        subject: "✨ Discover the full potential of OnePageBook Premium",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #2B1342; background: linear-gradient(135deg, #F8F6FF 0%, #F0ECFF 100%); margin: 0; padding: 20px; }
              .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(124, 92, 255, 0.1); }
              .header { text-align: center; padding: 30px 20px; background: linear-gradient(135deg, #F8F6FF 0%, #E6DEFF 100%); }
              .header h1 { color: #7C5CFF; font-size: 32px; font-weight: bold; margin: 0; }
              .content { background: #ffffff; padding: 30px; }
              .content p { color: #2B1342; margin: 16px 0; }
              .benefits { margin: 25px 0; background: #F8F6FF; padding: 20px; border-radius: 12px; border-left: 4px solid #7C5CFF; }
              .benefits h3 { color: #7C5CFF; margin-top: 0; }
              .benefit-item { padding: 10px 0; color: #2B1342; }
              .cta-button { display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #7C5CFF 0%, #6643FF 100%); color: white; text-decoration: none; border-radius: 12px; margin: 20px 0; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(124, 92, 255, 0.3); }
              .footer { text-align: center; padding: 30px 20px; background: #F8F6FF; color: #666; font-size: 13px; border-top: 2px solid #E6DEFF; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✨ OnePageBook</h1>
              </div>
              <div class="content">
                <p>Hello ${userName}!</p>
                <p>We noticed you've been enjoying OnePageBook for 3 days. How about taking your experience to the next level?</p>
                <div class="benefits">
                  <h3>With OnePageBook Premium you get:</h3>
                  <div class="benefit-item">🎯 Unlimited summaries every month</div>
                  <div class="benefit-item">🎧 Audio generated for all summaries</div>
                  <div class="benefit-item">📊 Advanced statistics and exclusive achievements</div>
                  <div class="benefit-item">⚡ Priority access to new features</div>
                </div>
                <p><strong>Transform your reading journey now!</strong></p>
                <center>
                  <a href="${specialCheckoutUrlEnEs}" class="cta-button">Go Premium</a>
                </center>
              </div>
              <div class="footer">
                <p>Best regards,<br>OnePageBook Team</p>
              </div>
            </div>
          </body>
          </html>
        `,
      },
      day_5: {
        subject: "🎁 Special Premium offer just for you!",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #2B1342; background: linear-gradient(135deg, #F8F6FF 0%, #F0ECFF 100%); margin: 0; padding: 20px; }
              .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(124, 92, 255, 0.1); }
              .header { text-align: center; padding: 30px 20px; background: linear-gradient(135deg, #F8F6FF 0%, #E6DEFF 100%); }
              .header h1 { color: #7C5CFF; font-size: 32px; font-weight: bold; margin: 0; }
              .content { background: #ffffff; padding: 30px; }
              .content p { color: #2B1342; margin: 16px 0; }
              .benefits { margin: 25px 0; background: #F8F6FF; padding: 20px; border-radius: 12px; border-left: 4px solid #7C5CFF; }
              .benefits h3 { color: #7C5CFF; margin-top: 0; }
              .benefit-item { padding: 10px 0; color: #2B1342; }
              .cta-button { display: inline-block; padding: 16px 45px; background: linear-gradient(135deg, #7C5CFF 0%, #6643FF 100%); color: white; text-decoration: none; border-radius: 12px; margin: 20px 0; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(124, 92, 255, 0.3); }
              .footer { text-align: center; padding: 30px 20px; background: #F8F6FF; color: #666; font-size: 13px; border-top: 2px solid #E6DEFF; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎁 OnePageBook</h1>
              </div>
              <div class="content">
                <p>Hello ${userName}!</p>
                <p>You've been exploring OnePageBook for the last 5 days. We have a special opportunity for you!</p>
                <div class="benefits">
                  <h3>💎 Why our Premium users love it:</h3>
                  <div class="benefit-item">- Unlimited summaries (vs 10 per month on free)</div>
                  <div class="benefit-item">- Professional audio for all books</div>
                  <div class="benefit-item">- Zero limits, maximum learning</div>
                </div>
                <p><strong>Thousands of readers are already accelerating their knowledge. Join us?</strong></p>
                <center>
                  <a href="${specialCheckoutUrlEnEs}" class="cta-button">Yes, I want Premium!</a>
                </center>
              </div>
              <div class="footer">
                <p>Read more, learn more!<br>OnePageBook Team</p>
              </div>
            </div>
          </body>
          </html>
        `,
      },
      day_7: {
        subject: "⏰ Last chance: Unlock all of OnePageBook + 40% OFF",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #2B1342; background: linear-gradient(135deg, #F8F6FF 0%, #F0ECFF 100%); margin: 0; padding: 20px; }
              .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(124, 92, 255, 0.1); }
              .header { text-align: center; padding: 30px 20px; background: linear-gradient(135deg, #F8F6FF 0%, #E6DEFF 100%); }
              .header h1 { color: #7C5CFF; font-size: 32px; font-weight: bold; margin: 0; }
              .content { background: #ffffff; padding: 30px; }
              .content p { color: #2B1342; margin: 16px 0; }
              .discount-box { background: linear-gradient(135deg, #7C5CFF 0%, #6643FF 100%); color: white; padding: 30px; border-radius: 16px; margin: 30px 0; text-align: center; box-shadow: 0 8px 25px rgba(124, 92, 255, 0.3); }
              .discount-box h2 { margin: 0; font-size: 56px; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); }
              .discount-box p { margin: 10px 0 0 0; font-size: 22px; font-weight: 500; }
              .discount-validity { font-size: 14px; margin-top: 20px; color: #F0ECFF; font-weight: 600; }
              .benefits { margin: 25px 0; background: #F8F6FF; padding: 20px; border-radius: 12px; border-left: 4px solid #7C5CFF; }
              .benefit-item { padding: 10px 0; color: #2B1342; }
              .cta-button { display: inline-block; padding: 16px 45px; background: linear-gradient(135deg, #7C5CFF 0%, #6643FF 100%); color: #ffffff !important; text-decoration: none; border-radius: 12px; margin: 20px 0; font-weight: bold; font-size: 18px; box-shadow: 0 4px 15px rgba(124, 92, 255, 0.3); }
              .urgency { color: #dc2626; font-weight: bold; padding: 15px; background: #fef2f2; border-radius: 8px; border-left: 4px solid #dc2626; margin: 25px 0; }
              .footer { text-align: center; padding: 30px 20px; background: #F8F6FF; color: #666; font-size: 13px; border-top: 2px solid #E6DEFF; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>⏰ OnePageBook</h1>
              </div>
              <div class="content">
                <p>Hello ${userName}!</p>
                <p>A week has passed and you're still with us - that's amazing! 🎉</p>
                <p>But we noticed you're still limited to 10 summaries per month. Don't let your reading goals wait!</p>
                <div class="discount-box">
                  <h2>40% OFF</h2>
                  <p>on your first Premium month!</p>
                  <p class="discount-validity">⏰ Valid for only 7 days</p>
                </div>
                <div class="benefits">
                  <div class="benefit-item">🚀 Premium users read 3x more books</div>
                  <div class="benefit-item">📚 Unlimited access to the complete catalog</div>
                  <div class="benefit-item">🎯 Exclusive achievements and gamification</div>
                </div>
                <p class="urgency">This is your last chance to receive this reminder. Knowledge doesn't wait!</p>
                <center>
                  <a href="${checkoutUrl}" class="cta-button" style="display: inline-block; padding: 16px 45px; background: linear-gradient(135deg, #7C5CFF 0%, #6643FF 100%); color: #ffffff !important; text-decoration: none; border-radius: 12px; margin: 20px 0; font-weight: bold; font-size: 18px; box-shadow: 0 4px 15px rgba(124, 92, 255, 0.3);">I Want Premium NOW</a>
                </center>
                <p style="text-align: center; font-size: 13px; color: #666; margin-top: 15px;">Discount automatically applied at checkout</p>
              </div>
              <div class="footer">
                <p>Success on your journey!<br>OnePageBook Team</p>
              </div>
            </div>
          </body>
          </html>
        `,
      },
      day_10: {
        subject: "🚨 LAST CHANCE: 40% OFF expires today!",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #2B1342; background: linear-gradient(135deg, #F8F6FF 0%, #F0ECFF 100%); margin: 0; padding: 20px; }
              .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 30px rgba(220, 38, 38, 0.2); border: 3px solid #dc2626; }
              .header { text-align: center; padding: 30px 20px; background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); }
              .header h1 { color: #ffffff; font-size: 36px; font-weight: bold; margin: 0; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3); }
              .header p { color: #ffffff; font-size: 18px; margin: 10px 0 0 0; font-weight: 600; }
              .content { background: #ffffff; padding: 30px; }
              .content p { color: #2B1342; margin: 16px 0; font-size: 16px; }
              .urgency-banner { background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; padding: 25px; border-radius: 12px; text-align: center; margin: 30px 0; box-shadow: 0 8px 25px rgba(220, 38, 38, 0.4); animation: pulse 2s infinite; }
              @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } }
              .urgency-banner h2 { margin: 0; font-size: 48px; font-weight: bold; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3); }
              .urgency-banner p { margin: 10px 0 0 0; font-size: 20px; font-weight: 600; }
              .timer { font-size: 16px; margin-top: 15px; color: #fef2f2; font-weight: 600; }
              .benefits { margin: 25px 0; background: #fef2f2; padding: 25px; border-radius: 12px; border-left: 4px solid #dc2626; }
              .benefits h3 { color: #dc2626; margin-top: 0; font-size: 20px; }
              .benefit-item { padding: 12px 0; color: #2B1342; font-size: 16px; font-weight: 500; }
              .cta-button { display: inline-block; padding: 20px 50px; background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: #ffffff !important; text-decoration: none; border-radius: 12px; margin: 25px 0; font-weight: bold; font-size: 20px; box-shadow: 0 6px 20px rgba(220, 38, 38, 0.4); text-transform: uppercase; letter-spacing: 0.5px; }
              .final-warning { background: #fef2f2; border: 2px solid #dc2626; border-radius: 12px; padding: 20px; margin: 25px 0; text-align: center; }
              .final-warning p { color: #dc2626; font-weight: bold; font-size: 18px; margin: 0; }
              .footer { text-align: center; padding: 30px 20px; background: #F8F6FF; color: #666; font-size: 13px; border-top: 2px solid #E6DEFF; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🚨 LAST CHANCE</h1>
                <p>40% OFF expires TODAY</p>
              </div>
              <div class="content">
                <p>Hello ${userName}!</p>
                <p style="font-size: 18px; font-weight: 600;">This is your LAST opportunity! The 40% discount on your first Premium month expires in a few hours.</p>
                <div class="urgency-banner">
                  <h2>40% OFF</h2>
                  <p>FIRST MONTH</p>
                  <p class="timer">⏰ EXPIRES TODAY AT 11:59 PM</p>
                </div>
                <div class="benefits">
                  <h3>🔥 What you're missing RIGHT NOW:</h3>
                  <div class="benefit-item">✅ UNLIMITED summaries (vs just 10 per month)</div>
                  <div class="benefit-item">✅ Professional audio for ALL books</div>
                  <div class="benefit-item">✅ Exclusive achievements and gamification</div>
                  <div class="benefit-item">✅ Priority access to new features</div>
                </div>
                <p style="font-size: 17px; font-weight: 600; text-align: center;">Thousands of users have already transformed their reading routine. Don't miss out!</p>
                <center>
                  <a href="https://buy.stripe.com/7sY7sL2SQcIb6fu2dZ3oA02?prefilled_promo_code=WELCOME40" class="cta-button" style="display: inline-block; padding: 20px 50px; background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: #ffffff !important; text-decoration: none; border-radius: 12px; margin: 25px 0; font-weight: bold; font-size: 20px; box-shadow: 0 6px 20px rgba(220, 38, 38, 0.4); text-transform: uppercase; letter-spacing: 0.5px;">CLAIM MY DISCOUNT</a>
                </center>
                <div class="final-warning">
                  <p>⚠️ This is the last reminder you'll receive.</p>
                  <p>After today, the discount expires permanently.</p>
                </div>
                <p style="text-align: center; font-size: 13px; color: #666; margin-top: 20px;">Code WELCOME40 applied automatically</p>
              </div>
              <div class="footer">
                <p>Don't miss this opportunity!<br>OnePageBook Team</p>
              </div>
            </div>
          </body>
          </html>
        `,
      }
    }[dayType] || templates[dayType];
  }

  if (userLanguage === 'es') {
    return {
      day_3: {
        subject: "✨ Descubre todo el potencial de OnePageBook Premium",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #2B1342; background: linear-gradient(135deg, #F8F6FF 0%, #F0ECFF 100%); margin: 0; padding: 20px; }
              .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(124, 92, 255, 0.1); }
              .header { text-align: center; padding: 30px 20px; background: linear-gradient(135deg, #F8F6FF 0%, #E6DEFF 100%); }
              .header h1 { color: #7C5CFF; font-size: 32px; font-weight: bold; margin: 0; }
              .content { background: #ffffff; padding: 30px; }
              .content p { color: #2B1342; margin: 16px 0; }
              .benefits { margin: 25px 0; background: #F8F6FF; padding: 20px; border-radius: 12px; border-left: 4px solid #7C5CFF; }
              .benefits h3 { color: #7C5CFF; margin-top: 0; }
              .benefit-item { padding: 10px 0; color: #2B1342; }
              .cta-button { display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #7C5CFF 0%, #6643FF 100%); color: white; text-decoration: none; border-radius: 12px; margin: 20px 0; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(124, 92, 255, 0.3); }
              .footer { text-align: center; padding: 30px 20px; background: #F8F6FF; color: #666; font-size: 13px; border-top: 2px solid #E6DEFF; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✨ OnePageBook</h1>
              </div>
              <div class="content">
                <p>¡Hola ${userName}!</p>
                <p>Notamos que estás disfrutando de OnePageBook hace 3 días. ¿Qué tal llevar tu experiencia al siguiente nivel?</p>
                <div class="benefits">
                  <h3>Con OnePageBook Premium tienes:</h3>
                  <div class="benefit-item">🎯 Resúmenes ilimitados todos los meses</div>
                  <div class="benefit-item">🎧 Audio generado para todos los resúmenes</div>
                  <div class="benefit-item">📊 Estadísticas avanzadas y logros exclusivos</div>
                  <div class="benefit-item">⚡ Acceso prioritario a nuevas funciones</div>
                </div>
                <p><strong>¡Transforma tu viaje de lectura ahora!</strong></p>
                <center>
                  <a href="${specialCheckoutUrlEnEs}" class="cta-button">Quiero ser Premium</a>
                </center>
              </div>
              <div class="footer">
                <p>Saludos,<br>Equipo OnePageBook</p>
              </div>
            </div>
          </body>
          </html>
        `,
      },
      day_5: {
        subject: "🎁 ¡Oferta Premium especial solo para ti!",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #2B1342; background: linear-gradient(135deg, #F8F6FF 0%, #F0ECFF 100%); margin: 0; padding: 20px; }
              .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(124, 92, 255, 0.1); }
              .header { text-align: center; padding: 30px 20px; background: linear-gradient(135deg, #F8F6FF 0%, #E6DEFF 100%); }
              .header h1 { color: #7C5CFF; font-size: 32px; font-weight: bold; margin: 0; }
              .content { background: #ffffff; padding: 30px; }
              .content p { color: #2B1342; margin: 16px 0; }
              .benefits { margin: 25px 0; background: #F8F6FF; padding: 20px; border-radius: 12px; border-left: 4px solid #7C5CFF; }
              .benefits h3 { color: #7C5CFF; margin-top: 0; }
              .benefit-item { padding: 10px 0; color: #2B1342; }
              .cta-button { display: inline-block; padding: 16px 45px; background: linear-gradient(135deg, #7C5CFF 0%, #6643FF 100%); color: white; text-decoration: none; border-radius: 12px; margin: 20px 0; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(124, 92, 255, 0.3); }
              .footer { text-align: center; padding: 30px 20px; background: #F8F6FF; color: #666; font-size: 13px; border-top: 2px solid #E6DEFF; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎁 OnePageBook</h1>
              </div>
              <div class="content">
                <p>¡Hola ${userName}!</p>
                <p>Ya exploraste bastante OnePageBook en los últimos 5 días. ¡Tenemos una oportunidad especial para ti!</p>
                <div class="benefits">
                  <h3>💎 Por qué nuestros usuarios Premium lo aman:</h3>
                  <div class="benefit-item">- Resúmenes ilimitados (vs 10 por mes en gratuito)</div>
                  <div class="benefit-item">- Audio profesional para todos los libros</div>
                  <div class="benefit-item">- Cero límites, máximo aprendizaje</div>
                </div>
                <p><strong>Miles de lectores ya están acelerando su conocimiento. ¿Vienes con nosotros?</strong></p>
                <center>
                  <a href="${specialCheckoutUrlEnEs}" class="cta-button">¡Sí, quiero Premium!</a>
                </center>
              </div>
              <div class="footer">
                <p>¡Lee más, aprende más!<br>Equipo OnePageBook</p>
              </div>
            </div>
          </body>
          </html>
        `,
      },
      day_7: {
        subject: "⏰ Última oportunidad: Desbloquea todo OnePageBook + 40% OFF",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #2B1342; background: linear-gradient(135deg, #F8F6FF 0%, #F0ECFF 100%); margin: 0; padding: 20px; }
              .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(124, 92, 255, 0.1); }
              .header { text-align: center; padding: 30px 20px; background: linear-gradient(135deg, #F8F6FF 0%, #E6DEFF 100%); }
              .header h1 { color: #7C5CFF; font-size: 32px; font-weight: bold; margin: 0; }
              .content { background: #ffffff; padding: 30px; }
              .content p { color: #2B1342; margin: 16px 0; }
              .discount-box { background: linear-gradient(135deg, #7C5CFF 0%, #6643FF 100%); color: white; padding: 30px; border-radius: 16px; margin: 30px 0; text-align: center; box-shadow: 0 8px 25px rgba(124, 92, 255, 0.3); }
              .discount-box h2 { margin: 0; font-size: 56px; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); }
              .discount-box p { margin: 10px 0 0 0; font-size: 22px; font-weight: 500; }
              .discount-validity { font-size: 14px; margin-top: 20px; color: #F0ECFF; font-weight: 600; }
              .benefits { margin: 25px 0; background: #F8F6FF; padding: 20px; border-radius: 12px; border-left: 4px solid #7C5CFF; }
              .benefit-item { padding: 10px 0; color: #2B1342; }
              .cta-button { display: inline-block; padding: 16px 45px; background: linear-gradient(135deg, #7C5CFF 0%, #6643FF 100%); color: #ffffff !important; text-decoration: none; border-radius: 12px; margin: 20px 0; font-weight: bold; font-size: 18px; box-shadow: 0 4px 15px rgba(124, 92, 255, 0.3); }
              .urgency { color: #dc2626; font-weight: bold; padding: 15px; background: #fef2f2; border-radius: 8px; border-left: 4px solid #dc2626; margin: 25px 0; }
              .footer { text-align: center; padding: 30px 20px; background: #F8F6FF; color: #666; font-size: 13px; border-top: 2px solid #E6DEFF; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>⏰ OnePageBook</h1>
              </div>
              <div class="content">
                <p>¡Hola ${userName}!</p>
                <p>Ha pasado una semana y continúas con nosotros - ¡eso es increíble! 🎉</p>
                <p>Pero notamos que todavía estás limitado a 10 resúmenes por mes. ¡No dejes que tus objetivos de lectura esperen!</p>
                <div class="discount-box">
                  <h2>40% OFF</h2>
                  <p>¡en tu primer mes Premium!</p>
                  <p class="discount-validity">⏰ Válido por solo 7 días</p>
                </div>
                <div class="benefits">
                  <div class="benefit-item">🚀 Los usuarios Premium leen 3x más libros</div>
                  <div class="benefit-item">📚 Acceso ilimitado al catálogo completo</div>
                  <div class="benefit-item">🎯 Logros y gamificación exclusivos</div>
                </div>
                <p class="urgency">¡Esta es tu última oportunidad de recibir este recordatorio. El conocimiento no espera!</p>
                <center>
                  <a href="${checkoutUrl}" class="cta-button" style="display: inline-block; padding: 16px 45px; background: linear-gradient(135deg, #7C5CFF 0%, #6643FF 100%); color: #ffffff !important; text-decoration: none; border-radius: 12px; margin: 20px 0; font-weight: bold; font-size: 18px; box-shadow: 0 4px 15px rgba(124, 92, 255, 0.3);">Quiero Premium AHORA</a>
                </center>
                <p style="text-align: center; font-size: 13px; color: #666; margin-top: 15px;">Descuento aplicado automáticamente en el checkout</p>
              </div>
              <div class="footer">
                <p>¡Éxito en tu viaje!<br>Equipo OnePageBook</p>
              </div>
            </div>
          </body>
          </html>
        `,
      },
      day_10: {
        subject: "🚨 ÚLTIMA OPORTUNIDAD: ¡40% OFF expira hoy!",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #2B1342; background: linear-gradient(135deg, #F8F6FF 0%, #F0ECFF 100%); margin: 0; padding: 20px; }
              .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 30px rgba(220, 38, 38, 0.2); border: 3px solid #dc2626; }
              .header { text-align: center; padding: 30px 20px; background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); }
              .header h1 { color: #ffffff; font-size: 36px; font-weight: bold; margin: 0; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3); }
              .header p { color: #ffffff; font-size: 18px; margin: 10px 0 0 0; font-weight: 600; }
              .content { background: #ffffff; padding: 30px; }
              .content p { color: #2B1342; margin: 16px 0; font-size: 16px; }
              .urgency-banner { background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; padding: 25px; border-radius: 12px; text-align: center; margin: 30px 0; box-shadow: 0 8px 25px rgba(220, 38, 38, 0.4); animation: pulse 2s infinite; }
              @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } }
              .urgency-banner h2 { margin: 0; font-size: 48px; font-weight: bold; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3); }
              .urgency-banner p { margin: 10px 0 0 0; font-size: 20px; font-weight: 600; }
              .timer { font-size: 16px; margin-top: 15px; color: #fef2f2; font-weight: 600; }
              .benefits { margin: 25px 0; background: #fef2f2; padding: 25px; border-radius: 12px; border-left: 4px solid #dc2626; }
              .benefits h3 { color: #dc2626; margin-top: 0; font-size: 20px; }
              .benefit-item { padding: 12px 0; color: #2B1342; font-size: 16px; font-weight: 500; }
              .cta-button { display: inline-block; padding: 20px 50px; background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: #ffffff !important; text-decoration: none; border-radius: 12px; margin: 25px 0; font-weight: bold; font-size: 20px; box-shadow: 0 6px 20px rgba(220, 38, 38, 0.4); text-transform: uppercase; letter-spacing: 0.5px; }
              .final-warning { background: #fef2f2; border: 2px solid #dc2626; border-radius: 12px; padding: 20px; margin: 25px 0; text-align: center; }
              .final-warning p { color: #dc2626; font-weight: bold; font-size: 18px; margin: 0; }
              .footer { text-align: center; padding: 30px 20px; background: #F8F6FF; color: #666; font-size: 13px; border-top: 2px solid #E6DEFF; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🚨 ÚLTIMA OPORTUNIDAD</h1>
                <p>40% OFF expira HOY</p>
              </div>
              <div class="content">
                <p>¡Hola ${userName}!</p>
                <p style="font-size: 18px; font-weight: 600;">¡Esta es tu ÚLTIMA oportunidad! El descuento del 40% en tu primer mes Premium expira en pocas horas.</p>
                <div class="urgency-banner">
                  <h2>40% OFF</h2>
                  <p>PRIMER MES</p>
                  <p class="timer">⏰ EXPIRA HOY A LAS 23:59</p>
                </div>
                <div class="benefits">
                  <h3>🔥 Lo que estás perdiendo AHORA MISMO:</h3>
                  <div class="benefit-item">✅ Resúmenes ILIMITADOS (vs solo 10 por mes)</div>
                  <div class="benefit-item">✅ Audio profesional para TODOS los libros</div>
                  <div class="benefit-item">✅ Logros y gamificación exclusivos</div>
                  <div class="benefit-item">✅ Acceso prioritario a nuevas funciones</div>
                </div>
                <p style="font-size: 17px; font-weight: 600; text-align: center;">Miles de usuarios ya transformaron su rutina de lectura. ¡No te quedes afuera!</p>
                <center>
                  <a href="https://buy.stripe.com/7sY7sL2SQcIb6fu2dZ3oA02?prefilled_promo_code=WELCOME40" class="cta-button" style="display: inline-block; padding: 20px 50px; background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: #ffffff !important; text-decoration: none; border-radius: 12px; margin: 25px 0; font-weight: bold; font-size: 20px; box-shadow: 0 6px 20px rgba(220, 38, 38, 0.4); text-transform: uppercase; letter-spacing: 0.5px;">RECLAMAR MI DESCUENTO</a>
                </center>
                <div class="final-warning">
                  <p>⚠️ Este es el último recordatorio que recibirás.</p>
                  <p>Después de hoy, el descuento expira permanentemente.</p>
                </div>
                <p style="text-align: center; font-size: 13px; color: #666; margin-top: 20px;">Código WELCOME40 aplicado automáticamente</p>
              </div>
              <div class="footer">
                <p>¡No pierdas esta oportunidad!<br>Equipo OnePageBook</p>
              </div>
            </div>
          </body>
          </html>
        `,
      }
    }[dayType] || templates[dayType];
  }

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
      day_10: 0,
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
        if (accountAge >= 10) {
          emailType = "day_10";
        } else if (accountAge >= 7) {
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
