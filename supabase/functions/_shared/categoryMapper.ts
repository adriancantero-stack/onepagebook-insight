/**
 * Category Mapper - Maps Google Books categories to OnePageBook predefined categories
 */

export const GOOGLE_TO_ONEPAGE_MAP: Record<string, string> = {
  // Business related
  'Business & Economics': 'business',
  'business': 'business',
  'negocios': 'business',
  'negócios': 'business',
  'Business Economics': 'business',
  'Entrepreneurship': 'business',
  
  // Psychology & Self-Help
  'Psychology': 'psych',
  'psych': 'psych',
  'psicologia': 'psych',
  'psicología': 'psych',
  'Self-Help': 'psych',
  'autoajuda': 'psych',
  'autoayuda': 'psych',
  'Mind Body Spirit': 'psych',
  'Personal Growth': 'psych',
  
  // Health & Sleep
  'Health & Fitness': 'sleep',
  'sleep': 'sleep',
  'health': 'sleep',
  'salud': 'sleep',
  'saúde': 'sleep',
  'Medical': 'sleep',
  'Health Fitness': 'sleep',
  'Wellness': 'sleep',
  
  // Productivity & Habits
  'habits': 'habits',
  'productivity': 'habits',
  'produtividade': 'habits',
  'Time Management': 'habits',
  'Self-Improvement': 'habits',
  
  // Finance
  'finance': 'finance',
  'finanzas': 'finance',
  'finanças': 'finance',
  'Personal Finance': 'finance',
  'Investing': 'finance',
  'Money': 'finance',
  
  // Leadership
  'lead': 'leadership',
  'leadership': 'leadership',
  'liderança': 'leadership',
  'liderazgo': 'leadership',
  'Management': 'leadership',
  'Leadership Management': 'leadership',
  
  // Marketing
  'marketing': 'marketing',
  'Marketing Sales': 'marketing',
  'Advertising': 'marketing',
  
  // Career
  'career': 'career',
  'carreira': 'career',
  'Careers': 'career',
  'Job Hunting': 'career',
  
  // Communication
  'comm': 'communication',
  'communication': 'communication',
  'comunicação': 'communication',
  'comunicación': 'communication',
  'Public Speaking': 'communication',
  'Writing': 'communication',
  
  // Creativity
  'creative': 'creativity',
  'creativity': 'creativity',
  'criatividade': 'creativity',
  'Innovation': 'creativity',
  'Design': 'creativity',
  
  // Biography
  'bio': 'biography',
  'biography': 'biography',
  'biografia': 'biography',
  'Biography & Autobiography': 'biography',
  'Biography Autobiography': 'biography',
  'Memoir': 'biography',
  
  // Strategy
  'strategy': 'strategy',
  'estratégia': 'strategy',
  'estrategia': 'strategy',
  'Strategic Planning': 'strategy',
  
  // Technology
  'tech': 'technology',
  'technology': 'technology',
  'tecnologia': 'technology',
  'Technology & Engineering': 'technology',
  'Technology Engineering': 'technology',
  'Computers': 'technology',
  'Computer Science': 'technology',
  'Software': 'technology',
  
  // Education
  'education': 'education',
  'educação': 'education',
  'educación': 'education',
  'Education': 'education',
  'Teaching': 'education',
  'Learning': 'education',
  
  // Startup
  'startup': 'startup',
  'startups': 'startup',
  'Venture Capital': 'startup',
  
  // Personal Development
  'desenvolvimento pessoal': 'personal-dev',
  'desarrollo personal': 'personal-dev',
  'personal development': 'personal-dev',
  'Personal Development': 'personal-dev',
  'Motivational': 'personal-dev',
  'Success': 'personal-dev',
};

/**
 * Maps a Google Books category to a OnePageBook predefined category
 * @param googleCategory - The category from Google Books API
 * @param fallback - Default category if no mapping is found (default: 'business')
 * @returns The mapped OnePageBook category key
 */
export function mapGoogleCategory(googleCategory: string, fallback = 'business'): string {
  if (!googleCategory) return fallback;
  
  // Try exact match first
  if (GOOGLE_TO_ONEPAGE_MAP[googleCategory]) {
    return GOOGLE_TO_ONEPAGE_MAP[googleCategory];
  }
  
  // Try normalized match (lowercase and trimmed)
  const normalized = googleCategory.toLowerCase().trim();
  if (GOOGLE_TO_ONEPAGE_MAP[normalized]) {
    return GOOGLE_TO_ONEPAGE_MAP[normalized];
  }
  
  // Try partial match (check if category contains any key)
  for (const [key, value] of Object.entries(GOOGLE_TO_ONEPAGE_MAP)) {
    if (normalized.includes(key.toLowerCase())) {
      return value;
    }
  }
  
  return fallback;
}
