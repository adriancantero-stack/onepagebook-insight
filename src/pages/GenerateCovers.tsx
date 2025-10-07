import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ImagePlus } from "lucide-react";

export default function GenerateCovers() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const { toast } = useToast();

  const handleGenerateCovers = async () => {
    setIsGenerating(true);
    setResults(null);

    try {
      // Get total count first
      const { data: books, error: booksError } = await supabase
        .from('books')
        .select('id, title, author, cover_url')
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (booksError) throw booksError;
      if (!books || books.length === 0) {
        toast({
          title: "Nenhum livro encontrado",
          description: "Não há livros ativos para atualizar",
        });
        return;
      }

      const totalBooks = books.length;
      setProgress({ current: 0, total: totalBooks });

      const results = {
        success: 0,
        failed: 0,
        skipped: 0,
        errors: [] as string[]
      };

      // Process books in batches
      const batchSize = 10;
      for (let i = 0; i < books.length; i += batchSize) {
        const batch = books.slice(i, i + batchSize);
        
        // Process batch via edge function
        const { data, error } = await supabase.functions.invoke('generate-book-covers', {
          body: { books: batch }
        });

        if (error) {
          console.error('Batch error:', error);
          results.failed += batch.length;
        } else if (data) {
          results.success += data.success || 0;
          results.skipped += data.skipped || 0;
          results.failed += data.failed || 0;
          if (data.errors) results.errors.push(...data.errors);
        }

        // Update progress
        setProgress({ 
          current: Math.min(i + batchSize, totalBooks), 
          total: totalBooks 
        });
      }

      setResults({ results, total: totalBooks, processed: totalBooks });
      toast({
        title: "Capas atualizadas com sucesso!",
        description: `${results.success} capas atualizadas, ${results.skipped} sem alteração, ${results.failed} falhas`,
      });

    } catch (error) {
      console.error('Error updating covers:', error);
      toast({
        title: "Erro ao atualizar capas",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Atualizar Capas de Livros</h1>
          <p className="text-muted-foreground">
            Busca capas originais no Google Books para todos os livros
          </p>
        </div>

        <Card className="p-8 space-y-6">
          <div className="flex justify-center">
            <Button
              onClick={handleGenerateCovers}
              disabled={isGenerating}
              size="lg"
              className="gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Atualizando capas...
                </>
              ) : (
                <>
                  <ImagePlus className="w-5 h-5" />
                  Atualizar Capas
                </>
              )}
            </Button>
          </div>

          {progress && progress.total > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Progresso</span>
                <span>{progress.current} / {progress.total} livros</span>
              </div>
              <Progress value={(progress.current / progress.total) * 100} />
            </div>
          )}

          {results && (
            <div className="space-y-4 mt-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {results.results.success}
                  </div>
                  <div className="text-sm text-muted-foreground">Sucesso</div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {results.results.skipped}
                  </div>
                  <div className="text-sm text-muted-foreground">Sem alteração</div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {results.results.failed}
                  </div>
                  <div className="text-sm text-muted-foreground">Falhas</div>
                </div>
              </div>

              {results.results.errors.length > 0 && (
                <div className="mt-4 p-4 bg-destructive/10 rounded-lg">
                  <h3 className="font-semibold text-destructive mb-2">Erros:</h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    {results.results.errors.map((error: string, idx: number) => (
                      <li key={idx}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>Esta ferramenta busca as capas originais no Google Books para todos os livros.</p>
          <p className="mt-2">Quando não encontrar uma capa, será usado o ícone do site como placeholder.</p>
          <p className="mt-2">O processo pode levar alguns minutos dependendo da quantidade de livros.</p>
        </div>
      </div>
    </div>
  );
}