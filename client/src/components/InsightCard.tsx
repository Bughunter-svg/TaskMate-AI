import { motion } from 'motion/react';
import { Sparkles, Clock, AlertTriangle } from 'lucide-react';

interface InsightCardProps {
  type: 'success' | 'warning' | 'info';
  message: string;
  index: number;
}

export function InsightCard({ type, message, index }: InsightCardProps) {
  const configs = {
    success: {
      icon: Sparkles,
      gradient: 'from-green-500/20 to-green-600/5',
      border: 'border-green-500/20',
      iconColor: 'text-green-400',
      iconBg: 'bg-green-500/10',
    },
    warning: {
      icon: AlertTriangle,
      gradient: 'from-orange-500/20 to-orange-600/5',
      border: 'border-orange-500/20',
      iconColor: 'text-orange-400',
      iconBg: 'bg-orange-500/10',
    },
    info: {
      icon: Clock,
      gradient: 'from-blue-500/20 to-blue-600/5',
      border: 'border-blue-500/20',
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-500/10',
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.25, ease: 'easeOut' }}
      whileHover={{ scale: 1.02, y: -2 }}
      className={`relative rounded-2xl bg-gradient-to-br ${config.gradient} bg-[#1C1F26] border ${config.border} p-5 hover:shadow-lg transition-all duration-200`}
    >
      <div className="flex items-start gap-4">
        <div className={`p-2.5 rounded-xl ${config.iconBg} flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${config.iconColor}`} />
        </div>
        <div className="flex-1">
          <p className="text-white/90 text-sm leading-relaxed">{message}</p>
        </div>
      </div>
    </motion.div>
  );
}
