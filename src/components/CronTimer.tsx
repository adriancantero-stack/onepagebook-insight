import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface CronTimerProps {
  nextRunAt: string;
  jobName: string;
}

export const CronTimer = ({ nextRunAt, jobName }: CronTimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const nextRun = new Date(nextRunAt);
      const diff = nextRun.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining('Em breve...');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (days > 0) {
        setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
      } else if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
      } else if (minutes > 0) {
        setTimeRemaining(`${minutes}m ${seconds}s`);
      } else {
        setTimeRemaining(`${seconds}s`);
      }
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [nextRunAt]);

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
      <Clock className="h-3 w-3" />
      <span>Próxima execução automática em: {timeRemaining}</span>
    </div>
  );
};