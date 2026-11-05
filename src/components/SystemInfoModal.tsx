import React from 'react';
import { X, ShieldCheck, Terminal, MapPin, Award, CheckCircle, ArrowRight } from 'lucide-react';
import { SYSTEM_COMMANDS } from '../data/commands';

interface SystemInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'th' | 'en';
}

export const SystemInfoModal: React.FC<SystemInfoModalProps> = ({ isOpen, onClose, language }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl p-6 relative text-xs">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              ARCHITECTURE & ATTRIBUTION
            </span>
            <h3 className="text-base font-bold text-white mt-1">
              GEMINI UNIVERSAL AI OS V6.1
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Creator Card */}
        <div className="bg-gradient-to-br from-cyan-950/50 via-slate-950 to-blue-950/40 border border-cyan-800/40 rounded-xl p-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-bold text-sm shrink-0">
              NRRU
            </div>
            <div>
              <div className="text-sm font-bold text-white">
                ฐิติวัสส์ กาญจนพิมาย (Thitiwas Kanchanaphimai)
              </div>
              <div className="text-xs text-cyan-300 flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5" />
                มหาวิทยาลัยราชภัฏนครราชสีมา (Nakhon Ratchasima Rajabhat University)
              </div>
              <p className="text-slate-400 mt-2 text-[11px] leading-relaxed">
                ผู้ออกแบบและพัฒนาระบบคำสั่งมาตรฐาน GEMINI UNIVERSAL AI OS ตั้งแต่ V1.0 จนถึง V6.1 เพื่อแก้ไข Command Integrity, สร้าง Bilingual Alias Layer, ระบบ Smart Router และกระบวนการตรวจคุณภาพ 50-Point QA Gate
              </p>
            </div>
          </div>
        </div>

        {/* Key V6.1 Innovations */}
        <div className="space-y-3 mb-5">
          <span className="font-mono text-cyan-400 font-semibold block uppercase">
            จุดเด่นสำคัญของรุ่น V6.1 (Key Innovations):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <span className="font-bold text-slate-200 block mb-1">
                1. 99 Canonical Commands
              </span>
              <p className="text-slate-400 text-[11px]">
                กำหนด 1 ชื่อมาตรฐานต่องาน 1 ประเภท พร้อมเก็บคำสั่งเดิมเป็น Alias เพื่อรักษา Backward Compatibility ครบ 100%
              </p>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <span className="font-bold text-slate-200 block mb-1">
                2. Bilingual Smart Router
              </span>
              <p className="text-slate-400 text-[11px]">
                รองรับคำสั่งไทย อังกฤษ และภาษาพูดธรรมชาติ แปลงไปยัง Canonical Command และสร้าง Multi-step pipeline โดยอัตโนมัติ
              </p>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <span className="font-bold text-slate-200 block mb-1">
                3. Missing Workflow Commands
              </span>
              <p className="text-slate-400 text-[11px]">
                เพิ่ม /analysis และ /academic เพื่อแก้ปัญหา Broken Workflow Reference ของ V6.0 อย่างสมบูรณ์
              </p>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <span className="font-bold text-slate-200 block mb-1">
                4. 50-Point QA Gate
              </span>
              <p className="text-slate-400 text-[11px]">
                กลไกตรวจสอบ 10 มิติ 50 จุด พร้อมรอบ Auto-Repair (REPAIR → RECHECK → DELIVER) เพื่อผลลัพธ์ระดับพรีเมียม
              </p>
            </div>
          </div>
        </div>

        {/* 15 System Commands */}
        <div className="mb-5">
          <span className="font-mono text-cyan-400 font-semibold block mb-2 uppercase">
            15 คำสั่งระบบ (System Commands):
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {SYSTEM_COMMANDS.map((sc, idx) => (
              <div
                key={idx}
                className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80 font-mono text-[11px]"
              >
                <span className="text-cyan-300 font-bold block">{sc.name}</span>
                <span className="text-slate-400 text-[10px] block line-clamp-1">
                  {sc.description}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Version Roadmap */}
        <div>
          <span className="font-mono text-cyan-400 font-semibold block mb-2 uppercase">
            แผนผังการพัฒนาระยะยาว (Version Roadmap):
          </span>
          <div className="space-y-2 text-[11px] font-mono text-slate-300">
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">V6.1:</span>
              <span>Command Integrity + Bilingual Layer + Canonical Registry + Legacy Aliases</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">V7.x:</span>
              <span>Editorial/Print, Brand Identity, Packaging, Digital Publishing, UX/UI Engines</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">V8.x:</span>
              <span>Intelligent Engine Discovery + Adaptive Orchestration</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">V9.x:</span>
              <span>Multi-Engine Collaboration + Cross-Media Workflow + Advanced QA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
