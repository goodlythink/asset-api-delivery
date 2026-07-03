# Asset API Delivery Web

หน้าเว็บ Interactive สำหรับอธิบายแนวทางการส่งข้อมูลจากระบบ Asset ไปยัง API ภายนอก

## Tech Stack

- Next.js
- React
- Tailwind CSS
- lucide-react
- ไม่ใช้ Mantine
- เหมาะสำหรับ Deploy บน Vercel

## วิธีใช้งานบนเครื่อง

```bash
npm install
npm run dev
```

เปิดเว็บที่:

```bash
http://localhost:3000
```

## Build ก่อน Deploy

```bash
npm run build
npm run start
```

## Deploy บน Vercel

1. แตกไฟล์ zip นี้
2. สร้าง Git repository แล้ว push ขึ้น GitHub/GitLab
3. เข้า Vercel แล้วเลือก Import Project
4. เลือก repository นี้
5. Framework Preset: Next.js
6. กด Deploy

## จุดที่แก้ไขข้อความได้ง่าย

เนื้อหาหลักอยู่ที่ไฟล์:

```text
app/page.tsx
```

ข้อมูลที่แก้บ่อย:

- `dataTypes` ประเภทข้อมูลและ Field ที่ส่ง
- `principles` หลักการส่งข้อมูล
- `processSteps` ขั้นตอนการส่งข้อมูล
- `statusItems` สถานะการส่ง
- `logItems` ข้อมูลที่ต้องบันทึกใน Log
- `apiAgreements` ข้อกำหนดที่ต้องตกลงกับผู้จัดทำ API
- `retryGuides` แนวทางส่งซ้ำและตรวจสอบปัญหา
- `successResponse` และ `errorResponse` ตัวอย่าง JSON response
