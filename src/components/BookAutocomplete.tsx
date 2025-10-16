import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Book {
  id: string;
  title: string;
  author: string;
  lang: string;
  cover_url?: string;
  popularity: number;
  source?: 'catalog' | 'history'; // Para diferenciar de onde veio o resultado
}

interface BookAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onBookSelect: (bookId: string | null, title: string, author: string, source?: 'catalog' | 'history') => void;
  disabled?: boolean;
  lang: string;
  hideExploreLink?: boolean;
  authorFilled?: boolean; // Para desabilitar autocomplete quando autor já está preenchido
}

export const BookAutocomplete = ({ 
  value, 
  onChange, 
  onBookSelect, 
  disabled,
  lang,
  hideExploreLink = false,
  authorFilled = false
}: BookAutocompleteProps) => {
  const { t } = useTranslation();
  const [suggestions, setSuggestions] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [bookSelected, setBookSelected] = useState(false);
  const [booksCount, setBooksCount] = useState<number | null>(null);
  const debounceRef = useRef<number>();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchBooksCount = async () => {
      try {
        const { count, error } = await supabase
          .from('books')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true);

        if (error) throw error;
        setBooksCount(count || 0);
      } catch (error) {
        console.error("Error fetching books count:", error);
        setBooksCount(null);
      }
    };

    fetchBooksCount();
  }, []);

  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length < 2 || bookSelected || authorFilled) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("catalog-search", {
        body: { query, lang, limit: 8 }
      });

      if (error) throw error;
      
      setSuggestions(data?.books || []);
      setShowDropdown(true);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, [lang, bookSelected, authorFilled]);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = window.setTimeout(() => {
      fetchSuggestions(value);
    }, 200);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [value, fetchSuggestions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectBook = (book: Book | null) => {
    if (book) {
      onChange(book.title);
      onBookSelect(book.id, book.title, book.author, book.source);
    } else {
      // User chose "use exactly what I typed"
      onBookSelect(null, value, "");
    }
    setShowDropdown(false);
    setSelectedIndex(-1);
    setBookSelected(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;

    const totalItems = suggestions.length + 1; // +1 for fallback option

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % totalItems);
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + totalItems) % totalItems);
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex === suggestions.length) {
          // Fallback option selected
          handleSelectBook(null);
        } else if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSelectBook(suggestions[selectedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const highlightMatch = (text: string, query: string) => {
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return text;

    return (
      <>
        {text.substring(0, index)}
        <mark className="bg-primary/20 font-medium">{text.substring(index, index + query.length)}</mark>
        {text.substring(index + query.length)}
      </>
    );
  };

  const getLoadingText = () => {
    switch (lang) {
      case "en": return "Searching…";
      case "es": return "Buscando…";
      default: return "Procurando…";
    }
  };

  const getNoResultsText = () => {
    switch (lang) {
      case "en": return "No books found.";
      case "es": return "No se encontró ningún libro.";
      default: return "Nenhum livro encontrado.";
    }
  };

  const getFallbackText = () => {
    switch (lang) {
      case "en": return `Continue with: "${value}"`;
      case "es": return `Continuar con: "${value}"`;
      default: return `Continuar com: "${value}"`;
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="space-y-2">
        <Input
          placeholder={
            lang === "en" ? "Search by title, author or theme..." :
            lang === "es" ? "Busca por título, autor o tema..." :
            "Busque por título, autor ou tema..."
          }
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setBookSelected(false);
          }}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          autoComplete="off"
          className="h-12 text-base bg-white"
        />
        {!hideExploreLink && (
          <div className="text-xs text-center px-1 flex items-center justify-center gap-1.5 flex-wrap">
            <span className="text-muted-foreground/60">
              {lang === "en" ? "Don't know the title? " : lang === "es" ? "¿No sabes el título? " : "Não sabe o título? "}
            </span>
            <button
              onClick={() => {
                window.location.href = '/explore';
              }}
              className="text-primary hover:underline font-medium transition-colors"
            >
              {lang === "en" ? "Browse catalog" : lang === "es" ? "Explorar catálogo" : "Explorar catálogo"}
            </button>
            {booksCount !== null && (
              <span className="text-muted-foreground/80 font-semibold">
                +{booksCount.toLocaleString()} {lang === "en" ? "books!" : lang === "es" ? "libros!" : "livros!"}
              </span>
            )}
          </div>
        )}
      </div>

      {showDropdown && (
        <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-80 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-muted-foreground flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              {getLoadingText()}
            </div>
          ) : suggestions.length === 0 ? (
            <>
              <div className="p-4 text-center text-muted-foreground">
                {getNoResultsText()}
              </div>
              <button
                className="w-full p-3 text-left hover:bg-accent transition-colors border-t border-border text-sm"
                onClick={() => handleSelectBook(null)}
              >
                {getFallbackText()}
              </button>
            </>
          ) : (
            <>
              {suggestions.map((book, index) => (
                <button
                  key={book.id}
                  className={`w-full p-3 text-left hover:bg-accent transition-colors flex items-center gap-3 ${
                    index === selectedIndex ? "bg-accent" : ""
                  }`}
                  onClick={() => handleSelectBook(book)}
                >
                  <img
                    src={book.cover_url || '/book-placeholder.png'}
                    alt={book.title}
                    className="w-10 h-14 object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.src = '/book-placeholder.png';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                      {highlightMatch(book.title, value)}
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                      {book.author}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs px-2 py-1 bg-primary/10 rounded">
                      {book.lang.toUpperCase()}
                    </span>
                    {book.source === 'history' && (
                      <span className="text-xs px-2 py-1 bg-green-500/10 text-green-600 rounded">
                        {lang === "en" ? "Generated" : lang === "es" ? "Generado" : "Gerado"}
                      </span>
                    )}
                  </div>
                </button>
              ))}
              <button
                className={`w-full p-3 text-left hover:bg-accent transition-colors border-t border-border text-sm ${
                  selectedIndex === suggestions.length ? "bg-accent" : ""
                }`}
                onClick={() => handleSelectBook(null)}
              >
                {getFallbackText()}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
