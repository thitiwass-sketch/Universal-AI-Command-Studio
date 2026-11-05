import React from 'react';
import {
  Layers,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  Microscope,
  BookOpen,
  Users,
  Brain,
  Palette,
  Eye,
  Image as ImageIcon,
  Presentation,
  FileText,
  Code,
  Cpu,
  Kanban,
  CheckCircle,
  TrendingUp,
  BarChart,
  Compass,
  Files,
  ShieldCheck
} from 'lucide-react';
import { AUTO_MODES, AutoMode } from '../data/autoModes';

interface AutoModesDirectoryProps {
  currentMode: AutoMode;
  onSelectMode: (mode: AutoMode) => void;
  language: 'th' | 'en';
}

const ICON_MAP: Record<string, any> = {
  Sparkles,
  GraduationCap,
  Microscope,
  BookOpen,
  Users,
  Brain,
  Palette,
  Eye,
  Image: ImageIcon,
  Presentation,
  FileText,
  Code,
  Cpu,
  Kanban,
  CheckCircle,
  TrendingUp,
  BarChart,
  Compass,
  Files,
  ShieldCheck
};

export const AutoModesDirectory: React.FC<AutoModesDirectoryProps> = ({
  currentMode,
  onSelectMode,
  language
}) => {
  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              {language === 'th' ? 'สารบบ 20 โหมดอัตโนมัติ (20 Auto Modes Registry)' : '20 Auto Modes Registry (Section 6)'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {language === 'th'
                ? 'โหมดปฏิบัติการเฉพาะทาง กำหนดชุดความคิด ระบบคำสั่ง และคำแนะนำคำสั่งที่สอดคล้องกับเป้าหมายงาน'
                : 'Specialized behavioral modes orchestrating domain prompts, system directives, and optimal canonical commands.'}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
            <span className="px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-800/40">
              Active Mode: {currentMode.name}
            </span>
          </div>
        </div>
      </div>

      {/* Grid of 20 Modes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {AUTO_MODES.map((mode) => {
          const Icon = ICON_MAP[mode.icon] || Sparkles;
          const isActive = currentMode.id === mode.id;

          return (
            <div
              key={mode.id}
              className={`border rounded-2xl p-5 transition-all flex flex-col justify-between ${
                isActive
                  ? 'bg-cyan-950/30 border-cyan-500/70 shadow-xl shadow-cyan-950/40'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isActive
                          ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                          : 'bg-slate-800 text-cyan-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold text-slate-500 block">
                        MODE #{String(mode.id).padStart(2, '0')}
                      </span>
                      <h3 className="text-sm font-bold text-white font-mono">
                        {mode.name}
                      </h3>
                    </div>
                  </div>

                  {isActive && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                      CURRENT
                    </span>
                  )}
                </div>

                <div className="text-xs text-cyan-300/90 font-medium mb-1.5">
                  {language === 'th' ? mode.nameTh : mode.name}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {language === 'th' ? mode.descriptionTh : mode.description}
                </p>

                {/* System Directive */}
                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80 mb-3 text-[11px] text-slate-400 font-mono italic">
                  "{mode.systemDirective}"
                </div>

                {/* Recommended Commands */}
                <div className="flex items-center gap-1.5 flex-wrap mb-4">
                  <span className="text-[10px] text-slate-500 font-mono">Commands:</span>
                  {mode.recommendedCommands.map((rc, idx) => (
                    <span
                      key={idx}
                      className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-cyan-300 border border-slate-700/50"
                    >
                      {rc}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectMode(mode)}
                disabled={isActive}
                className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 cursor-default'
                    : 'bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200'
                }`}
              >
                {isActive ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Active in OS</span>
                  </>
                ) : (
                  <>
                    <span>Switch to {mode.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
