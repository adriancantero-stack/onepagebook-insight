import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Achievement {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  xp_reward: number;
  requirement_type: string;
  requirement_value: number;
  unlocked_at?: string;
}

export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Fetch all available achievements
   */
  const fetchAchievements = async () => {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('requirement_value', { ascending: true });

      if (error) throw error;
      setAchievements(data || []);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  };

  /**
   * Fetch user's unlocked achievements
   */
  const fetchUserAchievements = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_achievements')
        .select(`
          id,
          unlocked_at,
          achievement_id,
          achievements (
            id,
            name,
            description,
            icon,
            xp_reward,
            requirement_type,
            requirement_value
          )
        `)
        .eq('user_id', user.id)
        .order('unlocked_at', { ascending: false });

      if (error) throw error;

      // Format data
      const formatted = data?.map((item: any) => ({
        ...item.achievements,
        unlocked_at: item.unlocked_at
      })) || [];

      setUserAchievements(formatted);
    } catch (error) {
      console.error('Error fetching user achievements:', error);
    }
  };

  /**
   * Check for new achievements
   */
  const checkNewAchievements = async (): Promise<void> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase.rpc('check_achievements', {
        p_user_id: user.id
      });

      if (error) {
        console.error('Error checking achievements:', error);
        return;
      }

      // Show toast for each new achievement
      if (data && data.length > 0) {
        data.forEach((achievement: any) => {
          toast({
            title: `🏆 Nova Conquista!`,
            description: `${achievement.achievement_name} (+${achievement.xp_reward} XP)`,
            className: 'bg-gradient-to-r from-premium-gold to-yellow-400 text-gray-900 border-0'
          });
        });

        // Refresh user achievements
        await fetchUserAchievements();
      }
    } catch (error) {
      console.error('Error in checkNewAchievements:', error);
    }
  };

  /**
   * Get achievements with unlock status
   */
  const getAchievementsWithStatus = (): (Achievement & { unlocked: boolean })[] => {
    return achievements.map(achievement => ({
      ...achievement,
      unlocked: userAchievements.some(ua => ua.id === achievement.id)
    }));
  };

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchAchievements(),
        fetchUserAchievements()
      ]);
      setIsLoading(false);
    };

    loadData();
  }, []);

  return {
    achievements,
    userAchievements,
    isLoading,
    checkNewAchievements,
    getAchievementsWithStatus,
    refreshAchievements: fetchUserAchievements
  };
}
