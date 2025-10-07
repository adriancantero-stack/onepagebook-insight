import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Copy, Download, Share2, ArrowLeft, Volume2, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { LanguageSelector } from "@/components/LanguageSelector";
import AudioPlayer from "@/components/AudioPlayer";
import Footer from "@/components/Footer";
import { UpgradeModal } from "@/components/UpgradeModal";
import jsPDF from "jspdf";
import { 
  loadUsage, 
  canUseAudio, 
  incrementAudio, 
  ensureMonth 
} from "@/lib/usageManager";
import { bookCatalog } from "@/data/bookCatalog";
import type { Book } from "@/data/bookCatalog";
import { getThemeCategoryId } from "@/config/themes";
import { SummarySection } from "@/components/SummarySection";
import type { BookSummary } from "@/types";
import { getCachedAudio, saveAudioToCache } from "@/lib/cacheUtils";
import { BuyOnAmazonButton } from "@/components/BuyOnAmazonButton";

const Summary = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioSrc, setAudioSrc] = useState<string | string[] | null>(null);
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Get related book recommendations based on theme - ALWAYS from same category and locale
  const relatedBooks = useMemo(() => {
    if (!summary?.theme) return [];
    
    const locale = (i18n.language || "en").split("-")[0];
    const themeId = getThemeCategoryId(summary.theme);
    
    const category = bookCatalog.find(cat => cat.id === themeId);
    if (!category) return [];
    
    const booksInLocale = category.books.filter(
      (book: Book) => {
        const localeMatch = book.locale === locale;
        const notCurrentBook = book.title.toLowerCase() !== summary.canonical_title?.toLowerCase() &&
                               book.title.toLowerCase() !== summary.user_title?.toLowerCase();
        return localeMatch && notCurrentBook;
      }
    );
    
    if (booksInLocale.length === 0) return [];
    
    const shuffled = [...booksInLocale].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 2);
  }, [summary, i18n.language]);

  useEffect(() => {
    loadSummary();
  }, [id]);

  const loadSummary = async () => {
    try {
      const { data, error } = await supabase
        .from("book_summaries")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setSummary(data);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t("toast.error"),
        description: error.message,
      });
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    const authorName = summary.user_author || summary.canonical_author || summary.book_author || t("summary.unknownAuthor");
    let text = `${summary.canonical_title || summary.book_title}\n`;
    text += `${t("summary.by")} ${authorName}`;
    if (summary.year) text += ` (${summary.year})`;
    text += '\n\n';
    
    if (summary.one_liner) {
      text += `${t("sections.oneLiner")}:\n${summary.one_liner}\n\n`;
    }
    
    if (summary.key_ideas && summary.key_ideas.length > 0) {
      text += `${t("sections.keyIdeas")}:\n${summary.key_ideas.map((idea: string, i: number) => `${i + 1}. ${idea}`).join('\n')}\n\n`;
    } else if (summary.main_ideas && summary.main_ideas.length > 0) {
      text += `${t("sections.keyIdeas")}:\n${summary.main_ideas.map((idea: string, i: number) => `${i + 1}. ${idea}`).join('\n')}\n\n`;
    }
    
    if (summary.actions && summary.actions.length > 0) {
      text += `${t("sections.actions")}:\n${summary.actions.map((action: string, i: number) => `${i + 1}. ${action}`).join('\n')}\n\n`;
    } else if (summary.practical_applications) {
      text += `${t("sections.actions")}:\n${summary.practical_applications}\n\n`;
    }
    
    if (summary.routine) {
      text += `${t("sections.routine")}:\n${summary.routine}\n\n`;
    }
    
    if (summary.plan_7_days) {
      text += `${t("sections.plan7")}:\n${summary.plan_7_days}\n\n`;
    }
    
    if (summary.metrics) {
      text += `${t("sections.metrics")}:\n${summary.metrics}\n\n`;
    }
    
    if (summary.pitfalls) {
      text += `${t("sections.pitfalls")}:\n${summary.pitfalls}\n\n`;
    }
    
    if (summary.closing) {
      text += `${t("sections.closing")}:\n${summary.closing}`;
    }
    
    navigator.clipboard.writeText(text);
    toast({
      title: t("summary.copied"),
    });
  };

  const handleDownload = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);
    let yPosition = 20;

    // Helper to add text with page break
    const addText = (text: string, fontSize: number = 11, fontStyle: string = "normal") => {
      doc.setFontSize(fontSize);
      doc.setFont(undefined, fontStyle);
      const lines = doc.splitTextToSize(text, maxWidth);
      lines.forEach((line: string) => {
        if (yPosition > 280) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(line, margin, yPosition);
        yPosition += fontSize === 11 ? 6 : 7;
      });
    };

    // Title
    doc.setFontSize(16);
    doc.setFont(undefined, "bold");
    const titleLines = doc.splitTextToSize(summary.canonical_title || summary.book_title, maxWidth);
    doc.text(titleLines, margin, yPosition);
    yPosition += titleLines.length * 7 + 5;

    // Author
    doc.setFontSize(12);
    doc.setFont(undefined, "normal");
    const authorName = summary.user_author || summary.canonical_author || summary.book_author || t("summary.unknownAuthor");
    let authorText = `${t("summary.by")} ${authorName}`;
    if (summary.year) authorText += ` (${summary.year})`;
    doc.text(authorText, margin, yPosition);
    yPosition += 15;

    // One-liner
    if (summary.one_liner) {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      doc.setFontSize(13);
      doc.setFont(undefined, "bold");
      doc.text(t("sections.oneLiner"), margin, yPosition);
      yPosition += 8;
      addText(summary.one_liner);
      yPosition += 5;
    }

    // Key Ideas
    const keyIdeas = summary.key_ideas || summary.main_ideas || [];
    if (keyIdeas.length > 0) {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      doc.setFontSize(13);
      doc.setFont(undefined, "bold");
      doc.text(t("sections.keyIdeas"), margin, yPosition);
      yPosition += 8;

      keyIdeas.forEach((idea: string, index: number) => {
        const ideaText = `${index + 1}. ${idea}`;
        addText(ideaText);
        yPosition += 2;
      });
      yPosition += 5;
    }

    // Actions
    const actions = summary.actions || (summary.practical_applications ? summary.practical_applications.split('\n').filter((s: string) => s.trim()) : []);
    if (actions.length > 0) {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      doc.setFontSize(13);
      doc.setFont(undefined, "bold");
      doc.text(t("sections.actions"), margin, yPosition);
      yPosition += 8;

      if (Array.isArray(actions)) {
        actions.forEach((action: string, index: number) => {
          const actionText = `${index + 1}. ${action}`;
          addText(actionText);
          yPosition += 2;
        });
      } else {
        addText(actions);
      }
      yPosition += 5;
    }

    // Routine
    if (summary.routine) {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      doc.setFontSize(13);
      doc.setFont(undefined, "bold");
      doc.text(t("sections.routine"), margin, yPosition);
      yPosition += 8;
      addText(summary.routine);
      yPosition += 5;
    }

    // 7-day Plan
    if (summary.plan_7_days) {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      doc.setFontSize(13);
      doc.setFont(undefined, "bold");
      doc.text(t("sections.plan7"), margin, yPosition);
      yPosition += 8;
      addText(summary.plan_7_days);
      yPosition += 5;
    }

    // Metrics
    if (summary.metrics) {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      doc.setFontSize(13);
      doc.setFont(undefined, "bold");
      doc.text(t("sections.metrics"), margin, yPosition);
      yPosition += 8;
      addText(summary.metrics);
      yPosition += 5;
    }

    // Pitfalls
    if (summary.pitfalls) {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      doc.setFontSize(13);
      doc.setFont(undefined, "bold");
      doc.text(t("sections.pitfalls"), margin, yPosition);
      yPosition += 8;
      addText(summary.pitfalls);
      yPosition += 5;
    }

    // Closing
    if (summary.closing) {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      doc.setFontSize(13);
      doc.setFont(undefined, "bold");
      doc.text(t("sections.closing"), margin, yPosition);
      yPosition += 8;
      addText(summary.closing);
    }

    // Save the PDF
    doc.save(`${summary.canonical_title || summary.book_title}.pdf`);
    
    toast({
      title: t("summary.pdfDownloaded"),
      description: t("summary.pdfDesc"),
    });
  };

  const handleShare = async () => {
    const authorName = summary.user_author || summary.canonical_author || summary.book_author || t("summary.unknownAuthor");
    let shareText = `${summary.canonical_title || summary.book_title}\n`;
    shareText += `${t("summary.by")} ${authorName}`;
    if (summary.year) shareText += ` (${summary.year})`;
    shareText += '\n\n';
    
    if (summary.one_liner) {
      shareText += `${summary.one_liner}\n\n`;
    }
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: summary.canonical_title || summary.book_title,
          text: shareText,
        });
        toast({
          title: t("summary.shared"),
        });
      } catch (error) {
        // Share cancelled by user - silent fail
      }
    } else {
      handleCopy();
    }
  };

  const handleListenSummary = async () => {
    if (!summary || isGeneratingAudio) return;

    try {
      setIsGeneratingAudio(true);
      
      // Get user info to check subscription
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Use the language stored in the database
      const language = summary.language || 'pt';

      // 🎯 CACHE FIRST: Check if audio already exists
      console.log('🔍 [Audio] Checking cache for existing audio...');
      const cachedAudio = await getCachedAudio(summary.id, language);
      
      if (cachedAudio?.signedUrl) {
        console.log('✅ [Audio] Cache hit! Playing from storage');
        setAudioSrc([cachedAudio.signedUrl]);
        setShowAudioPlayer(true);
        toast({
          title: t("summary.audioPlayer"),
          description: t("summary.cachedForFuture"),
        });
        setIsGeneratingAudio(false);
        return;
      }

      console.log('❌ [Audio] No cache. Generating new audio...');

      const { data: subscription } = await supabase
        .from("user_subscriptions")
        .select("*, subscription_plans(*)")
        .eq("user_id", user.id)
        .single();

      const plan = subscription?.subscription_plans;
      
      // Check limits only for free users
      if (plan?.type === "free") {
        const usage = ensureMonth(await loadUsage(user.id));
        
        if (!canUseAudio(usage)) {
          setShowUpgradeModal(true);
          toast({
            variant: "destructive",
            title: t("limit.toasts.audio.hard"),
          });
          setIsGeneratingAudio(false);
          return;
        }
      }
      
      // Translation map for audio section titles
      const audioTerms: Record<string, { 
        by: string; 
        summary: string;
        keyIdeas: string; 
        practicalApplications: string; 
        routine: string;
        plan7Days: string;
        metrics: string;
        pitfalls: string;
        closing: string;
        unknownAuthor: string 
      }> = {
        pt: {
          by: 'por',
          summary: 'O essencial em 1 frase',
          keyIdeas: 'Sacadas que importam',
          practicalApplications: 'Plano de ação',
          routine: 'Exemplo de rotina',
          plan7Days: 'Plano de 7 dias',
          metrics: 'Métricas',
          pitfalls: 'Armadilhas e limites',
          closing: 'Faça acontecer',
          unknownAuthor: 'autor desconhecido'
        },
        en: {
          by: 'by',
          summary: 'The essential in 1 sentence',
          keyIdeas: 'Insights that matter',
          practicalApplications: 'Action plan',
          routine: 'Sample routine',
          plan7Days: '7-day plan',
          metrics: 'Metrics',
          pitfalls: 'Pitfalls and limits',
          closing: 'Make it happen',
          unknownAuthor: 'unknown author'
        },
        es: {
          by: 'por',
          summary: 'Lo esencial en 1 frase',
          keyIdeas: 'Ideas que importan',
          practicalApplications: 'Plan de acción',
          routine: 'Rutina de ejemplo',
          plan7Days: 'Plan de 7 días',
          metrics: 'Métricas',
          pitfalls: 'Trampas y límites',
          closing: 'Hazlo realidad',
          unknownAuthor: 'autor desconocido'
        }
      };

      const terms = audioTerms[language] || audioTerms.pt;
      
      // Helper to capitalize first letter of sentences
      const capitalizeSentences = (text: string): string => {
        return text.replace(/(^\w|[.!?]\s+\w)/g, (match) => match.toUpperCase());
      };
      
      // Combine all text content with section titles - use canonical_title for proper accents
      const bookTitle = summary.canonical_title || summary.book_title;
      const bookAuthor = summary.user_author || summary.canonical_author || summary.book_author || terms.unknownAuthor;
      let fullText = `${bookTitle} ${terms.by} ${bookAuthor}.`;
      
      // Add summary/one-liner with pause
      if (summary.one_liner) {
        fullText += `\n\n\n${terms.summary}.\n\n${capitalizeSentences(summary.one_liner)}`;
      } else if (summary.summary_text) {
        fullText += `\n\n\n${terms.summary}.\n\n${capitalizeSentences(summary.summary_text)}`;
      }
      
      // Add key ideas with pause
      const keyIdeas = summary.key_ideas || summary.main_ideas || [];
      if (keyIdeas.length > 0) {
        const capitalizedIdeas = keyIdeas.map((idea: string) => capitalizeSentences(idea)).join('. ');
        fullText += `\n\n\n${terms.keyIdeas}.\n\n${capitalizedIdeas}.`;
      }
      
      // Add practical actions with pause
      if (summary.actions && summary.actions.length > 0) {
        const capitalizedActions = summary.actions.map((action: string) => capitalizeSentences(action)).join('. ');
        fullText += `\n\n\n${terms.practicalApplications}.\n\n${capitalizedActions}.`;
      } else if (summary.practical_applications) {
        fullText += `\n\n\n${terms.practicalApplications}.\n\n${capitalizeSentences(summary.practical_applications)}`;
      }
      
      // Add routine with pause
      if (summary.routine) {
        fullText += `\n\n\n${terms.routine}.\n\n${capitalizeSentences(summary.routine)}`;
      }
      
      // Add 7-day plan with pause
      if (summary.plan_7_days) {
        fullText += `\n\n\n${terms.plan7Days}.\n\n${capitalizeSentences(summary.plan_7_days)}`;
      }
      
      // Add metrics with pause
      if (summary.metrics) {
        fullText += `\n\n\n${terms.metrics}.\n\n${capitalizeSentences(summary.metrics)}`;
      }
      
      // Add pitfalls with pause
      if (summary.pitfalls) {
        fullText += `\n\n\n${terms.pitfalls}.\n\n${capitalizeSentences(summary.pitfalls)}`;
      }
      
      // Add closing with pause
      if (summary.closing) {
        fullText += `\n\n\n${terms.closing}.\n\n${capitalizeSentences(summary.closing)}`;
      }
      
      fullText = fullText.trim();

      // Call edge function to generate audio
      console.log('🎵 [TTS] Calling edge function with language:', language);
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { 
          text: fullText,
          language: language,
          summaryId: id
        }
      });

      if (error) {
        console.error('🚨 [TTS] Edge function error:', error);
        
        // Handle specific error codes
        if (error.message?.includes('429')) {
          throw new Error(t("summary.audioError") + ': ' + 'Limite de requisições excedido. Tente novamente em alguns instantes.');
        }
        if (error.message?.includes('402')) {
          throw new Error(t("summary.audioError") + ': ' + 'Créditos insuficientes.');
        }
        if (error.message?.includes('401')) {
          throw new Error(t("summary.audioError") + ': ' + 'Erro de autenticação.');
        }
        
        throw new Error(error.message || 'Failed to generate audio');
      }

      // Handle new URL-based format
      if (data?.audioUrl) {
        console.log(`✅ [TTS] Received audio URL (cached: ${data.cached})`);
        setAudioSrc(data.audioUrl);
        setShowAudioPlayer(true);

        // Increment counter only if audio was newly generated (not cached)
        if (!data.cached) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { data: subscription } = await supabase
              .from("user_subscriptions")
              .select("*, subscription_plans(*)")
              .eq("user_id", user.id)
              .single();

            const plan = subscription?.subscription_plans;
            if (plan?.type === "free") {
              const used = await incrementAudio(user.id);
              toast({
                title: t("limit.toasts.audio.ok").replace("{used}", String(used)),
              });
            } else {
              toast({
                title: t("summary.audioGenerated"),
                description: t("summary.cachedForFuture"),
              });
            }
          }
        } else {
          toast({
            title: t("summary.audioReady"),
            description: "Áudio recuperado do cache",
          });
        }
      } else {
        throw new Error('No audio content received from server');
      }
    } catch (error: any) {
      console.error('🚨 [Audio] Error:', error);
      
      // Ensure UI doesn't stay in loading state or blank
      setShowAudioPlayer(false);
      setAudioSrc(null);
      
      toast({
        variant: "destructive",
        title: t("summary.audioError"),
        description: error.message || t("summary.audioErrorDesc"),
      });
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>{t("summary.loading")}</p>
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between relative">
          <Button variant="ghost" onClick={() => navigate("/")} size="sm">
            <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Home</span>
          </Button>
          <div className="flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2">
            <BookOpen className="w-6 h-6 text-primary" />
            <h1 className="text-lg sm:text-xl font-bold text-foreground">OnePageBook</h1>
          </div>
          <LanguageSelector />
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl flex-1">
        <Card className="p-4 sm:p-8">
          <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="p-2 sm:p-3 bg-primary rounded-lg">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2 break-words">
                {summary.canonical_title || summary.book_title}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                {t("summary.by")} {summary.user_author || summary.canonical_author || summary.book_author || t("summary.unknownAuthor")}
                {summary.year && <span className="text-sm ml-2">({summary.year})</span>}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <SummarySection title={t("sections.oneLiner")} content={summary.one_liner} />
            <SummarySection title={t("sections.keyIdeas")} content={summary.key_ideas || summary.main_ideas} />
            <SummarySection title={t("sections.actions")} content={summary.actions || (summary.practical_applications ? summary.practical_applications.split('\n').filter((s: string) => s.trim()) : null)} />
            <SummarySection title={t("sections.routine")} content={summary.routine} />
            <SummarySection title={t("sections.plan7")} content={summary.plan_7_days} />
            <SummarySection title={t("sections.metrics")} content={summary.metrics} />
            <SummarySection title={t("sections.pitfalls")} content={summary.pitfalls} />
            <SummarySection title={t("sections.closing")} content={summary.closing} />
          </div>

          {/* Audio Player Section - appears above buttons after generation */}
          {isGeneratingAudio && (
            <div className="mt-6 sm:mt-8 pt-6 border-t border-border animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                <h3 className="text-lg font-semibold text-foreground">
                  {t("summary.generating")}...
                </h3>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          )}

          {showAudioPlayer && audioSrc && (
            <div className="mt-6 sm:mt-8 pt-6 border-t border-border animate-fade-in">
              <h3 className="text-lg font-semibold mb-3 text-foreground">
                🔊 {t("summary.audioPlayer")}
              </h3>
              <AudioPlayer 
                audioUrl={audioSrc as string}
              />
            </div>
          )}

          <div className="flex flex-wrap gap-2 sm:gap-3 mt-6 sm:mt-8 pt-6 border-t border-border">
            <Button 
              onClick={handleListenSummary} 
              disabled={isGeneratingAudio}
              className="flex-1 min-w-[140px] sm:min-w-[160px] bg-primary hover:bg-primary/90 text-xs sm:text-sm px-3 sm:px-4"
            >
              {isGeneratingAudio ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1 sm:mr-2 shrink-0 animate-spin" />
                  <span className="truncate">{t("summary.generating")}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 mr-1 sm:mr-2 shrink-0" />
                  <span className="truncate">{t("summary.listen")}</span>
                </>
              )}
            </Button>
            <BuyOnAmazonButton
              asin={null}
              title={summary.canonical_title || summary.book_title}
              author={summary.canonical_author || summary.book_author}
              locale={(i18n.language || "pt").split("-")[0] as 'pt' | 'en' | 'es'}
              className="flex-1 min-w-[140px] sm:min-w-[160px] text-xs sm:text-sm px-3 sm:px-4"
            />
            <Button onClick={handleCopy} variant="outline" className="flex-1 min-w-[140px] sm:min-w-[160px] text-xs sm:text-sm px-3 sm:px-4">
              <Copy className="w-4 h-4 mr-1 sm:mr-2 shrink-0" />
              <span className="truncate">{t("summary.copy")}</span>
            </Button>
            <Button onClick={handleDownload} variant="outline" className="flex-1 min-w-[140px] sm:min-w-[160px] text-xs sm:text-sm px-3 sm:px-4">
              <Download className="w-4 h-4 mr-1 sm:mr-2 shrink-0" />
              <span className="truncate">{t("summary.download")}</span>
            </Button>
            <Button onClick={handleShare} variant="outline" className="flex-1 min-w-[140px] sm:min-w-[160px] text-xs sm:text-sm px-3 sm:px-4">
              <Share2 className="w-4 h-4 mr-1 sm:mr-2 shrink-0" />
              <span className="truncate">{t("summary.share")}</span>
            </Button>
          </div>

          {/* Related Books Section */}
          {relatedBooks.length > 0 && (
            <div className="mt-6 sm:mt-8 pt-6 border-t border-border">
              <h3 className="text-lg font-semibold mb-4">{t("summary.relatedBooks")}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {relatedBooks.map((book: Book, index: number) => (
                  <Card 
                    key={index}
                    className="p-4 hover:border-primary transition-colors cursor-pointer"
                    onClick={() => navigate("/", { state: { bookTitle: book.title, bookAuthor: book.author } })}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-md shrink-0">
                        <BookOpen className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm mb-1 line-clamp-2">{book.title}</h4>
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{book.author}</p>
                        <Button size="sm" variant="ghost" className="h-7 text-xs px-2">
                          {t("summary.summarize")}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </Card>
      </main>

      <Footer />
      
      <UpgradeModal 
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        type="audio"
      />
    </div>
  );
};

export default Summary;
