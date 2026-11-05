import React, { useState } from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  Info,
  CheckCircle2,
  Wand2,
  Plus,
  RotateCcw,
  ShieldAlert,
  ArrowRight,
  Filter,
  Check,
  Clock
} from 'lucide-react';
import {
  DefectRecord,
  INITIAL_DEFECTS,
  DefectSeverity,
  DefectStatus
} from '../data/defects';

interface DefectRegisterViewProps {
  language: 'th' | 'en';
  onTriggerRepair?: (repairPrompt: string) => void;
}

export const DefectRegisterView: React.FC<DefectRegisterViewProps> = ({
  language,
  onTriggerRepair
}) => {
  const [defects, setDefects] = useState<DefectRecord[]>(() => {
    const saved = localStorage.getItem('v20_defects');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_DEFECTS;
      }
    }
    return INITIAL_DEFECTS;
  });

  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // New defect state
  const [newDefect, setNewDefect] = useState<Partial<DefectRecord>>({
    title: '',
    severity: 'P2',
    affectedRequirement: '',
    affectedComponent: '',
    expectedBehavior: '',
    observedBehavior: '',
    rootCause: '',
    proposedFix: '',
    regressionRisk: '',
    retestCriteria: ''
  });

  const handleSaveDefect = () => {
    if (!newDefect.title) return;
    const record: DefectRecord = {
      defectId: `DEF-${String(defects.length + 1).padStart(3, '0')}`,
      title: newDefect.title,
      severity: (newDefect.severity as DefectSeverity) || 'P2',
      affectedRequirement: newDefect.affectedRequirement || 'REQ-GENERAL-01',
      affectedComponent: newDefect.affectedComponent || 'General.tsx',
      reproductionSteps: ['1. Trigger component', '2. Observe failure'],
      expectedBehavior: newDefect.expectedBehavior || '',
      observedBehavior: newDefect.observedBehavior || '',
      rootCause: newDefect.rootCause || 'Under investigation',
      proposedFix: newDefect.proposedFix || '',
      regressionRisk: newDefect.regressionRisk || 'Low',
      retestCriteria: newDefect.retestCriteria || 'Verify expected behavior',
      status: 'Open',
      iteration: 1,
      createdAt: new Date().toISOString()
    };

    const next = [record, ...defects];
    setDefects(next);
    localStorage.setItem('v20_defects', JSON.stringify(next));
    setShowAddModal(false);
  };

  const handleUpdateStatus = (id: string, newStatus: DefectStatus) => {
    const next = defects.map((d) => (d.defectId === id ? { ...d, status: newStatus } : d));
    setDefects(next);
    localStorage.setItem('v20_defects', JSON.stringify(next));
  };

  const handleTriggerRepairAction = (defect: DefectRecord) => {
    if (!onTriggerRepair) return;
    const prompt = `/REPAIR ${defect.defectId}: ${defect.title}
Affected Component: ${defect.affectedComponent}
Root Cause: ${defect.rootCause}
Proposed Fix: ${defect.proposedFix}
Retest Criteria: ${defect.retestCriteria}
Iteration Limit: Max 3 focused repair loops.`;
    onTriggerRepair(prompt);
  };

  const filteredDefects = defects.filter((d) => {
    if (severityFilter !== 'ALL' && d.severity !== severityFilter) return false;
    if (statusFilter !== 'ALL' && d.status !== statusFilter) return false;
    return true;
  });

  const p0Count = defects.filter((d) => d.severity === 'P0' && d.status !== 'Resolved' && d.status !== 'Closed').length;
  const p1Count = defects.filter((d) => d.severity === 'P1' && d.status !== 'Resolved' && d.status !== 'Closed').length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-rose-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800">
                  MODULE 09
                </span>
                <h2 className="text-lg font-bold text-white tracking-tight">
                  {language === 'th' ? 'การจัดการข้อบกพร่องและลูปซ่อม (Defect Management & Repair)' : 'Defect Management & Repair Loop'}
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {language === 'th'
                  ? 'จำแนกความรุนแรง P0–P3 วิเคราะห์สาเหตุหลัก และดำเนินการซ่อมแซมจำกัดไม่เกิน 3 รอบต่อภารกิจ'
                  : 'Track P0-P3 defects, analyze root causes, and execute focused repair loops (max 3 iterations).'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{language === 'th' ? 'บันทึกข้อบกพร่องใหม่' : 'Log New Defect'}</span>
            </button>
          </div>
        </div>

        {/* Severity Metrics Bar */}
        <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-slate-400 block">P0 CRITICAL</span>
              <span className={`text-base font-mono font-bold ${p0Count > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                {p0Count} Active
              </span>
            </div>
            <AlertOctagon className={`w-5 h-5 ${p0Count > 0 ? 'text-rose-400' : 'text-slate-600'}`} />
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-slate-400 block">P1 HIGH</span>
              <span className={`text-base font-mono font-bold ${p1Count > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
                {p1Count} Active
              </span>
            </div>
            <AlertTriangle className={`w-5 h-5 ${p1Count > 0 ? 'text-amber-400' : 'text-slate-600'}`} />
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-slate-400 block">RESOLVED</span>
              <span className="text-base font-mono font-bold text-emerald-400">
                {defects.filter((d) => d.status === 'Resolved' || d.status === 'Closed').length}
              </span>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-slate-400 block">RELEASE GATE</span>
              <span className={`text-xs font-mono font-bold ${p0Count === 0 && p1Count === 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {p0Count === 0 && p1Count === 0 ? 'PASSED (0 Blockers)' : 'BLOCKED (P0/P1 Exists)'}
              </span>
            </div>
            <ShieldAlert className="w-5 h-5 text-cyan-400" />
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 rounded-xl p-3">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-xs text-slate-400 font-mono">Severity:</span>
          {['ALL', 'P0', 'P1', 'P2', 'P3'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-2 py-0.5 rounded text-xs font-mono cursor-pointer transition-colors ${
                severityFilter === sev
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">Status:</span>
          {['ALL', 'Open', 'In Repair', 'Resolved'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2 py-0.5 rounded text-xs font-mono cursor-pointer transition-colors ${
                statusFilter === st
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Defect Cards Grid */}
      <div className="space-y-3">
        {filteredDefects.map((def) => {
          const isResolved = def.status === 'Resolved' || def.status === 'Closed';
          return (
            <div
              key={def.defectId}
              className={`p-4 rounded-2xl border transition-all ${
                isResolved
                  ? 'bg-slate-950/40 border-slate-800/80'
                  : def.severity === 'P0'
                  ? 'bg-rose-950/20 border-rose-500/50 shadow-md'
                  : def.severity === 'P1'
                  ? 'bg-amber-950/20 border-amber-500/40'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-800/80">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${
                      def.severity === 'P0'
                        ? 'bg-rose-500 text-slate-950 font-extrabold border-rose-400'
                        : def.severity === 'P1'
                        ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                        : 'bg-slate-800 text-cyan-300 border-slate-700'
                    }`}
                  >
                    {def.severity} • {def.defectId}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Component: <span className="text-cyan-300 font-semibold">{def.affectedComponent}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${
                      isResolved
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                    }`}
                  >
                    Status: {def.status}
                  </span>

                  {onTriggerRepair && !isResolved && (
                    <button
                      onClick={() => handleTriggerRepairAction(def)}
                      className="px-2.5 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
                    >
                      <Wand2 className="w-3 h-3" />
                      <span>{language === 'th' ? 'สั่งซ่อม (/REPAIR)' : 'Repair in Studio'}</span>
                    </button>
                  )}

                  {!isResolved ? (
                    <button
                      onClick={() => handleUpdateStatus(def.defectId, 'Resolved')}
                      className="px-2 py-1 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700 text-xs font-semibold cursor-pointer"
                    >
                      Mark Resolved
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpdateStatus(def.defectId, 'Open')}
                      className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs cursor-pointer"
                    >
                      Reopen
                    </button>
                  )}
                </div>
              </div>

              {/* Title & Details */}
              <div className="pt-2.5 space-y-2 text-xs">
                <h4 className="text-sm font-bold text-white">{def.title}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300">
                  <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400 block mb-0.5">OBSERVED BEHAVIOR:</span>
                    <p>{def.observedBehavior || 'Under observation'}</p>
                  </div>
                  <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] font-mono text-cyan-400 block mb-0.5">PROPOSED ROOT CAUSE & FIX:</span>
                    <p>{def.proposedFix || def.rootCause || 'Root cause investigation underway'}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] font-mono text-slate-400">
                  <span>Affected: {def.affectedRequirement}</span>
                  <span>Repair Loop: Iteration {def.iteration} of 3 Max</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Defect Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <span>Log Defect (Module 09 Specification)</span>
            </h3>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Defect Title</label>
              <input
                type="text"
                placeholder="e.g. Focus ring clipped on button in modal dialog..."
                value={newDefect.title}
                onChange={(e) => setNewDefect({ ...newDefect, title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Severity</label>
                <select
                  value={newDefect.severity}
                  onChange={(e) => setNewDefect({ ...newDefect, severity: e.target.value as DefectSeverity })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-cyan-300"
                >
                  <option value="P0">P0 — Critical (Security/Destructive)</option>
                  <option value="P1">P1 — High (Core Journey Broken)</option>
                  <option value="P2">P2 — Medium (Usability Flaw)</option>
                  <option value="P3">P3 — Low (Visual Polish)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Affected Component</label>
                <input
                  type="text"
                  placeholder="e.g. Button.tsx"
                  value={newDefect.affectedComponent}
                  onChange={(e) => setNewDefect({ ...newDefect, affectedComponent: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Root Cause & Proposed Fix</label>
              <textarea
                rows={2}
                placeholder="Explain the suspected cause and recommended repair..."
                value={newDefect.proposedFix}
                onChange={(e) => setNewDefect({ ...newDefect, proposedFix: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDefect}
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs cursor-pointer"
              >
                Register Defect
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
