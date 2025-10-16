import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailContent {
  subject: string;
  greeting: string;
  intro: string;
  howItWorksTitle: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  xpSystemTitle: string;
  xpSystemDesc: string;
  levelsTitle: string;
  levels: Array<{ name: string; xp: string }>;
  achievementsTitle: string;
  achievementsDesc: string;
  ctaButton: string;
  ctaUrl: string;
  footer1: string;
  footer2: string;
  addContactTitle: string;
  addContactDesc: string;
}

const getEmailContent = (language: string, userName: string): WelcomeEmailContent => {
  const contents: Record<string, WelcomeEmailContent> = {
    pt: {
      subject: "🎉 Bem-vindo ao OnePageBook!",
      greeting: `Olá ${userName}!`,
      intro: "Seja muito bem-vindo ao OnePageBook! Estamos muito felizes em tê-lo conosco. Sua jornada de aprendizado acelerado começa agora!",
      howItWorksTitle: "Como Funciona",
      step1Title: "1. Escolha um Livro",
      step1Desc: "Busque entre milhares de títulos ou digite o nome do livro que você quer ler.",
      step2Title: "2. Gere o Resumo",
      step2Desc: "Nossa IA cria um resumo completo e acionável em poucos segundos.",
      step3Title: "3. Aprenda e Aplique",
      step3Desc: "Leia, ouça em áudio e coloque as ideias em prática. Ganhe XP a cada ação!",
      xpSystemTitle: "🎮 Sistema de XP e Níveis",
      xpSystemDesc: "Ganhe pontos de experiência (XP) ao completar ações no app e suba de nível!",
      levelsTitle: "Níveis Disponíveis:",
      levels: [
        { name: "🌱 Beginner", xp: "0-99 XP" },
        { name: "📚 Learner", xp: "100-499 XP" },
        { name: "🧠 Thinker", xp: "500-1499 XP" },
        { name: "🎓 Master", xp: "1500-4999 XP" },
        { name: "✨ Enlightened", xp: "5000+ XP" },
      ],
      achievementsTitle: "🏆 Conquistas",
      achievementsDesc: "Desbloqueie conquistas especiais ao atingir marcos importantes! Cada conquista dá XP extra e mostra seu progresso.",
      ctaButton: "Começar Agora",
      ctaUrl: "https://onepagebook.com.br/home",
      footer1: "Você está recebendo este email porque criou uma conta no OnePageBook.",
      footer2: "Para não perder nossas atualizações, adicione onboarding@resend.dev aos seus contatos.",
      addContactTitle: "📧 Adicione-nos aos Contatos",
      addContactDesc: "Para garantir que você receba todos os nossos emails e não os perca na pasta de spam, adicione <strong>onboarding@resend.dev</strong> à sua lista de contatos.",
    },
    en: {
      subject: "🎉 Welcome to OnePageBook!",
      greeting: `Hello ${userName}!`,
      intro: "Welcome to OnePageBook! We're thrilled to have you with us. Your accelerated learning journey starts now!",
      howItWorksTitle: "How It Works",
      step1Title: "1. Choose a Book",
      step1Desc: "Search among thousands of titles or type the name of the book you want to read.",
      step2Title: "2. Generate Summary",
      step2Desc: "Our AI creates a complete, actionable summary in seconds.",
      step3Title: "3. Learn and Apply",
      step3Desc: "Read, listen to audio, and put ideas into practice. Earn XP with every action!",
      xpSystemTitle: "🎮 XP and Levels System",
      xpSystemDesc: "Earn experience points (XP) by completing actions in the app and level up!",
      levelsTitle: "Available Levels:",
      levels: [
        { name: "🌱 Beginner", xp: "0-99 XP" },
        { name: "📚 Learner", xp: "100-499 XP" },
        { name: "🧠 Thinker", xp: "500-1499 XP" },
        { name: "🎓 Master", xp: "1500-4999 XP" },
        { name: "✨ Enlightened", xp: "5000+ XP" },
      ],
      achievementsTitle: "🏆 Achievements",
      achievementsDesc: "Unlock special achievements when you reach important milestones! Each achievement gives extra XP and shows your progress.",
      ctaButton: "Get Started",
      ctaUrl: "https://onepagebook.com/home",
      footer1: "You're receiving this email because you created an account at OnePageBook.",
      footer2: "To not miss our updates, add onboarding@resend.dev to your contacts.",
      addContactTitle: "📧 Add Us to Contacts",
      addContactDesc: "To ensure you receive all our emails and don't miss them in your spam folder, add <strong>onboarding@resend.dev</strong> to your contact list.",
    },
    es: {
      subject: "🎉 ¡Bienvenido a OnePageBook!",
      greeting: `¡Hola ${userName}!`,
      intro: "¡Bienvenido a OnePageBook! Estamos muy contentos de tenerte con nosotros. ¡Tu viaje de aprendizaje acelerado comienza ahora!",
      howItWorksTitle: "Cómo Funciona",
      step1Title: "1. Elige un Libro",
      step1Desc: "Busca entre miles de títulos o escribe el nombre del libro que quieres leer.",
      step2Title: "2. Genera el Resumen",
      step2Desc: "Nuestra IA crea un resumen completo y accionable en segundos.",
      step3Title: "3. Aprende y Aplica",
      step3Desc: "Lee, escucha en audio y pon las ideias en práctica. ¡Gana XP con cada acción!",
      xpSystemTitle: "🎮 Sistema de XP y Niveles",
      xpSystemDesc: "¡Gana puntos de experiencia (XP) al completar acciones en la app y sube de nivel!",
      levelsTitle: "Niveles Disponibles:",
      levels: [
        { name: "🌱 Principiante", xp: "0-99 XP" },
        { name: "📚 Aprendiz", xp: "100-499 XP" },
        { name: "🧠 Pensador", xp: "500-1499 XP" },
        { name: "🎓 Maestro", xp: "1500-4999 XP" },
        { name: "✨ Iluminado", xp: "5000+ XP" },
      ],
      achievementsTitle: "🏆 Logros",
      achievementsDesc: "¡Desbloquea logros especiales al alcanzar hitos importantes! Cada logro otorga XP extra y muestra tu progreso.",
      ctaButton: "Comenzar Ahora",
      ctaUrl: "https://onepagebook.com/home",
      footer1: "Estás recibiendo este correo porque creaste una cuenta en OnePageBook.",
      footer2: "Para no perderte nuestras actualizaciones, agrega onboarding@resend.dev a tus contactos.",
      addContactTitle: "📧 Agréganos a Contactos",
      addContactDesc: "Para asegurar que recibas todos nuestros correos y no los pierdas en la carpeta de spam, agrega <strong>onboarding@resend.dev</strong> a tu lista de contactos.",
    },
  };

  return contents[language] || contents.pt;
};

