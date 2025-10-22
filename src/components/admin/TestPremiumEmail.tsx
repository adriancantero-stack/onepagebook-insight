import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Mail, Loader2, Gift } from 'lucide-react';

export const TestPremiumEmail = () => {
  const [email, setEmail] = useState('adrian.cantero1@gmail.com');
  const [language, setLanguage] = useState('pt');
  const [userName, setUserName] = useState('Leitor');
  const [emailType, setEmailType] = useState('day_10');
  const [sending, setSending] = useState(false);

  const handleSendTest = async () => {
    if (!email) {
      toast.error('Por favor, insira um email');
      return;
    }

    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('test-premium-email', {
        body: { email, language, userName, emailType }
      });

      if (error) throw error;

      const dayLabel = emailType === 'day_10' ? 'Dia 10' : 'Dia 7';
      toast.success(`Email Premium de teste (${dayLabel}) enviado para ${email}!`);
      console.log('Test premium email response:', data);
    } catch (error: any) {
      console.error('Error sending test premium email:', error);
      toast.error(`Erro ao enviar email: ${error.message}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-green-600" />
          Testar Email Premium (40% OFF)
        </CardTitle>
        <CardDescription>
          Visualize como ficará o email do Dia 7 ou Dia 10 com cupom WELCOME40
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Tipo de Email</label>
          <Select value={emailType} onValueChange={setEmailType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day_7">📅 Dia 7 - Última chance (40% OFF)</SelectItem>
              <SelectItem value="day_10">🚨 Dia 10 - URGENTE! Expira hoje</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Email de Destino</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@exemplo.com"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Nome do Usuário</label>
          <Input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Nome"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Idioma (define link BRL/USD)</label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pt">🇧🇷 Português (R$)</SelectItem>
              <SelectItem value="en">🇺🇸 English ($)</SelectItem>
              <SelectItem value="es">🇪🇸 Español ($)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            <strong>Cupom:</strong> WELCOME40 (40% OFF)<br />
            {emailType === 'day_10' ? (
              <>
                <strong>Urgência:</strong> MÁXIMA - Último lembrete, expira hoje!<br />
                <strong>Visual:</strong> Design vermelho com animação de pulso
              </>
            ) : (
              <>
                <strong>Validade:</strong> 7 dias (mensagem de urgência)<br />
                <strong>Visual:</strong> Design roxo padrão
              </>
            )}
          </p>
        </div>

        <Button
          onClick={handleSendTest}
          disabled={sending}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {sending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Mail className="h-4 w-4 mr-2" />
              Enviar Email Premium de Teste
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
