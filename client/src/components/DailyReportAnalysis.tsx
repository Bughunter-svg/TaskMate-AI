import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Target, Zap, Clock, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';
import { Progress } from './ui/progress';

interface Task {
  id: string;
  title: string;
  status: 'Completed' | 'In Progress' | 'Pending';
  assignee: string;
  category: 'Business' | 'Personal';
  deadline?: string;
  scheduledDate?: string;
}

interface DailyReportAnalysisProps {
  tasks: Task[];
  mode: 'solo' | 'team';
}

export function DailyReportAnalysis({ tasks, mode }: DailyReportAnalysisProps) {
  // Calculate today's stats
  const today = new Date();
  const todayString = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  
  const completedToday = tasks.filter(t => t.status === 'Completed').length;
  const inProgressToday = tasks.filter(t => t.status === 'In Progress').length;
  const pendingToday = tasks.filter(t => t.status === 'Pending').length;
  const totalTasks = tasks.length;
  
  const completionRate = totalTasks > 0 ? Math.round((completedToday / totalTasks) * 100) : 0;
  const productivityScore = Math.min(100, Math.round(
    (completedToday * 10) + (inProgressToday * 5) + (pendingToday * 2)
  ));

  // Calculate business vs personal split
  const businessTasks = tasks.filter(t => t.category === 'Business').length;
  const personalTasks = tasks.filter(t => t.category === 'Personal').length;

  // Generate AI insights
  const getProductivityTrend = () => {
    if (completionRate >= 70) return { icon: TrendingUp, text: 'Excellent', color: 'text-green-400', bgColor: 'bg-green-500/10' };
    if (completionRate >= 40) return { icon: TrendingUp, text: 'Good', color: 'text-blue-400', bgColor: 'bg-blue-500/10' };
    return { icon: TrendingDown, text: 'Needs Attention', color: 'text-orange-400', bgColor: 'bg-orange-500/10' };
  };

  const getAIInsight = () => {
    if (mode === 'solo') {
      if (completionRate >= 70) {
        return "Outstanding work today! You're crushing your goals with impressive focus and efficiency.";
      } else if (completionRate >= 40) {
        return "Solid progress today! Consider prioritizing your high-impact tasks to boost productivity.";
      } else if (inProgressToday > completedToday) {
        return "You have several tasks in progress. Focus on completing one task at a time for better results.";
      } else {
        return "Let's turn those pending tasks into action! Start with the quickest wins to build momentum.";
      }
    } else {
      if (completionRate >= 70) {
        return "Team is performing exceptionally well! High collaboration and task completion rates detected.";
      } else if (completionRate >= 40) {
        return "Team is making good progress. Consider redistributing tasks for optimal efficiency.";
      } else {
        return "Team has room for improvement. Identify blockers and facilitate better task delegation.";
      }
    }
  };

  const trend = getProductivityTrend();
  const TrendIcon = trend.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-white mb-2">Daily Report Analysis</h2>
        <p className="text-white/50">
          AI-powered insights and performance metrics for {todayString}
        </p>
      </div>

      {/* Main Report Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="rounded-3xl bg-[#1C1F26] border border-[#232834] p-8"
      >
        {/* Productivity Score */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${trend.bgColor}`}>
                <TrendIcon className={`w-5 h-5 ${trend.color}`} />
              </div>
              <div>
                <h3 className="text-white text-lg">Productivity Score</h3>
                <p className="text-white/40 text-sm">{trend.text} Performance</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl text-white mb-1">{productivityScore}</div>
              <div className="text-white/40 text-xs">out of 100</div>
            </div>
          </div>
          <Progress value={productivityScore} className="h-3" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* Completed */}
          <div className="p-4 rounded-xl bg-[#15181E] border border-[#232834]">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span className="text-white/40 text-xs">Completed</span>
            </div>
            <div className="text-2xl text-green-400">{completedToday}</div>
          </div>

          {/* In Progress */}
          <div className="p-4 rounded-xl bg-[#15181E] border border-[#232834]">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-purple-400" />
              <span className="text-white/40 text-xs">In Progress</span>
            </div>
            <div className="text-2xl text-purple-400">{inProgressToday}</div>
          </div>

          {/* Pending */}
          <div className="p-4 rounded-xl bg-[#15181E] border border-[#232834]">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-orange-400" />
              <span className="text-white/40 text-xs">Pending</span>
            </div>
            <div className="text-2xl text-orange-400">{pendingToday}</div>
          </div>

          {/* Completion Rate */}
          <div className="p-4 rounded-xl bg-[#15181E] border border-[#232834]">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-blue-400" />
              <span className="text-white/40 text-xs">Completion</span>
            </div>
            <div className="text-2xl text-blue-400">{completionRate}%</div>
          </div>
        </div>

        {/* Task Distribution */}
        <div className="p-6 rounded-xl bg-[#15181E] border border-[#232834] mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-4 h-4 text-white/60" />
            <h4 className="text-white/80">Task Distribution</h4>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/60 text-sm">Business Tasks</span>
                <span className="text-blue-400 text-sm">{businessTasks} tasks</span>
              </div>
              <Progress 
                value={totalTasks > 0 ? (businessTasks / totalTasks) * 100 : 0} 
                className="h-2"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/60 text-sm">Personal Tasks</span>
                <span className="text-pink-400 text-sm">{personalTasks} tasks</span>
              </div>
              <Progress 
                value={totalTasks > 0 ? (personalTasks / totalTasks) * 100 : 0} 
                className="h-2"
              />
            </div>
          </div>
        </div>

        {/* AI Insight */}
        <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-purple-500/20 mt-0.5">
              <Zap className="w-4 h-4 text-purple-400" />
            </div>
            <div className="flex-1">
              <h4 className="text-purple-400 mb-2 text-sm">AI Insight</h4>
              <p className="text-white/80 text-sm leading-relaxed">
                {getAIInsight()}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Time Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="p-6 rounded-2xl bg-[#1C1F26] border border-[#232834]"
        >
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-blue-400" />
            <h3 className="text-white/90">Today's Overview</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white/60 text-sm">Total Tasks</span>
              <span className="text-white">{totalTasks}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/60 text-sm">Tasks Completed</span>
              <span className="text-green-400">{completedToday}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/60 text-sm">Active Work</span>
              <span className="text-purple-400">{inProgressToday}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/60 text-sm">Awaiting Start</span>
              <span className="text-orange-400">{pendingToday}</span>
            </div>
          </div>
        </motion.div>

        {/* Performance Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="p-6 rounded-2xl bg-[#1C1F26] border border-[#232834]"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <h3 className="text-white/90">Performance Indicators</h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/60 text-sm">Task Completion</span>
                <span className={`text-sm ${completionRate >= 50 ? 'text-green-400' : 'text-orange-400'}`}>
                  {completionRate >= 50 ? 'On Track' : 'Behind'}
                </span>
              </div>
              <Progress value={completionRate} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/60 text-sm">Focus Level</span>
                <span className={`text-sm ${inProgressToday <= 3 ? 'text-green-400' : 'text-yellow-400'}`}>
                  {inProgressToday <= 3 ? 'Focused' : 'Scattered'}
                </span>
              </div>
              <Progress 
                value={inProgressToday <= 3 ? 80 : 45} 
                className="h-2" 
              />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
