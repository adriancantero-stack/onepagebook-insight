import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { BookOpen, History, Crown, LogOut, Loader2, Compass } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { LanguageSelector } from "@/components/LanguageSelector";
import Footer from "@/components/Footer";
import { UpgradeModal } from "@/components/UpgradeModal";
import { 
  loadUsage, 
  canUseSummary, 
  incrementSummary, 
  ensureMonth 
} from "@/lib/usageManager";

const Home = () => {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState<any>(null);
  const [bookTitle, setBookTitle] = useState("");
  const [bookAuthor, setBookAuthor] = useState("");
  const [loading, setLoading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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

  // Load book data from Explore page navigation
  useEffect(() => {
    if (location.state?.bookTitle) {
      setBookTitle(location.state.bookTitle);
      setBookAuthor(location.state.bookAuthor || "");
      // Clear the state after loading
      window.history.replaceState({}, document.title);
    }
  }, [location]);

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
      const { data: subscription } = await supabase
        .from("user_subscriptions")
        .select("*, subscription_plans(*)")
        .eq("user_id", user.id)
        .single();

      const plan = subscription?.subscription_plans;
      
      // Check limits only for free users
      if (plan?.type === "free") {
        const usage = ensureMonth(await loadUsage(user.id));
        
        if (!canUseSummary(usage)) {
          setShowUpgradeModal(true);
          toast({
            variant: "destructive",
            title: t("limit.toasts.summary.hard"),
          });
          setLoading(false);
          return;
        }
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

      // Increment counter only on success for free users
      if (plan?.type === "free") {
        const used = await incrementSummary(user.id);
        toast({
          title: t("limit.toasts.summary.ok").replace("{used}", String(used)),
        });
      } else {
        toast({
          title: t("toast.success"),
          description: t("toast.summaryGenerated"),
        });
      }

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
        <div className="container mx-auto px-4 py-4 flex items-center justify-between relative">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            <h1 className="text-xl font-bold hidden sm:block">OnePageBook</h1>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <LanguageSelector />
            <Button variant="ghost" size="sm" onClick={() => navigate("/explore")} className="gap-1 sm:gap-2">
              <Compass className="w-4 h-4" />
              <span className="hidden sm:inline">{t("header.explore")}</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/history")} className="gap-1 sm:gap-2">
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">{t("header.history")}</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/plans")} className="gap-1 sm:gap-2">
              <Crown className="w-4 h-4" />
              <span className="hidden sm:inline">{t("header.premium")}</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 sm:py-16">
        <div className="max-w-2xl mx-auto text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            {t("home.title")}
            <br />
            {t("home.titleLine2")}
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            {t("home.subtitle")}
          </p>
        </div>

        <Card className="max-w-2xl mx-auto p-4 sm:p-8">
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
                t("home.button")
              )}
            </Button>

            <p className="text-sm text-center text-muted-foreground mt-4">
              {t("home.freeInfo")} · <span className="text-primary font-medium">{t("home.premiumInfo")}</span>
            </p>
          </div>
        </Card>
      </main>

      <Footer />
      
      <UpgradeModal 
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        type="summary"
      />
    </div>
  );
};

export default Home;
