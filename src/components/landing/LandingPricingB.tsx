import { Check, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePricing } from "@/hooks/usePricing";

interface LandingPricingBProps {
  onCTA: () => void;
}

export default function LandingPricingB({ onCTA }: LandingPricingBProps) {
  const { free, premium } = usePricing();

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-24 py-12 sm:py-16 lg:py-24">
      <h2 className="mb-3 sm:mb-4 text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
        Planos & Preços
      </h2>
      <p className="text-center text-base sm:text-lg lg:text-xl text-muted-foreground mb-8 sm:mb-12 lg:mb-16 px-4">
        Escolha o plano ideal para você
      </p>

      <div className="grid gap-6 sm:gap-8 md:grid-cols-2 max-w-4xl mx-auto">
        {/* Free Plan */}
        <div className="rounded-xl sm:rounded-2xl border-2 border-border p-6 sm:p-8 bg-background hover:shadow-lg transition-shadow">
          <div className="mb-4 sm:mb-6">
            <h3 className="text-xl sm:text-2xl font-bold mb-2">🔓 Gratuito</h3>
            <div className="text-3xl sm:text-4xl font-black mb-3 sm:mb-4">
              {free}
              <span className="text-base sm:text-lg font-normal text-muted-foreground">/mês</span>
            </div>
          </div>

          <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
            {[
              "10 livros/mês",
              "Geração de áudio",
              "PDF exportável",
            ].map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2 sm:gap-3">
                <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base">{feature}</span>
              </li>
            ))}
          </ul>

          <Button
            size="lg"
            variant="outline"
            onClick={onCTA}
            className="w-full h-11 sm:h-12 text-sm sm:text-base font-medium"
          >
            Começar Grátis
          </Button>
        </div>

        {/* Premium Plan */}
        <div className="rounded-xl sm:rounded-2xl border-2 border-primary p-6 sm:p-8 bg-gradient-to-b from-primary/5 to-background relative hover:shadow-2xl transition-shadow">
          <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1">
            <Crown className="h-3 w-3 sm:h-4 sm:w-4" />
            Mais Popular
          </div>

          <div className="mb-4 sm:mb-6">
            <h3 className="text-xl sm:text-2xl font-bold mb-2">🌟 Premium</h3>
            <div className="text-3xl sm:text-4xl font-black mb-3 sm:mb-4">
              {premium}
              <span className="text-base sm:text-lg font-normal text-muted-foreground">/mês</span>
            </div>
          </div>

          <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
            {[
              "Livros ilimitados",
              "Flashcards interativos",
              "Exemplos aplicáveis",
              "Histórico salvo",
              "Suporte prioritário",
            ].map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2 sm:gap-3">
                <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base font-medium">{feature}</span>
              </li>
            ))}
          </ul>

          <Button
            size="lg"
            onClick={onCTA}
            className="w-full h-11 sm:h-12 text-sm sm:text-base font-medium shadow-lg hover:shadow-xl"
          >
            Assinar Agora – 7 Dias Grátis
          </Button>
        </div>
      </div>
    </section>
  );
}
