/**
 * Features 3, 4 & 5: Medical Document Upload, Processing, OCR, and Entity Extraction
 */

import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  FileCheck,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  FolderOpen,
  Eye,
  Shield,
} from 'lucide-react';
import { DocumentCategory, Patient, PatientDocument } from '../types';
import { SYNTHETIC_DOCUMENTS_PATIENT_A } from '../services/syntheticData';

interface DocumentUploaderProps {
  onDocumentProcessed?: (doc: PatientDocument, patient: Patient) => void;
  onSelectPatient?: (patientId: string) => void;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  onDocumentProcessed,
  onSelectPatient,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [category, setCategory] = useState<DocumentCategory>('Prescription');
  const [patientId, setPatientId] = useState('patient-a');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [processedDoc, setProcessedDoc] = useState<PatientDocument | null>(null);
  const [showRawText, setShowRawText] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories: DocumentCategory[] = [
    'Prescription',
    'Discharge Summary',
    'Blood Report',
    'Laboratory Report',
    'Consultation Note',
    'Medical History',
    'Diagnostic Report',
    'Medication List',
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    setErrorMessage(null);
    setUploadSuccess(null);
    setProcessedDoc(null);

    // Validate size (max 15MB)
    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage('File size exceeds the 15 MB limit.');
      return;
    }

