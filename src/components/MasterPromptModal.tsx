import React, { useState } from 'react';
import { X, Copy, Check, Download, Layers } from 'lucide-react';
import { MASTER_PROMPT_V6_1, MASTER_PROMPT_V2_0 } from '../data/masterPrompt';

interface MasterPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'th' | 'en';
}

export const MasterPromptModal: React.FC<MasterPromptModalProps> = ({
  isOpen,
  onClose,
  language
}) => {
  const [selectedVersion, setSelectedVersion] = useState<'v61' | 'v20'>('v61');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentContent = selectedVersion === 'v61' ? MASTER_PROMPT_V6_1 : MASTER_PROMPT_V2_0;
  const fileName =
    selectedVersion === 'v61'
      ? 'GEMINI_UNIVERSAL_AI_OS_V6.1_MASTER_PROMPT.md'
      : 'GEMINI_UI_UX_PRO_MAX_V2.0_MASTER_PROMPT.md';

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([currentContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-950/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                {selectedVersion === 'v61' ? 'MASTER PROMPT V6.1' : 'ENGINEERING OS V2.0'}
              </span>
              <h3 className="text-base font-bold text-white">
                {selectedVersion === 'v61'
                  ? 'GEMINI UNIVERSAL AI OS V6.1'
                  : 'GEMINI UI/UX PRO MAX v2.0'}
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              ผู้พัฒนาสร้างสรรค์: ฐิติวัสส์ กาญจนพิมาย • มหาวิทยาลัยราชภัฏนครราชสีมา (NRRU)
            </p>
          </div>

          {/* Version Switcher Pills */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setSelectedVersion('v61')}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                selectedVersion === 'v61'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              V6.1 Canonical OS
            </button>
            <button
              onClick={() => setSelectedVersion('v20')}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                selectedVersion === 'v20'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              v2.0 UI/UX PRO MAX
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Download as Markdown"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download .md</span>
            </button>

            <button
              onClick={handleCopy}
              className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-cyan-500/20"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Prompt'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Master Prompt Code Body */}
        <div className="p-4 sm:p-6 overflow-y-auto font-mono text-xs text-slate-200 leading-relaxed bg-slate-950/90 whitespace-pre-wrap select-text">
          {currentContent}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 font-mono">
          <span>
            {selectedVersion === 'v61'
              ? '99 Canonical Commands • 20 Auto Modes • 50-Point QA Gate'
              : 'Modules 00–14 • 17 Core Engines • 10-Stage Product Lifecycle • WCAG 2.2 AA'}
          </span>
          <span>Ready for direct paste into Gemini, Claude, or ChatGPT</span>
        </div>
      </div>
    </div>
  );
};
