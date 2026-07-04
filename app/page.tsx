"use client";

import { useMemo, useState } from "react";
import type { ElementType } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Building2,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  Code2,
  Copy,
  Database,
  FileJson,
  FileText,
  Filter,
  Globe2,
  Hash,
  History,
  KeyRound,
  Layers3,
  ListChecks,
  Package,
  Pencil,
  RefreshCcw,
  Ruler,
  SearchCheck,
  Send,
  ServerCog,
  ShieldCheck,
  SquareStack,
  Tag,
  Users,
  XCircle,
} from "lucide-react";

type DataType = {
  id: string;
  name: string;
  icon: ElementType;
  fields: string[];
};

type StatusItem = {
  name: string;
  description: string;
  icon: ElementType;
  tone: string;
};

const dataTypes: DataType[] = [
  {
    id: "asset",
    name: "ข้อมูลครุภัณฑ์",
    icon: ClipboardCheck,
    fields: [
      "รหัสครุภัณฑ์",
      "ชื่อรายการ",
      "เลขทะเบียน /จั งหวัด",
      "รหัสหน่วยงาน",
      "ราคาต่อหน่วย",
      "หน่วยนับ GF",
      "วันที่ได้มา",
      "ยี่ห้อ / รุ่น",
      "หมายเลขเครื่อง / หมายเลข ชป.",
      "เลขตัวถัง / สี",
      "รหัสพัสดุหลัก / กลุ่มพัสดุ / ประเภทพัสดุ / ชนิดพัสดุ",
      "ภาพประกอบรถ 1 และ 2",
    ],
  },
  {
    id: "organization",
    name: "ข้อมูลหน่วยงาน",
    icon: Building2,
    fields: ["รหัสหลัก", "รหัสหน่วยงาน", "ชื่อหน่วยงาน", "รหัสสำนัก/กอง"],
  },
  {
    id: "division",
    name: "ข้อมูลสำนัก/กอง",
    icon: SquareStack,
    fields: ["รหัสหลักสำนัก/กอง", "รหัสสำนัก/กอง", "ชื่อสำนัก/กอง"],
  },
  {
    id: "asset_group",
    name: "ข้อมูลกลุ่มพัสดุ",
    icon: Users,
    fields: ["รหัสกลุ่มพัสดุ", "ชื่อกลุ่มพัสดุ"],
  },
  {
    id: "asset_type",
    name: "ข้อมูลประเภทพัสดุ",
    icon: Tag,
    fields: ["รหัสกลุ่มพัสดุ", "รหัสประเภทพัสดุ", "ชื่อประเภทพัสดุ"],
  },
  {
    id: "asset_kind",
    name: "ข้อมูลชนิดพัสดุ",
    icon: Package,
    fields: [
      "รหัสกลุ่มพัสดุ",
      "รหัสประเภทพัสดุ",
      "รหัสชนิดพัสดุ",
      "ชื่อชนิดพัสดุ",
    ],
  },
  {
    id: "gf_unit",
    name: "ข้อมูลหน่วยนับ GF",
    icon: Ruler,
    fields: ["ชื่อหน่วยนับ"],
  },
];

const principles = [
  {
    title: "เลือกส่งได้ยืดหยุ่น",
    description:
      "ผู้ใช้เลือกประเภทข้อมูลและรายการที่ต้องการส่งได้ ทั้งรายรายการและหลายรายการ",
    icon: ListChecks,
  },
  {
    title: "มีรหัสอ้างอิงหลัก",
    description:
      "ทุกข้อมูลควรมีรหัสหลัก เช่น รหัสครุภัณฑ์ รหัสหน่วยงาน รหัสกลุ่มพัสดุ",
    icon: Hash,
  },
  {
    title: "รองรับเพิ่มใหม่และอัปเดต",
    description:
      "ระบบปลายทางควรรองรับข้อมูลใหม่ การอัปเดตข้อมูลเดิม หรือรูปแบบ Upsert",
    icon: RefreshCcw,
  },
  {
    title: "ตรวจสอบก่อนส่ง",
    description:
      "ก่อนส่งต้องตรวจสอบความครบถ้วนของข้อมูลบังคับตามที่ API ภายนอกกำหนด",
    icon: ShieldCheck,
  },
];

