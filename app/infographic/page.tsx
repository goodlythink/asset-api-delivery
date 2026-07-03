'use client';

import { useState } from 'react';
import type { ElementType } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Boxes,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Code2,
  Database,
  FileJson,
  FileText,
  Globe2,
  History,
  KeyRound,
  Layers3,
  ListChecks,
  Package,
  Pencil,
  RefreshCcw,
  Route,
  Ruler,
  SearchCheck,
  Send,
  ShieldCheck,
  Tag,
  Users,
  XCircle,
} from 'lucide-react';

type FocusKind = 'data' | 'principle' | 'step' | 'status' | 'log' | 'api' | 'retry' | 'response';

type FocusItem = {
  id: string;
  kind: FocusKind;
  title: string;
  subtitle: string;
  icon: ElementType;
  color: string;
  details: string[];
};

const dataItems: FocusItem[] = [
  {
    id: 'asset',
    kind: 'data',
    title: 'ข้อมูลครุภัณฑ์',
    subtitle: 'Asset master',
    icon: ClipboardCheck,
    color: 'from-blue-700 to-sky-500',
    details: ['รหัสครุภัณฑ์', 'ชื่อรายการ / เลขทะเบียน', 'หน่วยงาน / ราคา / วันที่ได้มา', 'ยี่ห้อ รุ่น หมายเลขเครื่อง', 'กลุ่ม ประเภท ชนิดพัสดุ และภาพรถ'],
  },
  {
    id: 'organization',
    kind: 'data',
    title: 'ข้อมูลหน่วยงาน',
    subtitle: 'Organization',
    icon: Building2,
    color: 'from-teal-700 to-emerald-500',
    details: ['รหัสหน่วยงาน', 'ชื่อหน่วยงาน', 'รหัสสำนัก/กอง'],
  },
  {
    id: 'division',
    kind: 'data',
    title: 'ข้อมูลสำนัก/กอง',
    subtitle: 'Division',
    icon: Layers3,
    color: 'from-indigo-700 to-blue-500',
    details: ['รหัสสำนัก/กอง', 'ชื่อสำนัก/กอง'],
  },
  {
    id: 'asset-group',
    kind: 'data',
    title: 'ข้อมูลกลุ่มพัสดุ',
    subtitle: 'Asset group',
    icon: Users,
    color: 'from-cyan-700 to-teal-500',
    details: ['รหัสกลุ่มพัสดุ', 'ชื่อกลุ่มพัสดุ'],
  },
  {
    id: 'asset-type',
    kind: 'data',
    title: 'ข้อมูลประเภทพัสดุ',
    subtitle: 'Asset type',
    icon: Tag,
    color: 'from-amber-600 to-yellow-400',
    details: ['รหัสกลุ่มพัสดุ', 'รหัสประเภทพัสดุ', 'ชื่อประเภทพัสดุ'],
  },
  {
    id: 'asset-kind',
    kind: 'data',
    title: 'ข้อมูลชนิดพัสดุ',
    subtitle: 'Asset kind',
    icon: Package,
    color: 'from-violet-700 to-fuchsia-500',
    details: ['รหัสกลุ่มพัสดุ', 'รหัสประเภทพัสดุ', 'รหัสชนิดพัสดุ', 'ชื่อชนิดพัสดุ'],
  },
  {
    id: 'gf-unit',
    kind: 'data',
    title: 'ข้อมูลหน่วยนับ GF',
    subtitle: 'GF unit',
    icon: Ruler,
    color: 'from-rose-700 to-pink-500',
    details: ['ชื่อหน่วยนับ'],
  },
];

