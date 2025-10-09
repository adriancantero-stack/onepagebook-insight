import { supabase } from "@/integrations/supabase/client";

export interface UsageData {
  monthKey: string;
  summariesUsed: number;
  audiosUsed: number;
}

const STORAGE_KEY = "ob_usage";
const FREE_LIMIT = 10;

// Get current month key in format "YYYY-MM"
export const getMonthKey = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

// Load usage from Supabase or localStorage as fallback
export const loadUsage = async (userId: string | null): Promise<UsageData> => {
  const currentMonth = getMonthKey();
  
  if (userId) {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("preferred_language")
        .eq("id", userId)
        .single();
      
      // Check if we have usage data stored somewhere (for now using localStorage)
      const stored = localStorage.getItem(`${STORAGE_KEY}_${userId}`);
      if (stored) {
        const usage: UsageData = JSON.parse(stored);
        return ensureMonth(usage);
      }
    } catch (error) {
      console.error("Error loading usage from backend:", error);
    }
  }
  
  // Fallback to localStorage
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const usage: UsageData = JSON.parse(stored);
    return ensureMonth(usage);
  }
  
  // Return fresh usage for current month
  return {
    monthKey: currentMonth,
    summariesUsed: 0,
    audiosUsed: 0,
  };
};

// Save usage to Supabase and localStorage
export const saveUsage = async (userId: string | null, usage: UsageData): Promise<void> => {
  if (userId) {
    localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(usage));
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usage));
  }
};

// Ensure usage is for current month, reset if not
export const ensureMonth = (usage: UsageData): UsageData => {
  const currentMonth = getMonthKey();
  if (usage.monthKey !== currentMonth) {
    return {
      monthKey: currentMonth,
      summariesUsed: 0,
      audiosUsed: 0,
    };
  }
  return usage;
};

// Check if user can generate a summary
export const canUseSummary = (usage: UsageData): boolean => {
  return usage.summariesUsed < FREE_LIMIT;
};

// Check if user can generate audio
export const canUseAudio = (usage: UsageData): boolean => {
  return usage.audiosUsed < FREE_LIMIT;
};

// Increment summary counter
export const incrementSummary = async (userId: string | null): Promise<number> => {
  const usage = await loadUsage(userId);
  usage.summariesUsed += 1;
  await saveUsage(userId, usage);
  return usage.summariesUsed;
};

// Increment audio counter
export const incrementAudio = async (userId: string | null): Promise<number> => {
  const usage = await loadUsage(userId);
  usage.audiosUsed += 1;
  await saveUsage(userId, usage);
  return usage.audiosUsed;
};

// Get remaining summaries
export const getRemainingSummaries = (usage: UsageData): number => {
  return Math.max(0, FREE_LIMIT - usage.summariesUsed);
};

// Get remaining audios
export const getRemainingAudios = (usage: UsageData): number => {
  return Math.max(0, FREE_LIMIT - usage.audiosUsed);
};
