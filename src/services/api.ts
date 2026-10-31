import { GitHubRepo, GitHubIssue, IssueAnalysis, AIModelInfo, IssueCategory, IssueDifficulty, ReviewCommentAnalysis, IssueQualityResult } from '../types';

// Curated verified beginner-friendly repositories for exploration
export const CURATED_REPOS: {
  fullName: string;
  name: string;
  owner: string;
  description: string;
  language: string;
  tags: string[];
  beginnerFriendlyScore: number;
}[] = [
  {
    fullName: 'firstcontributions/first-contributions',
    name: 'first-contributions',
    owner: 'firstcontributions',
    description: 'Help beginners contribute to open source projects. A hands-on tutorial with guided practice.',
    language: 'Markdown',
    tags: ['Beginner Tutorial', 'First PR', 'Multi-language'],
    beginnerFriendlyScore: 98,
  },
  {
    fullName: 'freeCodeCamp/freeCodeCamp',
    name: 'freeCodeCamp',
    owner: 'freeCodeCamp',
    description: "freeCodeCamp.org's open-source codebase and curriculum. Learn to develop software for free.",
    language: 'TypeScript',
    tags: ['Curriculum', 'Web Development', 'Active Maintainers'],
    beginnerFriendlyScore: 92,
  },
  {
    fullName: 'tailwindlabs/tailwindcss',
    name: 'tailwindcss',
    owner: 'tailwindlabs',
    description: 'A utility-first CSS framework for rapid UI development with clean documentation and modular codebase.',
    language: 'TypeScript',
    tags: ['CSS', 'Frontend', 'Design System'],
    beginnerFriendlyScore: 84,
  },
  {
    fullName: 'vuejs/core',
    name: 'core',
    owner: 'vuejs',
    description: 'Vue.js is a progressive, incrementally-adoptable JavaScript framework for building UI on the web.',
    language: 'TypeScript',
    tags: ['Framework', 'Reactivity', 'Docs Opportunities'],
    beginnerFriendlyScore: 81,
  },
  {
    fullName: 'electron/electron-quick-start',
    name: 'electron-quick-start',
    owner: 'electron',
    description: 'A minimal starter template for building cross-platform desktop apps with Electron.',
    language: 'JavaScript',
    tags: ['Minimal Starter', 'Desktop App', 'Clean Setup'],
    beginnerFriendlyScore: 95,
  },
];

// Helper to parse server error responses
async function parseError(res: globalThis.Response, defaultMessage: string): Promise<string> {
  try {
    const data = await res.json();
    return data.error || defaultMessage;
  } catch {
    return defaultMessage;
  }
}

// 1. Fetch Real GitHub Repository Metadata
export async function getRepoInfo(owner: string, repo: string): Promise<GitHubRepo> {
  const safeOwner = encodeURIComponent(owner.trim());
  const safeRepo = encodeURIComponent(repo.trim());

  const res = await fetch(`/api/github/repo?owner=${safeOwner}&repo=${safeRepo}`);
  if (!res.ok) {
    const errorMsg = await parseError(res, `Failed to fetch repository ${owner}/${repo} (HTTP ${res.status})`);
    throw new Error(errorMsg);
  }

  const data: GitHubRepo = await res.json();
  return data;
}

// 2. Fetch Real Repository README
export async function getRepoReadme(owner: string, repo: string): Promise<string> {
  const safeOwner = encodeURIComponent(owner.trim());
  const safeRepo = encodeURIComponent(repo.trim());

  const res = await fetch(`/api/github/readme?owner=${safeOwner}&repo=${safeRepo}`);
  if (!res.ok) {
    if (res.status === 404) {
      return ''; // No README present on repository root
    }
    const errorMsg = await parseError(res, `Failed to fetch README for ${owner}/${repo}`);
    throw new Error(errorMsg);
  }

  const data = await res.json();
  return data.decodedContent || '';
}

