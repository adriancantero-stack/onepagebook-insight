import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { DemoCarousel } from "./DemoCarousel";

interface LandingHeroBOptimizedProps {
  onCTA: () => void;
}

export default function LandingHeroBOptimized({ onCTA }: LandingHeroBOptimizedProps) {
  const { t } = useTranslation();

  const scrollToHowItWorks = () => {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-purple-50/30 to-background py-12 sm:py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-24">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Text Content */}
      <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
            {t("landing.hero.headline")}
          </span>
        </h1>

        <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground leading-relaxed">
          {t("landing.hero.subheadline")}
        </p>

        <p className="text-sm sm:text-base text-muted-foreground">
          {t("landing.finalCta.subtext")}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
          <Button
            size="lg"
            onClick={onCTA}
            className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
          >
            {t("landing.hero.ctaPrimary")}
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            onClick={scrollToHowItWorks}
            className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg font-semibold w-full sm:w-auto"
          >
            {t("landing.hero.ctaSecondary")}
          </Button>
        </div>
      </div>

          {/* Visual Demo Carousel */}
          <div className="relative mt-8 lg:mt-0">
            <DemoCarousel />
          </div>
        </div>
      </div>
    </section>
  );
}
