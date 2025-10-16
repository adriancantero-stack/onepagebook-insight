import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const SESSION_KEY = 'ab_test_session';
const VARIANT_KEY = 'ab_test_variant';

export const useABTest = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [variant, setVariant] = useState<'A' | 'B' | null>(null);

  useEffect(() => {
    const initSession = async () => {
      // Check if session exists
      let storedSessionId = localStorage.getItem(SESSION_KEY);
      let storedVariant = localStorage.getItem(VARIANT_KEY) as 'A' | 'B' | null;

      if (storedSessionId && storedVariant) {
        setSessionId(storedSessionId);
        setVariant(storedVariant);
        return;
      }

      // Create new session
      const newSessionId = crypto.randomUUID();
      
      // Derive variant and language from URL
      const pathSegment = window.location.pathname.split('/')[1] || 'pt';
      
      // Normalize language: remove "2" suffix (pt2 -> pt, en2 -> en, etc.)
      const normalizedLanguage = pathSegment.replace(/2$/, '');
      
      // Derive variant: if path ends with "2", it's variant B, otherwise A
      storedVariant = pathSegment.endsWith('2') ? 'B' : 'A';

      // Store session
      localStorage.setItem(SESSION_KEY, newSessionId);
      localStorage.setItem(VARIANT_KEY, storedVariant);

      setSessionId(newSessionId);
      setVariant(storedVariant);

      // Record session in database with normalized language
      await supabase.from('ab_test_sessions').insert({
        session_id: newSessionId,
        variant: storedVariant,
        language: normalizedLanguage,
        user_agent: navigator.userAgent,
        referrer: document.referrer
      });
    };

    initSession();
  }, []);

  const trackConversion = async (conversionType: 'cta_click' | 'signup' | 'premium_click') => {
    if (!sessionId || !variant) return;

    // Normalize language from URL (remove "2" suffix)
    const pathSegment = window.location.pathname.split('/')[1] || 'pt';
    const normalizedLanguage = pathSegment.replace(/2$/, '');

    await supabase.from('ab_test_conversions').insert({
      session_id: sessionId,
      variant,
      language: normalizedLanguage,
      conversion_type: conversionType
    });
  };

  return { variant, sessionId, trackConversion };
};
