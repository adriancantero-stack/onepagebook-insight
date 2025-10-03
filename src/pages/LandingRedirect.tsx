import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LandingRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    // Detect browser language
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
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}
