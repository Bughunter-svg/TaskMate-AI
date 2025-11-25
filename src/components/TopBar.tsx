import { Search, Plus, User, LogOut, Mail, UserCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';

interface TopBarProps {
  onAddTaskClick?: () => void;
  currentUser?: { name: string; email: string; username: string } | null;
  onLogout?: () => void;
}

export function TopBar({ onAddTaskClick, currentUser, onLogout }: TopBarProps) {
  return (
    <TooltipProvider>
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-[#0F1115]/80 border-b border-[#232834]"
      >
        <div className="max-w-[1600px] mx-auto px-8 py-4 flex items-center justify-between gap-8">
          {/* Left: Logo */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-3 cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <span className="text-white">T</span>
                </div>
                <span className="text-white/90 tracking-tight">TaskMate AI</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Your AI-powered productivity companion</p>
            </TooltipContent>
          </Tooltip>

          {/* Center: Search */}
          <div className="flex-1 max-w-xl relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none z-10" />
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Input 
                    placeholder="Search tasks, projects, or people..."
                    className="w-full bg-[#1C1F26] border-[#232834] pl-10 text-white/90 placeholder:text-white/40 focus-visible:ring-purple-500/50 focus-visible:border-purple-500/50"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Quickly find any task or team member</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Right: Add Task + Avatar */}
          <div className="flex items-center gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Button 
                      onClick={onAddTaskClick}
                      className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-5 transition-all duration-200"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Task
                    </Button>
                  </motion.div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create a new task (Ctrl+N)</p>
              </TooltipContent>
            </Tooltip>
            
            <Popover>
              <PopoverTrigger asChild>
                <div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="relative cursor-pointer"
                      >
                        <Avatar className="w-9 h-9 ring-2 ring-green-500/50">
                          <AvatarImage src="https://images.unsplash.com/photo-1672685667592-0392f458f46f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMGZhY2V8ZW58MXx8fHwxNzYyNTc3NzMyfDA&ixlib=rb-4.1.0&q=80&w=1080" />
                          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                            {currentUser ? currentUser.name.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0F1115]" />
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Your profile • Online</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </PopoverTrigger>
              
              <PopoverContent 
                className="w-80 bg-[#1C1F26] border-[#232834] p-0 overflow-hidden" 
                align="end"
                sideOffset={8}
              >
                {currentUser && (
                  <div className="space-y-0">
                    {/* Header with gradient background */}
                    <div className="relative p-6 bg-gradient-to-br from-purple-600/20 to-blue-600/20 border-b border-[#232834]">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-16 h-16 ring-2 ring-purple-500/50">
                          <AvatarImage src="https://images.unsplash.com/photo-1672685667592-0392f458f46f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMGZhY2V8ZW58MXx8fHwxNzYyNTc3NzMyfDA&ixlib=rb-4.1.0&q=80&w=1080" />
                          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                            {currentUser.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white truncate">{currentUser.name}</h3>
                          <p className="text-white/50 text-sm truncate">@{currentUser.username}</p>
                        </div>
                      </div>
                    </div>

                    {/* Account Details */}
                    <div className="p-4 space-y-3">
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0F1115]/50 border border-[#232834]">
                        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-purple-500/10">
                          <UserCircle className="w-4 h-4 text-purple-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white/40 text-xs">Username</p>
                          <p className="text-white/90 text-sm truncate">{currentUser.username}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0F1115]/50 border border-[#232834]">
                        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-500/10">
                          <Mail className="w-4 h-4 text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white/40 text-xs">Email</p>
                          <p className="text-white/90 text-sm truncate">{currentUser.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Logout Button */}
                    <div className="p-4 pt-2 border-t border-[#232834]">
                      <Button
                        onClick={onLogout}
                        variant="ghost"
                        className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Log Out
                      </Button>
                    </div>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </motion.div>
    </TooltipProvider>
  );
}
