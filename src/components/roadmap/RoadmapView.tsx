import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  Circle,
  BookOpen,
  ArrowRight,
  Sparkles,
  Code2,
  GitBranch,
  Layers,
  ChevronDown,
  ChevronUp,
  Clock,
  RotateCcw,
  Map
} from 'lucide-react';
import { RoadmapLevel, UserPreferences } from '../../types';
import { toggleLessonComplete, getUserProgress } from '../../services/storage';

interface RoadmapViewProps {
  userPrefs: UserPreferences;
  onUpdatePrefs: (prefs: Partial<UserPreferences>) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  userPrefs,
  onUpdatePrefs,
}) => {
  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    return getUserProgress().completedLessons || ['l1-1'];
  });
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const [expandedLessonId, setExpandedLessonId] = useState<string | null>('l1-1');

  // Personalization fields
  const [learningPace, setLearningPace] = useState<'casual' | 'regular' | 'intensive'>('regular');
  const [interestFocus, setInterestFocus] = useState<string>('Frontend & Docs');

  const ROADMAP_DATA: RoadmapLevel[] = [
    {
      level: 1,
      title: 'Level 1 — Foundations',
      subtitle: 'The Core Ecosystem & Conceptual Mental Models',
      lessons: [
        {
          id: 'l1-1',
          title: 'What is Open Source Software?',
          explanation: 'Open-source software is computer software where the underlying source code is made freely available to the public for viewing, inspection, modification, and redistribution under recognized open licenses like MIT or Apache 2.0.',
          example: 'Linux, React, Python, and VS Code are famous open-source projects built collaboratively by thousands of developers around the world.',
          exercise: 'Look up one software library you use everyday (e.g. React or Tailwind) and find its official public GitHub repository.',
        },
        {
          id: 'l1-2',
          title: 'What is Git and Version Control?',
          explanation: 'Git is a distributed version control system. It records the chronological evolution of project files, allowing developers to jump back to past versions, experiment without breaking working code, and collaborate in teams without conflicts.',
          example: 'Instead of saving files as `project_v1.js`, `project_v2_final.js`, Git keeps one clean file and tracks every individual change as an atomic commit.',
          exercise: 'Think of Git as an infinite "save game" checkpoint system for your source code.',
        },
        {
          id: 'l1-3',
          title: 'What is GitHub vs Git?',
          explanation: 'Git is the local command-line engine installed on your computer. GitHub is a cloud hosting service that stores Git repositories online, adding social collaboration features like pull requests, code reviews, and issue discussions.',
          example: 'Git is like the camera hardware on your phone; GitHub is Instagram where photos are shared, commented on, and liked.',
          exercise: 'Open github.com and notice the difference between the local terminal commands and the web UI.',
        },
        {
          id: 'l1-4',
          title: 'What is a Repository (Repo)?',
          explanation: 'A repository is the master folder for a project. It contains all source files, documentation, asset images, test suites, and the hidden `.git` ledger directory that stores the complete history of every commit.',
          example: '`facebook/react` is the repository containing the entire React framework source code.',
          exercise: 'Clone or explore a repository in BRANCHLY and inspect the root folder items.',
        },
      ]
    },
    {
      level: 2,
      title: 'Level 2 — Git Basics',
      subtitle: 'Snapshots, Branches & Remote Workflows',
      lessons: [
        {
          id: 'l2-1',
          title: 'Commits: Taking Project Snapshots',
          explanation: 'A commit is a permanent snapshot of staged files. Every commit includes a unique cryptographic SHA hash, an author name, timestamp, and a clear message explaining why the change was made.',
          example: '`git commit -m "docs: fix typo in installation guide"` saves your exact edits.',
          exercise: 'Practice staging a file with `git add` and committing it with a conventional commit message in Git Playground.',
        },
        {
          id: 'l2-2',
          title: 'Branches: Parallel Workspaces',
          explanation: 'A branch is an isolated pointer to a line of commits. It allows you to develop a new feature or fix a bug in complete safety without altering the stable `main` branch until review is complete.',
          example: '`git checkout -b fix-nav-overflow` starts an isolated feature branch.',
          exercise: 'Use the BRANCHLY Branch Visualizer to create two branches and observe how their commit nodes diverge.',
        },
        {
          id: 'l2-3',
          title: 'Forking vs Cloning',
          explanation: 'Forking creates a copy of someone else’s repository under YOUR GitHub account in the cloud. Cloning downloads that repository from the cloud to your local computer’s hard drive.',
          example: 'Fork on github.com (cloud to cloud) → Clone with `git clone` (cloud to local disk).',
          exercise: 'Explain to yourself why you must fork before cloning when you do not have write access to a maintainer’s project.',
        },
        {
          id: 'l2-4',
          title: 'Connecting the Upstream Remote',
          explanation: 'When working on your fork, other developers continue merging code into the original project. The "upstream" remote connects your local repo back to the original source repo so you can pull their new changes.',
          example: '`git remote add upstream https://github.com/original-owner/repo.git`',
          exercise: 'Run `git remote -v` in the terminal checklist to see your origin and upstream endpoints.',
        },
      ]
    },
    {
      id: 'level-3',
      level: 3,
      title: 'Level 3 — Understanding Projects',
      subtitle: 'Navigating Codebases & Local Setup',
      lessons: [
        {
          id: 'l3-1',
          title: 'How to Read a Project README',
          explanation: 'The README is the front door of any repository. A good README tells you what the project is, prerequisite tools (Node version, Python version), installation steps, and test commands.',
          example: 'Always check the "Prerequisites" section before running `npm install` to avoid version mismatch errors.',
          exercise: 'Open DocSmith and review the generated sections of a standard open-source README.',
        },
        {
          id: 'l3-2',
          title: 'Understanding File Structures',
          explanation: 'Most repositories follow established directory layouts: `src/` for source code, `tests/` for automated unit tests, `docs/` for guides, and `.github/` for CI/CD action workflows and issue templates.',
          example: 'Never edit files inside `dist/` or `build/` — these are generated compiled outputs that get overwritten.',
          exercise: 'Inspect the standard folder structure module in DocSmith.',
        },
        {
          id: 'l3-3',
          title: 'Installing Dependencies & Running Tests',
          explanation: 'Before writing any code, always install dependencies (`npm install` or `pip install`) and run the test suite (`npm test`). Confirming tests pass first proves your environment is healthy.',
          example: 'If tests fail before you wrote any code, you know it is an environment or dependency setup issue rather than a code bug.',
          exercise: 'In the First Contribution Simulator, observe why testing in clean state is essential.',
        },
      ]
    },
    {
      id: 'level-4',
      level: 4,
      title: 'Level 4 — Finding Contributions',
      subtitle: 'Issues, Etiquette & Maintainer Communication',
      lessons: [
        {
          id: 'l4-1',
          title: 'Understanding Issue Classifications',
          explanation: 'Issues are not only bug reports; they represent feature proposals, documentation improvements, test coverage expansions, and accessibility audits.',
          example: 'Look for labels like `documentation` or `good first issue` for your initial pull request.',
          exercise: 'Use IssueMedic to filter open issues by category and beginner friendliness.',
        },
        {
          id: 'l4-2',
          title: 'Maintainer Etiquette & Claiming Issues',
          explanation: 'Always comment politely on an issue before starting work: "Hi @maintainers, I would love to work on this issue if it is still available!" This prevents two contributors from duplicating the same task.',
          example: 'Wait for a maintainer to respond or assign you before spending hours writing code.',
          exercise: 'Copy one of IssueMedic’s suggested maintainer questions to see how polite inquiries are phrased.',
        },
        {
          id: 'l4-3',
          title: 'Reading CONTRIBUTING.md Guidelines',
          explanation: 'Repositories have specific coding standards: branch naming rules, linter requirements, commit message conventions (e.g. Conventional Commits `feat:`, `fix:`), and PR description templates.',
          example: 'If CONTRIBUTING.md asks you to run `npm run lint` before committing, doing so saves review round-trips.',
          exercise: 'Generate a CONTRIBUTING.md guide in DocSmith to review the standard rules.',
        },
      ]
    },
    {
      id: 'level-5',
      level: 5,
      title: 'Level 5 — Making Contributions',
      subtitle: 'From Pull Request to Merge Celebration',
      lessons: [
        {
          id: 'l5-1',
          title: 'Opening Your First Pull Request (PR)',
          explanation: 'A pull request asks the project maintainers to pull commits from your branch into their main branch. Fill out the PR template thoroughly, link the issue with `Closes #123`, and explain what was changed.',
          example: 'Linking `Closes #123` automatically marks the issue resolved when your pull request is merged!',
          exercise: 'Complete the PR form in the First Contribution Simulator.',
        },
        {
          id: 'l5-2',
          title: 'Understanding Code Reviews Gracefully',
          explanation: 'Code review is a collaborative learning process, not an examination. Reviewers suggest naming improvements, missing edge-case tests, or minor formatting nits to keep the codebase maintainable.',
          example: 'Thank the reviewer for their time: "Thanks for the review! Updated the commit with the requested changes."',
          exercise: 'Use the PR Review Translator to see how reviewer comments are translated into actionable checklists.',
        },
        {
          id: 'l5-3',
          title: 'Updating PRs & Celebrating Your First Merge',
          explanation: 'When a reviewer requests changes, you do not close the PR! You simply make edits locally, commit them, and run `git push origin <branch>`. GitHub updates your existing PR automatically.',
          example: 'Once approved, the maintainer clicks "Merge pull request", and your commit becomes part of global open-source history.',
          exercise: 'Verify your milestone badge in My Progress after completing simulated and real contributions.',
        },
      ]
    },
  ];

  const totalLessonsCount = ROADMAP_DATA.reduce((acc, lvl) => acc + lvl.lessons.length, 0);
  const completedCount = completedLessons.length;
  const progressPercent = Math.min(100, Math.round((completedCount / totalLessonsCount) * 100));

  // Find next recommended lesson
  let nextLesson = null;
  for (const lvl of ROADMAP_DATA) {
    for (const l of lvl.lessons) {
      if (!completedLessons.includes(l.id)) {
        nextLesson = { ...l, levelTitle: lvl.title };
        break;
      }
    }
    if (nextLesson) break;
  }

  const handleToggle = (id: string) => {
    const isDone = toggleLessonComplete(id);
    if (isDone) {
      setCompletedLessons(prev => [...prev, id]);
    } else {
      setCompletedLessons(prev => prev.filter(l => l !== id));
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="p-8 rounded-2xl bg-[#0D110F]/85 border border-[#1E2822] space-y-4 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#10B981]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#10B981]">
              <Map className="w-4 h-4 text-[#10B981]" />
              <span>5-TIER CURRICULUM</span>
            </div>
            <h2 className="font-heading text-3xl font-extrabold text-white">
              Build your open-source skills, one step at a time.
            </h2>
            <p className="text-xs text-[#9CA3AF] max-w-xl leading-relaxed">
              A structured 5-level curriculum designed for first-year students and aspiring developers. Mark lessons complete at your own pace.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSurveyOpen(!isSurveyOpen)}
              className="px-3.5 py-2 text-xs font-medium text-white bg-[#121814] border border-[#1E2822] hover:bg-[#17221A] hover:border-[#10B981]/40 rounded-xl transition-all"
            >
              {isSurveyOpen ? 'Close Settings' : 'Personalise Pace'}
            </button>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="space-y-2 pt-2 border-t border-[#1E2822]">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white">Curriculum Mastery</span>
            <span className="font-mono text-[#34D399] font-semibold tabular-nums">{completedCount} of {totalLessonsCount} lessons completed ({progressPercent}%)</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#1E2822] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#10B981] to-[#06B6D4] rounded-full transition-all duration-500 shadow-[0_0_10px_#10B981]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Recommended Next Lesson Card */}
        {nextLesson && (
          <div className="p-4 rounded-xl bg-[#121814]/80 border border-[#10B981]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-[11px] font-mono uppercase text-[#10B981] tracking-wider">
                RECOMMENDED NEXT LESSON · {nextLesson.levelTitle}
              </div>
              <div className="font-heading font-bold text-sm text-white">
                {nextLesson.title}
              </div>
              <div className="text-xs text-[#9CA3AF]">
                {nextLesson.explanation.slice(0, 110)}...
              </div>
            </div>

            <button
              onClick={() => setExpandedLessonId(nextLesson.id)}
              className="btn-emerald-glow px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <span>Jump to Lesson</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Personalization Drawer */}
      {isSurveyOpen && (
        <div className="p-6 rounded-2xl bg-[#0D110F]/80 border border-[#10B981]/30 space-y-4 backdrop-blur-md">
          <h3 className="font-heading font-bold text-sm text-white">
            Personalised Learning Preferences
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="block font-semibold text-[#D1D5DB]">Weekly Study Time</label>
              <select
                value={learningPace}
                onChange={(e) => setLearningPace(e.target.value as any)}
                className="w-full p-2 text-xs rounded-lg border border-[#1E2822] bg-[#090C0A] text-white focus:border-[#10B981] outline-none font-mono"
              >
                <option value="casual">Casual (1-2 hours / week)</option>
                <option value="regular">Regular (3-5 hours / week)</option>
                <option value="intensive">Intensive (6+ hours / week)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block font-semibold text-[#D1D5DB]">Primary Focus Area</label>
              <select
                value={interestFocus}
                onChange={(e) => setInterestFocus(e.target.value)}
                className="w-full p-2 text-xs rounded-lg border border-[#1E2822] bg-[#090C0A] text-white focus:border-[#10B981] outline-none font-mono"
              >
                <option value="Frontend & Docs">Frontend, UI & Documentation</option>
                <option value="Backend & APIs">Backend, Node.js & APIs</option>
                <option value="Bug Fixes">Bug Triage & Test Suites</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button
              onClick={() => setIsSurveyOpen(false)}
              className="btn-emerald-glow px-4 py-1.5 text-xs font-semibold rounded-lg"
            >
              Apply Preferences
            </button>
          </div>
        </div>
      )}

      {/* Roadmap Levels Accordion / List */}
      <div className="space-y-8">
        {ROADMAP_DATA.map((lvl) => {
          const levelCompletedCount = lvl.lessons.filter(l => completedLessons.includes(l.id)).length;
          const isLevelFinished = levelCompletedCount === lvl.lessons.length;

          return (
            <div key={lvl.level} className="space-y-4">
              {/* Level Header */}
              <div className="flex items-center justify-between pb-2 border-b border-[#1E2822]">
                <div>
                  <h3 className="font-heading font-bold text-lg text-white flex items-center gap-2">
                    <span>{lvl.title}</span>
                    {isLevelFinished && (
                      <span className="text-[11px] font-mono font-bold text-[#10B981] bg-[#10B981]/15 border border-[#10B981]/30 px-2 py-0.5 rounded">
                        ✓ Level Completed
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-[#9CA3AF]">{lvl.subtitle}</p>
                </div>
                <div className="text-xs font-mono text-[#6B7280]">
                  {levelCompletedCount} / {lvl.lessons.length} Done
                </div>
              </div>

              {/* Lessons Grid */}
              <div className="space-y-3">
                {lvl.lessons.map((lesson) => {
                  const isDone = completedLessons.includes(lesson.id);
                  const isExpanded = expandedLessonId === lesson.id;

                  return (
                    <div
                      key={lesson.id}
                      className={`rounded-2xl border transition-all overflow-hidden ${
                        isDone
                          ? 'bg-[#121814]/40 border-[#10B981]/20'
                          : 'bg-[#0D110F]/80 border-[#1E2822] hover:border-[#10B981]/40'
                      }`}
                    >
                      <div
                        onClick={() => setExpandedLessonId(isExpanded ? null : lesson.id)}
                        className="p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-[#121814] transition-colors select-none"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggle(lesson.id);
                            }}
                            className="text-[#10B981] hover:scale-105 transition-transform shrink-0"
                            title={isDone ? 'Mark uncompleted' : 'Mark completed'}
                            aria-label={`Toggle completion for ${lesson.title}`}
                          >
                            {isDone ? (
                              <CheckCircle2 className="w-5 h-5 fill-[#10B981] text-[#080B09]" />
                            ) : (
                              <Circle className="w-5 h-5 text-[#6B7280]" />
                            )}
                          </button>

                          <div className="min-w-0">
                            <h4 className={`font-heading text-xs font-bold truncate ${isDone ? 'text-[#6B7280] line-through' : 'text-white'}`}>
                              {lesson.title}
                            </h4>
                            <p className="text-[11px] text-[#9CA3AF] truncate">
                              {lesson.explanation}
                            </p>
                          </div>
                        </div>

                        <div className="text-[#6B7280] shrink-0">
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-[#10B981]" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </div>

                      {/* Expanded Lesson Detail */}
                      {isExpanded && (
                        <div className="px-5 pb-5 pt-1 space-y-4 border-t border-[#1E2822] text-xs">
                          <div className="space-y-1">
                            <span className="font-mono font-bold text-[#10B981] uppercase tracking-wider text-[11px]">
                              Deep Explanation
                            </span>
                            <p className="text-[#D1D5DB] leading-relaxed">
                              {lesson.explanation}
                            </p>
                          </div>

                          <div className="p-3.5 rounded-xl bg-[#121814] border border-[#1E2822] space-y-1">
                            <span className="font-bold text-[#06B6D4]">💡 Concrete Real-World Example:</span>
                            <p className="text-[#9CA3AF] leading-relaxed">{lesson.example}</p>
                          </div>

                          <div className="p-3.5 rounded-xl bg-[#090C0A] border border-[#1E2822] space-y-1">
                            <span className="font-bold text-[#84CC16]">✍️ Practical Learning Exercise:</span>
                            <p className="text-[#9CA3AF] leading-relaxed">{lesson.exercise}</p>
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[11px] text-[#6B7280] font-mono">
                              Status: {isDone ? 'Completed' : 'Pending practice'}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleToggle(lesson.id)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                isDone
                                  ? 'bg-[#121814] text-[#9CA3AF] hover:text-white border border-[#1E2822]'
                                  : 'btn-emerald-glow'
                              }`}
                            >
                              {isDone ? 'Mark as Incomplete' : 'Mark Lesson Complete ✓'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
