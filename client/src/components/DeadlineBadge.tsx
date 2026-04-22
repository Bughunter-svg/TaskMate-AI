import { motion } from 'motion/react';
import { Clock, AlertTriangle, CheckCircle } from 'lucide-react';

interface DeadlineBadgeProps {
  deadline: string; // ISO datetime string
  status: 'Pending' | 'In Progress' | 'Completed';
  compact?: boolean;
}

function getDeadlineInfo(deadline: string, status: string) {
  if (!deadline || status === 'Completed') return null;

  const now = new Date();
  const due = new Date(deadline);
  const diffMs = due.getTime() - now.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMs < 0) {
    // Overdue
    const overdueMins = Math.abs(diffMins);
    const overdueHours = Math.abs(diffHours);
    const overdueDays = Math.abs(diffDays);
    let label = '';
    if (overdueDays > 0) label = `${overdueDays}d overdue`;
    else if (overdueHours > 0) label = `${overdueHours}h overdue`;
    else label = `${overdueMins}m overdue`;
    return { label, type: 'overdue' as const };
  } else if (diffHours < 24) {
    // Due today — urgent
    let label = '';
    if (diffHours > 0) label = `Due in ${diffHours}h`;
    else label = `Due in ${diffMins}m`;
    return { label, type: 'urgent' as const };
  } else if (diffDays <= 3) {
    return { label: `Due in ${diffDays}d`, type: 'soon' as const };
  } else {
    return { label: `Due ${due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`, type: 'normal' as const };
  }
}

const typeConfig = {
  overdue: {
    bg: 'bg-red-500/15 border-red-500/30',
    text: 'text-red-400',
    icon: AlertTriangle,
    pulse: true,
  },
  urgent: {
    bg: 'bg-orange-500/15 border-orange-500/30',
    text: 'text-orange-400',
    icon: Clock,
    pulse: true,
  },
  soon: {
    bg: 'bg-yellow-500/15 border-yellow-500/30',
    text: 'text-yellow-400',
    icon: Clock,
    pulse: false,
  },
  normal: {
    bg: 'bg-white/5 border-white/10',
    text: 'text-white/40',
    icon: Clock,
    pulse: false,
  },
};

export function DeadlineBadge({ deadline, status, compact = false }: DeadlineBadgeProps) {
  const info = getDeadlineInfo(deadline, status);
  if (!info) return null;

  const config = typeConfig[info.type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border ${config.bg} ${compact ? 'text-[10px]' : 'text-xs'}`}
    >
      {config.pulse ? (
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${info.type === 'overdue' ? 'bg-red-400' : 'bg-orange-400'}`} />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${info.type === 'overdue' ? 'bg-red-500' : 'bg-orange-500'}`} />
        </span>
      ) : (
        <Icon className={`w-3 h-3 ${config.text}`} />
      )}
      <span className={`font-medium ${config.text}`}>{info.label}</span>
    </motion.div>
  );
}

export { getDeadlineInfo };
