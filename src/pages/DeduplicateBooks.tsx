import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, BookOpen, CheckCircle, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DeduplicationResult {
  kept_book_id: string;
  deleted_count: number;
  book_title: string;
  book_author: string;
}

const DeduplicateBooks = () => {
  const [isDeduplicating, setIsDeduplicating] = useState(false);
  const [results, setResults] = useState<DeduplicationResult[]>([]);
  const { toast } = useToast();

  const runDeduplication = async () => {
    setIsDeduplicating(true);
    setResults([]);

    try {
      const { data, error } = await supabase.rpc('merge_duplicate_books');

      if (error) {
        throw error;
      }

      setResults(data || []);
      
      const totalMerged = data?.reduce((sum, r) => sum + r.deleted_count, 0) || 0;
      
      toast({
        title: "Deduplicação concluída!",
        description: `${totalMerged} livros duplicados foram mesclados em ${data?.length || 0} livros únicos.`,
      });
    } catch (error: any) {
      console.error("Erro ao deduplic livros:", error);
      toast({
        title: "Erro na deduplicação",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDeduplicating(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <CardTitle>Deduplicação de Livros</CardTitle>
          </div>
          <CardDescription>
            Remove livros duplicados do catálogo mantendo apenas uma cópia de cada livro.
            Duplicatas são identificadas por título e autor (ignorando maiúsculas/minúsculas).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Como funciona</AlertTitle>
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Identifica livros com mesmo título e autor (case-insensitive)</li>
                <li>Mantém o livro mais antigo e desativa os duplicados</li>
                <li>Soma a popularidade de todos os duplicados</li>
                <li>Atualiza referências em recomendações de pessoas famosas</li>
              </ul>
            </AlertDescription>
          </Alert>

          <Button 
            onClick={runDeduplication} 
            disabled={isDeduplicating}
            className="w-full"
            size="lg"
          >
            {isDeduplicating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Executar Deduplicação
              </>
            )}
          </Button>

          {results.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Livros Mesclados ({results.length})
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {results.map((result, idx) => (
                  <Card key={idx} className="bg-muted/50">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{result.book_title}</p>
                          <p className="text-sm text-muted-foreground">{result.book_author}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-green-600">
                            {result.deleted_count} {result.deleted_count === 1 ? 'duplicata removida' : 'duplicatas removidas'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DeduplicateBooks;
