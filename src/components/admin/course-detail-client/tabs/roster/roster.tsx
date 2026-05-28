import type {
  AdminCourseDTO,
  AdminCourseRosterRow,
} from "@/fake-db/dashboards";
import { RosterHeader } from "./components/roster-header";
import { RosterTable } from "./components/roster-table";

type RosterProps = {
  course: AdminCourseDTO;
  roster: AdminCourseRosterRow[];
};

export function Roster({ course, roster }: RosterProps) {
  return (
    <div className="m-card">
      <RosterHeader course={course} roster={roster} />
      <RosterTable roster={roster} />
    </div>
  );
}
