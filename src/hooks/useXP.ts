import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { calculateLevel } from '@/utils/xpCalculator';
import { create } from 'zustand';

interface XPResult {
  new_xp: number;
  new_level: string;
  leveled_up: boolean;
}

interface AchievementNotification {
  show: boolean;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
}

interface XPCelebration {
  show: boolean;
  xpAmount: number;
  message: string;
}

interface AchievementStore {
  notification: AchievementNotification | null;
  setNotification: (notification: AchievementNotification | null) => void;
  xpCelebration: XPCelebration | null;
  setXPCelebration: (celebration: XPCelebration | null) => void;
  celebrationQueue: Array<{ type: 'achievement' | 'xp', data: AchievementNotification | XPCelebration }>;
  addToQueue: (item: { type: 'achievement' | 'xp', data: AchievementNotification | XPCelebration }) => void;
  processQueue: () => void;
}

export const useAchievementStore = create<AchievementStore>((set, get) => ({
  notification: null,
  setNotification: (notification) => set({ notification }),
  xpCelebration: null,
  setXPCelebration: (xpCelebration) => set({ xpCelebration }),
  celebrationQueue: [],
  addToQueue: (item) => {
    set((state) => ({ celebrationQueue: [...state.celebrationQueue, item] }));
    // Se não há nada sendo exibido, processa a fila
    if (!get().notification && !get().xpCelebration) {
      get().processQueue();
    }
  },
  processQueue: () => {
    const { celebrationQueue } = get();
    if (celebrationQueue.length === 0) return;
    
    const [nextItem, ...rest] = celebrationQueue;
    set({ celebrationQueue: rest });
    
    if (nextItem.type === 'achievement') {
      set({ notification: nextItem.data as AchievementNotification });
    } else {
      set({ xpCelebration: nextItem.data as XPCelebration });
    }
  },
}));

export function useXP() {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const addToQueue = useAchievementStore((state) => state.addToQueue);

  /**
   * Add XP to user and check for level-up
   */
  const addXP = async (eventType: string, xpAmount: number): Promise<XPResult | null> => {
    try {
      setIsLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('No user logged in');
        return null;
      }

      // Call database function to add XP
      const { data, error } = await supabase.rpc('add_xp', {
        p_user_id: user.id,
        p_event_type: eventType,
        p_xp: xpAmount
      });

      if (error) {
        console.error('Error adding XP:', error);
        toast({
          title: t('toast.error'),
          description: t('toast.tryAgain'),
          variant: 'destructive'
        });
        return null;
      }

      const result = data[0] as XPResult;

      // Show appropriate notification
      if (result.leveled_up) {
        const levelInfo = calculateLevel(result.new_xp);
        
        // Add level up animation to queue
        addToQueue({
          type: 'achievement',
          data: {
            show: true,
            title: `Level Up! ${t(`levels.${result.new_level}`)}`,
            description: t('toast.levelUp'),
            icon: levelInfo.icon,
            xpReward: 100
          }
        });
      } else {
        // Show XP celebration in center of screen
        const celebrationMessages: { [key: string]: string } = {
          'read_summary': '📚 ' + t('toast.summaryCompleted'),
          'audio_generated': '🎧 ' + t('toast.audioGenerated'),
          'audio_listened': '🎵 Primeiro áudio escutado!',
          'feedback_given': '⭐ Avaliação enviada',
          'share_summary': '🔗 Resumo compartilhado',
          'summary_generated': '✨ Resumo criado com sucesso!',
          'achievement_unlocked': '🏆 Conquista desbloqueada!'
        };

        addToQueue({
          type: 'xp',
          data: {
            show: true,
            xpAmount,
            message: celebrationMessages[eventType] || `+${xpAmount} XP ganhos!`
          }
        });
      }

      return result;
    } catch (error) {
      console.error('Error in addXP:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Mark a book as read (increments counter and updates streak)
   */
  const markBookAsRead = async (): Promise<void> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.rpc('increment_book_read', {
        p_user_id: user.id
      });

      if (error) {
        console.error('Error marking book as read:', error);
      }
    } catch (error) {
      console.error('Error in markBookAsRead:', error);
    }
  };

  return {
    addXP,
    markBookAsRead,
    isLoading
  };
}
