/**
 * AI-Powered Health Information Intelligence & Credibility Assessment System
 * Main Application Component (React + Vite + Tailwind + Gemini AI Engine)
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SafetyDisclaimer } from './components/SafetyDisclaimer';
import { ClaimChecker } from './components/ClaimChecker';
import { DocumentUploader } from './components/DocumentUploader';
import { PatientSummaryView } from './components/PatientSummaryView';
import { HealthcareProDashboard } from './components/HealthcareProDashboard';
import { EvidenceExplorer } from './components/EvidenceExplorer';
import { AnalysisHistoryView } from './components/AnalysisHistoryView';
import { SafetyModal } from './components/SafetyModal';
import { Patient, UserRole, PatientDocument } from './types';
import { SYNTHETIC_PATIENTS } from './services/syntheticData';
import {
  Sparkles,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  Search,
  FileText,
} from 'lucide-react';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('general_user');
  const [activeTab, setActiveTab] = useState<string>('claim-checker');
  const [patients, setPatients] = useState<Patient[]>(SYNTHETIC_PATIENTS);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('patient-a');
  const [geminiActive, setGeminiActive] = useState<boolean>(true);
  const [resetSuccess, setResetSuccess] = useState<boolean>(false);

  // Fetch initial patients from server
  useEffect(() => {
    fetchPatients();
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setGeminiActive(data.geminiConfigured);
      }
    } catch (e) {
      console.warn('Server health check delayed:', e);
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await fetch('/api/patients');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setPatients(data);
        }
      }
    } catch (e) {
      console.warn('Using client-side synthetic patients fallback:', e);
    }
  };

  const handleDocumentProcessed = (doc: PatientDocument, updatedPatient: Patient) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === updatedPatient.id ? updatedPatient : p))
    );
  };

  const handleResetData = async () => {
    try {
      await fetch('/api/synthetic/reset', { method: 'POST' });
      await fetchPatients();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    } catch (e) {
      console.error('Reset failed:', e);
    }
  };

  const handleRoleChange = (newRole: UserRole) => {
    setCurrentRole(newRole);
    if (newRole === 'healthcare_professional') {
      setActiveTab('clinician-dashboard');
    } else if (newRole === 'caregiver') {
      setActiveTab('patient-dashboard');
    } else {
      setActiveTab('claim-checker');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fbff] dark:bg-[#060c1f] text-slate-900 dark:text-slate-100 flex flex-col antialiased relative selection:bg-cyan-500 selection:text-white transition-colors duration-200">
      {/* Background Ambient Glows */}
      <div className="pointer-events-none fixed -top-32 left-1/4 w-[500px] h-[500px] bg-blue-500/5 dark:bg-cyan-500/8 rounded-full blur-[120px]" />
      <div className="pointer-events-none fixed top-1/3 -right-32 w-[500px] h-[500px] bg-indigo-500/5 dark:bg-indigo-600/8 rounded-full blur-[140px]" />

      {/* Navigation Header matching screenshot */}
      <Header
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        geminiActive={geminiActive}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-6 space-y-6 relative z-10">
        {/* Clinical Verification & Audit Suite Hero Banner matching screenshot */}
        <div className="rounded-2xl border border-sky-200/80 dark:border-blue-500/20 bg-gradient-to-r from-[#f0f8ff] via-[#e2f1fe] to-[#f4f2ff] dark:from-[#0a1538] dark:via-[#0d2258] dark:to-[#0a1538] p-6 sm:p-7 shadow-xs dark:shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Subtle decorative background wave line */}
          <div className="pointer-events-none absolute inset-0 opacity-25 dark:opacity-20">
            <svg className="w-full h-full" viewBox="0 0 1200 160" fill="none" preserveAspectRatio="none">
              <path
                d="M0,80 C300,140 600,20 900,90 C1050,120 1150,50 1200,70"
                stroke="url(#gradient-wave)"
                strokeWidth="2.5"
                fill="none"
              />
              <defs>
                <linearGradient id="gradient-wave" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="#6366f1" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.2" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Left: Emblem + Heading */}
          <div className="flex items-center gap-5 relative z-10">
            {/* High-tech glowing circular emblem with concentric rings */}
            <div className="relative w-16 h-16 sm:w-18 sm:h-18 flex-shrink-0 flex items-center justify-center">
              {/* Outer thin ring */}
              <div className="absolute inset-0 rounded-full border border-cyan-400/30 dark:border-cyan-400/40" />
              {/* Outer orbit dot */}
              <div className="absolute -top-0.5 left-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
              <div className="absolute -bottom-0.5 right-1/4 w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_6px_#2dd4bf]" />
              {/* Middle dashed ring */}
              <div className="absolute inset-2 rounded-full border border-dashed border-cyan-400/30" />
              {/* Inner glow aura */}
              <div className="absolute inset-3 rounded-full bg-cyan-400/20 blur-md" />

              {/* Center shield badge with pulse */}
              <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-cyan-400 via-teal-400 to-cyan-500 flex items-center justify-center shadow-[0_0_18px_rgba(6,182,212,0.5)]">
                <svg
                  className="w-6 h-6 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M7 12h2.5l1.5-3 2 6 1.5-3H17" />
                </svg>
              </div>
            </div>

            {/* Title & Description */}
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5 flex-wrap">
                <span>Clinical Verification &</span>
                <span className="bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent font-bold">
                  Audit Suite
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl mt-1 leading-relaxed">
                Interactive AI system for health claim verification, medical document analysis and cross-referenced evidence with clinical guidelines.
              </p>
            </div>
          </div>

          {/* Right: CTA Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 relative z-10 w-full lg:w-auto">
            {/* Primary Action Button (Evaluate Health Claim) */}
            <button
              id="hero-evaluate-claim-btn"
              onClick={() => {
                setActiveTab('claim-checker');
              }}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-400 text-white font-semibold text-xs sm:text-sm shadow-[0_4px_16px_rgba(99,102,241,0.35)] hover:shadow-[0_6px_22px_rgba(6,182,212,0.45)] transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99] whitespace-nowrap"
            >
              <Search className="w-4 h-4" />
              <span>Evaluate Health Claim</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </button>

            {/* Secondary Action Button (Audit Patient Records) */}
            <button
              id="hero-audit-records-btn"
              onClick={() => {
                setActiveTab('patient-dashboard');
                setSelectedPatientId('patient-a');
              }}
              className="px-5 py-3 rounded-xl border border-slate-300/90 dark:border-blue-400/30 bg-white/90 dark:bg-blue-950/40 text-slate-800 dark:text-blue-100 hover:bg-white dark:hover:bg-blue-900/40 font-medium text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs whitespace-nowrap"
            >
              <FileText className="w-4 h-4" />
              <span>Audit Patient Records</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </button>

            {/* Reset Button */}
            <button
              onClick={handleResetData}
              className="p-3 rounded-xl border border-slate-300/80 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer shadow-2xs"
              title="Reset synthetic test records to baseline state"
            >
              <RefreshCw className={`w-4 h-4 ${resetSuccess ? 'text-teal-400 animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {resetSuccess && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Synthetic clinical benchmark dataset reset to baseline state.</span>
          </div>
        )}

        {/* Tab 1: Health Claim Credibility Checker */}
        {activeTab === 'claim-checker' && <ClaimChecker />}

        {/* Tab 2: Medical Document Upload & Extraction */}
        {activeTab === 'document-upload' && (
          <DocumentUploader
            onDocumentProcessed={handleDocumentProcessed}
            onSelectPatient={(id) => {
              setSelectedPatientId(id);
              setActiveTab('patient-dashboard');
            }}
          />
        )}

        {/* Tab 3: Patient & Inconsistency View */}
        {activeTab === 'patient-dashboard' && (
          <PatientSummaryView
            patients={patients}
            selectedPatientId={selectedPatientId}
            onSelectPatient={setSelectedPatientId}
          />
        )}

        {/* Tab 4: Healthcare Professional Dashboard */}
        {activeTab === 'clinician-dashboard' && (
          <HealthcareProDashboard
            patients={patients}
            onSelectPatient={setSelectedPatientId}
          />
        )}

        {/* Tab 5: Biomedical Evidence RAG Corpus */}
        {activeTab === 'evidence-explorer' && <EvidenceExplorer />}

        {/* Tab 6: Analysis History */}
        {activeTab === 'analysis-history' && <AnalysisHistoryView />}

        {/* Tab 7: Safety & Ethics Protocols */}
        {activeTab === 'safety-protocols' && <SafetyModal />}
      </main>

      {/* Footer with Clinical Provenance & Disclaimer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 mt-12 text-xs text-slate-500">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-slate-700 dark:text-slate-300">
              AI-Powered Health Information Intelligence & Credibility Assessment System
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Clinical Evidence Intelligence System &bull; Multi-Layer Retrieval-Augmented Verification Engine
            </p>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setActiveTab('safety-protocols')}
              className="hover:text-slate-800 dark:hover:text-slate-200 underline cursor-pointer"
            >
              Clinical Boundaries & Ethics
            </button>
            <span>&bull;</span>
            <button
              onClick={() => setActiveTab('evidence-explorer')}
              className="hover:text-slate-800 dark:hover:text-slate-200 underline cursor-pointer"
            >
              Evidence Corpus
            </button>
            <span>&bull;</span>
            <span>Zero Unverified Diagnostic Claims</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
