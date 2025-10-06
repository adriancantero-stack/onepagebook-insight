import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ImagePlus } from "lucide-react";

export default function GenerateCovers() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const handleGenerateCovers = async () => {
    setIsGenerating(true);
    setResults(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-book-covers');

      if (error) throw error;

      setResults(data);
      toast({
        title: "Capas geradas com sucesso!",
        description: `${data.results.success} capas criadas, ${data.results.failed} falhas`,
      });
    } catch (error) {
      console.error('Error generating covers:', error);
      toast({
        title: "Erro ao gerar capas",
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
          <h1 className="text-4xl font-bold">Gerador de Capas de Livros</h1>
          <p className="text-muted-foreground">
            Gera capas automaticamente para todos os livros que não possuem imagens
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
                  Gerando capas...
                </>
              ) : (
                <>
                  <ImagePlus className="w-5 h-5" />
                  Gerar Capas
                </>
              )}
            </Button>
          </div>

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
                  <div className="text-2xl font-bold text-red-600">
                    {results.results.failed}
                  </div>
                  <div className="text-sm text-muted-foreground">Falhas</div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">
                    {results.total}
                  </div>
                  <div className="text-sm text-muted-foreground">Total</div>
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
          <p>Esta ferramenta usa IA para gerar capas profissionais baseadas no título e autor de cada livro.</p>
          <p className="mt-2">O processo pode levar alguns minutos dependendo da quantidade de livros.</p>
        </div>
      </div>
    </div>
  );
}