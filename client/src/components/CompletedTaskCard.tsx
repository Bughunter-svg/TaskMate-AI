import { motion } from 'motion/react';
import { User, CheckCircle2, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useState } from 'react';

interface CompletedTaskCardProps {
  title: string;
  description: string;
  completedBy: string;
  index: number;
  onDelete?: () => void;
  onClick?: () => void;
}

export function CompletedTaskCard({ 
  title, 
  description, 
  completedBy,
  index,
  onDelete,
  onClick
}: CompletedTaskCardProps) {
  const [isHovered, setIsHovered] = useState(false);

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
      className="relative rounded-xl bg-[#1C1F26] border border-[#232834] p-4 hover:shadow-md hover:shadow-green-500/10 transition-all duration-200 cursor-pointer group"
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
          className="absolute top-3 right-3 z-20 p-1.5 rounded-lg bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5 text-red-400" />
        </motion.button>
      )}

      <div className="space-y-3">
        {/* Title */}
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
          <h4 className="text-white/90 line-clamp-2 leading-snug flex-1">
            {title}
          </h4>
        </div>

        {/* Description */}
        <p className="text-white/40 text-sm line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Done by */}
        <div className="flex items-center gap-2 pt-1 border-t border-white/5">
          <Avatar className="w-5 h-5">
            <AvatarImage src="" />
            <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-500 text-white text-xs">
              <User className="w-3 h-3" />
            </AvatarFallback>
          </Avatar>
          <span className="text-white/30 text-xs">Done by {completedBy}</span>
        </div>
      </div>
    </motion.div>
  );
}