import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, Copy, Download, Share2, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Summary = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSummary();
  }, [id]);

  const loadSummary = async () => {
    try {
      const { data, error } = await supabase
        .from("book_summaries")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setSummary(data);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar o resumo",
      });
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    const text = `${summary.book_title}\n\n${summary.summary_text}\n\nPrincipais Ideias:\n${summary.main_ideas.join("\n")}\n\nAplicações Práticas:\n${summary.practical_applications}`;
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Resumo copiado para a área de transferência",
    });
  };

  const handleDownload = () => {
    const text = `${summary.book_title}\n\n${summary.summary_text}\n\nPrincipais Ideias:\n${summary.main_ideas.join("\n")}\n\nAplicações Práticas:\n${summary.practical_applications}`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${summary.book_title}.txt`;
    a.click();
    toast({
      title: "Download iniciado!",
      description: "Seu resumo está sendo baixado",
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: summary.book_title,
          text: summary.summary_text,
        });
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      handleCopy();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!summary) return null;

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
        <Card className="p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-primary rounded-lg">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{summary.book_title}</h1>
              {summary.book_author && (
                <p className="text-muted-foreground">por {summary.book_author}</p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">Resumo Geral</h2>
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                {summary.summary_text}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Principais Ideias</h2>
              <ul className="space-y-2">
                {summary.main_ideas.map((idea: string, index: number) => (
                  <li key={index} className="flex gap-3">
                    <span className="text-primary font-bold">{index + 1}.</span>
                    <span>{idea}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Aplicações Práticas</h2>
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                {summary.practical_applications}
              </p>
            </section>
          </div>

          <div className="flex gap-3 mt-8 pt-6 border-t border-border">
            <Button onClick={handleCopy} variant="outline" className="flex-1">
              <Copy className="w-4 h-4 mr-2" />
              Copiar
            </Button>
            <Button onClick={handleDownload} variant="outline" className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Baixar PDF
            </Button>
            <Button onClick={handleShare} variant="outline" className="flex-1">
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Summary;