import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import ptPerson1 from "@/assets/testimonials/pt-person1.jpg";
import ptPerson2 from "@/assets/testimonials/pt-person2.jpg";
import ptPerson3 from "@/assets/testimonials/pt-person3.jpg";
import enPerson1 from "@/assets/testimonials/en-person1.jpg";
import enPerson2 from "@/assets/testimonials/en-person2.jpg";
import enPerson3 from "@/assets/testimonials/en-person3.jpg";
import esPerson1 from "@/assets/testimonials/es-person1.jpg";
import esPerson2 from "@/assets/testimonials/es-person2.jpg";
import esPerson3 from "@/assets/testimonials/es-person3.jpg";

interface LandingTestimonialsProps {
  lang: "pt" | "es" | "en";
}

export const LandingTestimonials = ({ lang }: LandingTestimonialsProps) => {
  const { t } = useTranslation();
  
  const [summaryCount, setSummaryCount] = useState(12547);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setSummaryCount(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const testimonialImages = {
    pt: [ptPerson1, ptPerson2, ptPerson3],
    en: [enPerson1, enPerson2, enPerson3],
    es: [esPerson1, esPerson2, esPerson3],
  };

  return (
    <section className="container mx-auto px-6 py-16 sm:px-12 sm:py-24 lg:px-24 bg-gradient-to-b from-white to-lilac-50/30">
      <div className="mb-12 text-center space-y-4">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
          {t("landing.testimonials.title")}
        </h2>
        <div className="flex items-center justify-center gap-2 text-lg font-medium text-primary animate-pulse">
          <span className="text-2xl">✨</span>
          <span>{summaryCount.toLocaleString()} {t("landing.testimonials.weeklyCount")}</span>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <Card className="p-8 transition-all hover:shadow-lg bg-card border-border">
          <div className="mb-4 flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <p className="mb-6 italic text-muted-foreground">
            "{t("landing.testimonials.testimonial1.text")}"
          </p>
          <div className="flex items-center gap-3">
            <img
              src={testimonialImages[lang][0]}
              alt={t("landing.testimonials.testimonial1.author")}
              className="h-12 w-12 rounded-full object-cover"
              loading="lazy"
              decoding="async"
              width="48"
              height="48"
            />
            <div>
              <p className="font-semibold">{t("landing.testimonials.testimonial1.author")}</p>
              <p className="text-sm text-muted-foreground">{t("landing.testimonials.testimonial1.role")}</p>
            </div>
          </div>
        </Card>

        <Card className="p-8 transition-all hover:shadow-lg bg-card border-border">
          <div className="mb-4 flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <p className="mb-6 italic text-muted-foreground">
            "{t("landing.testimonials.testimonial2.text")}"
          </p>
          <div className="flex items-center gap-3">
            <img
              src={testimonialImages[lang][1]}
              alt={t("landing.testimonials.testimonial2.author")}
              className="h-12 w-12 rounded-full object-cover"
              loading="lazy"
              decoding="async"
              width="48"
              height="48"
            />
            <div>
              <p className="font-semibold">{t("landing.testimonials.testimonial2.author")}</p>
              <p className="text-sm text-muted-foreground">{t("landing.testimonials.testimonial2.role")}</p>
            </div>
          </div>
        </Card>

        <Card className="p-8 transition-all hover:shadow-lg bg-card border-border">
          <div className="mb-4 flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <p className="mb-6 italic text-muted-foreground">
            "{t("landing.testimonials.testimonial3.text")}"
          </p>
          <div className="flex items-center gap-3">
            <img
              src={testimonialImages[lang][2]}
              alt={t("landing.testimonials.testimonial3.author")}
              className="h-12 w-12 rounded-full object-cover"
              loading="lazy"
              decoding="async"
              width="48"
              height="48"
            />
            <div>
              <p className="font-semibold">{t("landing.testimonials.testimonial3.author")}</p>
              <p className="text-sm text-muted-foreground">{t("landing.testimonials.testimonial3.role")}</p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};