const principleItems: FocusItem[] = [
  {
    id: 'selectable',
    kind: 'principle',
    title: 'เลือกส่งได้',
    subtitle: 'ส่งรายรายการหรือเป็นชุด',
    icon: ListChecks,
    color: 'from-teal-700 to-teal-500',
    details: ['ผู้ใช้เลือกประเภทข้อมูล', 'เลือกได้ 1 รายการหรือหลายรายการ', 'ลดการส่งข้อมูลเกินจำเป็น'],
  },
  {
    id: 'reference-code',
    kind: 'principle',
    title: 'มีรหัสหลัก',
    subtitle: 'ใช้เทียบกับปลายทาง',
    icon: KeyRound,
    color: 'from-blue-700 to-sky-500',
    details: ['ทุกประเภทต้องมีรหัสอ้างอิง', 'ใช้ตรวจซ้ำและอัปเดตข้อมูลเดิม', 'เช่น asset_code, organization_code'],
  },
  {
    id: 'upsert',
    kind: 'principle',
    title: 'รองรับ Upsert',
    subtitle: 'ใหม่เพิ่ม เดิมอัปเดต',
    icon: RefreshCcw,
    color: 'from-emerald-700 to-green-500',
    details: ['ถ้ายังไม่มี ให้เพิ่มใหม่', 'ถ้ามีข้อมูลแล้ว ให้อัปเดต', 'ต้องตกลงพฤติกรรมซ้ำกับ API ภายนอก'],
  },
  {
    id: 'validate',
    kind: 'principle',
    title: 'ตรวจก่อนส่ง',
    subtitle: 'ไม่ครบให้แก้ก่อน',
    icon: ShieldCheck,
    color: 'from-slate-800 to-slate-600',
    details: ['เช็กฟิลด์บังคับ', 'เช็กชนิดข้อมูลและรูปแบบ', 'แจ้งผู้ใช้ก่อนเรียก API จริง'],
  },
];

const stepItems: FocusItem[] = [
  { id: 'choose-type', kind: 'step', title: 'เลือกประเภท', subtitle: 'เริ่มจากชนิดข้อมูล', icon: Route, color: 'from-blue-700 to-sky-500', details: ['เลือกครุภัณฑ์ หน่วยงาน สำนัก/กอง หรือ master data อื่น'] },
  { id: 'filter-list', kind: 'step', title: 'กรองรายการ', subtitle: 'เฉพาะที่ควรส่ง', icon: SearchCheck, color: 'from-blue-700 to-sky-500', details: ['ยังไม่เคยส่ง', 'ส่งไม่สำเร็จ', 'มีการแก้ไขหลังส่งล่าสุด'] },
  { id: 'pick-records', kind: 'step', title: 'เลือกรายการ', subtitle: 'เดี่ยวหรือหลายรายการ', icon: ListChecks, color: 'from-blue-700 to-sky-500', details: ['เลือกส่ง 1 รายการ', 'เลือกหลายรายการเพื่อส่งเป็นชุด'] },
  { id: 'validate-data', kind: 'step', title: 'Validate', subtitle: 'เช็กความครบถ้วน', icon: ShieldCheck, color: 'from-blue-700 to-sky-500', details: ['ตรวจข้อมูลบังคับ', 'หยุดส่งถ้าข้อมูลไม่ครบ'] },
  { id: 'write-log', kind: 'step', title: 'บันทึก Log', subtitle: 'สร้างร่องรอยก่อนส่ง', icon: History, color: 'from-blue-700 to-sky-500', details: ['บันทึก payload', 'บันทึกผู้ส่งและเวลา', 'นับจำนวนครั้งที่ส่ง'] },
  { id: 'send-api', kind: 'step', title: 'ส่ง API', subtitle: 'เรียกปลายทาง', icon: Send, color: 'from-blue-700 to-sky-500', details: ['ส่ง JSON ตามรูปแบบที่ตกลง', 'รองรับการส่งเป็น batch ตาม limit'] },
  { id: 'wait-response', kind: 'step', title: 'รับผล', subtitle: 'success หรือ error', icon: Code2, color: 'from-blue-700 to-sky-500', details: ['อ่าน response จาก API', 'แยกผลสำเร็จและไม่สำเร็จรายรายการ'] },
  { id: 'update-status', kind: 'step', title: 'อัปเดตสถานะ', subtitle: 'จบวงจรการส่ง', icon: BadgeCheck, color: 'from-blue-700 to-sky-500', details: ['ส่งสำเร็จ', 'ส่งไม่สำเร็จ', 'มีการแก้ไขหลังส่งล่าสุด'] },
];

