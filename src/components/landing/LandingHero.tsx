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
    <section className="container mx-auto px-6 py-16 sm:px-12 sm:py-24 lg:px-24 lg:py-32">
      <div className="mx-auto max-w-4xl space-y-8 text-center">
        <Badge variant="secondary" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-normal">
          <Star className="h-3 w-3 fill-primary text-primary" />
          {t("landing.hero.badge")}
        </Badge>

        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl animate-fade-in">
          {t("landing.hero.title")}
        </h1>

        <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl animate-fade-in" style={{animationDelay: "0.1s"}}>
          {t("landing.hero.subtitle")}
        </p>

        <div className="flex flex-col items-center gap-4 pt-4 animate-fade-in" style={{animationDelay: "0.2s"}}>
          <Button
            size="lg"
            onClick={onCTA}
            className="h-12 px-8 text-base font-medium shadow-lg transition-all hover:scale-105 sm:h-14 sm:px-10 sm:text-lg"
          >
            {t("landing.hero.cta")}
          </Button>
        </div>
      </div>
    </section>
  );
};
