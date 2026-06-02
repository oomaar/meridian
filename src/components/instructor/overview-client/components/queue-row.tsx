import type { InstructorQueueItem } from "@/fake-db/dashboards";
import { Link } from "lucide-react";
import { STATUS_BADGE } from "../data/STATUS_BADGE";

type QueueRowProps = { item: InstructorQueueItem };

export function QueueRow({ item }: QueueRowProps) {
  return (
    <tr>
      <td>
        <div className="m-inst-queue-student">
          <div className="m-avatar m-inst-queue-avatar">
            {item.studentName
              .split(" ")
              .map((p) => p[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <span>{item.studentName}</span>
          {item.status === "flagged" && (
            <span className="m-badge m-badge--warning">flagged</span>
          )}
        </div>
      </td>
      <td className="m-mono">{item.courseCode}</td>
      <td>{item.assignmentTitle}</td>
      <td className="m-mono">
        {item.submittedLabel}
        {item.late && <span className="m-inst-queue-late"> · late</span>}
      </td>
      <td className="m-num m-mono">{item.attempt}</td>
      <td>
        <span className={STATUS_BADGE[item.status]}>{item.status}</span>
      </td>
      <td>
        <Link href="/instructor/grading" className="m-btn m-btn--sm">
          Grade
        </Link>
      </td>
    </tr>
  );
}
