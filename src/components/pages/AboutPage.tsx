import React from 'react';
import {
  GitBranch,
  Heart,
  ShieldCheck,
  Cpu,
  BookOpen,
  Users,
  Compass,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface AboutPageProps {
  onStartExploring: () => void;
  onOpenModelModal: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onStartExploring,
  onOpenModelModal,
}) => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">
      {/* Header with Mascot */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 text-xs font-mono uppercase tracking-wider text-[#10B981]">
            <Heart className="w-3.5 h-3.5 text-[#10B981]" />
            <span>OUR MISSION & PHILOSOPHY</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-white text-balance leading-tight">
            Demystifying open source for the next generation.
          </h1>
          <p className="text-base text-[#9CA3AF] leading-relaxed">
            BRANCHLY was built on a foundational conviction: every developer remembers the stomach-drop moment of wanting to contribute to open source but feeling too inexperienced to ask.
          </p>
        </div>

        <div className="md:col-span-4 flex justify-center">
          <div className="w-48 h-48 rounded-2xl bg-[#0D110F] border border-[#1E2822] p-3 flex items-center justify-center overflow-hidden relative group">
            <div className="absolute inset-0 bg-[#10B981]/5 group-hover:bg-[#10B981]/10 transition-colors" />
            <img
              src="/src/assets/images/mascot_branchly_sprout_1793393397424.jpg"
              alt="BRANCHLY Sprout Mascot welcoming beginners"
              className="w-full h-full object-contain rounded-xl relative z-10"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>

      {/* Core Principles */}
      <div className="space-y-6">
        <h2 className="font-heading text-2xl font-bold text-white">
          Our Three Guiding Principles
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#0D110F]/90 border border-[#1E2822] space-y-3 backdrop-blur-md">
            <div className="w-9 h-9 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] flex items-center justify-center font-bold font-mono">
              1
            </div>
            <h3 className="font-heading font-bold text-base text-white">
              Simplicity Over Decoration
            </h3>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              We reject sensory overload, blinding purple gradients, and bloated dashboards. A calm visual environment allows learners to concentrate on the logic of code.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0D110F]/90 border border-[#1E2822] space-y-3 backdrop-blur-md">
            <div className="w-9 h-9 rounded-xl bg-[#06B6D4]/15 border border-[#06B6D4]/30 text-[#06B6D4] flex items-center justify-center font-bold font-mono">
              2
            </div>
            <h3 className="font-heading font-bold text-base text-white">
              Clarity Over Complexity
            </h3>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              Git commands are not secret spells. We explain why an upstream remote exists, what a detached HEAD means, and how to branch with clean discipline.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0D110F]/90 border border-[#1E2822] space-y-3 backdrop-blur-md">
            <div className="w-9 h-9 rounded-xl bg-[#84CC16]/15 border border-[#84CC16]/30 text-[#84CC16] flex items-center justify-center font-bold font-mono">
              3
            </div>
            <h3 className="font-heading font-bold text-base text-white">
              Learning Over Shortcuts
            </h3>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              Our AI features are tutors, not ghostwriters. Mentor Mode gives progressive hints so you understand your pull request rather than blindly copying answers.
            </p>
          </div>
        </div>
      </div>

      {/* Open Source & Transparent AI */}
      <div className="p-8 rounded-2xl bg-[#0D110F]/90 border border-[#1E2822] space-y-5 backdrop-blur-md">
        <div className="space-y-1">
          <div className="text-xs font-mono uppercase tracking-wider text-[#10B981]">
            OPEN-WEIGHT COMMITMENT
          </div>
          <h2 className="font-heading text-xl font-bold text-white">
            Genuine Open-Weight AI Architecture
          </h2>
          <p className="text-xs text-[#9CA3AF] leading-relaxed max-w-2xl">
            BRANCHLY believes in the principles of open weights. We do not brand closed proprietary models as open source. Our assistance pipelines are architected on Gemma 2 (9B open-weights) with transparent licensing and verified deterministic heuristic fallbacks.
          </p>
        </div>

        <div className="pt-2 flex items-center gap-3">
          <button
            onClick={onOpenModelModal}
            className="btn-emerald-glow px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>View Architecture Specifications</span>
          </button>
        </div>
      </div>

      {/* CTA Bottom */}
      <div className="text-center space-y-4 pt-6">
        <h3 className="font-heading font-bold text-xl text-white">
          Take your first step into open source today.
        </h3>
        <div>
          <button
            onClick={onStartExploring}
            className="btn-emerald-glow px-6 py-3 text-xs font-semibold rounded-xl inline-flex items-center gap-2"
          >
            <span>Explore Repositories</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
