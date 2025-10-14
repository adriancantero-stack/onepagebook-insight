import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { FloatingHeader } from "@/components/FloatingHeader";
import Footer from "@/components/Footer";
import { PersonPick } from "@/components/PeopleChips";
import { PeopleShelf, BookPick } from "@/components/PeopleShelf";

export default function CurationPeople() {
  const { t, i18n } = useTranslation();
  const [allPeople, setAllPeople] = useState<PersonPick[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<PersonPick | null>(null);
  const [personBooks, setPersonBooks] = useState<BookPick[]>([]);
  const [isShelfOpen, setIsShelfOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllPeople();
  }, []);

  const fetchAllPeople = async () => {
    try {
      const { data, error } = await supabase
        .from('people_picks')
        .select('*')
        .order('display_name', { ascending: true });

      if (error) throw error;
      setAllPeople(data || []);
    } catch (error) {
      console.error('Error fetching people:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePersonSelect = async (personId: string) => {
    const person = allPeople.find(p => p.person_id === personId);
    if (!person) return;

    setSelectedPerson(person);

    try {
      const { data, error } = await supabase
        .from('people_book_picks')
        .select(`
          id,
          book_id,
          source_url,
          reason_pt,
          reason_en,
          reason_es,
          confidence,
          books (
            id,
            title,
            author,
            cover_url
          )
        `)
        .eq('person_id', personId)
        .neq('confidence', 'low');

      if (error) throw error;

      const books: BookPick[] = (data || []).map((pick: any) => ({
        id: pick.id,
        book_id: pick.book_id,
        title: pick.books?.title || '',
        author: pick.books?.author || '',
        cover_url: pick.books?.cover_url,
        source_url: pick.source_url,
        reason: i18n.language === 'pt' ? pick.reason_pt : 
                i18n.language === 'en' ? pick.reason_en : 
                pick.reason_es,
        confidence: pick.confidence
      }));

      setPersonBooks(books);
      setIsShelfOpen(true);
    } catch (error) {
      console.error('Error fetching person books:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <FloatingHeader />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {t('people.all_people_title', 'Todas as Pessoas')}
            </h1>
            <p className="text-muted-foreground">
              {t('people.all_people_subtitle', 'Explore recomendações de líderes e pensadores influentes')}
            </p>
          </header>

          {loading ? (
            <div className="text-center py-12 text-muted-foreground">
              Carregando...
            </div>
          ) : allPeople.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {t('people.no_people', 'Nenhuma pessoa encontrada')}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {allPeople.map((person) => {
                const displayName = person.display_name_pt || person.display_name_en || person.display_name_es || person.display_name;
                const role = person.role_pt || person.role_en || person.role_es || person.role;
                const initials = displayName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
                
                return (
                  <button
                    key={person.person_id}
                    onClick={() => handlePersonSelect(person.person_id)}
                    className="group relative flex flex-col items-center gap-3 p-6 rounded-2xl border bg-card hover:shadow-lg hover:border-primary/50 transition-all duration-200"
                  >
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold group-hover:scale-110 transition-transform overflow-hidden">
                        {person.avatar_url ? (
                          <img 
                            src={person.avatar_url} 
                            alt={displayName} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback para iniciais se a imagem falhar
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : null}
                        <span className={person.avatar_url ? "absolute inset-0 flex items-center justify-center" : ""} style={person.avatar_url ? {display: 'none'} : {}}>
                          {initials}
                        </span>
                      </div>
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold text-sm">{displayName}</h3>
                      {role && (
                        <p className="text-xs text-muted-foreground mt-1">{role}</p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {selectedPerson && (
        <PeopleShelf
          person={selectedPerson}
          books={personBooks}
          open={isShelfOpen}
          onClose={() => setIsShelfOpen(false)}
          currentLanguage={i18n.language}
          translations={{
            shelf_title: t('people.shelf_title', 'Livros frequentemente citados por {{name}}'),
            source: t('people.source', 'Fonte'),
            close: t('people.close', 'Fechar'),
            empty_person: t('people.empty_person', 'Em breve mais livros desta pessoa'),
            save: t('people.save', 'Salvar'),
            read_summary: t('people.read_summary', 'Ler resumo')
          }}
        />
      )}

      <Footer />
    </div>
  );
}
