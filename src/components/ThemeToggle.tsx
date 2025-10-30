import { Moon, Sun, Clock } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  // Auto theme logic based on time of day
  useEffect(() => {
    if (theme === "auto") {
      const updateThemeByTime = () => {
        const hour = new Date().getHours();
        // Between 6 AM and 6 PM = light mode
        // Between 6 PM and 6 AM = dark mode
        const shouldBeDark = hour >= 18 || hour < 6;
        document.documentElement.classList.toggle("dark", shouldBeDark);
      };

      updateThemeByTime();
      // Check every minute if time-based theme should change
      const interval = setInterval(updateThemeByTime, 60000);
      return () => clearInterval(interval);
    }
  }, [theme]);

  const themes = [
    { value: "light", icon: Sun, label: "Claro" },
    { value: "dark", icon: Moon, label: "Escuro" },
    { value: "auto", icon: Clock, label: "Automático" },
  ];

  return (
    <div className="flex gap-1.5 sm:gap-2">
      {themes.map(({ value, icon: Icon, label }) => (
        <Button
          key={value}
          variant="outline"
          size="default"
          onClick={() => setTheme(value)}
          className={cn(
            "flex-1 gap-1.5 sm:gap-2 transition-all px-2 sm:px-4",
            theme === value
              ? "bg-primary text-primary-foreground border-primary"
              : "hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <Icon className="h-4 w-4 flex-shrink-0" />
          <span className="text-xs sm:text-sm truncate">{label}</span>
        </Button>
      ))}
    </div>
  );
}