// 3. Fetch Real Public GitHub Issues (Never Fabricates Data)
export async function getRepoIssues(owner: string, repo: string, page = 1, perPage = 30): Promise<GitHubIssue[]> {
  const safeOwner = encodeURIComponent(owner.trim());
  const safeRepo = encodeURIComponent(repo.trim());

  const res = await fetch(`/api/github/issues?owner=${safeOwner}&repo=${safeRepo}&page=${page}&per_page=${perPage}`);
  if (!res.ok) {
    const errorMsg = await parseError(res, `Failed to fetch issues for ${owner}/${repo} (HTTP ${res.status})`);
    throw new Error(errorMsg);
  }

  const issues: GitHubIssue[] = await res.json();
  return Array.isArray(issues) ? issues : [];
}

// 4. Fetch Community Profile (Community health files)
export async function getRepoCommunityProfile(owner: string, repo: string) {
  const safeOwner = encodeURIComponent(owner.trim());
  const safeRepo = encodeURIComponent(repo.trim());

  try {
    const res = await fetch(`/api/github/community?owner=${safeOwner}&repo=${safeRepo}`);
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Non-fatal if community profile is inaccessible
  }
  return null;
}

// 5. Fetch Pull Request Comments from GitHub
export async function getPRComments(owner: string, repo: string, pullNumber: number): Promise<any[]> {
  const safeOwner = encodeURIComponent(owner.trim());
  const safeRepo = encodeURIComponent(repo.trim());

  const res = await fetch(`/api/github/pr-comments?owner=${safeOwner}&repo=${safeRepo}&pull_number=${pullNumber}`);
  if (!res.ok) {
    const errorMsg = await parseError(res, `Failed to retrieve review comments for PR #${pullNumber}`);
    throw new Error(errorMsg);
  }

  const comments = await res.json();
  return Array.isArray(comments) ? comments : [];
}

// 6. Get AI Model Specifications & Status
export async function getAIModelInfo(): Promise<AIModelInfo> {
  try {
    const res = await fetch('/api/ai/info');
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // fallback
  }

  return {
    modelName: 'Gemini 3.1 Flash Lite',
    provider: 'Google AI Studio / Google DeepMind',
    license: 'Google AI Studio API Terms',
    inferenceEndpoint: '/api/ai/generate',
    fallbackModel: 'gemini-3-flash-preview',
    configured: false,
    features: [
      'Issue Breakdown & Simplification',
      'Repository Documentation Drafting',
      'Newcomer Setup Checklist Customization',
      'Mentor Mode Progressive Hinting',
      'Technical Jargon Translation (English, Hindi, Hinglish)',
      'PR Review Feedback Translation',
      'Issue Quality Audit & Rewriting'
    ]
  };
}

// 7. General AI Inference Endpoint Call
export async function generateWithAI(
  prompt: string,
  systemInstruction?: string
): Promise<{ text: string; error?: string; isConfigured?: boolean }> {
  try {
    const res = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, systemInstruction })
    });

    const data = await res.json();
    if (res.ok && data.text) {
      return { text: data.text, isConfigured: true };
    }

    return {
      text: '',
      error: data.error || `AI generation failed (HTTP ${res.status})`,
      isConfigured: data.configured !== false,
    };
  } catch (err: any) {
    return {
      text: '',
      error: err.message || 'Network error connecting to AI inference endpoint.',
      isConfigured: true,
    };
  }
}

