import { motion } from 'motion/react';
import { FolderKanban, Calendar, Users } from 'lucide-react';

type Tab = 'projects' | 'schedule' | 'team';

interface NavigationTabsProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function NavigationTabs({ activeTab, onTabChange }: NavigationTabsProps) {
  const tabs = [
    { id: 'projects' as Tab, label: 'My Projects', icon: FolderKanban },
    { id: 'schedule' as Tab, label: 'Schedule', icon: Calendar },
  ];

  return (
    <div className="flex items-center gap-2 bg-[#1C1F26]/50 backdrop-blur-sm border border-[#232834] rounded-2xl p-1.5">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative px-6 py-2.5 rounded-xl transition-all duration-200 flex items-center gap-2 ${
              isActive
                ? 'text-white'
                : 'text-white/50 hover:text-white/80'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-xl"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <Icon className={`w-4 h-4 relative z-10 ${isActive ? 'text-purple-400' : ''}`} />
            <span className="relative z-10 text-[16px]">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
