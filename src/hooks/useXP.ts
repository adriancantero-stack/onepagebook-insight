import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { calculateLevel } from '@/utils/xpCalculator';

interface XPResult {
  new_xp: number;
  new_level: string;
  leveled_up: boolean;
}

export function useXP() {
  const [isLoading, setIsLoading] = useState(false);

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
          title: 'Erro ao adicionar XP',
          description: 'Tente novamente mais tarde',
          variant: 'destructive'
        });
        return null;
      }

      const result = data[0] as XPResult;

      // Show appropriate toast
      if (result.leveled_up) {
        const levelInfo = calculateLevel(result.new_xp);
        toast({
          title: `🎉 Level Up! ${levelInfo.icon}`,
          description: `Você alcançou o nível ${result.new_level}!`,
          className: 'bg-gradient-to-r from-lilac-500 to-purple-500 text-white border-0'
        });
      } else {
        toast({
          title: `+${xpAmount} XP`,
          description: eventType === 'read_summary' ? '📚 Resumo completado!' : '🎧 Áudio gerado!',
          className: 'bg-lilac-50 border-lilac-200'
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
