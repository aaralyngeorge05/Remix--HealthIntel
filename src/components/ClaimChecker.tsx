/**
 * Feature 1 & 2: Health Claim Credibility Assessment & Explainable AI Pipeline
 */

import React, { useState } from 'react';
import {
  Search,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ShieldAlert,
  ExternalLink,
  BookOpen,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Sliders,
  FileCheck2,
  Activity,
  FileText,
  ChevronRight,
  FlaskConical,
  ShieldCheck,
  Pill,
  HeartPulse,
  Shield,
} from 'lucide-react';
import { ClaimAnalysisResult, ClaimClassification, RiskLevel, EvidenceStrength } from '../types';
import { SYNTHETIC_DEMO_CLAIMS } from '../services/syntheticData';

interface ClaimCheckerProps {
  onAnalyzeSuccess?: (result: ClaimAnalysisResult) => void;
}

export const ClaimChecker: React.FC<ClaimCheckerProps> = ({ onAnalyzeSuccess }) => {
  const [claimInput, setClaimInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [result, setResult] = useState<ClaimAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pipelineSteps = [
    'User Claim Normalization',
    'Clinical Entity Extraction',
    'RAG Evidence Retrieval',
    'Evidence Quality Assessment',
    'Claim vs Evidence Comparison',
    'AI Multi-Factor Classification',
    'Clinical Risk Assessment',
    'Explainable Synthesis Generation',
  ];

  const handleAnalyze = async (claimToAnalyze?: string) => {
    const claim = (claimToAnalyze || claimInput).trim();
    if (!claim) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setCurrentStep(1);

    // Simulate animated step progression for clinical audit pipeline visualization
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev < pipelineSteps.length ? prev + 1 : prev));
    }, 280);

    try {
      const res = await fetch('/api/claims/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claim }),
      });

      clearInterval(stepInterval);
      setCurrentStep(pipelineSteps.length);

      if (!res.ok) {
        throw new Error('Claim analysis failed. Please try again.');
      }

      const data: ClaimAnalysisResult = await res.json();
      setResult(data);
      if (onAnalyzeSuccess) onAnalyzeSuccess(data);
    } catch (err: any) {
      clearInterval(stepInterval);
      setError(err.message || 'An unexpected error occurred during claim evaluation.');
    } finally {
      setLoading(false);
    }
  };

  const getVerdictStyle = (verdict: ClaimClassification) => {
    switch (verdict) {
      case 'Supported':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
        };
      case 'Partially Supported':
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
          icon: <Sliders className="w-5 h-5 text-amber-600" />,
        };
      case 'Misleading':
        return {
          bg: 'bg-orange-50 dark:bg-orange-950/40 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800',
          icon: <AlertTriangle className="w-5 h-5 text-orange-600" />,
        };
      case 'Unsupported':
      case 'False':
        return {
          bg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800',
          icon: <AlertTriangle className="w-5 h-5 text-rose-600" />,
        };
      case 'Potentially Dangerous':
        return {
          bg: 'bg-red-100 dark:bg-red-950 text-red-900 dark:text-red-200 border-red-300 dark:border-red-800 ring-2 ring-red-500/20',
          icon: <ShieldAlert className="w-5 h-5 text-red-600" />,
        };
      case 'Insufficient Evidence':
      default:
        return {
          bg: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700',
          icon: <HelpCircle className="w-5 h-5 text-slate-500" />,
        };
    }
  };

  const getRiskBadge = (risk: RiskLevel) => {
    switch (risk) {
      case 'Critical':
        return 'bg-red-600 text-white font-bold animate-pulse';
      case 'High':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200 border border-rose-300';
      case 'Medium':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200 border border-amber-300';
      case 'Low':
      default:
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200 border border-emerald-300';
    }
  };

  const getEvidenceStrengthBadge = (strength: EvidenceStrength) => {
    switch (strength) {
      case 'Rigorous':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-200 border-indigo-200';
      case 'High':
        return 'bg-sky-100 text-sky-800 dark:bg-sky-900/60 dark:text-sky-200 border-sky-200';
      case 'Moderate':
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300';
      case 'Low':
      default:
        return 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200';
    }
  };

  return (
    <div id="claim-checker-section" className="space-y-6">
      {/* Main Health Claim Credibility Assessment Card matching screenshot */}
      <div className="bg-white dark:bg-[#0a1536]/90 p-6 sm:p-8 rounded-2xl border border-slate-200/90 dark:border-blue-900/50 shadow-xs dark:shadow-2xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left: Circular Gradient Search Icon + Title */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 via-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/30 flex-shrink-0 mt-0.5">
              <Search className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Health Claim Credibility Assessment
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                Evaluate health statements, wellness facts, and medication claims against indexed Cochrane Systematic Reviews, clinical guidelines, and biomedical literature.
              </p>
            </div>
          </div>

          {/* Right: Verification Pipeline widget matching screenshot */}
          <div className="text-xs bg-sky-50/70 dark:bg-[#0c1a40] p-3.5 rounded-xl border border-sky-200/80 dark:border-blue-800/50 flex-shrink-0">
            <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white mb-2">
              <Activity className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
              <span>Verification Pipeline:</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono flex-wrap">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                <span>Claim</span>
              </span>
              <span className="text-slate-400 dark:text-slate-600">&rarr;</span>
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                <span>OCR</span>
              </span>
              <span className="text-slate-400 dark:text-slate-600">&rarr;</span>
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>Evidence</span>
              </span>
              <span className="text-slate-400 dark:text-slate-600">&rarr;</span>
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Analysis</span>
              </span>
              <span className="text-slate-400 dark:text-slate-600">&rarr;</span>
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                <span>Synthesis</span>
              </span>
            </div>
          </div>
        </div>

        {/* Input Form with FileText icon and Assess Credibility button */}
        <div className="mt-6">
          <label htmlFor="claim-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            ENTER HEALTH OR MEDICAL ASSERTION TO AUDIT
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <FileText className="w-4 h-4 text-slate-400 absolute left-4 top-4 pointer-events-none" />
              <input
                id="claim-input"
                type="text"
                value={claimInput}
                onChange={(e) => setClaimInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                placeholder="e.g., 'Vitamin C cures a cold in one day', OR 'Stop insulin and use cinnamon instead.'"
                className="w-full pl-11 pr-10 py-3.5 rounded-xl border border-slate-300 dark:border-blue-900/60 bg-slate-50/70 dark:bg-[#071128] text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 transition-all shadow-inner"
                disabled={loading}
              />
              {claimInput && (
                <button
                  onClick={() => setClaimInput('')}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              id="analyze-claim-btn"
              onClick={() => handleAnalyze()}
              disabled={loading || !claimInput.trim()}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-400 text-white font-bold text-sm shadow-[0_4px_16px_rgba(99,102,241,0.35)] hover:shadow-[0_6px_22px_rgba(6,182,212,0.45)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99] whitespace-nowrap"
            >
              {loading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-white" />
                  <span>Evaluating Claim...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Assess Credibility</span>
                  <ArrowRight className="w-4 h-4 ml-0.5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Example Claims */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-blue-950/70">
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-600 dark:text-cyan-400 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Example Claims</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2.5">
            {/* Scenario 1: Vitamin C */}
            <button
              id="demo-claim-0"
              onClick={() => {
                const claim = 'Vitamin C cures a cold in one day.';
                setClaimInput(claim);
                handleAnalyze(claim);
              }}
              disabled={loading}
              className="text-xs px-3.5 py-2.5 rounded-xl border transition-all text-left flex items-center gap-2 cursor-pointer border-blue-200 dark:border-cyan-800/60 bg-blue-50/70 hover:bg-blue-100 dark:bg-[#071736]/90 dark:hover:bg-[#0b2452] text-slate-800 dark:text-slate-200"
            >
              <FlaskConical className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400 flex-shrink-0" />
              <span className="font-bold text-blue-700 dark:text-cyan-400 whitespace-nowrap">Scenario 1:</span>
              <span className="truncate">&ldquo;Vitamin C cures a cold in one day.&rdquo;</span>
              <ChevronRight className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400 ml-auto flex-shrink-0" />
            </button>

            {/* Scenario 2: Lemon Water */}
            <button
              id="demo-claim-1"
              onClick={() => {
                const claim = 'Drinking lemon water cures cancer.';
                setClaimInput(claim);
                handleAnalyze(claim);
              }}
              disabled={loading}
              className="text-xs px-3.5 py-2.5 rounded-xl border transition-all text-left flex items-center gap-2 cursor-pointer border-emerald-200 dark:border-indigo-800/60 bg-emerald-50/70 hover:bg-emerald-100 dark:bg-[#0b1438]/90 dark:hover:bg-[#121f54] text-slate-800 dark:text-slate-200"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-indigo-400 flex-shrink-0" />
              <span className="font-bold text-emerald-700 dark:text-indigo-400 whitespace-nowrap">Scenario 2:</span>
              <span className="truncate">&ldquo;Drinking lemon water cures cancer.&rdquo;</span>
              <ChevronRight className="w-3.5 h-3.5 text-emerald-500 dark:text-indigo-400 ml-auto flex-shrink-0" />
            </button>

            {/* Scenario 3: Insulin / Cinnamon */}
            <button
              id="demo-claim-2"
              onClick={() => {
                const claim = 'Stop insulin and use cinnamon instead.';
                setClaimInput(claim);
                handleAnalyze(claim);
              }}
              disabled={loading}
              className="text-xs px-3.5 py-2.5 rounded-xl border transition-all text-left flex items-center gap-2 cursor-pointer border-purple-200 dark:border-purple-800/60 bg-purple-50/70 hover:bg-purple-100 dark:bg-[#12143b]/90 dark:hover:bg-[#1b1c57] text-slate-800 dark:text-slate-200"
            >
              <Pill className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
              <span className="font-bold text-purple-700 dark:text-purple-400 whitespace-nowrap">Scenario 3:</span>
              <span className="truncate">&ldquo;Stop insulin and use cinnamon instead.&rdquo;</span>
              <ChevronRight className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400 ml-auto flex-shrink-0" />
            </button>

            {/* Scenario 4: Garlic */}
            <button
              id="demo-claim-3"
              onClick={() => {
                const claim = 'Garlic completely cures high blood pressure.';
                setClaimInput(claim);
                handleAnalyze(claim);
              }}
              disabled={loading}
              className="text-xs px-3.5 py-2.5 rounded-xl border transition-all text-left flex items-center gap-2 cursor-pointer border-amber-200 dark:border-blue-800/60 bg-amber-50/70 hover:bg-amber-100 dark:bg-[#0c1636]/90 dark:hover:bg-[#122250] text-slate-800 dark:text-slate-200"
            >
              <HeartPulse className="w-3.5 h-3.5 text-amber-600 dark:text-sky-400 flex-shrink-0" />
              <span className="font-bold text-amber-700 dark:text-sky-400 whitespace-nowrap">Scenario 4:</span>
              <span className="truncate">&ldquo;Garlic completely cures high blood pressure.&rdquo;</span>
              <ChevronRight className="w-3.5 h-3.5 text-amber-500 dark:text-sky-400 ml-auto flex-shrink-0" />
            </button>

            {/* Scenario 5: Vaccines */}
            <button
              id="demo-claim-4"
              onClick={() => {
                const claim = 'Childhood vaccines cause autism spectrum disorders.';
                setClaimInput(claim);
                handleAnalyze(claim);
              }}
              disabled={loading}
              className="text-xs px-3.5 py-2.5 rounded-xl border transition-all text-left flex items-center gap-2 cursor-pointer border-cyan-200 dark:border-teal-800/60 bg-cyan-50/70 hover:bg-cyan-100 dark:bg-[#071933]/90 dark:hover:bg-[#0c274d] text-slate-800 dark:text-slate-200"
            >
              <Shield className="w-3.5 h-3.5 text-cyan-600 dark:text-teal-400 flex-shrink-0" />
              <span className="font-bold text-cyan-700 dark:text-teal-400 whitespace-nowrap">Scenario 5:</span>
              <span className="truncate">&ldquo;Childhood vaccines cause autism spectrum disorders.&rdquo;</span>
              <ChevronRight className="w-3.5 h-3.5 text-cyan-500 dark:text-teal-400 ml-auto flex-shrink-0" />
            </button>

            {/* Scenario 6: Cold & fever / antibiotics */}
            <button
              id="demo-claim-5"
              onClick={() => {
                const claim = 'Cold and fever can be treated with antibiotics';
                setClaimInput(claim);
                handleAnalyze(claim);
              }}
              disabled={loading}
              className="text-xs px-3.5 py-2.5 rounded-xl border transition-all text-left flex items-center gap-2 cursor-pointer border-indigo-200 dark:border-blue-900/60 bg-indigo-50/70 hover:bg-indigo-100 dark:bg-[#091433]/90 dark:hover:bg-[#0f204d] text-slate-800 dark:text-slate-200"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-blue-400 flex-shrink-0" />
              <span className="font-bold text-indigo-700 dark:text-blue-400 whitespace-nowrap">Scenario 6:</span>
              <span className="truncate">&ldquo;Cold and fever can be treated with antibiotics&rdquo;</span>
              <ChevronRight className="w-3.5 h-3.5 text-indigo-500 dark:text-blue-400 ml-auto flex-shrink-0" />
            </button>
          </div>
        </div>
      </div>

      {/* Progress & Pipeline Step Indicator */}
      {loading && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-slate-900 dark:text-white animate-spin" />
              <span>Multi-Stage Explainable NLP & RAG Pipeline in Progress...</span>
            </div>
            <span>
              Step {currentStep} of {pipelineSteps.length}
            </span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-slate-900 dark:bg-white h-1.5 transition-all duration-300"
              style={{ width: `${(currentStep / pipelineSteps.length) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
            {pipelineSteps.map((step, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-lg text-[11px] border transition-all ${
                  idx + 1 === currentStep
                    ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-300 dark:border-sky-700 text-sky-800 dark:text-sky-200 font-semibold'
                    : idx + 1 < currentStep
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 text-emerald-700 dark:text-emerald-400'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold border border-current">
                    {idx + 1}
                  </span>
                  <span className="truncate">{step}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold">Assessment Interrupted</h4>
            <p className="mt-0.5 text-xs text-rose-700">{error}</p>
          </div>
        </div>
      )}

      {/* Detailed Claim Result Card */}
      {result && !loading && (
        <div id="claim-result-card" className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            {/* Verdict Header Banner */}
            <div className={`p-6 border-b ${getVerdictStyle(result.verdict).bg}`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 shadow-xs">
                    {getVerdictStyle(result.verdict).icon}
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider opacity-75">
                      Clinical Credibility Verdict
                    </span>
                    <h3 className="text-2xl font-black tracking-tight">{result.verdict}</h3>
                    <p className="mt-1 text-xs opacity-90 italic">
                      &ldquo;{result.claim}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Quantitative Metric Badges (AI Confidence vs Evidence Strength separation) */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* AI Confidence */}
                  <div className="bg-white dark:bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                    <span className="block text-[10px] uppercase font-bold text-slate-400">
                      AI Model Confidence
                    </span>
                    <span className="text-lg font-black text-slate-800 dark:text-slate-100">
                      {result.confidence}%
                    </span>
                  </div>

                  {/* Evidence Strength (Explicitly separate) */}
                  <div className="bg-white dark:bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                    <span className="block text-[10px] uppercase font-bold text-slate-400">
                      Evidence Strength
                    </span>
                    <span
                      className={`inline-block mt-0.5 px-2 py-0.5 rounded-md text-xs font-bold border ${getEvidenceStrengthBadge(
                        result.evidenceStrength
                      )}`}
                    >
                      {result.evidenceStrength}
                    </span>
                  </div>

                  {/* Potential Risk */}
                  <div className="bg-white dark:bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                    <span className="block text-[10px] uppercase font-bold text-slate-400">
                      Potential Clinical Risk
                    </span>
                    <span
                      className={`inline-block mt-0.5 px-2.5 py-0.5 rounded-md text-xs font-extrabold uppercase ${getRiskBadge(
                        result.riskLevel
                      )}`}
                    >
                      {result.riskLevel}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Structured Findings & Explanation */}
            <div className="p-6 space-y-6">
              {/* Critical Dangerous Cessation Warning Banner */}
              {result.isDangerousRequest && (
                <div className="bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 p-4 rounded-xl">
                  <div className="flex items-start gap-3">
                    <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-rose-900 dark:text-rose-200 text-sm">
                        CRITICAL SAFETY ALERT: Treatment Replacement / Cessation Hazard
                      </h4>
                      <p className="mt-1 text-xs text-rose-800 dark:text-rose-300 leading-relaxed">
                        This claim suggests discontinuing or substituting life-sustaining medical therapies (e.g. insulin, antihypertensives, chemotherapy). <strong>Do NOT stop prescribed medications.</strong> Unilateral cessation can cause acute physiological decompensation, permanent organ damage, or fatal outcomes. Consult your prescribing physician or seek emergency medical care.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Normalized Medical Concept & Entities */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Normalized Clinical Claim
                  </h4>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {result.normalizedClaim}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Extracted Biomedical Entities
                  </h4>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {result.entitiesExtracted.map((entity, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md text-xs font-medium bg-sky-100 dark:bg-sky-900/40 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800"
                      >
                        {entity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Explanation & What Evidence Says */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-sky-600" />
                    <span>Explainable Evaluation (Plain-Language Summary)</span>
                  </h4>
                  <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50/70 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                    {result.explanation}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    <span>What the Peer-Reviewed Medical Evidence Says</span>
                  </h4>
                  <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-indigo-50/40 dark:bg-indigo-950/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/40">
                    {result.whatEvidenceSays}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    <span>Recommended Clinical Action</span>
                  </h4>
                  <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-amber-50/40 dark:bg-amber-950/20 p-4 rounded-xl border border-amber-100 dark:border-amber-900/40 font-medium">
                    {result.recommendedAction}
                  </p>
                </div>
              </div>

              {/* Retrieved Sources Section */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                    <span>Retrieved Medical Literature & Clinical Guidelines ({result.sources.length})</span>
                  </h4>
                  <span className="text-xs text-slate-400">Grounded in RAG Corpus</span>
                </div>

                {result.sources.length === 0 ? (
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-center text-xs text-slate-500">
                    Insufficient reliable evidence was found in the indexed corpus to confidently assess this specific claim.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {result.sources.map((src, sIdx) => (
                      <div
                        key={sIdx}
                        className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-sky-300 dark:hover:border-sky-700 transition-all shadow-2xs"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                              {src.evidenceType}
                            </span>
                            {src.isPeerReviewed && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                Peer-Reviewed
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-400 font-mono">
                            Relevance: {Math.round(src.relevanceScore * 100)}%
                          </span>
                        </div>

                        <h5 className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
                          {src.title}
                        </h5>

                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                          {src.organization} &bull; {src.journal || 'Official Advisory'} &bull; Published:{' '}
                          {src.publicationDate}
                        </p>

                        <p className="mt-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                          {src.summary}
                        </p>

                        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                          <a
                            href={src.doiOrUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
                          >
                            <span>View Source / DOI Reference</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
