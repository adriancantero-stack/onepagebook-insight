import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingCart } from 'lucide-react';
import { buildAmazonUrl, buildAmazonSearchUrl } from '@/lib/amazon';
import { Button } from '@/components/ui/button';

type Locale = 'pt' | 'en' | 'es';

interface BuyOnAmazonButtonProps {
  asin?: string | null;
  title?: string;
  author?: string;
  locale: Locale;
  className?: string;
}

export function BuyOnAmazonButton({
  asin,
  title,
  author,
  locale,
  className = ''
}: BuyOnAmazonButtonProps) {
  const { t } = useTranslation();

  // Build URL: use ASIN if available, otherwise fallback to search
  const href = asin
    ? buildAmazonUrl(asin, locale)
    : buildAmazonSearchUrl([title, author].filter(Boolean).join(' '), locale);

  const handleClick = () => {
    try {
      // Optional: Track analytics
      console.log('Amazon affiliate click', { asin: asin ?? null, locale });
    } catch (error) {
      // Silently fail analytics
    }
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="nofollow sponsored"
      aria-label={t('amazon.buyButton')}
      onClick={handleClick}
      className={`inline-flex items-center justify-center rounded-xl h-11 px-4 text-sm font-semibold bg-white text-black border border-border hover:bg-[#FF9900] hover:border-[#FF9900] active:bg-[#E68A00] active:border-[#E68A00] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors gap-2 ${className}`}
    >
      <ShoppingCart className="w-4 h-4" aria-hidden="true" focusable="false" />
      {t('amazon.buyButton')}
    </a>
  );
}
