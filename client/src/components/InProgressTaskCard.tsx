import { motion } from 'motion/react';
import { User, Clock, Zap, Users, Trash2, Tag, Focus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import { useEffect, useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { DeadlineBadge } from './DeadlineBadge';

type Priority = 'Low' | 'Medium' | 'High' | 'Critical';

const priorityConfig: Record<Priority, { dot: string; text: string; border: string; bg: string }> = {
  Low:      { dot: 'bg-green-500',  text: 'text-green-400',  border: 'border-green-500/20',  bg: 'bg-green-500/10' },
  Medium:   { dot: 'bg-yellow-500', text: 'text-yellow-400', border: 'border-yellow-500/20', bg: 'bg-yellow-500/10' },
  High:     { dot: 'bg-orange-500', text: 'text-orange-400', border: 'border-orange-500/20', bg: 'bg-orange-500/10' },
  Critical: { dot: 'bg-red-500',    text: 'text-red-400',    border: 'border-red-500/20',    bg: 'bg-red-500/10' },
};

interface InProgressTaskCardProps {
  title: string;
  description: string;
  scheduledTime: string;
  startedAt: string;
  assignee: string;
  initialProgress: number;
  index: number;
  imageUrl?: string;
  isShared?: boolean;
  deadline?: string;
  priority?: Priority;
  tags?: string[];
  taskId?: string;
  onDelete?: () => void;
  onClick?: () => void;
  onFocus?: (taskId: string, title: string) => void;
}

export function InProgressTaskCard({
  title,
  description,
  scheduledTime,
  startedAt,
  assignee,
  initialProgress,
  index,
  imageUrl,
  isShared,
  deadline = '',
  priority = 'Medium',
  tags = [],
  taskId,
  onDelete,
  onClick,
  onFocus,
}: InProgressTaskCardProps) {
  const [progress, setProgress] = useState(
    Math.min(Math.max(initialProgress ?? 0, 0), 100)
  );
  const [isHovered, setIsHovered] = useState(false);
  const pc = priorityConfig[priority];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return Math.min(prev + Math.random() * 2, 100);
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.2, ease: 'easeOut' }}
      whileHover={{ scale: 1.01, y: -2, transition: { duration: 0.15 } }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className="relative rounded-xl bg-[#1C1F26] border border-[#232834] overflow-hidden hover:shadow-md hover:shadow-purple-500/10 transition-all duration-200 cursor-pointer group"
    >
      {onDelete && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
          transition={{ duration: 0.15 }}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute top-3 left-3 z-20 p-1.5 rounded-lg bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5 text-red-400" />
        </motion.button>
      )}

      {/* Focus button — appears on hover */}
      {onFocus && taskId && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
          transition={{ duration: 0.15 }}
          onClick={(e) => {
            e.stopPropagation();
            onFocus(taskId, title);
          }}
          className="absolute top-3 right-3 z-20 flex items-center gap-1 px-2 py-1.5 rounded-lg bg-purple-500/20 border border-purple-500/30 hover:bg-purple-500/30 transition-colors"
          title="Start Focus Session"
        >
          <Focus className="w-3 h-3 text-purple-400" />
          <span className="text-purple-400 text-[10px] font-medium">Focus</span>
        </motion.button>
      )}

      {isShared && !isHovered && (
        <div className="absolute top-3 right-3 z-10">
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-500/20 border border-blue-500/30">
            <Users className="w-3 h-3 text-blue-400" />
            <span className="text-xs text-blue-400">Sharing</span>
          </div>
        </div>
      )}

      {imageUrl && (
        <div className="w-full h-32 overflow-hidden bg-white/5">
          <ImageWithFallback
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-4 space-y-3">
        {/* Priority + Title */}
        <div className="flex items-start gap-2">
          <Zap className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium border ${pc.bg} ${pc.border} ${pc.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${pc.dot}`} />
                {priority}
              </span>
              {deadline && (
                <DeadlineBadge deadline={deadline} status="In Progress" compact />
              )}
            </div>
            <h4 className="text-white/90 line-clamp-2 leading-snug flex-1">
              {title}
            </h4>
          </div>
        </div>

        <p className="text-white/40 text-sm line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag) => (
              <span key={tag} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px]">
                <Tag className="w-2.5 h-2.5" />#{tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-[10px] text-white/20">+{tags.length - 3}</span>
            )}
          </div>
        )}

        <div className="flex items-center gap-2">
          <Avatar className="w-5 h-5">
            <AvatarImage src={undefined} />
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-xs">
              <User className="w-3 h-3" />
            </AvatarFallback>
          </Avatar>
          <span className="text-white/30 text-xs">{assignee}</span>
        </div>

        <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5">
          <div className="flex items-center gap-1.5 text-white/40">
            <Clock className="w-3 h-3" />
            <span>{scheduledTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-purple-400">Today</span>
            <span className="text-white/30">• Started {startedAt}</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/40">Progress</span>
            <span className="text-purple-400">{Math.round(progress)}%</span>
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Progress value={progress} className="h-1.5 bg-white/5" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
