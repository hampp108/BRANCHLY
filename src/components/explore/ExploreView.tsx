import React, { useState } from 'react';
import {
  Search,
  GitBranch,
  Star,
  GitFork,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Folder,
  FileCode,
  ArrowRight,
  Compass,
  FileText,
  Stethoscope,
  Activity,
  Footprints
} from 'lucide-react';
import { GitHubRepo } from '../../types';
import { CURATED_REPOS, getRepoInfo } from '../../services/api';

interface ExploreViewProps {
  activeRepo: GitHubRepo | null;
  onSelectRepo: (repo: GitHubRepo) => void;
  onNavigateTab: (tab: string) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  activeRepo,
  onSelectRepo,
  onNavigateTab,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    setError(null);
    setIsLoading(true);

    try {
      let cleanInput = searchInput.trim().replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '');
      const parts = cleanInput.split('/');

      if (parts.length < 2) {
        throw new Error('Please enter in "owner/repository" format (e.g., "facebook/react" or "vuejs/core").');
      }

      const owner = parts[0];
      const repo = parts[1];

      const data = await getRepoInfo(owner, repo);
      onSelectRepo(data);
    } catch (err: any) {
      setError(err.message || 'Could not fetch repository. Please verify the name or check GitHub rate limits.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCuratedClick = async (fullName: string) => {
    setError(null);
    setIsLoading(true);
    const [owner, repo] = fullName.split('/');
    try {
      const data = await getRepoInfo(owner, repo);
      onSelectRepo(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load repository.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header & Search */}
      <div className="p-8 rounded-2xl bg-[#0D110F]/85 border border-[#1E2822] space-y-5 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#10B981]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#10B981]">
            <Compass className="w-4 h-4 text-[#10B981]" />
            <span>REPOSITORY EXPLORATION</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
            Discover an open-source codebase
          </h2>
          <p className="text-sm text-[#9CA3AF] leading-relaxed max-w-2xl">
            Enter any public GitHub repository to examine documentation health, explore beginner-friendly issues, and begin your contribution journey.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="e.g. facebook/react or https://github.com/firstcontributions/first-contributions"
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-[#1E2822] bg-[#090C0A] text-white placeholder:text-[#6B7280] focus:border-[#10B981] outline-none font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-emerald-glow px-6 py-2.5 text-sm font-semibold rounded-xl whitespace-nowrap shrink-0 flex items-center justify-center gap-2 disabled:opacity-40"
          >
            {isLoading ? 'Inspecting...' : 'Analyse Repository'}
          </button>
        </form>

        {error && (
          <div className="p-3 text-xs bg-red-950/40 text-red-300 rounded-xl border border-red-800/50 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold">Lookup Note:</div>
              <div>{error}</div>
            </div>
          </div>
        )}
      </div>

      {/* Currently Active Repository Details (if loaded) */}
      {activeRepo && (
        <div className="p-8 rounded-2xl bg-[#0D110F]/85 border border-[#10B981]/30 space-y-6 backdrop-blur-md shadow-[0_0_40px_-10px_rgba(16,185,129,0.15)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1E2822]">
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-mono">
                <span className="text-[11px] font-semibold text-[#10B981] uppercase tracking-wider">
                  CURRENTLY ACTIVE REPOSITORY
                </span>
                <span className="text-xs text-[#6B7280]">·</span>
                <span className="text-xs text-[#9CA3AF]">{activeRepo.default_branch} branch</span>
              </div>
              <h3 className="font-heading text-2xl font-bold text-white flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-[#10B981]" />
                <span>{activeRepo.full_name}</span>
                <a
                  href={activeRepo.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#6B7280] hover:text-[#10B981] transition-colors"
                  title="View on GitHub"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </h3>
              <p className="text-sm text-[#9CA3AF] max-w-3xl leading-relaxed">
                {activeRepo.description || 'No description provided by author.'}
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-4 text-xs font-mono text-white shrink-0">
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-[#121814] border border-[#1E2822]">
                <Star className="w-3.5 h-3.5 text-[#10B981]" />
                <span className="tabular-nums">{activeRepo.stargazers_count.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-[#121814] border border-[#1E2822]">
                <GitFork className="w-3.5 h-3.5 text-[#06B6D4]" />
                <span className="tabular-nums">{activeRepo.forks_count.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-[#121814] border border-[#1E2822]">
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span>{activeRepo.language || 'Codebase'}</span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-[#6B7280] mb-3">
              WHAT WOULD YOU LIKE TO DO WITH THIS REPO?
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <button
                onClick={() => onNavigateTab('issuemedic')}
                className="p-3.5 rounded-xl border border-[#1E2822] bg-[#121814]/70 hover:border-[#10B981]/50 hover:bg-[#162019] transition-all text-left space-y-1 group"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-white group-hover:text-[#10B981]">
                  <Stethoscope className="w-4 h-4 text-[#10B981]" />
                  <span>Inspect Issues</span>
                </div>
                <div className="text-[11px] text-[#9CA3AF]">
                  Find good first issues & breakdown requirements
                </div>
              </button>

              <button
                onClick={() => onNavigateTab('newcomer')}
                className="p-3.5 rounded-xl border border-[#1E2822] bg-[#121814]/70 hover:border-[#10B981]/50 hover:bg-[#162019] transition-all text-left space-y-1 group"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-white group-hover:text-[#10B981]">
                  <Footprints className="w-4 h-4 text-[#10B981]" />
                  <span>Newcomer Path</span>
                </div>
                <div className="text-[11px] text-[#9CA3AF]">
                  Follow 9-step local setup with personalized commands
                </div>
              </button>

              <button
                onClick={() => onNavigateTab('docsmith')}
                className="p-3.5 rounded-xl border border-[#1E2822] bg-[#121814]/70 hover:border-[#10B981]/50 hover:bg-[#162019] transition-all text-left space-y-1 group"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-white group-hover:text-[#10B981]">
                  <FileText className="w-4 h-4 text-[#10B981]" />
                  <span>DocSmith Docs</span>
                </div>
                <div className="text-[11px] text-[#9CA3AF]">
                  Generate or view README, CONTRIBUTING & templates
                </div>
              </button>

              <button
                onClick={() => onNavigateTab('repohealth')}
                className="p-3.5 rounded-xl border border-[#1E2822] bg-[#121814]/70 hover:border-[#10B981]/50 hover:bg-[#162019] transition-all text-left space-y-1 group"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-white group-hover:text-[#10B981]">
                  <Activity className="w-4 h-4 text-[#10B981]" />
                  <span>RepoHealth</span>
                </div>
                <div className="text-[11px] text-[#9CA3AF]">
                  Assess welcoming criteria & documentation health
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Curated Repositories for Beginners */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-bold text-lg text-white">
              Curated Beginner-Friendly Repositories
            </h3>
            <p className="text-xs text-[#9CA3AF]">
              High-quality open-source projects known for welcoming maintainers, comprehensive guidelines, and beginner tasks.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CURATED_REPOS.map((repo) => {
            const isSelected = activeRepo?.full_name.toLowerCase() === repo.fullName.toLowerCase();
            return (
              <div
                key={repo.fullName}
                className={`p-6 rounded-2xl bg-[#0D110F]/80 border transition-all space-y-4 flex flex-col justify-between backdrop-blur-md ${
                  isSelected ? 'border-[#10B981] shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'border-[#1E2822] hover:border-[#10B981]/40'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-sm text-white flex items-center gap-1.5">
                      <GitBranch className="w-4 h-4 text-[#10B981]" />
                      <span>{repo.fullName}</span>
                    </span>
                    <span className="text-[11px] font-mono text-[#34D399] font-medium">
                      {repo.beginnerFriendlyScore}% Match
                    </span>
                  </div>

                  <p className="text-xs text-[#9CA3AF] leading-relaxed">
                    {repo.description}
                  </p>

                  {/* Clean unboxed tags with typographic separators */}
                  <div className="flex items-center gap-1.5 text-[11px] text-[#6B7280] pt-1 font-mono">
                    <span className="text-[#9CA3AF]">{repo.language}</span>
                    {repo.tags.map((t, idx) => (
                      <React.Fragment key={idx}>
                        <span aria-hidden="true" className="text-[#1E2822]">/</span>
                        <span>{t}</span>
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-[#1E2822]">
                  <a
                    href={`https://github.com/${repo.fullName}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-[#9CA3AF] hover:text-[#10B981] flex items-center gap-1 transition-colors"
                  >
                    <span>View on GitHub</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    onClick={() => handleCuratedClick(repo.fullName)}
                    disabled={isLoading}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/40'
                        : 'btn-emerald-glow'
                    }`}
                  >
                    <span>{isSelected ? 'Active Repository' : 'Inspect Repository'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
