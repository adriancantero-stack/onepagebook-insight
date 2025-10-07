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
    <Button
      asChild
      variant="default"
      size="lg"
      className={`gap-2 ${className}`}
    >
      <a
        href={href}
        target="_blank"
        rel="nofollow sponsored"
        aria-label={t('amazon.buyButton')}
        onClick={handleClick}
      >
        <ShoppingCart className="w-4 h-4" aria-hidden="true" />
        {t('amazon.buyButton')}
      </a>
    </Button>
  );
}
