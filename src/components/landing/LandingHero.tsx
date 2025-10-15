import { useTranslation } from "react-i18next";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBook from "@/assets/hero-book-optimized.png";
import heroAI from "@/assets/hero-ai-optimized.png";
import heroSummary from "@/assets/hero-summary-optimized.png";
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
      {/* Single column layout - text above, icons below */}
      <div className="max-w-5xl mx-auto space-y-12 flex flex-col">
        {/* Text Content - Centralized */}
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

          <p className="text-sm sm:text-base text-muted-foreground animate-fade-in flex items-start gap-2 justify-center" style={{
          animationDelay: "0.3s"
        }}>
            <span className="text-base sm:text-lg inline-flex items-center">🌍</span>
            {t("landing.hero.socialProof")}
          </p>
        </div>

        {/* Visual Illustration - Below, Centralized */}
        <div className="relative animate-fade-in pt-8 sm:pt-12" style={{
        animationDelay: "0.4s"
      }}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-3 lg:gap-4">
            <div className="flex flex-col items-center gap-3 group">
              <div className="rounded-2xl bg-primary/5 p-6 sm:p-8 lg:p-10 border border-primary/10 transition-transform group-hover:scale-110 px-[32px] mx-0">
                <img src={heroBook} alt="Book icon" className="h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28" loading="eager" decoding="async" width="112" height="112" />
              </div>
              <p className="text-xs sm:text-sm lg:text-base font-medium text-muted-foreground">{t("landing.hero.visual.book")}</p>
            </div>

            <ArrowDown className="h-8 w-8 text-primary sm:rotate-[-90deg] sm:h-10 sm:w-10" />
            
            <div className="flex flex-col items-center gap-3 group">
              <div className="rounded-2xl bg-primary/5 p-6 sm:p-8 lg:p-10 border border-primary/10 transition-transform group-hover:scale-110">
                <img src={heroAI} alt="AI icon" className="h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28" loading="eager" decoding="async" width="112" height="112" />
              </div>
              <p className="text-xs sm:text-sm lg:text-base font-medium text-muted-foreground">{t("landing.hero.visual.ai")}</p>
            </div>

            <ArrowDown className="h-8 w-8 text-primary sm:rotate-[-90deg] sm:h-10 sm:w-10" />
            
            <div className="flex flex-col items-center gap-3 group">
              <div className="rounded-2xl bg-primary/5 p-6 sm:p-8 lg:p-10 border border-primary/10 transition-transform group-hover:scale-110">
                <img src={heroSummary} alt="Summary icon" className="h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28" loading="eager" decoding="async" width="112" height="112" />
              </div>
              <p className="text-xs sm:text-sm lg:text-base font-medium text-muted-foreground">{t("landing.hero.visual.summary")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>;
};