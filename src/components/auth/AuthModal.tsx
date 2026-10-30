import React, { useState } from 'react';
import { X, ShieldCheck, ArrowRight, User, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: 'login' | 'signup';
  onLoginSuccess: (user: { name: string; email: string; isDemo: boolean }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode,
  onLoginSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password should be at least 6 characters.');
      return;
    }
    if (mode === 'signup') {
      if (!name.trim()) {
        setError('Please enter your name.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }

    onLoginSuccess({
      name: mode === 'signup' ? name : (email.split('@')[0] || 'Open Source Learner'),
      email,
      isDemo: false
    });
    onClose();
  };

  const handleDemoMode = () => {
    onLoginSuccess({
      name: 'Open Source Newcomer',
      email: 'newcomer@branchly.demo',
      isDemo: true
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#0D110F] rounded-2xl border border-[#1E2822] shadow-[0_10px_40px_rgba(0,0,0,0.8)] p-6 sm:p-8 space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-[#6B7280] hover:text-white hover:bg-[#121814] rounded-lg transition-colors"
          aria-label="Close authentication modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#10B981]">
            {mode === 'login' ? 'WELCOME BACK' : 'START LEARNING'}
          </div>
          <h3 className="font-heading text-2xl font-bold text-white">
            {mode === 'login' ? 'Log in to BRANCHLY' : 'Create your account'}
          </h3>
          <p className="text-xs text-[#9CA3AF]">
            Track your progress from your first fork to your first merge.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 text-xs bg-red-950/40 text-red-400 rounded-xl border border-red-900/50">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-white">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ada Lovelace"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#1E2822] bg-[#080B09] text-white placeholder-[#6B7280] focus:outline-none focus:border-[#10B981]"
                required
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-white">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.edu"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#1E2822] bg-[#080B09] text-white placeholder-[#6B7280] focus:outline-none focus:border-[#10B981]"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-white">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#1E2822] bg-[#080B09] text-white placeholder-[#6B7280] focus:outline-none focus:border-[#10B981]"
              required
            />
          </div>

          {mode === 'signup' && (
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-white">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#1E2822] bg-[#080B09] text-white placeholder-[#6B7280] focus:outline-none focus:border-[#10B981]"
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="btn-emerald-glow w-full py-2.5 px-4 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
          >
            <span>{mode === 'login' ? 'Log In' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Mode & Toggle Section */}
        <div className="space-y-3 pt-3 border-t border-[#1E2822]">
          <button
            type="button"
            onClick={handleDemoMode}
            className="w-full py-2.5 px-3 text-xs font-medium text-[#10B981] bg-[#10B981]/10 hover:bg-[#10B981]/20 border border-[#10B981]/30 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Explore in Demo Mode (No Registration)</span>
          </button>

          <div className="text-center">
            {mode === 'login' ? (
              <p className="text-xs text-[#9CA3AF]">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setError(null);
                  }}
                  className="font-medium text-[#10B981] hover:underline"
                >
                  Create one now
                </button>
              </p>
            ) : (
              <p className="text-xs text-[#9CA3AF]">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                  }}
                  className="font-medium text-[#10B981] hover:underline"
                >
                  Log in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
