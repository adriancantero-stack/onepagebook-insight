import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { LanguageSelector } from "@/components/LanguageSelector";
import Footer from "@/components/Footer";
import { UpgradeModal } from "@/components/UpgradeModal";
import { BookAutocomplete } from "@/components/BookAutocomplete";
import { FloatingHeader } from "@/components/FloatingHeader";
import { BookDetailsModal } from "@/components/BookDetailsModal";

import { 
  loadUsage, 
  canUseSummary, 
  incrementSummary, 
  ensureMonth 
} from "@/lib/usageManager";
import { getCachedSummary } from "@/lib/cacheUtils";
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
  const [bookId, setBookId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBookFeedback, setSelectedBookFeedback] = useState("");
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
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
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
    // Listen first to avoid missing auth events after OAuth redirect
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        setIsCheckingAuth(false);
      } else {
        setUser(null);
      }
    });

    // Then check existing session; if not found, wait briefly before redirecting
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        setIsCheckingAuth(false);
      } else {
        setTimeout(() => {
          supabase.auth.getSession().then(({ data: { session: s2 } }) => {
            if (s2?.user) {
              setUser(s2.user);
            } else {
              navigate("/auth", { replace: true });
            }
            setIsCheckingAuth(false);
          });
        }, 400);
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

  const handleBookSelect = (selectedBookId: string | null, title: string, author: string, source?: 'catalog' | 'history') => {
    setBookId(selectedBookId);
    setBookTitle(title);
    
    // Clear feedback when new book selected
    setSelectedBookFeedback("");
    
    // If it's from history, navigate directly to the existing summary
    if (source === 'history' && selectedBookId) {
      console.log('✅ Navigating to existing summary from history:', selectedBookId);
      navigate(`/summary/${selectedBookId}`);
      return;
    }
    
    if (!selectedBookId) {
      // User chose "use exactly what I typed" - need to ask for author
      setShowDetailsModal(true);
    } else {
      // Book from catalog selected - we have both title and author
      setBookAuthor(author);
    }
  };

  const handleDetailsConfirm = (title: string, author: string) => {
    setBookTitle(title);
    setBookAuthor(author);
    setBookId(null);
  };

  const handleGenerateSummary = async () => {
    if (!bookTitle.trim()) {
      toast({
        variant: "destructive",
        title: t("toast.error"),
        description: t("toast.bookTitleRequired"),
      });
      return;
    }

    // If no author, ask for details
    if (!bookAuthor.trim()) {
      console.log('⚠️ Missing author, showing modal');
      setShowDetailsModal(true);
      return;
    }
    console.log('✅ Ready to generate:', { bookTitle, bookAuthor, bookId });

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
      // Check cache first to avoid regenerating
      const cachedSummary = await getCachedSummary(bookTitle, bookAuthor, i18n.language);
      
      if (cachedSummary) {
        console.log('✅ Found cached summary, redirecting...');
        toast({
          title: t("toast.success"),
          description: t("toast.summaryFound") || "Resumo encontrado!",
        });
        setLoading(false);
        setGenState({ open: false, step: "done", message: "" });
        navigate(`/summary/${cachedSummary.id}`);
        return;
      }

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

      // Fast path: call backend immediately (it will reuse cache or clone if available)
      setGenState({ open: true, step: "summarize", message: "" });

      const { data, error } = await supabase.functions.invoke("generate-summary", {
        body: {
          bookId,
          bookTitle,
          bookAuthor,
          language: i18n.language,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      // Mark done quickly
      setGenState({ open: true, step: "done", message: "" });

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
      }, 200);
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

  if (!user) {
    if (isCheckingAuth) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }
    return null;
  }

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
      <FloatingHeader onLogout={handleLogout} />

      <main className="mx-auto max-w-4xl px-4 sm:px-6 pt-24">
        <header className="w-full text-center pt-8 pb-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            OnePageBook
          </h1>
          <p className="mt-3 text-base md:text-lg text-muted-foreground">
            {i18n.language === 'pt' ? 'Seu livro em uma página.' : 
             i18n.language === 'es' ? 'Tu libro en una página.' : 
             'Your book on one page.'}
          </p>
        </header>

        <div className="mx-auto mt-6 max-w-2xl w-full">
          <Card className="p-4 sm:p-8 border-0 shadow-none">
            <div className="space-y-6">
            <div>
              <BookAutocomplete
                value={bookTitle}
                onChange={setBookTitle}
                onBookSelect={handleBookSelect}
                disabled={loading}
                lang={i18n.language}
              />
              {selectedBookFeedback && (
                <div className="mt-2 text-xs text-primary font-medium">
                  {selectedBookFeedback}
                </div>
              )}
            </div>

            {bookAuthor && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("home.bookAuthor")}
                </label>
                <div className="text-sm text-muted-foreground p-3 bg-muted rounded-md">
                  {bookAuthor}
                </div>
              </div>
            )}

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
        </div>
      </main>

      <Footer />
      
      <UpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        type="summary"
      />

      <BookDetailsModal
        open={showDetailsModal}
        onOpenChange={setShowDetailsModal}
        initialTitle={bookTitle}
        onConfirm={handleDetailsConfirm}
        lang={i18n.language}
      />

    </div>
  );
};

export default Home;