const statusItems: FocusItem[] = [
  { id: 'not-sent', kind: 'status', title: 'ยังไม่ส่ง', subtitle: 'ยังไม่เคยออก API', icon: Clock3, color: 'from-slate-600 to-slate-400', details: ['มีข้อมูลใน Asset', 'ยังไม่มีประวัติส่งไป API'] },
  { id: 'queued', kind: 'status', title: 'รอส่ง', subtitle: 'เลือกไว้หรือเข้าคิว', icon: Clock3, color: 'from-amber-600 to-yellow-400', details: ['ผู้ใช้เลือกไว้แล้ว', 'หรือระบบจัดเข้าคิวรอส่ง'] },
  { id: 'success', kind: 'status', title: 'ส่งสำเร็จ', subtitle: 'API รับแล้ว', icon: CheckCircle2, color: 'from-emerald-700 to-green-500', details: ['API ตอบกลับว่าสำเร็จ', 'บันทึกวันที่ส่งล่าสุดและ response'] },
  { id: 'failed', kind: 'status', title: 'ส่งไม่สำเร็จ', subtitle: 'ส่งแล้วมีปัญหา', icon: XCircle, color: 'from-rose-700 to-red-500', details: ['API ตอบผิดพลาด', 'หรือเชื่อมต่อไม่ได้', 'ต้องแสดงสาเหตุให้ชัดเจน'] },
  { id: 'changed', kind: 'status', title: 'แก้ไขหลังส่ง', subtitle: 'ต้องส่ง update', icon: Pencil, color: 'from-violet-700 to-purple-500', details: ['เคยส่งสำเร็จแล้ว', 'ข้อมูลใน Asset ถูกแก้ไขใหม่', 'ควรเตือนให้ส่งอัปเดตอีกครั้ง'] },
  { id: 'retry', kind: 'status', title: 'ส่งซ้ำ', subtitle: 'เฉพาะรายการมีปัญหา', icon: RefreshCcw, color: 'from-cyan-700 to-teal-500', details: ['ใช้กับรายการส่งไม่สำเร็จ', 'หรือรายการที่แก้ไขหลังส่งล่าสุด', 'ไม่ต้องส่งทุกอย่างใหม่'] },
];

const logItem: FocusItem = {
  id: 'log-fields',
  kind: 'log',
  title: 'ประวัติการส่ง',
  subtitle: 'หลักฐานตรวจสอบย้อนหลัง',
  icon: History,
  color: 'from-slate-900 to-blue-800',
  details: ['ประเภทข้อมูล', 'รหัสอ้างอิง', 'วันเวลา / ผู้ส่ง', 'สถานะ / จำนวนครั้ง', 'Payload / Response / Error'],
};

const apiItems: FocusItem[] = [
  { id: 'endpoint', kind: 'api', title: 'Endpoint', subtitle: 'URL รับข้อมูล', icon: Globe2, color: 'from-blue-700 to-sky-500', details: ['แยกตามประเภทข้อมูล', 'หรือ endpoint กลางที่มี data_type'] },
  { id: 'format', kind: 'api', title: 'JSON Format', subtitle: 'โครงสร้าง payload', icon: FileJson, color: 'from-emerald-700 to-green-500', details: ['field name', 'ชนิดข้อมูล', 'ความยาว', 'ฟิลด์บังคับ'] },
  { id: 'auth', kind: 'api', title: 'Auth', subtitle: 'สิทธิ์เรียก API', icon: KeyRound, color: 'from-amber-600 to-yellow-400', details: ['Token', 'API Key', 'Bearer Token'] },
  { id: 'response-format', kind: 'api', title: 'Response', subtitle: 'รูปแบบผลลัพธ์', icon: Code2, color: 'from-violet-700 to-purple-500', details: ['success true/false', 'message', 'external_id', 'errors'] },
  { id: 'duplicate', kind: 'api', title: 'Duplicate', subtitle: 'ส่งรหัสเดิมซ้ำ', icon: RefreshCcw, color: 'from-cyan-700 to-teal-500', details: ['อัปเดตข้อมูลเดิม', 'หรือแจ้งว่าซ้ำ', 'ต้องกำหนดให้ชัด'] },
  { id: 'payload-limit', kind: 'api', title: 'Payload Limit', subtitle: 'ขนาดต่อครั้ง', icon: Database, color: 'from-rose-700 to-red-500', details: ['จำกัด batch size', 'ระวังรูปภาพประกอบรถ'] },
];

