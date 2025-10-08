import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Crown, BookOpen } from "lucide-react";
import { FloatingHeader } from "@/components/FloatingHeader";
import Footer from "@/components/Footer";
import type { BookSummary, UserSubscription } from "@/types";

const History = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [summaries, setSummaries] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      // Load subscription
      const { data: sub } = await supabase
        .from("user_subscriptions")
        .select("*, subscription_plans(*)")
        .eq("user_id", user.id)
        .single();

      setSubscription(sub);

      // Load summaries - no limit, all summaries are kept
      const { data, error } = await supabase
        .from("book_summaries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSummaries(data || []);
    } catch (error) {
      console.error("Error loading history:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>{t("history.loading")}</p>
      </div>
    );
  }

  const isFree = subscription?.subscription_plans?.type === "free";

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <FloatingHeader />

      <main className="container mx-auto px-6 sm:px-12 lg:px-24 xl:px-32 py-8 sm:py-12 flex-1">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <h1 className="text-4xl sm:text-5xl font-semibold text-[#1D1D1F] tracking-tight mb-2">{t("history.title")}</h1>
            <p className="text-[#86868B]">Seus resumos salvos</p>
          </div>
          {isFree && (
            <Button 
              onClick={() => navigate("/plans")} 
              className="w-full sm:w-auto bg-[#7B61FF] hover:bg-[#6951E6] text-white border-none shadow-sm"
            >
              <Crown className="w-4 h-4 mr-2" />
              {t("history.upgrade")}
            </Button>
          )}
        </div>


        {summaries.length === 0 ? (
          <Card className="p-16 text-center border-[#E5E5EA] rounded-2xl">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F5F5F7] mb-6">
              <BookOpen className="w-8 h-8 text-[#86868B]" />
            </div>
            <p className="text-[#1D1D1F] font-medium text-lg mb-2">
              {t("history.empty")}
            </p>
            <p className="text-sm text-[#86868B] mb-6">
              {t("history.emptyDesc")}
            </p>
            <Button 
              onClick={() => navigate("/")}
              className="bg-[#7B61FF] hover:bg-[#6951E6] text-white border-none shadow-sm"
            >
              {t("history.generateFirst")}
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {summaries.map((summary) => (
              <Card
                key={summary.id}
                className="p-6 hover:shadow-lg hover:scale-[1.01] cursor-pointer transition-all duration-200 border-[#E5E5EA] rounded-xl"
                onClick={() => navigate(`/summary/${summary.id}`)}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#7B61FF]/10 rounded-xl">
                    <BookOpen className="w-5 h-5 text-[#7B61FF]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1 text-[#1D1D1F]">
                      {summary.book_title}
                    </h3>
                    {summary.book_author && (
                      <p className="text-sm text-[#86868B] mb-2">
                        {t("summary.by")} {summary.book_author}
                      </p>
                    )}
                    <p className="text-xs text-[#86868B]">
                      {new Date(summary.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-[#E5E5EA] hover:border-[#7B61FF] hover:bg-[#7B61FF] hover:text-white transition-all"
                  >
                    Ver Resumo
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default History;
