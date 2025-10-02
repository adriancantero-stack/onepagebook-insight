export interface Book {
  title: string;
  author: string;
  locale: string; // 'pt' | 'en' | 'es'
  originalTitle?: string; // For reference
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
  locale: string;
}

export const bookCatalog: Category[] = [
  {
    id: "habits",
    nameKey: "cats.habits",
    books: [
      // Portuguese
      { title: "Hábitos Atômicos", author: "James Clear", locale: "pt", originalTitle: "Atomic Habits" },
      { title: "Trabalho Focado", author: "Cal Newport", locale: "pt", originalTitle: "Deep Work" },
      { title: "O Poder do Hábito", author: "Charles Duhigg", locale: "pt", originalTitle: "The Power of Habit" },
      { title: "Essencialismo", author: "Greg McKeown", locale: "pt", originalTitle: "Essentialism" },
      { title: "A Única Coisa", author: "Gary Keller; Jay Papasan", locale: "pt", originalTitle: "The One Thing" },
      { title: "Indistraível", author: "Nir Eyal", locale: "pt", originalTitle: "Indistractable" },
      { title: "Tenha Tempo", author: "Jake Knapp; John Zeratsky", locale: "pt", originalTitle: "Make Time" },
      { title: "Hábitos Minúsculos", author: "BJ Fogg", locale: "pt", originalTitle: "Tiny Habits" },
      { title: "Quatro Mil Semanas", author: "Oliver Burkeman", locale: "pt", originalTitle: "Four Thousand Weeks" },
      { title: "A Arte de Fazer Acontecer", author: "David Allen", locale: "pt", originalTitle: "Getting Things Done" },
      
      // English
      { title: "Atomic Habits", author: "James Clear", locale: "en" },
      { title: "Deep Work", author: "Cal Newport", locale: "en" },
      { title: "The Power of Habit", author: "Charles Duhigg", locale: "en" },
      { title: "Essentialism", author: "Greg McKeown", locale: "en" },
      { title: "The One Thing", author: "Gary Keller; Jay Papasan", locale: "en" },
      { title: "Indistractable", author: "Nir Eyal", locale: "en" },
      { title: "Make Time", author: "Jake Knapp; John Zeratsky", locale: "en" },
      { title: "Tiny Habits", author: "BJ Fogg", locale: "en" },
      { title: "Four Thousand Weeks", author: "Oliver Burkeman", locale: "en" },
      { title: "Getting Things Done", author: "David Allen", locale: "en" },
      
      // Spanish
      { title: "Hábitos Atómicos", author: "James Clear", locale: "es", originalTitle: "Atomic Habits" },
      { title: "Enfócate", author: "Cal Newport", locale: "es", originalTitle: "Deep Work" },
      { title: "El Poder de los Hábitos", author: "Charles Duhigg", locale: "es", originalTitle: "The Power of Habit" },
      { title: "Esencialismo", author: "Greg McKeown", locale: "es", originalTitle: "Essentialism" },
      { title: "Lo Único", author: "Gary Keller; Jay Papasan", locale: "es", originalTitle: "The One Thing" },
      { title: "Indistraible", author: "Nir Eyal", locale: "es", originalTitle: "Indistractable" },
      { title: "Haz Tiempo", author: "Jake Knapp; John Zeratsky", locale: "es", originalTitle: "Make Time" },
      { title: "Hábitos Diminutos", author: "BJ Fogg", locale: "es", originalTitle: "Tiny Habits" },
      { title: "Cuatro Mil Semanas", author: "Oliver Burkeman", locale: "es", originalTitle: "Four Thousand Weeks" },
      { title: "Organízate con Eficacia", author: "David Allen", locale: "es", originalTitle: "Getting Things Done" },
    ]
  },
  {
    id: "sleep",
    nameKey: "cats.sleep",
    books: [
      // Portuguese
      { title: "Por Que Nós Dormimos", author: "Matthew Walker", locale: "pt", originalTitle: "Why We Sleep" },
      { title: "O Código Circadiano", author: "Satchin Panda", locale: "pt", originalTitle: "The Circadian Code" },
      { title: "Mude Sua Rotina, Mude Sua Vida", author: "Suhas Kshirsagar", locale: "pt", originalTitle: "Change Your Schedule, Change Your Life" },
      { title: "Durma Melhor", author: "Shawn Stevenson", locale: "pt", originalTitle: "Sleep Smarter" },
      { title: "Viva Mais e Melhor", author: "Peter Attia", locale: "pt", originalTitle: "Outlive" },
      { title: "Respire", author: "James Nestor", locale: "pt", originalTitle: "Breath" },
      { title: "Spark", author: "John J. Ratey", locale: "pt" },
      { title: "A Alegria do Movimento", author: "Kelly McGonigal", locale: "pt", originalTitle: "The Joy of Movement" },
      { title: "Como Não Morrer", author: "Michael Greger", locale: "pt", originalTitle: "How Not to Die" },
      { title: "Por Que Ficamos Doentes", author: "Benjamin Bikman", locale: "pt", originalTitle: "Why We Get Sick" },
      
      // English
      { title: "Why We Sleep", author: "Matthew Walker", locale: "en" },
      { title: "The Circadian Code", author: "Satchin Panda", locale: "en" },
      { title: "Change Your Schedule, Change Your Life", author: "Suhas Kshirsagar", locale: "en" },
      { title: "Sleep Smarter", author: "Shawn Stevenson", locale: "en" },
      { title: "Outlive", author: "Peter Attia", locale: "en" },
      { title: "Breath", author: "James Nestor", locale: "en" },
      { title: "Spark", author: "John J. Ratey", locale: "en" },
      { title: "The Joy of Movement", author: "Kelly McGonigal", locale: "en" },
      { title: "How Not to Die", author: "Michael Greger", locale: "en" },
      { title: "Why We Get Sick", author: "Benjamin Bikman", locale: "en" },
      
      // Spanish
      { title: "Por Qué Dormimos", author: "Matthew Walker", locale: "es", originalTitle: "Why We Sleep" },
      { title: "El Código Circadiano", author: "Satchin Panda", locale: "es", originalTitle: "The Circadian Code" },
      { title: "Cambia tu Horario, Cambia tu Vida", author: "Suhas Kshirsagar", locale: "es", originalTitle: "Change Your Schedule, Change Your Life" },
      { title: "Duerme Mejor", author: "Shawn Stevenson", locale: "es", originalTitle: "Sleep Smarter" },
      { title: "Vive Más Tiempo", author: "Peter Attia", locale: "es", originalTitle: "Outlive" },
      { title: "Respira", author: "James Nestor", locale: "es", originalTitle: "Breath" },
      { title: "Spark", author: "John J. Ratey", locale: "es" },
      { title: "La Alegría del Movimiento", author: "Kelly McGonigal", locale: "es", originalTitle: "The Joy of Movement" },
      { title: "Comer para No Morir", author: "Michael Greger", locale: "es", originalTitle: "How Not to Die" },
      { title: "Por Qué Enfermamos", author: "Benjamin Bikman", locale: "es", originalTitle: "Why We Get Sick" },
    ]
  },
  {
    id: "psych",
    nameKey: "cats.psych",
    books: [
      // Portuguese
      { title: "Mindset", author: "Carol S. Dweck", locale: "pt" },
      { title: "Rápido e Devagar", author: "Daniel Kahneman", locale: "pt", originalTitle: "Thinking, Fast and Slow" },
      { title: "Garra", author: "Angela Duckworth", locale: "pt", originalTitle: "Grit" },
      { title: "O Jeito Harvard de Ser Feliz", author: "Shawn Achor", locale: "pt", originalTitle: "The Happiness Advantage" },
      { title: "Em Busca de Sentido", author: "Viktor E. Frankl", locale: "pt", originalTitle: "Man's Search for Meaning" },
      { title: "Flow", author: "Mihaly Csikszentmihalyi", locale: "pt" },
      { title: "O Obstáculo é o Caminho", author: "Ryan Holiday", locale: "pt", originalTitle: "The Obstacle Is the Way" },
      { title: "Drive", author: "Daniel H. Pink", locale: "pt" },
      { title: "Tropeçando na Felicidade", author: "Daniel Gilbert", locale: "pt", originalTitle: "Stumbling on Happiness" },
      { title: "A Hipótese da Felicidade", author: "Jonathan Haidt", locale: "pt", originalTitle: "The Happiness Hypothesis" },
      
      // English
      { title: "Mindset", author: "Carol S. Dweck", locale: "en" },
      { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", locale: "en" },
      { title: "Grit", author: "Angela Duckworth", locale: "en" },
      { title: "The Happiness Advantage", author: "Shawn Achor", locale: "en" },
      { title: "Man's Search for Meaning", author: "Viktor E. Frankl", locale: "en" },
      { title: "Flow", author: "Mihaly Csikszentmihalyi", locale: "en" },
      { title: "The Obstacle Is the Way", author: "Ryan Holiday", locale: "en" },
      { title: "Drive", author: "Daniel H. Pink", locale: "en" },
      { title: "Stumbling on Happiness", author: "Daniel Gilbert", locale: "en" },
      { title: "The Happiness Hypothesis", author: "Jonathan Haidt", locale: "en" },
      
      // Spanish
      { title: "Mentalidad", author: "Carol S. Dweck", locale: "es", originalTitle: "Mindset" },
      { title: "Pensar Rápido, Pensar Despacio", author: "Daniel Kahneman", locale: "es", originalTitle: "Thinking, Fast and Slow" },
      { title: "Grit", author: "Angela Duckworth", locale: "es" },
      { title: "La Ventaja de la Felicidad", author: "Shawn Achor", locale: "es", originalTitle: "The Happiness Advantage" },
      { title: "El Hombre en Busca de Sentido", author: "Viktor E. Frankl", locale: "es", originalTitle: "Man's Search for Meaning" },
      { title: "Fluir", author: "Mihaly Csikszentmihalyi", locale: "es", originalTitle: "Flow" },
      { title: "El Obstáculo es el Camino", author: "Ryan Holiday", locale: "es", originalTitle: "The Obstacle Is the Way" },
      { title: "Drive", author: "Daniel H. Pink", locale: "es" },
      { title: "Tropezar con la Felicidad", author: "Daniel Gilbert", locale: "es", originalTitle: "Stumbling on Happiness" },
      { title: "La Hipótesis de la Felicidad", author: "Jonathan Haidt", locale: "es", originalTitle: "The Happiness Hypothesis" },
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

// Filter books by locale
export const getBooksByLocale = (category: Category, locale: string): Book[] => {
  return category.books.filter(book => book.locale === locale);
};

// Create flat index for fast searching (filtered by locale)
export const createFlatIndex = (locale: string): FlatIndexItem[] => {
  return bookCatalog.flatMap((cat) =>
    cat.books
      .filter(book => book.locale === locale)
      .map((book, index) => ({
        id: `${cat.id}-${book.locale}-${index}`,
        title: book.title,
        author: book.author,
        catId: cat.id,
        catNameKey: cat.nameKey,
        nTitle: normalize(book.title),
        nAuthor: normalize(book.author),
        locale: book.locale,
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
