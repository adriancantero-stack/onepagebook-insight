import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search, Loader2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Book {
  id: string;
  title: string;
  author: string;
  cover_url?: string;
  category?: string;
}

interface CatalogModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (bookId: string, title: string, author: string) => void;
  lang: string;
}

const CATEGORIES = {
  pt: [
    { id: "trending", label: "Tendências" },
    { id: "business", label: "Negócios" },
    { id: "self-help", label: "Autoajuda" },
    { id: "productivity", label: "Produtividade" },
    { id: "biography", label: "Biografias" },
    { id: "technology", label: "Tecnologia" },
    { id: "health", label: "Saúde & Bem-estar" }
  ],
  en: [
    { id: "trending", label: "Trending" },
    { id: "business", label: "Business" },
    { id: "self-help", label: "Self-help" },
    { id: "productivity", label: "Productivity" },
    { id: "biography", label: "Biographies" },
    { id: "technology", label: "Technology" },
    { id: "health", label: "Health & Wellness" }
  ],
  es: [
    { id: "trending", label: "Tendencias" },
    { id: "business", label: "Negocios" },
    { id: "self-help", label: "Autoayuda" },
    { id: "productivity", label: "Productividad" },
    { id: "biography", label: "Biografías" },
    { id: "technology", label: "Tecnología" },
    { id: "health", label: "Salud & Bienestar" }
  ]
};

export const CatalogModal = ({ open, onClose, onSelect, lang }: CatalogModalProps) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("trending");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const categories = CATEGORIES[lang as keyof typeof CATEGORIES] || CATEGORIES.pt;

  const searchPlaceholders = {
    pt: "Busque por título ou autor…",
    en: "Search by title or author…",
    es: "Busca por título o autor…"
  };

  const selectLabels = {
    pt: "Selecionar",
    en: "Select",
    es: "Seleccionar"
  };

  const loadMoreLabels = {
    pt: "Carregar mais",
    en: "Load more",
    es: "Cargar más"
  };

  const emptyLabels = {
    pt: "Nenhum livro encontrado.",
    en: "No books found.",
    es: "No se encontró ningún libro."
  };

  const modalTitles = {
    pt: "Explorar Catálogo",
    en: "Browse Catalog",
    es: "Explorar Catálogo"
  };

  useEffect(() => {
    if (open) {
      fetchBooks(true);
    }
  }, [open, searchQuery, activeCategory, lang]);

  const fetchBooks = async (reset = false) => {
    setLoading(true);
    const currentPage = reset ? 1 : page;
    
    try {
      let query = supabase
        .from('books')
        .select('id, title, author, cover_url, category')
        .eq('lang', lang)
        .eq('is_active', true);

      if (searchQuery.trim()) {
        query = query.or(`title.ilike.%${searchQuery}%,author.ilike.%${searchQuery}%`);
      }

      if (activeCategory !== "trending") {
        query = query.ilike('category', `%${activeCategory}%`);
      }

      const { data, error } = await query
        .order('popularity', { ascending: false })
        .range((currentPage - 1) * 20, currentPage * 20 - 1);

      if (error) throw error;

      if (reset) {
        setBooks(data || []);
        setPage(1);
      } else {
        setBooks(prev => [...prev, ...(data || [])]);
      }

      setHasMore((data || []).length === 20);
    } catch (error) {
      console.error('Error fetching books:', error);
      toast({
        variant: "destructive",
        title: t("toast.error"),
        description: "Erro ao carregar livros"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
    fetchBooks(false);
  };

  const handleSelect = (book: Book) => {
    onSelect(book.id, book.title, book.author);
    onClose();
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== undefined) {
        fetchBooks(true);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        aria-labelledby="catalog-modal-title"
      >
        <DialogHeader className="border-b pb-4">
          <DialogTitle id="catalog-modal-title">
            {modalTitles[lang as keyof typeof modalTitles]}
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={onClose}
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          <div className="sticky top-0 bg-background z-10 pb-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholders[lang as keyof typeof searchPlaceholders]}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                autoFocus
              />
            </div>

            <Tabs value={activeCategory} onValueChange={setActiveCategory}>
              <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto">
                {categories.map(cat => (
                  <TabsTrigger key={cat.id} value={cat.id} className="whitespace-nowrap">
                    {cat.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {loading && books.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="border rounded-lg p-4 space-y-3 animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : books.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {emptyLabels[lang as keyof typeof emptyLabels]}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {books.map(book => (
                  <div 
                    key={book.id}
                    className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow"
                  >
                    <div>
                      <h3 className="font-bold line-clamp-2">{book.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">{book.author}</p>
                    </div>
                    <Button
                      size="sm"
                      className="w-full bg-primary hover:bg-primary/90"
                      onClick={() => handleSelect(book)}
                    >
                      {selectLabels[lang as keyof typeof selectLabels]}
                    </Button>
                  </div>
                ))}
              </div>

              {hasMore && (
                <div className="flex justify-center pt-4">
                  <Button
                    variant="outline"
                    onClick={handleLoadMore}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {loadMoreLabels[lang as keyof typeof loadMoreLabels]}
                      </>
                    ) : (
                      loadMoreLabels[lang as keyof typeof loadMoreLabels]
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};