import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Sparkles, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

interface TaskCompletionOverlayProps {
  isVisible: boolean;
  taskTitle: string;
  progressPercentage: number;
  onComplete?: () => void;
}

export function TaskCompletionOverlay({ 
  isVisible, 
  taskTitle, 
  progressPercentage,
  onComplete 
}: TaskCompletionOverlayProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    if (isVisible) {
      // Animate progress bar
      const timer = setTimeout(() => {
        setAnimatedProgress(progressPercentage);
      }, 500);

      // Auto close after 4 seconds
      const closeTimer = setTimeout(() => {
        onComplete?.();
      }, 4000);

      return () => {
        clearTimeout(timer);
        clearTimeout(closeTimer);
      };
    } else {
      setAnimatedProgress(0);
    }
  }, [isVisible, progressPercentage, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl"
        >
          {/* Celebration Content */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: 'spring', bounce: 0.4, duration: 0.8 }}
            className="max-w-2xl w-full mx-8 p-12 rounded-3xl bg-gradient-to-br from-[#1C1F26] to-[#0F1115] border border-purple-500/30 shadow-2xl relative overflow-hidden"
          >
            {/* Animated Background Particles */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    x: Math.random() * 100 + '%', 
                    y: '100%',
                    opacity: 0 
                  }}
                  animate={{ 
                    y: '-100%',
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    delay: Math.random() * 2,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                  className="absolute w-1 h-1 bg-purple-400 rounded-full"
                />
              ))}
            </div>

            {/* Content */}
            <div className="relative z-10 space-y-8 text-center">
              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: 'spring', 
                  bounce: 0.5, 
                  duration: 1,
                  delay: 0.2 
                }}
                className="flex justify-center"
              >
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-14 h-14 text-white" />
                  </div>
                  
                  {/* Pulsing Rings */}
                  <motion.div
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity,
                      ease: 'easeOut'
                    }}
                    className="absolute inset-0 rounded-full border-4 border-green-500"
                  />
                  <motion.div
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity,
                      ease: 'easeOut',
                      delay: 0.5
                    }}
                    className="absolute inset-0 rounded-full border-4 border-green-500"
                  />
                </div>
              </motion.div>

              {/* Task Title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-3"
              >
                <h2 className="text-3xl text-white">Task Completed! 🎉</h2>
                <p className="text-xl text-white/70">
                  {taskTitle}
                </p>
              </motion.div>

              {/* Congratulatory Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center justify-center gap-2 text-green-400"
              >
                <Sparkles className="w-5 h-5" />
                <p className="text-lg">Great job! You're on track</p>
                <Sparkles className="w-5 h-5" />
              </motion.div>

              {/* Progress Bar */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-white/70">
                    <TrendingUp className="w-4 h-4" />
                    <span>Overall Progress</span>
                  </div>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="text-green-400"
                  >
                    {progressPercentage}%
                  </motion.span>
                </div>
                
                {/* Progress Bar Track */}
                <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${animatedProgress}%` }}
                    transition={{ 
                      duration: 1.5, 
                      delay: 1,
                      ease: 'easeOut' 
                    }}
                    className="h-full bg-gradient-to-r from-green-500 via-emerald-500 to-green-400 rounded-full relative"
                  >
                    {/* Shimmer Effect */}
                    <motion.div
                      initial={{ x: '-100%' }}
                      animate={{ x: '200%' }}
                      transition={{
                        duration: 1.5,
                        delay: 1,
                        ease: 'easeInOut'
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    />
                  </motion.div>
                </div>
              </motion.div>

              {/* Motivational Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="grid grid-cols-3 gap-4"
              >
                <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                  <p className="text-2xl text-green-400">+1</p>
                  <p className="text-xs text-white/50 mt-1">Task Done</p>
                </div>
                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <p className="text-2xl text-purple-400">85%</p>
                  <p className="text-xs text-white/50 mt-1">Efficiency</p>
                </div>
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <p className="text-2xl text-blue-400">12</p>
                  <p className="text-xs text-white/50 mt-1">This Week</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
