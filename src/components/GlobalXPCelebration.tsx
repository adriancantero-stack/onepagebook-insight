import { useEffect } from 'react';
import { XPCelebration } from './XPCelebration';
import { useAchievementStore } from '@/hooks/useXP';

export const GlobalXPCelebration = () => {
  const { xpCelebration, setXPCelebration, processQueue } = useAchievementStore();

  useEffect(() => {
    if (xpCelebration?.show) {
      // Auto-clear after animation completes and process next item
      const timer = setTimeout(() => {
        setXPCelebration(null);
        processQueue();
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [xpCelebration, setXPCelebration, processQueue]);

  if (!xpCelebration) return null;

  return (
    <XPCelebration
      show={xpCelebration.show}
      xpAmount={xpCelebration.xpAmount}
      message={xpCelebration.message}
      onComplete={() => setXPCelebration(null)}
    />
  );
};
