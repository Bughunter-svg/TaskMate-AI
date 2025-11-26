import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, X, Sparkles, Paperclip, FileText, Image as ImageIcon, FileCode, Gamepad2, GraduationCap, Trophy, CalendarClock, Users, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';

type AIMode = 'plan' | 'gamer' | 'coach' | 'mentor' | null;

interface AttachedFile {
  id: string;
  name: string;
  size: string;
  type: string;
}

interface EnhancedAIChatButtonProps {
  currentMode?: 'solo' | 'team';
  tasks?: any[];
  onCreateTasks?: (tasks: Array<{
    title: string;
    description: string;
    category: 'Business' | 'Personal';
    assignee: string;
    scheduledDate?: string;
    scheduledTime?: string;
    deadline?: string;
    imageUrl?: string;
    status?: 'Pending' | 'In Progress' | 'Completed';
  }>) => void;
  onSwitchMode?: (mode: 'solo' | 'team') => void;
}

const aiModes = [
  {
    id: 'plan' as const,
    name: 'Plan Mode',
    icon: CalendarClock,
    description: 'Tell me your tasks and I\'ll create them with schedules',
    color: 'from-emerald-600 to-teal-600',
    greeting: '📅 Let\'s organize your tasks! Just tell me what you need to get done, and I\'ll create task blocks for you.',
    teamGreeting: '👥 Ready to organize your team! Tell me the tasks and I\'ll help distribute them.',
  },
  {
    id: 'gamer' as const,
    name: 'Gamer Mode',
    icon: Gamepad2,
    description: 'Gamify your tasks with XP, levels, and achievements',
    color: 'from-purple-600 to-pink-600',
    greeting: '🎮 Level up! Ready to crush some quests today?',
  },
  {
    id: 'coach' as const,
    name: 'Coach Mode',
    icon: Trophy,
    description: 'Get motivated with energetic coaching and accountability',
    color: 'from-orange-600 to-red-600',
    greeting: '💪 Let\'s DO THIS! What goals are we smashing today?',
  },
  {
    id: 'mentor' as const,
    name: 'Mentor Mode',
    icon: GraduationCap,
    description: 'Thoughtful guidance and strategic career advice',
    color: 'from-blue-600 to-cyan-600',
    greeting: '🎓 Let\'s think strategically about your growth path.',
  },
];

// Task image mapping based on keywords
const getTaskImageQuery = (taskTitle: string): string => {
  const title = taskTitle.toLowerCase();
  
  if (title.includes('design') || title.includes('ui') || title.includes('ux')) return 'design workspace';
  if (title.includes('code') || title.includes('programming') || title.includes('develop')) return 'coding programming';
  if (title.includes('meeting') || title.includes('presentation')) return 'business meeting';
  if (title.includes('write') || title.includes('article') || title.includes('blog')) return 'writing workspace';
  if (title.includes('marketing') || title.includes('social media')) return 'digital marketing';
  if (title.includes('fitness') || title.includes('workout') || title.includes('gym')) return 'fitness workout';
  if (title.includes('study') || title.includes('learn') || title.includes('course')) return 'studying learning';
  if (title.includes('photo') || title.includes('photography')) return 'photography camera';
  if (title.includes('video') || title.includes('editing')) return 'video editing';
  if (title.includes('research')) return 'research workspace';
  if (title.includes('review') || title.includes('feedback')) return 'review feedback';
  if (title.includes('database') || title.includes('data')) return 'data analytics';
  if (title.includes('test') || title.includes('qa')) return 'software testing';
  if (title.includes('documentation') || title.includes('docs')) return 'documentation writing';
  
  return 'productivity task';
};

