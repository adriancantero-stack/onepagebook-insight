import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search, Loader2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { bookCatalog, getBooksByLocale } from "@/data/bookCatalog";

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
    { id: "habits", label: "Hábitos & Produtividade" },
    { id: "sleep", label: "Sono & Saúde" },
    { id: "psych", label: "Psicologia & Mindset" },
    { id: "strategy", label: "Negócios & Estratégia" },
    { id: "finance", label: "Finanças Pessoais" },
    { id: "comm", label: "Comunicação & Persuasão" },
    { id: "lead", label: "Liderança & Gestão" },
    { id: "creative", label: "Criatividade" },
    { id: "startup", label: "Startups" },
    { id: "life", label: "Vida & Autoconhecimento" },
    { id: "marketing", label: "Marketing & Growth" },
    { id: "career", label: "Carreira & Trabalho" },
    { id: "education", label: "Aprendizado & Educação" },
    { id: "bio", label: "Biografias & História" },
    { id: "tech", label: "Tecnologia & IA" },
    { id: "crypto", label: "Criptomoedas" }
  ],
  en: [
    { id: "habits", label: "Habits & Productivity" },
    { id: "sleep", label: "Sleep & Health" },
    { id: "psych", label: "Psychology & Mindset" },
    { id: "strategy", label: "Business & Strategy" },
    { id: "finance", label: "Personal Finance" },
    { id: "comm", label: "Communication" },
    { id: "lead", label: "Leadership" },
    { id: "creative", label: "Creativity" },
    { id: "startup", label: "Startups" },
    { id: "life", label: "Life & Self" },
    { id: "marketing", label: "Marketing & Growth" },
    { id: "career", label: "Career & Work" },
    { id: "education", label: "Learning & Education" },
    { id: "bio", label: "Biographies" },
    { id: "tech", label: "Technology & AI" },
    { id: "crypto", label: "Crypto & Blockchain" }
  ],
  es: [
    { id: "habits", label: "Hábitos & Productividad" },
    { id: "sleep", label: "Sueño & Salud" },
    { id: "psych", label: "Psicología & Mentalidad" },
    { id: "strategy", label: "Negocios & Estrategia" },
    { id: "finance", label: "Finanzas Personales" },
    { id: "comm", label: "Comunicación" },
    { id: "lead", label: "Liderazgo" },
    { id: "creative", label: "Creatividad" },
    { id: "startup", label: "Startups" },
    { id: "life", label: "Vida & Autoconocimiento" },
    { id: "marketing", label: "Marketing & Crecimiento" },
    { id: "career", label: "Carrera & Trabajo" },
    { id: "education", label: "Aprendizaje & Educación" },
    { id: "bio", label: "Biografías" },
    { id: "tech", label: "Tecnología & IA" },
    { id: "crypto", label: "Cripto & Blockchain" }
  ]
};

export const CatalogModal = ({ open, onClose, onSelect, lang }: CatalogModalProps) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("habits");
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
      // Get hardcoded catalog books
      const catalogBooks = bookCatalog.flatMap(category => 
        category.books
          .filter(book => book.locale === lang)
          .map((book, index) => ({
            id: `catalog-${category.id}-${index}`,
            title: book.title,
            author: book.author,
            category: category.id
          }))
      );

      // Get database books
      let query = supabase
        .from('books')
        .select('id, title, author, cover_url, category')
        .eq('lang', lang)
        .eq('is_active', true);

      if (searchQuery.trim()) {
        query = query.or(`title.ilike.%${searchQuery}%,author.ilike.%${searchQuery}%`);
      }

      if (activeCategory) {
        query = query.eq('category', activeCategory);
      }

      const { data: dbBooks, error } = await query
        .order('popularity', { ascending: false })
        .range((currentPage - 1) * 20, currentPage * 20 - 1);

      if (error) throw error;

      // Combine catalog and database books
      let allBooks = [...catalogBooks, ...(dbBooks || [])];

      // Apply search filter to catalog books if needed
      if (searchQuery.trim()) {
        const lowerQuery = searchQuery.toLowerCase();
        allBooks = allBooks.filter(book => 
          book.title.toLowerCase().includes(lowerQuery) ||
          book.author.toLowerCase().includes(lowerQuery)
        );
      }

      // Apply category filter to catalog books if needed
      if (activeCategory) {
        allBooks = allBooks.filter(book => 
          book.category === activeCategory
        );
      }

      if (reset) {
        setBooks(allBooks.slice(0, 20));
        setPage(1);
      } else {
        setBooks(prev => [...prev, ...allBooks.slice(currentPage * 20, (currentPage + 1) * 20)]);
      }

      setHasMore(allBooks.length > (currentPage * 20));
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