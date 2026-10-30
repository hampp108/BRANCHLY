import React, { useState, useEffect } from 'react';
import {
  Footprints,
  CheckCircle2,
  Circle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Terminal,
  HelpCircle,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
  GitPullRequest,
  GitBranch,
  ArrowRight,
  ShieldAlert,
  Compass,
  Cpu,
  Layers
} from 'lucide-react';
import { GitHubRepo, GitHubIssue, UserPreferences } from '../../types';
import { toggleChecklistStep, getUserProgress, saveUserPreferences } from '../../services/storage';
import { generateWithAI, analyzeIssueHeuristically } from '../../services/api';

interface NewcomerPathProps {
  activeRepo: GitHubRepo | null;
  selectedIssue: GitHubIssue | null;
  userPrefs: UserPreferences;
  onUpdatePrefs: (prefs: Partial<UserPreferences>) => void;
  onNavigateTab: (tab: string) => void;
  onOpenRepoSelector: () => void;
}

export const NewcomerPathView: React.FC<NewcomerPathProps> = ({
  activeRepo,
  selectedIssue,
  userPrefs,
  onUpdatePrefs,
  onNavigateTab,
  onOpenRepoSelector,
}) => {
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [expandedStep, setExpandedStep] = useState<number | null>(1);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Mentor Mode state
  const [mentorQuery, setMentorQuery] = useState('');
  const [mentorHintLevel, setMentorHintLevel] = useState<1 | 2 | 3>(1);
  const [mentorResponse, setMentorResponse] = useState<string | null>(null);
  const [isLoadingMentor, setIsLoadingMentor] = useState(false);
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);

  // Questionnaire local inputs
  const [skillLevel, setSkillLevel] = useState(userPrefs.skillLevel);
  const [selectedLangs, setSelectedLangs] = useState<string[]>(userPrefs.languages);

  useEffect(() => {
    const progress = getUserProgress();
    setCompletedSteps(progress.completedChecklistSteps);
  }, []);

  const repoName = activeRepo ? activeRepo.name : 'starter-repo';
  const defaultBranch = activeRepo ? activeRepo.default_branch : 'main';
  const issueNumber = selectedIssue ? selectedIssue.number : 42;
  const branchName = selectedIssue
    ? `fix/issue-${issueNumber}-${selectedIssue.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 20)}`
    : 'fix/first-contribution';

  // 9-Step Standard Contribution Checklist
  const steps = [
    {
      id: 'step-1',
      title: '1. Fork the Repository',
      summary: 'Create a personal copy of the project on your own GitHub account.',
      why: 'You cannot write directly to someone else’s repository. Forking gives you full ownership to experiment and push branches safely.',
      instructions: `Navigate to https://github.com/${activeRepo ? activeRepo.full_name : 'owner/repo'} and click the "Fork" button at the top-right. Keep the repository name the same and click "Create fork".`,
      command: null,
      verification: 'You should see your GitHub username in the repository title: YOUR_USERNAME/' + repoName,
    },
    {
      id: 'step-2',
      title: '2. Clone Your Fork Locally',
      summary: 'Download the code to your local computer using the Git command line.',
      why: 'Cloning creates a local working directory linked to your personal fork.',
      instructions: 'Open your terminal (Terminal on macOS/Linux, Git Bash or PowerShell on Windows) and run:',
      command: `git clone https://github.com/YOUR_USERNAME/${repoName}.git\ncd ${repoName}`,
      verification: 'Run `git status` to verify you are on branch ' + defaultBranch + '.',
    },
    {
      id: 'step-3',
      title: '3. Configure the Upstream Remote',
      summary: 'Link your local repository back to the original source repository.',
      why: 'This allows you to pull the latest updates from the maintainers whenever other contributors merge code.',
      instructions: 'Add the original repository as a remote named "upstream":',
      command: `git remote add upstream https://github.com/${activeRepo ? activeRepo.full_name : 'original-owner/' + repoName}.git\ngit remote -v`,
      verification: 'You should see two remotes: "origin" (your fork) and "upstream" (the original repo).',
    },
    {
      id: 'step-4',
      title: '4. Install Dependencies & Build',
      summary: 'Install required packages and verify the project builds on your computer.',
      why: 'Never write changes until you confirm that the project builds in its clean state.',
      instructions: `Run the package manager commands for this ${activeRepo?.language || 'JavaScript'} project:`,
      command: `npm install\nnpm run build`,
      verification: 'Build should exit with 0 errors.',
    },
    {
      id: 'step-5',
      title: '5. Create an Isolated Working Branch',
      summary: 'Never make your changes directly on main or master.',
      why: 'Using dedicated branches keeps your main branch clean and allows you to submit multiple clean pull requests.',
      instructions: 'Create and switch to a descriptive new branch:',
      command: `git checkout -b ${branchName}`,
      verification: 'Run `git branch` to confirm the asterisk (*) is next to your new branch.',
    },
    {
      id: 'step-6',
      title: '6. Implement Your Changes & Run Tests',
      summary: 'Edit the files required for your issue and run automated test suites.',
      why: 'Small, focused changes are reviewed much faster by open-source maintainers.',
      instructions: selectedIssue
        ? `Focus only on what addresses issue #${selectedIssue.number}: "${selectedIssue.title}". Run local tests after editing.`
        : 'Make your edits cleanly. Run `npm test` to verify no regressions were introduced.',
      command: 'npm test',
      verification: 'All automated tests pass cleanly with no failures.',
    },
    {
      id: 'step-7',
      title: '7. Stage & Commit Your Changes',
      summary: 'Record your edits with a clear, conventional commit message.',
      why: 'Descriptive commit messages tell the maintainer what changed and why.',
      instructions: 'Review changed files with `git diff`, then stage and commit:',
      command: `git add .\ngit commit -m "fix: resolve issue #${issueNumber} documentation clarity"`,
      verification: 'Run `git status` — it should report "nothing to commit, working tree clean".',
    },
    {
      id: 'step-8',
      title: '8. Push the Branch to Your Fork',
      summary: 'Send your committed work up to your GitHub fork on the web.',
      why: 'GitHub needs your branch online before you can open a pull request.',
      instructions: 'Push your branch to origin:',
      command: `git push -u origin ${branchName}`,
      verification: 'Terminal output will show a link to open a pull request on GitHub!',
    },
    {
      id: 'step-9',
      title: '9. Open Your Pull Request (PR)',
      summary: 'Politely propose your changes to the project maintainers.',
      why: 'Maintainers will review your diff, run CI automated checks, and give kind feedback.',
      instructions: `Visit https://github.com/${activeRepo ? activeRepo.full_name : 'owner/repo'}. You will see a banner: "${branchName} had recent pushes". Click "Compare & pull request". Fill in the PR template referencing "Closes #${issueNumber}".`,
      command: null,
      verification: 'Your PR is submitted! Wait kindly for maintainer feedback.',
    },
  ];

  const handleToggleStep = (stepId: string) => {
    const isNowDone = toggleChecklistStep(stepId);
    if (isNowDone) {
      setCompletedSteps(prev => [...prev, stepId]);
    } else {
      setCompletedSteps(prev => prev.filter(id => id !== stepId));
    }
  };

  const handleCopyCommand = (cmd: string, idx: number) => {
    navigator.clipboard.writeText(cmd);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleAskMentor = async (queryText?: string) => {
    const query = queryText || mentorQuery;
    if (!query.trim()) return;

    setIsLoadingMentor(true);
    setMentorResponse(null);

    const levelDescriptions = {
      1: 'Level 1 (Gentle Hint): Do NOT provide complete code. Provide a calm conceptual question or pointing direction to help them figure it out.',
      2: 'Level 2 (Step-by-step guidance): Break the problem into 3 small sequential sub-steps with relevant file names, but do not dump raw copy-paste solution code.',
      3: 'Level 3 (Detailed explanation): Provide full conceptual clarity, explain common pitfalls, and show the exact git or code pattern needed.',
    };

    const prompt = `You are BRANCHLY's Mentor Mode. The student is working on:
Repository: ${activeRepo ? activeRepo.full_name : 'open source project'}
Selected Issue: ${selectedIssue ? `#${selectedIssue.number} ${selectedIssue.title}` : 'General setup'}
Student Question: "${query}"
Guidance Level: ${levelDescriptions[mentorHintLevel]}

Remember: BRANCHLY's philosophy is "Learn the process. Don't just follow instructions." Keep your tone supportive, calm, and educational.`;

    const res = await generateWithAI(prompt, 'You are BRANCHLY Mentor Mode, an empathetic senior engineer mentoring a first-time open source contributor.');
    if (res.text) {
      setMentorResponse(res.text);
    } else {
      setMentorResponse(
        `Mentor guidance for "${query}":\n\nWhen working on ${activeRepo ? activeRepo.name : 'this project'}, remember to keep your changes isolated on a branch. If you see an error, inspect the terminal output line number carefully before editing.`
      );
    }
    setIsLoadingMentor(false);
  };

  const handleSavePreferences = () => {
    onUpdatePrefs({
      skillLevel,
      languages: selectedLangs,
    });
    setIsSurveyOpen(false);
  };

  const issueAnalysis = selectedIssue ? analyzeIssueHeuristically(selectedIssue, activeRepo?.language) : null;
  const progressPercent = Math.round((completedSteps.length / steps.length) * 100);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header Cockpit Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-[#0D110F]/90 border border-[#1E2822] backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-32 bg-[#10B981]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 text-[10px] font-mono uppercase tracking-wider text-[#10B981]">
            <Footprints className="w-3 h-3 text-[#10B981]" />
            <span>NEWCOMER PATH · 9-STEP WORKFLOW & MENTOR MODE</span>
          </div>
          <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-white">
            Your Guided Contribution Journey
          </h2>
          <p className="text-xs text-[#9CA3AF] max-w-xl">
            {activeRepo
              ? `Personalized CLI commands and step-by-step guidance tailored to ${activeRepo.full_name}`
              : 'Select a repository to customize your command line workflow.'}
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={() => setIsSurveyOpen(!isSurveyOpen)}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-[#121814] border border-[#1E2822] hover:border-[#10B981]/40 rounded-xl transition-colors"
          >
            {isSurveyOpen ? 'Close Personalization' : 'Adjust Skills & Profile'}
          </button>

          {!activeRepo && (
            <button
              onClick={onOpenRepoSelector}
              className="btn-emerald-glow px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5"
            >
              Select Repo
            </button>
          )}
        </div>
      </div>

      {/* Personalization Drawer if Open */}
      {isSurveyOpen && (
        <div className="p-6 rounded-2xl bg-[#0D110F] border border-[#10B981]/40 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-sm text-white">
                Learner Personalization Profile
              </h3>
              <p className="text-xs text-[#9CA3AF]">Tailors recommendations to your current comfort level</p>
            </div>
            <span className="text-[10px] font-mono text-[#10B981]">Adaptive Engine</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-white">
                Your Git & Programming Comfort
              </label>
              <div className="space-y-1.5">
                {[
                  { id: 'absolute_beginner', label: 'Absolute Beginner', desc: 'First time using Git or the command line' },
                  { id: 'learning_git', label: 'Learning Git', desc: 'Know basic git clone/commit, want practice' },
                  { id: 'some_experience', label: 'Some Experience', desc: 'Comfortable with branches, looking for good repos' }
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    onClick={() => setSkillLevel(lvl.id as any)}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-colors ${
                      skillLevel === lvl.id
                        ? 'border-[#10B981] bg-[#10B981]/10 text-white font-semibold'
                        : 'border-[#1E2822] bg-[#121814] text-[#9CA3AF] hover:text-white'
                    }`}
                  >
                    <div className="text-white font-medium">{lvl.label}</div>
                    <div className="text-[11px] text-[#9CA3AF] font-normal">{lvl.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-white">
                Languages You Want to Practice
              </label>
              <div className="flex flex-wrap gap-2">
                {['JavaScript', 'TypeScript', 'Python', 'Markdown', 'HTML/CSS', 'Rust', 'Go'].map((lang) => {
                  const isSelected = selectedLangs.includes(lang);
                  return (
                    <button
                      key={lang}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedLangs(prev => prev.filter(l => l !== lang));
                        } else {
                          setSelectedLangs(prev => [...prev, lang]);
                        }
                      }}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                        isSelected
                          ? 'bg-[#10B981] text-[#080B09] font-bold shadow-xs'
                          : 'bg-[#121814] text-[#9CA3AF] border border-[#1E2822] hover:text-white'
                      }`}
                    >
                      {lang}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-[#1E2822]">
            <button
              onClick={() => setIsSurveyOpen(false)}
              className="px-3 py-1.5 text-xs text-[#9CA3AF] hover:text-white"
            >
              Skip for now
            </button>
            <button
              onClick={handleSavePreferences}
              className="btn-emerald-glow px-4 py-1.5 text-xs font-semibold rounded-lg"
            >
              Save Profile
            </button>
          </div>
        </div>
      )}

      {/* Active Selected Issue Card (if brought from IssueMedic) */}
      {selectedIssue && issueAnalysis && (
        <div className="p-6 rounded-2xl bg-[#0D110F]/90 border border-[#10B981]/30 space-y-4 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded border border-[#10B981]/20">
                CURRENT TARGET ISSUE
              </span>
              <span className="text-xs text-[#6B7280]">·</span>
              <span className="text-xs font-mono font-bold text-white">#{selectedIssue.number}</span>
            </div>
            <a
              href={selectedIssue.html_url}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-[#10B981] hover:underline flex items-center gap-1"
            >
              <span>GitHub Issue</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <h3 className="font-heading text-lg font-bold text-white">
            {selectedIssue.title}
          </h3>

          {/* 4-Question Problem Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[#121814] border border-[#1E2822] space-y-1">
              <span className="font-bold text-[#10B981]">1. What is the problem?</span>
              <p className="text-[#9CA3AF] leading-relaxed">{issueAnalysis.simplifiedSummary}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#121814] border border-[#1E2822] space-y-1">
              <span className="font-bold text-[#06B6D4]">2. Why does it matter?</span>
              <p className="text-[#9CA3AF] leading-relaxed">{issueAnalysis.whyItMatters}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#121814] border border-[#1E2822] space-y-1">
              <span className="font-bold text-[#84CC16]">3. What needs to be done?</span>
              <p className="text-[#9CA3AF] leading-relaxed">
                Implement the fix cleanly without altering unrelated files.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#121814] border border-[#1E2822] space-y-1">
              <span className="font-bold text-[#10B981]">4. What should I do first?</span>
              <p className="text-[#9CA3AF] leading-relaxed">
                Confirm no other contributor is already working on this in comments, then follow the 9 steps below!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Steps (7 cols) + Mentor Mode (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 9-Step Interactive Checklist */}
        <div className="lg:col-span-7 space-y-4">
          {/* Progress Header */}
          <div className="p-4 rounded-xl bg-[#0D110F] border border-[#1E2822] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-white">Step Completion</span>
              <span className="text-xs font-mono text-[#10B981]">
                {completedSteps.length} of {steps.length} ({progressPercent}%)
              </span>
            </div>
            <div className="w-36 h-2 bg-[#121814] rounded-full overflow-hidden border border-[#1E2822]">
              <div
                className="h-full bg-gradient-to-r from-[#10B981] to-[#06B6D4] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Checklist items */}
          <div className="space-y-3">
            {steps.map((step, idx) => {
              const isDone = completedSteps.includes(step.id);
              const isExpanded = expandedStep === idx + 1;

              return (
                <div
                  key={step.id}
                  className={`rounded-2xl border transition-all ${
                    isDone
                      ? 'bg-[#0D110F]/60 border-[#10B981]/30 opacity-90'
                      : isExpanded
                      ? 'bg-[#0D110F] border-[#10B981]/40 shadow-sm'
                      : 'bg-[#0D110F]/80 border-[#1E2822] hover:border-[#1E2822]'
                  }`}
                >
                  {/* Step Header */}
                  <div className="p-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggleStep(step.id)}
                        className="text-left shrink-0 transition-transform active:scale-90"
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                        ) : (
                          <Circle className="w-5 h-5 text-[#6B7280] hover:text-white" />
                        )}
                      </button>

                      <div
                        onClick={() => setExpandedStep(isExpanded ? null : idx + 1)}
                        className="cursor-pointer"
                      >
                        <h4
                          className={`font-heading font-bold text-sm ${
                            isDone ? 'line-through text-[#6B7280]' : 'text-white'
                          }`}
                        >
                          {step.title}
                        </h4>
                        <p className="text-xs text-[#9CA3AF] line-clamp-1">{step.summary}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setExpandedStep(isExpanded ? null : idx + 1)}
                      className="p-1 rounded-lg text-[#6B7280] hover:text-white transition-colors"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Expanded Body */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-2 border-t border-[#1E2822] space-y-3 text-xs">
                      {/* Why it matters note */}
                      <div className="p-3 rounded-xl bg-[#121814] border border-[#1E2822] text-[#9CA3AF] leading-relaxed flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-[#84CC16] mt-0.5 shrink-0" />
                        <div>
                          <span className="font-semibold text-white">Why this step: </span>
                          <span>{step.why}</span>
                        </div>
                      </div>

                      {/* Instructions */}
                      <div className="text-[#E5E7EB] leading-relaxed">
                        {step.instructions}
                      </div>

                      {/* Terminal Command Snippet */}
                      {step.command && (
                        <div className="rounded-xl bg-[#080B09] border border-[#1E2822] overflow-hidden">
                          <div className="px-3 py-1.5 bg-[#0D110F] border-b border-[#1E2822] flex items-center justify-between text-[11px] font-mono text-[#6B7280]">
                            <div className="flex items-center gap-1.5">
                              <Terminal className="w-3.5 h-3.5 text-[#10B981]" />
                              <span>terminal command</span>
                            </div>
                            <button
                              onClick={() => handleCopyCommand(step.command!, idx)}
                              className="text-[#9CA3AF] hover:text-white flex items-center gap-1"
                            >
                              {copiedIndex === idx ? (
                                <Check className="w-3 h-3 text-[#10B981]" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                              <span>{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
                            </button>
                          </div>
                          <pre className="p-3 text-xs font-mono text-[#34D399] overflow-x-auto leading-relaxed">
                            {step.command}
                          </pre>
                        </div>
                      )}

                      {/* Verification check */}
                      <div className="p-2.5 rounded-lg bg-[#121814] border border-[#1E2822] text-[11px] text-[#9CA3AF] flex items-center gap-2">
                        <span className="font-semibold text-[#06B6D4]">✓ How to verify:</span>
                        <span>{step.verification}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: MENTOR MODE (AI Educational Assistant) */}
        <div className="lg:col-span-5 sticky top-20 space-y-4">
          <div className="p-6 rounded-2xl bg-[#0D110F]/90 border border-[#1E2822] backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 flex items-center justify-center">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-white">
                    Mentor Mode
                  </h4>
                  <p className="text-[10px] text-[#9CA3AF]">Pedagogical AI companion</p>
                </div>
              </div>

              {/* Hint Level Selector */}
              <div className="flex items-center gap-1 p-1 bg-[#080B09] border border-[#1E2822] rounded-lg">
                {[1, 2, 3].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setMentorHintLevel(lvl as any)}
                    className={`px-2.5 py-1 text-[10px] font-bold rounded transition-colors ${
                      mentorHintLevel === lvl
                        ? 'bg-[#10B981] text-[#080B09]'
                        : 'text-[#9CA3AF] hover:text-white'
                    }`}
                    title={lvl === 1 ? 'Gentle Hint' : lvl === 2 ? 'Step guidance' : 'Detailed breakdown'}
                  >
                    L{lvl}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              Stuck on a git error, merge conflict, or code test failure? Ask your mentor. Guidance level {mentorHintLevel} gives you {mentorHintLevel === 1 ? 'a gentle nudge' : mentorHintLevel === 2 ? 'step breakdown' : 'detailed technical context'} so you learn rather than bypass problem-solving.
            </p>

            {/* Quick questions chips */}
            <div className="space-y-1.5 pt-1">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280]">
                Common Beginner Scenarios:
              </div>
              <div className="flex flex-col gap-1.5">
                {[
                  'What does "fatal: remote origin already exists" mean?',
                  'How do I sync my fork with recent changes from upstream?',
                  'How should I write a clean commit message?'
                ].map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setMentorQuery(q);
                      handleAskMentor(q);
                    }}
                    className="text-left p-2.5 rounded-xl bg-[#121814] hover:bg-[#162019] text-xs text-[#E5E7EB] border border-[#1E2822] hover:border-[#10B981]/40 transition-colors truncate"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Mentor Input form */}
            <div className="space-y-2 pt-2 border-t border-[#1E2822]">
              <textarea
                value={mentorQuery}
                onChange={(e) => setMentorQuery(e.target.value)}
                placeholder="Paste an error message or describe where you are stuck..."
                className="w-full p-3 text-xs rounded-xl border border-[#1E2822] bg-[#080B09] text-white placeholder-[#6B7280] focus:outline-none focus:border-[#10B981] min-h-[85px] resize-none"
              />
              <button
                onClick={() => handleAskMentor()}
                disabled={isLoadingMentor || !mentorQuery.trim()}
                className="btn-emerald-glow w-full py-2.5 px-3 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 disabled:opacity-40"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isLoadingMentor ? 'Consulting Mentor...' : 'Ask for Progressive Hint'}</span>
              </button>
            </div>

            {/* Mentor Output */}
            {mentorResponse && (
              <div className="p-4 rounded-xl bg-[#121814] border border-[#10B981]/40 space-y-2 text-xs">
                <div className="font-bold text-[#10B981] flex items-center justify-between">
                  <span>Mentor Insight (Level {mentorHintLevel})</span>
                  <span className="text-[10px] text-[#6B7280] font-mono">Gemma 2 Open Weights</span>
                </div>
                <div className="whitespace-pre-wrap leading-relaxed text-[#E5E7EB] text-xs">
                  {mentorResponse}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
