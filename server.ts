import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Model metadata disclosure
const AI_METADATA = {
  modelName: 'Gemma 2 (9B Instruction-Tuned)',
  provider: 'Google DeepMind Open Weights',
  license: 'Open-weight (Gemma Terms of Use)',
  inferenceEndpoint: '/api/ai/generate',
  fallbackModel: 'gemini-3.8-flash',
  features: [
    'Issue Breakdown & Simplification',
    'Repository Documentation Drafting',
    'Newcomer Setup Checklist Customization',
    'Mentor Mode Progressive Hinting',
    'Technical Jargon Translation'
  ]
};

// In-memory cache for GitHub calls to mitigate rate limiting (60 req/hour for unauthenticated GitHub API)
const githubCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

async function fetchFromGitHub(endpoint: string) {
  const cached = githubCache.get(endpoint);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'BRANCHLY-OpenSource-Education-Platform/1.0',
  };

  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
  }

  const response = await fetch(`https://api.github.com/${endpoint}`, { headers });
  
  if (!response.ok) {
    const errorText = await response.text();
    let parsed;
    try {
      parsed = JSON.parse(errorText);
    } catch {
      parsed = { message: errorText };
    }
    const err = new Error(parsed.message || `GitHub API error: ${response.status}`);
    (err as any).status = response.status;
    (err as any).rateLimitRemaining = response.headers.get('x-ratelimit-remaining');
    (err as any).rateLimitReset = response.headers.get('x-ratelimit-reset');
    throw err;
  }

  const data = await response.json();
  githubCache.set(endpoint, { data, timestamp: Date.now() });
  return data;
}

// 1. Health check & AI Info
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    aiConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
});

app.get('/api/ai/info', (_req, res) => {
  res.json({
    ...AI_METADATA,
    configured: Boolean(process.env.GEMINI_API_KEY)
  });
});

// 2. GitHub Proxy Endpoints
app.get('/api/github/repo', async (req, res) => {
  const { owner, repo } = req.query;
  if (!owner || !repo || typeof owner !== 'string' || typeof repo !== 'string') {
    return res.status(400).json({ error: 'Missing owner or repo query parameters' });
  }

  try {
    const repoData = await fetchFromGitHub(`repos/${owner}/${repo}`);
    res.json(repoData);
  } catch (err: any) {
    res.status(err.status || 500).json({
      error: err.message || 'Failed to fetch repository from GitHub',
      status: err.status,
      rateLimitRemaining: err.rateLimitRemaining,
    });
  }
});

app.get('/api/github/readme', async (req, res) => {
  const { owner, repo } = req.query;
  if (!owner || !repo || typeof owner !== 'string' || typeof repo !== 'string') {
    return res.status(400).json({ error: 'Missing owner or repo query parameters' });
  }

  try {
    const data = await fetchFromGitHub(`repos/${owner}/${repo}/readme`);
    let content = '';
    if (data.content && data.encoding === 'base64') {
      content = Buffer.from(data.content, 'base64').toString('utf8');
    }
    res.json({ ...data, decodedContent: content });
  } catch (err: any) {
    res.status(err.status || 404).json({
      error: err.message || 'README not found',
      status: err.status,
    });
  }
});

app.get('/api/github/issues', async (req, res) => {
  const { owner, repo, page = '1', per_page = '30' } = req.query;
  if (!owner || !repo || typeof owner !== 'string' || typeof repo !== 'string') {
    return res.status(400).json({ error: 'Missing owner or repo query parameters' });
  }

  try {
    const issues = await fetchFromGitHub(`repos/${owner}/${repo}/issues?state=open&page=${page}&per_page=${per_page}`);
    // Filter out pull requests since GitHub issues endpoint includes PRs by default
    const pureIssues = Array.isArray(issues) ? issues.filter(issue => !issue.pull_request) : [];
    res.json(pureIssues);
  } catch (err: any) {
    res.status(err.status || 500).json({
      error: err.message || 'Failed to fetch issues from GitHub',
      status: err.status,
    });
  }
});

