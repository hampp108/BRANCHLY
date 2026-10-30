import React, { useState } from 'react';
import { X, Search, GitBranch, ArrowRight, Star, AlertCircle, Compass } from 'lucide-react';
import { GitHubRepo } from '../../types';
import { CURATED_REPOS, getRepoInfo } from '../../services/api';

interface RepoSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRepo: (repo: GitHubRepo) => void;
  activeRepo: GitHubRepo | null;
}

export const RepoSelectorModal: React.FC<RepoSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectRepo,
  activeRepo,
}) => {
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    setError(null);
    setIsLoading(true);

    try {
      const clean = inputVal.trim().replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '');
      const parts = clean.split('/');
      if (parts.length < 2) {
        throw new Error('Please enter in "owner/repo" format (e.g. "facebook/react").');
      }
      const data = await getRepoInfo(parts[0], parts[1]);
      onSelectRepo(data);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Could not fetch repository from GitHub.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCuratedPick = async (fullName: string) => {
    setError(null);
    setIsLoading(true);
    const [owner, repo] = fullName.split('/');
    try {
      const data = await getRepoInfo(owner, repo);
      onSelectRepo(data);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to load curated repository.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-[#0D110F] rounded-2xl border border-[#1E2822] shadow-[0_10px_40px_rgba(0,0,0,0.8)] p-6 sm:p-7 space-y-6 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-[#6B7280] hover:text-white hover:bg-[#121814] rounded-lg transition-colors"
          aria-label="Close Repository Selector"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#10B981]">
            WORKSPACE REPOSITORY
          </div>
          <h3 className="font-heading text-xl font-bold text-white">
            Select Active Repository
          </h3>
          <p className="text-xs text-[#9CA3AF]">
            Choose a curated beginner project or enter any public GitHub repository URL.
          </p>
        </div>

        {/* Custom Input Form */}
        <form onSubmit={handleCustomSubmit} className="space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="e.g. facebook/react or vuejs/core"
                className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-[#1E2822] bg-[#080B09] text-white placeholder-[#6B7280] focus:outline-none focus:border-[#10B981]"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !inputVal.trim()}
              className="btn-emerald-glow px-4 py-2.5 text-xs font-semibold rounded-xl whitespace-nowrap shrink-0 disabled:opacity-40"
            >
              {isLoading ? 'Loading...' : 'Load Repo'}
            </button>
          </div>

          {error && (
            <div className="p-3 text-[11px] bg-red-950/40 text-red-400 rounded-xl border border-red-900/50 flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </form>

        {/* Curated Selections List */}
        <div className="space-y-2.5">
          <div className="text-xs font-mono text-[#6B7280] uppercase tracking-wider">
            Curated Beginner Repositories
          </div>

          <div className="space-y-2">
            {CURATED_REPOS.map((r) => {
              const isSelected = activeRepo?.full_name.toLowerCase() === r.fullName.toLowerCase();
              return (
                <div
                  key={r.fullName}
                  onClick={() => handleCuratedPick(r.fullName)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                    isSelected
                      ? 'border-[#10B981] bg-[#10B981]/10 ring-1 ring-[#10B981]/50'
                      : 'border-[#1E2822] bg-[#121814] hover:border-[#10B981]/40'
                  }`}
                >
                  <div className="min-w-0 pr-3 space-y-0.5">
                    <div className="font-heading font-semibold text-xs text-white group-hover:text-[#10B981] flex items-center gap-2 transition-colors">
                      <GitBranch className="w-3.5 h-3.5 text-[#10B981]" />
                      <span>{r.fullName}</span>
                      {isSelected && (
                        <span className="text-[10px] font-mono font-bold text-[#10B981] bg-[#10B981]/20 px-1.5 py-0.5 rounded border border-[#10B981]/40">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#9CA3AF] truncate">
                      {r.description}
                    </div>
                  </div>

                  <ArrowRight className="w-3.5 h-3.5 text-[#6B7280] group-hover:text-[#10B981] group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
