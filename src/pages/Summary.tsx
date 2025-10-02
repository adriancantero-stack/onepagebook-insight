import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, Copy, Download, Share2, ArrowLeft, Volume2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { LanguageSelector } from "@/components/LanguageSelector";
import AudioPlayer from "@/components/AudioPlayer";
import Footer from "@/components/Footer";
import { jsPDF } from "jspdf";

const Summary = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioSrc, setAudioSrc] = useState<string | string[] | null>(null);
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);

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
    const text = `${summary.book_title}\n\n${summary.summary_text}\n\n${t("summary.mainIdeas")}:\n${summary.main_ideas.join("\n")}\n\n${t("summary.practicalApplications")}:\n${summary.practical_applications}`;
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

    // Title
    doc.setFontSize(16);
    doc.setFont(undefined, "bold");
    const titleLines = doc.splitTextToSize(summary.book_title, maxWidth);
    doc.text(titleLines, margin, yPosition);
    yPosition += titleLines.length * 7 + 5;

    // Author
    if (summary.book_author) {
      doc.setFontSize(12);
      doc.setFont(undefined, "normal");
      doc.text(`${t("summary.by")} ${summary.book_author}`, margin, yPosition);
      yPosition += 10;
    }

    // Summary text
    doc.setFontSize(11);
    doc.setFont(undefined, "normal");
    const summaryLines = doc.splitTextToSize(summary.summary_text, maxWidth);
    summaryLines.forEach((line: string) => {
      if (yPosition > 280) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, margin, yPosition);
      yPosition += 6;
    });

    yPosition += 5;

    // Main Ideas
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    doc.setFontSize(13);
    doc.setFont(undefined, "bold");
    doc.text(t("summary.mainIdeas"), margin, yPosition);
    yPosition += 8;

    doc.setFontSize(11);
    doc.setFont(undefined, "normal");
    summary.main_ideas.forEach((idea: string, index: number) => {
      const ideaText = `${index + 1}. ${idea}`;
      const ideaLines = doc.splitTextToSize(ideaText, maxWidth);
      ideaLines.forEach((line: string) => {
        if (yPosition > 280) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(line, margin, yPosition);
        yPosition += 6;
      });
      yPosition += 2;
    });

    yPosition += 5;

    // Practical Applications
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    doc.setFontSize(13);
    doc.setFont(undefined, "bold");
    doc.text(t("summary.practicalApplications"), margin, yPosition);
    yPosition += 8;

    doc.setFontSize(11);
    doc.setFont(undefined, "normal");
    const applicationsLines = doc.splitTextToSize(summary.practical_applications, maxWidth);
    applicationsLines.forEach((line: string) => {
      if (yPosition > 280) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, margin, yPosition);
      yPosition += 6;
    });

    // Save the PDF
    doc.save(`${summary.book_title}.pdf`);
    
    toast({
      title: "PDF baixado!",
      description: "O resumo foi salvo em PDF.",
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: summary.book_title,
          text: summary.summary_text,
        });
        toast({
          title: t("summary.shared"),
        });
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      handleCopy();
    }
  };

  const handleListenSummary = async () => {
    if (!summary || isGeneratingAudio) return;

    try {
      setIsGeneratingAudio(true);
      
      // Use the language stored in the database
      const language = summary.language || 'pt';
      
      // Translation map for audio terms
      const audioTerms: Record<string, { by: string; mainIdeas: string; practicalApplications: string; unknownAuthor: string }> = {
        pt: {
          by: 'por',
          mainIdeas: 'Ideias Principais:',
          practicalApplications: 'Aplicações Práticas:',
          unknownAuthor: 'autor desconhecido'
        },
        en: {
          by: 'by',
          mainIdeas: 'Main Ideas:',
          practicalApplications: 'Practical Applications:',
          unknownAuthor: 'unknown author'
        },
        es: {
          by: 'por',
          mainIdeas: 'Ideas Principales:',
          practicalApplications: 'Aplicaciones Prácticas:',
          unknownAuthor: 'autor desconocido'
        }
      };

      const terms = audioTerms[language] || audioTerms.pt;
      
      // Combine all text content with correct language terms
      const fullText = `
        ${summary.book_title} ${terms.by} ${summary.book_author || terms.unknownAuthor}.
        
        ${summary.summary_text}
        
        ${terms.mainIdeas}
        ${summary.main_ideas.join('. ')}
        
        ${terms.practicalApplications}
        ${summary.practical_applications}
      `.trim();
      
      console.log('Generating audio for language:', language);

      // Call edge function to generate audio
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { 
          text: fullText,
          language: language
        }
      });

      if (error) {
        console.error('Error generating audio:', error);
        throw new Error(error.message || 'Failed to generate audio');
      }

      // Handle both new format (audioChunks) and old format (audioContent)
      if (data?.audioChunks && Array.isArray(data.audioChunks)) {
        // New chunked format
        console.log(`Received ${data.audioChunks.length} audio chunks`);
        
        const audioUrls = data.audioChunks.map((chunk: string) => {
          const audioBlob = new Blob(
            [Uint8Array.from(atob(chunk), c => c.charCodeAt(0))],
            { type: data.mimeType || 'audio/mpeg' }
          );
          return URL.createObjectURL(audioBlob);
        });
        
        setAudioSrc(audioUrls);
        setShowAudioPlayer(true);

        toast({
          title: "Áudio gerado!",
          description: `Resumo dividido em ${audioUrls.length} parte(s).`,
        });
      } else if (data?.audioContent) {
        // Old single audio format (backward compatibility)
        const audioBlob = new Blob(
          [Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))],
          { type: 'audio/mpeg' }
        );
        const audioUrl = URL.createObjectURL(audioBlob);
        
        setAudioSrc(audioUrl);
        setShowAudioPlayer(true);

        toast({
          title: "Áudio gerado!",
          description: "Você pode ouvir o resumo agora.",
        });
      } else {
        throw new Error('No audio content received from server');
      }
    } catch (error: any) {
      console.error('Error generating audio:', error);
      toast({
        variant: "destructive",
        title: "Erro ao gerar áudio",
        description: error.message || "Não foi possível gerar o áudio. Tente novamente.",
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
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("summary.back")}
          </Button>
          <LanguageSelector />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl flex-1">
        <Card className="p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-primary rounded-lg">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{summary.book_title}</h1>
              <p className="text-muted-foreground">
                {t("summary.by")} {summary.book_author || t("summary.unknownAuthor")}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {showAudioPlayer && audioSrc && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-foreground">
                  🔊 Player de Áudio
                </h3>
                <AudioPlayer 
                  audioSrc={audioSrc} 
                  onEnded={() => console.log('Audio playback ended')}
                />
              </div>
            )}

            <section>
              <h2 className="text-xl font-semibold mb-3">{t("summary.mainIdeas").replace(":", "")}</h2>
              <p className="text-foreground leading-relaxed whitespace-pre-wrap text-justify">
                {summary.summary_text}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t("summary.mainIdeas")}</h2>
              <ul className="space-y-2">
                {summary.main_ideas.map((idea: string, index: number) => (
                  <li key={index} className="flex gap-3">
                    <span className="text-primary font-bold">{index + 1}.</span>
                    <span>{idea}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t("summary.practicalApplications")}</h2>
              <p className="text-foreground leading-relaxed whitespace-pre-wrap text-justify">
                {summary.practical_applications}
              </p>
            </section>
          </div>

          <div className="flex gap-3 mt-8 pt-6 border-t border-border flex-wrap">
            <Button 
              onClick={handleListenSummary} 
              disabled={isGeneratingAudio}
              className="flex-1 min-w-[150px] bg-primary hover:bg-primary/90"
            >
              <Volume2 className="w-4 h-4 mr-2" />
              {isGeneratingAudio ? "Gerando..." : "Escutar Resumo"}
            </Button>
            <Button onClick={handleCopy} variant="outline" className="flex-1 min-w-[150px]">
              <Copy className="w-4 h-4 mr-2" />
              {t("summary.copy")}
            </Button>
            <Button onClick={handleDownload} variant="outline" className="flex-1 min-w-[150px]">
              <Download className="w-4 h-4 mr-2" />
              {t("summary.download")}
            </Button>
            <Button onClick={handleShare} variant="outline" className="flex-1 min-w-[150px]">
              <Share2 className="w-4 h-4 mr-2" />
              {t("summary.share")}
            </Button>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Summary;
