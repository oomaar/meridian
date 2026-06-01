import type { StudentCourseDetailLesson } from "@/fake-db/dashboards";
import { PlayIcon } from "lucide-react";

type VideoStageProps = { lesson: StudentCourseDetailLesson };

export function VideoStage({ lesson }: VideoStageProps) {
  const statusLabel =
    lesson.state === "complete"
      ? "Complete"
      : lesson.state === "in-progress"
        ? "In progress"
        : "Not started";

  const statusMod =
    lesson.state === "complete"
      ? "success"
      : lesson.state === "in-progress"
        ? "accent"
        : "";

  return (
    <div className="m-video-player">
      <button className="m-video-player__play">
        <PlayIcon size={26} />
      </button>
      <div className="m-video-player__badge">
        <span className={`m-badge${statusMod ? ` m-badge--${statusMod}` : ""}`}>
          {statusLabel}
        </span>
      </div>
      <div className="m-video-player__meta">
        {lesson.id} · {lesson.duration} · {lesson.kind}
      </div>
      <div className="m-video-player__scrubber">
        <div
          className="m-video-player__fill"
          style={{ width: `${lesson.scrubProgress * 100}%` }}
        />
      </div>
    </div>
  );
}
