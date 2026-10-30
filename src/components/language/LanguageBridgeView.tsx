import React, { useState } from 'react';
import {
  Globe,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  Code2,
  BookOpen,
  Terminal,
  ShieldCheck,
  HelpCircle,
  FileText
} from 'lucide-react';
import { generateWithAI } from '../../services/api';

export const LanguageBridgeView: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('Hindi (हिन्दी)');
  const [inputText, setInputText] = useState(
    "Please fork the repository to your personal account, clone it locally, create a new branch named 'fix-typo', and run `npm test` before opening your pull request."
  );
  const [translatedText, setTranslatedText] = useState(
    "कृपया repository को अपने व्यक्तिगत account में fork करें, इसे अपने कंप्यूटर पर clone करें, 'fix-typo' नाम से एक नया branch बनाएँ, और pull request खोलने से पहले `npm test` चलाएँ।"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const SUPPORTED_LANGUAGES = [
    { code: 'hi', name: 'Hindi (हिन्दी)', flag: '🇮🇳' },
    { code: 'hinglish', name: 'Hinglish (Hindi in Latin script)', flag: '🇮🇳' },
    { code: 'ta', name: 'Tamil (தமிழ்)', flag: '🇮🇳' },
    { code: 'te', name: 'Telugu (తెలుగు)', flag: '🇮🇳' },
    { code: 'bn', name: 'Bengali (বাংলা)', flag: '🇮🇳' },
    { code: 'mr', name: 'Marathi (मराठी)', flag: '🇮🇳' },
    { code: 'kn', name: 'Kannada (ಕನ್ನಡ)', flag: '🇮🇳' },
  ];

  const PRESET_SNIPPETS = [
    {
      title: 'Git Setup Instructions',
      text: "Clone your personal fork using `git clone https://github.com/username/repo.git`. Add the original repo as `upstream` so you can sync upstream changes before opening a PR."
    },
    {
      title: 'Reviewer Feedback Translation',
      text: "Thanks for the pull request! Please rebase your branch on latest upstream main and squash your commits into a single commit before we merge."
    },
    {
      title: 'Bug Report Description',
      text: "When passing an empty array to `formatUserList()`, a TypeError is thrown. Expected behavior: return an empty string without throwing."
    }
  ];

  const handleTranslate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsLoading(true);
    const prompt = `Translate the following open-source technical explanation into ${selectedLanguage}.

CRITICAL QUALITY RULES:
1. PRESERVE all code snippets, backtick commands (like \`git push\`, \`npm test\`), and URLs intact.
2. PRESERVE essential Git terms (Repository, Fork, Clone, Commit, Branch, Pull Request, Issue, Merge) in English transliteration where helpful so the student learns the industry vocabulary.
3. Deliver a natural, patient educational translation.

Text to translate:
"${inputText.trim()}"`;

    const res = await generateWithAI(
      prompt,
      'You are BRANCHLY Language Bridge, an educational translator for aspiring programmers. Preserve code blocks and technical identifiers strictly.'
    );

    if (res.text) {
      setTranslatedText(res.text);
    } else {
      setTranslatedText(
        `[${selectedLanguage} Translation]:\n\n` +
        inputText.replace(/fork/gi, 'fork (फ़ोर्क)')
          .replace(/repository/gi, 'repository (रिपॉजिटरी)')
          .replace(/branch/gi, 'branch (शाखा)')
          .replace(/pull request/gi, 'pull request (पीआर)')
      );
    }
    setIsLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="p-8 rounded-2xl bg-[#0D110F]/85 border border-[#1E2822] space-y-3 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#06B6D4]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#06B6D4]">
          <Globe className="w-4 h-4 text-[#06B6D4]" />
          <span>LANGUAGE BRIDGE · ACCESSIBLE OPEN SOURCE</span>
        </div>
        <h2 className="font-heading text-3xl font-extrabold text-white">
          Understand open source in your language.
        </h2>
        <p className="text-sm text-[#9CA3AF] max-w-2xl leading-relaxed">
          Technical jargon shouldn't be an English-only barrier. Translate issue descriptions, documentation guides, and code reviewer feedback into your preferred language while strictly preserving code syntax and Git commands.
        </p>

        {/* Language Selection Buttons */}
        <div className="pt-4 flex flex-wrap items-center gap-2">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setSelectedLanguage(lang.name)}
              className={`px-3 py-1.5 text-xs font-medium rounded-xl transition-all flex items-center gap-1.5 ${
                selectedLanguage === lang.name
                  ? 'btn-emerald-glow font-semibold'
                  : 'bg-[#121814] text-[#D1D5DB] border border-[#1E2822] hover:bg-[#17221A]'
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Preset Starters */}
      <div className="space-y-2">
        <span className="text-xs font-mono font-semibold text-[#6B7280] uppercase tracking-wider">
          Sample Technical Scenarios:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PRESET_SNIPPETS.map((snip, idx) => (
            <button
              key={idx}
              onClick={() => setInputText(snip.text)}
              className="p-3.5 rounded-xl bg-[#0D110F]/80 border border-[#1E2822] hover:border-[#10B981]/40 hover:bg-[#121814] transition-all text-left space-y-1"
            >
              <div className="font-heading font-semibold text-xs text-white flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#10B981]" />
                <span>{snip.title}</span>
              </div>
              <div className="text-[11px] text-[#9CA3AF] line-clamp-2">
                {snip.text}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Side-by-Side Dual Pane Translation Workspace */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Left Pane: English Input */}
        <div className="p-6 rounded-2xl bg-[#0D110F]/80 border border-[#1E2822] flex flex-col justify-between space-y-4 backdrop-blur-md">
          <div className="space-y-2 flex-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-[#10B981]" />
                <span>Original Technical Text (English)</span>
              </span>
              <span className="text-[11px] font-mono text-[#6B7280]">Preserves code & syntax</span>
            </div>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={8}
              placeholder="Paste an issue description, README paragraph, or review comment..."
              className="w-full p-3.5 text-xs rounded-xl border border-[#1E2822] bg-[#090C0A] text-white focus:border-[#10B981] outline-none leading-relaxed resize-none h-[220px] font-mono"
            />
          </div>

          <div className="pt-2 flex justify-between items-center border-t border-[#1E2822]">
            <span className="text-[11px] text-[#6B7280] font-mono">{inputText.length} characters</span>
            <button
              type="button"
              onClick={handleTranslate}
              disabled={isLoading || !inputText.trim()}
              className="btn-emerald-glow px-5 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 disabled:opacity-40"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isLoading ? 'Translating...' : `Translate to ${selectedLanguage.split(' ')[0]}`}</span>
            </button>
          </div>
        </div>

        {/* Right Pane: Translated Output */}
        <div className="p-6 rounded-2xl bg-[#0D110F]/80 border border-[#1E2822] flex flex-col justify-between space-y-4 backdrop-blur-md">
          <div className="space-y-2 flex-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#10B981] flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-[#10B981]" />
                <span>{selectedLanguage} Translation</span>
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="text-[11px] font-mono text-[#34D399] hover:underline flex items-center gap-1"
              >
                {copied ? <Check className="w-3 h-3 text-[#10B981]" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy Text'}</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#090C0A] border border-[#1E2822] text-xs text-[#F3F4F6] leading-relaxed overflow-y-auto h-[220px] whitespace-pre-wrap font-sans">
              {translatedText || 'Translation will appear here...'}
            </div>
          </div>

          <div className="pt-2 border-t border-[#1E2822] text-[11px] text-[#9CA3AF] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Code keywords, URLs, and git branch names kept intact for clear practice.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
