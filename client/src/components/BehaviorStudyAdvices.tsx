import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, TrendingUp, Clock, Zap, Target, MessageSquare, X, CheckCircle, Inbox } from 'lucide-react';
import { Button } from './ui/button';

interface Task {
  id: string;
  title: string;
  status: 'Completed' | 'In Progress' | 'Pending';
  createdAt?: string;
  completedAt?: string;
}

interface BehaviorInsight {
  id: string;
  type: 'peak-hours' | 'productivity' | 'recommendation' | 'decision';
  title: string;
  message: string;
  icon: any;
  color: string;
}

interface BehaviorStudyAdvicesProps {
  tasks?: Task[];
}

export function BehaviorStudyAdvices({ tasks = [] }: BehaviorStudyAdvicesProps) {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState<BehaviorInsight | null>(null);
  const [dismissedInsights, setDismissedInsights] = useState<string[]>([]);

  const totalTasks = tasks.length;
  const completed = tasks.filter(t => t.status === 'Completed').length;
  const inProgress = tasks.filter(t => t.status === 'In Progress').length;
  const pending = tasks.filter(t => t.status === 'Pending').length;
  const completionRate = totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0;

  // Generate dynamic insights based on real task data
  const behaviorInsights = useMemo((): BehaviorInsight[] => {
    if (totalTasks === 0) return [];

    const insights: BehaviorInsight[] = [];

    // Insight 1: Completion rate
    if (completed > 0) {
      insights.push({
        id: '1',
        type: 'productivity',
        title: completionRate >= 70 ? 'Excellent Completion Rate' : completionRate >= 40 ? 'Steady Progress' : 'Room for Improvement',
        message: `You've completed ${completed} out of ${totalTasks} tasks (${completionRate}%). ${
          completionRate >= 70
            ? 'Outstanding work! Keep maintaining this momentum.'
            : completionRate >= 40
            ? 'Good progress. Try to finish your in-progress tasks to boost your rate.'
            : 'Focus on completing one task at a time to build momentum.'
        }`,
        icon: TrendingUp,
        color: completionRate >= 70 ? 'green' : completionRate >= 40 ? 'blue' : 'orange',
      });
    }

    // Insight 2: In-progress overload
    if (inProgress > 3) {
      insights.push({
        id: '2',
        type: 'recommendation',
        title: 'Too Many Tasks In Progress',
        message: `You have ${inProgress} tasks in progress simultaneously. Research shows productivity drops with more than 3 concurrent tasks. Consider finishing current work before starting new tasks.`,
        icon: Zap,
        color: 'orange',
      });
    } else if (inProgress > 0 && inProgress <= 3) {
      insights.push({
        id: '2',
        type: 'recommendation',
        title: 'Good Focus Level',
        message: `You're managing ${inProgress} task${inProgress > 1 ? 's' : ''} in progress — that's a healthy workload. Stay focused and complete them before picking up more.`,
        icon: Zap,
        color: 'green',
      });
    }

    // Insight 3: Pending backlog
    if (pending > 0) {
      insights.push({
        id: '3',
        type: 'decision',
        title: pending > 5 ? 'Large Backlog Detected' : 'Pending Tasks Available',
        message: `You have ${pending} pending task${pending > 1 ? 's' : ''} waiting to be started. ${
          pending > 5
            ? 'Consider prioritizing the most impactful ones first to manage your backlog effectively.'
            : 'Pick up the highest priority task next to maintain steady progress.'
        }`,
        icon: Target,
        color: pending > 5 ? 'orange' : 'blue',
      });
    }

    // Insight 4: Peak hours suggestion (always show if there are tasks)
    if (totalTasks > 0) {
      insights.push({
        id: '4',
        type: 'peak-hours',
        title: 'Productivity Tip',
        message: `With ${totalTasks} total tasks, consider scheduling complex work during your peak focus hours (typically 9-11 AM). Start with your hardest pending task first for best results.`,
        icon: Clock,
        color: 'purple',
      });
    }

    return insights;
  }, [totalTasks, completed, inProgress, pending, completionRate]);

  const getColorClasses = (color: string) => {
    const colors: Record<string, any> = {
      purple: {
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/30',
        text: 'text-purple-400',
        icon: 'text-purple-500',
        gradient: 'from-purple-600 to-blue-600',
      },
      blue: {
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        text: 'text-blue-400',
        icon: 'text-blue-500',
        gradient: 'from-blue-600 to-cyan-600',
      },
      orange: {
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/30',
        text: 'text-orange-400',
        icon: 'text-orange-500',
        gradient: 'from-orange-600 to-yellow-600',
      },
      green: {
        bg: 'bg-green-500/10',
        border: 'border-green-500/30',
        text: 'text-green-400',
        icon: 'text-green-500',
        gradient: 'from-green-600 to-emerald-600',
      },
    };
    return colors[color] || colors.purple;
  };

  const handleInsightClick = (insight: BehaviorInsight) => {
    setSelectedInsight(insight);
    setShowPopup(true);
  };

  const handleDismiss = (insightId: string) => {
    setDismissedInsights([...dismissedInsights, insightId]);
    setShowPopup(false);
    setSelectedInsight(null);
  };

  const visibleInsights = behaviorInsights.filter(
    insight => !dismissedInsights.includes(insight.id)
  );

  // Compute dynamic stats
  const avgFocusHours = totalTasks > 0 ? Math.min(8, (completed * 1.5 + inProgress * 0.5)).toFixed(1) : '0';
  const productivityScore = totalTasks > 0 ? Math.min(100, Math.round(completionRate * 0.7 + (inProgress <= 3 ? 30 : 15))) : 0;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-white mb-1">BEHAVIOUR STUDY AND ADVICES</h2>
            <p className="text-white/50">
              AI-powered analysis of your work patterns and personalized productivity recommendations
            </p>
          </div>
          <div className="px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <p className="text-xs text-white/50 mb-1">Active Insights</p>
            <p className="text-2xl text-purple-400">{visibleInsights.length}</p>
          </div>
        </div>

        {/* Insights Grid */}
        {visibleInsights.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visibleInsights.map((insight, index) => {
              const Icon = insight.icon;
              const colors = getColorClasses(insight.color);
              
              return (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  onClick={() => handleInsightClick(insight)}
                  className={`relative p-5 rounded-2xl ${colors.bg} border ${colors.border} cursor-pointer group hover:shadow-lg transition-all duration-200`}
                >
                  {/* Icon */}
                  <div className={`flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${colors.gradient} mb-4`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-white mb-2">
                    {insight.title}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed line-clamp-3">
                    {insight.message}
                  </p>

                  {/* Badge */}
                  <div className="mt-4">
                    <span className={`text-xs ${colors.text} px-3 py-1 rounded-full ${colors.bg} border ${colors.border}`}>
                      {insight.type.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>

                  {/* Hover Arrow */}
                  <motion.div
                    initial={{ x: 0, opacity: 0 }}
                    whileHover={{ x: 4, opacity: 1 }}
                    className={`absolute top-5 right-5 ${colors.text}`}
                  >
                    →
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 gap-3 rounded-2xl bg-[#1C1F26] border border-[#232834]">
            <Inbox className="w-12 h-12 text-white/10" />
            <p className="text-white/30 text-sm">
              {totalTasks === 0 ? 'Create tasks to get AI-powered insights' : 'All insights dismissed'}
            </p>
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="p-4 rounded-2xl bg-[#1C1F26] border border-[#232834]"
          >
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-purple-400" />
              <span className="text-white/70">Estimated Focus Time</span>
            </div>
            <p className="text-3xl text-white">{avgFocusHours} hrs</p>
            <p className="text-sm text-white/40 mt-1">Based on task activity</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="p-4 rounded-2xl bg-[#1C1F26] border border-[#232834]"
          >
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <span className="text-white/70">Productivity Score</span>
            </div>
            <p className="text-3xl text-white">{productivityScore}/100</p>
            <p className="text-sm text-white/40 mt-1">
              {productivityScore >= 70 ? 'Excellent' : productivityScore >= 40 ? 'Good' : totalTasks > 0 ? 'Getting started' : 'No data yet'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="p-4 rounded-2xl bg-[#1C1F26] border border-[#232834]"
          >
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-5 h-5 text-green-400" />
              <span className="text-white/70">Tasks Completed</span>
            </div>
            <p className="text-3xl text-white">{completed}/{totalTasks}</p>
            <p className="text-sm text-white/40 mt-1">
              {totalTasks > 0 ? `${completionRate}% completion rate` : 'No tasks yet'}
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Popup Modal */}
      <AnimatePresence>
        {showPopup && selectedInsight && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPopup(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl w-full bg-[#1C1F26] border border-[#232834] rounded-3xl p-8 shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Icon */}
              <div className={`flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${getColorClasses(selectedInsight.color).gradient} mb-6`}>
                {(() => {
                  const Icon = selectedInsight.icon;
                  return <Icon className="w-8 h-8 text-white" />;
                })()}
              </div>

              {/* Content */}
              <h2 className="text-white mb-4">{selectedInsight.title}</h2>
              <p className="text-white/70 leading-relaxed mb-6">
                {selectedInsight.message}
              </p>

              {/* Additional Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <p className="text-white/90 mb-1">Your Current Stats</p>
                    <p className="text-white/60 text-sm">
                      {completed} completed, {inProgress} in progress, {pending} pending — {completionRate}% completion rate.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5">
                  <MessageSquare className="w-5 h-5 text-purple-400 mt-0.5" />
                  <div>
                    <p className="text-white/90 mb-1">Recommended Action</p>
                    <p className="text-white/60 text-sm">
                      {inProgress > 3
                        ? 'Focus on completing your in-progress tasks before starting new ones.'
                        : pending > 0
                        ? 'Pick up your next pending task when you finish your current work.'
                        : 'Great job! Consider adding new tasks to keep your momentum going.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={() => handleDismiss(selectedInsight.id)}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500"
                >
                  Got It
                </Button>
                <Button
                  onClick={() => setShowPopup(false)}
                  variant="outline"
                  className="px-6 border-[#232834] text-white/70 hover:text-white hover:bg-white/5"
                >
                  Later
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
