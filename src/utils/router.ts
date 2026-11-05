import { ALL_COMMANDS, CommandContract } from '../data/commands';
import { AUTO_MODES, AutoMode } from '../data/autoModes';

export interface RouteResolution {
  originalInput: string;
  matchedCommands: CommandContract[];
  cleanPrompt: string;
  confidence: number;
  routeType: 'CANONICAL_EXACT' | 'ALIAS_MATCH' | 'THAI_TRIGGER' | 'NATURAL_INTENT' | 'MULTI_STEP_PIPELINE' | 'SYSTEM_COMMAND';
  explanationEn: string;
  explanationTh: string;
  suggestedMode: AutoMode;
  isPipeline: boolean;
  pipelineSteps: string[];
}

// Special alias dictionary for fast O(1) resolution
const ALIAS_MAP: Record<string, string> = {
  // English aliases
  '/ideation': '/brainstorm',
  '/createconcept': '/conceptdesign',
  '/business': '/businessidea',
  '/namemaker': '/naming',
  '/tagline': '/slogan',
  '/story': '/storytelling',
  '/characterdesign': '/character',
  '/situation': '/scenario',
  '/references': '/inspiration',
  '/paraphrase': '/rewrite',
  '/summary': '/summarize',
  '/elaborate': '/expand',
  '/proofread': '/correct',
  '/toneofvoice': '/tone',
  '/socialcaption': '/caption',
  '/headline': '/title',
  '/socialpost': '/post',
  '/emailwriting': '/email',
  '/articlewriting': '/article',
  '/explanation': '/explain',
  '/study': '/studysummary',
  '/mind-map': '/mindmap',
  '/test': '/quiz',
  '/conceptexplain': '/concept',
  '/deep-analysis': '/deepdive',
  '/translation': '/translate',
  '/practice': '/exercise',
  '/learningplan': '/studyplan',
  '/teach': '/tutor',
  '/codeexample': '/example',
  '/debugging': '/debug',
  '/optimization': '/optimize',
  '/code': '/generatecode',
  '/generate-code': '/generatecode',
  '/code-explain': '/explaincode',
  '/docs': '/documentation',
  '/conversion': '/convert',
  '/api-design': '/api',
  '/algorithms': '/algorithm',
  '/software': '/softwareproject',
  '/createimage': '/image',
  '@สร้างรูปภาพ': '/image',
  '/logodesign': '/logo',
  '/bannerdesign': '/banner',
  '/coverdesign': '/cover',
  '/colorpalette': '/palette',
  '/type': '/typography',
  '/editimage': '/imageedit',
  '/style': '/visualstyle',
  '/thumb': '/thumbnail',
  '/art-direct': '/artdirection',
  '/plan': '/planning',
  '/todo': '/checklist',
  '/meetingnotes': '/meeting',
  '/slides': '/presentation',
  '/organization': '/organize',
  '/prioritize': '/focus',
  '/goalsetting': '/goals',
  '/workflow': '/routine',
  '/projectmanagement': '/project',
  '/productivityplan': '/productivity',
  '/vlogscript': '/vlog',
  '/videoideas': '/videocontent',
  '/videoedit': '/videoediting',
  '/visualeffects': '/effects',
  '/shots': '/shotlist',
  '/gear': '/equipment',
  '/light': '/lighting',
  '/framing': '/composition',
  '/videotrend': '/videotrends',
  '/analyzevisual': '/visualanalysis',
  '/visualanalyze': '/visualanalysis',
  '/guidance': '/advice',
  '/personaldevelopment': '/selfdevelopment',
  '/communicationhelp': '/communication',
  '/conflictresolution': '/conflict',
  '/relationships': '/relationship',
  '/empatheticwriting': '/empathy',
  '/decisionsupport': '/decision',
  '/habitbuilding': '/habit',
  '/well-being': '/wellbeing',
  '/motivate': '/motivation',
  '/tripplan': '/travelplan',
  '/destinations': '/destination',
  '/tripbudget': '/travelbudget',
  '/accommodation': '/hotelplan',
  '/transportation': '/transport',
  '/food': '/foodguide',
  '/tripchecklist': '/travelchecklist',
  '/travel-documents': '/documents',
  '/travel-safe': '/travelsafety',
  '/travel-experience': '/experience',
  '/workout': '/fitness',
  '/diet': '/nutrition',
  '/supplements': '/supplement',
  '/water': '/hydration',
  '/sleephealth': '/sleep',
  '/health': '/healthinfo',
  '/wellnessplan': '/wellness',
  '/healthyaging': '/longevity',
  '/mentalwellbeing': '/mindcare',
  '/analyze': '/analysis',
  '/research': '/deepdive',
  '/academicwriter': '/academic'
};

