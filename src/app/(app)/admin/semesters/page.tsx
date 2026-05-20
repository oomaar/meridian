import { getAdminSemestersPage, type AdminSemesterCard } from "@/fake-db/dashboards";
import { AcademicCalendarButton, NewTermButton } from "@/components/admin/new-term-button";
import type { SemesterStatus } from "@/fake-db/types";

// ─── Status badge ─────────────────────────────────────────────────────────────

function SemStatusBadge({ status }: { status: SemesterStatus }) {
  const map: Record<SemesterStatus, { label: string; tone: string }> = {
    active:   { label: "Active",    tone: "success" },
    upcoming: { label: "Upcoming",  tone: "info" },
    planning: { label: "Planning",  tone: "" },
    past:     { label: "Archived",  tone: "" },
  };
  const { label, tone } = map[status];
  return (
    <span className={`m-badge${tone ? ` m-badge--${tone}` : ""}`}>
      {tone === "success" && <span className="m-badge__dot" />}
      {label}
    </span>
  );
}

// ─── Timeline ─────────────────────────────────────────────────────────────────

function Timeline({
  semesters,
  todayPct,
  tlLabels,
}: {
  semesters: AdminSemesterCard[];
  todayPct: number;
  tlLabels: { label: string; pct: number }[];
}) {
  const toneFor = (status: SemesterStatus) => {
    if (status === "active")   return "accent";
    if (status === "upcoming") return "info";
    if (status === "planning") return "planning";
    return "muted";
  };

  return (
    <div className="m-tl-wrap">
      {/* baseline */}
      <div className="m-tl-baseline" />

      {/* month ticks */}
      {tlLabels.map((l) => (
        <div
          key={l.label}
          className="m-tl-tick"
          style={{ left: `${l.pct}%` }}
        />
      ))}

      {/* labels */}
      {tlLabels.map((l) => (
        <div
          key={l.label + "-lbl"}
          className="m-tl-label m-mono"
          style={{ left: `${l.pct}%` }}
        >
          {l.label}
        </div>
      ))}

      {/* semester bars */}
      {semesters.map((sem) =>
        sem.tlWidth > 0 ? (
          <div
            key={sem.id}
            className={`m-tl-bar m-tl-bar--${toneFor(sem.status)}`}
            style={{ left: `${sem.tlLeft}%`, width: `${sem.tlWidth}%` }}
            title={sem.name}
          >
            {sem.status === "active" && <span className="m-pulse-dot" />}
            <span className="m-tl-bar__label">{sem.name}</span>
          </div>
        ) : null
      )}

      {/* today marker */}
      <div className="m-tl-today" style={{ left: `${todayPct}%` }}>
        <div className="m-tl-today__dot" />
        <div className="m-tl-today__lbl m-mono">Today</div>
      </div>
    </div>
  );
}

// ─── Semester card ────────────────────────────────────────────────────────────

function SemCard({ sem }: { sem: AdminSemesterCard }) {
  const pctLabel = `${Math.round(sem.progress * 100)}% complete`;

  return (
    <div className="m-card">
      <div className="m-card__head">
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: "var(--m-font-serif)",
              fontSize: 17,
              fontWeight: 500,
              lineHeight: 1.2,
            }}
          >
            {sem.name}
          </div>
          <div
            style={{
              fontSize: 12,
              color: "var(--m-text-3)",
              fontFamily: "var(--m-font-mono)",
              marginTop: 2,
            }}
          >
            {sem.dateRange}
          </div>
        </div>
        <SemStatusBadge status={sem.status} />
      </div>

      <div style={{ padding: "14px 18px" }}>
        {/* progress */}
        <div
          style={{
            fontSize: 11,
            color: "var(--m-text-3)",
            marginBottom: 6,
            fontFamily: "var(--m-font-mono)",
          }}
        >
          {pctLabel}
        </div>
        <div className="m-progress m-progress--lg">
          <div
            className="m-progress__bar"
            style={{ ["--m-bar" as string]: `${Math.round(sem.progress * 100)}%` }}
          />
        </div>

        {/* stats */}
        <div className="m-sem-stats">
          <div className="m-sem-stat">
            <span className="m-sem-stat__label">STUDENTS</span>
            <span className="m-sem-stat__value">
              {sem.stats.students.toLocaleString()}
            </span>
          </div>
          <div className="m-sem-stat">
            <span className="m-sem-stat__label">COURSES</span>
            <span className="m-sem-stat__value">
              {sem.stats.courses.toLocaleString()}
            </span>
          </div>
          <div className="m-sem-stat">
            <span className="m-sem-stat__label">INSTRUCTORS</span>
            <span className="m-sem-stat__value">
              {sem.stats.instructors.toLocaleString()}
            </span>
          </div>
        </div>

        <hr className="m-rule" style={{ margin: "14px 0" }} />

        {/* actions */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="m-btn m-btn--sm">Overview</button>
          <button className="m-btn m-btn--sm m-btn--ghost">Catalog</button>
          {sem.status === "planning" && (
            <button className="m-btn m-btn--sm m-btn--ghost">
              Roll forward course list
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminSemestersPage() {
  const { semesters, todayPct, tlLabels } = getAdminSemestersPage();

  return (
    <>
      <div className="m-page__header">
        <div className="m-page__title">
          <span className="m-page__eyebrow">Operations</span>
          <h1 className="m-page__h">Semesters</h1>
          <p className="m-page__sub">Active and upcoming academic terms.</p>
        </div>
        <div className="m-page__actions">
          <AcademicCalendarButton />
          <NewTermButton />
        </div>
      </div>

      <div className="m-page__body">
        <div className="m-stack">
          {/* Timeline card */}
          <div className="m-card">
            <div className="m-card__head">
              <div>
                <div className="m-card__title">Term timeline</div>
                <div className="m-card__sub">2025 – 2027 academic years</div>
              </div>
            </div>
            <div style={{ padding: "24px 20px 20px" }}>
              <Timeline
                semesters={semesters}
                todayPct={todayPct}
                tlLabels={tlLabels}
              />
            </div>
          </div>

          {/* Semester cards grid */}
          <div className="m-grid m-grid-2">
            {semesters.map((sem) => (
              <SemCard key={sem.id} sem={sem} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
