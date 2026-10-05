/**
 * Feature 15 & 16: Safety Architecture, Clinical Boundaries, and Ethics Framework
 */

import React from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle, Stethoscope, Lock, FileText } from 'lucide-react';

export const SafetyModal: React.FC = () => {
  return (
    <div id="safety-protocols-section" className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300">
              <ShieldAlert className="w-6 h-6" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Clinical Safety Architecture & Ethical AI Governance
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Clinical Safety Standards &bull; Medical Informatics & Bioethics Governance Framework
              </p>
            </div>
          </div>
        </div>

        {/* 4 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 bg-rose-50/40 dark:bg-rose-950/20 rounded-xl border border-rose-200 dark:border-rose-900/40 space-y-2">
            <h3 className="text-sm font-bold text-rose-900 dark:text-rose-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>1. Strict Non-Diagnostic Boundary</span>
            </h3>
            <p className="text-xs text-rose-800 dark:text-rose-300 leading-relaxed">
              This system is <strong>NOT an AI doctor</strong>. Under no circumstances does the platform diagnose clinical conditions, prescribe pharmaceuticals, or modify ongoing clinical care plans.
            </p>
          </div>

          <div className="p-5 bg-sky-50/40 dark:bg-sky-950/20 rounded-xl border border-sky-200 dark:border-sky-900/40 space-y-2">
            <h3 className="text-sm font-bold text-sky-900 dark:text-sky-200 flex items-center gap-2">
              <Lock className="w-4 h-4 text-sky-600" />
              <span>2. Evidence Grounding (Zero Hallucination Tolerance)</span>
            </h3>
            <p className="text-xs text-sky-800 dark:text-sky-300 leading-relaxed">
              All health credibility evaluations are bound to curated peer-reviewed literature (Cochrane, PubMed, WHO, CDC, FDA). If no verifiable evidence exists, the system outputs &ldquo;Insufficient Evidence&rdquo; rather than fabricating a verdict.
            </p>
          </div>

          <div className="p-5 bg-amber-50/40 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-900/40 space-y-2">
            <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-amber-600" />
              <span>3. Neutral Inconsistency Terminology</span>
            </h3>
            <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
              Cross-document discrepancies are flagged strictly as <em>&ldquo;Potential inconsistencies detected&rdquo;</em> with recommendation to verify with attending clinicians. The system never claims a physician or document is erroneous.
            </p>
          </div>

          <div className="p-5 bg-emerald-50/40 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-900/40 space-y-2">
            <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>4. High-Hazard Interception Engine</span>
            </h3>
            <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
              Prompts suggesting discontinuation of life-critical treatments (insulin, antihypertensives, chemotherapy, antibiotics) trigger deterministic emergency hazard warnings immediately.
            </p>
          </div>
        </div>

        {/* Verification Checklist */}
        <div className="p-5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            Systemic Verification Checklist & Medical Disclaimers
          </h4>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 list-disc pl-5">
            <li>
              <strong>AI Confidence vs Evidence Strength Separation:</strong> A high AI confidence score indicates certainty that the retrieved literature supports the verdict, not that the AI invented the medical fact independently.
            </li>
            <li>
              <strong>Source Transparency:</strong> Every extracted entity maps to its exact source document name and page number for clinician verification.
            </li>
            <li>
              <strong>Emergency Guidance:</strong> If you are experiencing sudden chest pain, breathing difficulty, or severe allergic reaction, please dial emergency services immediately.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
