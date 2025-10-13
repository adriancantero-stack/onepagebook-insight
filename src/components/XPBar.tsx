import { calculateLevel, getXPForNextLevel, getXPProgress, formatXP } from '@/utils/xpCalculator';

interface XPBarProps {
  currentXP: number;
  level: string;
  showDetails?: boolean;
}

export const XPBar = ({ currentXP, level, showDetails = true }: XPBarProps) => {
  const levelInfo = calculateLevel(currentXP);
  const nextLevelXP = getXPForNextLevel(currentXP);
  const progress = getXPProgress(currentXP);
  const isMaxLevel = levelInfo.name === 'Enlightened';

  return (
    <div className="w-full space-y-2">
      {/* Level Badge and XP Info */}
      {showDetails && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{levelInfo.icon}</span>
            <div>
              <p className={`font-poppins font-semibold ${levelInfo.color}`}>
                {level}
              </p>
              <p className="text-xs text-muted-foreground">
                {isMaxLevel ? 'Nível Máximo' : `${formatXP(currentXP)} / ${formatXP(nextLevelXP)} XP`}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">{formatXP(currentXP)} XP</p>
            <p className="text-xs text-muted-foreground">
              {isMaxLevel ? '✨ Iluminado' : `${progress}% para próximo nível`}
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
          Faltam {formatXP(nextLevelXP - currentXP)} XP para <span className="font-medium text-purple-500">
            {calculateLevel(nextLevelXP).name}
          </span>
        </p>
      )}
    </div>
  );
};
