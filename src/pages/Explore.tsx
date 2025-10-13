import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Shuffle, Filter, BookOpen } from "lucide-react";
import { FloatingHeader } from "@/components/FloatingHeader";
import { BookAutocomplete } from "@/components/BookAutocomplete";
import Footer from "@/components/Footer";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  bookCatalog, 
  createFlatIndex, 
  suggestBooks, 
  getBooksByLocale,
  FlatIndexItem,
  Book
} from "@/data/bookCatalog";
import { supabase } from "@/integrations/supabase/client";

// Trending storage helpers
const getTrendingData = (): Record<string, number> => {
  const data = localStorage.getItem("ob_clicks");
  return data ? JSON.parse(data) : {};
};

const incrementTrending = (bookId: string) => {
  const data = getTrendingData();
  data[bookId] = (data[bookId] || 0) + 1;
  localStorage.setItem("ob_clicks", JSON.stringify(data));
};

const Explore = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("habits");
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<FlatIndexItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout>();

  // Filters and sorting
  const [sortBy, setSortBy] = useState<"recommended" | "trending" | "alpha">("recommended");
  const [filterLevel, setFilterLevel] = useState<string[]>([]);
  const [filterLang, setFilterLang] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [totalBooksCount, setTotalBooksCount] = useState(0);
  const [bookCovers, setBookCovers] = useState<Record<string, string>>({});
  const [dbCategories, setDbCategories] = useState<{ id: string; name: string }[]>([]);
  const [dbBooks, setDbBooks] = useState<any[]>([]);

  // Create flat index filtered by current locale
  const flatIndex = useMemo(() => createFlatIndex(i18n.language), [i18n.language]);
  useEffect(() => {
    const fetchDataFromDB = async () => {
      const { count: dbBooksCount } = await supabase
        .from('books')
        .select('*', { count: 'exact', head: true })
        .eq('lang', i18n.language)
        .eq('is_active', true);
      
      setTotalBooksCount(dbBooksCount || 0);
      
      // Fetch covers
      const { data: dbBooks } = await supabase
        .from('books')
        .select('title, author, cover_url')
        .eq('lang', i18n.language)
        .eq('is_active', true);
      
      // Create a map of book covers by title-author key
      if (dbBooks) {
        const coversMap: Record<string, string> = {};
        dbBooks.forEach(book => {
          if (book.cover_url) {
            const key = `${book.title.toLowerCase()}-${book.author.toLowerCase()}`;
            coversMap[key] = book.cover_url;
          }
        });
        setBookCovers(coversMap);
      }
    };

    fetchDataFromDB();
  }, [i18n.language]);
  // Fetch active categories from database
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

  // Sort categories alphabetically by translated name
  const sortedCategories = useMemo(() => {
    return [...dbCategories].sort((a, b) => {
      return a.name.localeCompare(b.name, i18n.language);
    });
  }, [dbCategories, i18n.language]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset when language changes
  useEffect(() => {
    setQuery("");
    setIsOpen(false);
    setSuggestions([]);
  }, [i18n.language]);

  // Fetch books for selected category from database (for DB categories)
  useEffect(() => {
    const fetchBooks = async () => {
      const categoriesFilter = selectedCategory === 'personal-dev'
        ? ['personal-dev', 'personal_development']
        : [selectedCategory];

      const { data } = await supabase
        .from('books')
        .select('id, title, author, lang, cover_url, popularity')
        .eq('is_active', true)
        .eq('lang', i18n.language)
        .in('category', categoriesFilter)
        .order('popularity', { ascending: false });
      setDbBooks(data || []);
    };
    fetchBooks();
  }, [selectedCategory, i18n.language]);

  const handleInputChange = (value: string) => {
    setQuery(value);

    // Clear previous debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce search
    debounceTimerRef.current = setTimeout(() => {
      const results = suggestBooks(value, flatIndex, selectedCategory);
      setSuggestions(results);
      setIsOpen(results.length > 0);
      setActiveIndex(results.length > 0 ? 0 : -1);
    }, 120);
  };

  const selectSuggestion = (item: FlatIndexItem) => {
    // Track analytics event
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "catalog_select", {
        categoryId: item.catId,
        title: item.title,
        author: item.author,
        locale: i18n.language,
        source: "typeahead",
      });
    }

    // Increment trending
    incrementTrending(item.id);

    // Navigate to home with book data
    navigate("/home", {
      state: {
        bookTitle: item.title,
        bookAuthor: item.author,
      }
    });

    // Reset state
    setIsOpen(false);
    setQuery("");
    setSuggestions([]);
    setActiveIndex(-1);
  };

  const selectFreeText = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    // Track analytics event
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "catalog_select", {
        categoryId: "freetext",
        title: trimmed,
        author: "",
        locale: i18n.language,
        source: "freetext",
      });
    }

    // Navigate to home with typed text
    navigate("/home", {
      state: {
        bookTitle: trimmed,
        bookAuthor: "",
      }
    });

    // Reset state
    setIsOpen(false);
    setQuery("");
    setSuggestions([]);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === "Enter") {
        selectFreeText(query);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % suggestions.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && suggestions[activeIndex]) {
          selectSuggestion(suggestions[activeIndex]);
        } else {
          selectFreeText(query);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        break;
    }
  };

  const handleSummarize = (book: Book, bookId: string, source: string = "grid") => {
    // Track analytics event
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "catalog_click", {
        bookId,
        categoryId: selectedCategory,
        title: book.title,
        author: book.author,
        locale: i18n.language,
        source,
      });
    }

    // Increment trending
    incrementTrending(bookId);

    // Navigate to home with book data
    navigate("/home", {
      state: {
        bookTitle: book.title,
        bookAuthor: book.author,
      }
    });
  };

  const handleRandomBook = () => {
    const filtered = getFilteredAndSortedBooks();
    if (filtered.length === 0) return;

    const randomBook = filtered[Math.floor(Math.random() * filtered.length)];
    
    // Track analytics event
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "random_click", {
        fromCategory: selectedCategory,
        title: randomBook.title,
        locale: i18n.language,
      });
    }

    handleSummarize(randomBook, randomBook.id || `${selectedCategory}-random`, "random");
  };

  // Get current category books filtered by locale
  // Check if category exists in static catalog or only in DB
  const currentCategory = bookCatalog.find(cat => cat.id === selectedCategory);
  
  const sourceBooks = currentCategory
    ? getBooksByLocale(currentCategory, i18n.language)
    : dbBooks
        .filter((b: any) => b.lang === i18n.language) // Extra safety filter
        .map((b: any, index: number) => ({
          title: b.title,
          author: b.author,
          locale: b.lang,
          id: b.id || `${selectedCategory}-${i18n.language}-${index}`,
          ...(b.badge ? { badge: b.badge } : {}),
        }));

  const getFilteredAndSortedBooks = () => {
    let filtered = sourceBooks
      .filter((book: any) => book.locale === i18n.language) // Filter by current language
      .map((book, index) => {
        const bookId = (book as any).id || `${selectedCategory}-${(book as any).locale}-${index}`;
        return { ...book, id: bookId } as any;
      });

    // Apply level filter
    if (filterLevel.length > 0) {
      filtered = filtered.filter(book => book.level && filterLevel.includes(book.level));
    }

    // Apply lang filter (if book has langs array)
    if (filterLang.length > 0) {
      filtered = filtered.filter(book => 
        !book.langs || book.langs.some(lang => filterLang.includes(lang))
      );
    }

    // Sort
    const trendingData = getTrendingData();
    
    if (sortBy === "recommended") {
      filtered.sort((a, b) => {
        // Editors pick first
        if (a.badge === "editors" && b.badge !== "editors") return -1;
        if (b.badge === "editors" && a.badge !== "editors") return 1;
        // Then alpha
        return a.title.localeCompare(b.title);
      });
    } else if (sortBy === "trending") {
      filtered.sort((a, b) => {
        const scoreA = trendingData[a.id!] || 0;
        const scoreB = trendingData[b.id!] || 0;
        if (scoreB !== scoreA) return scoreB - scoreA;
        return a.title.localeCompare(b.title);
      });
    } else if (sortBy === "alpha") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    return filtered;
  };

  const allBooks = getFilteredAndSortedBooks();

  // Track filter changes
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "filter_apply", {
        level: filterLevel.length > 0 ? filterLevel : undefined,
        langs: filterLang.length > 0 ? filterLang : undefined,
        sort: sortBy,
      });
    }
  }, [filterLevel, filterLang, sortBy]);

  return (
    <div className="min-h-screen bg-lilac-50 flex flex-col">
      <FloatingHeader />

      <main className="container mx-auto px-6 sm:px-12 lg:px-24 xl:px-32 py-8 sm:py-12 flex-1">
        {/* Apple-style Header */}
        <div className="mb-10 sm:mb-16 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#1D1D1F] mb-4 tracking-tight">
            {t("explore.header.title")}
          </h1>
          <p className="text-lg sm:text-xl text-[#86868B] font-normal">
            {t("explore.header.subtitle")}
          </p>
        </div>

        {/* Centered Search Bar */}
        <div className="mb-10 sm:mb-14 max-w-3xl mx-auto">
          <div className="relative">
            <BookAutocomplete
              hideExploreLink={true}
              value={query}
              onChange={setQuery}
              onBookSelect={(bookId, title, author) => {
                // Track analytics
                if (typeof window !== "undefined" && (window as any).gtag) {
                  (window as any).gtag("event", "catalog_select", {
                    categoryId: selectedCategory,
                    title: title,
                    author: author,
                    locale: i18n.language,
                    source: "autocomplete",
                  });
                }

                // Navigate to home with book data
                navigate("/home", {
                  state: {
                    bookTitle: title,
                    bookAuthor: author,
                  }
                });
              }}
              disabled={false}
              lang={i18n.language}
            />
          </div>
        </div>

        {/* Minimalist Category Chips */}
        <div className="mb-10 sm:mb-12 flex items-center gap-4 overflow-x-auto scrollbar-hide pb-2">
          <div className="flex gap-2 flex-nowrap">
            {sortedCategories.map(category => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id);
                  setQuery("");
                  setIsOpen(false);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-[#1D1D1F] text-white'
                    : 'bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#1D1D1F] hover:text-white'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Surprise Me Icon */}
          <button
            onClick={handleRandomBook}
            disabled={allBooks.length === 0}
            className="ml-auto p-2 rounded-full bg-[#F5F5F7] hover:bg-[#1D1D1F] hover:text-white transition-all duration-200 shrink-0 disabled:opacity-50"
            title={t("explore.random")}
          >
            <Shuffle className="w-5 h-5" />
          </button>
        </div>

        {/* Sort - Condensed */}
        <div className="flex items-center gap-3 mb-8">
          <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
            <SelectTrigger className="w-[200px] border-[#E5E5EA] bg-white hover:border-[#1D1D1F] transition-colors">
              <SelectValue placeholder={t("sort.label")} />
            </SelectTrigger>
            <SelectContent className="bg-white border-[#E5E5EA]">
              <SelectItem value="recommended">{t("sort.recommended")}</SelectItem>
              <SelectItem value="trending">{t("sort.trending")}</SelectItem>
              <SelectItem value="alpha">{t("sort.alpha")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Apple-style Book Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {allBooks.map((book, index) => {
            const coverKey = `${book.title.toLowerCase()}-${book.author.toLowerCase()}`;
            const coverUrl = (book as any).cover_url || bookCovers[coverKey];
            
            return (
              <Card 
                key={`${book.title}-${index}`}
                className="p-5 flex flex-col h-full border-[#E5E5EA] hover:shadow-lg hover:scale-[1.02] transition-all duration-200 ease-in-out bg-white group"
              >
                {/* Book Cover */}
                <div className="flex items-center gap-4 mb-4">
                  <img 
                    src={coverUrl || '/book-placeholder.png'} 
                    alt={`${book.title} cover`}
                    className="w-16 h-24 object-cover rounded-md shadow-sm"
                    onError={(e) => {
                      e.currentTarget.src = '/book-placeholder.png';
                    }}
                  />

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base text-[#1D1D1F] line-clamp-2 mb-1 leading-snug">
                      {book.title}
                    </h3>
                    <p className="text-sm text-[#86868B] line-clamp-1">
                      {book.author}
                    </p>
                  </div>
                </div>

                {/* Badges - Fixed height for alignment */}
                <div className="flex items-center gap-2 min-h-[28px] mb-4">
                  {book.badge && (
                    <Badge 
                      variant="secondary" 
                      className="text-xs bg-[#E5E5EA] text-[#1D1D1F] border-none"
                    >
                      {t(`badges.${book.badge}`)}
                    </Badge>
                  )}
                  {book.level && (
                    <Badge 
                      variant="outline" 
                      className="text-xs border-[#E5E5EA] text-[#86868B]"
                    >
                      {t(`filters.level.${book.level}`)}
                    </Badge>
                  )}
                </div>

                {/* Generate Summary Button - Pushed to bottom */}
                <Button
                  onClick={() => handleSummarize(book, book.id!, "grid")}
                  className="w-full mt-auto bg-[#7B61FF] hover:bg-[#6951E6] text-white border-none shadow-sm transition-all duration-200"
                  aria-label={`${t("explore.summarize")} ${book.title} — ${book.author}`}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {t("explore.summarize")}
                </Button>
              </Card>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Explore;
