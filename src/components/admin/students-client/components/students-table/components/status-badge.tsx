import type { StudentStatus } from "@/fake-db/types/students";

type StatusBadgeProps = { status: StudentStatus };

export function StatusBadge({ status }: StatusBadgeProps) {
  const map: Record<StudentStatus, { label: string; tone: string }> = {
    active: { label: "Active", tone: "success" },
    leave: { label: "On leave", tone: "warning" },
    probation: { label: "Probation", tone: "danger" },
    graduated: { label: "Graduated", tone: "" },
    withdrawn: { label: "Withdrawn", tone: "" },
  };

  const { label, tone } = map[status];

  return (
    <span className={`m-badge${tone ? ` m-badge--${tone}` : ""}`}>
      {tone === "success" && <span className="m-badge__dot" />}
      {label}
    </span>
  );
}
