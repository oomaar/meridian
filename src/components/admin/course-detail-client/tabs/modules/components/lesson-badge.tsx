type LessonBadgeProps = { state: string };

export function LessonBadge({ state }: LessonBadgeProps) {
  if (state === "released")
    return <span className="m-badge m-badge--success">Released</span>;

  if (state === "drafting")
    return <span className="m-badge m-badge--accent">Drafting</span>;

  if (state === "upcoming")
    return <span className="m-badge m-badge--info">Up next</span>;

  return <span className="m-badge">Scheduled</span>;
}
