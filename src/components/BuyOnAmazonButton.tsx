import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingCart } from 'lucide-react';
import { buildAmazonUrl, buildAmazonSearchUrl } from '@/lib/amazon';
import { supabase } from '@/integrations/supabase/client';

 type Locale = 'pt' | 'en' | 'es';
 
 interface BuyOnAmazonButtonProps {
   asin?: string | null;
   isbn?: string | null;
   title?: string;
   author?: string;
   locale: Locale;
   className?: string;
 }
 
 // Convert ISBN-13 to ISBN-10 (used as ASIN for books)
 function isbn13to10(isbn13?: string | null): string | null {
   if (!isbn13) return null;
   const digits = (isbn13.match(/\d/g) || []).join('');
   if (digits.length !== 13) return null;
   if (!digits.startsWith('978') && !digits.startsWith('979')) return null;
   const core = digits.slice(3, 12); // 9 digits
   let sum = 0;
   for (let i = 0; i < core.length; i++) {
     const n = parseInt(core[i], 10);
     sum += (10 - i) * n; // weights 10..2
   }
   let check = 11 - (sum % 11);
   let checkChar = '';
   if (check === 10) checkChar = 'X';
   else if (check === 11) checkChar = '0';
   else checkChar = String(check);
   return core + checkChar;
 }
 
 export function BuyOnAmazonButton({
   asin,
   isbn,
   title,
   author,
   locale,
   className = ''
 }: BuyOnAmazonButtonProps) {
   const { t } = useTranslation();
   const [resolvedHref, setResolvedHref] = useState<string | null>(null);
   
   // Base fallback href
   const fallbackHref = useMemo(() => (
     asin ? buildAmazonUrl(asin, locale) : buildAmazonSearchUrl([title, author].filter(Boolean).join(' '), locale)
   ), [asin, title, author, locale]);
 
   useEffect(() => {
     let canceled = false;

     async function resolveLink() {
       // If asin provided, we're done
       if (asin) {
         setResolvedHref(buildAmazonUrl(asin, locale));
         return;
       }

       // For BR, try using ISBN (prop or from DB)
       if (locale === 'pt') {
         // 1) Use prop ISBN if provided
         const asAsin = isbn13to10(isbn);
         if (asAsin) {
           setResolvedHref(buildAmazonUrl(asAsin, locale));
           return;
         }

         // 2) Try to lookup in DB by title/author
          if (title && author) {
            const { data, error } = await supabase
              .from('books')
              .select('asin, isbn')
              .eq('lang', 'pt')
              .ilike('title', `%${title}%`)
              .ilike('author', `%${author}%`)
              .limit(1);
            if (!canceled && !error && data && data.length > 0) {
             const row = data[0] as any;
             const asinDb = row.asin as string | null;
             const isbnDb = row.isbn as string | null;
             if (asinDb) {
               setResolvedHref(buildAmazonUrl(asinDb, locale));
               return;
             }
             const asinFromIsbn = isbn13to10(isbnDb);
             if (asinFromIsbn) {
               setResolvedHref(buildAmazonUrl(asinFromIsbn, locale));
               return;
             }
           }
         }
       }

       // Fallback
       setResolvedHref(fallbackHref);
     }

     resolveLink();
     return () => { canceled = true; };
   }, [asin, isbn, title, author, locale, fallbackHref]);
 
   const handleClick = () => {
     try {
       // Optional: Track analytics
       console.log('Amazon affiliate click', { asin: asin ?? null, locale });
     } catch {}
   };
 
   return (
     <a
       href={resolvedHref || fallbackHref}
       target="_blank"
       rel="nofollow sponsored noopener noreferrer"
       aria-label={t('amazon.buyButton')}
       onClick={handleClick}
       className={`inline-flex items-center justify-center rounded-xl h-11 px-4 text-sm font-semibold bg-white text-black border border-border hover:bg-[#FF9900] hover:border-[#FF9900] active:bg-[#E68A00] active:border-[#E68A00] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors gap-2 ${className}`}
     >
       <ShoppingCart className="w-4 h-4" aria-hidden="true" focusable="false" />
       {t('amazon.buyButton')}
     </a>
   );
 }
