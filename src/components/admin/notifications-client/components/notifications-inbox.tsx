import { Notification } from "@/fake-db";
import { FilterState } from "../notifications-client";
import { BellIcon } from "lucide-react";
import { KIND_META } from "../data/KIND_META";
import { relTime } from "../helpers/relTime";
import { useState } from "react";

type NotificationsInboxProps = {
  markRead(id: string): void;
  notifications: Notification[];
  unreadCount: number;
  isRead(id: string): boolean;
};

export function NotificationsInbox({
  markRead,
  notifications,
  unreadCount,
  isRead,
}: NotificationsInboxProps) {
  const [filter, setFilter] = useState<FilterState>("all");

  const visible =
    filter === "unread"
      ? notifications.filter((n) => !isRead(n.id))
      : notifications;

  return (
    <div className="m-card">
      <div className="m-card__head">
        <div>
          <div className="m-card__title">Inbox</div>
          <div className="m-card__sub">
            {filter === "unread"
              ? `${unreadCount} unread`
              : `${notifications.length} notifications`}
          </div>
        </div>
        <div className="m-seg">
          <button
            aria-pressed={filter === "all"}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            aria-pressed={filter === "unread"}
            onClick={() => setFilter("unread")}
            className={"flex items-center gap-1"}
          >
            Unread
            {unreadCount > 0 && (
              <span className="m-notif-seg-count">{unreadCount}</span>
            )}
          </button>
        </div>
      </div>
      <div className="m-card__body m-card__body--flush m-card__body--feed">
        {visible.length === 0 ? (
          <div className="m-notif-empty">
            <BellIcon size={22} />
            <span>No unread notifications</span>
          </div>
        ) : (
          visible.map((n) => {
            const meta = KIND_META[n.kind];
            const read = isRead(n.id);
            return (
              <div
                key={n.id}
                className={`m-notif-item${!read ? " m-notif-item--unread" : ""}`}
                onClick={() => !read && markRead(n.id)}
                style={{ cursor: read ? "default" : "pointer" }}
              >
                <span
                  className={`m-notif-item__dot m-notif-item__dot--${read ? "default" : meta.dot}`}
                />
                <div>
                  <div className="m-notif-item__title">{meta.title}</div>
                  <div className="m-notif-item__body">{n.body}</div>
                </div>
                <span className="m-notif-item__time">
                  {relTime(n.timestamp)}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
