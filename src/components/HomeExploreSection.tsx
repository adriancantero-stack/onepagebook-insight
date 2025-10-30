import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { OptimizedImage } from "@/components/OptimizedImage";
import { trackEvent } from "@/lib/analyticsTracker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"popularity" | "alpha">("popularity");
  const [dbCategories, setDbCategories] = useState<{ id: string; name: string }[]>([]);
  const LIMIT = 24;

  // Fetch categories from database
  useEffect(() => {
    const fetchCategories = async () => {
      const { data: cats } = await supabase
        .from('book_categories')
        .select('key, name_pt, name_en, name_es')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      const mapped = (cats || []).map((c: any) => {
        const name =
          i18n.language === 'en' ? c.name_en :
          i18n.language === 'es' ? c.name_es :
          c.name_pt;
        return { id: c.key, name };
      });
      setDbCategories(mapped);
    };
    fetchCategories();
  }, [i18n.language]);

  // Sort categories alphabetically
  const sortedCategories = useMemo(() => {
    return [...dbCategories].sort((a, b) => {
      return a.name.localeCompare(b.name, i18n.language);
    });
  }, [dbCategories, i18n.language]);

  // Helper to capitalize title correctly
  const capitalizeTitle = (text: string) => {
    return text.split(' ').map(word => {
      if (word.toLowerCase() === 'e') return 'e';
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
  };

  const getTitle = () => {
    const titles = {
      pt: 'Explore Livros Populares e Recomendados',
      es: 'Explora Libros Populares y Recomendados',
      en: 'Explore Popular and Recommended Books'
    };
    return capitalizeTitle(titles[i18n.language as keyof typeof titles] || titles.en);
  };

  useEffect(() => {
    const fetchPopularBooks = async () => {
      setLoading(true);
      setBooks([]);
      setOffset(0);
      setHasMore(true);
      
      try {
        let query = supabase
          .from('books')
          .select('id, title, author, cover_url, category')
          .eq('lang', i18n.language)
          .eq('is_active', true);

        // Apply category filter if selected
        if (selectedCategory) {
          query = query.eq('category', selectedCategory);
        }

        // Apply sorting
        if (sortBy === 'popularity') {
          query = query.order('popularity', { ascending: false });
        } else {
          query = query.order('title', { ascending: true });
        }

        const { data, error } = await query.range(0, LIMIT - 1);

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
  }, [i18n.language, selectedCategory, sortBy]);

  const loadMoreBooks = async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    try {
      let query = supabase
        .from('books')
        .select('id, title, author, cover_url, category')
        .eq('lang', i18n.language)
        .eq('is_active', true);

      // Apply category filter if selected
      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }

      // Apply sorting
      if (sortBy === 'popularity') {
        query = query.order('popularity', { ascending: false });
      } else {
        query = query.order('title', { ascending: true });
      }

      const { data, error } = await query.range(offset, offset + LIMIT - 1);

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
          {getTitle()}
        </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-2 sm:gap-4">
        {Array.from({ length: 24 }).map((_, i) => (
          <Card key={i} className="p-1 sm:p-2 space-y-1 sm:space-y-2 border-border/50 bg-card/50">
            <Skeleton className="w-full aspect-[2/3] rounded-md" />
            <Skeleton className="h-2.5 sm:h-4 w-3/4" />
            <Skeleton className="h-2 sm:h-3 w-1/2" />
            <Skeleton className="h-6 sm:h-8 w-full" />
          </Card>
        ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mt-16 mb-12 animate-fade-in">
      <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-8 text-foreground">
        {getTitle()}
      </h2>

      {/* Category Chips */}
      <div className="mb-6 flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
        <div className="flex gap-1.5 sm:gap-2 flex-nowrap mx-auto">
          <button
            onClick={() => {
              trackEvent('home_category_click', { category_id: 'all' });
              setSelectedCategory(null);
            }}
            className={`px-2.5 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              selectedCategory === null
                ? 'bg-[#1D1D1F] text-white'
                : 'bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#1D1D1F] hover:text-white'
            }`}
          >
            {i18n.language === 'pt' ? 'Todos' : i18n.language === 'es' ? 'Todos' : 'All'}
          </button>
          {sortedCategories.map(category => (
            <button
              key={category.id}
              onClick={() => {
                trackEvent('home_category_click', { category_id: category.id });
                setSelectedCategory(category.id);
              }}
              className={`px-2.5 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-[#1D1D1F] text-white'
                  : 'bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#1D1D1F] hover:text-white'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sort Filter */}
      <div className="flex items-center gap-2 mb-6">
        <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
          <SelectTrigger className="w-full sm:w-[200px] text-sm border-input bg-background hover:border-primary transition-colors">
            <SelectValue placeholder={i18n.language === 'pt' ? 'Ordenar' : i18n.language === 'es' ? 'Ordenar' : 'Sort'} />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            <SelectItem value="popularity">
              {i18n.language === 'pt' ? 'Mais populares' : i18n.language === 'es' ? 'Más populares' : 'Most popular'}
            </SelectItem>
            <SelectItem value="alpha">
              {i18n.language === 'pt' ? 'Alfabética' : i18n.language === 'es' ? 'Alfabético' : 'Alphabetical'}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-2 sm:gap-4">
        {books.map((book) => (
          <Card 
            key={book.id}
            className="group p-1 sm:p-2 space-y-1 sm:space-y-2 border-border/50 bg-card/50 hover:bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            <div className="relative overflow-hidden rounded-md bg-muted">
              <OptimizedImage
                src={book.cover_url || "/book-placeholder.png"}
                alt={`${book.title} cover`}
                className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
            
            <div className="space-y-0.5 min-h-[24px] sm:min-h-[40px]">
              <h3 className="font-semibold text-[9px] sm:text-xs leading-tight line-clamp-2 text-foreground">
                {book.title}
              </h3>
              <p className="text-[8px] sm:text-[10px] text-muted-foreground line-clamp-1">
                {book.author}
              </p>
            </div>
            
            <Button
              onClick={() => handleSummarize(book)}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-md text-[9px] sm:text-xs font-medium py-0.5 sm:py-1.5 h-auto transition-all duration-200 hover:shadow-md"
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
