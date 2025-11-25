import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

export function WelcomeBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="relative mb-8"
        >
          <div className="relative rounded-3xl bg-gradient-to-br from-purple-600/10 to-blue-600/10 border border-purple-500/20 p-6 overflow-hidden">
            {/* Animated background gradient */}
            <motion.div
              animate={{
                opacity: [0.1, 0.2, 0.1],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 blur-2xl"
            />

            {/* Content */}
            <div className="relative flex items-start justify-between gap-6">
              <div className="flex items-start gap-4 flex-1">
                {/* Icon */}
                <motion.div
                  animate={{
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="p-3 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex-shrink-0"
                >
                  <Sparkles className="w-5 h-5 text-white" />
                </motion.div>

                {/* Text */}
                <div className="flex-1">
                  <h3 className="text-white text-lg mb-1">
                    Welcome to TaskMate AI! 👋
                  </h3>
                  <p className="text-white/70 text-sm mb-4">
                    What do you want to get done today? Let's get started!
                  </p>
                  
                  {/* Primary Instruction */}
                  <div className="mb-4 p-4 rounded-xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/30">
                    <div className="flex items-start gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-white text-sm mb-1">🚀 Start with AI (Recommended)</h4>
                        <p className="text-white/70 text-sm">
                          Click the <strong className="text-purple-400">AI Assistant</strong> button (bottom right) and tell the AI all your tasks. 
                          It will automatically organize, schedule, and prioritize everything for you!
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick Tips */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-white/60 text-sm">
                      <ArrowRight className="w-3.5 h-3.5 text-white/40" />
                      <span><strong className="text-white/70">Optional:</strong> You can also manually add tasks using the "Add Task" button</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/60 text-sm">
                      <ArrowRight className="w-3.5 h-3.5 text-white/40" />
                      <span><strong className="text-white/70">Drag & Drop:</strong> Move tasks between columns to update their status</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/60 text-sm">
                      <ArrowRight className="w-3.5 h-3.5 text-white/40" />
                      <span><strong className="text-white/70">Plan Mode:</strong> Use AI to analyze workload and create smart schedules</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => setIsVisible(false)}
                    className="bg-purple-600 hover:bg-purple-700 text-white text-sm h-9 px-4"
                  >
                    Got it, let's start!
                  </Button>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsVisible(false)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200 flex-shrink-0"
              >
                <X className="w-4 h-4 text-white/60" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
