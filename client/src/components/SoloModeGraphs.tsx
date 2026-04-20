import { useMemo } from 'react';
import { motion } from 'motion/react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Calendar, BarChart3 } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  status: 'Completed' | 'In Progress' | 'Pending';
  createdAt?: string;
  completedAt?: string;
}

interface SoloModeGraphsProps {
  tasks?: Task[];
}

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

export function SoloModeGraphs({ tasks = [] }: SoloModeGraphsProps) {
  // Compute weekly task distribution from real data
  const weeklyProductivityData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0=Sun

    // Initialize all days with zeros
    const weekData = days.map(day => ({
      day,
      completed: 0,
      inProgress: 0,
      pending: 0,
    }));

    // Count tasks by status — distribute across the current day if no createdAt
    tasks.forEach(task => {
      let dayIndex = dayOfWeek; // default to today
      if (task.createdAt) {
        const d = new Date(task.createdAt);
        dayIndex = d.getDay();
      }
      if (task.status === 'Completed') weekData[dayIndex].completed++;
      else if (task.status === 'In Progress') weekData[dayIndex].inProgress++;
      else if (task.status === 'Pending') weekData[dayIndex].pending++;
    });

    // Rotate so Monday is first
    return [...weekData.slice(1), weekData[0]];
  }, [tasks]);

  // Compute completion trend — group completed tasks by week
  const completionTrendData = useMemo(() => {
    const now = new Date();
    const weeks: { week: string; tasks: number }[] = [];

    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (i * 7 + now.getDay()));
      weekStart.setHours(0, 0, 0, 0);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);

      const count = tasks.filter(t => {
        if (t.status !== 'Completed') return false;
        if (!t.completedAt) return false;
        const d = new Date(t.completedAt);
        return d >= weekStart && d < weekEnd;
      }).length;

      weeks.push({ week: `Week ${4 - i}`, tasks: count });
    }

    return weeks;
  }, [tasks]);

  const totalCompleted = tasks.filter(t => t.status === 'Completed').length;
  const hasData = tasks.length > 0;

  // Calculate insight message
  const insightMessage = useMemo(() => {
    if (!hasData) return '📊 Create tasks to start tracking your completion trend!';
    if (totalCompleted === 0) return '🎯 Complete your first task to see your progress!';
    const rate = Math.round((totalCompleted / tasks.length) * 100);
    if (rate >= 70) return `📈 Outstanding! You've completed ${rate}% of your tasks!`;
    if (rate >= 40) return `📈 Good progress — ${rate}% completion rate. Keep going!`;
    return `💪 ${rate}% done so far. Focus on finishing in-progress tasks!`;
  }, [tasks, totalCompleted, hasData]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Weekly Task Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="rounded-2xl bg-[#1C1F26] border border-[#232834] p-6 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-200"
      >
        <div className="flex items-center gap-2 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-500/10">
            <Calendar className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-white">Weekly Task Distribution</h3>
            <p className="text-white/40 text-sm">Tasks by status across the week</p>
          </div>
        </div>

        {hasData ? (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={weeklyProductivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#232834" />
              <XAxis
                dataKey="day"
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
              <Bar dataKey="completed" fill="#22c55e" radius={[8, 8, 0, 0]} />
              <Bar dataKey="inProgress" fill="#a855f7" radius={[8, 8, 0, 0]} />
              <Bar dataKey="pending" fill="#f97316" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-[280px] gap-3">
            <BarChart3 className="w-12 h-12 text-white/10" />
            <p className="text-white/30 text-sm">No tasks yet — create one to see your chart</p>
          </div>
        )}
      </motion.div>

      {/* Completion Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut', delay: 0.1 }}
        className="rounded-2xl bg-[#1C1F26] border border-[#232834] p-6 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-200"
      >
        <div className="flex items-center gap-2 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-green-500/10">
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="text-white">Completion Trend</h3>
            <p className="text-white/40 text-sm">Monthly task completion progress</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={completionTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#232834" />
            <XAxis
              dataKey="week"
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
            <Line
              type="monotone"
              dataKey="tasks"
              stroke="#22c55e"
              strokeWidth={3}
              dot={{ fill: '#22c55e', strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Insight Badge */}
        <div className="mt-4 rounded-xl bg-green-500/10 border border-green-500/20 p-3">
          <p className="text-green-400 text-sm">
            {insightMessage}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
