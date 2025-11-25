import { motion } from 'motion/react';
import { Clock, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';

interface TaskCardProps {
  title: string;
  description: string;
  category: string;
  categoryColor: string;
  deadline: string;
  status: 'online' | 'away' | 'busy';
  assignee?: string;
  index: number;
}

export function TaskCard({ 
  title, 
  description, 
  category, 
  categoryColor, 
  deadline, 
  status,
  assignee = 'You',
  index 
}: TaskCardProps) {
  const statusColors = {
    online: 'bg-green-500',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
  };

  const categoryGlow = {
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/30 hover:shadow-purple-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/30 hover:shadow-blue-500/20',
    green: 'bg-green-500/10 text-green-400 border-green-500/30 hover:shadow-green-500/20',
    orange: 'bg-orange-500/10 text-orange-400 border-orange-500/30 hover:shadow-orange-500/20',
    pink: 'bg-pink-500/10 text-pink-400 border-pink-500/30 hover:shadow-pink-500/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.25, ease: 'easeOut' }}
      whileHover={{ 
        scale: 1.02,
        y: -4,
        transition: { duration: 0.15 }
      }}
      className="relative rounded-2xl bg-[#1C1F26] border border-[#232834] p-6 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-200 cursor-pointer group"
    >
      <div className="space-y-4">
        {/* Category */}
        <Badge 
          variant="outline" 
          className={`rounded-lg px-3 py-1 border transition-all duration-150 ${categoryGlow[categoryColor as keyof typeof categoryGlow]}`}
        >
          {category}
        </Badge>

        {/* Title */}
        <h3 className="text-white line-clamp-2 pr-4">
          {title}
        </h3>

        {/* Description */}
        <p className="text-white/50 text-sm line-clamp-2">
          {description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Avatar className="w-7 h-7">
                <AvatarImage src="" />
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-xs">
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 ${statusColors[status]} rounded-full border border-[#1C1F26]`} />
            </div>
            <span className="text-white/40 text-sm">{assignee}</span>
          </div>

          <div className="flex items-center gap-1.5 text-white/40">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs">{deadline}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
