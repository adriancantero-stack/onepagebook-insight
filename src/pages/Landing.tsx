import { useEffect, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BookOpen } from "lucide-react";
import { LanguageSelector } from "@/components/LanguageSelector";
import Footer from "@/components/Footer";
import { useSEO } from "@/hooks/useSEO";
import { LandingHero } from "@/components/landing/LandingHero";

// Lazy load sections below the fold for better performance
const LandingBenefits = lazy(() => import("@/components/landing/LandingBenefits").then(m => ({ default: m.LandingBenefits })));
const LandingHowItWorks = lazy(() => import("@/components/landing/LandingHowItWorks").then(m => ({ default: m.LandingHowItWorks })));
const LandingLibrary = lazy(() => import("@/components/landing/LandingLibrary").then(m => ({ default: m.LandingLibrary })));
const LandingTestimonials = lazy(() => import("@/components/landing/LandingTestimonials").then(m => ({ default: m.LandingTestimonials })));
const LandingPricing = lazy(() => import("@/components/landing/LandingPricing").then(m => ({ default: m.LandingPricing })));

interface LandingProps {
  lang: "pt" | "es" | "en";
}

const Landing = ({ lang }: LandingProps) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const seoConfigs = {
    pt: {
      title: "OnePageBook - Transforme sua forma de aprender | Resumos IA",
      description: "Aprenda 10 livros em 10 minutos com resumos inteligentes de uma página. IA avançada, insights práticos, ação imediata.",
      path: "/pt",
    },
    en: {
      title: "OnePageBook - Transform the way you learn | AI Summaries",
      description: "Learn 10 books in 10 minutes with smart one-page summaries. Advanced AI, actionable insights, immediate action.",
      path: "/en",
    },
    es: {
      title: "OnePageBook - Transforma tu forma de aprender | Resúmenes IA",
      description: "Aprende 10 libros en 10 minutos con resúmenes inteligentes de una página. IA avanzada, insights prácticos, acción inmediata.",
      path: "/es",
    },
  };

  const config = seoConfigs[lang];
  useSEO({
    title: config.title,
    description: config.description,
    lang,
    path: config.path,
  });

  useEffect(() => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
  }, [lang, i18n]);

  const handleCTA = () => {
    navigate(`/auth?lang=${lang}`);
  };

  return (
    <div className="min-h-screen bg-lilac-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-lilac-200/40 bg-gradient-to-r from-lilac-50/95 via-lilac-50/50 to-lilac-50/95 backdrop-blur supports-[backdrop-filter]:bg-lilac-50/60">
        <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6 lg:px-24">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <span className="text-base sm:text-lg font-bold font-poppins bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">OnePageBook</span>
          </div>
          <LanguageSelector />
        </div>
      </header>

      <LandingHero onCTA={handleCTA} />

      <Suspense fallback={<div className="min-h-[200px]" />}>
        <LandingBenefits />
        <LandingHowItWorks />
        <LandingLibrary onCTA={handleCTA} />
        <LandingTestimonials lang={lang} />
        <LandingPricing onCTA={handleCTA} />
      </Suspense>

      {/* Footer */}
      <footer className="border-t border-lilac-200 bg-gradient-to-b from-lilac-50 to-lilac-100 py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-24 text-center">
          <div className="mb-4 sm:mb-6 flex items-center justify-center gap-2">
            <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <span className="text-base sm:text-lg font-bold font-poppins bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">OnePageBook</span>
          </div>
          <p className="mb-3 sm:mb-4 text-xs sm:text-sm text-muted-foreground px-4">{t("landing.footer.tagline")}</p>
          <Footer />
        </div>
      </footer>
    </div>
  );
};

export default Landing;
