import React, { useState } from 'react';
import {
  Palette,
  Type,
  Maximize2,
  Box,
  Layers,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  Sliders,
  Eye,
  Activity
} from 'lucide-react';
import {
  DESIGN_TOKENS,
  COMPONENT_CONTRACTS,
  ComponentContract
} from '../data/designSystemTokens';

interface DesignSystemViewProps {
  language: 'th' | 'en';
}

export const DesignSystemView: React.FC<DesignSystemViewProps> = ({ language }) => {
  const [activeSection, setActiveSection] = useState<'tokens' | 'components'>('components');
  const [selectedComponent, setSelectedComponent] = useState<ComponentContract>(COMPONENT_CONTRACTS[0]);
  const [previewState, setPreviewState] = useState<string>('Default');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const handleCopyToken = (name: string) => {
    navigator.clipboard.writeText(name);
    setCopiedToken(name);
    setTimeout(() => setCopiedToken(null), 1800);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <Palette className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                  MODULE 05
                </span>
                <h2 className="text-lg font-bold text-white tracking-tight">
                  {language === 'th' ? 'ระบบการออกแบบและโทเค็น (Design System Engine)' : 'Design System & Tokens Engine'}
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {language === 'th'
                  ? 'แหล่งความจริงด้านภาพและปฏิสัมพันธ์ (Single Source of Truth) รองรับสัญญาคอมโพเนนต์ครบทั้ง 10 สถานะ'
                  : 'The visual and interaction single source of truth covering all 10 component interaction states.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSection('components')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeSection === 'components'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>{language === 'th' ? 'สัญญาคอมโพเนนต์ (10 สถานะ)' : 'Component Contracts (10 States)'}</span>
            </button>

            <button
              onClick={() => setActiveSection('tokens')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeSection === 'tokens'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>{language === 'th' ? 'ตารางโทเค็น (Tokens)' : 'Design Tokens'}</span>
            </button>
          </div>
        </div>

        {/* Invariant Rule Badge */}
        <div className="pt-4 flex items-center gap-2 text-xs text-cyan-300">
          <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            {language === 'th'
              ? 'RULE 07 Design Consistency Enforced: ใช้ Design System ของโครงการเป็นมาตรฐานอ้างอิงหลักเสมอ'
              : 'RULE 07 Design Consistency Enforced: Project Design System is the sole source of truth.'}
          </span>
        </div>
      </div>

      {/* Section 1: Component Contracts with Interactive 10-State Simulator */}
      {activeSection === 'components' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Component Selector */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              {language === 'th' ? 'คอมโพเนนต์ที่ลงทะเบียน' : 'Registered Component Contracts'}
            </h3>
            <div className="space-y-2">
              {COMPONENT_CONTRACTS.map((comp) => (
                <button
                  key={comp.componentId}
                  onClick={() => {
                    setSelectedComponent(comp);
                    setPreviewState('Default');
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-1 ${
                    selectedComponent.componentId === comp.componentId
                      ? 'bg-cyan-950/60 border-cyan-400 text-white shadow-lg shadow-cyan-950/30 ring-1 ring-cyan-400/50'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-cyan-400 font-bold">{comp.componentId}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">10 States</span>
                  </div>
                  <span className="text-sm font-semibold">{language === 'th' ? comp.nameTh : comp.name}</span>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{comp.purpose}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Component Contract Detail & Live State Preview (2 cols) */}
          <div className="lg:col-span-2 space-y-5">
            {/* Interactive 10-State Preview Stage */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800 mb-5">
                <div>
                  <span className="text-xs font-mono text-cyan-400 font-bold">LIVE STATE INSPECTOR</span>
                  <h4 className="text-base font-bold text-white mt-0.5">{selectedComponent.name}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono">Active State:</span>
                  <span className="px-2.5 py-1 rounded-md bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-mono text-xs font-bold">
                    {previewState}
                  </span>
                </div>
              </div>

              {/* 10 Interactive State Switchers */}
              <div className="mb-6">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
                  {language === 'th' ? 'เลือกจำลองสถานะปฏิสัมพันธ์ (10 States)' : 'Simulate Interaction State (All 10 States):'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedComponent.supportedStates.map((st) => (
                    <button
                      key={st}
                      onClick={() => setPreviewState(st)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer border ${
                        previewState === st
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-md shadow-cyan-500/30 scale-105'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Live Preview Box */}
              <div className="p-8 rounded-xl bg-[#070b14] border border-slate-800/80 flex items-center justify-center min-h-[160px] relative overflow-hidden">
                {selectedComponent.componentId === 'CMP-01' && (
                  /* Button Component Live Preview */
                  <button
                    disabled={previewState === 'Disabled'}
                    className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                      previewState === 'Default'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                        : previewState === 'Hover'
                        ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-extrabold shadow-lg shadow-cyan-400/40 translate-y-[-1px]'
                        : previewState === 'Focus'
                        ? 'bg-cyan-500 text-slate-950 font-bold ring-2 ring-cyan-300 ring-offset-2 ring-offset-slate-950'
                        : previewState === 'Pressed'
                        ? 'bg-cyan-600 text-slate-950 font-bold scale-95 translate-y-[1px]'
                        : previewState === 'Disabled'
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                        : previewState === 'Loading'
                        ? 'bg-cyan-900/60 text-cyan-200 border border-cyan-500 animate-pulse'
                        : previewState === 'Success'
                        ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-md shadow-emerald-500/30'
                        : previewState === 'Error'
                        ? 'bg-rose-500 text-white font-bold shadow-md shadow-rose-500/30'
                        : previewState === 'Empty'
                        ? 'border-2 border-dashed border-slate-700 text-slate-400'
                        : 'bg-cyan-400 text-slate-950 font-extrabold ring-2 ring-white/60 shadow-lg'
                    }`}
                  >
                    {previewState === 'Loading' && <Activity className="w-3.5 h-3.5 animate-spin" />}
                    {previewState === 'Success' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    <span>
                      {previewState === 'Loading'
                        ? 'Processing...'
                        : previewState === 'Success'
                        ? 'Delivered'
                        : previewState === 'Error'
                        ? 'Action Failed'
                        : previewState === 'Empty'
                        ? 'No Action'
                        : 'Run Pipeline'}
                    </span>
                  </button>
                )}

                {selectedComponent.componentId === 'CMP-02' && (
                  /* Input Component Live Preview */
                  <div className="w-full max-w-sm">
                    <label className="block text-xs font-mono text-slate-400 mb-1">Prompt / Command Query</label>
                    <div
                      className={`relative flex items-center rounded-xl border transition-all ${
                        previewState === 'Default'
                          ? 'bg-slate-900 border-slate-700'
                          : previewState === 'Hover'
                          ? 'bg-slate-900 border-cyan-500/60 shadow-sm'
                          : previewState === 'Focus'
                          ? 'bg-slate-900 border-cyan-400 ring-2 ring-cyan-400/50'
                          : previewState === 'Pressed'
                          ? 'bg-slate-950 border-cyan-400'
                          : previewState === 'Disabled'
                          ? 'bg-slate-900/50 border-slate-800 opacity-60'
                          : previewState === 'Loading'
                          ? 'bg-slate-900 border-cyan-500/50 animate-pulse'
                          : previewState === 'Success'
                          ? 'bg-slate-900 border-emerald-400 ring-1 ring-emerald-400/40'
                          : previewState === 'Error'
                          ? 'bg-slate-900 border-rose-500 ring-1 ring-rose-500/50'
                          : previewState === 'Empty'
                          ? 'bg-slate-900 border-slate-800'
                          : 'bg-cyan-950/40 border-cyan-400 ring-1 ring-cyan-400'
                      }`}
                    >
                      <input
                        type="text"
                        disabled={previewState === 'Disabled'}
                        readOnly
                        value={
                          previewState === 'Empty'
                            ? ''
                            : previewState === 'Error'
                            ? '/invalid-command'
                            : previewState === 'Success'
                            ? '/ui dashboard lms university'
                            : '/start new project'
                        }
                        placeholder="Enter command or natural prompt..."
                        className="w-full bg-transparent p-2.5 text-xs font-mono text-slate-100 focus:outline-none"
                      />
                    </div>
                    {previewState === 'Error' && (
                      <span className="text-[11px] text-rose-400 font-mono mt-1 block">
                        Error: Unknown command. Did you mean /ui?
                      </span>
                    )}
                  </div>
                )}

                {selectedComponent.componentId === 'CMP-03' && (
                  /* Command Tile Live Preview */
                  <div
                    className={`p-4 rounded-xl border w-full max-w-sm transition-all ${
                      previewState === 'Selected' || previewState === 'Focus'
                        ? 'border-2 border-cyan-400 ring-2 ring-cyan-300 ring-offset-2 ring-offset-slate-950 bg-gradient-to-br from-cyan-950/90 to-slate-900 shadow-xl shadow-cyan-500/25'
                        : previewState === 'Hover'
                        ? 'border-cyan-500/50 bg-slate-900 shadow-md'
                        : previewState === 'Disabled'
                        ? 'border-slate-800 bg-slate-900/30 opacity-50'
                        : 'border-slate-800 bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 font-bold">
                        #110 • Product Strategy & UX
                      </span>
                      {previewState === 'Selected' && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-400 text-slate-950 font-bold">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <h5 className="font-mono font-bold text-white text-sm">/ui</h5>
                    <p className="text-xs text-slate-400 mt-0.5">UI Visual Interface Design</p>
                  </div>
                )}

                {selectedComponent.componentId === 'CMP-04' && (
                  /* Modal Dialog Live Preview */
                  <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-xl p-4 shadow-2xl">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="text-xs font-bold text-white">Modal Preview State: {previewState}</span>
                      <span className="text-slate-500 text-xs">✕</span>
                    </div>
                    <p className="text-xs text-slate-300 py-3">
                      Modal content simulating dialog with trapped focus and backdrop blur.
                    </p>
                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                      <button className="px-3 py-1 rounded bg-slate-800 text-xs text-slate-300">Close</button>
                      <button className="px-3 py-1 rounded bg-cyan-500 text-xs text-slate-950 font-bold">Confirm</button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Contract Specifications */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs">
              <div>
                <span className="font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                  1. Component Anatomy:
                </span>
                <ul className="list-disc list-inside bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 text-slate-300 space-y-1">
                  {selectedComponent.anatomy.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                  2. Accessibility & Keyboard Rules:
                </span>
                <ul className="list-disc list-inside bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 text-emerald-300/90 space-y-1">
                  {selectedComponent.accessibilityRules.map((a11y, i) => (
                    <li key={i}>{a11y}</li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                  3. Acceptance Criteria:
                </span>
                <ul className="list-disc list-inside bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 text-slate-300 space-y-1">
                  {selectedComponent.acceptanceCriteria.map((ac, i) => (
                    <li key={i}>{ac}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section 2: Tokens Table */}
      {activeSection === 'tokens' && (
        <div className="space-y-6">
          {/* Colors Table */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
              <Palette className="w-4 h-4 text-cyan-400" />
              <span>Color Primitives & Semantic Roles</span>
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                    <th className="pb-2">Token Name</th>
                    <th className="pb-2">Swatch</th>
                    <th className="pb-2">Hex</th>
                    <th className="pb-2">Semantic Role</th>
                    <th className="pb-2">Contrast (WCAG)</th>
                    <th className="pb-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {DESIGN_TOKENS.colors.map((c) => (
                    <tr key={c.name} className="hover:bg-slate-850/50">
                      <td className="py-2.5 font-mono text-cyan-300 font-semibold">{c.name}</td>
                      <td className="py-2.5">
                        <div
                          className="w-6 h-6 rounded-md border border-slate-700 shadow-sm"
                          style={{ backgroundColor: c.hex }}
                        />
                      </td>
                      <td className="py-2.5 font-mono text-slate-300">{c.hex}</td>
                      <td className="py-2.5 text-slate-300">{c.role}</td>
                      <td className="py-2.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-emerald-400 border border-slate-700">
                          {c.contrastOnDark}
                        </span>
                      </td>
                      <td className="py-2.5 text-right">
                        <button
                          onClick={() => handleCopyToken(c.name)}
                          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-300 cursor-pointer"
                          title="Copy token name"
                        >
                          {copiedToken === c.name ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Typography Scale */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
              <Type className="w-4 h-4 text-cyan-400" />
              <span>Typography Scale (Plus Jakarta Sans & Sarabun)</span>
            </h3>
            <div className="space-y-2.5">
              {DESIGN_TOKENS.typography.map((t) => (
                <div key={t.name} className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between gap-4">
                  <div>
                    <span className="font-mono text-xs text-cyan-300 font-semibold block">{t.name}</span>
                    <span className="text-[11px] text-slate-400">{t.usage}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xs text-white block">{t.size} • {t.weight}</span>
                    <span className="text-[10px] text-slate-500 font-mono">Line: {t.lineHeight}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
