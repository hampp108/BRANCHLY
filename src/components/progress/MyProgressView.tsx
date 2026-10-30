import React from 'react';
import {
  Trophy,
  CheckCircle2,
  Circle,
  GitBranch,
  Bookmark,
  Calendar,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  FolderGit2,
  Sparkles,
  GitPullRequest,
  GitMerge,
  BookOpen,
  Zap,
  Target
} from 'lucide-react';
import { UserProgress, UserPreferences, Milestone } from '../../types';

interface MyProgressViewProps {
  userProgress: UserProgress;
  userPrefs: UserPreferences;
  onNavigateTab: (tab: string) => void;
  onSelectRepo: (fullName: string) => void;
}

export const MyProgressView: React.FC<MyProgressViewProps> = ({
  userProgress,
  userPrefs,
  onNavigateTab,
  onSelectRepo,
}) => {
  const completedMilestones = userProgress.milestones.filter(m => m.completed);

  // Group milestones into SIMULATED vs VERIFIED
  const simulatedMilestones = userProgress.milestones.filter(m => m.type === 'simulated');
  const verifiedMilestones = userProgress.milestones.filter(m => m.type === 'verified' || !m.type);

  // Timeline events
  const timelineEvents = [
    {
      id: 't-1',
      title: 'First Repository Explored',
      description: userProgress.exploredRepos[0]?.fullName
        ? `Explored public repository ${userProgress.exploredRepos[0].fullName}`
        : 'Inspected a public open-source project and viewed its file structure.',
      category: 'VERIFIED GITHUB ACTIVITY',
      isVerified: true,
      completed: userProgress.exploredRepos.length > 0,
      date: userProgress.exploredRepos[0]?.exploredAt,
    },
    {
      id: 't-2',
      title: 'First Issue Bookmarked',
      description: userProgress.savedIssues[0]?.issue?.title
        ? `Bookmarked issue #${userProgress.savedIssues[0].issue.number} for study.`
        : 'Saved an issue suitable for your current skill level.',
      category: 'VERIFIED GITHUB ACTIVITY',
      isVerified: true,
      completed: userProgress.savedIssues.length > 0,
      date: userProgress.savedIssues[0]?.savedAt,
    },
    {
      id: 't-3',
      title: 'First Git Playground Lesson Completed',
      description: 'Practiced branch visualizer or command exercises in browser simulator.',
      category: 'SIMULATED LEARNING ACTIVITY',
      isVerified: false,
      completed: (userProgress.completedLessons?.length || 0) > 0,
      date: undefined,
    },
    {
      id: 't-4',
      title: 'First Practice Contribution Simulator Completed',
      description: 'Completed the 8-stage safe contribution simulation from fork to PR.',
      category: 'SIMULATED LEARNING ACTIVITY',
      isVerified: false,
      completed: (userProgress.simulatedContributionsCount || 0) > 0,
      date: undefined,
    },
    {
      id: 't-5',
      title: 'First Real GitHub Fork',
      description: 'Forked a real open-source repository to your personal GitHub account.',
      category: 'VERIFIED GITHUB ACTIVITY',
      isVerified: true,
      completed: false, // Honest: only true if verified
      date: undefined,
    },
    {
      id: 't-6',
      title: 'First Real Pull Request Submitted',
      description: 'Proposed real code or documentation changes to an upstream repository.',
      category: 'VERIFIED GITHUB ACTIVITY',
      isVerified: true,
      completed: false,
      date: undefined,
    },
    {
      id: 't-7',
      title: 'First Merged Pull Request',
      description: 'Your contribution officially merged into an open-source project!',
      category: 'VERIFIED GITHUB ACTIVITY',
      isVerified: true,
      completed: false,
      date: undefined,
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header Cockpit Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-[#0D110F]/90 border border-[#1E2822] flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-32 bg-[#10B981]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 text-[10px] font-mono uppercase tracking-wider text-[#10B981]">
            <Trophy className="w-3 h-3 text-[#10B981]" />
            <span>CONTRIBUTOR MILESTONES & TIMELINE</span>
          </div>
          <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-white">
            My Learning & Contribution Journey
          </h2>
          <p className="text-xs text-[#9CA3AF]">
            Verified milestones for <span className="text-white font-medium">{userPrefs.name}</span>. Clear distinction between safe simulations and live GitHub contributions.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-[#10B981] bg-[#121814] border border-[#10B981]/30 px-4 py-2.5 rounded-xl font-bold relative z-10">
          <Trophy className="w-4 h-4 text-[#10B981]" />
          <span>{completedMilestones.length} of {userProgress.milestones.length} Milestones</span>
        </div>
      </div>

      {/* Honest Distinction Callout */}
      <div className="p-4 rounded-xl bg-[#121814] border border-[#1E2822] text-xs text-[#9CA3AF] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0" />
          <span>
            <strong className="text-white">Honest Metric Guarantee:</strong> BRANCHLY never fabricates merged PRs or contributions. Simulated practice milestones are clearly separated from live GitHub events.
          </span>
        </div>
      </div>

      {/* Contribution Timeline */}
      <div className="p-8 rounded-2xl bg-[#0D110F]/90 border border-[#1E2822] space-y-6 backdrop-blur-md">
        <div className="flex items-center justify-between pb-3 border-b border-[#1E2822]">
          <h3 className="font-heading font-bold text-lg text-white">
            Chronological Contribution Timeline
          </h3>
          <span className="text-xs font-mono text-[#6B7280]">Step-by-step evolution</span>
        </div>

        <div className="relative border-l-2 border-[#1E2822] ml-4 pl-6 space-y-8">
          {timelineEvents.map((ev) => (
            <div key={ev.id} className="relative group">
              {/* Dot on line */}
              <div
                className={`absolute -left-[31px] top-0.5 w-5 h-5 rounded-full border-2 border-[#0D110F] flex items-center justify-center transition-all ${
                  ev.completed
                    ? 'bg-[#10B981] text-[#080B09] shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                    : 'bg-[#1E2822] text-transparent'
                }`}
              >
                {ev.completed && <CheckCircle2 className="w-3.5 h-3.5 text-[#080B09]" />}
              </div>

              {/* Event Card Content */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2 text-[10px]">
                  <span
                    className={`font-mono font-bold px-2 py-0.5 rounded ${
                      ev.isVerified
                        ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30'
                        : 'bg-[#06B6D4]/15 text-[#06B6D4] border border-[#06B6D4]/30'
                    }`}
                  >
                    {ev.category}
                  </span>
                  {ev.completed ? (
                    <span className="text-[#10B981] font-bold">✓ Achieved</span>
                  ) : (
                    <span className="text-[#6B7280]">Pending completion</span>
                  )}
                  {ev.date && (
                    <span className="text-[#6B7280]">· {new Date(ev.date).toLocaleDateString()}</span>
                  )}
                </div>

                <h4 className={`font-heading font-bold text-sm ${ev.completed ? 'text-white' : 'text-[#6B7280]'}`}>
                  {ev.title}
                </h4>

                <p className="text-xs text-[#9CA3AF] leading-relaxed max-w-2xl">
                  {ev.description}
                </p>

                {!ev.completed && (
                  <div className="pt-1">
                    {!ev.isVerified && ev.id === 't-3' && (
                      <button
                        onClick={() => onNavigateTab('playground')}
                        className="text-xs font-semibold text-[#10B981] hover:underline inline-flex items-center gap-1"
                      >
                        <span>Open Git Playground</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                    {!ev.isVerified && ev.id === 't-4' && (
                      <button
                        onClick={() => onNavigateTab('simulator')}
                        className="text-xs font-semibold text-[#10B981] hover:underline inline-flex items-center gap-1"
                      >
                        <span>Start Practice Simulator</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                    {ev.isVerified && ev.id === 't-5' && (
                      <button
                        onClick={() => onNavigateTab('newcomer')}
                        className="text-xs font-semibold text-[#10B981] hover:underline inline-flex items-center gap-1"
                      >
                        <span>Follow Newcomer Path</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2-Column Split: Explored Repos & Bookmarked Issues */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Explored Repositories */}
        <div className="p-6 rounded-2xl bg-[#0D110F]/90 border border-[#1E2822] space-y-4 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-[#10B981]" />
              <span>Explored Repositories ({userProgress.exploredRepos.length})</span>
            </h3>
            <button
              onClick={() => onNavigateTab('explore')}
              className="text-xs text-[#10B981] hover:underline"
            >
              Explore more
            </button>
          </div>

          <div className="space-y-2.5">
            {userProgress.exploredRepos.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#6B7280] bg-[#121814] rounded-xl border border-dashed border-[#1E2822]">
                No explored repos yet. Discover curated repos on the Explore page.
              </div>
            ) : (
              userProgress.exploredRepos.map((r, i) => (
                <div
                  key={i}
                  onClick={() => onSelectRepo(r.fullName)}
                  className="p-3 rounded-xl border border-[#1E2822] bg-[#121814] hover:border-[#10B981]/40 transition-colors cursor-pointer flex items-center justify-between group"
                >
                  <div className="min-w-0 pr-2">
                    <div className="font-heading font-semibold text-xs text-white group-hover:text-[#10B981] transition-colors truncate">
                      {r.fullName}
                    </div>
                    <div className="text-[11px] text-[#9CA3AF] truncate">
                      {r.description || 'Open-source repository.'}
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#6B7280] group-hover:text-[#10B981] group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Bookmarked Issues */}
        <div className="p-6 rounded-2xl bg-[#0D110F]/90 border border-[#1E2822] space-y-4 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-[#10B981]" />
              <span>Saved Issues ({userProgress.savedIssues.length})</span>
            </h3>
            <button
              onClick={() => onNavigateTab('issuemedic')}
              className="text-xs text-[#10B981] hover:underline"
            >
              Browse issues
            </button>
          </div>

          {userProgress.savedIssues.length === 0 ? (
            <div className="p-6 text-center text-xs text-[#6B7280] bg-[#121814] rounded-xl border border-dashed border-[#1E2822]">
              No saved issues yet. Bookmark issues in IssueMedic to build your personal contribution shortlist.
            </div>
          ) : (
            <div className="space-y-2.5">
              {userProgress.savedIssues.map((item, i) => (
                <div
                  key={i}
                  onClick={() => onNavigateTab('issuemedic')}
                  className="p-3 rounded-xl border border-[#1E2822] bg-[#121814] hover:border-[#10B981]/40 transition-colors cursor-pointer space-y-1"
                >
                  <div className="font-heading font-semibold text-xs text-white truncate">
                    #{item.issue.number} {item.issue.title}
                  </div>
                  <div className="text-[11px] text-[#9CA3AF] flex items-center gap-2">
                    <span className="text-[#10B981]">{item.repoFullName}</span>
                    <span>·</span>
                    <span>Saved {new Date(item.savedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