const processSteps = [
  {
    title: "เลือกประเภทข้อมูล",
    description:
      "เลือกครุภัณฑ์ หน่วยงาน สำนัก/กอง กลุ่มพัสดุ ประเภทพัสดุ ชนิดพัสดุ หรือหน่วยนับ GF",
    icon: Layers3,
  },
  {
    title: "แสดงรายการที่เกี่ยวข้อง",
    description:
      "แสดงรายการที่ยังไม่เคยส่ง ส่งไม่สำเร็จ หรือมีการแก้ไขหลังส่งล่าสุด",
    icon: Filter,
  },
  {
    title: "เลือกรายการที่ต้องการส่ง",
    description: "ส่งได้ 1 รายการ หรือเลือกหลายรายการเพื่อส่งเป็นชุด",
    icon: ListChecks,
  },
  {
    title: "ตรวจสอบข้อมูล",
    description:
      "ตรวจสอบความถูกต้องและความครบถ้วน หากไม่ครบให้แจ้งแก้ไขก่อนส่ง",
    icon: SearchCheck,
  },
  {
    title: "บันทึก Log ก่อนส่งจริง",
    description: "สร้างรายการส่งและบันทึกประวัติการส่งก่อนเริ่มเรียก API",
    icon: History,
  },
  {
    title: "ส่งข้อมูลไปยัง API ภายนอก",
    description: "ส่งข้อมูลตามรูปแบบ JSON และ Endpoint ที่ตกลงร่วมกัน",
    icon: Send,
  },
  {
    title: "รอผลตอบกลับ",
    description: "ตรวจสอบ response เพื่อแยกผลสำเร็จและไม่สำเร็จ",
    icon: Clock3,
  },
  {
    title: "อัปเดตสถานะ",
    description: "บันทึกเป็น ส่งสำเร็จ หรือ ส่งไม่สำเร็จ พร้อมรายละเอียด",
    icon: BadgeCheck,
  },
];

const statusItems: StatusItem[] = [
  {
    name: "ยังไม่ส่ง",
    description: "มีข้อมูลในระบบ Asset แต่ยังไม่เคยส่งไปยัง API ภายนอก",
    icon: Clock3,
    tone: "text-slate-600 bg-slate-100",
  },
  {
    name: "รอส่ง",
    description: "ผู้ใช้เลือกข้อมูลแล้ว หรือระบบจัดเข้าคิวรอส่ง",
    icon: Clock3,
    tone: "text-amber-700 bg-amber-100",
  },
  {
    name: "ส่งสำเร็จ",
    description: "API ภายนอกตอบกลับว่าสำเร็จ และระบบบันทึกวันที่ส่งล่าสุดแล้ว",
    icon: CheckCircle2,
    tone: "text-emerald-700 bg-emerald-100",
  },
  {
    name: "ส่งไม่สำเร็จ",
    description: "API ตอบกลับผิดพลาด หรือไม่สามารถเชื่อมต่อได้",
    icon: XCircle,
    tone: "text-rose-700 bg-rose-100",
  },
  {
    name: "มีการแก้ไขหลังส่งล่าสุด",
    description: "ข้อมูลเคยส่งสำเร็จแล้ว แต่มีการแก้ไขใหม่ในระบบ Asset",
    icon: Pencil,
    tone: "text-violet-700 bg-violet-100",
  },
];

