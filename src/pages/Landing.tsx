import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Clock, Zap, BookOpen, Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LanguageSelector } from "@/components/LanguageSelector";
import Footer from "@/components/Footer";
import { useSEO } from "@/hooks/useSEO";
import { usePricing } from "@/hooks/usePricing";
import logoGray from "@/assets/logo-gray.png";
import atomicHabits from "@/assets/books/atomic-habits.jpg";
import richDadPoorDad from "@/assets/books/rich-dad-poor-dad.jpg";
import powerOfHabit from "@/assets/books/power-of-habit.jpg";
import ptPerson1 from "@/assets/testimonials/pt-person1.jpg";
import ptPerson2 from "@/assets/testimonials/pt-person2.jpg";
import ptPerson3 from "@/assets/testimonials/pt-person3.jpg";
import enPerson1 from "@/assets/testimonials/en-person1.jpg";
import enPerson2 from "@/assets/testimonials/en-person2.jpg";
import enPerson3 from "@/assets/testimonials/en-person3.jpg";
import esPerson1 from "@/assets/testimonials/es-person1.jpg";
import esPerson2 from "@/assets/testimonials/es-person2.jpg";
import esPerson3 from "@/assets/testimonials/es-person3.jpg";

interface LandingProps {
  lang: "pt" | "es" | "en";
}

