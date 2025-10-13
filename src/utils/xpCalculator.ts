/**
 * XP and Level Calculation Utilities
 * OnePageBook.ai V2.0 - Gamification System
 */

export type Level = 'Beginner' | 'Learner' | 'Thinker' | 'Master' | 'Enlightened';

export interface LevelInfo {
  name: Level;
  minXP: number;
  maxXP: number;
  color: string;
  icon: string;
  gradient: string;
}

export const LEVELS: Record<Level, LevelInfo> = {
  Beginner: {
    name: 'Beginner',
    minXP: 0,
    maxXP: 99,
    color: 'text-lilac-400',
    icon: '🌱',
    gradient: 'from-lilac-300 to-lilac-400'
  },
  Learner: {
    name: 'Learner',
    minXP: 100,
    maxXP: 499,
    color: 'text-lilac-500',
    icon: '📚',
    gradient: 'from-lilac-400 to-lilac-500'
  },
  Thinker: {
    name: 'Thinker',
    minXP: 500,
    maxXP: 1499,
    color: 'text-purple-500',
    icon: '🧠',
    gradient: 'from-lilac-500 to-purple-500'
  },
  Master: {
    name: 'Master',
    minXP: 1500,
    maxXP: 4999,
    color: 'text-violet-600',
    icon: '🎓',
    gradient: 'from-purple-500 to-violet-600'
  },
  Enlightened: {
    name: 'Enlightened',
    minXP: 5000,
    maxXP: Infinity,
    color: 'text-premium-gold',
    icon: '✨',
    gradient: 'from-violet-600 via-premium-gold to-yellow-400'
  }
};

/**
 * Calculate level based on total XP
 */
export function calculateLevel(xp: number): LevelInfo {
  if (xp >= 5000) return LEVELS.Enlightened;
  if (xp >= 1500) return LEVELS.Master;
  if (xp >= 500) return LEVELS.Thinker;
  if (xp >= 100) return LEVELS.Learner;
  return LEVELS.Beginner;
}

/**
 * Get XP required for next level
 */
export function getXPForNextLevel(currentXP: number): number {
  const currentLevel = calculateLevel(currentXP);
  
  if (currentLevel.name === 'Enlightened') {
    return currentXP; // Already max level
  }
  
  // Find next level's minXP
  const levels: Level[] = ['Beginner', 'Learner', 'Thinker', 'Master', 'Enlightened'];
  const currentIndex = levels.indexOf(currentLevel.name);
  const nextLevel = LEVELS[levels[currentIndex + 1]];
  
  return nextLevel.minXP;
}

/**
 * Calculate XP progress percentage for current level
 */
export function getXPProgress(currentXP: number): number {
  const currentLevel = calculateLevel(currentXP);
  
  if (currentLevel.name === 'Enlightened') {
    return 100; // Max level
  }
  
  const xpInCurrentLevel = currentXP - currentLevel.minXP;
  const xpNeededForLevel = currentLevel.maxXP - currentLevel.minXP + 1;
  
  return Math.min(Math.round((xpInCurrentLevel / xpNeededForLevel) * 100), 100);
}

/**
 * Get level color class for Tailwind
 */
export function getLevelColor(level: string): string {
  return LEVELS[level as Level]?.color || LEVELS.Beginner.color;
}

/**
 * Get level gradient class for Tailwind
 */
export function getLevelGradient(level: string): string {
  return LEVELS[level as Level]?.gradient || LEVELS.Beginner.gradient;
}

/**
 * Format XP with thousands separator
 */
export function formatXP(xp: number): string {
  return xp.toLocaleString();
}
