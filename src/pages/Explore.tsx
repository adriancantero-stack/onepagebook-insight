import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BookOpen, ArrowLeft, Search, Sparkles } from "lucide-react";
import { LanguageSelector } from "@/components/LanguageSelector";
import Footer from "@/components/Footer";
import { bookCatalog, normalizeText, Book } from "@/data/bookCatalog";

const Explore = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("habits");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSummarize = (book: Book) => {
    // Track analytics event
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "catalog_select", {
        categoryId: selectedCategory,
        title: book.title,
        author: book.author,
        locale: i18n.language,
      });
    }

    // Navigate to home with book data in state
    navigate("/", {
      state: {
        bookTitle: book.title,
        bookAuthor: book.author,
      }
    });
  };

  // Get current category books
  const currentCategory = bookCatalog.find(cat => cat.id === selectedCategory);
  const allBooks = currentCategory?.books || [];

  // Filter books by search query
  const filteredBooks = searchQuery.trim()
    ? allBooks.filter(book => {
        const normalizedQuery = normalizeText(searchQuery);
        const normalizedTitle = normalizeText(book.title);
        const normalizedAuthor = normalizeText(book.author);
        return normalizedTitle.includes(normalizedQuery) || normalizedAuthor.includes(normalizedQuery);
      })
    : allBooks;

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
        {/* Title and Search */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{t("explore.title")}</h1>
          
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t("explore.search.placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {t("explore.orType")}
          </p>
        </div>

        {/* Category Chips */}
        <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
          {bookCatalog.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setSelectedCategory(category.id);
                setSearchQuery(""); // Clear search when changing category
              }}
              className="rounded-full"
            >
              {t(category.nameKey)}
            </Button>
          ))}
        </div>

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <Card className="p-12 text-center">
            <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              {t("explore.noResults")}
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredBooks.map((book, index) => (
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
                  className="w-full"
                  aria-label={`${t("explore.summarize")} ${book.title} — ${book.author}`}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {t("explore.summarize")}
                </Button>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Explore;
