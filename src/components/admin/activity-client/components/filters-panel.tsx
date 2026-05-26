import { useEffect, useRef } from "react";
import { TIME_RANGES } from "../data/TIME_RANGES";
import { FilterId } from "../types/FilterId";
import { TimeRangeId } from "../types/TimeRangeId";
import { TYPE_FILTERS } from "./activity-client-by-type-section/data/TYPE_FILTERS";

type FiltersPanelProps = {
  typeFilter: FilterId;
  timeRange: TimeRangeId;
  counts: Record<FilterId, number>;
  onType: (v: FilterId) => void;
  onTime: (v: TimeRangeId) => void;
  onClose: () => void;
};

export function FiltersPanel({
  typeFilter,
  timeRange,
  counts,
  onType,
  onTime,
  onClose,
}: FiltersPanelProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [onClose]);

  return (
    <div ref={ref} className="m-activity-filters">
      <div className="m-activity-filters__section">
        <div className="m-activity-filters__label">Event type</div>
        {TYPE_FILTERS.map((f) => (
          <button
            key={f.id}
            className={`m-activity-filters__opt${typeFilter === f.id ? " m-activity-filters__opt--active" : ""}`}
            onClick={() => onType(f.id)}
          >
            <span className="m-activity-filters__opt-label">{f.label}</span>
            <span className="m-activity-filters__opt-count">
              {counts[f.id]}
            </span>
          </button>
        ))}
      </div>
      <div className="m-activity-filters__divider" />
      <div className="m-activity-filters__section">
        <div className="m-activity-filters__label">Time range</div>
        {TIME_RANGES.map((r) => (
          <button
            key={r.id}
            className={`m-activity-filters__opt${timeRange === r.id ? " m-activity-filters__opt--active" : ""}`}
            onClick={() => onTime(r.id)}
          >
            <span className="m-activity-filters__opt-label">{r.label}</span>
          </button>
        ))}
      </div>
      <div className="m-activity-filters__footer">
        <button
          className="m-btn m-btn--ghost m-btn--sm"
          onClick={() => {
            onType("all");
            onTime("24h");
          }}
        >
          Reset
        </button>
        <button className="m-btn m-btn--primary m-btn--sm" onClick={onClose}>
          Apply
        </button>
      </div>
    </div>
  );
}
