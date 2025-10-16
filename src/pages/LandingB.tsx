import { Suspense, lazy, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BookOpen } from "lucide-react";
import { useABTest } from "@/hooks/useABTest";
import { useSEO } from "@/hooks/useSEO";
import { LandingTestimonials } from "@/components/landing/LandingTestimonials";
import { LandingFinalCTA } from "@/components/landing/LandingFinalCTA";
import { LanguageSelector } from "@/components/LanguageSelector";

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
    <div className="min-h-screen bg-lilac-50">
      <header className="sticky top-0 z-50 w-full border-b border-lilac-200/40 bg-gradient-to-r from-lilac-50/95 via-lilac-50/50 to-lilac-50/95 backdrop-blur supports-[backdrop-filter]:bg-lilac-50/60">
        <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6 lg:px-24">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <span className="text-base sm:text-lg font-bold font-poppins bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">OnePageBook</span>
          </div>
          <LanguageSelector />
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
