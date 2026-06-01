export const GRADING_SCHEMAS: {
  label: string;
  pct: number;
  color: string;
}[][] = [
  [
    { label: "Assignments", pct: 30, color: "var(--m-info)" },
    { label: "Midterm", pct: 25, color: "var(--m-accent)" },
    { label: "Final exam", pct: 35, color: "var(--m-warning)" },
    { label: "Participation", pct: 10, color: "var(--m-success)" },
  ],
  [
    { label: "Homework", pct: 40, color: "var(--m-info)" },
    { label: "Quizzes", pct: 20, color: "var(--m-accent)" },
    { label: "Midterm", pct: 20, color: "var(--m-warning)" },
    { label: "Final exam", pct: 20, color: "var(--m-success)" },
  ],
  [
    { label: "Labs", pct: 30, color: "var(--m-info)" },
    { label: "Project", pct: 35, color: "var(--m-accent)" },
    { label: "Written responses", pct: 15, color: "var(--m-warning)" },
    { label: "Participation", pct: 20, color: "var(--m-success)" },
  ],
];
