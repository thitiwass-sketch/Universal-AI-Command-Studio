import React from 'react';
import { Sparkles, Terminal, Copy, RotateCcw, Info, Sliders, Globe } from 'lucide-react';
import { AutoMode } from '../data/autoModes';
import { AuthUserMenu } from './AuthUserMenu';
import { User } from 'firebase/auth';

interface HeaderProps {
  currentMode: AutoMode;
  onOpenModeModal: () => void;
  onOpenMasterPromptModal: () => void;
  onOpenSystemInfoModal: () => void;
  onResetContext: () => void;
  language: 'th' | 'en';
  onToggleLanguage: () => void;
  user: User | null;
  onOpenHistory: () => void;
  favoritesCount: number;
  onFocusTerminal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onOpenModeModal,
  onOpenMasterPromptModal,
  onOpenSystemInfoModal,
  onResetContext,
  language,
  onToggleLanguage,
  user,
  onOpenHistory,
  favoritesCount
}) => {
  return (
    <header className="border-b border-slate-800 bg-[#070b14]/95 backdrop-blur-xl sticky top-0 z-40">
      {/* Top Utility Bar: Developer Attribution (Left) & Sign In + Language Toggle at Top-Right */}
      <div className="bg-[#050811] px-4 py-1.5 border-b border-slate-800/90 text-xs flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] font-bold text-cyan-300 tracking-wider uppercase px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-800/70">
            NRRU · AI Studio
          </span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-200 text-xs font-medium">
            {language === 'th'
              ? 'ผู้พัฒนาสร้างสรรค์: ฐิติวัสส์ กาญจนพิมาย · มหาวิทยาลัยราชภัฏนครราชสีมา'
              : 'Creator: Thitiwas Kanchanaphimai · Nakhon Ratchasima Rajabhat University'}
          </span>
        </div>

        {/* Global Standard Top-Right: System Stats, Language Toggle & Sign In */}
        <div className="flex items-center gap-2.5 ml-auto">
          <div className="hidden lg:flex items-center gap-2 text-[11px] text-slate-300 font-mono pr-2.5 border-r border-slate-700/80">
            <span className="flex items-center gap-1.5 text-emerald-300 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              99 Commands
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-300">20 Modes</span>
            <span className="text-slate-600">·</span>
            <span className="text-cyan-300 font-semibold">50-Pt QA Gate</span>
          </div>

          {/* Language Toggle (TH / EN) with High Contrast */}
          <button
            onClick={onToggleLanguage}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 hover:bg-slate-800 text-xs text-slate-100 font-medium transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
            title="Toggle Language Display (TH / EN)"
            aria-label={`Toggle language. Current language is ${language.toUpperCase()}`}
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono font-bold text-white tracking-wider">{language.toUpperCase()}</span>
          </button>

          {/* User Sign In / Account Menu - Anchored at the Top Right */}
          <AuthUserMenu
            user={user}
            onOpenHistory={onOpenHistory}
            favoritesCount={favoritesCount}
            language={language}
          />
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Title & Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 p-[1px] shadow-md shadow-cyan-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-[#080d1a] rounded-[11px] flex items-center justify-center">
              <Terminal className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                Universal AI Command Studio—NRRU
                <span className="text-xs font-mono text-cyan-300 font-semibold tracking-wider bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-800/80">
                  V6.1
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-300 font-normal">
              {language === 'th'
                ? 'ระบบปฏิบัติการปัญญาประดิษฐ์แบบบูรณาการ 2 ภาษา (Bilingual Master Prompt)'
                : 'Bilingual Canonical OS Layer with Smart Router & QA Gate'}
            </p>
          </div>
        </div>

        {/* Grouped Controls: Mode Selector & Master Prompt in one cohesive unit */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Grouped Mode Selector + Master Prompt Toolbar */}
          <div className="flex items-center bg-slate-900/90 border border-slate-700/80 rounded-xl p-1 gap-1 shadow-sm">
            {/* Active Auto Mode Trigger */}
            <button
              onClick={onOpenModeModal}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-800 text-xs font-medium text-slate-100 transition-all cursor-pointer group focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
              title="Switch Auto Mode (20 Available)"
              aria-label={`Current Auto Mode: ${currentMode.name}. Click to switch mode.`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
              <span className="text-slate-400 text-xs">Mode:</span>
              <span className="font-semibold text-cyan-300 font-mono">{currentMode.name}</span>
              <Sliders className="w-3 h-3 text-slate-400" />
            </button>

            <div className="w-[1px] h-4 bg-slate-700 mx-0.5" aria-hidden="true" />

            {/* Master Prompt Button */}
            <button
              onClick={onOpenMasterPromptModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-600/50 hover:border-cyan-400 text-xs font-semibold text-cyan-200 hover:text-white transition-all cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
              aria-label="Open Master Prompt V6.1 specification"
            >
              <Copy className="w-3.5 h-3.5 text-cyan-400" />
              <span>Master Prompt</span>
            </button>
          </div>

          {/* Quick Context Actions */}
          <div className="flex items-center gap-1.5">
            {/* Reset Context */}
            <button
              onClick={onResetContext}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:bg-rose-950/40 hover:border-rose-500/60 text-xs text-slate-200 hover:text-rose-200 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none"
              title="/resetcontext (Resets active workflow context, preserves user settings)"
              aria-label="Reset active workflow context"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline font-mono font-medium">/resetcontext</span>
            </button>

            {/* System Info */}
            <button
              onClick={onOpenSystemInfoModal}
              className="p-2 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-cyan-500/60 text-slate-300 hover:text-white transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
              title="System Status & Roadmap"
              aria-label="System status & architecture information"
            >
              <Info className="w-4 h-4 text-cyan-400" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
