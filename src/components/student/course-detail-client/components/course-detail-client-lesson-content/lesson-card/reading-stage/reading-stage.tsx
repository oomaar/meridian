import type { StudentCourseDetailLesson } from "@/fake-db/dashboards";
import { BookIcon } from "lucide-react";
import { READING_FILLER } from "./data/READING_FILLER";

type ReadingStageProps = { lesson: StudentCourseDetailLesson };

export function ReadingStage({ lesson }: ReadingStageProps) {
  return (
    <div className="m-reading-stage">
      <div className="m-reading-stage__topbar">
        <BookIcon size={13} />
        <span>{lesson.duration}</span>
        <span style={{ marginLeft: "auto" }}>
          {lesson.state === "complete"
            ? "Read"
            : lesson.state === "in-progress"
              ? "In progress"
              : "Not started"}
        </span>
      </div>
      <div className="m-reading-stage__progress-track">
        <div
          className="m-reading-stage__progress-fill"
          style={{ width: `${lesson.scrubProgress * 100}%` }}
        />
      </div>
      <div className="m-reading-stage__doc">
        <div className="m-reading-stage__doc-title">{lesson.title}</div>
        <p>{lesson.description}</p>
        <div className="m-reading-stage__section-head">Key concepts</div>
        {lesson.objectives.map((obj, i) => (
          <p key={i}>
            <strong style={{ color: "var(--m-text)", fontWeight: 500 }}>
              {obj}.
            </strong>{" "}
            {READING_FILLER[i % READING_FILLER.length]}
          </p>
        ))}
      </div>
    </div>
  );
}
