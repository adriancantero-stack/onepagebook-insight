import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckCircle } from "lucide-react";

const Welcome = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-redirect after 5 seconds
    const timer = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-primary" />
          </div>
          <CardTitle className="text-2xl">
            {t("welcome.title") || "Bem-vindo ao OnePageBook!"}
          </CardTitle>
          <CardDescription className="mt-4">
            {t("welcome.description") || "Sua conta foi criada com sucesso. Você já pode começar a gerar resumos de livros."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
            <BookOpen className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-medium text-sm">
                {t("welcome.freeplan") || "Plano Gratuito Ativado"}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {t("welcome.limits") || "5 resumos + 5 áudios por mês"}
              </p>
            </div>
          </div>
          <Button 
            onClick={() => navigate("/")} 
            className="w-full"
          >
            {t("welcome.cta") || "Começar a usar"}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            {t("welcome.redirect") || "Redirecionando automaticamente em 5 segundos..."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Welcome;
