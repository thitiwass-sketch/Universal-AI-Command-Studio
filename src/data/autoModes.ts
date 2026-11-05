export interface AutoMode {
  id: number;
  name: string;
  nameTh: string;
  description: string;
  descriptionTh: string;
  systemDirective: string;
  primaryCategories: string[];
  recommendedCommands: string[];
  icon: string;
}

export const AUTO_MODES: AutoMode[] = [
  {
    id: 1,
    name: 'AUTO GENERAL',
    nameTh: 'โหมดทั่วไปอัตโนมัติ',
    description: 'Dynamic general-purpose mode with balanced creativity, precision, and bilingual fluency.',
    descriptionTh: 'โหมดอเนกประสงค์ ปรับตัวตามบริบทคำถามอย่างสมดุล รวดเร็ว และแม่นยำ',
    systemDirective: 'Respond with high clarity, structured information density, and natural tone matching user language.',
    primaryCategories: ['Ideas & Creativity', 'Writing & Content', 'Work & Productivity'],
    recommendedCommands: ['/brainstorm', '/summarize', '/explain', '/planning', '/advice'],
    icon: 'Sparkles'
  },
  {
    id: 2,
    name: 'ACADEMIC',
    nameTh: 'โหมดวิชาการ',
    description: 'Strict scholarly mode adhering to Section 8 Academic Protocol: separates Claim, Evidence, Interpretation, and Assumption.',
    descriptionTh: 'โหมดวิชาการขั้นสูง แยกข้ออ้าง หลักฐาน การตีความ และข้อสมมติฐานอย่างเคร่งครัด',
    systemDirective: 'Enforce Section 8: Isolate Claims, Empirical Evidence, Interpretations, and Assumptions. Use APA 7 style when requested. Never fabricate citations or DOIs.',
    primaryCategories: ['Study & Learning', 'Writing & Content'],
    recommendedCommands: ['/academic', '/concept', '/deepdive', '/article'],
    icon: 'GraduationCap'
  },
  {
    id: 3,
    name: 'RESEARCH',
    nameTh: 'โหมดการวิจัย',
    description: 'Methodological rigor for literature review, hypothesis formulation, and synthesis.',
    descriptionTh: 'มุ่งเน้นการทบทวนวรรณกรรม ระเบียบวิธีวิจัย การตั้งสมมติฐาน และการสังเคราะห์ผลงาน',
    systemDirective: 'Analyze prior research, evaluate sample validity, detail methodology, and highlight limitations.',
    primaryCategories: ['Study & Learning'],
    recommendedCommands: ['/analysis', '/deepdive', '/supplement', '/longevity'],
    icon: 'Microscope'
  },
  {
    id: 4,
    name: 'ACADEMIC WRITER',
    nameTh: 'โหมดนักเขียนวิชาการ',
    description: 'Produce publication-ready scholarly manuscripts, abstracts, literature reviews, and thesis chapters.',
    descriptionTh: 'เขียนต้นฉบับบทความวิจัย บทคัดย่อ บทที่ 1-5 และวิทยานิพนธ์ตามหลักระเบียบวิธีวิจัย',
    systemDirective: 'Draft formal academic prose. Use objective third-person syntax, precise scholarly vocabulary, and coherent conceptual progression.',
    primaryCategories: ['Writing & Content', 'Study & Learning'],
    recommendedCommands: ['/academic', '/article', '/rewrite', '/title'],
    icon: 'BookOpen'
  },
  {
    id: 5,
    name: 'TEACHING',
    nameTh: 'โหมดการสอนและการถ่ายทอด',
    description: 'Pedagogical scaffolding using Socratic inquiry, progressive examples, and guided checks.',
    descriptionTh: 'เน้นการสอนแบบมีส่วนร่วม ใช้คำถามนำทาง (Socratic Method) และย่อยเนื้อหาให้จำง่าย',
    systemDirective: 'Adopt an encouraging, patient pedagogical posture. Break knowledge into bite-sized steps with check-for-understanding questions.',
    primaryCategories: ['Study & Learning'],
    recommendedCommands: ['/tutor', '/quiz', '/exercise', '/explain'],
    icon: 'Users'
  },
  {
    id: 6,
    name: 'LEARNING',
    nameTh: 'โหมดการเรียนรู้ด้วยตนเอง',
    description: 'Active recall, Cornell note generation, mind maps, and Feynman-technique comprehension.',
    descriptionTh: 'ช่วยผู้เรียนสรุปประเด็น ท่องจำ วาดผังความคิด และเข้าใจแนวคิดจากรากฐาน',
    systemDirective: 'Facilitate self-directed mastery. Present flashcard prompts, analogies, and mind maps for rapid cognitive absorption.',
    primaryCategories: ['Study & Learning'],
    recommendedCommands: ['/studysummary', '/mindmap', '/studyplan', '/concept'],
    icon: 'Brain'
  },
  {
    id: 7,
    name: 'DESIGN',
    nameTh: 'โหมดการออกแบบและอัตลักษณ์',
    description: 'Conceptual design, brand identities, typography pairings, color theories, and design systems.',
    descriptionTh: 'ออกแบบอัตลักษณ์แบรนด์ โลโก้ ชุดสี ตัวอักษร และระบบการออกแบบที่กลมกลืน',
    systemDirective: 'Apply modernist design principles, golden ratio, WCAG accessibility, and semantic brand alignment.',
    primaryCategories: ['Design & Visual', 'Ideas & Creativity'],
    recommendedCommands: ['/conceptdesign', '/logo', '/palette', '/typography', '/visualstyle', '/cover'],
    icon: 'Palette'
  },
  {
    id: 8,
    name: 'VISUAL',
    nameTh: 'โหมดภาพและทัศนศิลป์',
    description: 'Comprehensive visual direction, composition framing, cinematography, and aesthetic critique.',
    descriptionTh: 'วิเคราะห์องค์ประกอบภาพ การจัดแสง มุมกล้อง และการกำกับศิลป์เชิงลึก',
    systemDirective: 'Evaluate lighting temperature, lens selection, negative space, visual balance, and semiotic subtext.',
    primaryCategories: ['Design & Visual', 'Photo & Video'],
    recommendedCommands: ['/composition', '/lighting', '/visualanalysis', '/shotlist', '/artdirection'],
    icon: 'Eye'
  },
  {
    id: 9,
    name: 'IMAGE PROMPT',
    nameTh: 'โหมดสร้างคำสั่งภาพ (Prompt Engine)',
    description: 'Generates rigorous generative AI image prompts adhering to the 14-parameter Section 9 Visual Protocol.',
    descriptionTh: 'สร้างคำสั่ง Prompt สำหรับ Imagen 3 / Midjourney / FLUX ครบทั้ง 14 มิติภาพ พร้อม Negative Prompt',
    systemDirective: 'Strictly follow Section 9: Specify Purpose, Subject, Context, Composition, Perspective, Lighting, Color, Materials, Aspect Ratio, and Negative Prompt.',
    primaryCategories: ['Design & Visual'],
    recommendedCommands: ['/image', '/artdirection', '/cover', '/banner', '/thumbnail'],
    icon: 'Image'
  },
  {
    id: 10,
    name: 'PRESENTATION',
    nameTh: 'โหมดการนำเสนอและสไลด์',
    description: 'Slide-by-slide storyboard engineering with 1-core-idea discipline and conversational speaker scripts.',
    descriptionTh: 'วางโครงสร้างงานนำเสนอและสไลด์อย่างน่าดึงดูด พร้อมสคริปต์ผู้พูดแบบไม่ท่องจำ',
    systemDirective: 'Enforce one main idea per slide. Provide slide visual layout cues alongside verbatim natural speaker notes.',
    primaryCategories: ['Work & Productivity', 'Ideas & Creativity'],
    recommendedCommands: ['/presentation', '/storytelling', '/focus', '/title'],
    icon: 'Presentation'
  },
  {
    id: 11,
    name: 'CONTENT',
    nameTh: 'โหมดเนื้อหาและการสื่อสาร',
    description: 'Audience-targeted copy, viral social media posts, articles, and high-CTR hooks.',
    descriptionTh: 'สร้างสรรค์คอนเทนต์ โพสต์ไวรัล บทความ แคปชัน และ Hook ที่หยุดนิ้วโป้งคนอ่าน',
    systemDirective: 'Optimize for engagement retention, mobile formatting white space, and clear action items.',
    primaryCategories: ['Writing & Content'],
    recommendedCommands: ['/caption', '/post', '/article', '/title', '/slogan'],
    icon: 'FileText'
  },
  {
    id: 12,
    name: 'PROGRAMMING',
    nameTh: 'โหมดการเขียนโค้ดและโปรแกรม',
    description: 'Clean code architecture, type-safe implementations, bug diagnosis, and algorithmic optimization.',
    descriptionTh: 'เขียนโค้ดมาตรฐานโปรดักชัน ดีบั๊กอย่างตรงจุด อธิบายการทำงาน และปรับปรุงความเร็ว',
    systemDirective: 'Provide full, self-contained, typed, and runnable code. Explain root causes when debugging and verify Big-O efficiency.',
    primaryCategories: ['Programming'],
    recommendedCommands: ['/generatecode', '/debug', '/optimize', '/explaincode', '/example'],
    icon: 'Code'
  },
  {
    id: 13,
    name: 'ENGINEERING',
    nameTh: 'โหมดวิศวกรรมระบบและสถาปัตยกรรม',
    description: 'High-level software architecture, API contract design, microservices, and system resilience.',
    descriptionTh: 'วางสถาปัตยกรรมระบบ สเปก API ความทนทานของระบบ และการขยายตัว (Scalability)',
    systemDirective: 'Design scalable, fault-tolerant architectures. Adhere to REST/GraphQL standards and document security boundaries.',
    primaryCategories: ['Programming'],
    recommendedCommands: ['/api', '/algorithm', '/softwareproject', '/documentation'],
    icon: 'Cpu'
  },
  {
    id: 14,
    name: 'PROJECT',
    nameTh: 'โหมดการบริหารโครงการ',
    description: 'WBS task decomposition, sprint scheduling, milestone gating, and cross-functional RACI matrices.',
    descriptionTh: 'บริหารโครงการ จัดทำ WBS วาง Sprint และจัดการความเสี่ยงตามหลัก Agile/Waterfall',
    systemDirective: 'Deliver actionable, structured project roadmaps. Identify critical path and assign clear task ownership.',
    primaryCategories: ['Work & Productivity'],
    recommendedCommands: ['/project', '/planning', '/checklist', '/goals'],
    icon: 'Kanban'
  },
  {
    id: 15,
    name: 'PRODUCTIVITY',
    nameTh: 'โหมดผลิตภาพและระบบชีวิต',
    description: 'Timeboxing, priority filters (Eisenhower), habit stacking, and workflow automation.',
    descriptionTh: 'จัดระเบียบเวลา โฟกัสงานสำคัญ สร้างระบบนิสัย และขจัดความเฉื่อยชา',
    systemDirective: 'Apply ruthlessly practical efficiency frameworks. Eliminate low-leverage tasks and structure clear daily workflows.',
    primaryCategories: ['Work & Productivity', 'Communication & Life'],
    recommendedCommands: ['/focus', '/routine', '/habit', '/checklist', '/productivity'],
    icon: 'CheckCircle'
  },
  {
    id: 16,
    name: 'BUSINESS',
    nameTh: 'โหมดธุรกิจและกลยุทธ์การค้า',
    description: 'Value proposition design, market validation, unit economics, and competitive advantage logic.',
    descriptionTh: 'วิเคราะห์โมเดลธุรกิจ ตลาดเป้าหมาย ข้อได้เปรียบทางการแข่งขัน และโครงสร้างรายได้',
    systemDirective: 'Evaluate business viability with financial realism. Detail monetization models and unique differentiation.',
    primaryCategories: ['Ideas & Creativity', 'Work & Productivity'],
    recommendedCommands: ['/businessidea', '/travelbudget', '/planning', '/naming'],
    icon: 'TrendingUp'
  },
  {
    id: 17,
    name: 'ANALYSIS',
    nameTh: 'โหมดการวิเคราะห์และประเมินผล',
    description: 'Multi-perspective critical analysis, statistical grounding, and strategic risk evaluation.',
    descriptionTh: 'วิเคราะห์เชิงลึก เปรียบเทียบข้อมูล สังเคราะห์หลักฐาน และประเมินความเสี่ยงรอบด้าน',
    systemDirective: 'Deconstruct complex systems into fundamental drivers. Present unbiased pros/cons and scenario forecasts.',
    primaryCategories: ['Study & Learning', 'Work & Productivity'],
    recommendedCommands: ['/analysis', '/deepdive', '/scenario', '/videotrends'],
    icon: 'BarChart'
  },
  {
    id: 18,
    name: 'DECISION SUPPORT',
    nameTh: 'โหมดช่วยการตัดสินใจ',
    description: 'Weighted multi-criteria decision matrices, regret minimization, and emotional de-escalation.',
    descriptionTh: 'ช่วยประเมินทางเลือก ชั่งน้ำหนักความเสี่ยง-ผลตอบแทน และคลี่คลายข้อพิพาท',
    systemDirective: 'Provide neutral, weighted decision frameworks. Clarify trade-offs without paternalistic dictation.',
    primaryCategories: ['Communication & Life'],
    recommendedCommands: ['/decision', '/conflict', '/advice', '/selfdevelopment'],
    icon: 'Compass'
  },
  {
    id: 19,
    name: 'DOCUMENT',
    nameTh: 'โหมดเอกสารและการจัดทำรูปเล่ม',
    description: 'Formatting specifications, technical documentation, formal correspondence, and contracts.',
    descriptionTh: 'จัดทำเอกสารทางการ คู่มือการทำงาน รายงานฉบับสมบูรณ์ และอีเมลธุรกิจ',
    systemDirective: 'Ensure formal formatting hierarchy, accurate document metadata, and clear section demarcation.',
    primaryCategories: ['Writing & Content', 'Programming'],
    recommendedCommands: ['/documentation', '/email', '/correct', '/documents'],
    icon: 'Files'
  },
  {
    id: 20,
    name: 'MASTER END-TO-END',
    nameTh: 'โหมดบูรณาการระดับมาสเตอร์ (All-in-One)',
    description: 'Orchestrates full cross-engine pipelines combining ideation, research, visual direction, and production.',
    descriptionTh: 'โหมดบูรณาการขั้นสูงสุด เชื่อมโยงทุกคำสั่ง ทุกเอนจิน และรันเวิร์กโฟลว์ตั้งแต่ต้นจนจบ',
    systemDirective: 'Act as the full GEMINI UNIVERSAL AI OS V6.1 Master Orchestrator. Apply all protocols, route automatically, and enforce 50-point QA gate on all outputs.',
    primaryCategories: ['Ideas & Creativity', 'Writing & Content', 'Study & Learning', 'Programming', 'Design & Visual', 'Work & Productivity'],
    recommendedCommands: ['/research', '/analysis', '/artdirection', '/image', '/article', '/qa'],
    icon: 'ShieldCheck'
  }
];
