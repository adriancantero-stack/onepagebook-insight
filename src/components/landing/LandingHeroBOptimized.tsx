import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

interface LandingHeroBOptimizedProps {
  onCTA: () => void;
}

export default function LandingHeroBOptimized({ onCTA }: LandingHeroBOptimizedProps) {
  const { t } = useTranslation();

  const scrollToHowItWorks = () => {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-purple-50/30 to-background py-12 sm:py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-24">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Text Content */}
          <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Aprenda o Essencial
              </span>
              <br />
              de Qualquer Livro em 5 Minutos
            </h1>

            <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground leading-relaxed">
              Resumos com IA + Flashcards + Áudio + Ação.
              <br />
              <span className="font-semibold text-foreground">
                Transforme leitura em transformação real — todos os dias.
              </span>
            </p>

            <p className="text-sm sm:text-base text-muted-foreground">
              Para quem quer aprender mais em menos tempo — e aplicar na vida real.
              Tudo gerado com inteligência artificial de última geração.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                onClick={onCTA}
                className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
              >
                Comece de Graça Agora
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                onClick={scrollToHowItWorks}
                className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg font-semibold w-full sm:w-auto"
              >
                Ver Como Funciona
              </Button>
            </div>
          </div>

          {/* Visual Demo Placeholder */}
          <div className="relative mt-8 lg:mt-0">
            <div className="aspect-[4/3] rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary/10 to-purple-100/50 shadow-xl sm:shadow-2xl border border-primary/20 flex items-center justify-center p-4">
              <p className="text-xs sm:text-sm text-muted-foreground text-center">
                [Carrossel de demonstração visual:<br />
                Resumo → Áudio → Flashcards → Exemplos]
              </p>
            </div>

            <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 bg-background p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-lg border max-w-[200px] sm:max-w-none">
              <p className="text-xs sm:text-sm font-medium">
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
