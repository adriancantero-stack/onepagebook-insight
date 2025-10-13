import { Card, CardContent } from '@/components/ui/card';
import { Lock } from 'lucide-react';

export interface AchievementCardProps {
  name: string;
  description: string | null;
  icon: string | null;
  xp_reward: number;
  unlocked: boolean;
  unlocked_at?: string;
}

export const AchievementCard = ({
  name,
  description,
  icon,
  xp_reward,
  unlocked,
  unlocked_at
}: AchievementCardProps) => {
  return (
    <Card
      className={`
        relative overflow-hidden transition-all duration-300 hover:scale-[1.02]
        ${unlocked
          ? 'bg-white/70 backdrop-blur-md border-lilac-200 shadow-lg shadow-lilac-100/50'
          : 'bg-gray-50/50 backdrop-blur-sm border-gray-200 opacity-60'
        }
      `}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div
            className={`
              flex h-12 w-12 items-center justify-center rounded-full text-2xl
              ${unlocked
                ? 'bg-gradient-to-br from-lilac-400 to-purple-500 shadow-md'
                : 'bg-gray-200'
              }
            `}
          >
            {unlocked ? (
              icon || '🏆'
            ) : (
              <Lock className="h-5 w-5 text-gray-400" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 space-y-1">
            <h3 className={`font-poppins font-semibold ${unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
              {name}
            </h3>
            {description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {description}
              </p>
            )}
            <div className="flex items-center gap-2 pt-1">
              <span className={`text-xs font-medium ${unlocked ? 'text-lilac-600' : 'text-gray-400'}`}>
                +{xp_reward} XP
              </span>
              {unlocked && unlocked_at && (
                <span className="text-xs text-muted-foreground">
                  • {new Date(unlocked_at).toLocaleDateString('pt-BR')}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Shine effect for unlocked */}
        {unlocked && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        )}
      </CardContent>
    </Card>
  );
};
