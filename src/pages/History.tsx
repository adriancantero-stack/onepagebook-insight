import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, ArrowLeft, Crown } from "lucide-react";

const History = () => {
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

      // Limit to 3 for free users
      if (sub?.subscription_plans?.type === "free") {
        query = query.limit(3);
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
        <p>Carregando...</p>
      </div>
    );
  }

  const isFree = subscription?.subscription_plans?.type === "free";

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Histórico de Resumos</h1>
          {isFree && (
            <Button onClick={() => navigate("/plans")} size="sm">
              <Crown className="w-4 h-4 mr-2" />
              Upgrade
            </Button>
          )}
        </div>

        {isFree && (
          <Card className="p-4 mb-6 bg-muted">
            <p className="text-sm text-muted-foreground">
              📌 Usuários Free podem ver apenas os últimos 3 resumos. Faça upgrade para
              Premium e tenha histórico completo!
            </p>
          </Card>
        )}

        {summaries.length === 0 ? (
          <Card className="p-12 text-center">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              Você ainda não gerou nenhum resumo.
            </p>
            <Button onClick={() => navigate("/")} className="mt-4">
              Gerar primeiro resumo
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
                        por {summary.book_author}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {new Date(summary.created_at).toLocaleDateString("pt-BR")}
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
    </div>
  );
};

export default History;