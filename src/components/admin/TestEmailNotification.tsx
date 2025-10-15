import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Mail, Loader2 } from 'lucide-react';

export const TestEmailNotification = () => {
  const [email, setEmail] = useState('adrian.cantero1@gmail.com');
  const [language, setLanguage] = useState('pt');
  const [sending, setSending] = useState(false);

  const handleSendTest = async () => {
    if (!email) {
      toast.error('Por favor, insira um email');
      return;
    }

    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('test-notification-email', {
        body: { email, language }
      });

      if (error) throw error;

      toast.success(`Email de teste enviado para ${email}!`);
      console.log('Test email response:', data);
    } catch (error: any) {
      console.error('Error sending test email:', error);
      toast.error(`Erro ao enviar email: ${error.message}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Testar Notificação por Email
        </CardTitle>
        <CardDescription>
          Envie um email de teste para verificar o sistema de notificações
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
          <label className="text-sm font-medium">Idioma</label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pt">Português</SelectItem>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Español</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleSendTest}
          disabled={sending}
          className="w-full"
        >
          {sending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Mail className="h-4 w-4 mr-2" />
              Enviar Email de Teste
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
