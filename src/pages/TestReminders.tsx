import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Mail, CheckCircle2, XCircle } from "lucide-react";

const TestReminders = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const sendReminders = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      console.log("📧 Disparando envio de lembretes...");
      
      const { data, error } = await supabase.functions.invoke('send-daily-reminders', {
        body: {}
      });

      if (error) {
        console.error("❌ Erro ao enviar lembretes:", error);
        toast.error("Erro ao enviar lembretes: " + error.message);
        setResult({ success: false, error: error.message });
      } else {
        console.log("✅ Lembretes enviados:", data);
        toast.success(`${data.emailsSent || 0} lembretes enviados com sucesso!`);
        setResult(data);
      }
    } catch (err) {
      console.error("❌ Erro:", err);
      toast.error("Erro ao enviar lembretes");
      setResult({ success: false, error: String(err) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-6 w-6" />
            Teste de Envio de Lembretes
          </CardTitle>
          <CardDescription>
            Envia lembretes diários para todos os 251 usuários cadastrados com notificações habilitadas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={sendReminders}
            disabled={loading}
            size="lg"
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando lembretes...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Enviar Lembretes Agora
              </>
            )}
          </Button>

          {result && (
            <Card className={result.success ? "border-green-500" : "border-red-500"}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  {result.success ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      Sucesso
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-red-500" />
                      Erro
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}

          <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
            <p className="font-semibold">ℹ️ Informações:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Total de usuários cadastrados: 251</li>
              <li>Usuários com notificações habilitadas: 251</li>
              <li>Horário configurado automático: 09:00 UTC (6h AM Brasil)</li>
              <li>Frequência: Diária (a cada 24 horas)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestReminders;
