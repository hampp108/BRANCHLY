import React, { useState } from 'react';
import {
  Settings,
  User,
  Shield,
  Save,
  RotateCcw,
  Check,
  Cpu,
  Key,
  Database,
  Sliders
} from 'lucide-react';
import { UserPreferences, AIModelInfo } from '../../types';
import { resetAllData } from '../../services/storage';

interface SettingsViewProps {
  userPrefs: UserPreferences;
  onUpdatePrefs: (prefs: Partial<UserPreferences>) => void;
  modelInfo: AIModelInfo;
  onOpenModelModal: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  userPrefs,
  onUpdatePrefs,
  modelInfo,
  onOpenModelModal,
}) => {
  const [name, setName] = useState(userPrefs.name);
  const [email, setEmail] = useState(userPrefs.email);
  const [skillLevel, setSkillLevel] = useState(userPrefs.skillLevel);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePrefs({
      name,
      email,
      skillLevel,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleResetData = () => {
    resetAllData();
    window.location.reload();
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Header Cockpit Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-[#0D110F]/90 border border-[#1E2822] space-y-1 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-32 bg-[#10B981]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 text-[10px] font-mono uppercase tracking-wider text-[#10B981]">
            <Sliders className="w-3 h-3 text-[#10B981]" />
            <span>PREFERENCES & ARCHITECTURE</span>
          </div>
          <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-white mt-1">
            Platform Settings
          </h2>
          <p className="text-xs text-[#9CA3AF]">
            Manage your personal profile, educational preferences, and open-source model configurations.
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="p-6 md:p-8 rounded-2xl bg-[#0D110F]/90 border border-[#1E2822] space-y-6 backdrop-blur-md">
        <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
          <User className="w-4 h-4 text-[#10B981]" />
          <span>Learner Profile</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-white">
              Your Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#1E2822] bg-[#080B09] text-white focus:outline-none focus:border-[#10B981]"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-white">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#1E2822] bg-[#080B09] text-white focus:outline-none focus:border-[#10B981]"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-white">
            Git & Contribution Experience Level
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'absolute_beginner', label: 'Absolute Beginner' },
              { id: 'learning_git', label: 'Learning Git' },
              { id: 'some_experience', label: 'Some Experience' }
            ].map((lvl) => (
              <button
                type="button"
                key={lvl.id}
                onClick={() => setSkillLevel(lvl.id as any)}
                className={`p-3.5 rounded-xl border text-xs text-left transition-colors ${
                  skillLevel === lvl.id
                    ? 'border-[#10B981] bg-[#10B981]/10 font-bold text-white shadow-xs'
                    : 'border-[#1E2822] bg-[#121814] text-[#9CA3AF] hover:text-white'
                }`}
              >
                {lvl.label}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-3 flex items-center justify-between border-t border-[#1E2822]">
          <span className="text-xs text-[#6B7280] font-mono">
            {userPrefs.isDemoUser ? 'Currently browsing in Demo Mode' : 'Local preferences active'}
          </span>

          <button
            type="submit"
            className="btn-emerald-glow px-5 py-2.5 text-xs font-semibold rounded-xl flex items-center gap-1.5"
          >
            {savedSuccess ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            <span>{savedSuccess ? 'Settings Saved' : 'Save Changes'}</span>
          </button>
        </div>
      </form>

      {/* Model Specifications Section */}
      <div className="p-6 md:p-8 rounded-2xl bg-[#0D110F]/90 border border-[#1E2822] space-y-4 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#10B981]" />
            <span>Open-Weight AI Model Inspection</span>
          </h3>
          <button
            onClick={onOpenModelModal}
            className="text-xs font-semibold text-[#10B981] hover:underline"
          >
            Full Architecture Specs
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#121814] border border-[#1E2822]">
            <div className="font-bold text-white font-mono">Model: {modelInfo.modelName}</div>
            <div className="text-[11px] text-[#9CA3AF] mt-0.5">Provider: {modelInfo.provider}</div>
          </div>
          <div className="p-4 rounded-xl bg-[#121814] border border-[#1E2822]">
            <div className="font-bold text-white font-mono">License: {modelInfo.license}</div>
            <div className="text-[11px] text-[#9CA3AF] mt-0.5">Inference Route: {modelInfo.inferenceEndpoint}</div>
          </div>
        </div>
      </div>

      {/* Danger Zone: Reset Local Data */}
      <div className="p-6 rounded-2xl bg-[#0D110F]/90 border border-red-900/40 space-y-3 backdrop-blur-md">
        <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-red-400">
          Reset Learning Data
        </h4>
        <p className="text-xs text-[#9CA3AF]">
          Clear your checklist history, saved issues, and milestone achievements from this browser's local storage.
        </p>

        {resetConfirm ? (
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handleResetData}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              Yes, permanently clear local data
            </button>
            <button
              onClick={() => setResetConfirm(false)}
              className="px-3.5 py-2 text-xs font-medium text-[#9CA3AF] hover:text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setResetConfirm(true)}
            className="px-4 py-2 text-xs font-semibold text-red-400 hover:bg-red-950/40 border border-red-900/60 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Progress Data</span>
          </button>
        )}
      </div>
    </div>
  );
};