const retryItem: FocusItem = {
  id: 'retry-flow',
  kind: 'retry',
  title: 'ส่งซ้ำและแก้ปัญหา',
  subtitle: 'Retry เฉพาะรายการที่จำเป็น',
  icon: RefreshCcw,
  color: 'from-teal-700 to-cyan-500',
  details: ['เลือกเฉพาะรายการส่งไม่สำเร็จ', 'ถ้า API ไม่ตอบ ให้บันทึกส่งไม่สำเร็จ', 'ถ้าข้อมูลผิด ให้แสดง error', 'มีหน้าค้นหาประวัติย้อนหลัง'],
};

const responseItems: FocusItem[] = [
  {
    id: 'response-success',
    kind: 'response',
    title: 'Success response',
    subtitle: 'API รับข้อมูลแล้ว',
    icon: CheckCircle2,
    color: 'from-emerald-700 to-green-500',
    details: ['success: true', 'message: received', 'external_id: EXT-0001', 'received_at: 2026-07-03T10:30:00+07:00'],
  },
  {
    id: 'response-error',
    kind: 'response',
    title: 'Error response',
    subtitle: 'ข้อมูลไม่ผ่านเงื่อนไข',
    icon: AlertTriangle,
    color: 'from-rose-700 to-red-500',
    details: ['success: false', 'message: validation failed', 'field: asset_code', 'message: asset_code is required'],
  },
];

const successJson = `{
  "success": true,
  "message": "received",
  "external_id": "EXT-0001",
  "received_at": "2026-07-03T10:30:00+07:00"
}`;

const errorJson = `{
  "success": false,
  "message": "validation failed",
  "errors": [
    {
      "field": "asset_code",
      "message": "asset_code is required"
    }
  ]
}`;

const retrySteps = [
  { label: 'Fail', title: 'ส่งไม่สำเร็จ', icon: XCircle, color: 'bg-rose-600' },
  { label: 'Error', title: 'ดูสาเหตุ', icon: AlertTriangle, color: 'bg-amber-500' },
  { label: 'Fix', title: 'แก้ข้อมูล', icon: Pencil, color: 'bg-violet-600' },
  { label: 'Retry', title: 'ส่งซ้ำ', icon: RefreshCcw, color: 'bg-cyan-600' },
  { label: 'Log', title: 'บันทึกผล', icon: History, color: 'bg-blue-700' },
];

function SectionBadge({ number, title }: { number: string; title: string }) {
  return (
    <div className="mb-3 inline-flex items-center overflow-hidden rounded-md bg-blue-800 text-white shadow-sm">
      <span className="bg-blue-950 px-3 py-2 text-sm font-black">{number}</span>
      <span className="px-4 py-2 text-sm font-black">{title}</span>
    </div>
  );
}

