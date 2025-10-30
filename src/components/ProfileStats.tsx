import { Card, CardContent } from '@/components/ui/card';
import { Book, Flame, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ProfileStatsProps {
  totalBooksRead: number;
  totalSummariesGenerated: number;
  streakDays: number;
  memberSince: string;
}

export const ProfileStats = ({ totalBooksRead, totalSummariesGenerated, streakDays, memberSince }: ProfileStatsProps) => {
  const { t } = useTranslation();
  
  // Calculate days since member
  const daysSinceMember = Math.floor(
    (new Date().getTime() - new Date(memberSince).getTime()) / (1000 * 60 * 60 * 24)
  );

  const stats = [
    {
      icon: Book,
      label: t('profile.summariesGenerated'),
      value: totalSummariesGenerated,
      color: 'from-primary to-purple-500',
      bgColor: 'bg-primary/10'
    },
    {
      icon: Book,
      label: t('profile.booksRead'),
      value: totalBooksRead,
      color: 'from-primary to-purple-400',
      bgColor: 'bg-primary/10'
    },
    {
      icon: Flame,
      label: t('profile.currentStreak'),
      value: streakDays,
      color: 'from-orange-400 to-red-500',
      bgColor: 'bg-orange-500/10'
    },
    {
      icon: Clock,
      label: t('profile.memberSince'),
      value: daysSinceMember,
      color: 'from-blue-400 to-purple-500',
      bgColor: 'bg-blue-500/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="bg-card/70 backdrop-blur-md border-border hover:shadow-lg transition-all duration-300 hover:scale-105"
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              {/* Icon */}
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} />
              </div>

              {/* Value and Label */}
              <div className="flex-1">
                <p className={`text-2xl font-bold font-poppins bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
