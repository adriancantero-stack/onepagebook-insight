import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface LandingFinalCTAProps {
  onCTA: () => void;
}

export const LandingFinalCTA = ({ onCTA }: LandingFinalCTAProps) => {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900/50 to-gray-900 py-20 sm:py-28">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
      
      <div className="container relative mx-auto px-6 sm:px-12 lg:px-24">
        <div className="mx-auto max-w-3xl text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-medium text-white">{t("landing.finalCta.badge")}</span>
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl xl:text-6xl">
            {t("landing.finalCta.headline")}
          </h2>

          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
            {t("landing.finalCta.subtext")}
          </p>

          <div className="pt-4">
            <Button
              size="lg"
              onClick={onCTA}
              className="h-14 px-10 text-lg font-semibold shadow-2xl transition-all hover:scale-105 bg-gradient-to-r from-primary via-purple-600 to-primary bg-size-200 bg-pos-0 hover:bg-pos-100 animate-gradient"
            >
              {t("landing.finalCta.cta")}
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-8 pt-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>{t("landing.finalCta.free")}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>{t("landing.finalCta.noCard")}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>{t("landing.finalCta.instant")}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
