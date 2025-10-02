import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Search, ArrowLeft, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
    <div className="min-h-screen bg-background flex flex-col">
        <header className="border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                {t("summary.back")}
              </Button>
            </Link>
          </div>
        </header>

        <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2">
              <BookOpen className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">OnePageBook</h1>
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2 text-center">{t("faq.title_long")}</h1>
          
          <div className="relative mb-8 mt-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("faq.search.placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>

          {filteredFaqs.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">{t("faq.empty")}</p>
            </Card>
          ) : (
            <Accordion type="single" collapsible className="space-y-2">
              {filteredFaqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border rounded-lg px-4 bg-card"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-4">
                    <span className="font-medium">{faq.q}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}

          <Card className="mt-12 p-6 text-center bg-muted/50">
            <p className="text-lg mb-4">{t("faq.cta.contact")}</p>
            <Button asChild>
              <a href="mailto:sac@onepagebook.ai">{t("faq.contact")}</a>
            </Button>
          </Card>
        </main>
      </div>
  );
};

export default Faq;
