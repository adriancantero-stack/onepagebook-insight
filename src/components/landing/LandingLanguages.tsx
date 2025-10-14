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
              // USA - mais pontos
              { left: '13%', top: '28%', delay: '0s' },     // West Coast
              { left: '15%', top: '30%', delay: '0.1s' },   // California
              { left: '18%', top: '32%', delay: '0.2s' },   // Central USA
              { left: '20%', top: '34%', delay: '0.3s' },   // Texas
              { left: '22%', top: '30%', delay: '0.4s' },   // East Coast
              { left: '21%', top: '28%', delay: '0.5s' },   // New York
              { left: '17%', top: '22%', delay: '0.6s' },   // Canada
              
              // México e América Central
              { left: '24%', top: '50%', delay: '0.8s' },   // Mexico
              { left: '27%', top: '62%', delay: '1s' },     // Colombia
              
              // Brasil - mais pontos
              { left: '28%', top: '68%', delay: '1.2s' },   // Brasil Norte
              { left: '29%', top: '70%', delay: '1.3s' },   // Brasil Nordeste
              { left: '30%', top: '72%', delay: '1.4s' },   // Brasil Centro
              { left: '31%', top: '74%', delay: '1.5s' },   // Brasil Sul
              { left: '30%', top: '76%', delay: '1.6s' },   // São Paulo
              { left: '29%', top: '78%', delay: '1.7s' },   // Rio
              
              // Argentina
              { left: '29%', top: '80%', delay: '1.8s' },
              
              // Reino Unido - mais pontos
              { left: '45%', top: '25%', delay: '1.9s' },   // Londres
              { left: '45%', top: '23%', delay: '2s' },     // Escócia
              { left: '46%', top: '26%', delay: '2.1s' },   // Manchester
              
              // Espanha - mais pontos
              { left: '47%', top: '33%', delay: '2.2s' },   // Madrid
              { left: '47%', top: '35%', delay: '2.3s' },   // Barcelona
              { left: '46%', top: '34%', delay: '2.4s' },   // Sevilha
              
              // França
              { left: '48%', top: '28%', delay: '2.5s' },
              
              // Alemanha
              { left: '51%', top: '26%', delay: '2.6s' },
              
              // Polônia
              { left: '54%', top: '32%', delay: '2.7s' },
              
              // Itália
              { left: '51%', top: '38%', delay: '2.8s' },
              
              // North Africa
              { left: '49%', top: '48%', delay: '2.9s' },
              
              // Angola - mais pontos
              { left: '51%', top: '60%', delay: '3s' },     // Angola Norte
              { left: '52%', top: '62%', delay: '3.1s' },   // Luanda
              { left: '53%', top: '64%', delay: '3.2s' },   // Angola Sul
              
              // Moçambique - mais pontos
              { left: '56%', top: '62%', delay: '3.3s' },   // Moçambique Norte
              { left: '57%', top: '64%', delay: '3.4s' },   // Maputo
              { left: '56%', top: '66%', delay: '3.5s' },   // Moçambique Central
              
              // South Africa
              { left: '54%', top: '68%', delay: '3.6s' },
              
              // Middle East
              { left: '57%', top: '36%', delay: '3.7s' },
              
              // Russia
              { left: '64%', top: '30%', delay: '3.8s' },
              
              // India
              { left: '68%', top: '40%', delay: '3.9s' },
              
              // Thailand
              { left: '74%', top: '42%', delay: '4s' },
              
              // China
              { left: '78%', top: '34%', delay: '4.1s' },
              
              // Japan
              { left: '84%', top: '30%', delay: '4.2s' },
              
              // Australia
              { left: '86%', top: '72%', delay: '4.3s' },
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
