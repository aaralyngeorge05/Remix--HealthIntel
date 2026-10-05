/**
 * Features 6, 7, 8, 9, 10: Patient Summary, Missing Information,
 * Cross-Document Inconsistency Detection, and Doctor Questions
 */

import React, { useState } from 'react';
import {
  User,
  HeartPulse,
  Pill,
  AlertTriangle,
  HelpCircle,
  Calendar,
  FileText,
  Printer,
  Copy,
  Check,
  Stethoscope,
  Activity,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import { Patient, InconsistencyItem, MissingInformationItem, GeneratedQuestionItem } from '../types';

interface PatientSummaryViewProps {
  patients: Patient[];
  selectedPatientId: string;
  onSelectPatient: (id: string) => void;
}

export const PatientSummaryView: React.FC<PatientSummaryViewProps> = ({
  patients,
  selectedPatientId,
  onSelectPatient,
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'inconsistencies' | 'missing' | 'questions'>('inconsistencies');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const patient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  if (!patient) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200">
        <p className="text-sm text-slate-500">No patient records available.</p>
      </div>
    );
  }

  const handleCopyQuestion = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePrintQuestions = () => {
    window.print();
  };

  return (
    <div id="patient-summary-view" className="space-y-6">
      {/* Patient Header Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 flex items-center justify-center font-bold text-xl flex-shrink-0">
              {patient.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{patient.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  MRN: {patient.mrn}
                </span>
                {patient.inconsistencies.length > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-rose-600" />
                    <span>{patient.inconsistencies.length} Inconsistencies Flagged</span>
                  </span>
                )}
              </div>
              <div className="mt-1 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                <span>Age: <strong>{patient.age}</strong></span>
                <span>&bull;</span>
                <span>DOB: <strong>{patient.dateOfBirth}</strong></span>
                <span>&bull;</span>
                <span>Sex: <strong>{patient.sex}</strong></span>
                <span>&bull;</span>
                <span>Physician: <strong>{patient.primaryPhysician}</strong></span>
                <span>&bull;</span>
                <span>Indexed Records: <strong>{patient.documents.length}</strong></span>
              </div>
            </div>
          </div>

          {/* Patient Selector for switching between Demo Patients */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500 font-medium whitespace-nowrap">Switch Patient:</label>
            <select
              value={patient.id}
              onChange={(e) => onSelectPatient(e.target.value)}
              className="text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-sky-500"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.mrn})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="mt-6 flex space-x-2 border-t border-slate-100 dark:border-slate-800 pt-4 text-xs">
          <button
            id="tab-inconsistencies"
            onClick={() => setActiveTab('inconsistencies')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'inconsistencies'
                ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Cross-Doc Inconsistencies ({patient.inconsistencies.length})</span>
          </button>

          <button
            id="tab-missing-info"
            onClick={() => setActiveTab('missing')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'missing'
                ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-900'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Missing Information ({patient.missingInfo.length})</span>
          </button>

          <button
            id="tab-questions-doctor"
            onClick={() => setActiveTab('questions')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'questions'
                ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200 dark:border-sky-900'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Questions for Healthcare Provider ({patient.generatedQuestions.length})</span>
          </button>

          <button
            id="tab-clinical-summary"
            onClick={() => setActiveTab('summary')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'summary'
                ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Comprehensive Clinical Summary</span>
          </button>
        </div>
      </div>

      {/* TAB 1: CROSS-DOCUMENT INCONSISTENCIES */}
      {activeTab === 'inconsistencies' && (
        <div id="inconsistencies-panel" className="space-y-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                  <span>Cross-Document Clinical Inconsistency Detection</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Reconciles discrepancies across multiple health records (e.g. outpatient clinic prescriptions vs hospital discharge summaries).
                </p>
              </div>

              {/* Ethics Notice */}
              <div className="text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 max-w-sm">
                <strong>Communication Standard:</strong> Discrepancies are flagged neutrally as &ldquo;potential inconsistencies&rdquo; for clinician review — never as definitive fault.
              </div>
            </div>

            {patient.inconsistencies.length === 0 ? (
              <div className="p-8 text-center bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300">
                <ShieldCheck className="w-8 h-8 mx-auto text-emerald-600 mb-2" />
                <h4 className="font-bold text-sm">No Active Document Inconsistencies Detected</h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">
                  All cross-referenced medications, dosages, and allergy records appear concordant across uploaded patient files.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {patient.inconsistencies.map((inc: InconsistencyItem) => (
                  <div
                    key={inc.id}
                    className="p-5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/20 dark:bg-rose-950/10 shadow-2xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200 border border-rose-300">
                          {inc.category} Discrepancy
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white uppercase">
                          {inc.severity} Severity
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 font-mono">ID: {inc.id}</span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {inc.title}
                      </h4>
                      <p className="mt-1 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        {inc.description}
                      </p>
                    </div>

                    {/* Side-by-Side Comparison Container */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      {/* Document A Source */}
                      <div className="p-3.5 bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5 shadow-2xs">
                        <div className="flex items-center justify-between text-[11px] font-bold text-sky-700 dark:text-sky-300">
                          <span className="flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5" />
                            <span>Source Record A</span>
                          </span>
                          <span className="font-mono text-slate-400">Page {inc.sourceA.page}</span>
                        </div>
                        <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                          {inc.sourceA.documentName}
                        </div>
                        <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg text-xs font-mono text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60">
                          &ldquo;{inc.sourceA.excerpt}&rdquo;
                        </div>
                      </div>

                      {/* Document B Source */}
                      <div className="p-3.5 bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5 shadow-2xs">
                        <div className="flex items-center justify-between text-[11px] font-bold text-rose-700 dark:text-rose-300">
                          <span className="flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5" />
                            <span>Source Record B</span>
                          </span>
                          <span className="font-mono text-slate-400">Page {inc.sourceB.page}</span>
                        </div>
                        <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                          {inc.sourceB.documentName}
                        </div>
                        <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg text-xs font-mono text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60">
                          &ldquo;{inc.sourceB.excerpt}&rdquo;
                        </div>
                      </div>
                    </div>

                    {/* Clinical Verification Recommendation */}
                    <div className="p-3 bg-amber-50/70 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                      <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Recommended Clinical Step:</strong> {inc.verificationRecommendation}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MISSING INFORMATION */}
      {activeTab === 'missing' && (
        <div id="missing-info-panel" className="space-y-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-600" />
                <span>Clinical Missing Information Audit</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Identifies missing allergy reconciliations, dosage gaps, symptom durations, or absent follow-up timelines in uploaded records.
              </p>
            </div>

            <div className="space-y-3">
              {patient.missingInfo.map((miss: MissingInformationItem) => (
                <div
                  key={miss.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-amber-300 transition-all shadow-2xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-slate-500">
                      {miss.category}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        miss.severity === 'HIGH'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200 border border-rose-300'
                          : miss.severity === 'MEDIUM'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200 border border-amber-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {miss.severity} Priority
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {miss.item}
                  </h4>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    <strong>Clinical Significance:</strong> {miss.rationale}
                  </p>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs text-sky-700 dark:text-sky-400 font-medium">
                    <span className="font-semibold text-slate-500">Suggested Query:</span>
                    <span>&ldquo;{miss.recommendedQuery}&rdquo;</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: QUESTIONS FOR HEALTHCARE PROFESSIONAL */}
      {activeTab === 'questions' && (
        <div id="questions-panel" className="space-y-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-indigo-600" />
                  <span>Synthesized Questions for Your Healthcare Professional</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Generated from identified record discrepancies and missing data. Take these to your next consultation or pharmacist visit.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintQuestions}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print for Doctor Visit</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {patient.generatedQuestions.map((q: GeneratedQuestionItem) => (
                <div
                  key={q.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2 hover:border-sky-300 transition-all shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400">
                      {q.category}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        q.priority === 'HIGH'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200'
                          : q.priority === 'MEDIUM'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {q.priority} Priority
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                    &ldquo;{q.question}&rdquo;
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-500">
                    <span className="truncate max-w-md">Context: {q.context}</span>
                    <button
                      onClick={() => handleCopyQuestion(q.question, q.id)}
                      className="text-sky-600 hover:text-sky-700 flex items-center gap-1 font-medium ml-2"
                    >
                      {copiedId === q.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Question</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: COMPREHENSIVE CLINICAL SUMMARY */}
      {activeTab === 'summary' && (
        <div id="clinical-summary-panel" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Active Conditions */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <HeartPulse className="w-4 h-4 text-rose-500" />
              <span>Diagnosed Conditions ({patient.extractedInfo.conditions.length})</span>
            </h4>
            <div className="space-y-2 text-xs">
              {patient.extractedInfo.conditions.map((c, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{c.name}</span>
                  <span className="text-[10px] text-slate-400">{c.sourceDoc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Medications & Reconciliation Status */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Pill className="w-4 h-4 text-emerald-500" />
              <span>Current Medication Profile ({patient.extractedInfo.medications.length})</span>
            </h4>
            <div className="space-y-2 text-xs">
              {patient.extractedInfo.medications.map((m, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">{m.name}</span>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">{m.dosage}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Frequency: {m.frequency || 'As directed'} &bull; Purpose: {m.purpose || 'Therapeutic management'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Allergy Panel */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span>Documented Allergies & Sensitivities</span>
            </h4>
            {patient.extractedInfo.allergies.length > 0 ? (
              <div className="space-y-2 text-xs">
                {patient.extractedInfo.allergies.map((a, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200">
                    <div className="font-bold">{a.allergen}</div>
                    <div className="text-[11px] mt-0.5">Reaction: {a.reaction} (Severity: {a.severity})</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No allergies formally documented.</p>
            )}
          </div>

          {/* Diagnostic & Laboratory Indicators */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-sky-500" />
              <span>Laboratory & Diagnostic Panels</span>
            </h4>
            <div className="space-y-2 text-xs">
              {patient.extractedInfo.investigations.map((inv, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">{inv.testName}</span>
                    <span className="text-[10px] text-slate-400 ml-2">Ref: {inv.referenceRange}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {inv.result} {inv.unit}
                    </span>
                    {inv.flag === 'HIGH' && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200">
                        HIGH
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
