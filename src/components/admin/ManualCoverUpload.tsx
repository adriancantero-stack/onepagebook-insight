import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload, RefreshCw, Image as ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Book {
  id: string;
  title: string;
  author: string;
  cover_url?: string;
  lang: string;
}

export function ManualCoverUpload() {
  const PAGE_SIZE = 200;
  const [booksWithoutCovers, setBooksWithoutCovers] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load books with pagination and server-side search
  const loadBooksWithoutCovers = async (reset = false) => {
    setLoading(true);
    try {
      const start = reset ? 0 : booksWithoutCovers.length;
      const end = start + PAGE_SIZE - 1;

      let query = supabase
        .from("books")
        .select("id, title, author, cover_url, lang")
        .eq("is_active", true)
        .order("title", { ascending: true })
        .range(start, end);

      if (searchQuery.trim()) {
        const pattern = `%${searchQuery.trim()}%`;
        query = query.or(`title.ilike.${pattern},author.ilike.${pattern}`);
      }

      const { data, error } = await query;
      if (error) throw error;

      if (reset) {
        setBooksWithoutCovers(data || []);
        setFilteredBooks(data || []);
      } else {
        const merged = [...booksWithoutCovers, ...(data || [])];
        setBooksWithoutCovers(merged);
        setFilteredBooks(merged);
      }

      const length = data?.length ?? 0;
      setHasMore(length === PAGE_SIZE);
    } catch (error) {
      console.error("Erro ao carregar livros:", error);
      toast.error("Erro ao carregar livros");
    } finally {
      setLoading(false);
    }
  };

  // Trigger server-side search when query changes (debounced)
  useEffect(() => {
    const t = setTimeout(() => {
      loadBooksWithoutCovers(true);
    }, 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedBook) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione uma imagem válida");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 2MB");
      return;
    }

    setUploading(true);
    try {
      // Generate unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${selectedBook.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("book-covers")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("book-covers")
        .getPublicUrl(filePath);

      // Update book record
      const { error: updateError } = await supabase
        .from("books")
        .update({ cover_url: publicUrl })
        .eq("id", selectedBook.id);

      if (updateError) throw updateError;

      toast.success("Capa atualizada com sucesso!");
      
      // Reload books without covers
      await loadBooksWithoutCovers();
      setSelectedBook(null);

      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
      toast.error("Erro ao fazer upload da capa");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Upload/Trocar Capas de Livros
        </CardTitle>
        <CardDescription>
          Busque e gerencie capas de livros - {filteredBooks.length} livros
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            Carregando livros...
          </div>
        ) : (
          <>
            {/* Search Input */}
            <div className="space-y-2">
              <Label htmlFor="book-search">Buscar Livro</Label>
              <Input
                id="book-search"
                type="text"
                placeholder="Digite título ou autor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {filteredBooks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum livro encontrado com "{searchQuery}"
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Selecione um livro para fazer upload ou trocar a capa
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => loadBooksWithoutCovers(true)}
                    disabled={loading}
                  >
                    <RefreshCw className="h-3 w-3 mr-2" />
                    Atualizar
                  </Button>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <div className="max-h-[400px] overflow-y-auto">
                    {filteredBooks.map((book) => (
                      <div
                        key={book.id}
                        className={`p-3 border-b hover:bg-accent cursor-pointer transition-colors ${
                          selectedBook?.id === book.id ? "bg-accent" : ""
                        }`}
                        onClick={() => setSelectedBook(book)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-16 bg-muted rounded flex-shrink-0 overflow-hidden">
                            {book.cover_url ? (
                              <img
                                src={book.cover_url}
                                alt={book.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{book.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{book.author}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-[10px]">
                                {book.lang.toUpperCase()}
                              </Badge>
                              <Badge variant={book.cover_url ? "default" : "destructive"} className="text-[10px]">
                                {book.cover_url ? "✓ Com Capa" : "✗ Sem Capa"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {hasMore && (
                  <div className="mt-3 flex justify-center">
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={loading}
                      onClick={() => loadBooksWithoutCovers(false)}
                    >
                      Carregar mais livros
                    </Button>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Upload Section */}
        {selectedBook && (
          <div className="space-y-4 p-4 border rounded-lg bg-accent/50">
            <div>
              <Label className="text-base font-semibold">Livro Selecionado</Label>
              <div className="mt-2 space-y-1">
                <p className="font-medium">{selectedBook.title}</p>
                <p className="text-sm text-muted-foreground">{selectedBook.author}</p>
              </div>
            </div>

            {selectedBook.cover_url && (
              <div>
                <Label className="text-sm">Capa Atual</Label>
                <div className="mt-2 w-32 h-44 border rounded overflow-hidden">
                  <img
                    src={selectedBook.cover_url}
                    alt={selectedBook.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="cover-upload">Nova Capa (JPG, PNG, WEBP - máx 2MB)</Label>
              <div className="mt-2">
                <Input
                  id="cover-upload"
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  disabled={uploading}
                />
                {uploading && (
                  <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                    <Upload className="h-4 w-4 animate-pulse" />
                    Enviando capa...
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
