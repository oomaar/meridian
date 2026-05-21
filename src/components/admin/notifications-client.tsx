"use client";

import { useState } from "react";
import {
  BellIcon,
  MailIcon,
  MessageSquareIcon,
  SmartphoneIcon,
} from "lucide-react";
import type { Notification, NotificationKind } from "@/fake-db/types";
import { NOW } from "@/fake-db/seed";

// ─── Static config ────────────────────────────────────────────────────────────

const KIND_META: Record<
  NotificationKind,
  { title: string; dot: "accent" | "warning" | "info" }
> = {
  mention: { title: "Mention", dot: "accent" },
  approval: { title: "Approval requested", dot: "warning" },
  system: { title: "System", dot: "info" },
};

const CHANNELS = [
  { icon: MailIcon, label: "Email", sub: "oabdelfattah@first.tech" },
  {
    icon: SmartphoneIcon,
    label: "Push notifications",
    sub: "Enabled on 2 devices",
  },
  { icon: MessageSquareIcon, label: "In-app", sub: "Always on" },
];

const THRESHOLDS = [
  { label: "SLA breach", value: "> 48h grading lag", tone: "danger" },
  { label: "Enrollment spike", value: "> 10% change in 24h", tone: "warning" },
  { label: "Failed system jobs", value: "> 3 consecutive", tone: "warning" },
  { label: "Unread mentions", value: "> 5 pending", tone: "default" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function relTime(isoTs: string): string {
  const mins = Math.floor((NOW.getTime() - new Date(isoTs).getTime()) / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ─── Main client ──────────────────────────────────────────────────────────────

export function NotificationsClient({
  notifications,
}: {
  notifications: Notification[];
}) {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [readIds, setReadIds] = useState<Set<string>>(
    () => new Set(notifications.filter((n) => n.read).map((n) => n.id)),
  );

  function isRead(id: string) {
    return readIds.has(id);
  }

  function markAllRead() {
    setReadIds(new Set(notifications.map((n) => n.id)));
  }

  function markRead(id: string) {
    setReadIds((prev) => new Set([...prev, id]));
  }

  const unreadCount = notifications.filter((n) => !isRead(n.id)).length;
  const visible =
    filter === "unread"
      ? notifications.filter((n) => !isRead(n.id))
      : notifications;

  return (
    <>
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

      <div className="m-page__body">
        <div className="m-grid m-grid-2-1">
          {/* Inbox */}
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

          {/* Right column */}
          <div className="m-stack">
            {/* Channels */}
            <div className="m-card">
              <div className="m-card__head">
                <div>
                  <div className="m-card__title">Channels</div>
                  <div className="m-card__sub">Delivery preferences</div>
                </div>
              </div>
              <div className="m-card__body">
                {CHANNELS.map((ch) => (
                  <div key={ch.label} className="m-pref-row">
                    <ch.icon
                      size={15}
                      style={{ color: "var(--m-text-3)", flexShrink: 0 }}
                    />
                    <div className="m-pref-row__info">
                      <div className="m-pref-row__label">{ch.label}</div>
                      <div className="m-pref-row__sub">{ch.sub}</div>
                    </div>
                    <span className="m-badge m-badge--success">On</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Alert thresholds */}
            <div className="m-card">
              <div className="m-card__head">
                <div>
                  <div className="m-card__title">Alert thresholds</div>
                  <div className="m-card__sub">Triggers that notify you</div>
                </div>
              </div>
              <div className="m-card__body">
                <table className="m-table">
                  <thead>
                    <tr>
                      <th>Alert</th>
                      <th>Condition</th>
                    </tr>
                  </thead>
                  <tbody>
                    {THRESHOLDS.map((t) => (
                      <tr key={t.label}>
                        <td style={{ fontWeight: 500 }}>{t.label}</td>
                        <td>
                          <span
                            className={`m-badge${t.tone !== "default" ? ` m-badge--${t.tone}` : ""}`}
                          >
                            {t.value}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
