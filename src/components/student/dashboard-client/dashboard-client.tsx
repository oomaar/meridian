import type { StudentDashboardData } from "@/fake-db/dashboards";
import { CalendarIcon, PlayIcon } from "lucide-react";
import { ContinueLearning } from "./components/continue-learning";
import { MyCourses } from "./components/my-courses";
import { Announcements } from "./components/announcements";
import { Upcoming } from "./components/upcoming/upcoming";
import { Schedule } from "./components/schedule/schedule";
import { TermOverview } from "./components/term-overview";

type StudentDashboardClientProps = { data: StudentDashboardData };

export function StudentDashboardClient({ data }: StudentDashboardClientProps) {
  const {
    student,
    eyebrow,
    semesterLabel,
    subText,
    continueLearning,
    courses,
    announcements,
    deadlines,
    scheduleEvents,
    termOverview,
  } = data;

  return (
    <>
      <div className="m-page__header">
        <div className="m-page__title">
          <span className="m-page__eyebrow">{eyebrow}</span>
          <h1 className="m-page__h">Good morning, {student.firstName}.</h1>
          <p className="m-page__sub">{subText}</p>
        </div>
        <div className="m-page__actions">
          <button className="m-btn">
            <CalendarIcon size={14} /> Schedule
          </button>
          <button className="m-btn m-btn--primary">
            <PlayIcon size={14} /> Continue learning
          </button>
        </div>
      </div>

      <div className="m-page__body">
        <div className="m-grid m-grid-2-1">
          <div className="m-stack">
            <ContinueLearning continueLearning={continueLearning} />
            <MyCourses courses={courses} semesterLabel={semesterLabel} />
            <Announcements announcements={announcements} />
          </div>
          <div className="m-stack">
            <Upcoming deadlines={deadlines} />
            <Schedule scheduleEvents={scheduleEvents} />
            <TermOverview termOverview={termOverview} />
          </div>
        </div>
      </div>
    </>
  );
}
