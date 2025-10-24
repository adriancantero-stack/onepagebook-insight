import { supabase } from "@/integrations/supabase/client";

// Get or create session ID for anonymous tracking
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
};

export type AnalyticsEvent = 
  | 'page_visit'
  | 'home_explore_click'
  | 'home_generate_click'
  | 'explore_people_click'
  | 'explore_category_click'
  | 'explore_search_click'
  | 'audio_generated';

export interface AnalyticsEventData {
  page?: string;
  [key: string]: any;
}

export const trackEvent = async (
  eventType: AnalyticsEvent,
  eventData?: AnalyticsEventData
) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const sessionId = getSessionId();

    await supabase.from('user_analytics_events').insert({
      user_id: user?.id || null,
      session_id: sessionId,
      event_type: eventType,
      event_data: eventData || null,
    });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    // Fail silently - don't disrupt user experience
  }
};
