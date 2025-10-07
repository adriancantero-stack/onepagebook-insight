/**
 * Amazon Affiliate Link Builder
 * Generates affiliate links for Amazon marketplaces with proper tags
 */

// Amazon affiliate tags (public, safe to hardcode)
const AMAZON_TAG_US = 'onepagebook03-20';
const AMAZON_TAG_BR = 'onepagebook05-20';

type Locale = 'pt' | 'en' | 'es';

interface Marketplace {
  host: string;
  tag: string;
}

/**
 * Get Amazon marketplace configuration based on locale
 */
export function getMarketplace(locale: Locale): Marketplace {
  if (locale === 'pt') {
    return { 
      host: 'www.amazon.com.br', 
      tag: AMAZON_TAG_BR 
    };
  }
  // EN and ES use US marketplace
  return { 
    host: 'www.amazon.com', 
    tag: AMAZON_TAG_US 
  };
}

/**
 * Build direct Amazon product URL using ASIN
 */
export function buildAmazonUrl(asin: string, locale: Locale): string {
  const { host, tag } = getMarketplace(locale);
  return `https://${host}/dp/${asin}?tag=${encodeURIComponent(tag)}&linkCode=ll1`;
}

/**
 * Build Amazon search URL for fallback when ASIN is not available
 * Uses linkId to maintain affiliate tracking through the search journey
 */
export function buildAmazonSearchUrl(query: string, locale: Locale): string {
  const { host, tag } = getMarketplace(locale);
  // Using linkId helps maintain tracking even after clicking search results
  const linkId = Math.random().toString(36).substring(7);
  return `https://${host}/s?k=${encodeURIComponent(query)}&tag=${encodeURIComponent(tag)}&linkCode=ll2&linkId=${linkId}`;
}
