import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const languages = [
  { code: "pt", name: "Português", flag: "🇧🇷" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
];

export const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLanguageChange = async (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem("language", langCode);
    
    // Update preferred_language in database
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('profiles')
        .update({ preferred_language: langCode })
        .eq('id', user.id);
    }

    // If on landing page, navigate to the new language route preserving variant
    const pathSegment = location.pathname.split('/')[1] || '';
    const isVariantB = pathSegment.endsWith('2');
    const landingRoutes = ['pt', 'en', 'es', 'pt2', 'en2', 'es2'];
    
    if (landingRoutes.includes(pathSegment)) {
      const newRoute = isVariantB ? `/${langCode}2` : `/${langCode}`;
      navigate(newRoute);
    }
  };

  const currentLanguage = languages.find((lang) => lang.code === i18n.language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 border-0 hover:bg-accent group">
          <Globe className="h-4 w-4 text-foreground group-hover:text-primary transition-colors" />
          <span className="hidden sm:inline">{currentLanguage?.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className="gap-2 cursor-pointer"
          >
            <span>{lang.flag}</span>
            <span>{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
