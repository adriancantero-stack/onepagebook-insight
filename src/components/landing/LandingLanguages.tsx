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

        {/* Stylized world map with continents */}
        <div className="relative mx-auto max-w-4xl pt-8 pb-4">
          <svg viewBox="0 0 1000 500" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
            {/* North America */}
            <path d="M 100 120 Q 120 100 150 110 L 180 100 L 200 120 L 220 130 L 230 150 L 240 180 L 230 200 L 200 220 L 170 230 L 140 240 L 120 230 L 100 210 L 90 180 L 85 150 Z" 
                  fill="currentColor" className="text-primary/30" />
            
            {/* South America */}
            <path d="M 200 250 L 220 240 L 240 260 L 250 290 L 255 330 L 250 360 L 240 380 L 220 390 L 200 385 L 185 360 L 180 320 L 185 280 Z" 
                  fill="currentColor" className="text-primary/30" />
            
            {/* Europe */}
            <path d="M 450 110 L 480 100 L 510 105 L 530 120 L 540 140 L 535 160 L 520 175 L 495 180 L 470 175 L 450 160 L 445 135 Z" 
                  fill="currentColor" className="text-primary/30" />
            
            {/* Africa */}
            <path d="M 480 190 L 510 185 L 540 195 L 560 210 L 575 240 L 580 280 L 575 320 L 560 350 L 540 370 L 515 375 L 490 365 L 475 340 L 470 300 L 465 260 L 470 220 Z" 
                  fill="currentColor" className="text-primary/30" />
            
            {/* Asia */}
            <path d="M 550 80 Q 600 70 650 85 L 700 90 L 750 105 L 800 120 L 830 145 L 850 175 L 845 210 L 820 240 L 780 260 L 740 265 L 700 260 L 660 245 L 630 220 L 610 190 L 595 160 L 580 130 L 570 105 Z" 
                  fill="currentColor" className="text-primary/30" />
            
            {/* Australia */}
            <path d="M 750 310 Q 780 305 810 315 L 840 330 L 855 355 L 850 380 L 830 395 L 800 400 L 770 395 L 750 380 L 740 355 L 745 330 Z" 
                  fill="currentColor" className="text-primary/30" />

            {/* Animated location dots */}
            {[
              { cx: 150, cy: 180, delay: '0s' },    // North America
              { cx: 220, cy: 320, delay: '0.3s' },  // South America
              { cx: 500, cy: 140, delay: '0.6s' },  // Europe
              { cx: 530, cy: 280, delay: '0.9s' },  // Africa
              { cx: 700, cy: 160, delay: '1.2s' },  // Asia
              { cx: 800, cy: 220, delay: '1.5s' },  // East Asia
              { cx: 800, cy: 360, delay: '1.8s' },  // Australia
              { cx: 180, cy: 140, delay: '2.1s' },  // North America 2
            ].map((dot, i) => (
              <g key={i}>
                <circle 
                  cx={dot.cx} 
                  cy={dot.cy} 
                  r="5" 
                  fill="currentColor" 
                  className="text-primary animate-pulse"
                  style={{ animationDelay: dot.delay }}
                />
                <circle 
                  cx={dot.cx} 
                  cy={dot.cy} 
                  r="10" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  className="text-primary/40 animate-ping"
                  style={{ animationDelay: dot.delay }}
                />
              </g>
            ))}
          </svg>
        </div>
      </div>
    </section>
  );
};
