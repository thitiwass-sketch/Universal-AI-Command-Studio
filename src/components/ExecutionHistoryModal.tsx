import React, { useState, useEffect } from 'react';
import { X, Trash2, ArrowRight, Clock, ShieldCheck, Check, Copy, Terminal } from 'lucide-react';
import { SavedExecution, getUserExecutions, deleteExecutionFromFirestore } from '../lib/firebase';

interface ExecutionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
  onLoadExecution: (exec: SavedExecution) => void;
  language: 'th' | 'en';
}

export const ExecutionHistoryModal: React.FC<ExecutionHistoryModalProps> = ({
  isOpen,
  onClose,
  userId,
  onLoadExecution,
  language
}) => {
  const [executions, setExecutions] = useState<SavedExecution[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && userId) {
      setLoading(true);
      getUserExecutions(userId)
        .then(setExecutions)
        .finally(() => setLoading(false));
    }
  }, [isOpen, userId]);

  if (!isOpen) return null;

  const handleDelete = async (id?: string) => {
    if (!id || !userId) return;
    await deleteExecutionFromFirestore(userId, id);
    setExecutions(prev => prev.filter(e => e.id !== id));
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between gap-3 bg-slate-950/70">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <h3 className="text-base font-bold text-white">
                {language === 'th' ? 'ประวัติการประมวลผลคำสั่งบน Cloud' : 'Firestore Execution History'}
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {language === 'th'
                ? 'บันทึกคำสั่ง ผลลัพธ์ และคะแนนการตรวจ 50-Point QA Gate บน Firestore'
                : 'Cloud persistent execution logs with Command contracts and QA scores.'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3 flex-1 text-xs">
          {loading && (
            <div className="text-center py-10 text-slate-400">
              Loading execution history from Firestore...
            </div>
          )}

          {!loading && executions.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <Terminal className="w-8 h-8 text-cyan-400/40 mx-auto mb-2" />
              <p className="font-semibold text-slate-300">
                {language === 'th' ? 'ยังไม่มีประวัติการรันคำสั่ง' : 'No execution history yet'}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                {language === 'th'
                  ? 'เมื่อคุณรันคำสั่งใน Prompt Studio ระบบจะบันทึกประวัติการรันให้โดยอัตโนมัติ'
                  : 'Run prompts in the Prompt Studio and they will automatically sync to Firestore.'}
              </p>
            </div>
          )}

          {!loading && executions.map((item) => (
            <div
              key={item.id}
              className="bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 rounded-xl p-3.5 transition-all space-y-2"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40 text-[11px]">
                    {item.command}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Mode: {item.autoMode}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(item.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 font-mono text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
                    <ShieldCheck className="w-3 h-3" />
                    QA: {item.qaScore}% {item.qaStatus}
                  </span>
                  {item.id && (
                    <button
                      onClick={() => handleCopy(item.id!, item.output)}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                      title="Copy Output"
                    >
                      {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1 rounded bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
                    title="Delete Record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Prompt Snippet */}
              <div className="text-slate-200 font-medium">
                "{item.prompt}"
              </div>

              {/* Output Preview */}
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-850 text-slate-300 font-mono text-[11px] line-clamp-3">
                {item.output}
              </div>

              {/* Action Load */}
              <div className="flex justify-end pt-1">
                <button
                  onClick={() => {
                    onLoadExecution(item);
                    onClose();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                >
                  <span>{language === 'th' ? 'โหลดคำสั่งนี้ไปที่ Studio' : 'Load to Studio'}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
