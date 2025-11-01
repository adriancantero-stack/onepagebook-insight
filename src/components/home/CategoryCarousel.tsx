import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { OptimizedImage } from "@/components/OptimizedImage";
import { Skeleton } from "@/components/ui/skeleton";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CategoryCarouselProps {
  categoryKey: string;
  categoryName: string;
  onBookSelect: (bookId: string, title: string, author: string) => void;
  language: string;
}

interface Book {
  id: string;
  title: string;
  author: string;
  cover_url: string | null;
}

export const CategoryCarousel = ({
  categoryKey,
  categoryName,
  onBookSelect,
  language,
}: CategoryCarouselProps) => {
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
    const fetchBooks = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("books")
        .select("id, title, author, cover_url")
        .eq("is_active", true)
        .eq("lang", language)
        .eq("category", categoryKey)
        .order("popularity", { ascending: false })
        .limit(20);

      if (!error && data) {
        setBooks(data);
      }
      setLoading(false);
    };

    fetchBooks();
  }, [categoryKey, language]);

  if (loading) {
    return (
      <section className="py-8">
        <h3 className="text-2xl font-semibold mb-4 px-4">{categoryName}</h3>
        <div className="flex gap-4 px-4 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="w-[150px] sm:w-[180px] md:w-[200px] aspect-[2/3] flex-shrink-0 rounded-md" />
          ))}
        </div>
      </section>
    );
  }

  if (books.length === 0) return null;

  return (
    <section className="py-8">
      <h3 className="text-2xl font-semibold mb-4 px-4">{categoryName}</h3>
      
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
            {books.map((book) => (
              <div
                key={book.id}
                onClick={() => onBookSelect(book.id, book.title, book.author)}
                className="w-[150px] sm:w-[180px] md:w-[200px] aspect-[2/3] flex-shrink-0 rounded-md shadow hover:scale-105 transition-transform cursor-pointer overflow-hidden group/card"
              >
                {book.cover_url ? (
                  <OptimizedImage
                    src={book.cover_url}
                    alt={book.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center p-2">
                    <span className="text-muted-foreground text-xs text-center line-clamp-3">
                      {book.title}
                    </span>
                  </div>
                )}
                
                {/* Hover Info */}
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover/card:opacity-100 transition-opacity flex flex-col justify-end p-2">
                  <h4 className="text-white font-semibold text-xs line-clamp-2 mb-1">
                    {book.title}
                  </h4>
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
