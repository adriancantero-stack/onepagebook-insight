import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FloatingHeader } from '@/components/FloatingHeader';
import { AchievementCard } from '@/components/AchievementCard';
import { Button } from '@/components/ui/button';
import { Loader2, Trophy, Lock, CheckCircle2, Share2 } from 'lucide-react';
import { useAchievements } from '@/hooks/useAchievements';
import { toast } from '@/hooks/use-toast';

export default function Achievements() {
  const { t } = useTranslation();
  const { getAchievementsWithStatus, isLoading } = useAchievements();
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  const achievementsWithStatus = getAchievementsWithStatus();
  
  const filteredAchievements = achievementsWithStatus.filter(achievement => {
    if (filter === 'unlocked') return achievement.unlocked;
    if (filter === 'locked') return !achievement.unlocked;
    return true;
  });

  const unlockedCount = achievementsWithStatus.filter(a => a.unlocked).length;
  const totalCount = achievementsWithStatus.length;
  const progress = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  const shareAchievements = async () => {
    const text = `${t('achievements.shareText', { count: unlockedCount })}\n\n🚀 ${window.location.origin}`;

    if (navigator.share) {
      try {
        await navigator.share({
          text,
          url: window.location.origin
        });
      } catch (error) {
        // User cancelled or error
        copyToClipboard(text);
      }
    } else {
      copyToClipboard(text);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: t('achievements.shared'),
      description: t('ranking.sharedDesc')
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <FloatingHeader />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-br from-premium-gold to-yellow-400 rounded-full mb-4 shadow-lg">
            <Trophy className="h-12 w-12 text-gray-900" />
          </div>
          
          <h1 className="text-4xl font-bold font-poppins text-foreground mb-2">
            {t('achievements.title')}
          </h1>
          <p className="text-muted-foreground mb-4">
            {t('achievements.subtitle')}
          </p>

          {/* Progress */}
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                {t('achievements.progress', { unlocked: unlockedCount, total: totalCount })}
              </span>
              <span className="text-sm font-medium text-primary">
                {progress}%
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Share Button */}
          {unlockedCount > 0 && (
            <Button
              onClick={shareAchievements}
              variant="outline"
              size="sm"
              className="mt-4 gap-2"
            >
              <Share2 className="h-4 w-4" />
              {t('achievements.share')}
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'bg-primary hover:bg-primary/90' : 'border-border'}
          >
            {t('achievements.all')} ({totalCount})
          </Button>
          <Button
            variant={filter === 'unlocked' ? 'default' : 'outline'}
            onClick={() => setFilter('unlocked')}
            className={filter === 'unlocked' ? 'bg-success hover:bg-success/90' : 'border-success'}
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            {t('achievements.unlocked')} ({unlockedCount})
          </Button>
          <Button
            variant={filter === 'locked' ? 'default' : 'outline'}
            onClick={() => setFilter('locked')}
            className={filter === 'locked' ? 'bg-gray-400 hover:bg-gray-500' : 'border-gray-300'}
          >
            <Lock className="h-4 w-4 mr-2" />
            {t('achievements.locked')} ({totalCount - unlockedCount})
          </Button>
        </div>

        {/* Achievements Grid */}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredAchievements.length === 0 ? (
          <div className="text-center py-16">
            <Lock className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-muted-foreground">
              {t('achievements.noAchievements')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {filteredAchievements.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                name={achievement.name}
                description={achievement.description}
                icon={achievement.icon}
                xp_reward={achievement.xp_reward}
                unlocked={achievement.unlocked}
                unlocked_at={achievement.unlocked_at}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
