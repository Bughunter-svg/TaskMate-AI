import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Filter, Tag, ChevronDown } from 'lucide-react';
import { useState } from 'react';

type Priority = 'All' | 'Critical' | 'High' | 'Medium' | 'Low';
type Category = 'All' | 'Business' | 'Personal';

interface TaskFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  priorityFilter: Priority;
  onPriorityChange: (p: Priority) => void;
  categoryFilter: Category;
  onCategoryChange: (c: Category) => void;
  tagFilter: string;
  onTagChange: (t: string) => void;
  availableTags: string[];
  totalCount: number;
  filteredCount: number;
}

const priorityOptions: Priority[] = ['All', 'Critical', 'High', 'Medium', 'Low'];
const categoryOptions: Category[] = ['All', 'Business', 'Personal'];

const priorityColors: Record<Priority, string> = {
  All: 'text-white/60',
  Critical: 'text-red-400',
  High: 'text-orange-400',
  Medium: 'text-yellow-400',
  Low: 'text-green-400',
};

const priorityDot: Record<Priority, string> = {
  All: 'bg-white/40',
  Critical: 'bg-red-500',
  High: 'bg-orange-500',
  Medium: 'bg-yellow-500',
  Low: 'bg-green-500',
};

export function TaskFilterBar({
  searchQuery,
  onSearchChange,
  priorityFilter,
  onPriorityChange,
  categoryFilter,
  onCategoryChange,
  tagFilter,
  onTagChange,
  availableTags,
  totalCount,
  filteredCount,
}: TaskFilterBarProps) {
  const [tagOpen, setTagOpen] = useState(false);
  const isFiltered = searchQuery || priorityFilter !== 'All' || categoryFilter !== 'All' || tagFilter;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-center gap-3 p-4 rounded-2xl bg-[#1A1D24] border border-[#232834]"
    >
      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks..."
          className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#15181E] border border-[#232834] text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
        />
        <AnimatePresence>
          {searchQuery && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-3.5 h-3.5 text-white/40" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Priority Filter */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-[#15181E] border border-[#232834]">
        {priorityOptions.map((p) => (
          <button
            key={p}
            onClick={() => onPriorityChange(p)}
            className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              priorityFilter === p ? priorityColors[p] : 'text-white/30 hover:text-white/60'
            }`}
          >
            {priorityFilter === p && (
              <motion.div
                layoutId="priority-pill"
                className="absolute inset-0 rounded-lg bg-white/5 border border-white/10"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {p !== 'All' && (
                <span className={`w-1.5 h-1.5 rounded-full ${priorityDot[p]}`} />
              )}
              {p}
            </span>
          </button>
        ))}
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-[#15181E] border border-[#232834]">
        {categoryOptions.map((c) => (
          <button
            key={c}
            onClick={() => onCategoryChange(c)}
            className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              categoryFilter === c ? 'text-blue-400' : 'text-white/30 hover:text-white/60'
            }`}
          >
            {categoryFilter === c && (
              <motion.div
                layoutId="category-pill"
                className="absolute inset-0 rounded-lg bg-blue-500/10 border border-blue-500/20"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
              />
            )}
            <span className="relative z-10">{c}</span>
          </button>
        ))}
      </div>

      {/* Tag Filter */}
      {availableTags.length > 0 && (
        <div className="relative">
          <button
            onClick={() => setTagOpen(!tagOpen)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs border transition-all duration-200 ${
              tagFilter
                ? 'bg-purple-500/15 border-purple-500/30 text-purple-400'
                : 'bg-[#15181E] border-[#232834] text-white/40 hover:text-white/70'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>{tagFilter || 'Tags'}</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${tagOpen ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {tagOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full mt-1 left-0 z-30 min-w-[140px] bg-[#1C1F26] border border-[#232834] rounded-xl shadow-xl overflow-hidden"
              >
                <button
                  onClick={() => { onTagChange(''); setTagOpen(false); }}
                  className="w-full px-3 py-2 text-left text-xs text-white/50 hover:bg-white/5 transition-colors"
                >
                  All tags
                </button>
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => { onTagChange(tag); setTagOpen(false); }}
                    className={`w-full px-3 py-2 text-left text-xs transition-colors flex items-center gap-2 ${
                      tagFilter === tag ? 'bg-purple-500/10 text-purple-400' : 'text-white/60 hover:bg-white/5'
                    }`}
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Result Count */}
      <AnimatePresence>
        {isFiltered && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="ml-auto flex items-center gap-2 text-xs text-white/40"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>
              <span className="text-white/70 font-medium">{filteredCount}</span> / {totalCount} tasks
            </span>
            <button
              onClick={() => {
                onSearchChange('');
                onPriorityChange('All');
                onCategoryChange('All');
                onTagChange('');
              }}
              className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white/60 transition-colors"
            >
              Clear
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
