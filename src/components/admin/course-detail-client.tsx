"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  AlertTriangleIcon,
  ArchiveIcon,
  BookOpenIcon,
  CheckIcon,
  DownloadIcon,
  FileIcon,
  FileTextIcon,
  InboxIcon,
  Loader2Icon,
  MapPinIcon,
  PenIcon,
  PlayIcon,
  SendIcon,
  UploadIcon,
  UsersIcon,
  XIcon,
} from "lucide-react";
import { AreaChart } from "@/components/charts/area";
import { ProgressBar } from "@/components/progress-bar";
import type { AdminCourseDetailData } from "@/fake-db/dashboards";

// ─── helpers ─────────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  "#5a6fd6","#4caf8a","#e07b4f","#9a7fc4","#d4906a",
  "#5b9bd5","#e0a84f","#6db89f","#c4607a","#7aafe0",
];
function avatarBg(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}
function initials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

function Avatar({ name, size = "sm" }: { name: string; size?: "sm" | "md" }) {
  return (
    <span
      className={`m-avatar m-avatar--${size === "md" ? "32" : "26"}`}
      style={{ background: avatarBg(name) }}
    >
      {initials(name)}
    </span>
  );
}

function SubBadge({ status }: { status: "submitted" | "graded" | "late" }) {
  if (status === "graded")    return <span className="m-badge m-badge--success">Graded</span>;
  if (status === "late")      return <span className="m-badge m-badge--warning">Late</span>;
  return <span className="m-badge">Submitted</span>;
}

function LessonStateIcon({ kind, state }: { kind: string; state: string }) {
  const bg    = state === "released" ? "var(--m-success-bg)" : state === "drafting" ? "var(--m-accent-bg)" : "var(--m-surface-2)";
  const color = state === "released" ? "var(--m-success)"   : state === "drafting" ? "var(--m-accent)"    : "var(--m-text-3)";
  return (
    <span className="m-lesson-icon" style={{ background: bg, color }}>
      {kind === "video"   ? <PlayIcon size={11} />
      : kind === "reading" ? <BookOpenIcon size={11} />
      : kind === "quiz"    ? <FileTextIcon size={11} />
      : <UsersIcon size={11} />}
    </span>
  );
}

function LessonBadge({ state }: { state: string }) {
  if (state === "released") return <span className="m-badge m-badge--success">Released</span>;
  if (state === "drafting") return <span className="m-badge m-badge--accent">Drafting</span>;
  if (state === "upcoming") return <span className="m-badge m-badge--info">Up next</span>;
  return <span className="m-badge">Scheduled</span>;
}

// ─── compose sheet ────────────────────────────────────────────────────────────

function ComposeSheet({ title, to, onClose }: { title: string; to: string; onClose: () => void }) {
  const [subject, setSubject] = useState("");
  const [body, setBody]       = useState("");
  const [state, setState]     = useState<"idle" | "sending" | "sent">("idle");

  function send() {
    if (state !== "idle" || !body.trim()) return;
    setState("sending");
    setTimeout(() => {
      setState("sent");
      setTimeout(() => { onClose(); setState("idle"); setSubject(""); setBody(""); }, 1200);
    }, 1100);
  }

  return (
    <>
      <div className="m-sheet-overlay" onClick={state === "sending" ? undefined : onClose} />
      <div className="m-sheet" role="dialog" aria-modal="true" aria-label={title}>
        <div className="m-sheet__head">
          <span className="m-sheet__title">{title}</span>
          <button className="m-btn m-btn--ghost m-btn--icon m-btn--sm" onClick={onClose} disabled={state === "sending"}>
            <XIcon size={15} />
          </button>
        </div>
        <div className="m-sheet__body">
          <label className="m-field">
            <span className="m-field__label">To</span>
            <input className="m-field__input m-text-2" value={to} readOnly />
          </label>
          <label className="m-field">
            <span className="m-field__label">Subject</span>
            <input className="m-field__input" placeholder="e.g. Important update about this week's session"
              value={subject} onChange={(e) => setSubject(e.target.value)} />
          </label>
          <label className="m-field">
            <span className="m-field__label">Message</span>
            <textarea className="m-field__input m-textarea" rows={6} placeholder="Write your message here…"
              value={body} onChange={(e) => setBody(e.target.value)} />
          </label>
        </div>
        <div className="m-sheet__foot">
          <button className="m-btn m-btn--ghost" onClick={onClose} disabled={state === "sending"}>Cancel</button>
          <button className="m-btn m-btn--primary" onClick={send} disabled={state !== "idle" || !body.trim()}>
            {state === "idle"    && <><SendIcon size={13} /> Send message</>}
            {state === "sending" && <><Loader2Icon size={13} className="m-spin" /> Sending…</>}
            {state === "sent"    && <><CheckIcon size={13} /> Sent!</>}
          </button>
        </div>
      </div>
    </>
  );
}

// ─── edit course sheet ────────────────────────────────────────────────────────

