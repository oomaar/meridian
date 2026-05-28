import type {
  AdminCourseDTO,
  AdminCourseModule,
  AdminCourseSubmission,
  AdminEngagementDTO,
  AdminTeachingTeamDTO,
} from "@/fake-db/dashboards";
import { TeachingTeam } from "./components/teaching-team";
import { SyllabusAndDescription } from "./components/syllabus-and-description";
import { AtaGlance } from "./components/ata-glance";
import { Engagement } from "./components/engagement";
import { ModulesSummary } from "./components/modules-summary";
import { RecentSubmissions } from "./components/recent-submissions";

type OverviewProps = {
  course: AdminCourseDTO;
  modules: AdminCourseModule[];
  recentSubmissions: AdminCourseSubmission[];
  completionPct: number;
  atRiskCount: number;
  engagement: AdminEngagementDTO[];
  teachingTeam: AdminTeachingTeamDTO[];
};

export function Overview({
  course,
  modules,
  recentSubmissions,
  completionPct,
  atRiskCount,
  engagement,
  teachingTeam,
}: OverviewProps) {
  return (
    <div className="m-grid m-grid-2-1">
      {/* Left column */}
      <div className="m-stack">
        <SyllabusAndDescription course={course} />
        <ModulesSummary modules={modules} />
        <RecentSubmissions
          course={course}
          recentSubmissions={recentSubmissions}
        />
      </div>

      {/* Right column */}
      <div className="m-stack">
        <AtaGlance
          course={course}
          completionPct={completionPct}
          atRiskCount={atRiskCount}
        />
        <Engagement engagement={engagement} />
        <TeachingTeam teachingTeam={teachingTeam} />
      </div>
    </div>
  );
}
