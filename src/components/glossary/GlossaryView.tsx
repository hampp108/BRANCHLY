import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Bookmark,
  Check,
  Terminal,
  Layers,
  ArrowRight
} from 'lucide-react';
import { GlossaryTerm } from '../../types';
import { saveExplanation } from '../../services/storage';

export const GlossaryView: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [savedTerms, setSavedTerms] = useState<{ [term: string]: boolean }>({});

  const GLOSSARY_DATA: GlossaryTerm[] = [
    {
      term: 'Repository (Repo)',
      category: 'Git Core',
      definition: 'The master folder containing a project’s source files, documentation, assets, and the entire historical log of every change in the hidden `.git` ledger.',
      example: '`git init` or `git clone` creates a local repository on your computer.',
      relatedCommand: 'git clone <url>',
    },
    {
      term: 'Commit',
      category: 'Git Core',
      definition: 'An immutable snapshot of your staged files at a specific point in time, accompanied by a cryptographic SHA-1 hash and an explanatory message.',
      example: '`git commit -m "docs: clarify getting-started steps"` records a checkpoint.',
      relatedCommand: 'git commit -m "<message>"',
    },
    {
      term: 'Branch',
      category: 'Git Core',
      definition: 'An isolated pointer to a specific sequence of commits. Branches allow developers to build features or test bugfixes without altering the production `main` branch.',
      example: '`git checkout -b fix-nav` creates a new branch named `fix-nav`.',
      relatedCommand: 'git switch -c <branch>',
    },
    {
      term: 'Fork',
      category: 'GitHub Workflow',
      definition: 'A personal copy of an open-source project hosted on your own GitHub account. It gives you write permissions to push branches without modifying the maintainer’s original project.',
      example: 'Clicking "Fork" at top-right of `facebook/react` on github.com.',
    },
    {
      term: 'Clone',
      category: 'Git Core',
      definition: 'Downloading a full copy of a Git repository from a remote cloud host (like GitHub) to your local hard drive.',
      example: '`git clone https://github.com/YOUR_USER/repo.git` downloads the repository.',
      relatedCommand: 'git clone <url>',
    },
    {
      term: 'Upstream Remote',
      category: 'GitHub Workflow',
      definition: 'The alias for the original source repository you forked from. Connecting upstream lets you fetch recent commits that maintainers have merged since your fork.',
      example: '`git remote add upstream https://github.com/original-owner/repo.git`',
      relatedCommand: 'git remote add upstream <url>',
    },
    {
      term: 'Origin Remote',
      category: 'Git Core',
      definition: 'The default remote alias Git assigns to the repository you originally cloned (usually your personal GitHub fork).',
      example: '`git push origin feature-branch` sends your commits to your GitHub fork.',
      relatedCommand: 'git remote -v',
    },
    {
      term: 'Pull Request (PR)',
      category: 'GitHub Workflow',
      definition: 'A formal proposal to merge commits from a branch on your personal fork into the upstream project’s branch. Maintainers review the diff and discuss changes before accepting.',
      example: 'Clicking "Compare & pull request" on GitHub.',
    },
    {
      term: 'Merge Conflict',
      category: 'Git Core',
      definition: 'Occurs when two branches modify the exact same lines of code differently. Git cannot guess which change is correct, so it marks the file with `<<<<<<<` and `>>>>>>>` for human resolution.',
      example: 'Both you and another contributor edited line 10 of README.md differently.',
      relatedCommand: 'git merge <branch>',
    },
    {
      term: 'Rebase',
      category: 'Advanced',
      definition: 'Re-applying commits from your branch on top of another base tip. It creates a linear history rather than adding merge commits.',
      example: '`git rebase upstream/main` moves your feature branch commits onto the latest upstream commits.',
      relatedCommand: 'git rebase <base-branch>',
    },
    {
      term: 'Staging Area (Index)',
      category: 'Git Core',
      definition: 'The intermediate holding zone where you prepare changes before committing them. Running `git add` stages files into the index.',
      example: '`git add index.html` stages the file for the next commit.',
      relatedCommand: 'git add <file>',
    },
    {
      term: 'Good First Issue',
      category: 'Community',
      definition: 'A standard label applied by maintainers to signal an issue has limited scope, minimal risk, and clear reproduction steps, making it ideal for first-time contributors.',
      example: 'Fixing a documentation typo or adding a missing type annotation.',
    },
    {
      term: 'Code of Conduct',
      category: 'Community',
      definition: 'A document (often `CODE_OF_CONDUCT.md`) that outlines community standards of respectful behavior, harassment guidelines, and reporting channels.',
      example: 'Contributor Covenant v2.1 adopted by thousands of open-source projects.',
    },
    {
      term: 'SPDX License Identifier',
      category: 'Community',
      definition: 'A standardized short identifier (like `MIT`, `Apache-2.0`, `GPL-3.0`) indicating the legal redistribution and usage terms of the codebase.',
      example: '`MIT` indicates permissive usage with copyright notice preservation.',
    },
    {
      term: 'CI/CD (Continuous Integration)',
      category: 'Advanced',
      definition: 'Automated test pipelines (such as GitHub Actions) that run tests, linting, and build validation every time a pull request is submitted.',
      example: 'A green checkmark next to your PR indicates CI tests passed successfully.',
    },
  ];

  const categories = ['All', 'Git Core', 'GitHub Workflow', 'Community', 'Advanced'];

  const filteredTerms = GLOSSARY_DATA.filter((item) => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        item.term.toLowerCase().includes(q) ||
        item.definition.toLowerCase().includes(q) ||
        item.example.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSaveToMySpace = (term: GlossaryTerm) => {
    saveExplanation({
      title: term.term,
      content: term.definition + (term.example ? `\n\nExample: ${term.example}` : ''),
      category: term.category,
      summary: term.definition,
      relatedRepo: 'Glossary Reference'
    });
    setSavedTerms(prev => ({ ...prev, [term.term]: true }));
    setTimeout(() => {
      setSavedTerms(prev => ({ ...prev, [term.term]: false }));
    }, 2000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="p-8 rounded-2xl bg-[#0D110F]/85 border border-[#1E2822] space-y-4 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#10B981]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#10B981]">
          <BookOpen className="w-4 h-4 text-[#10B981]" />
          <span>BRANCHLY DICTIONARY & JARGON BUSTER</span>
        </div>
        <h2 className="font-heading text-3xl font-extrabold text-white">
          The Open Source Glossary.
        </h2>
        <p className="text-sm text-[#9CA3AF] max-w-2xl leading-relaxed">
          Clear, concise definitions of technical terms you will encounter across repositories, documentation, issue trackers, and pull requests.
        </p>

        {/* Search & Category Filter Controls */}
        <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-t border-[#1E2822]">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search terms, concepts, commands..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#1E2822] bg-[#090C0A] text-white focus:border-[#10B981] outline-none font-mono"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  selectedCategory === cat
                    ? 'btn-emerald-glow font-semibold'
                    : 'bg-[#121814] text-[#D1D5DB] border border-[#1E2822] hover:bg-[#17221A]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Terms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTerms.map((item) => {
          const isSaved = savedTerms[item.term];
          return (
            <div
              key={item.term}
              className="p-6 rounded-2xl bg-[#0D110F]/80 border border-[#1E2822] hover:border-[#10B981]/40 transition-all flex flex-col justify-between space-y-4 group backdrop-blur-md"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-medium text-[#10B981]">
                    {item.category}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSaveToMySpace(item)}
                    className="p-1 hover:bg-[#121814] rounded text-[#6B7280] hover:text-[#10B981] transition-colors"
                    title="Bookmark to My Space"
                  >
                    {isSaved ? (
                      <Check className="w-4 h-4 text-[#10B981]" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <h3 className="font-heading font-bold text-base text-white group-hover:text-[#34D399] transition-colors">
                  {item.term}
                </h3>

                <p className="text-xs text-[#9CA3AF] leading-relaxed">
                  {item.definition}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#1E2822]">
                <div className="text-[11px] font-mono text-[#D1D5DB] bg-[#090C0A] p-2 rounded-lg border border-[#1E2822]">
                  <span className="text-[#6B7280]">Example: </span>
                  {item.example}
                </div>

                {item.relatedCommand && (
                  <div className="text-[11px] font-mono text-[#34D399] flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-[#10B981]" />
                    <code>{item.relatedCommand}</code>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredTerms.length === 0 && (
        <div className="p-12 text-center text-xs text-[#6B7280] bg-[#0D110F]/80 border border-dashed border-[#1E2822] rounded-2xl">
          No glossary terms match "{search}". Try searching for terms like "commit", "fork", or "upstream".
        </div>
      )}
    </div>
  );
};
