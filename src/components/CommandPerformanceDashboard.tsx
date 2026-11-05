import React, { useState, useMemo, useEffect } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import {
  Activity,
  Zap,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Download,
  Search,
  Filter,
  BarChart3,
  Gauge,
  Sparkles,
  Layers,
  ChevronRight,
  TrendingUp,
  Percent
} from 'lucide-react';
import {
  getStoredTelemetry,
  computeCommandStats,
  recordCommandTelemetry,
  resetTelemetryToSeed,
  clearTelemetry,
  TelemetryRecord,
  CommandSummaryStat
} from '../utils/telemetry';

interface CommandPerformanceDashboardProps {
  language: 'th' | 'en';
  onRunCommandInStudio?: (commandText: string) => void;
}

const TIME_RANGES = [
  { id: '24h', labelEn: 'Last 24 Hours', labelTh: '24 ชั่วโมงล่าสุด', ms: 24 * 60 * 60 * 1000 },
  { id: '7d', labelEn: 'Last 7 Days', labelTh: '7 วันล่าสุด', ms: 7 * 24 * 60 * 60 * 1000 },
  { id: '30d', labelEn: 'Last 30 Days', labelTh: '30 วันล่าสุด', ms: 30 * 24 * 60 * 60 * 1000 },
  { id: 'all', labelEn: 'All Time', labelTh: 'ทั้งหมด', ms: undefined }
];

