import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import atomicHabits from "@/assets/books/atomic-habits.jpg";
import richDadPoorDad from "@/assets/books/rich-dad-poor-dad.jpg";
import powerOfHabit from "@/assets/books/power-of-habit.jpg";

interface LandingLibraryProps {
  onCTA: () => void;
}

export const LandingLibrary = ({ onCTA }: LandingLibraryProps) => {
  const { t } = useTranslation();

  const featuredBooks = [
    { image: atomicHabits, title: "Atomic Habits" },
    { image: richDadPoorDad, title: "Rich Dad Poor Dad" },
    { image: powerOfHabit, title: "The Power of Habit" },
  ];

  return (
    <section className="border-t border-border bg-muted/30 py-16 sm:py-20">
      <div className="container mx-auto px-6 sm:px-12 lg:px-24">
        <h2 className="mb-12 text-center text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
          {t("landing.library.title")}
        </h2>

        <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-3">
          {featuredBooks.map((book, idx) => (
            <div key={idx} className="group space-y-4 text-center transition-all hover:scale-105">
              <div className="relative overflow-hidden rounded-xl shadow-lg">
                <Badge className="absolute right-2 top-2 z-10 bg-primary/90 text-xs">
                  {t("landing.library.previewBadge")}
                </Badge>
                <img
                  src={book.image}
                  alt={book.title}
                  className="aspect-[2/3] w-full object-cover transition-all group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              <Button onClick={onCTA} variant="outline" size="sm" className="w-full">
                {t("landing.library.generateCta")}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
