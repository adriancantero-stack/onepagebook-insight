import { Card, CardContent } from '@/components/ui/card';
import { Book, Flame, Clock } from 'lucide-react';

interface ProfileStatsProps {
  totalBooksRead: number;
  streakDays: number;
  memberSince: string;
}

export const ProfileStats = ({ totalBooksRead, streakDays, memberSince }: ProfileStatsProps) => {
  // Calculate days since member
  const daysSinceMember = Math.floor(
    (new Date().getTime() - new Date(memberSince).getTime()) / (1000 * 60 * 60 * 24)
  );

  const stats = [
    {
      icon: Book,
      label: 'Livros Lidos',
      value: totalBooksRead,
      color: 'from-lilac-400 to-lilac-500',
      bgColor: 'bg-lilac-50'
    },
    {
      icon: Flame,
      label: 'Dias Seguidos',
      value: streakDays,
      color: 'from-orange-400 to-red-500',
      bgColor: 'bg-orange-50'
    },
    {
      icon: Clock,
      label: 'Dias Membro',
      value: daysSinceMember,
      color: 'from-blue-400 to-purple-500',
      bgColor: 'bg-blue-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="bg-white/70 backdrop-blur-md border-lilac-100 hover:shadow-lg transition-all duration-300 hover:scale-105"
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
