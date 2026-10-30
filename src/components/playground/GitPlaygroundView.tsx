import React, { useState } from 'react';
import {
  GitBranch,
  GitCommit,
  GitMerge,
  Terminal,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Check,
  Copy,
  FolderGit2,
  Layers,
  Sparkles,
  GitPullRequest
} from 'lucide-react';
import { GitCommitNode, GitBranchState } from '../../types';
import { toggleLessonComplete } from '../../services/storage';

export const GitPlaygroundView: React.FC = () => {
  const [activeModule, setActiveModule] = useState<'visualizer' | 'concepts' | 'commands' | 'conflict'>('visualizer');

  // --- MODULE B: Interactive Branch Visualiser State ---
  const INITIAL_COMMITS: GitCommitNode[] = [
    { id: 'c1', hash: '8f2a1b', message: 'Initial commit: setup project structure', branch: 'main', timestamp: '10:00 AM' },
    { id: 'c2', hash: '3e7c9d', message: 'docs: add README and installation steps', branch: 'main', parentId: 'c1', timestamp: '10:15 AM' },
  ];

  const INITIAL_BRANCHES: GitBranchState[] = [
    { name: 'main', color: '#10B981', isCurrent: true },
    { name: 'feature-docs', color: '#06B6D4', isCurrent: false },
  ];

  const [commits, setCommits] = useState<GitCommitNode[]>(INITIAL_COMMITS);
  const [branches, setBranches] = useState<GitBranchState[]>(INITIAL_BRANCHES);
  const [currentBranch, setCurrentBranch] = useState<string>('main');
  const [newBranchInput, setNewBranchInput] = useState('');
  const [commitMessageInput, setCommitMessageInput] = useState('');
  const [branchToMerge, setBranchToMerge] = useState('feature-docs');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // --- MODULE C: Command Practice State ---
  const COMMANDS_DATA = [
    {
      command: 'git init',
      does: 'Initializes a brand-new, empty Git repository in the current folder.',
      when: 'Run once when starting a new project on your computer.',
      example: 'git init',
      practicePrompt: 'Type the command to turn your current directory into a Git repository:',
      expected: 'git init',
    },
    {
      command: 'git status',
      does: 'Shows the working tree status: staged, unstaged, and untracked files.',
      when: 'Check this frequently between edits to verify what has changed.',
      example: 'git status',
      practicePrompt: 'Check which files have been modified or staged:',
      expected: 'git status',
    },
    {
      command: 'git add',
      does: 'Stages changes from the working directory to the index (staging area).',
      when: 'Before committing, select which file changes should be included in the snapshot.',
      example: 'git add README.md  # or git add .',
      practicePrompt: 'Stage all modified files in the current folder:',
      expected: 'git add .',
    },
    {
      command: 'git commit',
      does: 'Saves a permanent snapshot of the staged changes with a descriptive message.',
      when: 'After completing a logical unit of work (e.g. fixed a typo, added a test).',
      example: 'git commit -m "docs: clarify installation steps"',
      practicePrompt: 'Commit your staged changes with message "docs: fix typo":',
      expected: 'git commit -m "docs: fix typo"',
    },
    {
      command: 'git branch',
      does: 'Lists, creates, or deletes branches in your local repository.',
      when: 'Check what branches exist, or prepare a new line of isolated work.',
      example: 'git branch fix-header',
      practicePrompt: 'List all existing local branches:',
      expected: 'git branch',
    },
    {
      command: 'git checkout / switch',
      does: 'Switches between branches or restores working tree files.',
      when: 'Move to a new branch before writing your changes.',
      example: 'git switch -c fix-navbar  # or git checkout -b fix-navbar',
      practicePrompt: 'Create and switch to a branch named "feature-login":',
      expected: 'git switch -c feature-login',
      alias: 'git checkout -b feature-login'
    },
    {
      command: 'git merge',
      does: 'Combines the commit history of a specified branch into your current branch.',
      when: 'Incorporate completed feature work or pull upstream changes.',
      example: 'git merge feature-login',
      practicePrompt: 'Merge the branch "feature-login" into your current branch:',
      expected: 'git merge feature-login',
    },
    {
      command: 'git clone',
      does: 'Downloads a complete copy of an existing remote repository to your local machine.',
      when: 'First step when contributing to a project or opening your fork.',
      example: 'git clone https://github.com/facebook/react.git',
      practicePrompt: 'Clone a repository from GitHub url "https://github.com/branchly/demo.git":',
      expected: 'git clone https://github.com/branchly/demo.git',
    },
    {
      command: 'git pull',
      does: 'Fetches from and integrates with another repository or a local branch.',
      when: 'Update your local branch with recent changes pushed by teammates or maintainers.',
      example: 'git pull upstream main',
      practicePrompt: 'Pull latest changes from the upstream main branch:',
      expected: 'git pull upstream main',
    },
    {
      command: 'git push',
      does: 'Updates remote references along with associated objects to GitHub.',
      when: 'Publish your local commits online to open a pull request.',
      example: 'git push -u origin fix-docs',
      practicePrompt: 'Push your branch "fix-docs" to origin with upstream tracking:',
      expected: 'git push -u origin fix-docs',
    },
  ];

  const [selectedCmdIndex, setSelectedCmdIndex] = useState(0);
  const [practiceInput, setPracticeInput] = useState('');
  const [practiceSuccess, setPracticeSuccess] = useState<boolean | null>(null);

  // --- MODULE D: Merge Conflict State ---
  const [conflictResolvedChoice, setConflictResolvedChoice] = useState<'a' | 'b' | 'both' | null>(null);

  // Actions for Visualizer
  const handleCreateBranch = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newBranchInput.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    if (!name) return;
    if (branches.some(b => b.name === name)) {
      setActionFeedback(`Branch "${name}" already exists.`);
      return;
    }
    const newBranch: GitBranchState = {
      name,
      color: '#10B981',
      isCurrent: true,
    };
    setBranches(prev => prev.map(b => ({ ...b, isCurrent: false })).concat(newBranch));
    setCurrentBranch(name);
    setNewBranchInput('');
    setActionFeedback(`Created and switched to branch "${name}".`);
    toggleLessonComplete('git-visualizer-branch');
  };

  const handleSwitchBranch = (name: string) => {
    setCurrentBranch(name);
    setBranches(prev => prev.map(b => ({ ...b, isCurrent: b.name === name })));
    setActionFeedback(`Switched to branch "${name}".`);
  };

  const handleMakeCommit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = commitMessageInput.trim() || 'chore: updated file in ' + currentBranch;
    const parent = commits.filter(c => c.branch === currentBranch || c.branch === 'main').slice(-1)[0];
    const newCommit: GitCommitNode = {
      id: 'c' + (commits.length + 1),
      hash: Math.random().toString(16).slice(2, 8),
      message: msg,
      branch: currentBranch,
      parentId: parent ? parent.id : undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setCommits(prev => [...prev, newCommit]);
    setCommitMessageInput('');
    setActionFeedback(`Committed snapshot [${newCommit.hash}] on ${currentBranch}.`);
    toggleLessonComplete('git-visualizer-commit');
  };

  const handleMergeBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (branchToMerge === currentBranch) {
      setActionFeedback(`Cannot merge branch into itself.`);
      return;
    }
    const newCommit: GitCommitNode = {
      id: 'c' + (commits.length + 1),
      hash: Math.random().toString(16).slice(2, 8),
      message: `Merge branch '${branchToMerge}' into ${currentBranch}`,
      branch: currentBranch,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setCommits(prev => [...prev, newCommit]);
    setActionFeedback(`Successfully merged '${branchToMerge}' into ${currentBranch}!`);
    toggleLessonComplete('git-visualizer-merge');
  };

  const handleResetVisualizer = () => {
    setCommits(INITIAL_COMMITS);
    setBranches(INITIAL_BRANCHES);
    setCurrentBranch('main');
    setActionFeedback('Visualiser reset to initial state.');
  };

  // Command practice verify
  const handleCheckCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = COMMANDS_DATA[selectedCmdIndex];
    const inputClean = practiceInput.trim().replace(/\s+/g, ' ');
    const isCorrect = inputClean === cmd.expected || (cmd.alias && inputClean === cmd.alias);
    setPracticeSuccess(Boolean(isCorrect));
    if (isCorrect) {
      toggleLessonComplete('cmd-' + cmd.command);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="p-8 rounded-2xl bg-[#0D110F]/85 border border-[#1E2822] space-y-3 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#10B981]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#10B981]">
          <Terminal className="w-4 h-4 text-[#10B981]" />
          <span>INTERACTIVE LEARNING SIMULATOR</span>
        </div>
        <h2 className="font-heading text-3xl font-extrabold text-white">
          Learn Git by doing, not memorising.
        </h2>
        <p className="text-sm text-[#9CA3AF] max-w-2xl leading-relaxed">
          Understand how Git tracks history, isolates experiments via branches, and reconciles conflicts through interactive browser exercises. Zero setup required.
        </p>

        {/* Module Switcher Tabs */}
        <div className="pt-4 flex flex-wrap items-center gap-2">
          {[
            { id: 'visualizer', label: 'Branch Visualiser' },
            { id: 'concepts', label: 'Core Git Concepts' },
            { id: 'commands', label: 'Command Practice' },
            { id: 'conflict', label: 'Merge Conflict Sandbox' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveModule(tab.id as any);
                setActionFeedback(null);
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
                activeModule === tab.id
                  ? 'btn-emerald-glow shadow-sm'
                  : 'bg-[#121814] text-[#D1D5DB] hover:text-white hover:bg-[#17221A] border border-[#1E2822]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODULE B: INTERACTIVE BRANCH VISUALISER */}
      {/* ======================================================== */}
      {activeModule === 'visualizer' && (
        <div className="space-y-6">
          {/* Visual Canvas Container */}
          <div className="p-6 rounded-2xl bg-[#0D110F]/80 border border-[#1E2822] space-y-6 backdrop-blur-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2822]">
              <div>
                <h3 className="font-heading font-bold text-lg text-white flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-[#10B981]" />
                  <span>Interactive Git Graph</span>
                </h3>
                <div className="text-xs text-[#9CA3AF] mt-0.5 font-mono">
                  Current Branch: <strong className="text-[#34D399]">{currentBranch}</strong> · {commits.length} commits recorded
                </div>
              </div>

              <button
                onClick={handleResetVisualizer}
                className="px-3 py-1.5 text-xs font-medium text-[#9CA3AF] hover:text-white bg-[#121814] border border-[#1E2822] hover:bg-[#17221A] rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Visualiser</span>
              </button>
            </div>

            {/* Visual Timeline Nodes */}
            <div className="p-6 rounded-xl bg-[#090C0A] border border-[#1E2822] overflow-x-auto min-h-[150px] flex items-center">
              <div className="flex items-center gap-6 min-w-max py-4 px-2">
                {commits.map((c, idx) => {
                  const isMain = c.branch === 'main';
                  const isMerge = c.message.toLowerCase().startsWith('merge');
                  return (
                    <div key={c.id} className="flex items-center gap-6">
                      <div className="relative group flex flex-col items-center">
                        {/* Node circle */}
                        <div
                          className={`w-11 h-11 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                            isMerge
                              ? 'bg-gradient-to-br from-[#06B6D4] to-[#10B981] text-[#080B09] shadow-[0_0_15px_rgba(6,182,212,0.5)] ring-2 ring-[#06B6D4]'
                              : isMain
                              ? 'bg-[#10B981] text-[#080B09] shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                              : 'bg-[#06B6D4] text-[#080B09] shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                          }`}
                        >
                          {isMerge ? <GitMerge className="w-4 h-4 stroke-[2.5]" /> : <GitCommit className="w-4 h-4 stroke-[2.5]" />}
                        </div>

                        {/* Node Tooltip Label */}
                        <div className="mt-2 text-center">
                          <span className="font-mono text-[10px] text-[#10B981] font-semibold">{c.hash}</span>
                          <span className="block text-[11px] font-medium text-white max-w-[130px] truncate">{c.message}</span>
                          <span className="block text-[10px] text-[#06B6D4] font-mono">[{c.branch}]</span>
                        </div>
                      </div>

                      {/* Direction arrow line between commits */}
                      {idx < commits.length - 1 && (
                        <div className="w-10 h-0.5 bg-[#1E2822] relative flex items-center justify-end">
                          <ArrowRight className="w-3.5 h-3.5 text-[#10B981] absolute -right-1" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interactive Control Deck */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              {/* Action 1: Create Branch */}
              <form onSubmit={handleCreateBranch} className="p-4 rounded-xl bg-[#121814] border border-[#1E2822] space-y-3">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <GitBranch className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>1. Create & Switch Branch</span>
                </div>
                <input
                  type="text"
                  value={newBranchInput}
                  onChange={(e) => setNewBranchInput(e.target.value)}
                  placeholder="e.g. fix-typo, feature-nav"
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#1E2822] bg-[#090C0A] text-white focus:outline-none focus:border-[#10B981] font-mono"
                />
                <button
                  type="submit"
                  disabled={!newBranchInput.trim()}
                  className="w-full py-1.5 text-xs font-semibold text-[#080B09] bg-[#10B981] hover:bg-[#34D399] disabled:opacity-40 rounded-lg transition-colors"
                >
                  Create Branch
                </button>
              </form>

              {/* Action 2: Make Commit */}
              <form onSubmit={handleMakeCommit} className="p-4 rounded-xl bg-[#121814] border border-[#1E2822] space-y-3">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <GitCommit className="w-3.5 h-3.5 text-[#06B6D4]" />
                  <span>2. Commit on {currentBranch}</span>
                </div>
                <input
                  type="text"
                  value={commitMessageInput}
                  onChange={(e) => setCommitMessageInput(e.target.value)}
                  placeholder="e.g. docs: update installation guide"
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#1E2822] bg-[#090C0A] text-white focus:outline-none focus:border-[#06B6D4] font-mono"
                />
                <button
                  type="submit"
                  className="w-full py-1.5 text-xs font-semibold text-[#080B09] bg-[#06B6D4] hover:bg-[#22D3EE] rounded-lg transition-colors"
                >
                  Commit Snapshot
                </button>
              </form>

              {/* Action 3: Merge Branch */}
              <form onSubmit={handleMergeBranch} className="p-4 rounded-xl bg-[#121814] border border-[#1E2822] space-y-3">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <GitMerge className="w-3.5 h-3.5 text-[#84CC16]" />
                  <span>3. Merge into {currentBranch}</span>
                </div>
                <select
                  value={branchToMerge}
                  onChange={(e) => setBranchToMerge(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#1E2822] bg-[#090C0A] text-white focus:outline-none focus:border-[#84CC16] font-mono"
                >
                  {branches.map(b => (
                    <option key={b.name} value={b.name} disabled={b.name === currentBranch}>
                      {b.name} {b.name === currentBranch ? '(current)' : ''}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  disabled={branchToMerge === currentBranch}
                  className="w-full py-1.5 text-xs font-semibold text-[#080B09] bg-[#84CC16] hover:bg-[#A3E635] disabled:opacity-40 rounded-lg transition-colors"
                >
                  Merge Branch
                </button>
              </form>
            </div>

            {/* Switch Branches Bar */}
            <div className="flex items-center gap-2 pt-2 text-xs">
              <span className="text-[#9CA3AF] font-medium">Switch Active Branch:</span>
              <div className="flex flex-wrap gap-1.5">
                {branches.map(b => (
                  <button
                    key={b.name}
                    onClick={() => handleSwitchBranch(b.name)}
                    className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-colors ${
                      b.name === currentBranch
                        ? 'bg-[#10B981] text-[#080B09] font-bold shadow-[0_0_8px_#10B981]'
                        : 'bg-[#121814] text-[#D1D5DB] border border-[#1E2822] hover:bg-[#17221A]'
                    }`}
                  >
                    {b.name} {b.name === currentBranch && '✓'}
                  </button>
                ))}
              </div>
            </div>

            {actionFeedback && (
              <div className="p-3 text-xs bg-[#10B981]/15 text-[#34D399] rounded-xl border border-[#10B981]/30 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-[#10B981]" />
                <span>{actionFeedback}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODULE A: CORE GIT CONCEPTS */}
      {/* ======================================================== */}
      {activeModule === 'concepts' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'What is Git?',
                desc: 'Git is a distributed version control system. It tracks the chronological history of changes made to computer files, allowing multiple engineers to work on the exact same project simultaneously without overwriting each other’s code.',
                example: 'Like an infinite undo button and save-game checkpoints for code.',
              },
              {
                title: 'What is a Repository (Repo)?',
                desc: 'A repository is the complete project workspace folder containing all source files, documentation, assets, and the hidden `.git` folder that records every change in project history.',
                example: 'The master folder containing the entire project and its timeline.',
              },
              {
                title: 'What is a Commit?',
                desc: 'A commit is an immutable snapshot of your staged files at a specific moment in time. Each commit has a unique alphanumeric SHA-1 hash identifier and an explanatory commit message.',
                example: '`git commit -m "fix: typo in header"` records checkpoint.',
              },
              {
                title: 'What is a Branch?',
                desc: 'A branch is an isolated pointer to a line of commits. It allows you to develop new features or fix bugs in isolation without touching the production-ready `main` branch.',
                example: 'Creates a parallel universe of code that you merge back later.',
              },
              {
                title: 'What is Merging?',
                desc: 'Merging integrates commits from an isolated branch (e.g. `feature-login`) back into the primary target branch (e.g. `main`). Git combines the changes into a merge commit.',
                example: 'Bringing your tested feature back into the main codebase.',
              },
              {
                title: 'What is GitHub?',
                desc: 'Git is the local command-line tool on your computer. GitHub is a cloud hosting platform that stores Git repositories online, adding tools for pull requests, code reviews, and issue tracking.',
                example: 'Git is the camera; GitHub is the photo gallery and discussion forum.',
              },
            ].map((concept, i) => (
              <div key={i} className="p-6 rounded-2xl bg-[#0D110F]/80 border border-[#1E2822] space-y-3 backdrop-blur-md">
                <div className="w-8 h-8 rounded-lg bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 font-bold text-xs flex items-center justify-center font-mono">
                  0{i + 1}
                </div>
                <h3 className="font-heading font-bold text-base text-white">
                  {concept.title}
                </h3>
                <p className="text-xs text-[#9CA3AF] leading-relaxed">
                  {concept.desc}
                </p>
                <div className="pt-2 border-t border-[#1E2822] text-[11px] text-[#34D399] bg-[#090C0A] p-2.5 rounded-lg font-mono">
                  💡 {concept.example}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODULE C: COMMAND PRACTICE */}
      {/* ======================================================== */}
      {activeModule === 'commands' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Command list */}
          <div className="md:col-span-4 p-4 rounded-2xl bg-[#0D110F]/80 border border-[#1E2822] space-y-1">
            <div className="text-xs font-mono font-bold text-[#6B7280] uppercase tracking-wider mb-2 px-2">
              Essential Git Commands
            </div>
            {COMMANDS_DATA.map((cmd, i) => (
              <button
                key={cmd.command}
                onClick={() => {
                  setSelectedCmdIndex(i);
                  setPracticeInput('');
                  setPracticeSuccess(null);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono transition-colors flex items-center justify-between ${
                  selectedCmdIndex === i
                    ? 'bg-[#10B981] text-[#080B09] font-bold shadow-[0_0_10px_#10B981]'
                    : 'text-[#D1D5DB] hover:bg-[#121814]'
                }`}
              >
                <span>{cmd.command}</span>
                <span className="text-[10px] opacity-75 font-sans">0{i + 1}</span>
              </button>
            ))}
          </div>

          {/* Active Command Deep Dive & Practice */}
          <div className="md:col-span-8 p-6 rounded-2xl bg-[#0D110F]/80 border border-[#1E2822] space-y-6">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-[#10B981]">
                COMMAND SPECIFICATION
              </div>
              <h3 className="font-mono text-2xl font-bold text-white mt-1">
                {COMMANDS_DATA[selectedCmdIndex].command}
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#121814] border border-[#1E2822] space-y-1">
                <span className="font-bold text-[#10B981]">What it does:</span>
                <p className="text-[#9CA3AF] leading-relaxed">{COMMANDS_DATA[selectedCmdIndex].does}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#121814] border border-[#1E2822] space-y-1">
                <span className="font-bold text-[#06B6D4]">When to use it:</span>
                <p className="text-[#9CA3AF] leading-relaxed">{COMMANDS_DATA[selectedCmdIndex].when}</p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-white">Syntax Example:</span>
                <div className="p-3 rounded-lg bg-[#090C0A] border border-[#1E2822] text-[#34D399] font-mono text-xs flex items-center justify-between">
                  <span>{COMMANDS_DATA[selectedCmdIndex].example}</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(COMMANDS_DATA[selectedCmdIndex].example)}
                    className="p-1 hover:bg-[#1E2822] rounded text-[#9CA3AF] hover:text-white"
                    title="Copy example"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Interactive Command Challenge */}
            <form onSubmit={handleCheckCommand} className="pt-4 border-t border-[#1E2822] space-y-3">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-[#10B981]" />
                <span>Practice Challenge:</span>
              </div>
              <p className="text-xs text-[#9CA3AF]">
                {COMMANDS_DATA[selectedCmdIndex].practicePrompt}
              </p>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={practiceInput}
                  onChange={(e) => {
                    setPracticeInput(e.target.value);
                    setPracticeSuccess(null);
                  }}
                  placeholder="Type the Git command here..."
                  className="flex-1 px-3 py-2 text-xs font-mono rounded-xl border border-[#1E2822] bg-[#090C0A] text-white focus:border-[#10B981] outline-none"
                />
                <button
                  type="submit"
                  className="btn-emerald-glow px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap shrink-0"
                >
                  Verify Command
                </button>
              </div>

              {practiceSuccess === true && (
                <div className="p-3 text-xs bg-[#10B981]/15 text-[#34D399] rounded-xl border border-[#10B981]/30 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-[#10B981]" />
                  <span>Exact match! You have mastered this command syntax.</span>
                </div>
              )}

              {practiceSuccess === false && (
                <div className="p-3 text-xs bg-red-950/40 text-red-300 rounded-xl border border-red-800/50 space-y-1">
                  <div className="font-semibold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                    <span>Not quite right. Try again or check the expected format:</span>
                  </div>
                  <div className="font-mono text-[11px] text-red-200">Expected: {COMMANDS_DATA[selectedCmdIndex].expected}</div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODULE D: MERGE CONFLICT SANDBOX */}
      {/* ======================================================== */}
      {activeModule === 'conflict' && (
        <div className="p-8 rounded-2xl bg-[#0D110F]/80 border border-[#1E2822] space-y-6">
          <div className="space-y-1">
            <div className="text-xs font-mono uppercase tracking-wider text-[#10B981]">
              SIMULATED MERGE CONFLICT WORKSHOP
            </div>
            <h3 className="font-heading text-2xl font-bold text-white">
              Resolving Git Merge Conflicts Without Fear
            </h3>
            <p className="text-xs text-[#9CA3AF] leading-relaxed max-w-3xl">
              A merge conflict happens when two branches modify the <strong>exact same lines</strong> in a file differently. Git pauses the merge and inserts conflict markers so a human can choose what to keep.
            </p>
          </div>

          {/* Scenario visual */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#121814] border border-[#1E2822] space-y-2">
              <span className="font-mono font-bold text-[#06B6D4]">Branch: main (Incoming)</span>
              <div className="p-2.5 rounded bg-[#090C0A] border border-[#1E2822] font-mono text-[11px] text-[#D1D5DB]">
                BRANCHLY is a quiet, educational open-source companion designed for beginners.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#121814] border border-[#1E2822] space-y-2">
              <span className="font-mono font-bold text-[#10B981]">Branch: feature-tagline (Current HEAD)</span>
              <div className="p-2.5 rounded bg-[#090C0A] border border-[#1E2822] font-mono text-[11px] text-[#D1D5DB]">
                BRANCHLY is an open-source platform guiding you from your first fork to your first merge.
              </div>
            </div>
          </div>

          {/* Conflict Markers Preview */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-white">
              What Git writes in your file (`README.md`):
            </div>
            <div className="p-4 rounded-xl bg-[#090C0A] border border-[#1E2822] text-[#34D399] font-mono text-xs leading-relaxed overflow-x-auto">
              <div className="text-[#06B6D4]">&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD (Current Change - feature-tagline)</div>
              <div className="pl-4 py-1 text-white">BRANCHLY is an open-source platform guiding you from your first fork to your first merge.</div>
              <div className="text-[#6B7280]">=======</div>
              <div className="pl-4 py-1 text-[#9CA3AF]">BRANCHLY is a quiet, educational open-source companion designed for beginners.</div>
              <div className="text-[#06B6D4]">&gt;&gt;&gt;&gt;&gt;&gt;&gt; main (Incoming Change)</div>
            </div>
          </div>

          {/* Conflict Resolution Choice Deck */}
          <div className="space-y-3 pt-2">
            <div className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Choose how you want to resolve this conflict:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => {
                  setConflictResolvedChoice('a');
                  toggleLessonComplete('git-conflict-resolved');
                }}
                className={`p-3 rounded-xl border text-xs text-left transition-colors space-y-1 ${
                  conflictResolvedChoice === 'a' ? 'border-[#06B6D4] bg-[#06B6D4]/15 ring-1 ring-[#06B6D4]' : 'border-[#1E2822] bg-[#121814] hover:bg-[#17221A]'
                }`}
              >
                <div className="font-bold text-white">Keep Incoming (`main`)</div>
                <div className="text-[11px] text-[#9CA3AF]">Accept what the maintainers merged on main.</div>
              </button>

              <button
                onClick={() => {
                  setConflictResolvedChoice('b');
                  toggleLessonComplete('git-conflict-resolved');
                }}
                className={`p-3 rounded-xl border text-xs text-left transition-colors space-y-1 ${
                  conflictResolvedChoice === 'b' ? 'border-[#10B981] bg-[#10B981]/15 ring-1 ring-[#10B981]' : 'border-[#1E2822] bg-[#121814] hover:bg-[#17221A]'
                }`}
              >
                <div className="font-bold text-white">Keep Current (`HEAD`)</div>
                <div className="text-[11px] text-[#9CA3AF]">Keep your feature branch formulation.</div>
              </button>

              <button
                onClick={() => {
                  setConflictResolvedChoice('both');
                  toggleLessonComplete('git-conflict-resolved');
                }}
                className={`p-3 rounded-xl border text-xs text-left transition-colors space-y-1 ${
                  conflictResolvedChoice === 'both' ? 'border-[#84CC16] bg-[#84CC16]/15 ring-1 ring-[#84CC16]' : 'border-[#1E2822] bg-[#121814] hover:bg-[#17221A]'
                }`}
              >
                <div className="font-bold text-[#84CC16]">Combine Both Elegantly</div>
                <div className="text-[11px] text-[#9CA3AF]">Merge both ideas into one unified sentence.</div>
              </button>
            </div>
          </div>

          {/* Resolved result output */}
          {conflictResolvedChoice && (
            <div className="p-4 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 space-y-2 text-xs">
              <div className="font-bold text-[#34D399] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                <span>Conflict Successfully Resolved!</span>
              </div>
              <div className="p-3 bg-[#090C0A] rounded-lg border border-[#1E2822] font-mono text-[11px] text-[#34D399]">
                {conflictResolvedChoice === 'a' && 'BRANCHLY is a quiet, educational open-source companion designed for beginners.'}
                {conflictResolvedChoice === 'b' && 'BRANCHLY is an open-source platform guiding you from your first fork to your first merge.'}
                {conflictResolvedChoice === 'both' && 'BRANCHLY is a quiet, educational open-source companion guiding beginners from their first fork to their first merge.'}
              </div>
              <p className="text-[11px] text-[#9CA3AF]">
                Next in real Git: Stage the file with <code className="font-mono bg-[#121814] text-white px-1 py-0.5 rounded border border-[#1E2822]">git add README.md</code> and finalize with <code className="font-mono bg-[#121814] text-white px-1 py-0.5 rounded border border-[#1E2822]">git commit</code>.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
