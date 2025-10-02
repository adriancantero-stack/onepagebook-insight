import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { BookOpen, History, Crown, LogOut, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { LanguageSelector } from "@/components/LanguageSelector";
import Footer from "@/components/Footer";

const Home = () => {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState<any>(null);
  const [bookTitle, setBookTitle] = useState("");
  const [bookAuthor, setBookAuthor] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleGenerateSummary = async () => {
    if (!bookTitle.trim()) {
      toast({
        variant: "destructive",
        title: t("toast.error"),
        description: t("toast.bookTitleRequired"),
      });
      return;
    }

    setLoading(true);

    try {
      // Check usage limit
      const { data: summaries, error: countError } = await supabase
        .from("book_summaries")
        .select("id")
        .eq("user_id", user.id);

      if (countError) throw countError;

      const { data: subscription } = await supabase
        .from("user_subscriptions")
        .select("*, subscription_plans(*)")
        .eq("user_id", user.id)
        .single();

      const plan = subscription?.subscription_plans;
      if (plan?.type === "free" && summaries && summaries.length >= 3) {
        toast({
          variant: "destructive",
          title: t("toast.usageLimitReached"),
          description: t("toast.upgradePrompt"),
        });
        setLoading(false);
        return;
      }

      // Generate summary
      const { data, error } = await supabase.functions.invoke("generate-summary", {
        body: {
          bookTitle,
          bookAuthor,
          language: i18n.language,
        },
      });

      if (error) throw error;

      toast({
        title: t("toast.success"),
        description: t("toast.summaryGenerated"),
      });

      navigate(`/summary/${data.summaryId}`);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t("toast.error"),
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: t("toast.logoutSuccess"),
    });
    navigate("/auth");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            <h1 className="text-xl font-bold">OnePageBook</h1>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSelector />
            <Button variant="ghost" size="sm" onClick={() => navigate("/history")}>
              <History className="w-4 h-4 mr-2" />
              {t("header.history")}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/plans")}>
              <Crown className="w-4 h-4 mr-2" />
              {t("header.premium")}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            {t("home.title")}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t("home.subtitle")}
          </p>
        </div>

        <Card className="max-w-2xl mx-auto p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                {t("home.bookTitle")} *
              </label>
              <Input
                placeholder={t("home.bookTitlePlaceholder")}
                value={bookTitle}
                onChange={(e) => setBookTitle(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t("home.bookAuthor")}
              </label>
              <Input
                placeholder={t("home.bookAuthorPlaceholder")}
                value={bookAuthor}
                onChange={(e) => setBookAuthor(e.target.value)}
                disabled={loading}
              />
            </div>

            <Button
              onClick={handleGenerateSummary}
              className="w-full h-12 text-lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {t("home.generating")}
                </>
              ) : (
                t("home.generateButton")
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              📌 {t("home.freeLimit")} • {t("home.premiumUnlimited")}
            </p>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
