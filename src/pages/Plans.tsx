import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Crown } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { FloatingHeader } from "@/components/FloatingHeader";
import Footer from "@/components/Footer";
import type { UserSubscription } from "@/types";

const Plans = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [currentPlan, setCurrentPlan] = useState<UserSubscription | null>(null);
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

      setCurrentPlan(data);
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

  const isPremium = currentPlan?.subscription_plans?.type === "premium";

  return (
    <div className="min-h-screen bg-lilac-50 flex flex-col">
      <FloatingHeader />

      <main className="container mx-auto px-6 sm:px-12 lg:px-24 xl:px-32 py-12 sm:py-20 flex-1">
        <div className="text-center mb-10 sm:mb-14">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-poppins mb-4 text-foreground tracking-tight">{t("plans.title")}</h1>
          <p className="text-lg text-muted-foreground">Escolha o plano ideal para você</p>
          
          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-2 bg-lilac-100 p-1 rounded-xl mt-6">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-5 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                billingCycle === "monthly"
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("plans.toggle.monthly")}
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-5 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                billingCycle === "yearly"
                  ? "bg-white text-[#1D1D1F] shadow-sm"
                  : "text-[#86868B] hover:text-[#1D1D1F]"
              }`}
            >
              {t("plans.toggle.yearly")}
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <Card 
            className={`p-10 border-[#E5E5EA] rounded-2xl transition-all duration-200 hover:shadow-lg ${
              currentPlan?.subscription_plans?.type === "free" ? "border-[#7B61FF] shadow-md" : ""
            }`}
            role="region"
            aria-label={t("plans.free.name")}
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold mb-3 text-[#1D1D1F]">{t("plans.free.name")}</h3>
              <div className="text-5xl font-semibold mb-2 text-[#1D1D1F]">
                {t("plans.free.price.monthly")}
              </div>
              <p className="text-[#86868B]">Para começar</p>
            </div>

            <ul className="space-y-4 mb-8">
              {(t("plans.free.bullets", { returnObjects: true }) as string[]).map((bullet: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#7B61FF] shrink-0 mt-0.5" />
                  <span className="text-[#1D1D1F]">{bullet}</span>
                </li>
              ))}
            </ul>

            {currentPlan?.subscription_plans?.type === "free" ? (
              <Button className="w-full py-6 bg-[#F5F5F7] text-[#86868B] hover:bg-[#F5F5F7] cursor-default" disabled>
                {t("plans.currentPlan")}
              </Button>
            ) : (
              <Button 
                className="w-full py-6 bg-white text-[#7B61FF] border-2 border-[#7B61FF] hover:bg-[#7B61FF] hover:text-white transition-all rounded-xl" 
                onClick={() => handlePlanSelect("free", "monthly")}
              >
                {t("plans.free.cta")}
              </Button>
            )}
          </Card>

          {/* Premium Plan */}
          <Card 
            className={`p-10 relative border-[#7B61FF] rounded-2xl transition-all duration-200 hover:shadow-xl ${
              isPremium ? "shadow-lg" : "shadow-md"
            }`}
            role="region"
            aria-label={t("plans.premium.name")}
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#7B61FF] text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-sm">
              <Crown className="w-4 h-4" />
              {t("plans.badge")}
            </div>

            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold mb-3 text-[#1D1D1F]">{t("plans.premium.name")}</h3>
              <div className="text-5xl font-semibold mb-2 text-[#1D1D1F]">
                {billingCycle === "monthly" 
                  ? t("plans.premium.price.monthly")
                  : t("plans.premium.price.yearly")
                }
              </div>
              {billingCycle === "yearly" && (
                <p className="text-sm text-[#7B61FF] font-medium">{t("plans.premium.hint")}</p>
              )}
              <p className="text-[#86868B] mt-2">Ilimitado</p>
            </div>

            <ul className="space-y-4 mb-8">
              {(t("plans.premium.bullets", { returnObjects: true }) as string[]).map((bullet: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#7B61FF] shrink-0 mt-0.5" />
                  <span className={`text-[#1D1D1F] ${index < 2 ? "font-semibold" : ""}`}>{bullet}</span>
                </li>
              ))}
            </ul>

            {isPremium ? (
              <Button className="w-full py-6 bg-[#F5F5F7] text-[#86868B] hover:bg-[#F5F5F7] cursor-default" disabled>
                {t("plans.currentPlan")}
              </Button>
            ) : (
              <Button 
                className="w-full py-6 bg-[#7B61FF] hover:bg-[#6951E6] text-white border-none shadow-sm transition-all rounded-xl" 
                onClick={async () => {
                  const { data: { user } } = await supabase.auth.getUser();
                  const userId = user?.id || '';
                  const successUrl = `${window.location.origin}/premium-welcome`;
                  const cancelUrl = `${window.location.origin}/plans`;
                  
                  const stripeLink = billingCycle === "monthly" 
                    ? (i18n.language === "pt" 
                        ? `https://buy.stripe.com/fZu28r50YbE76fuaKv3oA00?client_reference_id=${userId}&success_url=${encodeURIComponent(successUrl)}&cancel_url=${encodeURIComponent(cancelUrl)}`
                        : `https://buy.stripe.com/7sY7sL2SQcIb6fu2dZ3oA02?client_reference_id=${userId}&success_url=${encodeURIComponent(successUrl)}&cancel_url=${encodeURIComponent(cancelUrl)}`)
                    : (i18n.language === "pt"
                        ? `https://buy.stripe.com/dRm4gzeByeQj0Va6uf3oA01?client_reference_id=${userId}&success_url=${encodeURIComponent(successUrl)}&cancel_url=${encodeURIComponent(cancelUrl)}`
                        : `https://buy.stripe.com/6oUcN5fFCeQjdHWf0L3oA03?client_reference_id=${userId}&success_url=${encodeURIComponent(successUrl)}&cancel_url=${encodeURIComponent(cancelUrl)}`);
                  
                  window.location.href = stripeLink;
                }}
              >
                {t("plans.premium.cta")}
              </Button>
            )}
          </Card>
        </div>

        {/* Trust Line */}
        <div className="text-center mt-16">
          <p className="text-sm text-[#86868B]">
            Cancele quando quiser · Garantia de 7 dias · Acesso imediato
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Plans;
