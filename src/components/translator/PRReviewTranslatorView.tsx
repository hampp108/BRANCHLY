import React, { useState } from 'react';
import {
  MessageSquareQuote,
  Search,
  Sparkles,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Send,
  ExternalLink,
  ShieldCheck,
  MessageCircle,
  UserCheck,
  Code2,
  RotateCcw,
  Bookmark,
  Trash2,
  Languages,
  ListOrdered,
  FileCode2,
  BookOpen
} from 'lucide-react';
import { ReviewCommentAnalysis } from '../../types';
import { getPRComments, translatePRReviewWithAI, generateWithAI } from '../../services/api';
import { saveExplanation } from '../../services/storage';

interface FetchedPRComment {
  id: number;
  user: {
    login: string;
    avatar_url: string;
  };
  body: string;
  created_at: string;
  html_url?: string;
  path?: string;
  line?: number;
}

export const PRReviewTranslatorView: React.FC = () => {
  const [inputMode, setInputMode] = useState<'paste' | 'url'>('paste');
  const [commentInput, setCommentInput] = useState('');
  const [prUrlInput, setPrUrlInput] = useState('');
  const [reviewerName, setReviewerName] = useState('senior-maintainer');
  const [selectedLanguage, setSelectedLanguage] = useState<'English' | 'Hindi' | 'Hinglish'>('English');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetched comments from GitHub PR URL
  const [fetchedComments, setFetchedComments] = useState<FetchedPRComment[]>([]);
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);

  // Active analysis result
  const [activeAnalysis, setActiveAnalysis] = useState<ReviewCommentAnalysis | null>({
    id: 'sample-1',
    reviewer: 'alex-maintainer',
    originalComment: 'LGTM overall! Just one nit: could we extract the date formatter helper out of the render loop to avoid re-allocating it on each render pass? Also please squash your commits before we merge.',
    explanation: 'The reviewer likes your contribution ("LGTM" = Looks Good To Me!) and will merge it, but noticed two improvements: moving a helper function outside the loop for speed, and squashing multiple commits into one.',
    whatNeedsToChange: 'Extract helper function outside render loop and squash commits before merging.',
    whyItMatters: 'Functions defined inside render loops get recreated thousands of times unnecessarily. Squashing commits keeps the repository history clean and easy to revert.',
    nextSteps: [
      'Move the date formatting function outside the component or loop.',
      'Run tests locally to make sure the formatter still works.',
      'Squash your recent commits using `git rebase -i` or GitHub squash merge.'
    ],
    stepByStepSolution: '1. Open the file containing the render method.\n2. Cut the date formatter function declaration.\n3. Paste it outside at the top level or into a `utils/` helper file.\n4. Call it directly inside the render loop.\n5. Squash commits using: git rebase -i HEAD~2 and squash the second commit.',
    codeExample: `// Before (re-created on every render pass):\nfunction TransactionList({ items }) {\n  return items.map(item => {\n    const formatDate = (d) => new Intl.DateTimeFormat().format(d);\n    return <div>{formatDate(item.date)}</div>;\n  });\n}\n\n// After (instantiated once):\nconst formatDate = (d) => new Intl.DateTimeFormat().format(d);\nfunction TransactionList({ items }) {\n  return items.map(item => <div>{formatDate(item.date)}</div>);\n}`,
    technicalTerms: [
      { term: 'LGTM', definition: 'Looks Good To Me — common open-source approval shorthand.' },
      { term: 'Nit / Nitpick', definition: 'A small, non-blocking suggestion on style or minor optimization.' },
      { term: 'Squash', definition: 'Combining multiple small git commits into a single commit with a clear description.' }
    ],
    draftedReply: 'Thanks for the helpful review @alex-maintainer! I have moved the date formatter outside the render loop and squashed my commits into a single atomic commit. Ready for final check!',
    language: 'English'
  });

  const [copiedState, setCopiedState] = useState<{ [key: string]: boolean }>({});
  const [isSaved, setIsSaved] = useState(false);
  const [followUpInput, setFollowUpInput] = useState('');
  const [followUpAnswer, setFollowUpAnswer] = useState<string | null>(null);
  const [isLoadingFollowUp, setIsLoadingFollowUp] = useState(false);

  const sampleReviewSnippets = [
    {
      label: 'Minor Nitpick',
      text: 'nit: typo on line 42, please change "initalize" to "initialize" before merge.',
      reviewer: 'jordan-reviewer'
    },
    {
      label: 'Missing Tests',
      text: 'Thanks for this bugfix! Could you please add a unit test in `tests/utils.spec.ts` covering the edge case when the input array is empty?',
      reviewer: 'tech-lead-sara'
    },
    {
      label: 'Squash & Rebase',
      text: 'Looks great! Can you please rebase on latest upstream main and squash your 4 commits into a single conventional commit?',
      reviewer: 'core-maintainer'
    },
    {
      label: 'Performance Warning',
      text: 'This adds an O(n^2) nested lookup in the hot render path. Consider using a Set for constant-time membership lookups.',
      reviewer: 'perf-guru'
    },
  ];

  const handleTranslateComment = async (text: string, reviewer = reviewerName) => {
    if (!text.trim()) return;

    setError(null);
    setIsLoading(true);
    setIsSaved(false);
    setFollowUpAnswer(null);

    try {
      const result = await translatePRReviewWithAI(text.trim(), reviewer.trim() || 'maintainer', selectedLanguage);
      setActiveAnalysis(result);
    } catch (err: any) {
      setError(err.message || 'Could not translate comment. Displaying fallback analysis.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchPRUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prUrlInput.trim()) return;

    setError(null);
    setIsFetchingUrl(true);
    setFetchedComments([]);

    try {
      const clean = prUrlInput.trim().replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '');
      const parts = clean.split('/');
      if (parts.length < 4 || (parts[2] !== 'pull' && parts[2] !== 'pulls')) {
        throw new Error('Please enter a valid GitHub pull request URL (e.g. https://github.com/facebook/react/pull/28000)');
      }

      const owner = parts[0];
      const repo = parts[1];
      const pullNumber = parseInt(parts[3], 10);

      const comments = await getPRComments(owner, repo, pullNumber);
      if (!comments || comments.length === 0) {
        throw new Error(`No public review comments found on ${owner}/${repo} PR #${pullNumber}, or GitHub rate limit reached. You can paste any comment text manually above!`);
      }

      const formatted: FetchedPRComment[] = comments.map((c: any) => ({
        id: c.id,
        user: {
          login: c.user?.login || 'reviewer',
          avatar_url: c.user?.avatar_url || 'https://github.com/ghost.png'
        },
        body: c.body || '',
        created_at: c.created_at || new Date().toISOString(),
        html_url: c.html_url,
        path: c.path,
        line: c.line || c.original_line
      })).filter(c => c.body.trim().length > 0);

      setFetchedComments(formatted);

      // Auto-translate first comment
      if (formatted.length > 0) {
        handleTranslateComment(formatted[0].body, formatted[0].user.login);
      }
    } catch (err: any) {
      setError(err.message || 'Could not fetch PR comments.');
    } finally {
      setIsFetchingUrl(false);
    }
  };

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedState(prev => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setCopiedState(prev => ({ ...prev, [key]: false }));
    }, 2000);
  };

  const handleSaveToMySpace = () => {
    if (!activeAnalysis) return;
    saveExplanation({
      title: `PR Review from @${activeAnalysis.reviewer}`,
      content: activeAnalysis.explanation + '\n\n' + (activeAnalysis.stepByStepSolution || ''),
      category: 'PR Review Translation',
      summary: activeAnalysis.originalComment.slice(0, 100)
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleAskFollowUp = async () => {
    if (!followUpInput.trim() || !activeAnalysis) return;

    setIsLoadingFollowUp(true);
    const prompt = `Reviewer Comment: "${activeAnalysis.originalComment}"
Reviewer: @${activeAnalysis.reviewer}
Original Translation: "${activeAnalysis.explanation}"
Student Follow-up Question: "${followUpInput.trim()}"

Language: ${selectedLanguage}

Please answer the student's question clearly, encouragingly, and with exact next steps so they can update their PR.`;

    try {
      const res = await generateWithAI(prompt, 'You are BRANCHLY PR Review Translator. Help the beginner contributor with their follow-up question.');
      setFollowUpAnswer(res.text || 'Review the specified file and make sure only the intended lines are altered, then test and push your commit.');
    } catch {
      setFollowUpAnswer('Make sure your local branch is up to date with git pull upstream main, apply the change, test locally, and push.');
    } finally {
      setIsLoadingFollowUp(false);
    }
  };

  const handleClear = () => {
    setCommentInput('');
    setActiveAnalysis(null);
    setError(null);
    setFollowUpAnswer(null);
    setFetchedComments([]);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="p-8 rounded-2xl bg-[#0D110F]/90 border border-[#1E2822] space-y-4 backdrop-blur-md relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#10B981]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#06B6D4]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#10B981]">
            <MessageSquareQuote className="w-4 h-4 text-[#10B981]" />
            <span>PR REVIEW TRANSLATOR & DECODER</span>
          </div>

          {/* Multilingual Selector */}
          <div className="flex items-center gap-2 bg-[#121814] px-3 py-1.5 rounded-xl border border-[#1E2822]">
            <Languages className="w-3.5 h-3.5 text-[#10B981]" />
            <span className="text-[11px] font-mono text-[#9CA3AF]">Language:</span>
            {(['English', 'Hindi', 'Hinglish'] as const).map(lang => (
              <button
                key={lang}
                onClick={() => {
                  setSelectedLanguage(lang);
                  if (activeAnalysis) {
                    handleTranslateComment(activeAnalysis.originalComment, activeAnalysis.reviewer);
                  }
                }}
                className={`px-2 py-0.5 text-xs font-medium rounded-md transition-all ${
                  selectedLanguage === lang
                    ? 'bg-[#10B981] text-[#080B09] font-bold shadow-xs'
                    : 'text-[#9CA3AF] hover:text-white'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-heading text-3xl font-extrabold text-white tracking-tight">
            Understand your review. Improve your contribution.
          </h2>
          <p className="text-sm text-[#9CA3AF] max-w-2xl leading-relaxed mt-1">
            Technical feedback can feel intimidating or terse. BRANCHLY breaks down reviewer jargon into plain explanations, why it was asked, step-by-step code solutions, and courteous replies.
          </p>
        </div>

        {/* Input Mode Selector */}
        <div className="pt-2 flex items-center gap-2">
          <button
            onClick={() => setInputMode('paste')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              inputMode === 'paste'
                ? 'btn-emerald-glow'
                : 'bg-[#121814] text-[#D1D5DB] border border-[#1E2822] hover:bg-[#17221A]'
            }`}
          >
            Paste Review Comment
          </button>
          <button
            onClick={() => setInputMode('url')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              inputMode === 'url'
                ? 'btn-emerald-glow'
                : 'bg-[#121814] text-[#D1D5DB] border border-[#1E2822] hover:bg-[#17221A]'
            }`}
          >
            Fetch from GitHub PR URL
          </button>
        </div>
      </div>

      {/* Input Deck: Mode A (Paste) */}
      {inputMode === 'paste' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleTranslateComment(commentInput, reviewerName);
          }}
          className="p-6 rounded-2xl bg-[#0D110F]/85 border border-[#1E2822] space-y-4 backdrop-blur-md shadow-xl"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-1.5">
              <label className="block text-xs font-bold text-white flex items-center gap-1.5">
                <span>Paste the Reviewer’s Comment</span>
                <span className="text-red-400">*</span>
              </label>
              <textarea
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                rows={4}
                placeholder="e.g. nit: could we extract the date formatter helper out of the render loop? Also please squash commits."
                className="w-full p-3.5 text-xs rounded-xl border border-[#1E2822] bg-[#090C0A] text-white focus:border-[#10B981] outline-none leading-relaxed font-mono resize-none transition-colors"
                required
              />
            </div>

            <div className="sm:w-64 space-y-1.5">
              <label className="block text-xs font-bold text-white">
                Reviewer Username (optional)
              </label>
              <input
                type="text"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                placeholder="e.g. maintainer-alex"
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#1E2822] bg-[#090C0A] text-white focus:border-[#10B981] outline-none font-mono transition-colors"
              />
              <div className="text-[11px] text-[#6B7280] leading-snug">
                Personalizes polite reply templates for your reviewer.
              </div>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-mono text-[#9CA3AF]">Or test with common real-world reviewer comments:</span>
            <div className="flex flex-wrap gap-2">
              {sampleReviewSnippets.map((s, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    setCommentInput(s.text);
                    setReviewerName(s.reviewer);
                    handleTranslateComment(s.text, s.reviewer);
                  }}
                  className="px-3 py-1.5 text-[11px] rounded-lg bg-[#121814] hover:bg-[#17221A] border border-[#1E2822] text-[#D1D5DB] transition-all hover:border-[#10B981]/40 text-left"
                >
                  <span className="text-[#10B981] font-semibold">[{s.label}]</span> {s.text.slice(0, 45)}...
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={handleClear}
              className="px-3 py-2 text-xs font-medium text-[#9CA3AF] hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>

            <button
              type="submit"
              disabled={isLoading || !commentInput.trim()}
              className="btn-emerald-glow px-6 py-2.5 text-xs font-semibold rounded-xl flex items-center gap-2 disabled:opacity-40"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isLoading ? 'Translating with AI...' : 'Explain & Translate Review'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Input Deck: Mode B (GitHub PR URL) */}
      {inputMode === 'url' && (
        <div className="p-6 rounded-2xl bg-[#0D110F]/85 border border-[#1E2822] space-y-4 backdrop-blur-md shadow-xl">
          <form onSubmit={handleFetchPRUrl} className="space-y-2">
            <label className="block text-xs font-bold text-white">
              Public GitHub Pull Request URL
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={prUrlInput}
                onChange={(e) => setPrUrlInput(e.target.value)}
                placeholder="https://github.com/facebook/react/pull/28000"
                className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-[#1E2822] bg-[#090C0A] text-white focus:border-[#10B981] outline-none font-mono"
                required
              />
              <button
                type="submit"
                disabled={isFetchingUrl || !prUrlInput.trim()}
                className="btn-emerald-glow px-5 py-2.5 text-xs font-semibold rounded-xl whitespace-nowrap shrink-0 disabled:opacity-40 flex items-center justify-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                <span>{isFetchingUrl ? 'Fetching Comments...' : 'Fetch PR Comments'}</span>
              </button>
            </div>
            <div className="text-[11px] text-[#6B7280]">
              Fetches all code review comments and discussion threads from any public GitHub repository PR.
            </div>
          </form>

          {/* List of Fetched Comments */}
          {fetchedComments.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-[#1E2822]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-[#10B981] font-bold">
                  {fetchedComments.length} Review Comments Found on this PR:
                </span>
                <span className="text-[11px] text-[#9CA3AF]">Click any comment to translate</span>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {fetchedComments.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      setCommentInput(c.body);
                      setReviewerName(c.user.login);
                      handleTranslateComment(c.body, c.user.login);
                    }}
                    className="p-3.5 rounded-xl bg-[#121814] hover:bg-[#162219] border border-[#1E2822] hover:border-[#10B981]/50 cursor-pointer transition-all space-y-1.5 group"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <img
                          src={c.user.avatar_url}
                          alt={c.user.login}
                          className="w-5 h-5 rounded-full border border-[#1E2822]"
                        />
                        <span className="font-bold text-white font-mono group-hover:text-[#10B981] transition-colors">
                          @{c.user.login}
                        </span>
                        {c.path && (
                          <span className="text-[10px] font-mono text-[#9CA3AF] bg-[#090C0A] px-2 py-0.5 rounded">
                            {c.path}{c.line ? `:${c.line}` : ''}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-[#10B981] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        <span>Translate</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                    <p className="text-xs text-[#D1D5DB] font-mono line-clamp-2">
                      {c.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error alert */}
      {error && (
        <div className="p-4 text-xs bg-red-950/40 text-red-300 rounded-2xl border border-red-800/50 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
          <div className="flex-1">{error}</div>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-white text-xs underline font-mono"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Full 7-Section Translation Output Deck */}
      {activeAnalysis && (
        <div className="space-y-6">
          <div className="p-8 rounded-2xl bg-[#0D110F]/90 border border-[#1E2822] space-y-6 backdrop-blur-md shadow-2xl relative">
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#1E2822]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981]" />
                <span className="font-mono text-xs font-bold text-white">
                  TRANSLATION BREAKDOWN
                </span>
                <span className="text-xs font-mono text-[#9CA3AF] px-2 py-0.5 rounded bg-[#121814] border border-[#1E2822]">
                  Target: {activeAnalysis.language || selectedLanguage}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveToMySpace}
                  className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-all flex items-center gap-1.5 ${
                    isSaved
                      ? 'bg-[#10B981]/20 text-[#34D399] border-[#10B981]/40'
                      : 'bg-[#121814] text-[#D1D5DB] border-[#1E2822] hover:border-[#10B981]/30 hover:bg-[#162219]'
                  }`}
                >
                  {isSaved ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Bookmark className="w-3.5 h-3.5" />}
                  <span>{isSaved ? 'Saved to My Space' : 'Save to My Space'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTranslateComment(activeAnalysis.originalComment, activeAnalysis.reviewer)}
                  disabled={isLoading}
                  className="px-3 py-1.5 text-xs font-medium rounded-xl bg-[#121814] text-[#D1D5DB] border border-[#1E2822] hover:border-[#10B981]/30 hover:bg-[#162219] transition-all flex items-center gap-1.5"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Re-translate</span>
                </button>
              </div>
            </div>

            {/* Original Comment Box */}
            <div className="p-4 rounded-xl bg-[#121814] border border-[#1E2822] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5 font-mono">
                  <UserCheck className="w-4 h-4 text-[#10B981]" />
                  <span>Review comment from @{activeAnalysis.reviewer}:</span>
                </span>
                <span className="text-[11px] font-mono text-[#6B7280]">Original on GitHub</span>
              </div>
              <p className="text-xs text-[#E5E7EB] font-mono italic leading-relaxed bg-[#090C0A] p-3 rounded-lg border border-[#1E2822]">
                "{activeAnalysis.originalComment}"
              </p>
            </div>

            {/* SECTION 1, 2: Meaning & Why Requested */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 1. Reviewer Meaning */}
              <div className="p-5 rounded-xl bg-[#121814]/80 border border-[#10B981]/30 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#10B981]/15 text-[#10B981] font-mono font-bold text-xs flex items-center justify-center border border-[#10B981]/30">
                    1
                  </span>
                  <h4 className="font-bold text-sm text-white">Reviewer Meaning</h4>
                </div>
                <p className="text-xs text-[#D1D5DB] leading-relaxed">
                  {activeAnalysis.explanation}
                </p>
              </div>

              {/* 2. Why Requested */}
              <div className="p-5 rounded-xl bg-[#121814]/80 border border-[#06B6D4]/30 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#06B6D4]/15 text-[#06B6D4] font-mono font-bold text-xs flex items-center justify-center border border-[#06B6D4]/30">
                    2
                  </span>
                  <h4 className="font-bold text-sm text-white">Why This Was Requested</h4>
                </div>
                <p className="text-xs text-[#D1D5DB] leading-relaxed">
                  {activeAnalysis.whyItMatters}
                </p>
              </div>
            </div>

            {/* SECTION 3: Next Actions Checklist */}
            <div className="p-5 rounded-xl bg-[#121814]/80 border border-[#84CC16]/30 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#84CC16]/15 text-[#84CC16] font-mono font-bold text-xs flex items-center justify-center border border-[#84CC16]/30">
                  3
                </span>
                <h4 className="font-bold text-sm text-white">Next Actions (Action Checklist)</h4>
              </div>
              <div className="space-y-2">
                {activeAnalysis.nextSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-[#E5E7EB] bg-[#090C0A] p-2.5 rounded-lg border border-[#1E2822]">
                    <CheckCircle2 className="w-4 h-4 text-[#84CC16] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 4: Step-by-Step Solution */}
            {activeAnalysis.stepByStepSolution && (
              <div className="p-5 rounded-xl bg-[#121814]/80 border border-[#1E2822] space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#10B981]/15 text-[#10B981] font-mono font-bold text-xs flex items-center justify-center border border-[#10B981]/30">
                    4
                  </span>
                  <h4 className="font-bold text-sm text-white">Step-by-Step Solution</h4>
                </div>
                <div className="text-xs text-[#D1D5DB] whitespace-pre-wrap leading-relaxed font-mono bg-[#090C0A] p-4 rounded-lg border border-[#1E2822]">
                  {activeAnalysis.stepByStepSolution}
                </div>
              </div>
            )}

            {/* SECTION 5: Code Example with Copy Button */}
            {activeAnalysis.codeExample && (
              <div className="p-5 rounded-xl bg-[#121814]/80 border border-[#1E2822] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#06B6D4]/15 text-[#06B6D4] font-mono font-bold text-xs flex items-center justify-center border border-[#06B6D4]/30">
                      5
                    </span>
                    <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                      <Code2 className="w-4 h-4 text-[#06B6D4]" />
                      <span>Code Example / Command Diff</span>
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy('code-snippet', activeAnalysis.codeExample || '')}
                    className="px-3 py-1 text-xs font-medium text-[#22D3EE] bg-[#090C0A] border border-[#1E2822] hover:border-[#06B6D4]/40 rounded-lg transition-all flex items-center gap-1.5"
                  >
                    {copiedState['code-snippet'] ? <Check className="w-3.5 h-3.5 text-[#06B6D4]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedState['code-snippet'] ? 'Copied Code' : 'Copy Code'}</span>
                  </button>
                </div>
                <div className="p-4 bg-[#090C0A] rounded-xl border border-[#1E2822] text-xs font-mono text-[#E5E7EB] overflow-x-auto leading-relaxed whitespace-pre">
                  {activeAnalysis.codeExample}
                </div>
              </div>
            )}

            {/* SECTION 6: Suggested Polite Reply for GitHub */}
            <div className="p-5 rounded-xl bg-[#121814]/80 border border-[#10B981]/40 space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#10B981] text-[#080B09] font-mono font-bold text-xs flex items-center justify-center shadow-xs">
                    6
                  </span>
                  <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4 text-[#10B981]" />
                    <span>Suggested Polite Reply for GitHub</span>
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('reply-text', activeAnalysis.draftedReply)}
                  className="btn-emerald-glow px-3.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5"
                >
                  {copiedState['reply-text'] ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedState['reply-text'] ? 'Copied Reply!' : '1-Click Copy Reply'}</span>
                </button>
              </div>
              <div className="p-4 bg-[#090C0A] rounded-xl border border-[#1E2822] text-xs text-[#34D399] font-mono leading-relaxed">
                {activeAnalysis.draftedReply}
              </div>
            </div>

            {/* SECTION 7: Technical Terms Explained */}
            {activeAnalysis.technicalTerms && activeAnalysis.technicalTerms.length > 0 && (
              <div className="p-5 rounded-xl bg-[#121814]/80 border border-[#1E2822] space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#84CC16]/15 text-[#84CC16] font-mono font-bold text-xs flex items-center justify-center border border-[#84CC16]/30">
                    7
                  </span>
                  <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-[#84CC16]" />
                    <span>Technical Terms Explained</span>
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {activeAnalysis.technicalTerms.map((t, idx) => (
                    <div key={idx} className="p-3 bg-[#090C0A] rounded-lg border border-[#1E2822] space-y-1">
                      <div className="font-mono font-bold text-xs text-[#84CC16]">{t.term}</div>
                      <div className="text-xs text-[#9CA3AF] leading-snug">{t.definition}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interactive Follow-up Question Deck */}
            <div className="pt-4 border-t border-[#1E2822] space-y-3">
              <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-[#10B981]" />
                <span>Need clarification on this reviewer's feedback? Ask BRANCHLY:</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={followUpInput}
                  onChange={(e) => setFollowUpInput(e.target.value)}
                  placeholder="e.g. How do I squash commits without losing my work?"
                  className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-[#1E2822] bg-[#090C0A] text-white focus:border-[#10B981] outline-none font-mono"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAskFollowUp();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAskFollowUp}
                  disabled={isLoadingFollowUp || !followUpInput.trim()}
                  className="btn-emerald-glow px-5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap shrink-0 disabled:opacity-40 flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isLoadingFollowUp ? 'Thinking...' : 'Ask Follow-up'}</span>
                </button>
              </div>

              {followUpAnswer && (
                <div className="p-4 text-xs bg-[#121814] border border-[#10B981]/30 rounded-xl text-[#E5E7EB] whitespace-pre-wrap leading-relaxed font-mono mt-2">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#10B981] mb-1 font-bold">
                    BRANCHLY Mentor Clarification:
                  </div>
                  {followUpAnswer}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
