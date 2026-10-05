/**
 * Prominent Clinical Safety Disclaimer Component
 * Enforces safety boundary across all system views.
 */

import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';

interface SafetyDisclaimerProps {
  compact?: boolean;
}

export const SafetyDisclaimer: React.FC<SafetyDisclaimerProps> = ({ compact = false }) => {
  if (compact) {
    return (
      <div
        id="safety-disclaimer-compact"
        className="bg-slate-900 text-slate-300 border-b border-slate-800 px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-1.5 text-xs flex items-center justify-between tracking-tight"
      >
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
          <span className="text-[11px]">
            <strong className="text-white font-semibold">Clinical Protocol:</strong> AI-assisted credibility intelligence only &bull; Non-diagnostic &bull; Not a substitute for licensed medical counsel.
          </span>
        </div>
        <span className="text-[11px] text-slate-400 hover:text-white transition-colors cursor-pointer ml-2">
          Governance Standards
        </span>
      </div>
    );
  }

  return (
    <div
      id="safety-disclaimer-banner"
      className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs"
    >
      <div className="flex items-start gap-3.5">
        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300">
          <Info className="w-4 h-4 flex-shrink-0" />
        </div>
        <div className="text-sm">
          <h4 className="font-semibold text-slate-900 dark:text-white text-xs tracking-wider uppercase">
            Clinical Safety & Governance Boundary
          </h4>
          <p className="mt-1 text-slate-600 dark:text-slate-400 leading-relaxed text-xs">
            This system provides AI-assisted evidence retrieval and cross-document discrepancy auditing. It is <strong>not a medical device or diagnostic engine</strong>. In an emergency or when managing health symptoms, seek direct consultation from licensed healthcare providers. Never discontinue prescribed therapies without direct clinician authorization.
          </p>
        </div>
      </div>
    </div>
  );
};
