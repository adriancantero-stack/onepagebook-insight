import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { OptimizedImage } from "@/components/OptimizedImage";
import { trackEvent } from "@/lib/analyticsTracker";

interface Book {
  id: string;
  title: string;
  author: string;
  cover_url: string;
}

interface HomeExploreSectionProps {
  onBookSelect: (bookId: string, title: string, author: string) => void;
}

export const HomeExploreSection = ({ onBookSelect }: HomeExploreSectionProps) => {
  const { t, i18n } = useTranslation();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 15;

  useEffect(() => {
    const fetchPopularBooks = async () => {
      setLoading(true);
      setBooks([]);
      setOffset(0);
      setHasMore(true);
      
      try {
        const { data, error } = await supabase
          .from('books')
          .select('id, title, author, cover_url')
          .eq('lang', i18n.language)
          .eq('is_active', true)
          .order('popularity', { ascending: false })
          .range(0, LIMIT - 1);

        if (!error && data) {
          setBooks(data);
          setHasMore(data.length === LIMIT);
          setOffset(LIMIT);
        }
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularBooks();
  }, [i18n.language]);

  const loadMoreBooks = async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    try {
      const { data, error } = await supabase
        .from('books')
        .select('id, title, author, cover_url')
        .eq('lang', i18n.language)
        .eq('is_active', true)
        .order('popularity', { ascending: false })
        .range(offset, offset + LIMIT - 1);

      if (!error && data) {
        setBooks(prev => [...prev, ...data]);
        setHasMore(data.length === LIMIT);
        setOffset(prev => prev + LIMIT);
      }
    } catch (error) {
      console.error('Error loading more books:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSummarize = (book: Book) => {
    trackEvent('book_click', { 
      book_id: book.id,
      book_title: book.title,
      source: 'home_explore'
    });
    onBookSelect(book.id, book.title, book.author);
  };

  if (loading) {
    return (
      <section className="mt-16 mb-12">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-8 text-foreground">
          {i18n.language === 'pt' ? 'Explore livros populares e recomendados' :
           i18n.language === 'es' ? 'Explora libros populares y recomendados' :
           'Explore popular and recommended books'}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Array.from({ length: 15 }).map((_, i) => (
            <Card key={i} className="p-4 space-y-3 border-border/50 bg-card/50">
              <Skeleton className="w-full aspect-[2/3] rounded-lg" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-10 w-full" />
            </Card>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mt-16 mb-12 animate-fade-in">
      <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-8 text-foreground">
        {i18n.language === 'pt' ? 'Explore livros populares e recomendados' :
         i18n.language === 'es' ? 'Explora libros populares y recomendados' :
         'Explore popular and recommended books'}
      </h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {books.map((book) => (
          <Card 
            key={book.id}
            className="group p-4 space-y-3 border-border/50 bg-card/50 hover:bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            <div className="relative overflow-hidden rounded-lg bg-muted">
              <OptimizedImage
                src={book.cover_url || "/book-placeholder.png"}
                alt={`${book.title} cover`}
                className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
            
            <div className="space-y-1 min-h-[60px]">
              <h3 className="font-semibold text-sm leading-tight line-clamp-2 text-foreground">
                {book.title}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {book.author}
              </p>
            </div>
            
            <Button
              onClick={() => handleSummarize(book)}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-sm font-medium transition-all duration-200 hover:shadow-md"
            >
              {i18n.language === 'pt' ? 'Resumir agora' :
               i18n.language === 'es' ? 'Resumir ahora' :
               'Summarize now'}
            </Button>
          </Card>
        ))}
      </div>

      {hasMore && (
        <div className="text-center mt-10">
          <Button
            onClick={loadMoreBooks}
            disabled={loadingMore}
            variant="outline"
            className="px-8 py-6 text-base border-border/50 hover:border-primary/50 hover:bg-accent/50 rounded-xl transition-all duration-200"
          >
            {loadingMore ? (
              i18n.language === 'pt' ? 'Carregando...' :
              i18n.language === 'es' ? 'Cargando...' :
              'Loading...'
            ) : (
              i18n.language === 'pt' ? 'Ver mais' :
              i18n.language === 'es' ? 'Ver más' :
              'View more'
            )}
          </Button>
        </div>
      )}
    </section>
  );
};