function EditCourseSheet({
  course,
  onClose,
}: {
  course: { title: string; credits: number; modality: string; cap: number; status: string };
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    title:    course.title,
    credits:  String(course.credits),
    modality: course.modality,
    cap:      String(course.cap),
    status:   course.status,
  });
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");

  function set(k: string, v: string) { setForm((f) => ({ ...f, [k]: v })); }

  function save() {
    if (saveState !== "idle") return;
    setSaveState("saving");
    setTimeout(() => {
      setSaveState("saved");
      setTimeout(() => { onClose(); setSaveState("idle"); }, 1000);
    }, 1100);
  }

  return (
    <>
      <div className="m-sheet-overlay" onClick={saveState === "saving" ? undefined : onClose} />
      <div className="m-sheet" role="dialog" aria-modal="true" aria-label="Edit course">
        <div className="m-sheet__head">
          <span className="m-sheet__title">Edit course</span>
          <button className="m-btn m-btn--ghost m-btn--icon m-btn--sm" onClick={onClose} disabled={saveState === "saving"}>
            <XIcon size={15} />
          </button>
        </div>
        <form className="m-sheet__body" onSubmit={(e) => { e.preventDefault(); save(); }}>
          <label className="m-field">
            <span className="m-field__label">Course title</span>
            <input className="m-field__input" value={form.title} onChange={(e) => set("title", e.target.value)} required />
          </label>
          <div className="m-fields-2">
            <label className="m-field">
              <span className="m-field__label">Credits</span>
              <select className="m-field__input m-field__select" value={form.credits} onChange={(e) => set("credits", e.target.value)}>
                {["1","2","3","4"].map((v) => <option key={v} value={v}>{v} credit{v !== "1" ? "s" : ""}</option>)}
              </select>
            </label>
            <label className="m-field">
              <span className="m-field__label">Enrollment cap</span>
              <input className="m-field__input m-mono" type="number" min={1} max={500}
                value={form.cap} onChange={(e) => set("cap", e.target.value)} required />
            </label>
          </div>
          <div className="m-fields-2">
            <label className="m-field">
              <span className="m-field__label">Modality</span>
              <select className="m-field__input m-field__select" value={form.modality} onChange={(e) => set("modality", e.target.value)}>
                {["In-person","Hybrid","Online"].map((m) => <option key={m}>{m}</option>)}
              </select>
            </label>
            <label className="m-field">
              <span className="m-field__label">Status</span>
              <select className="m-field__input m-field__select" value={form.status} onChange={(e) => set("status", e.target.value)}>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="planning">Planning</option>
                <option value="archived">Archived</option>
              </select>
            </label>
          </div>
        </form>
        <div className="m-sheet__foot">
          <button className="m-btn m-btn--ghost" onClick={onClose} disabled={saveState === "saving"}>Cancel</button>
          <button className="m-btn m-btn--primary" onClick={save} disabled={saveState !== "idle" || !form.title.trim()}>
            {saveState === "idle"   && <><PenIcon size={13} /> Save changes</>}
            {saveState === "saving" && <><Loader2Icon size={13} className="m-spin" /> Saving…</>}
            {saveState === "saved"  && <><CheckIcon size={13} /> Saved!</>}
          </button>
        </div>
      </div>
    </>
  );
}

// ─── types ────────────────────────────────────────────────────────────────────

type Tab = "overview" | "modules" | "roster" | "grades" | "analytics" | "settings";

// ─── main component ───────────────────────────────────────────────────────────

