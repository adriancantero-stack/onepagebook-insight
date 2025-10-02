import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ArrowLeft, Sparkles, Shuffle, Filter } from "lucide-react";
import { LanguageSelector } from "@/components/LanguageSelector";
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
  starterPacks,
  createFlatIndex, 
  suggestBooks, 
  getBooksByLocale,
  FlatIndexItem,
  Book
} from "@/data/bookCatalog";

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

  // Create flat index filtered by current locale
  const flatIndex = useMemo(() => createFlatIndex(i18n.language), [i18n.language]);

  // Sort categories alphabetically by translated name
  const sortedCategories = useMemo(() => {
    return [...bookCatalog].sort((a, b) => {
      const nameA = t(a.nameKey);
      const nameB = t(b.nameKey);
      return nameA.localeCompare(nameB, i18n.language);
    });
  }, [t, i18n.language]);

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
    navigate("/", {
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
    navigate("/", {
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
    navigate("/", {
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

  const handlePackOpen = (packId: string) => {
    // Track analytics event
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "pack_open", {
        packId,
        locale: i18n.language,
      });
    }

    const pack = starterPacks.find(p => p.id === packId);
    if (!pack || pack.books.length === 0) return;

    // Find first book in the pack
    const firstBookId = pack.books[0];
    const allBooksFlat = flatIndex;
    const firstBook = allBooksFlat.find(b => b.id === firstBookId);

    if (firstBook) {
      handleSummarize(
        { title: firstBook.title, author: firstBook.author, locale: firstBook.locale },
        firstBook.id,
        "pack"
      );
    }
  };

  // Get current category books filtered by locale
  const currentCategory = bookCatalog.find(cat => cat.id === selectedCategory);
  const categoryBooks = currentCategory ? getBooksByLocale(currentCategory, i18n.language) : [];

  const getFilteredAndSortedBooks = () => {
    let filtered = categoryBooks.map((book, index) => {
      const bookId = book.id || `${selectedCategory}-${book.locale}-${index}`;
      return { ...book, id: bookId };
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
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between relative">
          <Button variant="ghost" onClick={() => navigate("/")} size="sm">
            <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Home</span>
          </Button>
          <div className="flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2">
            <BookOpen className="w-6 h-6 text-primary" />
            <h1 className="text-lg sm:text-xl font-bold text-foreground">OnePageBook</h1>
          </div>
          <LanguageSelector />
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl flex-1">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            {t("explore.title")} <span className="text-xl sm:text-2xl text-muted-foreground">({flatIndex.length} {t("explore.books")})</span>
          </h1>
          
          <div className="relative max-w-xl">
            <Input
              ref={inputRef}
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={isOpen}
              aria-controls="ac-list"
              aria-activedescendant={
                activeIndex >= 0 && suggestions[activeIndex]
                  ? `opt-${suggestions[activeIndex].id}`
                  : ""
              }
              type="text"
              placeholder={t("explore.search.placeholder")}
              value={query}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full focus-visible:ring-2 focus-visible:ring-[#5A54E6]"
            />
            
            {isOpen && (
              <div
                ref={dropdownRef}
                id="ac-list"
                role="listbox"
                className="absolute z-50 w-full mt-2 bg-background border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto"
              >
                {suggestions.length > 0 ? (
                  <ul className="py-2">
                    {suggestions.map((item, idx) => (
                      <li
                        key={item.id}
                        id={`opt-${item.id}`}
                        role="option"
                        aria-selected={idx === activeIndex}
                        onMouseEnter={() => setActiveIndex(idx)}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          selectSuggestion(item);
                        }}
                        className={`px-4 py-3 cursor-pointer transition-colors ${
                          idx === activeIndex
                            ? "bg-primary/10"
                            : "hover:bg-muted"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm truncate">
                              {item.title}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {item.author}
                            </div>
                          </div>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary shrink-0">
                            {t(item.catNameKey)}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-4 py-3 text-sm text-muted-foreground">
                    {t("explore.search.noResults")}
                  </div>
                )}
              </div>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground mt-2">
            {t("explore.search.hint")}
          </p>
        </div>

        {/* Starter Packs Carousel */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl font-bold mb-4">Starter Packs</h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {starterPacks.map(pack => (
              <Card 
                key={pack.id}
                className="p-4 min-w-[280px] cursor-pointer hover:border-primary transition-colors"
                onClick={() => handlePackOpen(pack.id)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-base">
                    {pack.name[i18n.language as keyof typeof pack.name] || pack.name.en}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {pack.books.length} {t("explore.summarize").toLowerCase()}s
                </p>
              </Card>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
          {sortedCategories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setSelectedCategory(category.id);
                setQuery("");
                setIsOpen(false);
              }}
              className="rounded-full"
            >
              {t(category.nameKey)}
            </Button>
          ))}
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              {t("filters.title")}
            </Button>

            <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("sort.label")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">{t("sort.recommended")}</SelectItem>
                <SelectItem value="trending">{t("sort.trending")}</SelectItem>
                <SelectItem value="alpha">{t("sort.alpha")}</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={handleRandomBook}
              disabled={allBooks.length === 0}
            >
              <Shuffle className="w-4 h-4 mr-2" />
              {t("explore.random")}
            </Button>
          </div>
        </div>

        {showFilters && (
          <Card className="p-4 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">{t("filters.level")}</h3>
                <div className="space-y-2">
                  {["basic", "intermediate"].map(level => (
                    <div key={level} className="flex items-center space-x-2">
                      <Checkbox
                        id={`level-${level}`}
                        checked={filterLevel.includes(level)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFilterLevel([...filterLevel, level]);
                          } else {
                            setFilterLevel(filterLevel.filter(l => l !== level));
                          }
                        }}
                      />
                      <Label htmlFor={`level-${level}`}>
                        {t(`filters.level.${level}`)}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">{t("filters.lang")}</h3>
                <div className="space-y-2">
                  {["pt", "en", "es"].map(lang => (
                    <div key={lang} className="flex items-center space-x-2">
                      <Checkbox
                        id={`lang-${lang}`}
                        checked={filterLang.includes(lang)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFilterLang([...filterLang, lang]);
                          } else {
                            setFilterLang(filterLang.filter(l => l !== lang));
                          }
                        }}
                      />
                      <Label htmlFor={`lang-${lang}`}>
                        {t(`filters.lang.${lang}`)}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        <div className="flex flex-col gap-3">
          {allBooks.map((book, index) => (
            <Card 
              key={`${book.title}-${index}`}
              className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 hover:border-primary transition-colors"
            >
              <div className="flex items-start gap-3 flex-1 min-w-0 w-full sm:w-auto">
                <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 mb-1">
                    <h3 className="font-bold text-base line-clamp-2 flex-1">
                      {book.title}
                    </h3>
                    {book.badge && (
                      <Badge variant="secondary" className="shrink-0 text-xs">
                        {t(`badges.${book.badge}`)}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {book.author}
                  </p>
                  {book.level && (
                    <Badge variant="outline" className="mt-1 text-xs">
                      {t(`filters.level.${book.level}`)}
                    </Badge>
                  )}
                </div>
              </div>
              <Button
                onClick={() => handleSummarize(book, book.id!, "grid")}
                size="sm"
                className="w-full sm:w-auto shrink-0 focus-visible:ring-2 focus-visible:ring-[#5A54E6]"
                aria-label={`${t("explore.summarize")} ${book.title} — ${book.author}`}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {t("explore.summarize")}
              </Button>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Explore;
