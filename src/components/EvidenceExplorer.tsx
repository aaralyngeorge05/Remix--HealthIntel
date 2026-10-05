/**
 * Feature 2 & 14: Evidence Explorer (RAG Clinical Knowledge Base)
 * Explores peer-reviewed systematic reviews, RCTs, and clinical guidelines.
 */

import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  ExternalLink,
  Filter,
  CheckCircle2,
  Calendar,
  Building,
  RotateCcw,
} from 'lucide-react';
import { MEDICAL_EVIDENCE_CORPUS } from '../services/ragEvidenceService';
import { EvidenceSource } from '../types';

export const EvidenceExplorer: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  const evidenceTypes = [
    'ALL',
    'Systematic Review',
    'Meta-Analysis',
    'Clinical Practice Guideline',
    'Randomized Controlled Trial (RCT)',
    'Institutional Health Advisory',
  ];

  const filteredEvidence = MEDICAL_EVIDENCE_CORPUS.filter((item: EvidenceSource) => {
    const matchesType = selectedType === 'ALL' || item.evidenceType.includes(selectedType);
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesType;

    const matchesText =
      item.title.toLowerCase().includes(query) ||
      item.summary.toLowerCase().includes(query) ||
      item.organization.toLowerCase().includes(query) ||
      (item.journal && item.journal.toLowerCase().includes(query));

    return matchesType && matchesText;
  });

  return (
    <div id="evidence-explorer-section" className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300">
                <BookOpen className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Biomedical Evidence Corpus & RAG Knowledge Base
              </h2>
            </div>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
              Curated evidence database utilized by the Retrieval-Augmented Generation (RAG) engine. Indexed from Cochrane Reviews, ADA Guidelines, ACC/AHA, WHO, CDC, FDA, and major medical journals.
            </p>
          </div>

          <div className="text-xs bg-slate-100 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
            <span><strong>Indexed Documents:</strong> {MEDICAL_EVIDENCE_CORPUS.length} Verified Sources</span>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search evidence by condition, drug, author, or keyword (e.g. insulin, metformin, vitamin c, cancer)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-sky-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {evidenceTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  selectedType === type
                    ? 'bg-sky-600 text-white border-sky-600 shadow-2xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Evidence Cards List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>Displaying {filteredEvidence.length} Evidence Sources</span>
          <span>Quality Standard: Peer-Reviewed & Clinical Guidelines</span>
        </div>

        {filteredEvidence.map((item: EvidenceSource) => (
          <div
            key={item.id}
            className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-sky-300 transition-all space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200">
                  {item.evidenceType}
                </span>
                {item.isPeerReviewed && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Peer-Reviewed</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{item.publicationDate}</span>
                </span>
                <span>&bull;</span>
                <span className="font-mono text-[11px]">{item.id}</span>
              </div>
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
              {item.title}
            </h3>

            <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1 text-sky-700 dark:text-sky-400">
                <Building className="w-3.5 h-3.5" />
                <span>{item.organization}</span>
              </span>
              {item.journal && (
                <>
                  <span>&bull;</span>
                  <span className="italic text-slate-500">{item.journal}</span>
                </>
              )}
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50/60 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
              {item.summary}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {item.evidenceType}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
                  Ref: {item.id}
                </span>
              </div>

              <a
                href={item.doiOrUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline"
              >
                <span>External DOI & Document Access</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
