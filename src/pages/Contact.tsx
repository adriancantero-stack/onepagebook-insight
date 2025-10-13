import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Mail } from "lucide-react";
import { FloatingHeader } from "@/components/FloatingHeader";
import Footer from "@/components/Footer";

const Contact = () => {
  const { i18n } = useTranslation();
  const contactEmail = "contact@onepagebook.ai";

  const getMessage = () => {
    switch(i18n.language) {
      case 'en':
        return {
          title: 'Contact Support',
          message: 'For support or questions, please write to us at:',
          note: 'We typically respond within 24 hours.'
        };
      case 'es':
        return {
          title: 'Contactar Soporte',
          message: 'Para soporte o consultas, escríbanos a:',
          note: 'Normalmente respondemos dentro de 24 horas.'
        };
      default:
        return {
          title: 'Contato e Suporte',
          message: 'Para suporte ou dúvidas, nos escreva em:',
          note: 'Normalmente respondemos em até 24 horas.'
        };
    }
  };

  const content = getMessage();

  return (
    <div className="min-h-screen bg-lilac-50 flex flex-col">
      <FloatingHeader />

      <main className="flex-1 container mx-auto px-4 py-12 max-w-2xl">
        <div className="text-center mb-12">
          <Mail className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h1 className="text-4xl font-bold font-poppins mb-4">{content.title}</h1>
          <p className="text-lg text-muted-foreground">{content.message}</p>
        </div>

        <Card className="p-8 border-lilac-200 shadow-sm bg-white">
          <div className="text-center space-y-6">
            <a 
              href={`mailto:${contactEmail}`}
              className="inline-block text-2xl font-semibold text-primary hover:underline transition-all"
            >
              {contactEmail}
            </a>
            
            <p className="text-sm text-muted-foreground">
              {content.note}
            </p>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
