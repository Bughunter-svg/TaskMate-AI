import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Toaster, toast } from 'sonner';

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
import { TaskFilterBar } from './components/TaskFilterBar';
import { FocusModeWidget } from './components/FocusModeWidget';

type Priority = 'Low' | 'Medium' | 'High' | 'Critical';
type PriorityFilter = 'All' | Priority;
type CategoryFilter = 'All' | 'Business' | 'Personal';

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
  priority?: Priority;
  tags?: string[];
  focusSessions?: number;
}

const API = 'https://taskmate-ai-hy5o.onrender.com/api/tasks';
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showSignUp, setShowSignUp] = useState(false);

  const [mode, setMode] = useState<'solo' | 'team'>('solo');
  const [activeTab, setActiveTab] = useState<'projects' | 'schedule' | 'team'>('projects');

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);

  const [showThanosSnap, setShowThanosSnap] = useState(false);
  const [snapTaskTitle, setSnapTaskTitle] = useState('');
  const [nextTask, setNextTask] = useState<{ title: string; date?: string; time?: string } | null>(null);

  // Feature 2 — Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('All');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('All');
  const [tagFilter, setTagFilter] = useState('');

  // Feature 5 — Focus Mode
  const [focusTaskId, setFocusTaskId] = useState<string | null>(null);
  const [focusTaskTitle, setFocusTaskTitle] = useState('');

  /* =========================
     LOAD TASKS (FIXED)
  ========================= */
  useEffect(() => {
    if (!currentUser) return;

    (async () => {
      try {
        const res = await fetch(`${API}/${currentUser.username}`);
        const data = await res.json();
        if (data.success) {
          const loaded: Task[] = data.tasks || [];
          setTasks(loaded);
          // Feature 3 — overdue alert on login
          const now = new Date();
          const overdue = loaded.filter(
            t => t.deadline && t.status !== 'Completed' && new Date(t.deadline) < now
          );
          if (overdue.length > 0) {
            toast.error(`⚠️ You have ${overdue.length} overdue task${overdue.length > 1 ? 's' : ''}!`, { duration: 5000 });
          }
        } else {
          toast.error('Failed to load tasks');
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load tasks');
      }
    })();
  }, [currentUser]);


  /* =========================
     MUTATIONS (FIXED)
  ========================= */
  const handleAddTask = async (taskData: any) => {
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...taskData,
          userId: currentUser.username,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        toast.error(data.error || 'Failed to add task');
        return;
      }
      setTasks(prev => [...prev, data.task]);
      toast.success('Task added successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to add task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    await fetch(`${API}/${taskId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUser.username }),
    });

    setTasks(prev => prev.filter(t => t.id !== taskId));
    toast.success('Task deleted');
  };

  const handleTaskDrop = async (taskId: string, newStatus: Task['status']) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === taskId
          ? { ...t, status: newStatus, ...(newStatus === 'Completed' && { completedBy: t.assignee }) }
          : t
      )
    );

    await fetch(`${API}/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: currentUser.username,
        status: newStatus,
      }),
    });

    if (newStatus === 'Completed') {
      const finished = tasks.find(t => t.id === taskId);
      const next = tasks.find(t => t.id !== taskId && t.status !== 'Completed');

      setSnapTaskTitle(finished?.title || '');
      setNextTask(
        next
          ? { title: next.title, date: next.scheduledDate, time: next.scheduledTime }
          : null
      );
      setShowThanosSnap(true);
    }
  };

  /* =========================
     FOCUS MODE HANDLER
  ========================= */
  const handleFocusStart = (taskId: string, title: string) => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    setFocusTaskId(taskId);
    setFocusTaskTitle(title);
  };

  const handleFocusSessionComplete = async (taskId: string) => {
    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, focusSessions: (t.focusSessions || 0) + 1 } : t
    ));
    await fetch(`${API}/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUser.username, focusSessions: (tasks.find(t => t.id === taskId)?.focusSessions || 0) + 1 }),
    });
  };

  /* =========================
     DERIVED DATA
  ========================= */
  const soloTasks = tasks.filter(t => t.assignee === 'You');
  const currentTasks = mode === 'solo' ? soloTasks : tasks;

  const completedCount = currentTasks.filter(t => t.status === 'Completed').length;
  const inProgressCount = currentTasks.filter(t => t.status === 'In Progress').length;
  const pendingCount = currentTasks.filter(t => t.status === 'Pending').length;

  const personalTasks = soloTasks.filter(t => t.category === 'Personal');
  const businessTasks = soloTasks.filter(t => t.category === 'Business');
  const personalCompleted = personalTasks.filter(t => t.status === 'Completed').length;
  const businessCompleted = businessTasks.filter(t => t.status === 'Completed').length;

  // Feature 2 — filter logic
  const applyFilters = (taskList: Task[]) =>
    taskList.filter(t => {
      if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !t.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (priorityFilter !== 'All' && t.priority !== priorityFilter) return false;
      if (categoryFilter !== 'All' && t.category !== categoryFilter) return false;
      if (tagFilter && !(t.tags || []).includes(tagFilter)) return false;
      return true;
    });

  const filteredSoloTasks = applyFilters(soloTasks);
  const filteredAllTasks = applyFilters(tasks);
  const availableTags = [...new Set(soloTasks.flatMap(t => t.tags || []))];

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskDetailOpen(true);
  };

  /* =========================
     AUTH
  ========================= */
  const handleLogin = (user: any) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
  };

  if (!isLoggedIn && showSignUp) {
    return <SignUpPage onSignUp={() => setShowSignUp(false)} onSwitchToLogin={() => setShowSignUp(false)} />;
  }

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} onSwitchToSignUp={() => setShowSignUp(true)} />;
  }

  /* =========================
     RENDER
  ========================= */
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-br from-[#0F1115] to-[#15181E]">
        <Toaster theme="dark" richColors />

        <TopBar
          currentUser={currentUser}
          onAddTaskClick={() => setIsAddTaskDialogOpen(true)}
          onLogout={() => {
            setIsLoggedIn(false);
            setCurrentUser(null);
          }}
        />

        {/* Main Content */}
        <div className="max-w-[1600px] mx-auto px-8 py-8">
          {/* Mode Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 mb-12"
          >
            <div className="inline-flex rounded-2xl bg-[#1C1F26] border border-[#232834] p-1.5">
              <button
                onClick={() => setMode('solo')}
                className={`relative px-8 py-2.5 rounded-xl transition-all duration-200 ${mode === 'solo'
                    ? 'text-white'
                    : 'text-white/50 hover:text-white/80'
                  }`}
              >
                {mode === 'solo' && (
                  <motion.div
                    layoutId="mode-indicator"
                    className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">Solo Mode</span>
              </button>

              <button
                onClick={() => setMode('team')}
                className={`relative px-8 py-2.5 rounded-xl transition-all duration-200 ${mode === 'team'
                    ? 'text-white'
                    : 'text-white/50 hover:text-white/80'
                  }`}
              >
                {mode === 'team' && (
                  <motion.div
                    layoutId="mode-indicator"
                    className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">Team Mode</span>
              </button>
            </div>
          </motion.div>

          {/* Content Area */}
          <AnimatePresence mode="wait">
            {mode === 'solo' ? (
              <motion.div
                key="solo"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="space-y-12"
              >
                {/* Welcome Banner */}
                <WelcomeBanner />

                {/* Stats Overview */}
                <StatsOverview
                  completedCount={completedCount}
                  inProgressCount={inProgressCount}
                  pendingCount={pendingCount}
                />

                {/* Navigation Tabs */}
                <div className="flex justify-center">
                  <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
                </div>

                {/* Conditional Content based on activeTab */}
                {activeTab === 'schedule' ? (
                  <SchedulePage />
                ) : activeTab === 'projects' ? (
                  <div className="space-y-12">
                    {/* Solo Mode Graphs */}
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-white mb-2">Productivity Analytics</h2>
                        <p className="text-white/50">
                          Track your personal productivity and task completion trends.
                        </p>
                      </div>
                      <SoloModeGraphs tasks={soloTasks} />
                    </div>

                    {/* Daily Timeline */}
                    <DailyTimeline tasks={soloTasks} />

                    {/* Task Section */}
                    <div className="space-y-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h2 className="text-white mb-2">All My Tasks</h2>
                          <p className="text-white/50">
                            Managing your tasks is easy with TaskMate AI. Drag and drop to change status.
                          </p>
                        </div>

                        {/* Category Summary Cards and Bell Icon */}
                        <div className="flex items-center gap-3">
                          <CategorySummary
                            category="Personal"
                            totalTasks={personalTasks.length}
                            completedTasks={personalCompleted}
                            index={0}
                          />
                          <CategorySummary
                            category="Business"
                            totalTasks={businessTasks.length}
                            completedTasks={businessCompleted}
                            index={1}
                          />
                          <RemindersPopover />
                        </div>
                      </div>

                      {/* Large Container Box Around All Columns */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="relative rounded-3xl bg-[#1A1D24] border border-[#232834] p-6"
                      >
                        {/* 3 Column Kanban Layout - Solo Mode: Only "You" tasks */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          {/* Completed Column */}
                          <DroppableColumn status="Completed" onDrop={handleTaskDrop} color="green">
                            <div className="relative">
                              <div className="absolute inset-0 bg-green-500/5 rounded-2xl -z-10" />

                              <div className="space-y-4 p-4">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1C1F26]/80 border border-green-500/20">
                                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                  <h3 className="text-white/90">Completed</h3>
                                  <span className="text-green-400 text-sm ml-2">
                                    {soloTasks.filter(t => t.status === 'Completed').length}
                                  </span>
                                </div>
                                <div className="space-y-3">
                                  {soloTasks
                                    .filter(task => task.status === 'Completed')
                                    .map((task, index) => (
                                      <DraggableTaskCard key={task.id} taskId={task.id} status={task.status}>
                                        <CompletedTaskCard
                                          title={task.title}
                                          description={task.description}
                                          completedBy={task.completedBy || 'You'}
                                          index={index}
                                          onDelete={() => handleDeleteTask(task.id)}
                                          onClick={() => handleTaskClick(task)}
                                        />
                                      </DraggableTaskCard>
                                    ))}
                                </div>
                              </div>
                            </div>
                          </DroppableColumn>

                          {/* In Progress Column */}
                          <DroppableColumn status="In Progress" onDrop={handleTaskDrop} color="purple">
                            <div className="relative">
                              <div className="absolute inset-0 bg-purple-500/5 rounded-2xl -z-10" />

                              <div className="space-y-4 p-4">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1C1F26]/80 border border-purple-500/20">
                                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                                  <h3 className="text-white/90">In Progress</h3>
                                  <span className="text-purple-400 text-sm ml-2">
                                    {soloTasks.filter(t => t.status === 'In Progress').length}
                                  </span>
                                </div>
                                <div className="space-y-3">
                                  {soloTasks
                                    .filter(task => task.status === 'In Progress')
                                    .map((task, index) => (
                                      <DraggableTaskCard key={task.id} taskId={task.id} status={task.status}>
                                        <InProgressTaskCard
                                          title={task.title}
                                          description={task.description}
                                          scheduledTime={task.scheduledTime || ''}
                                          startedAt={task.startedAt || ''}
                                          assignee={task.assignee || 'You'}
                                          initialProgress={task.progress || 0}
                                          imageUrl={task.imageUrl}
                                          isShared={task.isShared}
                                          index={index}
                                          onDelete={() => handleDeleteTask(task.id)}
                                          onClick={() => handleTaskClick(task)}
                                        />
                                      </DraggableTaskCard>
                                    ))}
                                </div>
                              </div>
                            </div>
                          </DroppableColumn>

                          {/* Pending Column */}
                          <DroppableColumn status="Pending" onDrop={handleTaskDrop} color="orange">
                            <div className="relative">
                              <div className="absolute inset-0 bg-orange-500/5 rounded-2xl -z-10" />

                              <div className="space-y-4 p-4">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1C1F26]/80 border border-orange-500/20">
                                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                                  <h3 className="text-white/90">Pending</h3>
                                  <span className="text-orange-400 text-sm ml-2">
                                    {soloTasks.filter(t => t.status === 'Pending').length}
                                  </span>
                                </div>
                                <div className="space-y-3">
                                  {soloTasks
                                    .filter(task => task.status === 'Pending')
                                    .map((task, index) => (
                                      <DraggableTaskCard key={task.id} taskId={task.id} status={task.status}>
                                        <PendingTaskCard
                                          title={task.title}
                                          description={task.description}
                                          scheduledDate={task.scheduledDate || ''}
                                          scheduledTime={task.scheduledTime || ''}
                                          assignee={task.assignee || 'You'}
                                          imageUrl={task.imageUrl}
                                          isShared={task.isShared}
                                          index={index}
                                          showAssignee={false}
                                          onDelete={() => handleDeleteTask(task.id)}
                                          onClick={() => handleTaskClick(task)}
                                        />
                                      </DraggableTaskCard>
                                    ))}
                                </div>
                              </div>
                            </div>
                          </DroppableColumn>
                        </div>
                      </motion.div>
                    </div>

                    {/* Behavior Study and Advices - Solo Mode */}
                    <BehaviorStudyAdvices tasks={soloTasks} />

                    {/* Daily Report Analysis - Solo Mode - Moved to End */}
                    <DailyReportAnalysis tasks={soloTasks} mode="solo" />
                  </div>
                ) : null}
              </motion.div>
            ) : (
              <motion.div
                key="team"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="space-y-12"
              >
                {/* Team Analytics Graphs */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-white mb-2">Team Analytics</h2>
                    <p className="text-white/50">
                      Visual insights into team performance and task distribution.
                    </p>
                  </div>
                  <TeamModeGraphs tasks={tasks} />
                </div>

                {/* Enhanced Prediction Intelligence */}
                <EnhancedPredictionIntelligence tasks={tasks} />

                {/* Team Performance Dashboard */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-white mb-2">Team Performance</h2>
                    <p className="text-white/50">
                      Track progress and identify blockers across your team.
                    </p>
                  </div>

                  <TeamDashboard tasks={tasks} />
                </div>

                {/* Team Tasks - 3 Column Kanban */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-white mb-2">All Team Tasks</h2>
                    <p className="text-white/50">
                      Overview of all tasks across the team. Drag and drop to update status.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Completed Column */}
                    <DroppableColumn status="Completed" onDrop={handleTaskDrop} color="green">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <h3 className="text-white/80">Completed</h3>
                          <span className="text-white/40 text-sm ml-auto">
                            {tasks.filter(t => t.status === 'Completed').length}
                          </span>
                        </div>
                        <div className="space-y-3">
                          {tasks
                            .filter(task => task.status === 'Completed')
                            .map((task, index) => (
                              <DraggableTaskCard key={task.id} taskId={task.id} status={task.status}>
                                <CompletedTaskCard
                                  title={task.title}
                                  description={task.description}
                                  completedBy={task.completedBy || 'You'}
                                  index={index}
                                  onDelete={() => handleDeleteTask(task.id)}
                                  onClick={() => handleTaskClick(task)}
                                />
                              </DraggableTaskCard>
                            ))}
                        </div>
                      </div>
                    </DroppableColumn>

                    {/* In Progress Column */}
                    <DroppableColumn status="In Progress" onDrop={handleTaskDrop} color="purple">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2">
                          <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                          <h3 className="text-white/80">In Progress</h3>
                          <span className="text-white/40 text-sm ml-auto">
                            {tasks.filter(t => t.status === 'In Progress').length}
                          </span>
                        </div>
                        <div className="space-y-3">
                          {tasks
                            .filter(task => task.status === 'In Progress')
                            .map((task, index) => (
                              <DraggableTaskCard key={task.id} taskId={task.id} status={task.status}>
                                <InProgressTaskCard
                                  title={task.title}
                                  description={task.description}
                                  scheduledTime={task.scheduledTime || ''}
                                  startedAt={task.startedAt || ''}
                                  assignee={task.assignee || 'You'}
                                  initialProgress={task.progress || 0}
                                  index={index}
                                  onDelete={() => handleDeleteTask(task.id)}
                                  onClick={() => handleTaskClick(task)}
                                />
                              </DraggableTaskCard>
                            ))}
                        </div>
                      </div>
                    </DroppableColumn>

                    {/* Pending Column (Team: all tasks with assignee shown) */}
                    <DroppableColumn status="Pending" onDrop={handleTaskDrop} color="orange">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2">
                          <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                          <h3 className="text-white/80">Pending</h3>
                          <span className="text-white/40 text-sm ml-auto">
                            {tasks.filter(t => t.status === 'Pending').length}
                          </span>
                        </div>
                        <div className="space-y-3">
                          {tasks
                            .filter(task => task.status === 'Pending')
                            .map((task, index) => (
                              <DraggableTaskCard key={task.id} taskId={task.id} status={task.status}>
                                <PendingTaskCard
                                  title={task.title}
                                  description={task.description}
                                  scheduledDate={task.scheduledDate || ''}
                                  scheduledTime={task.scheduledTime || ''}
                                  assignee={task.assignee || 'You'}
                                  index={index}
                                  showAssignee={true}
                                  onDelete={() => handleDeleteTask(task.id)}
                                  onClick={() => handleTaskClick(task)}
                                />
                              </DraggableTaskCard>
                            ))}
                        </div>
                      </div>
                    </DroppableColumn>
                  </div>
                </div>

                {/* Behavior Study and Advices - Team Mode */}
                <BehaviorStudyAdvices />

                {/* Daily Report Analysis - Team Mode - Moved to End */}
                <DailyReportAnalysis tasks={tasks} mode="team" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <EnhancedAIChatButton
          currentMode={mode}
          tasks={tasks}
          onCreateTasks={async newTasks => {
            for (const t of newTasks) {
              await handleAddTask(t);
            }
          }}
          onSwitchMode={setMode}
        />

        <ThanosSnapOverlay
          isVisible={showThanosSnap}
          taskTitle={snapTaskTitle}
          nextTaskTitle={nextTask?.title}
          nextTaskDate={nextTask?.date}
          nextTaskTime={nextTask?.time}
          onComplete={() => setShowThanosSnap(false)}
        />

        <AddTaskDialog
          isOpen={isAddTaskDialogOpen}
          onClose={() => setIsAddTaskDialogOpen(false)}
          onAddTask={handleAddTask}
          mode={mode}
        />

        <TaskDetailDialog
          task={selectedTask}
          isOpen={isTaskDetailOpen}
          onClose={() => setIsTaskDetailOpen(false)}
        />
      </div>
    </DndProvider>
  );
}
