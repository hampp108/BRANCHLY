import React from 'react';
import {
  Compass,
  Stethoscope,
  Footprints,
  FileText,
  Activity,
  ArrowRight,
  GitBranch,
  Bookmark,
  CheckCircle2,
  ExternalLink,
  Flame,
  Clock,
  Terminal,
  Sparkles,
  MessageSquareQuote,
  Map
} from 'lucide-react';
import { GitHubRepo, UserProgress, UserPreferences } from '../../types';

interface OverviewViewProps {
  activeRepo: GitHubRepo | null;
  userPrefs: UserPreferences;
  userProgress: UserProgress;
  onNavigateTab: (tab: string) => void;
  onSelectRepo: (fullName: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  activeRepo,
  userPrefs,
  userProgress,
  onNavigateTab,
  onSelectRepo,
}) => {
  const completedStepsCount = userProgress.completedChecklistSteps.length;
  const progressPercent = Math.min(100, Math.round((completedStepsCount / 9) * 100));

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="p-8 rounded-2xl bg-[#0D110F]/85 border border-[#1E2822] space-y-4 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#10B981]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#10B981]">
          <span className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981]" />
          <span>LEARNING WORKSPACE · COCKPIT</span>
        </div>

        <h2 className="font-heading text-3xl font-extrabold text-white">
          Welcome to your open-source journey, {userPrefs.name}.
        </h2>
        <p className="text-sm text-[#9CA3AF] max-w-2xl leading-relaxed">
          Explore repositories, diagnose beginner-friendly issues, practice git workflows, and take your next step toward your first merged pull request.
        </p>

        {/* Current Active Repo Card Banner */}
        {activeRepo && (
          <div className="mt-4 pt-4 border-t border-[#1E2822] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30 flex items-center justify-center font-mono font-bold text-xs shadow-xs">
                {activeRepo.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="font-heading font-semibold text-xs text-white flex items-center gap-1.5">
                  <span>{activeRepo.full_name}</span>
                  <a
                    href={activeRepo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#6B7280] hover:text-[#10B981] transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="text-[11px] text-[#9CA3AF] mt-0.5 line-clamp-1">
                  {activeRepo.description || 'No description provided.'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigateTab('issuemedic')}
                className="px-3.5 py-1.5 text-xs font-semibold text-[#10B981] bg-[#10B981]/10 hover:bg-[#10B981]/20 border border-[#10B981]/30 rounded-lg transition-colors whitespace-nowrap"
              >
                Inspect Issues
              </button>
              <button
                onClick={() => onNavigateTab('newcomer')}
                className="btn-emerald-glow px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap"
              >
                Continue Setup
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Three Main Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Analyse a Repo */}
        <div
          onClick={() => onNavigateTab('explore')}
          className="glass-card p-6 rounded-2xl hover:border-[#10B981]/50 transition-all cursor-pointer space-y-4 flex flex-col justify-between group"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-heading text-lg font-bold text-white group-hover:text-[#10B981] transition-colors">
              1. Analyse a Repository
            </h3>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              Explore codebase structure, check repository health, and evaluate beginner-friendliness using public GitHub data.
            </p>
          </div>
          <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-[#10B981]">
            <span>Explore projects</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: Find Beginner-Friendly Issues */}
        <div
          onClick={() => onNavigateTab('issuemedic')}
          className="glass-card p-6 rounded-2xl hover:border-[#06B6D4]/50 transition-all cursor-pointer space-y-4 flex flex-col justify-between group"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#06B6D4]/15 text-[#06B6D4] border border-[#06B6D4]/30 flex items-center justify-center">
              <Stethoscope className="w-5 h-5" />
            </div>
            <h3 className="font-heading text-lg font-bold text-white group-hover:text-[#06B6D4] transition-colors">
              2. Find Beginner Issues
            </h3>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              Filter through real issues classified by difficulty, effort, and verified good first issue labels.
            </p>
          </div>
          <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-[#06B6D4]">
            <span>Browse with IssueMedic</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3: Start a Contribution Journey */}
        <div
          onClick={() => onNavigateTab('newcomer')}
          className="glass-card p-6 rounded-2xl hover:border-[#84CC16]/50 transition-all cursor-pointer space-y-4 flex flex-col justify-between group"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#84CC16]/15 text-[#84CC16] border border-[#84CC16]/30 flex items-center justify-center">
              <Footprints className="w-5 h-5" />
            </div>
            <h3 className="font-heading text-lg font-bold text-white group-hover:text-[#84CC16] transition-colors">
              3. Contribution Journey
            </h3>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              Follow a personalized 9-step checklist from fork to pull request with Mentor Mode guidance and customized CLI commands.
            </p>
          </div>
          <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-[#84CC16]">
            <span>Start Newcomer Path</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Interactive Learning Labs Strip */}
      <div className="space-y-3">
        <div className="text-xs font-mono uppercase tracking-wider text-[#6B7280]">
          INTERACTIVE LEARNING LABS & PRACTICE
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => onNavigateTab('playground')}
            className="p-4 rounded-xl bg-[#0D110F]/80 border border-[#1E2822] hover:border-[#10B981]/50 hover:bg-[#121814] transition-all cursor-pointer space-y-1.5 group"
          >
            <div className="font-heading font-semibold text-xs text-white group-hover:text-[#10B981] flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-[#10B981]" />
                <span>Git Playground</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#6B7280] group-hover:text-[#10B981] transition-colors" />
            </div>
            <p className="text-[11px] text-[#9CA3AF]">
              Visual branch graph, commit simulator, and merge workshop.
            </p>
          </div>

          <div
            onClick={() => onNavigateTab('simulator')}
            className="p-4 rounded-xl bg-[#0D110F]/80 border border-[#1E2822] hover:border-[#06B6D4]/50 hover:bg-[#121814] transition-all cursor-pointer space-y-1.5 group"
          >
            <div className="font-heading font-semibold text-xs text-white group-hover:text-[#06B6D4] flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#06B6D4]" />
                <span>Simulator</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#6B7280] group-hover:text-[#06B6D4] transition-colors" />
            </div>
            <p className="text-[11px] text-[#9CA3AF]">
              Safe 8-stage sandbox from issue discovery to simulated merge.
            </p>
          </div>

          <div
            onClick={() => onNavigateTab('translator')}
            className="p-4 rounded-xl bg-[#0D110F]/80 border border-[#1E2822] hover:border-[#84CC16]/50 hover:bg-[#121814] transition-all cursor-pointer space-y-1.5 group"
          >
            <div className="font-heading font-semibold text-xs text-white group-hover:text-[#84CC16] flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <MessageSquareQuote className="w-3.5 h-3.5 text-[#84CC16]" />
                <span>PR Translator</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#6B7280] group-hover:text-[#84CC16] transition-colors" />
            </div>
            <p className="text-[11px] text-[#9CA3AF]">
              Decode technical reviewer comments and draft polite replies.
            </p>
          </div>

          <div
            onClick={() => onNavigateTab('roadmap')}
            className="p-4 rounded-xl bg-[#0D110F]/80 border border-[#1E2822] hover:border-[#10B981]/50 hover:bg-[#121814] transition-all cursor-pointer space-y-1.5 group"
          >
            <div className="font-heading font-semibold text-xs text-white group-hover:text-[#10B981] flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Map className="w-3.5 h-3.5 text-[#10B981]" />
                <span>Roadmap</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#6B7280] group-hover:text-[#10B981] transition-colors" />
            </div>
            <p className="text-[11px] text-[#9CA3AF]">
              5-level progressive curriculum from foundations to pull requests.
            </p>
          </div>
        </div>
      </div>

      {/* Lower Section: 2-Column Balance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Recently Explored Repos & Saved Issues */}
        <div className="lg:col-span-7 space-y-6">
          {/* Recently Explored */}
          <div className="p-6 rounded-2xl bg-[#0D110F]/80 border border-[#1E2822] space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-heading font-bold text-sm text-white">
                Recently Explored Repositories
              </h4>
              <button
                onClick={() => onNavigateTab('explore')}
                className="text-xs text-[#10B981] hover:underline"
              >
                Search more
              </button>
            </div>

            {userProgress.exploredRepos.length === 0 ? (
              <div className="py-6 text-center text-xs text-[#6B7280]">
                No repositories explored yet. Start with our curated list!
              </div>
            ) : (
              <div className="space-y-2.5">
                {userProgress.exploredRepos.slice(0, 4).map((r, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      onSelectRepo(r.fullName);
                    }}
                    className="p-3 rounded-xl border border-[#1E2822] bg-[#121814]/50 hover:border-[#10B981]/40 hover:bg-[#162019] transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-heading font-semibold text-xs text-white group-hover:text-[#10B981] transition-colors truncate flex items-center gap-1.5">
                        <GitBranch className="w-3.5 h-3.5 text-[#10B981]" />
                        <span>{r.fullName}</span>
                      </div>
                      <div className="text-[11px] text-[#9CA3AF] truncate mt-0.5">
                        {r.description || 'Open source repository'}
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#6B7280] group-hover:text-[#10B981] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Saved Issues */}
          <div className="p-6 rounded-2xl bg-[#0D110F]/80 border border-[#1E2822] space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-heading font-bold text-sm text-white flex items-center gap-1.5">
                <Bookmark className="w-4 h-4 text-[#10B981]" />
                <span>Bookmarked Issues ({userProgress.savedIssues.length})</span>
              </h4>
              <button
                onClick={() => onNavigateTab('issuemedic')}
                className="text-xs text-[#10B981] hover:underline"
              >
                Find more
              </button>
            </div>

            {userProgress.savedIssues.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#6B7280] bg-[#121814]/40 rounded-xl border border-dashed border-[#1E2822]">
                No issues saved yet. Bookmark interesting issues in IssueMedic to revisit anytime.
              </div>
            ) : (
              <div className="space-y-2">
                {userProgress.savedIssues.slice(0, 3).map((item, i) => (
                  <div
                    key={i}
                    onClick={() => onNavigateTab('issuemedic')}
                    className="p-3 rounded-xl border border-[#1E2822] bg-[#121814]/50 hover:border-[#10B981]/40 hover:bg-[#162019] transition-all cursor-pointer"
                  >
                    <div className="text-xs font-semibold text-white truncate">
                      #{item.issue.number} {item.issue.title}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#9CA3AF] mt-1 font-mono">
                      <span>{item.repoFullName}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.issue.comments} comments</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Learning Progress & Recommended Next Step */}
        <div className="lg:col-span-5 space-y-6">
          {/* Progress Tracker Widget */}
          <div className="p-6 rounded-2xl bg-[#0D110F]/80 border border-[#1E2822] space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-heading font-bold text-sm text-white">
                Setup Progress
              </h4>
              <span className="text-xs font-mono font-semibold text-[#10B981] tabular-nums">
                {progressPercent}% Complete
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-[#1E2822] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#10B981] to-[#06B6D4] rounded-full transition-all duration-500 shadow-[0_0_10px_#10B981]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="text-xs text-[#9CA3AF] leading-relaxed">
              {completedStepsCount} of 9 standard contribution steps verified in Newcomer Path.
            </div>

            <button
              onClick={() => onNavigateTab('newcomer')}
              className="w-full py-2 px-3 text-xs font-medium text-white bg-[#121814] hover:bg-[#17221A] border border-[#1E2822] hover:border-[#10B981]/40 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <span>View 9-Step Checklist</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#10B981]" />
            </button>
          </div>

          {/* Recommended Next Step Box */}
          <div className="p-6 rounded-2xl bg-[#121814]/80 border border-[#10B981]/30 space-y-3">
            <div className="text-[11px] font-mono font-semibold text-[#10B981] uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              <span>RECOMMENDED NEXT STEP</span>
            </div>
            <h4 className="font-heading font-bold text-sm text-white">
              Review project CONTRIBUTING guidelines
            </h4>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              Every repository has unique branch naming conventions, PR templates, and commit formatting rules. Open DocSmith or inspect RepoHealth to ensure your contribution aligns with what maintainers look for.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigateTab('docsmith')}
                className="text-xs font-semibold text-[#10B981] hover:text-[#34D399] inline-flex items-center gap-1"
              >
                <span>Generate or view guidelines</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