const generateEmailHTML = (content: WelcomeEmailContent): string => {
  return `
<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${content.subject}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', Arial, sans-serif;
      background-color: #f5f3ff;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    .email-wrapper {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #9b87f5 0%, #7C5CFF 100%);
      padding: 40px 20px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      font-size: 32px;
      font-weight: 700;
      margin: 0 0 10px 0;
      letter-spacing: -0.5px;
    }
    .header p {
      color: rgba(255, 255, 255, 0.95);
      font-size: 18px;
      margin: 0;
      font-weight: 500;
    }
    .content {
      padding: 40px 30px;
    }
    .intro {
      font-size: 16px;
      line-height: 1.6;
      color: #333333;
      margin-bottom: 30px;
      text-align: center;
    }
    .section {
      margin-bottom: 35px;
    }
    .section-title {
      font-size: 22px;
      font-weight: 700;
      color: #7C5CFF;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .section-desc {
      font-size: 15px;
      line-height: 1.6;
      color: #555555;
      margin-bottom: 20px;
    }
    .steps {
      background-color: #f9f8ff;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
    }
    .step {
      margin-bottom: 20px;
      padding-left: 0;
    }
    .step:last-child {
      margin-bottom: 0;
    }
    .step-title {
      font-size: 16px;
      font-weight: 700;
      color: #7C5CFF;
      margin-bottom: 5px;
    }
    .step-desc {
      font-size: 14px;
      line-height: 1.5;
      color: #666666;
    }
    .levels-grid {
      display: table;
      width: 100%;
      background-color: #f9f8ff;
      border-radius: 12px;
      padding: 15px;
    }
    .level-item {
      display: table-row;
      margin-bottom: 10px;
    }
    .level-name {
      display: table-cell;
      font-size: 15px;
      font-weight: 600;
      color: #333333;
      padding: 8px 10px;
    }
    .level-xp {
      display: table-cell;
      font-size: 14px;
      color: #7C5CFF;
      padding: 8px 10px;
      text-align: right;
      font-weight: 600;
    }
    .highlight-box {
      background: linear-gradient(135deg, #f9f8ff 0%, #f0ecff 100%);
      border-left: 4px solid #7C5CFF;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .highlight-box p {
      margin: 0;
      font-size: 14px;
      line-height: 1.6;
      color: #555555;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #9b87f5 0%, #7C5CFF 100%);
      color: #ffffff !important;
      text-decoration: none;
      padding: 16px 40px;
      border-radius: 50px;
      font-size: 18px;
      font-weight: 700;
      text-align: center;
      margin: 30px 0;
      box-shadow: 0 4px 15px rgba(124, 92, 255, 0.3);
      transition: all 0.3s ease;
    }
    .cta-container {
      text-align: center;
    }
    .footer {
      background-color: #f9f8ff;
      padding: 30px 20px;
      text-align: center;
      font-size: 13px;
      color: #888888;
      line-height: 1.6;
    }
    .footer a {
      color: #7C5CFF;
      text-decoration: none;
    }
    .divider {
      height: 1px;
      background: linear-gradient(to right, transparent, #e6deff, transparent);
      margin: 30px 0;
    }
    @media only screen and (max-width: 600px) {
      .header h1 {
        font-size: 26px;
      }
      .content {
        padding: 30px 20px;
      }
      .cta-button {
        padding: 14px 30px;
        font-size: 16px;
      }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <!-- Header -->
    <div class="header">
      <h1>📚 OnePageBook</h1>
      <p>${content.subject}</p>
    </div>

    <!-- Content -->
    <div class="content">
      <div class="intro">
        <h2 style="color: #333; font-size: 24px; margin-bottom: 15px;">${content.greeting}</h2>
        <p>${content.intro}</p>
      </div>

      <div class="divider"></div>

      <!-- How It Works -->
      <div class="section">
        <h3 class="section-title">${content.howItWorksTitle}</h3>
        <div class="steps">
          <div class="step">
            <div class="step-title">${content.step1Title}</div>
            <div class="step-desc">${content.step1Desc}</div>
          </div>
          <div class="step">
            <div class="step-title">${content.step2Title}</div>
            <div class="step-desc">${content.step2Desc}</div>
          </div>
          <div class="step">
            <div class="step-title">${content.step3Title}</div>
            <div class="step-desc">${content.step3Desc}</div>
          </div>
        </div>
      </div>

      <div class="divider"></div>

      <!-- XP System -->
      <div class="section">
        <h3 class="section-title">${content.xpSystemTitle}</h3>
        <p class="section-desc">${content.xpSystemDesc}</p>
        
        <h4 style="font-size: 16px; font-weight: 700; color: #333; margin-bottom: 15px;">${content.levelsTitle}</h4>
        <div class="levels-grid">
          ${content.levels.map(level => `
            <div class="level-item">
              <div class="level-name">${level.name}</div>
              <div class="level-xp">${level.xp}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="divider"></div>

      <!-- Achievements -->
      <div class="section">
        <h3 class="section-title">${content.achievementsTitle}</h3>
        <p class="section-desc">${content.achievementsDesc}</p>
      </div>

      <!-- Add to Contacts -->
      <div class="highlight-box">
        <h4 style="font-size: 16px; font-weight: 700; color: #7C5CFF; margin: 0 0 10px 0;">${content.addContactTitle}</h4>
        <p>${content.addContactDesc}</p>
      </div>

      <!-- CTA Button -->
      <div class="cta-container">
        <a href="${content.ctaUrl}" class="cta-button">${content.ctaButton}</a>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>${content.footer1}</p>
      <p style="margin-top: 10px;">${content.footer2}</p>
      <p style="margin-top: 15px;">
        <a href="https://onepagebook.com.br">OnePageBook</a> | 
        <a href="https://onepagebook.com.br/terms">Termos</a> | 
        <a href="https://onepagebook.com.br/privacy">Privacidade</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("🚀 Processing welcome emails queue...");

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get pending welcome emails (not sent yet)
    const { data: pendingEmails, error: fetchError } = await supabase
      .from("welcome_emails_queue")
      .select("*")
      .is("sent_at", null)
      .order("created_at", { ascending: true })
      .limit(50); // Process max 50 per run

    if (fetchError) {
      throw new Error(`Failed to fetch pending emails: ${fetchError.message}`);
    }

    if (!pendingEmails || pendingEmails.length === 0) {
      console.log("✅ No pending welcome emails to process");
      return new Response(
        JSON.stringify({ success: true, processed: 0, message: "No pending emails" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`📧 Found ${pendingEmails.length} pending welcome emails`);

    let sentCount = 0;
    let failedCount = 0;

    for (const emailRecord of pendingEmails) {
      try {
        const userName = emailRecord.full_name || emailRecord.email.split("@")[0] || "Usuário";
        const userLanguage = emailRecord.language || "pt";

        console.log(`Sending welcome email to ${emailRecord.email} (${userLanguage})...`);

        // Get email content
        const content = getEmailContent(userLanguage, userName);
        const htmlContent = generateEmailHTML(content);

        // Send email via Resend
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "OnePageBook <onboarding@resend.dev>",
            to: [emailRecord.email],
            subject: content.subject,
            html: htmlContent,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(`Resend API error: ${JSON.stringify(result)}`);
        }

        // Mark as sent
        await supabase
          .from("welcome_emails_queue")
          .update({ sent_at: new Date().toISOString() })
          .eq("id", emailRecord.id);

        console.log(`✅ Welcome email sent to ${emailRecord.email}`);
        sentCount++;

      } catch (emailError: any) {
        console.error(`❌ Failed to send email to ${emailRecord.email}:`, emailError);
        
        // Update with error
        await supabase
          .from("welcome_emails_queue")
          .update({ error_message: emailError.message })
          .eq("id", emailRecord.id);

        failedCount++;
      }

      // Small delay between emails to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`📊 Welcome emails processed: ${sentCount} sent, ${failedCount} failed`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: pendingEmails.length,
        sent: sentCount,
        failed: failedCount,
        message: `Processed ${pendingEmails.length} welcome emails` 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error: any) {
    console.error("❌ Error processing welcome emails:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
};

serve(handler);