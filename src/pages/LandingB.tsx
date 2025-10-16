import { Suspense, lazy, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useABTest } from "@/hooks/useABTest";
import { useSEO } from "@/hooks/useSEO";
import logoGray from "@/assets/logo-gray.png";
import { LandingTestimonials } from "@/components/landing/LandingTestimonials";
import { LandingFinalCTA } from "@/components/landing/LandingFinalCTA";

const LandingHeroBOptimized = lazy(() => import("@/components/landing/LandingHeroBOptimized"));
const LandingComparisonTable = lazy(() => import("@/components/landing/LandingComparisonTable"));
const LandingHowItWorksB = lazy(() => import("@/components/landing/LandingHowItWorksB"));
const LandingPricingB = lazy(() => import("@/components/landing/LandingPricingB"));
const Footer = lazy(() => import("@/components/Footer"));

interface LandingBProps {
  lang: "pt" | "es" | "en";
}

export default function LandingB({ lang }: LandingBProps) {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { trackConversion } = useABTest();

  const seoContent = {
    pt: {
      title: "OnePageBook - Aprenda o Essencial de Qualquer Livro em 5 Minutos",
      description: "Transforme leitura em transformação real com IA. Resumos + Flashcards + Áudio + Ação.",
    },
    es: {
      title: "OnePageBook - Aprende lo Esencial de Cualquier Libro en 5 Minutos",
      description: "Transforma la lectura en transformación real con IA. Resúmenes + Flashcards + Audio + Acción.",
    },
    en: {
      title: "OnePageBook - Learn the Essentials of Any Book in 5 Minutes",
      description: "Transform reading into real transformation with AI. Summaries + Flashcards + Audio + Action.",
    },
  };

  useSEO({
    title: seoContent[lang].title,
    description: seoContent[lang].description,
    lang: lang,
    path: `/${lang}2`,
  });

  useEffect(() => {
    if (lang !== i18n.language) {
      i18n.changeLanguage(lang);
      localStorage.setItem("i18nextLng", lang);
    }
  }, [lang, i18n]);

  const handleCTA = () => {
    trackConversion('cta_click');
    navigate(`/auth?lang=${lang}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="container mx-auto flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        <img src={logoGray} alt="OnePageBook" className="h-6 sm:h-8" />
        <div className="flex gap-1 sm:gap-2">
          <a href="/pt2" className={`px-2 sm:px-3 py-1 rounded text-sm sm:text-base ${lang === 'pt' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'}`}>PT</a>
          <a href="/en2" className={`px-2 sm:px-3 py-1 rounded text-sm sm:text-base ${lang === 'en' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'}`}>EN</a>
          <a href="/es2" className={`px-2 sm:px-3 py-1 rounded text-sm sm:text-base ${lang === 'es' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'}`}>ES</a>
        </div>
      </header>

      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          </div>
        }
      >
        <LandingHeroBOptimized onCTA={handleCTA} />
        <LandingComparisonTable />
        <LandingHowItWorksB onCTA={handleCTA} />
        <LandingTestimonials lang={lang} />
        <LandingPricingB onCTA={handleCTA} />
        <LandingFinalCTA onCTA={handleCTA} />
        <Footer />
      </Suspense>
    </div>
  );
}
