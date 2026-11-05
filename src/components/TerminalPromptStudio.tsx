import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Copy,
  Check,
  RotateCw,
  Terminal,
  Cpu,
  Layers,
  Wand2,
  Image as ImageIcon,
  BookOpen,
  HeartPulse,
  Gauge,
  Zap,
  Columns,
  Rows,
  CornerDownLeft
} from 'lucide-react';
import { resolveSmartRoute, RouteResolution } from '../utils/router';
import { ALL_COMMANDS, CommandContract } from '../data/commands';
import { AUTO_MODES, AutoMode } from '../data/autoModes';
import { runQAAudit, QAAuditResult } from '../data/qaGates';
import { User } from 'firebase/auth';
import { saveExecutionToFirestore } from '../lib/firebase';
import { recordCommandTelemetry } from '../utils/telemetry';

interface TerminalPromptStudioProps {
  currentMode: AutoMode;
  onSelectMode: (mode: AutoMode) => void;
  language: 'th' | 'en';
  onNavigateToQA: (result?: QAAuditResult) => void;
  onNavigateToPerformance?: () => void;
  user?: User | null;
  initialPrompt?: string;
  focusTrigger?: number;
}

interface QuickExampleItem {
  icon: string;
  categoryTh: string;
  categoryEn: string;
  labelTh: string;
  labelEn: string;
  prompt: string;
  badges: string[];
}

const QUICK_EXAMPLES: QuickExampleItem[] = [
  {
    icon: '🎨',
    categoryTh: 'สร้างภาพและศิลป์',
    categoryEn: 'Visual & Art Direction',
    labelTh: 'สร้างภาพเมืองลอยน้ำพลังงานแสงอาทิตย์ปี 2150',
    labelEn: 'Neo-Ayutthaya Floating Solar City 2150',
    prompt: '@สร้างรูปภาพ /design เมืองลอยน้ำพลังงานแสงอาทิตย์สไตล์นีโอ-อยุธยาในปี 2150 พร้อมคลองเรืองแสงชีวภาพ',
    badges: ['/image', '/design']
  },
  {
    icon: '📘',
    categoryTh: 'สื่อวิชาการ',
    categoryEn: 'Academic Publishing',
    labelTh: 'สร้างภาพหน้าปกตำรา ปัญญาประดิษฐ์ มรภ.นครราชสีมา',
    labelEn: 'Textbook Cover AI & Neural Engineering NRRU',
    prompt: 'สร้างภาพหน้าปกตำรา เรื่อง หลักการปัญญาประดิษฐ์และวิศวกรรมประสาทเทียม มหาวิทยาลัยราชภัฏนครราชสีมา',
    badges: ['/cover', '/image']
  },
  {
    icon: '📄',
    categoryTh: 'วิเคราะห์งานวิจัย',
    categoryEn: 'Research Analysis',
    labelTh: 'ช่วยวิเคราะห์งานวิจัย การเรียนรู้ของโมเดล LLM',
    labelEn: 'Analyze Research on Multimodal LLM Education',
    prompt: 'ช่วยวิเคราะห์งานวิจัย เกี่ยวกับผลกระทบของการใช้ปัญญาประดิษฐ์มัลติโมดอลในการจัดการศึกษาระดับอุดมศึกษา',
    badges: ['/analysis', '/academic']
  },
  {
    icon: '✍️',
    categoryTh: 'งานเขียนวิชาการ',
    categoryEn: 'Academic Writing',
    labelTh: 'เขียนบทที่ 1 งานวิจัย นวัตกรรมดิจิทัลสำหรับครู',
    labelEn: 'Write Thesis Chapter 1 for Education AI',
    prompt: 'เขียนบทที่ 1 งานวิจัย เรื่องการพัฒนาแพลตฟอร์มการเรียนรู้เฉพาะบุคคลด้วย AI สำหรับนักศึกษาครู',
    badges: ['/academic', '/article']
  },
  {
    icon: '🔍',
    categoryTh: 'วิจารณ์ภาพและจัดแสง',
    categoryEn: 'Visual Critique',
    labelTh: 'วิเคราะห์สัดส่วนทองคำ จุดตัดเก้าช่อง และการจัดแสง',
    labelEn: 'Analyze Golden Ratio, Lighting & Semiotics',
    prompt: 'วิเคราะห์ภาพนี้ ประเมินองค์ประกอบภาพ กฎจุดตัดเก้าช่อง การจัดแสง และสัญศาสตร์เชิงลึก',
    badges: ['/visualanalysis', '/critique']
  },
  {
    icon: '🐛',
    categoryTh: 'แก้ไขและปรับแต่งโค้ด',
    categoryEn: 'Debug & Optimization',
    labelTh: 'ตรวจและแก้ Bug async worker pool memory leak',
    labelEn: 'Debug & Fix Async Worker Memory Leak',
    prompt: '/debug /optimize ตรวจสอบโค้ดระบบคิว async worker pool ใน TypeScript ที่เกิด memory leak เมื่อยกเลิกงาน',
    badges: ['/debug', '/optimize']
  }
];

