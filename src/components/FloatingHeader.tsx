import { BookOpen } from "lucide-react";
import { LanguageSelector } from "@/components/LanguageSelector";
import { NavigationMenu } from "@/components/NavigationMenu";

interface FloatingHeaderProps {
  onLogout?: () => void;
}

export const FloatingHeader = ({ onLogout }: FloatingHeaderProps) => {
  return (
    <header className="w-full max-w-4xl mx-auto pt-4 px-4">
      <div className="px-6 py-3 flex items-center justify-between">
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
