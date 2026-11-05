import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Wand2,
  Filter,
  Check,
  Copy,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import { QA_GATE_ITEMS, QACheckItem, QAAuditResult, runQAAudit } from '../data/qaGates';

interface QAGateInspectorProps {
  initialAudit?: QAAuditResult | null;
  onTriggerRepair?: (textToRepair: string) => void;
  language: 'th' | 'en';
}

export const QAGateInspector: React.FC<QAGateInspectorProps> = ({
  initialAudit,
  onTriggerRepair,
  language
}) => {
  const [testText, setTestText] = useState(
    '### สรุปสาระสำคัญเชิงวิชาการ\nข้ออ้าง: การใช้ระบบปัญญาประดิษฐ์ในอุดมศึกษาช่วยส่งเสริมทักษะการเรียนรู้เฉพาะบุคคล\nหลักฐาน: ผลการทดลองในกลุ่มตัวอย่างนักศึกษา 450 คนแสดงให้เห็นพัฒนาการอย่างมีนัยสำคัญทางสถิติ (p < 0.05)\nการตีความ: ความยืดหยุ่นของสื่อการสอนมีผลต่อแรงจูงใจ\nข้อสมมติฐาน: อยู่ภายใต้บริบทที่มีสัญญาณอินเทอร์เน็ตความเร็วสูงรองรับ'
  );
  const [currentAudit, setCurrentAudit] = useState<QAAuditResult>(
    initialAudit || runQAAudit(testText, '/academic', 'ACADEMIC')
  );
  const [filterMode, setFilterMode] = useState<'ALL' | 'CRITICAL' | 'ATTENTION'>('ALL');
  const [collapsedDimensions, setCollapsedDimensions] = useState<Record<string, boolean>>({});

  const handleRunAudit = () => {
    const result = runQAAudit(testText, '/academic', 'ACADEMIC');
    setCurrentAudit(result);
  };

  const toggleDimension = (dim: string) => {
    setCollapsedDimensions(prev => ({ ...prev, [dim]: !prev[dim] }));
  };

  const dimensions = Array.from(new Set(QA_GATE_ITEMS.map(i => i.dimension)));

  const filteredItems = currentAudit.items.filter(({ item, status }) => {
    if (filterMode === 'CRITICAL') return item.isCritical;
    if (filterMode === 'ATTENTION') return status === 'REVIEW' || status === 'FAIL';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              {language === 'th'
                ? 'ระบบตรวจสอบคุณภาพ 50 จุด (50-Point QA Gate Inspector)'
                : '50-Point QA Gate Inspector (Section 7)'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {language === 'th'
                ? 'กลไกประกันคุณภาพครอบคลุม 10 มิติ: เจตนา, เนื้อหา, ความถูกต้อง, หลักฐาน, เหตุผล, การเขียน, ภาพ, เทคนิค, UX, และความซื่อสัตย์'
                : 'Audits 10 dimensions: Intent, Content, Accuracy, Evidence, Reasoning, Writing, Visual, Technical, UX, Integrity.'}
            </p>
          </div>

          {/* Score Badge */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-2xl font-bold font-mono text-emerald-400">
                {currentAudit.totalScore}%
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                Status: <span className="font-bold text-emerald-300">{currentAudit.status}</span>
              </div>
            </div>

            <div className="flex flex-col gap-1 text-[11px] font-mono border-l border-slate-700 pl-3">
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> PASS: {currentAudit.passCount}
              </span>
              <span className="text-amber-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> REVIEW: {currentAudit.reviewCount}
              </span>
              <span className="text-rose-400 flex items-center gap-1">
                <XCircle className="w-3 h-3" /> FAIL: {currentAudit.failCount}
              </span>
            </div>
          </div>
        </div>

        {/* Action & Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-400">Filter:</span>
            {(['ALL', 'CRITICAL', 'ATTENTION'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setFilterMode(mode)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                  filterMode === mode
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {onTriggerRepair && currentAudit.status !== 'PASS' && (
              <button
                onClick={() => onTriggerRepair(testText)}
                className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Auto-Repair Cycle (REPAIR → RECHECK → DELIVER)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Live Interactive Audit Input Area */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
        <label className="text-xs font-mono text-slate-400 block mb-2">
          {language === 'th' ? 'ทดสอบประเมินข้อความด้วย 50-Point QA Gate:' : 'Run 50-Point QA Gate on custom text:'}
        </label>
        <textarea
          value={testText}
          onChange={(e) => setTestText(e.target.value)}
          rows={3}
          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-cyan-400 mb-2"
        />
        <div className="flex justify-end">
          <button
            onClick={handleRunAudit}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 text-xs font-semibold transition-all cursor-pointer"
          >
            Audit Text Now
          </button>
        </div>
      </div>

      {/* 10 Dimension Inspection Accordions */}
      <div className="space-y-4">
        {dimensions.map((dim) => {
          const dimItems = filteredItems.filter(i => i.item.dimension === dim);
          if (dimItems.length === 0) return null;

          const isCollapsed = collapsedDimensions[dim];
          const dimPassCount = dimItems.filter(i => i.status === 'PASS').length;

          return (
            <div
              key={dim}
              className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-sm"
            >
              {/* Dimension Header */}
              <button
                onClick={() => toggleDimension(dim)}
                className="w-full px-5 py-3.5 bg-slate-850/80 hover:bg-slate-800 flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold font-mono text-cyan-300 uppercase tracking-wider">
                    {dim}
                  </span>
                  <span className="text-xs text-slate-400">
                    ({dimItems[0]?.item.dimensionTh})
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-400">
                    {dimPassCount}/{dimItems.length} PASS
                  </span>
                  {isCollapsed ? (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Items List */}
              {!isCollapsed && (
                <div className="p-4 space-y-2.5 divide-y divide-slate-800/60">
                  {dimItems.map(({ item, status, feedback }) => (
                    <div
                      key={item.id}
                      className="pt-2.5 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-slate-500 font-bold">
                            #{String(item.id).padStart(2, '0')}
                          </span>
                          <span className="font-semibold text-slate-200">
                            {language === 'th' ? item.nameTh : item.name}
                          </span>
                          {item.isCritical && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-rose-950/60 text-rose-300 border border-rose-800/50">
                              CRITICAL
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {language === 'th' ? item.descriptionTh : item.description}
                        </p>
                        <p className="text-[11px] text-cyan-300/80 italic mt-0.5">
                          {feedback}
                        </p>
                      </div>

                      {/* Status Pill */}
                      <span
                        className={`self-start sm:self-center px-2.5 py-1 rounded-md text-[11px] font-mono font-bold whitespace-nowrap ${
                          status === 'PASS'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : status === 'REVIEW'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        }`}
                      >
                        {status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
