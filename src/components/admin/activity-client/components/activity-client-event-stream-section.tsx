import { FilterIcon } from "lucide-react";
import { relTime } from "../helpers/relTime";
import type { Activity } from "@/fake-db";

type ActivityClientEventStreamSectionProps = {
  filtered: Activity[];
  hasFilters: boolean;
};

export function ActivityClientEventStreamSection({
  filtered,
  hasFilters,
}: ActivityClientEventStreamSectionProps) {
  return (
    <div className="m-card">
      <div className="m-card__head">
        <div>
          <div className="m-card__title">Event stream</div>
          <div className="m-card__sub">
            {filtered.length} event{filtered.length !== 1 ? "s" : ""}
            {hasFilters ? " · filtered" : " · streaming · 1.2k events/day"}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {!hasFilters && <span className="m-pulse-dot" />}
          <span style={{ fontSize: 12, color: "var(--m-text-3)" }}>
            {hasFilters ? "filtered" : "live"}
          </span>
        </div>
      </div>
      <div className="m-card__body m-card__body--flush m-card__body--feed">
        {filtered.length === 0 ? (
          <div className="m-activity-empty">
            <FilterIcon size={22} />
            <span>No events match the current filters</span>
          </div>
        ) : (
          filtered.map((ev, i) => (
            <div key={ev.id} className="m-feed-item">
              <span
                className={`m-feed-item__dot m-feed-item__dot--${ev.dot}`}
              />
              <div>
                <div
                  className="m-feed-item__body"
                  dangerouslySetInnerHTML={{ __html: ev.body }}
                />
                <div className="m-event-meta">
                  <span className="m-mono">
                    evt_{(0x13d92 + i).toString(16)}
                  </span>
                  {" · "}
                  {ev.type.replace(/_/g, " ")}
                </div>
              </div>
              <span className="m-feed-item__time">{relTime(ev.timestamp)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