export const TerminalPromptStudio: React.FC<TerminalPromptStudioProps> = ({
  currentMode,
  onSelectMode,
  language,
  onNavigateToQA,
  onNavigateToPerformance,
  user,
  initialPrompt = '',
  focusTrigger = 0
}) => {
  const [inputPrompt, setInputPrompt] = useState(initialPrompt);
  const [resolution, setResolution] = useState<RouteResolution | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionDurationMs, setExecutionDurationMs] = useState<number | null>(null);
  const [outputResult, setOutputResult] = useState<string | null>(null);
  const [executionMeta, setExecutionMeta] = useState<{
    source: string;
    command: string;
    mode: string;
    time: string;
  } | null>(null);
  const [qaResult, setQaResult] = useState<QAAuditResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [showCommandSuggestions, setShowCommandSuggestions] = useState(false);
  const [highlightInputRing, setHighlightInputRing] = useState(false);
  const [shortcutFeedbackToast, setShortcutFeedbackToast] = useState(false);
  
  // Layout mode: 'stacked' (vertical bottom output) or 'split' (side-by-side right console)
  const [layoutMode, setLayoutMode] = useState<'stacked' | 'split'>('stacked');

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (initialPrompt) {
      setInputPrompt(initialPrompt);
      textareaRef.current?.focus();
    }
  }, [initialPrompt]);

  // Handle global shortcut focus trigger (Ctrl+K / Cmd+K)
  useEffect(() => {
    if (focusTrigger && focusTrigger > 0) {
      const timer = setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          const len = textareaRef.current.value.length;
          textareaRef.current.setSelectionRange(len, len);
          textareaRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setHighlightInputRing(true);
          setShortcutFeedbackToast(true);
          setTimeout(() => setHighlightInputRing(false), 1500);
          setTimeout(() => setShortcutFeedbackToast(false), 2200);
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [focusTrigger]);

  // Update Smart Route in real-time as user types
  useEffect(() => {
    if (inputPrompt.trim()) {
      const res = resolveSmartRoute(inputPrompt);
      setResolution(res);
    } else {
      setResolution(null);
    }
  }, [inputPrompt]);

  // Handle command autocomplete suggestions
  const commandMatches = inputPrompt.startsWith('/')
    ? ALL_COMMANDS.filter(c => c.canonical.toLowerCase().startsWith(inputPrompt.toLowerCase().split(' ')[0]))
    : [];

  const handleSelectSuggestion = (canonical: string) => {
    const parts = inputPrompt.split(' ');
    parts[0] = canonical;
    setInputPrompt(parts.join(' ') + ' ');
    setShowCommandSuggestions(false);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleExecute = async () => {
    if (!inputPrompt.trim() || isExecuting) return;

    setIsExecuting(true);
    const activeRoute = resolution || resolveSmartRoute(inputPrompt);
    const primaryCmd = activeRoute.matchedCommands[0]?.canonical || '/auto';
    const startTime = performance.now();

    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: inputPrompt,
          command: primaryCmd,
          autoMode: currentMode.name,
          userLang: language
        })
      });

      const data = await res.json();
      const latencyMs = Math.round(performance.now() - startTime);
      setExecutionDurationMs(latencyMs);

      const outputText = data.output || 'Execution completed.';
      setOutputResult(outputText);
      setExecutionMeta({
        source: data.source || 'gemini-3.8-flash',
        command: primaryCmd,
        mode: currentMode.name,
        time: new Date().toLocaleTimeString()
      });

      // Run 50-Point QA Gate
      const audit = runQAAudit(outputText, primaryCmd, currentMode.name);
      setQaResult(audit);

      // Record to Telemetry Dataset for Performance Dashboard
      recordCommandTelemetry({
        command: primaryCmd,
        category: activeRoute.matchedCommands[0]?.category || 'General',
        executionTimeMs: latencyMs,
        success: audit.status === 'PASS' || audit.totalScore >= 75,
        qaScore: audit.totalScore,
        qaStatus: audit.status,
        source: (data.source as any) || 'v6.1-native-engine',
        promptLength: inputPrompt.length,
        outputLength: outputText.length
      });

      // Persist to Firestore if user is authenticated
      if (user?.uid) {
        saveExecutionToFirestore({
          userId: user.uid,
          prompt: inputPrompt,
          command: primaryCmd,
          autoMode: currentMode.name,
          output: outputText,
          qaScore: audit.totalScore,
          qaStatus: audit.status,
          createdAt: new Date().toISOString()
        }).catch(() => {});
      }
    } catch {
      const latencyMs = Math.round(performance.now() - startTime);
      setExecutionDurationMs(latencyMs);
      // Fallback local processing
      const fallbackAudit = runQAAudit('System completed local dispatch.', primaryCmd, currentMode.name);
      setQaResult(fallbackAudit);

      recordCommandTelemetry({
        command: primaryCmd,
        category: activeRoute.matchedCommands[0]?.category || 'General',
        executionTimeMs: latencyMs,
        success: false,
        qaScore: fallbackAudit.totalScore,
        qaStatus: fallbackAudit.status,
        source: 'v6.1-native-engine',
        promptLength: inputPrompt.length,
        outputLength: 30
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCopy = () => {
    if (!outputResult) return;
    navigator.clipboard.writeText(outputResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAutoRepair = async () => {
    if (!outputResult) return;
    const repairPrompt = `[QA AUTO-REPAIR LOOP: REPAIR -> RECHECK -> DELIVER]
Original Request: ${inputPrompt}
Previous Output: ${outputResult.slice(0, 300)}...
Failing or Review Criteria: Audit detected points needing repair under the 50-Point QA Gate.
Directive: Refine and complete the response to achieve 100% PASS on all critical items. Ensure complete Command Contract compliance and strict Section 8/9/10 integrity.`;

    setInputPrompt(repairPrompt);
    setTimeout(() => {
      handleExecute();
    }, 100);
  };

  const isVisual = resolution?.matchedCommands.some(c => c.isVisual) || inputPrompt.includes('ภาพ') || inputPrompt.includes('image');
  const isAcademic = resolution?.matchedCommands.some(c => c.isAcademic) || inputPrompt.includes('วิจัย') || inputPrompt.includes('research');
  const isHealth = resolution?.matchedCommands.some(c => c.isHighStakesHealth) || inputPrompt.includes('สุขภาพ') || inputPrompt.includes('health');

  // Render the Console / Output Drawer Component
  const renderOutputConsole = () => {
    if (!outputResult) {
      if (layoutMode === 'split') {
        return (
          <div className="bg-[#070b14] border border-slate-700/80 rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center text-center min-h-[460px]">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center mb-4 text-cyan-400">
              <Terminal className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-bold text-slate-100 mb-1">
              {language === 'th' ? 'พื้นที่แสดงผลการประมวลผล (Console Standby)' : 'Output Console Standby'}
            </h3>
            <p className="text-xs text-slate-300 max-w-sm mb-4 leading-relaxed">
              {language === 'th'
                ? 'เลือกตัวอย่างคำสั่งด้านบนหรือป้อน Prompt จากนั้นกดปุ่ม Execute V6.1 OS เพื่อดูผลลัพธ์แบบ Split View'
                : 'Select a quick example or enter your prompt, then click Execute V6.1 OS to view results in Split View.'}
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-300 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>50-Point QA Gate Ready · WCAG 2.1 AA</span>
            </div>
          </div>
        );
      }
      return null;
    }

    return (
      <div className="bg-[#070b14] border border-slate-700/80 rounded-2xl shadow-xl overflow-hidden animate-fadeIn">
        {/* Output Header */}
        <div className="bg-[#0c1222] px-4 py-2.5 border-b border-slate-700/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-300 font-mono text-xs font-bold">
              <Check className="w-4 h-4 text-emerald-400" />
              DELIVERED
            </span>
            {executionMeta && (
              <span className="text-xs text-slate-300 font-mono hidden sm:inline">
                Engine: <span className="text-cyan-300 font-semibold">{executionMeta.source}</span> · Cmd:{' '}
                <span className="text-cyan-300 font-semibold">{executionMeta.command}</span> · Mode:{' '}
                <span className="text-cyan-300 font-semibold">{executionMeta.mode}</span>
              </span>
            )}
          </div>

          {/* QA Score & Latency Chips */}
          {qaResult && (
            <div className="flex items-center gap-2">
              {executionDurationMs !== null && onNavigateToPerformance && (
                <button
                  onClick={onNavigateToPerformance}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold border border-cyan-500/40 bg-cyan-950/80 text-cyan-200 hover:bg-cyan-900 cursor-pointer transition-all shadow-xs focus-visible:ring-2 focus-visible:ring-cyan-400"
                  title="Click to view Command Performance & Telemetry Dashboard"
                  aria-label={`Execution latency ${executionDurationMs} milliseconds. Click for performance dashboard.`}
                >
                  <Zap className="w-3 h-3 text-cyan-400" />
                  <span>{executionDurationMs}ms</span>
                </button>
              )}

              <button
                onClick={() => onNavigateToQA(qaResult)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold border cursor-pointer transition-all focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                  qaResult.status === 'PASS'
                    ? 'bg-emerald-950 border-emerald-500/60 text-emerald-200 hover:bg-emerald-900'
                    : 'bg-amber-950 border-amber-500/60 text-amber-200 hover:bg-amber-900'
                }`}
                title="Click to view detailed 50-Point audit"
                aria-label={`QA Gate result: ${qaResult.totalScore}% score, ${qaResult.status}`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>50-PT QA: {qaResult.totalScore}% {qaResult.status}</span>
              </button>

              {qaResult.status !== 'PASS' && (
                <button
                  onClick={handleAutoRepair}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-950 border border-cyan-500 text-xs font-medium text-cyan-200 hover:bg-cyan-900 cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400"
                  aria-label="Auto Repair output using QA guidelines"
                >
                  <Wand2 className="w-3 h-3" />
                  <span>Auto Repair</span>
                </button>
              )}

              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors cursor-pointer border border-slate-700 focus-visible:ring-2 focus-visible:ring-cyan-400"
                title="Copy full output"
                aria-label="Copy output text to clipboard"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          )}
        </div>

        {/* Section 10 Health Warning Banner if Health Command */}
        {isHealth && (
          <div className="bg-amber-950/40 border-b border-amber-500/30 p-3.5 flex items-start gap-3 text-amber-100 text-xs">
            <HeartPulse className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold block text-amber-200 mb-0.5">
                Section 10 High-Stakes Health Honesty Protocol Active:
              </strong>
              <span className="text-amber-100 leading-relaxed">
                {language === 'th'
                  ? 'ข้อมูลด้านสุขภาพต่อไปนี้มีวัตถุประสงค์เพื่อการศึกษาและการดูแลสุขภาวะทั่วไปเท่านั้น มิใช่คำวินิจฉัยทางการแพทย์หรือการสั่งจ่ายยา ในกรณีฉุกเฉินหรือมีอาการรุนแรง กรุณาติดต่อหน่วยแพทย์ฉุกเฉิน 1669 ทันที'
                  : 'The health guidance below is strictly educational. It does not replace clinical consultation, diagnosis, or prescription by a licensed medical practitioner.'}
              </span>
            </div>
          </div>
        )}

        {/* Section 9 Visual Protocol Interactive Studio Card if Visual Command */}
        {isVisual && (
          <div className="bg-[#090f20] border-b border-slate-700/80 p-3.5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
              <span className="text-xs font-semibold text-cyan-200 flex items-center gap-2">
                <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                Section 9 Visual / Image Protocol Blueprint
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-300 font-mono">Aspect Ratio:</span>
                {['16:9', '1:1', '9:16', '3:4', '4:5'].map(ar => (
                  <button
                    key={ar}
                    onClick={() => setAspectRatio(ar)}
                    className={`px-2.5 py-0.5 rounded text-xs font-mono transition-colors cursor-pointer ${
                      aspectRatio === ar
                        ? 'bg-cyan-400 text-slate-950 font-bold'
                        : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-700'
                    }`}
                  >
                    {ar}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-700 text-xs text-slate-200 font-mono">
              <div className="text-cyan-300 font-medium mb-1">Production Image Prompt Tag:</div>
              <div className="text-slate-100 selection:bg-cyan-500/40">
                {inputPrompt} --ar {aspectRatio} --style raw --v 6.1
              </div>
            </div>
          </div>
        )}

        {/* Section 8 Academic Protocol Indicator if Academic Command */}
        {isAcademic && (
          <div className="bg-blue-950/40 border-b border-blue-900/40 p-3 flex items-center justify-between text-xs text-blue-200">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span>
                Section 8 Protocol Enforced: Claim · Evidence · Interpretation · Assumption · Zero Fabricated DOIs
              </span>
            </div>
            <span className="font-mono text-xs text-blue-300 font-bold">
              APA 7 Validated
            </span>
          </div>
        )}

        {/* Formatted Output Body with High Contrast (Slate-100) */}
        <div className="p-6 text-sm text-slate-100 leading-relaxed font-sans whitespace-pre-wrap selection:bg-cyan-500/30">
          {outputResult}
        </div>

        {/* Output Footer Actions */}
        <div className="bg-[#0c1222] px-6 py-2.5 border-t border-slate-700/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300 font-mono">
          <div>
            ผู้พัฒนาสร้างสรรค์: ฐิติวัสส์ กาญจนพิมาย · มหาวิทยาลัยราชภัฏนครราชสีมา (NRRU)
          </div>
          <div className="flex items-center gap-2 font-sans">
            <button
              onClick={handleCopy}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 flex items-center gap-1.5 transition-colors cursor-pointer text-xs font-semibold border border-slate-700 focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Response'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      {/* 1. Quick Prompts Section (Optimized Clean Grid Layout with Badges) */}
      <div className="bg-[#090e1a] border border-slate-700/80 rounded-2xl p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-100">
              {language === 'th' ? 'ตัวอย่างคำสั่งทดสอบระบบ V6.1' : 'Quick Test Prompts V6.1'}
            </h2>
          </div>
          <span className="text-xs text-slate-300 font-mono">
            {language === 'th' ? 'คลิกเพื่อโหลดคำสั่งและทดสอบการจับคู่ Pipeline' : 'Click to populate prompt into studio'}
          </span>
        </div>

        {/* Responsive Grid with Icons, Readable Titles, and Special Command Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {QUICK_EXAMPLES.map((ex, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputPrompt(ex.prompt);
                if (textareaRef.current) {
                  textareaRef.current.focus();
                }
              }}
              className="text-left p-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 hover:bg-slate-850 transition-all cursor-pointer group flex flex-col justify-between gap-2.5 focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
              aria-label={`Prompt template: ${language === 'th' ? ex.labelTh : ex.labelEn}`}
            >
              <div className="flex items-start gap-2.5">
                <span className="text-lg leading-none shrink-0 p-1.5 rounded-lg bg-slate-800 border border-slate-700" aria-hidden="true">
                  {ex.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-mono text-cyan-400 font-semibold block uppercase tracking-wide">
                    {language === 'th' ? ex.categoryTh : ex.categoryEn}
                  </span>
                  <span className="text-xs font-semibold text-slate-100 group-hover:text-cyan-200 transition-colors line-clamp-2">
                    {language === 'th' ? ex.labelTh : ex.labelEn}
                  </span>
                </div>
              </div>

              {/* Badges for special commands positioned cleanly below each button */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800/80">
                {ex.badges.map((badge, bIdx) => (
                  <span
                    key={bIdx}
                    className="px-2 py-0.5 rounded-md bg-cyan-950 border border-cyan-500/40 text-[10px] font-mono font-semibold text-cyan-300 shadow-xs"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Studio Layout Wrapper: Stacked View or Split View */}
      <div className={layoutMode === 'split' ? 'grid grid-cols-1 lg:grid-cols-2 gap-5 items-start' : 'space-y-5'}>
        {/* Main Terminal Input Console */}
        <div className="bg-[#070b14] border border-slate-700/90 rounded-2xl shadow-xl overflow-hidden">
          {/* Terminal Header */}
          <div className="bg-[#0c1222] px-4 py-2.5 border-b border-slate-700/80 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 mr-2" aria-hidden="true">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              </div>
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono text-slate-200 font-semibold tracking-tight">
                ~/nrru-ai/gemini-os-v6.1/prompt-studio
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Layout Switcher (Split View vs Stacked View) */}
              <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => setLayoutMode('stacked')}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                    layoutMode === 'stacked'
                      ? 'bg-cyan-950 text-cyan-200 font-bold border border-cyan-500/40'
                      : 'text-slate-300 hover:text-white'
                  }`}
                  title="Stacked View (Output at Bottom)"
                  aria-label="Switch to Stacked View"
                >
                  <Rows className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[11px]">{language === 'th' ? 'ด้านล่าง' : 'Stacked'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLayoutMode('split')}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                    layoutMode === 'split'
                      ? 'bg-cyan-950 text-cyan-200 font-bold border border-cyan-500/40'
                      : 'text-slate-300 hover:text-white'
                  }`}
                  title="Split View (Side-by-Side Output Console)"
                  aria-label="Switch to Split View"
                >
                  <Columns className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[11px]">{language === 'th' ? 'ด้านขวา (Split)' : 'Split'}</span>
                </button>
              </div>

              {onNavigateToPerformance && (
                <button
                  onClick={onNavigateToPerformance}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-200 text-xs font-mono transition-all cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-cyan-400"
                  title="Open Command Performance & Telemetry Dashboard"
                  aria-label="View Command Performance Telemetry Dashboard"
                >
                  <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline">{language === 'th' ? 'สถิติ' : 'Telemetry'}</span>
                </button>
              )}

              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-300 hidden md:inline">Mode:</span>
                <select
                  value={currentMode.name}
                  onChange={(e) => {
                    const found = AUTO_MODES.find(m => m.name === e.target.value);
                    if (found) onSelectMode(found);
                  }}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-mono text-cyan-300 font-semibold focus:outline-none focus:border-cyan-400 cursor-pointer"
                  aria-label="Select Target Auto Mode"
                >
                  {AUTO_MODES.map(mode => (
                    <option key={mode.id} value={mode.name}>
                      {mode.name} ({mode.nameTh})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Prompt Input Area */}
          <div className="p-4 relative">
            {/* Shortcut Feedback Toast (Only displays momentarily when Ctrl+K is pressed) */}
            {shortcutFeedbackToast && (
              <div className="absolute top-2 right-6 z-20 px-2.5 py-1 rounded-lg bg-cyan-950 border border-cyan-400 text-cyan-200 text-xs font-mono shadow-xl flex items-center gap-1.5 animate-fadeIn">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                <span>{language === 'th' ? 'โฟกัสช่องป้อนคำสั่งแล้ว (Ctrl+K)' : 'Input focused via Ctrl+K'}</span>
              </div>
            )}

            {/* Accessible Textarea with high contrast and explicit Ctrl+K instruction in placeholder */}
            <textarea
              ref={textareaRef}
              value={inputPrompt}
              onChange={(e) => {
                setInputPrompt(e.target.value);
                setShowCommandSuggestions(e.target.value.startsWith('/'));
              }}
              placeholder={
                language === 'th'
                  ? 'ป้อนคำสั่งหรือข้อความภาษาไทย/อังกฤษ เช่น: @สร้างรูปภาพ /design, สร้างภาพหน้าปกตำรา, ช่วยวิเคราะห์งานวิจัย, /debug /optimize... (กด Ctrl+K เพื่อโฟกัสได้ทุกเมื่อ)'
                  : 'Enter canonical command, alias, or natural prompt in Thai/English (e.g. @createimage /design, /cover, /academic, /debug)... (Press Ctrl+K anytime to focus)'
              }
              rows={5}
              className={`w-full bg-[#080d19] text-slate-100 rounded-xl p-3.5 border transition-all resize-y text-sm font-sans placeholder:text-slate-400 focus:outline-none ${
                highlightInputRing
                  ? 'border-cyan-400 ring-2 ring-cyan-400/80 shadow-lg shadow-cyan-500/20 bg-slate-900'
                  : 'border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400'
              }`}
              aria-label="Command prompt input field. Press Ctrl+K to focus anytime."
            />

            {/* Slash Autocomplete Suggestions Popup */}
            {showCommandSuggestions && commandMatches.length > 0 && (
              <div className="absolute top-[90px] left-6 right-6 z-20 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-h-56 overflow-y-auto p-1.5">
                <div className="px-2.5 py-1 text-xs text-slate-300 font-mono border-b border-slate-800 flex items-center justify-between">
                  <span>Canonical Command Suggestions:</span>
                  <span className="text-cyan-400 font-semibold">{commandMatches.length} available</span>
                </div>
                {commandMatches.slice(0, 8).map(cmd => (
                  <button
                    key={cmd.id}
                    onClick={() => handleSelectSuggestion(cmd.canonical)}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-cyan-950/80 hover:text-cyan-100 flex items-center justify-between text-xs transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-cyan-300">{cmd.canonical}</span>
                      <span className="text-slate-200">— {language === 'th' ? cmd.titleTh : cmd.titleEn}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {cmd.category}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Real-time Smart Router Resolution Banner */}
            {resolution && (
              <div className="mt-3 p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/40 via-slate-900/70 to-slate-900/40 border border-slate-700/80 text-xs animate-fadeIn">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-300 uppercase tracking-wider">
                      ROUTER: {resolution.routeType}
                    </span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-200 font-medium">
                      {language === 'th' ? resolution.explanationTh : resolution.explanationEn}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-300 font-mono text-xs">Confidence:</span>
                    <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                      <div
                        className="h-full bg-cyan-400 rounded-full"
                        style={{ width: `${resolution.confidence}%` }}
                      />
                    </div>
                    <span className="font-mono text-cyan-300 font-bold text-xs">{resolution.confidence}%</span>
                  </div>
                </div>

                {/* Matched Canonical Nodes */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
                  <span className="text-slate-300 text-xs">Resolved Pipeline:</span>
                  {resolution.matchedCommands.map((cmd, i) => (
                    <React.Fragment key={cmd.id}>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-cyan-200 font-mono text-xs shadow-xs">
                        <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                        <strong className="text-cyan-300">{cmd.canonical}</strong>
                        <span className="text-slate-300 text-[11px]">
                          ({language === 'th' ? cmd.titleTh : cmd.titleEn})
                        </span>
                      </span>
                      {i < resolution.matchedCommands.length - 1 && (
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                      )}
                    </React.Fragment>
                  ))}

                  <span className="ml-auto text-xs text-slate-300 flex items-center gap-1 font-mono">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    Auto Mode:
                    <span className="text-cyan-300 font-semibold">
                      {resolution.suggestedMode.name}
                    </span>
                  </span>
                </div>
              </div>
            )}

            {/* Action Footer: Status notice & High-Contrast Execute Button */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>50-Point QA Gate Active · Auto-Repair Enabled</span>
              </div>

              {/* High Contrast, Tactile Execute Button with Crisp Hover & Active States */}
              <button
                onClick={handleExecute}
                disabled={isExecuting || !inputPrompt.trim()}
                className="px-6 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-400/25 hover:shadow-cyan-300/40 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:outline-none"
                aria-label="Execute prompt using V6.1 OS engine"
              >
                {isExecuting ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Processing V6.1 Engine...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-slate-950" />
                    <span>Execute V6.1 OS</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Output Console / Drawer Area (Rendered either as second column in Split View or below in Stacked View) */}
        {renderOutputConsole()}
      </div>
    </div>
  );
};
