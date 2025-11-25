import { motion } from 'motion/react';
import { User, Clock, Zap, Users, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import { useEffect, useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

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
  onDelete?: () => void;
  onClick?: () => void;
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
  onDelete,
  onClick
}: InProgressTaskCardProps) {
  const [progress, setProgress] = useState(initialProgress);
  const [isHovered, setIsHovered] = useState(false);

  // Simulate progress increasing over time
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + Math.random() * 2; // Random increment between 0-2%
      });
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.2, ease: 'easeOut' }}
      whileHover={{ 
        scale: 1.01,
        y: -2,
        transition: { duration: 0.15 }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className="relative rounded-xl bg-[#1C1F26] border border-[#232834] overflow-hidden hover:shadow-md hover:shadow-purple-500/10 transition-all duration-200 cursor-pointer group"
    >
      {/* Delete Button */}
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

      {/* Sharing Badge */}
      {isShared && (
        <div className="absolute top-3 right-3 z-10">
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-500/20 border border-blue-500/30">
            <Users className="w-3 h-3 text-blue-400" />
            <span className="text-xs text-blue-400">Sharing</span>
          </div>
        </div>
      )}

      {/* Task Image */}
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
        {/* Title */}
        <div className="flex items-start gap-2">
          <Zap className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
          <h4 className="text-white/90 line-clamp-2 leading-snug flex-1">
            {title}
          </h4>
        </div>

        {/* Description */}
        <p className="text-white/40 text-sm line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Assignee */}
        <div className="flex items-center gap-2">
          <Avatar className="w-5 h-5">
            <AvatarImage src="" />
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-xs">
              <User className="w-3 h-3" />
            </AvatarFallback>
          </Avatar>
          <span className="text-white/30 text-xs">{assignee}</span>
        </div>

        {/* Time info */}
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

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/40">Progress</span>
            <span className="text-purple-400">{Math.round(progress)}%</span>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Progress 
              value={progress} 
              className="h-1.5 bg-white/5"
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}