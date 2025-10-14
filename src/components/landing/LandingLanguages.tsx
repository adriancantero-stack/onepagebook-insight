import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

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

        {/* Decorative global presence visual - Stylized world map */}
        <div className="relative mx-auto max-w-3xl pt-8">
          <svg viewBox="0 0 800 400" className="w-full h-auto opacity-20" xmlns="http://www.w3.org/2000/svg">
            {/* Simplified world map continents */}
            <path d="M150,100 Q200,80 250,100 L280,120 L260,180 L200,190 L150,160 Z" fill="currentColor" className="text-primary" />
            <path d="M300,120 L380,110 L420,140 L400,200 L320,210 L300,170 Z" fill="currentColor" className="text-primary" />
            <path d="M450,130 Q520,120 580,140 L600,180 L550,220 L480,210 L450,170 Z" fill="currentColor" className="text-primary" />
            <path d="M180,220 L240,210 L280,240 L260,300 L200,310 L170,270 Z" fill="currentColor" className="text-primary" />
            <path d="M500,230 L580,220 L620,260 L600,320 L530,330 L500,280 Z" fill="currentColor" className="text-primary" />
          </svg>
          
          {/* Animated dots on map */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full max-w-3xl">
              {[
                { left: '20%', top: '30%' },
                { left: '35%', top: '35%' },
                { left: '50%', top: '25%' },
                { left: '65%', top: '40%' },
                { left: '75%', top: '30%' },
                { left: '25%', top: '60%' },
                { left: '70%', top: '65%' },
                { left: '45%', top: '55%' },
              ].map((pos, i) => (
                <div
                  key={i}
                  className="absolute h-3 w-3 rounded-full bg-primary animate-pulse"
                  style={{ 
                    left: pos.left, 
                    top: pos.top,
                    animationDelay: `${i * 0.3}s`,
                    boxShadow: '0 0 10px rgba(139, 92, 246, 0.5)'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
