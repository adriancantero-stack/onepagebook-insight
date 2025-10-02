import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { BookOpen, History, Crown, LogOut, Loader2, Compass, HelpCircle } from "lucide-react";
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
import type { AuthUser, GenStep } from "@/types";

interface GenState {
  open: boolean;
  step: GenStep;
  message: string;
}

const Home = () => {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [bookTitle, setBookTitle] = useState("");
  const [bookAuthor, setBookAuthor] = useState("");
  const [loading, setLoading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [genState, setGenState] = useState<GenState>({
    open: false,
    step: "resolve",
    message: "",
  });
  const [funMessages, setFunMessages] = useState<Record<GenStep, string>>({
    resolve: "",
    summarize: "",
    polish: "",
    audio: "",
    done: "",
    error: ""
  });
  const navigate = useNavigate();
  const location = useLocation();

  // Calculate progress percentage based on step
  const getProgressPercentage = () => {
    switch (genState.step) {
      case "resolve": return 25;
      case "summarize": return 50;
      case "polish": return 75;
      case "done": return 100;
      default: return 0;
    }
  };

  // Helper to get translation array
  const getTranslationArray = (key: string): string[] => {
    const result = t(key, { returnObjects: true });
    if (Array.isArray(result)) {
      return result.filter((item): item is string => typeof item === 'string');
    }
    return [];
  };

  // Pick random message from array
  const pickRandom = (arr: string[]): string => {
    return arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)] : "";
  };

  // Prepare fun messages for all steps
  const prepareFunMessages = () => {
    const steps: GenStep[] = ["resolve", "summarize", "polish", "audio", "done"];
    const newMessages: Record<GenStep, string> = { resolve: "", summarize: "", polish: "", audio: "", done: "", error: "" };
    
    steps.forEach(step => {
      const arr = getTranslationArray(`fun.${step}`);
      newMessages[step] = pickRandom(arr);
    });
    
    setFunMessages(newMessages);
  };

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

  // Block scroll when overlay is open and prepare fun messages
  useEffect(() => {
    if (genState.open) {
      document.body.style.overflow = "hidden";
      prepareFunMessages();
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [genState.open]);

  // Rotate fun messages every 2.5s
  useEffect(() => {
    if (!genState.open) return;
    
    const rotator = setInterval(() => {
      const currentStep = genState.step;
      const arr = getTranslationArray(`fun.${currentStep}`);
      
      if (arr.length > 1) {
        setFunMessages(prev => {
          const currentMsg = prev[currentStep];
          const filtered = arr.filter(msg => msg !== currentMsg);
          return {
            ...prev,
            [currentStep]: pickRandom(filtered.length > 0 ? filtered : arr)
          };
        });
      }
    }, 2500);
    
    return () => clearInterval(rotator);
  }, [genState.open, genState.step, i18n.language]);

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

    // Ensure user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        variant: "destructive",
        title: t("toast.error"),
        description: "Faça login para gerar um resumo.",
      });
      navigate("/auth");
      return;
    }

    setLoading(true);
    setGenState({ open: true, step: "resolve", message: "" });

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
          setGenState({ open: false, step: "error", message: "" });
          return;
        }
      }

      // Step: Resolve - 5s (mais tempo para ver as mensagens)
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Step: Summarize - start API call in background
      setGenState({ open: true, step: "summarize", message: "" });
      
      // Start API call (don't await yet) - supabase.functions.invoke already sends auth token
      const summaryPromise = supabase.functions.invoke("generate-summary", {
        body: {
          bookTitle,
          bookAuthor,
          language: i18n.language,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      // Continue showing progress while API processes - 12s
      await new Promise(resolve => setTimeout(resolve, 12000));

      // Step: Polish - 10s
      setGenState({ open: true, step: "polish", message: "" });
      await new Promise(resolve => setTimeout(resolve, 10000));

      // Step: Done - wait for API to finish
      setGenState({ open: true, step: "done", message: "" });
      
      // Now wait for the actual API response
      const { data, error } = await summaryPromise;

      if (error) throw error;

      // Small delay on done before closing
      await new Promise(resolve => setTimeout(resolve, 2000));

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

      // Close overlay and navigate
      setTimeout(() => {
        setGenState({ open: false, step: "done", message: "" });
        navigate(`/summary/${data.summaryId}`);
      }, 600);
    } catch (error: any) {
      const msg = error?.message || "";
      setGenState({ 
        open: true, 
        step: "error", 
        message: msg 
      });

      // Handle unauthenticated explicitly
      if (msg.toLowerCase().includes("não autenticado")) {
        toast({
          variant: "destructive",
          title: t("toast.error"),
          description: t("auth.loginRequired") || "Faça login para gerar um resumo.",
        });
        navigate("/auth");
      } else {
        toast({
          variant: "destructive",
          title: t("toast.error"),
          description: msg,
        });
      }

      setTimeout(() => {
        setGenState({ open: false, step: "error", message: "" });
      }, 3000);
      setTimeout(() => {
        setGenState({ open: false, step: "error", message: "" });
      }, 3000);
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

  const isStep = (step: GenStep) => genState.step === step;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Generation Progress Overlay */}
      <div 
        id="gen-overlay" 
        role="dialog" 
        aria-live="polite" 
        aria-modal="true"
        hidden={!genState.open}
      >
        <div className="gen-box">
          <div className="gen-title">{t("gen.loading")}</div>
          <div className="gen-progress-container">
            <div className="gen-progress-track">
              <div 
                className="gen-progress-bar" 
                style={{ width: `${getProgressPercentage()}%` }}
                aria-hidden="true"
              ></div>
            </div>
            <div className="gen-progress-percentage">{getProgressPercentage()}%</div>
          </div>
          <ol className="gen-steps" role="list">
            <li className={isStep("resolve") ? "active" : ""}>
              <div>{t("gen.step.resolve")}</div>
              {isStep("resolve") && <p className="gen-sub">{funMessages.resolve}</p>}
            </li>
            <li className={isStep("summarize") ? "active" : ""}>
              <div>{t("gen.step.summarize")}</div>
              {isStep("summarize") && <p className="gen-sub">{funMessages.summarize}</p>}
            </li>
            <li className={isStep("polish") ? "active" : ""}>
              <div>{t("gen.step.polish")}</div>
              {isStep("polish") && <p className="gen-sub">{funMessages.polish}</p>}
            </li>
            <li className={`${isStep("done") ? "active done" : ""}`}>
              <div>{t("gen.step.done")}</div>
              {isStep("done") && <p className="gen-sub">{funMessages.done}</p>}
            </li>
          </ol>
          <div className="gen-error" hidden={genState.step !== "error"}>
            {t("gen.error")} {genState.message}
          </div>
        </div>
      </div>
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between relative">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground hidden sm:block">OnePageBook</h1>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
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
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/faq")} 
              className="gap-1 sm:gap-2"
              aria-label={t("faq.title_long")}
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline">{t("nav.faq_short")}</span>
            </Button>
            <LanguageSelector />
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