export function CourseDetailClient({ data }: { data: NonNullable<AdminCourseDetailData> }) {
  const {
    course, instructor, teachingTeam,
    modules, moduleLessons, resources,
    recentSubmissions, roster,
    engagement,
  } = data;

  // ── tab state
  const [tab, setTab] = useState<Tab>("overview");

  // ── message class
  const [msgClassOpen, setMsgClassOpen] = useState(false);

  // ── edit course
  const [editOpen, setEditOpen] = useState(false);

  // ── modules: upload
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "done">("idle");
  const [uploadedRes, setUploadedRes] = useState<{ name: string; size: string; uploaded: string }[]>([]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadState("uploading");
    setTimeout(() => {
      const kb = file.size / 1024;
      const sizeLabel = kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${Math.round(kb)} KB`;
      setUploadedRes((prev) => [{ name: file.name, size: sizeLabel, uploaded: "just now" }, ...prev]);
      setUploadState("done");
      if (fileRef.current) fileRef.current.value = "";
      setTimeout(() => setUploadState("idle"), 1400);
    }, 1200);
  }

  // ── roster: message all
  const [msgAllOpen, setMsgAllOpen] = useState(false);

  // ── roster: export
  const [exportState, setExportState] = useState<"idle" | "exporting" | "done">("idle");
  function handleExport() {
    if (exportState !== "idle") return;
    setExportState("exporting");
    setTimeout(() => { setExportState("done"); setTimeout(() => setExportState("idle"), 2000); }, 1400);
  }

  // ── settings state
  const [settingsForm, setSettingsForm] = useState({
    title:       course.title,
    credits:     String(course.credits),
    modality:    course.modality,
    cap:         String(course.cap),
    waitlist:    false,
    autoClose:   true,
    gradeScale:  "letter",
    latePenalty: "10pct",
    emailNew:    true,
    emailGrades: false,
  });
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsSaved, setSettingsSaved]   = useState(false);
  function setSF(k: string, v: string | boolean) { setSettingsForm((f) => ({ ...f, [k]: v })); }
  function saveSettings() {
    setSettingsSaving(true);
    setTimeout(() => { setSettingsSaving(false); setSettingsSaved(true); setTimeout(() => setSettingsSaved(false), 2500); }, 1100);
  }

  // ── analytics range
  const [analyticsRange, setAnalyticsRange] = useState<"7d" | "12w" | "term">("12w");

  // ── computed grades
  const gradeData = roster.map((r) => r.grade).filter((g): g is number => g != null);
  const computedDist = Array.from({ length: 11 }, (_, i) => {
    const lo = 50 + i * 5;
    const hi = lo + 5;
    return gradeData.filter((g) => (i === 10 ? g >= lo : g >= lo && g < hi)).length;
  });
  const maxDist = Math.max(...computedDist, 1);
  const gradeMean   = gradeData.length ? gradeData.reduce((a, b) => a + b, 0) / gradeData.length : 0;
  const gradeSorted = [...gradeData].sort((a, b) => a - b);
  const gradeMedian = gradeSorted[Math.floor(gradeSorted.length / 2)] ?? 0;
  const gradeStdev  = gradeData.length
    ? Math.sqrt(gradeData.reduce((a, g) => a + (g - gradeMean) ** 2, 0) / gradeData.length)
    : 0;
  const gradeFailRate = gradeData.filter((g) => g < 60).length / (gradeData.length || 1) * 100;

  // ── computed analytics
  const atRiskCount = roster.filter((s) => (s.grade ?? 100) < 70 || s.attendance < 75).length;
  const completionPct = roster.length
    ? Math.round(roster.reduce((sum, s) => sum + s.submitted / Math.max(1, s.totalAssignments), 0) / roster.length * 100)
    : 0;
  const onTimePct = Math.round(85 - (gradeData.length % 12));
  const weeklySubmissions = Math.round(course.enrolled * 0.6 + (gradeData.length % 20));

  const analyticsData = analyticsRange === "7d"
    ? engagement.slice(-2).map((d, i) => ({ l: `D${i * 3 + 1}`, v: d.v }))
    : engagement;

  // ── tabs
  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "overview",  label: "Overview"  },
    { id: "modules",   label: "Modules",   count: modules.length },
    { id: "roster",    label: "Roster",    count: roster.length },
    { id: "grades",    label: "Grades"     },
    { id: "analytics", label: "Analytics"  },
    { id: "settings",  label: "Settings"   },
  ];

  const allResources = [...uploadedRes, ...resources];
  const firstModuleId = modules[0]?.id ?? "";
  const firstLessons  = moduleLessons[firstModuleId] ?? [];
  const totalLessons  = modules.reduce((s, m) => s + m.lessonCount, 0);

  return (
    <>
      {/* ── Page header ────────────────────────────────────────────────────── */}
      <div className="m-page__header m-page__header--flush">
        <div className="m-page__title">
          <span className="m-page__eyebrow">
            <Link href="/admin/courses" className="m-text-3">Courses</Link>
            {" · "}
            <span className="m-mono">{course.code}</span>
          </span>
          <h1 className="m-page__h m-page__h--flex">
            <span className="m-dept-stripe" style={{ background: course.deptColor }} />
            {course.title}
          </h1>
          <div className="m-page__meta">
            <span className="m-page__meta-item">
              <UsersIcon size={13} /> {instructor.name}
            </span>
            <span className="m-page__meta-item">
              <BookOpenIcon size={13} /> {course.credits} credits · level {course.level}
            </span>
            <span className="m-page__meta-item">
              <MapPinIcon size={13} /> {course.modality}
            </span>
            <span className="m-badge m-badge--success"><span className="m-badge__dot" />Active</span>
          </div>
        </div>
        <div className="m-page__actions">
          <button className="m-btn" onClick={() => setMsgClassOpen(true)}>
            <InboxIcon size={14} /> Message class
          </button>
          <button className="m-btn m-btn--primary" onClick={() => setEditOpen(true)}>
            <PenIcon size={14} /> Edit course
          </button>
        </div>
      </div>

      {/* ── Tabs ───────────────────────────────────────────────────────────── */}
      <div className="m-tabs">
        {tabs.map((t) => (
          <button key={t.id} className="m-tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}>
            {t.label}
            {t.count != null && <span className="m-tab__count">{t.count}</span>}
          </button>
        ))}
      </div>

      {/* ── Body ───────────────────────────────────────────────────────────── */}
      <div className="m-page__body">

        {/* ════ Overview ════════════════════════════════════════════════════ */}
        {tab === "overview" && (
          <div className="m-grid m-grid-2-1">
            <div className="m-stack">
              {/* Syllabus */}
              <div className="m-card">
                <div className="m-card__head">
                  <span className="m-card__title">Syllabus &amp; description</span>
                  <span className="m-card__sub">Fall 2025</span>
                </div>
                <div className="m-card__body">
                  <p className="m-course-desc">{course.description}</p>
                  <div className="m-badge-row">
                    <span className="m-badge">{course.weekCount} weeks</span>
                    <span className="m-badge">{course.meetingLabel}</span>
                    <span className="m-badge">{course.location.building} {course.location.room}</span>
                    {course.taCount > 0 && <span className="m-badge m-badge--accent">{course.taCount} TA{course.taCount > 1 ? "s" : ""}</span>}
                    <span className="m-badge">{course.credits} credits</span>
                  </div>
                </div>
              </div>

              {/* Modules summary */}
              <div className="m-card">
                <div className="m-card__head">
                  <span className="m-card__title">Modules</span>
                  <span className="m-card__sub">{modules.length} modules · {totalLessons} lessons</span>
                </div>
                {modules.map((m) => {
                  const ratio      = m.lessonCount > 0 ? m.released / m.lessonCount : 0;
                  const tone       = m.state === "complete" ? "success" : m.state === "active" ? "accent" : "";
                  const stateLabel = m.state === "complete" ? "Released" : m.state === "active" ? "In progress" : "Scheduled";
                  return (
                    <div key={m.id} className="m-list-row">
                      <span className="m-list-row__id m-mono">{m.id}</span>
                      <div className="m-list-row__body">
                        <div className="m-list-row__title">{m.title}</div>
                        <div className="m-list-row__meta">
                          <span>{m.lessonCount} lessons</span>
                          <span>{m.totalMin} min</span>
                          <span>{m.released}/{m.lessonCount} released</span>
                        </div>
                      </div>
                      <div className="m-progress-wrap--lg"><ProgressBar value={ratio} /></div>
                      <span className={`m-badge${tone ? ` m-badge--${tone}` : ""}`}>{stateLabel}</span>
                    </div>
                  );
                })}
              </div>

              {/* Recent submissions */}
              <div className="m-card">
                <div className="m-card__head">
                  <span className="m-card__title">Recent submissions</span>
                  <span className="m-card__sub">{recentSubmissions.length} this week · {course.ungraded} ungraded</span>
                  <div className="m-spacer" />
                  <button className="m-btn m-btn--ghost m-btn--sm">Open grading queue</button>
                </div>
                <table className="m-table">
                  <thead>
                    <tr>
                      <th>Student</th><th>Assignment</th><th>Submitted</th>
                      <th className="m-num">Attempt</th><th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentSubmissions.map((s) => (
                      <tr key={s.id}>
                        <td>
                          <div className="m-sub-cell">
                            <Avatar name={s.studentName} /><span>{s.studentName}</span>
                          </div>
                        </td>
                        <td className="m-text-2">{s.assignmentTitle}</td>
                        <td className="m-mono m-text-3">{s.submittedAt}</td>
                        <td className="m-num m-mono">{s.attempts}</td>
                        <td><SubBadge status={s.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right column */}
            <div className="m-stack">
              {/* At a glance */}
              <div className="m-card">
                <div className="m-card__head"><span className="m-card__title">At a glance</span></div>
                <div className="m-card__body">
                  <div className="m-stack m-gap-14">
                    <div className="m-stat-row m-stat-row--baseline">
                      <span className="m-text-3">Enrollment</span>
                      <span className="m-mono">
                        <b className="m-stat-num">{course.enrolled}</b>
                        <span className="m-stat-denom"> / {course.cap}</span>
                      </span>
                    </div>
                    <ProgressBar value={course.enrolled / course.cap} />
                    <hr className="m-rule" />
                    <div className="m-stat-row">
                      <span className="m-text-3">Avg. grade</span>
                      <b className="m-mono">{course.avgGrade != null ? course.avgGrade.toFixed(1) : "—"}</b>
                    </div>
                    <div className="m-stat-row">
                      <span className="m-text-3">Median completion</span>
                      <b className="m-mono">{completionPct}%</b>
                    </div>
                    <div className="m-stat-row">
                      <span className="m-text-3">Ungraded</span>
                      <b className="m-mono" style={{ color: "var(--m-warning)" }}>{course.ungraded}</b>
                    </div>
                    <div className="m-stat-row">
                      <span className="m-text-3">At-risk students</span>
                      <b className="m-mono" style={{ color: atRiskCount > 3 ? "var(--m-danger)" : "var(--m-text)" }}>{atRiskCount}</b>
                    </div>
                  </div>
                </div>
              </div>

              {/* Engagement */}
              <div className="m-card">
                <div className="m-card__head">
                  <span className="m-card__title">Engagement trend</span>
                  <span className="m-card__sub">12 weeks</span>
                </div>
                <div className="m-card__body">
                  <AreaChart data={engagement} height={140} color="var(--m-accent)" gradientId="ov-eng" />
                  <div className="m-mono m-engage-strip">
                    <span className="m-text-3">Median attendance</span>
                    <b>{Math.round(engagement.reduce((s, e) => s + e.v, 0) / engagement.length)}%</b>
                  </div>
                </div>
              </div>

              {/* Teaching team */}
              <div className="m-card">
                <div className="m-card__head"><span className="m-card__title">Teaching team</span></div>
                <div className="m-card__body">
                  <div className="m-stack m-gap-12">
                    {teachingTeam.map((p) => (
                      <div key={p.id} className="m-person-row">
                        <Avatar name={p.name} size="md" />
                        <div className="m-person-row__info">
                          <div className="m-person-row__name">{p.name}</div>
                          <div className="m-person-row__role">{p.role}</div>
                        </div>
                        <button className="m-btn m-btn--ghost m-btn--icon m-btn--sm" onClick={() => setMsgClassOpen(true)}>
                          <InboxIcon size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════ Modules ══════════════════════════════════════════════════════ */}
        {tab === "modules" && (
          <div className="m-grid m-grid-2-1">
            <div className="m-card">
              <div className="m-card__head">
                <span className="m-card__title">{modules[0]?.title ?? "Module 1"}</span>
                <span className="m-card__sub">{firstLessons.length} lessons</span>
              </div>
              {firstLessons.map((l) => (
                <div key={l.id} className="m-list-row m-list-row--sm">
                  <LessonStateIcon kind={l.kind} state={l.state} />
                  <div className="m-list-row__body">
                    <div className="m-list-row__title--sm">{l.title}</div>
                    <div className="m-list-row__meta">{l.id} · {l.kind} · {l.duration}</div>
                  </div>
                  <LessonBadge state={l.state} />
                </div>
              ))}
            </div>

            <div className="m-card">
              <div className="m-card__head">
                <span className="m-card__title">Resources</span>
                <span className="m-card__sub">files &amp; attachments</span>
              </div>
              <div className="m-card__body">
                <div className="m-stack m-gap-8">
                  {allResources.map((r, i) => (
                    <div key={`${r.name}-${i}`} className="m-resource-item">
                      <FileIcon size={14} className="m-text-3 m-shrink-0" />
                      <div className="m-resource-item__body">
                        <div className="m-resource-item__name">{r.name}</div>
                        <div className="m-resource-item__meta m-mono">{r.size} · uploaded {r.uploaded}</div>
                      </div>
                      <DownloadIcon size={14} className="m-text-3 m-shrink-0" />
                    </div>
                  ))}

                  <input ref={fileRef} type="file" style={{ display: "none" }} onChange={handleFileChange} />
                  <button
                    className="m-btn m-mt-4"
                    disabled={uploadState === "uploading"}
                    onClick={() => fileRef.current?.click()}
                  >
                    {uploadState === "idle"      && <><UploadIcon size={14} /> Upload resource</>}
                    {uploadState === "uploading" && <><Loader2Icon size={14} className="m-spin" /> Uploading…</>}
                    {uploadState === "done"      && <><CheckIcon size={14} /> Uploaded!</>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════ Roster ════════════════════════════════════════════════════════ */}
        {tab === "roster" && (
          <div className="m-card">
            <div className="m-card__head">
              <span className="m-card__title">Roster · {roster.length} of {course.cap} enrolled</span>
              <div className="m-spacer" />
              <button className="m-btn m-btn--sm" onClick={() => setMsgAllOpen(true)}>
                <InboxIcon size={12} /> Message all
              </button>
              <button
                className="m-btn m-btn--sm"
                disabled={exportState === "exporting"}
                onClick={handleExport}
              >
                {exportState === "idle"      && <><DownloadIcon size={12} /> Export CSV</>}
                {exportState === "exporting" && <><Loader2Icon size={12} className="m-spin" /> Exporting…</>}
                {exportState === "done"      && <><CheckIcon size={12} /> Downloaded!</>}
              </button>
            </div>
            <table className="m-table">
              <thead>
                <tr>
                  <th>Student</th><th>ID</th><th>Standing</th>
                  <th className="m-num">Grade</th><th className="m-num">Attendance</th>
                  <th>Submissions</th><th>Last active</th>
                </tr>
              </thead>
              <tbody>
                {roster.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div className="m-sub-cell">
                        <Avatar name={s.name} /><span>{s.name}</span>
                      </div>
                    </td>
                    <td className="m-mono">{s.studentNumber}</td>
                    <td className="m-text-2">{s.standing}</td>
                    <td className="m-num m-mono" style={{ color: (s.grade ?? 100) < 70 ? "var(--m-danger)" : "inherit" }}>
                      {s.grade != null ? s.grade.toFixed(1) : "—"}
                    </td>
                    <td className="m-num">
                      <div className="m-attend-cell">
                        <span className="m-mono" style={{ color: s.attendance < 75 ? "var(--m-warning)" : "inherit" }}>
                          {s.attendance}%
                        </span>
                        <div className="m-progress-wrap--sm"><ProgressBar value={s.attendance / 100} /></div>
                      </div>
                    </td>
                    <td className="m-mono m-text-3">{s.submitted}/{s.totalAssignments}</td>
                    <td className="m-mono m-text-3">{s.lastActive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ════ Grades ════════════════════════════════════════════════════════ */}
        {tab === "grades" && (
          <div className="m-card">
            <div className="m-card__head">
              <span className="m-card__title">Grade distribution</span>
              <span className="m-card__sub">{gradeData.length} students graded</span>
            </div>
            <div className="m-card__body">
              <div
                className="m-grade-hist"
                style={{ gridTemplateColumns: `repeat(${computedDist.length}, 1fr)` }}
              >
                {computedDist.map((v, i) => {
                  const barColor = i >= 6 ? "var(--m-accent)" : i >= 3 ? "var(--m-warning)" : "var(--m-danger)";
                  return (
                    <div key={i} className="m-grade-hist__col">
                      <span className="m-grade-hist__count">{v || ""}</span>
                      <div
                        className="m-grade-hist__bar"
                        style={{ height: Math.max(v > 0 ? 3 : 0, Math.round((v / maxDist) * 140)), background: barColor }}
                      />
                      <span className="m-grade-hist__label">{50 + i * 5}</span>
                    </div>
                  );
                })}
              </div>
              <hr className="m-rule m-rule--spaced" />
              <div className="m-grid m-grid-4">
                <div>
                  <div className="m-kpi-label">MEAN</div>
                  <b className="m-kpi-value">{gradeMean.toFixed(1)}</b>
                </div>
                <div>
                  <div className="m-kpi-label">MEDIAN</div>
                  <b className="m-kpi-value">{gradeMedian}</b>
                </div>
                <div>
                  <div className="m-kpi-label">STDEV</div>
                  <b className="m-kpi-value">{gradeStdev.toFixed(1)}</b>
                </div>
                <div>
                  <div className="m-kpi-label">FAIL RATE</div>
                  <b className="m-kpi-value m-kpi-value--danger">{gradeFailRate.toFixed(1)}%</b>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════ Analytics ══════════════════════════════════════════════════════ */}
        {tab === "analytics" && (
          <div className="m-stack">
            {/* KPI row */}
            <div className="m-grid m-grid-4">
              {[
                { label: "Submissions / week", value: weeklySubmissions, unit: "", delta: "+12 wk/wk", up: true },
                { label: "Avg completion",     value: completionPct,     unit: "%",  delta: "across all modules", up: true },
                { label: "On-time rate",        value: onTimePct,         unit: "%",  delta: `${100 - onTimePct}% submitted late`, up: onTimePct > 85 },
                { label: "At-risk students",    value: atRiskCount,       unit: "",   delta: "grade < 70 or attendance < 75%", up: atRiskCount === 0 },
              ].map((s) => (
                <div key={s.label} className="m-card">
                  <div className="m-card__body">
                    <div className="m-kpi-card__label">{s.label}</div>
                    <div className="m-kpi-card__value">
                      {s.value}<span className="m-kpi-card__unit">{s.unit}</span>
                    </div>
                    <div className={`m-kpi-card__delta m-kpi-card__delta--${s.up ? "up" : "down"}`}>
                      {s.delta}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts row */}
            <div className="m-grid m-grid-2-1">
              <div className="m-card">
                <div className="m-card__head">
                  <span className="m-card__title">Weekly engagement</span>
                  <span className="m-card__sub">student activity score</span>
                  <div className="m-spacer" />
                  <div className="m-seg">
                    {(["7d","12w","term"] as const).map((r) => (
                      <button key={r} aria-pressed={analyticsRange === r} onClick={() => setAnalyticsRange(r)}>
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="m-card__body">
                  <AreaChart data={analyticsData} height={180} color="var(--m-accent)" gradientId="an-eng" />
                  <div className="m-chart-footer">
                    {[
                      { l: "PEAK",   v: `W${analyticsData.reduce((b, d, i, a) => d.v > a[b].v ? i : b, 0) + 1}` },
                      { l: "AVG",    v: `${Math.round(analyticsData.reduce((s, d) => s + d.v, 0) / (analyticsData.length || 1))}%` },
                      { l: "TREND",  v: analyticsData.length > 1 && analyticsData[analyticsData.length - 1].v > analyticsData[0].v ? "↑ Rising" : "→ Stable" },
                    ].map((s) => (
                      <div key={s.l}>
                        <div className="m-chart-stat__label">{s.l}</div>
                        <b className="m-mono">{s.v}</b>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="m-card">
                <div className="m-card__head">
                  <span className="m-card__title">Module completion</span>
                  <span className="m-card__sub">lessons released</span>
                </div>
                <div className="m-card__body">
                  <div className="m-stack m-gap-14">
                    {modules.map((m) => {
                      const pct = m.lessonCount > 0 ? m.released / m.lessonCount : 0;
                      return (
                        <div key={m.id}>
                          <div className="m-mod-comp__head">
                            <span className="m-mod-comp__title">{m.title}</span>
                            <span className="m-mod-comp__count m-mono">{m.released}/{m.lessonCount}</span>
                          </div>
                          <ProgressBar value={pct} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Submission breakdown */}
            <div className="m-card">
              <div className="m-card__head">
                <span className="m-card__title">Student performance segments</span>
                <span className="m-card__sub">based on grade and attendance</span>
              </div>
              <div className="m-card__body">
                {(() => {
                  const segments = [
                    { label: "Excellent",       desc: "Grade ≥ 90 and attendance ≥ 90%",       color: "var(--m-success)", count: roster.filter(s => (s.grade ?? 0) >= 90 && s.attendance >= 90).length },
                    { label: "On track",        desc: "Grade 70–89 and attendance ≥ 75%",       color: "var(--m-accent)",  count: roster.filter(s => (s.grade ?? 0) >= 70 && (s.grade ?? 0) < 90 && s.attendance >= 75).length },
                    { label: "Needs attention", desc: "Grade 60–69 or attendance 60–74%",        color: "var(--m-warning)", count: roster.filter(s => ((s.grade ?? 100) >= 60 && (s.grade ?? 100) < 70) || (s.attendance >= 60 && s.attendance < 75)).length },
                    { label: "At risk",         desc: "Grade < 60 or attendance < 60%",          color: "var(--m-danger)",  count: roster.filter(s => (s.grade ?? 100) < 60 || s.attendance < 60).length },
                  ];
                  const total = Math.max(1, segments.reduce((s, seg) => s + seg.count, 0));
                  return (
                    <div className="m-stack m-gap-10">
                      {segments.map((seg) => (
                        <div key={seg.label} className="m-segment-row">
                          <div className="m-segment-dot" style={{ background: seg.color }} />
                          <div className="m-segment-body">
                            <div className="m-segment-head">
                              <span className="m-segment-label">{seg.label}</span>
                              <span className="m-segment-count m-mono">{seg.count} student{seg.count !== 1 ? "s" : ""}</span>
                            </div>
                            <div className="m-segment-track">
                              <div className="m-segment-fill" style={{ width: `${(seg.count / total) * 100}%`, background: seg.color }} />
                            </div>
                          </div>
                          <span className="m-segment-pct m-mono">
                            {Math.round(seg.count / total * 100)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* ════ Settings ════════════════════════════════════════════════════════ */}
        {tab === "settings" && (
          <div className="m-grid m-grid-2-1 m-grid--top">
            <div className="m-stack">
              {/* General */}
              <div className="m-card">
                <div className="m-settings-section">
                  <p className="m-settings-section__title">General</p>
                  <div className="m-settings-row">
                    <span className="m-settings-row__label">Course title</span>
                    <input
                      className="m-field__input m-field--xl"
                      value={settingsForm.title}
                      onChange={(e) => setSF("title", e.target.value)}
                    />
                  </div>
                  <div className="m-settings-row">
                    <span className="m-settings-row__label">Credits</span>
                    <select className="m-field__input m-field__select m-field--md"
                      value={settingsForm.credits} onChange={(e) => setSF("credits", e.target.value)}>
                      {["1","2","3","4"].map((v) => <option key={v} value={v}>{v} credit{v !== "1" ? "s" : ""}</option>)}
                    </select>
                  </div>
                  <div className="m-settings-row">
                    <span className="m-settings-row__label">Modality</span>
                    <select className="m-field__input m-field__select m-field--md"
                      value={settingsForm.modality} onChange={(e) => setSF("modality", e.target.value)}>
                      {["In-person","Hybrid","Online"].map((m) => <option key={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className="m-settings-row">
                    <span className="m-settings-row__label">Location</span>
                    <span className="m-settings-row__value m-mono">{course.location.building} {course.location.room}</span>
                  </div>
                  <div className="m-settings-row">
                    <span className="m-settings-row__label">Schedule</span>
                    <span className="m-settings-row__value m-mono">{course.meetingLabel}</span>
                  </div>
                </div>
              </div>

              {/* Enrollment */}
              <div className="m-card">
                <div className="m-settings-section">
                  <p className="m-settings-section__title">Enrollment</p>
                  <div className="m-settings-row">
                    <span className="m-settings-row__label">Enrollment cap</span>
                    <input className="m-field__input m-mono m-field--sm" type="number" min={1} max={500}
                      value={settingsForm.cap} onChange={(e) => setSF("cap", e.target.value)} />
                  </div>
                  <div className="m-settings-row">
                    <span className="m-settings-row__label">Enable waitlist</span>
                    <button
                      className="m-toggle"
                      aria-pressed={settingsForm.waitlist}
                      onClick={() => setSF("waitlist", !settingsForm.waitlist)}
                    >
                      <span className="m-toggle__track"><span className="m-toggle__thumb" /></span>
                      {settingsForm.waitlist ? "On" : "Off"}
                    </button>
                  </div>
                  <div className="m-settings-row">
                    <span className="m-settings-row__label">Auto-close when full</span>
                    <button
                      className="m-toggle"
                      aria-pressed={settingsForm.autoClose}
                      onClick={() => setSF("autoClose", !settingsForm.autoClose)}
                    >
                      <span className="m-toggle__track"><span className="m-toggle__thumb" /></span>
                      {settingsForm.autoClose ? "On" : "Off"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Grading */}
              <div className="m-card">
                <div className="m-settings-section">
                  <p className="m-settings-section__title">Grading policy</p>
                  <div className="m-settings-row">
                    <span className="m-settings-row__label">Grade scale</span>
                    <select className="m-field__input m-field__select m-field--lg"
                      value={settingsForm.gradeScale} onChange={(e) => setSF("gradeScale", e.target.value)}>
                      <option value="letter">Letter grades (A–F)</option>
                      <option value="percent">Percentage (0–100)</option>
                      <option value="passfail">Pass / Fail</option>
                    </select>
                  </div>
                  <div className="m-settings-row">
                    <span className="m-settings-row__label">Late submission penalty</span>
                    <select className="m-field__input m-field__select m-field--lg"
                      value={settingsForm.latePenalty} onChange={(e) => setSF("latePenalty", e.target.value)}>
                      <option value="none">No penalty</option>
                      <option value="10pct">10% per day</option>
                      <option value="20pct">20% per day</option>
                      <option value="zero">Zero credit</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="m-flex-end">
                <button className="m-btn m-btn--primary" onClick={saveSettings} disabled={settingsSaving}>
                  {settingsSaving  && <><Loader2Icon size={13} className="m-spin" /> Saving…</>}
                  {settingsSaved   && <><CheckIcon size={13} /> Saved!</>}
                  {!settingsSaving && !settingsSaved && <><CheckIcon size={13} /> Save changes</>}
                </button>
              </div>
            </div>

            {/* Right column */}
            <div className="m-stack">
              {/* Notifications */}
              <div className="m-card">
                <div className="m-settings-section">
                  <p className="m-settings-section__title">Notifications</p>
                  <div className="m-settings-row">
                    <span className="m-settings-row__label">Email on new content</span>
                    <button className="m-toggle" aria-pressed={settingsForm.emailNew}
                      onClick={() => setSF("emailNew", !settingsForm.emailNew)}>
                      <span className="m-toggle__track"><span className="m-toggle__thumb" /></span>
                      {settingsForm.emailNew ? "On" : "Off"}
                    </button>
                  </div>
                  <div className="m-settings-row">
                    <span className="m-settings-row__label">Email on grades posted</span>
                    <button className="m-toggle" aria-pressed={settingsForm.emailGrades}
                      onClick={() => setSF("emailGrades", !settingsForm.emailGrades)}>
                      <span className="m-toggle__track"><span className="m-toggle__thumb" /></span>
                      {settingsForm.emailGrades ? "On" : "Off"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Course info */}
              <div className="m-card">
                <div className="m-settings-section">
                  <p className="m-settings-section__title">Course info</p>
                  {[
                    { label: "Course code",  value: course.code },
                    { label: "Department",   value: course.deptCode },
                    { label: "Level",        value: `${course.level}-level` },
                    { label: "Instructor",   value: instructor.name },
                    { label: "Contact",      value: instructor.email },
                  ].map((row) => (
                    <div key={row.label} className="m-settings-row">
                      <span className="m-settings-row__label">{row.label}</span>
                      <span className="m-settings-row__value m-mono m-td-dim">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Danger zone */}
              <div className="m-card m-card--danger">
                <div className="m-settings-section">
                  <p className="m-settings-section__title m-settings-section__title--danger">Danger zone</p>
                  <div className="m-danger-zone">
                    <AlertTriangleIcon size={16} className="m-danger-zone__icon" />
                    <div className="m-danger-zone__body">
                      <div className="m-danger-zone__title">Archive this course</div>
                      <div className="m-danger-zone__desc">
                        Removes the course from the active catalog. Students lose access to new content. Grades and history are preserved.
                      </div>
                      <button className="m-btn m-btn--ghost m-btn--danger">
                        <ArchiveIcon size={13} /> Archive course
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Sheets ─────────────────────────────────────────────────────────── */}
      {msgClassOpen && (
        <ComposeSheet
          title="Message class"
          to={`All enrolled students (${course.enrolled})`}
          onClose={() => setMsgClassOpen(false)}
        />
      )}

      {editOpen && (
        <EditCourseSheet course={course} onClose={() => setEditOpen(false)} />
      )}

      {msgAllOpen && (
        <ComposeSheet
          title="Message all students"
          to={`All roster students (${roster.length})`}
          onClose={() => setMsgAllOpen(false)}
        />
      )}
    </>
  );
}
