import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, User, Tag, Flag, TrendingUp, Image as ImageIcon } from 'lucide-react';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'Completed' | 'In Progress' | 'Pending';
  completedBy?: string;
  assignee: string;
  category: 'Business' | 'Personal';
  isShared?: boolean;
  sharedWith?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  startedAt?: string;
  progress?: number;
  imageUrl?: string;
  deadline?: string;
}

interface TaskDetailDialogProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TaskDetailDialog({ task, isOpen, onClose }: TaskDetailDialogProps) {
  if (!task) return null;

  const statusColors = {
    'Completed': 'bg-green-500/10 text-green-400 border-green-500/20',
    'In Progress': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    'Pending': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  };

  const categoryColors = {
    'Business': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'Personal': 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-[#1C1F26] border border-[#232834] rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 z-10 p-2 rounded-xl bg-[#15181E] border border-[#232834] text-white/60 hover:text-white hover:bg-[#1C1F26] transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header with Image */}
              {task.imageUrl && (
                <div className="relative h-48 w-full overflow-hidden bg-[#15181E]">
                  <ImageWithFallback
                    src={task.imageUrl}
                    alt={task.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C1F26] to-transparent" />
                </div>
              )}

              {/* Content */}
              <div className={`p-8 ${task.imageUrl ? '-mt-12 relative z-10' : ''}`}>
                {/* Title and Status */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <h2 className="text-white text-2xl flex-1">{task.title}</h2>
                    <Badge className={`${statusColors[task.status]} border px-3 py-1`}>
                      {task.status}
                    </Badge>
                  </div>
                  
                  <p className="text-white/60 leading-relaxed">{task.description}</p>
                </div>

                {/* Progress Bar for In Progress tasks */}
                {task.status === 'In Progress' && task.progress !== undefined && (
                  <div className="mb-6 p-4 rounded-xl bg-[#15181E] border border-[#232834]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/80 text-sm">Task Progress</span>
                      <span className="text-purple-400">{task.progress}%</span>
                    </div>
                    <Progress value={task.progress} className="h-2" />
                  </div>
                )}

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {/* Assignee */}
                  <div className="p-4 rounded-xl bg-[#15181E] border border-[#232834]">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-purple-500/10">
                        <User className="w-4 h-4 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-white/40 text-xs mb-1">Assigned To</p>
                        <p className="text-white/90 text-sm">{task.assignee}</p>
                      </div>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="p-4 rounded-xl bg-[#15181E] border border-[#232834]">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-500/10">
                        <Tag className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-white/40 text-xs mb-1">Category</p>
                        <Badge className={`${categoryColors[task.category]} border text-xs`}>
                          {task.category}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Scheduled Time */}
                  {(task.scheduledTime || task.scheduledDate) && (
                    <div className="p-4 rounded-xl bg-[#15181E] border border-[#232834]">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-green-500/10">
                          <Clock className="w-4 h-4 text-green-400" />
                        </div>
                        <div>
                          <p className="text-white/40 text-xs mb-1">Scheduled</p>
                          <p className="text-white/90 text-sm">
                            {task.scheduledDate && <span>{task.scheduledDate} </span>}
                            {task.scheduledTime && <span>at {task.scheduledTime}</span>}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Deadline */}
                  {task.deadline && (
                    <div className="p-4 rounded-xl bg-[#15181E] border border-[#232834]">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-red-500/10">
                          <Flag className="w-4 h-4 text-red-400" />
                        </div>
                        <div>
                          <p className="text-white/40 text-xs mb-1">Deadline</p>
                          <p className="text-white/90 text-sm">{task.deadline}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Started At (for In Progress) */}
                  {task.status === 'In Progress' && task.startedAt && (
                    <div className="p-4 rounded-xl bg-[#15181E] border border-[#232834]">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-500/10">
                          <TrendingUp className="w-4 h-4 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-white/40 text-xs mb-1">Started</p>
                          <p className="text-white/90 text-sm">{task.startedAt}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Completed By */}
                  {task.status === 'Completed' && task.completedBy && (
                    <div className="p-4 rounded-xl bg-[#15181E] border border-[#232834]">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-green-500/10">
                          <User className="w-4 h-4 text-green-400" />
                        </div>
                        <div>
                          <p className="text-white/40 text-xs mb-1">Completed By</p>
                          <p className="text-white/90 text-sm">{task.completedBy}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Shared Info */}
                {task.isShared && task.sharedWith && (
                  <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                    <div className="flex items-center gap-2 text-blue-400 text-sm">
                      <User className="w-4 h-4" />
                      <span>Shared with {task.sharedWith}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
