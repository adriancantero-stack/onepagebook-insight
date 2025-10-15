import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
interface LandingHeroProps {
  onCTA: () => void;
}
export const LandingHero = ({
  onCTA
}: LandingHeroProps) => {
  const {
    t
  } = useTranslation();
  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  return <section className="container mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-24 lg:py-20">
      <div className="max-w-5xl mx-auto">
        <div className="space-y-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl xl:text-6xl animate-fade-in leading-tight">
            {t("landing.hero.headline")}
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground animate-fade-in max-w-3xl mx-auto" style={{
          animationDelay: "0.1s"
        }}>
            {t("landing.hero.subheadline")}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 pt-2 animate-fade-in justify-center" style={{
          animationDelay: "0.2s"
        }}>
            <Button size="lg" onClick={onCTA} className="h-11 px-6 text-sm font-medium shadow-lg transition-all hover:scale-105 sm:h-12 sm:px-8 sm:text-base lg:h-14 lg:px-10 lg:text-lg w-full sm:w-auto">
              {t("landing.hero.ctaPrimary")}
            </Button>
            <Button size="lg" variant="outline" onClick={scrollToHowItWorks} className="h-11 px-6 text-sm font-medium transition-all hover:scale-105 sm:h-12 sm:px-8 sm:text-base lg:h-14 lg:px-10 lg:text-lg w-full sm:w-auto">
              {t("landing.hero.ctaSecondary")}
            </Button>
          </div>

          <p className="text-sm sm:text-base text-muted-foreground animate-fade-in flex items-center gap-2 justify-center" style={{
          animationDelay: "0.3s"
        }}>
            <span className="text-lg">🌍</span>
            {t("landing.hero.socialProof")}
          </p>
        </div>
      </div>
    </section>;
};