import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, ArrowLeft, Volume2 } from "lucide-react";
import { LanguageSelector } from "@/components/LanguageSelector";
import AudioPlayer from "@/components/AudioPlayer";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const Demo = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);

  const pickVoice = (locale: string): string => {
    switch (locale) {
      case 'pt':
        return 'coral';
      case 'en':
        return 'shimmer';
      case 'es':
        return 'sage';
      default:
        return 'alloy';
    }
  };

  const handleGenerateAudio = async () => {
    const cacheKey = `demo_audio_v1_${i18n.language}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (cached) {
      setAudioUrl(cached);
      setShowAudioPlayer(true);
      return;
    }

    setIsGeneratingAudio(true);
    
    try {
      // Concatenate demo content for TTS
      const keys = Array.isArray(t('demo.keys', { returnObjects: true })) 
        ? (t('demo.keys', { returnObjects: true }) as string[])
        : [];
      const apply = Array.isArray(t('demo.apply', { returnObjects: true }))
        ? (t('demo.apply', { returnObjects: true }) as string[])
        : [];
      
      const textForAudio = [
        t('demo.one'),
        ...keys,
        ...apply,
        t('demo.close')
      ].join('\n\n');

      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: {
          text: textForAudio,
          voice: pickVoice(i18n.language),
        }
      });

      if (error) throw error;

      if (data?.audioContent) {
        const url = `data:audio/mp3;base64,${data.audioContent}`;
        setAudioUrl(url);
        setShowAudioPlayer(true);
        
        // Cache audio URL
        try {
          localStorage.setItem(cacheKey, url);
        } catch (e) {
          console.warn('Could not cache audio:', e);
        }

        toast({
          title: t("summary.audioGenerated"),
          description: t("summary.audioReady"),
        });
      }
    } catch (error: any) {
      console.error('Error generating demo audio:', error);
      toast({
        variant: "destructive",
        title: t("summary.audioError"),
        description: t("summary.audioErrorDesc"),
      });
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const keys = Array.isArray(t('demo.keys', { returnObjects: true })) 
    ? (t('demo.keys', { returnObjects: true }) as string[])
    : [];
  const apply = Array.isArray(t('demo.apply', { returnObjects: true }))
    ? (t('demo.apply', { returnObjects: true }) as string[])
    : [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </Button>
          
          <div className="flex items-center gap-2">
            <LanguageSelector />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <Card className="p-6 md:p-8 space-y-8">
          {/* Title */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <BookOpen className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">
                  {t('demo.title')}
                </h1>
              </div>
            </div>
          </div>

          {/* Audio Section */}
          <div className="space-y-4">
            <Button
              onClick={handleGenerateAudio}
              disabled={isGeneratingAudio}
              className="w-full sm:w-auto gap-2"
              variant="default"
            >
              <Volume2 className="h-4 w-4" />
              {isGeneratingAudio ? t("summary.generating") : t("demo.audio.generate")}
            </Button>

            {showAudioPlayer && audioUrl && (
              <AudioPlayer audioUrl={audioUrl} />
            )}
          </div>

          {/* One-liner Section */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">
              {t("sections.oneLiner")}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {t('demo.one')}
            </p>
          </div>

          {/* Key Ideas Section */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">
              {t("sections.keyIdeas")}
            </h2>
            <ul className="space-y-2">
              {keys.map((idea, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1 flex-shrink-0">•</span>
                  <span className="text-muted-foreground leading-relaxed flex-1">{idea}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Practical Applications Section */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">
              {t("sections.actions")}
            </h2>
            <ul className="space-y-2">
              {apply.map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1 flex-shrink-0">
                    {index + 1}.
                  </span>
                  <span className="text-muted-foreground leading-relaxed flex-1">{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Closing Section */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">
              {t("sections.closing")}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {t('demo.close')}
            </p>
          </div>

          {/* CTA */}
          <div className="pt-4 border-t">
            <Button
              onClick={() => navigate("/")}
              size="lg"
              className="w-full sm:w-auto"
            >
              {t('demo.cta')}
            </Button>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Demo;
