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
          <div className="flex items-center gap-3 justify-center">
            <BookOpen className="w-5 h-5 text-primary" />
            <span className="font-semibold text-sm">OnePageBook</span>
            {isPremium && (
              <div className="flex items-center gap-1.5 bg-gradient-to-r from-[#7B61FF]/10 to-[#9D8CFF]/10 border border-[#7B61FF]/20 px-2.5 py-1 rounded-full">
                <Crown className="w-3.5 h-3.5 text-[#7B61FF]" fill="#7B61FF" />
                <span className="text-xs font-medium text-[#7B61FF]">Premium</span>
              </div>
            )}
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
