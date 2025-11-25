import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, X, Sparkles, Paperclip, FileText, Image as ImageIcon, FileCode, Gamepad2, GraduationCap, Trophy, CalendarClock, Users } from 'lucide-react';
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
}

const aiModes = [
  {
    id: 'plan' as const,
    name: 'Plan Mode',
    icon: CalendarClock,
    description: 'Analyze workload, create schedules, and balance team tasks',
    color: 'from-emerald-600 to-teal-600',
    greeting: '📅 Let\'s organize your tasks! Tell me what you need to get done, and I\'ll create an optimal schedule for you.',
    teamGreeting: '👥 Team workload analysis ready! I can help distribute tasks and identify who needs support.',
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

export function EnhancedAIChatButton({ currentMode: appMode = 'solo', tasks = [] }: EnhancedAIChatButtonProps = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showModeSelection, setShowModeSelection] = useState(true);
  const [selectedMode, setSelectedMode] = useState<AIMode>(null);
  const [message, setMessage] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
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
          // Intelligent response for Plan Mode
          if (message.toLowerCase().includes('team') || message.toLowerCase().includes('workload') || message.toLowerCase().includes('distribute') || message.toLowerCase().includes('balance')) {
            // Analyze team workload from tasks
            if (appMode === 'team' && tasks.length > 0) {
              const teamMembers = Array.from(new Set(tasks.map((t: any) => t.assignee)));
              const workloadAnalysis = teamMembers.map(member => {
                const memberTasks = tasks.filter((t: any) => t.assignee === member);
                const completed = memberTasks.filter((t: any) => t.status === 'Completed').length;
                const inProgress = memberTasks.filter((t: any) => t.status === 'In Progress').length;
                const pending = memberTasks.filter((t: any) => t.status === 'Pending').length;
                const total = memberTasks.length;
                const capacity = Math.min(95, (total * 15) + Math.random() * 20); // Simulate capacity
                
                return { member, total, completed, inProgress, pending, capacity: Math.round(capacity) };
              }).sort((a, b) => b.capacity - a.capacity);
              
              const overloaded = workloadAnalysis.filter(m => m.capacity > 80);
              const available = workloadAnalysis.filter(m => m.capacity < 60);
              
              response = '👥 Team Workload Analysis:\n\n';
              workloadAnalysis.forEach(m => {
                const status = m.capacity > 80 ? '⚠️' : m.capacity > 60 ? '✅' : '💚';
                response += `${status} ${m.member}: ${m.total} tasks (${m.capacity}% capacity)\n   ${m.completed} completed, ${m.inProgress} in progress, ${m.pending} pending\n\n`;
              });
              
              if (overloaded.length > 0 && available.length > 0) {
                response += `💡 Recommendation: ${overloaded[0].member} has heavy workload (${overloaded[0].capacity}%). Consider reassigning ${Math.ceil(overloaded[0].pending / 2)} pending tasks to ${available[0].member} who has ${available[0].capacity}% capacity.`;
              } else if (overloaded.length > 0) {
                response += `⚠️ Alert: ${overloaded.map(m => m.member).join(', ')} ${overloaded.length > 1 ? 'have' : 'has'} high workload. Consider deadline extensions or additional resources.`;
              } else {
                response += `✅ Team workload is well balanced! Everyone is working at healthy capacity.`;
              }
            } else {
              response = '👥 Team Workload Analysis:\n\n✅ Sarah: 3 tasks (65% capacity) - Doing well\n⚠️ Mike: 7 tasks (95% capacity) - Heavy load!\n✅ Alex: 2 tasks (40% capacity) - Available\n\n💡 Recommendation: Reassign 2 tasks from Mike to Alex to balance the workload. Would you like me to suggest which tasks?';
            }
          } else if (message.toLowerCase().includes('schedule') || message.toLowerCase().includes('when') || message.toLowerCase().includes('time')) {
            const totalTasks = tasks.length;
            const pending = tasks.filter((t: any) => t.status === 'Pending').length;
            response = `📅 Schedule Optimization:\n\n✅ Analyzed ${totalTasks} tasks (${pending} pending)\n\n⏰ Recommended time blocks:\n  • 9:00-10:30 AM - Deep work (2 complex tasks)\n  • 10:45-12:00 PM - Collaborative tasks\n  • 2:00-3:30 PM - Creative work\n  • 3:45-5:00 PM - Quick wins & admin\n\n💡 Breaks scheduled every 90 minutes. Tasks prioritized by deadline and complexity!`;
          } else {
            // Parse tasks from user message
            const taskKeywords = ['finish', 'complete', 'prepare', 'create', 'write', 'design', 'review', 'update', 'fix', 'build'];
            const hasTaskKeywords = taskKeywords.some(keyword => message.toLowerCase().includes(keyword));
            
            if (hasTaskKeywords) {
              response = '📅 Perfect! I\'ve analyzed your tasks:\n\n✅ Created tasks from your input\n⏰ Scheduled optimal time blocks:\n  • 9:00 AM - High priority task\n  • 11:00 AM - Medium priority\n  • 2:00 PM - Creative work\n  • 4:00 PM - Quick wins\n\n💡 Suggested 15-min breaks between sessions. Your peak productivity is morning, so I prioritized complex tasks early!';
            } else {
              response = '📋 I can help you with:\n\n• Creating and scheduling tasks from your list\n• Analyzing team workload distribution\n• Optimizing your daily schedule\n• Balancing tasks across team members\n\nJust tell me what you need to get done, or ask about your team\'s workload!';
            }
          }
          break;
        case 'gamer':
          response = '🎯 Nice! I\'ve analyzed your files and created 3 new quests. Complete them to earn 250 XP!';
          break;
        case 'coach':
          response = '🔥 AWESOME! Let\'s break this down into actionable steps. I believe in you!';
          break;
        case 'mentor':
          response = '📚 I\'ve reviewed your documents. Let me share some strategic insights...';
          break;
        default:
          response = 'Got it! I\'ll help you with that.';
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
                      <div
                        className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                          msg.isUser
                            ? `bg-gradient-to-br ${currentMode?.color || 'from-purple-600 to-blue-600'} text-white`
                            : 'bg-white/5 text-white/90 border border-white/10'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-line">{msg.text}</p>
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
                          ? "List your tasks or ask about team workload..." 
                          : "Tell me about your tasks..."
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
                      ? "Tell me your tasks, and I'll organize and schedule them for you" 
                      : "Attach documents, images, or code for AI analysis"}
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
