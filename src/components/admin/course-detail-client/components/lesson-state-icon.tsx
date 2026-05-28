import { BookOpenIcon, FileTextIcon, PlayIcon, UsersIcon } from "lucide-react";

type LessonStateIconProps = {
  kind: string;
  state: string;
};

export function LessonStateIcon({ kind, state }: LessonStateIconProps) {
  const bg =
    state === "released"
      ? "var(--m-success-bg)"
      : state === "drafting"
        ? "var(--m-accent-bg)"
        : "var(--m-surface-2)";

  const color =
    state === "released"
      ? "var(--m-success)"
      : state === "drafting"
        ? "var(--m-accent)"
        : "var(--m-text-3)";

  return (
    <span className="m-lesson-icon" style={{ background: bg, color }}>
      {kind === "video" ? (
        <PlayIcon size={11} />
      ) : kind === "reading" ? (
        <BookOpenIcon size={11} />
      ) : kind === "quiz" ? (
        <FileTextIcon size={11} />
      ) : (
        <UsersIcon size={11} />
      )}
    </span>
  );
}
