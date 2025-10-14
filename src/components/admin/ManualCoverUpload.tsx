import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload, Search, Image as ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Book {
  id: string;
  title: string;
  author: string;
  cover_url?: string;
  lang: string;
}

export function ManualCoverUpload() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [uploading, setUploading] = useState(false);
  const [searching, setSearching] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Digite um título ou autor para buscar");
      return;
    }

    setSearching(true);
    try {
      const { data, error } = await supabase
        .from("books")
        .select("id, title, author, cover_url, lang")
        .or(`title.ilike.%${searchQuery}%,author.ilike.%${searchQuery}%`)
        .order("title")
        .limit(20);

      if (error) throw error;

      setSearchResults(data || []);
      if (data?.length === 0) {
        toast.info("Nenhum livro encontrado");
      }
    } catch (error) {
      console.error("Erro ao buscar livros:", error);
      toast.error("Erro ao buscar livros");
    } finally {
      setSearching(false);
    }
  };

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
      
      // Update selected book and search results
      setSelectedBook({ ...selectedBook, cover_url: publicUrl });
      setSearchResults(prev =>
        prev.map(book =>
          book.id === selectedBook.id ? { ...book, cover_url: publicUrl } : book
        )
      );

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
          Upload Manual de Capas
        </CardTitle>
        <CardDescription>
          Busque livros e faça upload manual das capas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Section */}
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Buscar por título ou autor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={searching}>
              <Search className="h-4 w-4 mr-2" />
              {searching ? "Buscando..." : "Buscar"}
            </Button>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="border rounded-lg overflow-hidden">
              <div className="max-h-[300px] overflow-y-auto">
                {searchResults.map((book) => (
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
                          {book.cover_url ? (
                            <Badge variant="outline" className="text-[10px]">
                              Com capa
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="text-[10px]">
                              Sem capa
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

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
              <div className="mt-2 flex gap-2">
                <Input
                  id="cover-upload"
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  disabled={uploading}
                  className="flex-1"
                />
                <Button disabled={uploading} onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  {uploading ? "Enviando..." : "Upload"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
