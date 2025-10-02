export interface Book {
  title: string;
  author: string;
}

export interface Category {
  id: string;
  nameKey: string;
  books: Book[];
}

export interface FlatIndexItem {
  id: string;
  title: string;
  author: string;
  catId: string;
  catNameKey: string;
  nTitle: string;
  nAuthor: string;
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

// Enhanced normalize function for better search matching
export const normalize = (text: string): string => {
  return (text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
};

// Create flat index for fast searching
export const createFlatIndex = (): FlatIndexItem[] => {
  return bookCatalog.flatMap((cat) =>
    cat.books.map((book, index) => ({
      id: `${cat.id}-${index}`,
      title: book.title,
      author: book.author,
      catId: cat.id,
      catNameKey: cat.nameKey,
      nTitle: normalize(book.title),
      nAuthor: normalize(book.author),
    }))
  );
};

// Suggestion ranking function
export const suggestBooks = (
  query: string,
  flatIndex: FlatIndexItem[],
  selectedCatId?: string
): FlatIndexItem[] => {
  const nq = normalize(query);
  if (nq.length < 2) return [];

  const scored: Array<{ item: FlatIndexItem; score: number }> = [];

  for (const item of flatIndex) {
    let score = 0;

    // Title matching
    if (item.nTitle.startsWith(nq)) score += 100;
    else if (item.nTitle.includes(nq)) score += 60;

    // Author matching
    if (item.nAuthor.startsWith(nq)) score += 40;
    else if (item.nAuthor.includes(nq)) score += 20;

    // Boost if in selected category
    if (selectedCatId && item.catId === selectedCatId) score += 10;

    if (score > 0) {
      scored.push({ item, score });
    }
  }

  return scored
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
    .slice(0, 8)
    .map((x) => x.item);
};
