import type { AdminInstructorRow } from "@/fake-db/dashboards";
import { InstructorsTableAvatar } from "./instructors-table-avatar";
import { InstructorsTableRatingPip } from "./instructors-table-rating-pip";
import { InstructorsTableRowMenu } from "./instructors-table-row-menu";
import { InstructorsTableStatusBadge } from "./instructors-table-status-badge";
import { Dispatch, SetStateAction } from "react";

type InstructorsTableRowsProps = {
  displayed: AdminInstructorRow[];
  setDeletedIds: Dispatch<SetStateAction<Set<string>>>;
};

export function InstructorsTableRows({
  displayed,
  setDeletedIds,
}: InstructorsTableRowsProps) {
  return (
    <tbody>
      {displayed.map((inst) => (
        <tr key={inst.id} className="m-table__row-link">
          <td>
            <div className="m-student-cell">
              <InstructorsTableAvatar name={inst.fullName} />
              <div className="m-student-cell__info">
                <span className="m-student-cell__name">{inst.fullName}</span>
                <span className="m-student-cell__email">{inst.email}</span>
              </div>
            </div>
          </td>
          <td className="m-td-dim">{inst.title}</td>
          <td>
            <div className="m-dept-pill">
              <span
                className="m-dept-swatch"
                style={{ background: inst.deptColor }}
              />
              <span style={{ fontSize: "12.5px" }}>{inst.deptCode}</span>
            </div>
          </td>
          <td className="m-num">
            <InstructorsTableRatingPip rating={inst.rating} />
          </td>
          <td className="m-num m-mono">{inst.courseCount}</td>
          <td className="m-num m-mono">{inst.activeCourseCount}</td>
          <td>
            <InstructorsTableStatusBadge status={inst.status} />
          </td>
          <td className="m-mono m-td-id">{inst.hireDate}</td>
          <td onClick={(e) => e.stopPropagation()}>
            <InstructorsTableRowMenu
              onDelete={() =>
                setDeletedIds((prev) => new Set([...prev, inst.id]))
              }
            />
          </td>
        </tr>
      ))}
    </tbody>
  );
}