function IconButton({ item, selected, onSelect, compact = false }: { item: FocusItem; selected: boolean; onSelect: () => void; compact?: boolean }) {
  const Icon = item.icon;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group relative rounded-xl border bg-white p-3 text-center shadow-sm transition ${selected ? 'border-blue-600 shadow-blue-700/20 ring-4 ring-blue-100' : 'border-slate-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md'}`}
    >
      <div className={`mx-auto flex ${compact ? 'h-11 w-11' : 'h-14 w-14'} items-center justify-center rounded-full bg-gradient-to-br ${item.color} text-white shadow-md`}>
        <Icon className={compact ? 'h-5 w-5' : 'h-7 w-7'} />
      </div>
      <p className={`mt-2 font-black leading-tight text-slate-900 ${compact ? 'text-xs' : 'text-sm'}`}>{item.title}</p>
      {!compact ? <p className="mt-1 text-xs font-bold text-slate-400">{item.subtitle}</p> : null}
    </button>
  );
}

function InlineDetails({ item }: { item: FocusItem }) {
  return (
    <div className="mt-3 flex flex-col gap-3 rounded-xl border border-blue-200 bg-blue-50 p-3 text-left md:flex-row md:items-start">
      <div className="shrink-0 rounded-lg bg-blue-800 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-white md:max-w-40">
        {item.subtitle}
      </div>
      <div className="flex flex-1 flex-wrap gap-2">
        {item.details.map((detail) => (
          <div key={detail} className="inline-flex min-h-9 items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-bold leading-5 text-slate-700 shadow-sm ring-1 ring-blue-100">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-600" />
            {detail}
          </div>
        ))}
      </div>
    </div>
  );
}

function FlowNode({ item, selected, onSelect, index }: { item: FocusItem; selected: boolean; onSelect: () => void; index: number }) {
  const Icon = item.icon;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative flex items-center gap-3 rounded-lg border bg-white p-3 text-left transition ${selected ? 'border-blue-600 ring-4 ring-blue-100' : 'border-slate-200 hover:border-blue-300'}`}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-800 text-sm font-black text-white">{index + 1}</span>
      <Icon className="h-5 w-5 shrink-0 text-blue-700" />
      <div className="min-w-0">
        <p className="text-sm font-black text-slate-950">{item.title}</p>
        <p className="truncate text-xs font-bold text-slate-400">{item.subtitle}</p>
      </div>
    </button>
  );
}