// 8. Deterministic Heuristic Analysis (Fast, honest rule-based engine)
export function analyzeIssueHeuristically(issue: GitHubIssue, repoLanguage?: string | null): IssueAnalysis {
  const titleLower = issue.title.toLowerCase();
  const bodyLower = (issue.body || '').toLowerCase();
  const labelNames = (issue.labels || []).map(l => l.name.toLowerCase());

  // Category determination
  let category: IssueCategory = 'Improvement';
  if (labelNames.some(l => l.includes('doc') || l.includes('readme') || l.includes('guide')) || titleLower.startsWith('doc') || titleLower.includes('readme')) {
    category = 'Documentation';
  } else if (labelNames.some(l => l.includes('bug') || l.includes('fix') || l.includes('error')) || titleLower.startsWith('fix:') || titleLower.includes('bug')) {
    category = 'Bug';
  } else if (labelNames.some(l => l.includes('feature') || l.includes('feat') || l.includes('enhancement')) || titleLower.startsWith('feat:')) {
    category = 'Feature';
  } else if (labelNames.some(l => l.includes('test') || l.includes('spec') || l.includes('coverage')) || titleLower.includes('test')) {
    category = 'Testing';
  } else if (labelNames.some(l => l.includes('translat') || l.includes('i18n') || l.includes('l10n')) || titleLower.includes('translat')) {
    category = 'Translation';
  } else if (labelNames.some(l => l.includes('question') || l.includes('help')) || titleLower.startsWith('question:') || titleLower.includes('how to')) {
    category = 'Question';
  }

  // Beginner friendliness evaluation
  const hasGoodFirstLabel = labelNames.some(l =>
    l.includes('good first') || l.includes('beginner') || l.includes('starter') || l.includes('easy') || l.includes('first-timers')
  );
  const isDoc = category === 'Documentation' || category === 'Translation';
  const hasIsolatedScope = titleLower.includes('typo') || titleLower.includes('spelling') || titleLower.includes('broken link') || titleLower.includes('type annotation');

  const isBeginnerFriendly = hasGoodFirstLabel || (isDoc && (issue.comments || 0) < 5) || hasIsolatedScope;

  let beginnerReason = '';
  if (hasGoodFirstLabel) {
    beginnerReason = 'The repository maintainers explicitly tagged this with an official beginner-friendly label.';
  } else if (hasIsolatedScope) {
    beginnerReason = 'The scope is tightly focused on a specific isolated fix, making it low risk for your first pull request.';
  } else if (isDoc) {
    beginnerReason = 'Documentation contributions let you practice the full Git workflow (fork, branch, PR) without deep architectural knowledge.';
  } else {
    beginnerReason = 'Requires familiarity with module internals or local testing setup before proceeding.';
  }

  // Difficulty estimation (clearly identified as heuristic / AI estimate)
  let difficulty: IssueDifficulty = 'Intermediate';
  if (hasGoodFirstLabel || hasIsolatedScope || category === 'Translation') {
    difficulty = 'Beginner';
  } else if (titleLower.includes('refactor') || titleLower.includes('architecture') || titleLower.includes('concurrency') || titleLower.includes('memory')) {
    difficulty = 'Advanced';
  }

  const estimatedEffort = difficulty === 'Beginner' ? '30–60 minutes' : difficulty === 'Intermediate' ? '2–4 hours' : '1–2 days';

  // Key terms
  const terms: { term: string; definition: string }[] = [];
  if (titleLower.includes('pr') || bodyLower.includes('pull request')) {
    terms.push({ term: 'Pull Request (PR)', definition: 'A proposed set of code changes submitted from your fork to the original project.' });
  }
  if (titleLower.includes('typo') || titleLower.includes('doc')) {
    terms.push({ term: 'Markdown (.md)', definition: 'A lightweight text formatting syntax used for GitHub documentation.' });
  }
  if (repoLanguage) {
    terms.push({ term: repoLanguage, definition: `The primary programming language (${repoLanguage}) in which this repository is authored.` });
  }
  terms.push({ term: 'Upstream', definition: 'The original repository you forked from, kept in sync via git remote.' });

  const requiredSkills = [
    'Basic Git (fork, clone, branch, commit)',
    category === 'Documentation' ? 'Clear technical writing' : `${repoLanguage || 'Code'} comprehension`,
    'Reading CONTRIBUTING.md guidelines'
  ];

  const firstSteps = [
    'Read the issue description carefully and check if someone is already assigned in comments.',
    'Comment politely on GitHub: "Hi! I would like to work on this issue if it is still available."',
    'Fork and clone the repository locally using the Newcomer Path checklist.',
    `Create an isolated feature branch: git checkout -b fix-issue-${issue.number}`
  ];

  const suggestedMaintainerQuestions = [
    'Should this change be accompanied by an update to the tests or documentation?',
    'Is there a specific branch naming or commit convention you prefer?'
  ];

  const simplifiedSummary = `This issue focuses on "${issue.title}". It addresses an open task under the ${category} category in the repository.`;
  const whyItMatters = category === 'Documentation'
    ? 'Clear documentation saves time for thousands of developers and lowers the barrier to entry.'
    : 'Fixing this ensures the project remains stable, predictable, and easier to maintain.';

  return {
    category,
    difficulty,
    isBeginnerFriendly,
    beginnerReason,
    estimatedEffort,
    keyTerms: terms,
    requiredSkills,
    firstSteps,
    suggestedMaintainerQuestions,
    simplifiedSummary,
    whyItMatters,
  };
}

