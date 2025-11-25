import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, CheckCircle2, Calendar, Clock } from 'lucide-react';

interface ThanosSnapOverlayProps {
  isVisible: boolean;
  taskTitle: string;
  nextTaskTitle?: string;
  nextTaskDate?: string;
  nextTaskTime?: string;
  onComplete: () => void;
  taskElement?: HTMLElement | null;
}

export function ThanosSnapOverlay({
  isVisible,
  taskTitle,
  nextTaskTitle,
  nextTaskDate,
  nextTaskTime,
  onComplete,
  taskElement,
}: ThanosSnapOverlayProps) {
  const [showParticles, setShowParticles] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    if (isVisible) {
      // Generate particles for the snap effect
      const particleCount = 40;
      const newParticles = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 800, // Random horizontal spread
        y: (Math.random() - 0.5) * 800, // Random vertical spread
        delay: Math.random() * 0.3, // Stagger the animation
      }));
      
      setParticles(newParticles);
      setShowParticles(true);

      // Show the completion message after snap animation
      const messageTimer = setTimeout(() => {
        setShowParticles(false);
        setShowMessage(true);
      }, 1200);

      // Auto-close after showing message
      const closeTimer = setTimeout(() => {
        setShowMessage(false);
        onComplete();
      }, 4500);

      return () => {
        clearTimeout(messageTimer);
        clearTimeout(closeTimer);
      };
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          {/* Thanos Snap Particle Effect */}
          <AnimatePresence>
            {showParticles && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {particles.map((particle) => (
                  <motion.div
                    key={particle.id}
                    initial={{
                      x: '50vw',
                      y: '50vh',
                      opacity: 1,
                      scale: 1,
                    }}
                    animate={{
                      x: `calc(50vw + ${particle.x}px)`,
                      y: `calc(50vh + ${particle.y}px)`,
                      opacity: 0,
                      scale: 0,
                      rotate: Math.random() * 360,
                    }}
                    transition={{
                      duration: 1,
                      delay: particle.delay,
                      ease: 'easeOut',
                    }}
                    className="absolute w-3 h-3 bg-gradient-to-br from-purple-400 to-blue-400 rounded-sm"
                    style={{
                      boxShadow: '0 0 10px rgba(147, 51, 234, 0.5)',
                    }}
                  />
                ))}
                
                {/* Additional dust particles */}
                {particles.slice(0, 20).map((particle) => (
                  <motion.div
                    key={`dust-${particle.id}`}
                    initial={{
                      x: '50vw',
                      y: '50vh',
                      opacity: 0.6,
                      scale: 0.5,
                    }}
                    animate={{
                      x: `calc(50vw + ${particle.x * 0.5}px)`,
                      y: `calc(50vh + ${particle.y * 0.5}px)`,
                      opacity: 0,
                      scale: 0,
                    }}
                    transition={{
                      duration: 1.2,
                      delay: particle.delay + 0.1,
                      ease: 'easeOut',
                    }}
                    className="absolute w-1 h-1 bg-white/40 rounded-full blur-[1px]"
                  />
                ))}

                {/* Radial burst effect */}
                <motion.div
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 3, opacity: 0 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-to-br from-purple-500/50 to-blue-500/50 blur-xl"
                />
              </div>
            )}
          </AnimatePresence>

          {/* Completion Message */}
          <AnimatePresence>
            {showMessage && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 20,
                }}
                className="relative max-w-md w-full mx-4"
              >
                {/* Glowing background */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-3xl blur-2xl" />
                
                {/* Card */}
                <div className="relative bg-[#1C1F26] border border-[#232834] rounded-3xl p-8 shadow-2xl">
                  {/* Success Icon */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: 200,
                      damping: 15,
                      delay: 0.1,
                    }}
                    className="flex justify-center mb-6"
                  >
                    <div className="relative">
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 0.8, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                        className="absolute inset-0 bg-green-500/30 rounded-full blur-xl"
                      />
                      <div className="relative w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-10 h-10 text-white" />
                      </div>
                    </div>
                  </motion.div>

                  {/* Task Title */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center mb-6"
                  >
                    <h2 className="text-white text-2xl mb-2">Task Completed!</h2>
                    <p className="text-green-400 mb-1">"{taskTitle}"</p>
                    <p className="text-white/60 text-sm">Great Job! Keep up the momentum! 🎉</p>
                  </motion.div>

                  {/* Next Task Info */}
                  {nextTaskTitle && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mt-6 p-4 rounded-2xl bg-[#15181E] border border-[#232834]"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <h3 className="text-white/90 text-sm">Up Next</h3>
                      </div>
                      
                      <p className="text-white mb-3">{nextTaskTitle}</p>
                      
                      {(nextTaskDate || nextTaskTime) && (
                        <div className="flex items-center gap-4 text-white/60 text-sm">
                          {nextTaskDate && (
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{nextTaskDate}</span>
                            </div>
                          )}
                          {nextTaskTime && (
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{nextTaskTime}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Floating sparkles */}
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 0 }}
                      animate={{
                        opacity: [0, 1, 0],
                        y: [-20, -60],
                        x: (Math.random() - 0.5) * 40,
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3,
                        ease: 'easeOut',
                      }}
                      className="absolute w-1 h-1 bg-green-400 rounded-full"
                      style={{
                        left: `${20 + i * 13}%`,
                        bottom: '20%',
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
