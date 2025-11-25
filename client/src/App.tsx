import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'motion/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Toaster, toast } from 'sonner';
import { Plus } from 'lucide-react';

import { LoginPage } from './components/LoginPage';
import { SignUpPage } from './components/SignUpPage';
import { TopBar } from './components/TopBar';
import { StatsOverview } from './components/StatsOverview';
import { CompletedTaskCard } from './components/CompletedTaskCard';
import { InProgressTaskCard } from './components/InProgressTaskCard';
import { PendingTaskCard } from './components/PendingTaskCard';
import { TeamDashboard } from './components/TeamDashboard';
import { CategorySummary } from './components/CategorySummary';
import { RemindersPopover } from './components/RemindersPopover';
import { EnhancedAIChatButton } from './components/EnhancedAIChatButton';
import { NavigationTabs } from './components/NavigationTabs';
import { DailyTimeline } from './components/DailyTimeline';
import { SchedulePage } from './components/SchedulePage';
import { TaskCompletionOverlay } from './components/TaskCompletionOverlay';
import { SoloModeGraphs } from './components/SoloModeGraphs';
import { TeamModeGraphs } from './components/TeamModeGraphs';
import { BehaviorStudyAdvices } from './components/BehaviorStudyAdvices';
import { EnhancedPredictionIntelligence } from './components/EnhancedPredictionIntelligence';
import { DraggableTaskCard } from './components/DraggableTaskCard';
import { DroppableColumn } from './components/DroppableColumn';
import { AddTaskDialog } from './components/AddTaskDialog';
import { TaskDetailDialog } from './components/TaskDetailDialog';
import { DailyReportAnalysis } from './components/DailyReportAnalysis';
import { ThanosSnapOverlay } from './components/ThanosSnapOverlay';
import { WelcomeBanner } from './components/WelcomeBanner';

// ✅ Socket connection (works with your backend URL from .env)
const socket = io(import.meta.env.VITE_BACKEND_URL);

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'Completed' | 'In Progress' | 'Pending';
  completedBy?: string;
  assignee: string;
  category: 'Business' | 'Personal';
  isShared?: boolean;
  sharedWith?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  startedAt?: string;
  progress?: number;
  imageUrl?: string;
  deadline?: string;
}

