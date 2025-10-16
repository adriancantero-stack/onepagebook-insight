import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, MousePointerClick, Trophy } from "lucide-react";

interface ABTestMetrics {
  variant: 'A' | 'B';
  sessions: number;
  conversions: number;
  conversionRate: number;
  byLanguage: {
    pt: { sessions: number; conversions: number };
    en: { sessions: number; conversions: number };
    es: { sessions: number; conversions: number };
  };
}

export default function ABTestDashboard() {
  const [metricsA, setMetricsA] = useState<ABTestMetrics | null>(null);
  const [metricsB, setMetricsB] = useState<ABTestMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    setLoading(true);

    // Fetch sessions for both variants
    const { data: sessionsData } = await supabase
      .from('ab_test_sessions')
      .select('variant, language');

    // Fetch conversions for both variants
    const { data: conversionsData } = await supabase
      .from('ab_test_conversions')
      .select('variant, language, conversion_type');

    if (!sessionsData || !conversionsData) {
      setLoading(false);
      return;
    }

    const calculateMetrics = (variant: 'A' | 'B'): ABTestMetrics => {
      const sessions = sessionsData.filter(s => s.variant === variant);
      const conversions = conversionsData.filter(c => c.variant === variant);

      const byLanguage = {
        pt: {
          sessions: sessions.filter(s => s.language === 'pt').length,
          conversions: conversions.filter(c => c.language === 'pt').length,
        },
        en: {
          sessions: sessions.filter(s => s.language === 'en').length,
          conversions: conversions.filter(c => c.language === 'en').length,
        },
        es: {
          sessions: sessions.filter(s => s.language === 'es').length,
          conversions: conversions.filter(c => c.language === 'es').length,
        },
      };

      return {
        variant,
        sessions: sessions.length,
        conversions: conversions.length,
        conversionRate: sessions.length > 0 ? (conversions.length / sessions.length) * 100 : 0,
        byLanguage,
      };
    };

    setMetricsA(calculateMetrics('A'));
    setMetricsB(calculateMetrics('B'));
    setLoading(false);
  };

  const endTest = async (winner: 'A' | 'B') => {
    await supabase
      .from('ab_test_config')
      .update({
        is_active: false,
        ended_at: new Date().toISOString(),
        winner_variant: winner,
      })
      .eq('id', (await supabase.from('ab_test_config').select('id').single()).data?.id);

    alert(`Teste finalizado! Vencedor: Landing ${winner}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!metricsA || !metricsB) return null;

  const winner = metricsA.conversionRate > metricsB.conversionRate ? 'A' : 'B';

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Dashboard A/B Testing</h1>
        <p className="text-muted-foreground">Comparação de performance entre Landing A e Landing B</p>
      </div>

      {/* Winner Banner */}
      <Card className="p-6 mb-8 bg-gradient-to-r from-primary/10 to-purple-50 border-primary/20">
        <div className="flex items-center gap-4">
          <Trophy className="h-12 w-12 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">
              Landing {winner} está na frente!
            </h2>
            <p className="text-muted-foreground">
              Com {winner === 'A' ? metricsA.conversionRate.toFixed(2) : metricsB.conversionRate.toFixed(2)}% de taxa de conversão
            </p>
          </div>
        </div>
      </Card>

      {/* Main Comparison */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Landing A */}
        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-1">Landing A (Original)</h2>
            <p className="text-sm text-muted-foreground">Versão atual</p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span>Visualizações</span>
              </div>
              <span className="text-2xl font-bold">{metricsA.sessions}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MousePointerClick className="h-5 w-5 text-muted-foreground" />
                <span>Conversões</span>
              </div>
              <span className="text-2xl font-bold">{metricsA.conversions}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
                <span>Taxa de Conversão</span>
              </div>
              <span className="text-2xl font-bold text-primary">{metricsA.conversionRate.toFixed(2)}%</span>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Por idioma</h3>
            {Object.entries(metricsA.byLanguage).map(([lang, data]) => (
              <div key={lang} className="flex justify-between text-sm mb-2">
                <span className="uppercase font-medium">{lang}:</span>
                <span>{data.conversions}/{data.sessions} ({data.sessions > 0 ? ((data.conversions / data.sessions) * 100).toFixed(1) : 0}%)</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Landing B */}
        <Card className="p-6 border-primary/50">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-1">Landing B (Teste)</h2>
            <p className="text-sm text-muted-foreground">Versão nova</p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span>Visualizações</span>
              </div>
              <span className="text-2xl font-bold">{metricsB.sessions}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MousePointerClick className="h-5 w-5 text-muted-foreground" />
                <span>Conversões</span>
              </div>
              <span className="text-2xl font-bold">{metricsB.conversions}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
                <span>Taxa de Conversão</span>
              </div>
              <span className="text-2xl font-bold text-primary">{metricsB.conversionRate.toFixed(2)}%</span>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Por idioma</h3>
            {Object.entries(metricsB.byLanguage).map(([lang, data]) => (
              <div key={lang} className="flex justify-between text-sm mb-2">
                <span className="uppercase font-medium">{lang}:</span>
                <span>{data.conversions}/{data.sessions} ({data.sessions > 0 ? ((data.conversions / data.sessions) * 100).toFixed(1) : 0}%)</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Actions */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">Ações</h3>
        <div className="flex gap-4">
          <Button
            size="lg"
            variant="outline"
            onClick={() => endTest('A')}
          >
            Promover Landing A como Vencedor
          </Button>
          <Button
            size="lg"
            onClick={() => endTest('B')}
            className="bg-primary"
          >
            Promover Landing B como Vencedor
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Ao finalizar o teste, o redirecionamento automático será desativado e todos os usuários verão a landing vencedora.
        </p>
      </Card>
    </div>
  );
}