export function resolveSmartRoute(rawInput: string): RouteResolution {
  const input = rawInput.trim();
  const lower = input.toLowerCase();

  // 1. Check for multi-command syntax in prompt, e.g. "@สร้างรูปภาพ /design", "/cover + /image", "/debug /optimize"
  const multiCommandRegex = /(@[\u0E00-\u0E7Fa-zA-Z0-9_-]+|\/[a-zA-Z0-9_-]+)/g;
  const explicitTokens = input.match(multiCommandRegex) || [];

  const matchedCanonicals: Set<string> = new Set();
  let remainingText = input;

  // Process explicit slash or @ commands
  if (explicitTokens.length > 0) {
    for (const token of explicitTokens) {
      const cleanToken = token.toLowerCase();
      // Check canonical
      const canonicalMatch = ALL_COMMANDS.find(c => c.canonical.toLowerCase() === cleanToken);
      if (canonicalMatch) {
        matchedCanonicals.add(canonicalMatch.canonical);
        remainingText = remainingText.replace(token, '').trim();
        continue;
      }

      // Check alias map
      if (ALIAS_MAP[cleanToken]) {
        matchedCanonicals.add(ALIAS_MAP[cleanToken]);
        remainingText = remainingText.replace(token, '').trim();
        continue;
      }

      // Special handling for legacy /design -> maps to /artdirection or conceptdesign
      if (cleanToken === '/design') {
        matchedCanonicals.add('/artdirection');
        remainingText = remainingText.replace(token, '').trim();
      }
    }
  }

  // 2. Specific Rule Checks from Section 4 Examples:
  // Example 1: '@สร้างรูปภาพ /design' -> /image + /artdirection
  if ((lower.includes('สร้างรูปภาพ') || lower.includes('@สร้างรูปภาพ')) && (lower.includes('/design') || lower.includes('ดีไซน์'))) {
    matchedCanonicals.add('/image');
    matchedCanonicals.add('/artdirection');
  }

  // Example 2: 'สร้างภาพหน้าปกตำรา' -> /cover + /image
  if (lower.includes('หน้าปกตำรา') || (lower.includes('ปก') && (lower.includes('ตำรา') || lower.includes('หนังสือ')))) {
    matchedCanonicals.add('/cover');
    matchedCanonicals.add('/image');
  }

  // Example 3: 'ช่วยวิเคราะห์งานวิจัย' -> /analysis + /deepdive
  if (lower.includes('วิเคราะห์งานวิจัย') || (lower.includes('วิเคราะห์') && lower.includes('วิจัย'))) {
    matchedCanonicals.add('/analysis');
    matchedCanonicals.add('/academic');
  }

  // Example 4: 'เขียนบทที่ 1 งานวิจัย' -> /academic + /article
  if (lower.includes('บทที่') && (lower.includes('วิจัย') || lower.includes('วิทยานิพนธ์') || lower.includes('thesis'))) {
    matchedCanonicals.add('/academic');
    matchedCanonicals.add('/article');
  }

  // Example 5: 'วิเคราะห์ภาพนี้' -> /visualanalysis
  if (lower.includes('วิเคราะห์ภาพนี้') || lower.includes('วิเคราะห์ภาพ') || lower.includes('วิเคราะห์รูป')) {
    matchedCanonicals.add('/visualanalysis');
  }

  // 3. Natural Language Intent Matchers across Thai triggers and canonicals
  if (matchedCanonicals.size === 0) {
    for (const cmd of ALL_COMMANDS) {
      // Check Thai triggers
      for (const trigger of cmd.thaiTriggers) {
        if (input.includes(trigger)) {
          matchedCanonicals.add(cmd.canonical);
          break;
        }
      }
      if (matchedCanonicals.size >= 2) break;
    }
  }

  // Keyword heuristic matching if still none
  if (matchedCanonicals.size === 0) {
    if (lower.includes('code') || lower.includes('เขียนโค้ด') || lower.includes('ฟังก์ชัน') || lower.includes('typescript')) {
      matchedCanonicals.add('/generatecode');
    } else if (lower.includes('bug') || lower.includes('error') || lower.includes('แก้บั๊ก')) {
      matchedCanonicals.add('/debug');
    } else if (lower.includes('summarize') || lower.includes('สรุป')) {
      matchedCanonicals.add('/summarize');
    } else if (lower.includes('translate') || lower.includes('แปล')) {
      matchedCanonicals.add('/translate');
    } else if (lower.includes('image') || lower.includes('รูป') || lower.includes('วาดรูป')) {
      matchedCanonicals.add('/image');
    } else if (lower.includes('plan') || lower.includes('วางแผน')) {
      matchedCanonicals.add('/planning');
    } else if (lower.includes('research') || lower.includes('วิจัย')) {
      matchedCanonicals.add('/deepdive');
    } else {
      // Default to /brainstorm or general
      matchedCanonicals.add('/brainstorm');
    }
  }

  const matchedList = Array.from(matchedCanonicals)
    .map(canon => ALL_COMMANDS.find(c => c.canonical === canon))
    .filter((c): c is CommandContract => c !== undefined);

  const isPipeline = matchedList.length > 1;
  const pipelineSteps = matchedList.map(c => c.canonical);

  // Confidence calculation
  let confidence = 85;
  let routeType: RouteResolution['routeType'] = 'NATURAL_INTENT';

  if (explicitTokens.length > 0) {
    confidence = 99;
    routeType = isPipeline ? 'MULTI_STEP_PIPELINE' : 'CANONICAL_EXACT';
  } else if (matchedList.some(c => c.thaiTriggers.some(t => input.includes(t)))) {
    confidence = 95;
    routeType = isPipeline ? 'MULTI_STEP_PIPELINE' : 'THAI_TRIGGER';
  }

  const primaryCmd = matchedList[0] || ALL_COMMANDS[0];
  const suggestedMode = AUTO_MODES.find(m => m.name === primaryCmd.defaultAutoMode) || AUTO_MODES[0];

  const explanationEn = isPipeline
    ? `Multi-step pipeline detected: ${pipelineSteps.join(' ➔ ')}. Routed via Smart Intent Decomposition.`
    : `Routed to canonical command ${primaryCmd.canonical} (${primaryCmd.titleEn}). Confidence: ${confidence}%.`;

  const explanationTh = isPipeline
    ? `ระบบตรวจพบเวิร์กโฟลว์ต่อเนื่องหลายขั้นตอน: ${pipelineSteps.join(' ➔ ')} ผ่านการตรวจจับเจตนาอัจฉริยะ`
    : `ส่งคำสั่งไปยัง ${primaryCmd.canonical} (${primaryCmd.titleTh}) ความแม่นยำ ${confidence}%`;

  return {
    originalInput: input,
    matchedCommands: matchedList,
    cleanPrompt: remainingText || input,
    confidence,
    routeType,
    explanationEn,
    explanationTh,
    suggestedMode,
    isPipeline,
    pipelineSteps
  };
}
