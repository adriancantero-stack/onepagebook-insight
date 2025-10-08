import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-[#E5E5EA] sticky top-0 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 z-50">
        <nav className="container mx-auto px-6 sm:px-12 lg:px-24 xl:px-32 py-4 flex justify-between items-center" role="navigation" aria-label="Main navigation">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-[#7B61FF]" aria-hidden="true" />
            <span className="font-semibold text-xl text-[#1D1D1F]">OnePageBook</span>
          </div>
          <LanguageSelector />
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 sm:px-12 lg:px-24 xl:px-32 py-12 md:py-16 lg:py-24" aria-labelledby="hero-title">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6 md:space-y-8 text-center lg:text-left">
            <h1 id="hero-title" className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight text-[#1D1D1F] tracking-tight">
              {t("landing.hero.headline")}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-[#86868B] font-normal">
              {t("landing.hero.subtitle")}
            </p>
            <div className="flex flex-col items-center lg:items-start gap-3">
              <Button
                size="lg"
                onClick={handleCTA}
                className="w-full sm:w-auto text-base sm:text-lg px-8 sm:px-10 md:px-14 py-5 sm:py-6 md:py-7 bg-[#7B61FF] hover:bg-[#6951E6] text-white border-none shadow-sm transition-all duration-200 hover:scale-105 rounded-xl"
              >
                {t("landing.hero.cta")}
              </Button>
              <p className="text-sm text-[#86868B]">
                {t("landing.hero.noCreditCard")}
              </p>
            </div>
          </div>
          
          {/* Hero Mockup */}
          <div className="hidden lg:block">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={heroMockup} 
                alt="Exemplo de resumo de livro gerado pela OnePageBook mostrando insights práticos"
                className="w-full h-auto"
                loading="eager"
                width="600"
                height="800"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-muted/30 py-12 md:py-16" aria-labelledby="benefits-title">
        <h2 id="benefits-title" className="sr-only">Benefícios do OnePageBook</h2>
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <article className="p-6 text-center hover:shadow-lg transition-all hover:scale-105 bg-card rounded-lg border border-border">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <Clock className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t("landing.benefits.time.title")}</h3>
              <p className="text-muted-foreground">{t("landing.benefits.time.desc")}</p>
            </article>

            <article className="p-6 text-center hover:shadow-lg transition-all hover:scale-105 bg-card rounded-lg border border-border">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <BookOpen className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t("landing.benefits.learn.title")}</h3>
              <p className="text-muted-foreground">{t("landing.benefits.learn.desc")}</p>
            </article>

            <article className="p-6 text-center hover:shadow-lg transition-all hover:scale-105 sm:col-span-2 lg:col-span-1 bg-card rounded-lg border border-border">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <Zap className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t("landing.benefits.apply.title")}</h3>
              <p className="text-muted-foreground">{t("landing.benefits.apply.desc")}</p>
            </article>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-6 sm:px-12 lg:px-24 xl:px-32 py-16 md:py-20">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-center mb-12 md:mb-16 text-[#1D1D1F] tracking-tight">
          {t("landing.howItWorks.title")}
        </h2>
        <div className="grid md:grid-cols-3 gap-8 md:gap-12 mb-8 md:mb-12">
          <div className="text-center space-y-5">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#7B61FF] text-white text-2xl font-semibold mb-5">
              1
            </div>
            <h3 className="text-xl font-semibold text-[#1D1D1F]">{t("landing.howItWorks.step1.title")}</h3>
            <p className="text-[#86868B]">{t("landing.howItWorks.step1.desc")}</p>
          </div>

          <div className="text-center space-y-5">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#7B61FF] text-white text-2xl font-semibold mb-5">
              2
            </div>
            <h3 className="text-xl font-semibold text-[#1D1D1F]">{t("landing.howItWorks.step2.title")}</h3>
            <p className="text-[#86868B]">{t("landing.howItWorks.step2.desc")}</p>
          </div>

          <div className="text-center space-y-5">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#7B61FF] text-white text-2xl font-semibold mb-5">
              3
            </div>
            <h3 className="text-xl font-semibold text-[#1D1D1F]">{t("landing.howItWorks.step3.title")}</h3>
            <p className="text-[#86868B]">{t("landing.howItWorks.step3.desc")}</p>
          </div>
        </div>
        <div className="text-center">
          <Button 
            size="lg" 
            onClick={handleCTA} 
            className="px-10 py-6 text-base bg-white text-[#7B61FF] border-2 border-[#7B61FF] hover:bg-[#7B61FF] hover:text-white transition-all duration-200 rounded-xl"
          >
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
              <article key={idx} className="p-4 md:p-6 text-center hover:shadow-lg transition-shadow bg-card rounded-lg border border-border">
                <div className="aspect-[2/3] rounded mb-3 md:mb-4 overflow-hidden bg-muted">
                  <img 
                    src={book.image} 
                    alt={`Capa do livro ${book.title} por ${book.author}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    width="200"
                    height="300"
                  />
                </div>
                <h4 className="font-bold text-xs sm:text-sm mb-1">{book.title}</h4>
                <p className="text-xs text-muted-foreground">{book.author}</p>
              </article>
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
        
        <div className="text-center mt-12">
          <p className="text-lg md:text-xl font-semibold text-foreground">
            {t("landing.testimonials.socialProof")}
          </p>
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
              <Button onClick={handleCTA} variant="outline" className="w-full text-sm sm:text-base">
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
              <div className="space-y-2">
                <Button onClick={handleCTA} className="w-full text-sm sm:text-base">
                  {t("landing.plans.premium.cta")}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  {t("landing.plans.premium.cancelAnytime")}
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/30 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <Link to={`/${lang}/faq`} className="hover:text-foreground transition-colors">
                {t("footer.faq")}
              </Link>
              <Link to={`/${lang}/terms`} className="hover:text-foreground transition-colors">
                {t("footer.terms")}
              </Link>
              <Link to={`/${lang}/privacy`} className="hover:text-foreground transition-colors">
                {t("footer.privacy")}
              </Link>
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
