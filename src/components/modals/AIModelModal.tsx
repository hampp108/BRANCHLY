import React from 'react';
import { X, Cpu, CheckCircle2, ShieldCheck, Terminal, BookOpen, AlertCircle, Sparkles } from 'lucide-react';
import { AIModelInfo } from '../../types';

interface AIModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  modelInfo: AIModelInfo;
}

export const AIModelModal: React.FC<AIModelModalProps> = ({
  isOpen,
  onClose,
  modelInfo,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#0D110F] rounded-2xl border border-[#1E2822] shadow-[0_10px_40px_rgba(0,0,0,0.8)] p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-[#6B7280] hover:text-white hover:bg-[#121814] rounded-lg transition-colors"
          aria-label="Close AI Architecture Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#10B981]">
            AI ARCHITECTURE & INFERENCE SPECIFICATIONS
          </div>
          <h3 className="font-heading text-2xl font-bold text-white">
            AI Architecture & Model Transparency
          </h3>
          <p className="text-xs text-[#9CA3AF] leading-relaxed">
            BRANCHLY adheres to strict engineering transparency. AI capabilities are grounded in Google DeepMind's Gemini model architecture, executed exclusively through secure server-side proxy endpoints.
          </p>
        </div>

        {/* Specifications Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#121814] border border-[#1E2822] space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280]">
              Primary Model
            </span>
            <div className="font-heading font-bold text-sm text-white flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-[#10B981]" />
              <span>{modelInfo.modelName}</span>
            </div>
            <div className="text-[11px] text-[#9CA3AF]">
              High-throughput multimodal inference engine
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#121814] border border-[#1E2822] space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280]">
              Model Provider
            </span>
            <div className="font-heading font-bold text-sm text-white">
              {modelInfo.provider}
            </div>
            <div className="text-[11px] text-[#9CA3AF]">
              State-of-the-art model family by Google DeepMind
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#121814] border border-[#1E2822] space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280]">
              Model Terms & License
            </span>
            <div className="font-heading font-bold text-sm text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span>{modelInfo.license}</span>
            </div>
            <div className="text-[11px] text-[#9CA3AF]">
              Google AI Developer Terms of Service
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#121814] border border-[#1E2822] space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280]">
              Inference Endpoint
            </span>
            <div className="font-mono text-xs text-[#06B6D4] flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-[#06B6D4]" />
              <span>{modelInfo.inferenceEndpoint}</span>
            </div>
            <div className="text-[11px] text-[#9CA3AF]">
              Express backend proxy · Secrets stored in environment
            </div>
          </div>
        </div>

        {/* Powered Features */}
        <div className="space-y-3">
          <h4 className="font-heading font-semibold text-xs text-white uppercase tracking-wider">
            Features Powered by this Model
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {modelInfo.features.map((feat, i) => (
              <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-[#121814] border border-[#1E2822] text-[#E5E7EB]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                <span className="truncate">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Offline & Resiliency Guarantee */}
        <div className="p-4 rounded-xl bg-[#121814] border border-[#1E2822] text-xs space-y-1.5">
          <div className="font-semibold flex items-center gap-1.5 text-[#10B981]">
            <BookOpen className="w-4 h-4" />
            <span>Honest Fallback Guarantee</span>
          </div>
          <p className="text-[11px] text-[#9CA3AF] leading-relaxed">
            BRANCHLY does not pretend AI requests succeeded if the inference endpoint is temporarily offline. Heuristic rule engines analyze issue labels, licenses, and repository trees deterministically so you can continue learning seamlessly regardless of connection or quota state.
          </p>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="btn-emerald-glow px-5 py-2 text-xs font-semibold rounded-xl"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
