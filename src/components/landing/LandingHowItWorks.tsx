import { useTranslation } from "react-i18next";
import { Search, Sparkles, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LandingHowItWorksProps {
  onCTA: () => void;
}

export const LandingHowItWorks = ({ onCTA }: LandingHowItWorksProps) => {
  const { t } = useTranslation();

  return (
    <section id="how-it-works" className="container mx-auto px-6 py-16 sm:px-12 sm:py-24 lg:px-24 bg-gradient-to-b from-lilac-50/50 to-white">
      <h2 className="mb-16 text-center text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
        {t("landing.howItWorks.title")}
      </h2>

      <div className="grid gap-12 md:grid-cols-3 mb-12">
        <div className="group space-y-6 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-purple-600 transition-all group-hover:scale-110 shadow-lg">
            <Search className="h-10 w-10 text-white" />
          </div>
          <div className="space-y-2">
            <div className="text-sm font-semibold text-primary">1️⃣</div>
            <h3 className="text-xl font-semibold">{t("landing.howItWorks.step1.title")}</h3>
            <p className="text-muted-foreground">{t("landing.howItWorks.step1.description")}</p>
          </div>
        </div>

        <div className="group space-y-6 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-purple-600 transition-all group-hover:scale-110 shadow-lg">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <div className="space-y-2">
            <div className="text-sm font-semibold text-primary">2️⃣</div>
            <h3 className="text-xl font-semibold">{t("landing.howItWorks.step2.title")}</h3>
            <p className="text-muted-foreground">{t("landing.howItWorks.step2.description")}</p>
          </div>
        </div>

        <div className="group space-y-6 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-purple-600 transition-all group-hover:scale-110 shadow-lg">
            <Download className="h-10 w-10 text-white" />
          </div>
          <div className="space-y-2">
            <div className="text-sm font-semibold text-primary">3️⃣</div>
            <h3 className="text-xl font-semibold">{t("landing.howItWorks.step3.title")}</h3>
            <p className="text-muted-foreground">{t("landing.howItWorks.step3.description")}</p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Button
          size="lg"
          onClick={onCTA}
          className="h-12 px-8 text-base font-medium shadow-lg transition-all hover:scale-105 sm:h-14 sm:px-10 sm:text-lg"
        >
          {t("landing.howItWorks.cta")}
        </Button>
      </div>
    </section>
  );
};
