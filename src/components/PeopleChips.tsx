import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export interface PersonPick {
  id: string;
  person_id: string;
  display_name: string;
  display_name_pt?: string;
  display_name_en?: string;
  display_name_es?: string;
  role?: string;
  role_pt?: string;
  role_en?: string;
  role_es?: string;
  avatar_url?: string;
  is_featured: boolean;
  sort_order: number;
}

interface PeopleChipsProps {
  people: PersonPick[];
  onSelect: (personId: string) => void;
  currentLanguage: string;
}

export function PeopleChips({ people, onSelect, currentLanguage }: PeopleChipsProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Limit display based on screen size
  const displayedPeople = people.slice(0, 4); // Max 4 for desktop
  const getDisplayName = (person: PersonPick) => {
    if (currentLanguage === 'pt' && person.display_name_pt) return person.display_name_pt;
    if (currentLanguage === 'en' && person.display_name_en) return person.display_name_en;
    if (currentLanguage === 'es' && person.display_name_es) return person.display_name_es;
    return person.display_name;
  };

  const getRole = (person: PersonPick) => {
    if (currentLanguage === 'pt' && person.role_pt) return person.role_pt;
    if (currentLanguage === 'en' && person.role_en) return person.role_en;
    if (currentLanguage === 'es' && person.role_es) return person.role_es;
    return person.role;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const handleClick = (person: PersonPick) => {
    onSelect(person.person_id);
    
    // Tracking
    if (window.gtag) {
      window.gtag('event', 'people_pick_open', {
        person_id: person.person_id,
        person_name: getDisplayName(person)
      });
    } else {
      console.debug('people_pick_open', {
        person_id: person.person_id,
        person_name: getDisplayName(person)
      });
    }
  };

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-2 sm:gap-3 pb-3 sm:pb-4">
        {displayedPeople.map((person, index) => {
          const displayName = getDisplayName(person);
          const role = getRole(person);
          
          // Hide based on screen size
          const isHidden = 
            (index >= 2 && "md:hidden") || // Hide 3rd+ on mobile (show only 2)
            (index >= 3 && "lg:hidden"); // Hide 4th on tablet (show only 3)
          
          return (
            <button
              key={person.person_id}
              onClick={() => handleClick(person)}
              aria-label={`Abrir livros citados por ${displayName}`}
              className={cn(
                "flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl border",
                "bg-background hover:bg-primary transition-all duration-300",
                "min-w-fit cursor-pointer group",
                index >= 2 && "hidden md:flex", // Show only on md+ (tablet+) for 3rd person
                index >= 3 && "hidden lg:flex"  // Show only on lg+ (desktop) for 4th person
              )}
            >
              <Avatar className="h-8 w-8 sm:h-10 sm:w-10 shrink-0">
                {person.avatar_url && (
                  <AvatarImage 
                    src={person.avatar_url} 
                    alt={displayName}
                    className="object-cover"
                  />
                )}
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getInitials(displayName)}
                </AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="font-medium text-xs sm:text-sm group-hover:text-white transition-colors">
                  {displayName}
                </p>
                {role && (
                  <p className="text-[10px] sm:text-[11px] text-muted-foreground opacity-60 group-hover:text-white/80 transition-colors">
                    {role}
                  </p>
                )}
              </div>
            </button>
          );
        })}
        
        {/* Ver Todos Button */}
        <Button
          onClick={() => navigate('/curation/people')}
          variant="default"
          className={cn(
            "flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl",
            "bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90",
            "text-primary-foreground font-semibold shadow-lg hover:shadow-xl",
            "transition-all duration-300 hover:scale-105",
            "min-w-fit whitespace-nowrap group"
          )}
        >
          <span className="text-xs sm:text-sm group-hover:text-white transition-colors">
            {t('people.see_all')}
          </span>
          <ArrowRight className="h-4 w-4 group-hover:text-white transition-colors" />
        </Button>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
