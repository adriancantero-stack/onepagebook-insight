import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface TestEmailRequest {
  email: string;
  language?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, language = 'pt' }: TestEmailRequest = await req.json();

    console.log(`Sending test notification to ${email} in language: ${language}`);

    const messages = {
      pt: {
        subject: "🔔 Lembrete de Leitura - OnePageBook.ai",
        greeting: "Olá!",
        mainText: "Que tal dedicar alguns minutos à leitura hoje?",
        cta: "Acessar OnePageBook.ai",
        footer: "Continue sua jornada de aprendizado!",
      },
      en: {
        subject: "🔔 Reading Reminder - OnePageBook.ai",
        greeting: "Hello!",
        mainText: "How about dedicating a few minutes to reading today?",
        cta: "Access OnePageBook.ai",
        footer: "Continue your learning journey!",
      },
      es: {
        subject: "🔔 Recordatorio de Lectura - OnePageBook.ai",
        greeting: "¡Hola!",
        mainText: "¿Qué tal dedicar unos minutos a la lectura hoy?",
        cta: "Acceder a OnePageBook.ai",
        footer: "¡Continúa tu viaje de aprendizaje!",
      },
    };

    const content = messages[language as keyof typeof messages] || messages.pt;

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "OnePageBook.ai <onboarding@resend.dev>",
        to: [email],
        subject: content.subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #333; margin-bottom: 10px;">📚 OnePageBook.ai</h1>
            </div>
            
            <div style="background-color: #f5f5f5; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
              <h2 style="color: #333; margin-top: 0;">${content.greeting}</h2>
              <p style="color: #666; font-size: 16px; line-height: 1.6;">
                ${content.mainText}
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://onepagebook.ai" 
                 style="background-color: #0066cc; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                ${content.cta}
              </a>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="color: #999; font-size: 12px;">
                ${content.footer}
              </p>
              <p style="color: #999; font-size: 12px;">
                OnePageBook.ai - ${new Date().toLocaleDateString(language === 'pt' ? 'pt-BR' : language === 'es' ? 'es-ES' : 'en-US')}
              </p>
            </div>
          </div>
        `,
      }),
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      console.error("Resend API error:", errorText);
      throw new Error(`Resend API error: ${errorText}`);
    }

    const resendData = await resendResponse.json();
    console.log("Email sent successfully via Resend:", resendData);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Test notification sent to ${email}`,
        resendData 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in test-notification-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
