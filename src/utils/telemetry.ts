import { ALL_COMMANDS } from '../data/commands';

export interface TelemetryRecord {
  id: string;
  command: string;
  category: string;
  timestamp: number;
  executionTimeMs: number;
  success: boolean;
  qaScore: number;
  qaStatus: 'PASS' | 'REVIEW' | 'FAIL';
  source: 'gemini-3.8-flash' | 'v6.1-native-engine';
  promptLength: number;
  outputLength: number;
}

const STORAGE_KEY = 'v61_command_telemetry';

// Realistic baseline seed telemetry to visualize comprehensive multi-command analytics
const generateSeedTelemetry = (): TelemetryRecord[] => {
  const seed: TelemetryRecord[] = [];
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  // Frequently used commands in Terminal Studio with realistic latency profiles & success rates
  const profiles: Array<{
    command: string;
    category: string;
    baseLatency: number;
    latencyVariance: number;
    successRate: number;
    avgQaScore: number;
    count: number;
  }> = [
    { command: '/auto', category: 'General & Orchestration', baseLatency: 380, latencyVariance: 90, successRate: 0.98, avgQaScore: 97, count: 48 },
    { command: '/SPEC', category: 'UX Architecture & Spec', baseLatency: 640, latencyVariance: 120, successRate: 0.96, avgQaScore: 98, count: 36 },
    { command: '/UI', category: 'Interface Design & Tokens', baseLatency: 520, latencyVariance: 110, successRate: 0.94, avgQaScore: 95, count: 42 },
    { command: '/CODE', category: 'Engineering & Syntax', baseLatency: 780, latencyVariance: 180, successRate: 0.92, avgQaScore: 94, count: 39 },
    { command: '/DESIGN-SYSTEM', category: 'Design Foundation', baseLatency: 590, latencyVariance: 130, successRate: 0.97, avgQaScore: 99, count: 28 },
    { command: '/AUDIT-50', category: 'Quality & Defect Assurance', baseLatency: 450, latencyVariance: 80, successRate: 0.99, avgQaScore: 99, count: 31 },
    { command: '/REPAIR', category: 'Quality & Defect Assurance', baseLatency: 610, latencyVariance: 140, successRate: 0.91, avgQaScore: 92, count: 24 },
    { command: '/EXPORT', category: 'Handoff & Packaging', baseLatency: 310, latencyVariance: 60, successRate: 0.99, avgQaScore: 98, count: 22 },
    { command: '/PROTOTYPE', category: 'Interface Design & Tokens', baseLatency: 720, latencyVariance: 160, successRate: 0.93, avgQaScore: 93, count: 26 },
    { command: '/brainstorm', category: 'Ideas & Creativity', baseLatency: 340, latencyVariance: 70, successRate: 0.98, avgQaScore: 96, count: 25 },
    { command: '/conceptdesign', category: 'Ideas & Creativity', baseLatency: 490, latencyVariance: 100, successRate: 0.95, avgQaScore: 95, count: 21 },
    { command: '/researchanalysis', category: 'Academic & Analysis', baseLatency: 820, latencyVariance: 210, successRate: 0.91, avgQaScore: 93, count: 19 },
    { command: '/debug', category: 'Engineering & Syntax', baseLatency: 680, latencyVariance: 150, successRate: 0.89, avgQaScore: 91, count: 23 },
    { command: '/image', category: 'Visual & Media', baseLatency: 910, latencyVariance: 240, successRate: 0.94, avgQaScore: 94, count: 18 },
    { command: '/optimize', category: 'Engineering & Syntax', baseLatency: 650, latencyVariance: 130, successRate: 0.93, avgQaScore: 94, count: 17 }
  ];

  let idCounter = 1;

  profiles.forEach(prof => {
    for (let i = 0; i < prof.count; i++) {
      // Distribute timestamps over the last 14 days
      const daysAgo = Math.random() * 14;
      const timestamp = now - daysAgo * dayMs;
      
      // Random variation around base latency
      const jitter = (Math.random() - 0.5) * 2 * prof.latencyVariance;
      const executionTimeMs = Math.max(120, Math.round(prof.baseLatency + jitter));
      
      const isSuccess = Math.random() < prof.successRate;
      const qaScore = isSuccess 
        ? Math.min(100, Math.max(88, Math.round(prof.avgQaScore + (Math.random() * 6 - 3))))
        : Math.round(65 + Math.random() * 18);
        
      const qaStatus = qaScore >= 90 ? 'PASS' : qaScore >= 75 ? 'REVIEW' : 'FAIL';
      const source = Math.random() > 0.4 ? 'gemini-3.8-flash' : 'v6.1-native-engine';

      seed.push({
        id: `seed_${idCounter++}`,
        command: prof.command,
        category: prof.category,
        timestamp,
        executionTimeMs,
        success: isSuccess,
        qaScore,
        qaStatus,
        source,
        promptLength: Math.round(40 + Math.random() * 180),
        outputLength: Math.round(600 + Math.random() * 1800)
      });
    }
  });

  return seed.sort((a, b) => b.timestamp - a.timestamp);
};

