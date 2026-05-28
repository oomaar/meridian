import { truncateString } from "@/lib/utils";
import { StudentTableRowsAvatar } from "./student-table-rows-avatar";
import { StudentsTableRowsStatusBadge } from "./students-table-rows-status-badge";
import { EllipsisIcon } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import type { AdminStudentRow } from "@/fake-db/dashboards";

type StudentsTableRowsProps = {
  selected: Set<string>;
  setSelected: Dispatch<SetStateAction<Set<string>>>;
  displayed: AdminStudentRow[];
};

export function StudentsTableRows({
  selected,
  setSelected,
  displayed,
}: StudentsTableRowsProps) {
  function toggleOne(id: string) {
    const next = new Set(selected);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelected(next);
  }

  return (
    <tbody>
      {displayed.map((s) => (
        <tr
          key={s.id}
          className={`m-table__row-link${selected.has(s.id) ? " m-table__row--selected" : ""}`}
        >
          <td onClick={(e) => e.stopPropagation()}>
            <input
              type="checkbox"
              className="m-checkbox"
              checked={selected.has(s.id)}
              onChange={() => toggleOne(s.id)}
            />
          </td>
          <td>
            <div className="m-student-cell">
              <StudentTableRowsAvatar name={s.fullName} />
              <div className="m-student-cell__info">
                <span className="m-student-cell__name">{s.fullName}</span>
                <span className="m-student-cell__email">{s.email}</span>
              </div>
            </div>
          </td>
          <td className="m-mono m-td-id">{s.studentNumber}</td>
          <td className="m-td-dim">{truncateString(s.programName, 26)}</td>
          <td className="m-td-dim">{s.standing}</td>
          <td
            className="m-num m-mono"
            style={{
              color: s.gpa < 2.5 ? "var(--m-danger)" : "var(--m-text)",
            }}
          >
            {s.gpa.toFixed(2)}
          </td>
          <td className="m-num m-mono">{s.credits}</td>
          <td>
            <StudentsTableRowsStatusBadge status={s.status} />
          </td>
          <td className="m-td-dim">{truncateString(s.advisorName, 20)}</td>
          <td className="m-mono m-td-id">{s.lastActive}</td>
          <td>
            <button className="m-btn m-btn--ghost m-btn--icon m-btn--sm">
              <EllipsisIcon size={14} />
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  );
}
