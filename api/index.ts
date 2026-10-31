import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
app.use(express.json({ limit: '10mb' }));

// Verified AI Metadata Disclosure
const AI_METADATA = {
  modelName: 'Gemini 3.1 Flash Lite',
  provider: 'Google AI Studio / Google DeepMind',
  license: 'Google AI Studio API Terms of Service',
  inferenceEndpoint: '/api/ai/generate',
  fallbackModel: 'gemini-3-flash-preview',
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

// In-memory cache for GitHub calls to mitigate unauthenticated 60 req/hour rate limits
interface CacheEntry {
  data: any;
  timestamp: number;
}
const githubCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// Clean up old cache entries periodically to avoid memory growth in long sessions
function pruneCache() {
  const now = Date.now();
  for (const [key, value] of githubCache.entries()) {
    if (now - value.timestamp > CACHE_TTL_MS * 2) {
      githubCache.delete(key);
    }
  }
}
setInterval(pruneCache, 10 * 60 * 1000).unref?.();

async function fetchFromGitHub(endpoint: string) {
  const cached = githubCache.get(endpoint);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'BRANCHLY-OpenSource-Education-Platform/1.0',
  };

  if (process.env.GITHUB_TOKEN && process.env.GITHUB_TOKEN.trim()) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN.trim()}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000); // 12-second timeout

  try {
    const response = await fetch(`https://api.github.com/${endpoint}`, {
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const rateRemaining = response.headers.get('x-ratelimit-remaining');
    const rateReset = response.headers.get('x-ratelimit-reset');

    if (!response.ok) {
      const errorText = await response.text();
      let parsedMessage = errorText;
      try {
        const parsed = JSON.parse(errorText);
        parsedMessage = parsed.message || errorText;
      } catch {
        // use raw error text
      }

      if (response.status === 403 || response.status === 429) {
        if (rateRemaining === '0') {
          const resetDate = rateReset ? new Date(parseInt(rateReset, 10) * 1000).toLocaleTimeString() : 'soon';
          const err: any = new Error(
            `GitHub API hourly rate limit reached (60 req/hr for unauthenticated requests). Resets at ${resetDate}. You can configure GITHUB_TOKEN in environment to raise the limit to 5,000 req/hr.`
          );
          err.status = 429;
          err.rateLimitRemaining = 0;
          throw err;
        }
      }

      if (response.status === 404) {
        const err: any = new Error(
          `Resource not found on GitHub (${endpoint}). Check the repository name and verify it is public.`
        );
        err.status = 404;
        throw err;
      }

      const err: any = new Error(parsedMessage || `GitHub API error (HTTP ${response.status})`);
      err.status = response.status;
      err.rateLimitRemaining = rateRemaining;
      err.rateLimitReset = rateReset;
      throw err;
    }

    const data = await response.json();
    githubCache.set(endpoint, { data, timestamp: Date.now() });
    return data;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      const timeoutErr: any = new Error('GitHub API request timed out after 12 seconds. Please check your network and retry.');
      timeoutErr.status = 504;
      throw timeoutErr;
    }
    throw err;
  }
}

// 1. Health check & AI Info
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    aiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim()),
    githubTokenConfigured: Boolean(process.env.GITHUB_TOKEN && process.env.GITHUB_TOKEN.trim()),
  });
});

app.get('/api/ai/info', (_req: Request, res: Response) => {
  res.json({
    ...AI_METADATA,
    configured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim()),
  });
});

// 2. GitHub Proxy Endpoints
app.get('/api/github/repo', async (req: Request, res: Response) => {
  const { owner, repo } = req.query;
  if (!owner || !repo || typeof owner !== 'string' || typeof repo !== 'string') {
    return res.status(400).json({ error: 'Missing owner or repo query parameters.' });
  }

  // Sanitize path components
  const safeOwner = encodeURIComponent(owner.trim());
  const safeRepo = encodeURIComponent(repo.trim());

  try {
    const repoData = await fetchFromGitHub(`repos/${safeOwner}/${safeRepo}`);
    res.json(repoData);
  } catch (err: any) {
    res.status(err.status || 500).json({
      error: err.message || 'Failed to fetch repository from GitHub',
      status: err.status || 500,
      rateLimitRemaining: err.rateLimitRemaining,
      rateLimitReset: err.rateLimitReset,
    });
  }
});