    // Validate type
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'text/plain'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(pdf|jpe?g|png|txt)$/i)) {
      setErrorMessage('Unsupported format. Please upload a PDF, PNG, JPG, or TXT file.');
      return;
    }

    setSelectedFile(file);
  };

  const handleUploadAndProcess = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setErrorMessage(null);
    setUploadSuccess(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('patientId', patientId);
      formData.append('category', category);

      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.details || errData.error || 'Document processing failed.');
      }

      const data = await res.json();
      setProcessedDoc(data.document);
      setUploadSuccess(`Successfully extracted medical entities from ${selectedFile.name}`);
      if (onDocumentProcessed && data.document && data.patient) {
        onDocumentProcessed(data.document, data.patient);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error processing document.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Pre-load synthetic document for audit scenarios
  const handleLoadSyntheticDoc = async (index: number) => {
    const docData = SYNTHETIC_DOCUMENTS_PATIENT_A[index];
    if (!docData) return;

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Create a blob file from the synthetic document text
      const blob = new Blob([docData.extractedText], { type: 'text/plain' });
      const file = new File([blob], docData.filename, { type: 'text/plain' });

      setSelectedFile(file);
      setCategory(docData.category);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('patientId', 'patient-a');
      formData.append('category', docData.category);

      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to process synthetic document');

      const data = await res.json();
      setProcessedDoc(data.document);
      setUploadSuccess(`Pre-loaded benchmark document: ${docData.filename}`);
      if (onDocumentProcessed && data.document && data.patient) {
        onDocumentProcessed(data.document, data.patient);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error loading synthetic document');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div id="document-upload-section" className="space-y-6">
      {/* Overview Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200/70 dark:border-slate-700/70">
                <FileText className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Medical Document Processing & Information Extraction
              </h2>
            </div>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
              Extracts patient demographics, clinical conditions, medications, dosages, allergies, and investigations from uploaded records with strict source attribution (document name & page reference).
            </p>
          </div>

          {/* Privacy Limitation Badge */}
          <div className="flex items-center gap-2 text-xs bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
            <Shield className="w-4 h-4 text-slate-700 dark:text-slate-300 flex-shrink-0" />
            <span>
              <strong>Clinical Guard:</strong> Isolated in-memory extraction &bull; Zero hallucinated attributes.
            </span>
          </div>
        </div>

        {/* Clinical Scenario Quick Buttons */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-500 font-medium">
            <span>Standard Clinical Test Records (Discrepancy audit samples):</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleLoadSyntheticDoc(0)}
              disabled={isProcessing}
              className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium border border-slate-200/80 dark:border-slate-700 transition-all flex items-center gap-1.5"
            >
              <FolderOpen className="w-3.5 h-3.5 text-slate-500" />
              <span>Doc 1: Outpatient Prescription (Metformin 500mg, Penicillin Allergy)</span>
            </button>
            <button
              onClick={() => handleLoadSyntheticDoc(1)}
              disabled={isProcessing}
              className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium border border-slate-200/80 dark:border-slate-700 transition-all flex items-center gap-1.5"
            >
              <FolderOpen className="w-3.5 h-3.5 text-slate-500" />
              <span>Doc 2: Hospital Discharge (Metformin 1000mg, Augmentin Conflict)</span>
            </button>
          </div>
        </div>

        {/* Category & Patient Selector */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Assign to Patient Profile
            </label>
            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-sky-500"
            >
              <option value="patient-a">Robert Miller (Age: 56, MRN: RM-948210 - Type 2 Diabetes)</option>
              <option value="patient-b">Eleanor Campbell (Age: 71, MRN: EC-718293 - Osteoarthritis, Afib)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Document Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as DocumentCategory)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-sky-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dropzone Container */}
        <div
          id="document-dropzone"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`mt-4 border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/20'
              : 'border-slate-300 dark:border-slate-700 hover:border-sky-400 bg-slate-50/50 dark:bg-slate-800/30'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.txt"
            onChange={(e) => e.target.files && e.target.files[0] && handleFileSelection(e.target.files[0])}
            className="hidden"
          />

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-900/50 text-sky-600 flex items-center justify-center mb-3">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {selectedFile ? selectedFile.name : 'Click to upload or drag & drop medical document'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Supports PDF, PNG, JPG, JPEG, and TXT (Max 15MB)
            </p>
            {selectedFile && (
              <span className="mt-2 text-xs font-mono px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300">
                {(selectedFile.size / 1024).toFixed(1)} KB &bull; Type: {selectedFile.type || 'plain/text'}
              </span>
            )}
          </div>
        </div>

        {/* Upload Trigger Button */}
        {selectedFile && (
          <div className="mt-4 flex justify-end">
            <button
              id="process-doc-btn"
              onClick={handleUploadAndProcess}
              disabled={isProcessing}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-xs font-semibold shadow-xs disabled:opacity-50 flex items-center gap-2 transition-all cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-teal-400 dark:text-teal-600" />
                  <span>Extracting Clinical Entities...</span>
                </>
              ) : (
                <>
                  <FileCheck className="w-4 h-4" />
                  <span>Extract & Reconcile Information</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Success / Error Banners */}
        {uploadSuccess && (
          <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{uploadSuccess}</span>
            </div>
            {onSelectPatient && (
              <button
                onClick={() => onSelectPatient(patientId)}
                className="font-bold underline ml-2 hover:opacity-80"
              >
                View Patient Summary &rarr;
              </button>
            )}
          </div>
        )}

        {errorMessage && (
          <div className="mt-4 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Extracted Document Information Preview */}
      {processedDoc && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Extracted Medical Entities: {processedDoc.filename}
              </h3>
            </div>
            <button
              onClick={() => setShowRawText(!showRawText)}
              className="text-xs text-sky-600 hover:underline flex items-center gap-1 font-medium"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showRawText ? 'Hide Raw Text' : 'View Extracted Text'}</span>
            </button>
          </div>

          {showRawText && (
            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl font-mono text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap max-h-60 overflow-y-auto border border-slate-200 dark:border-slate-700">
              {processedDoc.extractedText}
            </div>
          )}

          {/* Structured Clinical Entities Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Medications */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Medications & Dosages ({processedDoc.extractedInfo?.medications?.length || 0})
              </h4>
              {processedDoc.extractedInfo?.medications && processedDoc.extractedInfo.medications.length > 0 ? (
                <div className="space-y-2">
                  {processedDoc.extractedInfo.medications.map((m, i) => (
                    <div key={i} className="text-xs bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                      <div className="font-bold text-slate-900 dark:text-white">{m.name}</div>
                      <div className="text-slate-600 dark:text-slate-300">
                        Dosage: <strong>{m.dosage}</strong> {m.frequency ? `(${m.frequency})` : ''}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 italic">
                        Source: {m.sourceDoc} (Page {m.page})
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">Not available in provided records.</p>
              )}
            </div>

            {/* Allergies */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Documented Allergies ({processedDoc.extractedInfo?.allergies?.length || 0})
              </h4>
              {processedDoc.extractedInfo?.allergies && processedDoc.extractedInfo.allergies.length > 0 ? (
                <div className="space-y-2">
                  {processedDoc.extractedInfo.allergies.map((a, i) => (
                    <div key={i} className="text-xs bg-rose-50 dark:bg-rose-950/40 p-2.5 rounded-lg border border-rose-200 dark:border-rose-900/60 text-rose-900 dark:text-rose-200">
                      <div className="font-bold">{a.allergen}</div>
                      <div className="text-[11px]">{a.reaction || 'Hypersensitivity reaction'}</div>
                      <div className="text-[10px] opacity-75 mt-1">
                        Source: {a.sourceDoc} (Page {a.page})
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                  ⚠️ Not documented in this record (Flagged for verification).
                </p>
              )}
            </div>

            {/* Clinical Conditions */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Diagnoses & Conditions ({processedDoc.extractedInfo?.conditions?.length || 0})
              </h4>
              {processedDoc.extractedInfo?.conditions && processedDoc.extractedInfo.conditions.length > 0 ? (
                <ul className="space-y-1 text-xs">
                  {processedDoc.extractedInfo.conditions.map((c, i) => (
                    <li key={i} className="flex items-center justify-between bg-white dark:bg-slate-800 p-2 rounded-md border border-slate-200 dark:border-slate-700">
                      <span className="font-medium text-slate-800 dark:text-slate-200">{c.name}</span>
                      <span className="text-[10px] text-slate-400">p.{c.page}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-400 italic">Not available in provided records.</p>
              )}
            </div>

            {/* Investigations / Labs */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Laboratory Findings ({processedDoc.extractedInfo?.investigations?.length || 0})
              </h4>
              {processedDoc.extractedInfo?.investigations && processedDoc.extractedInfo.investigations.length > 0 ? (
                <div className="space-y-1.5 text-xs">
                  {processedDoc.extractedInfo.investigations.map((inv, i) => (
                    <div key={i} className="flex items-center justify-between bg-white dark:bg-slate-800 p-2 rounded-md border border-slate-200 dark:border-slate-700">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{inv.testName}</span>
                      <span className="font-mono text-slate-900 dark:text-white">
                        {inv.result} {inv.unit}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">Not available in provided records.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
