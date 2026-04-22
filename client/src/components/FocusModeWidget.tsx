import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { Timer, X, SkipForward, RotateCcw, Pause, Play, Coffee } from 'lucide-react';

interface FocusModeWidgetProps {
  taskTitle: string;
  taskId: string;
  onClose: () => void;
  onSessionComplete: (taskId: string) => void;
}

type Phase = 'focus' | 'break';

const FOCUS_SECS = 25 * 60;
const BREAK_SECS = 5 * 60;

function fmt(secs: number) {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function FocusModeWidget({ taskTitle, taskId, onClose, onSessionComplete }: FocusModeWidgetProps) {
  const [phase, setPhase] = useState<Phase>('focus');
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_SECS);
  const [running, setRunning] = useState(true);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = phase === 'focus' ? FOCUS_SECS : BREAK_SECS;
  const progress = ((total - secondsLeft) / total) * 100;
  const circumference = 2 * Math.PI * 52;
  const strokeDash = (progress / 100) * circumference;

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            handlePhaseComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, phase]);

  const handlePhaseComplete = () => {
    if (phase === 'focus') {
      const newCount = sessions + 1;
      setSessions(newCount);
      onSessionComplete(taskId);
      // Notify
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('🍅 Focus session complete!', { body: `Time for a ${BREAK_SECS / 60}-minute break.` });
      }
      setPhase('break');
      setSecondsLeft(BREAK_SECS);
      setRunning(true);
    } else {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('☕ Break over!', { body: 'Ready to focus again?' });
      }
      setPhase('focus');
      setSecondsLeft(FOCUS_SECS);
      setRunning(false);
    }
  };

  const handleSkip = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    handlePhaseComplete();
  };

  const handleReset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setSecondsLeft(phase === 'focus' ? FOCUS_SECS : BREAK_SECS);
    setRunning(false);
  };

  const isFocus = phase === 'focus';

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 40, scale: 0.9 }}
      transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
      className="fixed bottom-24 left-6 z-50 w-72 rounded-2xl bg-[#1C1F26]/95 backdrop-blur-xl border border-[#232834] shadow-2xl overflow-hidden"
      style={{ boxShadow: isFocus ? '0 0 40px rgba(139,92,246,0.15)' : '0 0 40px rgba(6,182,212,0.12)' }}
    >
      {/* Top accent line */}
      <div className={`h-0.5 w-full ${isFocus ? 'bg-gradient-to-r from-purple-600 to-blue-600' : 'bg-gradient-to-r from-cyan-500 to-teal-500'}`} />

      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {isFocus ? (
              <Timer className="w-4 h-4 text-purple-400" />
            ) : (
              <Coffee className="w-4 h-4 text-cyan-400" />
            )}
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wider ${isFocus ? 'text-purple-400' : 'text-cyan-400'}`}>
                {isFocus ? 'Focus Session' : 'Break Time'}
              </p>
              <p className="text-white/50 text-[10px] mt-0.5 line-clamp-1 max-w-[140px]">{taskTitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {sessions > 0 && (
              <div className="flex gap-0.5">
                {Array.from({ length: Math.min(sessions, 4) }).map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-purple-500/70" />
                ))}
              </div>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-white/10 text-white/40 hover:text-white/80 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Circular Timer */}
        <div className="flex items-center justify-center">
          <div className="relative w-32 h-32">
            {/* Background ring */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60" cy="60" r="52"
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="6"
              />
              <motion.circle
                cx="60" cy="60" r="52"
                fill="none"
                stroke={isFocus ? 'url(#focusGrad)' : 'url(#breakGrad)'}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - strokeDash}
                animate={{ strokeDashoffset: circumference - strokeDash }}
                transition={{ duration: 0.5 }}
              />
              <defs>
                <linearGradient id="focusGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#9333ea" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
                <linearGradient id="breakGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#14b8a6" />
                </linearGradient>
              </defs>
            </svg>
            {/* Time Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                key={secondsLeft}
                className="text-white text-2xl font-mono font-bold tabular-nums"
              >
                {fmt(secondsLeft)}
              </motion.span>
              <span className="text-white/30 text-[10px] mt-0.5">
                {isFocus ? `${FOCUS_SECS / 60} min` : `${BREAK_SECS / 60} min`}
              </span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="h-1 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${isFocus ? 'bg-gradient-to-r from-purple-600 to-blue-600' : 'bg-gradient-to-r from-cyan-500 to-teal-500'}`}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-white/25">
            <span>0:00</span>
            <span>{fmt(total)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white/70 transition-all duration-200"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setRunning(!running)}
            className={`p-3 rounded-xl transition-all duration-200 ${
              isFocus
                ? 'bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500'
                : 'bg-gradient-to-br from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500'
            } text-white shadow-lg`}
            title={running ? 'Pause' : 'Resume'}
          >
            {running ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>

          <button
            onClick={handleSkip}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white/70 transition-all duration-200"
            title="Skip"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Session dots */}
        {sessions > 0 && (
          <p className="text-center text-[10px] text-white/30">
            🍅 {sessions} session{sessions !== 1 ? 's' : ''} completed
          </p>
        )}
      </div>
    </motion.div>
  );
}
