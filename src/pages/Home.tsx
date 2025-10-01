import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { BookOpen, History, Crown, LogOut, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Home = () => {
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
        title: "Erro",
        description: "Digite o título do livro",
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
          title: "Limite atingido",
          description: "Você já gerou 3 resumos. Faça upgrade para Premium!",
        });
        setLoading(false);
        return;
      }

      // Generate summary
      const { data, error } = await supabase.functions.invoke("generate-summary", {
        body: {
          bookTitle,
          bookAuthor,
        },
      });

      if (error) throw error;

      toast({
        title: "Resumo gerado!",
        description: "Seu resumo está pronto.",
      });

      navigate(`/summary/${data.summaryId}`);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            <h1 className="text-xl font-bold">Livro em 1 Página</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate("/history")}>
              <History className="w-4 h-4 mr-2" />
              Histórico
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/plans")}>
              <Crown className="w-4 h-4 mr-2" />
              Premium
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
            Transforme qualquer livro em um resumo prático
          </h2>
          <p className="text-muted-foreground text-lg">
            Extraia as principais ideias e aplicações práticas em apenas 1 página
          </p>
        </div>

        <Card className="max-w-2xl mx-auto p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Título do livro *
              </label>
              <Input
                placeholder="Ex: Hábitos Atômicos"
                value={bookTitle}
                onChange={(e) => setBookTitle(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Autor (opcional)
              </label>
              <Input
                placeholder="Ex: James Clear"
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
                  Gerando resumo...
                </>
              ) : (
                "Gerar Resumo em 1 Página"
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              📌 Usuários Free: 3 resumos/mês • Premium: ilimitado
            </p>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Home;