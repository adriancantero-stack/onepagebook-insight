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
import { SummaryFeedback } from "@/components/SummaryFeedback";

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
  const [bookCover, setBookCover] = useState<string | null>(null);
  const [relatedBooksWithCovers, setRelatedBooksWithCovers] = useState<any[]>([]);

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

  // Fetch covers for related books from database
  useEffect(() => {
    const fetchCovers = async () => {
      if (relatedBooks.length === 0) {
        setRelatedBooksWithCovers([]);
        return;
      }

      const booksWithCovers = await Promise.all(
        relatedBooks.map(async (book: Book) => {
          const { data } = await supabase
            .from("books")
            .select("cover_url")
            .eq("title", book.title)
            .eq("author", book.author)
            .eq("lang", book.locale)
            .eq("is_active", true)
            .maybeSingle();

          return {
            ...book,
            cover: data?.cover_url || "/book-placeholder.png"
          };
        })
      );

      setRelatedBooksWithCovers(booksWithCovers);
    };

    fetchCovers();
  }, [relatedBooks]);

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

      let enriched = data as any;

      // Try to enrich with ASIN and cover_url from public books catalog when missing
      if (!enriched?.asin || !enriched?.cover_url) {
        const title = enriched.canonical_title || enriched.book_title;
        const author = enriched.canonical_author || enriched.book_author;
        const lang = enriched.language;
        const { data: book, error: bookErr } = await supabase
          .from("books")
          .select("asin, cover_url")
          .eq("title", title)
          .eq("author", author)
          .eq("lang", lang)
          .eq("is_active", true)
          .maybeSingle();
        if (!bookErr && book) {
          if (book.asin && !enriched.asin) {
            enriched = { ...enriched, asin: book.asin };
          }
          if (book.cover_url) {
            setBookCover(book.cover_url);
          }
        }
      }

      setSummary(enriched);
    } catch (error: any) {
      toast({ variant: "destructive", title: t("toast.error"), description: error.message });
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
      text += `${t("sections.closing")}:\n${summary.closing}\n\n`;
    }
    
    // Add promotional message with site link
    const promoMessages = {
      pt: '📖 Gerado por https://onepagebook.ai - Resuma qualquer livro em 1 página',
      en: '📖 Generated by https://onepagebook.ai - Summarize any book in 1 page',
      es: '📖 Generado por https://onepagebook.ai - Resume cualquier libro en 1 página'
    };
    
    const currentLang = (i18n.language || 'pt').split('-')[0] as 'pt' | 'en' | 'es';
    text += `\n${promoMessages[currentLang] || promoMessages.pt}`;
    
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

    // Add footer to current page (no new page)
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.setTextColor(150, 150, 150); // Gray color
    const footerText = "OnePageBook.ai";
    const footerWidth = doc.getTextWidth(footerText);
    const footerX = (pageWidth - footerWidth) / 2; // Center horizontally
    const footerY = pageHeight - 20; // 20 units from bottom
    doc.text(footerText, footerX, footerY);

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
    
    // Include one-liner
    if (summary.one_liner) {
      shareText += `${t("sections.oneLiner")}:\n${summary.one_liner}\n\n`;
    }
    
    // Include key ideas
    const keyIdeas = summary.key_ideas || summary.main_ideas || [];
    if (keyIdeas.length > 0) {
      shareText += `${t("sections.keyIdeas")}:\n`;
      keyIdeas.forEach((idea: string, index: number) => {
        shareText += `${index + 1}. ${idea}\n`;
      });
      shareText += '\n';
    }
    
    // Include actions
    const actions = summary.actions || [];
    if (actions.length > 0) {
      shareText += `${t("sections.actions")}:\n`;
      actions.forEach((action: string, index: number) => {
        shareText += `${index + 1}. ${action}\n`;
      });
      shareText += '\n';
    }
    
    // Include closing
    if (summary.closing) {
      shareText += `${t("sections.closing")}:\n${summary.closing}\n\n`;
    }
    
    // Add promotional message with site link
    const promoMessages = {
      pt: '📖 Gerado por https://onepagebook.ai - Resuma qualquer livro em 1 página',
      en: '📖 Generated by https://onepagebook.ai - Summarize any book in 1 page',
      es: '📖 Generado por https://onepagebook.ai - Resume cualquier libro en 1 página'
    };
    
    const currentLang = (i18n.language || 'pt').split('-')[0] as 'pt' | 'en' | 'es';
    shareText += `\n${promoMessages[currentLang] || promoMessages.pt}`;
    
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
          summary: 'O essencial do livro',
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
          summary: 'The book essentials',
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
          summary: 'Lo esencial del libro',
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
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-[#E5E5EA]">
        <div className="container mx-auto px-6 sm:px-12 lg:px-24 xl:px-32 py-5 flex items-center justify-between relative">
          <Button variant="ghost" onClick={() => navigate("/")} size="sm" className="hover:bg-[#F5F5F7] rounded-xl transition-all duration-200">
            <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Home</span>
          </Button>
          <div className="flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2">
            <BookOpen className="w-6 h-6 text-[#7B61FF]" />
            <h1 className="text-lg sm:text-xl font-semibold text-[#1D1D1F]">OnePageBook</h1>
          </div>
          <LanguageSelector />
        </div>
      </header>

      <main className="container mx-auto px-6 sm:px-12 lg:px-24 xl:px-32 py-12 sm:py-16 max-w-5xl flex-1">
        <Card className="p-8 sm:p-12 border-border rounded-2xl shadow-sm">
          <div className="flex items-start gap-4 sm:gap-5 mb-6 sm:mb-8 pb-8 border-b border-border">
            <div className="w-16 h-24 sm:w-20 sm:h-28 rounded-xl overflow-hidden shadow-md flex-shrink-0">
              <img 
                src={bookCover || '/book-placeholder.png'} 
                alt={summary.canonical_title || summary.book_title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/book-placeholder.png';
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-3 break-words tracking-tight text-[#1D1D1F]">
                {summary.canonical_title || summary.book_title}
              </h1>
              <p className="text-base sm:text-lg text-[#86868B]">
                {t("summary.by")} {summary.user_author || summary.canonical_author || summary.book_author || t("summary.unknownAuthor")}
                {summary.year && <span className="text-sm ml-2">({summary.year})</span>}
              </p>
            </div>
          </div>


          <div className="space-y-8">
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
            <div className="mt-8 sm:mt-10 pt-8 border-t border-[#E5E5EA] animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <Loader2 className="w-5 h-5 animate-spin text-[#7B61FF]" />
                <h3 className="text-xl font-semibold text-[#1D1D1F]">
                  {t("summary.generating")}...
                </h3>
              </div>
              <div className="space-y-3 p-6 bg-[#F5F5F7] rounded-2xl">
                <Skeleton className="h-16 w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4 rounded-xl" />
              </div>
            </div>
          )}

          {showAudioPlayer && audioSrc && (
            <div className="mt-8 sm:mt-10 pt-8 border-t border-[#E5E5EA] animate-fade-in">
              <h3 className="text-xl font-semibold mb-4 text-[#1D1D1F]">
                🔊 {t("summary.audioPlayer")}
              </h3>
              <AudioPlayer 
                audioUrl={audioSrc as string}
              />
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3 mt-8 sm:mt-10 pt-8 border-t border-[#E5E5EA] w-full">
            <Button 
              onClick={handleListenSummary} 
              disabled={isGeneratingAudio}
              className="flex-1 min-w-[140px] sm:min-w-[160px] bg-white text-[#1D1D1F] border border-[#E5E5EA] hover:bg-[#7B61FF] hover:text-white hover:border-[#7B61FF] rounded-xl transition-all duration-200 text-sm sm:text-base px-4 sm:px-5 py-6 group"
            >
              {isGeneratingAudio ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1 sm:mr-2 shrink-0 animate-spin group-hover:text-white" />
                  <span className="truncate">{t("summary.generating")}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 mr-1 sm:mr-2 shrink-0 group-hover:text-white" />
                  <span className="truncate">{t("summary.listen")}</span>
                </>
              )}
            </Button>
            <Button onClick={handleCopy} variant="outline" className="flex-1 min-w-[140px] sm:min-w-[160px] border-[#E5E5EA] rounded-xl hover:bg-blue-500 hover:text-white transition-all duration-200 text-sm sm:text-base px-4 sm:px-5 py-6 group">
              <Copy className="w-4 h-4 mr-1 sm:mr-2 shrink-0 group-hover:text-white" />
              <span className="truncate">{t("summary.copy")}</span>
            </Button>
            <Button onClick={handleDownload} variant="outline" className="flex-1 min-w-[140px] sm:min-w-[160px] border-[#E5E5EA] rounded-xl hover:bg-red-500 hover:text-white transition-all duration-200 text-sm sm:text-base px-4 sm:px-5 py-6 group">
              <Download className="w-4 h-4 mr-1 sm:mr-2 shrink-0 group-hover:text-white" />
              <span className="truncate">{t("summary.download")}</span>
            </Button>
            <Button onClick={handleShare} variant="outline" className="flex-1 min-w-[140px] sm:min-w-[160px] border-[#E5E5EA] rounded-xl hover:bg-[#25D366] hover:text-white transition-all duration-200 text-sm sm:text-base px-4 sm:px-5 py-6 group">
              <Share2 className="w-4 h-4 mr-1 sm:mr-2 shrink-0 group-hover:text-white" />
              <span className="truncate">{t("summary.share")}</span>
            </Button>
            <BuyOnAmazonButton
              asin={summary?.asin ?? null}
              title={summary.canonical_title || summary.book_title}
              author={summary.canonical_author || summary.book_author}
              locale={(i18n.language || "pt").split("-")[0] as 'pt' | 'en' | 'es'}
              className="flex-1 min-w-[140px] sm:min-w-[160px] text-sm sm:text-base py-6"
            />
          </div>

          {/* Feedback Section */}
          <SummaryFeedback 
            summaryId={summary.id} 
            userId={summary.user_id}
          />

          {/* Related Books Section */}
          {relatedBooksWithCovers.length > 0 && (
            <div className="mt-10 sm:mt-12 pt-10 border-t border-[#E5E5EA]">
              <h3 className="text-2xl sm:text-3xl font-semibold mb-6 text-[#1D1D1F] tracking-tight">{t("summary.relatedBooks")}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                {relatedBooksWithCovers.map((book: Book, index: number) => (
                  <Card 
                    key={index}
                    className="p-6 border-[#E5E5EA] rounded-2xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer"
                    onClick={() => navigate("/home", { state: { bookTitle: book.title, bookAuthor: book.author } })}
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={(book as any).cover || "/book-placeholder.png"}
                        alt={book.title}
                        className="w-16 h-24 object-cover rounded-lg shrink-0"
                        onError={(e) => {
                          e.currentTarget.src = "/book-placeholder.png";
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-base mb-2 line-clamp-2 text-[#1D1D1F]">{book.title}</h4>
                        <p className="text-sm text-[#86868B] mb-3 line-clamp-1">{book.author}</p>
                        <Button size="sm" variant="ghost" className="h-8 text-sm px-3 hover:bg-[#7B61FF] hover:text-white rounded-lg transition-all duration-200">
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
