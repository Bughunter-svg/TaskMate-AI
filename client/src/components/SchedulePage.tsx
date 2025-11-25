import { motion } from 'motion/react';
import { Clock, User, CheckCircle2, Calendar as CalendarIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface ScheduleTask {
  id: string;
  title: string;
  assignee: string;
  avatarUrl?: string;
  time: string;
  duration: string;
  date: 'today' | 'tomorrow' | string;
  status: 'completed' | 'in-progress' | 'upcoming';
  color: string;
}

interface SchedulePageProps {
  tasks: ScheduleTask[];
  onTaskComplete?: (taskId: string) => void;
}

const defaultScheduleTasks: ScheduleTask[] = [
  // TODAY - You
  {
    id: '1',
    title: 'Morning standup meeting',
    assignee: 'You',
    avatarUrl: 'https://images.unsplash.com/photo-1672685667592-0392f458f46f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMGZhY2V8ZW58MXx8fHwxNzYyNTc3NzMyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    time: '9:00 AM',
    duration: '30 min',
    date: 'today',
    status: 'completed',
    color: 'green',
  },
  {
    id: '2',
    title: 'Design UI/UX Dashboard',
    assignee: 'You',
    avatarUrl: 'https://images.unsplash.com/photo-1672685667592-0392f458f46f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMGZhY2V8ZW58MXx8fHwxNzYyNTc3NzMyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    time: '10:00 AM',
    duration: '2 hrs',
    date: 'today',
    status: 'in-progress',
    color: 'purple',
  },
  {
    id: '3',
    title: 'Create Material for Samaritan Section',
    assignee: 'You',
    avatarUrl: 'https://images.unsplash.com/photo-1672685667592-0392f458f46f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMGZhY2V8ZW58MXx8fHwxNzYyNTc3NzMyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    time: '2:00 PM',
    duration: '2 hrs',
    date: 'today',
    status: 'upcoming',
    color: 'blue',
  },
  {
    id: '4',
    title: 'Update Instagram Profile',
    assignee: 'You',
    avatarUrl: 'https://images.unsplash.com/photo-1672685667592-0392f458f46f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMGZhY2V8ZW58MXx8fHwxNzYyNTc3NzMyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    time: '5:00 PM',
    duration: '30 min',
    date: 'today',
    status: 'upcoming',
    color: 'blue',
  },
  // TODAY - Team
  {
    id: '5',
    title: 'Database Schema Update',
    assignee: 'Alice Chen',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0JTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc2MjU3Nzg4MXww&ixlib=rb-4.1.0&q=80&w=1080',
    time: '9:30 AM',
    duration: '3 hrs',
    date: 'today',
    status: 'in-progress',
    color: 'purple',
  },
  {
    id: '6',
    title: 'User Feedback Analysis',
    assignee: 'Suman Patel',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwb3J0cmFpdCUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NjI1Nzc4ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    time: '1:00 PM',
    duration: '2 hrs',
    date: 'today',
    status: 'upcoming',
    color: 'blue',
  },
  // TOMORROW - You
  {
    id: '7',
    title: 'API Integration Testing',
    assignee: 'You',
    avatarUrl: 'https://images.unsplash.com/photo-1672685667592-0392f458f46f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMGZhY2V8ZW58MXx8fHwxNzYyNTc3NzMyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    time: '10:00 AM',
    duration: '3 hrs',
    date: 'tomorrow',
    status: 'upcoming',
    color: 'blue',
  },
  {
    id: '8',
    title: 'Documentation Update',
    assignee: 'You',
    avatarUrl: 'https://images.unsplash.com/photo-1672685667592-0392f458f46f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMGZhY2V8ZW58MXx8fHwxNzYyNTc3NzMyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    time: '3:00 PM',
    duration: '1.5 hrs',
    date: 'tomorrow',
    status: 'upcoming',
    color: 'blue',
  },
  // TOMORROW - Team
  {
    id: '9',
    title: 'Mobile App Wireframes',
    assignee: 'Marcus Johnson',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwb3J0cmFpdCUyMGJ1c2luZXNzfGVufDF8fHx8MTc2MjU3Nzg4Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    time: '11:00 AM',
    duration: '4 hrs',
    date: 'tomorrow',
    status: 'upcoming',
    color: 'blue',
  },
  {
    id: '10',
    title: 'Photo Profile Instagram',
    assignee: 'Alice Chen',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0JTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc2MjU3Nzg4MXww&ixlib=rb-4.1.0&q=80&w=1080',
    time: '2:30 PM',
    duration: '1 hr',
    date: 'tomorrow',
    status: 'upcoming',
    color: 'blue',
  },
  // Nov 10
  {
    id: '11',
    title: 'Performance Optimization',
    assignee: 'You',
    avatarUrl: 'https://images.unsplash.com/photo-1672685667592-0392f458f46f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMGZhY2V8ZW58MXx8fHwxNzYyNTc3NzMyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    time: '9:00 AM',
    duration: '2 hrs',
    date: 'Nov 10',
    status: 'upcoming',
    color: 'blue',
  },
  {
    id: '12',
    title: 'Client Presentation Prep',
    assignee: 'Rana Kumar',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwb3J0cmFpdCUyMHNtaWxlfGVufDF8fHx8MTc2MjU3Nzg4M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    time: '10:30 AM',
    duration: '2 hrs',
    date: 'Nov 10',
    status: 'upcoming',
    color: 'blue',
  },
];

export function SchedulePage({ tasks = defaultScheduleTasks, onTaskComplete }: SchedulePageProps) {
  // Group tasks by date
  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.date]) {
      acc[task.date] = [];
    }
    acc[task.date].push(task);
    return acc;
  }, {} as Record<string, ScheduleTask[]>);

  // Sort tasks within each group by time
  Object.keys(groupedTasks).forEach(date => {
    groupedTasks[date].sort((a, b) => {
      const timeA = new Date(`2000-01-01 ${a.time}`).getTime();
      const timeB = new Date(`2000-01-01 ${b.time}`).getTime();
      return timeA - timeB;
    });
  });

  const statusConfig = {
    completed: {
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      text: 'text-green-400',
      icon: 'text-green-500',
    },
    'in-progress': {
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/30',
      text: 'text-purple-400',
      icon: 'text-purple-500',
    },
    upcoming: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      text: 'text-blue-400',
      icon: 'text-blue-500',
    },
  };

  const dateLabels: Record<string, string> = {
    today: 'Today',
    tomorrow: 'Tomorrow',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-white mb-2">Team Schedule</h2>
          <p className="text-white/50">
            Complete overview of all tasks scheduled for you and your team
          </p>
        </div>
        
        {/* Summary Stats */}
        <div className="flex gap-4">
          <div className="px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20">
            <p className="text-xs text-white/50 mb-1">Completed Today</p>
            <p className="text-2xl text-green-400">
              {tasks.filter(t => t.date === 'today' && t.status === 'completed').length}
            </p>
          </div>
          <div className="px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <p className="text-xs text-white/50 mb-1">In Progress</p>
            <p className="text-2xl text-purple-400">
              {tasks.filter(t => t.status === 'in-progress').length}
            </p>
          </div>
          <div className="px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <p className="text-xs text-white/50 mb-1">Upcoming</p>
            <p className="text-2xl text-blue-400">
              {tasks.filter(t => t.status === 'upcoming').length}
            </p>
          </div>
        </div>
      </div>

      {/* Schedule by Date */}
      {Object.entries(groupedTasks).map(([date, dateTasks], dateIndex) => {
        // Separate your tasks from team tasks
        const yourTasks = dateTasks.filter(t => t.assignee === 'You');
        const teamTasks = dateTasks.filter(t => t.assignee !== 'You');

        return (
          <motion.div
            key={date}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: dateIndex * 0.1 }}
            className="space-y-6"
          >
            {/* Date Header */}
            <div className="flex items-center gap-3">
              <CalendarIcon className="w-5 h-5 text-purple-400" />
              <h3 className="text-white">
                {dateLabels[date] || date}
              </h3>
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-white/40">
                {dateTasks.length} tasks
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Your Tasks */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-xl w-fit">
                  <User className="w-4 h-4 text-purple-400" />
                  <span className="text-white/90">Your Tasks ({yourTasks.length})</span>
                </div>

                <div className="space-y-3">
                  {yourTasks.map((task, index) => {
                    const config = statusConfig[task.status];
                    return (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        className={`p-4 rounded-2xl ${config.bg} border ${config.border} cursor-pointer transition-all`}
                        onClick={() => onTaskComplete?.(task.id)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10 ring-2 ring-purple-500/30">
                              <AvatarImage src={task.avatarUrl} />
                              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-xs">
                                {task.assignee.substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="text-white text-sm">{task.title}</h4>
                              <p className="text-white/40 text-xs mt-0.5">{task.assignee}</p>
                            </div>
                          </div>
                          {task.status === 'completed' && (
                            <CheckCircle2 className={`w-5 h-5 ${config.icon}`} />
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs">
                          <div className="flex items-center gap-1.5 text-white/50">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{task.time}</span>
                          </div>
                          <div className={`px-2 py-1 rounded-lg ${config.bg} ${config.text}`}>
                            {task.duration}
                          </div>
                          <div className={`px-2 py-1 rounded-lg ${config.bg} ${config.text} capitalize ml-auto`}>
                            {task.status.replace('-', ' ')}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Team Tasks */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl w-fit">
                  <User className="w-4 h-4 text-blue-400" />
                  <span className="text-white/90">Team Tasks ({teamTasks.length})</span>
                </div>

                <div className="space-y-3">
                  {teamTasks.map((task, index) => {
                    const config = statusConfig[task.status];
                    return (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        className={`p-4 rounded-2xl ${config.bg} border ${config.border} cursor-pointer transition-all`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10 ring-2 ring-blue-500/30">
                              <AvatarImage src={task.avatarUrl} />
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-xs">
                                {task.assignee.substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="text-white text-sm">{task.title}</h4>
                              <p className="text-white/40 text-xs mt-0.5">{task.assignee}</p>
                            </div>
                          </div>
                          {task.status === 'completed' && (
                            <CheckCircle2 className={`w-5 h-5 ${config.icon}`} />
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs">
                          <div className="flex items-center gap-1.5 text-white/50">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{task.time}</span>
                          </div>
                          <div className={`px-2 py-1 rounded-lg ${config.bg} ${config.text}`}>
                            {task.duration}
                          </div>
                          <div className={`px-2 py-1 rounded-lg ${config.bg} ${config.text} capitalize ml-auto`}>
                            {task.status.replace('-', ' ')}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
