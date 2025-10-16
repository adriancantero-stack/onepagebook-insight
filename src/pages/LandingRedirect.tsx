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
        
        // Check if A/B test is active and determine variant
        const { data: config } = await supabase
          .from('ab_test_config')
          .select('is_active, split_percentage')
          .single();

        // Check if session already has a variant
        const existingVariant = localStorage.getItem('ab_test_variant');
        
        let variant = 'A';
        
        if (config?.is_active) {
          if (existingVariant) {
            variant = existingVariant;
          } else {
            // Random split
            const random = Math.random() * 100;
            variant = random < (config.split_percentage || 50) ? 'A' : 'B';
            localStorage.setItem('ab_test_variant', variant);
          }
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
