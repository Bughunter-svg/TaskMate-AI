import { useState } from 'react';
import { motion } from 'motion/react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Sparkles, Lock, User } from 'lucide-react';

interface LoginPageProps {
  onLogin: (userData: { name: string; email: string; username: string }) => void;
  onSwitchToSignUp: () => void;
}

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

export function LoginPage({ onLogin, onSwitchToSignUp }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Invalid credentials");
      }

      // Store JWT if needed
      localStorage.setItem("token", data.token);

      // Store user if "remember me" is checked
      if (rememberMe) {
        localStorage.setItem("taskmate_current_user", JSON.stringify(data.user));
      }

      onLogin(data.user);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1115] to-[#15181E] flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated background elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 overflow-hidden"
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.03, 0.06, 0.03],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.03, 0.06, 0.03],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 4,
          }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-orange-600 to-purple-600 rounded-full blur-3xl"
        />
      </motion.div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative w-full max-w-md"
      >
        {/* Frosted glass card */}
        <div className="relative rounded-3xl bg-[#1C1F26]/80 backdrop-blur-xl border border-[#232834] p-8 shadow-2xl">
          {/* Logo and Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="text-center mb-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.2,
                type: 'spring',
                stiffness: 200,
                damping: 15,
              }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 mb-4"
            >
              <Sparkles className="size-8 text-white" />
            </motion.div>
            <h1 className="text-white mb-2">Welcome to TaskMate AI</h1>
            <p className="text-white/50">
              Your intelligent productivity companion
            </p>
          </motion.div>

          {/* Login Form */}
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Username Field */}
            <div className="space-y-2">
              <label htmlFor="username" className="text-white/80 text-sm block">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="pl-10 h-11 bg-[#0F1115]/50 border-[#232834] text-white placeholder:text-white/30 focus-visible:border-purple-500/50 focus-visible:ring-purple-500/20"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-white/80 text-sm block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pl-10 h-11 bg-[#0F1115]/50 border-[#232834] text-white placeholder:text-white/30 focus-visible:border-purple-500/50 focus-visible:ring-purple-500/20"
                  required
                />
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center gap-2">
              <Checkbox 
                id="remember-me"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                className="border-[#232834] data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-purple-600 data-[state=checked]:to-blue-600 data-[state=checked]:border-purple-500"
              />
              <label 
                htmlFor="remember-me" 
                className="text-white/60 text-sm cursor-pointer hover:text-white/80 transition-colors duration-200"
              >
                Remember me for 30 days
              </label>
            </div>

            {/* Login Button */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="pt-2"
            >
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-500/20 transition-all duration-200"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  'Sign In'
                )}
              </Button>
            </motion.div>
          </motion.form>

          {/* Footer Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="mt-6 text-center space-y-3"
          >
            <button 
              type="button"
              className="text-purple-400 hover:text-purple-300 text-sm transition-colors duration-200"
            >
              Forgot password?
            </button>
            <div className="text-white/40 text-sm">
              Don't have an account?{' '}
              <button 
                type="button"
                onClick={onSwitchToSignUp}
                className="text-purple-400 hover:text-purple-300 transition-colors duration-200"
              >
                Sign up
              </button>
            </div>
          </motion.div>
        </div>

        {/* Bottom glow effect */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-600/10 to-blue-600/10 rounded-3xl blur-2xl" />
      </motion.div>

      {/* Floating particles effect */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.4, 0],
            y: [0, -100],
            x: Math.random() * 100 - 50,
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.8,
            ease: 'easeOut',
          }}
          className="absolute w-1 h-1 bg-purple-400 rounded-full"
          style={{
            left: `${20 + i * 13}%`,
            bottom: '10%',
          }}
        />
      ))}
    </div>
  );
}