const Landing = ({ lang }: LandingProps) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const pricing = usePricing();

  const seoConfigs = {
    pt: {
      title: "OnePageBook - Transforme sua forma de aprender | Resumos IA",
      description: "Aprenda 10 livros em 10 minutos com resumos inteligentes de uma página. IA avançada, insights práticos, ação imediata.",
      path: "/pt",
    },
    en: {
      title: "OnePageBook - Transform the way you learn | AI Summaries",
      description: "Learn 10 books in 10 minutes with smart one-page summaries. Advanced AI, actionable insights, immediate action.",
      path: "/en",
    },
    es: {
      title: "OnePageBook - Transforma tu forma de aprender | Resúmenes IA",
      description: "Aprende 10 libros en 10 minutos con resúmenes inteligentes de una página. IA avanzada, insights prácticos, acción inmediata.",
      path: "/es",
    },
  };

  const config = seoConfigs[lang];
  useSEO({
    title: config.title,
    description: config.description,
    lang,
    path: config.path,
  });

  useEffect(() => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
  }, [lang, i18n]);

  const testimonialImages = {
    pt: [ptPerson1, ptPerson2, ptPerson3],
    en: [enPerson1, enPerson2, enPerson3],
    es: [esPerson1, esPerson2, esPerson3],
  };

  const featuredBooks = [
    { image: atomicHabits, title: "Atomic Habits" },
    { image: richDadPoorDad, title: "Rich Dad Poor Dad" },
    { image: powerOfHabit, title: "The Power of Habit" },
  ];

  const handleCTA = () => {
    navigate(`/auth?lang=${lang}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-6 sm:px-12 lg:px-24">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold tracking-tight">OnePageBook</span>
          </div>
          <LanguageSelector />
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 sm:px-12 sm:py-24 lg:px-24 lg:py-32">
        <div className="mx-auto max-w-4xl space-y-8 text-center">
          {/* Badge */}
          <Badge variant="secondary" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-normal">
            <Star className="h-3 w-3 fill-primary text-primary" />
            {t("landing.hero.badge")}
          </Badge>

          {/* Title */}
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl animate-fade-in">
            {t("landing.hero.title")}
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl animate-fade-in" style={{animationDelay: "0.1s"}}>
            {t("landing.hero.subtitle")}
          </p>

          {/* CTA */}
          <div className="flex flex-col items-center gap-4 pt-4 animate-fade-in" style={{animationDelay: "0.2s"}}>
            <Button
              size="lg"
              onClick={handleCTA}
              className="h-12 px-8 text-base font-medium shadow-lg transition-all hover:scale-105 sm:h-14 sm:px-10 sm:text-lg"
            >
              {t("landing.hero.cta")}
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="border-t border-border bg-muted/30 py-16 sm:py-20">
        <div className="container mx-auto px-6 sm:px-12 lg:px-24">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Benefit 1 */}
            <div className="group space-y-4 text-center transition-all hover:scale-105">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <Clock className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">{t("landing.benefits.time.title")}</h3>
              <p className="text-muted-foreground">{t("landing.benefits.time.description")}</p>
            </div>

            {/* Benefit 2 */}
            <div className="group space-y-4 text-center transition-all hover:scale-105">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <BookOpen className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">{t("landing.benefits.smart.title")}</h3>
              <p className="text-muted-foreground">{t("landing.benefits.smart.description")}</p>
            </div>

            {/* Benefit 3 */}
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

      {/* How It Works Section */}
      <section className="container mx-auto px-6 py-16 sm:px-12 sm:py-24 lg:px-24">
        <h2 className="mb-16 text-center text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
          {t("landing.howItWorks.title")}
        </h2>

        <div className="grid gap-12 md:grid-cols-3">
          {/* Step 1 */}
          <div className="group space-y-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-primary-foreground transition-all group-hover:scale-110">
              1
            </div>
            <h3 className="text-xl font-semibold">{t("landing.howItWorks.step1.title")}</h3>
            <p className="text-muted-foreground">{t("landing.howItWorks.step1.description")}</p>
          </div>

          {/* Step 2 */}
          <div className="group space-y-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-primary-foreground transition-all group-hover:scale-110">
              2
            </div>
            <h3 className="text-xl font-semibold">{t("landing.howItWorks.step2.title")}</h3>
            <p className="text-muted-foreground">{t("landing.howItWorks.step2.description")}</p>
          </div>

          {/* Step 3 */}
          <div className="group space-y-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-primary-foreground transition-all group-hover:scale-110">
              3
            </div>
            <h3 className="text-xl font-semibold">{t("landing.howItWorks.step3.title")}</h3>
            <p className="text-muted-foreground">{t("landing.howItWorks.step3.description")}</p>
          </div>
        </div>
      </section>

      {/* Library Preview Section - Moved after How It Works */}
      <section className="border-t border-border bg-muted/30 py-16 sm:py-20">
        <div className="container mx-auto px-6 sm:px-12 lg:px-24">
          <h2 className="mb-12 text-center text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            {t("landing.library.title")}
          </h2>

          <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-3">
            {featuredBooks.map((book, idx) => (
              <div key={idx} className="group space-y-4 text-center transition-all hover:scale-105">
                <div className="relative overflow-hidden rounded-xl shadow-lg">
                  <Badge className="absolute right-2 top-2 z-10 bg-primary/90 text-xs">
                    {t("landing.library.previewBadge")}
                  </Badge>
                  <img
                    src={book.image}
                    alt={book.title}
                    className="aspect-[2/3] w-full object-cover transition-all group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
                <Button onClick={handleCTA} variant="outline" size="sm" className="w-full">
                  {t("landing.library.generateCta")}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-6 py-16 sm:px-12 sm:py-24 lg:px-24">
        <div className="mb-12 space-y-3 text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            {t("landing.testimonials.title")}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            {t("landing.testimonials.subtitle")}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Testimonial 1 */}
          <Card className="p-8 transition-all hover:shadow-lg">
            <p className="mb-6 italic text-muted-foreground">
              "{t("landing.testimonials.testimonial1.text")}"
            </p>
            <div className="flex items-center gap-3">
              <img
                src={testimonialImages[lang][0]}
                alt={t("landing.testimonials.testimonial1.author")}
                className="h-12 w-12 rounded-full object-cover"
                loading="lazy"
              />
              <div>
                <p className="font-semibold">{t("landing.testimonials.testimonial1.author")}</p>
                <p className="text-sm text-muted-foreground">{t("landing.testimonials.testimonial1.role")}</p>
              </div>
            </div>
          </Card>

          {/* Testimonial 2 */}
          <Card className="p-8 transition-all hover:shadow-lg">
            <p className="mb-6 italic text-muted-foreground">
              "{t("landing.testimonials.testimonial2.text")}"
            </p>
            <div className="flex items-center gap-3">
              <img
                src={testimonialImages[lang][1]}
                alt={t("landing.testimonials.testimonial2.author")}
                className="h-12 w-12 rounded-full object-cover"
                loading="lazy"
              />
              <div>
                <p className="font-semibold">{t("landing.testimonials.testimonial2.author")}</p>
                <p className="text-sm text-muted-foreground">{t("landing.testimonials.testimonial2.role")}</p>
              </div>
            </div>
          </Card>

          {/* Testimonial 3 */}
          <Card className="p-8 transition-all hover:shadow-lg">
            <p className="mb-6 italic text-muted-foreground">
              "{t("landing.testimonials.testimonial3.text")}"
            </p>
            <div className="flex items-center gap-3">
              <img
                src={testimonialImages[lang][2]}
                alt={t("landing.testimonials.testimonial3.author")}
                className="h-12 w-12 rounded-full object-cover"
                loading="lazy"
              />
              <div>
                <p className="font-semibold">{t("landing.testimonials.testimonial3.author")}</p>
                <p className="text-sm text-muted-foreground">{t("landing.testimonials.testimonial3.role")}</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="border-t border-border bg-muted/30 py-16 sm:py-24 lg:py-32">
        <div className="container mx-auto px-6 sm:px-12 lg:px-24">
          <h2 className="mb-16 text-center text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            {t("landing.pricing.title")}
          </h2>

          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
            {/* Free Plan */}
            <Card className="relative p-8 transition-all hover:shadow-xl">
              <h3 className="mb-4 text-2xl font-bold">{t("landing.pricing.free.title")}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">{pricing.free}</span>
                <span className="text-muted-foreground">{t("landing.pricing.free.period")}</span>
              </div>
              <ul className="mb-8 space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 shrink-0 text-primary" />
                  <span>{t("landing.pricing.free.feature1")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 shrink-0 text-primary" />
                  <span>{t("landing.pricing.free.feature2")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 shrink-0 text-primary" />
                  <span>{t("landing.pricing.free.feature3")}</span>
                </li>
              </ul>
              <Button onClick={handleCTA} variant="outline" className="w-full">
                {t("landing.pricing.free.cta")}
              </Button>
            </Card>

            {/* Premium Plan */}
            <Card className="relative border-2 border-primary p-8 shadow-xl transition-all hover:shadow-2xl">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary px-4 py-1 text-xs font-semibold">
                {t("landing.pricing.premium.badge")}
              </Badge>

              <h3 className="mb-4 text-2xl font-bold">{t("landing.pricing.premium.title")}</h3>
              <div className="mb-2">
                <span className="text-4xl font-bold">{pricing.premium}</span>
                <span className="text-muted-foreground">{t("landing.pricing.premium.period")}</span>
              </div>
              <p className="mb-6 text-sm text-muted-foreground">{t("landing.pricing.valueProposition")}</p>

              <ul className="mb-6 space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 shrink-0 text-primary" />
                  <span>{t("landing.pricing.premium.feature1")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 shrink-0 text-primary" />
                  <span>{t("landing.pricing.premium.feature2")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 shrink-0 text-primary" />
                  <span>{t("landing.pricing.premium.feature3")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 shrink-0 text-primary" />
                  <span>{t("landing.pricing.premium.feature4")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 shrink-0 text-primary" />
                  <span>{t("landing.pricing.premium.feature5")}</span>
                </li>
              </ul>

              <Button onClick={handleCTA} className="mb-4 w-full shadow-lg transition-all hover:scale-105">
                {t("landing.pricing.premium.cta")}
              </Button>

              <p className="text-center text-xs text-muted-foreground">{t("landing.pricing.cancelAnytime")}</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-12">
        <div className="container mx-auto px-6 text-center sm:px-12 lg:px-24">
          <div className="mb-6 flex items-center justify-center gap-2">
            <img src={logoGray} alt="OnePageBook" className="h-8 opacity-60" loading="lazy" />
          </div>
          <p className="mb-4 text-sm text-muted-foreground">{t("landing.footer.tagline")}</p>
          <Footer />
        </div>
      </footer>
    </div>
  );
};

export default Landing;
