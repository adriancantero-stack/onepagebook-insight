import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Clock, BookOpen, Zap, CheckCircle2, Quote } from "lucide-react";
import atomicHabits from "@/assets/books/atomic-habits.jpg";
import richDadPoorDad from "@/assets/books/rich-dad-poor-dad.jpg";
import powerOfHabit from "@/assets/books/power-of-habit.jpg";
import heroMockupPt from "@/assets/hero-mockup-pt.jpg";
import heroMockupEn from "@/assets/hero-mockup-en.jpg";
import heroMockupEs from "@/assets/hero-mockup-es.jpg";

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
    { title: "Atomic Habits", author: "James Clear", image: atomicHabits },
    { title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", image: richDadPoorDad },
    { title: "The Power of Habit", author: "Charles Duhigg", image: powerOfHabit },
  ];

  const heroMockup = lang === "pt" ? heroMockupPt : lang === "es" ? heroMockupEs : heroMockupEn;

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
      <section className="container mx-auto px-4 py-8 md:py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-4 md:space-y-6 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              {t("landing.hero.headline")}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
              {t("landing.hero.subtitle")}
            </p>
            <Button
              size="lg"
              onClick={handleCTA}
              className="w-full sm:w-auto text-base md:text-lg px-6 md:px-8 py-5 md:py-6 bg-primary hover:bg-primary/90 transition-all hover:scale-105"
            >
              {t("landing.hero.cta")}
            </Button>
          </div>
          
          {/* Hero Mockup */}
          <div className="hidden lg:block">
            <div className="rounded-lg overflow-hidden shadow-2xl">
              <img 
                src={heroMockup} 
                alt="OnePageBook Summary Example"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-muted/30 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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
      <section className="container mx-auto px-4 py-12 md:py-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12">
          {t("landing.howItWorks.title")}
        </h2>
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
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
      <section className="bg-muted/30 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">
            {t("landing.social.title")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 max-w-3xl mx-auto">
            {books.map((book, idx) => (
              <Card key={idx} className="p-4 md:p-6 text-center hover:shadow-lg transition-shadow">
                <div className="aspect-[2/3] rounded mb-3 md:mb-4 overflow-hidden bg-muted">
                  <img 
                    src={book.image} 
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="font-bold text-xs sm:text-sm mb-1">{book.title}</h4>
                <p className="text-xs text-muted-foreground">{book.author}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12">
          {t("landing.testimonials.title")}
        </h2>
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          <Card className="p-6 md:p-8 relative">
            <Quote className="h-8 w-8 text-primary/20 absolute top-4 right-4" />
            <p className="text-sm md:text-base text-muted-foreground mb-4 italic">
              "{t("landing.testimonials.testimonial1.quote")}"
            </p>
            <div>
              <p className="font-bold text-sm md:text-base">{t("landing.testimonials.testimonial1.author")}</p>
              <p className="text-xs md:text-sm text-muted-foreground">{t("landing.testimonials.testimonial1.role")}</p>
            </div>
          </Card>

          <Card className="p-6 md:p-8 relative">
            <Quote className="h-8 w-8 text-primary/20 absolute top-4 right-4" />
            <p className="text-sm md:text-base text-muted-foreground mb-4 italic">
              "{t("landing.testimonials.testimonial2.quote")}"
            </p>
            <div>
              <p className="font-bold text-sm md:text-base">{t("landing.testimonials.testimonial2.author")}</p>
              <p className="text-xs md:text-sm text-muted-foreground">{t("landing.testimonials.testimonial2.role")}</p>
            </div>
          </Card>

          <Card className="p-6 md:p-8 relative">
            <Quote className="h-8 w-8 text-primary/20 absolute top-4 right-4" />
            <p className="text-sm md:text-base text-muted-foreground mb-4 italic">
              "{t("landing.testimonials.testimonial3.quote")}"
            </p>
            <div>
              <p className="font-bold text-sm md:text-base">{t("landing.testimonials.testimonial3.author")}</p>
              <p className="text-xs md:text-sm text-muted-foreground">{t("landing.testimonials.testimonial3.role")}</p>
            </div>
          </Card>
        </div>
      </section>

      {/* Plans Section */}
      <section className="bg-muted/30 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12">
            {t("landing.plans.title")}
          </h2>
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <Card className="p-6 md:p-8 hover:shadow-xl transition-all">
              <h3 className="text-xl md:text-2xl font-bold mb-2">{t("landing.plans.free.title")}</h3>
              <div className="mb-4 md:mb-6">
                <span className="text-3xl md:text-4xl font-bold">{t("landing.plans.free.price")}</span>
                <span className="text-muted-foreground text-sm md:text-base">{t("landing.plans.free.period")}</span>
              </div>
              <ul className="space-y-2 md:space-y-3 mb-6 md:mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-primary flex-shrink-0" />
                  <span className="text-sm md:text-base">{t("landing.plans.free.feature1")}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-primary flex-shrink-0" />
                  <span className="text-sm md:text-base">{t("landing.plans.free.feature2")}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-primary flex-shrink-0" />
                  <span className="text-sm md:text-base">{t("landing.plans.free.feature3")}</span>
                </li>
              </ul>
              <Button onClick={handleCTA} variant="outline" className="w-full text-sm md:text-base">
                {t("landing.plans.free.cta")}
              </Button>
            </Card>

            {/* Premium Plan */}
            <Card className="p-6 md:p-8 border-primary border-2 relative hover:shadow-xl transition-all">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 md:px-4 py-1 rounded-full text-xs md:text-sm font-bold">
                {t("plans.recommended")}
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-2">{t("landing.plans.premium.title")}</h3>
              <div className="mb-4 md:mb-6">
                <span className="text-3xl md:text-4xl font-bold">{t("landing.plans.premium.price")}</span>
                <span className="text-muted-foreground text-sm md:text-base">{t("landing.plans.premium.period")}</span>
              </div>
              <ul className="space-y-2 md:space-y-3 mb-6 md:mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-primary flex-shrink-0" />
                  <span className="text-sm md:text-base">{t("landing.plans.premium.feature1")}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-primary flex-shrink-0" />
                  <span className="text-sm md:text-base">{t("landing.plans.premium.feature2")}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-primary flex-shrink-0" />
                  <span className="text-sm md:text-base">{t("landing.plans.premium.feature3")}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-primary flex-shrink-0" />
                  <span className="text-sm md:text-base">{t("landing.plans.premium.feature4")}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-primary flex-shrink-0" />
                  <span className="text-sm md:text-base">{t("landing.plans.premium.feature5")}</span>
                </li>
              </ul>
              <Button onClick={handleCTA} className="w-full text-sm md:text-base">
                {t("landing.plans.premium.cta")}
              </Button>
            </Card>
          </div>
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
