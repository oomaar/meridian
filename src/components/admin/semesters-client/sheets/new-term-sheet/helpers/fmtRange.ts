import { format } from "date-fns";

export function fmtRange(start: Date, end: Date): string {
  return `${format(start, "MMM d")} – ${format(end, "MMM d, yyyy")}`;
}
