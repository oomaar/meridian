import { PostAnnouncementButton } from "../../post-announcement-button";
import { ANNOUNCEMENTS } from "../data/ANNOUNCEMENTS";

export function OverviewAnnouncements() {
  return (
    <div className="m-card">
      <div className="m-card__head">
        <h3 className="m-card__title">Announcements</h3>
        <span className="m-card__sub">institution-wide</span>
        <PostAnnouncementButton />
      </div>
      <div className="m-card__body m-card__body--flush">
        {ANNOUNCEMENTS.map((a) => (
          <div key={a.id} className="m-announcement">
            <div className="m-announcement__header">
              <span className="m-badge">{a.channel}</span>
              <span className="m-announcement__id">{a.id}</span>
              <span className="m-spacer" />
              <span className="m-announcement__time">{a.time}</span>
            </div>
            <div className="m-announcement__title">{a.title}</div>
            <div className="m-announcement__author">by {a.author}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
