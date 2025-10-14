import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Share2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from '@/hooks/use-toast';

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
  const { t } = useTranslation();

  const handleShare = async () => {
    const text = `🎉 ${t('achievements.unlocked')}: ${name}!\n${description || ''}\n\n+${xp_reward} XP 🏆`;
    const url = window.location.origin;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${t('achievements.achievement')}: ${name}`,
          text: text,
          url: url
        });
      } catch (error) {
        // User cancelled or error - fallback to clipboard
        copyToClipboard(text, url);
      }
    } else {
      copyToClipboard(text, url);
    }
  };

  const copyToClipboard = (text: string, url: string) => {
    navigator.clipboard.writeText(`${text}\n\n${url}`);
    toast({
      title: t('achievements.shared'),
      description: t('achievements.copiedToClipboard')
    });
  };

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
            <div className="flex items-start justify-between gap-2">
              <h3 className={`font-poppins font-semibold ${unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                {name}
              </h3>
              {unlocked && (
                <Button
                  onClick={handleShare}
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 shrink-0 hover:bg-lilac-100 hover:text-lilac-600 transition-colors"
                  title={t('achievements.shareOnSocial')}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              )}
            </div>
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
