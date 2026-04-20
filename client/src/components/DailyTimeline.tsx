import { motion } from 'motion/react';
import { CheckCircle2, Clock, Circle, Sparkles, CalendarX } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  status: 'Completed' | 'In Progress' | 'Pending';
  scheduledDate?: string;
  scheduledTime?: string;
  startedAt?: string;
}

interface DailyTimelineProps {
  tasks?: Task[];
}

export function DailyTimeline({ tasks = [] }: DailyTimelineProps) {
  // Get today's date string for comparison
  const todayStr = new Date().toISOString().split('T')[0];

  // Filter to tasks scheduled today or in-progress, sorted by time
  const todayTasks = tasks
    .filter(t => {
      if (t.status === 'In Progress') return true;
      if (!t.scheduledDate) return false;
      return t.scheduledDate === todayStr || t.scheduledDate === new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    })
    .sort((a, b) => {
      const aTime = a.scheduledTime || '23:59';
      const bTime = b.scheduledTime || '23:59';
      return aTime.localeCompare(bTime);
    });

  const statusConfig = {
    'Completed': {
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      icon: CheckCircle2,
      iconColor: 'text-green-500',
      dotColor: 'bg-green-500',
    },
    'In Progress': {
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30',
      icon: Clock,
      iconColor: 'text-yellow-500',
      dotColor: 'bg-yellow-500',
    },
    'Pending': {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      icon: Circle,
      iconColor: 'text-blue-500',
      dotColor: 'bg-blue-500',
    },
  };

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
            {todayTasks.length > 0 ? (
              <>Here's your plan for today! You have{' '}
                <span className="text-purple-400">{todayTasks.length} task{todayTasks.length !== 1 ? 's' : ''}</span> active or scheduled.
              </>
            ) : (
              'No tasks scheduled for today. Add a new task to get started!'
            )}
          </p>
          {todayTasks.length > 0 && (
            <p className="text-white/50 text-xs mt-1">
              Drag tasks to change their status or click for details.
            </p>
          )}
        </div>
      </motion.div>

      {/* Timeline */}
      {todayTasks.length > 0 ? (
        <div className="space-y-4">
          {todayTasks.map((task, index) => {
            const config = statusConfig[task.status];
            const StatusIcon = config.icon;

            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="flex gap-4"
              >
                {/* Timeline Line */}
                <div className="flex flex-col items-center">
                  <div className={`w-2 h-2 rounded-full ${config.dotColor} mt-2`} />
                  {index < todayTasks.length - 1 && (
                    <div className="w-0.5 h-full bg-white/10 my-1" />
                  )}
                </div>

                {/* Task Card */}
                <div className="flex-1 pb-4">
                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    className={`p-4 rounded-2xl ${config.bg} border ${config.border} cursor-pointer transition-all`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div>
                          <h4 className="text-white text-sm">{task.title}</h4>
                          {task.scheduledTime && (
                            <p className="text-white/40 text-xs mt-0.5">
                              {task.scheduledTime}
                            </p>
                          )}
                        </div>
                      </div>
                      <StatusIcon className={`w-5 h-5 ${config.iconColor} flex-shrink-0`} />
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center justify-center py-10 gap-3"
        >
          <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center">
            <CalendarX className="w-7 h-7 text-white/20" />
          </div>
          <p className="text-white/40 text-sm">No tasks scheduled for today</p>
          <p className="text-white/20 text-xs">Create a task and set today as the scheduled date</p>
        </motion.div>
      )}
    </motion.div>
  );
}
