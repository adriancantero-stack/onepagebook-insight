import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Crown, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { LanguageSelector } from "@/components/LanguageSelector";
import Footer from "@/components/Footer";

const Plans = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [currentPlan, setCurrentPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

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

  const handlePlanSelect = (plan: "free" | "premium", billing: "monthly" | "yearly") => {
    // Analytics event
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "plan_select", {
        plan,
        billing,
        locale: i18n.language,
      });
    }

    // Redirect logic
    if (plan === "free") {
      navigate("/signup?plan=free");
    } else if (billing === "monthly") {
      navigate("/checkout?plan=premium&billing=monthly");
    } else {
      navigate("/checkout?plan=premium&billing=yearly");
    }
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
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("summary.back")}
          </Button>
          <LanguageSelector />
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 max-w-5xl flex-1">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t("plans.title")}</h1>
          
          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-2 bg-muted p-1 rounded-lg mt-4">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#5A54E6] focus:ring-offset-2 ${
                billingCycle === "monthly"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("plans.toggle.monthly")}
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#5A54E6] focus:ring-offset-2 ${
                billingCycle === "yearly"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("plans.toggle.yearly")}
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card 
            className={`p-8 ${currentPlan?.type === "free" ? "border-primary" : ""}`}
            role="region"
            aria-label={t("plans.free.name")}
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">{t("plans.free.name")}</h3>
              <div className="text-4xl font-bold mb-4">
                {t("plans.free.price.monthly")}
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {(t("plans.free.bullets", { returnObjects: true }) as string[]).map((bullet: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            {currentPlan?.type === "free" ? (
              <Button className="w-full" disabled>
                {t("plans.currentPlan")}
              </Button>
            ) : (
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => handlePlanSelect("free", "monthly")}
              >
                {t("plans.free.cta")}
              </Button>
            )}
          </Card>

          {/* Premium Plan */}
          <Card 
            className={`p-8 relative ${isPremium ? "border-primary" : "border-primary/50"}`}
            role="region"
            aria-label={t("plans.premium.name")}
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
              <Crown className="w-4 h-4" />
              {t("plans.badge")}
            </div>

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">{t("plans.premium.name")}</h3>
              <div className="text-4xl font-bold mb-2">
                {billingCycle === "monthly" 
                  ? t("plans.premium.price.monthly")
                  : t("plans.premium.price.yearly")
                }
              </div>
              {billingCycle === "yearly" && (
                <p className="text-sm text-primary font-medium">{t("plans.premium.hint")}</p>
              )}
            </div>

            <ul className="space-y-3 mb-8">
              {(t("plans.premium.bullets", { returnObjects: true }) as string[]).map((bullet: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className={index < 2 ? "font-semibold" : ""}>{bullet}</span>
                </li>
              ))}
            </ul>

            {isPremium ? (
              <Button className="w-full" disabled>
                {t("plans.currentPlan")}
              </Button>
            ) : (
              <Button 
                className="w-full bg-[#5A54E6] hover:bg-[#4a44d6] focus:outline-none focus:ring-2 focus:ring-[#5A54E6] focus:ring-offset-2" 
                onClick={() => handlePlanSelect("premium", billingCycle)}
              >
                {t("plans.premium.cta")}
              </Button>
            )}
          </Card>
        </div>

        {/* Trust Line */}
        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            {t("plans.trust")}
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Plans;
