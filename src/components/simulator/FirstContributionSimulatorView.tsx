import React, { useState } from 'react';
import {
  Sparkles,
  GitPullRequest,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  Copy,
  Check,
  FileCode,
  FolderGit2,
  Terminal,
  FileText,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Trophy
} from 'lucide-react';
import { recordSimulatedContribution } from '../../services/storage';

interface FirstContributionSimulatorProps {
  onExploreRealRepos: () => void;
}

export const FirstContributionSimulatorView: React.FC<FirstContributionSimulatorProps> = ({
  onExploreRealRepos,
}) => {
  const [currentStage, setCurrentStage] = useState<number>(1);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  // Stage 5 interactive file editor
  const INITIAL_DOC_TEXT = `# Getting Started with CampusNotes

Welcome to CampusNotes! To run this project locally, ensure you have Node.js installed.

## Prerequisites
- Node.js: Download from [Broken Node Link](http://broken-node-link-404.dev)
- Git: Download from https://git-scm.com

## Installation
Run \`npm install\` to set up dependencies.`;

  const [editorText, setEditorText] = useState(INITIAL_DOC_TEXT);
  const [fileSaved, setFileSaved] = useState(false);

  // Stage 6 commit message input
  const [commitMsg, setCommitMsg] = useState('docs: fix broken Node.js download link');
  const [committed, setCommitted] = useState(false);

  // Stage 7 pull request form
  const [prTitle, setPrTitle] = useState('docs: fix broken Node.js documentation link in getting-started.md');
  const [prDescription, setPrDescription] = useState('Resolves #18. Replaced the expired link with official https://nodejs.org.');
  const [prSubmitted, setPrSubmitted] = useState(false);

  const [validationWarning, setValidationWarning] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(text);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const handleSaveFileChange = () => {
    if (editorText.includes('broken-node-link-404')) {
      setValidationWarning('Please replace the broken link "http://broken-node-link-404.dev" with "https://nodejs.org" before saving.');
      return;
    }
    setValidationWarning(null);
    setFileSaved(true);
  };

  const handleSubmitPR = (e: React.FormEvent) => {
    e.preventDefault();
    setPrSubmitted(true);
    recordSimulatedContribution();
    setCurrentStage(8);
  };

  const handleResetSimulation = () => {
    setCurrentStage(1);
    setEditorText(INITIAL_DOC_TEXT);
    setFileSaved(false);
    setCommitMsg('docs: fix broken Node.js download link');
    setCommitted(false);
    setPrSubmitted(false);
  };

  const stages = [
    { num: 1, title: 'Choose Repo' },
    { num: 2, title: 'Understand Issue' },
    { num: 3, title: 'Workspace' },
    { num: 4, title: 'Create Branch' },
    { num: 5, title: 'Make Change' },
    { num: 6, title: 'Commit' },
    { num: 7, title: 'Open PR' },
    { num: 8, title: 'Complete!' },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Simulation Banner Notice */}
      <div className="p-3 bg-[#10B981]/10 text-[#34D399] rounded-xl border border-[#10B981]/25 flex items-center justify-between text-xs backdrop-blur-md">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 shrink-0 text-[#10B981]" />
          <span className="font-mono font-bold text-[11px] text-white">SAFE SANDBOX SIMULATOR:</span>
          <span>All actions are educational simulations inside your browser. No real GitHub data or repositories are altered.</span>
        </div>
        <button
          onClick={handleResetSimulation}
          className="text-[11px] underline font-medium hover:text-white shrink-0 text-[#9CA3AF]"
        >
          Restart Simulation
        </button>
      </div>

      {/* Main Heading */}
      <div className="p-8 rounded-2xl bg-[#0D110F]/85 border border-[#1E2822] space-y-3 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#06B6D4]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#06B6D4]">
          <Sparkles className="w-4 h-4 text-[#06B6D4]" />
          <span>FIRST CONTRIBUTION SIMULATOR</span>
        </div>
        <h2 className="font-heading text-3xl font-extrabold text-white">
          Your first contribution, without the confusion.
        </h2>
        <p className="text-sm text-[#9CA3AF] max-w-2xl leading-relaxed">
          Practise the complete contribution journey in a safe learning environment before working on a real repository. Follow all 8 stages from issue discovery to simulated pull request merge.
        </p>

        {/* Progress Stepper */}
        <div className="pt-6 border-t border-[#1E2822] overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max pb-1">
            {stages.map((st, i) => {
              const isCurrent = currentStage === st.num;
              const isPassed = currentStage > st.num;
              return (
                <div key={st.num} className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentStage(st.num)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                      isCurrent
                        ? 'btn-emerald-glow font-bold'
                        : isPassed
                        ? 'bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30 font-medium'
                        : 'bg-[#121814] text-[#6B7280] border border-[#1E2822] hover:text-[#9CA3AF]'
                    }`}
                  >
                    <span>{isPassed ? '✓' : `0${st.num}`}</span>
                    <span className="font-sans text-[11px]">{st.title}</span>
                  </button>
                  {i < stages.length - 1 && (
                    <span className="text-[#1E2822] text-xs">→</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* STAGE 1: CHOOSE A REPOSITORY */}
      {/* ======================================================== */}
      {currentStage === 1 && (
        <div className="p-8 rounded-2xl bg-[#0D110F]/80 border border-[#1E2822] space-y-6 backdrop-blur-md">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-[#10B981]">STAGE 01 OF 08</span>
            <h3 className="font-heading text-xl font-bold text-white">
              Examine the Sample Repository: <span className="text-[#34D399] font-mono">branchly/campus-notes</span>
            </h3>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              Before contributing, good open-source contributors inspect what the project does, what language it uses, and how its files are organized.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#121814] border border-[#1E2822] space-y-1">
              <span className="font-bold text-white flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#10B981]" />
                README.md
              </span>
              <p className="text-[#9CA3AF]">Explains project mission: "Open-source note-taking for university students."</p>
            </div>

            <div className="p-4 rounded-xl bg-[#121814] border border-[#1E2822] space-y-1">
              <span className="font-bold text-white flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-[#06B6D4]" />
                CONTRIBUTING.md
              </span>
              <p className="text-[#9CA3AF]">Rules: "Keep PRs atomic. Please claim issues with a comment before working."</p>
            </div>

            <div className="p-4 rounded-xl bg-[#121814] border border-[#1E2822] space-y-1">
              <span className="font-bold text-white flex items-center gap-1.5">
                <FolderGit2 className="w-3.5 h-3.5 text-[#84CC16]" />
                Project Tree
              </span>
              <p className="text-[#9CA3AF]">Contains `docs/`, `src/components/`, `tests/`, `package.json`.</p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#1E2822] flex justify-end">
            <button
              onClick={() => setCurrentStage(2)}
              className="btn-emerald-glow px-6 py-2.5 text-xs font-semibold rounded-xl flex items-center gap-2"
            >
              <span>Next: Inspect the Issue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* STAGE 2: UNDERSTAND AN ISSUE */}
      {/* ======================================================== */}
      {currentStage === 2 && (
        <div className="p-8 rounded-2xl bg-[#0D110F]/80 border border-[#1E2822] space-y-6 backdrop-blur-md">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-[#10B981]">STAGE 02 OF 08</span>
            <h3 className="font-heading text-xl font-bold text-white">
              Issue #18: Fix broken Node.js link in docs
            </h3>
            <p className="text-xs text-[#9CA3AF]">
              A maintainer tagged this with <code className="font-mono text-[#34D399]">good first issue</code>.
            </p>
          </div>

          {/* Issue breakdown */}
          <div className="p-5 rounded-xl bg-[#121814] border border-[#1E2822] space-y-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">Reported by:</span>
              <span className="text-[#9CA3AF]">@maintainer-sarah</span>
              <span className="text-[#6B7280]">·</span>
              <span className="text-[#10B981] font-bold font-mono">good first issue</span>
            </div>
            <p className="text-[#D1D5DB] leading-relaxed">
              "In <code className="font-mono bg-[#090C0A] px-1.5 py-0.5 rounded border border-[#1E2822] text-[#34D399]">docs/getting-started.md</code>, line 6 currently points to an old, broken link. Please update the hyperlink so it points to the official Node.js download site: <code className="font-mono bg-[#090C0A] px-1.5 py-0.5 rounded border border-[#1E2822] text-[#34D399]">https://nodejs.org</code>."
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl border border-[#1E2822] bg-[#090C0A] space-y-1">
              <span className="font-bold text-[#10B981]">What needs to be fixed:</span>
              <p className="text-[#9CA3AF]">A single broken URL in a Markdown documentation file.</p>
            </div>
            <div className="p-3.5 rounded-xl border border-[#1E2822] bg-[#090C0A] space-y-1">
              <span className="font-bold text-[#06B6D4]">Why it matters:</span>
              <p className="text-[#9CA3AF]">Prevents 404 errors for other students installing the project.</p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#1E2822] flex items-center justify-between">
            <button
              onClick={() => setCurrentStage(1)}
              className="text-xs text-[#9CA3AF] hover:text-white"
            >
              ← Back
            </button>
            <button
              onClick={() => setCurrentStage(3)}
              className="btn-emerald-glow px-6 py-2.5 text-xs font-semibold rounded-xl flex items-center gap-2"
            >
              <span>Next: Prepare Your Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* STAGE 3: PREPARE WORKSPACE */}
      {/* ======================================================== */}
      {currentStage === 3 && (
        <div className="p-8 rounded-2xl bg-[#0D110F]/80 border border-[#1E2822] space-y-6 backdrop-blur-md">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-[#10B981]">STAGE 03 OF 08</span>
            <h3 className="font-heading text-xl font-bold text-white">
              Forking & Cloning Your Personal Copy
            </h3>
            <p className="text-xs text-[#9CA3AF]">
              You never edit the original repo directly. First you fork it on GitHub, then clone your fork.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                step: 'Step 1: Clone your fork to your computer',
                cmd: 'git clone https://github.com/YOUR_USERNAME/campus-notes.git\ncd campus-notes'
              },
              {
                step: 'Step 2: Connect the original upstream repository',
                cmd: 'git remote add upstream https://github.com/branchly/campus-notes.git'
              },
              {
                step: 'Step 3: Install dependencies and verify everything works',
                cmd: 'npm install'
              }
            ].map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#121814] border border-[#1E2822] space-y-2">
                <div className="text-xs font-bold text-white">{item.step}</div>
                <div className="p-3 bg-[#090C0A] text-[#34D399] rounded-lg font-mono text-xs flex items-center justify-between border border-[#1E2822]">
                  <pre className="whitespace-pre-wrap">{item.cmd}</pre>
                  <button
                    onClick={() => copyToClipboard(item.cmd)}
                    className="p-1 hover:bg-[#1E2822] rounded text-[#9CA3AF] hover:text-white"
                    title="Copy command"
                  >
                    {copiedCmd === item.cmd ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#1E2822] flex items-center justify-between">
            <button onClick={() => setCurrentStage(2)} className="text-xs text-[#9CA3AF] hover:text-white">← Back</button>
            <button
              onClick={() => setCurrentStage(4)}
              className="btn-emerald-glow px-6 py-2.5 text-xs font-semibold rounded-xl flex items-center gap-2"
            >
              <span>Next: Create a Feature Branch</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* STAGE 4: CREATE A BRANCH */}
      {/* ======================================================== */}
      {currentStage === 4 && (
        <div className="p-8 rounded-2xl bg-[#0D110F]/80 border border-[#1E2822] space-y-6 backdrop-blur-md">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-[#10B981]">STAGE 04 OF 08</span>
            <h3 className="font-heading text-xl font-bold text-white">
              Create an Isolated Feature Branch
            </h3>
            <p className="text-xs text-[#9CA3AF]">
              Never make your changes on <code className="font-mono text-[#10B981]">main</code>. Always create a branch dedicated to issue #18.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#121814] border border-[#1E2822] space-y-3">
            <div className="text-xs font-bold text-white">Terminal Command:</div>
            <div className="p-3 bg-[#090C0A] text-[#34D399] rounded-lg font-mono text-xs flex items-center justify-between border border-[#1E2822]">
              <span>git checkout -b fix/node-doc-link</span>
              <button
                onClick={() => copyToClipboard('git checkout -b fix/node-doc-link')}
                className="p-1 hover:bg-[#1E2822] rounded text-[#9CA3AF] hover:text-white"
              >
                {copiedCmd === 'git checkout -b fix/node-doc-link' ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="text-[11px] text-[#9CA3AF] font-mono">
              Output: <code className="text-[#34D399]">Switched to a new branch 'fix/node-doc-link'</code>
            </div>
          </div>

          <div className="pt-4 border-t border-[#1E2822] flex items-center justify-between">
            <button onClick={() => setCurrentStage(3)} className="text-xs text-[#9CA3AF] hover:text-white">← Back</button>
            <button
              onClick={() => setCurrentStage(5)}
              className="btn-emerald-glow px-6 py-2.5 text-xs font-semibold rounded-xl flex items-center gap-2"
            >
              <span>Next: Edit File in Browser</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* STAGE 5: MAKE A CHANGE */}
      {/* ======================================================== */}
      {currentStage === 5 && (
        <div className="p-8 rounded-2xl bg-[#0D110F]/80 border border-[#1E2822] space-y-6 backdrop-blur-md">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-[#10B981]">STAGE 05 OF 08</span>
            <h3 className="font-heading text-xl font-bold text-white">
              Edit `docs/getting-started.md`
            </h3>
            <p className="text-xs text-[#9CA3AF]">
              Replace the broken URL <code className="font-mono text-red-400 bg-red-950/40 px-1 py-0.5 rounded border border-red-800/50">http://broken-node-link-404.dev</code> with <code className="font-mono text-[#34D399] bg-[#10B981]/15 px-1 py-0.5 rounded border border-[#10B981]/30">https://nodejs.org</code> in the editor below.
            </p>
          </div>

          {/* Interactive In-Browser Code Editor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-[#9CA3AF]">
              <span>File: docs/getting-started.md</span>
              <span className={fileSaved ? 'text-[#34D399]' : 'text-[#6B7280]'}>{fileSaved ? '✓ Saved' : 'Unsaved changes'}</span>
            </div>

            <textarea
              value={editorText}
              onChange={(e) => {
                setEditorText(e.target.value);
                setFileSaved(false);
              }}
              rows={8}
              className="w-full p-4 font-mono text-xs text-[#34D399] bg-[#090C0A] border border-[#1E2822] rounded-xl focus:border-[#10B981] outline-none leading-relaxed"
            />

            {validationWarning && (
              <div className="p-3 bg-amber-950/40 border border-amber-800/50 rounded-xl text-xs text-amber-300 font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{validationWarning}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => {
                  setEditorText(editorText.replace('http://broken-node-link-404.dev', 'https://nodejs.org'));
                  setValidationWarning(null);
                }}
                className="text-xs text-[#10B981] hover:underline font-mono"
              >
                Auto-fill correct link
              </button>

              <button
                type="button"
                onClick={handleSaveFileChange}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                  fileSaved ? 'bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/40' : 'btn-emerald-glow'
                }`}
              >
                {fileSaved ? '✓ Changes Verified & Saved' : 'Save & Verify Edit'}
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-[#1E2822] flex items-center justify-between">
            <button onClick={() => setCurrentStage(4)} className="text-xs text-[#9CA3AF] hover:text-white">← Back</button>
            <button
              onClick={() => {
                if (!fileSaved) {
                  setValidationWarning('Please click "Save & Verify Edit" before moving to commit stage.');
                  return;
                }
                setCurrentStage(6);
              }}
              disabled={!fileSaved}
              className="btn-emerald-glow px-6 py-2.5 text-xs font-semibold rounded-xl disabled:opacity-40 flex items-center gap-2"
            >
              <span>Next: Stage & Commit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* STAGE 6: COMMIT CHANGES */}
      {/* ======================================================== */}
      {currentStage === 6 && (
        <div className="p-8 rounded-2xl bg-[#0D110F]/80 border border-[#1E2822] space-y-6 backdrop-blur-md">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-[#10B981]">STAGE 06 OF 08</span>
            <h3 className="font-heading text-xl font-bold text-white">
              Record a Snapshot: `git commit`
            </h3>
            <p className="text-xs text-[#9CA3AF]">
              Write a clear, present-tense commit message explaining what changed.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#121814] border border-[#1E2822] space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-white">
                Commit Message:
              </label>
              <input
                type="text"
                value={commitMsg}
                onChange={(e) => setCommitMsg(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-[#1E2822] bg-[#090C0A] text-white focus:border-[#10B981] outline-none"
              />
            </div>

            <div className="p-3 bg-[#090C0A] border border-[#1E2822] text-[#34D399] rounded-lg font-mono text-[11px] space-y-1">
              <div>$ git add docs/getting-started.md</div>
              <div>$ git commit -m "{commitMsg}"</div>
              <div className="text-[#06B6D4] pt-1">[fix/node-doc-link 4a9b2c1] {commitMsg}</div>
              <div className="text-[#9CA3AF]"> 1 file changed, 1 insertion(+), 1 deletion(-)</div>
            </div>

            <button
              type="button"
              onClick={() => setCommitted(true)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                committed ? 'bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/40' : 'btn-emerald-glow'
              }`}
            >
              {committed ? '✓ Commit Snapshot Created' : 'Execute Simulated Commit'}
            </button>
          </div>

          <div className="pt-4 border-t border-[#1E2822] flex items-center justify-between">
            <button onClick={() => setCurrentStage(5)} className="text-xs text-[#9CA3AF] hover:text-white">← Back</button>
            <button
              onClick={() => setCurrentStage(7)}
              disabled={!committed}
              className="btn-emerald-glow px-6 py-2.5 text-xs font-semibold rounded-xl disabled:opacity-40 flex items-center gap-2"
            >
              <span>Next: Open Pull Request</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* STAGE 7: CREATE PULL REQUEST */}
      {/* ======================================================== */}
      {currentStage === 7 && (
        <form onSubmit={handleSubmitPR} className="p-8 rounded-2xl bg-[#0D110F]/80 border border-[#1E2822] space-y-6 backdrop-blur-md">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-[#10B981]">STAGE 07 OF 08</span>
            <h3 className="font-heading text-xl font-bold text-white">
              Simulated GitHub Pull Request Form
            </h3>
            <p className="text-xs text-[#9CA3AF]">
              This simulates the GitHub PR creation screen. You are proposing your branch <code className="font-mono text-[#34D399]">fix/node-doc-link</code> into upstream <code className="font-mono text-[#34D399]">main</code>.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-white">PR Title</label>
              <input
                type="text"
                value={prTitle}
                onChange={(e) => setPrTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#1E2822] bg-[#090C0A] text-white focus:border-[#10B981] outline-none"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-white">Description & Linked Issues</label>
              <textarea
                value={prDescription}
                onChange={(e) => setPrDescription(e.target.value)}
                rows={4}
                className="w-full p-3 text-xs rounded-lg border border-[#1E2822] bg-[#090C0A] text-white focus:border-[#10B981] outline-none leading-relaxed font-mono"
                required
              />
            </div>

            <div className="p-3 bg-[#10B981]/10 border border-[#10B981]/25 rounded-xl text-xs text-[#34D399] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
              <span>CI Check Automated Preview: All checks passing (1 commit, 1 file changed).</span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#1E2822] flex items-center justify-between">
            <button type="button" onClick={() => setCurrentStage(6)} className="text-xs text-[#9CA3AF] hover:text-white">← Back</button>
            <button
              type="submit"
              className="btn-emerald-glow px-6 py-2.5 text-xs font-semibold rounded-xl flex items-center gap-2"
            >
              <span>Submit Simulated Pull Request</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      )}

      {/* ======================================================== */}
      {/* STAGE 8: COMPLETE JOURNEY */}
      {/* ======================================================== */}
      {currentStage === 8 && (
        <div className="p-8 rounded-2xl bg-[#0D110F]/85 border border-[#10B981]/40 space-y-6 text-center backdrop-blur-md relative overflow-hidden shadow-[0_0_50px_-10px_rgba(16,185,129,0.2)]">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#10B981] to-[#06B6D4] text-[#080B09] flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(16,185,129,0.5)]">
            <Trophy className="w-7 h-7" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <span className="text-xs font-mono font-bold text-[#10B981] uppercase tracking-wider">
              SIMULATION MILESTONE REACHED
            </span>
            <h3 className="font-heading text-3xl font-extrabold text-white">
              Congratulations! Your Practice PR Was Merged.
            </h3>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              You just practiced the exact 8-stage lifecycle of open-source collaboration: choosing a project, understanding an issue, isolating your work on a branch, editing files, making clean commits, and proposing changes through a pull request.
            </p>
          </div>

          {/* Key Takeaways */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left text-xs max-w-3xl mx-auto pt-2">
            <div className="p-4 rounded-xl bg-[#121814] border border-[#1E2822] space-y-1">
              <span className="font-bold text-[#10B981]">1. Clean Branching</span>
              <p className="text-[#9CA3AF]">You kept main untouched and used a descriptive branch name.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#121814] border border-[#1E2822] space-y-1">
              <span className="font-bold text-[#06B6D4]">2. Focused Scope</span>
              <p className="text-[#9CA3AF]">You edited only what was required by the issue description.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#121814] border border-[#1E2822] space-y-1">
              <span className="font-bold text-[#84CC16]">3. Polite Communication</span>
              <p className="text-[#9CA3AF]">You filled in the PR summary referencing Closes #18.</p>
            </div>
          </div>

          <div className="pt-6 border-t border-[#1E2822] flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={handleResetSimulation}
              className="px-5 py-2.5 text-xs font-semibold text-[#D1D5DB] bg-[#121814] hover:bg-[#17221A] border border-[#1E2822] rounded-xl transition-colors"
            >
              Restart Simulation
            </button>
            <button
              onClick={onExploreRealRepos}
              className="btn-emerald-glow px-6 py-2.5 text-xs font-semibold rounded-xl flex items-center gap-2"
            >
              <span>Explore Real Public Repositories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
