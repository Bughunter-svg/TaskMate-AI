import { motion } from 'motion/react';
import { CheckCircle2, Clock, Circle, Sparkles } from 'lucide-react';

const timelineTasks = [
  {
    emoji: '☕',
    title: 'Morning standup',
    startTime: '9:00 AM',
    endTime: '9:30 AM',
    status: 'done' as const,
  },
  {
    emoji: '💻',
    title: 'Design UI/UX Dashboard',
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    status: 'in-progress' as const,
    progress: 65,
  },
  {
    emoji: '🎨',
    title: 'Create Material for Samaritan',
    startTime: '2:00 PM',
    endTime: '4:00 PM',
    status: 'upcoming' as const,
  },
  {
    emoji: '📱',
    title: 'Update Instagram Profile',
    startTime: '5:00 PM',
    endTime: '5:30 PM',
    status: 'upcoming' as const,
  },
];

export function DailyTimeline() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full bg-[#1A1D24] border border-[#232834] rounded-3xl p-6 space-y-6"
    >
      {/* AI Insight Bubble */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-start gap-3 p-4 bg-gradient-to-br from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-2xl"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-white/90 text-sm">
            Here's your plan for today! You have{' '}
            <span className="text-purple-400">4 tasks</span> scheduled.
          </p>
          <p className="text-white/50 text-xs mt-1">
            You're on track to finish by 5:30 PM
          </p>
        </div>
      </motion.div>

      {/* Timeline */}
      <div className="space-y-4">
        {timelineTasks.map((task, index) => {
          const statusConfig = {
            done: {
              bg: 'bg-green-500/10',
              border: 'border-green-500/30',
              icon: CheckCircle2,
              iconColor: 'text-green-500',
              dotColor: 'bg-green-500',
            },
            'in-progress': {
              bg: 'bg-yellow-500/10',
              border: 'border-yellow-500/30',
              icon: Clock,
              iconColor: 'text-yellow-500',
              dotColor: 'bg-yellow-500',
            },
            upcoming: {
              bg: 'bg-blue-500/10',
              border: 'border-blue-500/30',
              icon: Circle,
              iconColor: 'text-blue-500',
              dotColor: 'bg-blue-500',
            },
          };

          const config = statusConfig[task.status];
          const StatusIcon = config.icon;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="flex gap-4"
            >
              {/* Timeline Line */}
              <div className="flex flex-col items-center">
                <div className={`w-2 h-2 rounded-full ${config.dotColor} mt-2`} />
                {index < timelineTasks.length - 1 && (
                  <div className="w-0.5 h-full bg-white/10 my-1" />
                )}
              </div>

              {/* Task Card */}
              <div className="flex-1 pb-4">
                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  className={`p-4 rounded-2xl ${config.bg} border ${config.border} cursor-pointer transition-all`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{task.emoji}</span>
                      <div>
                        <h4 className="text-white text-sm">{task.title}</h4>
                        <p className="text-white/40 text-xs mt-0.5">
                          {task.startTime} - {task.endTime}
                        </p>
                      </div>
                    </div>
                    <StatusIcon className={`w-5 h-5 ${config.iconColor}`} />
                  </div>

                  {/* Progress Bar for in-progress tasks */}
                  {task.status === 'in-progress' && task.progress && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white/50 text-xs">Progress</span>
                        <span className="text-yellow-400 text-xs">{task.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${task.progress}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
