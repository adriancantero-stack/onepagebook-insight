import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, Volume2 } from "lucide-react";
import AudioPlayer from "@/components/AudioPlayer";
import Footer from "@/components/Footer";
import { FloatingHeader } from "@/components/FloatingHeader";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useXP } from "@/hooks/useXP";

const Demo = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { addXP } = useXP();
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

        // Play notification sound
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjCJ0fPTgjMGHm7A7+OZUQ8MW6ro7qZaEg1Dl97xwW8gBzKL1PTVhzcHIG/C8OShVhELVKni76peFgtCnd3zwG4fBzCJ0vLUhTYGHG3A7+SaUBALWKvo7alZEw1Dl9zxwW0eBjCK0vPTgzMGG23B8OWcUxELV6vn7qlYEwxBl9vxwGwdBi+J0fLSgjEGGm3A7+WbURAKWKzm76pXEgtBltrzv2sdBi6I0PHTgS8GGWu/7+WbUg8KV6vl7qhXEgpAldnxv2ocBi2IzvDSgC4GGGq+7uSaURAKVqrl7qdWEQk/lNjwvmobBiuGzO/Rfi0GFmm97uObUg4JVKjk7aZUEAg9ksju');
        audio.volume = 0.3;
        audio.play().catch(e => console.warn('Could not play notification sound:', e));

        toast({
          title: t("summary.audioGenerated"),
          description: t("summary.audioReady"),
        });

        // Add XP for generating demo audio
        addXP('audio_generated', 5);
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
    <div className="min-h-screen bg-white flex flex-col">
      <FloatingHeader />

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-6 sm:px-12 lg:px-24 xl:px-32 py-16 max-w-4xl">
        <Card className="p-8 md:p-12 space-y-10 border-[#E5E5EA] rounded-2xl shadow-sm">
          {/* Title */}
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <BookOpen className="h-7 w-7 text-[#7B61FF] mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#1D1D1F] mb-2">
                  {t('demo.title')}
                </h1>
              </div>
            </div>
          </div>

          {/* Audio Section */}
          <div className="space-y-6">
            <Button
              onClick={handleGenerateAudio}
              disabled={isGeneratingAudio}
              className="w-full sm:w-auto gap-2 bg-[#7B61FF] hover:bg-[#6951E6] rounded-xl py-6 px-8 text-base font-medium transition-all duration-200"
            >
              <Volume2 className="h-5 w-5" />
              {isGeneratingAudio ? t("summary.generating") : t("demo.audio.generate")}
            </Button>

            {showAudioPlayer && audioUrl && (
              <div className="p-6 bg-[#F5F5F7] rounded-2xl border border-[#E5E5EA]">
                <AudioPlayer audioUrl={audioUrl} />
              </div>
            )}
          </div>

          {/* One-liner Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#1D1D1F]">
              {t("sections.oneLiner")}
            </h2>
            <p className="text-[#86868B] text-lg leading-relaxed">
              {t('demo.one')}
            </p>
          </div>

          {/* Key Ideas Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#1D1D1F]">
              {t("sections.keyIdeas")}
            </h2>
            <ul className="space-y-3">
              {keys.map((idea, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-[#7B61FF] font-bold text-lg mt-1 flex-shrink-0">•</span>
                  <span className="text-[#86868B] text-lg leading-relaxed flex-1">{idea}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Practical Applications Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#1D1D1F]">
              {t("sections.actions")}
            </h2>
            <ul className="space-y-3">
              {apply.map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-[#7B61FF] font-semibold text-lg mt-1 flex-shrink-0">
                    {index + 1}.
                  </span>
                  <span className="text-[#86868B] text-lg leading-relaxed flex-1">{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Closing Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#1D1D1F]">
              {t("sections.closing")}
            </h2>
            <p className="text-[#86868B] text-lg leading-relaxed">
              {t('demo.close')}
            </p>
          </div>

          {/* CTA */}
          <div className="pt-6 border-t border-[#E5E5EA]">
            <Button
              onClick={() => navigate("/")}
              size="lg"
              className="w-full sm:w-auto bg-[#7B61FF] hover:bg-[#6951E6] rounded-xl px-8 py-6 text-base font-medium transition-all duration-200"
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
