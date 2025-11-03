import { BookOpen, ArrowLeft, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LanguageSelector } from "@/components/LanguageSelector";
import { NavigationMenu } from "@/components/NavigationMenu";
import { Button } from "@/components/ui/button";

interface FloatingHeaderProps {
  onLogout?: () => void;
  showNavigation?: boolean;
}

export const FloatingHeader = ({ onLogout, showNavigation = true }: FloatingHeaderProps) => {
  const navigate = useNavigate();
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const checkPremiumStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("user_subscriptions")
        .select("subscription_plans(type)")
        .eq("user_id", user.id)
        .single();

      setIsPremium(data?.subscription_plans?.type === "premium");
    };

    checkPremiumStatus();
  }, []);

  return (
    <header className="w-full max-w-4xl mx-auto pt-2 sm:pt-4 px-2 sm:px-4">
      <div className="px-2 sm:px-6 py-2 sm:py-3 flex items-center justify-between bg-background rounded-2xl gap-1 sm:gap-2 border-0">
        <div className="flex-1 min-w-0">
          {showNavigation && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/home")}
              className="gap-1 sm:gap-2 p-1 sm:p-2"
            >
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Home</span>
            </Button>
          )}
        </div>
        {showNavigation && (
          <div className="flex items-center gap-1.5 sm:gap-3 justify-center flex-shrink-0">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            <span className="font-bold font-poppins text-xs sm:text-sm text-foreground whitespace-nowrap">OnePageBook</span>
            {isPremium && (
              <div className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/30 px-2.5 py-1 rounded-full shadow-sm">
                <Crown className="w-3.5 h-3.5 text-primary" fill="currentColor" />
                <span className="text-xs font-medium bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Premium</span>
              </div>
            )}
          </div>
        )}
        <div className="flex-1 flex items-center gap-1 sm:gap-2 justify-end min-w-0">
          <LanguageSelector />
          <NavigationMenu onLogout={onLogout} />
        </div>
      </div>
    </header>
  );
};
