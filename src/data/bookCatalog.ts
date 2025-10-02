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
  },
  {
    id: "strategy",
    nameKey: "cats.strategy",
    books: [
      // Portuguese
      { title: "Empresas Feitas para Vencer", author: "Jim Collins", locale: "pt", originalTitle: "Good to Great" },
      { title: "A Estratégia do Oceano Azul", author: "W. Chan Kim; Renée Mauborgne", locale: "pt", originalTitle: "Blue Ocean Strategy" },
      { title: "A Startup Enxuta", author: "Eric Ries", locale: "pt", originalTitle: "The Lean Startup" },
      { title: "Atravessando o Abismo", author: "Geoffrey A. Moore", locale: "pt", originalTitle: "Crossing the Chasm" },
      { title: "O Dilema da Inovação", author: "Clayton M. Christensen", locale: "pt", originalTitle: "The Innovator's Dilemma" },
      { title: "De Zero a Um", author: "Peter Thiel; Blake Masters", locale: "pt", originalTitle: "Zero to One" },
      { title: "Boa Estratégia, Má Estratégia", author: "Richard Rumelt", locale: "pt", originalTitle: "Good Strategy Bad Strategy" },
      { title: "7 Powers", author: "Hamilton Helmer", locale: "pt" },
      { title: "Jogue para Vencer", author: "A.G. Lafley; Roger L. Martin", locale: "pt", originalTitle: "Playing to Win" },
      { title: "Meça o Que Importa", author: "John Doerr", locale: "pt", originalTitle: "Measure What Matters" },
      
      // English
      { title: "Good to Great", author: "Jim Collins", locale: "en" },
      { title: "Blue Ocean Strategy", author: "W. Chan Kim; Renée Mauborgne", locale: "en" },
      { title: "The Lean Startup", author: "Eric Ries", locale: "en" },
      { title: "Crossing the Chasm", author: "Geoffrey A. Moore", locale: "en" },
      { title: "The Innovator's Dilemma", author: "Clayton M. Christensen", locale: "en" },
      { title: "Zero to One", author: "Peter Thiel; Blake Masters", locale: "en" },
      { title: "Good Strategy Bad Strategy", author: "Richard Rumelt", locale: "en" },
      { title: "7 Powers", author: "Hamilton Helmer", locale: "en" },
      { title: "Playing to Win", author: "A.G. Lafley; Roger L. Martin", locale: "en" },
      { title: "Measure What Matters", author: "John Doerr", locale: "en" },
      
      // Spanish
      { title: "Empresas que Sobresalen", author: "Jim Collins", locale: "es", originalTitle: "Good to Great" },
      { title: "La Estrategia del Océano Azul", author: "W. Chan Kim; Renée Mauborgne", locale: "es", originalTitle: "Blue Ocean Strategy" },
      { title: "El Método Lean Startup", author: "Eric Ries", locale: "es", originalTitle: "The Lean Startup" },
      { title: "Cruzando el Abismo", author: "Geoffrey A. Moore", locale: "es", originalTitle: "Crossing the Chasm" },
      { title: "El Dilema de los Innovadores", author: "Clayton M. Christensen", locale: "es", originalTitle: "The Innovator's Dilemma" },
      { title: "De Cero a Uno", author: "Peter Thiel; Blake Masters", locale: "es", originalTitle: "Zero to One" },
      { title: "Buena Estrategia, Mala Estrategia", author: "Richard Rumelt", locale: "es", originalTitle: "Good Strategy Bad Strategy" },
      { title: "7 Powers", author: "Hamilton Helmer", locale: "es" },
      { title: "Jugar para Ganar", author: "A.G. Lafley; Roger L. Martin", locale: "es", originalTitle: "Playing to Win" },
      { title: "Mide lo que Importa", author: "John Doerr", locale: "es", originalTitle: "Measure What Matters" },
    ]
  },
  {
    id: "finance",
    nameKey: "cats.finance",
    books: [
      // Portuguese
      { title: "A Psicologia Financeira", author: "Morgan Housel", locale: "pt", originalTitle: "The Psychology of Money" },
      { title: "Eu Vou Te Ensinar a Ser Rico", author: "Ramit Sethi", locale: "pt", originalTitle: "I Will Teach You to Be Rich" },
      { title: "O Caminho Simples para a Riqueza", author: "JL Collins", locale: "pt", originalTitle: "The Simple Path to Wealth" },
      { title: "Pai Rico, Pai Pobre", author: "Robert T. Kiyosaki", locale: "pt", originalTitle: "Rich Dad Poor Dad" },
      { title: "Dinheiro ou Vida", author: "Vicki Robin; Joe Dominguez", locale: "pt", originalTitle: "Your Money or Your Life" },
      { title: "O Milionário Mora ao Lado", author: "Thomas J. Stanley; William D. Danko", locale: "pt", originalTitle: "The Millionaire Next Door" },
      { title: "Um Passeio Aleatório por Wall Street", author: "Burton G. Malkiel", locale: "pt", originalTitle: "A Random Walk Down Wall Street" },
      { title: "O Pequeno Livro dos Investimentos", author: "John C. Bogle", locale: "pt", originalTitle: "The Little Book of Common Sense Investing" },
      { title: "O Investidor Inteligente", author: "Benjamin Graham", locale: "pt", originalTitle: "The Intelligent Investor" },
      { title: "Guia Bogleheads para Investir", author: "Larimore; Lindauer; LeBoeuf", locale: "pt", originalTitle: "The Bogleheads' Guide to Investing" },
      
      // English
      { title: "The Psychology of Money", author: "Morgan Housel", locale: "en" },
      { title: "I Will Teach You to Be Rich", author: "Ramit Sethi", locale: "en" },
      { title: "The Simple Path to Wealth", author: "JL Collins", locale: "en" },
      { title: "Rich Dad Poor Dad", author: "Robert T. Kiyosaki", locale: "en" },
      { title: "Your Money or Your Life", author: "Vicki Robin; Joe Dominguez", locale: "en" },
      { title: "The Millionaire Next Door", author: "Thomas J. Stanley; William D. Danko", locale: "en" },
      { title: "A Random Walk Down Wall Street", author: "Burton G. Malkiel", locale: "en" },
      { title: "The Little Book of Common Sense Investing", author: "John C. Bogle", locale: "en" },
      { title: "The Intelligent Investor", author: "Benjamin Graham", locale: "en" },
      { title: "The Bogleheads' Guide to Investing", author: "Larimore; Lindauer; LeBoeuf", locale: "en" },
      
      // Spanish
      { title: "La Psicología del Dinero", author: "Morgan Housel", locale: "es", originalTitle: "The Psychology of Money" },
      { title: "Te Enseñaré a Ser Rico", author: "Ramit Sethi", locale: "es", originalTitle: "I Will Teach You to Be Rich" },
      { title: "El Camino Simple hacia la Riqueza", author: "JL Collins", locale: "es", originalTitle: "The Simple Path to Wealth" },
      { title: "Padre Rico, Padre Pobre", author: "Robert T. Kiyosaki", locale: "es", originalTitle: "Rich Dad Poor Dad" },
      { title: "Tu Dinero o Tu Vida", author: "Vicki Robin; Joe Dominguez", locale: "es", originalTitle: "Your Money or Your Life" },
      { title: "El Millonario de la Puerta de al Lado", author: "Thomas J. Stanley; William D. Danko", locale: "es", originalTitle: "The Millionaire Next Door" },
      { title: "Un Paseo Aleatorio por Wall Street", author: "Burton G. Malkiel", locale: "es", originalTitle: "A Random Walk Down Wall Street" },
      { title: "El Pequeño Libro de la Inversión", author: "John C. Bogle", locale: "es", originalTitle: "The Little Book of Common Sense Investing" },
      { title: "El Inversor Inteligente", author: "Benjamin Graham", locale: "es", originalTitle: "The Intelligent Investor" },
      { title: "Guía Bogleheads para Invertir", author: "Larimore; Lindauer; LeBoeuf", locale: "es", originalTitle: "The Bogleheads' Guide to Investing" },
    ]
  },
  {
    id: "comm",
    nameKey: "cats.comm",
    books: [
      // Portuguese
      { title: "Como Fazer Amigos e Influenciar Pessoas", author: "Dale Carnegie", locale: "pt", originalTitle: "How to Win Friends and Influence People" },
      { title: "As Armas da Persuasão", author: "Robert B. Cialdini", locale: "pt", originalTitle: "Influence" },
      { title: "Negocie Como se Sua Vida Dependesse Disso", author: "Chris Voss", locale: "pt", originalTitle: "Never Split the Difference" },
      { title: "Ideias que Colam", author: "Chip Heath; Dan Heath", locale: "pt", originalTitle: "Made to Stick" },
      { title: "Conversas Cruciais", author: "Patterson; Grenny; McMillan; Switzler", locale: "pt", originalTitle: "Crucial Conversations" },
      { title: "Pitch Anything", author: "Oren Klaff", locale: "pt" },
      { title: "Fale Como no TED", author: "Carmine Gallo", locale: "pt", originalTitle: "Talk Like TED" },
      { title: "Obrigado por Argumentar", author: "Jay Heinrichs", locale: "pt", originalTitle: "Thank You for Arguing" },
      { title: "Storyworthy", author: "Matthew Dicks", locale: "pt" },
      { title: "Presentation Zen", author: "Garr Reynolds", locale: "pt" },
      
      // English
      { title: "How to Win Friends and Influence People", author: "Dale Carnegie", locale: "en" },
      { title: "Influence", author: "Robert B. Cialdini", locale: "en" },
      { title: "Never Split the Difference", author: "Chris Voss", locale: "en" },
      { title: "Made to Stick", author: "Chip Heath; Dan Heath", locale: "en" },
      { title: "Crucial Conversations", author: "Patterson; Grenny; McMillan; Switzler", locale: "en" },
      { title: "Pitch Anything", author: "Oren Klaff", locale: "en" },
      { title: "Talk Like TED", author: "Carmine Gallo", locale: "en" },
      { title: "Thank You for Arguing", author: "Jay Heinrichs", locale: "en" },
      { title: "Storyworthy", author: "Matthew Dicks", locale: "en" },
      { title: "Presentation Zen", author: "Garr Reynolds", locale: "en" },
      
      // Spanish
      { title: "Cómo Ganar Amigos e Influir sobre las Personas", author: "Dale Carnegie", locale: "es", originalTitle: "How to Win Friends and Influence People" },
      { title: "Influencia", author: "Robert B. Cialdini", locale: "es", originalTitle: "Influence" },
      { title: "Rompe la Barrera del No", author: "Chris Voss", locale: "es", originalTitle: "Never Split the Difference" },
      { title: "Ideas que Pegan", author: "Chip Heath; Dan Heath", locale: "es", originalTitle: "Made to Stick" },
      { title: "Conversaciones Cruciales", author: "Patterson; Grenny; McMillan; Switzler", locale: "es", originalTitle: "Crucial Conversations" },
      { title: "Pitch Anything", author: "Oren Klaff", locale: "es" },
      { title: "Habla como en TED", author: "Carmine Gallo", locale: "es", originalTitle: "Talk Like TED" },
      { title: "Gracias por Argumentar", author: "Jay Heinrichs", locale: "es", originalTitle: "Thank You for Arguing" },
      { title: "Storyworthy", author: "Matthew Dicks", locale: "es" },
      { title: "Presentation Zen", author: "Garr Reynolds", locale: "es" },
    ]
  },
  {
    id: "lead",
    nameKey: "cats.lead",
    books: [
      // Portuguese
      { title: "Gestão de Alto Desempenho", author: "Andrew S. Grove", locale: "pt", originalTitle: "High Output Management" },
      { title: "Como se Tornar um Gerente", author: "Julie Zhuo", locale: "pt", originalTitle: "The Making of a Manager" },
      { title: "Sinceridade Radical", author: "Kim Scott", locale: "pt", originalTitle: "Radical Candor" },
      { title: "As Cinco Disfunções de uma Equipe", author: "Patrick Lencioni", locale: "pt", originalTitle: "The Five Dysfunctions of a Team" },
      { title: "Liderança Extrema", author: "Jocko Willink; Leif Babin", locale: "pt", originalTitle: "Extreme Ownership" },
      { title: "Líderes Se Servem Por Último", author: "Simon Sinek", locale: "pt", originalTitle: "Leaders Eat Last" },
      { title: "Treinador de Trilhões", author: "Eric Schmidt; Jonathan Rosenberg; Alan Eagle", locale: "pt", originalTitle: "Trillion Dollar Coach" },
      { title: "Os Primeiros 90 Dias", author: "Michael D. Watkins", locale: "pt", originalTitle: "The First 90 Days" },
      { title: "Multiplicadores", author: "Liz Wiseman", locale: "pt", originalTitle: "Multipliers" },
      { title: "O Caminho do Gerente", author: "Camille Fournier", locale: "pt", originalTitle: "The Manager's Path" },
      
      // English
      { title: "High Output Management", author: "Andrew S. Grove", locale: "en" },
      { title: "The Making of a Manager", author: "Julie Zhuo", locale: "en" },
      { title: "Radical Candor", author: "Kim Scott", locale: "en" },
      { title: "The Five Dysfunctions of a Team", author: "Patrick Lencioni", locale: "en" },
      { title: "Extreme Ownership", author: "Jocko Willink; Leif Babin", locale: "en" },
      { title: "Leaders Eat Last", author: "Simon Sinek", locale: "en" },
      { title: "Trillion Dollar Coach", author: "Eric Schmidt; Jonathan Rosenberg; Alan Eagle", locale: "en" },
      { title: "The First 90 Days", author: "Michael D. Watkins", locale: "en" },
      { title: "Multipliers", author: "Liz Wiseman", locale: "en" },
      { title: "The Manager's Path", author: "Camille Fournier", locale: "en" },
      
      // Spanish
      { title: "Gestión de Alto Rendimiento", author: "Andrew S. Grove", locale: "es", originalTitle: "High Output Management" },
      { title: "Cómo Convertirse en Gerente", author: "Julie Zhuo", locale: "es", originalTitle: "The Making of a Manager" },
      { title: "Franqueza Radical", author: "Kim Scott", locale: "es", originalTitle: "Radical Candor" },
      { title: "Las Cinco Disfunciones de un Equipo", author: "Patrick Lencioni", locale: "es", originalTitle: "The Five Dysfunctions of a Team" },
      { title: "Liderazgo Extremo", author: "Jocko Willink; Leif Babin", locale: "es", originalTitle: "Extreme Ownership" },
      { title: "Los Líderes Comen al Final", author: "Simon Sinek", locale: "es", originalTitle: "Leaders Eat Last" },
      { title: "Entrenador de Billones", author: "Eric Schmidt; Jonathan Rosenberg; Alan Eagle", locale: "es", originalTitle: "Trillion Dollar Coach" },
      { title: "Los Primeros 90 Días", author: "Michael D. Watkins", locale: "es", originalTitle: "The First 90 Days" },
      { title: "Multiplicadores", author: "Liz Wiseman", locale: "es", originalTitle: "Multipliers" },
      { title: "El Camino del Gerente", author: "Camille Fournier", locale: "es", originalTitle: "The Manager's Path" },
    ]
  },
  {
    id: "creative",
    nameKey: "cats.creative",
    books: [
      // Portuguese
      { title: "Roube Como um Artista", author: "Austin Kleon", locale: "pt", originalTitle: "Steal Like an Artist" },
      { title: "Mostre Seu Trabalho", author: "Austin Kleon", locale: "pt", originalTitle: "Show Your Work!" },
      { title: "Grande Magia", author: "Elizabeth Gilbert", locale: "pt", originalTitle: "Big Magic" },
      { title: "A Guerra da Arte", author: "Steven Pressfield", locale: "pt", originalTitle: "The War of Art" },
      { title: "Criatividade S.A.", author: "Ed Catmull; Amy Wallace", locale: "pt", originalTitle: "Creativity, Inc." },
      { title: "O Hábito Criativo", author: "Twyla Tharp", locale: "pt", originalTitle: "The Creative Habit" },
      { title: "Confiança Criativa", author: "Tom Kelley; David Kelley", locale: "pt", originalTitle: "Creative Confidence" },
      { title: "O Ato Criativo", author: "Rick Rubin", locale: "pt", originalTitle: "The Creative Act: A Way of Being" },
      { title: "Uma Técnica para Produzir Ideias", author: "James W. Young", locale: "pt", originalTitle: "A Technique for Producing Ideas" },
      { title: "Pensamento Lateral", author: "Edward de Bono", locale: "pt", originalTitle: "Lateral Thinking" },
      
      // English
      { title: "Steal Like an Artist", author: "Austin Kleon", locale: "en" },
      { title: "Show Your Work!", author: "Austin Kleon", locale: "en" },
      { title: "Big Magic", author: "Elizabeth Gilbert", locale: "en" },
      { title: "The War of Art", author: "Steven Pressfield", locale: "en" },
      { title: "Creativity, Inc.", author: "Ed Catmull; Amy Wallace", locale: "en" },
      { title: "The Creative Habit", author: "Twyla Tharp", locale: "en" },
      { title: "Creative Confidence", author: "Tom Kelley; David Kelley", locale: "en" },
      { title: "The Creative Act: A Way of Being", author: "Rick Rubin", locale: "en" },
      { title: "A Technique for Producing Ideas", author: "James W. Young", locale: "en" },
      { title: "Lateral Thinking", author: "Edward de Bono", locale: "en" },
      
      // Spanish
      { title: "Roba como un Artista", author: "Austin Kleon", locale: "es", originalTitle: "Steal Like an Artist" },
      { title: "Muestra Tu Trabajo", author: "Austin Kleon", locale: "es", originalTitle: "Show Your Work!" },
      { title: "Gran Magia", author: "Elizabeth Gilbert", locale: "es", originalTitle: "Big Magic" },
      { title: "La Guerra del Arte", author: "Steven Pressfield", locale: "es", originalTitle: "The War of Art" },
      { title: "Creatividad S.A.", author: "Ed Catmull; Amy Wallace", locale: "es", originalTitle: "Creativity, Inc." },
      { title: "El Hábito Creativo", author: "Twyla Tharp", locale: "es", originalTitle: "The Creative Habit" },
      { title: "Confianza Creativa", author: "Tom Kelley; David Kelley", locale: "es", originalTitle: "Creative Confidence" },
      { title: "El Acto Creativo", author: "Rick Rubin", locale: "es", originalTitle: "The Creative Act: A Way of Being" },
      { title: "Una Técnica para Producir Ideas", author: "James W. Young", locale: "es", originalTitle: "A Technique for Producing Ideas" },
      { title: "Pensamiento Lateral", author: "Edward de Bono", locale: "es", originalTitle: "Lateral Thinking" },
    ]
  },
  {
    id: "startup",
    nameKey: "cats.startup",
    books: [
      // Portuguese
      { title: "Manual do Dono de Startup", author: "Steve Blank; Bob Dorf", locale: "pt", originalTitle: "The Startup Owner's Manual" },
      { title: "Running Lean", author: "Ash Maurya", locale: "pt" },
      { title: "Os Quatro Passos para a Epifania", author: "Steve Blank", locale: "pt", originalTitle: "The Four Steps to the Epiphany" },
      { title: "Blitzscaling", author: "Reid Hoffman; Chris Yeh", locale: "pt" },
      { title: "Fundadores no Trabalho", author: "Jessica Livingston", locale: "pt", originalTitle: "Founders at Work" },
      { title: "O Teste da Mãe", author: "Rob Fitzpatrick", locale: "pt", originalTitle: "The Mom Test" },
      { title: "Tração", author: "Gabriel Weinberg; Justin Mares", locale: "pt", originalTitle: "Traction" },
      { title: "O Problema do Início Frio", author: "Andrew Chen", locale: "pt", originalTitle: "The Cold Start Problem" },
      { title: "As Coisas Difíceis sobre as Coisas Difíceis", author: "Ben Horowitz", locale: "pt", originalTitle: "The Hard Thing About Hard Things" },
      { title: "Do Impossível ao Inevitável", author: "Aaron Ross; Jason Lemkin", locale: "pt", originalTitle: "From Impossible to Inevitable" },
      
      // English
      { title: "The Startup Owner's Manual", author: "Steve Blank; Bob Dorf", locale: "en" },
      { title: "Running Lean", author: "Ash Maurya", locale: "en" },
      { title: "The Four Steps to the Epiphany", author: "Steve Blank", locale: "en" },
      { title: "Blitzscaling", author: "Reid Hoffman; Chris Yeh", locale: "en" },
      { title: "Founders at Work", author: "Jessica Livingston", locale: "en" },
      { title: "The Mom Test", author: "Rob Fitzpatrick", locale: "en" },
      { title: "Traction", author: "Gabriel Weinberg; Justin Mares", locale: "en" },
      { title: "The Cold Start Problem", author: "Andrew Chen", locale: "en" },
      { title: "The Hard Thing About Hard Things", author: "Ben Horowitz", locale: "en" },
      { title: "From Impossible to Inevitable", author: "Aaron Ross; Jason Lemkin", locale: "en" },
      
      // Spanish
      { title: "Manual del Dueño de Startup", author: "Steve Blank; Bob Dorf", locale: "es", originalTitle: "The Startup Owner's Manual" },
      { title: "Running Lean", author: "Ash Maurya", locale: "es" },
      { title: "Los Cuatro Pasos hacia la Epifanía", author: "Steve Blank", locale: "es", originalTitle: "The Four Steps to the Epiphany" },
      { title: "Blitzscaling", author: "Reid Hoffman; Chris Yeh", locale: "es" },
      { title: "Fundadores en el Trabajo", author: "Jessica Livingston", locale: "es", originalTitle: "Founders at Work" },
      { title: "La Prueba de la Madre", author: "Rob Fitzpatrick", locale: "es", originalTitle: "The Mom Test" },
      { title: "Tracción", author: "Gabriel Weinberg; Justin Mares", locale: "es", originalTitle: "Traction" },
      { title: "El Problema del Arranque en Frío", author: "Andrew Chen", locale: "es", originalTitle: "The Cold Start Problem" },
      { title: "Lo Difícil de lo Difícil", author: "Ben Horowitz", locale: "es", originalTitle: "The Hard Thing About Hard Things" },
      { title: "De Imposible a Inevitable", author: "Aaron Ross; Jason Lemkin", locale: "es", originalTitle: "From Impossible to Inevitable" },
    ]
  },
  {
    id: "life",
    nameKey: "cats.life",
    books: [
      // Portuguese
      { title: "Minimalismo Digital", author: "Cal Newport", locale: "pt", originalTitle: "Digital Minimalism" },
      { title: "Ikigai", author: "Héctor García; Francesc Miralles", locale: "pt" },
      { title: "O Projeto Felicidade", author: "Gretchen Rubin", locale: "pt", originalTitle: "The Happiness Project" },
      { title: "A Quietude é a Chave", author: "Ryan Holiday", locale: "pt", originalTitle: "Stillness Is the Key" },
      { title: "A Alma Liberta", author: "Michael A. Singer", locale: "pt", originalTitle: "The Untethered Soul" },
      { title: "Arrume Sua Cama", author: "William H. McRaven", locale: "pt", originalTitle: "Make Your Bed" },
      { title: "O Efeito Composto", author: "Darren Hardy", locale: "pt", originalTitle: "The Compound Effect" },
      { title: "O Livro do Conforto", author: "Matt Haig", locale: "pt", originalTitle: "The Comfort Book" },
      { title: "12 Regras para a Vida", author: "Jordan B. Peterson", locale: "pt", originalTitle: "12 Rules for Life" },
      { title: "O Poder do Agora", author: "Eckhart Tolle", locale: "pt", originalTitle: "The Power of Now" },
      
      // English
      { title: "Digital Minimalism", author: "Cal Newport", locale: "en" },
      { title: "Ikigai", author: "Héctor García; Francesc Miralles", locale: "en" },
      { title: "The Happiness Project", author: "Gretchen Rubin", locale: "en" },
      { title: "Stillness Is the Key", author: "Ryan Holiday", locale: "en" },
      { title: "The Untethered Soul", author: "Michael A. Singer", locale: "en" },
      { title: "Make Your Bed", author: "William H. McRaven", locale: "en" },
      { title: "The Compound Effect", author: "Darren Hardy", locale: "en" },
      { title: "The Comfort Book", author: "Matt Haig", locale: "en" },
      { title: "12 Rules for Life", author: "Jordan B. Peterson", locale: "en" },
      { title: "The Power of Now", author: "Eckhart Tolle", locale: "en" },
      
      // Spanish
      { title: "Minimalismo Digital", author: "Cal Newport", locale: "es", originalTitle: "Digital Minimalism" },
      { title: "Ikigai", author: "Héctor García; Francesc Miralles", locale: "es" },
      { title: "El Proyecto de la Felicidad", author: "Gretchen Rubin", locale: "es", originalTitle: "The Happiness Project" },
      { title: "La Quietud es la Clave", author: "Ryan Holiday", locale: "es", originalTitle: "Stillness Is the Key" },
      { title: "El Alma Liberada", author: "Michael A. Singer", locale: "es", originalTitle: "The Untethered Soul" },
      { title: "Tiende Tu Cama", author: "William H. McRaven", locale: "es", originalTitle: "Make Your Bed" },
      { title: "El Efecto Compuesto", author: "Darren Hardy", locale: "es", originalTitle: "The Compound Effect" },
      { title: "El Libro del Consuelo", author: "Matt Haig", locale: "es", originalTitle: "The Comfort Book" },
      { title: "12 Reglas para Vivir", author: "Jordan B. Peterson", locale: "es", originalTitle: "12 Rules for Life" },
      { title: "El Poder del Ahora", author: "Eckhart Tolle", locale: "es", originalTitle: "The Power of Now" },
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
