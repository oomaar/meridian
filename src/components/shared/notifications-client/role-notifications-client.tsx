"use client";

import { useState } from "react";
import type { Notification } from "@/fake-db/types";
import { NotificationsInbox } from "@/components/admin/notifications-client/components/notifications-inbox";
import { BellIcon, BellOffIcon, CheckCheckIcon, MailIcon, SmartphoneIcon } from "lucide-react";
import { KIND_META } from "@/components/admin/notifications-client/data/KIND_META";

type Props = {
  notifications: Notification[];
  role: "student" | "instructor";
};

export function RoleNotificationsClient({ notifications, role }: Props) {
  const [readIds, setReadIds] = useState<Set<string>>(
    () => new Set(notifications.filter((n) => n.read).map((n) => n.id)),
  );

  function isRead(id: string) { return readIds.has(id); }
  function markAllRead() { setReadIds(new Set(notifications.map((n) => n.id))); }
  function markRead(id: string) { setReadIds((prev) => new Set([...prev, id])); }

  const unreadCount = notifications.filter((n) => !isRead(n.id)).length;

  const byKind = {
    system: notifications.filter((n) => n.kind === "system").length,
    mention: notifications.filter((n) => n.kind === "mention").length,
    approval: notifications.filter((n) => n.kind === "approval").length,
  };

  const eyebrow = role === "student" ? "Learning" : "Teaching";

  return (
    <>
      <div className="m-page__header">
        <div className="m-page__title">
          <span className="m-page__eyebrow">{eyebrow}</span>
          <h1 className="m-page__h">Notifications</h1>
          <p className="m-page__sub">
            {unreadCount > 0 ? (
              <><b>{unreadCount} unread</b> · {notifications.length} total</>
            ) : (
              "All caught up."
            )}
          </p>
        </div>
        <div className="m-page__actions">
          <button className="m-btn" onClick={markAllRead} disabled={unreadCount === 0}>
            <CheckCheckIcon size={14} /> Mark all read
          </button>
        </div>
      </div>

      <div className="m-page__body">
        <div className="m-notif-layout">
          <div className="m-notif-main">
            <NotificationsInbox
              markRead={markRead}
              notifications={notifications}
              unreadCount={unreadCount}
              isRead={isRead}
            />
          </div>

          <div className="m-notif-side">
            {/* Summary */}
            <div className="m-card">
              <div className="m-card__head">
                <div className="m-card__title">Summary</div>
              </div>
              <div className="m-card__body">
                <div className="m-notif-summary">
                  <div className="m-notif-summary__row">
                    <span className="m-notif-summary__dot m-notif-summary__dot--unread" />
                    <span className="m-notif-summary__label">Unread</span>
                    <span className="m-notif-summary__val">{unreadCount}</span>
                  </div>
                  <div className="m-notif-summary__row">
                    <span className="m-notif-summary__dot m-notif-summary__dot--read" />
                    <span className="m-notif-summary__label">Read</span>
                    <span className="m-notif-summary__val">{notifications.length - unreadCount}</span>
                  </div>
                  <div className="m-notif-summary__divider" />
                  {(["system", "mention", "approval"] as const).map((kind) => (
                    <div key={kind} className="m-notif-summary__row">
                      <span className={`m-notif-summary__dot m-notif-summary__dot--${KIND_META[kind].dot}`} />
                      <span className="m-notif-summary__label">{KIND_META[kind].title}</span>
                      <span className="m-notif-summary__val">{byKind[kind]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Delivery channels */}
            <div className="m-card">
              <div className="m-card__head">
                <div className="m-card__title">Delivery</div>
              </div>
              <div className="m-card__body">
                <div className="m-notif-channels">
                  {[
                    { icon: BellIcon, label: "In-app", active: true },
                    { icon: MailIcon, label: "Email", active: true },
                    { icon: SmartphoneIcon, label: "Mobile push", active: false },
                  ].map(({ icon: Icon, label, active }) => (
                    <div key={label} className="m-notif-channel">
                      <div className="m-notif-channel__icon">
                        <Icon size={14} />
                      </div>
                      <span className="m-notif-channel__label">{label}</span>
                      <span className={`m-badge ${active ? "m-badge--success" : ""}`}>
                        {active ? "On" : "Off"}
                      </span>
                    </div>
                  ))}
                </div>
                <a href={`/${role}/settings`} className="m-notif-channel__link">
                  Manage in Settings →
                </a>
              </div>
            </div>

            {/* Do not disturb */}
            <div className="m-card">
              <div className="m-card__head">
                <div className="m-card__title">Do not disturb</div>
                <BellOffIcon size={14} className="m-notif-dnd-icon" />
              </div>
              <div className="m-card__body">
                <p className="m-notif-dnd-desc">Pause all notifications for a set period.</p>
                <div className="m-notif-dnd-actions">
                  {["1 hour", "4 hours", "Until tomorrow"].map((opt) => (
                    <button key={opt} className="m-btn m-btn--ghost m-btn--sm">{opt}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
