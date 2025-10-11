import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles } from "lucide-react";

const Welcome = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    // Track sign_up event in Google Analytics
    if (!sessionStorage.getItem('ga_signed')) {
      const gtag = (window as any).gtag;
      if (gtag) {
        gtag('event', 'sign_up', {
          method: 'email',
          language: document.documentElement.lang || 'en'
        });
      }
      sessionStorage.setItem('ga_signed', '1');
    }

    // Auto-redirect after 5 seconds
    const timer = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="w-full max-w-xl text-center space-y-8 animate-fade-in">
        {/* Icon with subtle animation */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-[#7B61FF]/20 blur-3xl rounded-full animate-pulse" />
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-[#7B61FF] to-[#9D8CFF] flex items-center justify-center shadow-lg">
              <Sparkles className="w-12 h-12 text-white" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl font-semibold text-[#1D1D1F] tracking-tight leading-tight">
            {t("welcome.title") || "Bem-vindo ao OnePageBook"}
          </h1>
          <p className="text-lg sm:text-xl text-[#86868B] font-normal max-w-md mx-auto leading-relaxed">
            {t("welcome.description") || "Sua conta foi criada com sucesso. Você já pode começar a gerar resumos de livros."}
          </p>
        </div>

        {/* Features card */}
        <div className="bg-[#F5F5F7] rounded-3xl p-6 sm:p-8 space-y-4 border border-[#E5E5EA]">
          <div className="flex items-center justify-center gap-3">
            <BookOpen className="w-5 h-5 text-[#7B61FF]" strokeWidth={2} />
            <h3 className="text-base font-semibold text-[#1D1D1F]">
              {t("welcome.freeplan") || "Plano Gratuito Ativado"}
            </h3>
          </div>
          <p className="text-sm text-[#86868B] leading-relaxed">
            {t("welcome.limits") || "5 resumos + 5 áudios por mês"}
          </p>
        </div>

        {/* CTA Button */}
        <div className="pt-4 space-y-4">
          <Button 
            onClick={() => navigate("/")} 
            className="w-full h-12 sm:h-14 bg-[#7B61FF] hover:bg-[#6951E6] text-white rounded-full text-base sm:text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
          >
            {t("welcome.cta") || "Começar a usar"}
          </Button>
          
          <p className="text-xs text-[#86868B] font-normal">
            {t("welcome.redirect") || "Redirecionando automaticamente em 5 segundos..."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
