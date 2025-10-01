import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Crown, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { LanguageSelector } from "@/components/LanguageSelector";

const Plans = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentPlan, setCurrentPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCurrentPlan();
  }, []);

  const loadCurrentPlan = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data } = await supabase
        .from("user_subscriptions")
        .select("*, subscription_plans(*)")
        .eq("user_id", user.id)
        .single();

      setCurrentPlan(data?.subscription_plans);
    } catch (error) {
      console.error("Error loading plan:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = () => {
    toast({
      title: t("toast.paymentComingSoon"),
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>{t("plans.loading")}</p>
      </div>
    );
  }

  const isPremium = currentPlan?.type === "premium";

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("summary.back")}
          </Button>
          <LanguageSelector />
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t("plans.title")}</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card className={`p-8 ${currentPlan?.type === "free" ? "border-primary" : ""}`}>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">{t("plans.free")}</h3>
              <div className="text-4xl font-bold mb-4">
                R$ 0
                <span className="text-lg text-muted-foreground font-normal">/mês</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>{t("plans.summariesPerMonth", { count: 3 })}</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>{t("plans.basicSupport")}</span>
              </li>
            </ul>

            {currentPlan?.type === "free" && (
              <Button className="w-full" disabled>
                {t("plans.currentPlan")}
              </Button>
            )}
          </Card>

          {/* Premium Plan */}
          <Card className={`p-8 relative ${isPremium ? "border-primary" : "border-primary/50"}`}>
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
              <Crown className="w-4 h-4" />
              {t("plans.recommended")}
            </div>

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">{t("plans.premium")}</h3>
              <div className="text-4xl font-bold mb-4">
                R$ 9,99
                <span className="text-lg text-muted-foreground font-normal">/mês</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="font-semibold">{t("plans.unlimitedSummaries")}</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="font-semibold">{t("plans.prioritySupport")}</span>
              </li>
            </ul>

            {isPremium ? (
              <Button className="w-full" disabled>
                {t("plans.currentPlan")}
              </Button>
            ) : (
              <Button className="w-full" onClick={handleUpgrade}>
                {t("plans.upgrade")}
              </Button>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Plans;
