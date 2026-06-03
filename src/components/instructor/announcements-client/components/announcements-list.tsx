import type { InstructorAnnouncementItem } from "@/fake-db/dashboards";
import { EmptyState } from "@/components/shared/empty-state/empty-state";
import { Inbox } from "lucide-react";

type AnnouncementsListProps = {
  announcements: InstructorAnnouncementItem[];
  showCourse?: boolean;
};

export function AnnouncementsList({
  announcements,
  showCourse = false,
}: AnnouncementsListProps) {
  if (announcements.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        heading="Nothing sent yet"
        body="Compose your first announcement to reach your students."
        size="sm"
      />
    );
  }

  return (
    <>
      {announcements.map((a) => (
        <div key={a.id} className="m-announcement">
          <div className="m-announcement__header">
            {showCourse && (
              <span className="m-inst-dept-badge m-inst-dept-badge--muted">
                {a.courseCode.split("-")[0]}
              </span>
            )}
            {a.status === "draft" && (
              <span className="m-badge m-badge--warning">Draft</span>
            )}
            <span className="m-announcement__time">{a.postedLabel}</span>
          </div>
          <div className="m-announcement__title">{a.title}</div>
          <div className="m-announcement__author">{a.body}</div>
          <div className="m-announcement__id">
            Sent to {a.recipientCount} students
          </div>
        </div>
      ))}
    </>
  );
}
