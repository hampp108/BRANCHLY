import React, { useState } from 'react';
import { GitBranch, Menu, X, ArrowRight, Compass, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  isLoggedIn: boolean;
  userName?: string;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenAuth,
  isLoggedIn,
  userName,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#080B09]/85 backdrop-blur-md border-b border-[#1E2822]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2.5 text-left hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981]"
          aria-label="BRANCHLY Home"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#10B981] to-[#06B6D4] text-[#080B09] flex items-center justify-center shadow-[0_0_15px_-3px_rgba(16,185,129,0.5)]">
            <GitBranch className="w-4 h-4 stroke-[2.4]" />
          </div>
          <span className="font-heading font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
            BRANCHLY
            <span className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#10B981]/10 text-[#34D399] border border-[#10B981]/25">
              DEV
            </span>
          </span>
        </button>

        {/* Zone 2: Single-line clean text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#9CA3AF]">
          <button
            onClick={() => onNavigate('landing')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white py-1 border-b-2 ${
              currentView === 'landing'
                ? 'border-[#10B981] text-white font-semibold'
                : 'border-transparent'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('explore')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white py-1 border-b-2 ${
              currentView === 'explore'
                ? 'border-[#10B981] text-white font-semibold'
                : 'border-transparent'
            }`}
          >
            Explore
          </button>
          <button
            onClick={() => onNavigate('how-it-works')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white py-1 border-b-2 ${
              currentView === 'how-it-works'
                ? 'border-[#10B981] text-white font-semibold'
                : 'border-transparent'
            }`}
          >
            How It Works
          </button>
          <button
            onClick={() => onNavigate('about')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white py-1 border-b-2 ${
              currentView === 'about'
                ? 'border-[#10B981] text-white font-semibold'
                : 'border-transparent'
            }`}
          >
            About
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('dashboard')}
                className="btn-emerald-glow px-4 py-2 text-sm font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <span>Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onLogout}
                className="text-xs text-[#9CA3AF] hover:text-white font-medium transition-colors px-2 py-1"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => onOpenAuth('login')}
                className="text-sm font-medium text-[#D1D5DB] hover:text-[#10B981] transition-colors px-3 py-1.5 whitespace-nowrap shrink-0"
              >
                Log In
              </button>
              <button
                onClick={() => onNavigate('dashboard')}
                className="btn-emerald-glow px-4 py-2 text-sm font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu hamburger */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#9CA3AF] hover:text-white hover:bg-[#121814] rounded-lg transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#1E2822] bg-[#0D110F] px-6 py-4 space-y-3">
          <button
            onClick={() => {
              onNavigate('landing');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium text-[#F3F4F6]"
          >
            Home
          </button>
          <button
            onClick={() => {
              onNavigate('explore');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium text-[#F3F4F6]"
          >
            Explore
          </button>
          <button
            onClick={() => {
              onNavigate('how-it-works');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium text-[#F3F4F6]"
          >
            How It Works
          </button>
          <button
            onClick={() => {
              onNavigate('about');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium text-[#F3F4F6]"
          >
            About
          </button>
          <div className="pt-3 border-t border-[#1E2822] flex flex-col gap-2">
            {isLoggedIn ? (
              <>
                <button
                  onClick={() => {
                    onNavigate('dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-center text-sm font-semibold text-[#080B09] bg-[#10B981] rounded-lg"
                >
                  Enter Workspace
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-center text-xs text-[#9CA3AF]"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    onOpenAuth('login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-center text-sm font-medium text-[#F3F4F6] border border-[#1E2822] rounded-lg"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    onNavigate('dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-center text-sm font-semibold text-[#080B09] bg-[#10B981] rounded-lg"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
