import React, { useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  GitBranch,
  BookOpen,
  HelpCircle,
  Cpu,
  Layers,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { GitHubRepo, GitHubIssue } from '../../types';
import { generateWithAI } from '../../services/api';

interface AIGuideViewProps {
  activeRepo: GitHubRepo | null;
  selectedIssue: GitHubIssue | null;
  onOpenModelModal: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  depth?: 'simple' | 'step-by-step' | 'technical';
  timestamp: string;
}

export const AIGuideView: React.FC<AIGuideViewProps> = ({
  activeRepo,
  selectedIssue,
  onOpenModelModal,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hello! I am your BRANCHLY Open-Source Guide. I am grounded in ${activeRepo ? activeRepo.full_name : 'the open-source ecosystem'} and ready to explain GitHub workflows, git terminology, or issue descriptions at whatever depth suits you. What would you like to explore?`,
      depth: 'simple',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [explanationDepth, setExplanationDepth] = useState<'simple' | 'step-by-step' | 'technical'>('simple');
  const [isLoading, setIsLoading] = useState(false);

  const starterQuestions = [
    'What is the difference between git fetch and git pull?',
    'What does "squashing commits" mean before merging?',
    'How do I resolve a merge conflict in VS Code?',
    'What is an upstream remote and why do I need it?',
  ];

  const handleSendMessage = async (userText?: string) => {
    const textToSend = userText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const depthPrompts = {
      simple: 'Explain this in calm, intuitive, everyday language without assuming prior deep systems knowledge (ELIF5).',
      'step-by-step': 'Provide a clean, numbered sequential breakdown with exact command line examples.',
      technical: 'Provide detailed architectural context, underlying Git internals (DAG, commit refs, index staging), and best practices.',
    };

    const prompt = `Student Question: "${textToSend}"
Active Repository: ${activeRepo ? activeRepo.full_name : 'Generic Open Source'} (${activeRepo?.language || 'JavaScript'})
Selected Issue: ${selectedIssue ? `#${selectedIssue.number} ${selectedIssue.title}` : 'None'}
Requested Depth: ${explanationDepth} (${depthPrompts[explanationDepth]})

Please provide an educational, clear response in pure markdown without fluff.`;

    try {
      const res = await generateWithAI(
        prompt,
        'You are BRANCHLY AI Guide, a dedicated open-source teacher powered by Gemini AI. Always prioritize conceptual understanding, patient encouragement, and verified Git best practices.'
      );

      if (res.error) {
        throw new Error(res.error);
      }

      const assistantMsg: Message = {
        role: 'assistant',
        content: res.text || 'No response was generated. Please try asking again.',
        depth: explanationDepth,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        role: 'assistant',
        content: `⚠️ **AI Service Notice:** ${err.message || 'Unable to connect to Gemini AI backend.'}\n\nTo enable live generative responses, ensure \`GEMINI_API_KEY\` is configured in your server environment. You can also explore the 9 structured steps in the **Newcomer Path** or test Git commands in the **Git Playground**!`,
        depth: explanationDepth,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      {/* Header Banner with Model Transparency */}
      <div className="p-5 rounded-2xl bg-[#0D110F]/90 border border-[#1E2822] flex flex-wrap items-center justify-between gap-4 shrink-0 backdrop-blur-md">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 text-[10px] font-mono uppercase tracking-wider text-[#10B981]">
            <Bot className="w-3 h-3 text-[#10B981]" />
            <span>AI GUIDE · REPOSITORY LEARNING COMPANION</span>
          </div>
          <h2 className="font-heading text-xl font-bold text-white mt-1">
            Open-Source Mentor & Concept Explainer
          </h2>
          <div className="flex items-center gap-2 text-xs text-[#9CA3AF] mt-0.5 font-mono">
            <span>Context: {activeRepo ? activeRepo.full_name : 'General Open Source'}</span>
            <span aria-hidden="true" className="text-[#1E2822]">·</span>
            <span className="text-[#10B981]">Gemini 3.1 Flash Lite</span>
          </div>
        </div>

        {/* Depth Selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-[#080B09] border border-[#1E2822] rounded-xl">
            {(['simple', 'step-by-step', 'technical'] as const).map((depth) => (
              <button
                key={depth}
                onClick={() => setExplanationDepth(depth)}
                className={`px-3 py-1 text-xs font-medium rounded-lg capitalize transition-colors ${
                  explanationDepth === depth
                    ? 'bg-[#10B981] text-[#080B09] font-bold'
                    : 'text-[#9CA3AF] hover:text-white'
                }`}
              >
                {depth}
              </button>
            ))}
          </div>

          <button
            onClick={onOpenModelModal}
            className="p-2 text-[#10B981] bg-[#121814] border border-[#1E2822] hover:border-[#10B981]/40 rounded-xl transition-colors"
            title="Inspect Model Architecture & License"
            aria-label="Inspect Model Architecture"
          >
            <Cpu className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 bg-[#0D110F]/90 rounded-2xl border border-[#1E2822] p-6 overflow-y-auto space-y-6 backdrop-blur-md">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-3 max-w-3xl ${
              msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                msg.role === 'user'
                  ? 'bg-[#10B981]/20 border-[#10B981]/40 text-[#10B981]'
                  : 'bg-[#121814] border-[#1E2822] text-[#06B6D4]'
              }`}
            >
              {msg.role === 'user' ? (
                <span className="text-[10px] font-bold font-mono">YOU</span>
              ) : (
                <Bot className="w-4 h-4" />
              )}
            </div>

            <div className="space-y-1">
              <div
                className={`p-4 rounded-2xl text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#10B981] text-[#080B09] font-medium rounded-tr-xs'
                    : 'bg-[#121814] text-[#E5E7EB] border border-[#1E2822] rounded-tl-xs'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans">{msg.content}</div>
              </div>

              <div
                className={`text-[10px] text-[#6B7280] font-mono px-1 ${
                  msg.role === 'user' ? 'text-right' : 'text-left'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-[#9CA3AF] p-3 rounded-xl bg-[#121814] border border-[#1E2822] w-fit">
            <Sparkles className="w-3.5 h-3.5 text-[#10B981] animate-pulse" />
            <span>Consulting Gemini AI guide...</span>
          </div>
        )}
      </div>

      {/* Starter Prompts & Input Bar */}
      <div className="space-y-3 shrink-0">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-[#6B7280] text-[11px] font-mono shrink-0">Try asking:</span>
          {starterQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="px-3 py-1.5 rounded-xl bg-[#0D110F] border border-[#1E2822] hover:border-[#10B981]/40 text-[#9CA3AF] hover:text-white text-[11px] whitespace-nowrap shrink-0 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about git, this repository, or an issue you are trying to understand..."
            className="flex-1 px-4 py-3 text-xs rounded-xl border border-[#1E2822] bg-[#0D110F] text-white placeholder-[#6B7280] focus:outline-none focus:border-[#10B981]"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="btn-emerald-glow px-5 py-3 text-xs font-semibold rounded-xl flex items-center gap-1.5 disabled:opacity-40 shrink-0"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
