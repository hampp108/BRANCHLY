import React from 'react';
import {
  LayoutDashboard,
  Compass,
  FileText,
  Stethoscope,
  Footprints,
  Activity,
  Trophy,
  Bot,
  Settings,
  GitBranch,
  ChevronRight,
  ExternalLink,
  Cpu,
  Terminal,
  Map,
  BookOpen,
  Sparkles,
  MessageSquareQuote,
  FileCheck2,
  Globe,
  Bookmark,
  ChevronDown
} from 'lucide-react';
import { GitHubRepo } from '../../types';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  activeRepo: GitHubRepo | null;
  onOpenRepoSelector: () => void;
  onOpenModelModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  activeRepo,
  onOpenRepoSelector,
  onOpenModelModal,
}) => {
  // 4 Strict Navigation Groups
  const navSections = [
    {
      group: 'EXPLORE',
      items: [
        { id: 'explore', label: 'Explore Repositories', icon: Compass },
        { id: 'issuemedic', label: 'IssueMedic', icon: Stethoscope },
      ],
    },
    {
      group: 'LEARN',
      items: [
        { id: 'newcomer', label: 'Newcomer Path', icon: Footprints },
        { id: 'playground', label: 'Git Playground', icon: Terminal },
        { id: 'simulator', label: 'Contribution Simulator', icon: Sparkles },
        { id: 'roadmap', label: 'Learning Roadmap', icon: Map },
      ],
    },
    {
      group: 'CREATE',
      items: [
        { id: 'docsmith', label: 'DocSmith (Docs Forge)', icon: FileText },
        { id: 'translator', label: 'PR Review Translator', icon: MessageSquareQuote },
        { id: 'quality', label: 'Issue Quality Checker', icon: FileCheck2 },
        { id: 'repohealth', label: 'RepoHealth Audit', icon: Activity },
      ],
    },
    {
      group: 'MY SPACE',
      items: [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'progress', label: 'My Progress', icon: Trophy },
        { id: 'saved', label: 'Saved Items', icon: Bookmark },
        { id: 'glossary', label: 'BRANCHLY Glossary', icon: BookOpen },
        { id: 'language', label: 'Language Bridge', icon: Globe },
        { id: 'settings', label: 'Settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside className="w-64 shrink-0 bg-[#0D110F]/95 backdrop-blur-md border-r border-[#1E2822] flex flex-col h-[calc(100vh-4rem)] sticky top-16 select-none z-20 shadow-2xl">
      {/* Active Repo Switcher Box */}
      <div className="p-3.5 border-b border-[#1E2822]">
        <div className="text-[10px] font-mono uppercase tracking-wider text-[#9CA3AF] mb-1.5 flex items-center justify-between">
          <span>Active Repository</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shadow-[0_0_6px_#10B981]" />
        </div>
        <button
          onClick={onOpenRepoSelector}
          className="w-full text-left p-2.5 rounded-xl border border-[#1E2822] bg-[#121814]/70 hover:border-[#10B981]/50 hover:bg-[#162019] transition-all group flex items-center justify-between shadow-xs"
          title="Click to switch or load another repository"
        >
          <div className="min-w-0 pr-2">
            <div className="font-heading font-semibold text-xs text-white truncate flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
              <span className="truncate">{activeRepo ? activeRepo.name : 'Select a Repo'}</span>
            </div>
            <div className="text-[11px] text-[#9CA3AF] truncate font-mono mt-0.5">
              {activeRepo ? activeRepo.owner.login : 'e.g. first-contributions'}
            </div>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-[#6B7280] group-hover:text-[#10B981] group-hover:translate-x-0.5 transition-all shrink-0" />
        </button>
      </div>

      {/* Main Grouped Navigation List */}
      <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
        {navSections.map((sec) => (
          <div key={sec.group} className="space-y-1">
            <div className="px-3 text-[10px] font-mono uppercase tracking-wider text-[#6B7280] font-bold">
              {sec.group}
            </div>

            {sec.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left relative ${
                    isActive
                      ? 'bg-[#10B981]/15 text-[#34D399] font-semibold border border-[#10B981]/30 shadow-[0_0_15px_-4px_rgba(16,185,129,0.25)]'
                      : 'text-[#9CA3AF] hover:bg-[#121814] hover:text-white'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#10B981]' : 'text-[#6B7280]'}`} />
                  <span className="truncate">{item.label}</span>
                  {isActive && (
                    <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981]" />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Persistent AI Guide Trigger Button */}
      <div className="p-3 border-t border-[#1E2822] space-y-2 bg-[#090C0A]/60">
        <button
          onClick={() => onSelectTab('guide')}
          className={`w-full p-2.5 rounded-xl border flex items-center justify-between transition-all ${
            currentTab === 'guide'
              ? 'bg-[#10B981]/20 border-[#10B981] text-[#34D399] shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)]'
              : 'bg-[#121814] border-[#1E2822] text-[#D1D5DB] hover:border-[#10B981]/50 hover:bg-[#162219]'
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#10B981]/15 text-[#10B981] flex items-center justify-center border border-[#10B981]/30">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-white leading-none">AI Mentor Guide</div>
              <div className="text-[10px] text-[#9CA3AF] mt-0.5">Always here to help</div>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
        </button>

        {/* AI Transparency Badge */}
        <button
          onClick={onOpenModelModal}
          className="w-full p-2 rounded-xl bg-[#0D110F] border border-[#1E2822] text-left hover:border-[#10B981]/40 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-lg bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 flex items-center justify-center">
              <Cpu className="w-3 h-3" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-white leading-none">
                Gemma 2 · 9B
              </div>
              <div className="text-[10px] text-[#9CA3AF] leading-tight mt-0.5">
                Open-weight Architecture
              </div>
            </div>
          </div>
          <ExternalLink className="w-3 h-3 text-[#6B7280] group-hover:text-[#10B981] transition-colors" />
        </button>
      </div>
    </aside>
  );
};
