import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload, RefreshCw, Image as ImageIcon, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Book {
  id: string;
  title: string;
  author: string;
  cover_url?: string;
  lang: string;
}

interface DeduplicationResult {
  kept_book_id: string;
  deleted_count: number;
  book_title: string;
  book_author: string;
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
  const [coverFilter, setCoverFilter] = useState<'all' | 'with' | 'without'>('all');
  const [editedTitle, setEditedTitle] = useState("");
  const [editedAuthor, setEditedAuthor] = useState("");
  const [savingMetadata, setSavingMetadata] = useState(false);
  const [deduplicating, setDeduplicating] = useState(false);
  const [deduplicationResults, setDeduplicationResults] = useState<DeduplicationResult[]>([]);
  const [showDeduplicationDialog, setShowDeduplicationDialog] = useState(false);
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

      // Apply cover filter
      if (coverFilter === 'with') {
        query = query.not('cover_url', 'is', null);
      } else if (coverFilter === 'without') {
        query = query.is('cover_url', null);
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

  // Trigger server-side search when query or filter changes (debounced)
  useEffect(() => {
    const t = setTimeout(() => {
      loadBooksWithoutCovers(true);
    }, 300);
    return () => clearTimeout(t);
  }, [searchQuery, coverFilter]);

  // Populate editable fields when book is selected
  useEffect(() => {
    if (selectedBook) {
      setEditedTitle(selectedBook.title);
      setEditedAuthor(selectedBook.author);
    }
  }, [selectedBook]);

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
      const filePath = `covers/${selectedBook.id}-${Date.now()}.${fileExt}`;

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

  const handleSaveMetadata = async () => {
    if (!selectedBook) return;

    // Validate fields
    if (!editedTitle.trim() || !editedAuthor.trim()) {
      toast.error("Título e autor não podem estar vazios");
      return;
    }

    // Check if there are changes
    if (editedTitle.trim() === selectedBook.title && editedAuthor.trim() === selectedBook.author) {
      toast.info("Nenhuma alteração detectada");
      return;
    }

    setSavingMetadata(true);
    try {
      const { error } = await supabase
        .from("books")
        .update({
          title: editedTitle.trim(),
          author: editedAuthor.trim(),
          updated_at: new Date().toISOString()
        })
        .eq("id", selectedBook.id);

      if (error) throw error;

      toast.success("Título e autor atualizados com sucesso!");
      await loadBooksWithoutCovers(true);
      setSelectedBook(null);
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
      toast.error("Erro ao salvar alterações");
    } finally {
      setSavingMetadata(false);
    }
  };

  const handleDeduplicateBooks = async () => {
    setDeduplicating(true);
    try {
      const { data, error } = await supabase.rpc("merge_duplicate_books");
      if (error) throw error;
      if (data && data.length > 0) { setDeduplicationResults(data); toast.success(`${data.length} grupo(s) de duplicados mesclados!`); loadBooksWithoutCovers(true); }
      else { toast.info("Nenhum livro duplicado encontrado"); setDeduplicationResults([]); }
    } catch (error) { console.error("Erro:", error); toast.error("Erro ao excluir duplicados"); }
    finally { setDeduplicating(false); setShowDeduplicationDialog(false); }
  };

  return (<>
    <Card><CardHeader><CardTitle className="flex items-center gap-2"><ImageIcon className="h-5 w-5" />Upload/Trocar Capas de Livros</CardTitle><CardDescription>Busque e gerencie capas - {filteredBooks.length} livros</CardDescription></CardHeader>
    <CardContent className="space-y-6">{loading ? <div className="text-center py-8 text-muted-foreground">Carregando...</div> : <>
    <div className="space-y-4"><div className="space-y-2"><Label htmlFor="book-search">Buscar Livro</Label><Input id="book-search" placeholder="Digite título ou autor..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
    <div className="flex gap-2"><Button variant={coverFilter === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setCoverFilter('all')}>Todos</Button><Button variant={coverFilter === 'with' ? 'default' : 'outline'} size="sm" onClick={() => setCoverFilter('with')}>Com Capa</Button><Button variant={coverFilter === 'without' ? 'default' : 'outline'} size="sm" onClick={() => setCoverFilter('without')}>Sem Capa</Button></div></div>
    {filteredBooks.length === 0 ? <div className="text-center py-8 text-muted-foreground">Nenhum livro encontrado</div> : <div className="space-y-4">
    <div className="flex items-center justify-between"><p className="text-sm text-muted-foreground">Selecione um livro</p><div className="flex gap-2">
    <Button onClick={() => setShowDeduplicationDialog(true)} disabled={deduplicating} variant="outline" size="sm"><Trash2 className={`w-3 h-3 mr-2 ${deduplicating ? 'animate-pulse' : ''}`} />Excluir Duplicados</Button>
    <Button variant="outline" size="sm" onClick={() => loadBooksWithoutCovers(true)} disabled={loading}><RefreshCw className="h-3 w-3 mr-2" />Atualizar</Button></div></div>
    <div className="grid gap-2 max-h-96 overflow-y-auto border rounded-lg p-4">{filteredBooks.map((book) => (<div key={book.id} className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedBook?.id === book.id ? 'bg-primary/10 border-primary' : 'hover:bg-muted'}`} onClick={() => setSelectedBook(book)}><div className="flex items-center justify-between"><div><p className="font-medium">{book.title}</p><p className="text-sm text-muted-foreground">{book.author}</p></div><div className="flex items-center gap-2"><Badge variant="outline" className="text-xs">{book.lang.toUpperCase()}</Badge>{book.cover_url ? <Badge variant="secondary" className="text-xs">✅ Com Capa</Badge> : <Badge variant="destructive" className="text-xs">❌ Sem Capa</Badge>}</div></div></div>))}</div>
    {hasMore && <Button onClick={() => loadBooksWithoutCovers(false)} disabled={loading} variant="outline" className="w-full">{loading ? "Carregando..." : "Carregar Mais"}</Button>}</div>}</>
    {selectedBook && <div className="space-y-4 p-4 border rounded-lg bg-muted/50"><div className="flex items-center justify-between"><h3 className="font-semibold">Livro Selecionado</h3><Badge>{selectedBook.lang.toUpperCase()}</Badge></div>
    <div className="space-y-3"><div><Label htmlFor="edit-title">Título</Label><Input id="edit-title" value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} /></div>
    <div><Label htmlFor="edit-author">Autor</Label><Input id="edit-author" value={editedAuthor} onChange={(e) => setEditedAuthor(e.target.value)} /></div>
    <Button onClick={handleSaveMetadata} disabled={savingMetadata} className="w-full" size="sm">{savingMetadata ? "Salvando..." : "Salvar Alterações"}</Button></div>
    {selectedBook.cover_url && <div><Label className="text-sm">Capa Atual</Label><div className="mt-2 w-32 h-44 border rounded overflow-hidden"><img src={selectedBook.cover_url} alt={selectedBook.title} className="w-full h-full object-cover" /></div></div>}
    <div><Label htmlFor="cover-upload">Nova Capa (máx 2MB)</Label><div className="mt-2"><Input id="cover-upload" ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} disabled={uploading} />{uploading && <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2"><Upload className="h-4 w-4 animate-pulse" />Enviando...</p>}</div></div></div>}
    </CardContent></Card>
    {deduplicationResults.length > 0 && <Card className="mt-4"><CardHeader><CardTitle>Resultados</CardTitle><CardDescription>{deduplicationResults.length} grupo(s) mesclados</CardDescription></CardHeader>
    <CardContent><div className="space-y-3">{deduplicationResults.map((r, i) => <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-lg"><div><p className="font-medium">{r.book_title}</p><p className="text-sm text-muted-foreground">{r.book_author}</p></div><Badge variant="secondary">{r.deleted_count} removido(s)</Badge></div>)}</div></CardContent></Card>}
    <AlertDialog open={showDeduplicationDialog} onOpenChange={setShowDeduplicationDialog}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Excluir Duplicados?</AlertDialogTitle><AlertDialogDescription>Identifica e mescla duplicados por título/autor. Ação irreversível.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={handleDeduplicateBooks} disabled={deduplicating}>{deduplicating ? "Processando..." : "Confirmar"}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
  </>);
}
