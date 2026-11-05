export interface CanonicalWorkflow {
  id: string;
  name: string;
  nameTh: string;
  category: string;
  description: string;
  descriptionTh: string;
  steps: string[]; // command names e.g. ['/research', '/analysis', '/article']
  sampleInput: string;
  sampleInputTh: string;
  purpose: string;
}

export const CANONICAL_WORKFLOWS: CanonicalWorkflow[] = [
  {
    id: 'wf-academic-paper',
    name: 'Academic Research to Article',
    nameTh: 'เวิร์กโฟลว์งานวิจัยสู่บทความวิชาการ',
    category: 'Academic & Research',
    description: 'Deconstructs research questions, conducts systematic academic analysis, and compiles a formal scholarly article.',
    descriptionTh: 'เริ่มจากการทบทวนวรรณกรรม สังเคราะห์ข้อมูลเชิงลึก และเรียบเรียงเป็นบทความวิชาการฉบับสมบูรณ์',
    steps: ['/deepdive', '/analysis', '/article'],
    sampleInput: 'The impact of multimodal AI systems on higher education pedagogy in Southeast Asia',
    sampleInputTh: 'ผลกระทบของระบบปัญญาประดิษฐ์แบบมัลติโมดอลต่อการจัดการเรียนการสอนระดับอุดมศึกษาในเอเชียตะวันออกเฉียงใต้',
    purpose: 'Standard pipeline for academic publishing and literature synthesis.'
  },
  {
    id: 'wf-academic-presentation',
    name: 'Scholarly Research to Presentation',
    nameTh: 'เวิร์กโฟลว์งานวิจัยสู่งานนำเสนอทางวิชาการ',
    category: 'Academic & Research',
    description: 'Extracts empirical findings, formats into Section 8 scholarly structure, and generates slide deck with speaker notes.',
    descriptionTh: 'กลั่นกรองข้อค้นพบจากการวิจัย แปลงเป็นโครงสร้างทางวิชาการ และสร้างสไลด์นำเสนอพร้อมบทพูด',
    steps: ['/deepdive', '/academic', '/presentation'],
    sampleInput: 'Quantum computing error mitigation algorithms: benchmark results and future milestones',
    sampleInputTh: 'อัลกอริทึมลดข้อผิดพลาดในคอมพิวเตอร์ควอนตัม: ผลการทดสอบและก้าวต่อไปในอนาคต',
    purpose: 'Conference talk and academic defense slide preparation.'
  },
  {
    id: 'wf-creative-visual',
    name: 'Creative Concept to Visual Image',
    nameTh: 'เวิร์กโฟลว์ระดมไอเดียสู่ภาพสร้างสรรค์',
    category: 'Design & Visual',
    description: 'Divergent ideation, rigorous concept design, art direction manifesto, and production GenAI image prompt.',
    descriptionTh: 'ระดมแนวคิด ออกแบบคอนเซปต์ กำหนดทิศทางศิลป์ และสร้างคำสั่งภาพ AI คุณภาพสูง',
    steps: ['/brainstorm', '/conceptdesign', '/artdirection', '/image'],
    sampleInput: 'Neo-Ayutthaya solar-punk floating city in the year 2150 with sustainable bio-luminescent canals',
    sampleInputTh: 'เมืองลอยน้ำพลังงานแสงอาทิตย์สไตล์นีโอ-อยุธยาในปี ค.ศ. 2150 พร้อมคลองเรืองแสงชีวภาพ',
    purpose: 'Full creative visual pipeline adhering to Section 9 Visual Protocol.'
  },
  {
    id: 'wf-book-cover',
    name: 'Book/Textbook Cover Design',
    nameTh: 'เวิร์กโฟลว์ออกแบบหน้าปกตำราและหนังสือ',
    category: 'Design & Visual',
    description: 'Textbook layout architecture, typography hierarchy, academic art direction, and Imagen prompt.',
    descriptionTh: 'วางเลย์เอาต์หน้าปกตำราวิชาการ จัดลำดับตัวอักษร คุมทิศทางศิลป์ และสร้างภาพหน้าปก',
    steps: ['/cover', '/artdirection', '/image'],
    sampleInput: 'University Textbook: Principles of Artificial Intelligence and Neural Engineering by Nakhon Ratchasima Rajabhat University',
    sampleInputTh: 'ตำราเรียนระดับอุดมศึกษา: หลักการปัญญาประดิษฐ์และวิศวกรรมโครงข่ายประสาทเทียม มหาวิทยาลัยราชภัฏนครราชสีมา',
    purpose: 'Scholarly and commercial book cover production.'
  },
  {
    id: 'wf-visual-analysis-regen',
    name: 'Visual Analysis & Reconstruction',
    nameTh: 'เวิร์กโฟลว์วิเคราะห์ภาพและสร้างสรรค์ต่อยอด',
    category: 'Design & Visual',
    description: 'Critiques existing visual composition and semiotics, re-engineers art direction, and synthesizes improved prompt.',
    descriptionTh: 'วิเคราะห์องค์ประกอบภาพเดิม สกัดสัญศาสตร์และข้อบกพร่อง ปรับอาร์ตไดเรกชัน และสร้างภาพใหม่ที่สมบูรณ์กว่าเดิม',
    steps: ['/visualanalysis', '/artdirection', '/image'],
    sampleInput: 'A minimalist architectural photograph of a brutalist university library at dusk with dramatic shadows',
    sampleInputTh: 'ภาพถ่ายสถาปัตยกรรมมินิมอลของหอสมุดมหาวิทยาลัยสไตล์บรูทัลลิสต์ยามพลบค่ำพร้อมเงาทอดยาว',
    purpose: 'Iterative visual refinement and semiotic transformation.'
  },
  {
    id: 'wf-code-quality',
    name: 'Code Debugging, Optimization & Docs',
    nameTh: 'เวิร์กโฟลว์แก้บั๊ก ปรับความเร็ว และทำคู่มือ',
    category: 'Programming & Engineering',
    description: 'Diagnoses runtime bugs, refactors for Big-O efficiency, and writes developer documentation and unit tests.',
    descriptionTh: 'ตรวจจับและแก้ไขบั๊ก ปรับปรุงอัลกอริทึมให้มีประสิทธิภาพสูงสุด และจัดทำเอกสารคู่มือพร้อมตัวอย่างการทดสอบ',
    steps: ['/debug', '/optimize', '/documentation'],
    sampleInput: 'Async worker pool in TypeScript with memory leak during concurrent task cancellation',
    sampleInputTh: 'ระบบจัดคิวงาน Async ใน TypeScript ที่เกิดปัญหา Memory leak ขณะยกเลิกงานที่ทำงานพร้อมกัน',
    purpose: 'End-to-end software quality assurance pipeline.'
  }
];