app.get('/api/github/readme', async (req: Request, res: Response) => {
  const { owner, repo } = req.query;
  if (!owner || !repo || typeof owner !== 'string' || typeof repo !== 'string') {
    return res.status(400).json({ error: 'Missing owner or repo query parameters.' });
  }

  const safeOwner = encodeURIComponent(owner.trim());
  const safeRepo = encodeURIComponent(repo.trim());

  try {
    const data = await fetchFromGitHub(`repos/${safeOwner}/${safeRepo}/readme`);
    let content = '';
    if (data.content && data.encoding === 'base64') {
      content = Buffer.from(data.content, 'base64').toString('utf8');
    }
    res.json({ ...data, decodedContent: content });
  } catch (err: any) {
    res.status(err.status || 404).json({
      error: err.message || 'README not found',
      status: err.status || 404,
    });
  }
});

app.get('/api/github/issues', async (req: Request, res: Response) => {
  const { owner, repo, page = '1', per_page = '30', labels } = req.query;
  if (!owner || !repo || typeof owner !== 'string' || typeof repo !== 'string') {
    return res.status(400).json({ error: 'Missing owner or repo query parameters.' });
  }

  const safeOwner = encodeURIComponent(owner.trim());
  const safeRepo = encodeURIComponent(repo.trim());
  let endpoint = `repos/${safeOwner}/${safeRepo}/issues?state=open&page=${encodeURIComponent(String(page))}&per_page=${encodeURIComponent(String(per_page))}`;
  if (labels && typeof labels === 'string') {
    endpoint += `&labels=${encodeURIComponent(labels.trim())}`;
  }

  try {
    const issues = await fetchFromGitHub(endpoint);
    // Filter out pull requests since GitHub issues endpoint includes PRs by default
    const pureIssues = Array.isArray(issues) ? issues.filter(issue => !issue.pull_request) : [];
    res.json(pureIssues);
  } catch (err: any) {
    res.status(err.status || 500).json({
      error: err.message || 'Failed to fetch issues from GitHub',
      status: err.status || 500,
    });
  }
});

app.get('/api/github/tree', async (req: Request, res: Response) => {
  const { owner, repo, branch = 'main' } = req.query;
  if (!owner || !repo || typeof owner !== 'string' || typeof repo !== 'string') {
    return res.status(400).json({ error: 'Missing owner or repo query parameters.' });
  }

  const safeOwner = encodeURIComponent(owner.trim());
  const safeRepo = encodeURIComponent(repo.trim());
  const safeBranch = encodeURIComponent(String(branch).trim());

  try {
    try {
      const treeData = await fetchFromGitHub(`repos/${safeOwner}/${safeRepo}/git/trees/${safeBranch}?recursive=1`);
      return res.json(treeData);
    } catch (e: any) {
      if (branch === 'main') {
        const treeDataMaster = await fetchFromGitHub(`repos/${safeOwner}/${safeRepo}/git/trees/master?recursive=1`);
        return res.json(treeDataMaster);
      }
      throw e;
    }
  } catch (err: any) {
    try {
      const contents = await fetchFromGitHub(`repos/${safeOwner}/${safeRepo}/contents`);
      return res.json({ tree: contents.map((c: any) => ({ path: c.name, type: c.type === 'dir' ? 'tree' : 'blob' })) });
    } catch {
      res.status(err.status || 500).json({
        error: err.message || 'Failed to fetch repository tree structure.',
        status: err.status || 500,
      });
    }
  }
});

