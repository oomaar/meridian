import { Activity, NOW } from "@/fake-db";
import { FilterId } from "../types/FilterId";
import { TimeRangeId } from "../types/TimeRangeId";
import { TYPE_FILTERS } from "../data/TYPE_FILTERS";
import { TIME_RANGES } from "../data/TIME_RANGES";

export function filterEvents(
  events: Activity[],
  typeFilter: FilterId,
  timeRange: TimeRangeId,
): Activity[] {
  const tf = TYPE_FILTERS.find((f) => f.id === typeFilter)!;
  const tr = TIME_RANGES.find((r) => r.id === timeRange)!;
  const cutoff = new Date(NOW.getTime() - tr.mins * 60_000);
  return events.filter((ev) => {
    const inTime = new Date(ev.timestamp) >= cutoff;
    const inType = tf.types === null || tf.types.includes(ev.type);
    return inTime && inType;
  });
}
