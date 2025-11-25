import { motion } from 'motion/react';
import { Brain, Sparkles, TrendingUp, AlertTriangle, CheckCircle2, Clock, Zap } from 'lucide-react';

interface Prediction {
  type: 'success' | 'warning' | 'info';
  title: string;
  message: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
}

const predictions: Prediction[] = [
  {
    type: 'success',
    title: 'High Completion Probability',
    message: 'Alice may finish all pending tasks today — 86% completion rate based on current velocity and historical patterns.',
    confidence: 86,
    impact: 'high',
  },
  {
    type: 'info',
    title: 'Sprint Forecast',
    message: 'Rana is likely to finish their current sprint in ~2 days based on current velocity and task complexity analysis.',
    confidence: 78,
    impact: 'medium',
  },
  {
    type: 'warning',
    title: 'Deadline Risk Alert',
    message: 'Suman has 3 tasks approaching the deadline — suggest reprioritization or support to prevent delays.',
    confidence: 92,
    impact: 'high',
  },
  {
    type: 'success',
    title: 'Productivity Boost',
    message: 'Team velocity increased by 24% this week. On track to exceed sprint goals by Friday afternoon.',
    confidence: 81,
    impact: 'medium',
  },
];

export function EnhancedPredictionIntelligence() {
  const getTypeConfig = (type: Prediction['type']) => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle2,
          bg: 'bg-green-500/10',
          border: 'border-green-500/30',
          text: 'text-green-400',
          gradient: 'from-green-600 to-emerald-600',
          glow: 'shadow-green-500/20',
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          bg: 'bg-orange-500/10',
          border: 'border-orange-500/30',
          text: 'text-orange-400',
          gradient: 'from-orange-600 to-yellow-600',
          glow: 'shadow-orange-500/20',
        };
      case 'info':
        return {
          icon: Zap,
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/30',
          text: 'text-blue-400',
          gradient: 'from-blue-600 to-cyan-600',
          glow: 'shadow-blue-500/20',
        };
    }
  };

  const getImpactBadge = (impact: Prediction['impact']) => {
    switch (impact) {
      case 'high':
        return { label: 'HIGH IMPACT', color: 'text-red-400 bg-red-500/10 border-red-500/30' };
      case 'medium':
        return { label: 'MEDIUM IMPACT', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30' };
      case 'low':
        return { label: 'LOW IMPACT', color: 'text-gray-400 bg-gray-500/10 border-gray-500/30' };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Emphasized Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, type: 'spring' }}
        className="relative rounded-3xl bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-cyan-600/20 border-2 border-purple-500/30 p-8 overflow-hidden"
      >
        {/* Animated background effect */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full blur-3xl"
        />

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/50"
            >
              <Brain className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-white">Prediction Intelligence</h2>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/50"
                >
                  <span className="text-purple-300 text-xs flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    AI POWERED
                  </span>
                </motion.div>
              </div>
              <p className="text-white/70 max-w-2xl">
                Real-time AI predictions analyzing team patterns, velocity, and risk factors to keep your projects on track
              </p>
            </div>
          </div>

          {/* Live Status Indicator */}
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-green-400"
              />
              <span className="text-green-400 text-sm">Live Analysis</span>
            </div>
            <p className="text-white/40 text-xs">Updated 2 mins ago</p>
          </div>
        </div>
      </motion.div>

      {/* Predictions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {predictions.map((prediction, index) => {
          const config = getTypeConfig(prediction.type);
          const impactBadge = getImpactBadge(prediction.impact);
          const Icon = config.icon;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className={`relative p-6 rounded-2xl ${config.bg} border ${config.border} hover:shadow-xl hover:${config.glow} transition-all duration-200 cursor-pointer group`}
            >
              {/* Impact Badge */}
              <div className="absolute top-4 right-4">
                <span className={`text-xs px-2 py-1 rounded-full border ${impactBadge.color}`}>
                  {impactBadge.label}
                </span>
              </div>

              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6 text-white" />
              </div>

              {/* Title */}
              <h3 className={`text-white mb-3 group-hover:${config.text} transition-colors`}>
                {prediction.title}
              </h3>

              {/* Message */}
              <p className="text-white/70 text-sm leading-relaxed mb-4">
                {prediction.message}
              </p>

              {/* Confidence Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/50 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Confidence Level
                  </span>
                  <span className={config.text}>{prediction.confidence}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${prediction.confidence}%` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.8, ease: 'easeOut' }}
                    className={`h-full bg-gradient-to-r ${config.gradient} rounded-full`}
                  />
                </div>
              </div>

              {/* Hover Effect Arrow */}
              <motion.div
                initial={{ x: 0, opacity: 0 }}
                whileHover={{ x: 4, opacity: 1 }}
                className={`absolute bottom-6 right-6 ${config.text} text-xl`}
              >
                →
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* AI Insights Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="p-5 rounded-2xl bg-[#1C1F26] border border-[#232834] hover:border-purple-500/30 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <Clock className="w-5 h-5 text-purple-400" />
            <span className="text-white/70">Predictions Today</span>
          </div>
          <p className="text-3xl text-white mb-1">24</p>
          <p className="text-sm text-green-400">↑ 8 more than yesterday</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#1C1F26] border border-[#232834] hover:border-blue-500/30 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle2 className="w-5 h-5 text-blue-400" />
            <span className="text-white/70">Accuracy Rate</span>
          </div>
          <p className="text-3xl text-white mb-1">94.2%</p>
          <p className="text-sm text-blue-400">Last 30 days</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#1C1F26] border border-[#232834] hover:border-orange-500/30 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
            <span className="text-white/70">Active Alerts</span>
          </div>
          <p className="text-3xl text-white mb-1">3</p>
          <p className="text-sm text-orange-400">Requires attention</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
