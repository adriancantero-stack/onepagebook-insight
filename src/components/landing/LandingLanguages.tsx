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
              { left: '12%', top: '25%', delay: '0s' },     // West Coast USA
              { left: '18%', top: '30%', delay: '0.2s' },   // Central USA
              { left: '22%', top: '28%', delay: '0.4s' },   // East Coast USA
              { left: '20%', top: '22%', delay: '0.6s' },   // Canada
              { left: '25%', top: '48%', delay: '0.8s' },   // Mexico
              { left: '27%', top: '58%', delay: '1s' },     // Central America
              { left: '28%', top: '70%', delay: '1.2s' },   // Brazil
              { left: '32%', top: '75%', delay: '1.4s' },   // South America
              { left: '45%', top: '22%', delay: '1.6s' },   // UK
              { left: '48%', top: '28%', delay: '1.8s' },   // Western Europe
              { left: '52%', top: '25%', delay: '2s' },     // Central Europe
              { left: '56%', top: '30%', delay: '2.2s' },   // Eastern Europe
              { left: '50%', top: '38%', delay: '2.4s' },   // Mediterranean
              { left: '48%', top: '50%', delay: '2.6s' },   // North Africa
              { left: '52%', top: '58%', delay: '2.8s' },   // Central Africa
              { left: '55%', top: '65%', delay: '3s' },     // South Africa
              { left: '58%', top: '35%', delay: '3.2s' },   // Middle East
              { left: '64%', top: '28%', delay: '3.4s' },   // Central Asia
              { left: '68%', top: '38%', delay: '3.6s' },   // India
              { left: '72%', top: '32%', delay: '3.8s' },   // Southeast Asia
              { left: '78%', top: '28%', delay: '4s' },     // China
              { left: '82%', top: '25%', delay: '4.2s' },   // Japan
              { left: '85%', top: '32%', delay: '4.4s' },   // South Korea
              { left: '76%', top: '52%', delay: '4.6s' },   // Indonesia
              { left: '88%', top: '72%', delay: '4.8s' },   // Australia East
              { left: '83%', top: '75%', delay: '5s' },     // Australia West
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
