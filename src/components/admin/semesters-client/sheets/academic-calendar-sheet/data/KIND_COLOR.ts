import { EventKind } from "../types/EventKind";

export const KIND_COLOR: Record<EventKind, string> = {
  start: "var(--m-success)",
  end: "var(--m-text-3)",
  deadline: "var(--m-danger)",
  break: "var(--m-info)",
  exam: "var(--m-warning)",
  milestone: "var(--m-accent)",
};
