export const THRESHOLDS = [
  { label: "SLA breach", value: "> 48h grading lag", tone: "danger" },
  { label: "Enrollment spike", value: "> 10% change in 24h", tone: "warning" },
  { label: "Failed system jobs", value: "> 3 consecutive", tone: "warning" },
  { label: "Unread mentions", value: "> 5 pending", tone: "default" },
];