// Parse tasks from natural language with dual-mode support
const parseTasksFromMessage = (message: string, mode: 'solo' | 'team', currentUser: string = 'You'): {
  soloTasks: Array<{
    title: string;
    description: string;
    category: 'Business' | 'Personal';
    assignee: string;
    status: 'Pending' | 'In Progress' | 'Completed';
  }>;
  teamTasks: Array<{
    title: string;
    description: string;
    category: 'Business' | 'Personal';
    assignee: string;
    status: 'Pending' | 'In Progress' | 'Completed';
  }>;
  isTeamTask: boolean;
  isSoloTask: boolean;
  needsConfirmation: boolean;
  suggestedMode: 'solo' | 'team' | 'both' | null;
} => {
  const lowercaseMsg = message.toLowerCase();
  const soloTasks: Array<{
    title: string;
    description: string;
    category: 'Business' | 'Personal';
    assignee: string;
    status: 'Pending' | 'In Progress' | 'Completed';
  }> = [];
  const teamTasks: Array<{
    title: string;
    description: string;
    category: 'Business' | 'Personal';
    assignee: string;
    status: 'Pending' | 'In Progress' | 'Completed';
  }> = [];
  
  // Detect current user's name from message (e.g., "I (Lahar)" or variations)
  const userNameMatch = message.match(/i\s*\(([^)]+)\)/i) || message.match(/^([A-Z][a-z]+)\s+(has|have|completed|is|working)/);
  const detectedUserName = userNameMatch ? userNameMatch[1].trim() : 'You';
  
  // Define team members
  const teamMembers = ['Alice Chen', 'Marcus Johnson', 'Rana Kumar', 'Suman Patel', 'Suman', 'Harshith', 'Lahar'];
  
  // Check if it's team-related (stronger indicators)
  const isTeamTask = lowercaseMsg.includes('team') || 
                     lowercaseMsg.includes('assign to') || 
                     lowercaseMsg.includes('distribute') ||
                     lowercaseMsg.includes('split among') ||
                     lowercaseMsg.includes('divide between') ||
                     teamMembers.some(name => lowercaseMsg.includes(name.toLowerCase()));
  
  // Check if user is talking about themselves (stronger indicators)
  const isSoloTask = lowercaseMsg.includes('i ') || 
                     lowercaseMsg.includes('i\'') ||
                     lowercaseMsg.includes('my task') ||
                     lowercaseMsg.includes('my deadline') ||
                     lowercaseMsg.includes('help me') ||
                     lowercaseMsg.includes('remind me');
  
  // Enhanced pattern: "PersonName is/has completed/working on TaskDescription"
  const personTaskPattern = /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s+(?:is|has|have|are)\s+(?:working on|completed|done with|finishing)\s+([^,.;]+)/gi;
  
  // Pattern: "I (Name)" or just "I" with tasks  
  const soloTaskPattern = /(?:i(?:\s*\([^)]+\))?\s+(?:have|has|am)\s+(?:completed|done|finished|working on)\s+([^,.;]+))/gi;
  
  let match;
  
  // Extract person-specific tasks
  while ((match = personTaskPattern.exec(message)) !== null) {
    const personName = match[1].trim();
    const taskDesc = match[2].trim();
    const lowerPersonName = personName.toLowerCase();
    
    // Determine status from context
    const contextLower = message.substring(Math.max(0, match.index - 50), match.index + match[0].length + 50).toLowerCase();
    let status: 'Pending' | 'In Progress' | 'Completed' = 'In Progress';
    
    if (contextLower.includes('completed') || contextLower.includes('done with') || contextLower.includes('finished')) {
      status = 'Completed';
    } else if (contextLower.includes('working on')) {
      status = 'In Progress';
    }
    
    // Determine category
    const isBusinessTask = taskDesc.toLowerCase().includes('meeting') ||
                          taskDesc.toLowerCase().includes('database') ||
                          taskDesc.toLowerCase().includes('api') ||
                          taskDesc.toLowerCase().includes('ai') ||
                          taskDesc.toLowerCase().includes('logic') ||
                          taskDesc.toLowerCase().includes('chatbot') ||
                          taskDesc.toLowerCase().includes('integration') ||
                          taskDesc.toLowerCase().includes('ui') ||
                          taskDesc.toLowerCase().includes('front end');
    
    let title = taskDesc.charAt(0).toUpperCase() + taskDesc.slice(1);
    if (title.length > 60) {
      title = title.substring(0, 57) + '...';
    }
    
    const task = {
      title,
      description: `${personName}: ${taskDesc}`,
      category: (isBusinessTask ? 'Business' : 'Personal') as 'Business' | 'Personal',
      assignee: personName,
      status,
    };
    
    // Check if this is the current user (for solo mode)
    if (lowerPersonName === detectedUserName.toLowerCase() || 
        lowerPersonName === 'lahar' ||
        personName === currentUser) {
      soloTasks.push({ ...task, assignee: 'You' });
    } else {
      teamTasks.push(task);
    }
  }
  
  // Extract solo tasks from "I" statements
  while ((match = soloTaskPattern.exec(message)) !== null) {
    const taskDesc = match[1].trim();
    
    const contextLower = message.substring(Math.max(0, match.index - 30), match.index + match[0].length + 30).toLowerCase();
    let status: 'Pending' | 'In Progress' | 'Completed' = 'In Progress';
    
    if (contextLower.includes('completed') || contextLower.includes('done')) {
      status = 'Completed';
    } else if (contextLower.includes('working on')) {
      status = 'In Progress';
    }
    
    const isBusinessTask = taskDesc.toLowerCase().includes('ui') ||
                          taskDesc.toLowerCase().includes('front end') ||
                          taskDesc.toLowerCase().includes('design');
    
    let title = taskDesc.charAt(0).toUpperCase() + taskDesc.slice(1);
    if (title.length > 60) {
      title = title.substring(0, 57) + '...';
    }
    
    soloTasks.push({
      title,
      description: `Personal task: ${taskDesc}`,
      category: (isBusinessTask ? 'Business' : 'Personal') as 'Business' | 'Personal',
      assignee: 'You',
      status,
    });
  }
  
  // Determine suggested mode
  let suggestedMode: 'solo' | 'team' | 'both' | null = null;
  if (soloTasks.length > 0 && teamTasks.length > 0) {
    suggestedMode = 'both';
  } else if (teamTasks.length > 0) {
    suggestedMode = 'team';
  } else if (soloTasks.length > 0) {
    suggestedMode = 'solo';
  }
  
  // Legacy fallback for simpler messages
  if (soloTasks.length === 0 && teamTasks.length === 0) {
    const extractedTasks: string[] = [];
    const taskPatterns = [
      /(?:need to|have to|should|must|want to|going to)\s+([^,.;]+)/gi,
    ];
    
    taskPatterns.forEach(pattern => {
      const matches = message.matchAll(pattern);
      for (const match of matches) {
        if (match[1] && match[1].trim().length > 3) {
          extractedTasks.push(match[1].trim());
        }
      }
    });
    
    extractedTasks.forEach((taskText, index) => {
      const isBusinessTask = taskText.toLowerCase().includes('meeting') ||
                            taskText.toLowerCase().includes('presentation') ||
                            taskText.toLowerCase().includes('report') ||
                            taskText.toLowerCase().includes('database') ||
                            taskText.toLowerCase().includes('api');
      
      let title = taskText.charAt(0).toUpperCase() + taskText.slice(1);
      if (title.length > 60) {
        title = title.substring(0, 57) + '...';
      }
      
      if (isSoloTask) {
        soloTasks.push({
          title,
          description: `AI-created task: ${taskText}`,
          category: isBusinessTask ? 'Business' : 'Personal',
          assignee: 'You',
          status: 'Pending' as 'Pending',
        });
      } else {
        teamTasks.push({
          title,
          description: `AI-created task: ${taskText}`,
          category: isBusinessTask ? 'Business' : 'Personal',
          assignee: teamMembers[index % 4],
          status: 'Pending' as 'Pending',
        });
      }
    });
  }
  
  // Need confirmation if mode mismatch or too many tasks or both modes
  const needsConfirmation = suggestedMode === 'both' ||
                            (teamTasks.length > 0 && mode === 'solo') || 
                            (soloTasks.length > 0 && mode === 'team') ||
                            (soloTasks.length + teamTasks.length) > 5;
  
  return { soloTasks, teamTasks, isTeamTask, isSoloTask, needsConfirmation, suggestedMode };
};

