import { useTranslation } from "react-i18next";

export const LandingBenefits = () => {
  const { t } = useTranslation();

  return (
    <section className="container mx-auto px-6 py-16 sm:px-12 sm:py-24 lg:px-24 bg-white">
      <h2 className="mb-16 text-center text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
        {t("landing.benefits.title")}
      </h2>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="group space-y-4 rounded-2xl border border-border bg-card p-8 text-center shadow-sm transition-all hover:shadow-lg hover:border-primary/50">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 transition-all group-hover:scale-110 group-hover:bg-primary/20">
            <span className="text-4xl">🧩</span>
          </div>
          <h3 className="text-xl font-semibold">{t("landing.benefits.ai.title")}</h3>
          <p className="text-muted-foreground">{t("landing.benefits.ai.description")}</p>
        </div>

        <div className="group space-y-4 rounded-2xl border border-border bg-card p-8 text-center shadow-sm transition-all hover:shadow-lg hover:border-primary/50">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 transition-all group-hover:scale-110 group-hover:bg-primary/20">
            <span className="text-4xl">⚡</span>
          </div>
          <h3 className="text-xl font-semibold">{t("landing.benefits.time.title")}</h3>
          <p className="text-muted-foreground">{t("landing.benefits.time.description")}</p>
        </div>

        <div className="group space-y-4 rounded-2xl border border-border bg-card p-8 text-center shadow-sm transition-all hover:shadow-lg hover:border-primary/50">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 transition-all group-hover:scale-110 group-hover:bg-primary/20">
            <span className="text-4xl">🌍</span>
          </div>
          <h3 className="text-xl font-semibold">{t("landing.benefits.multilingual.title")}</h3>
          <p className="text-muted-foreground">{t("landing.benefits.multilingual.description")}</p>
        </div>
      </div>
    </section>
  );
};