export const getStoredTelemetry = (): TelemetryRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seed = generateSeedTelemetry();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const seed = generateSeedTelemetry();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    return parsed;
  } catch {
    return generateSeedTelemetry();
  }
};

export const recordCommandTelemetry = (record: Omit<TelemetryRecord, 'id' | 'timestamp'>): TelemetryRecord => {
  const current = getStoredTelemetry();
  const newRecord: TelemetryRecord = {
    ...record,
    id: `exec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: Date.now()
  };

  const updated = [newRecord, ...current].slice(0, 500); // retain latest 500 records
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to persist telemetry record', e);
  }

  return newRecord;
};

export const resetTelemetryToSeed = (): TelemetryRecord[] => {
  const seed = generateSeedTelemetry();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
  } catch {}
  return seed;
};

export const clearTelemetry = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
};

export interface CommandSummaryStat {
  command: string;
  category: string;
  titleEn: string;
  titleTh: string;
  totalExecutions: number;
  avgLatencyMs: number;
  minLatencyMs: number;
  maxLatencyMs: number;
  p95LatencyMs: number;
  successRatePercent: number;
  avgQaScore: number;
  passCount: number;
  reviewCount: number;
  failCount: number;
}

export const computeCommandStats = (
  records: TelemetryRecord[],
  timeFilterMs?: number
): CommandSummaryStat[] => {
  const now = Date.now();
  const filtered = timeFilterMs
    ? records.filter(r => now - r.timestamp <= timeFilterMs)
    : records;

  const grouped = new Map<string, TelemetryRecord[]>();

  filtered.forEach(r => {
    const existing = grouped.get(r.command) || [];
    existing.push(r);
    grouped.set(r.command, existing);
  });

  const stats: CommandSummaryStat[] = [];

  grouped.forEach((cmdRecords, cmdName) => {
    const total = cmdRecords.length;
    if (total === 0) return;

    const latencies = cmdRecords.map(r => r.executionTimeMs).sort((a, b) => a - b);
    const sumLatency = latencies.reduce((acc, curr) => acc + curr, 0);
    const avgLatency = Math.round(sumLatency / total);
    const minLatency = latencies[0];
    const maxLatency = latencies[latencies.length - 1];
    
    // p95
    const p95Index = Math.min(latencies.length - 1, Math.floor(latencies.length * 0.95));
    const p95Latency = latencies[p95Index];

    const successes = cmdRecords.filter(r => r.success).length;
    const successRate = Math.round((successes / total) * 1000) / 10;

    const sumQa = cmdRecords.reduce((acc, curr) => acc + curr.qaScore, 0);
    const avgQa = Math.round((sumQa / total) * 10) / 10;

    const passCount = cmdRecords.filter(r => r.qaStatus === 'PASS').length;
    const reviewCount = cmdRecords.filter(r => r.qaStatus === 'REVIEW').length;
    const failCount = cmdRecords.filter(r => r.qaStatus === 'FAIL').length;

    // Resolve category and titles from commands registry if available
    const contract = ALL_COMMANDS.find(c => c.canonical.toLowerCase() === cmdName.toLowerCase());
    const category = contract ? contract.category : (cmdRecords[0]?.category || 'General');
    const titleEn = contract ? contract.titleEn : cmdName;
    const titleTh = contract ? contract.titleTh : cmdName;

    stats.push({
      command: cmdName,
      category,
      titleEn,
      titleTh,
      totalExecutions: total,
      avgLatencyMs: avgLatency,
      minLatencyMs: minLatency,
      maxLatencyMs: maxLatency,
      p95LatencyMs: p95Latency,
      successRatePercent: successRate,
      avgQaScore: avgQa,
      passCount,
      reviewCount,
      failCount
    });
  });

  return stats.sort((a, b) => b.totalExecutions - a.totalExecutions);
};
