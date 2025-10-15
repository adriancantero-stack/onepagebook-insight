import { useEffect } from 'react';
import { AchievementAnimation } from './AchievementAnimation';
import { useAchievementStore } from '@/hooks/useXP';

export const GlobalAchievementNotification = () => {
  const { notification, setNotification, processQueue } = useAchievementStore();

  useEffect(() => {
    if (notification?.show) {
      // Auto-clear after animation completes and process next item
      const timer = setTimeout(() => {
        setNotification(null);
        processQueue();
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, [notification, setNotification, processQueue]);

  if (!notification) return null;

  return (
    <AchievementAnimation
      show={notification.show}
      title={notification.title}
      description={notification.description}
      icon={notification.icon}
      xpReward={notification.xpReward}
      onComplete={() => setNotification(null)}
    />
  );
};
