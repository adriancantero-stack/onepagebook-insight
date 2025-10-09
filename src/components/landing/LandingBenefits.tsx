import { useTranslation } from "react-i18next";
import { Clock, Zap, BookOpen } from "lucide-react";

export const LandingBenefits = () => {
  const { t } = useTranslation();

  return (
    <section className="border-t border-border bg-muted/30 py-16 sm:py-20">
      <div className="container mx-auto px-6 sm:px-12 lg:px-24">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="group space-y-4 text-center transition-all hover:scale-105">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Clock className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">{t("landing.benefits.time.title")}</h3>
            <p className="text-muted-foreground">{t("landing.benefits.time.description")}</p>
          </div>

          <div className="group space-y-4 text-center transition-all hover:scale-105">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <BookOpen className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">{t("landing.benefits.smart.title")}</h3>
            <p className="text-muted-foreground">{t("landing.benefits.smart.description")}</p>
          </div>

          <div className="group space-y-4 text-center transition-all hover:scale-105 sm:col-span-2 lg:col-span-1">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Zap className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">{t("landing.benefits.action.title")}</h3>
            <p className="text-muted-foreground">{t("landing.benefits.action.description")}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
