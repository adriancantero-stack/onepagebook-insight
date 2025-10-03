import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { removeBackground, loadImage } from "@/utils/removeBackground";
import { toast } from "sonner";
import { Download, Loader2 } from "lucide-react";

export default function FaviconProcessor() {
  const [processing, setProcessing] = useState(false);
  const [processedImage, setProcessedImage] = useState<string | null>(null);

  const handleProcessFavicon = async () => {
    setProcessing(true);
    try {
      // Load the current favicon
      const response = await fetch('/favicon.png');
      const blob = await response.blob();
      
      // Load as HTMLImageElement
      const imageElement = await loadImage(blob);
      
      // Remove background
      toast.info("Processando favicon...", {
        description: "Isso pode levar alguns segundos. Usando IA para remover o fundo.",
      });
      
      const resultBlob = await removeBackground(imageElement);
      
      // Create URL for preview
      const url = URL.createObjectURL(resultBlob);
      setProcessedImage(url);
      
      toast.success("Fundo removido!", {
        description: "Clique em 'Baixar' para salvar o novo favicon.",
      });
    } catch (error) {
      console.error('Error processing favicon:', error);
      toast.error("Erro ao processar", {
        description: "Não foi possível remover o fundo do favicon.",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!processedImage) return;
    
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = 'favicon-no-bg.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Download iniciado!", {
      description: "Substitua o arquivo public/favicon.png pelo arquivo baixado.",
    });
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Processador de Favicon</h1>
        <p className="text-muted-foreground mb-8">
          Remove o fundo do favicon atual usando IA
        </p>

        <div className="grid gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Favicon Atual</h2>
            <div className="bg-muted rounded-lg p-8 flex items-center justify-center mb-4">
              <img 
                src="/favicon.png" 
                alt="Favicon atual" 
                className="w-32 h-32 object-contain"
              />
            </div>
            <Button
              onClick={handleProcessFavicon}
              disabled={processing}
              className="w-full"
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processando com IA...
                </>
              ) : (
                "Remover Fundo"
              )}
            </Button>
          </Card>

          {processedImage && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Favicon Processado</h2>
              <div className="bg-muted rounded-lg p-8 flex items-center justify-center mb-4">
                <div className="relative">
                  <div 
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: 'repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%)',
                      backgroundSize: '20px 20px',
                      backgroundPosition: '0 0, 10px 10px'
                    }}
                  />
                  <img 
                    src={processedImage} 
                    alt="Favicon processado" 
                    className="w-32 h-32 object-contain relative z-10"
                  />
                </div>
              </div>
              <Button
                onClick={handleDownload}
                className="w-full"
                variant="secondary"
              >
                <Download className="w-4 h-4 mr-2" />
                Baixar Favicon Sem Fundo
              </Button>
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Após baixar, substitua o arquivo <code className="bg-muted px-1 py-0.5 rounded">public/favicon.png</code> pelo arquivo baixado
              </p>
            </Card>
          )}
        </div>

        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">📝 Instruções:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
            <li>Clique em "Remover Fundo" para processar o favicon</li>
            <li>Aguarde o processamento (pode levar 10-30 segundos)</li>
            <li>Clique em "Baixar Favicon Sem Fundo"</li>
            <li>Substitua o arquivo <code className="bg-background px-1 py-0.5 rounded">public/favicon.png</code> pelo arquivo baixado</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
