import { Avatar } from "@/components/admin/course-detail-client/components/avatar";
import { StudentAnnouncementItem } from "@/fake-db/dashboards";

type AnnouncementsProps = {
  announcements: StudentAnnouncementItem[];
};

export function Announcements({ announcements }: AnnouncementsProps) {
  return (
    <div className="m-card">
      <div className="m-card__head">
        <span className="m-card__title">Announcements</span>
        <span className="m-card__sub">from your courses &amp; advisors</span>
      </div>
      {announcements.map((a, i) => (
        <div key={i} className="m-ann-row">
          <Avatar name={a.who} />
          <div>
            <div className="m-ann-row__title">{a.title}</div>
            <div className="m-ann-row__meta">
              {a.who} · <span className="m-mono">{a.course}</span>
            </div>
          </div>
          <span className="m-ann-row__time m-mono">{a.time}</span>
        </div>
      ))}
    </div>
  );
}
