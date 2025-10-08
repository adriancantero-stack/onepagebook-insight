import { BookOpen, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LanguageSelector } from "@/components/LanguageSelector";
import { NavigationMenu } from "@/components/NavigationMenu";
import { Button } from "@/components/ui/button";

interface FloatingHeaderProps {
  onLogout?: () => void;
  showNavigation?: boolean;
}

export const FloatingHeader = ({ onLogout, showNavigation = true }: FloatingHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="w-full max-w-4xl mx-auto pt-4 px-4">
      <div className="px-6 py-3 flex items-center justify-between">
        <div className="flex-1">
          {showNavigation && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/home")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Button>
          )}
        </div>
        {showNavigation && (
          <div className="flex items-center gap-2 justify-center">
            <BookOpen className="w-5 h-5 text-primary" />
            <span className="font-semibold text-sm">OnePageBook</span>
          </div>
        )}
        <div className="flex-1 flex items-center gap-2 justify-end">
          <LanguageSelector />
          <NavigationMenu onLogout={onLogout} />
        </div>
      </div>
    </header>
  );
};
