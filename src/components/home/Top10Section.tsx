import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { OptimizedImage } from "@/components/OptimizedImage";
import { Skeleton } from "@/components/ui/skeleton";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface Top10SectionProps {
  onBookSelect: (bookId: string, title: string, author: string) => void;
  language: string;
}

interface Book {
  id: string;
  title: string;
  author: string;
  cover_url: string | null;
  popularity: number;
}

export const Top10Section = ({ onBookSelect, language }: Top10SectionProps) => {
  const { t } = useTranslation();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    dragFree: true,
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  useEffect(() => {
    const fetchTop10 = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("books")
        .select("id, title, author, cover_url, popularity")
        .eq("is_active", true)
        .eq("lang", language)
        .order("popularity", { ascending: false })
        .limit(10);

      if (!error && data) {
        setBooks(data);
      }
      setLoading(false);
    };

    fetchTop10();
  }, [language]);

  if (loading) {
    return (
      <section className="py-12">
        <h2 className="text-3xl font-bold mb-8 px-4">{t("home.top10Title")}</h2>
        <div className="flex gap-4 px-4 overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <Skeleton key={i} className="w-[180px] sm:w-[200px] md:w-[220px] aspect-[2/3] flex-shrink-0 rounded-lg" />
          ))}
        </div>
      </section>
    );
  }

  if (books.length === 0) return null;

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold mb-8 px-4">{t("home.top10Title")}</h2>
      
      <div className="relative group px-4">
        {/* Navigation Buttons */}
        {canScrollPrev && (
          <Button
            variant="ghost"
            size="icon"
            onClick={scrollPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 hover:bg-black/80 text-white rounded-full h-12 w-12"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}
        
        {canScrollNext && (
          <Button
            variant="ghost"
            size="icon"
            onClick={scrollNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 hover:bg-black/80 text-white rounded-full h-12 w-12"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        )}

        {/* Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4">
            {books.map((book, index) => (
              <div
                key={book.id}
                onClick={() => onBookSelect(book.id, book.title, book.author)}
                className="w-[180px] sm:w-[200px] md:w-[220px] aspect-[2/3] flex-shrink-0 relative overflow-hidden rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all cursor-pointer group/card"
              >
                {book.cover_url ? (
                  <OptimizedImage
                    src={book.cover_url}
                    alt={book.title}
                    className="w-full h-full object-cover"
                    loading="eager"
                    priority={index < 5}
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground text-sm text-center px-2">
                      {book.title}
                    </span>
                  </div>
                )}
                
                {/* Number Badge */}
                <div className="absolute top-2 left-2 w-14 h-14 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-bold text-4xl flex items-center justify-center rounded-md shadow-lg">
                  {index + 1}
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/card:opacity-100 transition-opacity flex flex-col justify-end p-3">
                  <h3 className="text-white font-semibold text-sm line-clamp-2 mb-1">
                    {book.title}
                  </h3>
                  <p className="text-white/80 text-xs line-clamp-1">{book.author}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
