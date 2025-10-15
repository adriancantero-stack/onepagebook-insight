import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AchievementAnimationProps {
  show: boolean;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  onComplete?: () => void;
}

export const AchievementAnimation = ({
  show,
  title,
  description,
  icon,
  xpReward,
  onComplete
}: AchievementAnimationProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      
      // Play level up sound
      const audio = new Audio('/sounds/level-up.wav');
      audio.volume = 0.5;
      audio.play().catch(err => console.log('Audio play failed:', err));
      
      // Trigger confetti
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        const particleCount = 50 * (timeLeft / duration);
        
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);

      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onComplete) {
          onComplete();
        }
      }, 5000);

      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={() => {
            setIsVisible(false);
            if (onComplete) onComplete();
          }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ 
              scale: 1, 
              rotate: 0,
              transition: {
                type: "spring",
                stiffness: 200,
                damping: 15
              }
            }}
            exit={{ scale: 0, rotate: 180 }}
            className="relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-premium-gold via-yellow-400 to-premium-gold blur-3xl opacity-50 animate-pulse" />
            
            {/* Main card */}
            <div className="relative bg-gradient-to-br from-premium-gold via-yellow-400 to-premium-gold p-1 rounded-3xl shadow-2xl"
          >
            <div className="bg-background rounded-3xl p-12 text-center space-y-6 relative overflow-hidden">
              {/* Sparkles Background */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 opacity-10"
              >
                <Sparkles className="absolute top-4 left-4 h-8 w-8 text-premium-gold" />
                <Sparkles className="absolute top-8 right-8 h-6 w-6 text-yellow-400" />
                <Sparkles className="absolute bottom-8 left-8 h-6 w-6 text-yellow-400" />
                <Sparkles className="absolute bottom-4 right-4 h-8 w-8 text-premium-gold" />
              </motion.div>

                {/* Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ 
                    scale: [0, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ 
                    delay: 0.2,
                    duration: 0.5,
                    times: [0, 0.6, 0.8, 1]
                  }}
                  className="text-8xl"
                >
                  {icon || '🏆'}
                </motion.div>

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl font-bold bg-gradient-to-r from-premium-gold via-yellow-400 to-premium-gold bg-clip-text text-transparent"
                >
                  {title}
                </motion.h2>

                {/* Stars */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex justify-center gap-2 text-5xl"
                >
                  {[...Array(3)].map((_, i) => (
                    <motion.span
                      key={i}
                      animate={{
                        scale: [1, 1.3, 1],
                        rotate: [0, 360]
                      }}
                      transition={{
                        delay: 0.5 + (i * 0.1),
                        duration: 0.6,
                        repeat: Infinity,
                        repeatDelay: 2
                      }}
                    >
                      ⭐
                    </motion.span>
                  ))}
                </motion.div>
                
                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-xl text-muted-foreground max-w-md"
                >
                  {description}
                </motion.p>

                {/* XP Reward */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: 1, 
                    scale: [0, 1.2, 1]
                  }}
                  transition={{ delay: 0.6, type: 'spring' }}
                  className="text-6xl font-black bg-gradient-to-r from-premium-gold via-yellow-400 to-premium-gold bg-clip-text text-transparent"
                >
                  +{xpReward} XP
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
