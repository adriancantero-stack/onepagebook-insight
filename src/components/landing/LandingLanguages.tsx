import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import { OptimizedImage } from "@/components/OptimizedImage";
import worldMap from "@/assets/world-map-dotted.png";

export const LandingLanguages = () => {
  const { t } = useTranslation();

  return (
    <section className="container mx-auto px-6 py-12 sm:px-12 sm:py-16 lg:px-24 bg-gradient-to-br from-lilac-50 via-purple-50/30 to-lilac-50">
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
        <div className="relative mx-auto max-w-3xl pt-8 pb-4">
          <OptimizedImage 
            src={worldMap} 
            alt="World Map" 
            className="w-full h-auto opacity-40"
          />
          
          {/* Animated location dots on top of map */}
          <div className="absolute inset-0">
            {[
              // USA - mais pontos (costa oeste a leste)
              { left: '12%', top: '29%', delay: '0s' },     // Seattle
              { left: '11.5%', top: '32%', delay: '0.1s' }, // Califórnia
              { left: '16%', top: '36%', delay: '0.2s' },   // Texas
              { left: '19%', top: '30%', delay: '0.3s' },   // Chicago
              { left: '21%', top: '29%', delay: '0.4s' },   // Nova York
              { left: '20%', top: '35%', delay: '0.5s' },   // Flórida

              // Canadá
              { left: '17%', top: '24%', delay: '0.6s' },

              // México e América Central
              { left: '23%', top: '44%', delay: '0.7s' },   // México
              { left: '24.5%', top: '50%', delay: '0.8s' }, // América Central

              // Brasil - mais pontos (norte a sul)
              { left: '31%', top: '62%', delay: '0.9s' },   // Manaus
              { left: '33%', top: '64%', delay: '1s' },     // Nordeste
              { left: '34%', top: '66%', delay: '1.1s' },   // Recife
              { left: '33%', top: '68%', delay: '1.2s' },   // Salvador
              { left: '32%', top: '70%', delay: '1.3s' },   // Brasília
              { left: '33%', top: '73%', delay: '1.4s' },   // SP / Rio

              // Argentina
              { left: '32%', top: '82%', delay: '1.5s' },

              // Reino Unido - mais pontos
              { left: '46%', top: '24%', delay: '1.6s' },   // Escócia
              { left: '46.5%', top: '26%', delay: '1.7s' }, // Inglaterra Norte
              { left: '46.5%', top: '28%', delay: '1.8s' }, // Londres

              // Irlanda
              { left: '44.5%', top: '27%', delay: '1.9s' },

              // Espanha - mais pontos (inclui Portugal)
              { left: '45%', top: '33%', delay: '2s' },     // Lisboa/Porto
              { left: '47%', top: '33%', delay: '2.1s' },   // Madrid
              { left: '48%', top: '34%', delay: '2.2s' },   // Barcelona

              // França / Alemanha / Itália / Leste
              { left: '48%', top: '29%', delay: '2.3s' },   // Paris
              { left: '50.5%', top: '28%', delay: '2.4s' }, // Alemanha
              { left: '50%', top: '35%', delay: '2.5s' },   // Itália
              { left: '53%', top: '30%', delay: '2.6s' },   // Leste Europeu

              // África
              { left: '49%', top: '42%', delay: '2.7s' },   // Norte da África
              { left: '51%', top: '57%', delay: '2.8s' },   // África Central

              // Angola - mais pontos
              { left: '50.5%', top: '62%', delay: '2.9s' }, // Norte de Angola
              { left: '51.5%', top: '63%', delay: '3s' },   // Luanda
              { left: '52%', top: '65%', delay: '3.1s' },   // Sul de Angola

              // Moçambique - mais pontos
              { left: '55.5%', top: '63%', delay: '3.2s' }, // Norte de Moçambique
              { left: '56.5%', top: '66%', delay: '3.3s' }, // Centro
              { left: '56%', top: '68%', delay: '3.4s' },   // Maputo

              // África do Sul
              { left: '53%', top: '72%', delay: '3.5s' },

              // Oriente Médio / Ásia
              { left: '56%', top: '38%', delay: '3.6s' },   // Oriente Médio
              { left: '62%', top: '27%', delay: '3.7s' },   // Rússia
              { left: '67%', top: '44%', delay: '3.8s' },   // Índia
              { left: '72%', top: '46%', delay: '3.9s' },   // Sudeste Asiático
              { left: '76%', top: '36%', delay: '4s' },     // China
              { left: '82%', top: '32%', delay: '4.1s' },   // Japão

              // Oceania
              { left: '85%', top: '74%', delay: '4.2s' },   // Austrália
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
