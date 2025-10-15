import { useEffect } from 'react';
import { XPCelebration } from './XPCelebration';
import { useAchievementStore } from '@/hooks/useXP';

export const GlobalXPCelebration = () => {
  const { xpCelebration, setXPCelebration } = useAchievementStore();

  useEffect(() => {
    if (xpCelebration?.show) {
      // Auto-clear after animation completes
      const timer = setTimeout(() => {
        setXPCelebration(null);
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [xpCelebration, setXPCelebration]);

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
