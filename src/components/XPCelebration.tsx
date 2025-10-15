import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface XPCelebrationProps {
  show: boolean;
  xpAmount: number;
  message: string;
  onComplete: () => void;
}

export const XPCelebration = ({ show, xpAmount, message, onComplete }: XPCelebrationProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (show) {
      // Play celebration sound
      playSound();
      
      // Trigger confetti
      triggerConfetti();
      
      // Auto-close after 3 seconds
      const timer = setTimeout(() => {
        onComplete();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  const playSound = () => {
    const audio = new Audio('/sounds/xp-gain.wav');
    audio.volume = 0.5;
    audio.play().catch(err => console.log('Audio play failed:', err));
  };

  const triggerConfetti = () => {
    const count = 200;
    const defaults = {
      origin: { y: 0.5 }
    };

    function fire(particleRatio: number, opts: any) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
        spread: 90,
        startVelocity: 55,
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    fire(0.2, {
      spread: 60,
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={onComplete}
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
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 blur-3xl opacity-50 animate-pulse" />
            
            {/* Main card */}
            <div className="relative bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-1 rounded-3xl">
              <div className="bg-background rounded-3xl p-12 text-center space-y-6">
                {/* XP Amount */}
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
                  className="text-8xl font-black bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent"
                >
                  +{xpAmount}
                </motion.div>
                
                {/* XP Label */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl font-bold text-foreground"
                >
                  XP
                </motion.div>
                
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
                
                {/* Message */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-xl text-muted-foreground max-w-md"
                >
                  {message}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
