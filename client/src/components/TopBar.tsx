import React from 'react';
import { Plus, Bell, Settings, LogOut, User, Zap, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RemindersPopover } from './RemindersPopover'; // Assuming this is defined elsewhere

interface CurrentUser {
  name: string;
  email: string;
  username: string;
}

interface TopBarProps {
  onAddTaskClick: () => void;
  currentUser: CurrentUser | null;
  onLogout: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onAddTaskClick, currentUser, onLogout }) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#0F1115]/80 border-b border-[#2D333B]/50">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Section: Logo & Search */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Zap className="w-6 h-6 text-indigo-400" />
            <span className="font-bold text-xl text-white tracking-wider">TaskMate AI</span>
          </div>

          <div className="hidden lg:block">
            <Input
              type="search"
              placeholder="Search tasks, teams, or insights..."
              className="h-9 w-[300px] bg-[#1A1F25] border-transparent text-gray-300 placeholder:text-gray-500 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-indigo-500/50"
            />
          </div>
        </div>

        {/* Right Section: Actions & User */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Add Task Button */}
          <Button
            onClick={onAddTaskClick}
            className="group bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30 transition-all duration-300 transform hover:scale-[1.02]"
            size="sm"
          >
            <Plus className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
            Add Task
          </Button>

          {/* AI Chat Button */}
          <Button variant="ghost" size="icon" className="text-gray-400 hover:bg-[#1A1F25] hover:text-indigo-400">
            <MessageSquare className="h-5 w-5" />
          </Button>

          {/* Reminders/Notifications (assuming RemindersPopover handles the trigger) */}
          <RemindersPopover />

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="w-9 h-9 ring-2 ring-green-500/50">
                  <AvatarImage src="https://images.unsplash.com/photo-1672685667592-0392f458f46f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMGZhY2V8ZW58MXx8fHwxNzYyNTc3NzMyfDA&ixlib=rb-4.1.0&q=80&w=1080" />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                    {/* FIX APPLIED HERE: Wrapped the ternary expression in curly braces and checked currentUser */}
                    {currentUser ? currentUser.name.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0F1115]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-[#1A1F25] border-[#2D333B]" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-white">{currentUser?.name || 'Guest User'}</p>
                  <p className="text-xs leading-none text-gray-400">
                    {currentUser?.email || 'Please log in'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#2D333B]" />
              <DropdownMenuGroup>
                <DropdownMenuItem className="focus:bg-[#2D333B] text-gray-300 focus:text-white">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-[#2D333B] text-gray-300 focus:text-white">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-[#2D333B]" />
              <DropdownMenuItem onClick={onLogout} className="focus:bg-red-600/50 text-red-400 focus:text-white">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
