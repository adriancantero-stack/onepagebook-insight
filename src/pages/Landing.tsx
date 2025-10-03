import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Clock, BookOpen, Zap, CheckCircle2 } from "lucide-react";

interface LandingProps {
  lang: "pt" | "es" | "en";
}

export default function Landing({ lang }: LandingProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
  }, [lang, i18n]);

  const handleCTA = () => {
    navigate(`/auth?lang=${lang}`);
  };

  const books = [
    { title: "Atomic Habits", author: "James Clear" },
    { title: "Rich Dad Poor Dad", author: "Robert Kiyosaki" },
    { title: "The Power of Habit", author: "Charles Duhigg" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">OnePageBook</span>
          </div>
          <LanguageSelector />
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-20 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              {t("landing.hero.headline")}
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground">
              {t("landing.hero.subtitle")}
            </p>
            <Button
              size="lg"
              onClick={handleCTA}
              className="w-full sm:w-auto text-lg px-8 py-6 bg-primary hover:bg-primary/90 transition-all hover:scale-105"
            >
              {t("landing.hero.cta")}
            </Button>
          </div>
          
          {/* Mockup placeholder */}
          <div className="hidden lg:block">
            <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <div className="space-y-4">
                <div className="h-8 bg-primary/20 rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
                <div className="h-4 bg-muted rounded w-4/6"></div>
                <div className="space-y-2 pt-4">
                  <div className="h-3 bg-primary/30 rounded w-full"></div>
                  <div className="h-3 bg-primary/30 rounded w-full"></div>
                  <div className="h-3 bg-primary/30 rounded w-3/4"></div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 text-center hover:shadow-lg transition-all hover:scale-105">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t("landing.benefits.time.title")}</h3>
              <p className="text-muted-foreground">{t("landing.benefits.time.desc")}</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-all hover:scale-105">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t("landing.benefits.learn.title")}</h3>
              <p className="text-muted-foreground">{t("landing.benefits.learn.desc")}</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-all hover:scale-105 sm:col-span-2 lg:col-span-1">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t("landing.benefits.apply.title")}</h3>
              <p className="text-muted-foreground">{t("landing.benefits.apply.desc")}</p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
          {t("landing.howItWorks.title")}
        </h2>
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">
              1
            </div>
            <h3 className="text-xl font-bold">{t("landing.howItWorks.step1.title")}</h3>
            <p className="text-muted-foreground">{t("landing.howItWorks.step1.desc")}</p>
          </div>

          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">
              2
            </div>
            <h3 className="text-xl font-bold">{t("landing.howItWorks.step2.title")}</h3>
            <p className="text-muted-foreground">{t("landing.howItWorks.step2.desc")}</p>
          </div>

          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">
              3
            </div>
            <h3 className="text-xl font-bold">{t("landing.howItWorks.step3.title")}</h3>
            <p className="text-muted-foreground">{t("landing.howItWorks.step3.desc")}</p>
          </div>
        </div>
        <div className="text-center">
          <Button size="lg" onClick={handleCTA} variant="outline" className="px-8">
            {t("landing.howItWorks.cta")}
          </Button>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
            {t("landing.social.title")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {books.map((book, idx) => (
              <Card key={idx} className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="h-32 bg-gradient-to-br from-primary/20 to-primary/5 rounded mb-4 flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-primary/40" />
                </div>
                <h4 className="font-bold text-sm mb-1">{book.title}</h4>
                <p className="text-xs text-muted-foreground">{book.author}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
          {t("landing.plans.title")}
        </h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card className="p-8 hover:shadow-xl transition-all">
            <h3 className="text-2xl font-bold mb-2">{t("landing.plans.free.title")}</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold">{t("landing.plans.free.price")}</span>
              <span className="text-muted-foreground">{t("landing.plans.free.period")}</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>{t("landing.plans.free.feature1")}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>{t("landing.plans.free.feature2")}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>{t("landing.plans.free.feature3")}</span>
              </li>
            </ul>
            <Button onClick={handleCTA} variant="outline" className="w-full">
              {t("landing.plans.free.cta")}
            </Button>
          </Card>

          {/* Premium Plan */}
          <Card className="p-8 border-primary border-2 relative hover:shadow-xl transition-all">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold">
              {t("plans.recommended")}
            </div>
            <h3 className="text-2xl font-bold mb-2">{t("landing.plans.premium.title")}</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold">{t("landing.plans.premium.price")}</span>
              <span className="text-muted-foreground">{t("landing.plans.premium.period")}</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>{t("landing.plans.premium.feature1")}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>{t("landing.plans.premium.feature2")}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>{t("landing.plans.premium.feature3")}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>{t("landing.plans.premium.feature4")}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>{t("landing.plans.premium.feature5")}</span>
              </li>
            </ul>
            <Button onClick={handleCTA} className="w-full">
              {t("landing.plans.premium.cta")}
            </Button>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/30 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <a href={`/${lang}/faq`} className="hover:text-foreground transition-colors">
                {t("footer.faq")}
              </a>
              <a href={`/${lang}/terms`} className="hover:text-foreground transition-colors">
                {t("footer.terms")}
              </a>
              <a href={`/${lang}/privacy`} className="hover:text-foreground transition-colors">
                {t("footer.privacy")}
              </a>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-muted-foreground mb-1">
                {t("footer.tagline")}
              </p>
              <p className="text-xs text-muted-foreground">
                {t("footer.copyright", { year: new Date().getFullYear() })}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
