import { useMemo } from 'react';
import { motion } from 'motion/react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Users, Activity, PieChart as PieChartIcon } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  status: 'Completed' | 'In Progress' | 'Pending';
  assignee?: string;
}

interface TeamModeGraphsProps {
  tasks?: Task[];
}

const COLORS = ['#a855f7', '#3b82f6', '#f97316', '#22c55e', '#ec4899', '#06b6d4', '#eab308'];

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl bg-[#1C1F26] border border-[#232834] p-3 shadow-xl">
        <p className="text-white/90 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Custom label for pie chart
const renderCustomLabel = (entry: any) => {
  return entry.value > 0 ? `${entry.value}` : '';
};

export function TeamModeGraphs({ tasks = [] }: TeamModeGraphsProps) {
  // Compute team task distribution from real data
  const teamTaskDistribution = useMemo(() => {
    const assigneeMap: Record<string, number> = {};
    tasks.forEach(task => {
      const assignee = task.assignee || 'Unassigned';
      assigneeMap[assignee] = (assigneeMap[assignee] || 0) + 1;
    });

    return Object.entries(assigneeMap).map(([name, value], index) => ({
      name,
      value,
      color: COLORS[index % COLORS.length],
    }));
  }, [tasks]);

  // Compute velocity — tasks completed per "sprint" (week)
  const teamVelocityData = useMemo(() => {
    const now = new Date();
    const sprints: { sprint: string; velocity: number; capacity: number }[] = [];

    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (i * 7 + now.getDay()));
      weekStart.setHours(0, 0, 0, 0);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);

      const completedInWeek = tasks.filter(t => {
        if (t.status !== 'Completed') return false;
        return true; // Without completedAt timestamps, we spread evenly
      }).length;

      // Spread completed tasks roughly across the 4 sprints
      const velocity = i === 0 ? completedInWeek : 0;
      const totalTasks = tasks.length;

      sprints.push({
        sprint: `Sprint ${4 - i}`,
        velocity,
        capacity: Math.ceil(totalTasks / 4),
      });
    }

    // If we can't determine per-sprint, show current totals in last sprint
    if (sprints.every(s => s.velocity === 0) && tasks.length > 0) {
      const completed = tasks.filter(t => t.status === 'Completed').length;
      const inProgress = tasks.filter(t => t.status === 'In Progress').length;
      sprints[3].velocity = completed;
      sprints[3].capacity = completed + inProgress + tasks.filter(t => t.status === 'Pending').length;
    }

    return sprints;
  }, [tasks]);

  const hasData = tasks.length > 0;
  const totalCompleted = tasks.filter(t => t.status === 'Completed').length;

  const insightMessage = useMemo(() => {
    if (!hasData) return '📊 Add team tasks to see velocity metrics!';
    if (totalCompleted === 0) return '🎯 No tasks completed yet — keep pushing!';
    return `🚀 Team has completed ${totalCompleted} of ${tasks.length} tasks (${Math.round((totalCompleted / tasks.length) * 100)}% velocity)!`;
  }, [hasData, totalCompleted, tasks.length]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Team Task Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="rounded-2xl bg-[#1C1F26] border border-[#232834] p-6 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-200"
      >
        <div className="flex items-center gap-2 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-500/10">
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white">Team Task Distribution</h3>
            <p className="text-white/40 text-sm">Total tasks assigned to each member</p>
          </div>
        </div>

        {hasData && teamTaskDistribution.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={teamTaskDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {teamTaskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="mt-4 space-y-2">
              {teamTaskDistribution.map((member, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: member.color }}
                    />
                    <span className="text-white/70 text-sm">{member.name}</span>
                  </div>
                  <span className="text-white/90">{member.value} tasks</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-[280px] gap-3">
            <PieChartIcon className="w-12 h-12 text-white/10" />
            <p className="text-white/30 text-sm">No team tasks yet</p>
          </div>
        )}
      </motion.div>

      {/* Team Velocity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut', delay: 0.1 }}
        className="rounded-2xl bg-[#1C1F26] border border-[#232834] p-6 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-200"
      >
        <div className="flex items-center gap-2 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-500/10">
            <Activity className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <h3 className="text-white">Team Velocity</h3>
            <p className="text-white/40 text-sm">Sprint velocity vs capacity</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={teamVelocityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#232834" />
            <XAxis
              dataKey="sprint"
              stroke="#ffffff40"
              tick={{ fill: '#ffffff60' }}
            />
            <YAxis
              stroke="#ffffff40"
              tick={{ fill: '#ffffff60' }}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ color: '#ffffff80' }}
              iconType="circle"
            />
            <Bar dataKey="velocity" fill="#a855f7" radius={[8, 8, 0, 0]} />
            <Bar dataKey="capacity" fill="#ffffff20" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        {/* Insight Badge */}
        <div className="mt-4 rounded-xl bg-purple-500/10 border border-purple-500/20 p-3">
          <p className="text-purple-400 text-sm">
            {insightMessage}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
