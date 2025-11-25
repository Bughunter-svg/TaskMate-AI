import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, TrendingUp, Clock, Zap, Target, MessageSquare, X, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';

interface BehaviorInsight {
  id: string;
  type: 'peak-hours' | 'productivity' | 'recommendation' | 'decision';
  title: string;
  message: string;
  icon: any;
  color: string;
  action?: string;
}

const behaviorInsights: BehaviorInsight[] = [
  {
    id: '1',
    type: 'peak-hours',
    title: 'Peak Productivity Hours Detected',
    message: 'You\'re most productive between 9:00 AM - 12:00 PM with 92% task completion rate. Consider scheduling complex tasks during this window.',
    icon: Clock,
    color: 'purple',
  },
  {
    id: '2',
    type: 'productivity',
    title: 'Productivity Pattern Analysis',
    message: 'You complete 3.2x more tasks on Tuesdays and Thursdays. Your focus drops by 40% after 3:00 PM on Mondays and Fridays.',
    icon: TrendingUp,
    color: 'blue',
  },
  {
    id: '3',
    type: 'recommendation',
    title: 'Smart Break Suggestion',
    message: 'Your productivity increases by 35% when you take 15-minute breaks every 90 minutes. Currently, you\'re taking breaks every 2.5 hours.',
    icon: Zap,
    color: 'orange',
  },
  {
    id: '4',
    type: 'decision',
    title: 'AI Decision: Task Prioritization',
    message: 'Based on your deadline patterns, I\'ve reprioritized 3 tasks. "API Integration Testing" should be moved to tomorrow morning for optimal completion.',
    icon: Target,
    color: 'green',
  },
];

export function BehaviorStudyAdvices() {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState<BehaviorInsight | null>(null);
  const [dismissedInsights, setDismissedInsights] = useState<string[]>([]);

  const getColorClasses = (color: string) => {
    const colors = {
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
    return colors[color as keyof typeof colors] || colors.purple;
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
                className={`relative p-5 rounded-2xl ${colors.bg} border ${colors.border} cursor-pointer group hover:shadow-lg hover:shadow-${insight.color}-500/20 transition-all duration-200`}
              >
                {/* Icon */}
                <div className={`flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${colors.gradient} mb-4`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>

                {/* Content */}
                <h3 className={`text-white mb-2 group-hover:${colors.text} transition-colors`}>
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
              <span className="text-white/70">Average Focus Time</span>
            </div>
            <p className="text-3xl text-white">2.4 hrs</p>
            <p className="text-sm text-green-400 mt-1">↑ 18% from last week</p>
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
            <p className="text-3xl text-white">87/100</p>
            <p className="text-sm text-blue-400 mt-1">Above average</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="p-4 rounded-2xl bg-[#1C1F26] border border-[#232834]"
          >
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-5 h-5 text-green-400" />
              <span className="text-white/70">Goals Achieved</span>
            </div>
            <p className="text-3xl text-white">12/15</p>
            <p className="text-sm text-green-400 mt-1">80% completion rate</p>
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
                    <p className="text-white/90 mb-1">What This Means</p>
                    <p className="text-white/60 text-sm">
                      Our AI has analyzed over 120 hours of your work patterns to identify optimal productivity windows.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5">
                  <MessageSquare className="w-5 h-5 text-purple-400 mt-0.5" />
                  <div>
                    <p className="text-white/90 mb-1">Recommended Action</p>
                    <p className="text-white/60 text-sm">
                      Schedule your most important tasks during your peak hours and save routine tasks for lower-energy periods.
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
                  Apply Suggestion
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
