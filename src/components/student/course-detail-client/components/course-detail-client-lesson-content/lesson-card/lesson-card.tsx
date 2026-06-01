import type { StudentCourseDetailLesson } from "@/fake-db/dashboards";
import { VideoStage } from "./video-stage";
import { ReadingStage } from "./reading-stage/reading-stage";
import { QuizStage } from "./quiz-stage";
import { AssignmentStage } from "./assignment-stage";

type LessonCardProps = { lesson: StudentCourseDetailLesson };

export function LessonCard({ lesson }: LessonCardProps) {
  const isVideoOrReading = lesson.kind === "video" || lesson.kind === "reading";

  return (
    <div className="m-card">
      {lesson.kind === "video" && <VideoStage lesson={lesson} />}
      {lesson.kind === "reading" && <ReadingStage lesson={lesson} />}
      {lesson.kind === "quiz" && <QuizStage lesson={lesson} />}
      {lesson.kind === "assignment" && <AssignmentStage lesson={lesson} />}

      {isVideoOrReading && (
        <div className="m-lesson-detail">
          <h2 className="m-lesson-detail__title">{lesson.title}</h2>
          <div className="m-lesson-detail__meta">
            Module {lesson.moduleIdx + 1} · {lesson.moduleTitle} · lesson{" "}
            {lesson.lessonIdx + 1} of {lesson.lessonOf}
          </div>
          {lesson.kind === "video" && (
            <>
              <p className="m-lesson-detail__desc">{lesson.description}</p>
              <h3 className="m-lesson-detail__objectives-head">
                Learning objectives
              </h3>
              <ul className="m-lesson-detail__objectives">
                {lesson.objectives.map((obj, i) => (
                  <li key={i}>{obj}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}
