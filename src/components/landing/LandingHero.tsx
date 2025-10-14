import { useTranslation } from "react-i18next";
import { BookOpen, Sparkles, FileText, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LandingHeroProps {
  onCTA: () => void;
}

export const LandingHero = ({ onCTA }: LandingHeroProps) => {
  const { t } = useTranslation();

  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="container mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-24 lg:py-20">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
        {/* Left: Text Content */}
        <div className="space-y-6 text-center lg:text-left">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl xl:text-6xl animate-fade-in leading-tight">
            {t("landing.hero.headline")}
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground animate-fade-in" style={{animationDelay: "0.1s"}}>
            {t("landing.hero.subheadline")}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 pt-2 animate-fade-in justify-center lg:justify-start" style={{animationDelay: "0.2s"}}>
            <Button
              size="lg"
              onClick={onCTA}
              className="h-11 px-6 text-sm font-medium shadow-lg transition-all hover:scale-105 sm:h-12 sm:px-8 sm:text-base lg:h-14 lg:px-10 lg:text-lg w-full sm:w-auto"
            >
              {t("landing.hero.ctaPrimary")}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={scrollToHowItWorks}
              className="h-11 px-6 text-sm font-medium transition-all hover:scale-105 sm:h-12 sm:px-8 sm:text-base lg:h-14 lg:px-10 lg:text-lg w-full sm:w-auto"
            >
              {t("landing.hero.ctaSecondary")}
            </Button>
          </div>

          <p className="text-sm sm:text-base text-muted-foreground animate-fade-in flex items-center gap-2 justify-center lg:justify-start" style={{animationDelay: "0.3s"}}>
            <span className="text-lg">🌍</span>
            {t("landing.hero.socialProof")}
          </p>
        </div>

        {/* Right: Visual Illustration */}
        <div className="relative animate-fade-in" style={{animationDelay: "0.2s"}}>
          <div className="relative mx-auto max-w-md lg:max-w-none">
            {/* Book to AI to Summary Animation */}
            <div className="flex items-center justify-center gap-4 sm:gap-6">
              <div className="flex flex-col items-center gap-3 animate-pulse">
                <div className="rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 p-6 sm:p-8 backdrop-blur-sm border border-primary/20">
                  <BookOpen className="h-12 w-12 sm:h-16 sm:w-16 text-primary" />
                </div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">{t("landing.hero.visual.book")}</p>
              </div>

              <ArrowDown className="h-6 w-6 sm:h-8 sm:w-8 text-primary rotate-[-90deg] hidden sm:block" />
              
              <div className="flex flex-col items-center gap-3 animate-pulse" style={{animationDelay: "0.3s"}}>
                <div className="rounded-2xl bg-gradient-to-br from-purple-500/20 to-primary/20 p-6 sm:p-8 backdrop-blur-sm border border-purple-500/20">
                  <Sparkles className="h-12 w-12 sm:h-16 sm:w-16 text-purple-600" />
                </div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">{t("landing.hero.visual.ai")}</p>
              </div>

              <ArrowDown className="h-6 w-6 sm:h-8 sm:w-8 text-primary rotate-[-90deg] hidden sm:block" />
              
              <div className="flex flex-col items-center gap-3 animate-pulse" style={{animationDelay: "0.6s"}}>
                <div className="rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 p-6 sm:p-8 backdrop-blur-sm border border-primary/20">
                  <FileText className="h-12 w-12 sm:h-16 sm:w-16 text-primary" />
                </div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">{t("landing.hero.visual.summary")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
