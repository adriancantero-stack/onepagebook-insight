import i18n from "@/i18n/config";

/**
 * Builds the full text content for text-to-speech generation
 * @param summary - The book summary data
 * @param language - Target language (pt, en, es)
 * @returns Formatted text ready for TTS
 */
export const buildAudioText = (summary: any, language: string): string => {
  // Get translation function for the specified language
  const t = (key: string) => i18n.getFixedT(language)(`audio.${key}`);
  const sections: string[] = [];

  // Title and author
  sections.push(`${t("book")}: ${summary.book_title}`);
  sections.push(`${t("author")}: ${summary.author}`);

  // One liner
  if (summary.one_liner) {
    sections.push(`${t("oneLiner")}: ${summary.one_liner}`);
  }

  // Key concepts
  if (summary.key_concepts?.length) {
    sections.push(`${t("keyConcepts")}: ${summary.key_concepts.join(". ")}`);
  }

  // Key ideas
  if (summary.key_ideas?.length) {
    sections.push(`${t("keyIdeas")}: ${summary.key_ideas.join(". ")}`);
  }

  // Recommended for
  if (summary.recommended_for) {
    sections.push(`${t("recommendedFor")}: ${summary.recommended_for}`);
  }

  // Synopsis
  if (summary.synopsis) {
    sections.push(`${t("synopsis")}: ${summary.synopsis}`);
  }

  // Plot
  if (summary.plot) {
    sections.push(`${t("plot")}: ${summary.plot}`);
  }

  // Themes
  if (summary.themes?.length) {
    sections.push(`${t("themes")}: ${summary.themes.join(". ")}`);
  }

  // Characters
  if (summary.characters?.length) {
    sections.push(`${t("characters")}: ${summary.characters.join(". ")}`);
  }

  // Quotes
  if (summary.quotes?.length) {
    sections.push(`${t("quotes")}: ${summary.quotes.join(". ")}`);
  }

  // Critical reception
  if (summary.critical_reception) {
    sections.push(`${t("criticalReception")}: ${summary.critical_reception}`);
  }

  // Historical context
  if (summary.historical_context) {
    sections.push(`${t("historicalContext")}: ${summary.historical_context}`);
  }

  // Writing style
  if (summary.writing_style) {
    sections.push(`${t("writingStyle")}: ${summary.writing_style}`);
  }

  // Cultural impact
  if (summary.cultural_impact) {
    sections.push(`${t("culturalImpact")}: ${summary.cultural_impact}`);
  }

  // Bibliography
  if (summary.bibliography?.length) {
    sections.push(`${t("bibliography")}: ${summary.bibliography.join(". ")}`);
  }

  return sections.join("\n\n");
};
