import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Sidebar } from './components/layout/Sidebar';
import { LandingPage } from './components/landing/LandingPage';
import { OverviewView } from './components/dashboard/OverviewView';
import { ExploreView } from './components/explore/ExploreView';
import { DocSmithView } from './components/docsmith/DocSmithView';
import { IssueMedicView } from './components/issuemedic/IssueMedicView';
import { NewcomerPathView } from './components/newcomer/NewcomerPathView';
import { RepoHealthView } from './components/repohealth/RepoHealthView';
import { MyProgressView } from './components/progress/MyProgressView';
import { AIGuideView } from './components/guide/AIGuideView';
import { SettingsView } from './components/settings/SettingsView';
import { HowItWorksPage } from './components/pages/HowItWorksPage';
import { AboutPage } from './components/pages/AboutPage';
import { AuthModal } from './components/auth/AuthModal';
import { AIModelModal } from './components/modals/AIModelModal';
import { RepoSelectorModal } from './components/modals/RepoSelectorModal';

// Advanced Educational Feature Views
import { GitPlaygroundView } from './components/playground/GitPlaygroundView';
import { FirstContributionSimulatorView } from './components/simulator/FirstContributionSimulatorView';
import { PRReviewTranslatorView } from './components/translator/PRReviewTranslatorView';
import { RoadmapView } from './components/roadmap/RoadmapView';
import { LanguageBridgeView } from './components/language/LanguageBridgeView';
import { IssueQualityView } from './components/quality/IssueQualityView';
import { GlossaryView } from './components/glossary/GlossaryView';
import { SavedItemsView } from './components/saved/SavedItemsView';

import { GitHubRepo, GitHubIssue, UserPreferences, UserProgress, AIModelInfo } from './types';
import {
  getUserPreferences,
  saveUserPreferences,
  getUserProgress,
  recordExploredRepo
} from './services/storage';
import { getRepoInfo, getAIModelInfo } from './services/api';

import { AnimatedBackground } from './components/ui/AnimatedBackground';

