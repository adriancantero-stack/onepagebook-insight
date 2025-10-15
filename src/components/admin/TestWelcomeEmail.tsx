import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export const TestWelcomeEmail = () => {
  const [email, setEmail] = useState("adrian.cantero1@gmail.com");
  const [userName, setUserName] = useState("Adrian");
  const [language, setLanguage] = useState("pt");
  const [isLoading, setIsLoading] = useState(false);

  const sendTestEmail = async () => {
    if (!email) {
      toast({
        title: "Erro",
        description: "Por favor, insira um email",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create a temporary test HTML to send
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/test-welcome-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            email,
            userName,
            language,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao enviar email");
      }

      toast({
        title: "✅ Email enviado!",
        description: `Email de boas-vindas enviado para ${email}`,
      });
    } catch (error: any) {
      console.error("Error sending test email:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao enviar email",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Testar Email de Boas-Vindas
        </CardTitle>
        <CardDescription>
          Envie um email de boas-vindas de teste para visualizar o design
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email de Destino</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Nome do Usuário</Label>
          <Input
            id="name"
            placeholder="Nome"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">Idioma</Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pt">Português (PT)</SelectItem>
              <SelectItem value="en">English (EN)</SelectItem>
              <SelectItem value="es">Español (ES)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={sendTestEmail}
          disabled={isLoading}
          className="w-full"
        >
          <Send className="w-4 h-4 mr-2" />
          {isLoading ? "Enviando..." : "Enviar Email de Teste"}
        </Button>
      </CardContent>
    </Card>
  );
};
