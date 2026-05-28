import { EventKind } from "../types/EventKind";

export const KIND_LABEL: Record<EventKind, string> = {
  start: "Start",
  end: "End",
  deadline: "Deadline",
  break: "Break",
  exam: "Exams",
  milestone: "Milestone",
};
