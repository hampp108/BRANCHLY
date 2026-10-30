import React from 'react';
import { GitBranch, Shield, Heart, Terminal, Sparkles } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
  onOpenModelModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenModelModal }) => {
  return (
    <footer className="bg-[#090C0A] border-t border-[#1E2822] text-[#9CA3AF] relative z-10">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#10B981] to-[#06B6D4] text-[#080B09] flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.4)]">
                <GitBranch className="w-4 h-4 stroke-[2.4]" />
              </div>
              <span className="font-heading font-extrabold text-lg text-white tracking-tight">
                BRANCHLY
              </span>
            </div>
            <p className="text-xs leading-relaxed text-[#9CA3AF]">
              From Your First Fork to Your First Merge. An educational open-source companion designed to help beginners explore, learn, and contribute with quiet confidence.
            </p>
            <div className="pt-1 flex items-center gap-2 text-xs text-[#34D399]">
              <Shield className="w-3.5 h-3.5" />
              <span>Free, open-source & beginner-first</span>
            </div>
          </div>

          {/* Platform Columns */}
          <div>
            <h4 className="font-mono text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('explore')}
                  className="hover:text-[#10B981] transition-colors text-left"
                >
                  Explore Repositories
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('docsmith')}
                  className="hover:text-[#10B981] transition-colors text-left"
                >
                  DocSmith (Documentation)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('issuemedic')}
                  className="hover:text-[#10B981] transition-colors text-left"
                >
                  IssueMedic (Issue Analysis)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('newcomer')}
                  className="hover:text-[#10B981] transition-colors text-left"
                >
                  Newcomer Path
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('repohealth')}
                  className="hover:text-[#10B981] transition-colors text-left"
                >
                  RepoHealth Checker
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Learning & Labs
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('playground')}
                  className="hover:text-[#10B981] transition-colors text-left"
                >
                  Git Visual Playground
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('simulator')}
                  className="hover:text-[#10B981] transition-colors text-left"
                >
                  First Contribution Simulator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('roadmap')}
                  className="hover:text-[#10B981] transition-colors text-left"
                >
                  5-Level Skill Roadmap
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('how-it-works')}
                  className="hover:text-[#10B981] transition-colors text-left"
                >
                  How It Works
                </button>
              </li>
              <li>
                {onOpenModelModal && (
                  <button
                    onClick={onOpenModelModal}
                    className="hover:text-[#34D399] transition-colors text-left flex items-center gap-1 font-medium text-[#10B981]"
                  >
                    <span>Open AI Architecture Specs</span>
                  </button>
                )}
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Licensing & API
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="text-white font-medium">MIT License</span>
                <span className="block text-[11px] text-[#6B7280]">Open-source educational software</span>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#10B981] transition-colors block"
                >
                  Powered by GitHub REST API
                </a>
              </li>
              <li>
                <span className="block text-[11px] text-[#6B7280]">Respects public GitHub rate guidelines</span>
              </li>
              <li className="pt-2 text-[11px] text-[#6B7280]">
                Zero trackers · No telemetry · No ads
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[#1E2822] flex flex-col sm:flex-row items-center justify-between text-xs text-[#6B7280] gap-4">
          <p>© {new Date().getFullYear()} BRANCHLY. Built for curious learners and aspiring open-source contributors.</p>
          <div className="flex items-center gap-1 text-xs text-[#9CA3AF]">
            <span>Crafted with patience & purpose</span>
            <Heart className="w-3.5 h-3.5 text-[#10B981] fill-[#10B981]" />
          </div>
        </div>
      </div>
    </footer>
  );
};
