import { useState } from 'react';
import { motion } from 'motion/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Calendar, Clock, AlertCircle, Plus, Tag, X, Flag } from 'lucide-react';

interface AddTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: {
    title: string;
    description: string;
    category: 'Business' | 'Personal';
    assignee: string;
    scheduledDate: string;
    scheduledTime: string;
    deadline: string;
    priority: 'Low' | 'Medium' | 'High' | 'Critical';
    tags: string[];
  }) => void;
  mode: 'solo' | 'team';
}

const priorityConfig = {
  Low:      { color: 'text-green-400',  bg: 'bg-green-500/10 border-green-500/30',  dot: 'bg-green-500' },
  Medium:   { color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30', dot: 'bg-yellow-500' },
  High:     { color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30', dot: 'bg-orange-500' },
  Critical: { color: 'text-red-400',    bg: 'bg-red-500/10 border-red-500/30',       dot: 'bg-red-500' },
};

const SUGGESTED_TAGS = ['urgent', 'frontend', 'backend', 'meeting', 'review', 'design', 'bug', 'research'];

export function AddTaskDialog({ isOpen, onClose, onAddTask, mode }: AddTaskDialogProps) {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [category, setCategory] = useState<'Business' | 'Personal'>('Business');
  const [assignee, setAssignee] = useState('You');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const teamMembers = ['You', 'Alice Chen', 'Marcus Johnson', 'Rana Kumar', 'Suman Patel'];

  const addTag = (tag: string) => {
    const cleaned = tag.trim().toLowerCase().replace(/^#/, '');
    if (cleaned && !tags.includes(cleaned) && tags.length < 6) {
      setTags(prev => [...prev, cleaned]);
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => setTags(prev => prev.filter(t => t !== tag));

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    onAddTask({
      title: taskTitle.trim(),
      description: taskDescription.trim() || 'No description provided',
      category,
      assignee: mode === 'solo' ? 'You' : assignee,
      scheduledDate: scheduledDate || new Date().toISOString().split('T')[0],
      scheduledTime: scheduledTime || '',
      deadline: deadline || '',
      priority,
      tags,
    });

    // Reset
    setTaskTitle('');
    setTaskDescription('');
    setCategory('Business');
    setAssignee('You');
    setScheduledDate('');
    setScheduledTime('');
    setDeadline('');
    setPriority('Medium');
    setTags([]);
    setTagInput('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1C1F26] border-[#232834] text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Plus className="w-5 h-5 text-purple-500" />
            Create New Task
          </DialogTitle>
          <DialogDescription className="text-white/50">
            Add a new task to your {mode === 'solo' ? 'personal' : 'team'} workspace.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {/* Task Title */}
          <div className="space-y-2">
            <Label htmlFor="taskTitle" className="text-white/80">
              Task Name <span className="text-red-400">*</span>
            </Label>
            <Input
              id="taskTitle"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="Enter task name..."
              className="bg-[#15181E] border-[#232834] text-white placeholder:text-white/30 focus:border-purple-500/50"
              required
            />
          </div>

          {/* Task Description */}
          <div className="space-y-2">
            <Label htmlFor="taskDescription" className="text-white/80">Description</Label>
            <Textarea
              id="taskDescription"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              placeholder="Add task description..."
              className="bg-[#15181E] border-[#232834] text-white placeholder:text-white/30 focus:border-purple-500/50 min-h-[80px]"
            />
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label className="text-white/80 flex items-center gap-2">
              <Flag className="w-4 h-4" /> Priority
            </Label>
            <div className="grid grid-cols-4 gap-2">
              {(['Low', 'Medium', 'High', 'Critical'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`relative py-2 px-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                    priority === p
                      ? `${priorityConfig[p].bg} ${priorityConfig[p].color}`
                      : 'bg-[#15181E] border-[#232834] text-white/40 hover:text-white/70 hover:border-white/20'
                  }`}
                >
                  <span className="flex items-center justify-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${priority === p ? priorityConfig[p].dot : 'bg-white/20'}`} />
                    {p}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Category and Assignee Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-white/80">Category</Label>
              <Select value={category} onValueChange={(value: 'Business' | 'Personal') => setCategory(value)}>
                <SelectTrigger className="bg-[#15181E] border-[#232834] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1C1F26] border-[#232834]">
                  <SelectItem value="Business" className="text-white">Business</SelectItem>
                  <SelectItem value="Personal" className="text-white">Personal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {mode === 'team' && (
              <div className="space-y-2">
                <Label htmlFor="assignee" className="text-white/80">Assign To</Label>
                <Select value={assignee} onValueChange={setAssignee}>
                  <SelectTrigger className="bg-[#15181E] border-[#232834] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1C1F26] border-[#232834]">
                    {teamMembers.map((member) => (
                      <SelectItem key={member} value={member} className="text-white">{member}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label className="text-white/80 flex items-center gap-2">
              <Tag className="w-4 h-4" /> Tags <span className="text-white/30 text-xs font-normal">(optional, max 6)</span>
            </Label>
            {/* Tag pills + input */}
            <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-[#15181E] border border-[#232834] min-h-[42px] focus-within:border-purple-500/50 transition-colors">
              {tags.map((tag) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs"
                >
                  #{tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-white transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </motion.span>
              ))}
              {tags.length < 6 && (
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  onBlur={() => tagInput && addTag(tagInput)}
                  placeholder={tags.length === 0 ? 'Add tag and press Enter...' : ''}
                  className="flex-1 min-w-[120px] bg-transparent text-white/70 text-xs placeholder:text-white/25 outline-none"
                />
              )}
            </div>
            {/* Suggested tags */}
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_TAGS.filter(t => !tags.includes(t)).slice(0, 6).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => addTag(tag)}
                  className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/30 text-xs hover:bg-purple-500/10 hover:border-purple-500/20 hover:text-purple-400 transition-all duration-200"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Schedule Date and Time Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scheduledDate" className="text-white/80 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Scheduled Date
              </Label>
              <Input
                id="scheduledDate"
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="bg-[#15181E] border-[#232834] text-white focus:border-purple-500/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="scheduledTime" className="text-white/80 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Schedule Time
              </Label>
              <Input
                id="scheduledTime"
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="bg-[#15181E] border-[#232834] text-white focus:border-purple-500/50"
              />
            </div>
          </div>

          {/* Deadline */}
          <div className="space-y-2">
            <Label htmlFor="deadline" className="text-white/80 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Deadline <span className="text-white/40 text-xs font-normal">(optional)</span>
            </Label>
            <Input
              id="deadline"
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="bg-[#15181E] border-[#232834] text-white focus:border-purple-500/50"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="bg-transparent border-[#232834] text-white/70 hover:bg-[#15181E] hover:text-white"
            >
              Cancel
            </Button>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                disabled={!taskTitle.trim()}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white disabled:opacity-50"
              >
                Create Task
              </Button>
            </motion.div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
