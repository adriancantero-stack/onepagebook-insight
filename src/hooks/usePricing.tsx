import { useTranslation } from "react-i18next";

interface PricingData {
  free: string;
  premium: string;
  currency: string;
  premiumValue: number;
}

export const usePricing = (): PricingData => {
  const { i18n } = useTranslation();
  
  const pricingByLanguage: Record<string, PricingData> = {
    pt: {
      free: "R$ 0",
      premium: "R$ 14,99",
      currency: "BRL",
      premiumValue: 14.99,
    },
    en: {
      free: "$0",
      premium: "$4.99",
      currency: "USD",
      premiumValue: 4.99,
    },
    es: {
      free: "$0",
      premium: "$4.99",
      currency: "USD",
      premiumValue: 4.99,
    },
  };

  return pricingByLanguage[i18n.language] || pricingByLanguage.pt;
};