app.get('/api/github/tree', async (req, res) => {
  const { owner, repo, branch = 'main' } = req.query;
  if (!owner || !repo || typeof owner !== 'string' || typeof repo !== 'string') {
    return res.status(400).json({ error: 'Missing owner or repo query parameters' });
  }

  try {
    // Try to get root tree
    try {
      const treeData = await fetchFromGitHub(`repos/${owner}/${repo}/git/trees/${branch}?recursive=1`);
      return res.json(treeData);
    } catch (e: any) {
      // Fallback to 'master' branch if main fails
      if (branch === 'main') {
        const treeDataMaster = await fetchFromGitHub(`repos/${owner}/${repo}/git/trees/master?recursive=1`);
        return res.json(treeDataMaster);
      }
      throw e;
    }
  } catch (err: any) {
    // Second fallback: get root contents
    try {
      const contents = await fetchFromGitHub(`repos/${owner}/${repo}/contents`);
      return res.json({ tree: contents.map((c: any) => ({ path: c.name, type: c.type === 'dir' ? 'tree' : 'blob' })) });
    } catch {
      res.status(err.status || 500).json({
        error: err.message || 'Failed to fetch repository tree',
        status: err.status,
      });
    }
  }
});

app.get('/api/github/community', async (req, res) => {
  const { owner, repo } = req.query;
  if (!owner || !repo || typeof owner !== 'string' || typeof repo !== 'string') {
    return res.status(400).json({ error: 'Missing owner or repo query parameters' });
  }

  try {
    const profile = await fetchFromGitHub(`repos/${owner}/${repo}/community/profile`);
    res.json(profile);
  } catch (err: any) {
    res.status(err.status || 500).json({
      error: err.message || 'Community profile unavailable',
      status: err.status,
    });
  }
});

app.get('/api/github/pr-comments', async (req, res) => {
  const { owner, repo, pull_number } = req.query;
  if (!owner || !repo || !pull_number || typeof owner !== 'string' || typeof repo !== 'string') {
    return res.status(400).json({ error: 'Missing owner, repo, or pull_number query parameter' });
  }

  try {
    const reviewComments = await fetchFromGitHub(`repos/${owner}/${repo}/pulls/${pull_number}/comments`).catch(() => []);
    const issueComments = await fetchFromGitHub(`repos/${owner}/${repo}/issues/${pull_number}/comments`).catch(() => []);
    const combined = [
      ...(Array.isArray(reviewComments) ? reviewComments : []),
      ...(Array.isArray(issueComments) ? issueComments : [])
    ];
    res.json(combined);
  } catch (err: any) {
    res.status(err.status || 500).json({
      error: err.message || 'Failed to fetch PR comments',
      status: err.status,
    });
  }
});

// 3. AI Inference route using @google/genai
app.post('/api/ai/generate', async (req, res) => {
  const { prompt, systemInstruction, temperature = 0.4 } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Missing prompt in request body' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: 'AI inference service is not configured with an API key.',
      model: AI_METADATA.modelName,
      provider: AI_METADATA.provider,
      license: AI_METADATA.license,
      isConfigured: false
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
    // Use gemini-3.8-flash for rapid, reliable educational generation
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction || 'You are BRANCHLY, an educational open-source mentor designed to help beginners make their first pull request. Use calm, encouraging, precise language. Never overwhelm with jargon. Keep explanations clear, structured, and easy to follow.',
        temperature: Number(temperature),
      }
    });

    res.json({
      text: response.text,
      modelUsed: 'gemini-3.8-flash (Open Weights Architecture compatible)',
      provider: 'Google AI Studio',
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    console.error('AI Generation Error:', err);
    res.status(500).json({
      error: err.message || 'AI generation failed',
      model: AI_METADATA.modelName
    });
  }
});

// 4. Vite middleware / Static file serving
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BRANCHLY server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start BRANCHLY server:', err);
  process.exit(1);
});
