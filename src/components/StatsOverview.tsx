import { motion } from 'motion/react';
import { Clock, Zap, CheckCircle2 } from 'lucide-react';

interface StatsOverviewProps {
  completedCount: number;
  inProgressCount: number;
  pendingCount: number;
}

export function StatsOverview({ completedCount, inProgressCount, pendingCount }: StatsOverviewProps) {
  const stats = [
    {
      label: 'Completed',
      count: completedCount,
      icon: CheckCircle2,
      accent: 'green',
      gradient: 'from-green-500/20 to-green-600/5',
      border: 'border-green-500/20',
      glow: 'shadow-green-500/20',
    },
    {
      label: 'In Progress',
      count: inProgressCount,
      icon: Zap,
      accent: 'purple',
      gradient: 'from-purple-500/20 to-purple-600/5',
      border: 'border-purple-500/20',
      glow: 'shadow-purple-500/20',
    },
    {
      label: 'Pending',
      count: pendingCount,
      icon: Clock,
      accent: 'orange',
      gradient: 'from-orange-500/20 to-orange-600/5',
      border: 'border-orange-500/20',
      glow: 'shadow-orange-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.25, ease: 'easeOut' }}
          whileHover={{ 
            y: -4, 
            transition: { duration: 0.2 } 
          }}
          className={`relative rounded-2xl bg-gradient-to-br ${stat.gradient} bg-[#1C1F26] border ${stat.border} p-6 hover:shadow-lg hover:${stat.glow} transition-all duration-200`}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/60 mb-2">{stat.label}</p>
              <motion.p 
                key={stat.count}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-white text-4xl"
              >
                {stat.count}
              </motion.p>
            </div>
            <div className={`p-3 rounded-xl bg-${stat.accent}-500/10`}>
              <stat.icon className={`w-6 h-6 text-${stat.accent}-500`} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}