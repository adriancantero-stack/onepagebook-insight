import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, ArrowLeft, Crown } from "lucide-react";
import { LanguageSelector } from "@/components/LanguageSelector";
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

      // Load summaries
      let query = supabase
        .from("book_summaries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      // Limit to 40 for free users (backend also maintains this limit)
      if (sub?.subscription_plans?.type === "free") {
        query = query.limit(40);
      }

      const { data, error } = await query;

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
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between relative">
          <Button variant="ghost" onClick={() => navigate("/")} size="sm">
            <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Home</span>
          </Button>
          <div className="flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2">
            <BookOpen className="w-6 h-6 text-primary" />
            <h1 className="text-lg sm:text-xl font-bold text-foreground">OnePageBook</h1>
          </div>
          <LanguageSelector />
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl flex-1">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">{t("history.title")}</h1>
          {isFree && (
            <Button onClick={() => navigate("/plans")} size="sm" className="w-full sm:w-auto">
              <Crown className="w-4 h-4 mr-2" />
              {t("history.upgrade")}
            </Button>
          )}
        </div>

        {isFree && (
          <Card className="p-4 mb-6 bg-muted">
            <p className="text-sm text-muted-foreground">
              📌 {t("history.freeNotice")}
            </p>
          </Card>
        )}

        {summaries.length === 0 ? (
          <Card className="p-12 text-center">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-2">
              {t("history.empty")}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              {t("history.emptyDesc")}
            </p>
            <Button onClick={() => navigate("/")}>
              {t("history.generateFirst")}
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {summaries.map((summary) => (
              <Card
                key={summary.id}
                className="p-6 hover:border-primary cursor-pointer transition-colors"
                onClick={() => navigate(`/summary/${summary.id}`)}
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">
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
                  <Button variant="outline" size="sm">
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