app.get('/api/github/community', async (req: Request, res: Response) => {
  const { owner, repo } = req.query;
  if (!owner || !repo || typeof owner !== 'string' || typeof repo !== 'string') {
    return res.status(400).json({ error: 'Missing owner or repo query parameters.' });
  }

  const safeOwner = encodeURIComponent(owner.trim());
  const safeRepo = encodeURIComponent(repo.trim());

  try {
    const profile = await fetchFromGitHub(`repos/${safeOwner}/${safeRepo}/community/profile`);
    res.json(profile);
  } catch (err: any) {
    res.status(err.status || 500).json({
      error: err.message || 'Community profile unavailable',
      status: err.status || 500,
    });
  }
});

app.get('/api/github/pr-comments', async (req: Request, res: Response) => {
  const { owner, repo, pull_number } = req.query;
  if (!owner || !repo || !pull_number || typeof owner !== 'string' || typeof repo !== 'string') {
    return res.status(400).json({ error: 'Missing owner, repo, or pull_number query parameter.' });
  }

  const safeOwner = encodeURIComponent(owner.trim());
  const safeRepo = encodeURIComponent(repo.trim());
  const num = parseInt(String(pull_number), 10);
  if (isNaN(num) || num <= 0) {
    return res.status(400).json({ error: 'Invalid pull_number provided.' });
  }

  try {
    const [reviewComments, issueComments] = await Promise.all([
      fetchFromGitHub(`repos/${safeOwner}/${safeRepo}/pulls/${num}/comments`).catch(() => []),
      fetchFromGitHub(`repos/${safeOwner}/${safeRepo}/issues/${num}/comments`).catch(() => [])
    ]);

    const combined = [
      ...(Array.isArray(reviewComments) ? reviewComments : []),
      ...(Array.isArray(issueComments) ? issueComments : [])
    ];

    // Sort chronologically
    combined.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

    res.json(combined);
  } catch (err: any) {
    res.status(err.status || 500).json({
      error: err.message || 'Failed to fetch pull request comments from GitHub',
      status: err.status || 500,
    });
  }
});

// 3. AI Inference route using @google/genai SDK
app.post('/api/ai/generate', async (req: Request, res: Response) => {
  const { prompt, systemInstruction } = req.body;

  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    return res.status(400).json({ error: 'Missing non-empty prompt in request body.' });
  }

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return res.status(503).json({
      error: 'Google Gemini API key is not configured. Please configure GEMINI_API_KEY in your environment to enable AI generation and mentoring.',
      configured: false,
      model: AI_METADATA.modelName,
      provider: AI_METADATA.provider,
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const defaultSystemInstruction =
      'You are BRANCHLY, an educational open-source mentor helping beginners make their first pull request. ' +
      'Communicate with patient clarity, calmness, and rigorous technical accuracy. ' +
      'Always preserve code syntax, terminal commands (like git checkout, npm test), filenames, and URLs exactly. ' +
      'When responding in Hindi or Hinglish, keep code blocks and git syntax in standard English Latin characters.';

    let response;
    let modelUsed = 'gemini-3.1-flash-lite';

    try {
      response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: prompt.trim(),
        config: {
          systemInstruction: systemInstruction || defaultSystemInstruction,
        }
      });
    } catch (primaryErr: any) {
      console.warn('Primary model gemini-3.1-flash-lite failed, attempting fallback to gemini-3-flash-preview:', primaryErr?.message);
      modelUsed = 'gemini-3-flash-preview';
      response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt.trim(),
        config: {
          systemInstruction: systemInstruction || defaultSystemInstruction,
        }
      });
    }

    const textOutput = response?.text || '';
    if (!textOutput.trim()) {
      return res.status(502).json({
        error: 'The AI model returned an empty response. Please retry with a more detailed prompt.',
        model: modelUsed,
      });
    }

    res.json({
      text: textOutput,
      modelUsed,
      provider: AI_METADATA.provider,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    console.error('AI Generation Error:', err?.message || err);
    res.status(500).json({
      error: err.message || 'AI generation failed. Please check network connectivity and quota.',
      model: AI_METADATA.modelName,
    });
  }
});

// Centralized error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled server error:', err?.message || err);
  res.status(err.status || 500).json({
    error: err.message || 'An unexpected internal server error occurred.',
  });
});

export default app;