export default function InfographicPage() {
  const [selectedId, setSelectedId] = useState('asset');
  const selectedData = dataItems.find((item) => item.id === selectedId);
  const selectedPrinciple = principleItems.find((item) => item.id === selectedId);
  const selectedStep = stepItems.find((item) => item.id === selectedId);
  const selectedStatus = statusItems.find((item) => item.id === selectedId);
  const selectedApi = apiItems.find((item) => item.id === selectedId);
  const selectedResponse = responseItems.find((item) => item.id === selectedId);

  return (
    <main className="min-h-screen bg-[#eef5ff] px-3 py-5 text-slate-950 md:px-6">
      <div className="mx-auto max-w-[1180px]">
        <section className="overflow-hidden rounded-[28px] border border-blue-200 bg-white shadow-2xl shadow-blue-950/10">
          <header className="relative border-b border-blue-100 bg-gradient-to-br from-white via-blue-50 to-cyan-50 px-5 py-6 md:px-8">
            <div className="absolute right-6 top-5 hidden rounded-2xl bg-white p-4 shadow-md ring-1 ring-blue-100 md:flex">
              <div className="flex items-center gap-3">
                <Boxes className="h-10 w-10 text-blue-700" />
                <ArrowRight className="h-5 w-5 text-slate-400" />
                <div className="rounded-lg bg-teal-600 px-4 py-2 text-xl font-black text-white">API</div>
              </div>
            </div>
            <a href="/" className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-blue-800 shadow-sm ring-1 ring-blue-100 hover:bg-blue-50">
              <ArrowRight className="h-4 w-4 rotate-180" />
              กลับหน้าคู่มือ
            </a>
            <h1 className="max-w-5xl text-3xl font-black leading-tight text-blue-950 md:text-5xl">
              แนวทางการส่งข้อมูลจากระบบ Asset ไปยัง API ภายนอก
            </h1>
            <p className="mt-3 max-w-4xl text-base font-bold text-slate-600 md:text-lg">
              คลิกแต่ละจุดในภาพเพื่อดู field, logic, status และ error handling โดยไม่ต้องอ่านทั้งเอกสารยาว ๆ
            </p>
          </header>

          <div className="space-y-5 p-4 md:p-6">
            <section className="rounded-2xl border border-blue-200 bg-white p-4">
              <SectionBadge number="1" title="ประเภทข้อมูลที่ส่ง" />
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
                {dataItems.map((item) => (
                  <div key={item.id}>
                    <IconButton item={item} selected={selectedId === item.id} onSelect={() => setSelectedId(item.id)} />
                  </div>
                ))}
              </div>
              {selectedData ? <InlineDetails item={selectedData} /> : null}
              <div className="mt-3 rounded-xl bg-blue-50 px-4 py-3 text-center text-sm font-black text-blue-900 ring-1 ring-blue-100">
                ระบบ Asset เป็นผู้รวบรวมและส่งข้อมูลไปยัง API ภายนอก
              </div>
            </section>

            <div className="grid gap-5 lg:grid-cols-[0.95fr_1.45fr]">
              <section className="rounded-2xl border border-blue-200 bg-white p-4">
                <SectionBadge number="2" title="หลักการส่งข้อมูล" />
                <div className="grid gap-3">
                  {principleItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.id}>
                        <button
                          type="button"
                          onClick={() => setSelectedId(item.id)}
                          className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${selectedId === item.id ? 'border-teal-500 bg-teal-50 ring-4 ring-teal-100' : 'border-slate-200 bg-white hover:border-teal-300'}`}
                        >
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-600 text-lg font-black text-white">{index + 1}</span>
                          <Icon className="h-7 w-7 shrink-0 text-blue-800" />
                          <div>
                            <p className="font-black text-slate-950">{item.title}</p>
                            <p className="text-sm font-bold text-slate-500">{item.subtitle}</p>
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>
                {selectedPrinciple ? <InlineDetails item={selectedPrinciple} /> : null}
              </section>

              <section className="rounded-2xl border border-blue-200 bg-white p-4">
                <SectionBadge number="3" title="ขั้นตอนการส่งข้อมูล" />
                <div className="grid gap-2 md:grid-cols-2">
                  {stepItems.map((item, index) => (
                    <div key={item.id}>
                      <FlowNode item={item} index={index} selected={selectedId === item.id} onSelect={() => setSelectedId(item.id)} />
                    </div>
                  ))}
                </div>
                {selectedStep ? <InlineDetails item={selectedStep} /> : null}
                <div className="mt-3 grid gap-2 md:grid-cols-3">
                  {['หลายรายการต้องแยกผล', 'ไม่ครบให้แก้ก่อนส่ง', 'แก้ไขแล้วต้องส่งอัปเดต'].map((note) => (
                    <div key={note} className="rounded-lg border border-dashed border-blue-300 bg-blue-50 px-3 py-2 text-center text-xs font-black text-blue-800">
                      {note}
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="grid gap-5 lg:grid-cols-[0.95fr_1.45fr]">
              <section className="rounded-2xl border border-blue-200 bg-white p-4">
                <SectionBadge number="4" title="สถานะการส่งข้อมูล" />
                <div className="grid gap-2">
                  {statusItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.id}>
                        <button
                          type="button"
                          onClick={() => setSelectedId(item.id)}
                          className={`grid w-full grid-cols-[44px_1fr] items-center gap-3 rounded-xl border p-2 text-left transition ${selectedId === item.id ? 'border-blue-600 bg-blue-50 ring-4 ring-blue-100' : 'border-slate-200 bg-white hover:border-blue-300'}`}
                        >
                          <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-white`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="font-black text-slate-950">{item.title}</p>
                            <p className="text-xs font-bold text-slate-500">{item.subtitle}</p>
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>
                {selectedStatus ? <InlineDetails item={selectedStatus} /> : null}
              </section>

              <section className="rounded-2xl border border-blue-200 bg-white p-4">
                <SectionBadge number="5" title="ประวัติการส่ง Log" />
                <button
                  type="button"
                  onClick={() => setSelectedId(logItem.id)}
                  className={`mb-3 flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${selectedId === logItem.id ? 'border-blue-600 bg-blue-50 ring-4 ring-blue-100' : 'border-slate-200 hover:border-blue-300'}`}
                >
                  <History className="h-8 w-8 text-blue-800" />
                  <div>
                    <p className="font-black">Log แยกจากข้อมูลหลัก</p>
                    <p className="text-sm font-bold text-slate-500">ใช้ดู payload, response และ error ย้อนหลัง</p>
                  </div>
                </button>
                {selectedId === logItem.id ? <InlineDetails item={logItem} /> : null}
                <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                  {['data_type', 'reference_id', 'sent_at', 'sender', 'status', 'attempt', 'payload', 'response', 'error'].map((field) => (
                    <button
                      type="button"
                      key={field}
                      onClick={() => setSelectedId(logItem.id)}
                      className="rounded-lg bg-slate-100 px-3 py-3 text-center text-xs font-black text-slate-700 hover:bg-blue-100 hover:text-blue-800"
                    >
                      {field}
                    </button>
                  ))}
                </div>
              </section>
            </div>

            <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
              <section className="rounded-2xl border border-blue-200 bg-white p-4">
                <SectionBadge number="6" title="ข้อกำหนดที่ต้องตกลงกับ API" />
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  {apiItems.map((item) => (
                    <div key={item.id}>
                      <IconButton item={item} selected={selectedId === item.id} onSelect={() => setSelectedId(item.id)} compact />
                    </div>
                  ))}
                </div>
                {selectedApi ? <InlineDetails item={selectedApi} /> : null}
              </section>

              <section className="rounded-2xl border border-blue-200 bg-white p-4">
                <SectionBadge number="7" title="แนวทางส่งซ้ำและตรวจสอบปัญหา" />
                <button
                  type="button"
                  onClick={() => setSelectedId(retryItem.id)}
                  className={`grid w-full gap-3 rounded-xl border p-3 transition ${selectedId === retryItem.id ? 'border-teal-500 bg-teal-50 ring-4 ring-teal-100' : 'border-slate-200 bg-white hover:border-teal-300'}`}
                >
                  <div className="grid grid-cols-5 gap-2">
                    {retrySteps.map((step, index) => {
                      const Icon = step.icon;
                      return (
                        <div key={step.label} className="rounded-lg bg-white p-2 text-center ring-1 ring-slate-200">
                          <div className={`mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg ${step.color} text-white`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <p className="text-[11px] font-black text-slate-950">{index + 1}. {step.label}</p>
                          <p className="mt-0.5 text-[10px] font-bold text-slate-500">{step.title}</p>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-left text-sm font-bold text-slate-600">ส่งซ้ำเฉพาะรายการที่ไม่สำเร็จหรือถูกแก้ไขหลังส่งล่าสุด</p>
                </button>
                {selectedId === retryItem.id ? <InlineDetails item={retryItem} /> : null}
              </section>
            </div>

            <section className="rounded-2xl border border-blue-200 bg-white p-4">
              <SectionBadge number="8" title="ตัวอย่าง Response จาก API" />
              <div className="grid gap-3 md:grid-cols-2">
                {responseItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setSelectedId(item.id)}
                      className={`rounded-xl border p-4 text-left transition ${selectedId === item.id ? 'border-blue-600 ring-4 ring-blue-100' : 'border-slate-200 hover:border-blue-300'}`}
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2 font-black text-slate-950">
                          <Icon className="h-6 w-6" />
                          {item.title}
                        </div>
                        <span className={`rounded-full bg-gradient-to-r ${item.color} px-3 py-1 text-xs font-black text-white`}>{item.subtitle}</span>
                      </div>
                      <pre className="overflow-x-auto rounded-lg bg-slate-950 p-4 text-xs font-bold leading-6 text-slate-100">
                        <code>{item.id === 'response-success' ? successJson : errorJson}</code>
                      </pre>
                    </button>
                  );
                })}
              </div>
              {selectedResponse ? <InlineDetails item={selectedResponse} /> : null}
            </section>

            <footer className="rounded-2xl bg-gradient-to-r from-blue-900 to-teal-700 p-5 text-white">
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                  <BadgeCheck className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-xl font-black">เป้าหมาย: ตรวจสอบย้อนหลังได้ ลดข้อมูลตกหล่น และรู้ว่าต้องส่งซ้ำรายการใด</p>
                  <p className="mt-1 text-sm font-bold text-blue-100">ใช้แผ่นนี้เป็นหน้าทำความเข้าใจ workflow ก่อนลงรายละเอียดในระบบจริง</p>
                </div>
              </div>
            </footer>
          </div>
        </section>
      </div>
    </main>
  );
}
