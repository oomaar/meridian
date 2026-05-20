import { DownloadIcon, FilterIcon, PlusIcon, ZapIcon } from "lucide-react";
import { getAdminActivityPage } from "@/fake-db/dashboards";
import { NOW } from "@/fake-db/seed";

const TYPE_FILTERS = [
  { id: "all",        label: "All events",    count: 412 },
  { id: "submission", label: "Submissions",   count: 168 },
  { id: "grade",      label: "Grades",        count: 88 },
  { id: "enrollment", label: "Enrollment",    count: 42 },
  { id: "announce",   label: "Announcements", count: 24 },
  { id: "system",     label: "System",        count: 90 },
];

const NOTIF_RULES = [
  "Late grading SLA breach — Email Dean's office",
  "Probation review trigger — Notify advisor",
  "Drop request — Notify instructor and advisor",
];

function relTime(isoTs: string): string {
  const mins = Math.floor((NOW.getTime() - new Date(isoTs).getTime()) / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function AdminActivityPage() {
  const { events } = getAdminActivityPage();

  return (
    <>
      <div className="m-page__header">
        <div className="m-page__title">
          <span className="m-page__eyebrow">Operations</span>
          <h1 className="m-page__h">Activity</h1>
          <p className="m-page__sub">
            Real-time stream of operational events across the platform. Last 24 hours.
          </p>
        </div>
        <div className="m-page__actions">
          <button className="m-btn">
            <DownloadIcon size={14} /> Export audit log
          </button>
          <button className="m-btn">
            <FilterIcon size={14} /> Filters
          </button>
        </div>
      </div>

      <div className="m-page__body">
        <div className="m-grid m-grid-2-1">
          {/* Event stream */}
          <div className="m-card">
            <div className="m-card__head">
              <div>
                <div className="m-card__title">Event stream</div>
                <div className="m-card__sub">streaming · 1.2k events/day</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span className="m-pulse-dot" />
                <span style={{ fontSize: 12, color: "var(--m-text-3)" }}>live</span>
              </div>
            </div>
            <div className="m-card__body m-card__body--flush m-feed-scroll">
              {events.map((ev, i) => (
                <div key={ev.id} className="m-feed-item">
                  <span className={`m-feed-item__dot m-feed-item__dot--${ev.dot}`} />
                  <div>
                    <div className="m-feed-item__body">{ev.body}</div>
                    <div className="m-event-meta">
                      <span className="m-mono">evt_{(0x13d92 + i).toString(16)}</span>
                      {" · "}
                      {ev.type.replace(/_/g, " ")}
                    </div>
                  </div>
                  <span className="m-feed-item__time">{relTime(ev.timestamp)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div className="m-stack">
            {/* By type */}
            <div className="m-card">
              <div className="m-card__head">
                <div className="m-card__title">By type</div>
              </div>
              <div className="m-card__body m-card__body--flush">
                {TYPE_FILTERS.map((t) => (
                  <div key={t.id} className="m-type-row">
                    <span className="m-type-row__label">{t.label}</span>
                    <span className="m-type-row__count">{t.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Notification rules */}
            <div className="m-card">
              <div className="m-card__head">
                <div>
                  <div className="m-card__title">Notification rules</div>
                  <div className="m-card__sub">3 active</div>
                </div>
              </div>
              <div className="m-card__body">
                <div className="m-stack" style={{ gap: 10 }}>
                  {NOTIF_RULES.map((rule, i) => (
                    <div key={i} className="m-rule-item">
                      <ZapIcon size={14} className="m-rule-item__icon" />
                      <span className="m-rule-item__label">{rule}</span>
                      <span className="m-badge m-badge--success">On</span>
                    </div>
                  ))}
                  <button className="m-btn">
                    <PlusIcon size={14} /> New rule
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