// 9. Heuristic Review Comment Analysis (Baseline fallback for PR Review)
export function analyzeReviewCommentHeuristically(comment: string, reviewerName = 'maintainer'): ReviewCommentAnalysis {
  const lower = comment.toLowerCase();

  let explanation = 'The reviewer is asking you to make an adjustment to your code or documentation to align with project standards.';
  let whatNeedsToChange = 'Update your branch commits with the requested fix.';
  let whyItMatters = 'Maintains consistent code quality, avoids regressions, and ensures tests stay reliable.';
  let nextSteps = [
    'Open the referenced file in your local workspace.',
    'Make the suggested adjustment.',
    'Run tests locally to verify nothing broke.',
    'Commit your changes with a clear message and push to your branch.'
  ];
  let draftedReply = `Hi @${reviewerName}, thanks for the clear feedback! I have updated the branch with the requested change and verified tests pass locally. Please let me know if any further tweaks are needed.`;
  let stepByStepSolution = '1. Open the file in your code editor.\n2. Apply the requested adjustment.\n3. Run tests locally.\n4. Commit and push to your branch.';
  let codeExample = `// Before:\n// original code\n\n// After:\n// updated code addressing feedback`;
  let technicalTerms = [
    { term: 'Nit / Nitpick', definition: 'A non-blocking suggestion for minor styling, formatting, or spelling correction.' },
    { term: 'Pull Request', definition: 'A proposal to merge your branch changes into the upstream repository.' }
  ];

  if (lower.includes('nit') || lower.includes('typo') || lower.includes('spelling') || lower.includes('formatting')) {
    explanation = 'This is a "nitpick" (minor polish). The reviewer generally likes your contribution, but noticed a minor styling, naming, or spelling detail.';
    whatNeedsToChange = 'Fix the specific typo, indentation, or wording without changing application logic.';
    whyItMatters = 'Clean documentation and consistent formatting make the repository easier to read for everyone.';
    nextSteps = [
      'Correct the spelling or whitespace on the referenced line.',
      'Commit as: git commit -m "docs: address review comment on spelling"',
      'Push to your fork to automatically refresh the pull request.'
    ];
    stepByStepSolution = '1. Open the file in your code editor.\n2. Search for the misspelled word.\n3. Replace with the correct spelling.\n4. Save, commit, and push.';
    codeExample = `- brew install giit\n+ brew install git`;
    draftedReply = `Thanks for catching this @${reviewerName}! Fixed the typo in my latest commit.`;
  } else if (lower.includes('test') || lower.includes('spec') || lower.includes('coverage')) {
    explanation = 'The reviewer wants automated tests that prove your change works as expected and will not break in future releases.';
    whatNeedsToChange = 'Add or update a unit test covering the new code path.';
    whyItMatters = 'Open-source projects rely on automated CI testing to prevent regressions across hundreds of contributors.';
    nextSteps = [
      'Locate the corresponding test file in tests/ or __tests__/.',
      'Add a test case describing the expected behavior.',
      'Run npm test locally to verify green passing state.'
    ];
    stepByStepSolution = '1. Check where existing tests are defined (e.g. tests/*.spec.ts).\n2. Add a new test block covering your edge cases.\n3. Run your test runner (e.g. npm test) to ensure it passes.';
    codeExample = `describe('edge case handling', () => {\n  it('should handle empty input without throwing', () => {\n    expect(formatUserList([])).toEqual('');\n  });\n});`;
    technicalTerms = [
      { term: 'Unit Test', definition: 'Code that verifies a single function or module behaves correctly in isolation.' },
      { term: 'Regression', definition: 'A bug that makes a previously working feature fail after changes.' }
    ];
    draftedReply = `Hi @${reviewerName}, added a new unit test covering this edge case. All tests are now green!`;
  } else if (lower.includes('squash') || lower.includes('rebase') || lower.includes('conflict')) {
    explanation = 'The reviewer is asking for your git commit history to be organized or rebased against the latest upstream branch.';
    whatNeedsToChange = 'Rebase your feature branch on upstream main, or squash multiple small commits into one clean commit.';
    whyItMatters = 'Keeps the Git history of the main repository readable, atomic, and easy to revert if a bug is found later.';
    nextSteps = [
      'Fetch latest upstream: git fetch upstream',
      'Rebase interactively: git rebase -i upstream/main',
      'Push to your branch: git push --force-with-lease origin <branch-name>'
    ];
    stepByStepSolution = '1. Run git fetch upstream to get latest main branch changes.\n2. Run git rebase upstream/main.\n3. If prompted to squash, use git rebase -i HEAD~N and mark secondary commits as "squash".\n4. Push with git push --force-with-lease origin <your-branch>.';
    codeExample = `git fetch upstream\ngit rebase -i upstream/main\n# Keep top commit as "pick", change others to "squash"\ngit push --force-with-lease origin my-feature-branch`;
    technicalTerms = [
      { term: 'Rebase', definition: 'Applying your branch commits on top of another base tip.' },
      { term: 'Squash', definition: 'Combining multiple small commits into a single cohesive commit.' }
    ];
    draftedReply = `Hi @${reviewerName}, rebased and squashed commits into a single atomic commit.`;
  }

  return {
    id: 'rev-' + Math.random().toString(36).slice(2, 9),
    reviewer: reviewerName,
    originalComment: comment,
    explanation,
    whatNeedsToChange,
    whyItMatters,
    nextSteps,
    stepByStepSolution,
    codeExample,
    technicalTerms,
    draftedReply,
    language: 'English',
  };
}

