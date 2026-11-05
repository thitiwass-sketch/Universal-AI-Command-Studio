import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TabsNav, AppTab } from './components/TabsNav';
import { TerminalPromptStudio } from './components/TerminalPromptStudio';
import { CommandExplorer } from './components/CommandExplorer';
import { WorkflowEngine } from './components/WorkflowEngine';
import { QAGateInspector } from './components/QAGateInspector';
import { AutoModesDirectory } from './components/AutoModesDirectory';
import { ProjectContextView } from './components/ProjectContextView';
import { DesignSystemView } from './components/DesignSystemView';
import { DefectRegisterView } from './components/DefectRegisterView';
import { CommandPerformanceDashboard } from './components/CommandPerformanceDashboard';
import { MasterPromptModal } from './components/MasterPromptModal';
import { SystemInfoModal } from './components/SystemInfoModal';
import { AutoModeSwitchModal } from './components/AutoModeSwitchModal';
import { ExecutionHistoryModal } from './components/ExecutionHistoryModal';
import { AUTO_MODES, AutoMode } from './data/autoModes';
import { CommandContract } from './data/commands';
import { QAAuditResult } from './data/qaGates';
import { RotateCcw } from 'lucide-react';
import {
  auth,
  validateFirestoreConnection,
  getUserFavorites,
  toggleFavoriteInFirestore,
  SavedExecution
} from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('studio');
  const [currentMode, setCurrentMode] = useState<AutoMode>(AUTO_MODES[0]);
  const [language, setLanguage] = useState<'th' | 'en'>('th');

  // Firebase Auth & Cloud State
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Modals
  const [isMasterPromptOpen, setIsMasterPromptOpen] = useState(false);
  const [isSystemInfoOpen, setIsSystemInfoOpen] = useState(false);
  const [isModeSwitchOpen, setIsModeSwitchOpen] = useState(false);

  // Cross-component state
  const [studioInitialPrompt, setStudioInitialPrompt] = useState<string>('');
  const [latestAuditResult, setLatestAuditResult] = useState<QAAuditResult | null>(null);
  const [resetToast, setResetToast] = useState(false);
  const [focusInputTrigger, setFocusInputTrigger] = useState(0);

  // Global Keyboard Shortcut: Ctrl+K / Cmd+K focuses command input in TerminalPromptStudio regardless of active tab
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setActiveTab('studio');
        setFocusInputTrigger(prev => prev + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Validate connection to Firestore on boot per Firebase skill guidelines
  useEffect(() => {
    validateFirestoreConnection();
  }, []);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const favs = await getUserFavorites(currentUser.uid);
        setFavorites(favs);
      } else {
        // Local fallback
        const localFavs = localStorage.getItem('v61_favorites');
        if (localFavs) {
          try {
            setFavorites(JSON.parse(localFavs));
          } catch (e) {
            setFavorites([]);
          }
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleToggleFavorite = async (cmd: CommandContract) => {
    if (user) {
      const isAdded = await toggleFavoriteInFirestore(user.uid, {
        canonical: cmd.canonical,
        title: cmd.titleEn,
        category: cmd.category
      });
      setFavorites(prev =>
        isAdded ? [...prev, cmd.canonical] : prev.filter(c => c !== cmd.canonical)
      );
    } else {
      // Offline/Local storage fallback
      setFavorites(prev => {
        const next = prev.includes(cmd.canonical)
          ? prev.filter(c => c !== cmd.canonical)
          : [...prev, cmd.canonical];
        localStorage.setItem('v61_favorites', JSON.stringify(next));
        return next;
      });
    }
  };

  const handleSelectCommandFromExplorer = (cmd: CommandContract) => {
    setStudioInitialPrompt(`${cmd.canonical} `);
    setActiveTab('studio');
  };

  const handleLoadWorkflowToStudio = (prompt: string) => {
    setStudioInitialPrompt(prompt);
    setActiveTab('studio');
  };

  const handleLoadExecutionToStudio = (exec: SavedExecution) => {
    setStudioInitialPrompt(`${exec.command} ${exec.prompt}`);
    const foundMode = AUTO_MODES.find(m => m.name === exec.autoMode);
    if (foundMode) setCurrentMode(foundMode);
    setActiveTab('studio');
  };

  const handleNavigateToQA = (audit?: QAAuditResult) => {
    if (audit) setLatestAuditResult(audit);
    setActiveTab('qa');
  };

  const handleResetContext = () => {
    setStudioInitialPrompt('');
    setLatestAuditResult(null);
    setResetToast(true);
    setTimeout(() => setResetToast(false), 2500);
  };

  const handleTriggerRepairInStudio = (textToRepair: string) => {
    setStudioInitialPrompt(`[QA REPAIR] ${textToRepair}`);
    setActiveTab('studio');
  };

  return (
    <div className="min-h-screen bg-[#060913] bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(14,165,233,0.08),rgba(255,255,255,0))] text-slate-100 font-sans flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Reset Notification Toast */}
      {resetToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-cyan-950/95 border border-cyan-400 text-cyan-200 text-xs font-mono shadow-2xl flex items-center gap-2 animate-bounce">
          <RotateCcw className="w-3.5 h-3.5" />
          <span>
            {language === 'th'
              ? 'คำสั่ง /resetcontext ทำงานสำเร็จ: รีเซ็ตเวิร์กโฟลว์ปัจจุบันแล้ว'
              : '/resetcontext executed: Workflow context reset successfully.'}
          </span>
        </div>
      )}

      {/* Main OS Header */}
      <Header
        currentMode={currentMode}
        onOpenModeModal={() => setIsModeSwitchOpen(true)}
        onOpenMasterPromptModal={() => setIsMasterPromptOpen(true)}
        onOpenSystemInfoModal={() => setIsSystemInfoOpen(true)}
        onResetContext={handleResetContext}
        language={language}
        onToggleLanguage={() => setLanguage(l => (l === 'th' ? 'en' : 'th'))}
        user={user}
        onOpenHistory={() => setIsHistoryOpen(true)}
        favoritesCount={favorites.length}
        onFocusTerminal={() => {
          setActiveTab('studio');
          setFocusInputTrigger(prev => prev + 1);
        }}
      />

      {/* Navigation Tabs */}
      <TabsNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        language={language}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {activeTab === 'studio' && (
          <TerminalPromptStudio
            currentMode={currentMode}
            onSelectMode={setCurrentMode}
            language={language}
            onNavigateToQA={handleNavigateToQA}
            onNavigateToPerformance={() => setActiveTab('performance')}
            user={user}
            initialPrompt={studioInitialPrompt}
            focusTrigger={focusInputTrigger}
            key={studioInitialPrompt}
          />
        )}

        {activeTab === 'performance' && (
          <CommandPerformanceDashboard
            language={language}
            onRunCommandInStudio={handleLoadWorkflowToStudio}
          />
        )}

        {activeTab === 'commands' && (
          <CommandExplorer
            onSelectCommand={handleSelectCommandFromExplorer}
            language={language}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {activeTab === 'workflows' && (
          <WorkflowEngine
            onLoadToStudio={handleLoadWorkflowToStudio}
            language={language}
          />
        )}

        {activeTab === 'qa' && (
          <QAGateInspector
            initialAudit={latestAuditResult}
            onTriggerRepair={handleTriggerRepairInStudio}
            language={language}
          />
        )}

        {activeTab === 'modes' && (
          <AutoModesDirectory
            currentMode={currentMode}
            onSelectMode={(mode) => {
              setCurrentMode(mode);
              setActiveTab('studio');
            }}
            language={language}
          />
        )}

        {activeTab === 'project' && (
          <ProjectContextView
            language={language}
            onLoadToStudio={handleLoadWorkflowToStudio}
          />
        )}

        {activeTab === 'designSystem' && (
          <DesignSystemView
            language={language}
          />
        )}

        {activeTab === 'defects' && (
          <DefectRegisterView
            language={language}
            onTriggerRepair={handleTriggerRepairInStudio}
          />
        )}
      </main>

      {/* Global Modals */}
      <MasterPromptModal
        isOpen={isMasterPromptOpen}
        onClose={() => setIsMasterPromptOpen(false)}
        language={language}
      />

      <SystemInfoModal
        isOpen={isSystemInfoOpen}
        onClose={() => setIsSystemInfoOpen(false)}
        language={language}
      />

      <AutoModeSwitchModal
        isOpen={isModeSwitchOpen}
        onClose={() => setIsModeSwitchOpen(false)}
        currentMode={currentMode}
        onSelectMode={setCurrentMode}
        language={language}
      />

      <ExecutionHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        userId={user?.uid || null}
        onLoadExecution={handleLoadExecutionToStudio}
        language={language}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#070b14]/80 py-5 text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="font-bold text-slate-300">GEMINI UNIVERSAL AI OS V6.1</span>
            <span className="text-slate-700">·</span>
            <span>99 Canonical Commands</span>
            <span className="text-slate-700">·</span>
            <span>20 Auto Modes</span>
            <span className="text-slate-700">·</span>
            <span className="text-cyan-400 font-medium">50-Pt QA Gate</span>
          </div>
          <div className="text-center sm:text-right text-slate-400 font-sans text-xs">
            {language === 'th'
              ? 'ผู้พัฒนาสร้างสรรค์: ฐิติวัสส์ กาญจนพิมาย · มหาวิทยาลัยราชภัฏนครราชสีมา (NRRU)'
              : 'Creator: Thitiwas Kanchanaphimai · Nakhon Ratchasima Rajabhat University'}
          </div>
        </div>
      </footer>
    </div>
  );
}
