import React from 'react';
import {
  GitPullRequest,
  GitBranch,
  Terminal,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  HelpCircle,
  FolderGit2,
  Sparkles
} from 'lucide-react';

interface HowItWorksPageProps {
  onStartExploring: () => void;
  onOpenNewcomer: () => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({
  onStartExploring,
  onOpenNewcomer,
}) => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">
      {/* Header */}
      <div className="space-y-4 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 text-xs font-mono uppercase tracking-wider text-[#10B981]">
          <BookOpen className="w-3.5 h-3.5 text-[#10B981]" />
          <span>THE COMPLETE BLUEPRINT</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-white text-balance leading-tight">
          How open-source contribution actually works.
        </h1>
        <p className="text-base text-[#9CA3AF] leading-relaxed">
          Open source is not mysterious code magic — it is a structured collaboration protocol. Here is the lifecycle of every contribution from your first thought to maintainer merge.
        </p>
      </div>

      {/* The 4 Phases */}
      <div className="space-y-8">
        {[
          {
            phase: 'PHASE 01',
            title: 'Discovery & Etiquette',
            desc: 'Before typing a single line of code, find an issue where help is genuinely wanted. Read CONTRIBUTING.md and leave a friendly comment asking if the issue is available.',
            tips: [
              'Check for the "good first issue" or "help wanted" labels.',
              'Avoid claiming issues where another contributor already commented in the last 48 hours.',
              'Keep your comment polite and brief.'
            ]
          },
          {
            phase: 'PHASE 02',
            title: 'Forking & Local Environment',
            desc: 'Fork the repository to your personal GitHub account, then clone it to your machine. Always add the original repo as your "upstream" remote so your fork never falls behind.',
            tips: [
              'Run dependency installation (npm install) in an isolated terminal.',
              'Verify the existing test suite passes before writing any edits.',
              'Never touch files outside the specific scope of the issue.'
            ]
          },
          {
            phase: 'PHASE 03',
            title: 'Branching & Atomic Commits',
            desc: 'Create an isolated feature branch (e.g. fix/typo-in-docs). Write focused code changes, test locally, and commit with a present-tense conventional commit message.',
            tips: [
              'One PR should address one issue only.',
              'Use clear commit titles like "docs: fix typo in installation guide".',
              'Run linters to match project code style automatically.'
            ]
          },
          {
            phase: 'PHASE 04',
            title: 'The Pull Request & Code Review',
            desc: 'Push your branch to your personal GitHub fork and click "Compare & pull request". Fill in the project description template honestly and link the issue number.',
            tips: [
              'Be gracious when maintainers request adjustments — review is learning, not criticism.',
              'Pushing new commits to your branch updates the PR automatically.',
              'Celebrate your merged commit in open source!'
            ]
          }
        ].map((item, idx) => (
          <div key={idx} className="p-8 rounded-2xl bg-[#0D110F]/90 border border-[#1E2822] space-y-4 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-[#10B981] bg-[#10B981]/15 border border-[#10B981]/30 px-3 py-1 rounded-lg">
                {item.phase}
              </span>
              <h2 className="font-heading text-xl font-bold text-white">
                {item.title}
              </h2>
            </div>
            <p className="text-sm text-[#9CA3AF] leading-relaxed">
              {item.desc}
            </p>
            <div className="pt-3 border-t border-[#1E2822] space-y-2">
              <div className="text-[11px] font-mono text-[#6B7280] uppercase tracking-wider">
                Pro-Tips for Newcomers:
              </div>
              {item.tips.map((tip, tIdx) => (
                <div key={tIdx} className="flex items-start gap-2.5 text-xs text-[#E5E7EB]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* CTA Box */}
      <div className="p-8 md:p-12 rounded-3xl bg-[#0D110F]/90 border border-[#10B981]/30 text-center space-y-4 relative overflow-hidden backdrop-blur-md">
        <div className="absolute inset-0 bg-radial from-[#10B981]/10 via-transparent to-transparent pointer-events-none" />
        <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-white relative z-10">
          Ready to experience the workflow step-by-step?
        </h2>
        <p className="text-sm text-[#9CA3AF] max-w-xl mx-auto relative z-10">
          Walk through each stage safely using real repositories in the Newcomer Path.
        </p>
        <div className="pt-3 flex flex-wrap items-center justify-center gap-3 relative z-10">
          <button
            onClick={onOpenNewcomer}
            className="btn-emerald-glow px-6 py-3 text-xs font-bold rounded-xl flex items-center gap-2"
          >
            <span>Open Newcomer Path</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onStartExploring}
            className="px-6 py-3 text-xs font-semibold text-white bg-[#121814] border border-[#1E2822] hover:border-[#10B981]/40 rounded-xl transition-colors"
          >
            Discover Curated Repos
          </button>
        </div>
      </div>
    </div>
  );
};
