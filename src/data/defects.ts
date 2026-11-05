export type DefectSeverity = 'P0' | 'P1' | 'P2' | 'P3';
export type DefectStatus = 'Open' | 'In Repair' | 'Retesting' | 'Resolved' | 'Closed';

export interface DefectRecord {
  defectId: string;
  title: string;
  severity: DefectSeverity;
  affectedRequirement: string;
  affectedComponent: string;
  reproductionSteps: string[];
  expectedBehavior: string;
  observedBehavior: string;
  rootCause: string;
  proposedFix: string;
  regressionRisk: string;
  retestCriteria: string;
  status: DefectStatus;
  iteration: number;
  createdAt: string;
  resolvedAt?: string;
}

export const INITIAL_DEFECTS: DefectRecord[] = [
  {
    defectId: 'DEF-001',
    title: 'Focus ring invisible on custom toggle switch when using keyboard Tab key',
    severity: 'P1',
    affectedRequirement: 'REQ-A11Y-04: WCAG 2.2 AA 2.4.7 Focus Visible',
    affectedComponent: 'ToggleSwitch.tsx',
    reproductionSteps: [
      'Navigate to Settings > Appearance using keyboard Tab',
      'Focus on "Dark Mode" toggle switch',
      'Observe no visible outline or contrast change around the toggle track'
    ],
    expectedBehavior: 'A high-contrast 2px cyan ring with 2px offset must clearly surround the toggle switch when focused.',
    observedBehavior: 'The element received focus but outline was suppressed via outline-none without ring replacement.',
    rootCause: 'Missing focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 class on interactive input.',
    proposedFix: 'Add focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 to the container button.',
    regressionRisk: 'Low — purely styling change on focus-visible state.',
    retestCriteria: 'Tab through the switch using Chrome and Safari; confirm prominent 2px cyan ring appears.',
    status: 'Resolved',
    iteration: 1,
    createdAt: '2026-10-12T14:10:00Z',
    resolvedAt: '2026-10-12T14:45:00Z'
  },
  {
    defectId: 'DEF-002',
    title: 'Text truncation hides mandatory disclaimer on mobile viewports (<380px)',
    severity: 'P2',
    affectedRequirement: 'REQ-RESP-02: Zero text truncation on legal & health disclosures',
    affectedComponent: 'HealthWarningBanner.tsx',
    reproductionSteps: [
      'Resize viewport to 360px width',
      'Open any health / wellbeing command response',
      'Notice Section 10 health disclaimer text truncated with ellipsis'
    ],
    expectedBehavior: 'Disclaimer must wrap onto multiple lines without truncation or overflow.',
    observedBehavior: 'truncate class was applied to the paragraph instead of leading-relaxed whitespace-normal.',
    rootCause: 'Improper CSS utility truncate applied to long-form compliance disclosure.',
    proposedFix: 'Remove truncate and replace with break-words leading-relaxed text-xs.',
    regressionRisk: 'Very low — banner height increases smoothly on small screens.',
    retestCriteria: 'Inspect banner at 320px, 360px, and 414px; verify complete disclaimer is legible.',
    status: 'Resolved',
    iteration: 1,
    createdAt: '2026-10-12T14:50:00Z',
    resolvedAt: '2026-10-12T15:10:00Z'
  }
];
