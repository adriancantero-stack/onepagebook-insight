import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BookOpen, ArrowLeft, Sparkles } from "lucide-react";
import { LanguageSelector } from "@/components/LanguageSelector";
import Footer from "@/components/Footer";
import { 
  bookCatalog, 
  createFlatIndex, 
  suggestBooks, 
  getBooksByLocale,
  FlatIndexItem,
  Book
} from "@/data/bookCatalog";

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

  // Create flat index filtered by current locale
  const flatIndex = useMemo(() => createFlatIndex(i18n.language), [i18n.language]);

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

  const handleSummarize = (book: Book) => {
    // Track analytics event
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "catalog_select", {
        categoryId: selectedCategory,
        title: book.title,
        author: book.author,
        locale: i18n.language,
        source: "grid",
      });
    }

    // Navigate to home with book data
    navigate("/", {
      state: {
        bookTitle: book.title,
        bookAuthor: book.author,
      }
    });
  };

  // Get current category books filtered by locale
  const currentCategory = bookCatalog.find(cat => cat.id === selectedCategory);
  const allBooks = currentCategory ? getBooksByLocale(currentCategory, i18n.language) : [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between relative">
          <Button variant="ghost" onClick={() => navigate("/")} size="sm">
            <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Home</span>
          </Button>
          <div className="flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
            <h1 className="text-lg sm:text-xl font-bold">OnePageBook</h1>
          </div>
          <LanguageSelector />
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl flex-1">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{t("explore.title")}</h1>
          
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

        <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
          {bookCatalog.map(category => (
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {allBooks.map((book, index) => (
            <Card 
              key={`${book.title}-${index}`}
              className="p-6 flex flex-col hover:border-primary transition-colors"
            >
              <div className="flex-1 mb-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base sm:text-lg mb-1 line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {book.author}
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => handleSummarize(book)}
                className="w-full focus-visible:ring-2 focus-visible:ring-[#5A54E6]"
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
