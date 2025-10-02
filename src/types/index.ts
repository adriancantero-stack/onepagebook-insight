/**
 * Generation step identifiers
 */
export type GenStep = "resolve" | "summarize" | "polish" | "audio" | "done";

/**
 * Current state of summary generation process
 */
export interface GenState {
  step: GenStep;
  progress: number;
}

/**
 * Authenticated user profile
 */
export interface AuthUser {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
  };
}

/**
 * Book summary record from database
 */
export interface BookSummary {
  id: string;
  user_id: string;
  book_title: string;
  author: string;
  one_liner?: string;
  key_concepts?: string[];
  key_ideas?: string[];
  recommended_for?: string;
  synopsis?: string;
  plot?: string;
  themes?: string[];
  characters?: string[];
  quotes?: string[];
  critical_reception?: string;
  historical_context?: string;
  writing_style?: string;
  cultural_impact?: string;
  bibliography?: string[];
  audio_base64?: string;
  audio_chunks?: string[];
  created_at: string;
  language?: string;
  theme?: string;
}

/**
 * Subscription plan type
 */
export type SubscriptionPlan = "free" | "premium";

/**
 * User subscription information
 */
export interface UserSubscription {
  plan: SubscriptionPlan;
  isActive: boolean;
}

/**
 * Monthly usage tracking
 */
export interface UsageData {
  monthKey: string;
  summariesUsed: number;
  audiosUsed: number;
}
