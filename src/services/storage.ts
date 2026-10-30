import { UserPreferences, UserProgress, SavedIssue, Milestone, GitHubIssue, SavedExplanation } from '../types';

const PREFS_KEY = 'branchly_user_preferences';
const PROGRESS_KEY = 'branchly_user_progress';

const INITIAL_PREFERENCES: UserPreferences = {
  name: 'Open Source Newcomer',
  email: 'learner@branchly.dev',
  skillLevel: 'learning_git',
  languages: ['JavaScript', 'TypeScript', 'Markdown'],
  interests: ['Frontend', 'Documentation', 'Web Development'],
  preferredContributionTypes: ['docs', 'bugs'],
  isDemoUser: true,
  preferredLanguage: 'en',
};

const DEFAULT_MILESTONES: Milestone[] = [
  {
    id: 'first_explore',
    title: 'First Repository Explored',
    description: 'Inspected a public open-source project and viewed its file structure.',
    completed: true,
    completedAt: new Date().toISOString(),
    type: 'verified',
  },
  {
    id: 'first_issue_saved',
    title: 'First Issue Bookmarked',
    description: 'Discovered and saved an issue suitable for your skill level.',
    completed: false,
    type: 'verified',
  },
  {
    id: 'first_git_lesson',
    title: 'First Git Playground Lesson Completed',
    description: 'Completed an interactive Git branch visualization or command practice.',
    completed: false,
    type: 'simulated',
  },
  {
    id: 'first_practice_pr',
    title: 'First Practice Contribution Completed',
    description: 'Walked through all 8 stages in the First Contribution Simulator.',
    completed: false,
    type: 'simulated',
  },
  {
    id: 'docs_generated',
    title: 'DocSmith Creator',
    description: 'Generated structured documentation guidelines or templates.',
    completed: false,
    type: 'simulated',
  },
  {
    id: 'first_real_fork',
    title: 'First GitHub Fork Recorded',
    description: 'Forked a real open-source repository to your GitHub account.',
    completed: false,
    type: 'verified',
  },
  {
    id: 'first_real_pr',
    title: 'First Pull Request Submitted',
    description: 'Submitted your first live pull request on an open-source project.',
    completed: false,
    type: 'verified',
  },
  {
    id: 'first_merged_pr',
    title: 'First Merged Pull Request',
    description: 'Celebrated your first code or docs contribution merged into upstream.',
    completed: false,
    type: 'verified',
  },
];

const INITIAL_PROGRESS: UserProgress = {
  exploredRepos: [
    {
      fullName: 'firstcontributions/first-contributions',
      exploredAt: new Date().toISOString(),
      description: 'Hands-on tutorial project for first-time open-source contributors.'
    }
  ],
  savedIssues: [],
  completedChecklistSteps: ['step-1'],
  milestones: DEFAULT_MILESTONES,
  generatedDocsCount: 0,
  completedLessons: ['l1-1'],
  simulatedContributionsCount: 0,
  savedExplanations: [
    {
      id: 'exp-upstream',
      title: 'What does "upstream" mean in Git?',
      content: 'In Git, "upstream" refers to the original repository created by the maintainers from which you made your personal fork. Keeping your local repository connected to upstream ensures you can pull the latest changes before starting work on a new branch.',
      category: 'Git Concepts',
      savedAt: new Date().toISOString(),
    }
  ],
};

export function getUserPreferences(): UserPreferences {
  try {
    const data = localStorage.getItem(PREFS_KEY);
    return data ? { ...INITIAL_PREFERENCES, ...JSON.parse(data) } : INITIAL_PREFERENCES;
  } catch {
    return INITIAL_PREFERENCES;
  }
}

export function saveUserPreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const current = getUserPreferences();
  const updated = { ...current, ...prefs };
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(updated));
  } catch {
    // fallback
  }
  return updated;
}

export function getUserProgress(): UserProgress {
  try {
    const data = localStorage.getItem(PROGRESS_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      // Ensure milestones exist
      if (!parsed.milestones || parsed.milestones.length === 0) {
        parsed.milestones = DEFAULT_MILESTONES;
      }
      if (!parsed.completedLessons) parsed.completedLessons = ['l1-1'];
      if (!parsed.savedExplanations) parsed.savedExplanations = INITIAL_PROGRESS.savedExplanations;
      if (typeof parsed.simulatedContributionsCount !== 'number') parsed.simulatedContributionsCount = 0;
      return parsed;
    }
    return INITIAL_PROGRESS;
  } catch {
    return INITIAL_PROGRESS;
  }
}

