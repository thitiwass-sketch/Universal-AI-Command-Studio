export interface ProjectSpecification {
  projectId: string;
  projectName: string;
  projectType: string;
  projectStatus: 'Discovery' | 'Requirements' | 'Architecture' | 'Design' | 'Prototype' | 'Engineering' | 'Validation' | 'Production';
  projectVersion: string;
  businessObjective: string;
  targetUsers: string;
  primaryUserJobs: string;
  coreProblem: string;
  successMetrics: string;
  platforms: string[];
  techStack: string;
  brandGuidelines: string;
  accessibilityRequirements: string;
  privacyRequirements: string;
  performanceRequirements: string;
  approvedDecisions: string[];
  openQuestions: string[];
  assumptions: string[];
  dependencies: string[];
  knownDefects: string[];
  currentMilestone: string;
  nextAction: string;
}

export const DEFAULT_PROJECT_SPEC: ProjectSpecification = {
  projectId: 'PRJ-2026-UIUX-001',
  projectName: 'NextGen University LMS & Student Portal',
  projectType: 'Higher Education Digital Experience Platform',
  projectStatus: 'Engineering',
  projectVersion: '2.0.0',
  businessObjective: 'Transform traditional university coursework and grading into an adaptive, accessible, and evidence-grounded student learning portal.',
  targetUsers: 'University Students, Teaching Assistants, Academic Faculty, Administrative Staff (NRRU & Global)',
  primaryUserJobs: 'Track course schedules, complete peer assignments, monitor GPA progress, and access interactive learning materials seamlessly across mobile & desktop.',
  coreProblem: 'Legacy academic portals suffer from fragmented information architecture, poor accessibility (WCAG AA non-compliant), and high cognitive overload during registration peaks.',
  successMetrics: 'Task completion rate >= 92%, System Usability Scale (SUS) >= 85, WCAG 2.2 AA verified pass, zero P0/P1 accessibility blockers, page load under 1.2s.',
  platforms: ['Responsive Web (Mobile 360px+)', 'Tablet (iPad/Android)', 'Desktop (1440px+)', 'PWA Offline Mode'],
  techStack: 'React 19, TypeScript, Tailwind CSS, Vite, Express Proxy, Firebase Firestore & Auth, @google/genai SDK',
  brandGuidelines: 'Academic Cyan-Slate palette (#06b6d4, #0f172a, #070b14), Plus Jakarta Sans & Sarabun typography, high contrast focus rings, calm motion aesthetics.',
  accessibilityRequirements: 'Strict WCAG 2.2 AA compliance: 4.5:1 text contrast, full keyboard navigation with visible focus rings, ARIA landmarks, polite status announcements, respects prefers-reduced-motion.',
  privacyRequirements: 'FERPA/PDPA compliant: Zero client-side storage of confidential student transcripts, anonymous research telemetry only, no sensitive API keys in client bundles.',
  performanceRequirements: 'Core Web Vitals: LCP < 1.5s, CLS < 0.05, INP < 100ms; bundle budget under 250KB gzipped.',
  approvedDecisions: [
    'Adopt Modular Product Engineering Intelligence OS v2.0 as architectural backbone',
    'Enforce 50-Point QA Gate across all 10 product lifecycle stages',
    'Implement dual bilingual support (Thai & English) for all core user journeys',
    'Persist saved executions and starred commands to Firebase Firestore'
  ],
  openQuestions: [
    'Should academic advisors have real-time collaborative canvas view in Stage 06 prototype?',
    'Targeting offline grading sync for rural practicum teachers?'
  ],
  assumptions: [
    'Students predominantly access the portal via mobile smartphones during transit and laptops in campus labs',
    'Instructors require deterministic batch export in CSV/PDF formats'
  ],
  dependencies: [
    'Firebase Authentication & Firestore rules',
    'Vite client bundling pipeline',
    '@google/genai SDK on server side proxy'
  ],
  knownDefects: [
    'None outstanding (P0/P1: 0, P2: 0, P3: 0)'
  ],
  currentMilestone: 'M03: Design System Tokens & Component Contracts Finalization',
  nextAction: 'Execute /DESIGN-SYSTEM and run 50-Point QA Gate verification'
};

export function generateProjectStateSummary(spec: ProjectSpecification): string {
  return `=== GEMINI UI/UX PRO MAX v2.0 — PROJECT_STATE_SUMMARY ===
PROJECT_ID: ${spec.projectId}
PROJECT_NAME: ${spec.projectName}
PROJECT_TYPE: ${spec.projectType}
PROJECT_STATUS: ${spec.projectStatus}
PROJECT_VERSION: ${spec.projectVersion}
BUSINESS_OBJECTIVE: ${spec.businessObjective}
TARGET_USERS: ${spec.targetUsers}
PRIMARY_USER_JOBS: ${spec.primaryUserJobs}
CORE_PROBLEM: ${spec.coreProblem}
SUCCESS_METRICS: ${spec.successMetrics}
PLATFORMS: ${spec.platforms.join(', ')}
TECH_STACK: ${spec.techStack}
BRAND_GUIDELINES: ${spec.brandGuidelines}
ACCESSIBILITY_REQUIREMENTS: ${spec.accessibilityRequirements}
PRIVACY_REQUIREMENTS: ${spec.privacyRequirements}
PERFORMANCE_REQUIREMENTS: ${spec.performanceRequirements}
APPROVED_DECISIONS:
${spec.approvedDecisions.map(d => ` - ${d}`).join('\n')}
OPEN_QUESTIONS:
${spec.openQuestions.map(q => ` - ${q}`).join('\n')}
ASSUMPTIONS:
${spec.assumptions.map(a => ` - ${a}`).join('\n')}
DEPENDENCIES:
${spec.dependencies.map(dep => ` - ${dep}`).join('\n')}
KNOWN_DEFECTS:
${spec.knownDefects.map(def => ` - ${def}`).join('\n')}
CURRENT_MILESTONE: ${spec.currentMilestone}
NEXT_ACTION: ${spec.nextAction}
============================================================`;
}