export function EnhancedAIChatButton({ currentMode: appMode = 'solo', tasks = [], onCreateTasks, onSwitchMode }: EnhancedAIChatButtonProps = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showModeSelection, setShowModeSelection] = useState(true);
  const [selectedMode, setSelectedMode] = useState<AIMode>(null);
  const [message, setMessage] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean; isConfirmation?: boolean; pendingTasks?: any[] }>>([]);
  const [pendingTasksToCreate, setPendingTasksToCreate] = useState<any[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleModeSelect = (mode: AIMode) => {
    setSelectedMode(mode);
    setShowModeSelection(false);
    const modeConfig = aiModes.find(m => m.id === mode);
    if (modeConfig) {
      // Use team greeting if in team mode and mode supports it
      const greeting = mode === 'plan' && appMode === 'team' && modeConfig.teamGreeting 
        ? modeConfig.teamGreeting 
        : modeConfig.greeting;
      setMessages([{ text: greeting, isUser: false }]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles: AttachedFile[] = Array.from(files).map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        type: file.type,
      }));
      setAttachedFiles([...attachedFiles, ...newFiles]);
    }
  };

  const removeFile = (id: string) => {
    setAttachedFiles(attachedFiles.filter(f => f.id !== id));
  };

  const confirmTaskCreation = async (confirmed: boolean, switchMode?: boolean) => {
    if (confirmed && pendingTasksToCreate && onCreateTasks) {
      const firstTask = pendingTasksToCreate[0];
      const suggestedMode = firstTask?.suggestedMode;
      
      // Handle mode switching if requested
      if (switchMode && suggestedMode && onSwitchMode && suggestedMode !== appMode) {
        onSwitchMode(suggestedMode);
        setMessages(prev => [...prev, { 
          text: `🔄 Switching to ${suggestedMode === 'solo' ? 'Solo' : 'Team'} Mode...`, 
          isUser: false 
        }]);
        
        // Wait a bit for mode switch, then create tasks
        setTimeout(async () => {
          const tasksWithImages = await Promise.all(
            pendingTasksToCreate.map(async (task) => {
              return {
                ...task,
                imageUrl: `https://images.unsplash.com/photo-1699570044128-b61ef113b72e?w=400`,
              };
            })
          );
          
          onCreateTasks(tasksWithImages);
          setMessages(prev => [...prev, { 
            text: `✅ Created ${tasksWithImages.length} task${tasksWithImages.length > 1 ? 's' : ''} in ${suggestedMode === 'solo' ? 'Solo' : 'Team'} Mode! Check your dashboard to see them.`, 
            isUser: false 
          }]);
        }, 800);
      } else {
        // Create tasks in current mode
        const tasksWithImages = await Promise.all(
          pendingTasksToCreate.map(async (task) => {
            return {
              ...task,
              imageUrl: `https://images.unsplash.com/photo-1699570044128-b61ef113b72e?w=400`,
            };
          })
        );
        
        onCreateTasks(tasksWithImages);
        setMessages(prev => [...prev, { 
          text: `✅ Perfect! I've created ${tasksWithImages.length} task${tasksWithImages.length > 1 ? 's' : ''} on your ${appMode === 'solo' ? 'Solo' : 'Team'} dashboard. They're in the Pending column!`, 
          isUser: false 
        }]);
      }
    } else {
      setMessages(prev => [...prev, { 
        text: `No problem! Feel free to tell me your tasks again with more details, and I'll help organize them.`, 
        isUser: false 
      }]);
    }
    setPendingTasksToCreate(null);
  };

  const handleSend = () => {
    if (!message.trim() && attachedFiles.length === 0) return;
    
    let messageText = message;
    if (attachedFiles.length > 0) {
      messageText += `\n📎 Attached ${attachedFiles.length} file(s)`;
    }
    
    setMessages(prev => [...prev, { text: messageText, isUser: true }]);
    
    // Simulate AI response based on mode
    setTimeout(() => {
      let response = '';
      
      switch (selectedMode) {
        case 'plan':
          // Parse tasks from message
          const { soloTasks, teamTasks, isTeamTask, isSoloTask, needsConfirmation, suggestedMode } = parseTasksFromMessage(
            message,
            appMode,
            'You'
          );
          
          const allParsedTasks = [...soloTasks, ...teamTasks];
          
          if (allParsedTasks.length > 0) {
            // Build task summary
            const taskList = allParsedTasks.map((t, i) => `${i + 1}. ${t.title} (${t.assignee})${t.status === 'Completed' ? ' ✅' : t.status === 'In Progress' ? ' 🔄' : ''}`).join('\n   ');
            
            if (needsConfirmation) {
              // Ask for confirmation with mode awareness
              let confirmationQuestion = '';
              
              if (isTeamTask && !isSoloTask && appMode === 'solo') {
                // User wants team tasks but is in solo mode
                response = `🎯 I found ${parsedTasks.length} task${parsedTasks.length > 1 ? 's' : ''} for your team:\n\n   ${taskList}\n\n⚠️ You're currently in Solo Mode, but these look like team tasks. Should I:\n\n1️⃣ Switch to Team Mode and create these tasks there?\n2️⃣ Create them in Solo Mode and assign all to you?`;
              } else if (isSoloTask && !isTeamTask && appMode === 'team') {
                // User wants solo tasks but is in team mode
                response = `🎯 I found ${parsedTasks.length} personal task${parsedTasks.length > 1 ? 's' : ''} for you:\n\n   ${taskList}\n\n💡 You're in Team Mode, but these are your personal tasks. Should I:\n\n1️⃣ Switch to Solo Mode and create these tasks there?\n2️⃣ Create them in Team Mode anyway?`;
              } else if (parsedTasks.length > 5) {
                // Too many tasks
                response = `🎯 Wow! I found ${parsedTasks.length} tasks:\n\n   ${taskList}\n\nThat's quite a list! Would you like me to create all of these on your ${appMode === 'solo' ? 'Solo' : 'Team'} dashboard?`;
              } else {
                // General confirmation
                response = `🎯 Great! I found ${parsedTasks.length} task${parsedTasks.length > 1 ? 's' : ''}:\n\n   ${taskList}\n\nWould you like me to create these on your ${appMode === 'solo' ? 'Solo' : 'Team'} dashboard?`;
              }
              
              // Store pending tasks with suggested mode
              setPendingTasksToCreate(parsedTasks.map(t => ({
                ...t,
                scheduledDate: 'Nov 10',
                scheduledTime: '10:00 AM',
                deadline: 'Nov 15',
                suggestedMode: suggestedMode,
              })));
              
              setMessages(prev => [...prev, { 
                text: response, 
                isUser: false,
                isConfirmation: true,
                pendingTasks: parsedTasks
              }]);
              setMessage('');
              setAttachedFiles([]);
              return;
            } else {
              // Auto-create tasks (no mode mismatch, small number)
              const tasksToCreate = parsedTasks.map(t => ({
                ...t,
                scheduledDate: 'Nov 10',
                scheduledTime: '10:00 AM',
                deadline: 'Nov 15',
                imageUrl: 'https://images.unsplash.com/photo-1699570044128-b61ef113b72e?w=400',
              }));
              
              if (onCreateTasks) {
                onCreateTasks(tasksToCreate);
                response = `✅ Perfect! I've created ${parsedTasks.length} task${parsedTasks.length > 1 ? 's' : ''} on your ${appMode === 'solo' ? 'Solo' : 'Team'} dashboard:\n\n   ${taskList}\n\n💡 Check your dashboard to see them! They're in the Pending column and ready to go.`;
              } else {
                response = `✅ I've identified ${parsedTasks.length} task${parsedTasks.length > 1 ? 's' : ''}:\n\n   ${taskList}\n\n💡 Ready to create them!`;
              }
            }
          } else if (message.toLowerCase().includes('team') || message.toLowerCase().includes('workload')) {
            // Team analysis
            if (appMode === 'team' && tasks.length > 0) {
              const teamMembers = Array.from(new Set(tasks.map((t: any) => t.assignee)));
              const workloadAnalysis = teamMembers.map(member => {
                const memberTasks = tasks.filter((t: any) => t.assignee === member);
                const completed = memberTasks.filter((t: any) => t.status === 'Completed').length;
                const inProgress = memberTasks.filter((t: any) => t.status === 'In Progress').length;
                const pending = memberTasks.filter((t: any) => t.status === 'Pending').length;
                const total = memberTasks.length;
                const capacity = Math.min(95, (total * 15) + Math.random() * 20);
                
                return { member, total, completed, inProgress, pending, capacity: Math.round(capacity) };
              }).sort((a, b) => b.capacity - a.capacity);
              
              response = '👥 Team Workload Analysis:\n\n';
              workloadAnalysis.forEach(m => {
                const status = m.capacity > 80 ? '⚠️' : m.capacity > 60 ? '✅' : '💚';
                response += `${status} ${m.member}: ${m.total} tasks (${m.capacity}% capacity)\n   ${m.completed} completed, ${m.inProgress} in progress, ${m.pending} pending\n\n`;
              });
            } else {
              response = '👥 To analyze team workload, please switch to Team Mode or tell me about your tasks!';
            }
          } else {
            response = '📋 I\'m ready to help! Try:\n\n• "I need to finish the report, design the homepage, and review the code by Friday"\n• "Create tasks for my team: database update, API testing, and UI review"\n• "What\'s my team\'s workload?"\n\nJust tell me naturally what needs to be done!';
          }
          break;
          
        case 'gamer':
          response = '🎯 Quest accepted! +50 XP. Ready to level up?';
          break;
        case 'coach':
          response = '🔥 THAT\'S THE SPIRIT! Let\'s crush this together!';
          break;
        case 'mentor':
          response = '📚 Great question. Let me share some strategic insights...';
          break;
        default:
          response = 'How can I help you today?';
      }
      
      setMessages(prev => [...prev, { text: response, isUser: false }]);
    }, 1000);
    
    setMessage('');
    setAttachedFiles([]);
  };

  const handleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen && !selectedMode) {
      setShowModeSelection(true);
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return ImageIcon;
    if (type.includes('code') || type.includes('text')) return FileCode;
    return FileText;
  };

  const currentMode = aiModes.find(m => m.id === selectedMode);

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-8 right-8 z-50">
        {/* Pulsing ring for Plan Mode */}
        {selectedMode === 'plan' && (
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 blur-md"
          />
        )}
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleOpen}
          className={`relative w-14 h-14 rounded-full bg-gradient-to-br ${
            currentMode ? currentMode.color : 'from-purple-600 to-blue-600'
          } shadow-lg shadow-purple-500/25 flex items-center justify-center text-white`}
        >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {currentMode ? <currentMode.icon className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
      </div>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-8 z-50 w-96 h-[600px] bg-[#1C1F26] border border-[#232834] rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Mode Selection View */}
            {showModeSelection ? (
              <div className="flex-1 flex flex-col p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-white mb-2">Choose Your AI Mode</h3>
                  <p className="text-white/50 text-sm">
                    Select how you want TaskMate AI to interact with you
                  </p>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto">
                  {aiModes.map((mode, index) => (
                    <motion.button
                      key={mode.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleModeSelect(mode.id)}
                      className="w-full p-4 rounded-2xl bg-[#1A1D24] border border-[#232834] hover:border-purple-500/50 transition-all text-left group"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${mode.color} flex items-center justify-center flex-shrink-0`}>
                          <mode.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white mb-1 group-hover:text-purple-400 transition-colors">
                            {mode.name}
                          </h4>
                          <p className="text-white/50 text-sm">
                            {mode.description}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="mt-4 w-full py-3 rounded-xl border border-[#232834] text-white/70 hover:text-white hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className={`px-6 py-4 border-b border-white/5 bg-gradient-to-br ${currentMode?.color || 'from-purple-600 to-blue-600'}/10`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${currentMode?.color || 'from-purple-600 to-blue-600'} flex items-center justify-center`}>
                        {currentMode ? <currentMode.icon className="w-5 h-5 text-white" /> : <Sparkles className="w-5 h-5 text-white" />}
                      </div>
                      <div>
                        <h3 className="text-white">{currentMode?.name || 'TaskMate AI'}</h3>
                        <p className="text-xs text-white/40">Active now</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setShowModeSelection(true);
                        setSelectedMode(null);
                        setMessages([]);
                        setPendingTasksToCreate(null);
                      }}
                      className="text-white/40 hover:text-white transition-colors"
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] ${msg.isUser ? '' : 'space-y-2'}`}>
                        <div
                          className={`px-4 py-3 rounded-2xl ${
                            msg.isUser
                              ? `bg-gradient-to-br ${currentMode?.color || 'from-purple-600 to-blue-600'} text-white`
                              : 'bg-white/5 text-white/90 border border-white/10'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-line">{msg.text}</p>
                        </div>
                        
                        {/* Confirmation buttons */}
                        {msg.isConfirmation && pendingTasksToCreate && (
                          <div className="space-y-2">
                            {pendingTasksToCreate[0]?.suggestedMode && pendingTasksToCreate[0].suggestedMode !== appMode ? (
                              // Show mode switch options
                              <>
                                <Button
                                  onClick={() => confirmTaskCreation(true, true)}
                                  className="w-full bg-emerald-600 hover:bg-emerald-700 h-9 text-sm"
                                >
                                  <CheckCircle2 className="w-4 h-4 mr-1" />
                                  Switch to {pendingTasksToCreate[0].suggestedMode === 'solo' ? 'Solo' : 'Team'} Mode
                                </Button>
                                <Button
                                  onClick={() => confirmTaskCreation(true, false)}
                                  variant="outline"
                                  className="w-full h-9 text-sm border-white/10 hover:bg-white/5"
                                >
                                  Create in {appMode === 'solo' ? 'Solo' : 'Team'} Mode
                                </Button>
                                <Button
                                  onClick={() => confirmTaskCreation(false)}
                                  variant="outline"
                                  className="w-full h-9 text-sm border-white/10 hover:bg-white/5 text-white/50"
                                >
                                  <X className="w-4 h-4 mr-1" />
                                  Cancel
                                </Button>
                              </>
                            ) : (
                              // Standard confirmation
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => confirmTaskCreation(true)}
                                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 h-9 text-sm"
                                >
                                  <CheckCircle2 className="w-4 h-4 mr-1" />
                                  Yes, Create
                                </Button>
                                <Button
                                  onClick={() => confirmTaskCreation(false)}
                                  variant="outline"
                                  className="flex-1 h-9 text-sm border-white/10 hover:bg-white/5"
                                >
                                  <X className="w-4 h-4 mr-1" />
                                  Cancel
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Attached Files */}
                {attachedFiles.length > 0 && (
                  <div className="px-4 pb-2 space-y-2">
                    {attachedFiles.map((file) => {
                      const FileIcon = getFileIcon(file.type);
                      return (
                        <motion.div
                          key={file.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10"
                        >
                          <FileIcon className="w-4 h-4 text-purple-400" />
                          <div className="flex-1 min-w-0">
                            <p className="text-white/90 text-sm truncate">{file.name}</p>
                            <p className="text-white/40 text-xs">{file.size}</p>
                          </div>
                          <button
                            onClick={() => removeFile(file.id)}
                            className="text-white/40 hover:text-white transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {/* Input */}
                <div className="p-4 border-t border-white/5 bg-white/5">
                  <div className="flex gap-2 mb-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-3 bg-[#1C1F26] border border-[#232834] rounded-xl text-white/70 hover:text-white hover:border-purple-500/50 transition-all"
                    >
                      <Paperclip className="w-5 h-5" />
                    </motion.button>
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      placeholder={
                        selectedMode === 'plan' 
                          ? "Tell me what you need to get done..." 
                          : "Message TaskMate AI..."
                      }
                      className="flex-1 px-4 py-3 bg-[#1C1F26] border border-[#232834] rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500/50 transition-colors"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSend}
                      className={`px-4 py-3 bg-gradient-to-br ${currentMode?.color || 'from-purple-600 to-blue-600'} rounded-xl text-white`}
                    >
                      <Send className="w-5 h-5" />
                    </motion.button>
                  </div>
                  <p className="text-xs text-white/40 text-center">
                    {selectedMode === 'plan' 
                      ? "E.g., 'I need to finish the report by Friday and design the homepage'" 
                      : "Powered by AI • Always learning"}
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