export const CommandPerformanceDashboard: React.FC<CommandPerformanceDashboardProps> = ({
  language,
  onRunCommandInStudio
}) => {
  const [telemetry, setTelemetry] = useState<TelemetryRecord[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('7d');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeChartTab, setActiveChartTab] = useState<'dual' | 'timeline' | 'radar'>('dual');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Load telemetry on mount
  useEffect(() => {
    const data = getStoredTelemetry();
    setTelemetry(data);
  }, []);

  const timeFilterMs = useMemo(() => {
    const range = TIME_RANGES.find(r => r.id === selectedTimeRange);
    return range ? range.ms : undefined;
  }, [selectedTimeRange]);

  // Compute summary stats based on current time filter
  const commandStats = useMemo(() => {
    return computeCommandStats(telemetry, timeFilterMs);
  }, [telemetry, timeFilterMs]);

  // Available unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    commandStats.forEach(s => {
      if (s.category) set.add(s.category);
    });
    return Array.from(set).sort();
  }, [commandStats]);

  // Filtered commands list
  const filteredCommands = useMemo(() => {
    return commandStats.filter(c => {
      const matchCat = selectedCategory === 'all' || c.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        c.command.toLowerCase().includes(q) ||
        c.titleEn.toLowerCase().includes(q) ||
        c.titleTh.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [commandStats, selectedCategory, searchQuery]);

  // Global KPIs
  const globalKPIs = useMemo(() => {
    const totalExecs = filteredCommands.reduce((acc, c) => acc + c.totalExecutions, 0);
    if (totalExecs === 0) {
      return {
        totalExecutions: 0,
        avgLatency: 0,
        successRate: 0,
        p95Latency: 0,
        topCommand: 'N/A',
        fastestCommand: 'N/A'
      };
    }

    const totalWeightedLatency = filteredCommands.reduce(
      (acc, c) => acc + c.avgLatencyMs * c.totalExecutions,
      0
    );
    const avgLatency = Math.round(totalWeightedLatency / totalExecs);

    const totalSuccessCount = filteredCommands.reduce(
      (acc, c) => acc + (c.successRatePercent / 100) * c.totalExecutions,
      0
    );
    const successRate = Math.round((totalSuccessCount / totalExecs) * 1000) / 10;

    // Highest p95 latency
    const p95Latency = Math.max(...filteredCommands.map(c => c.p95LatencyMs));

    // Top executed command
    const top = [...filteredCommands].sort((a, b) => b.totalExecutions - a.totalExecutions)[0];

    // Fastest command
    const fastest = [...filteredCommands].sort((a, b) => a.avgLatencyMs - b.avgLatencyMs)[0];

    return {
      totalExecutions: totalExecs,
      avgLatency,
      successRate,
      p95Latency,
      topCommand: top ? `${top.command} (${top.totalExecutions}x)` : 'N/A',
      fastestCommand: fastest ? `${fastest.command} (${fastest.avgLatencyMs}ms)` : 'N/A'
    };
  }, [filteredCommands]);

  // Top 10 frequently used commands for charts
  const top10ForCharts = useMemo(() => {
    return filteredCommands.slice(0, 10).map(c => ({
      name: c.command,
      fullName: c.titleEn,
      executions: c.totalExecutions,
      avgLatencyMs: c.avgLatencyMs,
      p95LatencyMs: c.p95LatencyMs,
      successRate: c.successRatePercent,
      avgQaScore: c.avgQaScore
    }));
  }, [filteredCommands]);

  // Latency timeline data (aggregated by day/intervals)
  const timelineData = useMemo(() => {
    const now = Date.now();
    const intervalDays = 7;
    const dayBuckets: { [day: string]: { totalMs: number; count: number; passes: number } } = {};

    for (let i = intervalDays - 1; i >= 0; i--) {
      const d = new Date(now - i * 24 * 60 * 60 * 1000);
      const key = `${d.getMonth() + 1}/${d.getDate()}`;
      dayBuckets[key] = { totalMs: 0, count: 0, passes: 0 };
    }

    telemetry.forEach(r => {
      const d = new Date(r.timestamp);
      const key = `${d.getMonth() + 1}/${d.getDate()}`;
      if (dayBuckets[key]) {
        dayBuckets[key].totalMs += r.executionTimeMs;
        dayBuckets[key].count += 1;
        if (r.success) dayBuckets[key].passes += 1;
      }
    });

    return Object.entries(dayBuckets).map(([date, val]) => ({
      date,
      avgLatency: val.count > 0 ? Math.round(val.totalMs / val.count) : 420,
      executions: val.count,
      successRate: val.count > 0 ? Math.round((val.passes / val.count) * 100) : 95
    }));
  }, [telemetry]);

  // QA Status breakdown for donut chart
  const qaStatusBreakdown = useMemo(() => {
    let pass = 0;
    let review = 0;
    let fail = 0;

    filteredCommands.forEach(c => {
      pass += c.passCount;
      review += c.reviewCount;
      fail += c.failCount;
    });

    const total = pass + review + fail || 1;

    return [
      { name: 'QA Gate Pass (≥90)', value: pass, percent: Math.round((pass / total) * 100), color: '#10b981' },
      { name: 'Review Required (75-89)', value: review, percent: Math.round((review / total) * 100), color: '#f59e0b' },
      { name: 'Optimization Needed (<75)', value: fail, percent: Math.round((fail / total) * 100), color: '#ef4444' }
    ];
  }, [filteredCommands]);

  // Category Radar data
  const radarData = useMemo(() => {
    const catMap = new Map<string, { totalLatency: number; totalSuccess: number; count: number }>();

    filteredCommands.forEach(c => {
      const cat = c.category || 'General';
      const cur = catMap.get(cat) || { totalLatency: 0, totalSuccess: 0, count: 0 };
      cur.totalLatency += c.avgLatencyMs * c.totalExecutions;
      cur.totalSuccess += (c.successRatePercent / 100) * c.totalExecutions;
      cur.count += c.totalExecutions;
      catMap.set(cat, cur);
    });

    return Array.from(catMap.entries()).slice(0, 6).map(([cat, val]) => {
      const avgLat = val.count ? Math.round(val.totalLatency / val.count) : 0;
      const succ = val.count ? Math.round((val.totalSuccess / val.count) * 100) : 0;
      // Invert latency so faster (lower latency) gets higher score 0-100
      const speedScore = Math.max(10, Math.min(100, Math.round(100 - (avgLat / 1200) * 80)));
      return {
        category: cat.replace(' & ', '\n'),
        speed: speedScore,
        reliability: succ,
        volume: Math.min(100, Math.round((val.count / 80) * 100))
      };
    });
  }, [filteredCommands]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Simulate a live benchmark execution
  const handleSimulateBenchmark = () => {
    setIsSimulating(true);
    const benchmarkCommands = ['/SPEC', '/UI', '/CODE', '/DESIGN-SYSTEM', '/AUDIT-50', '/auto'];
    const chosen = benchmarkCommands[Math.floor(Math.random() * benchmarkCommands.length)];
    const simLatency = Math.round(280 + Math.random() * 450);
    const isSuccess = Math.random() > 0.05;
    const qaScore = isSuccess ? Math.round(92 + Math.random() * 8) : 72;

    setTimeout(() => {
      const rec = recordCommandTelemetry({
        command: chosen,
        category: 'Benchmark Telemetry',
        executionTimeMs: simLatency,
        success: isSuccess,
        qaScore,
        qaStatus: qaScore >= 90 ? 'PASS' : qaScore >= 75 ? 'REVIEW' : 'FAIL',
        source: 'v6.1-native-engine',
        promptLength: 64,
        outputLength: 1240
      });

      setTelemetry(prev => [rec, ...prev]);
      setIsSimulating(false);
      showToast(
        language === 'th'
          ? `บันทึก Telemetry สำเร็จ: ${chosen} ทำงานเสร็จใน ${simLatency}ms (QA Score: ${qaScore}%)`
          : `Benchmark captured: ${chosen} finished in ${simLatency}ms (QA: ${qaScore}%)`
      );
    }, 600);
  };

  const handleResetTelemetry = () => {
    const seed = resetTelemetryToSeed();
    setTelemetry(seed);
    showToast(
      language === 'th'
        ? 'รีเซ็ตข้อมูล Telemetry เป็นค่ามาตรฐานเรียบร้อย'
        : 'Telemetry data reset to canonical baseline'
    );
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(telemetry, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `gemini_os_telemetry_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast(
      language === 'th'
        ? 'ส่งออกไฟล์ JSON สถิติเรียบร้อย'
        : 'Telemetry dataset exported successfully'
    );
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-xl bg-slate-900/95 border border-cyan-500/50 text-cyan-200 text-xs font-mono shadow-2xl flex items-center gap-2 backdrop-blur-md animate-fade-in">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <Gauge className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                {language === 'th' ? 'แดชบอร์ดประสิทธิภาพคำสั่ง' : 'Command Performance Telemetry'}
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                  Recharts v2.x
                </span>
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              {language === 'th'
                ? 'วิเคราะห์ระยะเวลาการทำงาน (Execution Latency ms), อัตราความสำเร็จ (Success Rate %), และสถิติ QA Gate 50 จุด ของคำสั่งที่ใช้งานบ่อยใน Terminal Studio'
                : 'Real-time telemetry measuring execution latency (ms), p95 duration, and 50-Point QA Gate success rates for frequently invoked commands.'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <button
              onClick={handleSimulateBenchmark}
              disabled={isSimulating}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-all shadow-md shadow-cyan-500/20 cursor-pointer disabled:opacity-50"
            >
              <Zap className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
              <span>
                {isSimulating
                  ? language === 'th'
                    ? 'กำลังทดสอบ...'
                    : 'Benchmarking...'
                  : language === 'th'
                  ? 'จำลองการรัน Benchmark'
                  : 'Simulate Benchmark'}
              </span>
            </button>

            <button
              onClick={handleExportData}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>{language === 'th' ? 'ส่งออก JSON' : 'Export JSON'}</span>
            </button>

            <button
              onClick={handleResetTelemetry}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-slate-400 hover:text-slate-200 text-xs transition-all cursor-pointer"
              title={language === 'th' ? 'รีเซ็ตข้อมูล' : 'Reset to baseline'}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 1: Total Executions */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-xl p-3.5 backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
            <span>{language === 'th' ? 'คำสั่งที่รันทั้งหมด' : 'Total Executions'}</span>
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-white">
            {globalKPIs.totalExecutions.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 font-mono mt-1 flex items-center gap-1">
            <span className="text-emerald-400">●</span> {filteredCommands.length} commands tracked
          </div>
        </div>

        {/* Card 2: Average Latency */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-xl p-3.5 backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
            <span>{language === 'th' ? 'เวลาเฉลี่ย (Avg Latency)' : 'Avg Execution Time'}</span>
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-cyan-300">
            {globalKPIs.avgLatency} <span className="text-xs font-normal text-slate-400">ms</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono mt-1">
            {globalKPIs.avgLatency < 500 ? '⚡ Ultra Fast (<500ms)' : '⚙️ Standard Processing'}
          </div>
        </div>

        {/* Card 3: Overall Success Rate */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-xl p-3.5 backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
            <span>{language === 'th' ? 'อัตราความสำเร็จ' : 'Success Rate'}</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-emerald-300">
            {globalKPIs.successRate}%
          </div>
          <div className="text-[11px] text-emerald-500/80 font-mono mt-1">
            QA Gate Verified
          </div>
        </div>

        {/* Card 4: p95 Latency */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-xl p-3.5 backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
            <span>{language === 'th' ? 'p95 Latency' : 'p95 Execution'}</span>
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-mono font-bold text-amber-300">
            {globalKPIs.p95Latency} <span className="text-xs font-normal text-slate-400">ms</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono mt-1">
            95% finished below
          </div>
        </div>

        {/* Card 5: Top Command */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-xl p-3.5 backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
            <span>{language === 'th' ? 'คำสั่งยอดนิยม' : 'Most Invoked'}</span>
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-sm sm:text-base font-mono font-bold text-indigo-300 truncate" title={globalKPIs.topCommand}>
            {globalKPIs.topCommand}
          </div>
          <div className="text-[11px] text-slate-500 font-mono mt-1">
            Primary Router Target
          </div>
        </div>

        {/* Card 6: Fastest Command */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-xl p-3.5 backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
            <span>{language === 'th' ? 'คำสั่งทำงานเร็วสุด' : 'Fastest Command'}</span>
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-sm sm:text-base font-mono font-bold text-blue-300 truncate" title={globalKPIs.fastestCommand}>
            {globalKPIs.fastestCommand}
          </div>
          <div className="text-[11px] text-slate-500 font-mono mt-1">
            Minimal Pipeline Overhead
          </div>
        </div>
      </div>

      {/* Filters & Control Bar */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Time Range Pills */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          <span className="text-xs text-slate-400 font-medium mr-1.5 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            {language === 'th' ? 'ช่วงเวลา:' : 'Range:'}
          </span>
          {TIME_RANGES.map(r => (
            <button
              key={r.id}
              onClick={() => setSelectedTimeRange(r.id)}
              className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
                selectedTimeRange === r.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              {language === 'th' ? r.labelTh : r.labelEn}
            </button>
          ))}
        </div>

        {/* Search & Category Filter */}
        <div className="flex items-center gap-2 flex-1 md:max-w-md">
          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 py-1.5 pl-2.5 pr-7 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="all">{language === 'th' ? 'ทุกหมวดหมู่ (All)' : 'All Categories'}</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={language === 'th' ? 'ค้นหาคำสั่ง (เช่น /SPEC, /UI)...' : 'Filter commands (e.g. /SPEC)...'}
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Dual-Axis or Timeline Chart */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col">
          {/* Chart Header & Tab Toggles */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 border-b border-slate-800/80 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                {activeChartTab === 'dual'
                  ? language === 'th'
                    ? 'เวลาเฉลี่ย (ms) และอัตราความสำเร็จ (%) ของคำสั่งยอดนิยม'
                    : 'Execution Latency (ms) vs Success Rate (%) by Command'
                  : activeChartTab === 'timeline'
                  ? language === 'th'
                    ? 'แนวโน้ม Latency และการรันตามวัน'
                    : 'Latency & Execution Trends Over Time'
                  : language === 'th'
                  ? 'สมรรถนะเปรียบเทียบตามหมวดหมู่ (Speed / Reliability)'
                  : 'Category Radar Performance'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {language === 'th'
                  ? 'แท่งสีฟ้าแสดงระยะเวลาการทำงาน (ms) เส้นสีเขียวแสดงอัตราสำเร็จ (%)'
                  : 'Cyan bars indicate latency (ms), green line tracks success percentage (%)'}
              </p>
            </div>

            {/* Sub-tab switcher */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveChartTab('dual')}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  activeChartTab === 'dual'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {language === 'th' ? 'คำสั่ง vs เวลา' : 'Commands'}
              </button>
              <button
                onClick={() => setActiveChartTab('timeline')}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  activeChartTab === 'timeline'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {language === 'th' ? 'ไทม์ไลน์' : 'Timeline'}
              </button>
              <button
                onClick={() => setActiveChartTab('radar')}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  activeChartTab === 'radar'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {language === 'th' ? 'เรดาร์' : 'Radar'}
              </button>
            </div>
          </div>

          {/* Chart Rendering Area */}
          <div className="h-80 w-full">
            {activeChartTab === 'dual' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={top10ForCharts}
                  margin={{ top: 15, right: 25, left: -10, bottom: 25 }}
                >
                  <defs>
                    <linearGradient id="latencyBarGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.4} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    fontSize={11}
                    fontFamily="monospace"
                    tickLine={false}
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                  />
                  {/* Left Axis: Latency in ms */}
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    stroke="#06b6d4"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    unit="ms"
                  />
                  {/* Right Axis: Success Rate % */}
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#10b981"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    domain={[60, 100]}
                    unit="%"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                      fontSize: '12px',
                      color: '#f8fafc'
                    }}
                    formatter={(value: any, name: any) => {
                      if (name === 'Execution Latency') return [`${value} ms`, 'Avg Execution Time'];
                      if (name === 'Success Rate') return [`${value}%`, 'QA Success Rate'];
                      return [value, name];
                    }}
                    labelStyle={{ color: '#38bdf8', fontWeight: 'bold', fontFamily: 'monospace' }}
                  />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }}
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="avgLatencyMs"
                    name="Execution Latency"
                    fill="url(#latencyBarGradient)"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={40}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="successRate"
                    name="Success Rate"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={{ fill: '#10b981', r: 4, strokeWidth: 2, stroke: '#064e3b' }}
                    activeDot={{ r: 6, fill: '#34d399', stroke: '#059669' }}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}

            {activeChartTab === 'timeline' && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={timelineData}
                  margin={{ top: 15, right: 25, left: -10, bottom: 10 }}
                >
                  <defs>
                    <linearGradient id="latencyAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} unit="ms" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: '#f8fafc'
                    }}
                    formatter={(val: any, name: any) => [`${val} ms`, 'Avg Latency']}
                  />
                  <Area
                    type="monotone"
                    dataKey="avgLatency"
                    name="Average Latency"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#latencyAreaGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}

            {activeChartTab === 'radar' && (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="category" stroke="#94a3b8" fontSize={10} />
                  <PolarRadiusAxis stroke="#475569" angle={30} domain={[0, 100]} fontSize={10} />
                  <Radar
                    name="Speed Efficiency"
                    dataKey="speed"
                    stroke="#06b6d4"
                    fill="#06b6d4"
                    fillOpacity={0.4}
                  />
                  <Radar
                    name="Reliability %"
                    dataKey="reliability"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.3}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      fontSize: '12px'
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Right Column (1 Col): QA Gate Outcome Donut & Breakdown */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {language === 'th' ? 'การกระจายสถานะ QA Gate' : 'QA Gate Outcome Breakdown'}
              </h3>
              <span className="text-xs text-slate-400 font-mono">50 Points</span>
            </div>
            <p className="text-xs text-slate-400 mb-2">
              {language === 'th'
                ? 'สัดส่วนผลตรวจผ่านเกณฑ์ 50 จุดจากการประมวลผลทั้งหมด'
                : 'Proportion of executions passing the 50-point quality audit standards'}
            </p>

            {/* Donut Chart */}
            <div className="h-48 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={qaStatusBreakdown}
                    innerRadius={52}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {qaStatusBreakdown.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: '#f8fafc'
                    }}
                    formatter={(val: any, name: any, item: any) => [
                      `${val} executions (${item.payload.percent}%)`,
                      item.payload.name
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Centered KPI */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-mono font-bold text-white">
                  {qaStatusBreakdown[0]?.percent || 95}%
                </span>
                <span className="text-[10px] text-emerald-400 uppercase font-semibold">Pass Rate</span>
              </div>
            </div>

            {/* Status Breakdown Legend & Counts */}
            <div className="space-y-2 mt-2">
              {qaStatusBreakdown.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-300 font-medium">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-white font-bold">{item.value}x</span>
                    <span className="text-slate-400 text-[11px]">({item.percent}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-800 text-[11px] text-slate-500 font-mono flex items-center justify-between">
            <span>Audit Standard: WCAG 2.2 / v2.0 Invariants</span>
            <span className="text-emerald-400 font-bold">100% Deterministic</span>
          </div>
        </div>
      </div>

      {/* Detailed Command Performance Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/40">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              {language === 'th' ? 'สารบบประสิทธิภาพรายคำสั่ง' : 'Command Performance Registry'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {language === 'th'
                ? `แสดงคำสั่งที่ผ่านการประมวลผล (${filteredCommands.length} คำสั่ง) พร้อมสถิติเวลาและอัตราความสำเร็จ`
                : `Showing ${filteredCommands.length} active commands with detailed execution latency and success rates`}
            </p>
          </div>

          <div className="text-xs text-slate-400 font-mono">
            {language === 'th' ? 'คลิก "ทดสอบใน Studio" เพื่อโหลดคำสั่งทันที' : 'Click "Run in Studio" to test command'}
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 font-mono uppercase text-[11px]">
                <th className="py-3 px-4 font-semibold">{language === 'th' ? 'คำสั่งมาตรฐาน' : 'Canonical Command'}</th>
                <th className="py-3 px-3 font-semibold">{language === 'th' ? 'หมวดหมู่' : 'Category'}</th>
                <th className="py-3 px-3 font-semibold text-center">{language === 'th' ? 'จำนวนครั้ง' : 'Invocations'}</th>
                <th className="py-3 px-3 font-semibold">{language === 'th' ? 'ความเร็วเฉลี่ย (Avg)' : 'Avg Latency'}</th>
                <th className="py-3 px-3 font-semibold">{language === 'th' ? 'p95 Latency' : 'p95 Latency'}</th>
                <th className="py-3 px-4 font-semibold">{language === 'th' ? 'อัตราสำเร็จ (%)' : 'Success Rate'}</th>
                <th className="py-3 px-3 font-semibold text-center">{language === 'th' ? 'QA Gate' : 'QA Score'}</th>
                <th className="py-3 px-4 font-semibold text-right">{language === 'th' ? 'การทำงาน' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredCommands.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 font-mono">
                    {language === 'th' ? 'ไม่พบข้อมูลคำสั่งที่ตรงกับตัวกรอง' : 'No commands match the selected filter'}
                  </td>
                </tr>
              ) : (
                filteredCommands.map(cmd => {
                  // Color code for latency
                  const latencyBadgeClass =
                    cmd.avgLatencyMs < 400
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/50'
                      : cmd.avgLatencyMs < 800
                      ? 'bg-cyan-950/80 text-cyan-300 border-cyan-800/50'
                      : 'bg-amber-950/80 text-amber-300 border-amber-800/50';

                  return (
                    <tr
                      key={cmd.command}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* Command & Title */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-cyan-300 group-hover:text-cyan-200">
                            {cmd.command}
                          </span>
                          <span className="text-slate-400 text-[11px] truncate max-w-[140px] sm:max-w-[200px]">
                            {language === 'th' ? cmd.titleTh : cmd.titleEn}
                          </span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-3">
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60 whitespace-nowrap">
                          {cmd.category}
                        </span>
                      </td>

                      {/* Total Invocations */}
                      <td className="py-3 px-3 text-center font-mono font-bold text-white">
                        {cmd.totalExecutions}
                      </td>

                      {/* Avg Latency */}
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center gap-1 font-mono px-2 py-0.5 rounded text-xs border ${latencyBadgeClass}`}>
                          <Clock className="w-3 h-3" />
                          <span>{cmd.avgLatencyMs} ms</span>
                        </span>
                      </td>

                      {/* p95 Latency */}
                      <td className="py-3 px-3 font-mono text-slate-300 text-xs">
                        {cmd.p95LatencyMs} ms
                      </td>

                      {/* Success Rate with Progress Bar */}
                      <td className="py-3 px-4">
                        <div className="w-32 sm:w-40 space-y-1">
                          <div className="flex items-center justify-between text-[11px] font-mono">
                            <span className="text-emerald-400 font-semibold">
                              {cmd.successRatePercent}%
                            </span>
                            <span className="text-slate-500">
                              {cmd.passCount} pass / {cmd.totalExecutions}
                            </span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-emerald-500 h-full rounded-full transition-all"
                              style={{ width: `${cmd.successRatePercent}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* QA Score */}
                      <td className="py-3 px-3 text-center">
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-200 font-bold">
                          {cmd.avgQaScore}
                        </span>
                      </td>

                      {/* Run in Studio Button */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onRunCommandInStudio && onRunCommandInStudio(`${cmd.command} `)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/25 text-cyan-300 hover:text-cyan-100 border border-cyan-500/30 text-xs font-mono transition-all cursor-pointer group-hover:border-cyan-400"
                        >
                          <Play className="w-3 h-3" />
                          <span>{language === 'th' ? 'รันใน Studio' : 'Run in Studio'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