// 10. Multilingual AI PR Review Translation (English, Hindi, Hinglish)
export async function translatePRReviewWithAI(
  comment: string,
  reviewerName = 'maintainer',
  language: 'English' | 'Hindi' | 'Hinglish' = 'English'
): Promise<ReviewCommentAnalysis> {
  const fallback = analyzeReviewCommentHeuristically(comment, reviewerName);

  let langInstruction = 'Provide all explanations, why requested, next steps, step-by-step solution, and technical terms in beginner-friendly, crystal-clear English.';
  if (language === 'Hindi') {
    langInstruction =
      'Provide all explanations, why requested, next actions, step-by-step solution, and technical term definitions in natural, educational Hindi (हिन्दी). ' +
      'CRITICAL: Strictly keep all code blocks, git commands (e.g. git rebase, git push), filenames, and URLs in standard English syntax.';
  } else if (language === 'Hinglish') {
    langInstruction =
      'Provide all explanations, why requested, next actions, step-by-step solution, and technical term definitions in conversational Hinglish (Hindi written in English Latin script). ' +
      'CRITICAL: Strictly keep all code blocks, git commands (e.g. git rebase, git push), filenames, and URLs in standard English syntax.';
  }

  const prompt = `You are BRANCHLY's PR Review Translator.
Analyze this code reviewer's feedback for a beginner open-source contributor.

Reviewer Username: @${reviewerName}
Reviewer Comment:
"""
${comment}
"""

Language requirement: ${langInstruction}

You MUST return a strictly valid JSON object with these exact keys:
{
  "explanation": "Clear explanation of what the reviewer means",
  "whatNeedsToChange": "Precise summary of what needs to be changed in the branch",
  "whyItMatters": "Why the reviewer or project is asking for this change",
  "nextSteps": [
    "First actionable checklist item",
    "Second actionable checklist item",
    "Third actionable checklist item"
  ],
  "stepByStepSolution": "Detailed step-by-step instructions on how the contributor can make this change in their local workspace",
  "codeExample": "Concrete code diff or command example showing before/after or the exact syntax to use",
  "draftedReply": "A polite, friendly, professional reply for the contributor to post back to @${reviewerName} on GitHub",
  "technicalTerms": [
    { "term": "Term Name", "definition": "Brief beginner-friendly definition" }
  ]
}

Return ONLY the raw JSON object. Do not wrap in markdown fences if possible.`;

  const res = await generateWithAI(prompt, 'You are BRANCHLY PR Review Translator. Return strictly valid JSON with educational clarity.');

  if (res.error) {
    throw new Error(res.error);
  }

  if (res.text) {
    try {
      let cleaned = res.text.trim();
      if (cleaned.startsWith('```json')) {
        cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      const parsed = JSON.parse(cleaned);
      return {
        id: 'rev-' + Math.random().toString(36).slice(2, 9),
        reviewer: reviewerName,
        originalComment: comment,
        explanation: parsed.explanation || fallback.explanation,
        whatNeedsToChange: parsed.whatNeedsToChange || parsed.explanation || fallback.whatNeedsToChange,
        whyItMatters: parsed.whyItMatters || fallback.whyItMatters,
        nextSteps: Array.isArray(parsed.nextSteps) && parsed.nextSteps.length > 0 ? parsed.nextSteps : fallback.nextSteps,
        stepByStepSolution: parsed.stepByStepSolution || fallback.stepByStepSolution,
        codeExample: parsed.codeExample || fallback.codeExample,
        draftedReply: parsed.draftedReply || fallback.draftedReply,
        technicalTerms: Array.isArray(parsed.technicalTerms) && parsed.technicalTerms.length > 0 ? parsed.technicalTerms : fallback.technicalTerms,
        language
      };
    } catch (parseErr) {
      console.warn('AI PR review translation parse error:', parseErr);
    }
  }

  return { ...fallback, language };
}

// 11. Generate Documentation with AI (DocSmith)
export async function generateDocWithAI(
  docType: 'README' | 'CONTRIBUTING' | 'CODE_OF_CONDUCT' | 'ISSUE_TEMPLATE' | 'PR_TEMPLATE' | 'REPO_DOCS',
  details: {
    name: string;
    description: string;
    language: string;
    techStack?: string;
    installCommand?: string;
    keyFeatures?: string;
  },
  tone: 'Beginner-friendly' | 'Professional' | 'Technical' = 'Beginner-friendly'
): Promise<string> {
  const prompt = `Generate a complete, production-ready, beautifully structured Markdown document for an open-source project.

Document Type: ${docType}
Project Name: ${details.name}
Description: ${details.description}
Primary Language: ${details.language}
Tech Stack: ${details.techStack || details.language}
Installation Command: ${details.installCommand || 'npm install'}
Key Features: ${details.keyFeatures || 'Modular architecture, clear setup guidelines'}
Writing Tone: ${tone}

Requirements:
- Use clean Markdown with headers (#, ##, ###), bullet lists, code blocks, and informative callouts.
- Include all necessary sections for this specific document type.
- For CONTRIBUTING, include explicit Git workflow steps (fork, branch, test, PR).
- For README, include Overview, Features, Prerequisites, Quickstart, Usage, Contributing, and License.
- For ISSUE_TEMPLATE or PR_TEMPLATE, provide standard GitHub markdown template fields.
- Make the document welcoming, unambiguous, and immediate to copy/use.
Return ONLY the formatted Markdown content.`;

  const res = await generateWithAI(prompt, 'You are BRANCHLY DocSmith, an expert open-source documentation forge architect.');

  if (res.error) {
    throw new Error(res.error);
  }

  if (!res.text || !res.text.trim()) {
    throw new Error('Received an empty document from the AI generator.');
  }

  return res.text;
}

// 12. Refine Documentation with AI (DocSmith)
export async function refineDocWithAI(
  currentDoc: string,
  instruction: string
): Promise<string> {
  const prompt = `Refine and improve the following Markdown document based on this user instruction:
"${instruction}"

Current Document:
"""
${currentDoc}
"""

Return ONLY the updated Markdown document.`;

  const res = await generateWithAI(prompt, 'You are BRANCHLY DocSmith. Apply the requested documentation refinements cleanly.');

  if (res.error) {
    throw new Error(res.error);
  }

  return res.text || currentDoc;
}

// 13. Audit Issue Quality Heuristically
export function analyzeIssueQualityHeuristically(issueText: string): IssueQualityResult {
  const lower = issueText.toLowerCase();

  const criteria = [
    {
      id: 'title_or_summary',
      label: 'Clear Problem Statement',
      description: 'Issue clearly articulates what is broken or what feature is desired.',
      passed: issueText.length > 40 && (lower.includes('problem') || lower.includes('bug') || lower.includes('issue') || lower.includes('error') || lower.includes('current') || lower.includes('when')),
      feedback: 'Provide a concise 1-2 sentence description of the issue upfront.'
    },
    {
      id: 'expected_behaviour',
      label: 'Expected Behaviour',
      description: 'Explains what SHOULD happen when the software operates correctly.',
      passed: lower.includes('expected') || lower.includes('should') || lower.includes('desired'),
      feedback: 'State clearly what the user or caller should experience when working properly.'
    },
    {
      id: 'actual_behaviour',
      label: 'Actual Behaviour / Screenshots',
      description: 'Documents what actually happens currently (e.g. error trace, crash, wrong UI).',
      passed: lower.includes('actual') || lower.includes('currently') || lower.includes('instead') || lower.includes('error') || lower.includes('crash') || lower.includes('broken'),
      feedback: 'Include the actual output or unexpected behavior observed.'
    },
    {
      id: 'reproduction_steps',
      label: 'Reproduction Steps',
      description: 'Numbered steps allowing another developer or contributor to trigger the bug locally.',
      passed: lower.includes('step') || lower.includes('1.') || lower.includes('reproduce') || lower.includes('run'),
      feedback: 'Add step-by-step reproduction instructions (1. Go to ..., 2. Click ..., 3. Observe ...).'
    },
    {
      id: 'environment_info',
      label: 'Environment / Technical Context',
      description: 'Specifies OS, Node version, browser, or relevant package versions.',
      passed: lower.includes('version') || lower.includes('node') || lower.includes('os') || lower.includes('browser') || lower.includes('windows') || lower.includes('mac') || lower.includes('linux') || lower.includes('environment'),
      feedback: 'Mention environment details (Node version, OS, browser) to help reproduce.'
    },
    {
      id: 'acceptance_criteria',
      label: 'Acceptance Criteria for Newcomers',
      description: 'Describes what must be verified before the PR can be accepted.',
      passed: lower.includes('acceptance') || lower.includes('checklist') || lower.includes('outcome') || lower.includes('done when') || lower.includes('criteria'),
      feedback: 'Add a definition of done / acceptance criteria so contributors know when they are finished.'
    }
  ];

  const passedCount = criteria.filter(c => c.passed).length;
  const score = Math.round((passedCount / criteria.length) * 100);

  let grade: 'Needs Attention' | 'Good' | 'Excellent' = 'Needs Attention';
  if (score >= 80) grade = 'Excellent';
  else if (score >= 50) grade = 'Good';

  const missingElements = criteria.filter(c => !c.passed).map(c => c.label);

  const improvedDraft = `### 🐛 Problem Description
${issueText.slice(0, 300)}

### 📋 Steps to Reproduce
1. Clone the repository and install dependencies with \`npm install\`.
2. Run the application or test command.
3. Observe the reported issue.

### 🎯 Expected Behaviour
The system should handle the input gracefully without errors or broken layouts.

### 🛑 Actual Behaviour
Currently, an unexpected error or incorrect formatting occurs.

### 💻 Environment Context
- OS: macOS / Linux / Windows
- Node.js version: v20+
- Browser / Runtime: Latest

### ✅ Acceptance Criteria for Contributors
- [ ] Fix implemented with clean code style.
- [ ] Unit tests added or updated to prevent regressions.
- [ ] Existing test suite passes with zero errors.`;

  return {
    score,
    grade,
    criteria,
    missingElements,
    improvedDraft,
  };
}
