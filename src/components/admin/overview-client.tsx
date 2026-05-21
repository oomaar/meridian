"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowUpRightIcon, ChevronDownIcon, ChevronUpIcon,
  DownloadIcon, EllipsisIcon, XIcon,
  CheckIcon, Loader2Icon,
  CalendarIcon, ArrowLeftRightIcon, ImageIcon,
  BellIcon, TrendingUpIcon,
} from "lucide-react";
import { ProgressBar } from "@/components/progress-bar";
import { Spark } from "@/components/charts/spark";
import { AreaChart } from "@/components/charts/area";
import { HBarChart } from "@/components/charts/hbar";
import type { AdminOverviewData, ThroughputByWindow } from "@/fake-db/dashboards";
import type { Semester } from "@/fake-db/types";
import { NewCourseButton } from "./new-course-button";
import { PostAnnouncementButton } from "./post-announcement-button";

// ─── Static data ──────────────────────────────────────────────────────────────

const DEPT_COLORS: Record<string, string> = {
  CS: "var(--m-info)", LIT: "var(--m-accent)", BIO: "var(--m-success)",
  ECON: "var(--m-danger)", ARCH: "var(--m-warning)", MATH: "#9a7fc4",
  PHIL: "var(--m-info)", ART: "var(--m-warning)", CHEM: "var(--m-success)",
  POLI: "var(--m-danger)",
};

const COURSES_ATTENTION = [
  { code: "CHEM-312", title: "Organic Chemistry II", inst: "Lindqvist", ungraded: 14, lag: "72h", sla: true  },
  { code: "ECON-405", title: "Behavioral Economics",  inst: "Okafor",   ungraded: 18, lag: "54h", sla: true  },
  { code: "BIO-211",  title: "Molecular Genetics",    inst: "Wójcik",   ungraded: 7,  lag: "41h", sla: false },
  { code: "CS-240",   title: "Distributed Systems",   inst: "Ahmadi",   ungraded: 12, lag: "36h", sla: false },
] as const;

const ANNOUNCEMENTS = [
  { id: "A-104", channel: "All faculty",     title: "Spring 2026 catalog window opens Nov 17",          time: "Yesterday, 4:12 PM", author: "Office of the Provost"    },
  { id: "A-103", channel: "CS · Faculty",    title: "Two new TA allocations approved for CS-240",        time: "2 days ago",         author: "Linnea Ahmadi"            },
  { id: "A-102", channel: "Students · UG",   title: "Reading Week updated — Nov 24–28",                  time: "3 days ago",         author: "Office of the Registrar"  },
  { id: "A-101", channel: "ECON · Students", title: "Behavioral Econ symposium · Dec 3, Halsey Hall",    time: "4 days ago",         author: "Adaeze Okafor"            },
] as const;

const ALL_TASKS = [
  { id: "T-2841", title: "Approve late-add petitions",           due: "Today",      count: 7,  priority: "high",   owner: "Registrar",    dept: "Office of the Registrar" },
  { id: "T-2839", title: "Review FA26 mid-semester evaluations", due: "Tomorrow",   count: 23, priority: "normal", owner: "Dean's office", dept: "Academic Affairs"        },
  { id: "T-2836", title: "Resolve roster conflicts in CHEM-312", due: "Fri May 22", count: 3,  priority: "normal", owner: "Registrar",     dept: "Office of the Registrar" },
  { id: "T-2828", title: "Publish SU26 course catalog",          due: "May 28",     count: 0,  priority: "high",   owner: "Curriculum",    dept: "Academic Programs"       },
  { id: "T-2820", title: "Audit FERPA disclosure requests",      due: "Jun 02",     count: 4,  priority: "low",    owner: "Compliance",    dept: "Legal & Compliance"      },
  { id: "T-2815", title: "Confirm commencement venue bookings",  due: "Jun 10",     count: 0,  priority: "normal", owner: "Events",        dept: "Student Affairs"         },
  { id: "T-2811", title: "Close out SP25 financial aid disbursements", due: "Jun 15", count: 12, priority: "high", owner: "Financial Aid",  dept: "Bursar"                  },
  { id: "T-2804", title: "Update academic calendar for AY27",    due: "Jul 01",     count: 0,  priority: "low",    owner: "Provost",       dept: "Academic Affairs"        },
] as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function semesterMeta(sem: Semester) {
  const NOW_MS = new Date("2026-05-17T10:00:00Z").getTime();
  const start  = new Date(sem.startDate).getTime();
  const end    = new Date(sem.endDate + "T23:59:59Z").getTime();
  const elapsed    = Math.max(0, NOW_MS - start);
  const total      = end - start;
  const progress   = Math.min(1, elapsed / total);
  const totalWeeks = Math.ceil(total / (7 * 86_400_000));
  const weekNumber = Math.min(totalWeeks, Math.ceil(elapsed / (7 * 86_400_000)));
  return { progress, weekNumber, totalWeeks };
}

