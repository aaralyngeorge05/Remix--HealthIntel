/**
 * Application Navigation Header & Active Role Switcher
 * Exact styling matching HealthIntel Clinical Verification Dashboard
 */

import React, { useState } from 'react';
import {
  FileText,
  Search,
  BookOpen,
  Sun,
  Moon,
  User,
  ChevronDown,
  Check,
  LogIn,
  LogOut,
  TrendingUp,
  Shield,
  Home,
  UserCheck,
  ShieldCheck,
  Stethoscope,
  Download,
} from 'lucide-react';
import { UserRole } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  geminiActive: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  activeTab,
  setActiveTab,
  geminiActive,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { user, signInWithGoogle, signOut } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case 'healthcare_professional':
        return 'Clinician (MD)';
      case 'caregiver':
        return 'Caregiver';
      case 'general_user':
      default:
        return 'Guest User';
    }
  };

  return (
    <header className="bg-[#070e24]/95 dark:bg-[#070e24]/95 bg-white/95 backdrop-blur-md border-b border-slate-200 dark:border-blue-950/70 sticky top-0 z-40 transition-colors">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
        {/* Top Bar: Brand, Status, Theme, and User Profile */}
        <div className="flex items-center justify-between h-17">
          {/* Brand Logo & Title */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => setActiveTab('claim-checker')}
          >
            {/* Custom Cyan Shield with ECG Pulse matching screenshot */}
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-500 p-[1.5px] shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center justify-center flex-shrink-0">
              <div className="w-full h-full rounded-[10px] bg-[#07132e] dark:bg-[#07132e] bg-white flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-cyan-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M7 12h2.5l1.5-3 2 6 1.5-3H17" />
                </svg>
              </div>
            </div>

            <div>
              <div className="flex items-baseline">
                <span className="font-bold text-slate-900 dark:text-white text-xl tracking-tight">
                  Health
                </span>
                <span className="font-bold text-indigo-500 dark:text-indigo-400 text-xl tracking-tight">
                  Intel
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block tracking-tight font-normal -mt-0.5">
                Health Information Intelligence & Credibility Assessment System
              </p>
            </div>
          </div>

          {/* Right Action Bar: System Online, Theme Toggle, User Profile */}
          <div className="flex items-center gap-3">
            {/* Glowing System Online Badge */}
            <div className="flex items-center gap-2 px-1 text-xs font-medium">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 shadow-[0_0_8px_#10b981]" />
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium text-xs">
                System Online
              </span>
            </div>

            {/* Divider */}
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700/80 mx-1 hidden sm:block" />

            {/* Mode Switcher matching screenshot: Dark Mode / Light Mode with dropdown arrow */}
            <button
              id="theme-toggle-btn"
              type="button"
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              title="Toggle Light / Dark mode"
            >
              {theme === 'dark' ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-300" />
                  <span className="text-xs">Dark Mode</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-xs">Light Mode</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </>
              )}
            </button>

            {/* Whitepaper PDF Download Button */}
            <a
              href="/api/download-whitepaper"
              download="HealthIntel_Technical_Architecture_Whitepaper.pdf"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-sky-200 dark:border-sky-800/60 bg-sky-50/80 dark:bg-sky-950/40 hover:bg-sky-100 text-sky-700 dark:text-sky-300 text-xs font-medium transition-all shadow-2xs"
              title="Download Technical Architecture Whitepaper (PDF)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Whitepaper (PDF)</span>
            </a>

            {/* Divider */}
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700/80 mx-1 hidden sm:block" />

            {/* User Profile Pill & Dropdown */}
            <div className="relative">
              <button
                id="user-profile-btn"
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-[#0c183b] hover:bg-slate-50 dark:hover:bg-[#112250] text-slate-800 dark:text-slate-200 text-xs font-medium transition-all shadow-2xs cursor-pointer"
              >
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-5 h-5 rounded-full"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                    <User className="w-3 h-3 text-slate-600 dark:text-slate-300" />
                  </div>
                )}
                <span className="max-w-[110px] truncate">
                  {user ? (user.displayName || user.email?.split('@')[0]) : getRoleDisplayName(currentRole)}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {/* Role & Auth Dropdown Menu */}
              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#0b1638] border border-slate-200 dark:border-blue-900/60 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Active Clinical Role
                    </p>
                    <p className="text-xs font-semibold text-slate-900 dark:text-white mt-0.5">
                      {getRoleDisplayName(currentRole)}
                    </p>
                  </div>

                  <div className="p-1 space-y-0.5">
                    <button
                      onClick={() => {
                        onRoleChange('general_user');
                        setUserDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-colors ${
                        currentRole === 'general_user'
                          ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                        <span>General User</span>
                      </span>
                      {currentRole === 'general_user' && <Check className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => {
                        onRoleChange('caregiver');
                        setUserDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-colors ${
                        currentRole === 'caregiver'
                          ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-teal-500" />
                        <span>Caregiver</span>
                      </span>
                      {currentRole === 'caregiver' && <Check className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => {
                        onRoleChange('healthcare_professional');
                        setUserDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-colors ${
                        currentRole === 'healthcare_professional'
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Stethoscope className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Clinician (Doctor)</span>
                      </span>
                      {currentRole === 'healthcare_professional' && <Check className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800 p-1.5 mt-1">
                    {user ? (
                      <button
                        onClick={() => {
                          signOut();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out ({user.email?.split('@')[0]})</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          signInWithGoogle();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-indigo-600 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-xl transition-colors font-medium"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span>Sign In with Google</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Secondary Navigation Bar: Exactly matching the uploaded screenshot */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5 border-t border-slate-200/50 dark:border-blue-950/60 no-scrollbar text-xs">
          <button
            id="nav-claim-checker"
            onClick={() => setActiveTab('claim-checker')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'claim-checker'
                ? 'bg-gradient-to-r from-blue-500 via-indigo-600 to-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/50'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Health Claim Checker</span>
          </button>

          <button
            id="nav-document-upload"
            onClick={() => setActiveTab('document-upload')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'document-upload'
                ? 'bg-gradient-to-r from-blue-500 via-indigo-600 to-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/50'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Document Upload & OCR</span>
          </button>

          <button
            id="nav-patient-dashboard"
            onClick={() => setActiveTab('patient-dashboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'patient-dashboard'
                ? 'bg-gradient-to-r from-blue-500 via-indigo-600 to-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/50'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Patient & Illness Information</span>
          </button>

          <button
            id="nav-evidence-explorer"
            onClick={() => setActiveTab('evidence-explorer')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'evidence-explorer'
                ? 'bg-gradient-to-r from-blue-500 via-indigo-600 to-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Evidence Corpus</span>
          </button>

          <button
            id="nav-analysis-history"
            onClick={() => setActiveTab('analysis-history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'analysis-history'
                ? 'bg-gradient-to-r from-blue-500 via-indigo-600 to-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/50'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Audit Trail</span>
          </button>

          <button
            id="nav-safety-protocols"
            onClick={() => setActiveTab('safety-protocols')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'safety-protocols'
                ? 'bg-gradient-to-r from-blue-500 via-indigo-600 to-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/50'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Safety & Ethics</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
