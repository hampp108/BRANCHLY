import React, { useState } from 'react';
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Copy,
  Check,
  Edit3,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { IssueQualityResult } from '../../types';
import { analyzeIssueQualityHeuristically, generateWithAI } from '../../services/api';

export const IssueQualityView: React.FC = () => {
  const [issueInput, setIssueInput] = useState(
`### Bug in navigation drawer
When clicking on mobile, the drawer opens but doesn't close properly when clicking outside.
Expected: it should dismiss.
Actual: stays open.
Steps: 1. Go to home page on phone, 2. Tap hamburger, 3. Tap outside.`
  );

  const [qualityResult, setQualityResult] = useState<IssueQualityResult>(() => {
    return analyzeIssueQualityHeuristically(
      "When clicking on mobile, the drawer opens but doesn't close properly when clicking outside. Expected: it should dismiss. Actual: stays open."
    );
  });

  const [editableDraft, setEditableDraft] = useState<string>(qualityResult.improvedDraft);
  const [copiedDraft, setCopiedDraft] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [errorAI, setErrorAI] = useState<string | null>(null);

  const handleEvaluate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!issueInput.trim()) return;

    setErrorAI(null);
    const res = analyzeIssueQualityHeuristically(issueInput.trim());
    setQualityResult(res);
    setEditableDraft(res.improvedDraft);
  };

  const handleRefineWithAI = async () => {
    setIsLoadingAI(true);
    setErrorAI(null);
    const prompt = `As BRANCHLY Issue Quality Checker, evaluate and rewrite this GitHub issue to be exceptionally welcoming and clear for first-time open source contributors.

Raw issue text:
"${issueInput}"

Please provide an improved structured Markdown issue description containing:
- 🐛 Problem Description
- 📋 Steps to Reproduce
- 🎯 Expected Behaviour
- 🛑 Actual Behaviour
- 💻 Environment & Relevant Files
- ✅ Acceptance Criteria for Contributors
- 🏷️ Recommended Labels (e.g., 'good first issue', 'bug', 'frontend')`;

    try {
      const res = await generateWithAI(prompt, 'You are an experienced open-source maintainer crafting welcoming, pristine GitHub issue descriptions for beginners.');
      if (res.error) {
        throw new Error(res.error);
      }
      if (res.text) {
        setEditableDraft(res.text);
      }
    } catch (err: any) {
      setErrorAI(err.message || 'AI enhancement encountered an issue. Using deterministic template.');
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleCopyDraft = () => {
    navigator.clipboard.writeText(editableDraft);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="p-8 rounded-2xl bg-[#0D110F]/85 border border-[#1E2822] space-y-3 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#10B981]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#10B981]">
          <FileCheck2 className="w-4 h-4 text-[#10B981]" />
          <span>MAINTAINER AUDIT TOOL · ISSUE QUALITY</span>
        </div>
        <h2 className="font-heading text-3xl font-extrabold text-white">
          Write issues that welcome contributors.
        </h2>
        <p className="text-sm text-[#9CA3AF] max-w-2xl leading-relaxed">
          Unclear, one-line bug reports intimidate newcomers. Evaluate whether your issue contains reproduction steps, acceptance criteria, and expected behavior, then generate a polished contributor-ready draft.
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleEvaluate} className="p-6 rounded-2xl bg-[#0D110F]/80 border border-[#1E2822] space-y-4 backdrop-blur-md">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label className="font-bold text-white">
              Paste Draft Issue Description
            </label>
            <span className="text-[11px] font-mono text-[#6B7280]">Markdown supported</span>
          </div>
          <textarea
            value={issueInput}
            onChange={(e) => setIssueInput(e.target.value)}
            rows={6}
            placeholder="Describe the bug or feature proposal..."
            className="w-full p-3.5 text-xs rounded-xl border border-[#1E2822] bg-[#090C0A] text-white focus:border-[#10B981] outline-none leading-relaxed resize-none font-mono"
            required
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="submit"
            className="btn-emerald-glow px-5 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5"
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Audit Issue Quality</span>
          </button>
        </div>
      </form>

      {/* Evaluation Results Card */}
      <div className="p-8 rounded-2xl bg-[#0D110F]/80 border border-[#1E2822] space-y-6 backdrop-blur-md">
        {/* Score Top Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2822]">
          <div className="space-y-1">
            <span className="text-xs font-mono font-semibold text-[#6B7280] uppercase tracking-wider">
              CONTRIBUTOR WELCOMING SCORE
            </span>
            <div className="flex items-center gap-3">
              <h3 className="font-heading text-2xl font-bold text-white tabular-nums">
                {qualityResult.score}% Quality Index
              </h3>
              <span
                className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                  qualityResult.grade === 'Excellent'
                    ? 'bg-[#10B981]/15 text-[#34D399] border-[#10B981]/30'
                    : qualityResult.grade === 'Good'
                    ? 'bg-[#06B6D4]/15 text-[#22D3EE] border-[#06B6D4]/30'
                    : 'bg-amber-950/40 text-amber-300 border-amber-800/50'
                }`}
              >
                {qualityResult.grade}
              </span>
            </div>
          </div>

          <div className="text-xs text-[#9CA3AF] font-mono">
            {qualityResult.missingElements.length === 0
              ? 'All 6 essential welcoming criteria are present!'
              : `${qualityResult.missingElements.length} recommended sections missing.`}
          </div>
        </div>

        {/* 6 Criteria Checklist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {qualityResult.criteria.map((c) => (
            <div
              key={c.id}
              className={`p-3.5 rounded-xl border transition-colors space-y-1 ${
                c.passed
                  ? 'bg-[#121814] border-[#1E2822]'
                  : 'bg-[#121814] border-amber-800/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  {c.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  ) : (
                    <XCircle className="w-4 h-4 text-amber-400" />
                  )}
                  <span>{c.label}</span>
                </span>
                <span className={`text-[10px] font-mono ${c.passed ? 'text-[#10B981]' : 'text-amber-400'}`}>
                  {c.passed ? 'PASSED' : 'MISSING'}
                </span>
              </div>
              <p className="text-[11px] text-[#9CA3AF] pl-5">
                {c.passed ? c.description : c.feedback}
              </p>
            </div>
          ))}
        </div>

        {/* Improved Draft Section */}
        <div className="pt-4 border-t border-[#1E2822] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="font-heading font-bold text-sm text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#10B981]" />
                <span>Contributor-Ready Issue Template</span>
              </h4>
              <p className="text-xs text-[#9CA3AF]">
                Structured with clear acceptance criteria and reproduction steps for first-time contributors.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRefineWithAI}
                disabled={isLoadingAI}
                className="px-3 py-1.5 text-xs font-semibold text-[#10B981] bg-[#10B981]/15 hover:bg-[#10B981]/25 border border-[#10B981]/30 rounded-lg transition-colors flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isLoadingAI ? 'Refining...' : 'AI Enhanced Polish'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopyDraft}
                className="btn-emerald-glow px-3.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5"
              >
                {copiedDraft ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedDraft ? 'Copied' : 'Copy Template'}</span>
              </button>
            </div>
          </div>

          {errorAI && (
            <div className="p-3 text-xs bg-amber-950/40 text-amber-300 rounded-xl border border-amber-800/40 flex items-center justify-between">
              <span>{errorAI}</span>
              <button
                type="button"
                onClick={() => setErrorAI(null)}
                className="text-amber-400 hover:text-white underline text-[11px] font-mono ml-2"
              >
                Dismiss
              </button>
            </div>
          )}

          <textarea
            value={editableDraft}
            onChange={(e) => setEditableDraft(e.target.value)}
            rows={10}
            className="w-full p-4 font-mono text-xs text-[#34D399] bg-[#090C0A] border border-[#1E2822] rounded-xl focus:border-[#10B981] outline-none leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
};
