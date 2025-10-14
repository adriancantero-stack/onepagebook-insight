import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PersonPick } from "./PeopleChips";

export interface BookPick {
  id: string;
  book_id: string;
  title: string;
  author: string;
  cover_url?: string;
  source_url: string;
  reason?: string;
  confidence: 'high' | 'medium' | 'low';
}

interface PeopleShelfProps {
  person: PersonPick;
  books: BookPick[];
  open: boolean;
  onClose: () => void;
  currentLanguage: string;
  translations: {
    shelf_title: string;
    source: string;
    close: string;
    empty_person: string;
    save: string;
    read_summary: string;
  };
}

export function PeopleShelf({ 
  person, 
  books, 
  open, 
  onClose, 
  currentLanguage,
  translations 
}: PeopleShelfProps) {
  const navigate = useNavigate();

  const getDisplayName = () => {
    if (currentLanguage === 'pt' && person.display_name_pt) return person.display_name_pt;
    if (currentLanguage === 'en' && person.display_name_en) return person.display_name_en;
    if (currentLanguage === 'es' && person.display_name_es) return person.display_name_es;
    return person.display_name;
  };

  useEffect(() => {
    if (open && person) {
      // Tracking shelf view
      if (window.gtag) {
        window.gtag('event', 'people_shelf_view', {
          person_id: person.person_id,
          person_name: getDisplayName(),
          picks_count: books.length
        });
      } else {
        console.debug('people_shelf_view', {
          person_id: person.person_id,
          person_name: getDisplayName(),
          picks_count: books.length
        });
      }
    }
  }, [open, person, books.length]);

  const handleBookClick = (book: BookPick) => {
    // Tracking
    if (window.gtag) {
      window.gtag('event', 'people_book_click', {
        person_id: person.person_id,
        book_id: book.book_id
      });
    } else {
      console.debug('people_book_click', {
        person_id: person.person_id,
        book_id: book.book_id
      });
    }

    // Navigate to summary generation
    navigate('/home', { 
      state: { 
        bookTitle: book.title,
        bookAuthor: book.author,
        bookCover: book.cover_url,
        bookId: book.book_id,
        source: `people_pick_${person.person_id}`
      } 
    });
    
    // Close the modal
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {translations.shelf_title.replace('{{name}}', getDisplayName())}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          {books.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {translations.empty_person}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {books
                .filter(book => book.title && book.author) // Filter out books with missing data
                .filter((book, index, self) => 
                  index === self.findIndex(b => b.book_id === book.book_id) // Remove duplicates by book_id
                )
                .map((book) => (
                <div
                  key={book.id}
                  className="group relative rounded-xl border bg-card overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Book Cover */}
                  <div className="aspect-[2/3] bg-gradient-to-br from-primary/20 to-secondary/20 relative">
                    {book.cover_url ? (
                      <img
                        src={book.cover_url}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full p-4">
                        <p className="text-center text-xs font-medium line-clamp-3">
                          {book.title}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Book Info */}
            <div className="p-3 space-y-2">
              <div>
                <h4 className="font-medium text-sm line-clamp-2">{book.title}</h4>
                <p className="text-xs text-muted-foreground line-clamp-1">{book.author}</p>
              </div>

              {/* Action Button */}
              <Button
                size="sm"
                className="w-full"
                onClick={() => handleBookClick(book)}
              >
                {translations.read_summary}
              </Button>
            </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Show message if no valid books after filtering */}
          {books.length > 0 && books.filter(b => b.title && b.author).length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              {translations.empty_person}
            </div>
          )}
        </ScrollArea>

        {/* Disclaimer */}
        <p className="text-[11px] text-muted-foreground opacity-60 text-center mt-2">
          Baseado em citações públicas. Não representa endosso oficial.
        </p>
      </DialogContent>
    </Dialog>
  );
}
