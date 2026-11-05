import React from 'react';
import { X, Check, Sparkles } from 'lucide-react';
import { AUTO_MODES, AutoMode } from '../data/autoModes';

interface AutoModeSwitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMode: AutoMode;
  onSelectMode: (mode: AutoMode) => void;
  language: 'th' | 'en';
}

export const AutoModeSwitchModal: React.FC<AutoModeSwitchModalProps> = ({
  isOpen,
  onClose,
  currentMode,
  onSelectMode,
  language
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white font-mono">
              SWITCH AUTO MODE (20 AVAILABLE)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 overflow-y-auto space-y-1.5 max-h-[60vh]">
          {AUTO_MODES.map((mode) => {
            const isSelected = currentMode.id === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => {
                  onSelectMode(mode);
                  onClose();
                }}
                className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-200'
                    : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-slate-500">
                      #{String(mode.id).padStart(2, '0')}
                    </span>
                    <span className="font-mono font-bold text-xs text-white">
                      {mode.name}
                    </span>
                    <span className="text-xs text-slate-400">
                      ({mode.nameTh})
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {language === 'th' ? mode.descriptionTh : mode.description}
                  </p>
                </div>

                {isSelected && <Check className="w-4 h-4 text-cyan-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