// your initialTasks array (Note: I've added a placeholder comment since the actual array content wasn't provided)
const initialTasks: Task[] = [
    // Add your existing task objects here, e.g.:
    // { id: 't1', title: 'Finish Project Report', description: 'Draft final quarter analysis.', status: 'Pending', assignee: 'You', category: 'Business', deadline: '2025-11-15' },
];

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; username: string } | null>(null);
  const [showSignUp, setShowSignUp] = useState(false);
  const [mode, setMode] = useState<'solo' | 'team'>('solo');
  const [activeTab, setActiveTab] = useState<'projects' | 'schedule' | 'team'>('projects');
  const [showCompletionOverlay, setShowCompletionOverlay] = useState(false);
  const [completedTaskTitle, setCompletedTaskTitle] = useState('');
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
  const [showThanosSnap, setShowThanosSnap] = useState(false);
  const [snapTaskTitle, setSnapTaskTitle] = useState('');
  const [nextTask, setNextTask] = useState<{ title: string; date?: string; time?: string } | null>(null);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    pendingTasks: 0,
  });

  // ✅ Socket.io Listener
  useEffect(() => {
    socket.on('userStatsUpdated', (newStats) => setStats(newStats));
    return () => socket.off('userStatsUpdated');
  }, []);

  // ✅ Add Task Handler
  const handleAddTask = (taskData: {
    title: string;
    description: string;
    category: 'Business' | 'Personal';
    assignee: string;
    scheduledDate: string;
    scheduledTime: string;
    deadline: string;
  }) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: taskData.title,
      description: taskData.description,
      status: 'Pending',
      assignee: taskData.assignee,
      category: taskData.category,
      scheduledDate: taskData.scheduledDate,
      scheduledTime: taskData.scheduledTime,
      deadline: taskData.deadline,
      isShared: false,
    };
    setTasks((prev) => [...prev, newTask]);
  };

  // ✅ Delete Task Handler
  const handleDeleteTask = (taskId: string) => {
    const taskToDelete = tasks.find((t) => t.id === taskId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (taskToDelete)
      toast.success('Task deleted', { description: `${taskToDelete.title} has been removed.` });
  };

  // ✅ Task Drop (Drag & Drop)
  const handleTaskDrop = (taskId: string, newStatus: 'Completed' | 'In Progress' | 'Pending') => {
    const movedTask = tasks.find((t) => t.id === taskId);
    if (!movedTask) return;

    if (newStatus === 'Completed') {
      setSnapTaskTitle(movedTask.title);
      const upcomingTask = tasks.find((t) => t.id !== taskId && t.status !== 'Completed');
      setNextTask(upcomingTask ? { title: upcomingTask.title, date: upcomingTask.scheduledDate, time: upcomingTask.scheduledTime } : null);
      setShowThanosSnap(true);
    } else {
      toast.success(`Task moved to ${newStatus}`, { description: movedTask.title });
    }

    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, status: newStatus, completedBy: newStatus === 'Completed' ? task.assignee : undefined } : task))
    );
  };

  // ✅ Filtered Data
  const soloTasks = tasks.filter((t) => t.assignee === 'You');
  const personalTasks = soloTasks.filter((t) => t.category === 'Personal');
  const businessTasks = soloTasks.filter((t) => t.category === 'Business');
  const personalCompleted = personalTasks.filter((t) => t.status === 'Completed').length;
  const businessCompleted = businessTasks.filter((t) => t.status === 'Completed').length;

  // ✅ Login / Signup Handlers - FIX APPLIED HERE
  const handleLogin = (userData: { name?: string; email: string; username: string }) => {
    setCurrentUser({
      name: userData.name || userData.username,
      ...userData,
    });
    setIsLoggedIn(true); // Set login state to true
    toast.success(`Welcome back, ${userData.name || userData.username}!`);
  };

  const handleSignUp = (userData: { name?: string; email: string; username: string }) => {
    setCurrentUser({
      name: userData.name || userData.username,
      ...userData,
    });
    setIsLoggedIn(true); // Set login state to true
    toast.success(`Welcome ${userData.name || userData.username}!`);
  };

  // ✅ Conditional Rendering - HANDLERS USED HERE
  if (!isLoggedIn && showSignUp) return <SignUpPage onSignUp={handleSignUp} onSwitchToLogin={() => setShowSignUp(false)} />;
  if (!isLoggedIn) return <LoginPage onLogin={handleLogin} onSwitchToSignUp={() => setShowSignUp(true)} />;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-br from-[#0F1115] to-[#15181E]">
        <Toaster position="top-right" theme="dark" richColors />
        <TopBar
          onAddTaskClick={() => setIsAddTaskDialogOpen(true)}
          currentUser={currentUser}
          onLogout={() => {
            setIsLoggedIn(false);
            setCurrentUser(null);
            toast.success('Logged out successfully');
          }}
        />

        {/* Main UI begins here */}
        <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} setMode={setMode} mode={mode} />

        <div className="p-8 pt-4">
            <AnimatePresence mode="wait">
                {activeTab === 'projects' && (
                    <motion.div
                        key="projects"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Summary and Graphs */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                            <StatsOverview stats={stats} currentUser={currentUser} />
                            <CategorySummary
                                personalTotal={personalTasks.length}
                                personalCompleted={personalCompleted}
                                businessTotal={businessTasks.length}
                                businessCompleted={businessCompleted}
                            />
                            <div className="space-y-4">
                                {mode === 'solo' ? (
                                    <SoloModeGraphs tasks={soloTasks} />
                                ) : (
                                    <TeamModeGraphs tasks={tasks} />
                                )}
                            </div>
                        </div>

                        {/* Kanban Board Structure */}
                        <DndProvider backend={HTML5Backend}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <DroppableColumn id="Pending" title="Pending Tasks" onDrop={handleTaskDrop}>
                                    {soloTasks.filter((t) => t.status === 'Pending').map((task) => (
                                        <DraggableTaskCard key={task.id} task={task} onClick={() => { setSelectedTask(task); setIsTaskDetailOpen(true); }} onDelete={handleDeleteTask} />
                                    ))}
                                </DroppableColumn>
                                <DroppableColumn id="In Progress" title="In Progress" onDrop={handleTaskDrop}>
                                    {soloTasks.filter((t) => t.status === 'In Progress').map((task) => (
                                        <DraggableTaskCard key={task.id} task={task} onClick={() => { setSelectedTask(task); setIsTaskDetailOpen(true); }} onDelete={handleDeleteTask} />
                                    ))}
                                </DroppableColumn>
                                <DroppableColumn id="Completed" title="Completed" onDrop={handleTaskDrop}>
                                    {soloTasks.filter((t) => t.status === 'Completed').map((task) => (
                                        <DraggableTaskCard key={task.id} task={task} onClick={() => { setSelectedTask(task); setIsTaskDetailOpen(true); }} onDelete={handleDeleteTask} />
                                    ))}
                                </DroppableColumn>
                            </div>
                        </DndProvider>

                        {/* Additional Insights */}
                        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <BehaviorStudyAdvices tasks={soloTasks} />
                            <EnhancedPredictionIntelligence tasks={soloTasks} />
                        </div>
                    </motion.div>
                )}

                {activeTab === 'schedule' && (
                    <motion.div
                        key="schedule"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <SchedulePage tasks={soloTasks} />
                        <DailyTimeline tasks={soloTasks} />
                    </motion.div>
                )}

                {activeTab === 'team' && (
                    <motion.div
                        key="team"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <TeamDashboard tasks={tasks} />
                        <DailyReportAnalysis tasks={tasks} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
        
        {/* Modals and Overlays */}
        <AddTaskDialog isOpen={isAddTaskDialogOpen} onClose={() => setIsAddTaskDialogOpen(false)} onAdd={handleAddTask} currentUser={currentUser} />
        {selectedTask && (
            <TaskDetailDialog isOpen={isTaskDetailOpen} onClose={() => setIsTaskDetailOpen(false)} task={selectedTask} />
        )}
        <TaskCompletionOverlay
            isOpen={showCompletionOverlay}
            onClose={() => setShowCompletionOverlay(false)}
            taskTitle={completedTaskTitle}
        />
        <ThanosSnapOverlay
            isOpen={showThanosSnap}
            onClose={() => setShowThanosSnap(false)}
            snapTaskTitle={snapTaskTitle}
            nextTask={nextTask}
        />

        {/* Floating Components */}
        <RemindersPopover tasks={soloTasks} />
        <EnhancedAIChatButton />
        <WelcomeBanner currentUser={currentUser} />
      </div>
    </DndProvider>
  );
}
