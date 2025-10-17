import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useABTest } from "@/hooks/useABTest";

const Welcome = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { trackConversion } = useABTest();

  useEffect(() => {
    const updateSignupMetadata = async () => {
      // Check if there's pending signup metadata from OAuth (Google login)
      const pendingLanguage = localStorage.getItem("pending_signup_language");
      const pendingPath = localStorage.getItem("pending_signup_path");
      const pendingCountry = localStorage.getItem("pending_signup_country");
      
      if (pendingLanguage || pendingPath || pendingCountry) {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user) {
            // Update user metadata
            await supabase.auth.updateUser({
              data: {
                signup_language: pendingLanguage,
                signup_path: pendingPath,
                signup_country: pendingCountry
              }
            });
            
            // Also update the profiles table directly for OAuth users
            await supabase
              .from('profiles')
              .update({
                signup_language: pendingLanguage,
                signup_path: pendingPath,
                signup_country: pendingCountry
              })
              .eq('id', user.id);
            
            console.log('✅ Signup metadata updated for OAuth user:', {
              language: pendingLanguage,
              path: pendingPath,
              country: pendingCountry
            });
            
            // Track signup conversion for A/B test
            await trackConversion('signup');
            
            // Clean up localStorage
            localStorage.removeItem("pending_signup_language");
            localStorage.removeItem("pending_signup_path");
            localStorage.removeItem("pending_signup_country");
          }
        } catch (error) {
          console.error("Error updating signup metadata:", error);
        }
      }
    };
    
    updateSignupMetadata();
    
    // Check if this is a premium conversion from Stripe
    const urlParams = new URLSearchParams(window.location.search);
    const isPremiumConversion = urlParams.get('premium') === 'true';
    
    if (isPremiumConversion) {
      // Track purchase event in Google Analytics
      if (!sessionStorage.getItem('ga_purchase_tracked')) {
        const gtag = (window as any).gtag;
        if (gtag) {
          gtag('event', 'purchase', {
            transaction_id: `premium_${Date.now()}`,
            value: 27.00,
            currency: 'BRL',
            items: [{
              item_id: 'premium_plan',
              item_name: 'Premium Plan',
              price: 27.00,
              quantity: 1
            }]
          });
          sessionStorage.setItem('ga_purchase_tracked', 'true');
        }
      }
      
      // Remove the query parameter
      window.history.replaceState({}, document.title, '/welcome');
    }
    
    // Track sign_up event in Google Analytics
    if (!sessionStorage.getItem('ga_signed') && !isPremiumConversion) {
      const gtag = (window as any).gtag;
      if (gtag) {
        gtag('event', 'sign_up', {
          method: 'email',
          language: document.documentElement.lang || 'en'
        });
      }
      sessionStorage.setItem('ga_signed', '1');
    }

    // Auto-redirect after 5 seconds
    const timer = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-xl text-center space-y-8 animate-fade-in">
        {/* Icon with subtle animation */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <Sparkles className="w-12 h-12 text-primary-foreground" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl font-semibold text-foreground tracking-tight leading-tight">
            {t("welcome.title") || "Bem-vindo ao OnePageBook"}
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground font-normal max-w-md mx-auto leading-relaxed">
            {t("welcome.description") || "Sua conta foi criada com sucesso. Você já pode começar a gerar resumos de livros."}
          </p>
        </div>

        {/* Features card */}
        <div className="bg-card rounded-3xl p-6 sm:p-8 space-y-4 border border-border">
          <div className="flex items-center justify-center gap-3">
            <BookOpen className="w-5 h-5 text-primary" strokeWidth={2} />
            <h3 className="text-base font-semibold text-foreground">
              {t("welcome.freeplan") || "Plano Gratuito Ativado"}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t("welcome.limits") || "5 resumos + 5 áudios por mês"}
          </p>
        </div>

        {/* CTA Button */}
        <div className="pt-4 space-y-4">
          <Button 
            onClick={() => navigate("/")} 
            className="w-full h-12 sm:h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full text-base sm:text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
          >
            {t("welcome.cta") || "Começar a usar"}
          </Button>
          
          <p className="text-xs text-muted-foreground font-normal">
            {t("welcome.redirect") || "Redirecionando automaticamente em 5 segundos..."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
