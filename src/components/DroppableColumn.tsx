import { useDrop } from 'react-dnd';
import { motion } from 'motion/react';

interface DroppableColumnProps {
  status: 'Completed' | 'In Progress' | 'Pending';
  onDrop: (taskId: string, newStatus: 'Completed' | 'In Progress' | 'Pending') => void;
  children: React.ReactNode;
  color: 'green' | 'purple' | 'orange';
}

export function DroppableColumn({ status, onDrop, children, color }: DroppableColumnProps) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'TASK',
    drop: (item: { taskId: string; currentStatus: string }) => {
      if (item.currentStatus !== status) {
        onDrop(item.taskId, status);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const colorClasses = {
    green: 'bg-green-500/20 border-green-500/50',
    purple: 'bg-purple-500/20 border-purple-500/50',
    orange: 'bg-orange-500/20 border-orange-500/50',
  };

  return (
    <motion.div
      ref={drop}
      className={`relative transition-all duration-200 ${
        isOver && canDrop ? `${colorClasses[color]} border-2 border-dashed` : ''
      }`}
      style={{
        minHeight: '400px',
      }}
    >
      {children}
      {isOver && canDrop && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 rounded-2xl bg-white/5 backdrop-blur-sm flex items-center justify-center pointer-events-none z-10"
        >
          <div className={`px-6 py-3 rounded-xl ${colorClasses[color]} border-2`}>
            <p className="text-white">Drop task here to move to {status}</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
