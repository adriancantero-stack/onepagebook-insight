import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import worldMap from "@/assets/world-map.png";

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
            className="w-full h-auto opacity-30"
          />
          
          {/* Animated location dots on top of map */}
          <div className="absolute inset-0">
            {[
              { left: '15%', top: '30%', delay: '0s' },    // North America
              { left: '23%', top: '65%', delay: '0.3s' },  // South America
              { left: '48%', top: '28%', delay: '0.6s' },  // Europe
              { left: '52%', top: '55%', delay: '0.9s' },  // Africa
              { left: '70%', top: '35%', delay: '1.2s' },  // Asia
              { left: '82%', top: '32%', delay: '1.5s' },  // East Asia
              { left: '88%', top: '70%', delay: '1.8s' },  // Australia
              { left: '18%', top: '25%', delay: '2.1s' },  // Canada
            ].map((dot, i) => (
              <div
                key={i}
                className="absolute"
                style={{ left: dot.left, top: dot.top }}
              >
                <div 
                  className="h-3 w-3 rounded-full bg-primary animate-pulse"
                  style={{ 
                    animationDelay: dot.delay,
                    boxShadow: '0 0 12px rgba(139, 92, 246, 0.8)'
                  }}
                />
                <div 
                  className="absolute top-0 left-0 h-3 w-3 rounded-full bg-primary/40 animate-ping"
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
