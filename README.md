# 🤖 Universal AI Command Studio — NRRU

**Universal AI Command Studio** เป็นแพลตฟอร์มสำหรับการบริหารจัดการ ประมวลผล และส่งคำสั่งแก่ระบบปัญญาประดิษฐ์ (AI Command Platform) พัฒนาขึ้นโดยเน้นความเร็ว ปลอดภัย และขยายระบบได้ง่าย

---

## 🛠️ เทคโนโลยีหลักที่ใช้ (Tech Stack)

* **Runtime & Package Manager:** [Bun](https://bun.sh/)
* **Backend:** TypeScript / Node.js (`server.ts`)
* **Database & Cloud Services:** Firebase Firestore & Cloud Infrastructure (`firestore.rules`, `firebase-blueprint.json`)
* **Frontend:** HTML5 / TypeScript (`index.html`, `src/`)

---

## 📁 โครงสร้างโปรเจกต์ (Project Structure)

```text
Universal-AI-Command-Studio/
├── src/                        # ซอร์สโค้ดหลักของโปรเจกต์ (Components / Core Logic)
├── .env.example                # ตัวอย่างการกำหนดค่า Environment Variables
├── .gitignore                  # รายการไฟล์/โฟลเดอร์ที่ไม่จัดเก็บลง Git Repository
├── bun.lock                    # ไฟล์ Lock ความสัมพันธ์ของ Dependencies สำหรับ Bun
├── firebase-applet-config.json # ไฟล์การตั้งค่าคอนฟิก Firebase Applet
├── firebase-blueprint.json     # ผังโครงสร้าง/พิมพ์เขียวข้อมูลของ Firebase
├── firestore.rules             # กฎความปลอดภัยและการเข้าถึงข้อมูลใน Cloud Firestore
├── index.html                  # ไฟล์ HTML หลักสำหรับแสดงผลหน้าเว็บ
├── metadata.json               # รายละเอียด Metadata ของโปรเจกต์
├── package.json                # รายการ Dependencies และ Scripts สำหรับรันโปรเจกต์
└── server.ts                   # ไฟล์เซิร์ฟเวอร์หลัก (TypeScript)
```

---

## 🚀 การติดตั้งและการใช้งาน (Getting Started)

### 1. ความต้องการของระบบ (Prerequisites)
เครื่องของคุณต้องติดตั้ง **Bun** เรียบร้อยแล้ว หากยังไม่ได้ติดตั้ง สามารถติดตั้งได้ด้วยคำสั่ง:

```bash
# สำหรับ macOS / Linux / WSL
curl -fsSL https://bun.sh/install | bash
```

### 2. คลองโปรเจกต์ (Clone Repository)
```bash
git clone https://github.com/thitiwass-sketch/Universal-AI-Command-Studio.git
cd Universal-AI-Command-Studio
```

### 3. ติดตั้ง Dependencies
```bash
bun install
```

### 4. ตั้งค่า Environment Variables
คัดลอกไฟล์ `.env.example` เพื่อสร้างไฟล์ `.env` แล้วระบุค่า API Keys หรือ Firebase Config ตามที่ต้องการ:
```bash
cp .env.example .env
```

### 5. การรันแอปพลิเคชัน (Running the Application)

* **รัน Development Server:**
  ```bash
  bun run dev
  ```

* **รัน Backend Server สแตนด์อโลน:**
  ```bash
  bun server.ts
  ```

---

## 🛡️ กฎความปลอดภัย Firebase (Firestore Rules)
โปรเจกต์นี้ใช้ `firestore.rules` ในการควบคุมสิทธิ์ access control หากมีการแก้ไขโครงสร้างข้อมูล กรุณาตรวจสอบกฎความปลอดภัยและทดสอบก่อนทำการปรับใช้ (Deploy) บน Production

---

## 👥 ผู้พัฒนา (Contributors)

* **Thitiwass** ([@thitiwass-sketch](https://github.com/thitiwass-sketch))

---

## 📄 ใบอนุญาต (License)

โปรเจกต์นี้สงวนลิขสิทธิ์สำหรับใช้งานภายใน **NRRU**
