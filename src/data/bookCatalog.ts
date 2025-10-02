export interface Book {
  title: string;
  author: string;
}

export interface Category {
  id: string;
  nameKey: string;
  books: Book[];
}

export const bookCatalog: Category[] = [
  {
    id: "habits",
    nameKey: "cats.habits",
    books: [
      { title: "Atomic Habits", author: "James Clear" },
      { title: "Deep Work", author: "Cal Newport" },
      { title: "The Power of Habit", author: "Charles Duhigg" },
      { title: "Essentialism", author: "Greg McKeown" },
      { title: "The One Thing", author: "Gary Keller; Jay Papasan" },
      { title: "Indistractable", author: "Nir Eyal" },
      { title: "Make Time", author: "Jake Knapp; John Zeratsky" },
      { title: "Tiny Habits", author: "BJ Fogg" },
      { title: "Four Thousand Weeks", author: "Oliver Burkeman" },
      { title: "Getting Things Done", author: "David Allen" }
    ]
  },
  {
    id: "sleep",
    nameKey: "cats.sleep",
    books: [
      { title: "Why We Sleep", author: "Matthew Walker" },
      { title: "The Circadian Code", author: "Satchin Panda" },
      { title: "Change Your Schedule, Change Your Life", author: "Suhas Kshirsagar" },
      { title: "Sleep Smarter", author: "Shawn Stevenson" },
      { title: "Outlive", author: "Peter Attia" },
      { title: "Breath", author: "James Nestor" },
      { title: "Spark", author: "John J. Ratey" },
      { title: "The Joy of Movement", author: "Kelly McGonigal" },
      { title: "How Not to Die", author: "Michael Greger" },
      { title: "Why We Get Sick", author: "Benjamin Bikman" }
    ]
  },
  {
    id: "psych",
    nameKey: "cats.psych",
    books: [
      { title: "Mindset", author: "Carol S. Dweck" },
      { title: "Thinking, Fast and Slow", author: "Daniel Kahneman" },
      { title: "Grit", author: "Angela Duckworth" },
      { title: "The Happiness Advantage", author: "Shawn Achor" },
      { title: "Man's Search for Meaning", author: "Viktor E. Frankl" },
      { title: "Flow", author: "Mihaly Csikszentmihalyi" },
      { title: "The Obstacle Is the Way", author: "Ryan Holiday" },
      { title: "Drive", author: "Daniel H. Pink" },
      { title: "Stumbling on Happiness", author: "Daniel Gilbert" },
      { title: "The Happiness Hypothesis", author: "Jonathan Haidt" }
    ]
  }
];

// Helper function to normalize text for search (remove accents, lowercase)
export const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};
