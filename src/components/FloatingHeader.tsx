import { BookOpen } from "lucide-react";
import { LanguageSelector } from "@/components/LanguageSelector";
import { NavigationMenu } from "@/components/NavigationMenu";

interface FloatingHeaderProps {
  onLogout?: () => void;
}

export const FloatingHeader = ({ onLogout }: FloatingHeaderProps) => {
  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-4xl">
      <div className="bg-background px-6 py-3 flex items-center justify-between">
        <div className="flex-1"></div>
        <div className="flex items-center gap-2 justify-center">
          <BookOpen className="w-5 h-5 text-primary" />
          <span className="font-semibold text-sm">OnePageBook</span>
        </div>
        <div className="flex-1 flex items-center gap-2 justify-end">
          <LanguageSelector />
          <NavigationMenu onLogout={onLogout} />
        </div>
      </div>
    </header>
  );
};
