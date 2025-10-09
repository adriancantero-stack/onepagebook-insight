import { useEffect } from "react";

interface SEOConfig {
  title: string;
  description: string;
  lang: "pt" | "en" | "es";
  path: string;
  imageUrl?: string;
}

const BASE_URL = "https://onepagebook.ai";

const localeMap = {
  pt: "pt_BR",
  en: "en_US",
  es: "es_ES",
};

/**
 * Hook for managing SEO meta tags dynamically
 * Handles hreflang, Open Graph, structured data, and internationalization
 */
export const useSEO = ({ title, description, lang, path, imageUrl }: SEOConfig) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update HTML lang attribute
    document.documentElement.lang = lang === "pt" ? "pt-BR" : lang === "es" ? "es-ES" : "en-US";

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? "property" : "name";
      let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
      
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.content = content;
    };

    // Update or create link tags
    const updateLinkTag = (rel: string, href: string, hreflang?: string) => {
      const selector = hreflang 
        ? `link[rel="${rel}"][hreflang="${hreflang}"]`
        : `link[rel="${rel}"]`;
      
      let element = document.querySelector(selector) as HTMLLinkElement;
      
      if (!element) {
        element = document.createElement("link");
        element.rel = rel;
        if (hreflang) element.hreflang = hreflang;
        document.head.appendChild(element);
      }
      element.href = href;
    };

    // Basic meta tags
    updateMetaTag("description", description);
    updateMetaTag("robots", "index, follow");

    // Canonical URL
    const canonicalUrl = `${BASE_URL}${path}`;
    updateLinkTag("canonical", canonicalUrl);

    // Hreflang tags for multilingual SEO
    updateLinkTag("alternate", `${BASE_URL}/pt`, "pt");
    updateLinkTag("alternate", `${BASE_URL}/en`, "en");
    updateLinkTag("alternate", `${BASE_URL}/es`, "es");
    updateLinkTag("alternate", `${BASE_URL}/pt`, "x-default"); // Default to Portuguese

    // Open Graph tags
    updateMetaTag("og:type", "website", true);
    updateMetaTag("og:url", canonicalUrl, true);
    updateMetaTag("og:title", title, true);
    updateMetaTag("og:description", description, true);
    updateMetaTag("og:site_name", "OnePageBook", true);
    updateMetaTag("og:locale", localeMap[lang], true);
    
    // Alternate locales for Open Graph
    const alternateLocales = Object.entries(localeMap)
      .filter(([key]) => key !== lang)
      .map(([_, locale]) => locale);
    
    alternateLocales.forEach((locale, index) => {
      updateMetaTag(`og:locale:alternate`, locale, true);
    });

    if (imageUrl) {
      updateMetaTag("og:image", imageUrl, true);
    }

    // Twitter Card tags
    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:site", "@onepagebook");
    updateMetaTag("twitter:title", title);
    updateMetaTag("twitter:description", description);
    if (imageUrl) {
      updateMetaTag("twitter:image", imageUrl);
    }

    // Structured Data (JSON-LD)
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "OnePageBook",
      "description": description,
      "url": canonicalUrl,
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": lang === "pt" ? "BRL" : "USD"
      },
      "inLanguage": lang === "pt" ? "pt-BR" : lang === "es" ? "es-ES" : "en-US",
      "potentialAction": {
        "@type": "UseAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${BASE_URL}/${lang}`,
          "inLanguage": lang === "pt" ? "pt-BR" : lang === "es" ? "es-ES" : "en-US"
        }
      }
    };

    // Remove existing structured data
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      // Keep meta tags for subsequent page loads
    };
  }, [title, description, lang, path, imageUrl]);
};
