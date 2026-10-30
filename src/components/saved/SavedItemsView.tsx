import React, { useState } from 'react';
import {
  Bookmark,
  Trash2,
  ExternalLink,
  ArrowRight,
  GitBranch,
  FileText,
  BookOpen,
  Sparkles,
  Check
} from 'lucide-react';
import { UserProgress } from '../../types';
import { deleteSavedExplanation, getUserProgress } from '../../services/storage';

interface SavedItemsViewProps {
  userProgress: UserProgress;
  onNavigateTab: (tab: string) => void;
  onSelectRepo: (fullName: string) => void;
  onRefreshProgress: () => void;
}

export const SavedItemsView: React.FC<SavedItemsViewProps> = ({
  userProgress,
  onNavigateTab,
  onSelectRepo,
  onRefreshProgress,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'issues' | 'repos' | 'explanations'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleDeleteExplanation = (id: string) => {
    deleteSavedExplanation(id);
    onRefreshProgress();
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const totalSavedCount =
    userProgress.savedIssues.length +
    userProgress.exploredRepos.length +
    userProgress.savedExplanations.length;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="p-8 rounded-2xl bg-[#0D110F]/85 border border-[#1E2822] space-y-3 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#10B981]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#10B981]">
          <Bookmark className="w-4 h-4 text-[#10B981]" />
          <span>MY SPACE · SAVED ITEMS</span>
        </div>
        <h2 className="font-heading text-3xl font-extrabold text-white">
          Your Personal Open-Source Notebook
        </h2>
        <p className="text-sm text-[#9CA3AF] max-w-2xl leading-relaxed">
          Access your bookmarked GitHub issues, explored repositories, and saved technical explanations in one organized learning space.
        </p>

        {/* Filter Buttons */}
        <div className="pt-4 flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: `All Items (${totalSavedCount})` },
            { id: 'issues', label: `Saved Issues (${userProgress.savedIssues.length})` },
            { id: 'repos', label: `Explored Repos (${userProgress.exploredRepos.length})` },
            { id: 'explanations', label: `Explanations (${userProgress.savedExplanations.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                activeFilter === tab.id
                  ? 'btn-emerald-glow'
                  : 'bg-[#121814] text-[#D1D5DB] border border-[#1E2822] hover:bg-[#17221A]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {totalSavedCount === 0 && (
        <div className="p-12 text-center bg-[#0D110F]/80 rounded-2xl border border-dashed border-[#1E2822] space-y-3">
          <Bookmark className="w-8 h-8 text-[#6B7280] mx-auto" />
          <h3 className="font-heading font-bold text-base text-white">No saved items yet</h3>
          <p className="text-xs text-[#9CA3AF] max-w-sm mx-auto">
            Bookmark interesting issues in IssueMedic, explore repositories, or save glossary definitions to review here anytime.
          </p>
        </div>
      )}

      {/* 1. Saved GitHub Issues */}
      {(activeFilter === 'all' || activeFilter === 'issues') && userProgress.savedIssues.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-[#10B981]" />
            <span>Saved GitHub Issues ({userProgress.savedIssues.length})</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userProgress.savedIssues.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#0D110F]/80 border border-[#1E2822] hover:border-[#10B981]/40 transition-all space-y-3 flex flex-col justify-between backdrop-blur-md"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-[#6B7280] font-mono">
                    <span className="text-[#10B981] font-bold">#{item.issue.number}</span>
                    <span>Saved {new Date(item.savedAt).toLocaleDateString()}</span>
                  </div>

                  <h4 className="font-heading font-bold text-sm text-white line-clamp-2">
                    {item.issue.title}
                  </h4>

                  <p className="text-xs text-[#9CA3AF] line-clamp-2">
                    {item.issue.body || 'No description provided.'}
                  </p>

                  <div className="text-[11px] text-[#06B6D4] font-mono">
                    Repo: {item.repoFullName}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#1E2822] flex items-center justify-between">
                  <a
                    href={item.issue.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[#9CA3AF] hover:text-[#10B981] flex items-center gap-1 transition-colors"
                  >
                    <span>View on GitHub</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    onClick={() => {
                      onSelectRepo(item.repoFullName);
                      onNavigateTab('issuemedic');
                    }}
                    className="text-xs font-semibold text-[#10B981] hover:text-[#34D399] flex items-center gap-1"
                  >
                    <span>Open in IssueMedic</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Explored Repositories */}
      {(activeFilter === 'all' || activeFilter === 'repos') && userProgress.exploredRepos.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-[#06B6D4]" />
            <span>Explored Repositories ({userProgress.exploredRepos.length})</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userProgress.exploredRepos.map((repo, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#0D110F]/80 border border-[#1E2822] hover:border-[#06B6D4]/40 transition-all flex items-center justify-between backdrop-blur-md group"
              >
                <div className="min-w-0 pr-2">
                  <div className="font-heading font-semibold text-xs text-white group-hover:text-[#06B6D4] transition-colors truncate flex items-center gap-1.5">
                    <GitBranch className="w-3.5 h-3.5 text-[#06B6D4]" />
                    <span>{repo.fullName}</span>
                  </div>
                  <div className="text-[11px] text-[#9CA3AF] truncate mt-0.5">
                    {repo.description || 'Open-source project'}
                  </div>
                </div>

                <button
                  onClick={() => {
                    onSelectRepo(repo.fullName);
                    onNavigateTab('explore');
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-[#06B6D4] bg-[#06B6D4]/10 hover:bg-[#06B6D4]/20 border border-[#06B6D4]/30 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  Load Repo
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Saved Explanations */}
      {(activeFilter === 'all' || activeFilter === 'explanations') && userProgress.savedExplanations.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#84CC16]" />
            <span>Saved Explanations & Notes ({userProgress.savedExplanations.length})</span>
          </h3>

          <div className="space-y-3">
            {userProgress.savedExplanations.map((exp) => (
              <div
                key={exp.id}
                className="p-5 rounded-2xl bg-[#0D110F]/80 border border-[#1E2822] space-y-2 backdrop-blur-md"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white font-heading">{exp.title}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyText(exp.id, exp.content || exp.summary || '')}
                      className="p-1 hover:bg-[#121814] rounded text-[#9CA3AF] hover:text-white"
                      title="Copy explanation"
                    >
                      {copiedId === exp.id ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <FileText className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteExplanation(exp.id)}
                      className="p-1 hover:bg-[#121814] rounded text-[#6B7280] hover:text-red-400"
                      title="Delete saved note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-[#9CA3AF] leading-relaxed">
                  {exp.content || exp.summary}
                </p>

                {exp.relatedRepo && (
                  <div className="text-[11px] font-mono text-[#84CC16] pt-1">
                    Context: {exp.relatedRepo}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
