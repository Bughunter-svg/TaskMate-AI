import { useDrag } from 'react-dnd';
import { motion } from 'motion/react';

interface DraggableTaskCardProps {
  taskId: string;
  status: 'Completed' | 'In Progress' | 'Pending';
  children: React.ReactNode;
}

export function DraggableTaskCard({ taskId, status, children }: DraggableTaskCardProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TASK',
    item: { taskId, currentStatus: status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <motion.div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
      }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.15 }}
    >
      {children}
    </motion.div>
  );
}
