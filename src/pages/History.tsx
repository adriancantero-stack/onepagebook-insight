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
    <div className="min-h-screen bg-lilac-50 flex flex-col">
      <FloatingHeader />

      <main className="container mx-auto px-6 sm:px-12 lg:px-24 xl:px-32 py-8 sm:py-12 flex-1">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold font-poppins text-foreground tracking-tight mb-2">{t("history.title")}</h1>
            <p className="text-muted-foreground">Seus resumos salvos</p>
          </div>
          {isFree && (
            <Button 
              onClick={() => navigate("/plans")} 
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white border-none shadow-sm"
            >
              <Crown className="w-4 h-4 mr-2" />
              {t("history.upgrade")}
            </Button>
          )}
        </div>


        {summaries.length === 0 ? (
          <Card className="p-8 sm:p-16 text-center border-lilac-200 rounded-2xl bg-white">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-lilac-100 mb-6">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <p className="text-foreground font-medium text-lg mb-2">
              {t("history.empty")}
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              {t("history.emptyDesc")}
            </p>
            <Button 
              onClick={() => navigate("/")}
              className="w-full sm:w-auto"
            >
              {t("history.generateFirst")}
            </Button>
          </Card>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {summaries.map((summary) => (
              <Card
                key={summary.id}
                className="p-4 sm:p-6 hover:shadow-lg transition-all duration-200 border-lilac-200 rounded-xl bg-white"
              >
                <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl shrink-0">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold font-poppins text-base sm:text-lg mb-1 text-foreground break-words">
                      {summary.book_title}
                    </h3>
                    {summary.book_author && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {t("summary.by")} {summary.book_author}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {new Date(summary.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button 
                    onClick={() => navigate(`/summary/${summary.id}`)}
                    variant="outline" 
                    size="sm"
                    className="w-full sm:w-auto shrink-0 border-lilac-200 hover:border-primary hover:bg-primary hover:text-white transition-all"
                  >
                    {t("history.viewSummary") || "Ver Resumo"}
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
