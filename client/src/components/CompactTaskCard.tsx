import { motion } from 'motion/react';
import { User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';

interface CompactTaskCardProps {
  title: string;
  description: string;
  status: 'Backlog' | 'In Progress' | 'Completed';
  assignee?: string;
  index: number;
}

export function CompactTaskCard({ 
  title, 
  description, 
  status,
  assignee = 'You',
  index 
}: CompactTaskCardProps) {
  const statusConfig = {
    'Backlog': {
      bg: 'bg-orange-500/15',
      text: 'text-orange-400',
      border: 'border-orange-500/30',
      dot: 'bg-orange-500',
    },
    'In Progress': {
      bg: 'bg-purple-500/15',
      text: 'text-purple-400',
      border: 'border-purple-500/30',
      dot: 'bg-purple-500',
    },
    'Completed': {
      bg: 'bg-green-500/15',
      text: 'text-green-400',
      border: 'border-green-500/30',
      dot: 'bg-green-500',
    },
  };

  const config = statusConfig[status];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.03, duration: 0.2, ease: 'easeOut' }}
      whileHover={{ 
        scale: 1.02,
        y: -2,
        transition: { duration: 0.15 }
      }}
      className="relative rounded-xl bg-[#1C1F26] border border-[#232834] p-4 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-200 cursor-pointer group"
    >
      <div className="space-y-3">
        {/* Status Badge */}
        <Badge 
          variant="outline" 
          className={`rounded-md px-2 py-0.5 border ${config.border} ${config.bg} ${config.text} text-xs flex items-center gap-1.5 w-fit`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
          {status}
        </Badge>

        {/* Title */}
        <h4 className="text-white line-clamp-2 leading-snug">
          {title}
        </h4>

        {/* Description */}
        <p className="text-white/40 text-sm line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Avatar */}
        <div className="flex items-center gap-2 pt-1">
          <Avatar className="w-6 h-6">
            <AvatarImage src="" />
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-xs">
              <User className="w-3 h-3" />
            </AvatarFallback>
          </Avatar>
          <span className="text-white/30 text-xs">{assignee}</span>
        </div>
      </div>
    </motion.div>
  );
}
