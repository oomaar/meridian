import {
  ArrowUpRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  DownloadIcon,
  EllipsisIcon,
  PlusIcon,
} from "lucide-react";
import { getAdminOverview } from "@/fake-db/dashboards";
import { NOW } from "@/fake-db/seed";
import type { Semester } from "@/fake-db/types";
import { ProgressBar } from "@/components/progress-bar";
import { Spark } from "@/components/charts/spark";
import { AreaChart } from "@/components/charts/area";
import { HBarChart } from "@/components/charts/hbar";

const DEPT_COLORS: Record<string, string> = {
  CS:   "var(--m-info)",
  LIT:  "var(--m-accent)",
  BIO:  "var(--m-success)",
  ECON: "var(--m-danger)",
  ARCH: "var(--m-warning)",
  MATH: "#9a7fc4",
  PHIL: "var(--m-info)",
  ART:  "var(--m-warning)",
  CHEM: "var(--m-success)",
  POLI: "var(--m-danger)",
};

function relTime(isoTs: string): string {
  const mins = Math.floor((NOW.getTime() - new Date(isoTs).getTime()) / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const COURSES_ATTENTION = [
  { code: "CHEM-312", title: "Organic Chemistry II", inst: "Lindqvist", ungraded: 14, lag: "72h", sla: true },
  { code: "ECON-405", title: "Behavioral Economics",  inst: "Okafor",    ungraded: 18, lag: "54h", sla: true },
  { code: "BIO-211",  title: "Molecular Genetics",    inst: "Wójcik",    ungraded: 7,  lag: "41h", sla: false },
  { code: "CS-240",   title: "Distributed Systems",   inst: "Ahmadi",    ungraded: 12, lag: "36h", sla: false },
] as const;

const ANNOUNCEMENTS = [
  { id: "A-104", channel: "All faculty",  title: "Spring 2026 catalog window opens Nov 17",           time: "Yesterday, 4:12 PM", author: "Office of the Provost" },
  { id: "A-103", channel: "CS · Faculty", title: "Two new TA allocations approved for CS-240",         time: "2 days ago",         author: "Linnea Ahmadi" },
  { id: "A-102", channel: "Students · UG",title: "Reading Week updated — Nov 24–28",                   time: "3 days ago",         author: "Office of the Registrar" },
  { id: "A-101", channel: "ECON · Students", title: "Behavioral Econ symposium · Dec 3, Halsey Hall",  time: "4 days ago",         author: "Adaeze Okafor" },
] as const;

const TASKS = [
  { id: "T-2841", title: "Approve late-add petitions",           due: "Today",      count: 7,  priority: "high",   owner: "Registrar" },
  { id: "T-2839", title: "Review FA26 mid-semester evaluations", due: "Tomorrow",   count: 23, priority: "normal", owner: "Dean's office" },
  { id: "T-2836", title: "Resolve roster conflicts in CHEM-312", due: "Fri May 22", count: 3,  priority: "normal", owner: "Registrar" },
  { id: "T-2828", title: "Publish SU26 course catalog",          due: "May 28",     count: 0,  priority: "high",   owner: "Curriculum" },
  { id: "T-2820", title: "Audit FERPA disclosure requests",      due: "Jun 02",     count: 4,  priority: "low",    owner: "Compliance" },
] as const;

function semesterMeta(sem: Semester) {
  const start = new Date(sem.startDate).getTime();
  const end = new Date(sem.endDate + "T23:59:59Z").getTime();
  const elapsed = Math.max(0, NOW.getTime() - start);
  const total = end - start;
  const progress = Math.min(1, elapsed / total);
  const totalWeeks = Math.ceil(total / (7 * 86_400_000));
  const weekNumber = Math.min(
    totalWeeks,
    Math.ceil(elapsed / (7 * 86_400_000)),
  );
  return { progress, weekNumber, totalWeeks };
}

function greeting() {
  const h = NOW.getUTCHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default function AdminOverviewPage() {
  const {
    activeSemester,
    analytics,
    totals,
    submissionsLast7d,
    submissionThroughput,
    departmentLoad,
    recentActivity,
  } = getAdminOverview();
  const sem = activeSemester;
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

  const peakPt = submissionThroughput.reduce(
    (best, pt) => (pt.v > best.v ? pt : best),
    submissionThroughput[0],
  );
  const sortedVals = [...submissionThroughput].map((p) => p.v).sort((a, b) => a - b);
  const median = sortedVals[Math.floor(sortedVals.length / 2)];

  return (
    <>
      <div className="m-page__header">
        <div className="m-page__title">
          <span className="m-page__eyebrow">
            Operations
            {sem && meta
              ? ` · ${sem.name} · Week ${meta.weekNumber} of ${meta.totalWeeks}`
              : ""}
          </span>
          <h1 className="m-page__h">{greeting()}, Ines.</h1>
          <p className="m-page__sub">
            All systems nominal.{" "}
            {analytics && (
              <>
                <b className="text-m-text">
                  {analytics.openAssignmentsCount} open assignments
                </b>{" "}
                across {analytics.totalCourses} active sections, and FA26
                registration opens after commencement.
              </>
            )}
          </p>
        </div>
        <div className="m-page__actions">
          <button className="m-btn">
            <DownloadIcon size={14} /> Export
          </button>
          <button className="m-btn m-btn--primary">
            <PlusIcon size={14} /> New course
          </button>
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
                    <span>
                      Week {meta.weekNumber} of {meta.totalWeeks} ·{" "}
                      {Math.round(meta.progress * 100)}%
                    </span>
                    <span>{fmtDate(sem.endDate)}</span>
                  </div>
                  <ProgressBar value={meta.progress} lg />
                </div>

                <div className="m-sem-banner__metrics">
                  <div>
                    <div className="m-sem-banner__metric-label">STUDENTS</div>
                    <div className="m-sem-banner__metric-value">
                      {totals.students.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="m-sem-banner__metric-label">SECTIONS</div>
                    <div className="m-sem-banner__metric-value">
                      {totals.courses.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="m-sem-banner__metric-label">FACULTY</div>
                    <div className="m-sem-banner__metric-value">
                      {totals.instructors.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* stats row */}
          <div className="m-grid m-grid-4">
            <div className="m-card">
              <div className="m-stat">
                <div className="m-stat__label">Active enrollment</div>
                <div className="m-stat__value">
                  {totals.students.toLocaleString()}
                </div>
                <div className="m-stat__delta m-stat__delta--up">
                  <ChevronUpIcon size={12} />
                  +1.8% vs SP25
                </div>
                <div className="m-stat__spark">
                  <Spark
                    data={[
                      420, 440, 460, 520, 580, 640, 690, 710, 748, 760, 780,
                      798,
                    ]}
                  />
                </div>
              </div>
            </div>

            <div className="m-card">
              <div className="m-stat">
                <div className="m-stat__label">Assignments submitted (7d)</div>
                <div className="m-stat__value">
                  {submissionsLast7d.toLocaleString()}
                </div>
                <div className="m-stat__delta m-stat__delta--up">
                  <ChevronUpIcon size={12} />
                  wk-over-wk
                </div>
                <div className="m-stat__spark">
                  <Spark
                    data={[180, 210, 260, 288, 320, 360, 402]}
                    color="var(--m-success)"
                  />
                </div>
              </div>
            </div>

            <div className="m-card">
              <div className="m-stat">
                <div className="m-stat__label">Avg. grading turnaround</div>
                <div className="m-stat__value">
                  38<sub>hrs</sub>
                </div>
                <div className="m-stat__delta m-stat__delta--up">
                  <ChevronUpIcon size={12} />
                  −6h vs target
                </div>
                <div className="m-stat__spark">
                  <Spark
                    data={[58, 54, 49, 46, 44, 42, 38]}
                    color="var(--m-info)"
                  />
                </div>
              </div>
            </div>

            <div className="m-card">
              <div className="m-stat">
                <div className="m-stat__label">Open petitions</div>
                <div className="m-stat__value">23</div>
                <div className="m-stat__delta m-stat__delta--down">
                  <ChevronDownIcon size={12} />7 high-priority
                </div>
                <div className="m-stat__spark">
                  <Spark
                    data={[14, 18, 21, 19, 22, 25, 23]}
                    color="var(--m-warning)"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* main 2-1 grid */}
          <div className="m-grid m-grid-2-1">
            {/* submission throughput */}
            <div className="m-card">
              <div className="m-card__head">
                <h3 className="m-card__title">Submission throughput</h3>
                <span className="m-card__sub">
                  last 12 weeks · all departments
                </span>
                <div className="m-row" style={{ gap: 6 }}>
                  <div className="m-seg">
                    <button aria-pressed="false">7d</button>
                    <button aria-pressed="true">12w</button>
                    <button aria-pressed="false">Term</button>
                  </div>
                  <button className="m-btn m-btn--ghost m-btn--icon m-btn--sm">
                    <EllipsisIcon size={14} />
                  </button>
                </div>
              </div>
              <div className="m-card__body">
                <AreaChart data={submissionThroughput} height={200} />
                <div className="m-chart-foot">
                  <div className="m-chart-foot__stat">
                    <div className="m-chart-foot__label">Peak week</div>
                    <div className="m-chart-foot__val">
                      {peakPt.l.toUpperCase()} · {peakPt.v}
                    </div>
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
                  <button className="m-btn m-btn--ghost m-btn--sm">
                    Open report <ArrowUpRightIcon size={12} />
                  </button>
                </div>
              </div>
            </div>

            {/* tasks for you */}
            <div className="m-card">
              <div className="m-card__head">
                <h3 className="m-card__title">Tasks for you</h3>
                <span className="m-card__sub">{TASKS.length} open</span>
                <button className="m-btn m-btn--ghost m-btn--sm">
                  View all
                </button>
              </div>
              <div className="m-card__body m-card__body--flush">
                {TASKS.map((t) => (
                  <div key={t.id} className="m-task-item">
                    <input type="checkbox" />
                    <div className="m-task-item__body">
                      <div className="m-task-item__title">{t.title}</div>
                      <div className="m-task-item__meta">
                        <span className="m-mono">{t.id}</span> · {t.owner} ·
                        due {t.due}
                      </div>
                    </div>
                    {t.count > 0 && (
                      <span className="m-badge">{t.count}</span>
                    )}
                    {t.priority === "high" && (
                      <span className="m-badge m-badge--warning">High</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* second 2-1 grid */}
          <div className="m-grid m-grid-2-1">
            {/* enrollment by department */}
            <div className="m-card">
              <div className="m-card__head">
                <h3 className="m-card__title">Enrollment by department</h3>
                <span className="m-card__sub">{sem?.name ?? "Current semester"}</span>
                <button className="m-btn m-btn--ghost m-btn--sm">
                  Compare terms
                </button>
              </div>
              <div className="m-card__body">
                <HBarChart
                  data={deptBars}
                  format={(v) => v.toLocaleString()}
                />
              </div>
            </div>

            {/* live activity */}
            <div className="m-card">
              <div className="m-card__head">
                <h3 className="m-card__title">Live activity</h3>
                <span className="m-card__sub">real-time</span>
                <span className="m-live-badge">
                  <span className="m-pulse-dot" />
                  streaming
                </span>
              </div>
              <div className="m-card__body m-card__body--flush">
                <div className="m-feed-scroll">
                  {recentActivity.slice(0, 7).map((item) => (
                    <div key={item.id} className="m-feed-item">
                      <span
                        className={`m-feed-item__dot m-feed-item__dot--${item.dot}`}
                      />
                      <div
                        className="m-feed-item__body"
                        dangerouslySetInnerHTML={{ __html: item.body }}
                      />
                      <span className="m-feed-item__time">
                        {relTime(item.timestamp)}
                      </span>
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
                <button className="m-btn m-btn--ghost m-btn--sm">
                  All courses <ArrowUpRightIcon size={12} />
                </button>
              </div>
              <div className="m-card__body m-card__body--flush">
                <table className="m-table">
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Ungraded</th>
                      <th>Avg. lag</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COURSES_ATTENTION.map((r) => (
                      <tr key={r.code} className="m-table__row-link">
                        <td>
                          <div className="m-table-course">
                            <span className="m-table-course__name">
                              {r.title}
                            </span>
                            <span className="m-table-course__meta">
                              {r.code} · Prof. {r.inst}
                            </span>
                          </div>
                        </td>
                        <td className="m-mono m-num-tnum">{r.ungraded}</td>
                        <td className="m-mono">{r.lag}</td>
                        <td>
                          {r.sla ? (
                            <span className="m-badge m-badge--warning">
                              <span className="m-badge__dot" />
                              SLA breach
                            </span>
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
                <button className="m-btn m-btn--ghost m-btn--sm">
                  <PlusIcon size={12} /> Post
                </button>
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
