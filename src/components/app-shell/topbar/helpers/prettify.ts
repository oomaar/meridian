import { SEGMENT_LABEL } from "../data/SEGMENT_LABEL";

export function prettify(seg: string): string {
  const decoded = decodeURIComponent(seg);
  return (
    SEGMENT_LABEL[decoded] ??
    decoded.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}
