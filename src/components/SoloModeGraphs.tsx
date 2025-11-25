import { motion } from 'motion/react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Calendar } from 'lucide-react';

// Mock data for productivity over the week
const weeklyProductivityData = [
  { day: 'Mon', completed: 4, inProgress: 2, pending: 3 },
  { day: 'Tue', completed: 6, inProgress: 3, pending: 2 },
  { day: 'Wed', completed: 5, inProgress: 4, pending: 2 },
  { day: 'Thu', completed: 8, inProgress: 2, pending: 1 },
  { day: 'Fri', completed: 7, inProgress: 3, pending: 2 },
  { day: 'Sat', completed: 3, inProgress: 1, pending: 1 },
  { day: 'Sun', completed: 2, inProgress: 1, pending: 2 },
];

// Mock data for task completion trend
const completionTrendData = [
  { week: 'Week 1', tasks: 12 },
  { week: 'Week 2', tasks: 15 },
  { week: 'Week 3', tasks: 18 },
  { week: 'Week 4', tasks: 22 },
];

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

export function SoloModeGraphs() {
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
            📈 You're completing 38% more tasks compared to last month!
          </p>
        </div>
      </motion.div>
    </div>
  );
}
