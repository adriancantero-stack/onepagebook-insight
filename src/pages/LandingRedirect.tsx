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
        
        // Redirect to the appropriate language version
        navigate(`/${targetLang}`, { replace: true });
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
