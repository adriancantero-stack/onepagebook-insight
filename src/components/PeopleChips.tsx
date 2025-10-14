import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

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
      <div className="flex gap-3 pb-4">
        {people.map((person) => {
          const displayName = getDisplayName(person);
          const role = getRole(person);
          
          return (
            <button
              key={person.person_id}
              onClick={() => handleClick(person)}
              aria-label={`Abrir livros citados por ${displayName}`}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl border",
                "bg-background hover:bg-accent transition-colors",
                "min-w-fit cursor-pointer"
              )}
            >
              <Avatar className="h-10 w-10">
                {person.avatar_url && <AvatarImage src={person.avatar_url} alt={displayName} />}
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getInitials(displayName)}
                </AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="font-medium text-sm">{displayName}</p>
                {role && (
                  <p className="text-[11px] text-muted-foreground opacity-60">{role}</p>
                )}
              </div>
            </button>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
