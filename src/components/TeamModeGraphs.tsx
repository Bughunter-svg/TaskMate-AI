import { motion } from 'motion/react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Users, Activity } from 'lucide-react';

// Mock data for task distribution by team member
const teamTaskDistribution = [
  { name: 'Rana Kumar', value: 23, color: '#a855f7' },
  { name: 'Alice Chen', value: 14, color: '#3b82f6' },
  { name: 'Suman Patel', value: 17, color: '#f97316' },
  { name: 'Marcus Johnson', value: 19, color: '#22c55e' },
  { name: 'You', value: 8, color: '#ec4899' },
];

// Mock data for team velocity over time
const teamVelocityData = [
  { sprint: 'Sprint 1', velocity: 45, capacity: 50 },
  { sprint: 'Sprint 2', velocity: 52, capacity: 55 },
  { sprint: 'Sprint 3', velocity: 58, capacity: 60 },
  { sprint: 'Sprint 4', velocity: 63, capacity: 65 },
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

// Custom label for pie chart
const renderCustomLabel = (entry: any) => {
  return `${entry.value}`;
};

export function TeamModeGraphs() {
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
            🚀 Team velocity increased by 40% over the last 4 sprints!
          </p>
        </div>
      </motion.div>
    </div>
  );
}
