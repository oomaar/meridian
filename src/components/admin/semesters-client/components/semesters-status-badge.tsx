import type { SemesterStatus } from "@/fake-db";

type SemestersStatusBadgeProps = { status: SemesterStatus };

export function SemestersStatusBadge({ status }: SemestersStatusBadgeProps) {
  const map: Record<SemesterStatus, { label: string; tone: string }> = {
    active: { label: "Active", tone: "success" },
    upcoming: { label: "Upcoming", tone: "info" },
    planning: { label: "Planning", tone: "" },
    past: { label: "Archived", tone: "" },
  };

  const { label, tone } = map[status];

  return (
    <span className={`m-badge${tone ? ` m-badge--${tone}` : ""}`}>
      {tone === "success" && <span className="m-badge__dot" />}
      {label}
    </span>
  );
}
