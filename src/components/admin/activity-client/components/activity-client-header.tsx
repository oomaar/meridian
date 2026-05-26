"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { ExportButton } from "@/components/export-button";
import { FilterIcon } from "lucide-react";
import { FiltersPanel } from "./filters-panel";
import type { TimeRangeId } from "../types/TimeRangeId";
import type { FilterId } from "../types/FilterId";

type ActivityClientHeaderProps = {
  typeFilter: FilterId;
  setTypeFilter: Dispatch<SetStateAction<FilterId>>;
  timeRange: TimeRangeId;
  setTimeRange: Dispatch<SetStateAction<TimeRangeId>>;
  hasFilters: boolean;
  counts: Record<FilterId, number>;
};

export function ActivityClientHeader({
  typeFilter,
  setTypeFilter,
  timeRange,
  setTimeRange,
  hasFilters,
  counts,
}: ActivityClientHeaderProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <div className="m-page__header">
      <div className="m-page__title">
        <span className="m-page__eyebrow">Operations</span>
        <h1 className="m-page__h">Activity</h1>
        <p className="m-page__sub">
          Real-time stream of operational events across the platform. Last 24
          hours.
        </p>
      </div>
      <div className="m-page__actions">
        <ExportButton title="Export audit log" />
        <div style={{ position: "relative" }}>
          <button
            className={`m-btn${hasFilters ? " m-btn--primary" : ""}`}
            onClick={() => setFiltersOpen((p) => !p)}
          >
            <FilterIcon size={14} />
            Filters
            {hasFilters && (
              <span className="m-activity-filter-badge">
                {(typeFilter !== "all" ? 1 : 0) + (timeRange !== "24h" ? 1 : 0)}
              </span>
            )}
          </button>
          {filtersOpen && (
            <FiltersPanel
              typeFilter={typeFilter}
              timeRange={timeRange}
              counts={counts}
              onType={setTypeFilter}
              onTime={setTimeRange}
              onClose={() => setFiltersOpen(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
