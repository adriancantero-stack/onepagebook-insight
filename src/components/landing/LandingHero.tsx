import { useTranslation } from "react-i18next";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import heroMockupEn from "@/assets/hero-mockup-en.jpg";
import heroMockupEs from "@/assets/hero-mockup-es.jpg";
import heroMockupPt from "@/assets/hero-mockup-pt.jpg";

interface LandingHeroProps {
  onCTA: () => void;
}

export const LandingHero = ({ onCTA }: LandingHeroProps) => {
  const { t, i18n } = useTranslation();
  
  const heroImages = {
    pt: heroMockupPt,
    es: heroMockupEs,
    en: heroMockupEn,
  };

  const currentHeroImage = heroImages[i18n.language as keyof typeof heroImages] || heroMockupEn;

  return (
    <section className="container mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-24 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-4 sm:space-y-6 text-center lg:text-left order-2 lg:order-1">
            <Badge variant="secondary" className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-normal bg-white/80 hover:bg-white border border-lilac-100">
              <Star className="h-3 w-3 fill-primary text-primary" />
              {t("landing.hero.badge")}
            </Badge>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl xl:text-6xl animate-fade-in leading-tight">
              {t("landing.hero.title")}
            </h1>

            <p className="max-w-2xl text-base sm:text-lg lg:text-xl text-muted-foreground animate-fade-in mx-auto lg:mx-0" style={{animationDelay: "0.1s"}}>
              {t("landing.hero.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 pt-2 sm:pt-4 animate-fade-in justify-center lg:justify-start" style={{animationDelay: "0.2s"}}>
              <Button
                size="lg"
                onClick={onCTA}
                className="h-11 px-6 text-sm font-medium shadow-lg transition-all hover:scale-105 sm:h-12 sm:px-8 sm:text-base lg:h-14 lg:px-10 lg:text-lg w-full sm:w-auto"
              >
                {t("landing.hero.cta")}
              </Button>
            </div>
          </div>

          {/* Right Column - Hero Image */}
          <div className="relative animate-fade-in order-1 lg:order-2" style={{animationDelay: "0.3s"}}>
            <div className="relative mx-auto max-w-xs sm:max-w-sm lg:max-w-none">
              <img
                src={currentHeroImage}
                alt="OnePageBook App Preview"
                className="w-full h-auto rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl"
                loading="eager"
                fetchPriority="high"
                width="600"
                height="800"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
