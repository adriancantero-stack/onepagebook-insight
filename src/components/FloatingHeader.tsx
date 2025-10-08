import { BookOpen } from "lucide-react";
import { LanguageSelector } from "@/components/LanguageSelector";
import { NavigationMenu } from "@/components/NavigationMenu";

interface FloatingHeaderProps {
  onLogout?: () => void;
}

export const FloatingHeader = ({ onLogout }: FloatingHeaderProps) => {
  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-4xl">
      <div className="backdrop-blur-2xl bg-background/30 border border-white/10 rounded-full shadow-2xl shadow-primary/5 px-6 py-3 flex items-center justify-between transition-all duration-300 hover:bg-background/40 hover:border-white/20">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          <span className="font-semibold text-sm hidden sm:inline">OnePageBook</span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <NavigationMenu onLogout={onLogout} />
        </div>
      </div>
    </header>
  );
};
