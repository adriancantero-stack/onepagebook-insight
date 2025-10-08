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
          className="hover:bg-transparent group"
        >
          {/* Mobile: 3 dots */}
          <MoreVertical className="h-5 w-5 md:hidden group-hover:text-primary" />
          {/* Desktop: 3 lines */}
          <Menu className="h-5 w-5 hidden md:block group-hover:text-primary" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-56"
      >
        {menuItems.map((item, index) => (
          <DropdownMenuItem
            key={index}
            onClick={item.onClick}
            className="gap-3 cursor-pointer py-3 group hover:text-white"
          >
            <item.icon className="h-4 w-4 text-muted-foreground group-hover:text-white" />
            <span>{item.label}</span>
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        
        {secondaryItems.map((item, index) => (
          <DropdownMenuItem
            key={index}
            onClick={item.onClick}
            className="gap-3 cursor-pointer py-3 group hover:text-white"
          >
            <item.icon className="h-4 w-4 text-muted-foreground group-hover:text-white" />
            <span>{item.label}</span>
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem
          onClick={handleLogout}
          className="gap-3 cursor-pointer py-3 text-destructive group"
        >
          <LogOut className="h-4 w-4 group-hover:text-destructive" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
