import React, { useState } from 'react';
import {
  FolderKanban,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Download,
  Upload,
  ArrowRight,
  ShieldCheck,
  Layers,
  Code2,
  FileText
} from 'lucide-react';
import {
  ProjectSpecification,
  DEFAULT_PROJECT_SPEC,
  generateProjectStateSummary
} from '../data/projectContext';

interface ProjectContextViewProps {
  language: 'th' | 'en';
  onLoadToStudio?: (prompt: string) => void;
}

export const ProjectContextView: React.FC<ProjectContextViewProps> = ({
  language,
  onLoadToStudio
}) => {
  const [spec, setSpec] = useState<ProjectSpecification>(() => {
    const saved = localStorage.getItem('v20_project_spec');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_PROJECT_SPEC;
      }
    }
    return DEFAULT_PROJECT_SPEC;
  });

  const [copiedSummary, setCopiedSummary] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editSpec, setEditSpec] = useState<ProjectSpecification>(spec);

  const summaryText = generateProjectStateSummary(spec);

  const handleCopySummary = () => {
    navigator.clipboard.writeText(summaryText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2200);
  };

  const handleSaveEdit = () => {
    setSpec(editSpec);
    localStorage.setItem('v20_project_spec', JSON.stringify(editSpec));
    setIsEditing(false);
  };

  const handleResetToDefault = () => {
    setSpec(DEFAULT_PROJECT_SPEC);
    setEditSpec(DEFAULT_PROJECT_SPEC);
    localStorage.removeItem('v20_project_spec');
    setIsEditing(false);
  };

  const handleLoadSample = (type: 'higher-ed' | 'fintech' | 'health') => {
    let sample: ProjectSpecification;
    if (type === 'fintech') {
      sample = {
        ...DEFAULT_PROJECT_SPEC,
        projectId: 'PRJ-2026-FIN-002',
        projectName: 'Adaptive Wealth & Micro-Investing OS',
        projectType: 'FinTech Mobile & Web App',
        businessObjective: 'Provide automated, privacy-first portfolio balancing with clear fee disclosure and zero predatory gamification.',
        targetUsers: 'First-time retail investors, university graduates, personal finance educators',
        coreProblem: 'Users experience anxiety and confusion due to opaque pricing, complex charts, and lack of deterministic fee transparency.',
        techStack: 'React Native, TypeScript, Tailwind, Node.js, Cloud SQL',
        currentMilestone: 'M02: Transaction Journey & 2FA Flow'
      };
    } else if (type === 'health') {
      sample = {
        ...DEFAULT_PROJECT_SPEC,
        projectId: 'PRJ-2026-MED-003',
        projectName: 'Patient Vitality & Chronic Care Navigator',
        projectType: 'Digital Health & Tele-consultation Portal',
        businessObjective: 'Empower chronic care patients with daily symptom tracking and asynchronous clinician check-ins.',
        targetUsers: 'Hypertension/Diabetes patients aged 45-75, family caregivers, general practitioners',
        coreProblem: 'Elderly patients struggle with small touch targets, confusing terminology, and fear of unvetted clinical advice.',
        accessibilityRequirements: 'Strict AAA text contrast (7:1), minimum 48x48px touch targets, dynamic font scaling, Section 10 Health Protocol enforced.',
        currentMilestone: 'M01: Discovery & HIPAA/PDPA Assessment'
      };
    } else {
      sample = DEFAULT_PROJECT_SPEC;
    }
    setSpec(sample);
    setEditSpec(sample);
    localStorage.setItem('v20_project_spec', JSON.stringify(sample));
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <FolderKanban className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                  MODULE 01
                </span>
                <h2 className="text-lg font-bold text-white tracking-tight">
                  {language === 'th' ? 'เครื่องยนต์บริบทโครงการ (Project Context Engine)' : 'Project Context Engine'}
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {language === 'th'
                  ? 'สร้าง จัดการ และส่งต่อข้อกำหนดโครงการ 23 ฟิลด์ พร้อมสรุป PROJECT_STATE_SUMMARY ที่นำไปใช้ซ้ำได้'
                  : 'Manage the 23-field project specification and generate reusable PROJECT_STATE_SUMMARY.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
            >
              {copiedSummary ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSummary ? (language === 'th' ? 'คัดลอกสรุปแล้ว!' : 'Copied Summary!') : (language === 'th' ? 'คัดลอก State Summary' : 'Copy State Summary')}</span>
            </button>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isEditing ? (language === 'th' ? 'ยกเลิกแก้ไข' : 'Cancel Edit') : (language === 'th' ? 'แก้ไขข้อกำหนด' : 'Edit Specification')}</span>
            </button>

            <button
              onClick={handleResetToDefault}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              title="Reset to default template"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Sample Presets */}
        <div className="pt-4 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 text-[11px] font-mono mr-1">
            {language === 'th' ? 'โหลดตัวอย่างระบบ:' : 'Load Sample Spec:'}
          </span>
          <button
            onClick={() => handleLoadSample('higher-ed')}
            className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-cyan-950 hover:text-cyan-300 text-slate-300 border border-slate-700 text-xs cursor-pointer transition-colors"
          >
            🎓 University LMS (NRRU)
          </button>
          <button
            onClick={() => handleLoadSample('health')}
            className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-cyan-950 hover:text-cyan-300 text-slate-300 border border-slate-700 text-xs cursor-pointer transition-colors"
          >
            🌿 Chronic Care Health Portal
          </button>
          <button
            onClick={() => handleLoadSample('fintech')}
            className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-cyan-950 hover:text-cyan-300 text-slate-300 border border-slate-700 text-xs cursor-pointer transition-colors"
          >
            💳 Wealth & Micro-Investing
          </button>

          {onLoadToStudio && (
            <button
              onClick={() => onLoadToStudio(`/START ${spec.projectName}: ${spec.businessObjective}`)}
              className="ml-auto text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>{language === 'th' ? 'ส่งเข้า Studio (/START)' : 'Load to Studio (/START)'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Editor or Specification Viewer */}
      {isEditing ? (
        <div className="bg-slate-900 border border-cyan-500/50 rounded-2xl p-6 shadow-2xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
              <Code2 className="w-4 h-4" />
              <span>Editing Project Specification (Module 01)</span>
            </h3>
            <span className="text-xs text-slate-400">All 23 Core Specification Fields</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">PROJECT_ID</label>
              <input
                type="text"
                value={editSpec.projectId}
                onChange={(e) => setEditSpec({ ...editSpec, projectId: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs font-mono text-cyan-300"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">PROJECT_NAME</label>
              <input
                type="text"
                value={editSpec.projectName}
                onChange={(e) => setEditSpec({ ...editSpec, projectName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs font-semibold text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">PROJECT_TYPE</label>
              <input
                type="text"
                value={editSpec.projectType}
                onChange={(e) => setEditSpec({ ...editSpec, projectType: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">PROJECT_VERSION</label>
              <input
                type="text"
                value={editSpec.projectVersion}
                onChange={(e) => setEditSpec({ ...editSpec, projectVersion: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs font-mono text-cyan-300"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-mono text-slate-400 mb-1">BUSINESS_OBJECTIVE</label>
              <textarea
                rows={2}
                value={editSpec.businessObjective}
                onChange={(e) => setEditSpec({ ...editSpec, businessObjective: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-mono text-slate-400 mb-1">CORE_PROBLEM</label>
              <textarea
                rows={2}
                value={editSpec.coreProblem}
                onChange={(e) => setEditSpec({ ...editSpec, coreProblem: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">TECH_STACK</label>
              <input
                type="text"
                value={editSpec.techStack}
                onChange={(e) => setEditSpec({ ...editSpec, techStack: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">CURRENT_MILESTONE</label>
              <input
                type="text"
                value={editSpec.currentMilestone}
                onChange={(e) => setEditSpec({ ...editSpec, currentMilestone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-cyan-300"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-mono text-slate-400 mb-1">ACCESSIBILITY_REQUIREMENTS (WCAG 2.2 AA)</label>
              <input
                type="text"
                value={editSpec.accessibilityRequirements}
                onChange={(e) => setEditSpec({ ...editSpec, accessibilityRequirements: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs cursor-pointer shadow-md shadow-cyan-500/20"
            >
              Save Specification
            </button>
          </div>
        </div>
      ) : (
        /* Specification View Grid */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Specification Card (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div>
                  <span className="text-[11px] font-mono text-cyan-400 font-bold">
                    {spec.projectId} • v{spec.projectVersion}
                  </span>
                  <h3 className="text-base font-bold text-white mt-0.5">{spec.projectName}</h3>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                  {spec.projectStatus}
                </span>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-slate-400 font-mono font-semibold block mb-1">BUSINESS OBJECTIVE:</span>
                  <p className="text-slate-200 bg-slate-950/70 p-3 rounded-xl border border-slate-800 leading-relaxed">
                    {spec.businessObjective}
                  </p>
                </div>

                <div>
                  <span className="text-slate-400 font-mono font-semibold block mb-1">CORE PROBLEM STATEMENT:</span>
                  <p className="text-slate-200 bg-slate-950/70 p-3 rounded-xl border border-slate-800 leading-relaxed">
                    {spec.coreProblem}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-400 font-mono font-semibold block mb-1">TARGET USERS:</span>
                    <p className="text-slate-300 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/80">
                      {spec.targetUsers}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-mono font-semibold block mb-1">SUCCESS METRICS:</span>
                    <p className="text-slate-300 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/80">
                      {spec.successMetrics}
                    </p>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 font-mono font-semibold block mb-1">TECH STACK:</span>
                  <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800 text-cyan-300 font-mono">
                    {spec.techStack}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 font-mono font-semibold block mb-1">ACCESSIBILITY (WCAG 2.2 AA):</span>
                  <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800 text-emerald-300 text-xs">
                    {spec.accessibilityRequirements}
                  </div>
                </div>

                {/* Approved Decisions */}
                <div>
                  <span className="text-slate-400 font-mono font-semibold block mb-1.5">APPROVED DECISIONS:</span>
                  <ul className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    {spec.approvedDecisions.map((dec, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-300">
                        <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{dec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* PROJECT_STATE_SUMMARY Export Card (1 col) */}
          <div className="space-y-4">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-800 mb-3">
                  <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    PROJECT_STATE_SUMMARY
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Module 01</span>
                </div>
                <p className="text-[11px] text-slate-400 mb-3">
                  {language === 'th'
                    ? 'ข้อความสรุปสถานะโครงการขนาดกะทัดรัด สำหรับก๊อปปี้ไปส่งต่อให้คำสั่ง /RESUME ในเซสชันถัดไป'
                    : 'Compact portable summary designed to resume context using the /RESUME command.'}
                </p>

                <textarea
                  readOnly
                  value={summaryText}
                  rows={14}
                  className="w-full bg-slate-900 text-cyan-200/90 font-mono text-[11px] p-3 rounded-xl border border-slate-800 focus:outline-none select-all resize-none leading-relaxed"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 mt-3 flex items-center justify-between">
                <button
                  onClick={handleCopySummary}
                  className="w-full py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  {copiedSummary ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSummary ? 'Copied Summary!' : 'Copy Summary for /RESUME'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
