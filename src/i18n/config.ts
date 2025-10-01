import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { pt } from "./translations/pt";
import { en } from "./translations/en";
import { es } from "./translations/es";

const getInitialLanguage = () => {
  const saved = localStorage.getItem("language");
  if (saved) return saved;
  
  const browserLang = navigator.language.split("-")[0];
  if (["pt", "en", "es"].includes(browserLang)) return browserLang;
  
  return "pt";
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      pt,
      en,
      es,
    },
    lng: getInitialLanguage(),
    fallbackLng: "pt",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