export function saveUserProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    // fallback
  }
}

export function recordExploredRepo(fullName: string, description?: string): void {
  const progress = getUserProgress();
  const exists = progress.exploredRepos.some(r => r.fullName.toLowerCase() === fullName.toLowerCase());
  if (!exists) {
    progress.exploredRepos.unshift({
      fullName,
      exploredAt: new Date().toISOString(),
      description
    });
    if (progress.exploredRepos.length > 20) {
      progress.exploredRepos.pop();
    }
    saveUserProgress(progress);
  }
}

export function toggleSaveIssue(repoFullName: string, issue: GitHubIssue): boolean {
  const progress = getUserProgress();
  const index = progress.savedIssues.findIndex(
    s => s.repoFullName.toLowerCase() === repoFullName.toLowerCase() && s.issue.id === issue.id
  );

  let isSaved = false;
  if (index >= 0) {
    progress.savedIssues.splice(index, 1);
    isSaved = false;
  } else {
    progress.savedIssues.push({
      repoFullName,
      issue,
      savedAt: new Date().toISOString()
    });
    isSaved = true;

    const m = progress.milestones.find(m => m.id === 'first_issue_saved');
    if (m && !m.completed) {
      m.completed = true;
      m.completedAt = new Date().toISOString();
    }
  }

  saveUserProgress(progress);
  return isSaved;
}

export function toggleChecklistStep(stepId: string): boolean {
  const progress = getUserProgress();
  const index = progress.completedChecklistSteps.indexOf(stepId);
  let completed = false;

  if (index >= 0) {
    progress.completedChecklistSteps.splice(index, 1);
    completed = false;
  } else {
    progress.completedChecklistSteps.push(stepId);
    completed = true;
  }

  saveUserProgress(progress);
  return completed;
}

export function toggleLessonComplete(lessonId: string): boolean {
  const progress = getUserProgress();
  const index = progress.completedLessons.indexOf(lessonId);
  let isDone = false;

  if (index >= 0) {
    progress.completedLessons.splice(index, 1);
    isDone = false;
  } else {
    progress.completedLessons.push(lessonId);
    isDone = true;

    const m = progress.milestones.find(m => m.id === 'first_git_lesson');
    if (m && !m.completed) {
      m.completed = true;
      m.completedAt = new Date().toISOString();
    }
  }

  saveUserProgress(progress);
  return isDone;
}

export function recordSimulatedContribution(): void {
  const progress = getUserProgress();
  progress.simulatedContributionsCount = (progress.simulatedContributionsCount || 0) + 1;

  const m = progress.milestones.find(m => m.id === 'first_practice_pr');
  if (m && !m.completed) {
    m.completed = true;
    m.completedAt = new Date().toISOString();
  }

  saveUserProgress(progress);
}

export function saveExplanation(item: Omit<SavedExplanation, 'id' | 'savedAt'>): void {
  const progress = getUserProgress();
  const newEntry: SavedExplanation = {
    id: 'exp-' + Date.now(),
    title: item.title,
    content: item.content,
    category: item.category,
    summary: item.summary,
    relatedRepo: item.relatedRepo,
    savedAt: new Date().toISOString(),
  };
  progress.savedExplanations.unshift(newEntry);
  saveUserProgress(progress);
}

export function deleteSavedExplanation(id: string): void {
  const progress = getUserProgress();
  progress.savedExplanations = progress.savedExplanations.filter(e => e.id !== id);
  saveUserProgress(progress);
}

export function incrementDocsGenerated(): void {
  const progress = getUserProgress();
  progress.generatedDocsCount = (progress.generatedDocsCount || 0) + 1;
  const m = progress.milestones.find(m => m.id === 'docs_generated');
  if (m && !m.completed) {
    m.completed = true;
    m.completedAt = new Date().toISOString();
  }
  saveUserProgress(progress);
}

export function resetAllData(): void {
  localStorage.removeItem(PREFS_KEY);
  localStorage.removeItem(PROGRESS_KEY);
}
