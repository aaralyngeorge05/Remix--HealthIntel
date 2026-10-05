/**
 * Feature 12: Healthcare Professional Review & Reconciliation Dashboard
 * Information-dense clinical interface for doctors, pharmacists, and nurse practitioners.
 */

import React, { useState } from 'react';
import {
  Stethoscope,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Search,
  Check,
  Building,
  User,
  Activity,
  ClipboardList,
  ShieldCheck,
} from 'lucide-react';
import { Patient, InconsistencyItem } from '../types';

interface HealthcareProDashboardProps {
  patients: Patient[];
  onSelectPatient: (id: string) => void;
}

export const HealthcareProDashboard: React.FC<HealthcareProDashboardProps> = ({
  patients,
  onSelectPatient,
}) => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || '');
  const [reconciledInconsistencies, setReconciledInconsistencies] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'discrepancies' | 'registry' | 'audit'>('discrepancies');
  const [doctorNotes, setDoctorNotes] = useState<Record<string, string>>({
    'incon-1': 'Attending confirmed patient was intentionally titrated from 500mg BID to 1000mg BID during hospital stay due to uncontrolled HbA1c (8.6%). Discontinue 500mg prescription.',
    'incon-2': 'URGENT: Penicillin allergy confirmed with patient. Augmentin cancelled. Substituted with Doxycycline 100mg BID.',
  });

  const activePatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  const totalInconsistencies = patients.reduce((acc, p) => acc + p.inconsistencies.length, 0);
  const totalMissingHigh = patients.reduce(
    (acc, p) => acc + p.missingInfo.filter((m) => m.severity === 'HIGH').length,
    0
  );

  const handleReconcile = async (inconsistencyId: string) => {
    setReconciledInconsistencies((prev) => ({
      ...prev,
      [inconsistencyId]: new Date().toLocaleTimeString(),
    }));

    try {
      await fetch('/api/inconsistencies/reconcile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inconsistencyId,
          doctorNotes: doctorNotes[inconsistencyId] || '',
          reconciledBy: 'Dr. Elena Rostova, MD',
        }),
      });
    } catch (e) {
      console.warn('Reconcile sync note:', e);
    }
  };

  return (
    <div id="clinician-dashboard-section" className="space-y-6">
      {/* Top Professional Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-slate-800 text-indigo-400 border border-slate-700">
                <Stethoscope className="w-6 h-6" />
              </span>
              <div>
                <h2 className="text-xl font-bold tracking-tight">
                  Clinical Reconciliation & Discrepancy Registry
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Dr. Elena Rostova, MD, FACP &bull; Metropolitan Health System & Clinical Review Board
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700/80 text-center">
              <span className="block text-[10px] uppercase font-bold text-slate-400">
                Active Patients
              </span>
              <span className="text-lg font-black text-white">{patients.length}</span>
            </div>
            <div className="bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700/80 text-center">
              <span className="block text-[10px] uppercase font-bold text-rose-400">
                Total Discrepancies
              </span>
              <span className="text-lg font-black text-rose-400">{totalInconsistencies}</span>
            </div>
            <div className="bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700/80 text-center">
              <span className="block text-[10px] uppercase font-bold text-amber-400">
                Missing High-Risk Items
              </span>
              <span className="text-lg font-black text-amber-400">{totalMissingHigh}</span>
            </div>
          </div>
        </div>

        {/* View selection tabs */}
        <div className="mt-6 flex space-x-2 border-t border-slate-800 pt-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('discrepancies')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'discrepancies'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Active Cross-Record Audits ({totalInconsistencies})
          </button>
          <button
            onClick={() => setActiveTab('registry')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'registry'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Patient Roster & Vitals
          </button>
        </div>
      </div>

      {/* Patient Selector Strip */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 overflow-x-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
          Current Focus:
        </span>
        <div className="flex space-x-2">
          {patients.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setSelectedPatientId(p.id);
                onSelectPatient(p.id);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedPatientId === p.id
                  ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-300 dark:border-sky-800'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              {p.name} ({p.mrn})
              {p.inconsistencies.length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-rose-600 text-white">
                  {p.inconsistencies.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ACTIVE CLINICAL DISCREPANCY RECONCILIATION */}
      {activeTab === 'discrepancies' && activePatient && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                  <span>Clinical Inconsistency Reconciliation Desk</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Review flagged discrepancies for {activePatient.name} (MRN: {activePatient.mrn}), enter clinical reconciliation orders, and verify chart concordance.
                </p>
              </div>
            </div>

            {activePatient.inconsistencies.length === 0 ? (
              <div className="p-8 text-center bg-emerald-50/40 border border-emerald-200 rounded-xl text-emerald-800">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600 mb-2" />
                <h4 className="font-bold text-sm">All Records Concordant</h4>
                <p className="text-xs text-emerald-700 mt-1">
                  No active discrepancies or allergy contraindications detected for this patient.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {activePatient.inconsistencies.map((inc: InconsistencyItem) => {
                  const isReconciled = Boolean(reconciledInconsistencies[inc.id]);

                  return (
                    <div
                      key={inc.id}
                      className={`p-5 rounded-xl border transition-all ${
                        isReconciled
                          ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                          : 'bg-white dark:bg-slate-800 border-rose-200 dark:border-rose-900/60 shadow-xs'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200 border border-rose-300">
                            {inc.category}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white uppercase">
                            {inc.severity} Severity
                          </span>
                          {isReconciled && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              <span>Reconciled at {reconciledInconsistencies[inc.id]}</span>
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400 font-mono">ID: {inc.id}</span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {inc.title}
                      </h4>
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {inc.description}
                      </p>

                      {/* Source Document Side-by-Side Comparison */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
                        <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                          <div className="flex items-center justify-between text-[11px] font-bold text-sky-700 dark:text-sky-300 mb-1">
                            <span>Document A: {inc.sourceA.documentName}</span>
                            <span>Page {inc.sourceA.page}</span>
                          </div>
                          <div className="p-2 bg-white dark:bg-slate-900 rounded font-mono text-xs text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800">
                            {inc.sourceA.excerpt}
                          </div>
                        </div>

                        <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                          <div className="flex items-center justify-between text-[11px] font-bold text-rose-700 dark:text-rose-300 mb-1">
                            <span>Document B: {inc.sourceB.documentName}</span>
                            <span>Page {inc.sourceB.page}</span>
                          </div>
                          <div className="p-2 bg-white dark:bg-slate-900 rounded font-mono text-xs text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800">
                            {inc.sourceB.excerpt}
                          </div>
                        </div>
                      </div>

                      {/* Clinician Reconciliation Note & Action Button */}
                      <div className="p-3.5 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100 dark:border-indigo-900/40 space-y-2">
                        <label className="block text-xs font-bold text-indigo-900 dark:text-indigo-200">
                          Physician / Clinical Pharmacist Reconciliation Action:
                        </label>
                        <textarea
                          rows={2}
                          value={doctorNotes[inc.id] || ''}
                          onChange={(e) =>
                            setDoctorNotes((prev) => ({ ...prev, [inc.id]: e.target.value }))
                          }
                          placeholder="Document clinical rationale, verified dose, or prescription replacement order..."
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[11px] text-slate-500">
                            Audit Trail: Verified against clinical chart &bull; Signature: Dr. Elena Rostova, MD
                          </span>

                          <button
                            onClick={() => handleReconcile(inc.id)}
                            disabled={isReconciled}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                              isReconciled
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{isReconciled ? 'Reconciliation Approved' : 'Approve & Reconcile'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* PATIENT ROSTER VIEW */}
      {activeTab === 'registry' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Active Patient Clinical Registry
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-3">Patient Name</th>
                  <th className="py-3 px-3">MRN</th>
                  <th className="py-3 px-3">Age/Sex</th>
                  <th className="py-3 px-3">Primary Diagnosis</th>
                  <th className="py-3 px-3">Discrepancies</th>
                  <th className="py-3 px-3">Missing Items</th>
                  <th className="py-3 px-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {patients.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                      {p.name}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-500">{p.mrn}</td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                      {p.age} y/o {p.sex}
                    </td>
                    <td className="py-3 px-3 text-slate-700 dark:text-slate-200">
                      {p.extractedInfo.conditions[0]?.name || 'Routine Evaluation'}
                    </td>
                    <td className="py-3 px-3">
                      {p.inconsistencies.length > 0 ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200">
                          {p.inconsistencies.length} Flagged
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          0 Detected
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        {p.missingInfo.length} Items
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => {
                          setSelectedPatientId(p.id);
                          setActiveTab('discrepancies');
                          onSelectPatient(p.id);
                        }}
                        className="font-bold text-indigo-600 hover:underline"
                      >
                        Inspect Audit &rarr;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
