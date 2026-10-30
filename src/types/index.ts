export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  license: {
    key: string;
    name: string;
    spdx_id: string;
  } | null;
  default_branch: string;
  topics?: string[];
  updated_at: string;
  created_at: string;
}

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body: string | null;
  html_url: string;
  state: string;
  created_at: string;
  updated_at: string;
  user: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
  labels: {
    id: number;
    name: string;
    color: string;
    description?: string;
  }[];
  comments: number;
  assignee?: {
    login: string;
    avatar_url: string;
  } | null;
}

export type IssueCategory =
  | 'Bug'
  | 'Feature'
  | 'Documentation'
  | 'Translation'
  | 'Testing'
  | 'Question'
  | 'Improvement';

export type IssueDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface IssueAnalysis {
  category: IssueCategory;
  difficulty: IssueDifficulty;
  isBeginnerFriendly: boolean;
  beginnerReason: string;
  estimatedEffort: string;
  keyTerms: { term: string; definition: string }[];
  requiredSkills: string[];
  firstSteps: string[];
  suggestedMaintainerQuestions: string[];
  simplifiedSummary: string;
  whyItMatters: string;
}

export interface UserPreferences {
  name: string;
  email: string;
  skillLevel: 'absolute_beginner' | 'learning_git' | 'some_experience';
  languages: string[];
  interests: string[];
  preferredContributionTypes: ('docs' | 'bugs' | 'features' | 'tests' | 'translations')[];
  isDemoUser: boolean;
  preferredLanguage?: 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'mr';
}

export interface SavedIssue {
  repoFullName: string;
  issue: GitHubIssue;
  savedAt: string;
  notes?: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  completedAt?: string;
  type?: 'simulated' | 'verified';
}

export interface SavedExplanation {
  id: string;
  title: string;
  content: string;
  savedAt: string;
  category: string;
  summary?: string;
  relatedRepo?: string;
}

export interface UserProgress {
  exploredRepos: { fullName: string; exploredAt: string; description?: string }[];
  savedIssues: SavedIssue[];
  completedChecklistSteps: string[];
  milestones: Milestone[];
  generatedDocsCount: number;
  completedLessons: string[];
  simulatedContributionsCount: number;
  savedExplanations: SavedExplanation[];
}

export interface RepoHealthMetrics {
  hasReadme: boolean;
  hasLicense: boolean;
  licenseName?: string;
  hasContributing: boolean;
  hasCodeOfConduct: boolean;
  hasIssueTemplates: boolean;
  hasGoodFirstIssues: boolean;
  goodFirstIssuesCount: number;
  overallScore: 'Needs attention' | 'Good' | 'Excellent';
  scorePercentage: number;
  actionableSuggestions: {
    id: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    actionLabel: string;
    actionType: 'docsmith' | 'issues' | 'view';
  }[];
}

export interface AIModelInfo {
  modelName: string;
  provider: string;
  license: string;
  inferenceEndpoint: string;
  fallbackModel: string;
  configured: boolean;
  features: string[];
}

// Git Playground Types
export interface GitCommitNode {
  id: string;
  hash: string;
  message: string;
  branch: string;
  parentId?: string;
  timestamp: string;
}

export interface GitBranchState {
  name: string;
  color: string;
  isCurrent: boolean;
}

// PR Review Translator Types
export interface ReviewCommentAnalysis {
  id: string;
  reviewer: string;
  reviewerAvatar?: string;
  originalComment: string;
  explanation: string;
  whatNeedsToChange: string;
  whyItMatters: string;
  nextSteps: string[];
  stepByStepSolution?: string;
  codeExample?: string;
  draftedReply: string;
  technicalTerms?: { term: string; definition: string }[];
  language?: string;
}

// Roadmap Types
export interface RoadmapLesson {
  id: string;
  title: string;
  explanation: string;
  example: string;
  exercise: string;
}

export interface RoadmapLevel {
  id?: string;
  level: number;
  title: string;
  subtitle: string;
  lessons: RoadmapLesson[];
}

// Issue Quality Checker Types
export interface IssueQualityCriterion {
  id: string;
  label: string;
  description: string;
  passed: boolean;
  feedback: string;
}

export interface IssueQualityResult {
  score: number;
  grade: 'Needs Attention' | 'Good' | 'Excellent';
  criteria: IssueQualityCriterion[];
  missingElements: string[];
  improvedDraft: string;
}

// Glossary Types
export interface GlossaryTerm {
  term: string;
  category: 'Git Core' | 'GitHub Workflow' | 'Community' | 'Advanced';
  definition: string;
  example: string;
  relatedCommand?: string;
}

// Timeline Activity Types
export interface TimelineActivity {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'SIMULATED' | 'VERIFIED';
  iconType: 'repo' | 'issue' | 'git' | 'pr' | 'merge' | 'doc';
}
