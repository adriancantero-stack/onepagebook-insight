import { useTranslation } from "react-i18next";
import { Clock, Zap, BookOpen } from "lucide-react";

export const LandingBenefits = () => {
  const { t } = useTranslation();

  return (
    <section className="border-t border-border bg-muted/30 py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-24">
        <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="group space-y-3 sm:space-y-4 text-center transition-all hover:scale-105">
            <div className="mx-auto flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-primary/10">
              <Clock className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold">{t("landing.benefits.time.title")}</h3>
            <p className="text-sm sm:text-base text-muted-foreground px-2">{t("landing.benefits.time.description")}</p>
          </div>

          <div className="group space-y-3 sm:space-y-4 text-center transition-all hover:scale-105">
            <div className="mx-auto flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-primary/10">
              <BookOpen className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold">{t("landing.benefits.smart.title")}</h3>
            <p className="text-sm sm:text-base text-muted-foreground px-2">{t("landing.benefits.smart.description")}</p>
          </div>

          <div className="group space-y-3 sm:space-y-4 text-center transition-all hover:scale-105 sm:col-span-2 lg:col-span-1">
            <div className="mx-auto flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-primary/10">
              <Zap className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold">{t("landing.benefits.action.title")}</h3>
            <p className="text-sm sm:text-base text-muted-foreground px-2">{t("landing.benefits.action.description")}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
