import React, { useState } from 'react';
import {
  ArrowRight,
  Compass,
  FileText,
  Stethoscope,
  Footprints,
  Activity,
  CheckCircle2,
  GitPullRequest,
  BookOpen,
  Sparkles,
  Layers,
  Terminal,
  Map,
  MessageSquareQuote,
  FileCheck2,
  Search,
  ChevronRight,
  Shield,
  Code2,
  GitBranch,
  Cpu
} from 'lucide-react';

interface LandingPageProps {
  onStartExploring: () => void;
  onOpenHowItWorks: () => void;
  onSelectFeature: (featureTab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartExploring,
  onOpenHowItWorks,
  onSelectFeature,
}) => {
  const [quickRepoInput, setQuickRepoInput] = useState('');
  const [activeStep, setActiveStep] = useState(0);

  const journeySteps = [
    {
      step: '01',
      title: 'Explore Repository',
      desc: 'Inspect unfamiliar repositories with translated folder trees, tech stacks, and beginner readability scores.',
      icon: Compass,
      tab: 'explore',
      detail: 'Analyze structure without cloning. View README summaries and community health.',
    },
    {
      step: '02',
      title: 'Discover Beginner Issue',
      desc: 'Filter genuine beginner tasks with skill-matching algorithms and real effort estimations.',
      icon: Stethoscope,
      tab: 'issuemedic',
      detail: 'Verified "good first issue" diagnosis with prerequisites and maintainer hints.',
    },
    {
      step: '03',
      title: 'Understand the Code',
      desc: 'Translate cryptic stack traces, maintainer comments, and git branching logic visually.',
      icon: Terminal,
      tab: 'playground',
      detail: 'Interactive Git visualizer to practice commits, branches, and merges safely.',
    },
    {
      step: '04',
      title: 'Make Your Changes',
      desc: 'Follow the 9-step newcomer workflow with progressive Mentor hints when you get stuck.',
      icon: Footprints,
      tab: 'newcomer',
      detail: 'Interactive checklist from local fork to branch checkout and commit syntax.',
    },
    {
      step: '05',
      title: 'Create Your Pull Request',
      desc: 'Submit your PR with polite templates and decode review feedback without anxiety.',
      icon: GitPullRequest,
      tab: 'translator',
      detail: 'PR Review Translator decodes code review suggestions into actionable bullet points.',
    },
  ];

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartExploring();
  };

  return (
    <div className="relative z-10 space-y-28 pb-28">
      {/* 1. HERO SECTION */}
      <section className="pt-20 md:pt-28 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 text-xs font-mono text-[#34D399]">
              <span className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981] animate-pulse" />
              <span>THE OPEN SOURCE APPRENTICESHIP ENGINE</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white text-balance leading-[1.1]">
              From Your First Fork <br />
              to Your First <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] via-[#06B6D4] to-[#84CC16]">Merge.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#9CA3AF] leading-relaxed max-w-2xl font-sans">
              Understand complex repositories, discover beginner-friendly issues, practice git visually, and contribute with quiet confidence. No jargon. No intimidation.
            </p>

            {/* Quick Repository Search Input */}
            <form onSubmit={handleQuickSubmit} className="pt-2 max-w-xl">
              <div className="relative flex items-center">
                <div className="absolute left-4 text-[#6B7280]">
                  <Search className="w-4 h-4 text-[#10B981]" />
                </div>
                <input
                  type="text"
                  value={quickRepoInput}
                  onChange={(e) => setQuickRepoInput(e.target.value)}
                  placeholder="e.g. facebook/react or firstcontributions/first-contributions"
                  className="w-full pl-11 pr-32 py-3.5 bg-[#0D110F]/90 border border-[#1E2822] focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] rounded-xl text-sm text-white placeholder-[#6B7280] outline-none transition-all shadow-inner font-mono"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 px-4 py-2 text-xs font-semibold text-[#080B09] bg-[#10B981] hover:bg-[#34D399] rounded-lg transition-colors flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onStartExploring}
                className="btn-emerald-glow px-6 py-3.5 text-sm font-semibold rounded-xl flex items-center gap-2 group whitespace-nowrap shrink-0"
              >
                <span>Start Your Journey</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onOpenHowItWorks}
                className="px-6 py-3.5 text-sm font-medium text-[#F3F4F6] hover:text-white bg-[#121814]/80 hover:bg-[#17221A] border border-[#1E2822] hover:border-[#10B981]/40 rounded-xl transition-all whitespace-nowrap shrink-0"
              >
                Explore Features
              </button>
            </div>

            {/* Quiet Trust Markers */}
            <div className="pt-6 border-t border-[#1E2822] flex flex-wrap items-center gap-6 text-xs text-[#9CA3AF]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                Zero GitHub account required
              </span>
              <span aria-hidden="true" className="text-[#1E2822]">·</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#06B6D4]" />
                Real GitHub REST API
              </span>
              <span aria-hidden="true" className="text-[#1E2822]">·</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#84CC16]" />
                100% Free & Open-Source
              </span>
            </div>
          </div>

          {/* Right Column: Visual Artwork / Interactive Preview Frame */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md rounded-2xl bg-[#0D110F]/80 border border-[#1E2822] p-3 shadow-[0_0_50px_-10px_rgba(16,185,129,0.15)] group hover:border-[#10B981]/50 transition-all overflow-hidden">
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#06B6D4]/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-[#10B981]/20 rounded-full blur-3xl pointer-events-none" />

              <div className="relative aspect-4/3 rounded-xl overflow-hidden border border-[#1E2822] bg-[#090C0A]">
                <img
                  src="/src/assets/images/hero_branchly_growth_1793393397576.jpg"
                  alt="Branchly Git Tree Graphic"
                  className="w-full h-full object-cover filter contrast-105 brightness-90 group-hover:scale-102 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const fallback = target.parentElement?.querySelector('.fallback-box');
                    if (fallback) (fallback as HTMLElement).style.display = 'flex';
                  }}
                />
                <div className="fallback-box hidden w-full h-full flex-col items-center justify-center p-8 bg-[#0D110F] text-center space-y-2">
                  <GitBranch className="w-10 h-10 text-[#10B981]" />
                  <div className="font-heading font-semibold text-sm text-white">Branchly Dev Canvas</div>
                  <p className="text-xs text-[#9CA3AF]">Interactive guided path into open-source repositories.</p>
                </div>

                {/* Overlay Badge */}
                <div className="absolute bottom-3 left-3 right-3 p-3 rounded-lg bg-[#080B09]/85 backdrop-blur-md border border-[#1E2822] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
                    <span className="text-xs font-mono text-[#D1D5DB]">active_session: first-contributions</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#10B981] bg-[#10B981]/15 px-2 py-0.5 rounded border border-[#10B981]/30">
                    LEARN
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE CONTRIBUTION JOURNEY (5-STAGE VISUAL FLOW) */}
      <section className="px-6 max-w-7xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#0D110F]/80 border border-[#1E2822] relative overflow-hidden backdrop-blur-md">
          <div className="max-w-2xl mb-12 space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-[#10B981] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              THE 5-STAGE CONTRIBUTION JOURNEY
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
              From confused bystander to merged contributor.
            </h2>
            <p className="text-sm text-[#9CA3AF]">
              Click any stage below to inspect how BRANCHLY guides you through real open-source workflows.
            </p>
          </div>

          {/* Interactive Stage Nodes */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {journeySteps.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = activeStep === idx;
              return (
                <button
                  key={item.step}
                  onClick={() => setActiveStep(idx)}
                  className={`text-left p-5 rounded-2xl border transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#121814] border-[#10B981] shadow-[0_0_25px_-5px_rgba(16,185,129,0.3)]'
                      : 'bg-[#090C0A]/60 border-[#1E2822] hover:border-[#10B981]/40 hover:bg-[#121814]/60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-xs font-mono font-bold ${isSelected ? 'text-[#10B981]' : 'text-[#6B7280]'}`}>
                        {item.step}
                      </span>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isSelected ? 'bg-[#10B981]/20 text-[#34D399]' : 'bg-[#1E2822] text-[#9CA3AF]'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <h3 className="font-heading text-sm font-bold text-white mb-1.5">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#9CA3AF] leading-relaxed line-clamp-3">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#1E2822] flex items-center justify-between text-[11px] font-mono">
                    <span className={isSelected ? 'text-[#10B981]' : 'text-[#6B7280]'}>
                      {isSelected ? 'Active Focus' : 'Select'}
                    </span>
                    <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-[#10B981]' : 'text-[#6B7280]'}`} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Expanded Detail Box for Selected Stage */}
          <div className="mt-6 p-6 rounded-2xl bg-[#121814]/90 border border-[#10B981]/30 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="text-xs font-mono text-[#10B981] uppercase tracking-wider">
                Stage {journeySteps[activeStep].step} · Actionable Mechanism
              </div>
              <div className="text-sm text-white font-medium">
                {journeySteps[activeStep].detail}
              </div>
            </div>
            <button
              onClick={() => onSelectFeature(journeySteps[activeStep].tab)}
              className="btn-emerald-glow px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 shrink-0"
            >
              <span>Launch {journeySteps[activeStep].title}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. CORE LABS & PURPOSE-BUILT SUITE */}
      <section className="px-6 max-w-7xl mx-auto space-y-12">
        <div className="max-w-2xl space-y-3">
          <div className="text-xs font-mono uppercase tracking-wider text-[#06B6D4] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4]" />
            SPECIALIZED EDUCATIONAL TOOLS
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
            Everything you need for your first contribution.
          </h2>
          <p className="text-sm text-[#9CA3AF]">
            Zero generic AI clutter. Each tool addresses a concrete barrier in open-source collaboration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1: Git Playground */}
          <div className="glass-card p-7 rounded-2xl flex flex-col justify-between group transition-all">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 flex items-center justify-center">
                <Terminal className="w-5 h-5" />
              </div>
              <h3 className="font-heading text-lg font-bold text-white group-hover:text-[#10B981] transition-colors">
                Git Visual Playground
              </h3>
              <p className="text-xs text-[#9CA3AF] leading-relaxed">
                Understand Git by doing, not memorising. Interactive visual branch graph showing master, feature branches, commits, and merge mechanics in real time.
              </p>
              <div className="text-[11px] font-mono text-[#6B7280] space-y-1 pt-1">
                <div>· Interactive commit tree visualizer</div>
                <div>· Safe sandbox command runner</div>
              </div>
            </div>
            <button
              onClick={() => onSelectFeature('playground')}
              className="mt-6 pt-4 border-t border-[#1E2822] text-xs font-semibold text-[#10B981] flex items-center gap-1.5 hover:text-[#34D399]"
            >
              <span>Open Git Playground</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Feature 2: First Contribution Simulator */}
          <div className="glass-card p-7 rounded-2xl flex flex-col justify-between group transition-all">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#06B6D4]/15 text-[#06B6D4] border border-[#06B6D4]/30 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-heading text-lg font-bold text-white group-hover:text-[#06B6D4] transition-colors">
                Contribution Simulator
              </h3>
              <p className="text-xs text-[#9CA3AF] leading-relaxed">
                Zero-risk sandbox to experience the entire open-source journey. Fork, clone, branch, edit, commit, push, PR, and review with simulated maintainer responses.
              </p>
              <div className="text-[11px] font-mono text-[#6B7280] space-y-1 pt-1">
                <div>· 8-stage realistic sandbox</div>
                <div>· Automated maintainer feedback</div>
              </div>
            </div>
            <button
              onClick={() => onSelectFeature('simulator')}
              className="mt-6 pt-4 border-t border-[#1E2822] text-xs font-semibold text-[#06B6D4] flex items-center gap-1.5 hover:text-[#22D3EE]"
            >
              <span>Start Simulator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Feature 3: PR Review Translator */}
          <div className="glass-card p-7 rounded-2xl flex flex-col justify-between group transition-all">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#84CC16]/15 text-[#84CC16] border border-[#84CC16]/30 flex items-center justify-center">
                <MessageSquareQuote className="w-5 h-5" />
              </div>
              <h3 className="font-heading text-lg font-bold text-white group-hover:text-[#84CC16] transition-colors">
                PR Review Translator
              </h3>
              <p className="text-xs text-[#9CA3AF] leading-relaxed">
                Turn curt or confusing maintainer comments into friendly explanations with exact code diffs and polite response suggestions.
              </p>
              <div className="text-[11px] font-mono text-[#6B7280] space-y-1 pt-1">
                <div>· Tone & intent breakdown</div>
                <div>· Ready-to-use polite replies</div>
              </div>
            </div>
            <button
              onClick={() => onSelectFeature('translator')}
              className="mt-6 pt-4 border-t border-[#1E2822] text-xs font-semibold text-[#84CC16] flex items-center gap-1.5 hover:text-[#A3E635]"
            >
              <span>Translate Feedback</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Feature 4: IssueMedic */}
          <div className="glass-card p-7 rounded-2xl flex flex-col justify-between group transition-all">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 flex items-center justify-center">
                <Stethoscope className="w-5 h-5" />
              </div>
              <h3 className="font-heading text-lg font-bold text-white group-hover:text-[#10B981] transition-colors">
                IssueMedic
              </h3>
              <p className="text-xs text-[#9CA3AF] leading-relaxed">
                Deconstruct cryptically formatted bug reports. View prerequisite knowledge, estimated difficulty, and question prompts before you start.
              </p>
              <div className="text-[11px] font-mono text-[#6B7280] space-y-1 pt-1">
                <div>· Plain English problem diagnosis</div>
                <div>· Honest difficulty ratings</div>
              </div>
            </div>
            <button
              onClick={() => onSelectFeature('issuemedic')}
              className="mt-6 pt-4 border-t border-[#1E2822] text-xs font-semibold text-[#10B981] flex items-center gap-1.5 hover:text-[#34D399]"
            >
              <span>Open IssueMedic</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Feature 5: DocSmith */}
          <div className="glass-card p-7 rounded-2xl flex flex-col justify-between group transition-all">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#06B6D4]/15 text-[#06B6D4] border border-[#06B6D4]/30 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-heading text-lg font-bold text-white group-hover:text-[#06B6D4] transition-colors">
                DocSmith (Documentation Forge)
              </h3>
              <p className="text-xs text-[#9CA3AF] leading-relaxed">
                Generate and refine beginner-friendly READMEs, CONTRIBUTING.md files, and license guides with live markdown preview and ZIP download.
              </p>
              <div className="text-[11px] font-mono text-[#6B7280] space-y-1 pt-1">
                <div>· Live split-pane editor & preview</div>
                <div>· One-click ZIP package export</div>
              </div>
            </div>
            <button
              onClick={() => onSelectFeature('docsmith')}
              className="mt-6 pt-4 border-t border-[#1E2822] text-xs font-semibold text-[#06B6D4] flex items-center gap-1.5 hover:text-[#22D3EE]"
            >
              <span>Open DocSmith</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Feature 6: Learning Roadmap */}
          <div className="glass-card p-7 rounded-2xl flex flex-col justify-between group transition-all">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#84CC16]/15 text-[#84CC16] border border-[#84CC16]/30 flex items-center justify-center">
                <Map className="w-5 h-5" />
              </div>
              <h3 className="font-heading text-lg font-bold text-white group-hover:text-[#84CC16] transition-colors">
                Skill Roadmap (5 Levels)
              </h3>
              <p className="text-xs text-[#9CA3AF] leading-relaxed">
                A structured 5-tier curriculum: Git Basics, Finding Issues, First PR, Code Reviews, and Becoming a Confident Contributor.
              </p>
              <div className="text-[11px] font-mono text-[#6B7280] space-y-1 pt-1">
                <div>· Trackable completion checkmarks</div>
                <div>· Curated exercises for each level</div>
              </div>
            </div>
            <button
              onClick={() => onSelectFeature('roadmap')}
              className="mt-6 pt-4 border-t border-[#1E2822] text-xs font-semibold text-[#84CC16] flex items-center gap-1.5 hover:text-[#A3E635]"
            >
              <span>View Curriculum</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. PEDAGOGICAL PHILOSOPHY (Dark Aesthetic) */}
      <section className="px-6 max-w-7xl mx-auto">
        <div className="p-10 sm:p-14 rounded-3xl bg-[#0D110F]/90 border border-[#1E2822] space-y-8 relative overflow-hidden backdrop-blur-md">
          <div className="max-w-3xl space-y-4">
            <div className="text-xs font-mono uppercase tracking-wider text-[#10B981] flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#10B981]" />
              PEDAGOGICAL PHILOSOPHY
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
              Learn the mental model. <br />
              Don't just copy terminal commands.
            </h2>
            <p className="text-sm sm:text-base text-[#9CA3AF] leading-relaxed">
              Copying commands blindly leaves you stranded when you encounter a merge conflict or an interactive rebase. BRANCHLY treats open-source contribution as a structured learning discipline — teaching you why repositories are organized the way they are and how to interact respectfully with real maintainers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
            <div className="p-5 rounded-xl bg-[#121814] border border-[#1E2822] space-y-2">
              <div className="text-xs font-semibold text-[#10B981] flex items-center gap-1.5">
                <Code2 className="w-4 h-4" />
                <span>Patience over Speed</span>
              </div>
              <p className="text-xs text-[#9CA3AF] leading-relaxed">
                Take the time to read the documentation first. Maintainers appreciate thoughtful contributions far more than rushed PRs.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-[#121814] border border-[#1E2822] space-y-2">
              <div className="text-xs font-semibold text-[#06B6D4] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Progressive Guidance</span>
              </div>
              <p className="text-xs text-[#9CA3AF] leading-relaxed">
                Mentor Mode nudges your thinking with incremental hints rather than generating copy-paste answers that bypass learning.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-[#121814] border border-[#1E2822] space-y-2">
              <div className="text-xs font-semibold text-[#84CC16] flex items-center gap-1.5">
                <Cpu className="w-4 h-4" />
                <span>Transparent AI</span>
              </div>
              <p className="text-xs text-[#9CA3AF] leading-relaxed">
                Powered by open-weight architectures (Gemma 2) with clear model attribution and reliable deterministic fallbacks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FINAL CALL TO ACTION */}
      <section className="px-6 max-w-7xl mx-auto text-center space-y-6">
        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
            Ready to make your first contribution?
          </h2>
          <p className="text-base text-[#9CA3AF]">
            Join aspiring developers entering open source with guided confidence.
          </p>
        </div>

        <div>
          <button
            onClick={onStartExploring}
            className="btn-emerald-glow px-8 py-4 text-base font-semibold rounded-xl inline-flex items-center gap-2 group"
          >
            <span>Launch Workspace</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>
    </div>
  );
};
