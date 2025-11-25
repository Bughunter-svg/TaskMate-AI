import { motion } from 'motion/react';
import { Briefcase, User } from 'lucide-react';

interface CategorySummaryProps {
  category: 'Personal' | 'Business';
  totalTasks: number;
  completedTasks: number;
  index: number;
}

export function CategorySummary({ category, totalTasks, completedTasks, index }: CategorySummaryProps) {
  const isPersonal = category === 'Personal';
  const bgColor = isPersonal ? 'from-purple-600/20 to-purple-700/20' : 'from-orange-600/20 to-orange-700/20';
  const borderColor = isPersonal ? 'border-purple-600/30' : 'border-orange-600/30';
  const iconColor = isPersonal ? 'text-purple-500' : 'text-orange-500';
  const textColor = isPersonal ? 'text-purple-400' : 'text-orange-400';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.2, ease: 'easeOut' }}
      whileHover={{ scale: 1.02, transition: { duration: 0.15 } }}
      className={`relative rounded-xl bg-gradient-to-br ${bgColor} border ${borderColor} p-4 cursor-pointer`}
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isPersonal ? (
              <User className={`w-4 h-4 ${iconColor}`} />
            ) : (
              <Briefcase className={`w-4 h-4 ${iconColor}`} />
            )}
            <span className="text-white/90">{category}</span>
          </div>
          <div className={`text-xs ${textColor} px-2 py-1 rounded-md bg-black/20`}>
            {completedTasks}/{totalTasks}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="h-1.5 bg-black/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(completedTasks / totalTasks) * 100}%` }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.5, ease: 'easeOut' }}
              className={`h-full rounded-full ${isPersonal ? 'bg-purple-500' : 'bg-orange-500'}`}
            />
          </div>
          <p className="text-white/40 text-xs">
            {totalTasks - completedTasks} tasks remaining
          </p>
        </div>
      </div>
    </motion.div>
  );
}
