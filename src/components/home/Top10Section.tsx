import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { OptimizedImage } from "@/components/OptimizedImage";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

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
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Top 10 Mais Populares</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <Skeleton key={i} className="aspect-[2/3] rounded-lg" />
          ))}
        </div>
      </section>
    );
  }

  if (books.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8">Top 10 Mais Populares</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {books.map((book, index) => (
          <div
            key={book.id}
            onClick={() => onBookSelect(book.id, book.title, book.author)}
            className="relative aspect-[2/3] overflow-hidden rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all cursor-pointer group"
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
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
              <h3 className="text-white font-semibold text-sm line-clamp-2 mb-1">
                {book.title}
              </h3>
              <p className="text-white/80 text-xs line-clamp-1">{book.author}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
