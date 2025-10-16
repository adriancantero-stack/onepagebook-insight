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
      
      // Get config to check if test is active
      const { data: config } = await supabase
        .from('ab_test_config')
        .select('is_active, split_percentage')
        .single();

      // If test is not active, default to variant A
      if (!config?.is_active) {
        storedVariant = 'A';
      } else {
        // Random split based on config percentage
        const random = Math.random() * 100;
        storedVariant = random < (config.split_percentage || 50) ? 'A' : 'B';
      }

      // Store session
      localStorage.setItem(SESSION_KEY, newSessionId);
      localStorage.setItem(VARIANT_KEY, storedVariant);

      setSessionId(newSessionId);
      setVariant(storedVariant);

      // Record session in database
      const language = window.location.pathname.split('/')[1] || 'pt';
      
      await supabase.from('ab_test_sessions').insert({
        session_id: newSessionId,
        variant: storedVariant,
        language: language,
        user_agent: navigator.userAgent,
        referrer: document.referrer
      });
    };

    initSession();
  }, []);

  const trackConversion = async (conversionType: 'cta_click' | 'signup' | 'premium_click') => {
    if (!sessionId || !variant) return;

    const language = window.location.pathname.split('/')[1] || 'pt';

    await supabase.from('ab_test_conversions').insert({
      session_id: sessionId,
      variant,
      language,
      conversion_type: conversionType
    });
  };

  return { variant, sessionId, trackConversion };
};
