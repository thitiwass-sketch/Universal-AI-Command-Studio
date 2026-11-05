export interface EngineDef {
  id: string;
  code: string;
  name: string;
  nameTh: string;
  purpose: string;
  purposeTh: string;
  inputRequirements: string[];
  outputContract: string;
  dependencies: string[];
  qualityCriteria: string[];
  status: 'Active' | 'Ready' | 'Standby';
  category: 'Strategy' | 'UX & IA' | 'Design & Tokens' | 'Engineering' | 'Quality & Trust';
}

export const CORE_ENGINES: EngineDef[] = [
  {
    id: 'E01',
    code: 'E01',
    name: 'Product Strategy',
    nameTh: 'กลยุทธ์ผลิตภัณฑ์',
    purpose: 'Align user needs, business targets, competitive differentiation, and technical scope into actionable product bets.',
    purposeTh: 'ประสานความต้องการผู้ใช้ เป้าหมายธุรกิจ จุดเด่นการแข่งขัน และขอบเขตทางเทคนิคให้เป็นทิศทางที่ชัดเจน',
    inputRequirements: ['Core problem statement', 'Target audience definition', 'Business objectives'],
    outputContract: 'Product Brief, Value Proposition Canvas, Strategy Alignment Matrix',
    dependencies: [],
    qualityCriteria: ['Clear problem-solution fit', 'Quantifiable business metrics', 'Feasible boundary definitions'],
    status: 'Active',
    category: 'Strategy'
  },
  {
    id: 'E02',
    code: 'E02',
    name: 'UX Research',
    nameTh: 'การวิจัยผู้ใช้งาน',
    purpose: 'Synthesize evidence-grounded user insights, mental models, jobs-to-be-done, and pain points without fabrication.',
    purposeTh: 'สังเคราะห์ข้อมูลเชิงลึกของผู้ใช้ แบบจำลองความคิด งานที่ต้องทำ และปัญหาจริงโดยปราศจากการกุข้อมูล',
    inputRequirements: ['Target user segments', 'Usage contexts', 'Key research questions'],
    outputContract: 'Persona Evidence Dossier, JTBD Matrix, Empathy Map, Research Summary',
    dependencies: ['E01'],
    qualityCriteria: ['RULE 02 Evidence integrity enforced', 'Clear distinction between verified facts and assumptions', 'Actionable user needs'],
    status: 'Active',
    category: 'UX & IA'
  },
  {
    id: 'E03',
    code: 'E03',
    name: 'Information Architecture',
    nameTh: 'สถาปัตยกรรมสารสนเทศ',
    purpose: 'Structure navigation hierarchies, taxonomy, mental models, and content groupings to minimize cognitive friction.',
    purposeTh: 'จัดโครงสร้างการนำทาง อนุกรมวิธาน และการจัดกลุ่มเนื้อหาเพื่อลดภาระทางปัญญาของผู้ใช้',
    inputRequirements: ['Content inventory', 'Core user jobs', 'Domain entities'],
    outputContract: 'Site Map, Taxonomy Tree, Screen Inventory, Navigation Model',
    dependencies: ['E01', 'E02'],
    qualityCriteria: ['Hierarchical consistency', 'Intuitive labeling and naming conventions', 'Predictable navigation paths'],
    status: 'Active',
    category: 'UX & IA'
  },
  {
    id: 'E04',
    code: 'E04',
    name: 'User Journey and Task Flows',
    nameTh: 'เส้นทางผู้ใช้และโฟลว์งาน',
    purpose: 'Map step-by-step critical user journeys, happy paths, branching logic, edge cases, and decision gates.',
    purposeTh: 'สร้างแผนผังการใช้งานทีละขั้นตอน เส้นทางหลัก กรณีแยกย่อย และจุดตัดสินใจที่สำคัญ',
    inputRequirements: ['User goals', 'Navigation model', 'System trigger events'],
    outputContract: 'Critical User Journey (CUJ) Specs, Step-by-Step Task Flow Diagrams, State Transitions',
    dependencies: ['E03'],
    qualityCriteria: ['Zero dead-end states', 'Explicit error recovery branches', 'Clear system feedback indicators'],
    status: 'Active',
    category: 'UX & IA'
  },
  {
    id: 'E05',
    code: 'E05',
    name: 'UI Visual Design',
    nameTh: 'การออกแบบภาพส่วนติดต่อผู้ใช้',
    purpose: 'Formulate high-impact visual hierarchy, typographic scale, intentional spacing, depth, and cohesive brand expression.',
    purposeTh: 'กำหนดลำดับชั้นทางสายตา ขนาดตัวอักษร ระยะห่าง มิติความลึก และอัตลักษณ์ที่สอดคล้อง',
    inputRequirements: ['Screen inventory', 'Task flows', 'Brand guidelines'],
    outputContract: 'Wireframe Specifications, High-Fidelity Layout Specs, Visual Hierarchy Rules',
    dependencies: ['E03', 'E06'],
    qualityCriteria: ['Strong focal anchors', 'Calculated contrast ratios', 'Consistent layout rhythms'],
    status: 'Active',
    category: 'Design & Tokens'
  },
  {
    id: 'E06',
    code: 'E06',
    name: 'Design System',
    nameTh: 'ระบบการออกแบบ (Design System)',
    purpose: 'Architect semantic design tokens, reusable component contracts across all 10 interactive states, and governance rules.',
    purposeTh: 'ออกแบบ Token ทางสัญศาสตร์ สัญญาคอมโพเนนต์สำหรับทั้ง 10 สถานะ และระเบียบการกำกับดูแล',
    inputRequirements: ['Color primitives', 'Typography scale', 'Elevation & spacing scales'],
    outputContract: 'Token Specification, Component Contracts, Variant Matrix, Governance Guide',
    dependencies: ['E01'],
    qualityCriteria: ['RULE 07 Design consistency enforced', 'Full 10-state component coverage', 'Named token discipline'],
    status: 'Active',
    category: 'Design & Tokens'
  },
  {
    id: 'E07',
    code: 'E07',
    name: 'Responsive Design',
    nameTh: 'การออกแบบตอบสนองทุกอุปกรณ์',
    purpose: 'Define multi-device breakpoints, fluid reflow behaviors, container queries, and touch-pointer ergonomics.',
    purposeTh: 'กำหนดจุดตัดหน้าจอ พฤติกรรมการจัดเรียงเนื้อหา และสรีรศาสตร์การสัมผัสและการชี้',
    inputRequirements: ['Screen layout specs', 'Device target matrix'],
    outputContract: 'Breakpoint Strategy, Fluid Reflow Rules, Touch Target Specs (44x44px minimum)',
    dependencies: ['E05', 'E06'],
    qualityCriteria: ['Zero horizontal scroll overflows', 'Ergonomic touch targets', 'Seamless reflow across 360px-1920px+'],
    status: 'Active',
    category: 'Design & Tokens'
  },
  {
    id: 'E08',
    code: 'E08',
    name: 'AI and Agentic UX',
    nameTh: 'การออกแบบประสบการณ์ AI & ตัวแทนอัจฉริยะ',
    purpose: 'Design transparent human-in-the-loop interactions, uncertainty disclosure, confidence scoring, and deterministic fallbacks.',
    purposeTh: 'ออกแบบการปฏิสัมพันธ์ที่โปร่งใส การเปิดเผยความไม่แน่นอน และการสำรองการทำงานแบบแน่นอน',
    inputRequirements: ['AI capabilities', 'Interaction models', 'Risk thresholds'],
    outputContract: 'Agentic UX Blueprint, Confidence Indicator Specs, Fallback Matrix, Human Control Gates',
    dependencies: ['E04', 'E06'],
    qualityCriteria: ['RULE 03 User control over consequential actions', 'Transparent status', 'Deterministic fallback guarantee'],
    status: 'Active',
    category: 'UX & IA'
  },
  {
    id: 'E09',
    code: 'E09',
    name: 'Prototyping',
    nameTh: 'การสร้างต้นแบบเชิงปฏิบัติการ',
    purpose: 'Build interactive, testable mockups demonstrating state transitions, micro-interactions, and navigation flows.',
    purposeTh: 'สร้างแบบจำลองเชิงโต้ตอบที่ทดสอบได้เพื่อแสดงการเปลี่ยนสถานะและการนำทาง',
    inputRequirements: ['Screen specs', 'Component contracts', 'Interaction models'],
    outputContract: 'Interactive Prototype Specs, State Transition Tables, Micro-interaction Timing Specs',
    dependencies: ['E05', 'E06'],
    qualityCriteria: ['Faithful representation of state logic', 'Natural easing curves (150ms-300ms)', 'Realistic content context'],
    status: 'Active',
    category: 'Design & Tokens'
  },
  {
    id: 'E10',
    code: 'E10',
    name: 'Front-end Engineering',
    nameTh: 'วิศวกรรมฟรอนต์เอนด์',
    purpose: 'Implement clean, production-grade, accessible code adhering to component boundaries, semantic HTML, and strict typing.',
    purposeTh: 'พัฒนาโค้ดระดับโปรดักชันที่สะอาด เข้าถึงได้ และมีสถาปัตยกรรมคอมโพเนนต์ที่แข็งแกร่ง',
    inputRequirements: ['Component contracts', 'Design system tokens', 'State management rules'],
    outputContract: 'TypeScript Component Code, CSS/Tailwind Architecture, Hook Implementations, Build Artifacts',
    dependencies: ['E06', 'E07'],
    qualityCriteria: ['Strict TypeScript typing', 'Zero memory leaks', 'Separation of presentation and business logic'],
    status: 'Active',
    category: 'Engineering'
  },
  {
    id: 'E11',
    code: 'E11',
    name: 'Accessibility (a11y)',
    nameTh: 'การเข้าถึงและการไม่เลือกปฏิบัติ',
    purpose: 'Enforce WCAG 2.2 AA standards: 4.5:1 contrast, visible focus rings, ARIA roles, keyboard operability, and screen reader announcements.',
    purposeTh: 'บังคับใช้มาตรฐาน WCAG 2.2 AA: คอนทราสต์ 4.5:1 วงโฟกัสชัดเจน และใช้งานคีย์บอร์ดได้ 100%',
    inputRequirements: ['UI components', 'Color tokens', 'DOM tree semantics'],
    outputContract: 'WCAG 2.2 AA Audit Report, Screen Reader Transcript, Keyboard Navigation Path Matrix',
    dependencies: ['E05', 'E06', 'E10'],
    qualityCriteria: ['RULE 04 Strict WCAG 2.2 AA compliance', 'No keyboard traps', 'Polite live regions for dynamic alerts'],
    status: 'Active',
    category: 'Quality & Trust'
  },
  {
    id: 'E12',
    code: 'E12',
    name: 'Product Analytics',
    nameTh: 'การวิเคราะห์และวัดผลผลิตภัณฑ์',
    purpose: 'Define event tracking taxonomy, funnel metrics, telemetry schemas, and measurable business KPI indicators.',
    purposeTh: 'กำหนดอนุกรมวิธานการติดตามเหตุการณ์ เมทริกซ์กรวยการใช้งาน และตัวชี้วัดความสำเร็จของผลิตภัณฑ์',
    inputRequirements: ['Business objectives', 'Critical user journeys', 'Success criteria'],
    outputContract: 'Event Tracking Schema, Funnel Analysis Blueprint, Retention Metric Definitions',
    dependencies: ['E01', 'E04'],
    qualityCriteria: ['Privacy-compliant telemetry', 'Measurable conversion steps', 'Minimal client overhead'],
    status: 'Active',
    category: 'Strategy'
  },
  {
    id: 'E13',
    code: 'E13',
    name: 'Privacy and Security UX',
    nameTh: 'ความปลอดภัยและความเป็นส่วนตัว',
    purpose: 'Protect user trust through explicit consent dialogs, data minimization, credential safety, and zero key leakages.',
    purposeTh: 'ปกป้องความไว้วางใจผ่านความยินยอมที่ชัดเจน การลดการเก็บข้อมูล และการไม่รั่วไหลของกุญแจความลับ',
    inputRequirements: ['Data collection requirements', 'User permission boundaries'],
    outputContract: 'Privacy Impact Assessment, Consent Flow Specs, Data Minimization Audit',
    dependencies: ['E01', 'E10'],
    qualityCriteria: ['RULE 06 Zero credential exposure', 'Explicit consent models', 'GDPR/PDPA alignment'],
    status: 'Active',
    category: 'Quality & Trust'
  },
  {
    id: 'E14',
    code: 'E14',
    name: 'Performance Engineering',
    nameTh: 'วิศวกรรมสมรรถนะและความเร็ว',
    purpose: 'Optimize Core Web Vitals (LCP, CLS, INP), bundle budgets, rendering lifecycles, and network efficiency.',
    purposeTh: 'ปรับแต่งความเร็ว Core Web Vitals, ขนาดบันเดิล และประสิทธิภาพการเรนเดอร์',
    inputRequirements: ['Front-end codebase', 'Asset pipeline', 'Network requirements'],
    outputContract: 'Performance Budget, Web Vitals Benchmark Report, Optimization Plan',
    dependencies: ['E10'],
    qualityCriteria: ['LCP < 1.5s', 'CLS < 0.05', 'INP < 100ms', 'Zero blocking scripts'],
    status: 'Active',
    category: 'Engineering'
  },
  {
    id: 'E15',
    code: 'E15',
    name: 'Usability Validation',
    nameTh: 'การทดสอบความง่ายในการใช้งาน',
    purpose: 'Design realistic usability test protocols, cognitive walkthroughs, heuristic evaluations, and error tracking.',
    purposeTh: 'ออกแบบการประเมินการใช้งานจริง การสำรวจพฤติกรรมทางปัญญา และการตรวจจับข้อผิดพลาด',
    inputRequirements: ['Prototypes / implementations', 'User personas', 'Core tasks'],
    outputContract: 'Usability Test Plan, Heuristic Evaluation Scorecard, Cognitive Walkthrough Log',
    dependencies: ['E04', 'E09', 'E10'],
    qualityCriteria: ['Unbiased task phrasing', 'Observable success criteria', 'Actionable usability recommendations'],
    status: 'Active',
    category: 'Quality & Trust'
  },
  {
    id: 'E16',
    code: 'E16',
    name: 'QA and Defect Management',
    nameTh: 'การจัดการข้อบกพร่องและ QA',
    purpose: 'Classify P0-P3 defects, trace root causes, coordinate 3-iteration repair loops, and execute the 50-Point QA Gate.',
    purposeTh: 'จำแนกข้อบกพร่อง P0-P3 วิเคราะห์สาเหตุหลัก ควบคุมลูปซ่อม 3 รอบ และตรวจเกณฑ์ 50 จุด',
    inputRequirements: ['Test results', 'Implementation code', 'Requirement matrix'],
    outputContract: '50-Point QA Scorecard, Defect Register (P0-P3), Repair Loop Verification Log',
    dependencies: ['E01', 'E06', 'E10', 'E11'],
    qualityCriteria: ['RULE 09 Honest validation', 'P0/P1 zero release blocker policy', 'Reproducible defect logs'],
    status: 'Active',
    category: 'Quality & Trust'
  },
  {
    id: 'E17',
    code: 'E17',
    name: 'Documentation and Handoff',
    nameTh: 'เอกสารและแพ็กเกจส่งมอบงาน',
    purpose: 'Package comprehensive design tokens, screen specs, API contracts, test results, and release instructions.',
    purposeTh: 'รวบรวมเอกสารการออกแบบ สัญญา API ผลการทดสอบ และคู่มือการส่งต่องานอย่างสมบูรณ์',
    inputRequirements: ['All approved stage deliverables', 'QA sign-off'],
    outputContract: 'Complete Handoff Package, Engineering Implementation Notes, Release Checklist',
    dependencies: ['E01', 'E05', 'E06', 'E10', 'E16'],
    qualityCriteria: ['Zero undocumented dependencies', 'Precise setup and deploy steps', 'Clear known-limitations disclosure'],
    status: 'Active',
    category: 'Strategy'
  }
];

