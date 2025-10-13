import { useTranslation } from 'react-i18next';
import { calculateLevel } from '@/utils/xpCalculator';

interface LevelBadgeProps {
  level: string;
  xp: number;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const LevelBadge = ({ level, xp, size = 'md', showIcon = true }: LevelBadgeProps) => {
  const { t } = useTranslation();
  const levelInfo = calculateLevel(xp);
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  const iconSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div
      className={`
        inline-flex items-center gap-1.5 rounded-full font-poppins font-semibold
        bg-gradient-to-r ${levelInfo.gradient} text-white
        shadow-lg shadow-lilac-200/50
        ${sizeClasses[size]}
        transition-all duration-300 hover:scale-105
      `}
    >
      {showIcon && <span className={iconSizes[size]}>{levelInfo.icon}</span>}
      <span>{t(`levels.${level}`)}</span>
    </div>
  );
};
