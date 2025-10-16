import { Check, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePricing } from "@/hooks/usePricing";

interface LandingPricingBProps {
  onCTA: () => void;
}

export default function LandingPricingB({ onCTA }: LandingPricingBProps) {
  const { free, premium } = usePricing();

  return (
    <section className="container mx-auto px-6 py-16 sm:px-12 sm:py-24 lg:px-24">
      <h2 className="mb-4 text-center text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
        Planos & Preços
      </h2>
      <p className="text-center text-xl text-muted-foreground mb-16">
        Escolha o plano ideal para você
      </p>

      <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
        {/* Free Plan */}
        <div className="rounded-2xl border-2 border-border p-8 bg-background hover:shadow-lg transition-shadow">
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2">🔓 Gratuito</h3>
            <div className="text-4xl font-black mb-4">
              {free}
              <span className="text-lg font-normal text-muted-foreground">/mês</span>
            </div>
          </div>

          <ul className="space-y-3 mb-8">
            {[
              "10 livros/mês",
              "Geração de áudio",
              "PDF exportável",
            ].map((feature, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <Button
            size="lg"
            variant="outline"
            onClick={onCTA}
            className="w-full h-12 text-base font-medium"
          >
            Começar Grátis
          </Button>
        </div>

        {/* Premium Plan */}
        <div className="rounded-2xl border-2 border-primary p-8 bg-gradient-to-b from-primary/5 to-background relative hover:shadow-2xl transition-shadow">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
            <Crown className="h-4 w-4" />
            Mais Popular
          </div>

          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2">🌟 Premium</h3>
            <div className="text-4xl font-black mb-4">
              {premium}
              <span className="text-lg font-normal text-muted-foreground">/mês</span>
            </div>
          </div>

          <ul className="space-y-3 mb-8">
            {[
              "Livros ilimitados",
              "Flashcards interativos",
              "Exemplos aplicáveis",
              "Histórico salvo",
              "Suporte prioritário",
            ].map((feature, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <span className="font-medium">{feature}</span>
              </li>
            ))}
          </ul>

          <Button
            size="lg"
            onClick={onCTA}
            className="w-full h-12 text-base font-medium shadow-lg hover:shadow-xl"
          >
            Assinar Agora – 7 Dias Grátis
          </Button>
        </div>
      </div>
    </section>
  );
}
