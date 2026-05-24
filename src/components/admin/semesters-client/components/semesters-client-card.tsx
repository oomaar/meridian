import type { AdminSemesterCard } from "@/fake-db/dashboards";
import { SemestersStatusBadge } from "./semesters-status-badge";

type SemestersClientCardProps = { sem: AdminSemesterCard };

export function SemestersClientCard({ sem }: SemestersClientCardProps) {
  return (
    <div className="m-card">
      <div className="m-card__head">
        <div className="flex-1">
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
        <SemestersStatusBadge status={sem.status} />
      </div>

      <div className="px-3.5 py-4.5">
        <div
          style={{
            fontSize: 11,
            color: "var(--m-text-3)",
            marginBottom: 6,
            fontFamily: "var(--m-font-mono)",
          }}
        >
          {Math.round(sem.progress * 100)}% complete
        </div>
        <div className="m-progress m-progress--lg">
          <div
            className="m-progress__bar"
            style={{
              ["--m-bar" as string]: `${Math.round(sem.progress * 100)}%`,
            }}
          />
        </div>

        <div className="m-sem-stats">
          {(["students", "courses", "instructors"] as const).map((k) => (
            <div key={k} className="m-sem-stat">
              <span className="m-sem-stat__label">{k.toUpperCase()}</span>
              <span className="m-sem-stat__value">
                {sem.stats[k].toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        <hr className="m-rule mx-3.5 my-0" />

        <div className="flex flex-wrap gap-2">
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
