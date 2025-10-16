import { Search, Sparkles, Brain, TestTube, Headphones, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LandingHowItWorksBProps {
  onCTA: () => void;
}

export default function LandingHowItWorksB({ onCTA }: LandingHowItWorksBProps) {
  const steps = [
    { icon: Search, title: "Escolha um livro", desc: "(ou digite qualquer título)" },
    { icon: Sparkles, title: "Receba o resumo em 1 página", desc: "Gerado com IA avançada" },
    { icon: Brain, title: "Estude com flashcards inteligentes", desc: "Memorização ativa" },
    { icon: TestTube, title: "Veja exemplos práticos", desc: "De aplicação real" },
    { icon: Headphones, title: "Escute com voz realista", desc: "No seu ritmo" },
    { icon: Share2, title: "Salve, exporte ou compartilhe", desc: "PDF, áudio ou link" },
  ];

  return (
    <section id="how-it-works" className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-24 py-12 sm:py-16 lg:py-24 bg-gradient-to-b from-background to-primary/5">
      <h2 className="mb-8 sm:mb-12 lg:mb-16 text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
        Como Funciona
      </h2>

      <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-8 sm:mb-12">
        {steps.map((step, idx) => (
          <div key={idx} className="group space-y-3 sm:space-y-4 text-center p-4 sm:p-6 rounded-xl hover:bg-background hover:shadow-lg transition-all">
            <div className="mx-auto flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-purple-600 transition-all group-hover:scale-110 shadow-md">
              <step.icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center justify-center h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-muted text-xs sm:text-sm font-bold text-foreground mb-1 sm:mb-2">
                {idx + 1}
              </div>
              <h3 className="text-base sm:text-lg font-semibold">{step.title}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 px-4">
        Tudo isso em menos de 10 minutos. <span className="text-primary font-semibold">Todos os dias.</span>
      </p>

      <div className="text-center px-4">
        <Button
          size="lg"
          onClick={onCTA}
          className="h-12 sm:h-14 px-6 sm:px-10 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
        >
          Comece Agora de Graça
        </Button>
      </div>
    </section>
  );
}
