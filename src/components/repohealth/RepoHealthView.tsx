import React, { useState, useEffect } from 'react';
import {
  Activity,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  FileText,
  FileCode,
  Tag,
  Clock,
  ExternalLink,
  Sparkles,
  Info,
  Zap
} from 'lucide-react';
import { GitHubRepo, RepoHealthMetrics } from '../../types';
import { getRepoReadme, getRepoIssues, getRepoCommunityProfile } from '../../services/api';

interface RepoHealthViewProps {
  activeRepo: GitHubRepo | null;
  onOpenRepoSelector: () => void;
  onNavigateTab: (tab: string) => void;
}

export const RepoHealthView: React.FC<RepoHealthViewProps> = ({
  activeRepo,
  onOpenRepoSelector,
  onNavigateTab,
}) => {
  const [metrics, setMetrics] = useState<RepoHealthMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!activeRepo) return;
    setIsLoading(true);
    setError(null);

    const evaluateHealth = async () => {
      try {
        // 1. Fetch README
        let readme = '';
        try {
          readme = await getRepoReadme(activeRepo.owner.login, activeRepo.name);
        } catch {
          readme = '';
        }
        const hasReadme = readme.length > 50;

        // 2. Fetch issues & check for good first issues
        let issues: any[] = [];
        try {
          issues = await getRepoIssues(activeRepo.owner.login, activeRepo.name);
        } catch (issueErr: any) {
          console.warn('Issue fetching in health check:', issueErr.message);
        }
        const goodFirstIssues = issues.filter(issue =>
          issue.labels?.some((l: any) => l.name?.toLowerCase().includes('good first') || l.name?.toLowerCase().includes('beginner'))
        );
        const hasGoodFirstIssues = goodFirstIssues.length > 0;

        // 3. License
        const hasLicense = Boolean(activeRepo.license && activeRepo.license.key);

        // 4. Community profile if available
        let community: any = null;
        try {
          community = await getRepoCommunityProfile(activeRepo.owner.login, activeRepo.name);
        } catch {
          community = null;
        }
        const hasContributing = Boolean(community?.files?.contributing) || readme.toLowerCase().includes('contributing');
        const hasCodeOfConduct = Boolean(community?.files?.code_of_conduct) || readme.toLowerCase().includes('code of conduct');
        const hasIssueTemplates = Boolean(community?.files?.issue_template);

        // Score calculation based on real verified signals
        let scorePoints = 0;
        let totalPoints = 6;

        if (hasReadme) scorePoints += 1;
        if (hasLicense) scorePoints += 1;
        if (hasContributing) scorePoints += 1;
        if (hasCodeOfConduct) scorePoints += 1;
        if (hasGoodFirstIssues) scorePoints += 1;
        if (activeRepo.open_issues_count > 0) scorePoints += 1;

        const percentage = Math.round((scorePoints / totalPoints) * 100);
        let overallScore: 'Needs attention' | 'Good' | 'Excellent' = 'Needs attention';
        if (percentage >= 80) overallScore = 'Excellent';
        else if (percentage >= 50) overallScore = 'Good';

      // Actionable suggestions
      const suggestions = [];
      if (!hasContributing) {
        suggestions.push({
          id: 'add-contributing',
          title: 'Add a dedicated CONTRIBUTING.md guide',
          description: 'A clear guide helps newcomers fork, set up, and submit changes without asking basic setup questions.',
          priority: 'high' as const,
          actionLabel: 'Generate in DocSmith',
          actionType: 'docsmith' as const,
        });
      }
      if (!hasCodeOfConduct) {
        suggestions.push({
          id: 'add-coc',
          title: 'Adopt a Contributor Covenant Code of Conduct',
          description: 'Establishes clear, welcoming community expectations and protects first-time contributors from harassment.',
          priority: 'medium' as const,
          actionLabel: 'Create in DocSmith',
          actionType: 'docsmith' as const,
        });
      }
      if (!hasGoodFirstIssues) {
        suggestions.push({
          id: 'add-gfi',
          title: 'Label beginner-friendly tasks with "good first issue"',
          description: 'Newcomers specifically search for this standard label. Marking 2-3 isolated tasks invites newcomers in.',
          priority: 'high' as const,
          actionLabel: 'Browse Issues',
          actionType: 'issues' as const,
        });
      }
      if (!hasLicense) {
        suggestions.push({
          id: 'add-license',
          title: 'Add an open-source license (e.g. MIT or Apache 2.0)',
          description: 'Without a license, default copyright laws apply, meaning other developers cannot legally use or contribute.',
          priority: 'high' as const,
          actionLabel: 'Explain Licenses in DocSmith',
          actionType: 'docsmith' as const,
        });
      }

      setMetrics({
        hasReadme,
        hasLicense,
        licenseName: activeRepo.license?.name,
        hasContributing,
        hasCodeOfConduct,
        hasIssueTemplates,
        hasGoodFirstIssues,
        goodFirstIssuesCount: goodFirstIssues.length,
        overallScore,
        scorePercentage: percentage,
        actionableSuggestions: suggestions,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to evaluate repository health metrics.');
    }
  };

  evaluateHealth().finally(() => setIsLoading(false));
}, [activeRepo]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header Cockpit Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-[#0D110F]/90 border border-[#1E2822] backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-32 bg-[#10B981]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 text-[10px] font-mono uppercase tracking-wider text-[#10B981]">
            <Activity className="w-3 h-3 text-[#10B981]" />
            <span>REPOHEALTH · WELCOMING AUDIT</span>
          </div>
          <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-white">
            Repository Welcoming & Health Audit
          </h2>
          <p className="text-xs text-[#9CA3AF] max-w-xl">
            {activeRepo
              ? `Evaluating welcoming standards and documentation readiness for ${activeRepo.full_name}`
              : 'Select a repository to evaluate its beginner-friendliness and community documentation.'}
          </p>
        </div>

        <div className="relative z-10">
          {!activeRepo && (
            <button
              onClick={onOpenRepoSelector}
              className="btn-emerald-glow px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5"
            >
              Select Active Repo
            </button>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="p-16 text-center text-xs text-[#9CA3AF] bg-[#0D110F] rounded-2xl border border-[#1E2822]">
          <div className="inline-block w-8 h-8 border-2 border-[#10B981] border-t-transparent rounded-full animate-spin mb-3" />
          <div className="text-sm font-medium text-white">Evaluating repository documentation & beginner signals...</div>
          <div className="text-[11px] text-[#6B7280] mt-1 font-mono">Checking README, license SPDX, CONTRIBUTING.md, and good first issue tags</div>
        </div>
      )}

      {!isLoading && metrics && (
        <>
          {/* Overall Health Score Cockpit */}
          <div className="p-8 rounded-2xl bg-[#0D110F]/90 border border-[#1E2822] grid grid-cols-1 md:grid-cols-12 gap-8 items-center backdrop-blur-md">
            <div className="md:col-span-8 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#6B7280]">
                  OVERALL COMMUNITY HEALTH
                </span>
                <span aria-hidden="true" className="text-[#1E2822]">·</span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                    metrics.overallScore === 'Excellent'
                      ? 'text-[#10B981] bg-[#10B981]/15 border border-[#10B981]/30'
                      : metrics.overallScore === 'Good'
                      ? 'text-[#06B6D4] bg-[#06B6D4]/15 border border-[#06B6D4]/30'
                      : 'text-amber-400 bg-amber-400/10 border border-amber-400/20'
                  }`}
                >
                  {metrics.overallScore}
                </span>
              </div>

              <h3 className="font-heading text-3xl font-extrabold text-white">
                {metrics.scorePercentage}% Welcoming Readiness
              </h3>

              <p className="text-xs text-[#9CA3AF] leading-relaxed max-w-xl">
                {metrics.overallScore === 'Excellent'
                  ? 'This repository has established outstanding documentation, clear licenses, and active beginner-friendly avenues.'
                  : metrics.overallScore === 'Good'
                  ? 'This project provides good essential documentation. Addressing the suggestions below will make it even easier for new contributors to get started.'
                  : 'Key contributor onboarding assets are missing. New contributors may hesitate to contribute until guidelines and licenses are provided.'}
              </p>
            </div>

            <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-[#121814] rounded-2xl border border-[#1E2822] text-center space-y-1.5">
              <div className="text-4xl font-heading font-black text-[#10B981] font-mono tabular-nums tracking-tight">
                {metrics.scorePercentage}%
              </div>
              <div className="text-xs font-semibold text-white">Welcoming Index</div>
              <div className="text-[10px] text-[#6B7280] font-mono">Based on real GitHub file presence</div>
            </div>
          </div>

          {/* Detailed Verification Checklist Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-base text-white">
                Verified Welcoming Criteria
              </h3>
              <span className="text-[11px] font-mono text-[#10B981]">6 Core Signals</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* README check */}
              <div className="p-4 rounded-xl bg-[#0D110F] border border-[#1E2822] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-heading font-semibold text-xs text-white">
                    <FileText className="w-4 h-4 text-[#10B981]" />
                    <span>README Document</span>
                  </div>
                  {metrics.hasReadme ? (
                    <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400" />
                  )}
                </div>
                <div className="text-[11px] text-[#9CA3AF]">
                  {metrics.hasReadme ? 'Present & detailed on repository root.' : 'Missing or extremely short README.'}
                </div>
              </div>

              {/* License check */}
              <div className="p-4 rounded-xl bg-[#0D110F] border border-[#1E2822] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-heading font-semibold text-xs text-white">
                    <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                    <span>Open-Source License</span>
                  </div>
                  {metrics.hasLicense ? (
                    <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  ) : (
                    <XCircle className="w-4 h-4 text-amber-400" />
                  )}
                </div>
                <div className="text-[11px] text-[#9CA3AF]">
                  {metrics.hasLicense ? `Recognized SPDX: ${metrics.licenseName}` : 'No verified open-source license header detected.'}
                </div>
              </div>

              {/* CONTRIBUTING check */}
              <div className="p-4 rounded-xl bg-[#0D110F] border border-[#1E2822] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-heading font-semibold text-xs text-white">
                    <FileCode className="w-4 h-4 text-[#10B981]" />
                    <span>CONTRIBUTING Guidelines</span>
                  </div>
                  {metrics.hasContributing ? (
                    <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  ) : (
                    <XCircle className="w-4 h-4 text-amber-400" />
                  )}
                </div>
                <div className="text-[11px] text-[#9CA3AF]">
                  {metrics.hasContributing ? 'Dedicated guidelines found.' : 'Missing CONTRIBUTING.md file.'}
                </div>
              </div>

              {/* Code of Conduct check */}
              <div className="p-4 rounded-xl bg-[#0D110F] border border-[#1E2822] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-heading font-semibold text-xs text-white">
                    <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                    <span>Code of Conduct</span>
                  </div>
                  {metrics.hasCodeOfConduct ? (
                    <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  ) : (
                    <XCircle className="w-4 h-4 text-amber-400" />
                  )}
                </div>
                <div className="text-[11px] text-[#9CA3AF]">
                  {metrics.hasCodeOfConduct ? 'Standard community pledge active.' : 'No explicit Code of Conduct found.'}
                </div>
              </div>

              {/* Good First Issues check */}
              <div className="p-4 rounded-xl bg-[#0D110F] border border-[#1E2822] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-heading font-semibold text-xs text-white">
                    <Tag className="w-4 h-4 text-[#10B981]" />
                    <span>Good First Issues</span>
                  </div>
                  {metrics.hasGoodFirstIssues ? (
                    <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  ) : (
                    <XCircle className="w-4 h-4 text-amber-400" />
                  )}
                </div>
                <div className="text-[11px] text-[#9CA3AF]">
                  {metrics.hasGoodFirstIssues
                    ? `${metrics.goodFirstIssuesCount} labeled issues ready for newcomers.`
                    : 'No issues currently labeled with "good first issue".'}
                </div>
              </div>

              {/* Maintainer Response info */}
              <div className="p-4 rounded-xl bg-[#0D110F] border border-[#1E2822] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-heading font-semibold text-xs text-white">
                    <Clock className="w-4 h-4 text-[#06B6D4]" />
                    <span>Activity & Updates</span>
                  </div>
                  <Info className="w-4 h-4 text-[#6B7280]" />
                </div>
                <div className="text-[11px] text-[#9CA3AF]">
                  {activeRepo
                    ? `Updated on ${new Date(activeRepo.updated_at).toLocaleDateString()}`
                    : 'Data unavailable'}
                </div>
              </div>
            </div>
          </div>

          {/* Actionable Suggestions */}
          {metrics.actionableSuggestions.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-heading font-bold text-base text-white">
                Actionable Recommendations ({metrics.actionableSuggestions.length})
              </h3>

              <div className="space-y-3">
                {metrics.actionableSuggestions.map((sug) => (
                  <div
                    key={sug.id}
                    className="p-5 rounded-xl bg-[#0D110F] border border-[#1E2822] hover:border-[#10B981]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="font-heading font-semibold text-xs text-white flex items-center gap-2">
                        <span>{sug.title}</span>
                        <span className="text-[10px] uppercase font-bold text-[#10B981] bg-[#10B981]/15 px-2 py-0.5 rounded border border-[#10B981]/30">
                          {sug.priority} priority
                        </span>
                      </div>
                      <p className="text-xs text-[#9CA3AF]">
                        {sug.description}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        if (sug.actionType === 'docsmith') onNavigateTab('docsmith');
                        else if (sug.actionType === 'issues') onNavigateTab('issuemedic');
                      }}
                      className="btn-emerald-glow px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 flex items-center gap-1.5"
                    >
                      <span>{sug.actionLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
