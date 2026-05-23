type SubBadgeProps = {
  status: "submitted" | "graded" | "late";
};

export function SubBadge({ status }: SubBadgeProps) {
  if (status === "graded")
    return <span className="m-badge m-badge--success">Graded</span>;

  if (status === "late")
    return <span className="m-badge m-badge--warning">Late</span>;

  return <span className="m-badge">Submitted</span>;
}
