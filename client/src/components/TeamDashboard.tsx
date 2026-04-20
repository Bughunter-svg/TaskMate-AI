import { useMemo } from 'react';
import { motion } from 'motion/react';
import { User, TrendingUp, AlertCircle, CheckCircle, Inbox } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';

interface Task {
  id: string;
  title: string;
  status: 'Completed' | 'In Progress' | 'Pending';
  assignee?: string;
}

interface TeamMember {
  name: string;
  avatar?: string;
  tasksDone: number;
  tasksPending: number;
  totalTasks: number;
  status: 'on-track' | 'slight-delay' | 'at-risk';
}

interface TeamDashboardProps {
  tasks?: Task[];
}

export function TeamDashboard({ tasks = [] }: TeamDashboardProps) {
  // Compute team members from real task data
  const teamMembers = useMemo((): TeamMember[] => {
    const assigneeMap: Record<string, { done: number; pending: number; inProgress: number }> = {};

    tasks.forEach(task => {
      const assignee = task.assignee || 'Unassigned';
      if (!assigneeMap[assignee]) {
        assigneeMap[assignee] = { done: 0, pending: 0, inProgress: 0 };
      }
      if (task.status === 'Completed') assigneeMap[assignee].done++;
      else if (task.status === 'In Progress') assigneeMap[assignee].inProgress++;
      else assigneeMap[assignee].pending++;
    });

    return Object.entries(assigneeMap).map(([name, stats]) => {
      const total = stats.done + stats.pending + stats.inProgress;
      const completionRate = total > 0 ? (stats.done / total) * 100 : 0;

      let status: TeamMember['status'] = 'on-track';
      if (completionRate < 40 && stats.pending > stats.done) {
        status = 'at-risk';
      } else if (completionRate < 60 && stats.inProgress > 0) {
        status = 'slight-delay';
      }

      return {
        name,
        tasksDone: stats.done,
        tasksPending: stats.pending + stats.inProgress,
        totalTasks: total,
        status,
      };
    });
  }, [tasks]);

  const getStatusConfig = (status: TeamMember['status']) => {
    switch (status) {
      case 'on-track':
        return {
          icon: CheckCircle,
          label: 'On Track',
          color: 'text-green-400',
          bg: 'bg-green-500/10',
          border: 'border-green-500/30',
        };
      case 'slight-delay':
        return {
          icon: AlertCircle,
          label: 'Slight Delay',
          color: 'text-yellow-400',
          bg: 'bg-yellow-500/10',
          border: 'border-yellow-500/30',
        };
      case 'at-risk':
        return {
          icon: TrendingUp,
          label: 'At Risk',
          color: 'text-orange-400',
          bg: 'bg-orange-500/10',
          border: 'border-orange-500/30',
        };
    }
  };

  if (teamMembers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3 rounded-2xl bg-[#1C1F26] border border-[#232834]">
        <Inbox className="w-12 h-12 text-white/10" />
        <p className="text-white/30 text-sm">No team members yet — assign tasks to team members to see performance</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {teamMembers.map((member, index) => {
        const progress = member.totalTasks > 0 ? (member.tasksDone / member.totalTasks) * 100 : 0;
        const statusConfig = getStatusConfig(member.status);
        const StatusIcon = statusConfig.icon;

        return (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08, duration: 0.25, ease: 'easeOut' }}
            whileHover={{ scale: 1.01, x: 4 }}
            className="relative rounded-2xl bg-[#1C1F26] border border-[#232834] p-6 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-200"
          >
            <div className="grid grid-cols-12 gap-6 items-center">
              {/* Avatar + Name */}
              <div className="col-span-12 md:col-span-3 flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                    <User className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-white">{member.name}</p>
                  <p className="text-white/40 text-sm">{member.totalTasks} tasks</p>
                </div>
              </div>

              {/* Stats */}
              <div className="col-span-6 md:col-span-2 text-center">
                <p className="text-green-400">{member.tasksDone}</p>
                <p className="text-white/40 text-sm">Done</p>
              </div>

              <div className="col-span-6 md:col-span-2 text-center">
                <p className="text-purple-400">{member.tasksPending}</p>
                <p className="text-white/40 text-sm">Pending</p>
              </div>

              {/* Progress Bar */}
              <div className="col-span-12 md:col-span-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Progress</span>
                  <span className="text-white/90">{Math.round(progress)}%</span>
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  <Progress 
                    value={progress} 
                    className="h-2 bg-white/5"
                  />
                </motion.div>
              </div>

              {/* Status Badge */}
              <div className="col-span-12 md:col-span-2 flex justify-end">
                <Badge 
                  variant="outline"
                  className={`${statusConfig.bg} ${statusConfig.color} ${statusConfig.border} border rounded-lg px-3 py-1 flex items-center gap-1.5`}
                >
                  <StatusIcon className="w-3.5 h-3.5" />
                  {statusConfig.label}
                </Badge>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
