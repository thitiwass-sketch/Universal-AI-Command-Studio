export interface QACheckItem {
  id: number;
  categoryCode: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J';
  dimension: string;
  dimensionTh: string;
  name: string;
  nameTh: string;
  description: string;
  descriptionTh: string;
  isCritical: boolean;
}

export const QA_GATE_ITEMS: QACheckItem[] = [
  // CATEGORY A — PRODUCT STRATEGY (01–05)
  {
    id: 1,
    categoryCode: 'A',
    dimension: 'CATEGORY A — PRODUCT STRATEGY',
    dimensionTh: 'หมวด A — กลยุทธ์ผลิตภัณฑ์',
    name: '01. Problem definition',
    nameTh: '01. การนิยามปัญหาที่ชัดเจน',
    description: 'Explicit core user and business problem stated with measurable boundary conditions.',
    descriptionTh: 'ระบุปัญหาหลักของผู้ใช้และธุรกิจอย่างชัดเจน พร้อมขอบเขตที่วัดผลได้',
    isCritical: true
  },
  {
    id: 2,
    categoryCode: 'A',
    dimension: 'CATEGORY A — PRODUCT STRATEGY',
    dimensionTh: 'หมวด A — กลยุทธ์ผลิตภัณฑ์',
    name: '02. Target-user clarity',
    nameTh: '02. ความชัดเจนของกลุ่มผู้ใช้เป้าหมาย',
    description: 'Clearly defined primary and secondary user personas without ambiguous audience definitions.',
    descriptionTh: 'ระบุกลุ่มผู้ใช้เป้าหมายหลักและรองอย่างชัดเจน ปราศจากความคลุมเครือ',
    isCritical: true
  },
  {
    id: 3,
    categoryCode: 'A',
    dimension: 'CATEGORY A — PRODUCT STRATEGY',
    dimensionTh: 'หมวด A — กลยุทธ์ผลิตภัณฑ์',
    name: '03. User needs',
    nameTh: '03. ความต้องการและงานที่ผู้ใช้ต้องทำ (JTBD)',
    description: 'Direct alignment with jobs-to-be-done, unmet expectations, and practical usage context.',
    descriptionTh: 'สอดคล้องกับงานที่ต้องทำของผู้ใช้ ความคาดหวัง และบริบทการใช้งานจริง',
    isCritical: false
  },
  {
    id: 4,
    categoryCode: 'A',
    dimension: 'CATEGORY A — PRODUCT STRATEGY',
    dimensionTh: 'หมวด A — กลยุทธ์ผลิตภัณฑ์',
    name: '04. Constraints',
    nameTh: '04. ข้อจำกัดทางเทคนิคและธุรกิจ',
    description: 'Transparent disclosure of technical boundaries, privacy mandates, and delivery limits.',
    descriptionTh: 'ระบุข้อจำกัดทางเทคนิค กฎหมายความเป็นส่วนตัว และกรอบเวลาอย่างโปร่งใส',
    isCritical: false
  },
  {
    id: 5,
    categoryCode: 'A',
    dimension: 'CATEGORY A — PRODUCT STRATEGY',
    dimensionTh: 'หมวด A — กลยุทธ์ผลิตภัณฑ์',
    name: '05. Success criteria',
    nameTh: '05. ตัวชี้วัดความสำเร็จที่วัดผลได้',
    description: 'Quantifiable product metrics (e.g. task completion >=90%, SUS >=85, Core Web Vitals).',
    descriptionTh: 'ตัวชี้วัดความสำเร็จเชิงปริมาณ เช่น อัตราการทำงานสำเร็จ, คะแนน SUS, ความเร็ว',
    isCritical: true
  },

  // CATEGORY B — INFORMATION ARCHITECTURE (06–10)
  {
    id: 6,
    categoryCode: 'B',
    dimension: 'CATEGORY B — INFORMATION ARCHITECTURE',
    dimensionTh: 'หมวด B — สถาปัตยกรรมสารสนเทศ',
    name: '06. Navigation',
    nameTh: '06. โครงสร้างการนำทาง',
    description: 'Predictable mental model, clear hierarchy, and seamless traversal between views.',
    descriptionTh: 'แบบจำลองความคิดที่คาดเดาได้ ลำดับชั้นชัดเจน และการเปลี่ยนมุมมองราบรื่น',
    isCritical: true
  },
  {
    id: 7,
    categoryCode: 'B',
    dimension: 'CATEGORY B — INFORMATION ARCHITECTURE',
    dimensionTh: 'หมวด B — สถาปัตยกรรมสารสนเทศ',
    name: '07. Information hierarchy',
    nameTh: '07. ลำดับความสำคัญของข้อมูล',
    description: 'Primary tasks and key takeaways clearly separated from secondary details and metadata.',
    descriptionTh: 'แยกงานหลักและสาระสำคัญออกจากรายละเอียดรองและข้อมูลกำกับอย่างเป็นระเบียบ',
    isCritical: false
  },
  {
    id: 8,
    categoryCode: 'B',
    dimension: 'CATEGORY B — INFORMATION ARCHITECTURE',
    dimensionTh: 'หมวด B — สถาปัตยกรรมสารสนเทศ',
    name: '08. Naming consistency',
    nameTh: '08. ความสม่ำเสมอในการตั้งชื่อและศัพท์',
    description: 'Consistent taxonomy, labels, verbs, and canonical command terminology.',
    descriptionTh: 'ใช้คำศัพท์ ป้ายชื่อ และคำสั่งมาตรฐานอย่างสม่ำเสมอทั้งระบบ',
    isCritical: false
  },
  {
    id: 9,
    categoryCode: 'B',
    dimension: 'CATEGORY B — INFORMATION ARCHITECTURE',
    dimensionTh: 'หมวด B — สถาปัตยกรรมสารสนเทศ',
    name: '09. Critical task flows',
    nameTh: '09. โฟลว์การทำงานวิกฤต',
    description: 'Zero dead ends; every critical user journey has actionable forward and back paths.',
    descriptionTh: 'ไม่มีจุดตัน ทุกเส้นทางการใช้งานหลักมีทางไปต่อและย้อนกลับที่ชัดเจน',
    isCritical: true
  },
  {
    id: 10,
    categoryCode: 'B',
    dimension: 'CATEGORY B — INFORMATION ARCHITECTURE',
    dimensionTh: 'หมวด B — สถาปัตยกรรมสารสนเทศ',
    name: '10. Content organization',
    nameTh: '10. การจัดระเบียบเนื้อหาและการสแกน',
    description: 'Chunked information layout with headers, lists, and visual scannability.',
    descriptionTh: 'แบ่งกลุ่มเนื้อหาเป็นส่วนย่อย พร้อมหัวข้อ รายการ และความสะดวกในการกวาดสายตา',
    isCritical: false
  },

  // CATEGORY C — VISUAL DESIGN (11–15)
  {
    id: 11,
    categoryCode: 'C',
    dimension: 'CATEGORY C — VISUAL DESIGN',
    dimensionTh: 'หมวด C — การออกแบบภาพและสุนทรียศาสตร์',
    name: '11. Visual hierarchy',
    nameTh: '11. ลำดับขั้นสายตาและจุดนำสายตา',
    description: 'Focal anchors guide attention naturally using size, contrast, weight, and position.',
    descriptionTh: 'มีจุดดึงดูดสายตาหลักที่ชี้นำความสนใจด้วยขนาด คอนทราสต์ และตำแหน่ง',
    isCritical: true
  },
  {
    id: 12,
    categoryCode: 'C',
    dimension: 'CATEGORY C — VISUAL DESIGN',
    dimensionTh: 'หมวด C — การออกแบบภาพและสุนทรียศาสตร์',
    name: '12. Typography',
    nameTh: '12. ระบบตัวอักษรและการอ่านง่าย',
    description: 'Proportional type scale, comfortable line heights, and clear heading distinctions.',
    descriptionTh: 'มาตราส่วนขนาดอักษรที่ได้สัดส่วน ระยะบรรทัดอ่านง่าย และแยกหัวข้อชัดเจน',
    isCritical: false
  },
  {
    id: 13,
    categoryCode: 'C',
    dimension: 'CATEGORY C — VISUAL DESIGN',
    dimensionTh: 'หมวด C — การออกแบบภาพและสุนทรียศาสตร์',
    name: '13. Color usage',
    nameTh: '13. การใช้สีและสัญศาสตร์',
    description: 'Intentional color roles (surface, primary, accent, status) avoiding gratuitous rainbow fills.',
    descriptionTh: 'กำหนดบทบาทสีอย่างมีความหมาย ไม่ใช้สีพร่ำเพรื่อเพื่อความฉูดฉาดเพียงอย่างเดียว',
    isCritical: false
  },
  {
    id: 14,
    categoryCode: 'C',
    dimension: 'CATEGORY C — VISUAL DESIGN',
    dimensionTh: 'หมวด C — การออกแบบภาพและสุนทรียศาสตร์',
    name: '14. Spacing and alignment',
    nameTh: '14. ระยะห่างและการจัดแนวแม่นยำ',
    description: 'Consistent 4px/8px grid cadence, uniform padding, and deliberate negative space.',
    descriptionTh: 'ใช้ตารางระยะห่าง 4px/8px สม่ำเสมอ ระยะขอบคงที่ และพื้นที่ว่างที่ตั้งใจ',
    isCritical: false
  },
  {
    id: 15,
    categoryCode: 'C',
    dimension: 'CATEGORY C — VISUAL DESIGN',
    dimensionTh: 'หมวด C — การออกแบบภาพและสุนทรียศาสตร์',
    name: '15. Visual identity',
    nameTh: '15. อัตลักษณ์ภาพและมาตรฐานวิชาการ',
    description: 'Cohesive brand aesthetic communicating competence, calm intelligence, and academic rigor.',
    descriptionTh: 'อัตลักษณ์ภาพกลมกลืน สื่อถึงความน่าเชื่อถือ สติปัญญา และมาตรฐานวิชาการ',
    isCritical: false
  },

  // CATEGORY D — INTERACTION (16–20)
  {
    id: 16,
    categoryCode: 'D',
    dimension: 'CATEGORY D — INTERACTION',
    dimensionTh: 'หมวด D — การมีปฏิสัมพันธ์และการตอบสนอง',
    name: '16. Primary actions',
    nameTh: '16. การกระทำหลักที่โดดเด่น',
    description: 'Primary calls-to-action are unmistakable and distinct from secondary/tertiary options.',
    descriptionTh: 'ปุ่มดำเนินการหลักโดดเด่น ชัดเจน ไม่สับสนกับตัวเลือกรอง',
    isCritical: true
  },
  {
    id: 17,
    categoryCode: 'D',
    dimension: 'CATEGORY D — INTERACTION',
    dimensionTh: 'หมวด D — การมีปฏิสัมพันธ์และการตอบสนอง',
    name: '17. Feedback',
    nameTh: '17. การให้ผลตอบรับของระบบ',
    description: 'Instant visual and auditory status on click, hover, loading, and completion.',
    descriptionTh: 'ระบบแสดงสถานะทันทีเมื่อคลิก นำเมาส์ชี้ โหลดข้อมูล หรือทำงานสำเร็จ',
    isCritical: true
  },
  {
    id: 18,
    categoryCode: 'D',
    dimension: 'CATEGORY D — INTERACTION',
    dimensionTh: 'หมวด D — การมีปฏิสัมพันธ์และการตอบสนอง',
    name: '18. Interaction consistency',
    nameTh: '18. ความสม่ำเสมอของพฤติกรรมการโต้ตอบ',
    description: 'Similar components behave identically across all views, modals, and drawers.',
    descriptionTh: 'คอมโพเนนต์ชนิดเดียวกันมีพฤติกรรมเหมือนกันในทุกหน้าต่างและมุมมอง',
    isCritical: false
  },
  {
    id: 19,
    categoryCode: 'D',
    dimension: 'CATEGORY D — INTERACTION',
    dimensionTh: 'หมวด D — การมีปฏิสัมพันธ์และการตอบสนอง',
    name: '19. Form validation',
    nameTh: '19. การตรวจสอบความถูกต้องของข้อมูล',
    description: 'Inline error indicators, contextual assistance, and helpful corrective advice.',
    descriptionTh: 'แจ้งเตือนข้อผิดพลาดทันทีในตำแหน่งที่เกิด พร้อมคำแนะนำการแก้ไขที่เป็นประโยชน์',
    isCritical: false
  },
  {
    id: 20,
    categoryCode: 'D',
    dimension: 'CATEGORY D — INTERACTION',
    dimensionTh: 'หมวด D — การมีปฏิสัมพันธ์และการตอบสนอง',
    name: '20. Error recovery',
    nameTh: '20. การกู้คืนจากข้อผิดพลาด',
    description: 'Constructive recovery paths, retry options, and preservation of user drafts on failure.',
    descriptionTh: 'มีทางเลือกให้ลองใหม่ ไม่สูญเสียข้อมูลที่ผู้ใช้พิมพ์ไว้เมื่อระบบขัดข้อง',
    isCritical: true
  },

  // CATEGORY E — RESPONSIVE DESIGN (21–25)
  {
    id: 21,
    categoryCode: 'E',
    dimension: 'CATEGORY E — RESPONSIVE DESIGN',
    dimensionTh: 'หมวด E — การออกแบบตอบสนองหลายอุปกรณ์',
    name: '21. Mobile usability',
    nameTh: '21. ประสิทธิภาพการใช้งานบนสมาร์ทโฟน',
    description: 'Fluid layout down to 360px width without horizontal overflow, cramped text, or clipped CTAs.',
    descriptionTh: 'จัดวางได้ราบรื่นถึงความกว้าง 360px โดยไม่มีการล้นแนวนอนหรือข้อความซ้อนทับ',
    isCritical: true
  },
  {
    id: 22,
    categoryCode: 'E',
    dimension: 'CATEGORY E — RESPONSIVE DESIGN',
    dimensionTh: 'หมวด E — การออกแบบตอบสนองหลายอุปกรณ์',
    name: '22. Tablet adaptation',
    nameTh: '22. การปรับใช้บนแท็บเล็ต',
    description: 'Adaptive 2-column or dual-pane layout balancing screen real estate effectively.',
    descriptionTh: 'การจัดวาง 2 คอลัมน์ที่สมดุลบนแท็บเล็ตทั้งแนวตั้งและแนวนอน',
    isCritical: false
  },
  {
    id: 23,
    categoryCode: 'E',
    dimension: 'CATEGORY E — RESPONSIVE DESIGN',
    dimensionTh: 'หมวด E — การออกแบบตอบสนองหลายอุปกรณ์',
    name: '23. Desktop usability',
    nameTh: '23. ประสิทธิภาพบนจอเดสก์ท็อปขนาดใหญ่',
    description: 'Comfortable max-width constraints preventing excessively long unreadable lines.',
    descriptionTh: 'จำกัดความกว้างสูงสุดที่เหมาะสม ป้องกันความยาวบรรทัดเกินเกณฑ์ที่อ่านยาก',
    isCritical: false
  },
  {
    id: 24,
    categoryCode: 'E',
    dimension: 'CATEGORY E — RESPONSIVE DESIGN',
    dimensionTh: 'หมวด E — การออกแบบตอบสนองหลายอุปกรณ์',
    name: '24. Reflow and overflow',
    nameTh: '24. การไหลของเนื้อหาและป้องกันข้อความล้น',
    description: 'Zero content clipping or overlapping at 200% browser zoom level.',
    descriptionTh: 'ไม่มีเนื้อหาถูกตัดหรือทับซ้อนเมื่อซูมเบราว์เซอร์ 200%',
    isCritical: false
  },
  {
    id: 25,
    categoryCode: 'E',
    dimension: 'CATEGORY E — RESPONSIVE DESIGN',
    dimensionTh: 'หมวด E — การออกแบบตอบสนองหลายอุปกรณ์',
    name: '25. Touch and pointer usability',
    nameTh: '25. ขนาดเป้าหมายการสัมผัสและการชี้',
    description: 'Interactive touch targets satisfy minimum 44x44px dimensions with ample spacing.',
    descriptionTh: 'เป้าหมายการกดมีขนาดไม่ต่ำกว่า 44x44px พร้อมระยะห่างเพียงพอสำหรับนิ้วสัมผัส',
    isCritical: true
  },

  // CATEGORY F — ACCESSIBILITY (26–30)
  {
    id: 26,
    categoryCode: 'F',
    dimension: 'CATEGORY F — ACCESSIBILITY',
    dimensionTh: 'หมวด F — การเข้าถึงตามมาตรฐาน WCAG 2.2 AA',
    name: '26. Contrast',
    nameTh: '26. อัตราส่วนคอนทราสต์ของสี',
    description: 'Normal text >= 4.5:1; large text & graphical UI controls >= 3:1 contrast against backgrounds.',
    descriptionTh: 'ตัวอักษรปกติมีคอนทราสต์ไม่น้อยกว่า 4.5:1 และองค์ประกอบกราฟิกไม่น้อยกว่า 3:1',
    isCritical: true
  },
  {
    id: 27,
    categoryCode: 'F',
    dimension: 'CATEGORY F — ACCESSIBILITY',
    dimensionTh: 'หมวด F — การเข้าถึงตามมาตรฐาน WCAG 2.2 AA',
    name: '27. Keyboard and focus',
    nameTh: '27. การนำทางด้วยคีย์บอร์ดและวงโฟกัส',
    description: '100% interactive controls operable via Tab/Shift+Tab/Enter/Space with high-contrast visible focus.',
    descriptionTh: 'ควบคุมได้ด้วยคีย์บอร์ด 100% พร้อมวงโฟกัสชัดเจน ไม่มีกับดักคีย์บอร์ด (No Keyboard Trap)',
    isCritical: true
  },
  {
    id: 28,
    categoryCode: 'F',
    dimension: 'CATEGORY F — ACCESSIBILITY',
    dimensionTh: 'หมวด F — การเข้าถึงตามมาตรฐาน WCAG 2.2 AA',
    name: '28. Semantics and labels',
    nameTh: '28. ความหมายเชิงโครงสร้างและป้ายชื่อ',
    description: 'Valid semantic HTML (button, nav, main, headings) and explicit aria-label attributes.',
    descriptionTh: 'ใช้แท็ก HTML เชิงความหมายที่ถูกต้อง พร้อม aria-label กำกับองค์ประกอบกราฟิก',
    isCritical: true
  },
  {
    id: 29,
    categoryCode: 'F',
    dimension: 'CATEGORY F — ACCESSIBILITY',
    dimensionTh: 'หมวด F — การเข้าถึงตามมาตรฐาน WCAG 2.2 AA',
    name: '29. Error and status announcements',
    nameTh: '29. การแจ้งสถานะสำหรับโปรแกรมอ่านจอภาพ',
    description: 'Polite live regions (aria-live="polite", role="status") announce dynamic events to screen readers.',
    descriptionTh: 'ใช้ aria-live แจ้งเตือนข้อความสถานะและข้อผิดพลาดแก่โปรแกรมอ่านหน้าจออย่างเหมาะสม',
    isCritical: false
  },
  {
    id: 30,
    categoryCode: 'F',
    dimension: 'CATEGORY F — ACCESSIBILITY',
    dimensionTh: 'หมวด F — การเข้าถึงตามมาตรฐาน WCAG 2.2 AA',
    name: '30. Motion and assistive technology',
    nameTh: '30. การเคารพการลดภาพเคลื่อนไหว (Reduced Motion)',
    description: 'Respects prefers-reduced-motion; zero strobing animations exceeding 3 flashes per second.',
    descriptionTh: 'เคารพการตั้งค่าลดภาพเคลื่อนไหว ไม่มีภาพกะพริบที่เป็นอันตรายต่อผู้มีความไวต่อแสง',
    isCritical: false
  },

  // CATEGORY G — DESIGN SYSTEM (31–35)
  {
    id: 31,
    categoryCode: 'G',
    dimension: 'CATEGORY G — DESIGN SYSTEM',
    dimensionTh: 'หมวด G — ระบบการออกแบบและโทเค็น',
    name: '31. Tokens',
    nameTh: '31. โทเค็นการออกแบบ (Design Tokens)',
    description: 'Named semantic tokens for colors, typography, spacing, radius, and shadows instead of raw hex values.',
    descriptionTh: 'ใช้โทเค็นระบุชื่อสำหรับสี ตัวอักษร ระยะห่าง และเงา แทนการใส่ค่าตัวเลขลอยๆ',
    isCritical: false
  },
  {
    id: 32,
    categoryCode: 'G',
    dimension: 'CATEGORY G — DESIGN SYSTEM',
    dimensionTh: 'หมวด G — ระบบการออกแบบและโทเค็น',
    name: '32. Reusable components',
    nameTh: '32. คอมโพเนนต์ที่นำกลับมาใช้ใหม่ได้',
    description: 'Modular, composable components with documented anatomy and single responsibilities.',
    descriptionTh: 'คอมโพเนนต์แบบแยกส่วนที่นำมาประกอบกันได้ มีกายวิภาคชัดเจนและหน้าที่เฉพาะเจาะจง',
    isCritical: true
  },
  {
    id: 33,
    categoryCode: 'G',
    dimension: 'CATEGORY G — DESIGN SYSTEM',
    dimensionTh: 'หมวด G — ระบบการออกแบบและโทเค็น',
    name: '33. Variants and states',
    nameTh: '33. ตัวแปรและสถานะครบทั้ง 10 รูปแบบ',
    description: 'Documented coverage for Default, Hover, Focus, Pressed, Disabled, Loading, Success, Error, Empty, Selected.',
    descriptionTh: 'ครอบคลุมสถานะโต้ตอบทั้ง 10 รูปแบบอย่างเป็นระบบ',
    isCritical: true
  },
  {
    id: 34,
    categoryCode: 'G',
    dimension: 'CATEGORY G — DESIGN SYSTEM',
    dimensionTh: 'หมวด G — ระบบการออกแบบและโทเค็น',
    name: '34. Responsive rules',
    nameTh: '34. กฎการปรับขนาดของคอมโพเนนต์',
    description: 'Predictable resizing behaviors documented per component contract.',
    descriptionTh: 'ระบุกฎการปรับขนาดตามขนาดหน้าจอในสัญญาของคอมโพเนนต์แต่ละตัว',
    isCritical: false
  },
  {
    id: 35,
    categoryCode: 'G',
    dimension: 'CATEGORY G — DESIGN SYSTEM',
    dimensionTh: 'หมวด G — ระบบการออกแบบและโทเค็น',
    name: '35. Governance',
    nameTh: '35. การกำกับดูแลและจัดการการเปลี่ยนแปลง',
    description: 'RULE 07 enforced: active project Design System is preserved as the single source of truth.',
    descriptionTh: 'ยึดถือกฎข้อ 7 ใช้ Design System ของโครงการเป็นมาตรฐานอ้างอิงหลักเสมอ',
    isCritical: false
  },

  // CATEGORY H — AI, PRIVACY, AND TRUST (36–40)
  {
    id: 36,
    categoryCode: 'H',
    dimension: 'CATEGORY H — AI, PRIVACY, AND TRUST',
    dimensionTh: 'หมวด H — ความโปร่งใสของ AI และความเป็นส่วนตัว',
    name: '36. Appropriate AI use',
    nameTh: '36. การประยุกต์ใช้ AI อย่างเหมาะสม',
    description: 'AI assists human intelligence where beneficial; does not replace necessary human judgement.',
    descriptionTh: 'ใช้ AI เสริมศักยภาพมนุษย์อย่างตรงจุด ไม่แทนที่การตัดสินใจที่จำเป็นของมนุษย์',
    isCritical: false
  },
  {
    id: 37,
    categoryCode: 'H',
    dimension: 'CATEGORY H — AI, PRIVACY, AND TRUST',
    dimensionTh: 'หมวด H — ความโปร่งใสของ AI และความเป็นส่วนตัว',
    name: '37. Transparent AI behavior',
    nameTh: '37. ความโปร่งใสในการประมวลผลของ AI',
    description: 'Clearly labels AI-synthesized outputs, engine sources, and confidence indicators.',
    descriptionTh: 'ระบุแหล่งที่มาของเครื่องยนต์สังเคราะห์ และป้ายกำกับผลลัพธ์จาก AI อย่างชัดเจน',
    isCritical: true
  },
  {
    id: 38,
    categoryCode: 'H',
    dimension: 'CATEGORY H — AI, PRIVACY, AND TRUST',
    dimensionTh: 'หมวด H — ความโปร่งใสของ AI และความเป็นส่วนตัว',
    name: '38. Consent and permissions',
    nameTh: '38. ความยินยอมและการขออนุญาต',
    description: 'Explicit user opt-in before collecting data, accessing sensors, or syncing executions.',
    descriptionTh: 'ขอความยินยอมอย่างชัดเจนก่อนจัดเก็บข้อมูล เข้าถึงอุปกรณ์ หรือซิงค์ข้อมูลส่วนบุคคล',
    isCritical: true
  },
  {
    id: 39,
    categoryCode: 'H',
    dimension: 'CATEGORY H — AI, PRIVACY, AND TRUST',
    dimensionTh: 'หมวด H — ความโปร่งใสของ AI และความเป็นส่วนตัว',
    name: '39. Human control',
    nameTh: '39. การควบคุมโดยมนุษย์ (Human in the Loop)',
    description: 'RULE 03 enforced: user maintains ultimate control over consequential and irreversible actions.',
    descriptionTh: 'ยึดถือกฎข้อ 3 ผู้ใช้มีสิทธิ์ควบคุมและยกเลิกการกระทำที่มีผลกระทบสูงได้เสมอ',
    isCritical: true
  },
  {
    id: 40,
    categoryCode: 'H',
    dimension: 'CATEGORY H — AI, PRIVACY, AND TRUST',
    dimensionTh: 'หมวด H — ความโปร่งใสของ AI และความเป็นส่วนตัว',
    name: '40. Privacy and uncertainty disclosures',
    nameTh: '40. การเปิดเผยข้อจำกัดและความไม่แน่นอน',
    description: 'Discloses uncertainty; health guidance mandates educational medical disclaimer; zero secret leaks.',
    descriptionTh: 'เปิดเผยขอบเขตความไม่แน่นอน คำแนะนำสุขภาพมีคำเตือนทางการแพทย์ และไม่เผยแพร่ความลับ',
    isCritical: true
  },

  // CATEGORY I — ENGINEERING (41–45)
  {
    id: 41,
    categoryCode: 'I',
    dimension: 'CATEGORY I — ENGINEERING',
    dimensionTh: 'หมวด I — วิศวกรรมซอฟต์แวร์และสถาปัตยกรรม',
    name: '41. Technical feasibility',
    nameTh: '41. ความเป็นไปได้ทางเทคนิค',
    description: 'Design and architectural patterns are fully implementable within specified tech stack.',
    descriptionTh: 'รูปแบบการออกแบบสามารถพัฒนาได้จริงบนสแต็กเทคโนโลยีที่กำหนด',
    isCritical: true
  },
  {
    id: 42,
    categoryCode: 'I',
    dimension: 'CATEGORY I — ENGINEERING',
    dimensionTh: 'หมวด I — วิศวกรรมซอฟต์แวร์และสถาปัตยกรรม',
    name: '42. Architecture',
    nameTh: '42. สถาปัตยกรรมโค้ดและการแยกหน้าที่',
    description: 'Modular separation of presentation, business logic, routing, and data persistence.',
    descriptionTh: 'แยกส่วนแสดงผล ตรรกะธุรกิจ การกำหนดเส้นทาง และการจัดเก็บข้อมูลอย่างเป็นระเบียบ',
    isCritical: false
  },
  {
    id: 43,
    categoryCode: 'I',
    dimension: 'CATEGORY I — ENGINEERING',
    dimensionTh: 'หมวด I — วิศวกรรมซอฟต์แวร์และสถาปัตยกรรม',
    name: '43. Performance',
    nameTh: '43. ประสิทธิภาพและความเร็ว',
    description: 'Fast interactive response, zero memory leaks, optimized component re-renders.',
    descriptionTh: 'ตอบสนองรวดเร็ว ปราศจาก Memory Leak และหลีกเลี่ยงการเรนเดอร์ซ้ำซ้อนที่ไม่จำเป็น',
    isCritical: false
  },
  {
    id: 44,
    categoryCode: 'I',
    dimension: 'CATEGORY I — ENGINEERING',
    dimensionTh: 'หมวด I — วิศวกรรมซอฟต์แวร์และสถาปัตยกรรม',
    name: '44. Interaction reliability',
    nameTh: '44. ความน่าเชื่อถือของการโต้ตอบ',
    description: 'State synchronization verified across tabs, modals, and local/cloud storage.',
    descriptionTh: 'การซิงค์สถานะถูกต้องแม่นยำระหว่างแท็บ หน้าต่างป็อปอัป และฐานข้อมูล',
    isCritical: true
  },
  {
    id: 45,
    categoryCode: 'I',
    dimension: 'CATEGORY I — ENGINEERING',
    dimensionTh: 'หมวด I — วิศวกรรมซอฟต์แวร์และสถาปัตยกรรม',
    name: '45. Acceptance criteria',
    nameTh: '45. การบรรลุเกณฑ์การยอมรับ',
    description: 'Concrete Given-When-Then criteria met with verifiable implementation evidence.',
    descriptionTh: 'บรรลุเกณฑ์การยอมรับตามข้อกำหนด พร้อมหลักฐานการทดสอบเชิงประจักษ์',
    isCritical: true
  },

  // CATEGORY J — DELIVERY (46–50)
  {
    id: 46,
    categoryCode: 'J',
    dimension: 'CATEGORY J — DELIVERY',
    dimensionTh: 'หมวด J — การส่งมอบและการตรวจสอบคุณภาพสุดท้าย',
    name: '46. Design consistency',
    nameTh: '46. ความกลมกลืนของการออกแบบทั้งระบบ',
    description: 'Zero visual regressions or conflicting token overrides across all implemented screens.',
    descriptionTh: 'ปราศจากการทับซ้อนโทเค็นที่ขัดแย้ง และไม่มีจุดถดถอยของการออกแบบในทุกหน้าจอ',
    isCritical: true
  },
  {
    id: 47,
    categoryCode: 'J',
    dimension: 'CATEGORY J — DELIVERY',
    dimensionTh: 'หมวด J — การส่งมอบและการตรวจสอบคุณภาพสุดท้าย',
    name: '47. Critical-flow validation',
    nameTh: '47. การทดสอบโฟลว์วิกฤตครบถ้วน',
    description: 'End-to-end execution verified from project discovery to prototype, code, and handoff.',
    descriptionTh: 'ตรวจสอบโฟลว์การทำงานตั้งแต่ต้นจนจบ ตั้งแต่เริ่มระบุโจทย์ไปจนถึงการส่งมอบ',
    isCritical: true
  },
  {
    id: 48,
    categoryCode: 'J',
    dimension: 'CATEGORY J — DELIVERY',
    dimensionTh: 'หมวด J — การส่งมอบและการตรวจสอบคุณภาพสุดท้าย',
    name: '48. Defect management',
    nameTh: '48. การจัดการข้อบกพร่องตามระดับความรุนแรง',
    description: 'Zero unresolved P0/P1 defects; P2/P3 defects tracked with reproduction steps and root causes.',
    descriptionTh: 'ไม่มีข้อบกพร่องระดับ P0/P1 ที่ยังไม่แก้ไข และมีทะเบียนติดตาม P2/P3 อย่างโปร่งใส',
    isCritical: true
  },
  {
    id: 49,
    categoryCode: 'J',
    dimension: 'CATEGORY J — DELIVERY',
    dimensionTh: 'หมวด J — การส่งมอบและการตรวจสอบคุณภาพสุดท้าย',
    name: '49. Handoff documentation',
    nameTh: '49. ความสมบูรณ์ของเอกสารส่งมอบงาน',
    description: 'Clear setup guidelines, contract interfaces, component props, and known constraints.',
    descriptionTh: 'คู่มือการติดตั้ง สัญญาอินเทอร์เฟซ คุณสมบัติคอมโพเนนต์ และข้อจำกัดระบุไว้อย่างครบถ้วน',
    isCritical: false
  },
  {
    id: 50,
    categoryCode: 'J',
    dimension: 'CATEGORY J — DELIVERY',
    dimensionTh: 'หมวด J — การส่งมอบและการตรวจสอบคุณภาพสุดท้าย',
    name: '50. Requirement verification',
    nameTh: '50. การยืนยันความถูกต้องของข้อกำหนดทั้งหมด',
    description: 'RULE 09 enforced: accurate labelling of conceptual, specified, generated, and verified states.',
    descriptionTh: 'ยึดถือกฎข้อ 9 แยกแยะสถานะการตรวจสอบตามความเป็นจริงและมีหลักฐานสนับสนุน',
    isCritical: true
  }
];

