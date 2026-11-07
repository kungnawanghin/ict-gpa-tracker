# ICT GPA Tracker

เว็บไซต์สำหรับช่วยนักศึกษา ict มหาวิทยาลัยมหิดล ติดตามและคำนวณผลการเรียนของตนเอง

## 🌐 เว็บไซต์

สามารถเข้าใช้งานเว็บไซต์ได้ที่:

**https://ict-gpa-tracker-v5l3.vercel.app/**

## ฟีเจอร์หลัก

- บันทึกเกรดของแต่ละรายวิชา
- คำนวณ **SEM-GPA** ของแต่ละภาคการศึกษา
- คำนวณ **CUM-GPA** สะสม
- แสดงประวัติผลการเรียนในรูปแบบตาราง
- แสดงกราฟการเปลี่ยนแปลงของ GPA
- ระบบ Login และ Logout
- บันทึกข้อมูลผู้ใช้และเกรดด้วย Supabase
- ระบบ Admin สำหรับจัดการรายวิชา

## เทคโนโลยีที่ใช้

- **Next.js**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Supabase**
- **Vercel**

## โครงสร้างโปรเจกต์

```text
src/
├── app/           # หน้าต่าง ๆ ของเว็บไซต์
├── components/    # React Components
├── lib/           # ฟังก์ชันสำหรับคำนวณ GPA และเชื่อมต่อฐานข้อมูล
└── types/         # TypeScript Types
```

## การทำงานของระบบ

1. ผู้ใช้เข้าสู่ระบบ
2. ระบบโหลดรายวิชาจากฐานข้อมูล
3. ผู้ใช้เลือกเกรดของแต่ละรายวิชา
4. ระบบบันทึกเกรดลงใน Supabase
5. ระบบคำนวณ SEM-GPA และ CUM-GPA
6. ผลลัพธ์จะแสดงในตาราง GPA History และกราฟ

## การติดตั้งและใช้งาน

### 1. Clone โปรเจกต์

```bash
git clone https://github.com/kungnawanghin/ict-gpa-tracker.git
```

### 2. เข้าไปยังโฟลเดอร์โปรเจกต์

```bash
cd ict-gpa-tracker
```

### 3. ติดตั้ง Dependencies

```bash
npm install
```

### 4. ตั้งค่า Environment Variables

สร้างไฟล์ `.env.local` และเพิ่มข้อมูล Supabase

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

### 5. รันโปรเจกต์

```bash
npm run dev
```

จากนั้นเปิดเว็บไซต์ที่:

```text
http://localhost:3000
```