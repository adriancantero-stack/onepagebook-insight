import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import React from 'npm:react@18.3.1';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import { TestEmail } from '../send-premium-conversion-emails/_templates/test-email.tsx';

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

    // Render the React email template
    const html = await renderAsync(
      React.createElement(TestEmail, {
        userName,
        checkoutUrl,
        promoCode: PROMO_CODE,
      })
    );

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