export default function App() {
  // Navigation states
  const [currentView, setCurrentView] = useState<string>('landing');
  const [dashboardTab, setDashboardTab] = useState<string>('overview');

  // Core entities
  const [activeRepo, setActiveRepo] = useState<GitHubRepo | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<GitHubIssue | null>(null);

  // User state
  const [userPrefs, setUserPrefs] = useState<UserPreferences>(getUserPreferences());
  const [userProgress, setUserProgress] = useState<UserProgress>(getUserProgress());

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isModelModalOpen, setIsModelModalOpen] = useState(false);
  const [isRepoSelectorOpen, setIsRepoSelectorOpen] = useState(false);

  // Model Info
  const [modelInfo, setModelInfo] = useState<AIModelInfo>({
    modelName: 'Gemma 2 (9B Instruction-Tuned)',
    provider: 'Google DeepMind Open Weights',
    license: 'Open-weight (Gemma Terms of Use / Apache Compatible)',
    inferenceEndpoint: '/api/ai/generate',
    fallbackModel: 'gemini-2.5-flash',
    configured: true,
    features: [
      'Issue Breakdown & Simplification',
      'Repository Documentation Drafting',
      'Newcomer Setup Checklist Customization',
      'Mentor Mode Progressive Hinting',
      'Technical Jargon Translation',
      'PR Review Feedback Translation',
      'Issue Quality Audit & Rewriting'
    ]
  });

  // On mount: fetch model metadata and preload a default beginner-friendly repo
  useEffect(() => {
    getAIModelInfo().then(setModelInfo).catch(console.warn);

    // Preload first-contributions as starter repo
    getRepoInfo('firstcontributions', 'first-contributions')
      .then((repo) => {
        setActiveRepo(repo);
        recordExploredRepo(repo.full_name, repo.description || undefined);
        setUserProgress(getUserProgress());
      })
      .catch((err) => {
        console.warn('Initial repo load notice:', err);
      });
  }, []);

  const refreshProgress = () => {
    setUserProgress(getUserProgress());
  };

  // Update active repository handler
  const handleSelectRepo = (repo: GitHubRepo) => {
    setActiveRepo(repo);
    recordExploredRepo(repo.full_name, repo.description || undefined);
    setUserProgress(getUserProgress());
  };

  const handleSelectRepoByName = (fullName: string) => {
    const [owner, repo] = fullName.split('/');
    getRepoInfo(owner, repo)
      .then((data) => {
        handleSelectRepo(data);
      })
      .catch(console.warn);
  };

  // Switch tabs inside workspace
  const handleNavigateDashboardTab = (tab: string) => {
    setDashboardTab(tab);
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Main navigation
  const handleMainNavigate = (view: string) => {
    const directTabs = [
      'explore',
      'docsmith',
      'issuemedic',
      'newcomer',
      'repohealth',
      'playground',
      'roadmap',
      'glossary',
      'simulator',
      'translator',
      'quality',
      'saved',
      'language',
      'progress',
      'guide',
      'settings'
    ];

    if (directTabs.includes(view)) {
      setCurrentView('dashboard');
      setDashboardTab(view);
    } else {
      setCurrentView(view);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Taking an issue from IssueMedic to Newcomer Path
  const handleStartNewcomerWithIssue = (issue: GitHubIssue) => {
    setSelectedIssue(issue);
    setDashboardTab('newcomer');
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth actions
  const handleLoginSuccess = (user: { name: string; email: string; isDemo: boolean }) => {
    const updated = saveUserPreferences({
      name: user.name,
      email: user.email,
      isDemoUser: user.isDemo,
    });
    setUserPrefs(updated);
    setCurrentView('dashboard');
    setDashboardTab('overview');
  };

  const handleLogout = () => {
    const updated = saveUserPreferences({
      isDemoUser: true,
      name: 'Open Source Newcomer',
    });
    setUserPrefs(updated);
    setCurrentView('landing');
  };

  const handleUpdatePrefs = (newPrefs: Partial<UserPreferences>) => {
    const updated = saveUserPreferences(newPrefs);
    setUserPrefs(updated);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080B09] text-[#F3F4F6] font-sans relative selection:bg-[#10B981]/25 selection:text-[#34D399]">
      {/* Dynamic Animated Constellation & Aurora Background */}
      <AnimatedBackground />

      {/* Top Navigation Bar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleMainNavigate}
        onOpenAuth={(mode) => {
          setAuthMode(mode);
          setIsAuthOpen(true);
        }}
        isLoggedIn={!userPrefs.isDemoUser}
        userName={userPrefs.name}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1">
        {/* LANDING VIEW */}
        {currentView === 'landing' && (
          <LandingPage
            onStartExploring={() => {
              setCurrentView('dashboard');
              setDashboardTab('explore');
            }}
            onOpenHowItWorks={() => {
              const el = document.getElementById('how-it-works-section');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              } else {
                setCurrentView('how-it-works');
              }
            }}
            onSelectFeature={(tab) => {
              setCurrentView('dashboard');
              setDashboardTab(tab);
            }}
          />
        )}

        {/* HOW IT WORKS VIEW */}
        {currentView === 'how-it-works' && (
          <HowItWorksPage
            onStartExploring={() => {
              setCurrentView('dashboard');
              setDashboardTab('explore');
            }}
            onOpenNewcomer={() => {
              setCurrentView('dashboard');
              setDashboardTab('newcomer');
            }}
          />
        )}

        {/* ABOUT VIEW */}
        {currentView === 'about' && (
          <AboutPage
            onStartExploring={() => {
              setCurrentView('dashboard');
              setDashboardTab('explore');
            }}
            onOpenModelModal={() => setIsModelModalOpen(true)}
          />
        )}

        {/* WORKSPACE / DASHBOARD VIEW */}
        {currentView === 'dashboard' && (
          <div className="flex min-h-[calc(100vh-4rem)] relative z-10">
            {/* Sidebar with Grouped Navigation */}
            <Sidebar
              currentTab={dashboardTab}
              onSelectTab={setDashboardTab}
              activeRepo={activeRepo}
              onOpenRepoSelector={() => setIsRepoSelectorOpen(true)}
              onOpenModelModal={() => setIsModelModalOpen(true)}
            />

            {/* Dashboard Sub-Views */}
            <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
              {/* LEARN GROUP */}
              {dashboardTab === 'playground' && (
                <GitPlaygroundView />
              )}

              {dashboardTab === 'roadmap' && (
                <RoadmapView
                  userPrefs={userPrefs}
                  onUpdatePrefs={handleUpdatePrefs}
                />
              )}

              {dashboardTab === 'glossary' && (
                <GlossaryView />
              )}

              {/* CONTRIBUTE GROUP */}
              {dashboardTab === 'explore' && (
                <ExploreView
                  activeRepo={activeRepo}
                  onSelectRepo={handleSelectRepo}
                  onNavigateTab={handleNavigateDashboardTab}
                />
              )}

              {dashboardTab === 'issuemedic' && (
                <IssueMedicView
                  activeRepo={activeRepo}
                  onOpenRepoSelector={() => setIsRepoSelectorOpen(true)}
                  onStartNewcomerWithIssue={handleStartNewcomerWithIssue}
                />
              )}

              {dashboardTab === 'newcomer' && (
                <NewcomerPathView
                  activeRepo={activeRepo}
                  selectedIssue={selectedIssue}
                  userPrefs={userPrefs}
                  onUpdatePrefs={handleUpdatePrefs}
                  onNavigateTab={handleNavigateDashboardTab}
                  onOpenRepoSelector={() => setIsRepoSelectorOpen(true)}
                />
              )}

              {dashboardTab === 'simulator' && (
                <FirstContributionSimulatorView
                  onExploreRealRepos={() => {
                    setDashboardTab('explore');
                  }}
                />
              )}

              {dashboardTab === 'translator' && (
                <PRReviewTranslatorView />
              )}

              {/* CREATE AND IMPROVE GROUP */}
              {dashboardTab === 'docsmith' && (
                <DocSmithView
                  activeRepo={activeRepo}
                  onOpenRepoSelector={() => setIsRepoSelectorOpen(true)}
                />
              )}

              {dashboardTab === 'quality' && (
                <IssueQualityView />
              )}

              {dashboardTab === 'repohealth' && (
                <RepoHealthView
                  activeRepo={activeRepo}
                  onOpenRepoSelector={() => setIsRepoSelectorOpen(true)}
                  onNavigateTab={handleNavigateDashboardTab}
                />
              )}

              {/* MY SPACE GROUP */}
              {dashboardTab === 'overview' && (
                <OverviewView
                  activeRepo={activeRepo}
                  userPrefs={userPrefs}
                  userProgress={userProgress}
                  onNavigateTab={handleNavigateDashboardTab}
                  onSelectRepo={handleSelectRepoByName}
                />
              )}

              {dashboardTab === 'progress' && (
                <MyProgressView
                  userProgress={userProgress}
                  userPrefs={userPrefs}
                  onNavigateTab={handleNavigateDashboardTab}
                  onSelectRepo={handleSelectRepoByName}
                />
              )}

              {dashboardTab === 'saved' && (
                <SavedItemsView
                  userProgress={userProgress}
                  onNavigateTab={handleNavigateDashboardTab}
                  onSelectRepo={handleSelectRepoByName}
                  onRefreshProgress={refreshProgress}
                />
              )}

              {dashboardTab === 'language' && (
                <LanguageBridgeView />
              )}

              {dashboardTab === 'guide' && (
                <AIGuideView
                  activeRepo={activeRepo}
                  selectedIssue={selectedIssue}
                  onOpenModelModal={() => setIsModelModalOpen(true)}
                />
              )}

              {dashboardTab === 'settings' && (
                <SettingsView
                  userPrefs={userPrefs}
                  onUpdatePrefs={handleUpdatePrefs}
                  modelInfo={modelInfo}
                  onOpenModelModal={() => setIsModelModalOpen(true)}
                />
              )}
            </main>
          </div>
        )}
      </div>

      {/* Global Footer (Visible on marketing pages, quiet and concise) */}
      {currentView !== 'dashboard' && (
        <Footer
          onNavigate={handleMainNavigate}
          onOpenModelModal={() => setIsModelModalOpen(true)}
        />
      )}

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
        onLoginSuccess={handleLoginSuccess}
      />

      <AIModelModal
        isOpen={isModelModalOpen}
        onClose={() => setIsModelModalOpen(false)}
        modelInfo={modelInfo}
      />

      <RepoSelectorModal
        isOpen={isRepoSelectorOpen}
        onClose={() => setIsRepoSelectorOpen(false)}
        onSelectRepo={handleSelectRepo}
        activeRepo={activeRepo}
      />
    </div>
  );
}
