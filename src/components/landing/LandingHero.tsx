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
    <section className="container mx-auto px-6 py-12 sm:px-12 sm:py-16 lg:px-24 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-6 text-center lg:text-left">
            <Badge variant="secondary" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-normal bg-white/80 hover:bg-white border border-lilac-100">
              <Star className="h-3 w-3 fill-primary text-primary" />
              {t("landing.hero.badge")}
            </Badge>

            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl animate-fade-in">
              {t("landing.hero.title")}
            </h1>

            <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl animate-fade-in mx-auto lg:mx-0" style={{animationDelay: "0.1s"}}>
              {t("landing.hero.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 animate-fade-in justify-center lg:justify-start" style={{animationDelay: "0.2s"}}>
              <Button
                size="lg"
                onClick={onCTA}
                className="h-12 px-8 text-base font-medium shadow-lg transition-all hover:scale-105 sm:h-14 sm:px-10 sm:text-lg w-full sm:w-auto"
              >
                {t("landing.hero.cta")}
              </Button>
            </div>
          </div>

          {/* Right Column - Hero Image */}
          <div className="relative animate-fade-in" style={{animationDelay: "0.3s"}}>
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <img
                src={currentHeroImage}
                alt="OnePageBook App Preview"
                className="w-full h-auto rounded-2xl shadow-2xl"
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