export interface WorkflowStageDef {
  stageNumber: number;
  stageCode: string;
  name: string;
  nameTh: string;
  deliverable: string;
  description: string;
  descriptionTh: string;
  associatedEngines: string[];
}

export const PRODUCT_ENGINEERING_STAGES: WorkflowStageDef[] = [
  {
    stageNumber: 1,
    stageCode: 'STAGE 01',
    name: 'Discovery',
    nameTh: 'การค้นพบและกำหนดโจทย์',
    deliverable: 'Project Brief',
    description: 'Identify product, audience, core problem, business objectives, delivery scope, and constraints.',
    descriptionTh: 'ระบุผลิตภัณฑ์ กลุ่มเป้าหมาย ปัญหาหลัก วัตถุประสงค์ธุรกิจ ขอบเขตงาน และข้อจำกัด',
    associatedEngines: ['E01', 'E02', 'E12']
  },
  {
    stageNumber: 2,
    stageCode: 'STAGE 02',
    name: 'Requirements',
    nameTh: 'ข้อกำหนดความต้องการ',
    deliverable: 'Requirements Specification',
    description: 'Define functional requirements, non-functional requirements, user stories, acceptance criteria, and dependencies.',
    descriptionTh: 'กำหนดความต้องการเชิงฟังก์ชันและไม่ใช่ฟังก์ชัน User Stories เกณฑ์การยอมรับ และการพึ่งพา',
    associatedEngines: ['E01', 'E02', 'E03']
  },
  {
    stageNumber: 3,
    stageCode: 'STAGE 03',
    name: 'UX Architecture',
    nameTh: 'สถาปัตยกรรมประสบการณ์ผู้ใช้',
    deliverable: 'Experience Architecture',
    description: 'Develop information architecture, navigation model, critical user journeys, task flows, and screen inventory.',
    descriptionTh: 'พัฒนาสถาปัตยกรรมสารสนเทศ แบบจำลองการนำทาง เส้นทางผู้ใช้ และสารบบหน้าจอ',
    associatedEngines: ['E03', 'E04', 'E08']
  },
  {
    stageNumber: 4,
    stageCode: 'STAGE 04',
    name: 'Design Foundation',
    nameTh: 'รากฐานระบบการออกแบบ',
    deliverable: 'Design System Specification',
    description: 'Define visual direction, design tokens, layout principles, typography, components, and interaction conventions.',
    descriptionTh: 'กำหนดทิศทางภาพ โทเค็นการออกแบบ หลักการจัดวาง คอมโพเนนต์ และแบบแผนการโต้ตอบ',
    associatedEngines: ['E05', 'E06', 'E07']
  },
  {
    stageNumber: 5,
    stageCode: 'STAGE 05',
    name: 'Interface Design',
    nameTh: 'การออกแบบส่วนต่อประสาน',
    deliverable: 'Screen Specifications',
    description: 'Specify wireframes, screen layouts, content hierarchy, responsive behavior, and critical interaction states.',
    descriptionTh: 'กำหนดโครงร่างหน้าจอ ลำดับขั้นเนื้อหา พฤติกรรมตอบสนอง และสถานะการโต้ตอบสำคัญ',
    associatedEngines: ['E05', 'E07', 'E09']
  },
  {
    stageNumber: 6,
    stageCode: 'STAGE 06',
    name: 'Prototype',
    nameTh: 'การสร้างต้นแบบ',
    deliverable: 'Prototype or Interaction Specification',
    description: 'Specify or construct the requested prototype, including state transitions, feedback, and navigation.',
    descriptionTh: 'สร้างต้นแบบที่ระบุการเปลี่ยนแปลงสถานะ การตอบสนอง และการนำทางอย่างชัดเจน',
    associatedEngines: ['E08', 'E09']
  },
  {
    stageNumber: 7,
    stageCode: 'STAGE 07',
    name: 'Engineering',
    nameTh: 'การพัฒนาและวิศวกรรมซอฟต์แวร์',
    deliverable: 'Implementation Plan, Code, or Technical Specification',
    description: 'Define component boundaries, state management, validation, data handling, and error recovery behaviors.',
    descriptionTh: 'กำหนดขอบเขตคอมโพเนนต์ การจัดการสถานะ การตรวจสอบข้อมูล และการจัดการข้อผิดพลาด',
    associatedEngines: ['E10', 'E13', 'E14']
  },
  {
    stageNumber: 8,
    stageCode: 'STAGE 08',
    name: 'Validation',
    nameTh: 'การตรวจสอบและประเมินผล',
    deliverable: 'QA Report and Defect Register',
    description: 'Review requirements, UX flows, interface consistency, responsive behavior, accessibility, and correctness.',
    descriptionTh: 'ตรวจทานความต้องการ โฟลว์การใช้งาน ความสม่ำเสมอของ UI ความเข้าถึงได้ และความถูกต้อง',
    associatedEngines: ['E11', 'E15', 'E16']
  },
  {
    stageNumber: 9,
    stageCode: 'STAGE 09',
    name: 'Repair',
    nameTh: 'การแก้ไขข้อบกพร่องตามลูป',
    deliverable: 'Revised Artifacts and Updated Defect Status',
    description: 'Fix the highest-priority defects and re-check affected acceptance criteria using max 3-iteration repair loop.',
    descriptionTh: 'แก้ไขข้อบกพร่องสำคัญที่สุดและตรวจสอบเกณฑ์การยอมรับอีกครั้งตามลูปจำกัด 3 รอบ',
    associatedEngines: ['E10', 'E16']
  },
  {
    stageNumber: 10,
    stageCode: 'STAGE 10',
    name: 'Handoff',
    nameTh: 'การส่งมอบงานและการเผยแพร่',
    deliverable: 'Handoff Package',
    description: 'Package specifications, implementation notes, outstanding issues, test instructions, and next steps.',
    descriptionTh: 'รวบรวมข้อกำหนด บันทึกการพัฒนา ปัญหาที่ค้างอยู่ คำแนะนำการทดสอบ และขั้นตอนถัดไป',
    associatedEngines: ['E16', 'E17']
  }
];
