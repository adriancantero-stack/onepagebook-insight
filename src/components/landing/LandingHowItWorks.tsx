import { useTranslation } from "react-i18next";

export const LandingHowItWorks = () => {
  const { t } = useTranslation();

  return (
    <section className="container mx-auto px-6 py-16 sm:px-12 sm:py-24 lg:px-24">
      <h2 className="mb-16 text-center text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
        {t("landing.howItWorks.title")}
      </h2>

      <div className="grid gap-12 md:grid-cols-3">
        <div className="group space-y-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-primary-foreground transition-all group-hover:scale-110">
            1
          </div>
          <h3 className="text-xl font-semibold">{t("landing.howItWorks.step1.title")}</h3>
          <p className="text-muted-foreground">{t("landing.howItWorks.step1.description")}</p>
        </div>

        <div className="group space-y-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-primary-foreground transition-all group-hover:scale-110">
            2
          </div>
          <h3 className="text-xl font-semibold">{t("landing.howItWorks.step2.title")}</h3>
          <p className="text-muted-foreground">{t("landing.howItWorks.step2.description")}</p>
        </div>

        <div className="group space-y-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-primary-foreground transition-all group-hover:scale-110">
            3
          </div>
          <h3 className="text-xl font-semibold">{t("landing.howItWorks.step3.title")}</h3>
          <p className="text-muted-foreground">{t("landing.howItWorks.step3.description")}</p>
        </div>
      </div>
    </section>
  );
};
