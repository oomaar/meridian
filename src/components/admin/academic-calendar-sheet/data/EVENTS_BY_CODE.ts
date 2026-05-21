import { AcademicEvent } from "../types/AcademicEvent";

export const EVENTS_BY_CODE: Record<string, AcademicEvent[]> = {
  SP25: [
    { date: "Jan 13", label: "Spring 2025 begins", kind: "start" },
    { date: "Jan 24", label: "Last day to add/drop", kind: "deadline" },
    { date: "Mar 10", label: "Spring break", kind: "break" },
    { date: "Mar 31", label: "Withdrawal deadline", kind: "deadline" },
    { date: "Apr 28", label: "Reading week", kind: "break" },
    { date: "May 5", label: "Final examinations", kind: "exam" },
    { date: "May 22", label: "Commencement", kind: "end" },
  ],
  FA25: [
    { date: "Aug 25", label: "Fall 2025 begins", kind: "start" },
    { date: "Sep 5", label: "Last day to add/drop", kind: "deadline" },
    { date: "Oct 13", label: "Fall break", kind: "break" },
    { date: "Nov 3", label: "Withdrawal deadline", kind: "deadline" },
    { date: "Nov 27", label: "Thanksgiving recess", kind: "break" },
    { date: "Dec 8", label: "Final examinations", kind: "exam" },
    { date: "Dec 19", label: "Semester ends", kind: "end" },
  ],
  SP26: [
    { date: "Jan 12", label: "Spring 2026 begins", kind: "start" },
    { date: "Jan 23", label: "Last day to add/drop", kind: "deadline" },
    { date: "Mar 9", label: "Spring break", kind: "break" },
    { date: "Mar 30", label: "Withdrawal deadline", kind: "deadline" },
    { date: "Apr 27", label: "Reading week", kind: "break" },
    { date: "May 4", label: "Final examinations", kind: "exam" },
    { date: "May 22", label: "Commencement", kind: "end" },
  ],
  FA26: [
    { date: "Aug 24", label: "Fall 2026 begins", kind: "start" },
    { date: "Sep 4", label: "Last day to add/drop", kind: "deadline" },
    { date: "Oct 12", label: "Fall break", kind: "break" },
    { date: "Nov 2", label: "Withdrawal deadline", kind: "deadline" },
    { date: "Nov 26", label: "Thanksgiving recess", kind: "break" },
    { date: "Dec 7", label: "Final examinations", kind: "exam" },
    { date: "Dec 18", label: "Semester ends", kind: "end" },
  ],
  SP27: [
    { date: "Jan 11", label: "Spring 2027 begins", kind: "start" },
    { date: "Jan 22", label: "Last day to add/drop", kind: "deadline" },
    { date: "Mar 15", label: "Spring break (tentative)", kind: "break" },
    { date: "May 21", label: "Semester ends (tentative)", kind: "end" },
  ],
};
