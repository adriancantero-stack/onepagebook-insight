/**
 * Theme to category mapping configuration
 * Maps summary themes to book catalog categories
 */
export const themeCategoryMap: Record<string, string> = {
  productivity: "habits",
  mindset: "psych",
  health: "sleep",
  default: "habits",
};

/**
 * Get the category ID for a given theme
 */
export const getThemeCategoryId = (theme: string): string => {
  return themeCategoryMap[theme] || theme;
};
