import { useRef } from 'react';
import { useDrag } from 'react-dnd';
import { motion } from 'motion/react';

type TaskStatus = 'Completed' | 'In Progress' | 'Pending';

interface DraggableTaskCardProps {
  taskId: string;
  status: TaskStatus;
  children: React.ReactNode;
}

export function DraggableTaskCard({
  taskId,
  status,
  children,
}: DraggableTaskCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TASK',
    item: { taskId, currentStatus: status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  drag(ref);

  return (
    <motion.div
      ref={ref}
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