function greeting() {
  const h = new Date("2026-05-17T10:00:00Z").getUTCHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

function relTime(ts: string): string {
  const NOW_MS = new Date("2026-05-17T10:00:00Z").getTime();
  const mins = Math.floor((NOW_MS - new Date(ts).getTime()) / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ─── Export button ────────────────────────────────────────────────────────────

function ExportButton() {
  const [state, setState] = useState<"idle" | "prep" | "ready">("idle");

  function handleExport() {
    if (state !== "idle") return;
    setState("prep");
    setTimeout(() => {
      window.print();
      setState("ready");
      setTimeout(() => setState("idle"), 2000);
    }, 700);
  }

  return (
    <button className="m-btn" onClick={handleExport} disabled={state === "prep"}>
      {state === "idle"  && <><DownloadIcon size={14} /> Export</>}
      {state === "prep"  && <><Loader2Icon size={14} className="m-spin" /> Preparing…</>}
      {state === "ready" && <><CheckIcon size={14} /> Ready</>}
    </button>
  );
}

// ─── Throughput card ──────────────────────────────────────────────────────────

type TpWindow = "7d" | "12w" | "term";

const CARD_MENU_ITEMS = [
  { icon: DownloadIcon,       label: "Download CSV",           href: "#" },
  { icon: CalendarIcon,       label: "Schedule weekly report", href: "#" },
  { icon: ArrowLeftRightIcon, label: "Compare with last term", href: "#" },
  { icon: TrendingUpIcon,     label: "View trend analysis",    href: "#" },
  { icon: ImageIcon,          label: "Export as PNG",          href: "#" },
  { icon: BellIcon,           label: "Notification rules",     href: "#" },
];

const WIN_LABEL: Record<TpWindow, string> = {
  "7d":   "last 7 days",
  "12w":  "last 12 weeks",
  "term": "current term",
};

function ThroughputCard({
  windows,
}: {
  windows: ThroughputByWindow;
  submissionsLast7d: number;
}) {
  const [win,        setWin]        = useState<TpWindow>("12w");
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const data   = windows[win];
  const peakPt = data.reduce((b, p) => (p.v > b.v ? p : b), data[0]);
  const sorted = [...data].map((p) => p.v).sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];
  const total  = data.reduce((s, p) => s + p.v, 0);

  useEffect(() => {
    if (!menuOpen) return;
    function onDown(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [menuOpen]);

  return (
    <>
      <div className="m-card">
        <div className="m-card__head">
          <h3 className="m-card__title">Submission throughput</h3>
          <span className="m-card__sub">{WIN_LABEL[win]} · all departments</span>
          <div className="m-row" style={{ gap: 6 }}>
            <div className="m-seg">
              {(["7d", "12w", "term"] as TpWindow[]).map((w) => (
                <button key={w} aria-pressed={win === w} onClick={() => setWin(w)}>
                  {w === "term" ? "Term" : w}
                </button>
              ))}
            </div>
            <div ref={menuRef} style={{ position: "relative" }}>
              <button
                className="m-btn m-btn--ghost m-btn--icon m-btn--sm"
                onClick={() => setMenuOpen((p) => !p)}
                aria-label="More options"
              >
                <EllipsisIcon size={14} />
              </button>
              {menuOpen && (
                <div className="m-card-menu">
                  {CARD_MENU_ITEMS.map(({ icon: Icon, label, href }) => (
                    <a key={label} href={href} className="m-card-menu__item" onClick={() => setMenuOpen(false)}>
                      <Icon size={13} className="m-card-menu__icon" />
                      {label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="m-card__body">
          <AreaChart data={data} height={200} />
          <div className="m-chart-foot">
            <div className="m-chart-foot__stat">
              <div className="m-chart-foot__label">Peak {win === "7d" ? "day" : "week"}</div>
              <div className="m-chart-foot__val">{peakPt.l.toUpperCase()} · {peakPt.v}</div>
            </div>
            <div className="m-chart-foot__stat">
              <div className="m-chart-foot__label">Median</div>
              <div className="m-chart-foot__val">{median}</div>
            </div>
            <div className="m-chart-foot__stat">
              <div className="m-chart-foot__label">Late submissions</div>
              <div className="m-chart-foot__val">4.2%</div>
            </div>
            <div className="m-spacer" />
            <button className="m-btn m-btn--ghost m-btn--sm" onClick={() => setReportOpen(true)}>
              Open report <ArrowUpRightIcon size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Report modal */}
      {reportOpen && (
        <>
          <div className="m-modal-overlay" onClick={() => setReportOpen(false)} />
          <div className="m-modal" role="dialog" aria-modal="true" aria-label="Submission throughput report">
            <div className="m-modal__head">
              <div>
                <div className="m-modal__title">Submission throughput report</div>
                <div className="m-modal__sub">{WIN_LABEL[win]} · Spring 2026 · all departments</div>
              </div>
              <button className="m-btn m-btn--ghost m-btn--icon m-btn--sm" onClick={() => setReportOpen(false)}>
                <XIcon size={15} />
              </button>
            </div>

            <div className="m-modal__body">
              {/* expanded chart */}
              <AreaChart data={data} height={240} />

              {/* key stats */}
              <div className="m-modal-stats">
                <div className="m-modal-stat">
                  <div className="m-modal-stat__label">Total submissions</div>
                  <div className="m-modal-stat__value">{total.toLocaleString()}</div>
                </div>
                <div className="m-modal-stat">
                  <div className="m-modal-stat__label">Peak {win === "7d" ? "day" : "week"}</div>
                  <div className="m-modal-stat__value">{peakPt.l.toUpperCase()} · {peakPt.v}</div>
                </div>
                <div className="m-modal-stat">
                  <div className="m-modal-stat__label">Median / period</div>
                  <div className="m-modal-stat__value">{median}</div>
                </div>
                <div className="m-modal-stat">
                  <div className="m-modal-stat__label">Late rate</div>
                  <div className="m-modal-stat__value" style={{ color: "var(--m-success)" }}>4.2%</div>
                </div>
                <div className="m-modal-stat">
                  <div className="m-modal-stat__label">Target late rate</div>
                  <div className="m-modal-stat__value">6.0%</div>
                </div>
                <div className="m-modal-stat">
                  <div className="m-modal-stat__label">YoY change</div>
                  <div className="m-modal-stat__value" style={{ color: "var(--m-success)" }}>+11.4%</div>
                </div>
              </div>

              <hr className="m-rule" />

              {/* breakdown */}
              <div style={{ marginBottom: 6 }}>
                <div style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--m-text-3)", marginBottom: 14 }}>
                  Breakdown by discipline
                </div>
                {[
                  { label: "STEM",             pct: 68, color: "var(--m-info)"    },
                  { label: "Humanities",        pct: 19, color: "var(--m-accent)"  },
                  { label: "Social Sciences",   pct: 13, color: "var(--m-warning)" },
                ].map((row) => (
                  <div key={row.label} className="m-modal-breakdown-row">
                    <div className="m-modal-breakdown-row__label">{row.label}</div>
                    <div className="m-modal-breakdown-row__track">
                      <div className="m-modal-breakdown-row__fill" style={{ width: `${row.pct}%`, background: row.color }} />
                    </div>
                    <div className="m-modal-breakdown-row__pct">{row.pct}%</div>
                  </div>
                ))}
              </div>

              <hr className="m-rule" />

              {/* insights */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--m-text-3)", marginBottom: 12 }}>
                  Insights
                </div>
                <div className="m-modal-insights">
                  {[
                    "Submissions peak in weeks 8–10, aligning with midterm exam windows across all departments.",
                    "Late submission rate of 4.2% is below the institutional target of 6.0% — on track.",
                    "ECON-405 accounts for 18% of ungraded backlog and is currently in SLA breach.",
                    "Online sections show a 22% higher submission rate than in-person equivalents this term.",
                  ].map((text, i) => (
                    <div key={i} className="m-modal-insight">
                      <div className="m-modal-insight__dot" />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="m-modal__foot">
              <span style={{ fontSize: 12, color: "var(--m-text-3)" }}>
                Based on 847 active assignments across 1,184 sections
              </span>
              <div className="m-spacer" />
              <button className="m-btn m-btn--ghost m-btn--sm">
                <DownloadIcon size={13} /> Download CSV
              </button>
              <button className="m-btn m-btn--primary m-btn--sm" onClick={() => setReportOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

// ─── Tasks card + drawer ──────────────────────────────────────────────────────

function TasksCard() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [done, setDone] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setDone((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const open = ALL_TASKS.filter((t) => !done.has(t.id));

  return (
    <>
      <div className="m-card">
        <div className="m-card__head">
          <h3 className="m-card__title">Tasks for you</h3>
          <span className="m-card__sub">{open.length} open</span>
          <button className="m-btn m-btn--ghost m-btn--sm" onClick={() => setDrawerOpen(true)}>
            View all
          </button>
        </div>
        <div className="m-card__body m-card__body--flush">
          {ALL_TASKS.slice(0, 5).map((t) => (
            <div key={t.id} className="m-task-item">
              <input
                type="checkbox"
                className="m-checkbox"
                checked={done.has(t.id)}
                onChange={() => toggle(t.id)}
              />
              <div className="m-task-item__body" style={{ opacity: done.has(t.id) ? 0.45 : 1 }}>
                <div className="m-task-item__title">{t.title}</div>
                <div className="m-task-item__meta">
                  <span className="m-mono">{t.id}</span> · {t.owner} · due {t.due}
                </div>
              </div>
              {t.count > 0 && <span className="m-badge">{t.count}</span>}
              {t.priority === "high" && !done.has(t.id) && (
                <span className="m-badge m-badge--warning">High</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {drawerOpen && (
        <>
          <div className="m-sheet-overlay" onClick={() => setDrawerOpen(false)} />
          <div className="m-sheet" role="dialog" aria-modal="true" aria-label="All tasks">
            <div className="m-sheet__head">
              <span className="m-sheet__title">Tasks for you</span>
              <span className="m-card__sub" style={{ marginRight: "auto" }}>{open.length} open</span>
              <button className="m-btn m-btn--ghost m-btn--icon m-btn--sm" onClick={() => setDrawerOpen(false)}>
                <XIcon size={15} />
              </button>
            </div>

            <div className="m-sheet__body" style={{ padding: 0 }}>
              {ALL_TASKS.map((t) => (
                <div
                  key={t.id}
                  className={`m-task-drawer-item${done.has(t.id) ? " m-task-drawer-item--done" : ""}`}
                >
                  <input
                    type="checkbox"
                    className="m-checkbox"
                    checked={done.has(t.id)}
                    onChange={() => toggle(t.id)}
                  />
                  <div className="m-task-drawer-item__body">
                    <div className="m-task-drawer-item__title">{t.title}</div>
                    <div className="m-task-drawer-item__meta">
                      <span className="m-mono" style={{ color: "var(--m-text-3)" }}>{t.id}</span>
                      <span className="m-task-drawer-item__dot" />
                      {t.dept}
                    </div>
                  </div>
                  <div className="m-task-drawer-item__right">
                    <div className={`m-task-drawer-item__due${t.due === "Today" ? " m-task-drawer-item__due--today" : ""}`}>
                      {t.due}
                    </div>
                    {t.priority === "high" && !done.has(t.id) && (
                      <span className="m-badge m-badge--warning" style={{ fontSize: 10 }}>High</span>
                    )}
                    {t.priority === "low" && (
                      <span className="m-badge" style={{ fontSize: 10 }}>Low</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}

// ─── Main client ──────────────────────────────────────────────────────────────

export function OverviewClient({ data }: { data: AdminOverviewData }) {
  const {
    activeSemester: sem,
    analytics,
    totals,
    submissionsLast7d,
    throughputByWindow,
    departmentLoad,
    recentActivity,
  } = data;

  const meta = sem ? semesterMeta(sem) : null;

  const deptBars = departmentLoad
    .filter((d) => d.totalStudents > 0)
    .sort((a, b) => b.totalStudents - a.totalStudents)
    .slice(0, 8)
    .map((d) => ({
      l: d.departmentCode,
      v: d.totalStudents,
      color: DEPT_COLORS[d.departmentCode] ?? "var(--m-accent)",
    }));

  return (
    <>
      {/* Page header */}
      <div className="m-page__header">
        <div className="m-page__title">
          <span className="m-page__eyebrow">
            Operations{sem && meta ? ` · ${sem.name} · Week ${meta.weekNumber} of ${meta.totalWeeks}` : ""}
          </span>
          <h1 className="m-page__h">{greeting()}, Ines.</h1>
          <p className="m-page__sub">
            All systems nominal.{" "}
            {analytics && (
              <>
                <b className="text-m-text">{analytics.openAssignmentsCount} open assignments</b>{" "}
                across {analytics.totalCourses} active sections, and FA26 registration opens after commencement.
              </>
            )}
          </p>
        </div>
        <div className="m-page__actions">
          <ExportButton />
          <PostAnnouncementButton />
          <NewCourseButton />
        </div>
      </div>

      <div className="m-page__body">
        <div className="m-stack">

          {/* semester banner */}
          {sem && meta && (
            <div className="m-card">
              <div className="m-sem-banner">
                <div className="m-sem-banner__identity">
                  <span className="m-pulse-dot" />
                  <div>
                    <div className="m-sem-banner__label">Active term</div>
                    <div className="m-sem-banner__name">{sem.name}</div>
                  </div>
                </div>
                <div className="m-sem-banner__track">
                  <div className="m-sem-banner__dates">
                    <span>{fmtDate(sem.startDate)}</span>
                    <span>Week {meta.weekNumber} of {meta.totalWeeks} · {Math.round(meta.progress * 100)}%</span>
                    <span>{fmtDate(sem.endDate)}</span>
                  </div>
                  <ProgressBar value={meta.progress} lg />
                </div>
                <div className="m-sem-banner__metrics">
                  {[
                    { label: "STUDENTS",  value: totals.students.toLocaleString()    },
                    { label: "SECTIONS",  value: totals.courses.toLocaleString()     },
                    { label: "FACULTY",   value: totals.instructors.toLocaleString() },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <div className="m-sem-banner__metric-label">{label}</div>
                      <div className="m-sem-banner__metric-value">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* stats row */}
          <div className="m-grid m-grid-4">
            <div className="m-card"><div className="m-stat">
              <div className="m-stat__label">Active enrollment</div>
              <div className="m-stat__value">{totals.students.toLocaleString()}</div>
              <div className="m-stat__delta m-stat__delta--up"><ChevronUpIcon size={12} />+1.8% vs SP25</div>
              <div className="m-stat__spark"><Spark data={[420,440,460,520,580,640,690,710,748,760,780,798]} /></div>
            </div></div>

            <div className="m-card"><div className="m-stat">
              <div className="m-stat__label">Assignments submitted (7d)</div>
              <div className="m-stat__value">{submissionsLast7d.toLocaleString()}</div>
              <div className="m-stat__delta m-stat__delta--up"><ChevronUpIcon size={12} />wk-over-wk</div>
              <div className="m-stat__spark"><Spark data={[180,210,260,288,320,360,402]} color="var(--m-success)" /></div>
            </div></div>

            <div className="m-card"><div className="m-stat">
              <div className="m-stat__label">Avg. grading turnaround</div>
              <div className="m-stat__value">38<sub>hrs</sub></div>
              <div className="m-stat__delta m-stat__delta--up"><ChevronUpIcon size={12} />−6h vs target</div>
              <div className="m-stat__spark"><Spark data={[58,54,49,46,44,42,38]} color="var(--m-info)" /></div>
            </div></div>

            <div className="m-card"><div className="m-stat">
              <div className="m-stat__label">Open petitions</div>
              <div className="m-stat__value">23</div>
              <div className="m-stat__delta m-stat__delta--down"><ChevronDownIcon size={12} />7 high-priority</div>
              <div className="m-stat__spark"><Spark data={[14,18,21,19,22,25,23]} color="var(--m-warning)" /></div>
            </div></div>
          </div>

          {/* main 2-1 grid */}
          <div className="m-grid m-grid-2-1">
            <ThroughputCard windows={throughputByWindow} submissionsLast7d={submissionsLast7d} />
            <TasksCard />
          </div>

          {/* second 2-1 grid */}
          <div className="m-grid m-grid-2-1">
            {/* enrollment by department */}
            <div className="m-card">
              <div className="m-card__head">
                <h3 className="m-card__title">Enrollment by department</h3>
                <span className="m-card__sub">{sem?.name ?? "Current semester"}</span>
                <Link href="/admin/semesters" className="m-btn m-btn--ghost m-btn--sm">
                  Compare terms
                </Link>
              </div>
              <div className="m-card__body">
                <HBarChart data={deptBars} format={(v) => v.toLocaleString()} />
              </div>
            </div>

            {/* live activity */}
            <div className="m-card">
              <div className="m-card__head">
                <h3 className="m-card__title">Live activity</h3>
                <span className="m-card__sub">real-time</span>
                <span className="m-live-badge"><span className="m-pulse-dot" />streaming</span>
              </div>
              <div className="m-card__body m-card__body--flush">
                <div className="m-feed-scroll">
                  {recentActivity.slice(0, 7).map((item) => (
                    <div key={item.id} className="m-feed-item">
                      <span className={`m-feed-item__dot m-feed-item__dot--${item.dot}`} />
                      <div className="m-feed-item__body" dangerouslySetInnerHTML={{ __html: item.body }} />
                      <span className="m-feed-item__time">{relTime(item.timestamp)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* lower row */}
          <div className="m-grid m-grid-2">
            {/* courses needing attention */}
            <div className="m-card">
              <div className="m-card__head">
                <h3 className="m-card__title">Courses needing attention</h3>
                <Link href="/admin/courses" className="m-btn m-btn--ghost m-btn--sm">
                  All courses <ArrowUpRightIcon size={12} />
                </Link>
              </div>
              <div className="m-card__body m-card__body--flush">
                <table className="m-table">
                  <thead>
                    <tr><th>Course</th><th>Ungraded</th><th>Avg. lag</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {COURSES_ATTENTION.map((r) => (
                      <tr key={r.code} className="m-table__row-link">
                        <td>
                          <div className="m-table-course">
                            <span className="m-table-course__name">{r.title}</span>
                            <span className="m-table-course__meta">{r.code} · Prof. {r.inst}</span>
                          </div>
                        </td>
                        <td className="m-mono m-num-tnum">{r.ungraded}</td>
                        <td className="m-mono">{r.lag}</td>
                        <td>
                          {r.sla ? (
                            <span className="m-badge m-badge--warning"><span className="m-badge__dot" />SLA breach</span>
                          ) : (
                            <span className="m-badge">On track</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* announcements */}
            <div className="m-card">
              <div className="m-card__head">
                <h3 className="m-card__title">Announcements</h3>
                <span className="m-card__sub">institution-wide</span>
                <PostAnnouncementButton />
              </div>
              <div className="m-card__body m-card__body--flush">
                {ANNOUNCEMENTS.map((a) => (
                  <div key={a.id} className="m-announcement">
                    <div className="m-announcement__header">
                      <span className="m-badge">{a.channel}</span>
                      <span className="m-announcement__id">{a.id}</span>
                      <span className="m-spacer" />
                      <span className="m-announcement__time">{a.time}</span>
                    </div>
                    <div className="m-announcement__title">{a.title}</div>
                    <div className="m-announcement__author">by {a.author}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
