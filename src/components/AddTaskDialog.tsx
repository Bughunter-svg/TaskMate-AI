import { useState } from 'react';
import { motion } from 'motion/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Calendar, Clock, AlertCircle, Plus } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

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
  }) => void;
  mode: 'solo' | 'team';
}

export function AddTaskDialog({ isOpen, onClose, onAddTask, mode }: AddTaskDialogProps) {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [category, setCategory] = useState<'Business' | 'Personal'>('Business');
  const [assignee, setAssignee] = useState('You');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [deadline, setDeadline] = useState('');

  const teamMembers = ['You', 'Alice Chen', 'Marcus Johnson', 'Rana Kumar', 'Suman Patel'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!taskTitle.trim()) {
      toast.error('Task title is required');
      return;
    }

    if (!scheduledTime.trim()) {
      toast.error('Schedule time is required');
      return;
    }

    if (!deadline.trim()) {
      toast.error('Deadline is required');
      return;
    }

    // Create task object
    const newTask = {
      title: taskTitle,
      description: taskDescription || 'No description provided',
      category,
      assignee: mode === 'solo' ? 'You' : assignee,
      scheduledDate: scheduledDate || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      scheduledTime,
      deadline,
    };

    onAddTask(newTask);

    // Reset form
    setTaskTitle('');
    setTaskDescription('');
    setCategory('Business');
    setAssignee('You');
    setScheduledDate('');
    setScheduledTime('');
    setDeadline('');

    // Show success toast
    toast.success('Task created successfully!', {
      description: `${taskTitle} has been added to your tasks.`,
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1C1F26] border-[#232834] text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Plus className="w-5 h-5 text-purple-500" />
            Create New Task
          </DialogTitle>
          <DialogDescription className="text-white/50">
            Add a new task to your {mode === 'solo' ? 'personal' : 'team'} workspace.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
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
            />
          </div>

          {/* Task Description */}
          <div className="space-y-2">
            <Label htmlFor="taskDescription" className="text-white/80">
              Description
            </Label>
            <Textarea
              id="taskDescription"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              placeholder="Add task description..."
              className="bg-[#15181E] border-[#232834] text-white placeholder:text-white/30 focus:border-purple-500/50 min-h-[100px]"
            />
          </div>

          {/* Category and Assignee Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-white/80">
                Category
              </Label>
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

            {/* Assignee (only for team mode) */}
            {mode === 'team' && (
              <div className="space-y-2">
                <Label htmlFor="assignee" className="text-white/80">
                  Assign To
                </Label>
                <Select value={assignee} onValueChange={setAssignee}>
                  <SelectTrigger className="bg-[#15181E] border-[#232834] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1C1F26] border-[#232834]">
                    {teamMembers.map((member) => (
                      <SelectItem key={member} value={member} className="text-white">
                        {member}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Schedule Date and Time Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Scheduled Date */}
            <div className="space-y-2">
              <Label htmlFor="scheduledDate" className="text-white/80 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Scheduled Date
              </Label>
              <Input
                id="scheduledDate"
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="bg-[#15181E] border-[#232834] text-white focus:border-purple-500/50"
              />
            </div>

            {/* Scheduled Time */}
            <div className="space-y-2">
              <Label htmlFor="scheduledTime" className="text-white/80 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Schedule Time <span className="text-red-400">*</span>
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
              Deadline <span className="text-red-400">*</span>
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
          <div className="flex justify-end gap-3 pt-4">
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
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
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
