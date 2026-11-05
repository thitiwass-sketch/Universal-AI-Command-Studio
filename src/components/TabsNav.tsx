import React from 'react';
import { Terminal, BookOpen, GitMerge, CheckSquare, Layers, FolderKanban, Palette, AlertOctagon, Gauge } from 'lucide-react';

export type AppTab = 'studio' | 'commands' | 'workflows' | 'qa' | 'modes' | 'project' | 'designSystem' | 'defects' | 'performance';

interface TabsNavProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  language: 'th' | 'en';
}

export const TabsNav: React.FC<TabsNavProps> = ({ activeTab, onTabChange, language }) => {
  const tabs = [
    {
      id: 'studio' as AppTab,
      labelEn: 'Prompt Studio & CLI',
      labelTh: 'สตูดิโอคำสั่ง & CLI',
      icon: Terminal,
      badge: 'Bilingual Router',
    },
    {
      id: 'performance' as AppTab,
      labelEn: 'Command Performance',
      labelTh: 'ประสิทธิภาพ & สถิติ',
      icon: Gauge,
      badge: 'Recharts',
    },
    {
      id: 'commands' as AppTab,
      labelEn: '99 Canonical Commands',
      labelTh: 'สารบบ 99 คำสั่งมาตรฐาน',
      icon: BookOpen,
      badge: 'Contracts',
    },
    {
      id: 'workflows' as AppTab,
      labelEn: 'Canonical Workflows',
      labelTh: 'เวิร์กโฟลว์มาตรฐาน 6 ระบบ',
      icon: GitMerge,
      badge: 'Pipelines',
    },
    {
      id: 'qa' as AppTab,
      labelEn: '50-Point QA Gate',
      labelTh: 'ระบบตรวจคุณภาพ 50 จุด',
      icon: CheckSquare,
      badge: 'Audit Engine',
    },
    {
      id: 'modes' as AppTab,
      labelEn: '20 Auto Modes',
      labelTh: '20 โหมดอัตโนมัติ',
      icon: Layers,
      badge: 'Specialized',
    },
    {
      id: 'project' as AppTab,
      labelEn: 'Project Context Spec',
      labelTh: 'ข้อมูลโครงการ (Module 01)',
      icon: FolderKanban,
      badge: 'v2.0 Spec',
    },
    {
      id: 'designSystem' as AppTab,
      labelEn: 'Design System & Tokens',
      labelTh: 'ระบบออกแบบ (Module 05)',
      icon: Palette,
      badge: 'Tokens',
    },
    {
      id: 'defects' as AppTab,
      labelEn: 'Defect Register & Repair',
      labelTh: 'ทะเบียนบั๊ก & แก้ไข (Module 09)',
      icon: AlertOctagon,
      badge: 'P0-P3 Loop',
    },
  ];

  return (
    <div className="border-b border-slate-800/80 bg-[#080d18]/85 sticky top-[73px] z-30 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 sm:gap-1.5 overflow-x-auto scrollbar-none py-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer relative ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-200 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              <span>{language === 'th' ? tab.labelTh : tab.labelEn}</span>
              {tab.id === 'studio' && (
                <kbd
                  title="Keyboard shortcut: Ctrl+K / Cmd+K"
                  className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-900/90 text-cyan-300 border border-cyan-500/30 shadow-xs"
                >
                  Ctrl+K
                </kbd>
              )}
              {tab.badge && (
                <span
                  className={`hidden lg:inline-block text-[10px] font-mono tracking-tight ${
                    isActive ? 'text-cyan-400/90 font-medium' : 'text-slate-500'
                  }`}
                >
                  · {tab.badge}
                </span>
              )}
              {isActive && (
                <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
