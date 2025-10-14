import { useTranslation } from "react-i18next";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface LandingHeroProps {
  onCTA: () => void;
}

export const LandingHero = ({ onCTA }: LandingHeroProps) => {
  const { t } = useTranslation();

  return (
    <section className="container mx-auto px-4 py-16 sm:px-6 sm:py-20 lg:px-24 lg:py-28">
      <div className="mx-auto max-w-4xl space-y-6 sm:space-y-8 text-center">
        <Badge variant="secondary" className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-normal bg-white/80 hover:bg-white border border-lilac-100">
          <Star className="h-3 w-3 fill-primary text-primary" />
          {t("landing.hero.badge")}
        </Badge>

        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl xl:text-6xl animate-fade-in leading-tight">
          {t("landing.hero.title")}
        </h1>

        <p className="mx-auto max-w-2xl text-base sm:text-lg lg:text-xl text-muted-foreground animate-fade-in" style={{animationDelay: "0.1s"}}>
          {t("landing.hero.subtitle")}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 pt-2 sm:pt-4 animate-fade-in justify-center" style={{animationDelay: "0.2s"}}>
          <Button
            size="lg"
            onClick={onCTA}
            className="h-11 px-6 text-sm font-medium shadow-lg transition-all hover:scale-105 sm:h-12 sm:px-8 sm:text-base lg:h-14 lg:px-10 lg:text-lg w-full sm:w-auto"
          >
            {t("landing.hero.cta")}
          </Button>
        </div>
      </div>
    </section>
  );
};
