import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FloatingHeader } from "@/components/FloatingHeader";

const Faq = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = useMemo(() => [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
    { q: t("faq.q4"), a: t("faq.a4") },
    { q: t("faq.q5"), a: t("faq.a5") },
    { q: t("faq.q6"), a: t("faq.a6") },
    { q: t("faq.q7"), a: t("faq.a7") },
    { q: t("faq.q8"), a: t("faq.a8") },
    { q: t("faq.q9"), a: t("faq.a9") },
    { q: t("faq.q10"), a: t("faq.a10") },
    { q: t("faq.q11"), a: t("faq.a11") },
    { q: t("faq.q12"), a: t("faq.a12") },
    { q: t("faq.q13"), a: t("faq.a13") },
    { q: t("faq.q14"), a: t("faq.a14") },
    { q: t("faq.q15"), a: t("faq.a15") },
    { q: t("faq.q16"), a: t("faq.a16") },
    { q: t("faq.q17"), a: t("faq.a17") },
  ], [t]);

  const removeAccents = (str: string) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return faqs;
    const query = removeAccents(searchQuery.toLowerCase());
    return faqs.filter(
      (faq) =>
        removeAccents(faq.q.toLowerCase()).includes(query) ||
        removeAccents(faq.a.toLowerCase()).includes(query)
    );
  }, [searchQuery, faqs]);

  const jsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  }), [faqs]);

  useEffect(() => {
    document.title = `${t("faq.title_long")} | OnePageBook`;
    
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Respostas para as perguntas mais frequentes sobre o OnePageBook - resumos de livros em 1 página com áudio.");
    }

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(jsonLd);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [t, jsonLd]);

  return (
    <div className="min-h-screen bg-lilac-50 flex flex-col">
      <FloatingHeader />

      <main className="flex-1 container mx-auto px-6 sm:px-12 lg:px-24 xl:px-32 py-16 max-w-4xl">
          <h1 className="text-4xl sm:text-5xl font-bold font-poppins tracking-tight text-foreground mb-4 text-center">{t("faq.title_long")}</h1>
          
          <div className="relative mb-10 mt-10">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("faq.search.placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 rounded-xl border-lilac-200 bg-white text-base"
            />
          </div>

          {filteredFaqs.length === 0 ? (
            <Card className="p-10 text-center border-lilac-200 rounded-2xl bg-white">
              <p className="text-muted-foreground text-lg">{t("faq.empty")}</p>
            </Card>
          ) : (
            <Accordion type="single" collapsible className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border border-lilac-200 rounded-xl px-6 hover:shadow-md transition-all duration-200 bg-white"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-5">
                    <span className="font-medium text-foreground">{faq.q}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}

          <Card className="mt-12 p-10 text-center bg-lilac-100 border-lilac-200 rounded-2xl">
            <p className="text-lg sm:text-xl mb-6 text-muted-foreground leading-relaxed">{t("faq.cta.contact")}</p>
            <Button asChild className="bg-primary hover:bg-primary/90 rounded-xl px-8 py-6 text-base font-medium transition-all duration-200">
              <Link to="/contact">{t("faq.contact")}</Link>
            </Button>
          </Card>
        </main>
      </div>
  );
};

export default Faq;
