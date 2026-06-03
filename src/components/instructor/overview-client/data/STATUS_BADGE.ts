import type { InstructorQueueItem } from "@/fake-db/dashboards";

export const STATUS_BADGE: Record<InstructorQueueItem["status"], string> = {
  pending: "m-badge",
  flagged: "m-badge m-badge--warning",
  "in-review": "m-badge m-badge--info",
};
