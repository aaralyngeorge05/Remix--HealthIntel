/**
 * Feature 11: Analysis History & Audit Trail Component
 */

import React, { useState, useEffect } from 'react';
import {
  History,
  Search,
  Filter,
  AlertTriangle,
  FileText,
  CheckCircle2,
  Calendar,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { AnalysisHistoryItem } from '../types';

export const AnalysisHistoryView: React.FC = () => {
  const [historyItems, setHistoryItems] = useState<AnalysisHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/analysis/history');
      if (res.ok) {
        const data = await res.json();
        setHistoryItems(data);
      }
    } catch (e) {
      console.error('Failed to load history:', e);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = historyItems.filter((item) => {
    const matchesType = filterType === 'ALL' || item.type === filterType;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesType;

    return (
      matchesType &&
      (item.title.toLowerCase().includes(query) ||
        item.summary.toLowerCase().includes(query) ||
        item.verdictOrStatus.toLowerCase().includes(query))
    );
  });

  return (
    <div id="analysis-history-section" className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
                <History className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Clinical Intelligence & Claim Analysis Audit Trail
              </h2>
            </div>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
              Chronological log of verified claims, document entity extractions, and cross-document discrepancy audits.
            </p>
          </div>

          <div className="text-xs bg-slate-100 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
            <strong>Logged Assessments:</strong> {historyItems.length} Records
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search history by claim, document, or verdict..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="flex items-center gap-1.5">
            {['ALL', 'Claim Credibility', 'Document Extraction', 'Discrepancy Audit'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  filterType === type
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* History Items List */}
      <div className="space-y-3">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 hover:border-indigo-300 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {item.type}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    item.riskLevel === 'Critical'
                      ? 'bg-red-600 text-white'
                      : item.riskLevel === 'High'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200'
                      : item.riskLevel === 'Medium'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
                  }`}
                >
                  {item.riskLevel} Risk
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>{new Date(item.date).toLocaleString()}</span>
              </div>
            </div>

            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {item.title}
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {item.summary}
            </p>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 font-medium">Outcome:</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {item.verdictOrStatus}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Operator ID: {item.userId}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
