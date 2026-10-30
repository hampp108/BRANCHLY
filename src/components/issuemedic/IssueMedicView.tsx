import React, { useState, useEffect } from 'react';
import {
  Stethoscope,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Bookmark,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Clock,
  Sparkles,
  Copy,
  Check,
  ChevronRight,
  GitBranch
} from 'lucide-react';
import { GitHubIssue, GitHubRepo, IssueCategory, IssueDifficulty, IssueAnalysis } from '../../types';
import { getRepoIssues, analyzeIssueHeuristically, generateWithAI } from '../../services/api';
import { toggleSaveIssue, getUserProgress } from '../../services/storage';

interface IssueMedicViewProps {
  activeRepo: GitHubRepo | null;
  onOpenRepoSelector: () => void;
  onStartNewcomerWithIssue: (issue: GitHubIssue) => void;
}

export const IssueMedicView: React.FC<IssueMedicViewProps> = ({
  activeRepo,
  onOpenRepoSelector,
  onStartNewcomerWithIssue,
}) => {
  const [issues, setIssues] = useState<GitHubIssue[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyBeginner, setOnlyBeginner] = useState(false);

  // Deep Dive Modal state
  const [selectedIssue, setSelectedIssue] = useState<GitHubIssue | null>(null);
  const [analysis, setAnalysis] = useState<IssueAnalysis | null>(null);
  const [aiDeepExplanation, setAiDeepExplanation] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [savedIssueIds, setSavedIssueIds] = useState<number[]>([]);
  const [copiedQuestion, setCopiedQuestion] = useState<number | null>(null);

  useEffect(() => {
    const progress = getUserProgress();
    setSavedIssueIds(progress.savedIssues.map(s => s.issue.id));
  }, []);

  // Fetch issues whenever activeRepo changes
  useEffect(() => {
    if (!activeRepo) return;
    setIsLoading(true);
    setError(null);

    getRepoIssues(activeRepo.owner.login, activeRepo.name)
      .then((data) => {
        setIssues(data);
      })
      .catch((err) => {
        setError(err.message || 'Failed to retrieve open issues.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [activeRepo]);

  // Open Issue Modal & Analyze
  const handleInspectIssue = (issue: GitHubIssue) => {
    setSelectedIssue(issue);
    const heur = analyzeIssueHeuristically(issue, activeRepo?.language);
    setAnalysis(heur);
    setAiDeepExplanation(null);
  };

  const handleDeepAIAnalyze = async () => {
    if (!selectedIssue || !analysis) return;
    setIsLoadingAi(true);
    const prompt = `As BRANCHLY IssueMedic, simplify this open-source issue for a college student / first-time contributor.
Issue Title: "${selectedIssue.title}"
Repository: "${activeRepo?.full_name}" (${activeRepo?.language || 'Codebase'})
Description:
${selectedIssue.body || 'No description provided.'}

Please break this down into:
1. The Core Problem in plain English
2. What you actually need to change in the codebase
3. How to verify your fix locally`;

    const res = await generateWithAI(prompt, 'You are IssueMedic, an open-source technical mentor. Speak with clarity, patience, and encouraging directness.');
    if (res.text) {
      setAiDeepExplanation(res.text);
    }
    setIsLoadingAi(false);
  };

  const handleBookmarkToggle = (issue: GitHubIssue, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeRepo) return;
    const isNowSaved = toggleSaveIssue(activeRepo.full_name, issue);
    if (isNowSaved) {
      setSavedIssueIds(prev => [...prev, issue.id]);
    } else {
      setSavedIssueIds(prev => prev.filter(id => id !== issue.id));
    }
  };

  const handleCopyQuestion = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedQuestion(idx);
    setTimeout(() => setCopiedQuestion(null), 2000);
  };

  // Filtered issues
  const filteredIssues = issues.filter((issue) => {
    const heur = analyzeIssueHeuristically(issue, activeRepo?.language);

    if (onlyBeginner && !heur.isBeginnerFriendly) {
      return false;
    }

    if (selectedCategory !== 'all' && heur.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = issue.title.toLowerCase().includes(q);
      const matchBody = (issue.body || '').toLowerCase().includes(q);
      const matchNum = issue.number.toString().includes(q);
      if (!matchTitle && !matchBody && !matchNum) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-[#0D110F]/85 border border-[#1E2822] flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#10B981]/10 rounded-full blur-3xl pointer-events-none" />

        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#10B981]">
            <Stethoscope className="w-4 h-4 text-[#10B981]" />
            <span>ISSUEMEDIC · TRIAGE & DEEP EXPLAINER</span>
          </div>
          <h2 className="font-heading text-2xl font-bold text-white">
            Beginner Issue Diagnostics
          </h2>
          <p className="text-xs text-[#9CA3AF] mt-0.5 font-mono">
            {activeRepo
              ? `Scanning issues for ${activeRepo.full_name} (${issues.length} open issues retrieved)`
              : 'Please select a repository to inspect its issue tracker.'}
          </p>
        </div>

        <div>
          {!activeRepo ? (
            <button
              onClick={onOpenRepoSelector}
              className="btn-emerald-glow px-4 py-2 text-xs font-semibold rounded-lg"
            >
              Select Active Repo
            </button>
          ) : (
            <a
              href={`${activeRepo.html_url}/issues`}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 text-xs font-medium text-white bg-[#121814] border border-[#1E2822] hover:bg-[#17221A] hover:border-[#10B981]/40 rounded-xl transition-all inline-flex items-center gap-1.5"
            >
              <span>View All on GitHub</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#9CA3AF]" />
            </a>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-[#0D110F]/80 border border-[#1E2822] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 backdrop-blur-md">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by keywords, bug summary, or #issue number..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#1E2822] bg-[#090C0A] text-white focus:border-[#10B981] outline-none font-mono"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Dropdown/Selector */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-[#1E2822] bg-[#090C0A] text-white focus:border-[#10B981] outline-none font-mono"
          >
            <option value="all">All Categories</option>
            <option value="Documentation">Documentation</option>
            <option value="Bug">Bug Fixes</option>
            <option value="Feature">Features</option>
            <option value="Testing">Testing</option>
            <option value="Translation">Translation</option>
            <option value="Improvement">Improvement</option>
          </select>

          {/* Beginner Only Toggle */}
          <button
            onClick={() => setOnlyBeginner(!onlyBeginner)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              onlyBeginner
                ? 'btn-emerald-glow'
                : 'bg-[#121814] text-[#D1D5DB] border border-[#1E2822] hover:bg-[#17221A]'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Beginner Friendly Only</span>
          </button>
        </div>
      </div>

      {/* Loading & Error States */}
      {isLoading && (
        <div className="p-12 text-center text-xs text-[#9CA3AF] bg-[#0D110F]/80 rounded-2xl border border-[#1E2822] backdrop-blur-md">
          <div className="inline-block w-6 h-6 border-2 border-[#10B981] border-t-transparent rounded-full animate-spin mb-2" />
          <div>Retrieving open issues from GitHub REST API...</div>
        </div>
      )}

      {error && !isLoading && (
        <div className="p-4 text-xs bg-red-950/40 text-red-300 rounded-xl border border-red-800/50">
          {error}
        </div>
      )}

      {/* Issues Grid / List */}
      {!isLoading && filteredIssues.length === 0 && (
        <div className="p-12 text-center bg-[#0D110F]/80 rounded-2xl border border-dashed border-[#1E2822] space-y-2">
          <AlertCircle className="w-8 h-8 text-[#6B7280] mx-auto" />
          <h4 className="font-heading font-bold text-sm text-white">No matching issues found</h4>
          <p className="text-xs text-[#9CA3AF] max-w-md mx-auto">
            Try adjusting your search query or disabling the "Beginner Friendly Only" filter.
          </p>
        </div>
      )}

      {!isLoading && filteredIssues.length > 0 && (
        <div className="space-y-3">
          {filteredIssues.map((issue) => {
            const heur = analyzeIssueHeuristically(issue, activeRepo?.language);
            const isSaved = savedIssueIds.includes(issue.id);
            const hasOfficialLabel = issue.labels.some(l => l.name.toLowerCase().includes('good first issue'));

            return (
              <div
                key={issue.id}
                onClick={() => handleInspectIssue(issue)}
                className="p-5 rounded-xl bg-[#0D110F]/80 border border-[#1E2822] hover:border-[#10B981]/50 hover:bg-[#121814] transition-all cursor-pointer space-y-3 group backdrop-blur-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    {/* Unboxed Metadata Line with typographic separators */}
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#6B7280] font-mono">
                      <span className="text-[#10B981] font-bold">#{issue.number}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#D1D5DB]">{heur.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>Difficulty: {heur.difficulty} (AI estimate)</span>
                      <span aria-hidden="true">·</span>
                      <span>{new Date(issue.created_at).toLocaleDateString()}</span>
                    </div>

                    <h3 className="font-heading text-base font-bold text-white group-hover:text-[#34D399] transition-colors">
                      {issue.title}
                    </h3>

                    <p className="text-xs text-[#9CA3AF] line-clamp-2 leading-relaxed">
                      {issue.body || 'No description provided by the author.'}
                    </p>
                  </div>

                  {/* Bookmark Button */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => handleBookmarkToggle(issue, e)}
                      className={`p-2 rounded-lg border transition-colors ${
                        isSaved
                          ? 'border-[#10B981] text-[#10B981] bg-[#10B981]/15'
                          : 'border-[#1E2822] text-[#6B7280] hover:text-white hover:bg-[#121814]'
                      }`}
                      title={isSaved ? 'Remove Bookmark' : 'Bookmark Issue'}
                      aria-label="Bookmark Issue"
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#10B981]' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Footer status row */}
                <div className="pt-2 border-t border-[#1E2822] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    {hasOfficialLabel ? (
                      <span className="text-[11px] font-mono font-semibold text-[#10B981] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-[#10B981]" />
                        <span>Official Good First Issue</span>
                      </span>
                    ) : heur.isBeginnerFriendly ? (
                      <span className="text-[11px] text-[#9CA3AF] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-[#06B6D4]" />
                        <span>Beginner-friendly scope</span>
                      </span>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-1.5 text-[#10B981] font-semibold text-xs group-hover:translate-x-0.5 transition-transform">
                    <span>Inspect Diagnostics</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ISSUE DIAGNOSTICS MODAL */}
      {selectedIssue && analysis && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl bg-[#0D110F] rounded-2xl border border-[#1E2822] shadow-[0_0_60px_-10px_rgba(16,185,129,0.3)] p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-[#1E2822] pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[11px] font-mono font-semibold text-[#10B981] uppercase tracking-wider">
                  <span>ISSUEMEDIC DIAGNOSTICS</span>
                  <span aria-hidden="true">·</span>
                  <span>ISSUE #{selectedIssue.number}</span>
                </div>
                <h3 className="font-heading text-xl font-bold text-white">
                  {selectedIssue.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-[#9CA3AF]">
                  <a
                    href={selectedIssue.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#10B981] flex items-center gap-1 underline transition-colors"
                  >
                    <span>View original on GitHub</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <span>·</span>
                  <span>Estimated effort: {analysis.estimatedEffort}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedIssue(null)}
                className="p-1.5 text-[#9CA3AF] hover:text-white hover:bg-[#121814] rounded-lg transition-colors font-mono"
                aria-label="Close Issue Diagnostics"
              >
                ✕
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-[#121814] border border-[#1E2822]">
                <div className="text-[10px] uppercase font-mono font-bold text-[#6B7280]">Classification</div>
                <div className="font-heading font-semibold text-xs text-white mt-0.5">{analysis.category}</div>
              </div>
              <div className="p-3 rounded-xl bg-[#121814] border border-[#1E2822]">
                <div className="text-[10px] uppercase font-mono font-bold text-[#6B7280]">Difficulty</div>
                <div className="font-heading font-semibold text-xs text-white mt-0.5">{analysis.difficulty} (AI Estimate)</div>
              </div>
              <div className="p-3 rounded-xl bg-[#121814] border border-[#1E2822]">
                <div className="text-[10px] uppercase font-mono font-bold text-[#6B7280]">Beginner Readiness</div>
                <div className="font-heading font-semibold text-xs text-[#10B981] mt-0.5">
                  {analysis.isBeginnerFriendly ? 'Suitable for Newcomers' : 'Intermediate Required'}
                </div>
              </div>
            </div>

            {/* Plain English Explanation */}
            <div className="space-y-2">
              <h4 className="font-mono font-bold text-xs text-white uppercase tracking-wider">
                Why this issue is suitable for newcomers
              </h4>
              <p className="text-xs text-[#9CA3AF] leading-relaxed bg-[#121814] p-3.5 rounded-xl border border-[#1E2822]">
                {analysis.beginnerReason}
              </p>
            </div>

            {/* Technical Jargon Translation */}
            {analysis.keyTerms.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-mono font-bold text-xs text-white uppercase tracking-wider">
                  Important Concepts & Terms
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {analysis.keyTerms.map((t, idx) => (
                    <div key={idx} className="p-3 rounded-xl border border-[#1E2822] bg-[#090C0A] space-y-0.5">
                      <div className="font-bold text-[#10B981] font-mono">{t.term}</div>
                      <div className="text-[11px] text-[#9CA3AF]">{t.definition}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggested First Steps */}
            <div className="space-y-2">
              <h4 className="font-mono font-bold text-xs text-white uppercase tracking-wider">
                Recommended First Steps
              </h4>
              <ul className="space-y-1.5 text-xs text-[#9CA3AF]">
                {analysis.firstSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-mono text-[#10B981] font-bold">0{idx + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Polite Questions to ask maintainer */}
            <div className="space-y-2">
              <h4 className="font-mono font-bold text-xs text-white uppercase tracking-wider">
                Suggested Polite Comment for the GitHub thread
              </h4>
              <div className="space-y-2">
                {analysis.suggestedMaintainerQuestions.map((q, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#090C0A] border border-[#1E2822] flex items-center justify-between gap-3 text-xs">
                    <span className="text-[#D1D5DB] italic font-mono">"{q}"</span>
                    <button
                      onClick={() => handleCopyQuestion(q, idx)}
                      className="px-2.5 py-1 text-[11px] font-medium text-[#34D399] bg-[#121814] border border-[#1E2822] hover:border-[#10B981]/40 rounded-md transition-colors shrink-0 flex items-center gap-1"
                    >
                      {copiedQuestion === idx ? <Check className="w-3 h-3 text-[#10B981]" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedQuestion === idx ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Deep Breakdown */}
            {aiDeepExplanation && (
              <div className="p-4 rounded-xl bg-[#121814] border border-[#10B981]/40 space-y-2 text-xs">
                <div className="font-bold text-[#10B981] flex items-center gap-1.5 font-mono">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Mentor Deep Dive (Gemma 2 Open Weights)</span>
                </div>
                <div className="whitespace-pre-wrap leading-relaxed text-[#D1D5DB] font-mono">
                  {aiDeepExplanation}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-4 border-t border-[#1E2822] flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={handleDeepAIAnalyze}
                disabled={isLoadingAi}
                className="px-3.5 py-2 text-xs font-semibold text-[#10B981] bg-[#10B981]/15 hover:bg-[#10B981]/25 border border-[#10B981]/30 rounded-xl transition-colors flex items-center gap-1.5 disabled:opacity-40"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isLoadingAi ? 'Consulting AI...' : 'Ask AI for Step-by-Step Code Path'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedIssue(null)}
                  className="px-4 py-2 text-xs font-semibold text-[#9CA3AF] hover:text-white transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const issueToStart = selectedIssue;
                    setSelectedIssue(null);
                    onStartNewcomerWithIssue(issueToStart);
                  }}
                  className="btn-emerald-glow px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5"
                >
                  <span>Start in Newcomer Path</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
