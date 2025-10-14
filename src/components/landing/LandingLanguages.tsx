import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import worldMap from "@/assets/world-map-dotted.png";

export const LandingLanguages = () => {
  const { t } = useTranslation();

  return (
    <section className="container mx-auto px-6 py-16 sm:px-12 sm:py-20 lg:px-24 bg-gradient-to-br from-lilac-50 via-purple-50/30 to-lilac-50">
      <div className="mx-auto max-w-4xl text-center space-y-8">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-4">
          <Globe className="h-10 w-10 text-primary" />
        </div>
        
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
          {t("landing.languages.title")}
        </h2>

        <div className="flex items-center justify-center gap-8 sm:gap-12 py-6">
          <div className="flex flex-col items-center gap-3 group cursor-default">
            <div className="text-5xl sm:text-6xl transition-transform group-hover:scale-110">🇧🇷</div>
            <p className="text-sm sm:text-base font-medium text-muted-foreground">Português</p>
          </div>
          
          <div className="flex flex-col items-center gap-3 group cursor-default">
            <div className="text-5xl sm:text-6xl transition-transform group-hover:scale-110">🇺🇸</div>
            <p className="text-sm sm:text-base font-medium text-muted-foreground">English</p>
          </div>
          
          <div className="flex flex-col items-center gap-3 group cursor-default">
            <div className="text-5xl sm:text-6xl transition-transform group-hover:scale-110">🇪🇸</div>
            <p className="text-sm sm:text-base font-medium text-muted-foreground">Español</p>
          </div>
        </div>

        <p className="text-lg sm:text-xl text-muted-foreground font-medium">
          {t("landing.languages.global")}
        </p>

        {/* World map with animated location dots */}
        <div className="relative mx-auto max-w-4xl pt-8 pb-4">
          <img 
            src={worldMap} 
            alt="World Map" 
            className="w-full h-auto opacity-40"
          />
          
          {/* Animated location dots on top of map */}
          <div className="absolute inset-0">
            {[
              // USA - mais pontos (costa oeste a leste)
              { left: '11%', top: '32%', delay: '0s' },     // Califórnia
              { left: '13%', top: '30%', delay: '0.1s' },   // Seattle
              { left: '16%', top: '35%', delay: '0.2s' },   // Texas
              { left: '18%', top: '32%', delay: '0.3s' },   // Chicago
              { left: '20%', top: '30%', delay: '0.4s' },   // Nova York
              { left: '19%', top: '34%', delay: '0.5s' },   // Florida
              
              // Canadá
              { left: '15%', top: '24%', delay: '0.6s' },
              
              // México
              { left: '14%', top: '42%', delay: '0.7s' },
              
              // América Central
              { left: '17%', top: '50%', delay: '0.8s' },
              
              // Brasil - mais pontos (norte a sul)
              { left: '24%', top: '62%', delay: '0.9s' },   // Manaus (Norte)
              { left: '26%', top: '64%', delay: '1s' },     // Fortaleza (Nordeste)
              { left: '27%', top: '66%', delay: '1.1s' },   // Recife
              { left: '28%', top: '68%', delay: '1.2s' },   // Salvador
              { left: '27%', top: '72%', delay: '1.3s' },   // Brasília
              { left: '28%', top: '74%', delay: '1.4s' },   // São Paulo/Rio
              
              // Argentina
              { left: '26%', top: '80%', delay: '1.5s' },
              
              // Reino Unido - mais pontos
              { left: '45%', top: '23%', delay: '1.6s' },   // Escócia
              { left: '45.5%', top: '25%', delay: '1.7s' }, // Inglaterra Norte
              { left: '45%', top: '27%', delay: '1.8s' },   // Londres
              
              // Irlanda
              { left: '43%', top: '26%', delay: '1.9s' },
              
              // Espanha - mais pontos
              { left: '44%', top: '33%', delay: '2s' },     // Lisboa/Porto
              { left: '46%', top: '33%', delay: '2.1s' },   // Madrid
              { left: '47%', top: '34%', delay: '2.2s' },   // Barcelona
              
              // França
              { left: '47%', top: '28%', delay: '2.3s' },
              
              // Alemanha
              { left: '50%', top: '27%', delay: '2.4s' },
              
              // Itália
              { left: '50%', top: '33%', delay: '2.5s' },
              
              // Europa Oriental
              { left: '53%', top: '30%', delay: '2.6s' },
              
              // Norte da África
              { left: '48%', top: '42%', delay: '2.7s' },
              
              // África Central
              { left: '50%', top: '56%', delay: '2.8s' },
              
              // Angola - mais pontos
              { left: '50%', top: '62%', delay: '2.9s' },   // Norte de Angola
              { left: '51%', top: '64%', delay: '3s' },     // Luanda
              { left: '52%', top: '66%', delay: '3.1s' },   // Sul de Angola
              
              // Moçambique - mais pontos
              { left: '56%', top: '63%', delay: '3.2s' },   // Norte de Moçambique
              { left: '56%', top: '66%', delay: '3.3s' },   // Centro
              { left: '55%', top: '68%', delay: '3.4s' },   // Maputo
              
              // África do Sul
              { left: '53%', top: '72%', delay: '3.5s' },
              
              // Oriente Médio
              { left: '55%', top: '38%', delay: '3.6s' },
              
              // Rússia
              { left: '63%', top: '28%', delay: '3.7s' },
              
              // Índia
              { left: '67%', top: '42%', delay: '3.8s' },
              
              // Sudeste Asiático
              { left: '73%', top: '46%', delay: '3.9s' },
              
              // China
              { left: '76%', top: '36%', delay: '4s' },
              
              // Japão
              { left: '82%', top: '34%', delay: '4.1s' },
              
              // Austrália
              { left: '84%', top: '72%', delay: '4.2s' },
            ].map((dot, i) => (
              <div
                key={i}
                className="absolute"
                style={{ left: dot.left, top: dot.top }}
              >
                <div 
                  className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse"
                  style={{ 
                    animationDelay: dot.delay,
                    boxShadow: '0 0 12px hsl(var(--primary) / 0.8)'
                  }}
                />
                <div 
                  className="absolute top-0 left-0 h-2.5 w-2.5 rounded-full bg-primary/40 animate-ping"
                  style={{ animationDelay: dot.delay }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
