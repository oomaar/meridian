"use client";

import { useState } from "react";
import type { Activity } from "@/fake-db/types/activity";
import { FilterId } from "./types/FilterId";
import { computeCounts } from "./helpers/computeCounts";
import { filterEvents } from "./helpers/filterEvents";
import { TimeRangeId } from "./types/TimeRangeId";
import { ActivityClientNotificationRules } from "./components/activity-client-notification-rules/activity-client-notification-rules";
import { ActivityClientByTypeSection } from "./components/activity-client-by-type-section/activity-client-by-type-section";
import { ActivityClientHeader } from "./components/activity-client-header";
import { ActivityClientEventStreamSection } from "./components/activity-client-event-stream-section";

type ActivityClientProps = { events: Activity[] };

export function ActivityClient({ events }: ActivityClientProps) {
  const [typeFilter, setTypeFilter] = useState<FilterId>("all");
  const [timeRange, setTimeRange] = useState<TimeRangeId>("24h");

  const counts = computeCounts(events);
  const filtered = filterEvents(events, typeFilter, timeRange);
  const hasFilters = typeFilter !== "all" || timeRange !== "24h";

  return (
    <>
      <ActivityClientHeader
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        hasFilters={hasFilters}
        counts={counts}
      />
      <div className="m-page__body">
        <div className="m-grid m-grid-2-1">
          <ActivityClientEventStreamSection
            filtered={filtered}
            hasFilters={hasFilters}
          />
          {/* Right column */}
          <div className="m-stack">
            <ActivityClientByTypeSection
              typeFilter={typeFilter}
              setTypeFilter={setTypeFilter}
              counts={counts}
            />
            <ActivityClientNotificationRules />
          </div>
        </div>
      </div>
    </>
  );
}
