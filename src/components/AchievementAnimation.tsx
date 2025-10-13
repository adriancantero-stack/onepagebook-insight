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
      
      // Play achievement sound
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUKzn77dnHQU7k9nyz3krBSl+zPLaizsKGGS56+mjUhELTKXh8bllHAU2jdXzx3YpBSh+0fHajzsKHGe88OWYUxELTKjj8rpnHwU7k9rzzXgrBSp/0fHbizsKHWi98OScUhEMTKrk8btoHwU8lNvzzXkrBSp/0vHbizsKH2q+7+OXUBEMTazl8LlnHwU9ltzzz3orBSuA0/HcjDsKIGy/7+OWTxEMTa/m77dnHwU+l970z3srBSuB1PHcjT0KImzA7+KUTBEMTrDm77dmHwU/mN/00H0tBSyC1fDcjT0KJG7C7+GSTBENTrHm7rVmHwVAmd/00H0tBSyC1vDdjj0KJXDC7+CRSxENT7Lm7rVmIAVBm+H00H0tBS2D1/DdjT0KJXHD7t+PSxEOULPm7bRlIAVCnOH00H0tBS2E1/DdjT0KJnHE7t6PSxEOULTm7LNkIAVDnOL00X4uBS2E2PDejj0KJ3LE7t6OSxEOUbXm67NkIQVDnuL00X4uBS6E2fDejj0KKHLF7t2OSxEOUrXm67JjIQVEn+L00X4uBS6F2fDejj4KKXLG7tyNShEOUrbl6rJjIgVEoOL00n4vBS6F2vDfjj4KKnPG7duNShEPU7jl6bFjIgVFoeP00n4vBS+G2vDfjj4KK3PH7duMShEPVLjk6LBiIgVGoOP00n4vBTCG2/DfjT4KLHbI7NqKSREPVbnk5q5hIgVHouP00n4vBTCH3PDfjT8KLXXK69eISREQV7rj5K1gIQVIpOT00n8wBTCH3fDfjT8KLnbL69eHSBEQWLvj46xfIQVJpeT01H8wBTGI3fDgjT8KL3fM6tWGRxERWbzj4apdIQVKpuX01H8wBTGJ3vDgjUAKMHnN6dSEBhERWr3j4KpcIgVLp+X01IAxBTKK3/Dgj0ALMXrO6NK9AxETW8Hj3qhbIgVMqOb01YAyBTKL4PDhkUALM3vP583xwEFGtM6H2qZZIQVNqef01oAzBTOL4fDhkUALNHzQ55fLZFBg03pOJjZqv92oWh8FTazo1YA0BTOM4vDhkkELNn3R5o2/Vh5V2qlsJjpr0OGlXCEGT63o1oE1BTSO4/DhkkILN37S5Y2+Uh5V3KtsJzprzuCjXSIGUK7p1oE2BTSP5PDhkkILOIDT5oy9UR5W3qxsKDps0N+iXiIGUbDp14I3BTSP5fDhkkQLOoHU5ou8UB5X4KxsKDpu0t+hXiMGU7Dp2II4BTUP5vDhk0QLO4LV5oq8Tx5Y4qxsKTpu1d6gXyMGVbHp2II5BTWQ5/Dik0ULPIPWy4e5TR5Z5KxsKjtv1t6fYCQGVrHp2II6BTWR6PDik0ULPIPXy4e5Sx5a5KxsKztw1t2eYCQGV7Lq2YI7BTWS6fDik0YLPYTYy4a4Sh5b5axsLD1x2NudYSUGWLLq2oI8BTWT6vDikkcLPoXZyoW4SR5c5qxsLT1y2dueYSUGWbPq24M9BTWS6/DjlEcLPoXay4S3SR5d56xsLj1z2tufYiYGWrPr24M+BTWT7PDjlEgLQIbbz4G3SR5e6KxsLz1029ygYyYGW7Tr3IQ/BTWS7fDjlUgLQYfcy4C2SR5f6axsMD522tyhYycGXLTs3YRABTaS7vDklUkLQojdy321SR5g66xsMT532tyjZCcGXbXs3oRBBTaS7/DklUoLQ4neyoC1SB5h66xsA0B6');
      audio.volume = 0.5;
      audio.play().catch(() => {
        // Ignore audio errors
      });
      
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
          initial={{ opacity: 0, scale: 0.5, y: 100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: -100 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
        >
          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: [0, -5, 5, -5, 0] }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gradient-to-br from-premium-gold via-yellow-400 to-premium-gold p-1 rounded-2xl shadow-2xl pointer-events-auto"
          >
            <div className="bg-card p-8 rounded-xl text-center space-y-4 relative overflow-hidden">
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
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative"
              >
                <div className="inline-block p-6 bg-gradient-to-br from-premium-gold to-yellow-400 rounded-full shadow-lg">
                  <div className="text-6xl">
                    {icon || <Trophy className="h-16 w-16 text-gray-900" />}
                  </div>
                </div>
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-3xl font-bold bg-gradient-to-r from-premium-gold to-yellow-600 bg-clip-text text-transparent"
              >
                {title}
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-muted-foreground text-lg"
              >
                {description}
              </motion.p>

              {/* XP Reward */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, type: 'spring' }}
                className="inline-block px-6 py-3 bg-gradient-to-r from-primary to-accent rounded-full shadow-lg"
              >
                <span className="text-white font-bold text-xl">
                  +{xpReward} XP
                </span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
