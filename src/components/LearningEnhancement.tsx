import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { BookOpen, ChevronDown, Lightbulb, Loader2, Target } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FlashcardsPractice } from "./FlashcardsPractice";
import { PracticalExamples } from "./PracticalExamples";

interface LearningEnhancementProps {
  summaryId: string;
}

export const LearningEnhancement = ({ summaryId }: LearningEnhancementProps) => {
  console.log('🎯 LearningEnhancement mounted with summaryId:', summaryId);
  const [isOpen, setIsOpen] = useState(false);
  const [flashcards, setFlashcards] = useState<any[] | null>(null);
  const [examples, setExamples] = useState<any[] | null>(null);
  const [loadingFlashcards, setLoadingFlashcards] = useState(false);
  const [loadingExamples, setLoadingExamples] = useState(false);
  const { toast } = useToast();

  const handleGenerateFlashcards = async () => {
    if (flashcards) return; // Already loaded
    
    setLoadingFlashcards(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-learning-content', {
        body: { summaryId, type: 'flashcards' }
      });

      if (error) throw error;

      setFlashcards(data.flashcards);
      
      if (!data.cached) {
        toast({
          title: "Flashcards gerados!",
          description: `${data.flashcards.length} cards criados para prática`
        });
      }
    } catch (error) {
      console.error('Error generating flashcards:', error);
      toast({
        variant: "destructive",
        title: "Erro ao gerar flashcards",
        description: error instanceof Error ? error.message : "Tente novamente"
      });
    } finally {
      setLoadingFlashcards(false);
    }
  };

  const handleGenerateExamples = async () => {
    if (examples) return; // Already loaded
    
    setLoadingExamples(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-learning-content', {
        body: { summaryId, type: 'examples' }
      });

      if (error) throw error;

      setExamples(data.examples);
      
      if (!data.cached) {
        toast({
          title: "Exemplos gerados!",
          description: `${data.examples.length} cenários práticos criados`
        });
      }
    } catch (error) {
      console.error('Error generating examples:', error);
      toast({
        variant: "destructive",
        title: "Erro ao gerar exemplos",
        description: error instanceof Error ? error.message : "Tente novamente"
      });
    } finally {
      setLoadingExamples(false);
    }
  };

  return (
    <div className="mt-10 sm:mt-12 pt-10 border-t border-[#E5E5EA]">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <Card className="border-[#E5E5EA] rounded-2xl overflow-hidden">
          <CollapsibleTrigger className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-primary" />
              <div className="text-left">
                <h3 className="text-xl font-semibold text-foreground">
                  Aprofundar Conhecimento
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Flashcards e exemplos práticos para fixar o conteúdo
                </p>
              </div>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-muted-foreground transition-transform ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </CollapsibleTrigger>

          <CollapsibleContent className="animate-accordion-down">
            <div className="p-6 pt-0 space-y-6">
              {/* Flashcards Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    <h4 className="font-semibold">Flashcards para Prática</h4>
                  </div>
                  {!flashcards && (
                    <Button
                      onClick={handleGenerateFlashcards}
                      disabled={loadingFlashcards}
                      size="sm"
                      className="rounded-xl"
                    >
                      {loadingFlashcards ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Gerando...
                        </>
                      ) : (
                        '🎯 Gerar Flashcards'
                      )}
                    </Button>
                  )}
                </div>

                {flashcards && <FlashcardsPractice flashcards={flashcards} />}
              </div>

              {/* Practical Examples Section */}
              <div className="space-y-4 pt-6 border-t border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-primary" />
                    <h4 className="font-semibold">Exemplos Práticos</h4>
                  </div>
                  {!examples && (
                    <Button
                      onClick={handleGenerateExamples}
                      disabled={loadingExamples}
                      size="sm"
                      variant="outline"
                      className="rounded-xl"
                    >
                      {loadingExamples ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Gerando...
                        </>
                      ) : (
                        '💡 Gerar Exemplos'
                      )}
                    </Button>
                  )}
                </div>

                {examples && <PracticalExamples examples={examples} />}
              </div>
            </div>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
};
