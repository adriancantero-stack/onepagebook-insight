import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, BookOpen } from "lucide-react";
import { LanguageSelector } from "@/components/LanguageSelector";
import Footer from "@/components/Footer";

const Privacy = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const content = {
    pt: {
      title: "Política de Privacidade",
      lastUpdated: "Última atualização: 02 de outubro de 2025",
      sections: [
        {
          title: "1. Informações que Coletamos",
          content: "Coletamos informações que você nos fornece diretamente, incluindo seu nome, endereço de e-mail e informações de uso do serviço. Também coletamos automaticamente informações sobre como você usa o OnePageBook."
        },
        {
          title: "2. Como Usamos Suas Informações",
          content: "Usamos as informações coletadas para fornecer, manter e melhorar nossos serviços, processar suas solicitações, enviar comunicações relacionadas ao serviço e personalizar sua experiência no OnePageBook."
        },
        {
          title: "3. Compartilhamento de Informações",
          content: "Não vendemos suas informações pessoais. Podemos compartilhar suas informações com prestadores de serviços que nos ajudam a operar o OnePageBook, quando exigido por lei, ou para proteger nossos direitos."
        },
        {
          title: "4. Segurança dos Dados",
          content: "Implementamos medidas de segurança técnicas e organizacionais apropriadas para proteger suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição."
        },
        {
          title: "5. Seus Direitos",
          content: "Você tem o direito de acessar, corrigir ou excluir suas informações pessoais. Você também pode solicitar que limitemos ou nos oponhamos ao processamento de suas informações pessoais."
        },
        {
          title: "6. Cookies",
          content: "Usamos cookies e tecnologias similares para melhorar sua experiência, analisar o uso do serviço e fornecer conteúdo personalizado. Você pode controlar o uso de cookies através das configurações do seu navegador."
        },
        {
          title: "7. Alterações nesta Política",
          content: "Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre quaisquer mudanças publicando a nova política nesta página e atualizando a data de 'última atualização'."
        },
        {
          title: "8. Contato",
          content: "Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco em sac@onepagebook.ai"
        }
      ]
    },
    en: {
      title: "Privacy Policy",
      lastUpdated: "Last updated: October 02, 2025",
      sections: [
        {
          title: "1. Information We Collect",
          content: "We collect information you provide directly to us, including your name, email address, and service usage information. We also automatically collect information about how you use OnePageBook."
        },
        {
          title: "2. How We Use Your Information",
          content: "We use collected information to provide, maintain, and improve our services, process your requests, send service-related communications, and personalize your OnePageBook experience."
        },
        {
          title: "3. Information Sharing",
          content: "We do not sell your personal information. We may share your information with service providers who help us operate OnePageBook, when required by law, or to protect our rights."
        },
        {
          title: "4. Data Security",
          content: "We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction."
        },
        {
          title: "5. Your Rights",
          content: "You have the right to access, correct, or delete your personal information. You may also request that we limit or object to the processing of your personal information."
        },
        {
          title: "6. Cookies",
          content: "We use cookies and similar technologies to improve your experience, analyze service usage, and provide personalized content. You can control cookie usage through your browser settings."
        },
        {
          title: "7. Changes to This Policy",
          content: "We may update this Privacy Policy periodically. We will notify you of any changes by posting the new policy on this page and updating the 'last updated' date."
        },
        {
          title: "8. Contact",
          content: "If you have questions about this Privacy Policy, contact us at sac@onepagebook.ai"
        }
      ]
    },
    es: {
      title: "Política de Privacidad",
      lastUpdated: "Última actualización: 02 de octubre de 2025",
      sections: [
        {
          title: "1. Información que Recopilamos",
          content: "Recopilamos información que usted nos proporciona directamente, incluyendo su nombre, dirección de correo electrónico e información de uso del servicio. También recopilamos automáticamente información sobre cómo usa OnePageBook."
        },
        {
          title: "2. Cómo Usamos Su Información",
          content: "Usamos la información recopilada para proporcionar, mantener y mejorar nuestros servicios, procesar sus solicitudes, enviar comunicaciones relacionadas con el servicio y personalizar su experiencia en OnePageBook."
        },
        {
          title: "3. Compartir Información",
          content: "No vendemos su información personal. Podemos compartir su información con proveedores de servicios que nos ayudan a operar OnePageBook, cuando lo requiera la ley, o para proteger nuestros derechos."
        },
        {
          title: "4. Seguridad de Datos",
          content: "Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger su información personal contra acceso no autorizado, alteración, divulgación o destrucción."
        },
        {
          title: "5. Sus Derechos",
          content: "Usted tiene derecho a acceder, corregir o eliminar su información personal. También puede solicitar que limitemos u objetemos el procesamiento de su información personal."
        },
        {
          title: "6. Cookies",
          content: "Usamos cookies y tecnologías similares para mejorar su experiencia, analizar el uso del servicio y proporcionar contenido personalizado. Puede controlar el uso de cookies a través de la configuración de su navegador."
        },
        {
          title: "7. Cambios en Esta Política",
          content: "Podemos actualizar esta Política de Privacidad periódicamente. Le notificaremos sobre cualquier cambio publicando la nueva política en esta página y actualizando la fecha de 'última actualización'."
        },
        {
          title: "8. Contacto",
          content: "Si tiene preguntas sobre esta Política de Privacidad, contáctenos en sac@onepagebook.ai"
        }
      ]
    }
  };

  const lang = i18n.language as keyof typeof content;
  const pageContent = content[lang] || content.pt;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between relative">
          <Button variant="ghost" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Home
          </Button>
          <div className="flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2">
            <BookOpen className="w-8 h-8 text-primary" />
            <h1 className="text-xl font-bold text-foreground">OnePageBook</h1>
          </div>
          <LanguageSelector />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl flex-1">
        <Card className="p-8">
          <h1 className="text-3xl font-bold mb-4">{pageContent.title}</h1>
          <p className="text-sm text-muted-foreground mb-8">{pageContent.lastUpdated}</p>
          
          <div className="space-y-6">
            {pageContent.sections.map((section, index) => (
              <section key={index}>
                <h2 className="text-xl font-semibold mb-3">{section.title}</h2>
                <p className="text-foreground leading-relaxed">{section.content}</p>
              </section>
            ))}
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;
