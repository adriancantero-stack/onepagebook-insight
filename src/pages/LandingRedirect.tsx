import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function LandingRedirect() {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      // Check if user is logged in
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // User is logged in, redirect to home
        navigate("/home", { replace: true });
      } else {
        // User is not logged in, detect browser language
        const browserLang = navigator.language.split("-")[0];
        
        // Map to supported languages, default to Portuguese
        const langMap: Record<string, string> = {
          pt: "pt",
          es: "es",
          en: "en",
        };
        
        const targetLang = langMap[browserLang] || "pt";
        
        // Get A/B test config from backend function
        let config = null;
        try {
          const { data, error } = await supabase.functions.invoke('get-ab-test-config');
          if (!error && data) {
            config = data;
          }
        } catch (error) {
          console.error('Error fetching A/B config:', error);
        }

        // Check if session already has a variant
        const existingVariant = localStorage.getItem('ab_test_variant');
        
        let variant = 'A';
        
        // If test is active, determine variant
        if (config?.is_active) {
          if (existingVariant) {
            variant = existingVariant;
          } else {
            // Random split based on config
            const random = Math.random() * 100;
            variant = random < (config.split_percentage || 50) ? 'A' : 'B';
            localStorage.setItem('ab_test_variant', variant);
          }
        } else if (config?.winner_variant) {
          // Test ended, use winner
          variant = config.winner_variant;
        } else if (existingVariant) {
          // Use existing variant if available
          variant = existingVariant;
        } else {
          // Fallback to 50/50 split if config unavailable
          const random = Math.random() * 100;
          variant = random < 50 ? 'A' : 'B';
          localStorage.setItem('ab_test_variant', variant);
        }
        
        // Redirect to appropriate landing page
        const suffix = variant === 'B' ? '2' : '';
        navigate(`/${targetLang}${suffix}`, { replace: true });
      }
      
      setIsChecking(false);
    };

    checkAuthAndRedirect();
  }, [navigate]);

  if (!isChecking) return null;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}
