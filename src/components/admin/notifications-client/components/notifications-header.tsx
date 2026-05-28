import { BellIcon } from "lucide-react";

type NotificationsHeaderProps = {
  unreadCount: number;
  markAllRead(): void;
};

export function NotificationsHeader({
  markAllRead,
  unreadCount,
}: NotificationsHeaderProps) {
  return (
    <div className="m-page__header">
      <div className="m-page__title">
        <span className="m-page__eyebrow">Platform</span>
        <h1 className="m-page__h">Notifications</h1>
        <p className="m-page__sub">
          Your mentions, approvals, and system alerts.{" "}
          {unreadCount > 0 ? (
            <b style={{ color: "var(--m-text)" }}>{unreadCount} unread</b>
          ) : (
            <span>All caught up.</span>
          )}
        </p>
      </div>
      <div className="m-page__actions">
        <button
          className="m-btn"
          onClick={markAllRead}
          disabled={unreadCount === 0}
        >
          <BellIcon size={14} /> Mark all read
        </button>
      </div>
    </div>
  );
}
