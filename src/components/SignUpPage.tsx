import { useState } from 'react';
import { motion } from 'motion/react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Sparkles, Lock, User, Mail, UserPlus } from 'lucide-react';

interface SignUpPageProps {
  onSignUp: (userData: { name: string; email: string; username: string }) => void;
  onSwitchToLogin: () => void;
}

export function SignUpPage({ onSignUp, onSwitchToLogin }: SignUpPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!name || !email || !username || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!agreeToTerms) {
      setError('Please accept the terms and conditions');
      return;
    }

    setIsLoading(true);

    // Check if username or email already exists
    const users = JSON.parse(localStorage.getItem('taskmate_users') || '[]');
    const userExists = users.find(
      (u: any) => u.username === username || u.email === email
    );

    if (userExists) {
      setIsLoading(false);
      setError('Username or email already exists');
      return;
    }

    // Save user to localStorage
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      username,
      password, // In production, this should be hashed!
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem('taskmate_users', JSON.stringify(users));

    // Simulate loading animation
    setTimeout(() => {
      onSignUp({ name, email, username });
    }, 600);
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
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-orange-600 to-purple-600 rounded-full blur-3xl"
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
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-green-600 to-blue-600 rounded-full blur-3xl"
        />
      </motion.div>

      {/* Sign Up Card */}
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
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-600 to-purple-600 mb-4"
            >
              <UserPlus className="size-8 text-white" />
            </motion.div>
            <h1 className="text-white mb-2">Create Your Account</h1>
            <p className="text-white/50">
              Join TaskMate AI and boost your productivity
            </p>
          </motion.div>

          {/* Sign Up Form */}
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            onSubmit={handleSubmit}
            className="space-y-4"
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

            {/* Name Field */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-white/80 text-sm block">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40" />
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="pl-10 h-11 bg-[#0F1115]/50 border-[#232834] text-white placeholder:text-white/30 focus-visible:border-orange-500/50 focus-visible:ring-orange-500/20"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-white/80 text-sm block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="pl-10 h-11 bg-[#0F1115]/50 border-[#232834] text-white placeholder:text-white/30 focus-visible:border-orange-500/50 focus-visible:ring-orange-500/20"
                  required
                />
              </div>
            </div>

            {/* Username Field */}
            <div className="space-y-2">
              <label htmlFor="username" className="text-white/80 text-sm block">
                Username
              </label>
              <div className="relative">
                <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  className="pl-10 h-11 bg-[#0F1115]/50 border-[#232834] text-white placeholder:text-white/30 focus-visible:border-orange-500/50 focus-visible:ring-orange-500/20"
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
                  placeholder="Create a password (min. 6 characters)"
                  className="pl-10 h-11 bg-[#0F1115]/50 border-[#232834] text-white placeholder:text-white/30 focus-visible:border-orange-500/50 focus-visible:ring-orange-500/20"
                  required
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label htmlFor="confirm-password" className="text-white/80 text-sm block">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40" />
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="pl-10 h-11 bg-[#0F1115]/50 border-[#232834] text-white placeholder:text-white/30 focus-visible:border-orange-500/50 focus-visible:ring-orange-500/20"
                  required
                />
              </div>
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="flex items-start gap-2 pt-2">
              <Checkbox 
                id="terms"
                checked={agreeToTerms}
                onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                className="mt-0.5 border-[#232834] data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-orange-600 data-[state=checked]:to-purple-600 data-[state=checked]:border-orange-500"
              />
              <label 
                htmlFor="terms" 
                className="text-white/60 text-sm cursor-pointer hover:text-white/80 transition-colors duration-200"
              >
                I agree to the{' '}
                <span className="text-orange-400 hover:text-orange-300">
                  Terms and Conditions
                </span>{' '}
                and{' '}
                <span className="text-orange-400 hover:text-orange-300">
                  Privacy Policy
                </span>
              </label>
            </div>

            {/* Sign Up Button */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="pt-2"
            >
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-gradient-to-r from-orange-600 to-purple-600 hover:from-orange-500 hover:to-purple-500 text-white shadow-lg shadow-orange-500/20 transition-all duration-200"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  'Create Account'
                )}
              </Button>
            </motion.div>
          </motion.form>

          {/* Footer Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="mt-6 text-center"
          >
            <div className="text-white/40 text-sm">
              Already have an account?{' '}
              <button 
                onClick={onSwitchToLogin}
                className="text-orange-400 hover:text-orange-300 transition-colors duration-200"
              >
                Sign in
              </button>
            </div>
          </motion.div>
        </div>

        {/* Bottom glow effect */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-orange-600/10 to-purple-600/10 rounded-3xl blur-2xl" />
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
          className="absolute w-1 h-1 bg-orange-400 rounded-full"
          style={{
            left: `${20 + i * 13}%`,
            bottom: '10%',
          }}
        />
      ))}
    </div>
  );
}
