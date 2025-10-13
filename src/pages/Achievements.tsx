import { useState } from 'react';
import { FloatingHeader } from '@/components/FloatingHeader';
import { AchievementCard } from '@/components/AchievementCard';
import { Button } from '@/components/ui/button';
import { Loader2, Trophy, Lock, CheckCircle2 } from 'lucide-react';
import { useAchievements } from '@/hooks/useAchievements';

export default function Achievements() {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-lilac-50 via-white to-lilac-50">
      <FloatingHeader />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-br from-premium-gold to-yellow-400 rounded-full mb-4 shadow-lg">
            <Trophy className="h-12 w-12 text-gray-900" />
          </div>
          
          <h1 className="text-4xl font-bold font-poppins text-foreground mb-2">
            Conquistas
          </h1>
          <p className="text-muted-foreground mb-4">
            Continue lendo para desbloquear mais conquistas
          </p>

          {/* Progress */}
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                {unlockedCount} de {totalCount} desbloqueadas
              </span>
              <span className="text-sm font-medium text-lilac-600">
                {progress}%
              </span>
            </div>
            <div className="h-2 bg-lilac-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-lilac-500 to-purple-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex justify-center gap-2 mb-8">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'bg-lilac-500 hover:bg-lilac-600' : 'border-lilac-200'}
          >
            Todas ({totalCount})
          </Button>
          <Button
            variant={filter === 'unlocked' ? 'default' : 'outline'}
            onClick={() => setFilter('unlocked')}
            className={filter === 'unlocked' ? 'bg-success hover:bg-success/90' : 'border-success'}
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Desbloqueadas ({unlockedCount})
          </Button>
          <Button
            variant={filter === 'locked' ? 'default' : 'outline'}
            onClick={() => setFilter('locked')}
            className={filter === 'locked' ? 'bg-gray-400 hover:bg-gray-500' : 'border-gray-300'}
          >
            <Lock className="h-4 w-4 mr-2" />
            Bloqueadas ({totalCount - unlockedCount})
          </Button>
        </div>

        {/* Achievements Grid */}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-lilac-500" />
          </div>
        ) : filteredAchievements.length === 0 ? (
          <div className="text-center py-16">
            <Lock className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p className="text-muted-foreground">
              Nenhuma conquista {filter === 'unlocked' ? 'desbloqueada' : 'nesta categoria'}
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
