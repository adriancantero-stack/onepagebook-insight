import { calculateLevel, getXPForNextLevel, getXPProgress, formatXP } from '@/utils/xpCalculator';
import { useTranslation } from 'react-i18next';

interface XPBarProps {
  currentXP: number;
  level: string;
  showDetails?: boolean;
}

export const XPBar = ({ currentXP, level, showDetails = true }: XPBarProps) => {
  const { t } = useTranslation();
  const levelInfo = calculateLevel(currentXP);
  const nextLevelXP = getXPForNextLevel(currentXP);
  const progress = getXPProgress(currentXP);
  const isMaxLevel = levelInfo.name === 'Enlightened';

  return (
    <div className="w-full space-y-2">
      {/* Level Badge and XP Info */}
      {showDetails && (
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="text-xl sm:text-2xl flex-shrink-0">{levelInfo.icon}</span>
            <div className="min-w-0 flex-1">
              <p className={`font-poppins font-semibold text-sm sm:text-base ${levelInfo.color} truncate`}>
                {level}
              </p>
              <p className="text-xs text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis">
                {isMaxLevel ? t('profile.maxLevel') : `${formatXP(currentXP)} / ${formatXP(nextLevelXP)} XP`}
              </p>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-sm font-medium text-foreground whitespace-nowrap">{formatXP(currentXP)} XP</p>
            <p className="text-xs text-muted-foreground whitespace-nowrap">
              {isMaxLevel ? '✨ ' + t('levels.Enlightened') : `${progress}%`}
            </p>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-lilac-100">
        <div
          className={`h-full bg-gradient-to-r ${levelInfo.gradient} transition-all duration-500 ease-out relative overflow-hidden`}
          style={{ width: `${progress}%` }}
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine" />
        </div>
        
        {/* Glow effect on full */}
        {progress === 100 && !isMaxLevel && (
          <div className="absolute inset-0 bg-gradient-to-r from-lilac-400/50 to-purple-500/50 animate-pulse-soft" />
        )}
      </div>

      {/* Next milestone */}
      {!isMaxLevel && showDetails && (
        <p className="text-xs text-center text-muted-foreground">
          {t('profile.needXP', { xp: formatXP(nextLevelXP - currentXP) })} <span className="font-medium text-purple-500">
            {t(`levels.${calculateLevel(nextLevelXP).name}`)}
          </span>
        </p>
      )}
    </div>
  );
};
