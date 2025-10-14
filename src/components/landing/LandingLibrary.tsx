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
    <section className="border-t border-border bg-muted/30 py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-24">
        <h2 className="mb-8 sm:mb-12 text-center text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold tracking-tight px-4">
          {t("landing.library.title")}
        </h2>

        <div className="mx-auto grid max-w-4xl gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-3">
          {featuredBooks.map((book, idx) => (
            <div key={idx} className="group space-y-3 sm:space-y-4 text-center transition-all hover:scale-105">
              <div className="relative overflow-hidden rounded-lg sm:rounded-xl shadow-lg">
                <Badge className="absolute right-2 top-2 z-10 bg-primary/90 text-xs">
                  {t("landing.library.previewBadge")}
                </Badge>
                <img
                  src={book.image}
                  alt={book.title}
                  className="aspect-[2/3] w-full object-cover transition-all group-hover:scale-110"
                  loading="lazy"
                  width="300"
                  height="450"
                  decoding="async"
                />
              </div>
              <Button onClick={onCTA} variant="outline" size="sm" className="w-full text-xs sm:text-sm">
                {t("landing.library.generateCta")}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
