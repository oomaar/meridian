import type { InstructorStatus } from "@/fake-db";

type InstructorStatusBadgeProps = {
  status: InstructorStatus;
};

export function InstructorStatusBadge({ status }: InstructorStatusBadgeProps) {
  const map: Record<InstructorStatus, { label: string; tone: string }> = {
    active: { label: "Active", tone: "success" },
    leave: { label: "On leave", tone: "warning" },
    retired: { label: "Retired", tone: "" },
  };

  const { label, tone } = map[status];

  return (
    <span className={`m-badge${tone ? ` m-badge--${tone}` : ""}`}>
      {tone === "success" && <span className="m-badge__dot" />}
      {label}
    </span>
  );
}
