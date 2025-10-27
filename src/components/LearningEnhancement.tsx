import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
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
  const { t } = useTranslation();
  const navigate = useNavigate();
  console.log('🎯 LearningEnhancement mounted with summaryId:', summaryId);
  const [isOpen, setIsOpen] = useState(true);
  const [flashcards, setFlashcards] = useState<any[] | null>(null);
  const [examples, setExamples] = useState<any[] | null>(null);
  const [loadingFlashcards, setLoadingFlashcards] = useState(false);
  const [loadingExamples, setLoadingExamples] = useState(false);
  const { toast } = useToast();

  const handleGenerateFlashcards = async () => {
    if (flashcards) return; // Already loaded
    
    setLoadingFlashcards(true);
    try {
      const { data: sessionRes } = await supabase.auth.getSession();
      const token = sessionRes?.session?.access_token;
      const { data, error } = await supabase.functions.invoke('generate-learning-content', {
        body: { summaryId, type: 'flashcards' },
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      if (error || (data as any)?.error) throw new Error((error as any)?.message || (data as any)?.error);

      setFlashcards(data.flashcards);
      
      // If summary was cloned, redirect to the new summary
      if (data.summaryId && data.summaryId !== summaryId) {
        toast({
          title: t("summary.flashcardsGenerated"),
          description: "Resumo adicionado à sua conta."
        });
        navigate(`/summary/${data.summaryId}`, { replace: true });
      } else if (!data.cached) {
        toast({
          title: t("summary.flashcardsGenerated"),
          description: t("summary.flashcardsDesc", { count: data.flashcards.length })
        });
      }
    } catch (error) {
      console.error('Error generating flashcards:', error);
      toast({
        variant: "destructive",
        title: t("summary.errorFlashcards"),
        description: error instanceof Error ? error.message : String(error)
      });
    } finally {
      setLoadingFlashcards(false);
    }
  };

  const handleGenerateExamples = async () => {
    if (examples) return; // Already loaded
    
    setLoadingExamples(true);
    try {
      const { data: sessionRes } = await supabase.auth.getSession();
      const token = sessionRes?.session?.access_token;
      const { data, error } = await supabase.functions.invoke('generate-learning-content', {
        body: { summaryId, type: 'examples' },
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      if (error || (data as any)?.error) throw new Error((error as any)?.message || (data as any)?.error);

      setExamples(data.examples);
      
      // If summary was cloned, redirect to the new summary
      if (data.summaryId && data.summaryId !== summaryId) {
        toast({
          title: t("summary.examplesGenerated"),
          description: "Resumo adicionado à sua conta."
        });
        navigate(`/summary/${data.summaryId}`, { replace: true });
      } else if (!data.cached) {
        toast({
          title: t("summary.examplesGenerated"),
          description: t("summary.examplesDesc", { count: data.examples.length })
        });
      }
    } catch (error) {
      console.error('Error generating examples:', error);
      toast({
        variant: "destructive",
        title: t("summary.errorExamples"),
        description: error instanceof Error ? error.message : String(error)
      });
    } finally {
      setLoadingExamples(false);
    }
  };

  return (
    <div className="mt-10 sm:mt-12 pt-10 border-t border-[#E5E5EA]">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <Card className="border-[#E5E5EA] rounded-2xl overflow-hidden">
          <CollapsibleTrigger className="w-full p-4 sm:p-6 flex items-center justify-between hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2 sm:gap-3">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-primary shrink-0" />
              <div className="text-left">
                <h3 className="text-lg sm:text-xl font-semibold text-foreground">
                  {t("summary.deepenKnowledge")}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  {t("summary.deepenKnowledgeDesc")}
                </p>
              </div>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-muted-foreground transition-transform shrink-0 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </CollapsibleTrigger>

          <CollapsibleContent className="animate-accordion-down">
            <div className="p-4 sm:p-6 pt-0 space-y-4 sm:space-y-6">
              {/* Flashcards Section */}
                <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0" />
                    <h4 className="text-sm sm:text-base font-semibold">{t("summary.flashcardsTitle")}</h4>
                  </div>
                  {!flashcards && (
                    <Button
                      onClick={handleGenerateFlashcards}
                      disabled={loadingFlashcards}
                      size="sm"
                      className="rounded-xl w-full sm:w-auto"
                    >
                      {loadingFlashcards ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {t("summary.generatingContent")}
                        </>
                      ) : (
                        t("summary.generateFlashcards")
                      )}
                    </Button>
                  )}
                </div>

                {flashcards && <FlashcardsPractice flashcards={flashcards} />}
              </div>

              {/* Practical Examples Section */}
              <div className="space-y-4 pt-4 sm:pt-6 border-t border-border">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0" />
                    <h4 className="text-sm sm:text-base font-semibold">{t("summary.practicalExamplesTitle")}</h4>
                  </div>
                  {!examples && (
                    <Button
                      onClick={handleGenerateExamples}
                      disabled={loadingExamples}
                      size="sm"
                      variant="outline"
                      className="rounded-xl w-full sm:w-auto"
                    >
                      {loadingExamples ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {t("summary.generatingContent")}
                        </>
                      ) : (
                        t("summary.generateExamples")
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
