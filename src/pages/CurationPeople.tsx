import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { FloatingHeader } from "@/components/FloatingHeader";
import Footer from "@/components/Footer";
import { PeopleChips, PersonPick } from "@/components/PeopleChips";
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
            <PeopleChips
              people={allPeople}
              onSelect={handlePersonSelect}
              currentLanguage={i18n.language}
            />
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
