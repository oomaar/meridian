import type { Activity } from "@/fake-db/types/activity";
import { FilterId } from "../types/FilterId";
import { TYPE_FILTERS } from "../components/activity-client-by-type-section/data/TYPE_FILTERS";

export function computeCounts(events: Activity[]): Record<FilterId, number> {
  const counts: Record<FilterId, number> = {
    all: events.length,
    submission: 0,
    grade: 0,
    enrollment: 0,
    announce: 0,
    system: 0,
  };
  for (const ev of events) {
    for (const f of TYPE_FILTERS.slice(1)) {
      if (f.types!.includes(ev.type)) counts[f.id]++;
    }
  }
  return counts;
}
