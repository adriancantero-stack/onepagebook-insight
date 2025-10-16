import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface LandingHeroBOptimizedProps {
  onCTA: () => void;
}

export default function LandingHeroBOptimized({ onCTA }: LandingHeroBOptimizedProps) {
  const { t } = useTranslation();

  const scrollToHowItWorks = () => {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-purple-50/30 to-background py-20 sm:py-32">
      <div className="container mx-auto px-6 sm:px-12 lg:px-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
          {/* Text Content */}
          <div className="space-y-8 text-center lg:text-left">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Aprenda o Essencial
              </span>
              <br />
              de Qualquer Livro em 5 Minutos
            </h1>

            <p className="text-xl text-muted-foreground sm:text-2xl leading-relaxed">
              Resumos com IA + Flashcards + Áudio + Ação.
              <br />
              <span className="font-semibold text-foreground">
                Transforme leitura em transformação real — todos os dias.
              </span>
            </p>

            <p className="text-base text-muted-foreground">
              Para quem quer aprender mais em menos tempo — e aplicar na vida real.
              Tudo gerado com inteligência artificial de última geração.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                onClick={onCTA}
                className="h-14 px-8 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Comece de Graça Agora
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                onClick={scrollToHowItWorks}
                className="h-14 px-8 text-lg font-semibold"
              >
                Ver Como Funciona
              </Button>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-2 text-sm text-muted-foreground">
              <Play className="h-4 w-4 text-primary" />
              <span className="font-medium cursor-pointer hover:text-foreground transition-colors">
                👀 Assistir demonstração (37s)
              </span>
            </div>
          </div>

          {/* Visual Demo Placeholder */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary/10 to-purple-100/50 shadow-2xl border border-primary/20 flex items-center justify-center">
              <p className="text-muted-foreground text-center px-4">
                [Carrossel de demonstração visual:<br />
                Resumo → Áudio → Flashcards → Exemplos]
              </p>
            </div>

            <div className="absolute -bottom-4 -right-4 bg-background p-4 rounded-xl shadow-lg border">
              <p className="text-sm font-medium">
                Seu cérebro não quer só ler.<br />
                Ele quer <span className="text-primary">entender, lembrar e aplicar.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
