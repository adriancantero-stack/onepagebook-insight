import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  MoreVertical, 
  BookOpen, 
  History, 
  Compass,
  Crown,
  HelpCircle,
  LogOut
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface NavigationMenuProps {
  onLogout?: () => void;
}

export const NavigationMenu = ({ onLogout }: NavigationMenuProps) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: t("toast.logoutSuccess"),
    });
    if (onLogout) {
      onLogout();
    } else {
      navigate("/auth");
    }
  };

  const menuItems = [
    {
      icon: Compass,
      label: t("header.explore"),
      onClick: () => navigate("/explore"),
    },
    {
      icon: History,
      label: t("header.history"),
      onClick: () => navigate("/history"),
    },
    {
      icon: BookOpen,
      label: "Categorias",
      onClick: () => toast({ title: "Em breve" }),
    },
  ];

  const secondaryItems = [
    {
      icon: Crown,
      label: t("header.premium"),
      onClick: () => navigate("/plans"),
    },
    {
      icon: HelpCircle,
      label: t("nav.faq_short"),
      onClick: () => navigate("/faq"),
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="relative overflow-hidden backdrop-blur-xl bg-background/30 border border-white/10 hover:bg-background/40 hover:border-white/20 transition-all duration-300"
        >
          {/* Mobile: 3 dots */}
          <MoreVertical className="h-5 w-5 md:hidden" />
          {/* Desktop: 3 lines */}
          <Menu className="h-5 w-5 hidden md:block" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-56 backdrop-blur-2xl bg-background/80 border border-white/10 shadow-2xl shadow-primary/5"
      >
        {menuItems.map((item, index) => (
          <DropdownMenuItem
            key={index}
            onClick={item.onClick}
            className="gap-3 cursor-pointer py-3 transition-all duration-200 hover:bg-primary/10 hover:translate-x-1"
          >
            <item.icon className="h-4 w-4 text-muted-foreground" />
            <span>{item.label}</span>
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator className="bg-border/50" />
        
        {secondaryItems.map((item, index) => (
          <DropdownMenuItem
            key={index}
            onClick={item.onClick}
            className="gap-3 cursor-pointer py-3 transition-all duration-200 hover:bg-primary/10 hover:translate-x-1"
          >
            <item.icon className="h-4 w-4 text-muted-foreground" />
            <span>{item.label}</span>
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator className="bg-border/50" />
        
        <DropdownMenuItem
          onClick={handleLogout}
          className="gap-3 cursor-pointer py-3 text-destructive hover:bg-destructive/10 hover:translate-x-1 transition-all duration-200"
        >
          <LogOut className="h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
