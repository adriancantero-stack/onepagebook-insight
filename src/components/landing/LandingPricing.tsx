import { useTranslation } from "react-i18next";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePricing } from "@/hooks/usePricing";

interface LandingPricingProps {
  onCTA: () => void;
}

export const LandingPricing = ({ onCTA }: LandingPricingProps) => {
  const { t } = useTranslation();
  const pricing = usePricing();

  return (
    <section className="border-t border-border bg-muted/30 py-16 sm:py-24 lg:py-32">
      <div className="container mx-auto px-6 sm:px-12 lg:px-24">
        <h2 className="mb-16 text-center text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
          {t("landing.plans.title")}
        </h2>

        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
          <Card className="relative p-8 transition-all hover:shadow-xl">
            <h3 className="mb-4 text-2xl font-bold">{t("landing.plans.free.title")}</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold">{pricing.free}</span>
              <span className="text-muted-foreground">{t("landing.plans.free.period")}</span>
            </div>
            <ul className="mb-8 space-y-3">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 shrink-0 text-primary" />
                <span>{t("landing.plans.free.feature1")}</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 shrink-0 text-primary" />
                <span>{t("landing.plans.free.feature2")}</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 shrink-0 text-primary" />
                <span>{t("landing.plans.free.feature3")}</span>
              </li>
            </ul>
            <Button onClick={onCTA} variant="outline" className="w-full">
              {t("landing.plans.free.cta")}
            </Button>
          </Card>

          <Card className="relative border-2 border-primary p-8 shadow-xl transition-all hover:shadow-2xl">
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary px-4 py-1 text-xs font-semibold">
              {t("landing.plans.premium.badge")}
            </Badge>

            <h3 className="mb-4 text-2xl font-bold">{t("landing.plans.premium.title")}</h3>
            <div className="mb-2">
              <span className="text-4xl font-bold">{pricing.premium}</span>
              <span className="text-muted-foreground">{t("landing.plans.premium.period")}</span>
            </div>
            <p className="mb-6 text-sm text-muted-foreground">{t("landing.pricing.valueProposition")}</p>

            <ul className="mb-6 space-y-3">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 shrink-0 text-primary" />
                <span>{t("landing.plans.premium.feature1")}</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 shrink-0 text-primary" />
                <span>{t("landing.plans.premium.feature2")}</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 shrink-0 text-primary" />
                <span>{t("landing.plans.premium.feature3")}</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 shrink-0 text-primary" />
                <span>{t("landing.plans.premium.feature4")}</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 shrink-0 text-primary" />
                <span>{t("landing.plans.premium.feature5")}</span>
              </li>
            </ul>

            <Button onClick={onCTA} className="mb-4 w-full shadow-lg transition-all hover:scale-105">
              {t("landing.plans.premium.cta")}
            </Button>

            <p className="text-center text-xs text-muted-foreground">{t("landing.pricing.cancelAnytime")}</p>
          </Card>
        </div>
      </div>
    </section>
  );
};