const logItems = [
  "ประเภทข้อมูลที่ส่ง",
  "รหัสอ้างอิงของข้อมูล",
  "วันที่และเวลาที่ส่งข้อมูล",
  "ชื่อผู้ส่งข้อมูล หรือรหัสผู้ใช้งาน",
  "สถานะการส่งล่าสุด",
  "จำนวนครั้งที่ส่งหรือส่งซ้ำ",
  "Payload ที่ส่งออกไป",
  "ผลตอบกลับจาก API ภายนอก",
  "ข้อความผิดพลาด กรณีส่งไม่สำเร็จ",
];

const apiAgreements = [
  {
    title: "Endpoint",
    description:
      "กำหนด Endpoint สำหรับรับข้อมูลแต่ละประเภท หรือ Endpoint กลางที่แยกด้วย data_type",
    icon: Globe2,
  },
  {
    title: "Data Format",
    description:
      "กำหนด JSON field name, ชนิดข้อมูล, ความยาวข้อมูล และฟิลด์บังคับ",
    icon: FileJson,
  },
  {
    title: "Authentication",
    description: "กำหนดวิธีตรวจสอบตัวตน เช่น Token, API Key หรือ Bearer Token",
    icon: KeyRound,
  },
  {
    title: "Response Format",
    description: "กำหนดรูปแบบตอบกลับเมื่อสำเร็จและไม่สำเร็จให้ชัดเจน",
    icon: Code2,
  },
  {
    title: "Duplicate / Upsert",
    description:
      "กำหนดพฤติกรรมเมื่อส่งรหัสเดิมซ้ำ เช่น อัปเดตข้อมูลเดิม หรือแจ้งว่าซ้ำ",
    icon: RefreshCcw,
  },
  {
    title: "Payload Limit",
    description:
      "กำหนดขนาดข้อมูลสูงสุดต่อครั้ง โดยเฉพาะกรณีมีรูปภาพหรือส่งหลายรายการ",
    icon: Database,
  },
];

const retryGuides = [
  "ส่งซ้ำเฉพาะรายการที่ไม่สำเร็จได้ โดยไม่ต้องส่งข้อมูลทั้งหมดใหม่",
  "หาก API ภายนอกไม่ตอบกลับ หรือเครือข่ายมีปัญหา ให้บันทึกสถานะเป็นส่งไม่สำเร็จ",
  "หากข้อมูลไม่ผ่านเงื่อนไขของ API ให้แสดงข้อความผิดพลาดอย่างชัดเจน",
  "ควรมีหน้าจอแสดงรายการรอส่ง รายการส่งไม่สำเร็จ และรายการที่มีการแก้ไขหลังส่งล่าสุด",
  "ควรมีรายงานหรือหน้าค้นหาประวัติการส่งย้อนหลัง",
];

const successResponse = `{
  "success": true,
  "message": "received",
  "external_id": "EXT-0001",
  "received_at": "2026-07-03T10:30:00+07:00"
}`;

const errorResponse = `{
  "success": false,
  "message": "validation failed",
  "errors": [
    {
      "field": "asset_code",
      "message": "asset_code is required"
    }
  ]
}`;

const navItems = [
  { href: "#overview", label: "ภาพรวม" },
  { href: "#data-types", label: "ประเภทข้อมูล" },
  { href: "#principles", label: "หลักการส่ง" },
  { href: "#process", label: "ขั้นตอน" },
  { href: "#status", label: "สถานะ" },
  { href: "#log", label: "Log" },
  { href: "#agreements", label: "ข้อกำหนด API" },
  { href: "#retry", label: "ส่งซ้ำ/ตรวจสอบ" },
  { href: "#response", label: "Response" },
];

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1300);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20"
    >
      <Copy className="h-3.5 w-3.5" />
      {copied ? "คัดลอกแล้ว" : "Copy"}
    </button>
  );
}

function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-6">
      <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700 ring-1 ring-blue-100">
        <ChevronRight className="h-4 w-4" />
        {eyebrow}
      </div>
      <h2 className="text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-2 max-w-3xl text-slate-600">{description}</p>
      ) : null}
    </div>
  );
}

