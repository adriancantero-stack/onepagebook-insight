/**
 * Generation step identifiers
 */
export type GenStep = "resolve" | "summarize" | "polish" | "audio" | "done" | "error";

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
 * Book summary record from database (matches Supabase schema)
 */
export interface BookSummary {
  id: string;
  user_id: string;
  book_title: string;
  book_author: string;
  canonical_title?: string;
  canonical_author?: string;
  year?: number;
  summary_text?: string;
  key_ideas?: string[];
  main_ideas?: string[];
  actions?: string[];
  practical_applications?: string[];
  routine?: string;
  plan_7_days?: string;
  metrics?: string[];
  pitfalls?: string[];
  audio_base64?: string;
  audio_chunks?: string[];
  created_at: string;
  language?: string;
  theme?: string;
  user_title?: string;
}

/**
 * User subscription from database (matches Supabase schema)
 */
export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  created_at: string;
  subscription_plans?: {
    id: string;
    name: string;
    type: "free" | "premium";
    price: number;
    summaries_per_month: number;
    created_at: string;
  };
}

/**
 * Monthly usage tracking
 */
export interface UsageData {
  monthKey: string;
  summariesUsed: number;
  audiosUsed: number;
}
