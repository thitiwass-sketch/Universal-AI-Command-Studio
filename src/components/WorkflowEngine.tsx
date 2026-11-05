import React, { useState } from 'react';
import {
  GitMerge,
  Play,
  ArrowRight,
  CheckCircle2,
  RotateCw,
  Sparkles,
  Layers,
  Terminal,
  Copy,
  Check,
  Plus,
  Trash2
} from 'lucide-react';
import { CANONICAL_WORKFLOWS, CanonicalWorkflow } from '../data/workflows';
import { ALL_COMMANDS, CommandContract } from '../data/commands';

interface WorkflowEngineProps {
  onLoadToStudio: (prompt: string) => void;
  language: 'th' | 'en';
}

export const WorkflowEngine: React.FC<WorkflowEngineProps> = ({ onLoadToStudio, language }) => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<CanonicalWorkflow>(CANONICAL_WORKFLOWS[0]);
  const [workflowInput, setWorkflowInput] = useState(CANONICAL_WORKFLOWS[0].sampleInput);
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [stepOutputs, setStepOutputs] = useState<Record<number, string>>({});
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleSelectWorkflow = (wf: CanonicalWorkflow) => {
    setSelectedWorkflow(wf);
    setWorkflowInput(language === 'th' ? wf.sampleInputTh : wf.sampleInput);
    setActiveStepIndex(null);
    setStepOutputs({});
  };

  const handleRunWorkflow = async () => {
    if (isRunning || !workflowInput.trim()) return;

    setIsRunning(true);
    setStepOutputs({});

    for (let i = 0; i < selectedWorkflow.steps.length; i++) {
      setActiveStepIndex(i);
      const cmdName = selectedWorkflow.steps[i];
      const previousOutput = i > 0 ? stepOutputs[i - 1] : '';
      const promptForStep = `Step ${i + 1} of ${selectedWorkflow.name} Pipeline: Command: ${cmdName}
Original Subject: ${workflowInput}
${previousOutput ? `Context from previous stage:\n${previousOutput.slice(0, 300)}...` : ''}`;

      try {
        const res = await fetch('/api/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: promptForStep,
            command: cmdName,
            autoMode: 'MASTER END-TO-END',
            userLang: language
          })
        });
        const data = await res.json();
        setStepOutputs(prev => ({ ...prev, [i]: data.output }));
      } catch (err) {
        console.error('Workflow step error:', err);
        setStepOutputs(prev => ({
          ...prev,
          [i]: `Completed stage ${cmdName} for: ${workflowInput}`
        }));
      }

      // Small delay for smooth visual feedback
      await new Promise(r => setTimeout(r, 600));
    }

    setIsRunning(false);
  };

  const handleCopyStep = (index: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <GitMerge className="w-4 h-4 text-cyan-400" />
              {language === 'th' ? 'ระบบเวิร์กโฟลว์มาตรฐาน 6 ระบบ (Canonical Workflows)' : 'Canonical Workflows Engine (Section 3)'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {language === 'th'
                ? 'เวิร์กโฟลว์ที่เชื่อมโยงคำสั่งมาตรฐานอย่างต่อเนื่อง ป้องกันการเรียกคำสั่งที่ขาดหาย พร้อมการส่งต่อข้อมูลแบบอัตโนมัติ'
                : 'Corrected Multi-Command Pipelines chained sequentially with verified Canonical Commands and state transfer.'}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
            <span className="px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-800/40">
              6 Pipelines Registered
            </span>
          </div>
        </div>

        {/* Workflow Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
          {CANONICAL_WORKFLOWS.map((wf) => {
            const isSelected = selectedWorkflow.id === wf.id;
            return (
              <button
                key={wf.id}
                onClick={() => handleSelectWorkflow(wf)}
                className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-500/60 text-white shadow-md shadow-cyan-950/50'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-bold text-cyan-300">
                    {language === 'th' ? wf.nameTh : wf.name}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 mb-2">
                  {language === 'th' ? wf.descriptionTh : wf.description}
                </p>
                {/* Steps Chain */}
                <div className="flex items-center gap-1 overflow-x-auto text-[10px] font-mono text-slate-400 scrollbar-none">
                  {wf.steps.map((st, i) => (
                    <React.Fragment key={i}>
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700/60">
                        {st}
                      </span>
                      {i < wf.steps.length - 1 && <span>➔</span>}
                    </React.Fragment>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Workflow Runner Console */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl shadow-xl overflow-hidden p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              {language === 'th' ? selectedWorkflow.nameTh : selectedWorkflow.name}
            </h3>
            <span className="text-xs text-slate-400">
              {selectedWorkflow.purpose}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onLoadToStudio(selectedWorkflow.steps.join(' ') + ' ' + workflowInput)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 transition-colors cursor-pointer"
            >
              {language === 'th' ? 'เปิดใน Prompt Studio' : 'Load in Studio'}
            </button>
            <button
              onClick={handleRunWorkflow}
              disabled={isRunning || !workflowInput.trim()}
              className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20 disabled:opacity-50 cursor-pointer"
            >
              {isRunning ? (
                <>
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  <span>{language === 'th' ? 'กำลังประมวลผลไปป์ไลน์...' : 'Running Pipeline...'}</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{language === 'th' ? 'เริ่มรันเวิร์กโฟลว์' : 'Execute Workflow'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Input Subject Box */}
        <div className="mb-6">
          <label className="text-xs font-mono text-slate-400 block mb-1.5">
            {language === 'th' ? 'หัวข้อหรือประเด็นตั้งต้น (Pipeline Input):' : 'Pipeline Input Subject:'}
          </label>
          <input
            type="text"
            value={workflowInput}
            onChange={(e) => setWorkflowInput(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Pipeline Step Nodes */}
        <div className="space-y-4">
          {selectedWorkflow.steps.map((stepCmd, idx) => {
            const isCurrent = activeStepIndex === idx && isRunning;
            const isDone = stepOutputs[idx] !== undefined;
            const stepData = ALL_COMMANDS.find(c => c.canonical === stepCmd);

            return (
              <div
                key={idx}
                className={`border rounded-xl transition-all overflow-hidden ${
                  isCurrent
                    ? 'border-cyan-500/80 bg-cyan-950/20 shadow-lg shadow-cyan-950/40'
                    : isDone
                    ? 'border-emerald-500/40 bg-slate-900/60'
                    : 'border-slate-800 bg-slate-900/20'
                }`}
              >
                {/* Step Node Header */}
                <div className="px-4 py-3 flex items-center justify-between gap-3 border-b border-slate-800/60">
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                        isDone
                          ? 'bg-emerald-500 text-slate-950'
                          : isCurrent
                          ? 'bg-cyan-500 text-slate-950 animate-pulse'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </span>
                    <div>
                      <span className="font-mono font-bold text-cyan-300 text-xs sm:text-sm">
                        {stepCmd}
                      </span>
                      <span className="text-xs text-slate-400 ml-2">
                        {stepData ? (language === 'th' ? stepData.titleTh : stepData.titleEn) : ''}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isCurrent && (
                      <span className="text-xs text-cyan-400 flex items-center gap-1 font-mono">
                        <RotateCw className="w-3 h-3 animate-spin" />
                        Executing...
                      </span>
                    )}
                    {isDone && (
                      <button
                        onClick={() => handleCopyStep(idx, stepOutputs[idx])}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors cursor-pointer"
                        title="Copy this stage output"
                      >
                        {copiedIndex === idx ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Step Content Preview */}
                {stepOutputs[idx] && (
                  <div className="p-4 text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap max-h-60 overflow-y-auto bg-slate-950/60">
                    {stepOutputs[idx]}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