export default function Home() {
  const [selectedDataType, setSelectedDataType] = useState<DataType>(
    dataTypes[0],
  );

  const activeFields = useMemo(
    () => selectedDataType.fields,
    [selectedDataType],
  );
  const SelectedDataTypeIcon = selectedDataType.icon;

  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-white/60 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          <a href="#overview" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-700 to-teal-500 text-white shadow-lg shadow-blue-700/20">
              <ServerCog className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-black text-slate-950 md:text-base">
                Asset API Delivery
              </p>
              <p className="hidden text-xs text-slate-500 md:block">
                Interactive Guide
              </p>
            </div>
          </a>
          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a
              href="#response"
              className="hidden rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 sm:inline-flex"
            >
              ดู JSON
            </a>
            <a
              href="/infographic"
              className="rounded-full bg-teal-600 px-4 py-2 text-sm font-bold text-white hover:bg-teal-700"
            >
              Infographic
            </a>
          </div>
        </div>
      </header>

      <section
        id="overview"
        className="section-anchor mx-auto max-w-7xl px-4 pb-12 pt-12 md:px-6 md:pb-16 md:pt-16"
      >
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="glass-card rounded-[2rem] p-6 md:p-10">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-blue-700 shadow-sm ring-1 ring-blue-100">
              <FileText className="h-4 w-4" />
              เอกสารประกอบการเชื่อมต่อ API ภายนอก
            </div>
            <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-tight text-slate-950 md:text-6xl">
              แนวทางการส่งข้อมูลจากระบบ{" "}
              <span className="bg-gradient-to-r from-blue-700 to-teal-500 bg-clip-text text-transparent">
                Asset
              </span>{" "}
              ไปยัง API ภายนอก
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              หน้าเว็บนี้สรุปประเภทข้อมูล หลักการ ขั้นตอนการส่ง สถานะการส่ง
              ประวัติการส่ง และข้อกำหนดที่ควรตกลงกับผู้จัดทำ API ภายนอก
              เพื่อให้การส่งข้อมูลตรวจสอบย้อนหลังได้และลดปัญหาข้อมูลตกหล่น
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#process"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-700 px-6 py-3 font-bold text-white shadow-xl shadow-blue-700/20 hover:-translate-y-0.5 hover:bg-blue-800"
              >
                ดูขั้นตอนการส่งข้อมูล
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#agreements"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-slate-900 ring-1 ring-slate-200 hover:-translate-y-0.5 hover:ring-blue-200"
              >
                ดูข้อกำหนด API
              </a>
              <a
                href="/infographic"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-teal-600 px-6 py-3 font-bold text-white shadow-xl shadow-teal-700/20 hover:-translate-y-0.5 hover:bg-teal-700"
              >
                เปิดหน้า Infographic
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-2xl shadow-slate-900/20">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-200">
                  Flow Summary
                </p>
                <h2 className="text-2xl font-black">ภาพรวมการส่งข้อมูล</h2>
              </div>
              <ServerCog className="h-9 w-9 text-teal-300" />
            </div>
            <div className="space-y-3">
              {[
                "ระบบ Asset",
                "ตรวจสอบข้อมูล",
                "บันทึก Log",
                "ส่ง API ภายนอก",
                "รับ Response",
                "อัปเดตสถานะ",
              ].map((step, index) => (
                <div
                  key={step}
                  className="flex items-center gap-3 rounded-2xl bg-white/7 p-3 ring-1 ring-white/10"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500 text-sm font-black">
                    {index + 1}
                  </div>
                  <span className="font-semibold">{step}</span>
                  {index < 5 ? (
                    <ArrowRight className="ml-auto h-4 w-4 text-blue-200" />
                  ) : (
                    <CheckCircle2 className="ml-auto h-4 w-4 text-teal-300" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="data-types"
        className="section-anchor mx-auto max-w-7xl px-4 py-10 md:px-6"
      >
        <SectionTitle
          eyebrow="1) ประเภทข้อมูลที่ส่ง"
          title="เลือกดูข้อมูลแต่ละประเภทและ Field ที่ต้องส่ง"
          description="แต่ละประเภทข้อมูลควรมีรหัสอ้างอิงหลัก เพื่อให้ระบบปลายทางตรวจสอบ เพิ่มใหม่ หรืออัปเดตข้อมูลเดิมได้"
        />
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="grid gap-3 sm:grid-cols-2">
            {dataTypes.map((item) => {
              const Icon = item.icon;
              const isActive = selectedDataType.id === item.id;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setSelectedDataType(item)}
                  className={`rounded-3xl p-4 text-left ring-1 ${isActive ? "bg-blue-700 text-white ring-blue-700 shadow-xl shadow-blue-700/20" : "bg-white text-slate-800 ring-slate-200 hover:-translate-y-0.5 hover:ring-blue-200"}`}
                >
                  <Icon
                    className={`mb-4 h-8 w-8 ${isActive ? "text-teal-200" : "text-blue-700"}`}
                  />
                  <p className="font-black">{item.name}</p>
                  <p
                    className={`mt-1 text-sm ${isActive ? "text-blue-100" : "text-slate-500"}`}
                  >
                    {item.fields.length} รายการข้อมูล
                  </p>
                </button>
              );
            })}
          </div>
          <div className="glass-card rounded-[2rem] p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-blue-700">
                  รายละเอียด Field
                </p>
                <h3 className="mt-1 text-2xl font-black text-slate-950">
                  {selectedDataType.name}
                </h3>
              </div>
              <SelectedDataTypeIcon className="h-10 w-10 text-teal-500" />
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {activeFields.map((field) => (
                <div
                  key={field}
                  className="flex items-start gap-3 rounded-2xl bg-white p-3 text-sm font-semibold text-slate-700 ring-1 ring-slate-100"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" />
                  {field}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="principles"
        className="section-anchor mx-auto max-w-7xl px-4 py-10 md:px-6"
      >
        <SectionTitle
          eyebrow="2) หลักการส่งข้อมูล"
          title="หลักการสำคัญก่อนเริ่มเชื่อมต่อ API"
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {principles.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-[1.5rem] bg-white p-5 ring-1 ring-slate-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-lg font-black text-teal-700">
                    {index + 1}
                  </div>
                  <Icon className="h-7 w-7 text-blue-700" />
                </div>
                <h3 className="text-lg font-black text-slate-950">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section
        id="process"
        className="section-anchor mx-auto max-w-7xl px-4 py-10 md:px-6"
      >
        <SectionTitle
          eyebrow="3) ขั้นตอนการส่งข้อมูล"
          title="Process Flow ตั้งแต่เลือกข้อมูลจนถึงอัปเดตสถานะ"
          description="ควรแสดงผลแยกรายการเมื่อส่งหลายรายการ เพื่อให้ส่งซ้ำเฉพาะรายการที่มีปัญหาได้"
        />
        <div className="grid gap-4 md:grid-cols-2">
          {processSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="relative overflow-hidden rounded-[1.5rem] bg-white p-5 ring-1 ring-slate-200"
              >
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-50" />
                <div className="relative flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-700 text-lg font-black text-white">
                    {index + 1}
                  </div>
                  <div>
                    <Icon className="mb-2 h-6 w-6 text-teal-500" />
                    <h3 className="text-lg font-black text-slate-950">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section
        id="status"
        className="section-anchor mx-auto max-w-7xl px-4 py-10 md:px-6"
      >
        <SectionTitle
          eyebrow="4) สถานะการส่งข้อมูล"
          title="สถานะที่ควรมีเพื่อควบคุมการ Sync"
        />
        <div className="grid gap-3 lg:grid-cols-5">
          {statusItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.name}
                className="rounded-[1.5rem] bg-white p-5 ring-1 ring-slate-200"
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${item.tone}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-black text-slate-950">{item.name}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section
        id="log"
        className="section-anchor mx-auto max-w-7xl px-4 py-10 md:px-6"
      >
        <SectionTitle
          eyebrow="5) ประวัติการส่ง Log"
          title="ข้อมูลที่ควรเก็บไว้ตรวจสอบย้อนหลัง"
          description="ไม่ควรเก็บแค่วันที่ส่งล่าสุดในตารางหลัก แต่ควรมี Log แยกเพื่อดู payload, response และข้อผิดพลาดย้อนหลัง"
        />
        <div className="glass-card rounded-[2rem] p-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {logItems.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-slate-100"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <span className="text-sm font-bold text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="agreements"
        className="section-anchor mx-auto max-w-7xl px-4 py-10 md:px-6"
      >
        <SectionTitle
          eyebrow="6) ข้อกำหนด API ภายนอก"
          title="สิ่งที่ควรตกลงกับผู้จัดทำ API ก่อนเริ่มพัฒนา"
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {apiAgreements.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-[1.5rem] bg-slate-950 p-5 text-white shadow-xl shadow-slate-900/10"
              >
                <Icon className="mb-4 h-8 w-8 text-teal-300" />
                <h3 className="text-lg font-black">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section
        id="retry"
        className="section-anchor mx-auto max-w-7xl px-4 py-10 md:px-6"
      >
        <SectionTitle
          eyebrow="7) ส่งซ้ำและตรวจสอบปัญหา"
          title="แนวทางลดปัญหาส่งตกหล่นและไล่ปัญหาย้อนหลัง"
        />
        <div className="rounded-[2rem] bg-white p-6 ring-1 ring-slate-200">
          <div className="grid gap-4 md:grid-cols-2">
            {retryGuides.map((guide, index) => (
              <div
                key={guide}
                className="flex gap-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-teal-500 font-black text-white">
                  {index + 1}
                </div>
                <p className="text-sm font-semibold leading-6 text-slate-700">
                  {guide}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="response"
        className="section-anchor mx-auto max-w-7xl px-4 py-10 md:px-6"
      >
        <SectionTitle
          eyebrow="8) ตัวอย่าง Response"
          title="รูปแบบผลตอบกลับจาก API ภายนอก"
          description="ควรให้ API ภายนอกตอบกลับรูปแบบที่อ่านง่ายและบันทึกลง Log ได้ทันที"
        />
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="code-block overflow-hidden rounded-[1.5rem]">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-2 font-black text-emerald-300">
                <CheckCircle2 className="h-5 w-5" /> กรณีส่งสำเร็จ
              </div>
              <CopyButton value={successResponse} />
            </div>
            <pre className="overflow-x-auto p-5 text-sm leading-7">
              <code>{successResponse}</code>
            </pre>
          </div>
          <div className="code-block overflow-hidden rounded-[1.5rem]">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-2 font-black text-rose-300">
                <AlertTriangle className="h-5 w-5" /> กรณีส่งไม่สำเร็จ
              </div>
              <CopyButton value={errorResponse} />
            </div>
            <pre className="overflow-x-auto p-5 text-sm leading-7">
              <code>{errorResponse}</code>
            </pre>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:pb-20">
        <div className="rounded-[2rem] bg-gradient-to-r from-blue-800 to-slate-950 p-6 text-white shadow-2xl shadow-blue-900/20 md:p-8">
          <div className="grid gap-5 md:grid-cols-[auto_1fr] md:items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 ring-1 ring-white/15">
              <BarChart3 className="h-9 w-9 text-teal-300" />
            </div>
            <div>
              <h2 className="text-2xl font-black">เป้าหมายของแนวทางนี้</h2>
              <p className="mt-2 leading-8 text-blue-100">
                ให้การส่งข้อมูลตรวจสอบย้อนหลังได้ ลดข้อมูลตกหล่น
                และช่วยให้ผู้ใช้ทราบชัดเจนว่ารายการใดส่งสำเร็จ
                รายการใดส่งไม่สำเร็จ และรายการใดต้องส่งอัปเดตอีกครั้ง
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