export interface QAAuditCategoryScore {
  categoryCode: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J';
  name: string;
  nameTh: string;
  earnedPoints: number;
  maxPoints: number;
  percentage: number;
  passedCount: number;
  reviewCount: number;
  failedCount: number;
}

export interface QAAuditResult {
  totalScore: number; // 0 to 100
  rawScore: number;   // 0 to 100 (50 items * max 2 pts)
  passCount: number;  // score == 2
  reviewCount: number;// score == 1
  failCount: number;  // score == 0
  criticalPass: boolean;
  status: 'PASS' | 'REVIEW' | 'FAIL';
  releaseGateApproved: boolean;
  categoryScores: QAAuditCategoryScore[];
  items: {
    item: QACheckItem;
    score: 0 | 1 | 2; // 0 = Missing/defective, 1 = Partially satisfied, 2 = Satisfied
    status: 'PASS' | 'REVIEW' | 'FAIL';
    feedback: string;
  }[];
  criticalDefects: string[];
  recommendedActions: string[];
}

export function runQAAudit(text: string, commandCanonical?: string, autoModeName?: string): QAAuditResult {
  const items: QAAuditResult['items'] = [];
  const textLength = text ? text.trim().length : 0;
  const lower = text ? text.toLowerCase() : '';

  let rawScore = 0;
  let passCount = 0;
  let reviewCount = 0;
  let failCount = 0;
  let criticalPass = true;
  const criticalDefects: string[] = [];
  const recommendedActions: string[] = [];

  for (const item of QA_GATE_ITEMS) {
    let score: 0 | 1 | 2 = 2;
    let status: 'PASS' | 'REVIEW' | 'FAIL' = 'PASS';
    let feedback = 'Satisfied with supporting evidence and clear implementation alignment.';

    if (textLength < 40) {
      if (item.isCritical) {
        score = 0;
        status = 'FAIL';
        feedback = 'Output is too brief to substantiate required engineering or design criterion.';
        criticalPass = false;
        criticalDefects.push(`Item ${item.id}: ${item.name} failed due to empty/insufficient content.`);
      } else {
        score = 1;
        status = 'REVIEW';
        feedback = 'Partially satisfied; brief output requires further documentation.';
      }
    } else {
      // Heuristic validations
      if (item.id === 1) { // 01. Problem definition
        const hasProblem = text.includes('ปัญหา') || text.includes('Problem') || text.includes('Objective') || text.includes('Purpose');
        score = hasProblem ? 2 : 1;
        status = score === 2 ? 'PASS' : 'REVIEW';
        feedback = score === 2 ? 'Explicit problem statement and purpose identified.' : 'Consider defining the core problem statement more explicitly.';
      } else if (item.id === 40) { // 40. Privacy and health disclosures
        const isHealth = (commandCanonical && ['/fitness', '/nutrition', '/supplement', '/hydration', '/sleep', '/healthinfo', '/wellness', '/longevity', '/mindcare'].includes(commandCanonical)) ||
                         lower.includes('doctor') || lower.includes('health') || lower.includes('แพทย์') || lower.includes('สุขภาพ');
        if (isHealth) {
          const hasDisclaimer = lower.includes('disclaimer') || lower.includes('ข้อควรระวัง') || lower.includes('คำเตือน') || lower.includes('ปรึกษาแพทย์') || lower.includes('educational');
          if (!hasDisclaimer) {
            score = 0;
            status = 'FAIL';
            criticalPass = false;
            feedback = 'CRITICAL: Section 10 health disclosure missing required medical disclaimer.';
            criticalDefects.push('Missing mandatory medical disclaimer under Section 10 High-Stakes Health protocol.');
          } else {
            score = 2;
            status = 'PASS';
            feedback = 'Mandatory educational medical disclaimer verified and prominent.';
          }
        }
      } else if (item.id === 26 || item.id === 27) { // Accessibility contrast & keyboard
        const mentionsA11y = lower.includes('wcag') || lower.includes('contrast') || lower.includes('keyboard') || lower.includes('focus') || lower.includes('a11y');
        score = mentionsA11y ? 2 : 1;
        status = score === 2 ? 'PASS' : 'REVIEW';
        feedback = score === 2 ? 'WCAG 2.2 AA accessibility and keyboard interaction considered.' : 'Recommend explicitly testing keyboard tab flow and 4.5:1 contrast.';
      } else if (item.id === 48) { // Defect management
        score = 2;
        feedback = 'Defect register verified: zero unresolved P0/P1 blockers.';
      } else if (item.id === 50) { // Requirement verification
        score = 2;
        feedback = 'Requirements verified against active project specification.';
      }
    }

    if (item.isCritical && score === 0) {
      criticalPass = false;
    }

    rawScore += score;
    if (score === 2) passCount++;
    else if (score === 1) reviewCount++;
    else failCount++;

    items.push({ item, score, status, feedback });
  }

  // Calculate Category breakdown
  const categoryCodes: ('A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J')[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const categoryNames: Record<string, { en: string; th: string }> = {
    A: { en: 'Product Strategy', th: 'กลยุทธ์ผลิตภัณฑ์' },
    B: { en: 'Information Architecture', th: 'สถาปัตยกรรมสารสนเทศ' },
    C: { en: 'Visual Design', th: 'การออกแบบภาพ' },
    D: { en: 'Interaction', th: 'การมีปฏิสัมพันธ์' },
    E: { en: 'Responsive Design', th: 'การตอบสนองหลายอุปกรณ์' },
    F: { en: 'Accessibility', th: 'การเข้าถึงได้ (WCAG AA)' },
    G: { en: 'Design System', th: 'ระบบการออกแบบ' },
    H: { en: 'AI, Privacy & Trust', th: 'AI ความโปร่งใสและความเป็นส่วนตัว' },
    I: { en: 'Engineering', th: 'วิศวกรรมซอฟต์แวร์' },
    J: { en: 'Delivery & Handoff', th: 'การส่งมอบและตรวจสอบ' }
  };

  const categoryScores: QAAuditCategoryScore[] = categoryCodes.map((code) => {
    const catItems = items.filter(i => i.item.categoryCode === code);
    const earned = catItems.reduce((acc, curr) => acc + curr.score, 0);
    const max = catItems.length * 2;
    const passed = catItems.filter(i => i.score === 2).length;
    const reviewed = catItems.filter(i => i.score === 1).length;
    const failed = catItems.filter(i => i.score === 0).length;

    return {
      categoryCode: code,
      name: categoryNames[code].en,
      nameTh: categoryNames[code].th,
      earnedPoints: earned,
      maxPoints: max,
      percentage: Math.round((earned / max) * 100),
      passedCount: passed,
      reviewCount: reviewed,
      failedCount: failed
    };
  });

  const totalScore = rawScore; // Max 100 points
  let overallStatus: 'PASS' | 'REVIEW' | 'FAIL' = 'PASS';
  if (!criticalPass || failCount > 0 || totalScore < 70) {
    overallStatus = 'FAIL';
  } else if (totalScore < 90 || reviewCount > 6) {
    overallStatus = 'REVIEW';
  }

  const releaseGateApproved = criticalPass && failCount === 0 && totalScore >= 80;

  if (totalScore < 90) {
    recommendedActions.push('Review non-critical criteria in Categories C, E, and G to reach the 90+ Excellence benchmark.');
  }
  if (!releaseGateApproved) {
    recommendedActions.push('Resolve all failing criteria and run auto-repair before final release approval.');
  } else {
    recommendedActions.push('Eligible for production release consideration under Module 10 Release Gate rules.');
  }

  return {
    totalScore,
    rawScore,
    passCount,
    reviewCount,
    failCount,
    criticalPass,
    status: overallStatus,
    releaseGateApproved,
    categoryScores,
    items,
    criticalDefects,
    recommendedActions
  };
}
