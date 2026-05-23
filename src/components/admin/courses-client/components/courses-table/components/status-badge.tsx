import type { CourseStatus } from "@/fake-db/types/courses";

type StatusBadgeProps = { status: CourseStatus };

export function StatusBadge({ status }: StatusBadgeProps) {
  const map: Record<CourseStatus, { label: string; tone: string }> = {
    active: { label: "Active", tone: "success" },
    draft: { label: "Draft", tone: "" },
    archived: { label: "Archived", tone: "" },
    planning: { label: "Planning", tone: "" },
  };

  const { label, tone } = map[status];

  return (
    <span className={`m-badge${tone ? ` m-badge--${tone}` : ""}`}>
      {tone === "success" && <span className="m-badge__dot" />}
      {label}
    </span>
  );
}
