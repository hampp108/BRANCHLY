import React, { useState, useEffect } from 'react';
import {
  FileText,
  Copy,
  Download,
  Check,
  Code2,
  BookOpen,
  FolderTree,
  ShieldCheck,
  FileCode,
  Sparkles,
  ExternalLink,
  Archive,
  Eye,
  Edit3,
  Columns,
  RotateCcw,
  Trash2,
  Send,
  HelpCircle,
  GitBranch,
  Layers,
  SlidersHorizontal,
  Compass,
  AlertCircle
} from 'lucide-react';
import { GitHubRepo } from '../../types';
import { incrementDocsGenerated } from '../../services/storage';
import { generateDocWithAI, refineDocWithAI } from '../../services/api';

interface DocSmithViewProps {
  activeRepo: GitHubRepo | null;
  onOpenRepoSelector: () => void;
}

type DocType = 'README' | 'CONTRIBUTING' | 'CODE_OF_CONDUCT' | 'ISSUE_TEMPLATE' | 'PR_TEMPLATE' | 'REPO_DOCS';
type ToneType = 'Beginner-friendly' | 'Professional' | 'Technical';
type ViewMode = 'split' | 'edit' | 'preview';

export const DocSmithView: React.FC<DocSmithViewProps> = ({
  activeRepo,
  onOpenRepoSelector,
}) => {
  // 4-Step Wizard State
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedDocType, setSelectedDocType] = useState<DocType>('README');

  // Step 2 Details Form
  const [docDetails, setDocDetails] = useState({
    name: activeRepo ? activeRepo.name : 'my-open-source-project',
    description: activeRepo?.description || 'A welcoming open-source project designed for modern web development.',
    language: activeRepo?.language || 'TypeScript',
    techStack: activeRepo?.language ? `${activeRepo.language}, Node.js, Vite` : 'TypeScript, Node.js, Vite',
    installCommand: 'npm install',
    keyFeatures: 'Modular architecture, thorough documentation, newcomer-friendly issue guidelines',
  });

  // Step 3 Tone
  const [selectedTone, setSelectedTone] = useState<ToneType>('Beginner-friendly');

  // Generated Document State
  const [documentContent, setDocumentContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [refinePrompt, setRefinePrompt] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync details when active repository changes
  useEffect(() => {
    if (activeRepo) {
      setDocDetails(prev => ({
        ...prev,
        name: activeRepo.name,
        description: activeRepo.description || prev.description,
        language: activeRepo.language || prev.language,
        techStack: activeRepo.language ? `${activeRepo.language}, Node.js` : prev.techStack,
      }));
    }
  }, [activeRepo]);

  const docTypesList: { id: DocType; label: string; desc: string; icon: any; filename: string }[] = [
    {
      id: 'README',
      label: 'README.md',
      desc: 'The project storefront: overview, quickstart, features, architecture.',
      icon: BookOpen,
      filename: 'README.md'
    },
    {
      id: 'CONTRIBUTING',
      label: 'CONTRIBUTING.md',
      desc: 'Step-by-step contribution guidelines, branch conventions, PR checklist.',
      icon: FileText,
      filename: 'CONTRIBUTING.md'
    },
    {
      id: 'CODE_OF_CONDUCT',
      label: 'CODE_OF_CONDUCT.md',
      desc: 'Contributor Covenant 2.1 welcoming all backgrounds & safe community rules.',
      icon: ShieldCheck,
      filename: 'CODE_OF_CONDUCT.md'
    },
    {
      id: 'ISSUE_TEMPLATE',
      label: 'Issue Template',
      desc: 'Standardized bug report & feature request markdown structure.',
      icon: FileCode,
      filename: 'ISSUE_TEMPLATE.md'
    },
    {
      id: 'PR_TEMPLATE',
      label: 'PR Template',
      desc: 'Pull request submission checklist, testing notes, and issue links.',
      icon: GitBranch,
      filename: 'pull_request_template.md'
    },
    {
      id: 'REPO_DOCS',
      label: 'Developer Guide',
      desc: 'In-depth local setup, debugging tips, architecture directory tree.',
      icon: FolderTree,
      filename: 'DEVELOPING.md'
    },
  ];

  // Standard starter template generator for immediate local scaffolding
  const getStandardStarterTemplate = (type: DocType): string => {
    const name = docDetails.name;
    const desc = docDetails.description;
    const lang = docDetails.language;
    const install = docDetails.installCommand;

    switch (type) {
      case 'README':
        return `# ${name}

> ${desc}

## ✨ Key Features
- Clean, modular architecture built with ${lang}.
- Welcoming contribution guidelines and friendly issue tracker.
- Automated testing and continuous integration.

## 🚀 Quickstart

### Prerequisites
- Node.js (v18 or higher recommended)
- Git installed on your computer

### Installation
\`\`\`bash
# 1. Clone your fork
git clone https://github.com/YOUR_USERNAME/${name}.git
cd ${name}

# 2. Install dependencies
${install}

# 3. Start development
npm run dev
\`\`\`

## 🤝 Contributing
We welcome first-time contributors! Please review [CONTRIBUTING.md](CONTRIBUTING.md) to get started.

## 📄 License
This project is open-source under the MIT License.`;

      case 'CONTRIBUTING':
        return `# Contributing to ${name}

Thank you for taking the time to contribute! All skill levels are welcome.

## 🛠️ Step-by-Step Contribution Workflow

1. **Find an Issue**: Browse open issues tagged with \`good first issue\` or \`documentation\`.
2. **Comment**: Post a comment asking to work on the issue to avoid duplicate efforts.
3. **Fork & Clone**: Fork this repo to your GitHub account and clone it locally:
   \`\`\`bash
   git clone https://github.com/YOUR_USERNAME/${name}.git
   cd ${name}
   git remote add upstream https://github.com/${activeRepo ? activeRepo.full_name : 'owner/' + name}.git
   \`\`\`
4. **Create a Branch**:
   \`\`\`bash
   git checkout -b fix/your-issue-name
   \`\`\`
5. **Implement & Test**: Make your changes cleanly and run tests:
   \`\`\`bash
   npm test
   \`\`\`
6. **Commit & Push**:
   \`\`\`bash
   git add .
   git commit -m "docs: clarify getting-started instructions"
   git push -u origin fix/your-issue-name
   \`\`\`
7. **Open a Pull Request**: Submit your PR on GitHub referencing \`Closes #<issue-number>\`.

## 💬 Community & Kindness
Please follow our [Code of Conduct](CODE_OF_CONDUCT.md). We are here to help you succeed!`;

      case 'CODE_OF_CONDUCT':
        return `# Contributor Covenant Code of Conduct

## Our Pledge
We as members, contributors, and leaders pledge to make participation in our community a harassment-free experience for everyone, regardless of age, body size, visible or invisible disability, ethnicity, sex characteristics, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, religion, or sexual identity and orientation.

## Our Standards
Examples of behavior that contributes to a positive environment:
* Demonstrating empathy and kindness toward other people
* Being respectful of differing viewpoints and experiences
* Gracefully accepting constructive feedback
* Focusing on what is best for the community

## Enforcement
Instances of abusive, harassing, or otherwise unacceptable behavior may be reported to the project maintainers.`;

      case 'ISSUE_TEMPLATE':
        return `### 🐛 Bug Description
A clear and concise description of what the bug is.

### 📋 Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

### 🎯 Expected Behaviour
A clear and concise description of what you expected to happen.

### 🛑 Actual Behaviour
What actually occurred (include console errors or screenshots if relevant).

### 💻 Environment Context
- OS: [e.g. macOS / Windows / Linux]
- Node version: [e.g. 20.10.0]
- Browser: [e.g. Chrome / Firefox]

### ✅ Acceptance Criteria
- [ ] Fix applied without regressions.
- [ ] Automated tests pass.`;

      case 'PR_TEMPLATE':
        return `## 📝 Summary of Changes
- Briefly describe the bug fix or feature implemented.
- Linked issue: Closes #

## 🧪 Testing Checklist
- [ ] Ran automated tests locally (\`npm test\`).
- [ ] Tested manually across modern browsers.
- [ ] Clean git commit history with clear commit messages.

## 📷 Screenshots or Output (if applicable)
Add before/after comparison screenshots.`;

      case 'REPO_DOCS':
        return `# Developer Guide for ${name}

## 🏗️ Architecture Overview
This repository uses ${docDetails.techStack || 'modular TypeScript'}.

\`\`\`
├── src/           # Application source code
│   ├── components # UI view components
│   ├── services   # API clients and data management
│   └── types      # TypeScript interface definitions
├── tests/         # Unit and integration test suites
└── package.json   # Dependencies and script definitions
\`\`\`

## 🔧 Local Development & Debugging
Run the development environment locally:
\`\`\`bash
${install}
npm run dev
\`\`\`

Run linting and typechecking:
\`\`\`bash
npm run lint
\`\`\``;
    }
  };

  const handleGenerateDocument = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const generated = await generateDocWithAI(selectedDocType, docDetails, selectedTone);
      setDocumentContent(generated);
      incrementDocsGenerated();
      setCurrentStep(4);
    } catch (err: any) {
      console.warn('Doc generation error:', err);
      setError(err.message || 'AI document generation failed.');
      // Populate with high-quality standard starter template so user is never blocked
      const fallback = getStandardStarterTemplate(selectedDocType);
      setDocumentContent(fallback);
      setCurrentStep(4);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRefineDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refinePrompt.trim() || !documentContent) return;

    setIsRefining(true);
    setError(null);
    try {
      const refined = await refineDocWithAI(documentContent, refinePrompt.trim());
      setDocumentContent(refined);
      setRefinePrompt('');
    } catch (err: any) {
      console.warn('Refinement error:', err);
      setError(err.message || 'AI refinement failed. You can edit the markdown directly in the editor.');
    } finally {
      setIsRefining(false);
    }
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(documentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const activeDocInfo = docTypesList.find(d => d.id === selectedDocType);
    const filename = activeDocInfo ? activeDocInfo.filename : 'DOCUMENT.md';
    const blob = new Blob([documentContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setDocumentContent('');
  };

  // Basic lightweight Markdown renderer for live preview
  const renderMarkdownPreview = (md: string) => {
    const lines = md.split('\n');
    let inCodeBlock = false;
    let codeBuffer: string[] = [];

    const elements: React.ReactNode[] = [];

    lines.forEach((line, index) => {
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <pre key={`code-${index}`} className="p-4 my-3 bg-[#090C0A] border border-[#1E2822] rounded-xl text-xs font-mono text-[#34D399] overflow-x-auto leading-relaxed">
              <code>{codeBuffer.join('\n')}</code>
            </pre>
          );
          codeBuffer = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        return;
      }

      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={index} className="text-2xl font-heading font-extrabold text-white mt-6 mb-3 pb-2 border-b border-[#1E2822]">
            {line.replace('# ', '')}
          </h1>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={index} className="text-xl font-heading font-bold text-white mt-5 mb-2.5 pb-1 border-b border-[#1E2822]/60">
            {line.replace('## ', '')}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          <h3 key={index} className="text-base font-heading font-semibold text-[#10B981] mt-4 mb-2">
            {line.replace('### ', '')}
          </h3>
        );
      } else if (line.startsWith('> ')) {
        elements.push(
          <blockquote key={index} className="pl-4 my-2.5 border-l-2 border-[#10B981] text-xs italic text-[#9CA3AF] bg-[#121814]/40 py-1 rounded-r-lg">
            {line.replace('> ', '')}
          </blockquote>
        );
      } else if (line.startsWith('- [ ] ') || line.startsWith('- [x] ')) {
        const isChecked = line.startsWith('- [x] ');
        const text = line.replace(/- \[[ x]\] /, '');
        elements.push(
          <div key={index} className="flex items-center gap-2 text-xs text-[#D1D5DB] my-1">
            <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[10px] ${isChecked ? 'bg-[#10B981] border-[#10B981] text-[#080B09]' : 'border-[#6B7280]'}`}>
              {isChecked ? '✓' : ''}
            </span>
            <span>{text}</span>
          </div>
        );
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        elements.push(
          <li key={index} className="text-xs text-[#D1D5DB] ml-4 my-1 list-disc">
            {line.replace(/^[-*] /, '')}
          </li>
        );
      } else if (/^\d+\. /.test(line)) {
        elements.push(
          <div key={index} className="text-xs text-[#D1D5DB] ml-2 my-1 flex items-start gap-1.5">
            <span className="font-mono text-[#10B981]">{line.match(/^\d+\./)?.[0]}</span>
            <span>{line.replace(/^\d+\. /, '')}</span>
          </div>
        );
      } else if (line.trim() === '---') {
        elements.push(<hr key={index} className="my-4 border-[#1E2822]" />);
      } else if (line.trim().length > 0) {
        elements.push(
          <p key={index} className="text-xs text-[#D1D5DB] my-1.5 leading-relaxed">
            {line}
          </p>
        );
      }
    });

    return elements;
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="p-8 rounded-2xl bg-[#0D110F]/90 border border-[#1E2822] space-y-4 backdrop-blur-md relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#10B981]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#06B6D4]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#10B981]">
            <FileText className="w-4 h-4 text-[#10B981]" />
            <span>DOCSMITH · DOCUMENTATION FORGE</span>
          </div>

          {activeRepo && (
            <button
              onClick={onOpenRepoSelector}
              className="flex items-center gap-2 bg-[#121814] px-3 py-1.5 rounded-xl border border-[#1E2822] hover:border-[#10B981]/40 transition-colors text-xs text-[#D1D5DB]"
            >
              <GitBranch className="w-3.5 h-3.5 text-[#10B981]" />
              <span className="font-mono">{activeRepo.full_name}</span>
            </button>
          )}
        </div>

        <div>
          <h2 className="font-heading text-3xl font-extrabold text-white tracking-tight">
            Craft welcoming open-source documentation.
          </h2>
          <p className="text-sm text-[#9CA3AF] max-w-2xl leading-relaxed mt-1">
            High-quality documentation transforms confused lurkers into confident contributors. Forge pristine READMEs, CONTRIBUTING guides, and templates in 4 guided steps.
          </p>
        </div>

        {/* 4-Step Progress Indicator */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
          {[
            { step: 1, label: '1. Select Type' },
            { step: 2, label: '2. Project Details' },
            { step: 3, label: '3. Choose Tone' },
            { step: 4, label: '4. Preview & Refine' },
          ].map((s) => (
            <button
              key={s.step}
              onClick={() => setCurrentStep(s.step)}
              className={`p-2.5 rounded-xl text-left border text-xs font-mono transition-all ${
                currentStep === s.step
                  ? 'bg-[#10B981]/15 border-[#10B981] text-[#34D399] font-bold shadow-xs'
                  : currentStep > s.step
                  ? 'bg-[#121814] border-[#1E2822] text-white hover:border-[#10B981]/30'
                  : 'bg-[#090C0A] border-[#1E2822]/60 text-[#6B7280]'
              }`}
            >
              <div className="text-[10px] text-[#9CA3AF]">STEP {s.step}</div>
              <div className="truncate mt-0.5">{s.label.split('. ')[1]}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Global Error Banner */}
      {error && (
        <div className="p-4 text-xs bg-red-950/40 text-red-300 rounded-2xl border border-red-800/50 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1">
            <div className="font-bold">AI Generation Notice</div>
            <div>{error}</div>
            <div className="text-[11px] text-[#9CA3AF]">
              A verified standard template has been loaded so you can edit and download your documentation immediately.
            </div>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-white font-mono text-xs underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* STEP 1: Select Type */}
      {currentStep === 1 && (
        <div className="p-6 rounded-2xl bg-[#0D110F]/85 border border-[#1E2822] space-y-4 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#10B981]" />
              <span>Step 1: What would you like to build?</span>
            </h3>
            <span className="text-xs font-mono text-[#9CA3AF]">Select a document type</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {docTypesList.map((doc) => {
              const Icon = doc.icon;
              const isSelected = selectedDocType === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDocType(doc.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2 ${
                    isSelected
                      ? 'bg-[#10B981]/10 border-[#10B981] shadow-[0_0_20px_-5px_rgba(16,185,129,0.25)]'
                      : 'bg-[#121814] border-[#1E2822] hover:border-[#10B981]/40 hover:bg-[#162219]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-[#090C0A] border border-[#1E2822] flex items-center justify-center text-[#10B981]">
                      <Icon className="w-4 h-4" />
                    </div>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981]" />
                    )}
                  </div>
                  <div>
                    <div className="font-mono font-bold text-xs text-white">{doc.label}</div>
                    <div className="text-[11px] text-[#9CA3AF] leading-snug mt-1">{doc.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => setCurrentStep(2)}
              className="btn-emerald-glow px-6 py-2.5 text-xs font-semibold rounded-xl flex items-center gap-2"
            >
              <span>Continue to Project Details</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Project Details */}
      {currentStep === 2 && (
        <div className="p-6 rounded-2xl bg-[#0D110F]/85 border border-[#1E2822] space-y-4 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#10B981]" />
              <span>Step 2: Project Details & Configuration</span>
            </h3>
            <span className="text-xs font-mono text-[#9CA3AF]">Pre-filled from active repository</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-white font-mono">Project Name</label>
              <input
                type="text"
                value={docDetails.name}
                onChange={(e) => setDocDetails({ ...docDetails, name: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#1E2822] bg-[#090C0A] text-white focus:border-[#10B981] outline-none font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-white font-mono">Primary Language</label>
              <input
                type="text"
                value={docDetails.language}
                onChange={(e) => setDocDetails({ ...docDetails, language: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#1E2822] bg-[#090C0A] text-white focus:border-[#10B981] outline-none font-mono"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-bold text-white font-mono">Description & Mission</label>
              <input
                type="text"
                value={docDetails.description}
                onChange={(e) => setDocDetails({ ...docDetails, description: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#1E2822] bg-[#090C0A] text-white focus:border-[#10B981] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-white font-mono">Tech Stack / Tools</label>
              <input
                type="text"
                value={docDetails.techStack}
                onChange={(e) => setDocDetails({ ...docDetails, techStack: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#1E2822] bg-[#090C0A] text-white focus:border-[#10B981] outline-none font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-white font-mono">Installation / Setup Command</label>
              <input
                type="text"
                value={docDetails.installCommand}
                onChange={(e) => setDocDetails({ ...docDetails, installCommand: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#1E2822] bg-[#090C0A] text-white focus:border-[#10B981] outline-none font-mono"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-bold text-white font-mono">Key Highlights / Features</label>
              <textarea
                value={docDetails.keyFeatures}
                onChange={(e) => setDocDetails({ ...docDetails, keyFeatures: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#1E2822] bg-[#090C0A] text-white focus:border-[#10B981] outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 text-xs text-[#9CA3AF] hover:text-white"
            >
              ← Back
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="btn-emerald-glow px-6 py-2.5 text-xs font-semibold rounded-xl flex items-center gap-2"
            >
              <span>Next: Choose Tone</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Tone Selection */}
      {currentStep === 3 && (
        <div className="p-6 rounded-2xl bg-[#0D110F]/85 border border-[#1E2822] space-y-4 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#10B981]" />
              <span>Step 3: What tone best suits your repository?</span>
            </h3>
            <span className="text-xs font-mono text-[#9CA3AF]">Determines language and empathy level</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                id: 'Beginner-friendly',
                title: 'Beginner-Friendly (Recommended)',
                desc: 'Warm, patient, and thorough. Includes step-by-step branch instructions and welcomes first-timers.',
                badge: 'High Adoption'
              },
              {
                id: 'Professional',
                title: 'Professional SaaS / Clean',
                desc: 'Concise, clean, and polished. Focuses on clarity, semver, and maintainer efficiency.',
                badge: 'Industry Standard'
              },
              {
                id: 'Technical',
                title: 'Technical / Architecture Focused',
                desc: 'Deep dive into internals, performance benchmarks, and strict typing requirements.',
                badge: 'Deep Tech'
              },
            ].map((t) => {
              const isSelected = selectedTone === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTone(t.id as ToneType)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2 ${
                    isSelected
                      ? 'bg-[#10B981]/10 border-[#10B981] shadow-[0_0_20px_-5px_rgba(16,185,129,0.25)]'
                      : 'bg-[#121814] border-[#1E2822] hover:border-[#10B981]/40 hover:bg-[#162219]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded">
                      {t.badge}
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981]" />
                    )}
                  </div>
                  <div>
                    <div className="font-mono font-bold text-xs text-white">{t.title}</div>
                    <div className="text-[11px] text-[#9CA3AF] leading-snug mt-1">{t.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2 text-xs text-[#9CA3AF] hover:text-white"
            >
              ← Back
            </button>
            <button
              onClick={handleGenerateDocument}
              disabled={isGenerating}
              className="btn-emerald-glow px-6 py-2.5 text-xs font-semibold rounded-xl flex items-center gap-2 disabled:opacity-40"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? 'Forging with AI...' : 'Forge Document (Step 4)'}</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Document Preview, Edit, Split View & AI Refinement */}
      {currentStep === 4 && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#0D110F]/90 border border-[#1E2822] space-y-4 backdrop-blur-md shadow-2xl">
            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1E2822]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981]" />
                <span className="font-mono text-xs font-bold text-white">
                  {docTypesList.find(d => d.id === selectedDocType)?.filename || 'DOCUMENT.md'}
                </span>
                <span className="text-[11px] font-mono text-[#9CA3AF] bg-[#121814] px-2 py-0.5 rounded border border-[#1E2822]">
                  {selectedTone}
                </span>
              </div>

              {/* View Mode Tabs */}
              <div className="flex items-center gap-1 bg-[#121814] p-1 rounded-xl border border-[#1E2822]">
                <button
                  onClick={() => setViewMode('split')}
                  className={`px-3 py-1 text-xs rounded-lg flex items-center gap-1 transition-all ${
                    viewMode === 'split' ? 'bg-[#10B981] text-[#080B09] font-bold' : 'text-[#9CA3AF] hover:text-white'
                  }`}
                  title="Side-by-side Editor & Preview"
                >
                  <Columns className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Split View</span>
                </button>
                <button
                  onClick={() => setViewMode('edit')}
                  className={`px-3 py-1 text-xs rounded-lg flex items-center gap-1 transition-all ${
                    viewMode === 'edit' ? 'bg-[#10B981] text-[#080B09] font-bold' : 'text-[#9CA3AF] hover:text-white'
                  }`}
                  title="Raw Markdown Editor"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setViewMode('preview')}
                  className={`px-3 py-1 text-xs rounded-lg flex items-center gap-1 transition-all ${
                    viewMode === 'preview' ? 'bg-[#10B981] text-[#080B09] font-bold' : 'text-[#9CA3AF] hover:text-white'
                  }`}
                  title="Rich Rendered Output"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>
              </div>

              {/* Document Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyMarkdown}
                  className="px-3 py-1.5 text-xs font-medium rounded-xl bg-[#121814] text-[#D1D5DB] border border-[#1E2822] hover:border-[#10B981]/40 hover:bg-[#162219] transition-all flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Markdown'}</span>
                </button>

                <button
                  onClick={handleDownloadMarkdown}
                  className="btn-emerald-glow px-3.5 py-1.5 text-xs font-semibold rounded-xl flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .md</span>
                </button>

                <button
                  onClick={handleGenerateDocument}
                  disabled={isGenerating}
                  className="p-1.5 text-xs rounded-xl bg-[#121814] text-[#9CA3AF] hover:text-white border border-[#1E2822] hover:border-[#10B981]/40 transition-all"
                  title="Regenerate Document"
                >
                  <RotateCcw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                </button>

                <button
                  onClick={handleClear}
                  className="p-1.5 text-xs rounded-xl bg-[#121814] text-[#9CA3AF] hover:text-red-400 border border-[#1E2822] hover:border-red-500/40 transition-all"
                  title="Clear Content"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Document Panels */}
            {viewMode === 'split' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[550px]">
                {/* Left: Raw Markdown Editor */}
                <div className="h-full flex flex-col bg-[#090C0A] rounded-xl border border-[#1E2822] overflow-hidden">
                  <div className="px-3 py-1.5 bg-[#121814] border-b border-[#1E2822] text-[11px] font-mono text-[#9CA3AF] flex items-center justify-between">
                    <span>Markdown Source</span>
                    <span>{documentContent.length} chars</span>
                  </div>
                  <textarea
                    value={documentContent}
                    onChange={(e) => setDocumentContent(e.target.value)}
                    className="flex-1 w-full p-4 bg-transparent text-xs text-[#E5E7EB] font-mono outline-none resize-none leading-relaxed overflow-y-auto"
                    placeholder="# Write your documentation..."
                  />
                </div>

                {/* Right: Rich Preview */}
                <div className="h-full flex flex-col bg-[#090C0A] rounded-xl border border-[#1E2822] overflow-hidden">
                  <div className="px-3 py-1.5 bg-[#121814] border-b border-[#1E2822] text-[11px] font-mono text-[#9CA3AF]">
                    Rendered Preview
                  </div>
                  <div className="flex-1 p-4 overflow-y-auto">
                    {renderMarkdownPreview(documentContent)}
                  </div>
                </div>
              </div>
            )}

            {viewMode === 'edit' && (
              <div className="h-[550px] bg-[#090C0A] rounded-xl border border-[#1E2822] flex flex-col overflow-hidden">
                <div className="px-3 py-1.5 bg-[#121814] border-b border-[#1E2822] text-[11px] font-mono text-[#9CA3AF] flex items-center justify-between">
                  <span>Markdown Source</span>
                  <span>{documentContent.length} chars</span>
                </div>
                <textarea
                  value={documentContent}
                  onChange={(e) => setDocumentContent(e.target.value)}
                  className="flex-1 w-full p-4 bg-transparent text-xs text-[#E5E7EB] font-mono outline-none resize-none leading-relaxed overflow-y-auto"
                  placeholder="# Write your documentation..."
                />
              </div>
            )}

            {viewMode === 'preview' && (
              <div className="h-[550px] bg-[#090C0A] rounded-xl border border-[#1E2822] p-6 overflow-y-auto">
                {renderMarkdownPreview(documentContent)}
              </div>
            )}

            {/* AI Refinement Deck */}
            <form onSubmit={handleRefineDocument} className="pt-3 border-t border-[#1E2822] space-y-2">
              <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#10B981]" />
                <span>Refine with AI:</span>
                <span className="text-[11px] text-[#9CA3AF] font-normal">
                  (e.g. "Add a section on reporting security bugs", "Add Windows WSL setup steps", "Expand FAQ")
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={refinePrompt}
                  onChange={(e) => setRefinePrompt(e.target.value)}
                  placeholder="Tell DocSmith what to adjust or expand..."
                  className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-[#1E2822] bg-[#090C0A] text-white focus:border-[#10B981] outline-none font-mono"
                />
                <button
                  type="submit"
                  disabled={isRefining || !refinePrompt.trim()}
                  className="btn-emerald-glow px-5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap shrink-0 disabled:opacity-40 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isRefining ? 'Refining...' : 'Refine Draft'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
